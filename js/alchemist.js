'use strict';
/* ================= the Alchemist and his stone golem =================
   The alchemist doesn't fight himself: he points, and his golem does it. The golem is not a second fighter but a small
   object riding on the alchemist (f.golem). It walks to the opponent by itself (wherever they are, even between the two
   of them), punches on its own when it's next to them, and obeys U, I, J and K. Its blows are resolved from the golem's own
   position, so a defender guards relative to whoever is attacking: the golem's side for the golem, the alchemist's for him. */
CHARS.alchemist = {
  name: 'ALCHEMIST', title: 'Golem Master', nameJa: '錬金術師', titleJa: 'ゴーレム使い', dmgMul: 1, scale: 1, walk: 3.0, back: 2.6, jumpX: 4.0, jumpV: 17, jugDmg: 1,
  pDmg: 1, kDmg: 1, pReach: 1, kReach: 1, chargeRate: 0.6, auraCol: '255,200,120', fxCol: '255,200,120',
  ammo: 6, // six glowing stones in his pockets: every stone he throws (or sets as a trap) uses one, and they come back one at a time
  sp: { fK: 'alUpStone', fKH: 'alTrap' }, sup: null, // (→ → + J: stone lob; → → + K: trap stone; his own super comes later)
  normalLook: {},
  colors: { coat: '#f4f6f8', coatB: '#d4d9de', pants: '#3a3f4f', pantsB: '#2b2f3b', shoe: '#2a2a30', shirt: '#cfe3f2', skin: '#efc9a4', hair: '#8e8f96', glass: '#2a2a30', stetho: '#2b2b33' },
  meterCol: ['#d98a2c', '#ffe0a8'], bannerCol: 'rgba(150,110,60,.9)', idle: 'idle', chargePose: 'gAim', winPose: 'win', atkCD: 8, recoverT: 10, hitFx: 'star',
};
Object.assign(CHARS.alchemist, { altColors: { ...CHARS.alchemist.colors, coat: '#d9e6dc', coatB: '#b7c9bb', shirt: '#f0d8c0', hair: '#4a3b2e' } });
Object.assign(POSES, { // throwing a stone: the arm drawn back behind him with the weight on the back foot, then whipped through and forward
  alThrowW: P(-14, -105,-150, 30,60, 22,10, -26,-14),
  alThrow: P(26, 112,78, -20,20, 36,6, -24,-10),
  alThrowLow: P(30, 70,86, -10,30, 40,4, -26,-12) });
