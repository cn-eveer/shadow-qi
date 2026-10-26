'use strict';
/* ================= render loop ================= */
/* ================= opening movie (drawn in-engine, Smash Bros style) ================= */
// Timeline in frames (60 per second): prologue, one cut per fighter, three clashes, then everyone together and the logo.
const OP_ROSTER = [
  { key: 'ninja', pose: ['dash', 'uppercutW', 'uppercut'], col: '150,110,230' },
  { key: 'brawler', pose: ['charge', 'palmW', 'blast'], col: '110,220,255' },
  { key: 'staff', pose: ['idleB', 'slamW', 'staffSlam'], col: '255,200,90' },
  { key: 'psychic', pose: ['idleL', 'psyCast', 'psyPush'], col: '255,140,230' },
  { key: 'paladin', pose: ['pCounter', 'pThrustW', 'pThrust'], col: '170,215,255' },
  { key: 'kappa', pose: ['kIdle', 'kToss', 'kThrow'], col: '120,220,200' },
  { key: 'gunman', pose: ['gIdle', 'gAim', 'gTwin'], col: '255,200,120' },
  { key: 'salary', pose: ['sIdle', 'charge', 'win'], col: '200,205,225' },
];
const OP_CUT = 150, OP_PRO = 130, OP_CLASH = 110, OP_CLASHES = [['ninja', 'staff'], ['brawler', 'paladin'], ['psychic', 'ninja']];
// real battle footage: the actual game, playing one of each fighter's sample combos, filmed up close
const OP_BATTLE = [ // a highlight reel: each clip starts right at the action (from: the step to start on); supers and big combos
  { key: 'ninja', demo: 11, from: 2, len: 165, sup: true }, { key: 'staff', demo: 11, from: 2, len: 150, sup: true }, { key: 'psychic', demo: 5, len: 135 },
  { key: 'brawler', demo: 11, from: 3, len: 150, sup: true }, { key: 'kappa', demo: 7, len: 140, sup: true }, { key: 'salary', demo: 20, from: 2, len: 200 },
  { key: 'gunman', demo: 7, len: 140, sup: true }, { key: 'paladin', demo: 11, len: 150, sup: true }];
