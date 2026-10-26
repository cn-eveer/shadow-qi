'use strict';
/* ================= audio ================= */
let AC = null, sound = true, noiseBuf = null, music = true, BUS = null, REV = null, MUS = null, musTimer = null;
function initAudio() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); if (music && sound && !musTimer) musicStart(); return; }
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return;
  try {
    AC = new Ctor();
    const len = Math.floor(AC.sampleRate * 0.6);
    noiseBuf = AC.createBuffer(1, len, AC.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    // master bus: everything goes through a compressor, with a little reverb for space
    const comp = AC.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.18;
    BUS = AC.createGain(); BUS.gain.value = 0.9; BUS.connect(comp); comp.connect(AC.destination);
    REV = AC.createConvolver();
    const rl = Math.floor(AC.sampleRate * 1.7), ir = AC.createBuffer(2, rl, AC.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const c = ir.getChannelData(ch); for (let i = 0; i < rl; i++) c[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rl, 2.6); }
    REV.buffer = ir;
    const rg = AC.createGain(); rg.gain.value = 0.32; REV.connect(rg); rg.connect(BUS);
    MUS = AC.createGain(); MUS.gain.value = 0.16; MUS.connect(BUS);
    if (music && sound) musicStart();
  } catch (e) { AC = null; }
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
function sfx(n) {
  if (!sound || !AC || OP.muted) return;
  try {
    switch (n) {
      case 'swing': noise(0.12, 0.13, 700, 1.4, 'bandpass', 0, 2600); break;                                   // a whoosh that sweeps up
      case 'hit': noise(0.025, 0.4, 3500, 0.7, 'highpass'); noise(0.1, 0.32, 1000, 1); tone(150, 0.12, 'sine', 0.22, 55); break; // crack, slap, thump
      case 'hitH': noise(0.03, 0.5, 3000, 0.7, 'highpass'); noise(0.2, 0.42, 700, 0.8, 'bandpass', 0.15); tone(115, 0.26, 'sine', 0.32, 38, 0.12); tone(70, 0.3, 'triangle', 0.12, 40); break;
      case 'block': tone(1900, 0.06, 'triangle', 0.06, 1500); tone(2850, 0.05, 'triangle', 0.035, 2400); noise(0.05, 0.16, 4200, 2, 'highpass'); break;
      case 'throw': noise(0.14, 0.14, 3200, 2.5, 'bandpass', 0.05, 5200); break;
      case 'qi': tone(220, 0.35, 'sine', 0.09, 660, 0.3); tone(880, 0.3, 'triangle', 0.03, 1320, 0.4); noise(0.25, 0.06, 1500, 2, 'bandpass', 0.2); break;
      case 'beam': tone(110, 1.0, 'sawtooth', 0.08, 330, 0.25); tone(220, 1.0, 'sawtooth', 0.04, 660, 0.25); noise(1.0, 0.12, 600, 0.6, 'bandpass', 0.2, 1800); break;
      case 'clone': noise(0.22, 0.14, 900, 1.2, 'bandpass', 0.1, 2400); tone(520, 0.18, 'triangle', 0.05, 980, 0.3); break;
      case 'vanish': noise(0.28, 0.2, 2400, 0.8, 'lowpass', 0.2, 300); tone(700, 0.25, 'sine', 0.035, 180, 0.4); break;
      case 'rise': noise(0.2, 0.12, 500, 1.2, 'bandpass', 0.05, 2600); tone(280, 0.2, 'triangle', 0.07, 840); break;
      case 'ko': tone(80, 1.1, 'sine', 0.35, 32, 0.5); noise(0.7, 0.32, 380, 0.5, 'lowpass', 0.5); tone(440, 0.9, 'triangle', 0.05, 110, 0.6); break;
      case 'super': [220, 277, 330, 440].forEach((f, i) => tone(f, 0.75, 'sawtooth', 0.045, f * 2, 0.4, i * 0.03)); noise(0.7, 0.16, 400, 0.8, 'bandpass', 0.3, 5000); tone(60, 0.5, 'sine', 0.3, 30, 0.3, 0.6); break;
      case 'land': noise(0.12, 0.18, 260, 0.7, 'lowpass', 0.05); tone(85, 0.12, 'sine', 0.16, 45); break;
      case 'count': tone(660, 0.16, 'square', 0.05, 0, 0.3); tone(90, 0.18, 'sine', 0.25, 50); break; // a beep over a drum hit
      case 'go': tone(990, 0.4, 'square', 0.05, 0, 0.4); tone(1320, 0.4, 'triangle', 0.04, 0, 0.4, 0.04); noise(0.3, 0.2, 900, 0.8, 'bandpass', 0.1); tone(70, 0.4, 'sine', 0.3, 35); break;
      case 'select': tone(784, 0.12, 'triangle', 0.06, 0, 0.3); tone(1175, 0.16, 'sine', 0.04, 0, 0.3, 0.05); break;
      case 'slash': noise(0.16, 0.24, 6500, 2, 'highpass', 0.15, 2600); tone(2400, 0.4, 'sine', 0.025, 2300, 0.5); break; // the blade rings
      case 'draw': noise(0.25, 0.1, 6000, 4, 'bandpass', 0.2); tone(1800, 0.3, 'triangle', 0.03, 2600, 0.4); break;
      case 'sheath': tone(2600, 0.08, 'square', 0.04, 1800); noise(0.06, 0.12, 5000, 3, 'highpass'); break;
      case 'flame': noise(0.9, 0.2, 500, 0.6, 'lowpass', 0.2, 1400); noise(0.8, 0.07, 3000, 3, 'bandpass', 0, 0, 0.1); tone(95, 0.7, 'sawtooth', 0.04, 70); break; // roar with crackle
      case 'shot': noise(0.06, 0.5, 2600, 0.8, 'highpass', 0.1); tone(170, 0.09, 'square', 0.1, 55); noise(0.2, 0.2, 700, 1, 'bandpass', 0.3); break; // crack and echo
      case 'orb': tone(880, 0.6, 'sine', 0.05, 0, 0.5); tone(2376, 0.4, 'sine', 0.02, 0, 0.5); break; // a bell
      case 'zap': [0, 0.03, 0.06].forEach((d, i) => tone(600 + Math.random() * 1600, 0.05, 'square', 0.035, 200 + i * 80, 0.1, d)); noise(0.12, 0.12, 5000, 1, 'highpass', 0.1); break;
      case 'palm': tone(190, 0.22, 'sine', 0.16, 85, 0.2); noise(0.14, 0.2, 800, 1, 'bandpass', 0.1); break;
      case 'charge': tone(170, 0.3, 'triangle', 0.04, 340, 0.3); tone(255, 0.3, 'sine', 0.025, 510, 0.3); break;
      case 'full': tone(523, 0.15, 'triangle', 0.05, 0, 0.3); tone(784, 0.2, 'triangle', 0.05, 0, 0.3, 0.08); tone(1046, 0.3, 'sine', 0.04, 0, 0.4, 0.16); break;
      case 'break': noise(0.4, 0.32, 4500, 0.7, 'highpass', 0.3); tone(700, 0.35, 'square', 0.06, 140, 0.2); tone(1400, 0.2, 'triangle', 0.04, 500, 0.3); break; // glass shatter
    }
  } catch (e) { /* audio is optional */ }
}
// background music: a looping pentatonic koto line over taiko drums, written on the fly
const PENTA = [0, 3, 5, 7, 10];
function musicStart() {
  if (!AC || !MUS || musTimer) return;
  let step = 0, next = AC.currentTime + 0.1, bar = 0, motif = null;
  const bpm = 104, sx = 60 / bpm / 4; // sixteenth notes
  const pluck = (f, t, v) => { // a koto-like pluck: two detuned triangles, fast decay
    [1, 1.003].forEach((d, i) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = i ? 'sine' : 'triangle'; o.frequency.value = f * d;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.9);
      o.connect(g); g.connect(MUS); if (REV) { const r = AC.createGain(); r.gain.value = 0.35; g.connect(r); r.connect(REV); } o.start(t); o.stop(t + 1); });
  };
  const drum = (t, big) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(big ? 95 : 150, t); o.frequency.exponentialRampToValueAtTime(big ? 42 : 70, t + 0.25);
    g.gain.setValueAtTime(big ? 0.9 : 0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35); o.connect(g); g.connect(MUS); o.start(t); o.stop(t + 0.4); };
  const shaker = t => { const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); s.connect(f); f.connect(g); g.connect(MUS); s.start(t); s.stop(t + 0.06); };
  const newMotif = () => Array.from({ length: 16 }, (_, i) => (i % 2 === 0 || Math.random() < 0.3) && Math.random() < 0.75 ? PENTA[Math.random() * 5 | 0] + (Math.random() < 0.3 ? 12 : 0) : null);
  musTimer = setInterval(() => {
    if (!AC) return;
    while (next < AC.currentTime + 0.12) {
      const i = step % 16, fight = (game.mode === 'fight' && !game.paused) || game.mode === 'opening';
      if (i === 0) { if (!motif || bar % 4 === 0) motif = newMotif(); bar++; }
      const root = [57, 57, 53, 55][bar % 4]; // A, A, F, G
      if (motif[i] != null && (fight || i % 4 === 0)) pluck(440 * Math.pow(2, (root + motif[i] - 69) / 12), next, fight ? 0.07 : 0.05);
      if (i === 0) pluck(440 * Math.pow(2, (root - 12 - 69) / 12), next, 0.09); // bass note
      if (fight) { if (i === 0 || i === 10) drum(next, true); if (i === 4 || i === 12) drum(next, false); if (i % 2 === 1) shaker(next); }
      next += sx; step++;
    }
  }, 30);
}
function musicStop() { if (musTimer) { clearInterval(musTimer); musTimer = null; } }

