'use strict';
/* ================= pose selection ================= */
// a technique sped up by techSpeed (Kuro's hand signs and wind-ups) packs several logic frames into one real tick,
// so f.pose alone only ever shows where it lands, never where it passed through: true while this tick is one of those,
// so drawFighter can bridge the gap with a few extra in-between poses instead of a single snapped-to pose.
function speedBridgeActive(f) {
  const mv = f.state === 'attack' && f.move; if (!mv || !mv.speedUp) return false;
  return !f.hitConnected && (f.pre > 0 || f.mf < mv.startup) && !(mv.speedHold && mv.speedHold(f));
}
const STEADY_IDLE = { staff: true, paladin: true, psychic: true };
function idlePose(phase, key, ch) { // (a possessed salaryman stands the angel's or the devil's way)
  const c = ch || CHARS[key], s = Math.sin(globalT * 0.09 + phase), p = { ...POSES[(c && c.idle) || 'idle'] };
  if (STEADY_IDLE[c && c.key]) { // a weapon held in both hands (or upright): the whole arm rises and falls with the breath, so the weapon doesn't wave about
    p.t += s * 1.2; p.a1u += s * 2; p.a1l += s * 2; p.a2u += s * 1.6; p.a2l += s * 1.6; p.l1u += s * 1.2; p.l1l -= s * 2; p.l2u -= s * 0.8; p.l2l -= s * 2;
    return p;
  }
  p.t += s * 2; p.a1l += s * 5; p.a2l += s * 4; p.l1u += s * 1.5; p.l1l -= s * 3; p.l2u -= s * 1; p.l2l -= s * 3; // breathing: the knees give a little with each breath
  return p;
}
function walkPose(f) {
  const p = { ...POSES[f.ch.idle || 'idle'] }, s = Math.sin(f.walkPh), c = Math.cos(f.walkPh);
  const k = f.ch.hover ? 0.35 : 1; // Lyra glides more than she walks
  p.l1u = 10 + s * 24 * k; p.l2u = -10 - s * 24 * k;
  p.l1l = p.l1u - 10 - Math.max(0, c) * 22 * k; p.l2l = p.l2u - 10 - Math.max(0, -c) * 22 * k;
  p.t += 4;
  return p;
}
function movePose(f) {
  const mv = f.move, mf = f.mf, su = mv.startup, ac = mv.active;
  if (f.pre > 0 && mv.tellPre && (mv.preTotal - f.pre) < mv.tellPre) return tellPose(f, mv, mv.preTotal - f.pre); // the tell
  if (f.pre > 0 && mv.antiPre && !mv.pre) { const Wp0 = POSES[mv.wind] || POSES.idle, Ap0 = POSES[mv.pose] || POSES.idle, g0 = f.y <= 0 && !mv.air; // the wind-up added before a heavy attack
    const windF = mv.antiPre + mv.startup - strikeFrames(mv.startup), el = mv.preTotal - f.pre - (mv.tellPre || 0); if (el === 0) f.prevPose = { ...f.pose }; return windSeq(f, mv, (el + 1) / windF, anticPose(f, Wp0, Ap0, mv, g0), g0); }
  if (f.pre > 0) return lerpPose(f.prevPose, POSES[mv.prePose || f.ch.prePose || 'twinW'], Math.min(1, ((mv.pre || 1) - f.pre + 1) / 5)); // fists pulled back, gathering qi
  if (mv.poseFn) { const p = mv.poseFn(f, mf); if (p) return p; }
  const Wp = POSES[mv.wind] || POSES.idle, Ap = POSES[mv.pose] || POSES.idle;
  // every attack is animated in four beats: anticipation (pull back and sink), the strike (a fast whip),
  // the follow-through (over-extend, stepping into it) and the recovery (settle back into the fighter's own stance)
  if (su >= 900) return lerpPose(f.prevPose, anticPose(f, Wp, Ap, mv), Math.min(1, mf / 8)); // a held attack: wound up, waiting
  const grounded = f.y <= 0 && !mv.air, A = strikePose(f, Ap, Wp, mv, grounded), F = followPose(A, Wp);
  if (mv.antiPre) { if (mf <= su) { const N0 = anticPose(f, Wp, Ap, mv, grounded), sF = strikeFrames(su), windF = mv.antiPre + su - sF;
      if (mf <= su - sF) return windSeq(f, mv, (mv.antiPre + mf) / windF, N0, grounded); // still winding up
      const k = (mf - (su - sF)) / sF; f.windPhase = -1; f.animDX = f.facing * 8 * k; return lerpPose(windEnd(f, mv, N0, grounded), A, k * k); } } // the strike: fast, accelerating
  else if (mv.fired && mv.lvl && su < 900) { if (mv.fireAt == null) mv.fireAt = mf - 1; if (mf <= su) { const k = (mf - mv.fireAt) / Math.max(1, su - mv.fireAt); return lerpPose(anticPose(f, Wp, Ap, mv, grounded), A, Math.min(1, k * k)); } } // a released charge: strike from the wound-up pose
  else if (su <= 3) { if (mf <= su) return lerpPose(f.prevPose, A, mf / su); }
  else if (!mv.antiPre && !(mv.fired && mv.lvl)) {
    const aEnd = su - strikeFrames(su), N = anticPose(f, Wp, Ap, mv, grounded);
    if (mf <= aEnd) return aEnd >= 6 ? windSeq(f, mv, mf / aEnd, N, grounded) : lerpPose(f.prevPose, N, easeOutQ(mf / aEnd)); // a longer wind-up plays as a sequence
    if (mf <= su) { const k = (mf - aEnd) / Math.max(1, su - aEnd); f.windPhase = -1; if (aEnd >= 6) { f.animDX = f.facing * 8 * k; return lerpPose(windEnd(f, mv, N, grounded), A, k * k); } return lerpPose(N, A, k * k); } // accelerating into the hit
  }
  f.windPhase = -1; if (f.animDX) f.animDX *= 0.85;
  if (mf <= su + ac) return lerpPose(A, F, (mf - su) / Math.max(1, ac));
  const R = Math.max(1, mv.recovery), hold = Math.min(6, R * 0.22), tt = clamp((mf - su - ac - hold) / Math.max(1, R - hold), 0, 1); // a beat of follow-through (never longer than 6 frames), then settle over the whole recovery, so a long one never stands frozen
  return lerpPose(F, stanceBase(f, mv), easeInOutQ(tt));
}
const easeOutQ = x => 1 - (1 - x) * (1 - x), easeInOutQ = x => x < 0.5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x);
function drawReachFX(f, mv, o) { // the blow carries up to an opponent high above: a crescent of shadow (Kuro) or a column of qi (Tetsu)
  const su = mv.startup; if (f.mf < su - 1 || f.mf > su + 6 || !o) return;
  const k = clamp((f.mf - su + 1) / 4, 0, 1), fade = f.mf > su + 3 ? 1 - (f.mf - su - 3) / 4 : 1, s = f.ch.scale;
  const x0 = f.x + f.facing * 40 * s, y0 = GROUND - f.y - 140 * s, x1 = o.x, y1 = GROUND - o.y - 60 * o.ch.scale, x = lerp(x0, x1, k), y = lerp(y0, y1, k);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  if (mv.reachFX === 'ninja') { const an = Math.atan2(y1 - y0, x1 - x0); ctx.translate(x, y); ctx.rotate(an);
    ctx.fillStyle = `rgba(200,170,255,${0.8 * fade})`; ctx.beginPath(); ctx.arc(0, 0, 34, -1.3, 1.3); ctx.arc(-14, 0, 30, 1.15, -1.15, true); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = `rgba(240,235,255,${fade})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 34, -1.3, 1.3); ctx.stroke(); }
  else { const g = ctx.createLinearGradient(x0, y0, x, y); g.addColorStop(0, `rgba(125,235,255,${0.1 * fade})`); g.addColorStop(1, `rgba(200,250,255,${0.85 * fade})`);
    ctx.strokeStyle = g; ctx.lineCap = 'round'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
    ctx.fillStyle = `rgba(220,252,255,${fade})`; ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function mv0spirit(f) { const mv = f.move; return f.key === 'ninja' && f.state === 'attack' && mv && KURO_SIGNS[mv.id] && f.pre > 0 && mv.tellPre && (mv.preTotal - f.pre) < mv.tellPre + 6; }
const SPIRIT_FADE = 90; // frames the spirit takes to fade away (a second and a half), drifting up like smoke
function drawSpirit(f) { // the spirit of the seal rises behind him in glowing brush lines
  const sp = f.spirit, sg = sp.sg, el = game.frame - sp.t0, k = Math.min(1, el / sp.rise);
  let fade = el <= sp.hold ? 1 : 1 - (el - sp.hold) / SPIRIT_FADE;
  if (sp.broken) fade = Math.min(fade, 1 - (game.frame - sp.broken) / 14); // countered: the seal breaks and is gone in a moment
  if (fade <= 0 || el < 0) { f.spirit = null; return; }
  const fp = el <= sp.hold ? 0 : (el - sp.hold) / SPIRIT_FADE; // how far it has faded
  for (const [dy, al] of fp > 0 ? [[-26 * fp, 0.35], [-52 * fp, 0.18]] : []) drawSpiritAt(f, sp, sg, k, Math.min(1, k * 1.3) * fade * 0.85 * al, dy); // the trail it leaves as it dissolves upward
  const a = Math.min(1, k * 1.3) * fade * 0.85;
  if (sp.broken) { ctx.save(); ctx.translate(Math.sin(globalT * 2.7) * 4, 0); drawSpiritAt(f, sp, sg, k, a, 0); ctx.restore(); } else // (breaking: it shudders as it fades)
  drawSpiritAt(f, sp, sg, k, a, 0);
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 2) * fade; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; // the seal's kanji and name, where he cast it
  const ty = sp.hy - 14 * fp; ctx.font = `bold 26px 'Noto Serif JP', 'Hiragino Mincho ProN', serif`; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(10,8,20,.85)'; ctx.fillStyle = `rgb(${sg.col})`;
  ctx.strokeText(sg.kanji, sp.x, ty); ctx.fillText(sg.kanji, sp.x, ty);
  ctx.font = "700 11px 'Rajdhani', 'Segoe UI', system-ui, sans-serif"; ctx.lineWidth = 3; ctx.strokeText(L(sg.en, sg.ja), sp.x, ty - 28); ctx.fillStyle = '#ffffff'; ctx.fillText(L(sg.en, sg.ja), sp.x, ty - 28);
  ctx.restore();
}
function drawSpiritAt(f, sp, sg, k, a, dy) {
  if (a <= 0.01) return; const t = globalT;
  ctx.save(); ctx.translate(sp.x, sp.y - 10 * k + dy); ctx.scale(sp.dir * (0.85 + 0.25 * k), 0.85 + 0.25 * k);
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const col = sg.col, line = (w, al) => { ctx.strokeStyle = `rgba(${col},${al * a})`; ctx.lineWidth = w; };
  const glowStroke = path => { line(9, 0.18); path(); ctx.stroke(); line(3.2, 0.9); path(); ctx.stroke(); };
  const halo = ctx.createRadialGradient(0, 0, 10, 0, 0, 130); halo.addColorStop(0, `rgba(${col},${0.22 * a})`); halo.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, 130, 0, Math.PI * 2); ctx.fill();
  if (sg.animal === 'dragon') { // a long body winding up behind him, horned head over his shoulder
    const pt = u => [-95 + 170 * u, 55 - 120 * u + 26 * Math.sin(u * 7 + t * 0.12)];
    for (let i = 0; i < 26; i++) { const u = i / 25, [x, y] = pt(u), r = 4 + 9 * Math.sin(Math.PI * Math.min(1, u * 1.15)); ctx.strokeStyle = `rgba(${col},${0.75 * a})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); if (i % 3 === 0) { ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x - 4, y - r - 8); ctx.stroke(); } }
    const [hx, hy] = pt(1); glowStroke(() => { ctx.beginPath(); ctx.ellipse(hx + 8, hy, 18, 11, -0.3, 0, Math.PI * 2); ctx.moveTo(hx + 2, hy - 9); ctx.lineTo(hx - 10, hy - 30); ctx.moveTo(hx + 10, hy - 10); ctx.lineTo(hx + 4, hy - 32); ctx.moveTo(hx + 24, hy + 4); ctx.quadraticCurveTo(hx + 50, hy + 10, hx + 56, hy - 6); ctx.moveTo(hx + 22, hy + 8); ctx.quadraticCurveTo(hx + 44, hy + 26, hx + 40, hy + 34); });
    ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.arc(hx + 12, hy - 3, 2.5, 0, Math.PI * 2); ctx.fill();
  } else if (sg.animal === 'tiger') { // a great tiger's face, crackling
    glowStroke(() => { ctx.beginPath(); ctx.ellipse(0, 0, 50, 44, 0, 0, Math.PI * 2); ctx.moveTo(-40, -28); ctx.lineTo(-46, -58); ctx.lineTo(-20, -40); ctx.moveTo(40, -28); ctx.lineTo(46, -58); ctx.lineTo(20, -40);
      ctx.moveTo(-28, -6); ctx.lineTo(-10, -2); ctx.moveTo(28, -6); ctx.lineTo(10, -2); ctx.moveTo(-7, 12); ctx.lineTo(7, 12); ctx.lineTo(0, 20); ctx.closePath(); ctx.moveTo(0, 20); ctx.lineTo(0, 27); ctx.moveTo(-14, 30); ctx.quadraticCurveTo(0, 38, 14, 30);
      ctx.moveTo(-10, 27); ctx.lineTo(-8, 36); ctx.moveTo(10, 27); ctx.lineTo(8, 36); });
    line(4, 0.8); for (const [x0, y0, x1, y1] of [[-14, -40, -6, -24], [0, -44, 0, -26], [14, -40, 6, -24], [-50, 4, -32, 8], [-50, 16, -34, 18], [50, 4, 32, 8], [50, 16, 34, 18]]) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); } // stripes
    if (t % 6 < 3) { line(1.5, 0.9); ctx.beginPath(); ctx.moveTo(-60, -50); ctx.lineTo(-48, -36); ctx.lineTo(-58, -30); ctx.lineTo(-44, -14); ctx.stroke(); } // lightning crackles round it
  } else if (sg.animal === 'phoenix') { // wings spread wide and beating, long tail feathers of flame
    const flap = Math.sin(t * 0.18) * 0.25;
    glowStroke(() => { ctx.beginPath(); ctx.ellipse(0, 0, 12, 22, 0, 0, Math.PI * 2); ctx.moveTo(0, -22); ctx.quadraticCurveTo(10, -40, 18, -36); ctx.moveTo(0, -24); ctx.quadraticCurveTo(-6, -46, 4, -52);
      for (const sd of [-1, 1]) for (let q = 0; q < 5; q++) { const an = -Math.PI / 2 + sd * (0.5 + q * 0.28 + flap), L = 70 - q * 7; ctx.moveTo(sd * 8, -6); ctx.quadraticCurveTo(sd * 30, -30 - q * 4, Math.cos(an) * L * -sd * -1 + sd * 8, Math.sin(an) * L - 6); }
      for (let q = -1; q <= 1; q++) { ctx.moveTo(0, 22); ctx.bezierCurveTo(q * 20, 50, q * 34 + 10, 70, q * 22 + 6 * Math.sin(t * 0.15 + q), 98); } });
  } else if (sg.animal === 'serpent') { // a coiled serpent rearing up
    glowStroke(() => { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const an = i / 40 * Math.PI * 3.2, r = 46 - i * 0.9; const x = Math.cos(an) * r, y = 40 + Math.sin(an) * r * 0.45; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.moveTo(10, 30); ctx.bezierCurveTo(40, 0, -10, -30, 14, -62); ctx.moveTo(14, -62); ctx.ellipse(20, -64, 12, 7, 0.2, 0, Math.PI * 2); ctx.moveTo(32, -62); ctx.lineTo(42, -60); ctx.lineTo(48, -64); ctx.moveTo(42, -60); ctx.lineTo(48, -56); });
  } else if (sg.animal === 'crane') { // a crane, wings raised, neck curved
    glowStroke(() => { ctx.beginPath(); ctx.ellipse(0, 10, 22, 12, 0, 0, Math.PI * 2); ctx.moveTo(16, 4); ctx.bezierCurveTo(30, -20, 6, -36, 22, -60); ctx.lineTo(44, -56); ctx.moveTo(-6, 4); ctx.quadraticCurveTo(-40, -40, -70, -50); ctx.quadraticCurveTo(-40, -10, -16, 2);
      ctx.moveTo(6, 2); ctx.quadraticCurveTo(-6, -60, -30, -78); ctx.quadraticCurveTo(-4, -30, 8, 0); ctx.moveTo(-2, 22); ctx.lineTo(-6, 60); ctx.moveTo(6, 22); ctx.lineTo(10, 60); });
    ctx.fillStyle = `rgba(255,90,90,${a})`; ctx.beginPath(); ctx.arc(22, -62, 3, 0, Math.PI * 2); ctx.fill();
  } else if (sg.animal === 'fox') { // a fox's head with three tails fanned behind
    for (let q = 0; q < 3; q++) glowStroke(() => { const an = -0.9 + q * 0.6 + Math.sin(t * 0.1 + q) * 0.08; ctx.beginPath(); ctx.moveTo(-10, 20); ctx.quadraticCurveTo(-10 + Math.cos(an + Math.PI) * 60, 20 + Math.sin(an + Math.PI) * 60 - 30, -20 + Math.cos(an + Math.PI) * 90, Math.sin(an + Math.PI) * 70 - 10); });
    glowStroke(() => { ctx.beginPath(); ctx.moveTo(-26, -10); ctx.lineTo(-30, -48); ctx.lineTo(-8, -26); ctx.lineTo(8, -26); ctx.lineTo(30, -48); ctx.lineTo(26, -10); ctx.lineTo(0, 22); ctx.closePath(); ctx.moveTo(-14, -6); ctx.lineTo(-4, -2); ctx.moveTo(14, -6); ctx.lineTo(4, -2); });
  } else if (sg.animal === 'rat') { // a small quick rat, tail curling
    glowStroke(() => { ctx.beginPath(); ctx.ellipse(0, 20, 30, 18, 0, 0, Math.PI * 2); ctx.moveTo(28, 14); ctx.quadraticCurveTo(52, 8, 56, 20); ctx.quadraticCurveTo(46, 30, 28, 24); ctx.moveTo(34, 8); ctx.arc(34, 2, 7, 0, Math.PI * 2);
      ctx.moveTo(-30, 22); ctx.bezierCurveTo(-60, 30, -66, -10, -44, -14); ctx.bezierCurveTo(-30, -16, -36, 4, -48, 0); });
  } else if (sg.animal === 'bull') { // a bull's head lowered to charge: great horns, a ring through its nose, breath steaming
    glowStroke(() => { ctx.beginPath(); ctx.moveTo(-30, -24); ctx.lineTo(30, -24); ctx.lineTo(24, 18); ctx.quadraticCurveTo(0, 40, -24, 18); ctx.closePath();
      ctx.moveTo(-28, -22); ctx.bezierCurveTo(-60, -26, -74, -50, -58, -74); ctx.moveTo(28, -22); ctx.bezierCurveTo(60, -26, 74, -50, 58, -74);
      ctx.moveTo(-30, -14); ctx.lineTo(-48, -8); ctx.lineTo(-30, 0); ctx.moveTo(30, -14); ctx.lineTo(48, -8); ctx.lineTo(30, 0);
      ctx.moveTo(-14, -8); ctx.lineTo(-6, -4); ctx.moveTo(14, -8); ctx.lineTo(6, -4); ctx.moveTo(0, 26); ctx.arc(0, 32, 7, -Math.PI / 2, Math.PI * 1.5); });
    for (const sd of [-1, 1]) { const ph = (t * 0.12 + (sd > 0 ? 1 : 0)) % 1; ctx.fillStyle = `rgba(${col},${0.5 * (1 - ph) * a})`; ctx.beginPath(); ctx.arc(sd * (12 + ph * 26), 30 + ph * 8, 4 + ph * 8, 0, Math.PI * 2); ctx.fill(); } // steam from its nostrils
  } else if (sg.animal === 'raven') { // a raven diving, wings swept wide
    const flap = Math.sin(t * 0.2) * 6;
    glowStroke(() => { ctx.beginPath(); ctx.ellipse(0, 0, 10, 20, 0.2, 0, Math.PI * 2); ctx.moveTo(4, -18); ctx.lineTo(16, -26); ctx.lineTo(6, -24);
      for (const sd of [-1, 1]) { ctx.moveTo(sd * 6, -6); ctx.quadraticCurveTo(sd * 40, -40 - flap, sd * 82, -20 + flap); ctx.quadraticCurveTo(sd * 50, -14, sd * 70, 4); ctx.quadraticCurveTo(sd * 40, 0, sd * 8, 8); }
      ctx.moveTo(-6, 18); ctx.lineTo(0, 44); ctx.lineTo(6, 18); });
  }
  ctx.restore();
}
function drawTellFX(f, mv, el) {
  const T = TELLS[f.key] || TELLS.ninja, J = solve(f.pose), s = f.ch.scale, ox = f.x + (f.animDX || 0), k = el / Math.max(1, mv.tellPre);
  const at = j => [ox + f.facing * s * j[0], GROUND - f.y - s * (j[1] + f.hipUp)];
  const [h1x, h1y] = at(J.h1), [h2x, h2y] = at(J.h2), hx = (h1x + h2x) / 2, hy = (h1y + h2y) / 2;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const sg = f.key === 'ninja' && KURO_SIGNS[mv.id];
  if (sg) {
    const seg = mv.tellPre / 3, i = Math.min(2, Math.floor(el / seg)), u = (el - i * seg) / seg;
    ctx.strokeStyle = `rgba(${sg.col},.95)`; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    for (const [x, y] of [[h1x, h1y], [h2x, h2y]]) for (let q = -1; q <= 1; q += 2) { ctx.beginPath(); ctx.moveTo(x + q * 1.5, y - 2); ctx.lineTo(x + q * 2.5, y - 11); ctx.stroke(); } // two fingers up on each hand, glowing
    if (u < 0.4) { const r = 6 + u * 40; ctx.strokeStyle = `rgba(${sg.col},${0.8 * (1 - u / 0.4)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.stroke(); } // a ripple each time a seal locks in
    for (let j = 0; j <= i; j++) { ctx.fillStyle = `rgba(${sg.col},${j === i ? 0.95 : 0.45})`; ctx.beginPath(); ctx.arc(f.x - 14 + j * 14, GROUND - f.y - 228 * s, 3.5, 0, Math.PI * 2); ctx.fill(); } // three dots: how far through the signs he is
    // (the seal's name and kanji are drawn with the spirit)
  } else if (T.fx === 'sign') { // hand signs: a glowing seal between his hands, and a flicker of shadow
    ctx.translate(hx, hy - 6); ctx.rotate(el * 0.25); ctx.strokeStyle = `rgba(190,150,255,${0.5 + 0.4 * k})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.stroke(); for (let i = 0; i < 4; i++) { const an = i * Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(an) * 5, Math.sin(an) * 5); ctx.lineTo(Math.cos(an) * 14, Math.sin(an) * 14); ctx.stroke(); }
  } else if (T.fx === 'qi') { const g = ctx.createRadialGradient(hx, hy, 2, hx, hy, 26); g.addColorStop(0, `rgba(160,245,255,${0.6 * k + 0.2})`); g.addColorStop(1, 'rgba(125,235,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, 26, 0, Math.PI * 2); ctx.fill();
  } else if (T.fx === 'twirl') { ctx.strokeStyle = `rgba(255,210,110,${0.4 + 0.4 * k})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(hx, hy - 10, 46, 12, 0, el * 0.6, el * 0.6 + 4.2); ctx.stroke(); // the staff twirling
  } else if (T.fx === 'rune') { ctx.globalCompositeOperation = 'source-over'; drawTriCircle(hx, hy - 8, 12 + 10 * k, 0.5 + 0.4 * k, el * 0.2);
  } else if (T.fx === 'light') { const [sx, sy] = at(J.head); const g = ctx.createLinearGradient(sx, sy - 70, sx, sy); g.addColorStop(0, 'rgba(255,245,200,0)'); g.addColorStop(1, `rgba(255,245,200,${0.25 + 0.35 * k})`); ctx.fillStyle = g; ctx.fillRect(sx - 14, sy - 70, 28, 70); // light falls on him
  } else if (T.fx === 'splash') { for (let i = 0; i < 3; i++) { const an = -Math.PI / 2 + (i - 1) * 0.6, r = 10 + ((el * 3 + i * 7) % 18); const [dx, dy] = at(J.head); ctx.fillStyle = `rgba(150,215,255,${0.7 - r / 40})`; ctx.beginPath(); ctx.arc(dx + Math.cos(an) * r, dy - 10 + Math.sin(an) * r, 3, 0, Math.PI * 2); ctx.fill(); } // water slops from his dish
  } else if (T.fx === 'spin') { const [gx, gy] = at(J.h1); ctx.strokeStyle = `rgba(255,220,150,${0.5 + 0.4 * k})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(gx, gy, 10, el * 0.8, el * 0.8 + 4.5); ctx.stroke(); // twirling the revolver
  } else if (T.fx === 'gems') { const cols = ['110,255,220', '255,190,80', '150,170,255']; for (let i = 0; i < 3; i++) { const an = el * 0.22 + i * Math.PI * 2 / 3, x = hx + Math.cos(an) * (16 + 6 * k), y = hy - 6 + Math.sin(an) * (7 + 3 * k); const g = ctx.createRadialGradient(x, y, 0.5, x, y, 9); g.addColorStop(0, `rgba(${cols[i]},.95)`); g.addColorStop(1, `rgba(${cols[i]},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill(); } // Hohen: three glowing stones circle his hands
  } else if (T.fx === 'sweat') { const [dx, dy] = at(J.head); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(150,200,255,.9)'; ctx.beginPath(); ctx.ellipse(dx + f.facing * 14, dy - 6 + (el % 8), 3, 5, 0, 0, Math.PI * 2); ctx.fill(); } // a nervous drop of sweat
  ctx.restore();
}
function eyePos(f) { const J = solve(f.pose), s0 = f.ch.scale; return [f.x + (f.animDX || 0) + f.facing * s0 * (J.head[0] + 9), GROUND - f.y - s0 * (J.head[1] + f.hipUp + 2)]; }
function rayDraw(e, t, a) { // two beams of holy light from his eyes
  if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [w, c] of [[18, `rgba(255,220,120,${0.35 * a})`], [8, `rgba(255,245,200,${0.8 * a})`], [3, `rgba(255,255,255,${a})`]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(t[0], t[1]); ctx.stroke(); }
  const g = ctx.createRadialGradient(e[0], e[1], 1, e[0], e[1], 16); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(e[0], e[1], 16, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function angelRay(id, label, aim) { // the angel's eye ray: aimed at the waist (mid) or the feet (low)
  const low = aim === 'low';
  return { id, label, startup: 14, active: 6, recovery: 20, wind: 'saPray', pose: 'saPray', hitbox: low ? [30,380,0,44] : [30,420,80,140], low, dmg: low ? 30 : 34, stun: 22, bstun: 12, push: 2, type: 'mid', hitstop: 8, gdrain: 8,
    onFrame(f, o, mf) { if (mf === 4) popText(f.x, GROUND - 200, L('BEHOLD!', '見よ！'), '255,235,170'); if (mf === 14) sfx('beam'); },
    drawFX(f) { const S = f.move.startup; if (f.mf < S - 6 || f.mf > S + 8) return; const e = eyePos(f), s0 = f.ch.scale;
      if (f.mf < S) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,245,200,${(f.mf - S + 6) / 6})`; ctx.beginPath(); ctx.arc(e[0], e[1], 5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return; } // his eyes light up first
      const L = low ? 380 : 420, tx = f.x + f.facing * L * s0, ty = low ? GROUND - 18 : GROUND - f.y - 110 * s0; rayDraw(e, [tx, ty], 1 - Math.max(0, f.mf - S - 4) / 5); } };
}
function drawTail(f, tip, fade, fire) { // the devil's tail: thick at the base, tapering, with a spade tip
  const s0 = f.ch.scale, J = solve(f.pose), bx = f.x + (f.animDX || 0) + f.facing * 14 * s0, by = GROUND - f.y - s0 * (J.hip[1] + f.hipUp) + 4; // from his rear: he has his back to them
  const ctl = [(bx + tip[0]) / 2 - f.facing * 18, Math.min(by, tip[1]) - 26];
  ctx.save(); ctx.globalAlpha = fade; ctx.lineCap = 'round';
  if (fire) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(tip[0], tip[1], 2, tip[0], tip[1], 34); g.addColorStop(0, 'rgba(255,190,90,.8)'); g.addColorStop(1, 'rgba(255,80,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tip[0], tip[1], 34, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
  const q = (u, a, b, c) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;
  for (let i = 0; i < 16; i++) { const u0 = i / 16, u1 = (i + 1) / 16; ctx.strokeStyle = i % 2 ? '#7a1010' : '#941818'; ctx.lineWidth = 18 - u0 * 12;
    ctx.beginPath(); ctx.moveTo(q(u0, bx, ctl[0], tip[0]), q(u0, by, ctl[1], tip[1])); ctx.lineTo(q(u1, bx, ctl[0], tip[0]), q(u1, by, ctl[1], tip[1])); ctx.stroke(); }
  const d = Math.atan2(tip[1] - ctl[1], tip[0] - ctl[0]); ctx.translate(tip[0], tip[1]); ctx.rotate(d);
  ctx.fillStyle = '#b01c1c'; ctx.strokeStyle = '#ffb08a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(32, 0); ctx.lineTo(0, -16); ctx.lineTo(7, 0); ctx.lineTo(0, 16); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function tailArcFX(f, mv) { // a tail attack's tip travels along an arc (angles: 0 = straight ahead, π/2 = up, π = behind) from mv.tail.a0 to a1 as it strikes
  const T = mv.tail, S = mv.tailS != null ? mv.tailS + 1 : mv.startup, mf = f.mf, end = S + (mv.tailS != null ? 3 : (mv.active || 4)); if (mf < 1 || mf > end + 8) return; // (tailS: a frenzy of strikes, each its own quick sweep)
  const k = mf < S ? 0.15 * mf / S : Math.min(1, 0.15 + 0.85 * (mf - S) / Math.max(1, end - S)), fade = mf > end ? 1 - (mf - end) / 8 : 1;
  const an = T.a0 + (T.a1 - T.a0) * k, L = T.len * f.ch.scale, s0 = f.ch.scale, cx = f.x + f.facing * 14 * s0, cy = GROUND - f.y - (T.h || 90) * s0;
  const tip = [cx + Math.cos(an) * L * f.facing, cy - Math.sin(an) * L];
  if (mf >= S && mf <= end) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,110,60,.5)'; ctx.lineWidth = 10; ctx.beginPath(); for (let i = 0; i <= 8; i++) { const a2 = T.a0 + (T.a1 - T.a0) * Math.max(0, k - i * 0.05); const x = cx + Math.cos(a2) * L * f.facing, y = cy - Math.sin(a2) * L; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); } // a streak of fire behind the tip
  drawTail(f, tip, fade, mf >= S && mf <= end);
}
function drawWindFX(f, mv) {
  if (!mv.lead) mv.lead = leadJoint(mv);
  const t = f.windPhase, J = solve(f.pose), s = f.ch.scale, ox = f.x + (f.animDX || 0), col = f.ch.fxCol || '255,255,255';
  const at = j => [ox + f.facing * s * j[0], GROUND - f.y - s * (j[1] + f.hipUp)];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  if (t < 0.35 && f.y <= 0) { const [fx2, fy2] = at(J.f2); ctx.fillStyle = `rgba(230,220,200,${0.35 * (1 - t / 0.35)})`; ctx.beginPath(); ctx.ellipse(fx2 - f.facing * 6, GROUND - 3, 18 * (0.6 + t), 4, 0, 0, Math.PI * 2); ctx.fill(); } // dust as the back foot digs in
  const [lx, ly] = at(J[mv.lead]), n = 7, k = Math.min(1, t / 0.85);
  for (let i = 0; i < n; i++) { // streaks of energy drawn into the striking hand or foot
    const an = i * Math.PI * 2 / n + f.mf * 0.35, r0 = 46 - 30 * k, r1 = r0 - 10;
    ctx.strokeStyle = `rgba(${col},${0.15 + 0.5 * k})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx + Math.cos(an) * r0, ly + Math.sin(an) * r0); ctx.lineTo(lx + Math.cos(an) * r1, ly + Math.sin(an) * r1); ctx.stroke();
  }
  if (t >= 0.6) { const q = (t - 0.6) / 0.4; ctx.strokeStyle = `rgba(${col},${0.7 * (1 - q * 0.5)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(lx, ly, 6 + 16 * (1 - q), 0, Math.PI * 2); ctx.stroke(); // loading: a ring tightening on it
    const g = ctx.createRadialGradient(lx, ly, 1, lx, ly, 14); g.addColorStop(0, `rgba(255,255,255,${0.5 + 0.4 * q})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lx, ly, 14, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function leadJoint(mv) { // the joint that travels furthest from the wind-up to the strike: that's the one doing the hitting
  const Wj = solve(POSES[mv.wind] || POSES.idle), Aj = solve(POSES[mv.pose] || POSES.idle);
  let best = 'h1', d = -1; for (const k of ['h1', 'h2', 'f1', 'f2']) { const dd = Math.hypot(Aj[k][0] - Wj[k][0], Aj[k][1] - Wj[k][1]); if (dd > d) { d = dd; best = k; } }
  return best;
}
function drawSmear(f, mv) {
  const su = mv.startup, aEnd = su - strikeFrames(su);
  if (su >= 900 || f.pre > 0 || f.mf < aEnd - 1 || f.mf > su + mv.active + 2) { f.smear = null; return; }
  if (!mv.lead) mv.lead = leadJoint(mv);
  const J = solve(f.pose), s = f.ch.scale, j = J[mv.lead], x = f.x + (f.animDX || 0) + f.facing * s * j[0], y = GROUND - f.y - s * (j[1] + f.hipUp);
  if (!f.smear || f.smearSerial !== f.serial) { f.smear = []; f.smearSerial = f.serial; }
  if (!f.smear.length || f.smear[f.smear.length - 1][2] !== f.mf) f.smear.push([x, y, f.mf]);
  if (f.smear.length > 6) f.smear.shift();
  if (f.mf === aEnd) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${f.ch.fxCol || '255,255,255'},.8)`; ctx.beginPath(); for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4, r = i % 2 ? 3 : 10; ctx.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); } // a glint: here it comes
  if (f.smear.length < 2) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 1; i < f.smear.length; i++) { const a = i / f.smear.length, p0 = f.smear[i - 1], p1 = f.smear[i];
    ctx.strokeStyle = `rgba(${f.ch.fxCol || '255,255,255'},${0.5 * a})`; ctx.lineWidth = 3 + 11 * a; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke(); }
  ctx.restore();
}
const strikeFrames = su => su <= 3 ? su : Math.max(2, Math.round(su * 0.4));
const heavyTap = base => Math.max(base, 12 + strikeFrames(base)); // a heavy attack's startup with at least 12 frames of wind-up before the strike
// Kuro's techniques each begin with their own hand signs and a spirit that rises behind him — read them and you know what's coming
const KURO_SIGNS = {
  teleKick: { animal: 'dragon', kanji: '龍', en: 'Dragon Seal', ja: '龍の印', col: '110,235,205', seq: ['seal', 'seal3', 'seal5'] },     // Sky Drop Kick
  fireballs: { animal: 'tiger', kanji: '虎', en: 'Tiger Seal', ja: '虎の印', col: '255,225,90', seq: ['seal2', 'seal4', 'seal'] },      // Lightning Volley
  flame: { animal: 'phoenix', kanji: '鳳', en: 'Phoenix Seal', ja: '鳳凰の印', col: '255,125,60', seq: ['seal4', 'seal3', 'seal2'] }, // Fire Breath
  shadowCharge: { animal: 'serpent', kanji: '蛇', en: 'Serpent Seal', ja: '蛇の印', col: '175,125,255', seq: ['seal', 'seal4', 'seal5'] }, // Shadow Charge Upper
  swordSlash: { animal: 'crane', kanji: '鶴', en: 'Crane Seal', ja: '鶴の印', col: '225,238,255', seq: ['seal5', 'seal', 'seal3'] },    // Iai Slash
  cloneStrike: { animal: 'fox', kanji: '狐', en: 'Fox Seal', ja: '狐の印', col: '210,160,255', seq: ['seal2', 'seal5', 'seal4'] },      // Shadow Clone
  vanishSlide: { animal: 'rat', kanji: '鼠', en: 'Rat Seal', ja: '鼠の印', col: '185,185,210', seq: ['seal4', 'seal', 'seal2'] },       // Vanish Slide
  vanishDrop: { animal: 'raven', kanji: '烏', en: 'Raven Seal', ja: '烏の印', col: '160,120,230', seq: ['seal3', 'seal2', 'seal5'] },   // Vanish Drop Kick
};
// spirits for two of his moves inside combos too: the juggle fire (a phoenix) and the U, U, K finishing kick (a bull)
const KURO_SPIRIT_LABEL = {
  'Fire Spout': { animal: 'phoenix', kanji: '鳳', en: 'Phoenix Seal', ja: '鳳凰の印', col: '255,125,60' },
  'Crescent Moon Drop': { animal: 'bull', kanji: '牛', en: 'Bull Seal', ja: '牛の印', col: '255,175,120' },
};
const TELLS = { // what each fighter does before a technique — a readable tell that a quick jab can interrupt
  ninja: { a: 'seal', b: 'seal2', fx: 'sign' }, brawler: { a: 'chargeB', b: 'chargeB', fx: 'qi' }, staff: { a: 'staffWhirl', b: 'staffRise', fx: 'twirl' },
  psychic: { a: 'psyCast', b: 'psyRaise', fx: 'rune' }, paladin: { a: 'chargeP', b: 'pPlant', fx: 'light' }, kappa: { a: 'kCurl', b: 'kIdle', fx: 'splash' },
  gunman: { a: 'gIdle', b: 'gLow', fx: 'spin' }, salary: { a: 'sTie', b: 'sBow', fx: 'sweat' } };
function tellPose(f, mv, el) {
  const sg = f.key === 'ninja' && KURO_SIGNS[mv.id];
  if (sg) { // three seals in a row: each one snaps into place, held with a slight tremor of concentration
    const n = mv.tellPre, seg = n / 3, i = Math.min(2, Math.floor(el / seg)), u = (el - i * seg) / seg;
    const from = i === 0 ? f.prevPose : POSES[sg.seq[i - 1]], to = POSES[sg.seq[i]];
    const p = lerpPose(from, to, easeOutQ(Math.min(1, u / 0.35))), w = Math.sin(el * 1.7) * 0.8; p.a1l += w; p.a2l -= w; return p;
  }
  const T = TELLS[f.key] || TELLS.ninja, n = mv.tellPre, k = el / Math.max(1, n);
  const A = POSES[T.a] || POSES.idle, B = POSES[T.b] || A;
  if (k < 0.3) return lerpPose(f.prevPose, A, easeOutQ(k / 0.3)); // into the tell...
  const w = Math.sin(el * 0.9); const p = lerpPose(A, B, 0.5 + 0.5 * w); p.t += w * 2; return p; // ...and hold it, a little alive (signs changing, a twirl, a tug of the tie)
}
function windStages(f, mv, N, grounded) { // the key poses of a heavy wind-up, built from the move's own wind-up pose
  const P0 = f.prevPose, leg = grounded && !mv.crouch && !mv.low, w = mv.windW == null ? 1 : mv.windW;
  const G = lerpPose(P0, N, 0.35); G.t -= 9 * w; // 1) gather: sink, lean back, the weight shifts onto the back foot
  if (leg) { G.l1u += 8 * w; G.l1l -= 16 * w; G.l2u -= 12 * w; G.l2l -= 20 * w; }
  const C = { ...N }; C.t -= 7 * w; // 2) chamber: everything draws back, and the front knee lifts
  for (const k of ['a1u', 'a1l', 'a2u', 'a2l']) C[k] = N[k] + clamp((N[k] - P0[k]) * 0.18, -18, 18);
  if (leg) { C.l1u = N.l1u + 26 * w; C.l1l = N.l1l - 44 * w; C.l2u = N.l2u - 6 * w; C.l2l = N.l2l - 14 * w; }
  const Ld = { ...C }; Ld.t -= 3 * w; // 3) load: coil down on the back leg, like a spring
  if (leg) { Ld.l2u -= 6 * w; Ld.l2l -= 14 * w; Ld.l1u += 4 * w; }
  const R = { ...N }; R.t += 5 * w; // 4) release: the front foot steps forward and plants, the body starts to drive
  if (leg) { R.l1u = N.l1u + 14 * w; R.l1l = N.l1l - 2 * w; R.l2u = N.l2u - 10 * w; R.l2l = N.l2l - 6 * w; }
  return { G, C, Ld, R };
}
function windSeq(f, mv, t, N, grounded) { // the wind-up plays as an animation, not a pause: gather > chamber > load > release
  t = clamp(t, 0, 1); f.windPhase = t;
  const { G, C, Ld, R } = windStages(f, mv, N, grounded), dir = f.facing;
  const mx = 7 * (mv.windW == null ? 1 : mv.windW);
  if (t < 0.25) { f.animDX = -dir * mx * easeOutQ(t / 0.25); return lerpPose(f.prevPose, G, easeOutQ(t / 0.25)); }
  if (t < 0.6) { f.animDX = -dir * mx; return lerpPose(G, C, easeInOutQ((t - 0.25) / 0.35)); }
  if (t < 0.85) { const k = (t - 0.6) / 0.25; f.animDX = -dir * mx * (1 + 0.57 * k); const p = lerpPose(C, Ld, easeInOutQ(k)); const w = Math.sin((f.mf + (f.pre || 0)) * 2.3) * 1.6 * k; p.a1u += w; p.a2u -= w; return p; }
  const k = (t - 0.85) / 0.15; f.animDX = -dir * mx * 1.57 * (1 - k); return lerpPose(Ld, R, easeOutQ(k));
}
function windEnd(f, mv, N, grounded) { return windStages(f, mv, N, grounded).R; } // where the strike starts from
function stanceBase(f, mv) { return f.y > 0 ? POSES.jump : mv.crouch ? POSES[f.ch.crouchPose || 'crouch'] : POSES[f.ch.idle || 'idle'] || POSES.idle; }
function anticPose(f, W, A, mv, grounded) { // the wind-up, exaggerated away from the strike, with the weight sinking into the legs
  const o = { ...W };
  for (const k of ['a1u', 'a1l', 'a2u', 'a2l']) o[k] = W[k] + clamp((W[k] - A[k]) * 0.25, -28, 28);
  o.t = W.t + clamp((W.t - A.t) * 0.3, -10, 10) - 3;
  if (grounded && !mv.crouch && !mv.low) { o.l1u += 9; o.l1l -= 14; o.l2u -= 5; o.l2l -= 12; } // sink and load the legs
  return o;
}
function strikePose(f, A, W, mv, grounded) { // the hit itself: the weight drives forward, the front foot steps into it
  const o = { ...A };
  if (grounded && !mv.crouch && !mv.low && Math.abs(A.l1u) < 70) { o.l1u = A.l1u + 8; o.l1l = A.l1l + 3; o.l2u = A.l2u - 9; o.l2l = A.l2l - 4; o.t = A.t + 3; }
  return o;
}
function followPose(A, W) { // over-extend a little past the strike
  const o = { ...A };
  for (const k of ['a1u', 'a1l', 'a2u', 'a2l', 't']) o[k] = A[k] + clamp((A[k] - W[k]) * 0.1, -9, 9);
  return o;
}
function targetPose(f) {
  if (showOn() && f.state === 'stand' && SHOW[f.key]) return showPose(f, 'intro', game.phaseT - (f.side ? 8 : 0)); // the entrance
  if (f.state === 'win') return winPose(f); // victory.js
  switch (f.state) {
    case 'stand': return Math.abs(f.vx) > 0.1 ? walkPose(f) : idlePose(f.side * 1.7, f.key, f.ch);
    case 'crouch': { if (f.backHeld) return POSES.cguard; const c = POSES[f.ch.crouchPose || 'crouch']; if (Math.abs(f.vx) < 0.3) return c; const s = Math.sin(globalT * 0.35), p = { ...c }; p.l1u += s * 10; p.l2u -= s * 10; p.l1l -= Math.max(0, s) * 8; p.l2l -= Math.max(0, -s) * 8; p.t += 3; return p; } // (a low shuffle forward)
    case 'guard': return POSES.guard;
    case 'blockstun': return f.cguard ? POSES.cguard : POSES.guard;
    case 'jump': return POSES.jump;
    case 'land': return POSES.land;
    case 'hitstun': return f.crouchHit ? POSES.chit : POSES.hit;
    case 'recover': return f.backHeld ? POSES.guard : lerpPose(POSES.hit, POSES.idle, Math.min(1, f.st / 12));
    case 'knock': return POSES.knock;
    case 'down': return POSES.down;
    case 'getup': return lerpPose(POSES.down, POSES.crouch, Math.min(1, f.st / 14));
    case 'roll': case 'broll': return POSES.tuck;
    case 'dash': return POSES.dash;
    case 'bdash': return f.st < 7 ? POSES.guard : lerpPose(POSES.guard, POSES.idle, (f.st - 7) / 5);
    case 'slashed': { const p = { ...POSES.staggered }; p.t += Math.sin(f.st * 0.9) * 3; return p; }
    case 'charge': return POSES[f.ch.chargePose || 'charge'];
    case 'gbreak': { const p = { ...POSES.dizzy }, w = Math.sin(f.st * 0.22); p.t += w * 9; p.a1u += w * 10; p.a2u -= w * 8; return p; }
    case 'stunned': { const p = { ...POSES.dizzy }, w = Math.sin(f.st * (f.stunKind === 'shock' ? 0.9 : 0.25)); p.t += w * (f.stunKind === 'shock' ? 4 : 8); p.a1u += w * 12; p.a2u -= w * 10; return p; }
    case 'win': return POSES[f.ch.winPose || 'win'];
    case 'attack': return f.move ? movePose(f) : POSES.idle;
  }
  return POSES.idle;
}
function finerMotion(f, p) { // little secondary motions layered on top of the pose (drawing only): breathing, sway, the weight of armor, a float
  const t = globalT + (f.side ? 37 : 0), idle = f.state === 'stand' && Math.abs(f.vx) < 0.1, walk = f.state === 'stand' && !idle;
  if (f.key === 'kappa') { f.swimK = lerp(f.swimK || 0, floodOwner(f) && f.state === 'stand' && Math.abs(f.vx) > 0.5 ? 1 : 0, 0.25); // (into and out of the swim over a few frames, never in one jump)
    if (f.swimK > 0.02) { const s = Math.sin(t * 0.5) * f.swimK, q = lerpPose(p, POSES.kBelly, 0.8 * f.swimK); q.l1u += s * 18; q.l2u -= s * 18; q.a1u += s * 20; q.a2u -= s * 20; return q; } } // swimming: flat on the water, kicking and paddling
  if (f.key === 'kappa') { // a small wild creature: quick shallow breaths, a twitchy head, a bounce in his step
    if (idle) { const b = Math.sin(t * 0.21); p.t += b * 2.2; p.a1l += Math.sin(t * 0.13) * 6; p.a2l += Math.sin(t * 0.13 + 1.4) * 6; if (Math.floor(t / 70) % 3 === 0) p.t += Math.sin(t * 0.9) * 1.5; }
    if (walk) { const s = Math.sin(t * 0.55); p.l1u += s * 6; p.l2u -= s * 6; p.t += Math.abs(s) * 3; }
  } else if (f.key === 'paladin') { // heavy plate: a slow deep breath, the shield arm settling, weight shifting foot to foot
    if (idle) { const b = Math.sin(t * 0.045); p.t += b * 1.2; p.a2u += Math.sin(t * 0.05 + 0.8) * 2.5; p.a1l += b * 2; p.l1l -= Math.max(0, b) * 2; p.l2l -= Math.max(0, -b) * 2; }
    if (walk) { const s = Math.sin(t * 0.32); p.t += 2 + s * 1.5; p.a2u += s * 3; }
  } else if (f.key === 'alchemist' && !f.ch.fused) { // a composed doctor: a slow breath, hands easy in his pockets, and now and then a finger pushing his glasses up
    if (idle) { const b = Math.sin(t * 0.05); p.t += b * 0.9; p.a1l += Math.sin(t * 0.07) * 3; const g = t % 300; if (g < 40) { const k = Math.sin(Math.PI * g / 40); const q2 = lerpPose(p, POSES.alGlasses, 0.85 * k); return q2; } }
    if (walk) { const s = Math.sin(t * 0.3); p.t += 1 + s * 0.8; p.a1l += s * 4; }
  } else if (f.key === 'psychic') { // she floats: a slow drift, sleeves and the open hand flowing
    const b = Math.sin(t * 0.06); p.a2u += Math.sin(t * 0.07 + 1) * 5; p.a2l += Math.sin(t * 0.09) * 7; p.l1l += b * 4; p.l2l -= b * 4; p.t += b * 1.2;
  }
  if (idle && f.key === 'kappa' && t % 110 === 0) parts.push({ type: 'aura', x: f.x + f.facing * 6, y: GROUND - f.y - 150 * f.ch.scale, vx: vrnd(-0.6, 0.6), vy: 1.2, life: 22, max: 22, r: 2.5, col: '150,215,255' }); // a drop spills from his dish
  if (f.key === 'psychic' && t % 18 === 0) parts.push({ type: 'aura', x: f.x + vrnd(-26, 26), y: GROUND - f.y - vrnd(10, 40), vx: 0, vy: -vrnd(0.3, 0.8), life: 30, max: 30, r: 1.8, col: '210,190,255' }); // motes of light rising where she floats
  if (idle && f.key === 'paladin' && t % 140 === 0) parts.push({ type: 'spark', x: f.x + f.facing * 30, y: GROUND - f.y - vrnd(130, 190), vx: 0, vy: -0.4, life: 12, max: 12, col: '235,245,255' }); // a glint runs along the blade
  return p;
}
function updatePose(f) {
  if (f.state !== 'attack') { f.windPhase = -1; f.animDX = (f.animDX || 0) * 0.6; if (f.gunOutT > 0) f.gunOutT--; } else if (f.key === 'gunman') f.gunOutT = 24; // (Jesse holsters a moment after he stops shooting)
  let tp = targetPose(f);
  if (f.recoilT > 0) { // guarded: rocked back off balance, then gathering himself
    if (f.state !== 'attack' || !f.move) f.recoilT = 0;
    else if (f.mf > f.move.startup + (f.move.active || 0)) { f.recoilT--; const k = Math.min(1, f.recoilT / 8) * 0.65, p = lerpPose(tp, POSES.staggered, k); p.t += Math.sin(f.recoilT * 1.3) * 3 * k; tp = p; f.animDX = -f.facing * 5 * k; } }
  if (f.settleT > 0) { f.settleT--; if (f.state === 'stand' || f.state === 'crouch') tp = lerpPose(tp, f.state === 'crouch' ? POSES.cguard : POSES.guard, f.settleT / 10); } // out of block-stun: the guard comes down gradually
  const k = f.state === 'attack' ? 1 : (f.state === 'hitstun' || f.state === 'knock') ? 0.55 : 0.35;
  const was = f.pose;
  f.pose = k === 1 ? tp : lerpPose(f.pose, tp, k);
  if (f.state !== 'attack' && (f.key === 'kappa' || f.key === 'paladin' || f.key === 'psychic')) f.pose = finerMotion(f, { ...f.pose });
  if (k !== 1 && was) { let d = 0; for (const key of PK) d = Math.max(d, Math.abs(wrap180(f.pose[key] - was[key]))); // (how far any part turns this frame)
    const cap = (f.state === 'hitstun' || f.state === 'knock') ? 45 : 30; if (d > cap) f.pose = lerpPose(was, f.pose, cap / d); } // a big change of pose (out of a tucked flip into a stance, into a swim) is spread over a few frames instead of jumping
  const swim = f.key === 'kappa' && floodOwner(f) && f.state === 'stand' && Math.abs(f.vx) > 0.5;
  const air = f.y > 0 || f.state === 'knock';
  const target = air ? 55 : (f.state === 'roll' || f.state === 'broll') ? 34 : swim ? 26 : hipFor(f.pose);
  f.hipUp = f.hipUp == null ? target : lerp(f.hipUp, target, air ? 0.35 : 0.5);
}

