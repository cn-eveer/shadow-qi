'use strict';
/* ================= projectiles ================= */
function spawnShuriken(f) {
  projs.push({ id: ++serial, type: 'shuriken', owner: f, x: f.x + f.facing * 40, y: 90, vx: f.facing * 9.5, vy: 0, r: 11,
    dmg: 50, stun: 18, bstun: 13, push: 4, hitstop: 6, life: 200, rot: 0, dir: f.facing });
  sfx('throw');
}
function spawnAirShuriken(f) {
  const sp = 9;
  projs.push({ id: ++serial, type: 'shuriken', owner: f, x: f.x + f.facing * 30, y: f.y + 80, vx: f.facing * sp * Math.cos(40 * RAD), vy: -sp * Math.sin(40 * RAD),
    r: 10, dmg: 50, stun: 16, bstun: 12, push: 3, hitstop: 5, life: 120, rot: 0, air: true, dir: f.facing });
  sfx('throw');
}
function spawnQi(f) {
  projs.push({ id: ++serial, type: 'qi', owner: f, x: f.x + f.facing * 58 * f.ch.scale, y: 88, vx: f.facing * 6.5, vy: 0, r: 20,
    dmg: 75, stun: 20, bstun: 16, push: 5, hitstop: 8, life: 240, chip: true, dir: f.facing });
  sfx('qi');
}
function spawnClone(f, sup, idx, dmg, lvl, near) { // (dmg: a super's own damage per clone; lvl: 'mid' — above the shins — or 'low' — along the floor; near: it appears close to them)
  // Shadow Clone Strike moves at the same speed as Shadow Charge, so the two look alike
  const o = other(f), side = Math.sign(o.x - f.x) || f.facing;
  const fromBack = sup && idx % 2 === 1; // in the super, every other clone comes from behind the opponent
  const sp = sup ? 16 : 10, range = sup ? 1100 : 520, dir = fromBack ? -side : f.facing;
  let x = fromBack ? clamp(o.x + side * (sup ? Math.max(120, Math.abs(o.x - f.x) - 20) : 430), -60, W + 60) : f.x + f.facing * 20; // (in the super the ones from behind start as far away as the ones in front: they all arrive together)
  if (near) x = fromBack ? clamp(o.x + side * 120, -60, W + 60) : side * (o.x - side * 140 - x) > 0 ? o.x - side * 140 : x; // (to catch someone bouncing off the floor)
  projs.push({ id: ++serial, type: 'clone', owner: f, x, y: 0, vx: dir * sp, vy: 0, w: 28, h0: lvl === 'mid' ? 30 : lvl === 'low' ? 0 : 10, h1: lvl === 'low' ? 40 : 120, low: lvl === 'low', lowHit: lvl === 'low',
    dmg: dmg || (sup ? 32 : 66), stun: sup ? 24 : 26, bstun: 15, push: sup ? 1.5 : 5,
    kd: false, juggle: sup, superHit: sup, hitstop: 7, life: Math.round(range / sp), chip: true, dir });
  puff(x, 60); sfx('clone');
  return projs[projs.length - 1];
}
const ARMY_LAST = { dmg: 160, kd: true, kdVx: 10, kdVy: 9, hitstop: 14, w: 34, gMul: 0.3 }; // Shadow Army's last clone: a heavy kick that knocks them away — from behind, back toward Kuro
const ARMY_SWEEP = { ...ARMY_LAST, kdVx: 3, kdVy: 5 }; // (low: it sweeps their feet out — they drop where they stand)
function spawnDiveClone(f, overhead) { // the Shadow Army finisher drops from above (overhead: guard it standing)
  const o = other(f), close = Math.abs(o.x - f.x) < 240; // up close, it bounces them back toward Kuro so he can keep the combo going
  projs.push({ id: ++serial, type: 'clone', owner: f, x: o.x, y: 0, yOff: f.move && f.move.dodge ? 420 : Math.max(200, o.y + 120), fall: true, fallSp: f.move && f.move.dodge ? 10 : 18, /* (on its own it comes down slowly: time to see it) */ vx: 0, vy: 0, w: 34, h0: 0, h1: 120, // (it starts high: its shadow on the floor gives time to dash away)
    dmg: overhead ? 110 : 85, stun: 24, bstun: 16, push: 3, kd: !close, kdVx: 9, kdVy: 10, launch: close, launchVy: 12, bounce: close, endOwner: close,
    juggle: true, superHit: true, hitstop: 12, life: 60, chip: true, dir: f.facing, overhead: !!overhead });
  puff(o.x, 260); sfx('clone');
  return projs[projs.length - 1];
}
const JUGGLE_SP = { flame: 'jFire', fireballs: 'jRain', cloneStrike: 'jClone', swordSlash: 'jIai', vanishDrop: 'jVanishHeel',
  qiBlast: 'jGeyser', meteorFist: 'jHammer', shoulder: 'jShoulder', qiOrb: 'jSpiral', tornado: 'jTornado' };