const OP_BAT0 = OP_PRO, OP_CLASH0 = OP_BAT0 + OP_BATTLE.reduce((n, c) => n + c.len, 0); // (no slow roster cuts or clashes any more: straight into the action)
const OP_GROUP = OP_CLASH0, OP_END = OP_GROUP + 260;
function opClipAt(t) { let s0 = OP_BAT0; for (let i = 0; i < OP_BATTLE.length; i++) { if (t < s0 + OP_BATTLE[i].len) return t >= s0 ? { i, k: t - s0 } : null; s0 += OP_BATTLE[i].len; } return null; }
function opSim() { game.mode = 'fight'; fightTick(); game.mode = 'opening'; }
function opStartClip(i) { // set up the real game behind the scenes and run it to the moment the combo starts
  const c = OP_BATTLE[i];
  OP.muted = true;
  game.p1Char = c.key; startMatch(true, false, true); setupDemo(c.demo);
  game.mode = 'opening'; updateTbar(); ov.hidden = true;
  for (let n = 0; n < 900; n++) { opSim(); if (game.phase === 'fight' && fighters[0].state === 'attack' && (game.demoState.i >= (c.from || 0))) break; }
  OP.muted = false; OP.clip = i; OP.z = null; OP.cx = null; OP.cy = null; OP.punch = 0; OP.slowT = 0; OP.lastHp = fighters[1].hp; OP.half = false;
}
function opRenderClip(i, k) { // the live game, filmed: zoomed in on the action, letterboxed, with a name tag and the hit counter
  const c = OP_BATTLE[i], r = OP_ROSTER.find(q => q.key === c.key), [a, b] = fighters;
  // the camera: close, punching in on the big moments — but always wide enough to keep BOTH fighters in shot (the attacker too, when the other is launched high)
  const zt = game.superFlash || OP.punch > 0 ? 1.95 : 1.5;
  const minX = Math.min(a.x, b.x) - 80 - (a.state === 'attack' && a.move && /^sm(Angel|Devil)$/.test(a.move.id || '') ? 120 : 0), maxX = Math.max(a.x, b.x) + 80 + (a.state === 'attack' && a.move && /^sm(Angel|Devil)$/.test(a.move.id || '') ? 120 : 0);
  const poss = a.state === 'attack' && a.move && (a.move.id === 'smAngel' || a.move.id === 'smDevil') && a.mf < 54; // (a possession: room for the spirits on both sides, half again his height)
  const topY = poss ? GROUND - 360 : GROUND - Math.max(a.y + 200 * a.ch.scale, b.y + 200 * b.ch.scale) - 24, botY = GROUND + 16;
  const zFit = Math.min(W / (maxX - minX), (H - 80) / (botY - topY)), zWant = Math.max(1, Math.min(zt, zFit));
  OP.z = (OP.z || zWant) + (zWant - (OP.z || zWant)) * 0.2; const z = Math.min(OP.z, zFit < 1 ? 1 : zFit + 0.001);
  const cxT = clamp((minX + maxX) / 2, W / 2 / z, W - W / 2 / z), cyT = clamp((topY + botY) / 2, H / 2 / z, H - H / 2 / z);
  OP.cx = OP.cx == null ? cxT : OP.cx + (cxT - OP.cx) * 0.25; OP.cy = OP.cy == null ? cyT : OP.cy + (cyT - OP.cy) * 0.25;
  const mx = clamp(OP.cx, W / 2 / z, W - W / 2 / z), my = clamp(OP.cy, H / 2 / z, H - H / 2 / z), sh = game.shake;
  ctx.save(); ctx.translate(sh ? vrnd(-sh, sh) : 0, sh ? vrnd(-sh, sh) * 0.6 : 0);
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-mx, -my);
  ctx.drawImage(bg, 0, 0, W, H);
  if (game.superFlash) drawSuperFX(false);
  for (const f of fighters) if (!f.hidden && !f.shadow) drawShadow(f.x, f.y, f.ch.scale);
  const behind = t => t === 'clone' || t === 'decoy' || t === 'guardShadow';
  for (const p of projs) if (behind(p.type)) drawProj(p);
  for (const f of fighters) if (f.spirit) drawSpirit(f); // Kuro's spirit animals, behind everyone
  for (const f of [...fighters].sort((p, q) => (p.state === 'attack' ? 1 : 0) - (q.state === 'attack' ? 1 : 0))) drawFighter(f);
  for (const p of projs) if (!behind(p.type)) drawProj(p);
  drawParts();
  ctx.restore();
  if (game.superFlash) drawSuperFX(true);
  // a slanted tag with the fighter's name, and the hit counter
  const tk = ease(k / 14);
  ctx.save(); ctx.translate(-260 * (1 - tk), 0);
  ctx.fillStyle = `rgba(${r.col},0.85)`; ctx.beginPath(); ctx.moveTo(0, 50); ctx.lineTo(300, 50); ctx.lineTo(270, 100); ctx.lineTo(0, 100); ctx.closePath(); ctx.fill();
  opBigText(nm(CHARS[c.key]), 24, 76, 30, '#ffffff', 1, 'left', true); ctx.restore();
  if ((game.superFlash && fighters[0].move && fighters[0].move.super) || (c.sup && OP.punch > 0 && fighters[0].move && fighters[0].move.super)) { /* only a real super gets the SUPER! banner */ opSpeedLines(r.col, 0.5, fighters[0].facing > 0 ? 1 : -1, 18); opBigText(L('SUPER!', '超必殺！'), W / 2, H - 80, 46, '#ffd23f', 1, 'center', true); }
  { const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.85); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); } // a vignette: the eye goes to the action
  const cb = game.combo;
  if (cb && cb.n >= 2) { opBigText(L(`${cb.n} HITS`, `${cb.n} ヒット`), W - 40, 92, 40, '#ffd23f', 1, 'right', true); opBigText(L('COMBO', 'コンボ'), W - 40, 124, 16, '#ffffff', 1, 'right'); }
  if (k < 12) { // the cut: slanted panels in the fighter's colour slash away
    const e = easeIn(k / 12); ctx.save(); // starts covering the frame, then whips away
    for (let i = 0; i < 3; i++) { const off = e * (W + 400) * (1 + i * 0.25); ctx.fillStyle = i === 1 ? 'rgba(255,255,255,.9)' : `rgba(${r.col},${0.95 - i * 0.2})`;
      ctx.beginPath(); ctx.moveTo(-200 + off + i * 60, 0); ctx.lineTo(W + 200 + off + i * 60, 0); ctx.lineTo(W + off + i * 60, H); ctx.lineTo(-400 + off + i * 60, H); ctx.closePath(); ctx.fill(); }
    ctx.restore(); if (k < 3) opFlash(0.7 - k * 0.2);
  }
}
const OP = { t: 0, clip: -1, muted: false };
function startOpening() {
  if (game.mode !== 'opening') OP.save = { p1: game.p1Char, p2: game.p2Char }; // the footage borrows the fighter picks; put them back afterwards
  initAudio(); game.mode = 'opening'; OP.t = 0; OP.clip = -1; ov.hidden = true; ov.innerHTML = '';
  try { localStorage.setItem('sq-opening', '1'); } catch (e) {}
}
function endOpening() { if (game.mode !== 'opening') return; if (OP.save) { game.p1Char = OP.save.p1; game.p2Char = OP.save.p2; } game.demo = false; game.training = false; showMenu(); }
function skipOpening() { if (OP.t < OP_GROUP) { OP.t = OP_GROUP; OP.clip = -1; } else if (OP.t > OP_GROUP + 110) endOpening(); }
function openingTick() { // the sound cues of the movie
  const t = ++OP.t;
  if (t === 1) sfx('charge');

  if (t === 6) sfx('hitH');
  if (t > 20 && t <= 20 + 8 * 7 && (t - 20) % 7 === 0) sfx('select'); // the eight runes light up
  if (t === OP_PRO - 12) sfx('super');
  const c = t - OP_PRO, ci = Math.floor(c / OP_CUT), k = c - ci * OP_CUT;
  if (false && c >= 0 && ci < OP_ROSTER.length) {
    if (k === 0) sfx('slash');
    if (k === 62) sfx(['slash', 'beam', 'hitH', 'orb', 'beam'][ci]);
    if (k === 70) sfx('hitH');
  }
  const cl = opClipAt(t);
  if (cl) { if (OP.clip !== cl.i || cl.k === 0) opStartClip(cl.i);
    const b = fighters[1]; if (b && b.hp < OP.lastHp - 30) { OP.slowT = 14; OP.punch = 18; } if (b) OP.lastHp = b.hp; // a heavy hit: punch in and slow down
    if (game.superFlash) OP.punch = 20;
    OP.half = !OP.half; if (OP.slowT > 0) OP.slowT--; if (OP.punch > 0) OP.punch--;
    if (!(OP.slowT > 0 && OP.half)) opSim(); // (slow motion: the action runs at half speed)
  } else OP.clip = -1;
  const d = t - OP_CLASH0, di = Math.floor(d / OP_CLASH), dk = d - di * OP_CLASH;
  if (d >= 0 && di < OP_CLASHES.length) { if (dk === 0) sfx('swing'); if (dk === 34) { sfx('hitH'); sfx('break'); } }
  if (t === OP_GROUP + 2) sfx('rise');
  if (t > OP_GROUP && (t - OP_GROUP) % 9 === 6 && t - OP_GROUP < 80) sfx('hitH'); // each fighter lands
  if (t === OP_GROUP + 86) { sfx('super'); sfx('ko'); }
  if (t >= OP_END + 420) endOpening(); // nobody pressed anything: go on to the title screen
}
const ease = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3), easeIn = x => Math.pow(clamp(x, 0, 1), 3);
function opPose(key, pose, x, y, facing, o = {}) { const p = typeof pose === 'string' ? POSES[pose] : pose; drawBody(key, p, x, y, facing, hipFor(p), o); }
function opSpeedLines(col, a, dir = -1, n = 26) { // streaks racing across the screen
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const y = (i * 97 + 31) % H, len = 120 + (i * 53) % 260, sp = 26 + (i % 5) * 9, x = ((i * 211 + globalT * sp) % (W + len)) - len;
    ctx.strokeStyle = `rgba(${col},${a * (0.25 + (i % 3) * 0.15)})`; ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath(); ctx.moveTo(dir < 0 ? W - x : x, y); ctx.lineTo(dir < 0 ? W - x - len : x + len, y); ctx.stroke();
  }
  ctx.restore();
}
function opBigText(txt, x, y, size, col, a = 1, align = 'center', italic = false) {
  ctx.save(); ctx.globalAlpha = a; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.font = `${italic ? 'italic ' : ''}${size}px ${HUD}`; ctx.lineWidth = size / 7; ctx.strokeStyle = 'rgba(10,6,24,.9)'; ctx.strokeText(txt, x, y);
  ctx.fillStyle = col; ctx.fillText(txt, x, y); ctx.restore();
}
function opFlash(a) { if (a > 0) { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(0, 0, W, H); } }
function opShock(x, y, r, col, a) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${col},${a})`; ctx.lineWidth = 6 * a + 1; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.35, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
function opBurst(x, y, r, col, a) { // rays bursting from a point
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 18; i++) { const an = i * Math.PI / 9 + globalT * 0.01; ctx.strokeStyle = `rgba(${col},${a * 0.6})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * r * 0.3, y + Math.sin(an) * r * 0.3); ctx.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r); ctx.stroke(); }
  const g = ctx.createRadialGradient(x, y, 2, x, y, r * 0.6); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function opBackdrop(col, k) { // a dark sky washed with the fighter's colour, and a diagonal band behind the name
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#07051a'); g.addColorStop(0.55, `rgba(${col},0.35)`); g.addColorStop(1, '#0b0820');
  ctx.fillStyle = '#07051a'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const off = (1 - ease(k / 18)) * 600;
  ctx.fillStyle = `rgba(${col},0.55)`; ctx.beginPath(); ctx.moveTo(W * 0.48 + off, 0); ctx.lineTo(W + off, 0); ctx.lineTo(W * 0.72 + off, H); ctx.lineTo(W * 0.2 + off, H); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.moveTo(W * 0.55 + off, 0); ctx.lineTo(W * 0.6 + off, 0); ctx.lineTo(W * 0.32 + off, H); ctx.lineTo(W * 0.27 + off, H); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, H - 70, W, 70);
}
function opCut(r, k) { // one fighter's moment: entrance, wind-up, the signature strike, name slammed across the screen
  const ch = CHARS[r.key], col = r.col, gy = H - 90;
  opBackdrop(col, k);
  opSpeedLines(col, k < 60 ? 1 : 0.5, -1);
  const zoom = 1.35 - 0.2 * ease(k / OP_CUT), cx = 330, cy = gy - 100;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(zoom, zoom); ctx.translate(-cx, -cy);
  const enter = ease(k / 30), x = lerp(-140, 300, enter);
  const ph = k < 40 ? 0 : k < 62 ? 1 : 2, pk = ph === 0 ? 1 : ph === 1 ? (k - 40) / 22 : (k - 62) / 8;
  const pose = ph === 0 ? POSES[r.pose[0]] : lerpPose(POSES[r.pose[ph - 1]], POSES[r.pose[ph]], clamp(pk, 0, 1));
  let y = gy, o = { aura: k > 30 };
  if (r.key === 'ninja') { // a shadow dash with clones behind him, then the rising slash
    for (let i = 3; i >= 1; i--) opPose('ninja', pose, x - i * 46 * (k < 40 ? 1 : 0.4), gy, 1, { tint: SHADOW_TINT, alpha: 0.18 * (4 - i) });
    if (k >= 62 && k < 90) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(200,170,255,${1 - (k - 62) / 28})`; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(x + 40, gy - 110, 120, Math.PI * 0.75, Math.PI * 1.9); ctx.stroke(); ctx.restore(); }
  }
  if (r.key === 'brawler' && k > 20 && k < 62) for (let i = 0; i < 10; i++) { const an = i * 0.63 + k * 0.2, rr = 90 - (k - 20) * 1.6; ctx.fillStyle = 'rgba(125,235,255,.8)'; ctx.beginPath(); ctx.arc(x + 20 + Math.cos(an) * rr, gy - 110 + Math.sin(an) * rr, 3, 0, Math.PI * 2); ctx.fill(); }
  if (r.key === 'brawler' && k >= 62) { const a = clamp(1 - (k - 100) / 40, 0, 1), L = Math.min(900, (k - 62) * 60); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, gy - 150, 0, gy - 70); g.addColorStop(0, 'rgba(125,235,255,0)'); g.addColorStop(0.5, `rgba(220,250,255,${a})`); g.addColorStop(1, 'rgba(125,235,255,0)');
    ctx.fillStyle = g; ctx.fillRect(x + 70, gy - 150, L, 80); ctx.restore(); opBurst(x + 80, gy - 110, 90, '125,235,255', a); }
  if (r.key === 'staff') { o.staffSpin = k < 62 ? globalT * 0.7 : null; if (k >= 40 && k < 70) y = gy - 160 * Math.sin(Math.PI * clamp((k - 40) / 30, 0, 1)); if (k < 70) o.staffExt = 0; else o.staffExt = 60;
    if (k >= 70) { const a = clamp(1 - (k - 70) / 40, 0, 1); opShock(x + 140, gy, 40 + (k - 70) * 8, '255,205,110', a); opBurst(x + 140, gy - 20, 110, '255,205,110', a); } }
  if (r.key === 'psychic') { y = gy - 10 - Math.sin(globalT * 0.08) * 6;
    for (let i = 0; i < 5; i++) { const an = globalT * 0.05 + i * 1.256; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = i % 2 ? 'rgba(130,190,255,.9)' : 'rgba(255,130,220,.9)';
      ctx.beginPath(); ctx.arc(x + Math.cos(an) * 80, gy - 110 + Math.sin(an) * 30, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    if (k >= 50) drawPsyFist(x + 150, gy - 110, 1.4 + (k > 62 ? 0.4 : 0), 1, clamp(1 - (k - 110) / 30, 0, 1), 0);
    if (k >= 62) for (let i = 0; i < 6; i++) { const sx = x + 150 + (k - 62) * (14 + i * 3), sy = gy - 170 + i * 22; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(210,240,255,.9)';
      ctx.beginPath(); ctx.moveTo(sx + 26, sy); ctx.lineTo(sx, sy - 6); ctx.lineTo(sx - 10, sy); ctx.lineTo(sx, sy + 6); ctx.closePath(); ctx.fill(); ctx.restore(); } }
  if (r.key === 'kappa' && k >= 62) { const px = x + 60 + (k - 62) * 12, py = gy - 150 + Math.sin((k - 62) * 0.2) * 10; ctx.save(); ctx.translate(px, py); ctx.scale(1, 0.4 + 0.3 * Math.abs(Math.sin(k * 0.4))); ctx.fillStyle = '#f4f7fb'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#7cc6ef'; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill(); ctx.restore(); o.plateOut = true; }
  if (r.key === 'gunman' && k >= 50) { for (let i = 0; i < 4; i++) { const bx = x + 80 + ((k - 50) * 30 + i * 70) % 600; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,230,150,.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx, gy - 118 + (i % 2) * 20); ctx.lineTo(bx - 30, gy - 118 + (i % 2) * 20); ctx.stroke(); ctx.restore(); }
    if ((k - 50) % 6 < 2) opBurst(x + 80, gy - 120, 50, '255,230,150', 0.8); }
  if (r.key === 'salary') { if (k >= 62 && k < 100) { drawWingsAt(x - 10, gy - 160, clamp((k - 62) / 15, 0, 1)); o.possess = 'angel'; } if (k >= 100) { o.possess = 'devil'; opBurst(x, gy - 110, 120, '255,90,60', clamp(1 - (k - 100) / 30, 0, 1)); } }
  if (r.key === 'paladin') { if (k > 10 && k < 70) drawWingsAt(x, gy - 160, clamp((k - 10) / 20, 0, 1)); if (k >= 62) o.staffExt = Math.min(320, (k - 62) * 40); o.wrist = k >= 40 ? 0 : 0.6; o.edge = k >= 62; }
  opPose(r.key, pose, x, y, 1, o);
  ctx.restore();
  // the name, slammed in
  const nk = clamp((k - 20) / 10, 0, 1), sc = 1 + (1 - ease(nk)) * 1.6;
  ctx.save(); ctx.translate(690, 250); ctx.scale(sc, sc); opBigText(nm(ch), 0, 0, game.lang === 'ja' ? 72 : 86, '#ffffff', nk, 'center', true); ctx.restore();
  opBigText(L(ch.title, ch.titleJa).toUpperCase(), 690, 318, 24, `rgb(${col})`, clamp((k - 34) / 12, 0, 1));
  if (k >= 62 && k < 70) opFlash(0.5 - (k - 62) * 0.06);
  if (k < 6) opFlash(0.9 - k * 0.15);
}
function drawWingsAt(x, y, k) { // the paladin's wings of light, for the movie
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const side of [-1, 1]) for (let i = 0; i < 7; i++) {
    const an = -Math.PI / 2 + side * (0.35 + i * 0.2) * k, L = (80 + i * 16) * k;
    ctx.strokeStyle = `rgba(${200 - i * 8},${228 - i * 4},255,${0.55 - i * 0.05})`; ctx.lineWidth = 10 - i * 0.8;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(an) * L * 0.6 - side * 10, y + Math.sin(an) * L * 0.4, x + Math.cos(an - side * 0.5) * L, y + Math.sin(an - side * 0.5) * L * 0.8); ctx.stroke();
  }
  ctx.restore();
}
function opClash(pair, k) { // two fighters charge in from both sides and collide in a burst of light
  const [a, b] = pair, ca = OP_ROSTER.find(r => r.key === a).col, cb = OP_ROSTER.find(r => r.key === b).col, gy = H - 90;
  const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, `rgba(${ca},.5)`); g.addColorStop(0.5, '#0a0718'); g.addColorStop(1, `rgba(${cb},.5)`);
  ctx.fillStyle = '#0a0718'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  opSpeedLines(ca, 0.6, 1, 14); opSpeedLines(cb, 0.6, -1, 14);
  const hit = k >= 34, e = ease(k / 34), shake = hit && k < 54 ? (54 - k) * 0.5 : 0;
  ctx.save(); ctx.translate(vrnd(-shake, shake), vrnd(-shake, shake));
  const zoom = hit ? 1.25 + (k - 34) * 0.002 : 1; ctx.translate(W / 2, gy - 100); ctx.scale(zoom, zoom); ctx.translate(-W / 2, -(gy - 100));
  const xa = hit ? W / 2 - 70 : lerp(-120, W / 2 - 70, e), xb = hit ? W / 2 + 70 : lerp(W + 120, W / 2 + 70, e);
  const atk = { ninja: 'uppercut', brawler: 'palm', staff: 'thrust', psychic: 'psyPush', paladin: 'pThrust' };
  opPose(a, hit ? atk[a] : 'dash', xa, gy, 1, { aura: true, staffExt: hit && a === 'staff' ? 40 : 0, wrist: 0 });
  opPose(b, hit ? atk[b] : 'dash', xb, gy, -1, { aura: true, staffExt: hit && b === 'staff' ? 40 : 0, wrist: 0 });
  if (hit) { const a2 = clamp(1 - (k - 34) / 50, 0, 1); opBurst(W / 2, gy - 110, 200, '255,240,200', a2); opShock(W / 2, gy, (k - 34) * 14, '255,255,255', a2); }
  ctx.restore();
  if (hit) { opBigText('VS', W / 2, 110, 64, '#ffd27a', clamp((k - 36) / 8, 0, 1), 'center', true); opFlash(k < 40 ? 1 - (k - 34) / 6 : 0); }
}
function opSky(k, warm) { // a night of wonders: aurora, a great moon, stars, drifting motes of every fighter's colour
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060418'); g.addColorStop(0.55, warm ? '#2a1450' : '#140c34'); g.addColorStop(1, '#090614');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 120; i++) { const x = (i * 197) % W, y = (i * 89) % (H * 0.7), tw = 0.3 + 0.7 * Math.abs(Math.sin(globalT * 0.03 + i * 1.7)); ctx.fillStyle = `rgba(255,255,255,${0.5 * tw})`; ctx.fillRect(x, y, i % 9 ? 1.5 : 2.5, i % 9 ? 1.5 : 2.5); }
  const cols = ['120,255,200', '150,120,255', '255,120,220'];
  for (let b = 0; b < 3; b++) { ctx.beginPath(); const y0 = 90 + b * 50; ctx.moveTo(0, y0);
    for (let x = 0; x <= W; x += 24) ctx.lineTo(x, y0 + Math.sin(x * 0.006 + globalT * 0.012 + b * 2) * 40 + Math.sin(x * 0.017 - globalT * 0.02) * 12);
    for (let x = W; x >= 0; x -= 24) ctx.lineTo(x, y0 + 70 + Math.sin(x * 0.006 + globalT * 0.012 + b * 2 + 0.6) * 46);
    ctx.closePath(); const ag = ctx.createLinearGradient(0, y0 - 40, 0, y0 + 110); ag.addColorStop(0, `rgba(${cols[b]},0)`); ag.addColorStop(0.5, `rgba(${cols[b]},${0.13 * clamp(k / 40, 0, 1)})`); ag.addColorStop(1, `rgba(${cols[b]},0)`); ctx.fillStyle = ag; ctx.fill(); }
  const mx = W * 0.5, my = 190, mr = 120; const mg = ctx.createRadialGradient(mx, my, mr * 0.6, mx, my, mr * 2.4); mg.addColorStop(0, 'rgba(255,230,190,.35)'); mg.addColorStop(1, 'rgba(255,230,190,0)'); ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mr * 2.4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#f6ead2'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(200,180,150,.35)'; for (const [cx, cy, cr] of [[-34, -20, 22], [30, 30, 16], [40, -40, 10], [-10, 50, 9]]) { ctx.beginPath(); ctx.arc(mx + cx, my + cy, cr, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#120a26'; ctx.beginPath(); ctx.moveTo(0, H); // far peaks
  for (let x = 0; x <= W; x += 40) ctx.lineTo(x, H - 150 - Math.abs(Math.sin(x * 0.011)) * 90 - Math.sin(x * 0.031) * 20); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const motes = OP_ROSTER.map(r => r.col);
  for (let i = 0; i < 60; i++) { const sp = 0.4 + (i % 5) * 0.15, x = (i * 151 + Math.sin(globalT * 0.01 + i) * 40) % W, y = H - ((globalT * sp + i * 67) % (H + 40)); ctx.fillStyle = `rgba(${motes[i % 8]},${0.55})`; ctx.beginPath(); ctx.arc(x, y, 1.5 + (i % 3), 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
// the closing shot: everyone arrives in their own way and holds their own pose, at different depths around the logo
const OP_TEAM = [ // back row first (drawn behind), then the front row
  { key: 'psychic', pose: 'idleL', x: 150, y: -70, sc: 0.8, f: 1, enter: 'fade', fx: 'orbs' },
  { key: 'paladin', pose: 'vSalute', x: 360, y: -40, sc: 0.84, f: 1, enter: 'drop', fx: 'wings' },
  { key: 'salary', pose: 'sTie', x: 620, y: -40, sc: 0.84, f: -1, enter: 'slide', fx: 'papers' },
  { key: 'staff', pose: 'cloudSit', x: 815, y: -95, sc: 0.8, f: -1, enter: 'drop', fx: 'cloud' },
  { key: 'kappa', pose: 'kIdle', x: 95, y: 0, sc: 1, f: 1, enter: 'jump', fx: 'water' },
  { key: 'ninja', pose: 'iaiStance', x: 265, y: 0, sc: 1, f: 1, enter: 'smoke', fx: 'shadow' },
  { key: 'brawler', pose: 'twinPalm', x: 690, y: 0, sc: 1, f: -1, enter: 'drop', fx: 'qi' },
  { key: 'gunman', pose: 'vTipHat', x: 870, y: 0, sc: 1, f: -1, enter: 'slide', fx: 'dust' },
];
function opGroup(k) { // everyone together, then the logo
  const gy = H - 70;
  opSky(k, true);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; // light rays from behind the moon
  for (let i = 0; i < 16; i++) { const an = -Math.PI / 2 + (i - 7.5) * 0.2 + Math.sin(globalT * 0.008 + i) * 0.03; ctx.fillStyle = `rgba(255,220,170,${(0.035 + (i % 3) * 0.015) * clamp(k / 30, 0, 1)})`;
    ctx.beginPath(); ctx.moveTo(W / 2, 190); ctx.lineTo(W / 2 + Math.cos(an - 0.05) * 1400, 190 + Math.sin(an - 0.05) * 1400); ctx.lineTo(W / 2 + Math.cos(an + 0.05) * 1400, 190 + Math.sin(an + 0.05) * 1400); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = '#0d0820'; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, gy - 6); ctx.quadraticCurveTo(W / 2, gy - 30, W, gy - 6); ctx.lineTo(W, H); ctx.closePath(); ctx.fill(); // the ridge they stand on
  const zoom = 1.18 - 0.18 * ease(k / 90); ctx.save(); ctx.translate(W / 2, gy); ctx.scale(zoom, zoom); ctx.translate(-W / 2, -gy);
  OP_TEAM.forEach((m, i) => {
    const ch = CHARS[m.key], col = OP_ROSTER.find(r => r.key === m.key).col, t0 = i * 9, e = clamp((k - t0) / 16, 0, 1); if (e <= 0) return;
    const ee = ease(e), back = m.sc < 1, baseY = gy + m.y;
    let x = m.x, y = baseY, a = 1;
    if (m.enter === 'drop') y = baseY - (1 - ee) * 420; // falls out of the sky
    if (m.enter === 'slide') x = m.x - m.f * (1 - ee) * 500;
    if (m.enter === 'jump') y = baseY - Math.sin(Math.PI * e) * 120 - (1 - ee) * 60, x = m.x - m.f * (1 - ee) * 160;
    if (m.enter === 'fade' || m.enter === 'smoke') a = ee;
    const life = k - t0, bob = m.key === 'psychic' || m.key === 'staff' ? Math.sin(globalT * 0.06 + i) * 6 : 0;
    const p = { ...POSES[m.pose] }; p.t += Math.sin(globalT * 0.07 + i) * 1.2; // breathing
    ctx.save(); ctx.translate(x, y + bob); ctx.scale(m.sc, m.sc); ctx.translate(-x, -(y + bob));
    if (m.fx === 'wings' && life > 16) drawWingsAt(x - m.f * 6, y - 160 * ch.scale, clamp((life - 16) / 20, 0, 1));
    if (m.fx === 'cloud') for (let c = 0; c < 6; c++) { ctx.fillStyle = c % 2 ? '#fff6e6' : '#ffe9c4'; ctx.globalAlpha = 0.92 * ee; ctx.beginPath(); ctx.arc(x - 55 + c * 22, y - 54 + Math.sin(globalT * 0.08 + c) * 3, 19 - Math.abs(c - 2.5) * 2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    if (m.fx === 'qi' && life > 16) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = 80 + 6 * Math.sin(globalT * 0.25); const qg = ctx.createRadialGradient(x - m.f * 70, y - 110, 4, x - m.f * 70, y - 110, r); qg.addColorStop(0, 'rgba(220,250,255,.8)'); qg.addColorStop(1, 'rgba(125,235,255,0)'); ctx.fillStyle = qg; ctx.beginPath(); ctx.arc(x - m.f * 70, y - 110, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    if (m.fx === 'shadow' && life > 10) for (let c = 2; c >= 1; c--) opPose(m.key, p, x - m.f * c * 34, y, m.f, { tint: SHADOW_TINT, alpha: 0.16 * (3 - c) * ee });
    const glow = ctx.createRadialGradient(x, y, 2, x, y, 90); glow.addColorStop(0, `rgba(${col},${0.45 * ee})`); glow.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = glow; ctx.beginPath(); ctx.ellipse(x, y, 90, 18, 0, 0, Math.PI * 2); ctx.fill();
    opPose(m.key, p, x, y, m.f, { alpha: a * (back ? 0.93 : 1), aura: life > 30, wrist: 0.6, gunOut: true, staffSpin: m.key === 'staff' && life < 30 ? globalT * 0.7 : null });
    if (m.fx === 'orbs') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let o = 0; o < 5; o++) { const an = globalT * 0.05 + o * 1.256; ctx.fillStyle = o % 2 ? 'rgba(130,190,255,.9)' : 'rgba(255,130,220,.9)'; ctx.beginPath(); ctx.arc(x + Math.cos(an) * 70, y - 100 + Math.sin(an) * 24, 6, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
    if (m.enter !== 'fade' && life >= 16 && life < 40) { const q = (life - 16) / 24; opShock(x, y, 30 + q * 120, col, 1 - q); if (life < 22) opBurst(x, y - 40, 90, col, 1 - (life - 16) / 6); } // the landing
    if (m.enter === 'smoke' && life < 24) { ctx.save(); ctx.globalAlpha = 1 - life / 24; ctx.fillStyle = 'rgba(120,90,170,.7)'; for (let c = 0; c < 8; c++) { ctx.beginPath(); ctx.arc(x + Math.cos(c * 0.8) * (20 + life * 2), y - 70 + Math.sin(c * 1.3) * (30 + life), 18 + life, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
    ctx.restore();
  });
  ctx.restore();
  // the logo: a sword-slash of light, then the title slams in
  const L0 = 86;
  if (k >= L0 - 10 && k < L0 + 4) { const q = (k - (L0 - 10)) / 14; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,240,210,${1 - q * 0.5})`; ctx.lineWidth = 10 * (1 - q) + 2; ctx.beginPath(); ctx.moveTo(-100 + q * 200, 220); ctx.lineTo(W * q * 1.3, 90); ctx.stroke(); ctx.restore(); }
  if (k >= L0) { const lk = clamp((k - L0) / 10, 0, 1), sc = 1 + (1 - ease(lk)) * 2.2;
    if (k < L0 + 14) opFlash(0.8 - (k - L0) * 0.06);
    ctx.save(); ctx.translate(W / 2, 112); ctx.scale(sc, sc);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(0, 0, 10, 0, 0, 300); lg.addColorStop(0, `rgba(255,170,200,${0.35 * lk})`); lg.addColorStop(1, 'rgba(255,170,200,0)'); ctx.fillStyle = lg; ctx.fillRect(-320, -120, 640, 240); ctx.restore();
    ctx.font = `84px ${HUD}`; const w1 = ctx.measureText('SHADOW').width, w3 = ctx.measureText('QI').width; ctx.font = `72px ${HUD}`; const w2 = ctx.measureText('✕').width, gap = 22, tot = w1 + w2 + w3 + gap * 2;
    opBigText('SHADOW', -tot / 2 + w1 / 2, 0, 84, '#ffffff', lk); opBigText('✕', -tot / 2 + w1 + gap + w2 / 2, 0, 72, '#ff6b8a', lk); opBigText('QI', tot / 2 - w3 / 2, 0, 84, '#ffffff', lk);
    if (k > L0 + 14) { const sx = ((k - L0 - 14) * 14) % 900 - 450; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sg = ctx.createLinearGradient(sx - 60, 0, sx + 60, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,.35)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(-tot / 2 - 20, -50, tot + 40, 100); ctx.restore(); } // a gleam runs across the title
    ctx.restore();
    opBigText(L('EIGHT WARRIORS. ONE STAGE.', '八人の戦士。ひとつの舞台。'), W / 2, 178, 22, '#ffd27a', clamp((k - L0 - 18) / 15, 0, 1));
    if (k > L0 + 20) opShock(W / 2, 112, 300 + Math.sin(globalT * 0.05) * 8, '255,210,140', 0.22);
  }
  if (k > L0 + 40 && globalT % 50 < 32) opBigText(IS_MOBILE ? L('TAP TO START', 'タップで開始') : L('PRESS ENTER', 'Enterキーで開始'), W / 2, H - 22, 20, '#ffffff', 1);
}
function renderOpening() {
  const t = OP.t;
  ctx.fillStyle = '#05040f'; ctx.fillRect(0, 0, W, H);
  if (t < OP_PRO) { // prologue: a magic circle draws itself across the night sky, its eight runes lighting up one by one
    opSky(t, false);
    const cx = W / 2, cy = H / 2 + 10, R0 = 170, draw = ease(t / 40), spin = t * 0.01, z = 1 + easeIn(clamp((t - (OP_PRO - 30)) / 30, 0, 1)) * 2.4;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.rotate(spin); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,215,150,.85)'; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(255,200,120,.9)'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(0, 0, R0, 0, Math.PI * 2 * draw); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, R0 * 0.82, Math.PI, Math.PI + Math.PI * 2 * draw); ctx.stroke();
    if (t > 14) { const sk = ease((t - 14) / 30); ctx.beginPath(); for (let i = 0; i <= 8; i++) { const an = -Math.PI / 2 + i * Math.PI * 2 * 3 / 8; const pt = [Math.cos(an) * R0 * 0.82, Math.sin(an) * R0 * 0.82]; if (i === 0) ctx.moveTo(...pt); else if (i / 8 <= sk) ctx.lineTo(...pt); } ctx.stroke(); } // an eight-pointed star
    ctx.font = `18px ${HUD}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    OP_ROSTER.forEach((r, i) => { const on = t > 20 + i * 7, an = -Math.PI / 2 + i * Math.PI / 4, x = Math.cos(an) * R0, y = Math.sin(an) * R0;
      if (!on) return; const a = clamp((t - 20 - i * 7) / 6, 0, 1);
      const g = ctx.createRadialGradient(x, y, 1, x, y, 34); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(0.4, `rgba(${r.col},${a})`); g.addColorStop(1, `rgba(${r.col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.translate(x, y); ctx.rotate(-spin); ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillText('ᚠᚢᚦᚨᚱᚲᚷᚹ'[i], 0, 1); ctx.restore(); });
    ctx.restore();
    const l1 = clamp((t - 74) / 10, 0, 1) * clamp((OP_PRO - 6 - t) / 8, 0, 1), sc = 1 + 0.25 * (1 - ease((t - 74) / 14));
    opBigText(L('EIGHT WARRIORS. ONE STAGE.', '八人の戦士、ひとつの舞台。'), W / 2, H / 2 + 10, 46 * sc, '#ffe7b0', l1, 'center', true);
    if (t > OP_PRO - 14) opFlash((t - (OP_PRO - 14)) / 14);
  } else if (t < OP_CLASH0) {
    const cl = opClipAt(t);
    if (cl && OP.clip === cl.i && fighters.length) opRenderClip(cl.i, cl.k); else { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); }
  } else if (t < OP_GROUP) {
    const d = t - OP_CLASH0, i = Math.floor(d / OP_CLASH); opClash(OP_CLASHES[i], d - i * OP_CLASH);
  } else opGroup(t - OP_GROUP);
  // letterbox, and how to skip
  ctx.fillStyle = '#000'; if (t < OP_GROUP) { ctx.fillRect(0, 0, W, 34); ctx.fillRect(0, H - 34, W, 34); }
  if (t < OP_GROUP) { ctx.font = SMALL; ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillText(OP.soundAsked ? L('🔇 Click or press a key for sound', '🔇 クリックかキーでサウンドON') : L('Any key: skip', '何かキーでスキップ'), W - 14, H - 12); }
}
function showSplash() { // the first screen: a click or key starts the opening movie (and lets the browser play sound)
  game.mode = 'splash'; ov.hidden = false;
  ov.innerHTML = `<div class="panel"><div class="logo">SHADOW <span>✕</span> QI</div>
    <div class="row"><button class="go" data-act="opening">${L('▶ START', '▶ スタート')}</button><button class="ghost" data-act="skipop">${L('Skip the opening', 'オープニングをとばす')}</button></div>
    <div class="hint">${L('Press any key to start.', '何かキーを押すと始まります。')}</div></div>`;
  bindOverlay();
}