// His buttons. U and I order the golem (a crouching U is its low punch; I (or U, U, I) its three-second grab). J, K and → → are his own glowing stones:
//   J: one stone at chest height · ↓ + J: one low · → → + J: lobbed up, it comes down and stuns · K: three in a row, chargeable (3 gauges)
//   → → + K: sets a trap stone forward (up to six; it bursts when they step on it, or after six seconds) · ↓ + K: the golem's core blaster
{
  const order = (label, pose, fn, ex = {}) => ({ label, startup: 5, active: 2, recovery: 5, wind: 'idle', pose, hitbox: null, chain: null, launch: false, kd: false, antiDone: true, ...ex, onFrame: (f, o, mf) => { if (mf === f.move.startup) fn(f, o); } });
  const throwing = (label, fn, ex = {}) => order(label, 'alThrow', fn, { wind: 'alThrowW', startup: 9, recovery: 14, ...ex });
  const L = CHARS.alchemist.normalLook, golem = k => (f, o) => golemOrder(f, k);
  for (const st of ['s', 'c', 'j']) {
    L[st + 'p0'] = order(st === 'c' ? 'Order: Low Punch' : 'Order: Punch', st === 'c' ? 'gLow' : 'gAim', golem(st === 'c' ? 'lowp' : 'lp'));
    L[st + 'p1'] = order('Order: Smash', 'gTwin', golem('hp'));
  }
  L.sk0 = throwing('Stone Throw', (f, o) => alchemistStone(f, o, 70, {}));
  L.ck0 = throwing('Low Stone Throw', (f, o) => alchemistStone(f, o, 24, {}), { wind: 'alThrowW', pose: 'alThrowLow', crouch: true });
  L.ck1 = order('Order: Core Blaster', 'gTwin', golem('hk'), { crouch: true });
  L.jk0 = throwing('Air Stone Throw', (f, o) => alchemistStone(f, o, 70, {}), { startup: 7 });
  L.jk1 = throwing('Air Stone Volley', (f, o) => alchemistVolley(f, o, 0, 1), { startup: 7 });
  L.sk1 = { label: 'Stone Volley', held: true, startup: 999, active: 2, recovery: 14, wind: 'alThrowW', pose: 'alThrow', hitbox: null, chain: null, launch: false, kd: false, antiDone: true, onFrame: stoneCharged,
    poseFn: (f, mf) => { const mv = f.move; if (!mv.fired || mf < mv.startup - 2) return null; const k = (mf - mv.startup + 2) % 7; return lerpPose(POSES.alThrowW, POSES.alThrow, clamp(k / 2, 0, 1)); } };
}
const STONE_LV = [20, 42, 66]; // frames of holding K for gauges 1, 2 and 3
function stoneCharged(f, o, mf) { // K: hold to charge (three gauges), let go: three stones in a row. After U, U it is the golem's sand toss instead
  const mv = f.move, g = f.golem;
  if (mf === 1 && g && g.seq && game.frame - g.seqT <= 50 && g.seq.slice(-2).join() === 'lp,lp') Object.assign(mv, { held: false, startup: 5, active: 2, recovery: 5, isOrder: true, wind: 'idle', pose: 'gTwin' });
  if (mv.isOrder) { if (mf === mv.startup) golemOrder(f, 'hk'); return; }
  if (!mv.fired) {
    mv.chargeMarks = [[STONE_LV[0], 'Lv1'], [STONE_LV[1], 'Lv2'], [STONE_LV[2], 'MAX']]; f.vx *= 0.6; mv.lvl = STONE_LV.filter(n => mf >= n).length;
    if (STONE_LV.includes(mf)) { sfx('charge'); parts.push({ type: 'ring', x: f.x + f.facing * 40, y: GROUND - f.y - 100, r: 22 + mv.lvl * 8, vr: -1.6, life: 14, max: 14, col: '255,200,110' }); }
    if (mv.lvl && mf % 2 === 0) { const an = rnd(0, Math.PI * 2), r = rnd(24, 50); parts.push({ type: 'spark', x: f.x + f.facing * 36 + Math.cos(an) * r, y: GROUND - f.y - 100 + Math.sin(an) * r, vx: -Math.cos(an) * r / 8, vy: -Math.sin(an) * r / 8, life: 8, max: 8, col: ['255,230,160', '110,255,220', '255,170,80'][mv.lvl - 1] }); }
    if (!holding(f) || mf >= 96) { mv.fired = true; mv.startup = mf + 3; mv.active = 20; mv.recovery = 14 + mv.lvl * 3; }
    return;
  }
  const k = mf - mv.startup; if (k >= 0 && k <= 14 && k % 7 === 0) alchemistVolley(f, o, mv.lvl, k / 7);
}
const STONE_REGEN = 90; // frames for a stone to come back (a second and a half)
function useStone(f) { // one stone from his pockets (false, with a click, when they're all out)
  if (f.ammo > 0) { f.ammo--; return true; }
  if (!(f.dryT > game.frame - 12)) { f.dryT = game.frame; sfx('dry'); popText(f.x + f.facing * 40, GROUND - f.y - 150, L('NO STONES', '石切れ'), '225,225,235'); }
  return false;
}
function alchemistVolley(f, o, lvl, i = 0) { alchemistStone(f, o, 70, { k: 0.7 + 0.25 * lvl, sp: 10 + lvl * 1.5, big: lvl >= 2, label: 'Stone Volley', fan: i, h: i === 2 ? { kd: true, kdVx: 9, kdVy: 7 } : {} }); } // (the third stone knocks them down)
function alchemistStone(f, o, y, ex) { // one glowing stone, thrown flat (aimed at them when he or they are in the air)
  if (!useStone(f)) return;
  const d = f.facing, air = f.y > 20 || o.y > 40, x0 = f.x + d * 40, y0 = f.y + (air ? 70 : y), cols = ['110,255,220', '255,190,80', '150,170,255'];
  const h = { dmg: Math.round(26 * (ex.k || 1) * (f.golem && f.golem.hold ? 1.6 : 1)), // (the golem is holding them: his stones hit harder)
    stun: 17, bstun: 10, push: 1.4, gdrain: 6, hitstop: 5, low: !air && y < 40, label: ex.label || 'Stone Throw', ...(ex.h || {}) };
  let vx = d * (ex.sp || 10), vy = 0;
  if (air) { const an = Math.atan2(o.y + 60 - y0, o.x - x0) + (ex.fan || 0) * 0.12, sp = 11; vx = Math.cos(an) * sp; vy = Math.sin(an) * sp; }
  spawnPJ(f, 'stone', { dir: Math.sign(vx) || d, x: x0, y: y0, vx, vy, life: 64, r: ex.big ? 14 : 11, glow: cols[(ex.fan || 0) % 3], h }); sfx('throw');
}
function alchemistLob(f, o) { // thrown up and over: it drops on them and stuns
  if (!useStone(f)) return;
  const d = f.facing, x0 = f.x + d * 30, y0 = f.y + 100, T = 53, vx = clamp((o.x - x0) / T, -14, 14);
  spawnPJ(f, 'stone', { dir: Math.sign(vx) || d, x: x0, y: y0, vx, vy: 12.5, g: 0.5, life: 90, r: 12, glow: '150,170,255',
    h: { dmg: 18, stun: 20, bstun: 10, push: 0.8, gdrain: 6, hitstop: 6, overhead: true, stunT: 64, stunKind: 'shock', label: 'Stone Lob' } }); sfx('throw');
}
function alchemistTrap(f) { // a glowing stone set on the floor ahead of him: it bursts when they step on it, or after six seconds; six at most
  if (!useStone(f)) return;
  const mine = projs.filter(p => p.type === 'trap' && p.owner === f && !p.dead);
  while (mine.length >= 6) { const old = mine.shift(); old.dead = true; for (let i = 0; i < 6; i++) parts.push({ type: 'spark', x: old.x, y: GROUND - 12, vx: rnd(-2, 2), vy: rnd(1, 4), life: 12, max: 12, col: '255,220,140' }); } // (the seventh pushes out the oldest)
  const d = f.facing, x = clamp(f.x + d * 170, WALL_L + 20, WALL_R - 20);
  spawnPJ(f, 'trap', { dir: d, x, y: 14, vx: 0, life: 360, r: 16, glow: ['110,255,220', '255,190,80', '150,170,255', '255,120,120', '120,255,160', '255,230,120'][projs.filter(p => p.type === 'trap' && p.owner === f).length % 6],
    explode: { r: 78, h: { dmg: 46, stun: 24, bstun: 14, push: 3, gdrain: 12, hitstop: 9, kd: true, kdVx: 8, kdVy: 7, label: 'Trap Stone' } } });
  sfx('select'); dustAt(x, false);
}
function trapUpdate(p) {
  const own = p.owner, tgt = other(own); p.life--;
  if (p.t % 5 === 0) parts.push({ type: 'spark', x: p.x + vrnd(-10, 10), y: GROUND - 14 - vrnd(0, 18), vx: 0, vy: 0.8, life: 14, max: 14, col: p.glow });
  const stepped = p.t > 20 && game.phase === 'fight' && !tgt.ko && tgt.y < 45 && !['down', 'getup', 'knock'].includes(tgt.state) && Math.abs(tgt.x - p.x) < 44;
  if (stepped || p.life <= 0) { pjExplode(p); p.dead = true; }
}
// his two specials
{ const smb = specialMoveBase; specialMoveBase = function (id) {
  if (id === 'alUpStone') return { id, label: 'Stone Lob', startup: 10, active: 2, recovery: 16, wind: 'alThrowW', pose: 'alThrow', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) alchemistLob(f, o); } };
  if (id === 'alTrap') return { id, label: 'Trap Stone', startup: 12, active: 2, recovery: 16, wind: 'alThrowW', pose: 'alThrowLow', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) alchemistTrap(f); } };
  return smb(id); }; }