Object.assign(JUGGLE_SP, { extendStaff: 'jExtend', vaultSmash: 'jVault', cloudLeap: 'jCloud', windmill: 'jWindmill', poleKick: 'jPoleKick' });
JUGGLE_SP.duckUpper = 'jGeyser'; JUGGLE_SP.pushParry = 'jSpiral'; // (Tetsu in a juggle: → → + I the Qi Geyser, ← ← + U the Qi Spiral; → → + U, the Meteor Fist, gives the Hammer Spike)
Object.assign(JUGGLE_SP, { phantomFist: 'jPhantom', crushFist: 'jCrush', psyLift: 'jLift', forceWave: 'jWave' });
const RISING_IDS = new Set(Object.values(JUGGLE_SP));
const NO_CLASH = new Set(['pillar', 'lift', 'crush', 'dish', 'crescent', 'plate', 'water', 'bubble', 'bullet', 'dyna', 'card', 'feather', 'haloP', 'hellfire']);
const pullV = (f, t) => { const d = f.x - t.x; return Math.sign(d || 1) * clamp((Math.abs(d) - 60) / 55, 0.5, 5.5); }; // drift a launched opponent back toward her
const FINISHERS = new Set(['mrFinish', 'srSlam']);
// ← ← + I: three rays at once, like Orb Burst all in one go; the third leaves them stunned
function lyraTip(f) { // where the crystal on Lyra's staff is right now (screen coordinates): her spells come out of it
  const pose = f.state === 'attack' && f.move && POSES[f.move.pose] ? POSES[f.move.pose] : f.pose, J = solve(pose), s = f.ch.scale, hip = f.state === 'attack' && f.move && POSES[f.move.pose] ? hipFor(pose) : (f.hipUp || 0); // (the casting pose: where the staff points as the spell goes off)
  let ux = J.h1[0] - J.e1[0], uy = J.h1[1] - J.e1[1] + 9; const L = Math.hypot(ux, uy) || 1; ux /= L; uy /= L;
  const cx = J.h1[0] + ux * 113, cy = J.h1[1] + uy * 113;
  return [f.x + (f.animDX || 0) + f.facing * s * cx, GROUND - f.y - (f.ch.hover ? hoverOf(f) : 0) - s * (cy + hip)];
}
function tripleRay(f, o) {
  const reach = 430, inRange = Math.abs(o.x - f.x) <= reach, hu = inRange ? hurtbox(o, true) : null;
  sfx('zap');
  for (let k = 0; k < 3; k++) {
    const tip = lyraTip(f), sx = tip[0], sy = tip[1] + (k - 1) * 4; // (all three out of the crystal on her staff)
    const oy = jumpedOver(o) ? 0 : o.y, tx = inRange ? o.x : f.x + f.facing * reach, ty = GROUND - oy - (55 + k * 32) * o.ch.scale; // (aimed where they stand: jump over the rays)
    parts.push({ type: 'ray', x: sx, y: sy, x1: tx, y1: ty, life: 14, max: 14, col: '210,190,255', w: 1.3 });
    if (!hu || jumpedOver(o)) continue;
    const hb = { x0: tx - 10, x1: tx + 10, y0: GROUND - ty - 10, y1: GROUND - ty + 10 };
    applyHit(f, o, { dmg: k === 2 ? 24 : 14, stun: 18, bstun: 10, push: 1, type: 'mid', chip: true, hitstop: k === 2 ? 8 : 3, proj: true, str: 1, gdrain: 8, juggle: true, jugVy: 5,
      stunT: k === 2 ? 62 : undefined, stunKind: 'psy', label: 'Triple Ray' }, Math.sign(o.x - f.x) || f.facing, hb, hu);
  }
}
function puffCol(x, h, col) { for (let i = 0; i < 12; i++) parts.push({ type: 'aura', x: x + rnd(-24, 24), y: GROUND - h + rnd(-50, 50), vx: rnd(-1.5, 1.5), vy: rnd(-1.5, 0.5), life: rnd(14, 24), max: 24, r: rnd(3, 6), col }); }
function spawnPFist(f, o) { // a phantom fist flying on its own
  projs.push(Object.assign({ id: ++serial, type: 'pfist', owner: f, r: 22, stun: 18, bstun: 10, hitstop: 7, chip: true, dir: Math.sign(o.vx) || f.facing }, o));
  if (!o.superHit || Math.random() < 0.4) sfx('palm');
}
function tgt0(p) { return other(p.owner); }
function drawMeteor(p) { // Falling Star in a combo: a blazing meteor with a fiery tail
    const al = Math.min(1, p.t / 5), x = p.x, y = GROUND - p.y;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (p.trail.length > 1) { const t0 = p.trail[0]; const g = ctx.createLinearGradient(t0[0], GROUND - t0[1], x, y); g.addColorStop(0, 'rgba(255,120,60,0)'); g.addColorStop(0.6, 'rgba(255,170,90,.7)'); g.addColorStop(1, 'rgba(255,235,220,.95)');
      ctx.strokeStyle = g; ctx.lineCap = 'round'; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(t0[0], GROUND - t0[1] + 40); ctx.lineTo(x, y); ctx.stroke(); }
    const g2 = ctx.createRadialGradient(x, y, 4, x, y, 52); g2.addColorStop(0, `rgba(255,255,255,${al})`); g2.addColorStop(0.35, `rgba(255,200,240,${0.9 * al})`); g2.addColorStop(0.7, `rgba(255,140,80,${0.55 * al})`); g2.addColorStop(1, 'rgba(255,120,60,0)');
    ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x, y, 52, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(255,250,240,${al})`; ctx.beginPath(); for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5 + globalT * 0.15, rr = i % 2 ? 9 : 22; ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } ctx.closePath(); ctx.fill(); // the star at its heart
    ctx.restore();
}
function spawnCrush(f, o, juggle) { // a giant fist forms above them, then comes down
  const tx = juggle ? o.x : clamp(f.x + clamp(o.x - f.x, -400, 400), WALL_L, WALL_R);
  const y = juggle ? Math.min(290, o.y + 160) : 280, x = juggle ? clamp(tx - f.facing * 150, 20, W - 20) : tx;
  if (juggle) parts.push({ type: 'skycircle', x, y: GROUND - y, r: 70, life: 14, max: 14 }); // in a combo: the meteor comes out of a magic circle
  projs.push({ id: ++serial, type: 'crush', owner: f, x, tx, y, vx: 0, vy: 0, r: 34, t: 0, hold: juggle ? 4 : 14, juggle, life: 60, dir: f.facing, trail: [],
    dmg: juggle ? 36 : 50, stun: 20, bstun: 14, push: 2, hitstop: 11, chip: true });
}
function spawnLift(f, o, juggle) { // a glowing ring on the floor (or around them), then a column that lifts them
  const x = juggle ? o.x : clamp(f.x + clamp(o.x - f.x, -420, 420), WALL_L, WALL_R);
  projs.push({ id: ++serial, type: 'lift', owner: f, x, y: 0, vx: 0, vy: 0, r: 40, t: 0, erupt: juggle ? 3 : 16, juggle, life: juggle ? 16 : 26, done: false, dir: f.facing });
}
function burstRay(f, o, i, n) { // Orb Burst: a ray from an orb (or her hand) straight at them
  const pos = orbCount(f) ? orbPos(f, i, orbCount(f)) : lyraTip(f); // (with no orbs, out of the crystal on her staff)
  const hu = hurtbox(o, true), tx = o.x, ty = GROUND - (jumpedOver(o) ? 0 : o.y) - 80 * o.ch.scale; // (aimed where they stand: jump over it)
  parts.push({ type: 'ray', x: pos[0], y: pos[1], x1: tx, y1: ty, life: 12, max: 12 });
  sfx('zap');
  if (f.orbCD && f.orbCD[i] != null) f.orbCD[i] = Math.max(f.orbCD[i], 60);
  if (!hu || jumpedOver(o)) return;
  const hb = { x0: tx - 10, x1: tx + 10, y0: GROUND - ty - 10, y1: GROUND - ty + 10 };
  applyHit(f, o, { dmg: orbCount(f) ? 16 : 30, stun: 16, bstun: 8, push: 1, type: 'mid', chip: true, hitstop: 4, proj: true, str: 1, gdrain: 4, juggle: true, jugVy: 5, label: 'Orb Ray' }, Math.sign(o.x - f.x) || f.facing, hb, hu);
}
// Great Sage Pillar: a giant staff crashes down on them
function spawnPillar(f, o, lx) { // lx: where it was aimed when the wind-up began (dash away from the mark and it misses)
  const tx = lx != null ? lx : o.x, x = clamp(f.x + clamp(tx - f.x, -420, 420), WALL_L, WALL_R), close = Math.abs(tx - f.x) < 240;
  projs.push({ id: ++serial, type: 'pillar', owner: f, x, y: 0, vx: 0, vy: 0, r: 40, t: 0, hits: 0, max: 6, last: -99, life: 46, close, dir: f.facing });
  sfx('super');
}
function spawnQiOrb(f) { // a slow orb that hits three times
  projs.push({ id: ++serial, type: 'orb', owner: f, x: f.x + f.facing * 60 * f.ch.scale, y: 80, vx: f.facing * 3.2, vy: 0, r: 26,
    dmg: 22, lastDmg: 36, stun: 18, bstun: 10, push: 2, hitstop: 5, life: 150, chip: true, hits: 0, max: 3, last: -99, dir: f.facing });
  sfx('qi');
}
function spawnWave(f) { // a shockwave along the floor: hits low, even someone lying down
  projs.push({ id: ++serial, type: 'wave', owner: f, x: f.x + f.facing * 50, y: 14, vx: f.facing * 9.5, vy: 0, r: 16, w: 22, /* (fast: across mid range quickly) */
    dmg: 40, stun: 18, bstun: 10, push: 3, kd: true, kdVx: 2, kdVy: 4, low: true, hitstop: 7, life: 80, chip: true, dir: f.facing });
}
function spawnSpiral(f, o, i) { // qi orbs rising up through a juggled opponent
  projs.push({ id: ++serial, type: 'rain', qi: true, owner: f, idx: i, hx: o.x, hph: i * 1.7, x: o.x + (i % 2 ? 20 : -20), y: Math.max(12, o.y - 50), vx: 0, vy: 10, r: 13,
    dmg: 16, stun: 16, bstun: 10, push: 0.4, hitstop: 4, life: 26, chip: true, juggle: true, jugVy: 6.5, dir: f.facing });
  sfx('orb');
}
// Qi Parry: an attack that lands during the stance is parried; melee gets a launching palm back
// the gunslinger's bullets: fast, mid range (about a third of the stage)
function clawSwipe(f, c, o) { // three parallel claw slashes: c = [forward, height, angle, length, colour, 'tgt' = on the opponent]
  const s = f.ch.scale, at = c[5] === 'tgt' && o;
  parts.push({ type: 'claw', x: at ? o.x - f.facing * 8 : f.x + f.facing * c[0] * s, y: at ? GROUND - o.y - 70 * o.ch.scale : GROUND - f.y - c[1] * s, rot: c[2] * f.facing, r: c[3] || 46, dir: f.facing, life: 12, max: 12, col: c[4] || '235,255,240' });
  sfx('slash');
}
function aimPose(f) { // his arms point straight at them; he leans back and looks up at someone in the air (or down from a jump)
  const o = other(f), s = f.ch.scale, dx = Math.max(24, Math.abs(o.x - f.x)), dy = (o.y + 60 * o.ch.scale) - (f.y + 128 * s);
  const e = clamp(Math.atan2(dy, dx) * 180 / Math.PI, -60, 82), p = { ...POSES.gTwin };
  p.a1u = p.a1l = 90 + e; p.a2u = p.a2l = 86 + e; p.t = clamp(10 - e * 0.4, -24, 26);
  if (f.y > 0) Object.assign(p, { l1u: 100, l1l: 15, l2u: 60, l2l: -35 }); else if (e > 30) Object.assign(p, { l1u: 34, l1l: 8, l2u: -36, l2l: -20 }); // a braced stance under them
  return p;
}
function aimShot(f, o, h) { // a shot aimed straight at a juggled opponent, from a muzzle that points at them
  const s = f.ch.scale, sx = f.x + f.facing * 6 * s, sy = f.y + 128 * s, lead = Math.min(10, Math.hypot(o.x - sx, o.y - sy) / 40), tx = o.x + (o.vx || 0) * lead, ty = o.y + 60 * o.ch.scale + (o.vy || 0) * lead * 0.8, dd = Math.hypot(tx - sx, ty - sy) || 1; // (it leads them: aimed where they'll be when it gets there)
  const mx = sx + (tx - sx) / dd * 58 * s, my = sy + (ty - sy) / dd * 58 * s, d = Math.hypot(tx - mx, ty - my) || 1, sp = 40; // (fast: it lands before the next shot of the juggle)
  shoot(f, { x: mx, y: my, vx: (tx - mx) / d * sp * f.facing, vy: (ty - my) / d * sp, life: 12, ...h }); // (vx is relative to his facing; aimed even if they drift behind the muzzle)
}
// Jesse's guns hold 15 bullets. Each shooting attack uses one, however many shots it fires; when the last is gone he reloads for
// 4 seconds (he can still move, jump and guard), and until then a shot only clicks on an empty chamber. Dynamite, the Showdown
// counter and High Noon don't need bullets.
const RELOAD_T = 240;
function useBullet(f) {
  const mv = f.move;
  if (mv && mv.shot) return mv.shot === 'live'; // (the rest of this attack's shots)
  const live = f.ammo > 0 && !(f.reloadT > 0);
  if (mv) mv.shot = live ? 'live' : 'dry';
  if (!live) { sfx('dry'); popText(f.x + f.facing * 40, GROUND - f.y - 150 * f.ch.scale, L('CLICK', 'カチッ'), '225,225,235'); return false; }
  if (--f.ammo === 0) { f.reloadT = RELOAD_T; sfx('reload'); popText(f.x, GROUND - f.y - 190 * f.ch.scale, L('RELOADING', 'リロード中'), '255,215,140'); }
  return true;
}
function reloaded(f) {
  f.ammo = f.ch.ammo; sfx('reload'); popText(f.x, GROUND - f.y - 190 * f.ch.scale, L('RELOADED', 'リロード完了'), '255,230,160');
}
function shoot(f, o) { // bullets fly 40% faster than before; o.range (in pixels) decides how far they go, otherwise the old reach is kept
  if (f.ch.ammo && !useBullet(f)) return;
  const s = f.ch.scale, x = o.x != null ? o.x : f.x + f.facing * 70 * s, y = o.y || 118, lvl = o.lvl || (o.big ? 1 : 0);
  const v0 = o.vx || 22, k = 1.4, life = o.range ? Math.ceil(o.range / (Math.hypot(v0, o.vy || 0) * k)) : Math.ceil((o.life || 16) / k) + 1;
  spawnPJ(f, 'bullet', { x, y, vx: f.facing * v0 * k, vy: (o.vy || 0) * k, life, r: 10 + lvl * 5, lvl, pierce: !!o.pierce, hits: o.pierce ? 1 : 1, bounce: o.bounce || 0,
    h: { ...(o.stunT ? { stunT: o.stunT, stunKind: o.stunKind } : {}), dmg: o.dmg || 20, stun: o.stun || 18, bstun: o.bstun || 10, push: o.push || 1.5, gdrain: o.gdrain || 6, low: !!o.low, kd: !!o.kd, kdVx: 7, kdVy: 7, launch: !!o.launch, launchVy: o.launchVy || 11, juggle: true, jugVy: o.jugVy || 5, label: f.move ? f.move.label : 'Shot' } });
  parts.push({ type: 'spark', x: f.x - f.facing * 4, y: GROUND - f.y - 112 * f.ch.scale, vx: -f.facing * rnd(1.5, 3), vy: -rnd(3, 5), life: 18, max: 18, col: '230,190,90' }); // a brass casing flips out
  parts.push({ type: 'smoke', x: x, y: GROUND - y, vx: f.facing * 0.4, vy: -0.6, r: 5, vr: 0.25, life: 20, max: 20, col: '210,205,195' });
  for (let i = 0; i < 6 + lvl * 6; i++) parts.push({ type: 'spark', x: x - f.facing * 6, y: GROUND - y, vx: f.facing * rnd(1, 5 + lvl * 2), vy: rnd(-2.5, 2.5) * (1 + lvl * 0.5), life: 7 + lvl * 3, max: 7 + lvl * 3, col: lvl ? '255,200,110' : '255,230,150' });
  parts.push({ type: 'star', x: x - f.facing * 4, y: GROUND - y, r: 14 + lvl * 8, vr: 1.2, life: 7 + lvl * 2, max: 7 + lvl * 2, col: '255,245,200', rot: rnd(0, 1) }); // a big muzzle flash...
  parts.push({ type: 'star', x: x + f.facing * 6, y: GROUND - y, r: 8 + lvl * 4, vr: 0.6, life: 5, max: 5, col: '255,190,90', rot: rnd(0, 1) }); // ...with a hot core
  parts.push({ type: 'aura', x: x, y: GROUND - y, vx: 0, vy: 0, r: 26 + lvl * 10, life: 4, max: 4, col: '255,230,160' }); // a flash of light around the muzzle
  parts.push({ type: 'ring', x: x - f.facing * 6, y: GROUND - y, r: 4, vr: 3 + lvl * 2, life: 7 + lvl * 2, max: 7 + lvl * 2, col: '255,240,190' });
  if (lvl) { game.shake = Math.max(game.shake, 2 + lvl * 3); f.vx = -f.facing * (2 + lvl * 3); }
  sfx('shot'); if (lvl === 2) sfx('hitH');
}
// Lyra's crystals: they form above the opponent and fall on them, wherever they are (up to half the stage away); she never has to move
const LYRA_RANGE = 400;
function drawCrystal(x, y, r, a, rot) { // a long crystal of light, pale blue to pink
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.globalAlpha = a;
  const g = ctx.createLinearGradient(0, -r * 1.6, 0, r * 1.6); g.addColorStop(0, '#f6f0ff'); g.addColorStop(0.5, '#b9dcff'); g.addColorStop(1, '#ff9be8');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -r * 1.7); ctx.lineTo(r * 0.55, -r * 0.4); ctx.lineTo(r * 0.45, r * 0.9); ctx.lineTo(0, r * 1.7); ctx.lineTo(-r * 0.45, r * 0.9); ctx.lineTo(-r * 0.55, -r * 0.4); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.6; ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -r * 1.7); ctx.lineTo(0, r * 1.7); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.stroke();
  ctx.globalCompositeOperation = 'lighter'; const h = ctx.createRadialGradient(0, 0, 2, 0, 0, r * 2); h.addColorStop(0, 'rgba(255,220,250,.45)'); h.addColorStop(1, 'rgba(255,190,245,0)'); ctx.fillStyle = h; ctx.beginPath(); ctx.arc(0, 0, r * 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function lyraGroundCrystal(f, mv) { // the rune circle shows first; then a crystal falls into it (or spears up out of a floor glyph)
  const s = f.ch.scale, S = mv.startup, mf = f.mf;
  if (mv.psyFist) { const x = f.x + f.facing * mv.psyFist[0] * s, y = GROUND - f.y - mv.psyFist[1] * s, r = 12 + (mv.psyFist[2] || 1) * 10;
    if (mf < S) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,190,245,${0.25 + 0.5 * mf / S})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 34 * (0.4 + 0.6 * mf / S), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    if (mv.noCrystal) return; // (the U, U, K string: magic circles only)
    if (mf >= S - 8 && mf <= S + 5) { ctx.save(); ctx.translate(x, y - 128); ctx.scale(1, 0.38); drawTriCircle(0, 0, 58, Math.min(1, (mf - S + 9) / 3) * (mf > S + 1 ? 1 - (mf - S - 1) / 5 : 1), mf * 0.15); drawTriCircle(0, 0, 58, 0.5 * Math.min(1, (mf - S + 9) / 3) * (mf > S + 1 ? 1 - (mf - S - 1) / 5 : 1), -mf * 0.1); ctx.restore(); } // the circle on top, that the crystal drops out of
    if (mf >= S - 3 && mf <= S + 3) drawCrystal(x, y - Math.max(0, S - mf) * 40, r, 1, 0);
    else if (mf > S + 3 && mf <= S + 7) drawCrystal(x, y, r * (1 + (mf - S - 3) * 0.15), 1 - (mf - S - 3) / 5, 0);
  } else { const x = f.x + f.facing * mv.floorGlyph * s, k = clamp((mf - S + 1) / 3, 0, 1), fade = mf > S + 5 ? Math.max(0, 1 - (mf - S - 5) / 5) : 1;
    if (mf >= S - 1 && fade > 0) drawCrystal(x, GROUND - 40 * k, 16, fade, 0); }
}
function drawTriCircle(x, y, R, a, spin) { // a triangular magic circle: two rings, a triangle, runes at the corners
  ctx.save(); ctx.translate(x, y); ctx.rotate(spin); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a;
  ctx.strokeStyle = 'rgba(255,190,245,.95)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(230,220,255,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, R * 0.86, 0, Math.PI * 2); ctx.stroke();
  const pts = [0, 1, 2].map(k => [Math.cos(-Math.PI / 2 + k * Math.PI * 2 / 3) * R * 0.86, Math.sin(-Math.PI / 2 + k * Math.PI * 2 / 3) * R * 0.86]);
  ctx.strokeStyle = 'rgba(255,240,255,.95)'; ctx.lineWidth = 3; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,190,245,.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); [0, 1, 2].forEach(k => { const an = Math.PI / 2 + k * Math.PI * 2 / 3; const q = [Math.cos(an) * R * 0.86, Math.sin(an) * R * 0.86]; k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.closePath(); ctx.stroke(); // the inverted triangle
  for (const q of pts) { ctx.fillStyle = 'rgba(255,220,250,.95)'; ctx.beginPath(); ctx.arc(q[0], q[1], R * 0.11, 0, Math.PI * 2); ctx.fill(); }
  for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6; ctx.fillStyle = 'rgba(255,200,245,.8)'; ctx.fillRect(Math.cos(an) * R * 0.93 - 2, Math.sin(an) * R * 0.93 - 2, 4, 4); } // rune marks on the ring
  ctx.restore();
}
function triExplode(x, y) { // the triangle detonates
  for (let i = 0; i < 18; i++) { const an = i * Math.PI / 9; parts.push({ type: 'spark', x, y, vx: Math.cos(an) * rnd(5, 9), vy: Math.sin(an) * rnd(5, 9), life: 18, max: 18, col: i % 2 ? '255,190,245' : '230,240,255' }); }
  for (const [r, v] of [[10, 9], [20, 6], [4, 12]]) parts.push({ type: 'ring', x, y, r, vr: v, life: 16, max: 16, col: '255,210,250' });
  parts.push({ type: 'star', x, y, r: 30, vr: 3, life: 10, max: 10, col: '255,245,255', rot: 0 });
  game.shake = Math.max(game.shake, 7); sfx('hitH'); sfx('orb');
}
function crystalShatter(x, y, big) { for (let i = 0; i < (big ? 12 : 7); i++) { const an = R() * Math.PI * 2; parts.push({ type: 'spark', x, y, vx: Math.cos(an) * rnd(2, 6), vy: Math.sin(an) * rnd(2, 6) - 1, life: 14, max: 14, col: i % 2 ? '200,225,255' : '255,190,245' }); } parts.push({ type: 'ring', x, y, r: 6, vr: big ? 6 : 4, life: 12, max: 12, col: '230,220,255' }); }
function lyraCrystals(f, o, mf) { // each juggle hit: crystals form above them and fall; she stays where she is
  const mv = f.move, n = mv.crystals, near = Math.abs(o.x - f.x) <= LYRA_RANGE; f.vx = 0;
  for (let k = 0; k < n; k++) {
    const hitF = mv.startup + k * mv.gap, r = mv.csize || 18;
    if (mf === hitF - 12 && !mv.runes) parts.push({ type: 'skycircle', x: o.x + (k - (n - 1) / 2) * 14, y: GROUND - o.y - 262 - k * 10, r: (mv.csize || 18) * 2.6, life: 18, max: 18 }); // the circle opens first, and holds...
    if (mf === hitF - 6) {
      const cx = o.x + (k - (n - 1) / 2) * 14;
      if (mv.runes) parts.push({ type: 'runecircle', x: cx, y: GROUND - o.y - 70 * o.ch.scale, r: 34 + r * 0.6, vx: o.vx * 0.5, vy: -o.vy * 0.5, life: 9, max: 9, spin: k }); // a magic circle closes on them and bursts
      else { // ...then the crystal falls out of it
        parts.push({ type: 'crystal', x: cx, y: GROUND - o.y - 260 - k * 10, vx: o.vx * 0.5, vy: (190 + k * 10) / 6, r, life: 7, max: 7, rot: (k - (n - 1) / 2) * 0.12 }); } // ...and the crystal falls out of it
    }
    if (mf === hitF && near) {
      const last = k === n - 1, cy = GROUND - o.y - 70 * o.ch.scale;
      columnHit(f, o, { dmg: mv.cdmg[Math.min(k, mv.cdmg.length - 1)], stun: 22, bstun: 10, push: 0.3, juggle: true, jugVy: last ? (mv.lastJug || mv.jugVy) : mv.jugVy, relaunch: !!(last && mv.relaunch), hitstop: last ? 9 : 4, label: mv.label,
        ...(last && mv.kdEnd ? { kd: true, kdVx: mv.kdVx || 6, kdVy: mv.kdVy != null ? mv.kdVy : -6, juggle: false } : {}) });
      if (mv.runes) { parts.push({ type: 'ring', x: o.x, y: cy, r: 8, vr: last ? 7 : 5, life: 12, max: 12, col: '255,190,245' }); for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3; parts.push({ type: 'spark', x: o.x, y: cy, vx: Math.cos(an) * 5, vy: Math.sin(an) * 5, life: 12, max: 12, col: '255,200,250' }); } }
      else crystalShatter(o.x, cy, last);
      sfx(last ? 'hitH' : 'orb');
      if (o.state === 'knock' || o.state === 'hitstun') { f.hitConnected = true; f.lastResult = 'hit'; } // (so cancels and chains work as with any hit)
    }
  }
}
// Lyra's runes appear right where the opponent stands, out to a long range (further than Jesse's guns)
function lyraReach(f, o, maxD, minD) {
  const mv = f.move, s = f.ch.scale, ahead = (o.x - f.x) * f.facing / s, base = mv.psyFist ? mv.psyFist[0] : mv.floorGlyph;
  if (base == null) return;
  const d = clamp(ahead, minD, maxD), shift = d - base;
  if (mv.psyFist) mv.psyFist = [d, ...mv.psyFist.slice(1)];
  if (mv.floorGlyph) mv.floorGlyph = d;
  if (mv.hitbox) mv.hitbox = [mv.hitbox[0] + shift, mv.hitbox[1] + shift, mv.hitbox[2], mv.hitbox[3]];
}
// Tanaka's hit and run: after the hit he backs off fast
function hopBack(f, from, n = 12, sp = 8) { const mf = f.mf; if (f.move && f.move.fiveEnder && f.guardLagUntil > game.frame) return; /* guarded at the end of his string: he's caught, no running away */ if (mf > from && mf <= from + n) { f.vx = -f.facing * sp * (1 - (mf - from) / (n + 4)); if (mf % 3 === 0) dustAt(f.x, false); } }
function geyser(f, o, x) { // a column of water erupting under them
  parts.push({ type: 'wcol', x, w: 46, life: 22, max: 22, col: '150,215,255' }); sfx('flame'); game.shake = Math.max(game.shake, 4);
  for (let i = 0; i < 10; i++) parts.push({ type: 'aura', x: x + rnd(-24, 24), y: GROUND - rnd(0, 200), vx: rnd(-1, 1), vy: -rnd(2, 5), life: 18, max: 18, r: rnd(3, 5), col: '170,225,255' });
  const hu = hurtbox(o, true); if (!hu || jumpedOver(o, 70)) return; // (jump over the eruption)
  const hb = { x0: x - 28, x1: x + 28, y0: 0, y1: 260 };
  if (overlap(hb, hu)) applyHit(f, o, { dmg: 46, stun: 22, bstun: 12, push: 0.5, launch: true, launchVy: 13, type: 'mid', chip: true, hitstop: 10, proj: true, str: 1, gdrain: 12, label: 'Geyser' }, Math.sign(o.x - f.x) || f.facing, hb, hu);
}
// Every super can be escaped one way. The big ones ('guard') fill the screen: they can't be jumped over or dashed away from, only guarded.
// The others come out after a longer wind-up (he's invincible through it) and hit only where they land: jump over them ('jump')
// or dash out of the way ('dash').
const SUPER_DODGE = { qiCannon: 'guard', thousandFists: 'guard', saHeaven: 'guard',
  sdInferno: 'guard', shadowArmy: 'jump', gnHighNoon: 'jump', smDeadline: 'jump', greatSage: 'dash', plJudgement: 'dash' };
const SUPER_CUT = 45, POSSESS_CUT = 30; // frames the game pauses for a super's cut-in (and a possession's)
const SUPER_PRE = 16; // the extra wind-up (frames) for the supers that can be jumped or dashed away from
function superDodgeHint(f) { // as the super freeze ends: how to get away from it, over the one it's aimed at
  const mv = f.move, o = other(f); if (!mv || !mv.dodge || !o) return;
  const t = { jump: L('JUMP!', 'ジャンプでかわせ！'), dash: L('DASH AWAY!', 'ダッシュで逃げろ！'), guard: L('GUARD IT!', 'ガードしろ！') }[mv.dodge];
  popText(o.x, GROUND - o.y - 215, t, mv.dodge === 'guard' ? '255,210,120' : '150,230,255');
}
function superWindFX(f) { // the super's wind-up: power pulled in around him (he can't be hit through it)
  const s = f.ch.scale, col = f.ch.fxCol || '255,230,170';
  for (let i = 0; i < 3; i++) { const an = vrnd(0, Math.PI * 2), r = vrnd(70, 120); parts.push({ type: 'spark', x: f.x + Math.cos(an) * r, y: GROUND - f.y - 100 * s + Math.sin(an) * r * 0.8, vx: -Math.cos(an) * r / 7, vy: -Math.sin(an) * r / 9, life: 8, max: 8, col }); }
  parts.push({ type: 'ring', x: f.x, y: GROUND - f.y - 100 * s, r: 90, vr: -6, life: 10, max: 10, col });
}
// the Great Flood: for a while the stage is under water. The kappa swims (faster, and he attacks faster);
// whoever he's fighting wades (slower, and slower to attack)
const FLOOD_T = 600; // frames (10 seconds)
const FLOOD_HEAL = 0.12; // health the kappa gets back every frame of the flood (about 70 over the ten seconds)
const FLOOD_SWIM_MAX = 200; // how high the kappa can swim (a bit above a normal jump)
const FLOOD_DEPTH = 250; // the water's surface, above the floor
const FLOOD_DROWN = 0.15; // health drained from the other fighter every frame of the flood (about 90 over the ten seconds)
const floodOwner = f => game.flood && game.flood.t > 0 && game.flood.owner === f;
const floodVictim = f => game.flood && game.flood.t > 0 && game.flood.owner !== f;
function floodWalkMul(f) { return floodOwner(f) ? 1.5 : floodVictim(f) ? 0.75 : 1; } // (the kappa swims fast; the other wades — slower, but still able to get away or punish)
function floodTick() { if (!game.flood) return; if (--game.flood.t <= 0) { game.flood = null; return; }
  for (const f of fighters) if (floodOwner(f) && !f.ko && game.phase === 'fight') { f.hp = Math.min(f.ch.hp || 1000, f.hp + FLOOD_HEAL); if (game.frame % 14 === 0) parts.push({ type: 'aura', x: f.x + vrnd(-20, 20), y: GROUND - f.y - vrnd(30, 120), vx: 0, vy: -0.8, life: 22, max: 22, r: 3, col: '140,255,190' }); } // the water heals him
  for (const f of fighters) if (floodVictim(f) && !f.ko && game.phase === 'fight') { if (f.hp > 1) f.hp = Math.max(1, f.hp - FLOOD_DROWN); if (game.flood.t === FLOOD_T - 40) popText(f.x, GROUND - f.y - 210, L('DROWNING!', '溺れる！'), '150,215,255'); if (game.frame % 9 === 0) parts.push({ type: 'aura', x: f.x + f.facing * 10 + vrnd(-6, 6), y: GROUND - f.y - 150 * f.ch.scale, vx: 0, vy: -vrnd(0.8, 1.6), life: 26, max: 26, r: 3, col: '220,245,255' }); } // drowning: bubbles escaping, health draining away
  if (game.frame % 5 === 0) for (const f of fighters) if (Math.abs(f.vx) > 0.5 && f.y <= 0) parts.push({ type: 'aura', x: f.x - Math.sign(f.vx) * 16, y: GROUND - 34, vx: -f.vx * 0.2, vy: -vrnd(0.5, 1.5), life: 14, max: 14, r: 3, col: '200,235,255' }); }
function drawFlood() { // the whole stage under water: a surface far overhead, light rays, rising bubbles — and a gauge of the time left
  const fl = game.flood; if (!fl || fl.t <= 0) return; const rise = Math.min(1, (FLOOD_T - fl.t) / 30), fade = Math.min(1, fl.t / 30), t = globalT;
  const surf = GROUND - FLOOD_DEPTH * rise; // the water rises from the floor to a little above a jump
  if (fl.owner && fl.owner.alt && ctx === canvas.getContext('2d')) { drawInAltHue(drawFlood); return; } // (the second kappa's flood, in a mirror match, is another colour)
  ctx.save(); ctx.globalAlpha = fade;
  const g = ctx.createLinearGradient(0, surf, 0, GROUND + 70); g.addColorStop(0, 'rgba(110,190,255,.28)'); g.addColorStop(1, 'rgba(20,70,150,.45)'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, GROUND + 70); for (let x = 0; x <= W; x += 24) ctx.lineTo(x, surf + Math.sin(t * 0.06 + x * 0.025) * 5); ctx.lineTo(W, GROUND + 70); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(235,250,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 0; x <= W; x += 24) { const y = surf + Math.sin(t * 0.06 + x * 0.025) * 5; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x0 = ((i * 190 + t * 0.4) % (W + 200)) - 100; ctx.fillStyle = 'rgba(200,235,255,.05)'; ctx.beginPath(); ctx.moveTo(x0, surf); ctx.lineTo(x0 + 40, surf); ctx.lineTo(x0 + 120, GROUND); ctx.lineTo(x0 + 60, GROUND); ctx.closePath(); ctx.fill(); } // shafts of light from the surface
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 14; i++) { const x = (i * 71 + 30) % W, y = GROUND - ((t * (0.8 + (i % 4) * 0.3) + i * 53) % Math.max(1, GROUND - surf)); ctx.strokeStyle = 'rgba(220,245,255,.55)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x + Math.sin(t * 0.05 + i) * 6, y, 2 + (i % 3), 0, Math.PI * 2); ctx.stroke(); } // bubbles
  ctx.restore();
  // the gauge: a bar of water draining, with the seconds left, under the round timer
  const k = fl.t / FLOOD_T, gx = W / 2 - 90, gy = 98, gw = 180, gh = 12;
  ctx.save(); ctx.fillStyle = 'rgba(10,20,40,.7)'; rr(gx - 2, gy - 2, gw + 4, gh + 4, 6); ctx.fill();
  const gg = ctx.createLinearGradient(gx, 0, gx + gw, 0); gg.addColorStop(0, '#2f8fe0'); gg.addColorStop(1, '#9fe0ff'); ctx.fillStyle = gg; rr(gx, gy, gw * k, gh, 5); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(gx + 2, gy + 2, Math.max(0, gw * k - 4), 3);
  ctx.font = "700 13px 'Rajdhani', system-ui, sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(10,20,40,.8)';
  const label = L('🌊 FLOOD ', '🌊 水没 ') + (fl.t / 60).toFixed(1) + L('s', '秒'); ctx.strokeText(label, W / 2, gy + gh + 3); ctx.fillStyle = k < 0.25 ? '#ffd2a0' : '#d8f0ff'; ctx.fillText(label, W / 2, gy + gh + 3);
  ctx.restore();
}
function zoneHit(f, o, h, hb) { // a hit only where it lands (hb): jump or dash out of it and it misses
  const hu = hurtbox(o, true); if (!hu || !overlap(hb, hu)) return false;
  applyHit(f, o, { type: 'mid', chip: true, proj: true, str: h.launch || h.kd ? 2 : 1, hitstop: 4, gdrain: 6, ...h }, Math.sign(o.x - f.x) || f.facing, hb, hu); return true;
}
const caughtIn = o => o.state === 'knock' && o.juggle; // already juggled in a combo: ranged attacks follow them into the air
const jumpedOver = (o, h = 60) => o.y > h && !caughtIn(o); // a free opponent this high has jumped over a ranged attack aimed along the ground
function columnHit(f, o, h) { // a hit that lands wherever they are (supers, floods, pillars)
  const hu = hurtbox(o, true); if (!hu) return;
  const hb = { x0: o.x - 20, x1: o.x + 20, y0: 0, y1: 400 };
  applyHit(f, o, { type: 'mid', chip: true, proj: true, str: h.launch || h.kd ? 2 : 1, hitstop: 4, gdrain: 6, ...h }, Math.sign(o.x - f.x) || f.facing, hb, hu);
}
// the salaryman's possession: the angel or the devil takes him over for ten seconds
const POSSESS_T = 900; // (fifteen seconds)
// during the countdown: ← ← + I (angel) or ← ← + K (devil); the last one called holds for the whole round, with no timer
// (never both at once before the round: the double only comes by calling the other one during the fight)
function prePossessTick(f, t) {
  const o = other(f); let kind = null;
  if (f.ctrl instanceof CPU) { if (t === 50 && !game.watch) { const r = Math.random(); kind = r < 0.3 ? 'angel' : r < 0.55 ? 'devil' : null; } } // the CPU sometimes does it too
  else if (f.ctrl && f.ctrl.read) { const inp = f.ctrl.read(f, game.frame, o); if (inp && inp.bb && (inp.btn === 'hp' || inp.btn === 'hk')) { kind = inp.btn === 'hp' ? 'angel' : 'devil'; if (f.ctrl.consume) f.ctrl.consume(); } }
  if (!kind || f.prePoss === kind) return;
  f.prePoss = kind; sfx('charge'); game.shake = Math.max(game.shake, 4);
  popText(f.x, GROUND - 230, kind === 'angel' ? L('ANGEL — ALL ROUND!', '天使憑依・このラウンドずっと！') : L('DEVIL — ALL ROUND!', '悪魔憑依・このラウンドずっと！'), kind === 'angel' ? '255,230,150' : '255,90,70');
  for (let i = 0; i < 18; i++) { const an = i * Math.PI / 9; parts.push({ type: 'spark', x: f.x, y: GROUND - 110, vx: Math.cos(an) * 6, vy: Math.sin(an) * 6, life: 20, max: 20, col: kind === 'angel' ? '255,235,160' : '255,100,60' }); }
}
function startPossession(f, kind) {
  if ((kind === 'angel' && f.ch.possess === 'devil') || (kind === 'devil' && f.ch.possess === 'angel')) kind = 'double'; // the other one arrives while one already has him: both at once
  f.ch = kind === 'angel' ? ANGEL_CH : kind === 'devil' ? DEVIL_CH : DOUBLE_CH; f.possT = kind === 'double' ? Math.round(POSSESS_T * 0.75) : POSSESS_T;
  popText(f.x, GROUND - 200, kind === 'angel' ? L('ANGEL POSSESSION!', '天使憑依！') : kind === 'devil' ? L('DEVIL POSSESSION!', '悪魔憑依！') : L('DOUBLE POSSESSION!!', '二重憑依！！'), kind === 'angel' ? '255,230,150' : kind === 'devil' ? '255,90,70' : '255,170,220');
  if (kind === 'double') { game.shake = Math.max(game.shake, 10); for (let i = 0; i < 24; i++) { const an = i * Math.PI / 12; parts.push({ type: 'spark', x: f.x, y: GROUND - f.y - 110, vx: Math.cos(an) * 9, vy: Math.sin(an) * 9, life: 22, max: 22, col: i % 2 ? '255,240,190' : '255,90,70' }); } }
  for (let i = 0; i < 16; i++) { const an = i * Math.PI / 8; parts.push({ type: 'spark', x: f.x, y: GROUND - f.y - 110, vx: Math.cos(an) * 6, vy: Math.sin(an) * 6, life: 18, max: 18, col: kind === 'angel' ? '255,240,190' : '255,90,60' }); }
  parts.push({ type: 'ring', x: f.x, y: GROUND - f.y - 110, r: 10, vr: 8, life: 18, max: 18, col: kind === 'angel' ? '255,230,150' : '255,90,70' });
  sfx(kind === 'angel' ? 'super' : 'ko');
}
function endPossession(f) {
  if (!f.ch.possess) return;
  if (f.wholeKind && f.ch.possess !== f.wholeKind) { // a double on top of a possession called before the round: when it wears off, he's back in that form (no timer)
    f.ch = f.wholeKind === 'angel' ? ANGEL_CH : DEVIL_CH; f.possT = 0; popText(f.x, GROUND - 200, L('DOUBLE OVER', '二重憑依終了'), '220,225,235'); sfx('vanish'); return; }
  f.ch = CHARS[f.key]; popText(f.x, GROUND - 200, L('POSSESSION OVER', '憑依終了'), '220,225,235');
  for (let i = 0; i < 8; i++) parts.push({ type: 'smoke', x: f.x + rnd(-30, 30), y: GROUND - f.y - rnd(40, 160), vx: rnd(-1, 1), vy: -1, r: rnd(6, 10), vr: 0.3, life: 20, max: 20, col: '200,200,210' });
  sfx('vanish');
}
function drawPossessBar(f) { // the time left in the possession, over his head
  const k = f.possT / POSSESS_T, x = f.x - 30, y = GROUND - f.y - 205 * f.ch.scale, angel = f.ch.possess === 'angel';
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(x - 1, y - 1, 62, 7);
  ctx.fillStyle = angel ? '#ffd86b' : '#ff4a3a'; ctx.fillRect(x, y, 60 * k, 5);
}
function aegisSpent(f) { f.guard = Math.min(f.guard, 50); f.guardSlowT = 600; } // after the Aegis: half a guard meter, recovering slowly
function spawnHolyWave(f) { // a crescent of light that rolls along the floor
  projs.push({ id: ++serial, type: 'hwave', owner: f, x: f.x + f.facing * 150, y: 0, vx: f.facing * 10, dir: f.facing, life: 46, t: 0, hit: false });
}
// heavy techniques are slow to recover when they miss or are guarded, but quick to follow up when they land
function hitRecover(f, n) { const mv = f.move; if (!mv.cut && f.hitConnected && f.lastResult !== 'block') { mv.cut = true; mv.recovery = Math.min(mv.recovery, n); } }
const holding = f => { const mv = f.move; return mv.holdFor != null ? f.mf < mv.holdFor : !!(f.inp && f.inp.held && f.inp.held[mv.holdBtn]); };
function addBrand(d, n) { // a holy brand burned onto them (up to five; they fade after four seconds)
  d.brands = Math.min(5, (d.brands || 0) + n); d.brandT = 240;
  parts.push({ type: 'ring', x: d.x, y: GROUND - d.y - 112 * d.ch.scale, r: 4, vr: 2.2, life: 12, max: 12, col: '190,225,255' });
}
function brandBurst(f, o, last) { // one brand bursts on their body in a cross of light
  const hu = hurtbox(o, true), cy = GROUND - o.y - 100 * o.ch.scale;
  parts.push({ type: 'slashx', x: o.x, y: cy, r: last ? 46 : 32, life: 12, max: 12, col: '190,225,255', rot: Math.PI / 4 });
  parts.push({ type: 'ring', x: o.x, y: cy, r: 6, vr: last ? 6 : 4, life: 14, max: 14, col: '230,245,255' });
  sfx(last ? 'hitH' : 'orb');
  if (!hu) return;
  const hb = { x0: o.x - 20, x1: o.x + 20, y0: o.y, y1: o.y + 220 };
  applyHit(f, o, { dmg: last ? 30 : 18, stun: 24, bstun: 12, push: 0.5, type: 'mid', chip: true, hitstop: last ? 9 : 4, proj: true, str: 1, gdrain: 8,
    juggle: true, jugVy: last ? 10 : 7, label: 'Verdict Thrust' }, Math.sign(o.x - f.x) || f.facing, hb, hu);
}
function sanctHit(f, o, last) {
  const hu = hurtbox(o, true); if (!hu) return;
  const hb = { x0: o.x - 20, x1: o.x + 20, y0: 0, y1: 400 };
  parts.push({ type: 'slashx', x: o.x, y: GROUND - o.y - 90, r: last ? 50 : 26, life: 10, max: 10, col: '190,225,255', rot: Math.PI / 4 });
  applyHit(f, o, { dmg: last ? 70 : 16, stun: 22, bstun: 10, push: last ? 8 : 0.2, kd: last, kdVx: 9, kdVy: 11, type: 'mid', chip: true, hitstop: last ? 12 : 3, proj: true, str: last ? 2 : 1,
    gdrain: 6, superHit: true, hold: !last, juggle: true, jugVy: 3, label: 'Sanctuary' }, Math.sign(o.x - f.x) || f.facing, hb, hu);
  if (!last) sfx('orb');
}
// (old: brands were added by the string itself)
function brandOn(f, o) {
  if (!f.move.brand || !f.hitConnected || f.lastResult === 'block' || f.brandedFor === f.serial) return;
  f.brandedFor = f.serial;
  o.brands = Math.min(5, (o.brands || 0) + 1); o.brandT = 240;
  parts.push({ type: 'ring', x: o.x, y: GROUND - o.y - 100 * o.ch.scale, r: 6, vr: 2.5, life: 12, max: 12, col: '255,225,140' });
}
function verdictPillar(f, o, last) { // one brand bursts: a pillar of light comes down on them, wherever they are
  const hu = hurtbox(o, true);
  parts.push({ type: 'lbeam', x: o.x, w: 46, life: 16, max: 16 });
  parts.push({ type: 'ering', x: o.x, y: GROUND, r: 8, vr: 8, life: 14, max: 14, col: '255,225,140' });
  sfx(last ? 'hitH' : 'orb'); game.shake = Math.max(game.shake, last ? 6 : 3);
  if (!hu) return;
  const hb = { x0: o.x - 24, x1: o.x + 24, y0: 0, y1: 400 };
  applyHit(f, o, { dmg: last ? 40 : 22, stun: 24, bstun: 12, push: last ? 4 : 0.5, kd: last, kdVx: 6, kdVy: 10, type: 'mid', chip: true, hitstop: last ? 10 : 4, proj: true,
    str: last ? 2 : 1, gdrain: 10, juggle: true, jugVy: 6, label: 'Verdict' }, Math.sign(o.x - f.x) || f.facing, hb, hu);
}
// Bastion March finisher: the shield flies out spinning, hits up to three times and comes back to his hand
function spawnAegis(f) {
  f.shieldOut = true;
  projs.push({ id: ++serial, type: 'aegis', owner: f, x: f.x + f.facing * 50, y: 100, vx: f.facing * 13, vy: 0, dir: f.facing, hits: 0, last: -99, life: 120, t: 0 });
  sfx('throw');
}
function parryCounter(d, a, h) {
  sparks(d.x + d.facing * 30, GROUND - 100, 'block'); sfx('block'); popText(d.x, GROUND - 170, 'PARRY!', '125,235,255');
  game.freeze = Math.max(game.freeze, 10);
  if (h.proj) return; // projectiles are just absorbed
  d.facing = Math.sign(a.x - d.x) || d.facing;
  startMove(d, specialMove(d.move.parryInto || 'parryStrike'), 1, true); d.invul = 8;
}
function spawnRain(f, o, idx) { // lightning balls drop straight down onto a juggled opponent
  projs.push({ id: ++serial, type: 'rain', owner: f, idx, x: o.x + (idx - 1) * 14, y: Math.min(o.y + 200, 420), vx: 0, vy: -11, r: 14,
    dmg: 22, stun: 16, bstun: 10, push: 0.5, hitstop: 5, life: 60, chip: true, air: true, juggle: true, jugVy: 6, dir: f.facing });
  sfx('zap');
}
function spawnRelay(f, o) { // a clone appears beyond the juggled opponent and kicks them back to Kuro
  const side = Math.sign(o.x - f.x) || f.facing, x = clamp(o.x + side * 110, -20, W + 20);
  projs.push({ id: ++serial, type: 'clone', relay: true, owner: f, x, y: 0, yOff: Math.max(0, o.y - 10), vx: -side * 9, vy: 0, w: 28, h0: 0, h1: 110,
    dmg: 30, stun: 20, bstun: 12, push: 1, kd: false, juggle: true, jugVy: 8, hitstop: 8, life: 30, chip: true, dir: -side });
  puff(x, o.y + 60); sfx('clone');
}
function spawnDecoy(f) { // looks like Kuro still doing the hand sign while the real one charges
  projs.push({ id: ++serial, type: 'decoy', owner: f, x: f.x, y: 0, vx: 0, vy: 0, life: 90, dir: f.facing });
}
function spawnGuardShadow(f) { // a shadow left standing on guard; it soaks up to two attacks
  projs.push({ id: ++serial, type: 'guardShadow', owner: f, x: f.x, y: 0, vx: 0, vy: 0, life: 60, hits: 0, dir: f.facing });
}
function spawnBeam(f) {
  projs.push({ id: ++serial, type: 'beam', owner: f, life: 56, t: 0, hits: 0, max: 13, interval: 4, last: -99, dmg: 20, lastDmg: 90,
    stun: 14, bstun: 10, push: 1.5, dir: f.facing });
  sfx('beam'); game.shake = Math.max(game.shake, 8);
}
// combo chains: U U I / U U J and J J J / J J K
const LOOKS = {}; // per fighter: how the shared combo moves look for them
const TETSU_LOOK = {
  jPalm: { label: 'Twin Palm Lift', wind: 'twinW', pose: 'twinUp', burst: [30, 182], aura: true },
  jElbow: { label: 'Rising Knee', wind: 'kneeW', pose: 'knee', burst: [46, 112] },
  jUpper: { label: 'Corkscrew Upper', pose: 'dragonFist', spin: [1, 7], fx: 'helix', aura: true },
  jRise: { label: 'Rising Dragon Fist', pose: 'dragonFist', trail: null, spin: [1, 9], fx: 'helix' },
  jSpin: { label: 'Twin Dragon Palms', wind: 'palmW', pose: 'twinPalm', trail: null, spin: null, burst: [100, 108], fx: 'cone', aura: true },
  aPalm: { label: 'Air Hook', pose: 'airHook' },
  aElbow: { label: 'Air Knee', pose: 'airKnee', burst: [40, 100] },
  aKunai: { trail: null, fx: 'fists', poseFn: (f, mf) => (mf > 4 && mf <= 13) ? (Math.floor((mf - 5) / 3) % 2 ? POSES.airJabB : POSES.airJabA) : null },
  aSpin: { label: 'Air Twin Palms', pose: 'airTwin', trail: null, spin: null, burst: [100, 100], fx: 'cone', aura: true },
  airSmash: { label: 'Hammer Drop', wind: 'hammerW', pose: 'airHammer', trail: null, fx: 'comet' },
  aMeteor: { label: 'Meteor Knee', pose: 'diveKnee', trail: null, fx: 'comet', aura: true },
  leapHammer: { wind: 'hammerW', pose: 'airHammer' },
};
LOOKS.brawler = TETSU_LOOK;
const GOLD = '255,205,110';
LOOKS.kappa = {
  jPalm: { label: 'Rake Lift', pose: 'kClawUp', claw: [60, 150, -1.3, 60] }, jElbow: { label: 'Double Rake', pose: 'kClawX', claw: [70, 140, 0.9, 64] }, jUpper: { label: 'Rising Rake', pose: 'kClawUp', claw: [60, 150, -1.3, 60] },
  jRise: { label: 'Geyser Hop', pose: 'kClawUp', claw: [50, 170, -1.4, 70] }, jSpin: { label: 'Frenzy Finish', pose: 'kClawDown', spin: null, hitbox: [10,150,40,290], claw: [80, 170, 0.9, 80] },
  aPalm: { label: 'Air Rake', pose: 'kAirClaw', claw: [70, 90, 0.8, 44] }, aElbow: { label: 'Air Double Rake', pose: 'kClawX', claw: [70, 90, 0.9, 52] }, aKunai: { label: 'Air Claw Flurry', pose: 'kAirClaw', poseFn: null, blade: false, claw: [70, 90, -0.8, 50] },
  aSpin: { label: 'Air Shell Spin', pose: 'kCurl', spin: null }, aMeteor: { label: 'Belly Flop', pose: 'kBelly' }, airSmash: { label: 'Diving Claws', pose: 'kClawDown', claw: [80, 60, 1.1, 66] },
  jab2: { label: 'Claw Swipe 2', pose: 'kClawUp', claw: [80, 120, -0.8, 44] }, oneTwo: { label: 'Double Claw', pose: 'kClawX', claw: [90, 110, 0.9, 60] }, leapHammer: { label: 'Leaping Claws', pose: 'kClawDown', claw: [80, 90, 1.0, 60] },
  kick2: { label: 'Low Claw 2', wind: 'crouch', pose: 'kLowClaw', claw: [80, 30, 0.2, 40] }, kick3: { label: 'Rising Claw', pose: 'kClawUp', claw: [60, 140, -1.3, 56] }, chainRound: { label: 'Wild Spin', pose: 'kClawX', poseFn: null, spin: null, claw: [70, 110, 1.4, 70] },
  lowMid: { label: 'Low-High Rake', pose: 'kClawUp', claw: [60, 140, -1.2, 56] }, jabKick: { label: 'Swipe, Rake', pose: 'kClawDown', claw: [80, 100, 0.9, 50] }, risingKick: { label: 'Rising Rake Chain', pose: 'kClawUp', trail: null, claw: [60, 150, -1.3, 60] }, chainSlide: { label: 'Belly Slide', pose: 'kBelly' },
};
LOOKS.gunman = {
  jPalm: { label: 'Juggle Shot', pose: 'gAim', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 24, jugVy: 8 });  } } }, jElbow: { label: 'Twin Juggle Shot', pose: 'gTwin', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 14, jugVy: 7 }); aimShot(f, o, { dmg: 14, jugVy: 7, y: f.y + 96 }); } } }, jUpper: { label: 'Rising Shot', pose: 'gUp', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 24, jugVy: 10 });  } } },
  jRise: { label: 'Sky Shot', pose: 'gUp', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 28, jugVy: 11 });  } } }, jSpin: { label: 'Finishing Blast', pose: 'gTwin', spin: null, hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 30, jugVy: 6, kd: true }); aimShot(f, o, { dmg: 30, jugVy: 6, y: f.y + 96 }); } } },
  aPalm: { label: 'Air Shot', pose: 'gAirDown', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 20, jugVy: 6 });  } } }, aElbow: { label: 'Air Twin Shot', pose: 'gAirDown', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 14, jugVy: 6 }); aimShot(f, o, { dmg: 14, jugVy: 6, y: f.y + 96 }); } } }, aKunai: { label: 'Air Fan', pose: 'gAirDown', poseFn: null, blade: false, hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 16, jugVy: 6 }); aimShot(f, o, { dmg: 16, jugVy: 6, y: f.y + 96 }); } } },
  aSpin: { label: 'Air Finishing Blast', pose: 'gTwin', spin: null, hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 26, jugVy: 5, kd: true }); aimShot(f, o, { dmg: 26, jugVy: 5, y: f.y + 96 }); } } }, aMeteor: { label: 'Dive Shot', pose: 'gAirDown' }, airSmash: { label: 'Gun Drop', pose: 'gAirDown' },
  jab2: { label: 'Hip Shot 2', pose: 'gTwin', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 18, jugVy: 5 });  } } }, oneTwo: { label: 'Double Tap', pose: 'gTwin', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 16, jugVy: 5 }); aimShot(f, o, { dmg: 16, jugVy: 5, y: f.y + 96 }); } } }, leapHammer: { label: 'Leaping Shot', pose: 'gAirDown', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 24, jugVy: 6 });  } } },
  kick2: { label: 'Low Shot 2', pose: 'gLow', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { y: 44, dmg: 20, low: true }); } }, kick3: { label: 'Rising Shot', pose: 'gUp', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 24, jugVy: 9 });  } } },
  chainRound: { label: 'Spinning Shots', pose: 'gTwin', poseFn: null, spin: null, hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 16, jugVy: 5 }); aimShot(f, o, { dmg: 16, jugVy: 5, y: f.y + 96 }); } } }, lowMid: { label: 'Low Shot, High Shot', pose: 'gTwin', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 20, jugVy: 6 });  } } },
  jabKick: { label: 'Hip Shot, Twin Shot', pose: 'gTwin', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 16, jugVy: 5 }); aimShot(f, o, { dmg: 16, jugVy: 5, y: f.y + 96 }); } } }, risingKick: { label: 'Rising Twin Shot', pose: 'gUp', trail: null, hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { aimShot(f, o, { dmg: 16, jugVy: 9 }); aimShot(f, o, { dmg: 16, jugVy: 9, y: f.y + 96 }); } } }, chainSlide: { label: 'Slide Shot', pose: 'gLow', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { y: 26, dmg: 24, low: true, kd: true }); } },
};
LOOKS.salary = {
  jPalm: { label: 'Briefcase Lift', pose: 'sCase' }, jElbow: { label: 'Necktie Whip', pose: 'palm' }, jSpin: { label: 'Commuter Kick', pose: 'highKick' },
  jRise: { label: 'Overtime Upper', pose: 'uppercut' }, aPalm: { label: 'Air Briefcase', pose: 'sCase' },
};
LOOKS.salaryAngel = {
  jPalm: { label: 'Feather Lift', pose: 'blast', burst: [90, 130] }, jElbow: { label: 'Wing Strike', pose: 'saIdle', burst: [70, 140] }, jUpper: { label: 'Rising Light', pose: 'uppercut', burst: [70, 160] },
  jRise: { label: 'Ascending Wings', pose: 'uppercut', burst: [60, 180] }, jSpin: { label: 'Halo Kick', pose: 'highKick', burst: [100, 160] },
  aPalm: { label: 'Air Feather', pose: 'blast' }, aSpin: { label: 'Air Halo Kick', pose: 'highKick' },
};
LOOKS.salaryDevil = {
  jPalm: { label: 'Claw Lift', pose: 'kClawUp', claw: [60, 150, -1.3, 60, '255,120,90'] }, jElbow: { label: 'Horn Butt', pose: 'sdIdle', claw: [70, 140, 0.9, 64, '255,120,90'] },
  jUpper: { label: 'Hellclaw Upper', pose: 'kClawUp', claw: [60, 160, -1.3, 70, '255,120,90'] }, jRise: { label: 'Brimstone Rise', pose: 'uppercut' },
  jSpin: { label: 'Hellfire Kick', pose: 'highKick', claw: [90, 170, 0.6, 80, '255,140,60'] }, aPalm: { label: 'Air Hellclaw', pose: 'kAirClaw', claw: [70, 90, 0.8, 50, '255,120,90'] },
};
for (const id of ['jPalm', 'jElbow', 'jUpper', 'jRise', 'jSpin', 'aPalm', 'aElbow', 'aKunai', 'aSpin', 'leapHammer', 'kick3', 'risingKick']) if (LOOKS.gunman[id]) LOOKS.gunman[id].poseFn = aimPose;
LOOKS.paladin = {
  jPalm: { label: 'Sword Lift', pose: 'pRise', hitbox: [10,165,40,190] },
  jElbow: { label: 'Shield Lift', pose: 'pShieldUp', hitbox: [10,135,40,190] },
  jUpper: { label: 'Rising Cleave', pose: 'pRise', hitbox: [10,170,40,200] },
  jRise: { label: 'Ascension', pose: 'pShieldUp', blade: false, aura: true, hitbox: [10,140,40,230] },
  jSpin: { label: 'Halo Cleave', pose: 'pCleave', spin: null, hitbox: [10,190,40,270], burst: [120, 140] },
  aPalm: { label: 'Air Slash', pose: 'pAir', hitbox: [5,150,10,130] },
  aElbow: { label: 'Air Shield Bash', pose: 'pAir', hitbox: [5,110,10,130] },
  aKunai: { label: 'Air Sword Flurry', blade: false, pose: 'pAir', poseFn: null, hitbox: [5,155,0,130] },
  aSpin: { label: 'Air Spin Slash', pose: 'pHalo', spinStaff: true, spin: null, hitbox: [-60,160,0,140] },
  aMeteor: { label: 'Plunging Sword', pose: 'pAirDown' },
  airSmash: { label: 'Sword Drop', wind: 'pCleaveW', pose: 'pAirDown' },
  jab2: { label: 'Pommel Strike 2', wind: 'pBashW', pose: 'pSlash', hitbox: [20,160,80,140] },
  oneTwo: { label: 'Pommel, Bash', pose: 'pBash', hitbox: [20,140,60,150] },
  leapHammer: { label: 'Leaping Cleave', wind: 'pCleaveW', pose: 'pCleave', aura: false },
  kick2: { label: 'Low Cut 2', wind: 'pThrustW', pose: 'pLowCut', hitbox: [20,170,0,50] },
  kick3: { label: 'Rising Pommel', wind: 'pThrustW', pose: 'pSlash', hitbox: [20,165,44,120] },
  chainRound: { label: 'Wide Sword Sweep', wind: 'pSlashW', pose: 'pThrust', poseFn: null, spinStaff: true, hitbox: [-60,185,40,130] },
  lowMid: { label: 'Low Cut, Rising Shield', wind: 'pThrustW', pose: 'pShieldUp', hitbox: [20,160,44,140] },
  jabKick: { label: 'Pommel, Cut', wind: 'pBashW', pose: 'pSlash', hitbox: [20,170,44,120] },
  risingKick: { label: 'Rising Shield Chain', wind: 'pQuake', pose: 'pShieldUp', hitbox: [15,150,40,180] },
  chainSlide: { label: 'Shield Slide', pose: 'pDash', hitbox: [0,150,0,60] },
};
LOOKS.psychic = {
  jPalm: { label: 'Lifting Glyph', pose: 'psyUp', psyFist: [62, 150, 0.7, -1] },
  jElbow: { label: 'Spirit Glyph', pose: 'psyPush', psyFist: [80, 155, 0.7] },
  jUpper: { label: 'Glyph Upper', pose: 'psyUp', psyFist: [60, 170, 0.85, -1] },
  jRise: { label: 'Rising Star', pose: 'psyUp', blade: false, aura: true, trail: null, psyFist: [58, 175, 1, -1] },
  jSpin: { label: 'Force Push', wind: 'psyW', pose: 'psyBoth', spin: null, trail: null, fx: 'cone' },
  aPalm: { label: 'Air Glyph', pose: 'airPsy', psyFist: [75, 90, 0.6] },
  aElbow: { label: 'Air Spirit Glyph', pose: 'airPsy', psyFist: [78, 100, 0.6] },
  aKunai: { label: 'Shard Rain', blade: false, trail: null, pose: 'airPsyBoth', psyFist: [85, 95, 0.65] },
  aSpin: { label: 'Air Force Push', pose: 'airPsyBoth', spin: null, trail: null, fx: 'cone' },
  aMeteor: { label: 'Psy Meteor', pose: 'airPsyDown', trail: null, fx: 'comet', aura: true },
  airSmash: { label: 'Gravity Drop', wind: 'psyRaise', pose: 'airPsyDown', trail: null, psyFist: [60, 30, 0.9, 1] },
  jab2: { label: 'Ripple 2', pose: 'psyPush', psyFist: [100, 112, 0.55] },
  oneTwo: { label: 'Twin Ripple', pose: 'psyBoth', psyFist: [100, 112, 0.6] },
  leapHammer: { label: 'Leaping Glyph', wind: 'psyRaise', pose: 'airPsyDown', aura: false, psyFist: [70, 40, 0.9, 1] },
  kick2: { label: 'Floor Glyph 2', wind: 'psyW', pose: 'psyLowCast', hitbox: [80,200,0,42], floorGlyph: 150 },
  kick3: { label: 'Glyph Flare', wind: 'psyW', pose: 'psyPush', hitbox: [40,160,40,110], psyFist: [105, 75, 0.65] },
  chainRound: { label: 'Glyph Sweep', wind: 'psyW', pose: 'psyBoth', poseFn: null, spin: null, trail: null, hitbox: [40,175,0,120], floorGlyph: 120, psyFist: [110, 80, 0.7] },
  lowMid: { label: 'Low-High Glyph', wind: 'psyW', pose: 'psyPush', hitbox: [40,160,10,110], floorGlyph: 105 },
  jabKick: { label: 'Ripple, Glyph', wind: 'psyW', pose: 'psyPush', hitbox: [40,160,30,110], psyFist: [100, 70, 0.6] },
  risingKick: { label: 'Rising Glyph Flare', wind: 'psyW', pose: 'psyUp', trail: null, hitbox: [30,140,40,170], psyFist: [70, 140, 0.8, -1] },
  chainSlide: { label: 'Gliding Glyph', pose: 'psyLowCast', hitbox: [40,150,0,34], floorGlyph: 100 },
};
LOOKS.staff = {
  jPalm: { label: 'Staff Jab Lift', pose: 'staffUp' },
  jElbow: { label: 'Staff Swing Lift', pose: 'staffSwingUp', spinWind: true },
  jUpper: { label: 'Pole Upper', pose: 'staffRise' },
  jRise: { label: 'Soaring Staff', pose: 'staffRise', blade: false, aura: false, trail: { cx: 20, cy: 90, r: 120, a0: -40, a1: 100, col: GOLD } },
  jSpin: { label: 'Staff Whirl', pose: 'staffWhirl', spinStaff: true, trail: { cx: 0, cy: 90, r: 120, a0: -60, a1: 60, col: GOLD } },
  aPalm: { label: 'Air Staff Jab', pose: 'airStaff', hitbox: [5,150,5,130] },
  aElbow: { label: 'Air Staff Swing', pose: 'airStaffSwing', spinWind: true, hitbox: [5,150,5,130] },
  aKunai: { label: 'Staff Flurry', blade: false, hitbox: [5,160,0,135], trail: { cx: 20, cy: 100, r: 110, a0: 70, a1: -40, col: GOLD }, poseFn: (f, mf) => (mf > 4 && mf <= 13) ? (Math.floor((mf - 5) / 3) % 2 ? POSES.airStaffSwing : POSES.airStaff) : null },
  aSpin: { label: 'Air Staff Whirl', pose: 'airStaffWhirl', spinStaff: true, spin: null, hitbox: [-60,170,0,140], trail: { cx: 0, cy: 80, r: 120, a0: -60, a1: 60, col: GOLD } },
  aMeteor: { label: 'Staff Meteor', pose: 'airStaffDown', trail: { cx: 20, cy: 40, r: 100, a0: 160, a1: 260, col: GOLD } },
  airSmash: { label: 'Staff Drop', wind: 'slamWAir', pose: 'airStaffDown', trail: { cx: 20, cy: 90, r: 110, a0: 110, a1: -40, col: GOLD } },
  jab2: { label: 'Staff Thrust 2', wind: 'thrustW', pose: 'thrust', staffExt: 50, hitbox: [20,180,92,128] },
  oneTwo: { label: 'Staff Twirl', pose: 'staffSwing', spinWind: true, hitbox: [20,190,90,140] },
  leapHammer: { label: 'Leaping Smash', wind: 'vault', pose: 'staffSlamAir', aura: false },
  kick2: { label: 'Low Thrust 2', wind: 'staffHighW', pose: 'staffLowThrust', staffExt: 30, hitbox: [20,165,0,60], trail: { cx: 20, cy: 85, r: 125, a0: 60, a1: -35, col: GOLD } },
  kick3: { label: 'Staff Snap Swing', wind: 'staffSwingW', pose: 'staffSwing', hitbox: [20,175,44,110] },
  chainRound: { label: 'Staff Round Sweep', wind: 'staffSwingW', pose: 'staffWhirl', poseFn: null, spinStaff: true, hitbox: [-60,185,40,130], trail: { cx: 0, cy: 95, r: 150, a0: -170, a1: 170, col: GOLD } },
  lowMid: { label: 'Staff Low-High', wind: 'staffLowW', pose: 'staffSwingUp', hitbox: [20,175,44,120] },
  jabKick: { label: 'Jab, Staff Swing', wind: 'staffSwingW', pose: 'staffSwing', hitbox: [20,175,44,120] },
  risingKick: { label: 'Rising Staff Swing', wind: 'crouch', pose: 'staffRise', hitbox: [15,170,40,160], trail: { cx: 20, cy: 90, r: 120, a0: -40, a1: 100, col: GOLD } },
  chainSlide: { label: 'Staff Slide', pose: 'staffSweep', spinStaff: true, hitbox: [0,150,0,34] },
};
// each fighter's own combo strings: a 5-hit ground string (U U U U K), a launcher (I) and finisher (K) from any point,
// a low string (J J K), and their own juggle and air strings. Anything not listed falls back to the shared moves.
function buildString(def, f) {
  const ch = f.ch, mv = { normal: true, inString: true, stance: 's', type: 'mid', stun: 16, bstun: 10, push: 3, hitstop: 6, bpush: 2, gdrain: 3, ...def };
  if (!def.jug && !def.air && !def.raw) mv.dmg = Math.round(mv.dmg * (mv.kind === 'k' ? ch.kDmg : ch.pDmg));
  if (ch.sturdy && !def.air) { mv.startup += 2; mv.recovery += 2; }
  const own = def.onFrame, step = def.step;
  if (def.jug && def.hop) { // a hop up into a juggled opponent: an eased arc from wherever he is, landing as the move ends
    Object.assign(mv, { selfMove: true, manualY: true, noPush: true });
    mv.onFrame = (f, o, mf) => {
      const T = mv.startup + mv.active + mv.recovery;
      if (mf === 1) { f.hopY0 = f.y; f.hopH = Math.max(f.y, def.hop === 'tgt' ? clamp(o.y - 10, 50, 190) : def.hop); }
      const e = Math.min(1, mf / T), y0 = f.hopY0 || 0, Hp = f.hopH; // ease up to the peak (where they are), then fall back down
      f.y = e < 0.45 ? y0 + (Hp - y0) * Math.sin(Math.PI / 2 * e / 0.45) : Hp * (1 - Math.pow((e - 0.45) / 0.55, 2));
      f.vx = Math.abs(o.x - f.x) > 46 ? f.facing * Math.min(5, (Math.abs(o.x - f.x) - 40) / 5) : 0;
      if (mf >= T - 1 && f.y < 4) { f.y = 0; if (mf === T - 1) dustAt(f.x, false); }
      if (own) own(f, o, mf);
    };
  }
  else if (def.jug && def.stay) { mv.selfMove = true; mv.onFrame = own; } // (Lyra: she casts from where she stands)
  else if (def.jug) { mv.selfMove = true; mv.onFrame = (f, o, mf) => { juggleStep(f, o, mf); if (own) own(f, o, mf); }; }
  else if (step) { mv.selfMove = true; mv.onFrame = (f, o, mf) => { if (mf <= mv.startup && Math.abs(o.x - f.x) > 80) f.vx = f.facing * step; else f.vx *= 0.6; if (own) own(f, o, mf); }; }
  if (def.jug || def.air) { const k = 1.3 * (ch.jugDmg || 1); mv.dmg = Math.round(mv.dmg * k); if (mv.lastDmg) mv.lastDmg = Math.round(mv.lastDmg * k); }
  return mv;
}
function chainMove(id, f) {
  if (f.ch.possess === 'angel' && (id === 'aWing' || id === 'aFeather')) { // the angel's longer air string: two extra hits
    const m = chainMove(id === 'aWing' ? 'aElbow' : 'aPalm', f); if (!m) return m;
    return Object.assign(m, { label: id === 'aWing' ? 'Wing Flurry' : 'Feather Strike', chain: id === 'aWing' ? { lp: 'aFeather', hp: 'aKunai', hk: 'aSpin', dhk: 'aMeteor' } : { hp: 'aKunai', hk: 'aSpin', dhk: 'aMeteor' } });
  }
  const st = STRINGS[f.ch.lookKey || f.key], def = st && st[id];
  const mv = def ? buildString(def, f) : chainMoveBase(id, f);
  if (mv && def) mv.strKey = id; // (which string hit it is: a fighter's frame table can set its frames)
  const look = LOOKS[f.ch.lookKey || f.key]; if (!def && mv && look && look[id]) Object.assign(mv, look[id]); // (a possessed salaryman fights with the angel's or the devil's moves)
  if (mv && f.ch.possess === 'angel' && id === 'aElbow' && mv.chain) mv.chain = { ...mv.chain, lp: 'aWing' }; // (the angel: U goes on in the air)
  if (mv && (id === 'jSpin' || id === 'jRise' || id === 'jUpper') && Array.isArray(mv.hitbox)) { // juggle lifts and finishers reach anyone still in the air in front of him — low after a bounce, or pushed a little away
    const hb = mv.hitbox = mv.hitbox.slice(); hb[0] = Math.min(hb[0], -10); hb[1] = Math.max(hb[1], 160); hb[2] = Math.min(hb[2], hb[2] < 0 ? hb[2] : 0); hb[3] = Math.max(hb[3], 250); }
  stretchReach(mv, f.ch.reachMul);
  if (f.ch.reachAdd && mv && Array.isArray(mv.hitbox) && mv.hitbox[1] > 60) { mv.hitbox = mv.hitbox.slice(); mv.hitbox[1] += f.ch.reachAdd; } // (Mei: her string hits reach the staff's tip too)
  if (f.key !== 'psychic' && f.key !== 'gunman' && mv && !mv.air && !mv.jug && Array.isArray(mv.hitbox)) mv.stepIn = mv.hitbox[1] - 30; // (Mei follows her own string in: each hit after the first steps toward them, so a string started at the staff's tip doesn't run out of reach)
  if (mv && f.ch.stringDelay && !mv.air && !KURO_STRONG.has(id)) { mv.startup += f.ch.stringDelay; mv.recovery += f.ch.stringDelay; } // Lyra: each hit of a string comes out later (juggle hits keep their pace)
  if (mv && f.key === 'ninja' && mv.recovery < 90) mv.recovery = Math.max(5, Math.round(mv.recovery * 0.75)); // Kuro recovers faster
  if (mv && KURO_STRONG.has(id) && !def) { const k = 1.3 * (f.ch.jugDmg || 1); mv.dmg = Math.round(mv.dmg * k); if (mv.lastDmg) mv.lastDmg = Math.round(mv.lastDmg * k); } // juggle and air hits hit harder (scaled per fighter)
  return mv;
}
const KURO_STRONG = new Set(['jPalm', 'jElbow', 'jUpper', 'jRise', 'jSpin', 'aPalm', 'aElbow', 'aKunai', 'aSpin', 'aMeteor', 'airSmash']);