function render() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, W, H);
  if (game.mode === 'opening') { renderOpening(); return; }
  const sh = game.shake, sx = sh ? vrnd(-sh, sh) : 0, sy = sh ? vrnd(-sh, sh) * 0.6 : 0;
  ctx.save(); ctx.translate(sx, sy);
  ctx.drawImage(bg, 0, 0, W, H);
  if (game.mode === 'menu' || !fighters.length) { drawPreview(); ctx.restore(); return; }
  if (game.superFlash) drawSuperFX(false);
  for (const f of fighters) if (!f.hidden && !f.shadow) drawShadow(f.x, f.y, f.ch.scale);
  const behind = t => t === 'clone' || t === 'decoy' || t === 'guardShadow';
  for (const p of projs) if (behind(p.type)) drawProj(p);
  for (const f of fighters) if (f.spirit) drawSpirit(f); // Kuro's spirit animals, behind everyone
  const order = [...fighters].sort((p, q) => (p.state === 'attack' ? 1 : 0) - (q.state === 'attack' ? 1 : 0));
  for (const f of order) drawFighter(f);
  for (const p of projs) if (!behind(p.type)) drawProj(p);
  drawParts();
  ctx.restore();
  drawHUD();
  if (!game.paused) drawAnnounce(); // keep round banners from showing through the pause menu
  if (game.superFlash) drawSuperFX(true);
}
let last = performance.now(), acc = 0;
const STEP = 1000 / 60;
function loop(now) {
  acc += Math.min(100, now - last); last = now;
  if (NET.on && game.mode === 'fight') { while (acc >= STEP) { if (!netStep()) { acc = Math.min(acc, STEP); break; } acc -= STEP; } }
  else while (acc >= STEP) { tick(); acc -= STEP; }
  render();
  if ((++touchTick & 7) === 0) { updateTouchUI(); updateMoveList(); } // (the touch controls and the rotate screen, checked a few times a second)
  requestAnimationFrame(loop);
}
let touchTick = 0;