TECH_TIER.alUpStone = 'fast'; TECH_TIER.alTrap = 'fast';
const GOLEM_ACT = { // startup / active / recovery (frames), and the blow
  lp: { su: 7, ac: 3, rec: 12, reach: [10, 85], y: [10, 135], h: { dmg: 28, stun: 30, bstun: 11, push: 1.6, hitstop: 6, str: 0, gdrain: 4, label: 'Golem Punch' } },
  lowp: { su: 8, ac: 3, rec: 14, reach: [10, 95], y: [0, 40], h: { dmg: 26, stun: 30, bstun: 11, push: 1.6, hitstop: 6, str: 0, gdrain: 4, low: true, label: 'Golem Low Punch' } },
  hp: { su: 10, ac: 2, rec: 22, grab: true, reach: [0, 95], y: [0, 150], h: { dmg: 18, stun: 12, bstun: 12, push: 0, hitstop: 6, str: 1, gdrain: 0, grab: true, label: 'Golem Grab', heavy: true } }, // I: it seizes them and holds them for three seconds
  sand: { su: 13, ac: 1, rec: 22 }, // U, U, K: it scoops up sand and stones and flings them into the air, to rain down on them
  core: { su: 18, ac: 1, rec: 26 }, // K: the core blaster
};
const GOLEM_ARMS = { lp: [[8, -92], [0, -92]], lowp: [[10, -60], [0, -30]], hp: [[30, -96], [62, -98]], sand: [[26, -20], [64, -150]], core: [[-16, -102], [-12, -102]] }; // each blow's arm: drawn back, then thrown (x forward of the golem, y up)
function newGolem(f) { return { x: f.x - f.facing * 90, facing: f.facing, act: null, queue: null, qT: 0, cd: 30, dashT: 0, ph: 0, spd: 0, y: 0, vy: 0, js: 0, crouch: false, hp: 300, max: 300, broken: false, brokenT: 0, seen: {}, hold: null, flash: 0 }; }
function golemOrder(f, kind) { // I (also U, U, I) is the grab; U, U, K the sand toss; ↓ + K the core blaster
  const g = f.golem; if (!g || f.ko) return;
  if (!g.seq || game.frame - g.seqT > 50) g.seq = []; g.seqT = game.frame; g.seq.push(kind); if (g.seq.length > 3) g.seq.shift();
  const seq = g.seq.join(',');
  if (kind === 'hk') kind = seq.endsWith('lp,lp,hk') ? 'sand' : 'core';
  g.queue = kind; g.qT = 0;
}
function golemStart(f, kind, auto) { const g = f.golem, o = other(f); g.facing = Math.sign(o.x - g.x) || g.facing; g.alt = !g.alt; g.act = { kind, t: 0, id: ++serial, hit: false, auto: !!auto, alt: g.alt }; g.queue = null; if (kind === 'hp') sfx('swing'); }
function alchemistThrow(f, o) { alchemistStone(f, o, 70, {}); } // (juggle orders)
function golemSand(f, o) { // sand and stones flung up and forward: they come down on them
  const g = f.golem, d = g.facing, n = 6;
  for (let i = 0; i < n; i++) spawnPJ(f, 'stone', { dir: d, x: g.x + d * 40, y: 90 + g.y, vx: d * (4.5 + i * 1.1) * (Math.abs(o.x - g.x) > 200 ? 1.2 : 1), vy: 12 + (i % 3) * 1.6, g: 0.5, life: 60, r: 9, glow: i % 2 ? '255,190,80' : null,
    h: { dmg: i === n - 1 ? 22 : 12, stun: 20, bstun: 10, push: 0.6, gdrain: 5, hitstop: 3, kd: i === n - 1, kdVx: 6, kdVy: 7, overhead: true, label: 'Sand Toss' } });
  for (let i = 0; i < 12; i++) parts.push({ type: 'smoke', x: g.x + d * 30, y: GROUND - g.y - rnd(10, 40), vx: d * rnd(1, 4), vy: rnd(1, 3), r: rnd(4, 8), vr: 0.3, life: 20, max: 20, col: '200,170,120' });
  sfx('throw');
}
function golemBlast(f, o) { // a beam of glowing core energy straight out of its chest
  const g = f.golem, d = g.facing;
  spawnPJ(f, 'core', { dir: d, x: g.x + d * 36, y: 80 + g.y, vx: d * 17, life: 54, r: 18, pierce: false,
    h: { dmg: 56, stun: 26, bstun: 14, push: 4, gdrain: 14, hitstop: 12, kd: true, kdVx: 12, kdVy: 8, label: 'Core Blaster', heavy: true } });
  game.shake = Math.max(game.shake, 4); g.x -= d * 6; sfx('flame');
  for (let i = 0; i < 10; i++) parts.push({ type: 'spark', x: g.x + d * 36, y: GROUND - 80 - g.y, vx: d * rnd(2, 9), vy: rnd(-3, 3), life: 12, max: 12, col: '255,200,90' });
}
const live0 = (f, o) => game.phase === 'fight' && !f.ko && !o.ko;
function golemSeize(f, o) { // the grab: held for three seconds, so J, J, K can't miss
  const g = f.golem; g.hold = { t: 180 }; setState(o, 'stunned'); o.stunT = 184; o.stunKind = 'held'; o.stunUsed = true;
  popText(o.x, GROUND - 190, L('GRABBED!', '捕まえた！'), '255,215,140'); sfx('block'); game.shake = Math.max(game.shake, 3);
}
function golemBox(g) { return { x0: g.x - 46, x1: g.x + 46, y0: g.y, y1: g.y + (g.crouch ? 130 : 165) }; }
function golemDamage(f, n, x, y) { // the golem takes a hit; at zero it comes apart
  const g = f.golem; if (g.broken) return; g.hp = Math.max(0, g.hp - n); g.flash = 5; sfx('hitH'); sparks(x, y, 'hit');
  if (g.hp <= 0) { g.broken = true; g.brokenT = 600; g.act = null; g.queue = null; if (g.hold) { const o = other(f); g.hold = null; if (o.state === 'stunned') setState(o, 'recover'); }
    popText(g.x, GROUND - 200, L('GOLEM DOWN!', 'ゴーレム撃破！'), '255,170,110'); game.shake = Math.max(game.shake, 7); sfx('break');
    for (let i = 0; i < 22; i++) parts.push({ type: 'spark', x: g.x + rnd(-40, 40), y: GROUND - rnd(10, 150), vx: rnd(-5, 5), vy: rnd(-3, 5), life: 22, max: 22, col: '170,130,80' }); dustAt(g.x, true); }
}
function golemTakeHits(f, o) { // the opponent's attacks can hit the golem too
  const g = f.golem, gb = golemBox(g);
  if (o.state === 'attack' && o.move && o.move.hitbox && o.mf > o.move.startup && o.mf <= o.move.startup + (o.move.active || 1) && !g.seen['m' + o.serial]) {
    const hb = boxOf(o, o.move.hitbox); if (overlap(hb, gb)) { g.seen['m' + o.serial] = 1; golemDamage(f, Math.round((o.move.dmg || 20) * (o.ch.dmgMul || 1) * 0.7), g.x, GROUND - 90 - g.y); }
  }
  for (const p of projs) {
    if (p.owner !== o || p.dead || g.seen['p' + p.id] || !(p.h || p.dmg) || p.type === 'decoy' || p.type === 'guardShadow') continue;
    if (overlap(projBox(p), gb)) { g.seen['p' + p.id] = 1; golemDamage(f, Math.round(((p.h && p.h.dmg) || p.dmg || 15) * (o.ch.dmgMul || 1) * 0.8), p.x, GROUND - p.y); if (!p.pierce && !p.hold && p.type !== 'beam' && p.type !== 'flame') p.dead = true; }
  }
}
function golemHit(f, o, h, hb, hu) { // resolved as if the golem were the attacker: its side decides the guard
  const g = f.golem, sv = [f.x, f.facing, f.vx, f.serial, f.kb]; f.x = g.x; f.facing = g.facing; f.serial = g.act.id;
  let res; try { res = applyHit(f, o, h, Math.sign(o.x - g.x) || g.facing, hb, hu); } finally { [f.x, f.facing, f.vx, f.serial, f.kb] = sv; } // (the wall pushes the attacker back: not the alchemist, when it's the golem that hit)
  return res;
}
function golemUpdate(f, o) {
  const g = f.golem; if (!g) return;
  if (g.flash > 0) g.flash--;
  if (g.broken) { g.act = null; g.queue = null; g.hold = null; if (--g.brokenT <= 0) { g.broken = false; g.hp = g.max; g.seen = {}; sfx('select'); popText(g.x, GROUND - 190, L('GOLEM REBUILT', 'ゴーレム復活'), '255,220,140'); for (let i = 0; i < 14; i++) parts.push({ type: 'spark', x: g.x + rnd(-40, 40), y: GROUND - rnd(5, 120), vx: 0, vy: 2, life: 14, max: 14, col: '255,200,110' }); } return; }
  const live = game.phase === 'fight' && !f.ko && !o.ko, dx = o.x - g.x, dir = Math.sign(dx) || g.facing, dist = Math.abs(dx);
  if (f.inp && f.inp.dashTap === 1) g.dashT = 18; // → → : the golem runs in too
  if (g.dashT > 0) g.dashT--;
  if (g.cd > 0) g.cd--;
  g.spd = 0;
  if (live0(f, o)) golemTakeHits(f, o);
  if (g.broken) return;
  if (game.phase === 'fight' && !f.ko) { if (f.ammo < f.ch.ammo) { if ((f.stoneT = (f.stoneT || 0) + 1) >= STONE_REGEN) { f.stoneT = 0; f.ammo++; sfx('select'); parts.push({ type: 'ring', x: f.x, y: GROUND - f.y - 60, r: 8, vr: 3, life: 10, max: 10, col: '255,220,140' }); } } else f.stoneT = 0; } // (the stones come back one at a time)
  const inp = f.inp || EMPTY; // the golem copies the alchemist: where he walks, when he jumps or crouches
  if (g.js !== f.jumpSerial) { g.js = f.jumpSerial; if (f.state === 'jump' && g.y <= 0) g.vy = f.ch.jumpV || JUMP_V; }
  if (g.y > 0 || g.vy > 0) { g.vy -= G; g.y += g.vy; if (g.y <= 0) { g.y = 0; g.vy = 0; dustAt(g.x, false); } }
  g.crouch = !!inp.down && g.y <= 0;
  if (!live) { g.act = null; g.queue = null; return; }
  if (g.hold) { // holding them: pinned in front of it until the three seconds are up, or they're knocked loose
    const hd = g.hold; hd.t--;
    if (hd.t <= 0 || o.ko || ['knock', 'down', 'getup'].includes(o.state)) { g.hold = null; if (o.state === 'stunned') setState(o, 'recover'); }
    else { o.x = clamp(g.x + g.facing * 70, WALL_L, WALL_R); o.vx = 0; if (o.state !== 'stunned') { setState(o, 'stunned'); o.stunT = hd.t + 4; } }
    g.act = null; g.queue = null; g.spd = 0; return;
  }
  const a = g.act;
  if (a) {
    const A = GOLEM_ACT[a.kind]; a.t++;
    if (a.t <= A.su && dist > 70 && A.reach) { g.x += dir * 1.6; g.spd = 1.6; }
    if (A.reach) {
      if (a.t > A.su && a.t <= A.su + A.ac && !a.hit) {
        const x0 = g.x + g.facing * A.reach[0], x1 = g.x + g.facing * A.reach[1], hb = { x0: Math.min(x0, x1), x1: Math.max(x0, x1), y0: A.y[0] + g.y, y1: A.y[1] + g.y }, hu = hurtbox(o, false, !!A.h.low); // (a low punch reaches someone lying on the floor too)
        if (hu && overlap(hb, hu) && !(A.grab && (o.y > 20 || o.state === 'knock'))) { const res = golemHit(f, o, { type: 'mid', chip: false, proj: false, gbstun: 45, ...A.h }, hb, hu); if (res) { a.hit = true; if (A.grab && res === 'hit') golemSeize(f, o); } }
      }
    } else if (a.t === A.su) { if (a.kind === 'sand') golemSand(f, o); else golemBlast(f, o); }
    if (a.t >= A.su + A.ac + A.rec || (a.hit && g.queue && (a.kind === 'lp' || a.kind === 'lowp') && a.t >= A.su + A.ac + 2)) { g.act = null; g.cd = a.auto ? 36 : 10; } // (a punch that landed can be cancelled into the next order: strings link)
  } else {
    g.facing = dir;
    const q = g.queue;
    if (q) { g.qT++; if (dist <= 100) golemStart(f, q, false); else if (g.qT > 70) g.queue = null; }
    else if (dist < 95 && g.cd <= 0) golemStart(f, 'lp', true); // next to them it punches on its own
    if (!g.act) {
      if (inp.h) { const sp = g.dashT > 0 ? 7 : g.y > 0 ? 3.5 : 2.6; g.x += Math.sign(inp.h) * sp; g.spd = sp; } // his movement comes first
      else if (g.y <= 0 && !g.crouch && dist > (q ? 80 : 60)) { const sp = g.dashT > 0 || q ? 6.5 : 2.5; g.x += dir * sp; g.spd = sp; } // otherwise it walks to the opponent itself
    }
  }
  g.x = clamp(g.x, WALL_L, WALL_R); g.ph += g.spd * 0.09;
}
// the direction a defender guards in while the golem is the one attacking (0 when it isn't)
function golemGuardDir(f, o) { const g = o && o.golem; return g && g.act && golemThreatening(f, o) ? (Math.sign(g.x - f.x) || 0) : 0; }
function golemThreatening(f, o) { const g = o.golem, a = g.act, A = a && GOLEM_ACT[a.kind]; return !!(A && A.reach && a.t <= A.su + A.ac + 2 && Math.abs(g.x - f.x) < 220); }
function golemThreat(f, o) { return o.golem && o.golem.act && golemThreatening(f, o) ? { key: 'g' + o.golem.act.id, kind: 'mid' } : null; }

