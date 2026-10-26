'use strict';
/* ================= particles ================= */
// glowing qi fissures in the floor where Tetsu lands a heavy blow
function cracks(x) {
  const rays = [];
  for (let i = 0; i < 6; i++) {
    const dir = i < 3 ? -1 : 1, pts = [[x, GROUND]];
    let cx = x, cy = GROUND;
    for (let k = 0, n = 3 + (R() * 3 | 0); k < n; k++) { cx += dir * rnd(10, 24); cy += rnd(-1, 4); pts.push([cx, cy]); }
    rays.push(pts);
  }
  parts.push({ type: 'crack', x, y: GROUND, rays, life: 42, max: 42 });
}
// per-frame particles for Tetsu's techniques
const FX_TICK = {
  comet(f, mv) { // a qi comet tail
    if (f.mf > mv.startup - 4 && f.mf <= mv.startup + mv.active + 4)
      for (let i = 0; i < 2; i++) parts.push({ type: 'aura', x: f.x + rnd(-12, 12), y: GROUND - f.y - rnd(30, 100) * f.ch.scale, vx: -f.facing * rnd(0.4, 1.4), vy: rnd(-1.5, -0.3), life: 18, max: 18, r: rnd(4, 8), col: f.ch.fxCol });
  },
  helix(f, mv) { // a qi dragon coiling up around the rising fist
    if (f.mf > mv.startup && f.mf <= mv.startup + mv.active + 2) for (let k = 0; k < 2; k++) {
      const a = f.mf * 0.9 + k * Math.PI;
      parts.push({ type: 'aura', x: f.x + f.facing * (28 + Math.cos(a) * 20) * f.ch.scale, y: GROUND - f.y - (95 + Math.sin(a) * 8) * f.ch.scale, vx: 0, vy: -2.2, life: 16, max: 16, r: 5.5 - k, col: k ? '220,255,255' : '125,235,255' });
    }
  },
  fists(f, mv) { // afterimages of each punch in the air flurry
    if (f.mf > mv.startup && f.mf <= mv.startup + mv.active && f.mf % 3 === 0)
      parts.push({ type: 'ring', x: f.x + f.facing * rnd(72, 96) * f.ch.scale, y: GROUND - f.y - rnd(88, 116) * f.ch.scale, r: 4, vr: 2.6, life: 9, max: 9, col: f.ch.fxCol });
  },
};
// qi drawn in toward his fists while he gathers it
// qi gathering into a fighter: motes and streaks drawn in from all around, shrinking rings, a swirl at the feet (k = 0..1 strength)
function qiGather(f, t, k, col) {
  const s = f.ch.scale, cx = f.x, cy = GROUND - f.y - 95 * s, c = col || f.ch.auraCol;
  if (t % 2 === 0) for (let i = 0; i < 1 + Math.round(k * 2); i++) {
    const a = R() * Math.PI * 2, r = rnd(80, 130) * (0.8 + k * 0.4), px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * 0.8;
    parts.push({ type: i % 2 ? 'spark' : 'aura', x: px, y: py, vx: (cx - px) / 11, vy: (cy - py) / 11, life: 11, max: 11, r: rnd(2.5, 4.5), col: c });
  }
  if (t % 9 === 0) parts.push({ type: 'ring', x: cx, y: cy, r: 70 + k * 40, vr: -(6 + k * 4), life: 10, max: 10, col: c });
  if (t % 5 === 0) parts.push({ type: 'aura', x: cx + rnd(-30, 30) * s, y: GROUND - 6, vx: 0, vy: -rnd(1.5, 3) * (1 + k), life: 18, max: 18, r: rnd(2, 4), col: c });
}
function gatherFX(f) {
  const s = f.ch.scale, hx = f.x - f.facing * 8 * s, hy = GROUND - f.y - 80 * s;
  if (f.pre % 2 === 0) {
    const a = R() * Math.PI * 2, r = rnd(42, 64);
    parts.push({ type: 'aura', x: hx + Math.cos(a) * r, y: hy + Math.sin(a) * r, vx: -Math.cos(a) * r / 10, vy: -Math.sin(a) * r / 10, life: 10, max: 10, r: rnd(3, 5.5), col: f.ch.auraCol });
  }
  if (f.pre % 6 === 0) parts.push({ type: 'ring', x: hx, y: hy, r: 30, vr: -2.4, life: 10, max: 10, col: f.ch.auraCol });
}
// lightning crackling around Kuro's hands while he casts
function crackle(f) {
  parts.push({ type: 'spark', x: f.x + f.facing * rnd(5, 28), y: GROUND - f.y - rnd(85, 120), vx: rnd(-3, 3), vy: rnd(-3, 3), life: rnd(5, 9), max: 9, col: '190,225,255' });
}
// sparks or flames on a stunned fighter
function stunFX(f) {
  const s = f.ch.scale, x = f.x + rnd(-22, 22) * s, y = GROUND - f.y - rnd(20, 150) * s;
  if (f.stunKind === 'shock') {
    parts.push({ type: 'bolt', x, y, x1: x + rnd(-24, 24), y1: y + rnd(-24, 24), life: 5, max: 5 });
    parts.push({ type: 'spark', x, y, vx: rnd(-3, 3), vy: rnd(-3, 3), life: 6, max: 6, col: '200,230,255' });
  } else if (f.stunKind === 'psy') { // held in a psychic grip
    parts.push({ type: 'ring', x: f.x, y: GROUND - f.y - rnd(30, 140) * s, r: 26, vr: -1.2, life: 12, max: 12, col: '255,150,235' });
  } else if (f.stunKind === 'dance') { // hopping from foot to foot while bullets kick up the dust
    if (f.st % 6 === 0) parts.push({ type: 'spark', x: x + rnd(-20, 20), y: GROUND - 4, vx: rnd(-1, 1), vy: -rnd(2, 4), life: 10, max: 10, col: '220,200,160' });
  } else if (f.stunKind === 'wet') { // dripping wet and dizzy
    parts.push({ type: 'aura', x, y, vx: 0, vy: 1.6, life: 14, max: 14, r: 3, col: '150,215,255' });
  } else if (f.stunKind === 'holy') { // dazed by the shield: little golden stars
    parts.push({ type: 'star', x, y: GROUND - f.y - rnd(120, 165) * s, vx: rnd(-0.6, 0.6), vy: -0.3, r: rnd(3, 5), vr: -0.1, life: 16, max: 16, col: '255,225,140', rot: R() * 3 });
  } else if (f.stunKind === 'shadow') { // shadow wisps clinging to them
    parts.push({ type: 'aura', x, y, vx: rnd(-0.6, 0.6), vy: -rnd(0.4, 1.2), life: rnd(14, 22), max: 22, r: rnd(3, 6), col: '150,110,230' });
    if (R() < 0.3) parts.push({ type: 'smoke', x, y, vx: rnd(-0.3, 0.3), vy: -0.5, r: rnd(6, 10), vr: 0.4, life: 18, max: 18, col: '40,25,70' });
  } else {
    parts.push({ type: 'aura', x, y, vx: rnd(-0.4, 0.4), vy: -rnd(1, 2.4), life: rnd(12, 20), max: 20, r: rnd(3, 6), col: '255,150,60' });
    if (R() < 0.3) parts.push({ type: 'smoke', x, y: y - 20, vx: rnd(-0.3, 0.3), vy: -0.8, r: rnd(6, 10), vr: 0.4, life: 20, max: 20, col: '90,80,90' });
  }
}
// each fighter's hits burst in their own style
function hitFX(a, x, y, big, side) {
  const col = a.ch.fxCol || a.ch.auraCol, k = a.ch.hitFx;
  if (k === 'hex') parts.push({ type: 'hex', x, y, r: 6, vr: big ? 5 : 3.4, life: 14, max: 14, col, rot: R() * Math.PI });
  else if (k === 'slash') parts.push({ type: 'slashx', x, y, r: big ? 34 : 24, life: 10, max: 10, col, rot: rnd(-0.5, 0.5) });
  else if (k === 'star') parts.push({ type: 'star', x, y, r: 6, vr: big ? 4.5 : 3, life: 14, max: 14, col, rot: R() * Math.PI });
  else if (k === 'claw') { parts.push({ type: 'claw', x, y, rot: rnd(-0.7, 0.7), r: big ? 56 : 40, dir: 1, life: 12, max: 12, col: '235,255,240' }); for (let i = 0; i < 4; i++) { const an = R() * Math.PI * 2; parts.push({ type: 'aura', x, y, vx: Math.cos(an) * 3, vy: Math.sin(an) * 3 - 1, life: 12, max: 12, r: 2.5, col: '150,215,255' }); } }
  else if (k === 'paper') { for (let i = 0; i < 4; i++) parts.push({ type: 'spark', x, y, vx: rnd(-4, 4), vy: rnd(-5, 1), life: 14, max: 14, col: '245,245,250' }); parts.push({ type: 'ring', x, y, r: 4, vr: big ? 4 : 3, life: 10, max: 10, col: '220,225,235' }); }
  else if (k === 'gun') { parts.push({ type: 'star', x, y, r: 5, vr: big ? 4 : 2.6, life: 10, max: 10, col: '255,230,150', rot: R() * Math.PI }); parts.push({ type: 'ring', x, y, r: 3, vr: 3, life: 10, max: 10, col: '255,240,200' }); }
  else if (k === 'splash') { for (let i = 0; i < 6; i++) { const an = R() * Math.PI * 2; parts.push({ type: 'aura', x, y, vx: Math.cos(an) * 3, vy: Math.sin(an) * 3 - 1, life: 14, max: 14, r: 3, col: '150,215,255' }); } parts.push({ type: 'ring', x, y, r: 4, vr: big ? 4 : 3, life: 12, max: 12, col: '150,215,255' }); }
  else if (k === 'flame') { parts.push({ type: 'slashx', x, y, r: big ? 30 : 20, life: 10, max: 10, col: '255,110,50', rot: rnd(-0.5, 0.5) }); for (let i = 0; i < 5; i++) parts.push({ type: 'aura', x: x + rnd(-10, 10), y: y + rnd(-10, 10), vx: 0, vy: -rnd(1, 2.5), life: 16, max: 16, r: 3.5, col: '255,120,40' }); }
  else if (k === 'holy') { parts.push({ type: 'slashx', x, y, r: big ? 30 : 20, life: 10, max: 10, col, rot: Math.PI / 4 }); parts.push({ type: 'ring', x, y, r: 4, vr: big ? 4.2 : 2.8, life: 14, max: 14, col }); }
  else if (k === 'ripple') { parts.push({ type: 'ring', x, y, r: 4, vr: big ? 4.5 : 3, life: 16, max: 16, col }); parts.push({ type: 'ring', x, y, r: 2, vr: big ? 2.6 : 1.8, life: 20, max: 20, col: '255,240,255' }); }
  if (big) for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + rnd(-0.2, 0.2); parts.push({ type: 'speed', x: x + Math.cos(an) * 14, y: y + Math.sin(an) * 14, vx: Math.cos(an) * 7, vy: Math.sin(an) * 7, life: 7, max: 7, col: '255,255,255' }); }
}
function cloudPuff(x, y) { // a little golden-white cloud (Mei's jumps and Cloud Somersault)
  for (let i = 0; i < 7; i++) parts.push({ type: 'smoke', x: x + rnd(-18, 18), y: y + rnd(-4, 6), vx: rnd(-1.2, 1.2), vy: rnd(-0.3, 0.3), r: rnd(6, 11), vr: 0.3, life: rnd(16, 24), max: 24, col: '255,244,214' });
}
// a little life in each fighter's stance
function ambientFX(f) {
  const s = f.ch.scale, x = f.x, y = GROUND - f.y;
  if (f.key === 'ninja') parts.push({ type: 'smoke', x: x + rnd(-24, 24), y: y - rnd(0, 10), vx: rnd(-0.3, 0.3), vy: -rnd(0.3, 0.8), r: rnd(4, 7), vr: 0.25, life: 22, max: 22, col: '70,45,120' });
  else if (f.key === 'brawler') parts.push({ type: 'aura', x: x + f.facing * rnd(10, 34) * s, y: y - rnd(70, 110) * s, vx: 0, vy: -rnd(0.4, 1), life: 16, max: 16, r: rnd(1.5, 2.6), col: '125,235,255' });
  else if (f.key === 'staff') parts.push({ type: 'aura', x: x + f.facing * rnd(40, 90) * s, y: y - rnd(80, 140) * s, vx: rnd(-0.2, 0.2), vy: -rnd(0.2, 0.6), life: 18, max: 18, r: rnd(1.2, 2.2), col: '255,215,120' });
  else if (f.key === 'kappa') parts.push({ type: 'aura', x: x + rnd(-16, 16) * s, y: y - rnd(150, 170) * s, vx: 0, vy: -rnd(0.2, 0.5), life: 16, max: 16, r: rnd(1.4, 2.4), col: '160,220,255' });
  else if (f.key === 'gunman') { if (R() < 0.4) parts.push({ type: 'smoke', x: x + f.facing * rnd(40, 60) * s, y: y - rnd(90, 110) * s, vx: 0, vy: -0.5, r: rnd(2, 4), vr: 0.15, life: 18, max: 18, col: '200,190,170' }); }
  else if (f.key === 'salary') { const c = f.ch.possess === 'angel' ? '255,235,160' : f.ch.possess === 'devil' ? '255,90,60' : null; if (c) parts.push({ type: 'aura', x: x + rnd(-30, 30) * s, y: y - rnd(40, 170) * s, vx: 0, vy: -rnd(0.4, 1), life: 18, max: 18, r: rnd(1.5, 3), col: c }); }
  else if (f.key === 'paladin') parts.push({ type: 'aura', x: x + rnd(-30, 30) * s, y: y - rnd(60, 160) * s, vx: 0, vy: -rnd(0.3, 0.7), life: 18, max: 18, r: rnd(1.2, 2.2), col: '200,230,255' });
  else if (f.key === 'psychic') parts.push({ type: 'star', x: x + rnd(-40, 40), y: y - rnd(30, 170) * s, vx: 0, vy: -0.4, r: rnd(3, 5), vr: -0.15, life: 20, max: 20, col: '255,170,240', rot: R() * 3 });
}
function sparks(x, y, kind) {
  const col = kind === 'block' ? '150,225,255' : kind === 'clash' ? '255,245,170' : '255,215,110';
  const n = kind === 'big' ? 16 : 9;
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2, s = rnd(3, kind === 'big' ? 11 : 7);
    parts.push({ type: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(8, 16), max: 16, col });
  }
  parts.push({ type: 'ring', x, y, r: 5, vr: kind === 'big' ? 5.5 : 3.5, life: 12, max: 12, col });
  if (kind === 'big') parts.push({ type: 'ring', x, y, r: 2, vr: 8, life: 9, max: 9, col: '255,255,255' });
}
function puff(x, h) {
  for (let i = 0; i < 12; i++) parts.push({ type: 'smoke', x: x + rnd(-22, 22), y: GROUND - h + rnd(-45, 45), vx: rnd(-1, 1), vy: rnd(-1.2, 0.2), r: rnd(9, 18), vr: 0.55, life: rnd(22, 34), max: 34, col: '200,195,220' });
}
function dustAt(x, big) {
  for (let i = 0; i < (big ? 10 : 5); i++) parts.push({ type: 'smoke', x: x + rnd(-20, 20), y: GROUND - rnd(0, 8), vx: rnd(-1.5, 1.5), vy: -rnd(0.2, 1), r: rnd(4, 8), vr: 0.35, life: rnd(14, 22), max: 22, col: '190,160,150' });
}
function auraParticle(f) {
  parts.push({ type: 'aura', x: f.x + rnd(-28, 28), y: GROUND - f.y - rnd(5, 120), vx: rnd(-0.3, 0.3), vy: -rnd(1.2, 2.8), life: rnd(16, 28), max: 28, r: rnd(1.8, 3.6), col: f.ch.auraCol });
}
function popText(x, y, text, col) {
  if (game.lang === 'ja') text = JA_POP[text] || text.replace(/^(\d+) RAYS$/, '光線×$1');
  parts.push({ type: 'text', x: clamp(x, 90, W - 90), y, vx: 0, vy: -0.7, life: 55, max: 55, text, col });
}
function wisp(f) {
  parts.push({ type: 'aura', x: f.x + rnd(-30, 30), y: GROUND - rnd(0, 6), vx: rnd(-0.3, 0.3), vy: -rnd(0.6, 1.6), life: rnd(14, 24), max: 24, r: rnd(2, 4), col: '150,110,230' });
}
function updateParts() {
  for (const p of parts) {
    if (p.delay > 0) { p.delay--; continue; }
    p.x += p.vx || 0; p.y += p.vy || 0; p.life--;
    if (p.type === 'spark') { p.vx *= 0.86; p.vy *= 0.86; }
    if (p.vr) p.r += p.vr;
  }
  for (let i = parts.length - 1; i >= 0; i--) if (parts[i].life <= 0) parts.splice(i, 1);
}

