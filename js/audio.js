'use strict';
/* ================= audio ================= */
// Everything is synthesised on the fly with Web Audio: no sound files.
// Master chain: sound effects and music → compressor → limiter → speakers, with a long stereo hall reverb on a send.
let AC = null, sound = true, noiseBuf = null, music = true, BUS = null, REV = null, MUS = null, musTimer = null, SAT = null, VIB = null, CHOIR_M = null, CHOIR_S = null;
function initAudio() {
  if (AC) { if (AC.state !== 'running') AC.resume(); if (music && sound && !musTimer) musicStart(); return; }
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return;
  try {
    AC = new Ctor({ latencyHint: 'interactive' });
    if (AC.state !== 'running') AC.resume();
    const len = Math.floor(AC.sampleRate * 1.2);
    noiseBuf = AC.createBuffer(1, len, AC.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const comp = AC.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.2;
    const lim = AC.createDynamicsCompressor(); // a brick wall at the end so the big hits never clip
    lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.08;
    BUS = AC.createGain(); BUS.gain.value = 0.8; BUS.connect(comp); comp.connect(lim); lim.connect(AC.destination);
    REV = AC.createConvolver(); // a dark hall, about three seconds, different in each ear
    const rl = Math.floor(AC.sampleRate * 3), ir = AC.createBuffer(2, rl, AC.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const c = ir.getChannelData(ch); let lp = 0; for (let i = 0; i < rl; i++) { lp += ((Math.random() * 2 - 1) - lp) * (0.5 - 0.4 * i / rl); c[i] = lp * Math.pow(1 - i / rl, 2.2) * (i < 400 ? i / 400 : 1); } }
    REV.buffer = ir;
    const rg = AC.createGain(); rg.gain.value = 0.55; REV.connect(rg); rg.connect(BUS);
    SAT = AC.createWaveShaper(); const cv = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; cv[i] = Math.tanh(x * 2.4) / Math.tanh(2.4); } SAT.curve = cv; SAT.connect(BUS); // warmth for the low booms
    MUS = AC.createGain(); MUS.gain.value = 0.42; MUS.connect(BUS);
    VIB = AC.createOscillator(); VIB.frequency.value = 5.1; const vg = AC.createGain(); vg.gain.value = 11; VIB.connect(vg); VIB.start(); VIB = vg; // vibrato (in cents) shared by every choir voice
    CHOIR_M = choirBus(MUS, 0.5); CHOIR_S = choirBus(BUS, 0.6);
    if (music && sound) musicStart();
  } catch (e) { AC = null; }
}
// phones: audio only starts from a real tap, and iPhones mute Web Audio on the silent switch unless a media element plays first
let unlockEl = null;
function unlockAudio() {
  if (!sound) return;
  initAudio();
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  if (!unlockEl && IS_MOBILE) { try { unlockEl = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAAA'); unlockEl.setAttribute('playsinline', ''); unlockEl.loop = true; unlockEl.volume = 0.01; } catch (e) {} }
  if (!unlockAudio.spoke && window.speechSynthesis) { unlockAudio.spoke = true; try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {} } // (iPhones only speak after a tap has spoken once)
  if (unlockEl && unlockEl.paused) { const p = unlockEl.play(); if (p && p.catch) p.catch(() => {}); }
}
['pointerdown', 'touchend', 'click', 'keydown'].forEach(ev => window.addEventListener(ev, unlockAudio, { capture: true, passive: true }));
document.addEventListener('visibilitychange', () => { if (!AC) return; if (document.hidden) AC.suspend(); else if (sound) AC.resume(); });

// the announcer: the browser's own speech voice, slow and deep, with a boom under it
let ANN_VOICE = { en: null, ja: null };
function pickVoices() {
  if (!window.speechSynthesis) return; const vs = speechSynthesis.getVoices(); if (!vs.length) return;
  const pref = (lang, names) => vs.filter(v => v.lang && v.lang.toLowerCase().startsWith(lang)).sort((x, y) => { const sc = v => names.findIndex(n => v.name.includes(n)); const a = sc(x), b = sc(y); return (a < 0 ? 99 : a) - (b < 0 ? 99 : b); })[0] || null;
  ANN_VOICE.en = pref('en', ['Daniel', 'Google UK English Male', 'Alex', 'Fred', 'Arthur', 'Aaron', 'Male', 'Google US English']);
  ANN_VOICE.ja = pref('ja', ['Otoya', 'Hattori', 'Google 日本語', 'Kyoko']);
}
if (window.speechSynthesis) { pickVoices(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', pickVoices); }
function announce(en, ja) {
  if (!sound || !AC || OP.muted || game.mode === 'opening' || !window.speechSynthesis) return;
  try {
    const ja1 = game.lang === 'ja', u = new SpeechSynthesisUtterance(ja1 ? ja : en), v = ANN_VOICE[ja1 ? 'ja' : 'en'];
    if (v) u.voice = v; u.lang = ja1 ? 'ja-JP' : 'en-US'; u.rate = ja1 ? 0.95 : 0.82; u.pitch = 0.55; u.volume = 1;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
    boom(0.5, 90, 35, 0.6, 0, 0.4); noise(0.6, 0.08, 400, 0.6, 'lowpass', 0.5); // a rumble under the call
  } catch (e) { /* speech is optional */ }
}
// a choir: voices go through the formants of an open "aah", plus a little of the plain tone for body
function choirBus(dest, send) {
  const inp = AC.createGain(), out = AC.createGain(); out.gain.value = 1;
  [[730, 1, 6], [1090, 0.55, 7], [2440, 0.22, 8], [3300, 0.1, 9]].forEach(([f, g, q]) => { const b = AC.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = f; b.Q.value = q; const bg = AC.createGain(); bg.gain.value = g * 2.6; inp.connect(b); b.connect(bg); bg.connect(out); });
  const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; const lg = AC.createGain(); lg.gain.value = 0.35; inp.connect(lp); lp.connect(lg); lg.connect(out);
  out.connect(dest); const r = AC.createGain(); r.gain.value = send; out.connect(r); r.connect(REV);
  return inp;
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function pan(node, p) { if (!AC.createStereoPanner) return node; const s = AC.createStereoPanner(); s.pan.value = p; node.connect(s); return s; }
// one sung note: three slightly detuned saws spread across the stereo field, slow to swell, slow to fade
function choirNote(f, t, dur, vol, bus, att = 0.35) {
  [-9, 0, 9].forEach((dt, i) => {
    const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt + (Math.random() * 4 - 2); VIB.connect(o.detune);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.setValueAtTime(vol, t + Math.max(att, dur - 0.4)); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.5);
    o.connect(g); pan(g, (i - 1) * 0.6).connect(bus); o.start(t); o.stop(t + dur + 0.6);
  });
}
// one voice into the bus, with an optional reverb send
function route(node, send) {
  node.connect(BUS);
  if (send && REV) { const g = AC.createGain(); g.gain.value = send; node.connect(g); g.connect(REV); }
}
function tone(freq, dur, type, vol, to, send = 0, delay = 0, dest = null) {
  const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + Math.min(0.01, dur / 4)); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(g); if (dest) g.connect(dest); else route(g, send); o.start(t); o.stop(t + dur + 0.03);
}
function noise(dur, vol, freq, q, type, send = 0, to = 0, delay = 0, dest = null) {
  const t = AC.currentTime + delay, s = AC.createBufferSource(), fl = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = noiseBuf; fl.type = type || 'bandpass'; fl.frequency.setValueAtTime(freq, t); fl.Q.value = q || 1;
  if (to) fl.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  s.connect(fl); fl.connect(g); if (dest) g.connect(dest); else route(g, send); s.start(t); s.stop(t + dur + 0.03);
}
// a deep boom: a sine diving in pitch, pushed through the saturator so it's felt as well as heard
function boom(vol, from = 110, to = 34, dur = 0.5, delay = 0, send = 0.2) {
  const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(from, t); o.frequency.exponentialRampToValueAtTime(to, t + dur * 0.7);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(g); g.connect(SAT); if (send) { const r = AC.createGain(); r.gain.value = send; g.connect(r); r.connect(REV); } o.start(t); o.stop(t + dur + 0.05);
}
// a brass stab: low saws through a filter that snaps open and closes again
function brass(notes, vol, dur = 0.5, delay = 0, dest = null) {
  const t = AC.currentTime + delay, fl = AC.createBiquadFilter(), g = AC.createGain();
  fl.type = 'lowpass'; fl.Q.value = 2; fl.frequency.setValueAtTime(300, t); fl.frequency.exponentialRampToValueAtTime(2600, t + 0.05); fl.frequency.exponentialRampToValueAtTime(500, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  fl.connect(g); if (dest) g.connect(dest); else route(g, 0.35);
  notes.forEach(m => [-6, 6].forEach(dt => { const o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = dt; o.connect(fl); o.start(t); o.stop(t + dur + 0.05); }));
}
function sfx(n) {
  if (!sound || !AC || OP.muted) return;
  const t0 = AC.currentTime;
  try {
    switch (n) {
      case 'swing': noise(0.16, 0.16, 500, 1.6, 'bandpass', 0.05, 3200); noise(0.1, 0.06, 2000, 1, 'highpass', 0, 6000, 0.02); break; // a whoosh that sweeps up
      case 'hitL': noise(0.02, 0.32, 4000, 0.7, 'highpass'); noise(0.07, 0.26, 1200, 1); boom(0.35, 170, 70, 0.12, 0, 0); break;
      case 'hit': noise(0.025, 0.42, 3500, 0.7, 'highpass'); noise(0.1, 0.34, 1000, 1, 'bandpass', 0.08); boom(0.6, 160, 50, 0.18, 0, 0.1); break; // crack, slap, thump
      case 'hitH': noise(0.03, 0.55, 3000, 0.7, 'highpass'); noise(0.22, 0.45, 650, 0.8, 'bandpass', 0.25); boom(0.95, 120, 32, 0.5, 0, 0.3); tone(70, 0.3, 'triangle', 0.12, 40); break;
      case 'block': [1210, 1870, 2640, 3510].forEach((f, i) => tone(f, 0.18 - i * 0.03, 'sine', 0.07 - i * 0.012, f * 0.98, 0.3)); noise(0.05, 0.22, 4200, 2, 'highpass', 0.1); boom(0.25, 200, 90, 0.08, 0, 0); break; // a ringing clang
      case 'throw': noise(0.18, 0.16, 2600, 2.2, 'bandpass', 0.1, 5200); boom(0.4, 90, 40, 0.3, 0.12, 0.2); break;
      case 'qi': tone(220, 0.4, 'sine', 0.1, 660, 0.4); tone(880, 0.35, 'triangle', 0.035, 1320, 0.5); noise(0.3, 0.07, 1500, 2, 'bandpass', 0.3); boom(0.3, 80, 50, 0.3, 0, 0.2); break;
      case 'beam': tone(110, 1.0, 'sawtooth', 0.08, 330, 0.35); tone(220, 1.0, 'sawtooth', 0.04, 660, 0.35); noise(1.0, 0.14, 600, 0.6, 'bandpass', 0.3, 1800); boom(0.6, 70, 30, 0.9, 0, 0.3); break;
      case 'clone': noise(0.22, 0.14, 900, 1.2, 'bandpass', 0.2, 2400); tone(520, 0.2, 'triangle', 0.05, 980, 0.4); break;
      case 'vanish': noise(0.3, 0.22, 2400, 0.8, 'lowpass', 0.3, 300); tone(700, 0.28, 'sine', 0.04, 180, 0.5); break;
      case 'rise': noise(0.24, 0.12, 400, 1.2, 'bandpass', 0.15, 2800); tone(280, 0.22, 'triangle', 0.07, 840, 0.2); break;
      case 'ko': boom(1, 100, 26, 1.4, 0, 0.5); brass([33, 40, 45, 52], 0.22, 1.2); [45, 52, 57, 60, 64].forEach(m => choirNote(mtof(m), t0, 1.4, 0.05, CHOIR_S, 0.04)); noise(1.2, 0.3, 300, 0.5, 'lowpass', 0.6); break; // an orchestral hit
      case 'super': [57, 60, 64, 69].forEach(m => choirNote(mtof(m), t0, 1.0, 0.045, CHOIR_S, 0.25)); noise(0.8, 0.16, 300, 0.8, 'bandpass', 0.4, 6000); boom(0.9, 90, 28, 0.9, 0.55, 0.5); brass([45, 52], 0.18, 0.7, 0.55); break; // the choir swells, then the blow lands
      case 'land': noise(0.12, 0.2, 260, 0.7, 'lowpass', 0.05); boom(0.45, 95, 40, 0.18, 0, 0.05); break;
      case 'count': boom(0.8, 120, 45, 0.35, 0, 0.3); tone(880, 0.5, 'sine', 0.05, 0, 0.5); tone(1320, 0.4, 'sine', 0.02, 0, 0.5); break; // a taiko and a bell
      case 'go': brass([45, 52, 57], 0.3, 0.8); boom(1, 110, 30, 0.7, 0, 0.4); noise(1.2, 0.18, 7000, 0.5, 'highpass', 0.5); [57, 64, 69].forEach(m => choirNote(mtof(m), t0, 0.8, 0.04, CHOIR_S, 0.05)); break; // brass, crash and choir
      case 'select': tone(784, 0.25, 'triangle', 0.06, 0, 0.45); tone(1175, 0.3, 'sine', 0.04, 0, 0.5, 0.05); break;
      case 'slash': noise(0.18, 0.26, 6500, 2, 'highpass', 0.2, 2600); tone(2400, 0.5, 'sine', 0.025, 2300, 0.6); boom(0.25, 140, 60, 0.12, 0, 0); break; // the blade rings
      case 'draw': noise(0.28, 0.12, 6000, 4, 'bandpass', 0.3); tone(1800, 0.35, 'triangle', 0.03, 2600, 0.5); break;
      case 'sheath': tone(2600, 0.1, 'square', 0.04, 1800, 0.2); noise(0.06, 0.12, 5000, 3, 'highpass'); break;
      case 'flame': noise(0.9, 0.24, 500, 0.6, 'lowpass', 0.3, 1400); noise(0.8, 0.08, 3000, 3, 'bandpass', 0.1, 0, 0.1); boom(0.5, 80, 40, 0.6, 0, 0.2); break; // roar with crackle
      case 'shot': noise(0.06, 0.55, 2600, 0.8, 'highpass', 0.15); boom(0.6, 180, 50, 0.14, 0, 0); noise(0.4, 0.2, 700, 1, 'bandpass', 0.5); break; // crack and echo
      case 'orb': tone(880, 0.7, 'sine', 0.05, 0, 0.6); tone(2376, 0.5, 'sine', 0.02, 0, 0.6); tone(1320, 0.6, 'sine', 0.025, 0, 0.6, 0.04); break; // a bell
      case 'zap': [0, 0.03, 0.06].forEach((d, i) => tone(600 + Math.random() * 1600, 0.05, 'square', 0.035, 200 + i * 80, 0.15, d)); noise(0.14, 0.14, 5000, 1, 'highpass', 0.15); boom(0.3, 140, 60, 0.12, 0, 0); break;
      case 'palm': boom(0.7, 190, 60, 0.25, 0, 0.25); noise(0.16, 0.22, 800, 1, 'bandpass', 0.2); break;
      case 'charge': tone(170, 0.35, 'triangle', 0.045, 340, 0.4); tone(255, 0.35, 'sine', 0.03, 510, 0.4); break;
      case 'full': [69, 73, 76].forEach((m, i) => choirNote(mtof(m), t0 + i * 0.07, 0.6, 0.035, CHOIR_S, 0.05)); tone(1046, 0.5, 'sine', 0.04, 0, 0.6, 0.16); break;
      case 'bounce': boom(1, 130, 28, 0.7, 0, 0.45); noise(0.35, 0.4, 400, 0.6, 'lowpass', 0.4); noise(0.04, 0.4, 2500, 0.8, 'highpass', 0.1); tone(55, 0.6, 'triangle', 0.15, 30, 0.2); break; // slammed into the floor
      case 'break': noise(0.5, 0.34, 4500, 0.7, 'highpass', 0.4); tone(700, 0.35, 'square', 0.06, 140, 0.3); tone(1400, 0.25, 'triangle', 0.04, 500, 0.4); boom(0.7, 120, 35, 0.5, 0, 0.3); break; // glass shatter
    }
  } catch (e) { /* audio is optional */ }
}

// each fighter's hits sound like what they hit with: blade, fist, staff, crystal, steel, claws, bullets, a briefcase
function hitKind(a, h) {
  const lb = (h.label || '').toLowerCase(), kick = /kick|knee|heel|stomp|sweep/.test(lb);
  switch (a.key) {
    case 'ninja': return kick ? 'kick' : 'blade';
    case 'brawler': return /palm|qi|blast|beam|orb|wave/.test(lb) ? 'qi' : kick ? 'kick' : 'fist';
    case 'staff': return kick ? 'kick' : 'wood';
    case 'psychic': return 'crystal';
    case 'paladin': return /shield|bash|aegis|rampart|parry/.test(lb) ? 'shield' : 'steel';
    case 'kappa': return /water|geyser|bubble|flood|dish|plate|splash/.test(lb) ? 'water' : 'claw';
    case 'gunman': return h.proj || /shot|fan|draw|dead|noon|dance|dynamite/.test(lb) ? 'bullet' : 'whip';
    case 'salary': return a.ch.possess === 'angel' ? 'holy' : a.ch.possess === 'devil' || a.ch.possess === 'double' ? 'hell' : kick ? 'kick' : 'office';
  }
  return 'fist';
}
function hitSound(a, h, big) {
  if (!sound || !AC || OP.muted) return;
  const k = hitKind(a, h), v = big ? 1 : 0.7;
  try {
    boom(big ? 0.85 : 0.5, big ? 120 : 160, big ? 32 : 50, big ? 0.45 : 0.18, 0, big ? 0.3 : 0.1); // every hit lands with weight
    switch (k) {
      case 'blade': noise(0.12, 0.38 * v, 5200, 1.5, 'highpass', 0.2, 2400); tone(2200 + Math.random() * 400, 0.35, 'sine', 0.03 * v, 2000, 0.5); noise(0.03, 0.3 * v, 3000, 1, 'bandpass'); break; // a cutting slice and a ring
      case 'fist': noise(0.03, 0.5 * v, 2200, 0.8, 'bandpass'); noise(0.12, 0.4 * v, 500, 1, 'lowpass', 0.15); break; // a meaty smack
      case 'qi': noise(0.03, 0.35 * v, 2500, 0.8, 'bandpass'); tone(330, 0.4, 'sine', 0.08 * v, 880, 0.5); tone(660, 0.3, 'triangle', 0.03 * v, 1320, 0.5); break; // a smack and a rising hum
      case 'kick': noise(0.04, 0.45 * v, 1500, 0.9, 'bandpass'); noise(0.15, 0.35 * v, 350, 1, 'lowpass', 0.15); break; // a dull heavy thud
      case 'wood': tone(520, 0.08, 'triangle', 0.22 * v, 380, 0.25); tone(1180, 0.05, 'square', 0.05 * v, 900, 0.2); noise(0.03, 0.4 * v, 2800, 3, 'bandpass', 0.1); break; // a hollow wooden clack
      case 'crystal': [1568, 2093, 2637].forEach((f, i) => tone(f, 0.6 - i * 0.1, 'sine', 0.045 * v, 0, 0.6, i * 0.02)); noise(0.2, 0.18 * v, 6000, 1, 'highpass', 0.4, 9000); break; // shattering glass and chimes
      case 'steel': [880, 1320, 1980].forEach((f, i) => tone(f, 0.5 - i * 0.1, 'sawtooth', 0.025 * v, f * 0.97, 0.5)); noise(0.1, 0.4 * v, 4000, 1.2, 'highpass', 0.3, 1500); break; // a great blade biting
      case 'shield': [430, 690, 1050].forEach((f, i) => tone(f, 0.35 - i * 0.06, 'square', 0.04 * v, f * 0.9, 0.35)); noise(0.06, 0.4 * v, 1800, 1, 'bandpass', 0.2); break; // a clanking slam of iron
      case 'claw': [0, 0.035, 0.07].forEach(d => noise(0.07, 0.35 * v, 3500, 2, 'bandpass', 0.1, 1400, d)); break; // three rakes
      case 'water': noise(0.35, 0.35 * v, 1200, 0.7, 'lowpass', 0.3, 400); [0, 0.05, 0.11].forEach(d => tone(600 + Math.random() * 500, 0.08, 'sine', 0.06 * v, 1400, 0.3, d)); break; // a splash and droplets
      case 'bullet': noise(0.03, 0.5 * v, 3200, 0.8, 'highpass'); tone(2400, 0.18, 'sine', 0.05 * v, 900, 0.3); noise(0.1, 0.25 * v, 900, 1.2, 'bandpass', 0.2); break; // impact and a ricochet whine
      case 'whip': noise(0.04, 0.45 * v, 2600, 1, 'bandpass'); tone(720, 0.15, 'square', 0.05 * v, 400, 0.2); break; // a steel butt to the jaw
      case 'office': noise(0.05, 0.45 * v, 900, 1, 'bandpass', 0.1); tone(180, 0.12, 'square', 0.08 * v, 120); noise(0.25, 0.12 * v, 5000, 2, 'bandpass', 0.15, 3000, 0.04); break; // a briefcase thump and fluttering paper
      case 'holy': [1046, 1318, 1568].forEach((f, i) => tone(f, 0.7, 'sine', 0.04 * v, 0, 0.7, i * 0.03)); noise(0.03, 0.3 * v, 3000, 0.8, 'bandpass'); break; // bells
      case 'hell': noise(0.4, 0.35 * v, 600, 0.6, 'lowpass', 0.3, 1600); tone(90, 0.3, 'sawtooth', 0.08 * v, 50, 0.2); noise(0.03, 0.4 * v, 2500, 0.8, 'bandpass'); break; // a fiery crunch
    }
  } catch (e) { /* audio is optional */ }
}

// ---------- background music ----------
// A piano piece in A minor: a written melody over flowing left-hand arpeggios and a warm bass. In the menus it's just the piano.
// In a fight it builds with the fight itself: as the clock runs down and health runs low (and in the final round) the
// heat rises, the tempo lifts and the layers come in one by one — bass pulse, taiko, choir, a string ostinato, octave melody,
// brass and cymbals — until at full heat it climbs a whole step into its climax.
const PROG = [ // [bass note, chord] per bar: Am F C G | Am F G E
  [45, [57, 60, 64]], [41, [53, 57, 60]], [48, [55, 60, 64]], [43, [55, 59, 62]],
  [45, [57, 60, 64]], [41, [53, 57, 60]], [43, [55, 59, 62]], [40, [56, 59, 64]]];
const MELODY = [ // per bar: [sixteenth, note, length in sixteenths]
  [[0, 76, 4], [4, 72, 2], [6, 69, 2], [8, 71, 2], [10, 72, 2], [12, 76, 4]],
  [[0, 77, 6], [6, 76, 2], [8, 72, 4], [12, 69, 4]],
  [[0, 67, 2], [2, 72, 2], [4, 76, 4], [8, 79, 6], [14, 76, 2]],
  [[0, 74, 6], [6, 71, 2], [8, 67, 4], [12, 74, 4]],
  [[0, 76, 2], [2, 81, 6], [8, 79, 2], [10, 76, 2], [12, 72, 4]],
  [[0, 69, 2], [2, 72, 2], [4, 77, 4], [8, 76, 2], [10, 74, 2], [12, 72, 4]],
  [[0, 71, 4], [4, 74, 2], [6, 79, 6], [12, 77, 2], [14, 74, 2]],
  [[0, 76, 8], [8, 68, 2], [10, 71, 2], [12, 76, 4]]];
function musicHeat() { // how hot the fight is, 0 (calm) to 1 (climax)
  if (game.mode === 'opening') return 0.7;
  if (game.mode !== 'fight' || game.paused || !fighters.length) return 0;
  if (game.phase === 'intro') return 0.3;
  if (game.phase !== 'fight') return 0.15; // the round is over: let it breathe
  const [a, b] = fighters, low = 1 - Math.min(a.hp, b.hp) / 1000;
  if (game.training) return 0.35;
  const time = 1 - game.timer / (99 * 60), fin = a.wins === 1 && b.wins === 1 ? 0.2 : 0, close = Math.abs(a.hp - b.hp) < 200 && low > 0.5 ? 0.1 : 0;
  return clamp(0.35 + time * 0.3 + low * 0.45 + fin + close, 0, 1);
}
function musicStart() {
  if (!AC || !MUS || musTimer) return;
  let step = 0, next = AC.currentTime + 0.12, bar = -1, heat = 0, key = 0;
  const out = (g, send) => { g.connect(MUS); if (send) { const r = AC.createGain(); r.gain.value = send; g.connect(r); r.connect(REV); } };
  const env = (g, t, v, a, d) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(0.0008, t + d); };
  const piano = (m, t, v, len, sx) => { // a few sine partials, the upper ones fading first, and a soft hammer
    const f = mtof(m), ring = Math.max(0.6, Math.min(3.2, len * sx + 1.2)) * (m < 60 ? 1.3 : 1), p = clamp((m - 60) / 30, -0.6, 0.6);
    [[1, 1, 1], [2, 0.42, 0.6], [3, 0.18, 0.4], [4, 0.08, 0.3]].forEach(([k, a, d]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = f * k * (k > 1 ? 1.0015 : 1); env(g, t, v * a, 0.004, ring * d); o.connect(g); out(pan(g, p), 0.32); o.start(t); o.stop(t + ring * d + 0.05); });
    const h = AC.createBufferSource(), hf = AC.createBiquadFilter(), hg = AC.createGain(); h.buffer = noiseBuf; hf.type = 'lowpass'; hf.frequency.value = 1800; env(hg, t, v * 0.12, 0.001, 0.03); h.connect(hf); hf.connect(hg); out(hg, 0); h.start(t); h.stop(t + 0.04);
  };
  const bass = (m, t, v, len) => { const o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = mtof(m - 12); o2.frequency.value = mtof(m); const g2 = AC.createGain(); g2.gain.value = 0.25;
    env(g, t, v, 0.02, len); o.connect(g); o2.connect(g2); g2.connect(g); g.connect(SAT); o.start(t); o2.start(t); o.stop(t + len + 0.05); o2.stop(t + len + 0.05); };
  const taiko = (t, v, f = 48) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f * 2.5, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.25); env(g, t, v, 0.003, 0.45); o.connect(g); g.connect(SAT); const r = AC.createGain(); r.gain.value = 0.2; g.connect(r); r.connect(REV); o.start(t); o.stop(t + 0.5); };
  const snare = (t, v) => { const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 0.6; env(g, t, v, 0.003, 0.2); s.connect(f); f.connect(g); out(g, 0.35); s.start(t); s.stop(t + 0.22); };
  const strings = (m, t, v) => { const o = AC.createOscillator(), fl = AC.createBiquadFilter(), g = AC.createGain(); o.type = 'sawtooth'; o.frequency.value = mtof(m); fl.type = 'lowpass'; fl.frequency.value = 2200; env(g, t, v, 0.012, 0.18); o.connect(fl); fl.connect(g); out(pan(g, m % 2 ? -0.35 : 0.35), 0.3); o.start(t); o.stop(t + 0.2); };
  const crash = (t, v) => { const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 5500; env(g, t, v, 0.004, 1.8); s.connect(f); f.connect(g); out(g, 0.6); s.start(t); s.stop(t + 1.2); };
  musTimer = setInterval(() => {
    if (!AC || AC.state !== 'running') return;
    if (next < AC.currentTime) next = AC.currentTime + 0.05; // (after the tab was hidden)
    while (next < AC.currentTime + 0.15) {
      const i = step % 16, t = next, fight = (game.mode === 'fight' && !game.paused) || game.mode === 'opening';
      if (i === 0) { bar++; heat += (musicHeat() - heat) * (musicHeat() > heat ? 0.5 : 0.35); // the heat follows the fight, a bar at a time
        if (bar % 8 === 0) key = heat > 0.85 ? 2 : 0; } // at full heat the next phrase climbs a whole step
      const H = fight ? heat : 0, bpm = 92 + H * 30, sx = 60 / bpm / 4; // the tempo lifts with the heat
      const b8 = bar % 8, [bn0, ch0] = PROG[b8], bn = bn0 + key, chord = ch0.map(m => m + key), up = H > 0.7;
      // left hand: the chord broken into flowing eighths (sixteenths when it's hot)
      if (i % (H > 0.6 ? 1 : 2) === 0) { const pat = [bn, chord[0], chord[1], chord[2], chord[1] + 12, chord[2], chord[1], chord[0]], lh = pat[(H > 0.6 ? i : i / 2) % 8]; piano(lh, t, 0.045 + H * 0.015, 3, sx); }
      // right hand: the melody, up an octave with a harmony below it when the fight is hot
      for (const [st, m0, len] of MELODY[b8]) if (st === i) { const m = m0 + key; piano(m + (up ? 12 : 0), t, 0.075 + H * 0.02, len, sx); if (up) piano(m + 12 - (b8 === 7 ? 4 : 3), t, 0.04, len, sx); }
      if (i === 0) bass(bn, t, 0.16 + H * 0.06, sx * 16);
      if (H > 0.25 && (H > 0.55 ? i % 2 === 0 : i % 4 === 0) && i) bass(bn + (H > 0.75 && i % 8 === 6 ? 12 : 0), t, 0.09 + H * 0.05, sx * 2); // a pulse in the bass
      if (H > 0.3 && (i === 0 || i === 10)) taiko(t, 0.45 + H * 0.3);
      if (H > 0.6 && (i === 6 || i === 14)) taiko(t, 0.3 + H * 0.2, 60);
      if (H > 0.8 && bar % 4 === 3 && i >= 12) taiko(t, 0.3 + (i - 12) * 0.12, 90 - (i - 12) * 10); // a drum fill into the next phrase
      if (H > 0.4 && (i === 4 || i === 12)) snare(t, 0.05 + H * 0.1);
      if (H > 0.45 && i === 0) { chord.forEach(m => choirNote(mtof(m), t, sx * 16, 0.01 + H * 0.014, CHOIR_M, 0.6)); if (H > 0.8) chord.forEach(m => choirNote(mtof(m + 12), t, sx * 16, 0.012, CHOIR_M, 0.6)); }
      if (H > 0.6) strings(chord[[0, 1, 2, 1][i % 4]] + 12, t, 0.018 + (H - 0.6) * 0.05);
      if (H > 0.8 && i === 0) brass([bn, bn + 7], 0.06, 0.7, t - AC.currentTime, MUS);
      if (H > 0.75 && i === 0 && bar % 4 === 0) crash(t, 0.08);
      next += sx; step++;
    }
  }, 25);
}
function musicStop() { if (musTimer) { clearInterval(musTimer); musTimer = null; } }