/* ---------- drawing ---------- */
const GEMS = [['110,255,220', -0.5], ['255,190,80', 0], ['150,170,255', 0.5]]; // glowing stones on his chest
function gemGlow(p, col, r, t) { const g = ctx.createRadialGradient(p[0], p[1], 0.5, p[0], p[1], r * 2.6); g.addColorStop(0, `rgba(${col},.95)`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r * 2.6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = `rgba(255,255,255,.9)`; ctx.beginPath(); ctx.arc(p[0], p[1], r * 0.55, 0, Math.PI * 2); ctx.fill(); }
function drawAlchemist(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]], fx = !o.tint && !o.flash;
  const add = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k];
  seg(J.hip, J.k2, 10, C.pantsB); seg(J.k2, J.f2, 9, C.pantsB); foot(J.k2, J.f2, 8.5, 6.5, C.shoe);
  seg(J.hip, J.k1, 10, C.pants); seg(J.k1, J.f1, 9, C.pants); foot(J.k1, J.f1, 9, 6.5, C.shoe);
  seg(J.sh, J.e2, 9, C.coatB); seg(J.e2, J.h2, 8, C.coatB); dot(J.h2, 4.6, C.skin);
  seg(J.hip, J.sh, 21, C.coat);                                                                                     // the white coat
  const bl = add(J.hip, n, -15), br = add(J.hip, n, 15); bl[0] -= td[0] * 34; bl[1] -= td[1] * 34; br[0] -= td[0] * 34; br[1] -= td[1] * 34;
  ctx.fillStyle = C.coat; ctx.beginPath(); ctx.moveTo(...add(J.hip, n, -10)); ctx.lineTo(...bl); ctx.lineTo(...br); ctx.lineTo(...add(J.hip, n, 10)); ctx.closePath(); ctx.fill(); // its skirts, down to the knees
  seg(add(J.hip, td, -20), add(add(J.hip, td, -20), n, 14), 1.6, C.coatB);                                                // the hem's fold
  seg(mid(J.hip, J.sh, 0.5), [J.sh[0] + n[0] * 3, J.sh[1] + n[1] * 3], 6, C.shirt);                                   // the shirt under the lapels
  const nk = [J.sh[0] + n[0] * 2, J.sh[1] + n[1] * 2], ch = mid(J.hip, J.sh, 0.45);
  ctx.strokeStyle = C.stetho; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(J.sh[0] - n[0] * 6, J.sh[1] - n[1] * 6); ctx.quadraticCurveTo(ch[0] - n[0] * 5, ch[1] - 6, ch[0] + n[0] * 5, ch[1] - 2); ctx.quadraticCurveTo(ch[0] + n[0] * 8, ch[1] + 2, nk[0], nk[1]); ctx.stroke(); // a stethoscope round his neck
  if (fx) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pu = 0.75 + 0.25 * Math.sin(t * 0.12); // glowing stones: three on the chest, one in each pocket
    GEMS.forEach(([c, k], i) => gemGlow(add(add(mid(J.hip, J.sh, 0.62 + (i === 1 ? 0.08 : 0)), n, 9), td, k * 6 - 3 * (i === 1)), c, 5 * (0.8 + 0.2 * Math.sin(t * 0.1 + i * 2)) * pu, t));
    const pk = add(J.hip, td, -10); gemGlow(add(pk, n, 12), '255,120,110', 4.4 * pu, t); gemGlow(add(pk, n, -8), '120,255,160', 4.4 * (1.05 - pu * 0.2), t);
    ctx.restore(); }
  seg(J.sh, J.head, 8, C.skin);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1])); ctx.scale(1.15, 1.15);
  dot([0, 0], 11, C.skin); ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(-1, 2, 11.5, Math.PI * 0.05, Math.PI * 1.15); ctx.closePath(); ctx.fill();   // grey, swept-back hair
  dot([-6, -1], 2.4, C.skin);
  const hurt = o.face === 'hitstun' || o.face === 'knock' || o.face === 'stunned';
  for (const ex of [3.8, 8.6]) { dot([ex, 1.6], 2.2, '#ffffff'); dot([ex + 0.4, 1.4], 1.2, '#1a1a1a'); ctx.strokeStyle = C.glass; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(ex, 1.6, 3.2, 0, Math.PI * 2); ctx.stroke(); } // round spectacles
  seg([6.6, 1.6], [7.2, 1.6], 1, C.glass); seg([9.6, -1], [10.8, -3], 1.1, '#d9a585');
  if (hurt || o.face === 'attack') { ctx.fillStyle = '#5a2a2a'; ctx.beginPath(); ctx.ellipse(7.2, -5.4, 2, hurt ? 2.4 : 1.4, 0, 0, Math.PI * 2); ctx.fill(); } else seg([5.6, -5.4], [9, -5.8], 1.2, '#8a4a3a');
  ctx.restore();
  seg(J.sh, J.e1, 9, C.coat); seg(J.e1, J.h1, 8, C.coat); seg(mid(J.e1, J.h1, 0.85), J.h1, 6, C.coatB); dot(J.h1, 4.8, C.skin);
}
DRAWERS.alchemist = drawAlchemist;
function drawGolemPile(g) { // it has come apart: pieces fall and settle in a heap, then pull together again for the last moments
  const t = 600 - g.brokenT, fall = Math.min(1, t / 30), rise = Math.max(0, 1 - g.brokenT / 45), k = fall * (1 - rise * rise);
  ctx.save(); ctx.translate(g.x, GROUND); ctx.scale(1.4, 1.4); ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(0, 0, 40, 8, 0, 0, Math.PI * 2); ctx.fill();
  const PIECES = [[-30, -34, 20, 24, -38, -6, 0.3], [8, -34, 20, 24, 18, -5, -0.4], [-34, -86, 30, 34, -44, -12, 0.9], [4, -80, 34, 40, 6, -9, -0.5], [-16, -122, 30, 30, -10, -22, 1.2], [-42, -70, 14, 26, -58, -6, 1.4], [30, -64, 14, 26, 40, -7, -1.1], [14, -50, 18, 18, 26, -12, 0.7], [-12, -60, 16, 16, -22, -15, -0.9]];
  for (const [x, y, w, h, hx, hy, rot] of PIECES) { const px = lerp(x, hx, k), py = lerp(y, hy - h * 0.2 + 14, k) + (rise > 0 ? Math.sin(t * 0.8 + x) * 2 * rise : 0);
    ctx.save(); ctx.translate(px + w / 2, py + h / 2); ctx.rotate(rot * k); ctx.fillStyle = '#8b6a47'; ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 4); ctx.fill(); ctx.stroke(); ctx.restore(); }
  if (rise > 0) { ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(0, -60, 2, 0, -60, 70); gg.addColorStop(0, `rgba(255,190,80,${0.7 * rise})`); gg.addColorStop(1, 'rgba(255,150,40,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, -60, 70, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  const w = 60, x = g.x - w / 2, y = GROUND - 62; ctx.fillStyle = 'rgba(8,8,20,.7)'; ctx.fillRect(x - 2, y - 2, w + 4, 8); ctx.fillStyle = '#ffd98a'; ctx.fillRect(x, y, w * (1 - g.brokenT / 600), 4); // the time until it's rebuilt
}
function drawGolem(f) { // a brown stone golem, drawn in the world where it stands
  const g = f.golem; if (!g) return;
  if (g.broken) { drawGolemPile(g); return; }
  const t = globalT, a = g.act, A = a && GOLEM_ACT[a.kind], s = 1.4, wk = Math.sin(g.ph * 6) * (g.spd > 0 ? 1 : 0), e = x => x * x * (3 - 2 * x);
  let squat = g.crouch ? 0.78 : 1, lean = 0, glow = 1, front = 0;
  if (a) { const k = a.t, su = A.su;
    if (a.kind === 'sand') { squat = k <= su ? 1 - 0.22 * e(k / su) : lerp(0.78, 1.05, Math.min(1, (k - su) / 3)); lean = k <= su ? 0.1 : -0.08; }
    if (a.kind === 'core') { glow = 1 + 2.4 * e(Math.min(1, k / su)) * (k <= su + 4 ? 1 : Math.max(0, 1 - (k - su - 4) / 14)); lean = k <= su ? -0.1 : 0.06; squat = k <= su ? 0.97 : 1; } // the core swells, then fires
    if (a.kind === 'hp') lean = k <= su ? -0.06 : 0.1; if (a.kind === 'lp' || a.kind === 'lowp') lean = k <= su ? -0.04 : 0.06; }
  ctx.save(); ctx.translate(g.x, GROUND - g.y); ctx.scale(g.facing * s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(0, 0, 38, 8, 0, 0, Math.PI * 2); ctx.fill();
  const rock = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, 5); ctx.fill(); ctx.stroke(); };
  const bob = g.spd > 0 ? Math.abs(Math.sin(g.ph * 6)) * 3 : Math.sin(t * 0.05) * 1.2;
  rock(-24, -34 + Math.max(0, wk) * 6, 18, 34 - Math.max(0, wk) * 6, '#7a5b3b'); rock(6, -34 + Math.max(0, -wk) * 6, 18, 34 - Math.max(0, -wk) * 6, '#8b6a47'); // legs
  ctx.save(); ctx.translate(0, -34); ctx.rotate(lean); ctx.scale(1, squat); ctx.translate(0, 34); // the whole upper body sinks, leans and rises
  const arm = (sx, sy, fx, fy, c) => { ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 19; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(fx, fy); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 13; ctx.stroke(); ctx.fillStyle = c; ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, fy, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); };
  const hand = (rest, two) => { if (!a) return rest; const [pull, fw] = GOLEM_ARMS[a.kind] || GOLEM_ARMS.lp, k = a.t, su = A.su, end = su + A.ac;
    const fwd = A.reach ? [a.kind === 'hp' ? fw[0] : 30 + A.reach[1] * 0.8, fw[1]] : fw;
    const sh = two ? -2 : 0; // (the other hand of a two-handed blow trails a little)
    return k <= su ? [lerp(rest[0], pull[0], e(k / su)), lerp(rest[1], pull[1], e(k / su))] : k <= end + 2 ? [lerp(pull[0], fwd[0] + sh, Math.min(1, (k - su) / 2)), lerp(pull[1], fwd[1], Math.min(1, (k - su) / 2))]
      : [lerp(fwd[0], rest[0], e(Math.min(1, (k - end - 2) / (A.rec * 0.8)))), lerp(fwd[1], rest[1], e(Math.min(1, (k - end - 2) / (A.rec * 0.8))))]; };
  const twoHanded = (a && (a.kind === 'sand' || a.kind === 'core' || a.kind === 'hp')) || !!g.hold;
  const farRest = [-42, -46 - bob], nearRest = [34, -48 - bob], useFar = a && a.alt && !twoHanded;
  const farH = twoHanded ? hand([-30, -50], true) : useFar ? hand(farRest) : farRest, nearH = (a && !useFar) ? hand(nearRest) : nearRest;
  if (!useFar) arm(-30, -86 - bob, farH[0] - (twoHanded ? 8 : 0), farH[1], '#7a5b3b');                       // the far arm
  ctx.fillStyle = '#8b6a47'; ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -34 - bob); ctx.lineTo(30, -34 - bob); ctx.lineTo(38, -90 - bob); ctx.lineTo(-38, -90 - bob); ctx.closePath(); ctx.fill(); ctx.stroke(); // the body
  ctx.strokeStyle = '#5a4129'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, -90 - bob); ctx.lineTo(-6, -66 - bob); ctx.lineTo(-16, -48 - bob); ctx.moveTo(18, -76 - bob); ctx.lineTo(10, -58 - bob); ctx.stroke(); // cracks
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pu = (0.7 + 0.3 * Math.sin(t * 0.1)) * Math.min(1.4, glow), rr = 18 * Math.min(2.4, glow), gg = ctx.createRadialGradient(0, -62 - bob, 1, 0, -62 - bob, rr); gg.addColorStop(0, `rgba(255,${glow > 1.5 ? 230 : 190},${glow > 1.5 ? 150 : 80},${Math.min(1, 0.9 * pu)})`); gg.addColorStop(1, 'rgba(255,150,40,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, -62 - bob, rr, 0, Math.PI * 2); ctx.fill(); ctx.restore(); // the stone that moves it
  rock(-15, -122 - bob, 30, 30, '#94724c');                                                                    // the head
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,170,60,.95)'; ctx.fillRect(1, -112 - bob, 6, 4); ctx.fillRect(9, -112 - bob, 5, 4); ctx.restore();
  if (useFar) arm(-30, -86 - bob, farH[0], farH[1], '#9a7852');                                               // (the other fist throws the second punch of a string)
  else arm(30, -86 - bob, nearH[0], nearH[1], '#9a7852');
  ctx.restore();
  ctx.restore();
  const w = 60, x = g.x - w / 2, y = GROUND - g.y - 176 * (g.crouch ? 0.85 : 1); ctx.fillStyle = 'rgba(8,8,20,.7)'; ctx.fillRect(x - 2, y - 2, w + 4, 8); ctx.fillStyle = g.hp / g.max > 0.35 ? '#d9a65a' : '#e06a4a'; ctx.fillRect(x, y, w * g.hp / g.max, 4); // its health
  if (g.flash > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,255,255,${0.12 * g.flash})`; ctx.fillRect(g.x - 50, GROUND - g.y - 170, 100, 170); ctx.restore(); }
}
STRINGS.alchemist = (() => { // in a juggle he throws aimed stones at them (the golem can't reach the air)
  const th = (label) => SJ('p', label, 'alThrowW', 'alThrow', { hitbox: null, stay: true, startup: 9, recovery: 14, onFrame: (f, o, mf) => { if (mf === f.move.startup) alchemistThrow(f, o); } });
  return { jPalm: th('Aimed Stone'), jElbow: th('Aimed Stone'), jUpper: th('Aimed Stone'), jRise: { ...th('Aimed Stone'), str: 1, relaunch: false }, jSpin: { ...th('Aimed Stone'), kind: 'k', str: 1 } };
})();
// joining the roster
CHAR_ORDER.push('alchemist'); DEMO_VS.alchemist = 'ninja'; GHOST_TINT.alchemist = new Proxy({}, { get: () => '#e8f4ff' });
DEMOS.alchemist = []; COMBO_SET.alchemist = []; PUNISH_SET.alchemist = []; // (no sample combos yet)