/* ================= round flow ================= */
function startMatch(training, watch, demo) {
  initAudio();
  game.demo = !!demo; game.training = !!training || game.demo; game.watch = !!watch && !game.training; // watch: CPU vs CPU, demo: Kuro sample combos
  const p1 = game.p1Char;
  if (game.p2Char === p1) game.p2Char = CHAR_ORDER.find(k => k !== p1);
  const p2 = game.demo ? DEMO_VS[p1] : game.p2Char; // sample combos always play against the same partner
  fighters = [makeFighter(p1, 0, game.demo ? new DemoCtrl() : game.watch ? new CPU() : new Human(MAPS.p1)), makeFighter(p2, 1, game.training ? new Dummy() : new CPU())];
  if (p1 === p2) fighters[1].alt = true; // mirror match: the second fighter wears the second palette
  game.mode = 'fight'; game.paused = false;
  if (game.training) game.dummyMode = game.demo ? 'stand' : 'guard'; // training starts with the dummy guarding automatically
  updateTbar();
  ov.hidden = true; ov.innerHTML = '';
  startRound(1);
  if (game.demo) setupDemo(0);
  pressed.clear(); keys.clear();
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
}
function startRound(n) {
  for (const f of fighters) { f.shieldOut = false; f.brands = 0; f.plateOut = false; f.possT = 0; f.guardSlowT = 0; f.poisonT = 0; f.venom = 0; f.venomT = 0; if (CHARS[f.key]) f.ch = CHARS[f.key]; }
  Object.assign(game, { finalWin: null, round: n, phase: 'intro', phaseT: 0, timer: 99 * 60, freeze: 0, slow: 0, shake: 0, combo: null, superFlash: null, roundWinner: null, track: null, advInfo: null });
  projs.length = 0; parts.length = 0;
  fighters.forEach(resetFighter);
  fighters.forEach(updatePose);
}
function resetPositions() {
  for (const f of fighters) { if (CHARS[f.key]) f.ch = CHARS[f.key]; f.possT = 0; f.plateOut = false; f.poisonT = 0; f.venom = 0; f.spirit = null; } // (a sample combo starts the salaryman unpossessed)
  projs.length = 0; game.track = null; game.advInfo = null; game.combo = null; game.routeName = null; fighters.forEach(f => { f.sorbs = []; });
  for (const f of fighters) resetFighter(f);
  fighters.forEach(updatePose);
}
// training: record the last attack that connected and measure who recovers first
function trackAdv(a, d, kind, label) {
  if (game.training) game.track = { a, d, kind, label: label || 'Attack', t: game.frame, aF: null, dF: null, kd: false };
}
function updateTrack() {
  const tr = game.track;
  if (!tr) return;
  const free = f => f.state === 'stand' || f.state === 'crouch' || f.state === 'guard' || f.state === 'charge' || f.state === 'jump' || f.state === 'recover';
  if (tr.d.state === 'knock' && tr.d.juggle) tr.launch = true;
  if (tr.d.state === 'knock' || tr.d.state === 'down') tr.kd = true;
  if (tr.aF === null && free(tr.a)) tr.aF = game.frame;
  if (tr.dF === null && free(tr.d)) tr.dF = game.frame;
  const done = tr.aF !== null && tr.dF !== null;
  if (!done && game.frame - tr.t < 240) return;
  game.track = null;
  const who = tr.a.side === 0 ? L('Your attack.', 'あなたの攻撃。') : L('Dummy’s attack.', 'ダミーの攻撃。');
  if (tr.kind === 'gbreak') { game.advInfo = { text: `${tr.label}: ${L('guard break', 'ガードブレイク')}`, col: '#ff8a9a', note: `${who} ${L('The guard meter ran out.', 'ガードゲージが尽きた。')}` }; return; }
  if (tr.launch) { game.advInfo = { text: `${tr.label}: ${L('launch', '打ち上げ')}`, col: '#ffd27a', note: `${who} ${L('Keep hitting them while they’re in the air.', '空中にいる間に追撃しよう。')}` }; return; }
  if (tr.kd) { game.advInfo = { text: `${tr.label}: ${L('knockdown', 'ダウン')}`, col: '#ffe066', note: `${who} ${L('The defender is knocked down.', '相手はダウンした。')}` }; return; }
  if (!done) return;
  const adv = tr.dF - tr.aF, num = adv > 0 ? '+' + adv : adv < 0 ? '−' + (-adv) : '±0';
  let note = who;
  const near = Math.abs(tr.a.x - tr.d.x) < 115;
  if (tr.kind === 'block') note += adv >= 0 ? L(' Safe: the attacker recovers first.', ' 安全：攻撃側が先に動ける。') : adv > -7 ? L(' Slightly minus, but too quick to punish.', ' 少し不利だが反撃は間に合わない。') : near ? L(' Punishable with a light attack.', ' 弱攻撃で反撃できる。') : L(' Minus, but too far away to punish.', ' 不利だが遠くて反撃できない。');
  game.advInfo = { text: L(`${tr.label} on ${tr.kind === 'block' ? 'guard' : 'hit'}: ${num}`, `${tr.label}（${tr.kind === 'block' ? 'ガード' : 'ヒット'}）：${num}`), col: adv >= 0 ? '#8ff0a4' : '#ff8a9a', note };
}
function trainingUpkeep() {
  for (const f of fighters) {
    const hurt = f.state === 'hitstun' || f.state === 'knock' || f.state === 'down' || f.state === 'getup' || f.state === 'roll' || f.state === 'slashed' || f.state === 'recover' || f.state === 'blockstun' || f.state === 'gbreak';
    f.calm = hurt ? 0 : f.calm + 1;
    if (f.calm > 50 && f.hp < 1000 && !(f.healT > 0)) f.hp = 1000;
    if (f.side === 0 && game.mpFull && f.state !== 'attack' && f.meter < 100) f.meter = 100;
  }
  updateTrack();
}
function endRound() {
  const w = game.roundWinner, [a, b] = fighters;
  if (w) w.wins++; else { a.wins++; b.wins++; }
  if (a.wins >= 2 || b.wins >= 2) { game.mode = 'result'; showResult(a.wins >= 2 && b.wins >= 2 ? null : (a.wins >= 2 ? a : b)); return; }
  startRound(game.round + 1);
}
// each fighter's entrance before the first round (a greeting or a taunt) and a closing pose when they win the match
const SHOW = {
  ninja: { intro: [['seal', 45], ['seal3', 85], ['slash', 130]], introLine: ['Silent as a shadow.', '影のごとく。'], win: [['seal', 40], ['seal5', 80], ['win', 999]], winLine: ['You never even saw me.', '見えなかっただろう。'] },
  brawler: { intro: [['chargeB', 55], ['twinPalm', 120]], introLine: ['Show me your strength.', '力を見せてみろ。'], win: [['twinPalm', 70], ['winB', 999]], winLine: ['Train harder. Come back stronger.', 'もっと鍛えて出直してこい。'] },
  staff: { intro: [['staffWhirl', 60], ['staffRise', 100], ['idleB', 130]], introLine: ['Ready when you are!', 'いつでもいいよ！'], win: [['staffWhirl', 50], ['cloudSit', 999]], winLine: ['Too slow~!', 'おっそーい！'] },
  psychic: { intro: [['psyRaise', 60], ['psyCast', 120]], introLine: ['The stars have already decided.', '星はもう答えを出しているわ。'], win: [['psyCast', 60], ['winL', 999]], winLine: ['Just as foretold.', '予言どおりね。'] },
  paladin: { intro: [['pPlant', 70], ['chargeP', 125]], introLine: ['By my oath, I shall not fall.', '誓いにかけて、倒れはせぬ。'], win: [['pPlant', 80], ['winP', 999]], winLine: ['Rise, and fight with honor.', '立て。誇りを持って戦え。'] },
  kappa: { intro: [['kBelly', 40], ['kEat', 90], ['kWin', 125]], introLine: ['Kappa! Got any cucumbers?', 'カッパ！きゅうり持ってる？'], win: [['kEat', 70], ['kWin', 999]], winLine: ['Victory tastes like cucumber!', '勝利はきゅうりの味！'] },
  gunman: { intro: [['gUp', 50], ['gAim', 90], ['gHolster', 130]], introLine: ['Draw, partner.', '抜きな、相棒。'], win: [['gAim', 60], ['gWin', 999]], winLine: ['Too slow on the draw.', '抜くのが遅かったな。'] },
  salary: { intro: [['sBow', 60], ['sTie', 115]], introLine: ['Pleased to meet you... please go easy on me.', 'よろしくお願いします…お手柔らかに。'], win: [['sBow', 70], ['sDogeza', 110], ['sIdle', 999]], winLine: ['Thank you for your hard work!', 'お疲れ様でした！'] },
};
const DOUBLE_RING = 1;
const showOn = () => !game.training && !game.demo && game.phase === 'intro'; // every round opens with the fighters' entrance poses
function showPose(f, seq, t) { // walk through the key poses, blending into each
  const sh = SHOW[f.key]; if (!sh) return null; const list = sh[seq];
  let prev = POSES[f.ch.idle || 'idle'] || POSES.idle, from = 0;
  for (const [name, end] of list) { const P0 = POSES[name] || prev; if (t < end) { const k = clamp((t - from) / 12, 0, 1); return lerpPose(prev, P0, easeOutQ(k)); } prev = P0; from = end; }
  return seq === 'intro' ? lerpPose(prev, POSES[f.ch.idle || 'idle'] || POSES.idle, clamp((t - from) / 15, 0, 1)) : prev;
}
function showFX(f, seq, t) { // a little flourish for each fighter (entrance and victory)
  const x = f.x, y = GROUND - f.y, s = f.ch.scale, k = f.key;
  if (k === 'ninja' && t === 2) for (let i = 0; i < 12; i++) parts.push({ type: 'smoke', x: x + rnd(-30, 30), y: y - rnd(10, 150), vx: rnd(-1.5, 1.5), vy: -rnd(0.3, 1), r: 10, vr: 0.5, life: 30, max: 30, col: '120,90,170' }); // appears from smoke
  if (k === 'ninja' && seq === 'win' && t === 80) for (let i = 0; i < 14; i++) parts.push({ type: 'smoke', x: x + rnd(-30, 30), y: y - rnd(10, 150), vx: rnd(-1.5, 1.5), vy: -rnd(0.3, 1), r: 12, vr: 0.6, life: 40, max: 40, col: '120,90,170' });
  if (k === 'brawler' && t < 55 && t % 3 === 0) qiGather(f, t, Math.min(1, t / 40));
  if (k === 'staff' && t < 60 && t % 4 === 0) parts.push({ type: 'spark', x: x + Math.cos(t * 0.5) * 50, y: y - 150 * s + Math.sin(t * 0.5) * 14, vx: 0, vy: 0, life: 10, max: 10, col: '255,210,110' });
  if (k === 'psychic' && t % 5 === 0) for (let i = 0; i < 3; i++) { const an = t * 0.08 + i * 2.1; parts.push({ type: 'crystal', x: x + Math.cos(an) * 60, y: y - 110 * s + Math.sin(an) * 22, vx: 0, vy: 0, r: 7, life: 6, max: 6, rot: 0 }); } // crystals circling her
  if (k === 'paladin' && t > 10 && t < 70 && t % 4 === 0) parts.push({ type: 'aura', x: x + rnd(-30, 30), y: y - rnd(20, 200), vx: 0, vy: 1.4, life: 20, max: 20, r: 3, col: '255,245,200' }); // light falls on him
  if (k === 'kappa' && t > 40 && t < 90 && t % 6 === 0) parts.push({ type: 'aura', x: x + rnd(-10, 10), y: y - 150 * s, vx: rnd(-1.5, 1.5), vy: -2, life: 16, max: 16, r: 3, col: '150,215,255' }); // splashes of water
  if (k === 'gunman' && t < 50 && t % 3 === 0) parts.push({ type: 'spark', x: x + f.facing * 24, y: y - 150 * s, vx: 0, vy: 0, life: 6, max: 6, col: '255,230,160' }); // the revolver spinning
  if (k === 'gunman' && seq === 'win' && t > 10 && t < 60 && t % 5 === 0) parts.push({ type: 'smoke', x: x + f.facing * 40, y: y - 140 * s, vx: 0, vy: -0.8, r: 4, vr: 0.3, life: 24, max: 24, col: '210,205,195' }); // blows the smoke off the barrel
  if (k === 'salary' && t % 20 === 10) parts.push({ type: 'aura', x: x + f.facing * 14, y: y - 168 * s, vx: 0, vy: 0.6, life: 16, max: 16, r: 3, col: '150,200,255' }); // nervous sweat
}
function drawSpeech(f, txt, a) { // a speech bubble over the fighter's head
  if (a <= 0) return; const s = f.ch.scale, y = GROUND - f.y - 205 * s;
  ctx.save(); ctx.globalAlpha = a; ctx.font = "700 14px 'Rajdhani', 'Segoe UI', system-ui, sans-serif"; const w = ctx.measureText(txt).width + 20;
  const x = clamp(f.x - w / 2, 10, W - w - 10); ctx.fillStyle = 'rgba(255,255,255,.94)'; rr(x, y - 30, w, 26, 8); ctx.fill();
  ctx.beginPath(); ctx.moveTo(f.x - 6, y - 4); ctx.lineTo(f.x + 6, y - 4); ctx.lineTo(f.x, y + 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1b1830'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, x + 10, y - 17); ctx.restore();
}
const COUNT_AT = [50, 95, 140], INTRO_T = 185; // ROUND n, then 3, 2, 1, then FIGHT!
function step() {
  game.frame++; game.phaseT++;
  const [a, b] = fighters, live = game.phase === 'fight';
  const ia = live ? a.ctrl.read(a, game.frame, b) : EMPTY;
  const ib = live ? b.ctrl.read(b, game.frame, a) : EMPTY;
  update(a, b, ia); update(b, a, ib);
  pushApart(a, b);
  checkHits(a, b); checkHits(b, a);
  updateProjs();
  fighters.forEach(updatePose);
  if (game.training) trainingUpkeep();
  if (game.demo) demoUpkeep();
  if (game.combo && --game.combo.t <= 0) game.combo = null;
  if (game.routeName && --game.routeName.t <= 0) game.routeName = null;
  if (game.phase === 'intro') {
    if (showOn()) for (const f of fighters) showFX(f, 'intro', game.phaseT - (f.side ? 8 : 0));
    if (!game.training && game.phaseT === 4) { const fin = a.wins === 1 && b.wins === 1; announce(fin ? 'Final round!' : `Round ${game.round}!`, fin ? 'ファイナルラウンド！' : `ラウンド${game.round}！`); }
    if (!game.training && COUNT_AT.includes(game.phaseT)) sfx('count');
    if (game.phaseT >= (game.training ? 40 : INTRO_T)) { game.phase = 'fight'; game.phaseT = 0; if (!game.training) { sfx('go'); announce('Fight!', 'ファイト！'); } }
  }
  else if (game.phase === 'fight') {
    const dead = fighters.filter(f => f.hp <= 0);
    if (dead.length) { game.phase = 'ko'; game.phaseT = 0; game.slow = 50; game.roundWinner = dead.length === 2 ? null : (dead[0] === a ? b : a); sfx('ko'); if (!game.training) announce('K.O.!', 'ケーオー！'); }
    else if (!game.training && --game.timer <= 0) { game.timer = 0; game.phase = 'time'; game.phaseT = 0; game.roundWinner = a.hp === b.hp ? null : (a.hp > b.hp ? a : b); announce('Time!', 'タイムアップ！'); }
  } else {
    const w = game.roundWinner;
    if (game.phaseT === 100 && !game.training) { // with the WINS banner
      const cpu = w && w.side === 1 && !game.watch && !game.online;
      if (!w) announce('Draw!', '引き分け！'); else if (cpu) announce('CPU wins!', 'CPUの勝ち！'); else announce(`Player ${w.side + 1} wins!`, `プレイヤー${w.side + 1}の勝ち！`);
    }
    if (game.phaseT === 1) game.finalWin = w && w.wins >= 1 && !game.training ? w : null; // this round wins the match: play the closing pose
    if (game.phaseT >= 70 && w && ['stand','crouch','guard','land'].includes(w.state)) { setState(w, 'win'); w.vx = 0; w.winTier = winTierOf(w); }
    if (w && w.state === 'win') winFX(w, w.st); // (victory.js: three round wins by health left, and the match win)
    if (game.phaseT >= (game.finalWin ? 290 : 210)) endRound();
  }
}
function tick() {
  globalT++;
  if (game.mode === 'opening') { openingTick(); pressed.clear(); return; }
  if (game.mode !== 'fight' || game.paused) { pressed.clear(); return; }
  fightTick();
}
function fightTick() {
  updateParts();
  if (game.shake > 0) { game.shake *= 0.86; if (game.shake < 0.3) game.shake = 0; }
  if (game.superFlash) {
    if (--game.superFlash.t <= 0) game.superFlash = null;
    else { if (globalT % 2 === 0) auraParticle(game.superFlash.f); return; }
  }
  if (game.freeze > 0) { game.freeze--; return; }
  if (game.slow > 0) { game.slow--; if (game.slow % 2 === 0) return; }
  step();
  pressed.clear();
}

