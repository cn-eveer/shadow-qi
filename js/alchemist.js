'use strict';
/* ================= Hohen, the golem doctor, and Mortar, his stone golem =================
   One will, two bodies. U and I are the golem's blows; J and K are Hohen's own (a stone-knuckle up close, glowing stones
   from further off). The duet is in how they're strung together: any mix of U and J, up to three presses, then a finisher —
   the golem's hammer (U), his stone barrage (J), his volley (K), the golem's grab (I) or uppercut (↓ + I). Where the four of
   them stand decides the combo: the golem in front of him or behind the opponent, Hohen close in or far back.
   The golem is not a second fighter but a small object riding on him (f.golem). It walks to the opponent by itself, but it
   never attacks by itself: only on his orders, and it keeps the same rules as everyone else:
     · one order at a time: he stays in his conducting pose until the golem has thrown the blow he ordered (no stacking orders);
     · strings like everyone's (three presses and a finisher), and then he stops for breath;
     · its blows count in the same combo: the same damage and hit-stun decay, at most lift, lift, bounce in a juggle;
     · hit the conductor: when he's hit, the order he gave is lost (and a hold lets go);
     · a hold lasts three seconds at most and lets go after four hits; then the golem can't grab again for two and a half seconds;
     · it has its own health (it can be beaten apart) and lasts thirty seconds before it crumbles; either way it's rebuilt.
   Its blows are resolved from the golem's own position, so a defender guards relative to whoever is attacking. */
CHARS.alchemist = {
  name: 'HOHEN', title: 'Golem Doctor', nameJa: 'ホーエン', titleJa: 'ゴーレム博士', dmgMul: 1.15, scale: 1, walk: 3.0, back: 2.6, jumpX: 4.0, jumpV: 17, jugDmg: 1,
  pDmg: 1, kDmg: 1, pReach: 1, kReach: 1, chargeRate: 0.6, auraCol: '255,200,120', fxCol: '255,200,120',
  ammo: 10, // ten glowing stones in his pockets: every stone he throws or sets as a trap uses one, and they come back one at a time
  sp: { fK: 'alUpStone', fKH: 'alTrap', fP: 'alShield', fPH: 'alTackle', bKH: 'alBedrock' }, sup: 'alOpus', fuseSp: 'alFuse', // (← → + J + K with a full fusion gauge: the golem armour)
  normalLook: {},
  colors: { coat: '#f4f6f8', coatB: '#d4d9de', pants: '#3a3f4f', pantsB: '#2b2f3b', shoe: '#2a2a30', shirt: '#cfe3f2', skin: '#efc9a4', hair: '#8e8f96', glass: '#2a2a30', stetho: '#2b2b33' },
  meterCol: ['#d98a2c', '#ffe0a8'], bannerCol: 'rgba(150,110,60,.9)', idle: 'alIdle', chargePose: 'alStoneUp', winPose: 'alPresent', atkCD: 8, recoverT: 10, hitFx: 'star',
  cpuBlock: 0.82, // (the CPU Hohen guards more: he's the one who has to survive while the golem works)
};
Object.assign(CHARS.alchemist, { altColors: { ...CHARS.alchemist.colors, coat: '#d9e6dc', coatB: '#b7c9bb', shirt: '#f0d8c0', hair: '#4a3b2e' } });
Object.assign(POSES, { // throwing a stone: the arm drawn back behind him with the weight on the back foot, then whipped through and forward
  alThrowW: P(-14, -105,-150, 30,60, 22,10, -26,-14),
  alThrow: P(22, 100,92, -26,14, 36,6, -24,-10), // (the release: the arm out level at the shoulder, not across his face)
  alThrowLow: P(30, 70,86, -10,30, 40,4, -26,-12),
  alKnuckleW: P(-6, 20,120, -30,20, 24,6, -24,-10), alKnuckle: P(18, 92,92, -30,40, 34,6, -26,-10), // a stone held in the fist, driven straight out
  alOpus: P(-8, 160,172, 150,168, 22,4, -22,-8), // both arms raised
  alIdle: P(-4, -13,32, -26,25, 18,3, -15,-5), // relaxed, chest up, both hands in his coat pockets
  alGlasses: P(-3, 52,170, -27,24, 18,3, -15,-5), // a finger pushing his spectacles up (the other hand stays in its pocket)
  alStoneUp: P(-5, 118,158, -25,26, 18,3, -18,-6), // a glowing stone held up to the light
  alBowDoc: P(10, -27,18, -40,11, 16,2, -16,-6), // a curt nod, hands still in his pockets
  alPresent: P(-4, 70,100, -26,25, 20,3, -20,-6), // a hand out toward his golem, the other in its pocket
  alArmorIdle: P(6, 48,138, 26,122, 24,5, -24,-10), // in the golem armour: stone fists up, weight forward
  alBrace: P(10, 60,150, 50,150, 40,-30, -30,-30) }); // set low, arms crossed before him: the stone skin
// U, I: the golem · J, K: Hohen · ↓ + U: golem low punch · ↓ + I: golem uppercut (a launcher) · ↓ + J / ↓ + K: his low stones
// → → + J: stone lob (stuns) · → → + K: trap stone · → → + U: shield bash · → → + I: tackle (in a juggle: Golem Meteor, the bounce)
// ← ← + K: Bedrock Stride (stone skin: armour, then a burst all round him) · in a juggle: U the golem's rising jab, I Stone Pillar, K Stone Comet
// U + J: Magnum Opus (the super) · ← → + J + K with a full fusion gauge: the golem armour for twenty seconds
const conductIn = (f, mv, mf) => { // the doctor keeps conducting until the golem has thrown the blow he ordered: no new order (or string step) before it lands
  const g = f.golem; if (!g || mf <= mv.startup) return; // (and for a heavy blow that's guarded or misses, until the golem has nearly recovered: he's committed to it, so it can be punished)
  const a = g.act, A = a && GOLEM_ACT[a.kind], mine = a && a.by === f.serial;
  const busy = (g.queue && g.qBy === f.serial) || (mine && !a.hit && a.t < A.su + A.ac), committed = mine && !A.light && a.res !== 'hit' && a.t < A.su + A.ac + A.rec - 4;
  if (busy && mf - mv.startup < 90) mv.active = Math.max(mv.active, mf - mv.startup + 2); // (still giving the order: the string can't go on yet)
  else if (committed) mv.recovery = Math.max(mv.recovery, mf - mv.startup - mv.active + 2); // (it's been thrown and missed or been guarded: he's open)
};
const holdMul = f => (f.golem && f.golem.hold ? 1.6 : 1); // (the golem is holding them: his blows hit harder)
const nearO = (f, o) => Math.abs(o.x - f.x) <= 120 && o.y < 70; // close enough for the stone-knuckle
function selfPunch(f, o, p) { // his own blow (the stone-knuckle)
  const hb = boxOf(f, p.box), hu = hurtbox(o, false, !!p.low); if (!hu || !overlap(hb, hu)) return;
  const res = applyHit(f, o, { type: 'mid', chip: false, proj: false, str: 0, gdrain: 2, label: 'Stone Knuckle', ...p }, Math.sign(o.x - f.x) || f.facing, hb, hu);
  if (res) { f.hitConnected = true; f.lastResult = res; }
}
function hohenStone(f, o, ex = {}) { // J: up close a stone-knuckle (no stone spent); from further off, a thrown stone
  if (nearO(f, o) || ex.knuckle) { const x = f.x + f.facing * 62, y = GROUND - f.y - 104; parts.push({ type: 'ring', x, y, r: 6, vr: 3.5, life: 10, max: 10, col: '255,210,120' }); sfx('swing');
    selfPunch(f, o, { box: [0, 100, 60, 140], dmg: Math.round(24 * (ex.k || 1) * holdMul(f)), stun: 22, bstun: 10, push: 1.4, hitstop: 6, gdrain: 5, label: ex.label === 'Stone Barrage' ? 'Stone Barrage' : 'Stone Knuckle', ...(ex.h || {}) }); }
  else alchemistStone(f, o, 70, ex);
}
// one beat: he gestures (the golem gets its order on that frame), or he strikes / throws himself
const beat = (label, pose, kind, ex = {}) => ({ label, startup: 4, active: 2, recovery: 6, wind: 'idle', pose, hitbox: null, chain: null, launch: false, kd: false, antiDone: true, ...ex,
  onFrame: (f, o, mf) => { const mv = f.move;
    if (mf === 1 && ex.near && nearO(f, o)) Object.assign(mv, ex.near); // (up close: the knuckle's own wind-up and timing)
    if (mf === 1 && ex.holdPunch && f.golem && f.golem.hold && kind) Object.assign(mv, { punchNow: true, label: 'Stone Knuckle', selfMove: true, ...KNUCKLE, startup: 8 }); // (U while the golem holds them: its hands are full, so he steps in and punches himself)
    if (mv.punchNow && mf < mv.startup) { const gap = Math.abs(o.x - f.x) - 80; f.vx = gap > 0 ? f.facing * Math.min(9, gap / 3) : 0; }
    if (mf === mv.startup) { if (mv.punchNow) { f.vx = 0; hohenStone(f, o, { knuckle: true }); } else if (kind) golemOrder(f, kind); if (ex.also) ex.also(f, o); }
    if (ex.each && mf >= mv.startup) ex.each(f, o, mf - mv.startup);
    conductIn(f, mv, mf); } });
const throwAnim = n => (f, mf) => { const mv = f.move; if (mf < mv.startup || mf > mv.startup + n) return null; const k = (mf - mv.startup) % 7; return lerpPose(POSES.alThrowW, POSES.alThrow, clamp(k / 2, 0, 1)); }; // (each stone of a volley gets its own throw)
const KNUCKLE = { wind: 'alKnuckleW', pose: 'alKnuckle', startup: 6, recovery: 9 };
const volleyBeat = lvl => (f, o, k) => { if (k <= 14 && k % 7 === 0) alchemistVolley(f, o, lvl, k / 7); }; // three stones, seven frames apart
// the duet strings: up to three presses of U and J in any order, then a finisher
const DUET1 = { lp: 'aU2', lk: 'aJ2', hp: 'aGrab', dhp: 'aUp', hk: 'aVol' }, DUET2 = { lp: 'aHam', lk: 'aJF', hp: 'aGrab', dhp: 'aUp', hk: 'aVol' };
const hStone = (label, chain) => beat(label, 'alThrow', null, { noSmear: true, wind: 'alThrowW', startup: 7, recovery: 13, near: KNUCKLE, also: (f, o) => hohenStone(f, o), chain }); // (the next press can come a little late and still string)
{
  const throwing = (label, fn, ex = {}) => beat(label, 'alThrow', null, { noSmear: true, wind: 'alThrowW', startup: 9, recovery: 14, also: fn, ...ex });
  const L = CHARS.alchemist.normalLook;
  L.sp0 = beat('Golem Jab', 'gAim', 'lp', { chain: DUET1, holdPunch: true });
  L.cp0 = beat('Golem Low Punch', 'gLow', 'lowp', { crouch: true, wind: 'crouch', chain: DUET1 });
  L.jp0 = beat('Golem Jab', 'gAim', 'lp');
  for (const st of ['s', 'j']) L[st + 'p1'] = beat('Golem Grab', 'gTwin', 'hp');
  L.cp1 = beat('Golem Uppercut', 'gTwin', 'upper', { crouch: true });
  L.sk0 = hStone('Stone Knuckle / Throw', DUET1);
  L.ck0 = throwing('Low Stone Throw', (f, o) => alchemistStone(f, o, 24, {}), { pose: 'alThrowLow', crouch: true });
  L.ck1 = throwing('Low Stone Volley', (f, o) => [0, 1, 2].forEach(i => alchemistStone(f, o, 24, { k: 0.7, sp: 9 + i * 1.6, fan: i, label: 'Stone Volley' })), { crouch: true, pose: 'alThrowLow' });
  L.jk0 = throwing('Air Stone Throw', (f, o) => alchemistStone(f, o, 70, {}), { startup: 7 });
  L.jk1 = throwing('Air Stone Volley', (f, o) => alchemistVolley(f, o, 0, 1), { startup: 7 });
  L.sk1 = { label: 'Stone Volley', held: true, noSmear: true, startup: 999, active: 2, recovery: 14, wind: 'alThrowW', pose: 'alThrow', hitbox: null, chain: null, launch: false, kd: false, antiDone: true, onFrame: stoneCharged,
    poseFn: (f, mf) => { const mv = f.move; if (!mv.fired) return lerpPose(POSES.alIdle, POSES.alThrowW, clamp(mf / 8, 0, 1)); if (mf < mv.startup - 2) return null; const k = (mf - mv.startup + 2) % 7; return lerpPose(POSES.alThrowW, POSES.alThrow, clamp(k / 2, 0, 1)); } }; // (charging: the arm drawn back and held)
}
const STONE_LV = [20, 42, 66]; // frames of holding K for gauges 1, 2 and 3
function stoneCharged(f, o, mf) { // K: hold to charge (three gauges), let go: three stones in a row
  const mv = f.move;
  if (!mv.fired) {
    mv.chargeMarks = [[STONE_LV[0], 'Lv1'], [STONE_LV[1], 'Lv2'], [STONE_LV[2], 'MAX']]; f.vx *= 0.6; mv.lvl = STONE_LV.filter(n => mf >= n).length;
    if (STONE_LV.includes(mf)) { sfx('charge'); parts.push({ type: 'ring', x: f.x + f.facing * 40, y: GROUND - f.y - 100, r: 22 + mv.lvl * 8, vr: -1.6, life: 14, max: 14, col: '255,200,110' }); }
    if (mv.lvl && mf % 2 === 0) { const an = rnd(0, Math.PI * 2), r = rnd(24, 50); parts.push({ type: 'spark', x: f.x + f.facing * 36 + Math.cos(an) * r, y: GROUND - f.y - 100 + Math.sin(an) * r, vx: -Math.cos(an) * r / 8, vy: -Math.sin(an) * r / 8, life: 8, max: 8, col: ['255,230,160', '110,255,220', '255,170,80'][mv.lvl - 1] }); }
    if (!holding(f) || mf >= 96) { mv.fired = true; mv.startup = mf + 3; mv.active = 20; mv.recovery = 14 + mv.lvl * 3; }
    return;
  }
  const k = mf - mv.startup; if (k >= 0 && k <= 14 && k % 7 === 0) alchemistVolley(f, o, mv.lvl, k / 7);
}
const GOLEM_LIFE = 1800, GOLEM_REBUILD = 240, GOLEM_HP = 350; // frames the golem lasts before it crumbles (thirty seconds) and takes to rebuild (four); its own health (a third of a fighter's)
const STONE_REGEN = 90; // frames for a stone to come back (a second and a half)
const GRAB_CD = 150; // frames after a hold lets go before the golem can grab again (no grab loops)
const HOLD_HITS = 4; // hits a held opponent takes before the golem's grip gives (no endless stones on someone held)
function useStone(f) { // one stone from his pockets (false, with a click, when they're all out)
  if (f.ammo > 0) { f.ammo--; return true; }
  if (!(f.dryT > game.frame - 12)) { f.dryT = game.frame; sfx('dry'); popText(f.x + f.facing * 40, GROUND - f.y - 150, L('NO STONES', '石切れ'), '225,225,235'); }
  return false;
}
const VOLLEY_GDRAIN = [6, 18, 30, 45]; // guard damage of each stone, by gauge: a full charge (MAX) breaks a full guard
function alchemistVolley(f, o, lvl, i = 0) { alchemistStone(f, o, 70, { k: 0.7 + 0.25 * lvl, sp: 10 + lvl * 1.5, big: lvl >= 2, label: 'Stone Volley', fan: i, // (the third stone knocks them down; a charged volley shoves them further, guarded or not)
  h: { gdrain: i === 2 && lvl >= 3 ? 70 : VOLLEY_GDRAIN[lvl], push: 1.2 + Math.max(0, lvl - 1) * 1.6, bpush: 1.2 + lvl * 1.5, gbstun: 45 + lvl * 8, ...(i === 2 ? { kd: true, kdVx: 9 + lvl * 2, kdVy: 7 } : {}) } }); }
function alchemistStone(f, o, y, ex) { // one glowing stone, thrown flat (aimed at them when he or they are in the air)
  if (!useStone(f)) return;
  const d = f.facing, air = f.y > 20 || o.y > 40, x0 = f.x + d * 34, y0 = f.y + (air ? 70 : y), cols = ['110,255,220', '255,190,80', '150,170,255'];
  const h = { dmg: Math.round(26 * (ex.k || 1) * holdMul(f)), stun: 22, bstun: 10, push: 1.4, gdrain: 6, hitstop: 5, low: !air && y < 40, label: ex.label || 'Stone Throw', ...(ex.h || {}) };
  const reeling = o.state === 'hitstun' || o.state === 'stunned', far = Math.abs(o.x - x0); // (thrown into a combo, a stone flies to meet them while they're still reeling; in the open it keeps its own pace)
  let vx = d * Math.max(ex.sp || 10, reeling ? Math.min(34, far / 9) : 0), vy = 0;
  if (air) { const sp = ex.sp ? ex.sp + 2 : 13, t = Math.min(30, Math.abs(o.x - x0) / sp), fall = o.state === 'knock' ? (o.vy || 0) * t - 0.31 * G * t * t : 0; // (aimed where they'll be when it gets there: a falling opponent is met, not missed)
    const an = Math.atan2(Math.max(30, o.y + 60 + fall) - y0, o.x + (o.vx || 0) * t - x0) + (ex.fan || 0) * 0.12; vx = Math.cos(an) * sp; vy = Math.sin(an) * sp; }
  spawnPJ(f, 'stone', { dir: Math.sign(vx) || d, x: x0, y: y0, vx, vy, life: 64, r: ex.big ? 14 : 11, glow: cols[(ex.fan || 0) % 3], h, delay: 2 }); sfx('throw'); // (delay: seen leaving his hand even point-blank)
}
function stoneComet(f, o) { // the juggle's finisher: one big glowing stone hurled down at them
  if (!useStone(f)) return;
  const d = f.facing, x0 = f.x + d * 30, y0 = f.y + 150, t = 9, tx = o.x + (o.vx || 0) * t, ty = Math.max(20, o.y + 50 + (o.vy || 0) * t - 0.3 * G * t * t), an = Math.atan2(ty - y0, tx - x0), sp = 16;
  spawnPJ(f, 'stone', { dir: Math.sign(Math.cos(an)) || d, x: x0, y: y0, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, life: 40, r: 19, glow: '255,190,80', comet: true, delay: 1,
    h: { dmg: 64, stun: 24, bstun: 14, push: 3, gdrain: 14, hitstop: 13, kd: true, kdVx: 9, kdVy: 8, juggle: true, label: 'Stone Comet', heavy: true } }); sfx('flame'); game.shake = Math.max(game.shake, 3);
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
function stonePillar(f, o) { // the juggle's second lift: the golem pounds the floor and a pillar of rock rises under them
  f.pillars.push({ x: o.x, t: 4, T: 34, h: Math.min(300, o.y + 120), w: 40 }); // (already risen: it's seen at full height through the hit-stop)
  sfx('break'); game.shake = Math.max(game.shake, 5); dustAt(o.x, true);
  const hu = hurtbox(o, true); if (!hu) return;
  applyHit(f, o, { type: 'mid', chip: false, proj: false, juggle: true, str: 1, dmg: 54, stun: 20, bstun: 12, push: 0.4, hitstop: 9, gdrain: 8, relaunch: true, jugVy: 8, label: 'Stone Pillar' }, Math.sign(o.x - f.x) || f.facing, { x0: o.x - 30, x1: o.x + 30, y0: 0, y1: 320 }, hu);
}
function bedrockBurst(f, o) { // the end of the Bedrock Stride: his stone skin bursts outward, all round him
  const x = f.x; parts.push({ type: 'ering', x, y: GROUND, r: 12, vr: 10, life: 18, max: 18, col: '255,200,110' }, { type: 'ering', x, y: GROUND, r: 6, vr: 6, life: 22, max: 22, col: '230,210,170' });
  for (let i = 0; i < 18; i++) parts.push({ type: 'spark', x: x + rnd(-30, 30), y: GROUND - rnd(30, 150), vx: rnd(-7, 7), vy: rnd(1, 6), life: 18, max: 18, col: i % 2 ? '170,130,80' : '255,210,140' });
  game.shake = Math.max(game.shake, 8); sfx('hitH'); dustAt(x, true);
  const hu = hurtbox(o, false); if (!hu || o.y > 60 || Math.abs(o.x - x) > 150) return; // (it runs along the floor: anyone in the air is clear of it)
  applyHit(f, o, { type: 'mid', chip: true, proj: false, str: 1, dmg: 52, stun: 24, bstun: 18, push: 4, hitstop: 11, gdrain: 20, kd: true, kdVx: 8, kdVy: 9, label: 'Bedrock Burst', heavy: true }, Math.sign(o.x - x) || f.facing, { x0: x - 150, x1: x + 150, y0: 0, y1: 120 }, hu);
}
// his specials, his super and the fusion
{ const smb = specialMoveBase; specialMoveBase = function (id) {
  const order = (label, pose, fn) => ({ id, label, startup: 5, active: 2, recovery: 5, wind: 'idle', pose, hitbox: null, antiDone: true, onFrame: (f, o, mf) => { if (mf === f.move.startup) fn(f, o); conductIn(f, f.move, mf); } });
  if (id === 'alUpStone') return { id, noSmear: true, label: 'Stone Lob', startup: 10, active: 2, recovery: 16, wind: 'alThrowW', pose: 'alThrow', hitbox: null, overhead: true, onFrame: (f, o, mf) => { if (mf === f.move.startup) alchemistLob(f, o); } };
  if (id === 'alTrap') return { id, noSmear: true, label: 'Trap Stone', startup: 12, active: 2, recovery: 16, wind: 'alThrowW', pose: 'alThrowLow', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) alchemistTrap(f); } };
  if (id === 'alShield') return order('Order: Shield Bash', 'gTwin', f => golemOrder(f, 'shield'));
  if (id === 'alTackle') return order('Order: Tackle', 'gAim', (f, o) => { // (on someone launched into the air: the Golem Meteor instead)
    if (o.state === 'knock' && o.juggle && f.golem && !f.golem.broken) { golemStart(f, 'meteor', f.serial); f.move.label = 'Order: Golem Meteor'; } else golemOrder(f, 'tackle'); });
  if (id === 'alBedrock') return { id, label: 'Bedrock Stride', startup: 20, active: 4, recovery: 16, wind: 'alBrace', pose: 'alBrace', hitbox: null, selfMove: true, stoneSkin: true, // ← ← + K: his skin turns to stone (armour) as he strides in, then it bursts
    onFrame: (f, o, mf) => { const mv = f.move; f.vx = mf < mv.startup ? f.facing * 2.4 : f.vx * 0.5; if (mf < mv.startup && mf % 5 === 0) { dustAt(f.x, false); sfx('land'); } if (mf === mv.startup) bedrockBurst(f, o); } };
  if (id === 'alOpus') return { id, super: true, name: 'MAGNUM OPUS', label: 'Magnum Opus', startup: 16, active: 70, recovery: 18, wind: 'alThrowW', pose: 'alOpus', aura: true,
    onStart(f) { f.invul = 50; }, onFrame: opusFrame, // (he throws: the arm winds back and whips through for each stone)
    poseFn: (f, mf) => { const k = mf - (f.move.throwT || -99); return k >= 0 && k < 7 ? lerpPose(POSES.alThrowW, POSES.alThrow, clamp(k / 3, 0, 1)) : null; } };
  if (id === 'alFuse') return { id, label: 'Golem Fusion', startup: FUSE_IN[1] + 2, active: 2, recovery: 12, wind: 'alOpus', pose: 'alOpus', aura: true, hitbox: null, antiDone: true,
    onStart(f) { f.invul = FUSE_IN[1] + 20; f.fuseG = 0; game.superFlash = { f, name: 'GOLEM FUSION', t: SUPER_CUT, max: SUPER_CUT }; sfx('super'); }, onFrame: fuseFrame,
    poseFn: (f, mf) => mf > FUSE_IN[1] - 4 ? lerpPose(POSES.alOpus, POSES.alBrace, clamp((mf - FUSE_IN[1] + 4) / 5, 0, 1)) : null }; // (arms up as the stones come, then he sets himself as the helmet locks)
  // in the golem armour: Tetsu's commands, each with its own stone-and-core look (the timing and reach of his techniques, not their animation)
  const fused = (base, ex) => { const m = smb(base); if (!m) return null; const mv = { ...m, id, fx: null, trail: null, aura: false, burst: null, ...ex }; delete mv.onFrame; if (ex.onFrame) mv.onFrame = ex.onFrame; else if (m.onFrame && !ex.noBase) mv.onFrame = m.onFrame; return mv; };
  const rocks = (f, n, r, y, col) => { for (let i = 0; i < n; i++) { const an = rnd(0, Math.PI * 2); parts.push({ type: 'spark', x: f.x + Math.cos(an) * r, y: GROUND - f.y - y + Math.sin(an) * r * 0.6, vx: -Math.cos(an) * r / 9, vy: -Math.sin(an) * r / 14, life: 10, max: 10, col: col || '200,160,110' }); } }; // (stones and grit drawn in to him)
  if (id === 'afBeam') return fused('qiBlast', { label: 'Core Beam', wind: 'alOpus', pose: 'alBrace', proj: 'core', limit: 1, // → → + U: the core in his belly swells and fires a slow ball of core light
    onFrame: (f, o, mf) => { if (mf < 13 && mf % 2 === 0) rocks(f, 2, 40, 80, '255,200,110'); if (mf === 13) { const d = f.facing; spawnPJ(f, 'core', { dir: d, x: f.x + d * 50, y: f.y + 82, vx: d * 6.5, life: 200, r: 22, h: { dmg: 75, stun: 20, bstun: 16, push: 5, hitstop: 8, chip: true, label: 'Core Beam' } }); sfx('flame'); game.shake = Math.max(game.shake, 3); } } });
  if (id === 'afBoulderRoll') return fused('qiOrb', { label: 'Rolling Boulder', wind: 'alThrowW', pose: 'alThrow', proj: 'stone', limit: 2, // ← ← + U: the rocks around him pack into a boulder, rolled at them: it hits three times
    onFrame: (f, o, mf) => { if (mf < 14 && mf % 2 === 0) rocks(f, 2, 46, 70); if (mf === 14) { const d = f.facing; spawnPJ(f, 'stone', { dir: d, x: f.x + d * 60, y: 26, vx: d * 3.6, life: 150, r: 24, hits: 3, interval: 10, glow: '255,190,80', h: { dmg: 24, stun: 18, bstun: 10, push: 2, hitstop: 5, chip: true, label: 'Rolling Boulder' } }); sfx('throw'); } } });
  if (id === 'afWall') return fused('qiParry', { label: 'Stone Wall', wind: 'alBrace', pose: 'alBrace', parryInto: 'afWallBurst', // ← ← + I: a wall of stone springs up before him; whatever hits it, he bursts through
    onFrame: (f, o, mf) => { if (mf === 5) { dustAt(f.x + f.facing * 40, true); sfx('land'); } },
    drawFX(f) { const mv = f.move, k = Math.min(1, f.mf / 5), out = f.mf > mv.startup + mv.active ? Math.max(0, 1 - (f.mf - mv.startup - mv.active) / 8) : 1; if (k * out <= 0) return; const pal = golemPal(f), x = f.x + f.facing * 46, h = 150 * k * out;
      ctx.save(); ctx.fillStyle = pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 12, GROUND - h, 24, h, 6); ctx.fill(); ctx.stroke(); ctx.strokeStyle = pal.crack; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 4, GROUND - h * 0.8); ctx.lineTo(x + 4, GROUND - h * 0.5); ctx.lineTo(x - 3, GROUND - h * 0.2); ctx.stroke(); ctx.restore(); } });
  if (id === 'afWallBurst') return fused('parryStrike', { label: 'Wall Burst', wind: 'alBrace', pose: 'alKnuckle',
    onFrame: (f, o, mf) => { if (mf === 4) { for (let i = 0; i < 14; i++) parts.push({ type: 'spark', x: f.x + f.facing * rnd(30, 90), y: GROUND - f.y - rnd(40, 150), vx: f.facing * rnd(3, 9), vy: rnd(-2, 4), life: 16, max: 16, col: i % 2 ? '170,130,80' : '255,210,140' }); game.shake = Math.max(game.shake, 6); sfx('break'); } } });
  if (id === 'afQuake') return fused('stomp', { label: 'Quake Fist', wind: 'alOpus', pose: 'alThrowLow', proj: 'spikes', limit: 1, // ← ← + J: both fists into the floor: a line of rock spikes bursts along it (low)
    onFrame: (f, o, mf) => { if (mf === 12) { const d = f.facing; spawnPJ(f, 'spikes', { dir: d, x: f.x + d * 50, y: 14, vx: d * 7, life: 80, r: 16, w: 22, h: { dmg: 40, stun: 18, bstun: 10, push: 3, kd: true, kdVx: 2, kdVy: 4, low: true, hitstop: 7, chip: true, label: 'Quake Fist' } }); dustAt(f.x + f.facing * 40, true); cracks(f.x + f.facing * 22); game.shake = Math.max(game.shake, 5); sfx('break'); } } });
  // (none of these borrow Tetsu's movement: no spins, no leaps, no rising jumps — he stays planted and the stone does the moving)
  const rockHit = (f, o, x, w, y1, h) => { const hu = hurtbox(o, true, !!h.low); if (!hu || Math.abs(o.x - x) > w) return; applyHit(f, o, { type: 'mid', chip: true, proj: true, str: 1, gdrain: 8, ...h }, Math.sign(o.x - f.x) || f.facing, { x0: x - w, x1: x + w, y0: 0, y1 }, hu); }; // (rock bursting out of the floor where it stands)
  const erupt = (f, x, h, w) => { f.pillars.push({ x, t: 3, T: 22, h, w }); dustAt(x, true); cracks(x); sfx('break'); game.shake = Math.max(game.shake, 4); };
  const pdef = (label, ex) => ({ id, label, hitbox: null, type: 'mid', ...ex });
  if (id === 'afBoulder') return pdef('Boulder Toss', { pre: 6, startup: 22, active: 2, recovery: 20, wind: 'alOpus', pose: 'alThrow', // → → + I: rocks fly up into his hands and pack into a boulder; he hurls it over in an arc and it crashes down on them (the bounce)
    onFrame: (f, o, mf) => { f.vx = 0; if (mf < 20 && mf % 2 === 0) rocks(f, 3, 50, 165); if (mf !== 22) return; const d = f.facing, x0 = f.x + d * 20, T = 26, vx = clamp((o.x - x0) / T, -16, 16);
      spawnPJ(f, 'stone', { dir: d, x: x0, y: f.y + 170, vx, vy: (o.y + 60 - 170 + 0.3 * T * T) / T, g: 0.6, life: 60, r: 26, glow: '255,190,80', h: { dmg: 62, stun: 20, bstun: 14, push: 3, hitstop: 11, gdrain: 12, overhead: true, launch: true, launchVy: 10, bounce: true, label: 'Boulder Toss' } }); sfx('throw'); },
    drawFX(f) { if (f.mf > 22) return; const k = Math.min(1, f.mf / 18); ctx.save(); ctx.globalAlpha = Math.max(0.2, k); rockAt(f.x - f.facing * 4, GROUND - f.y - 168 * f.ch.scale, 50 * k + 8, 44 * k + 6, f.mf * 0.05, golemPal(f)); ctx.restore(); } });
  if (id === 'afSlide') return pdef('Rubble Wave', { pre: 7, startup: 8, active: 2, recovery: 18, wind: 'alOpus', pose: 'alThrowLow', low: true, proj: 'spikes', limit: 2, // → → + J: he scoops the floor and a short, low surge of rubble scoops them up
    onFrame: (f, o, mf) => { f.vx = 0; if (mf === 8) { const d = f.facing; spawnPJ(f, 'spikes', { dir: d, x: f.x + d * 46, y: 14, vx: d * 11, life: 22, r: 16, w: 22, small: true, h: { dmg: 48, stun: 20, bstun: 10, push: 2, hitstop: 8, low: true, launch: true, launchVy: 11, chip: true, label: 'Rubble Wave' } }); dustAt(f.x + d * 40, true); sfx('land'); } } });
  if (id === 'afShoulder') return pdef('Stone Arm', { pre: 6, startup: 12, active: 2, recovery: 22, wind: 'alBrace', pose: 'alThrowLow', // → → + K: a giant arm of stone bursts out of the floor in front of him and smashes them away
    onFrame: (f, o, mf) => { f.vx = 0; if (mf !== 12) return; const x = clamp(f.x + f.facing * clamp(Math.abs(o.x - f.x), 90, 170), WALL_L + 20, WALL_R - 20); erupt(f, x, 150, 34);
      rockHit(f, o, x, 46, 170, { dmg: 70, stun: 20, bstun: 12, push: 3, kd: true, kdVx: 10, kdVy: 6, hitstop: 12, gdrain: 14, label: 'Stone Arm' }); } });
  if (id === 'afCyclone') return pdef('Rock Eruption', { pre: 7, startup: 12, active: 12, recovery: 16, wind: 'alOpus', pose: 'alThrowLow', // ← ← + K: three pillars of rock erupt one after another, marching out from him; the last throws them up
    onFrame: (f, o, mf) => { f.vx = 0; const i = [12, 17, 22].indexOf(mf); if (i < 0) return; const x = clamp(f.x + f.facing * (70 + i * 55), WALL_L + 20, WALL_R - 20), last = i === 2; erupt(f, x, 110 + i * 40, 30);
      const near = f.x + f.facing * 40; rockHit(f, o, (near + x) / 2, Math.abs(x - near) / 2 + 30, 230, last ? { dmg: 34, stun: 18, bstun: 10, push: 1.5, hitstop: 8, launch: true, launchVy: 12, label: 'Rock Eruption' } : { dmg: 22, stun: 20, bstun: 10, push: 0.5, hitstop: 5, juggle: true, jugVy: 5, label: 'Rock Eruption' }); } });
  if (id === 'afPillar') return pdef('Pillar Spike', { startup: 6, active: 4, recovery: 30, wind: 'alBrace', pose: 'alThrowLow', // ↓ + I: he stays planted and a spike of rock shoots up just in front of him — catches jumps, launches
    onStart(f) { f.invul = 5; },
    onFrame: (f, o, mf) => { f.vx = 0; if (mf !== 6) return; const x = f.x + f.facing * 58; erupt(f, x, 210, 40); rockHit(f, o, x, 50, 250, { dmg: 85, stun: 20, bstun: 16, push: 4, hitstop: 10, launch: true, launchVy: 14, gdrain: 8, label: 'Pillar Spike' }); } });
  if (id === 'afjHammer') return pdef('Boulder Crash', { startup: 8, active: 2, recovery: 18, wind: 'alOpus', pose: 'alThrowLow', // (in a juggle) a boulder he calls down drops out of the sky onto them and spikes them into the floor (the bounce)
    onFrame: (f, o, mf) => { f.vx = 0; if (mf === 2) rocks(f, 4, 50, 160); if (mf !== 8) return; spawnPJ(f, 'stone', { dir: f.facing, x: o.x + (o.vx || 0) * 5, y: Math.min(400, o.y + 120), vx: 0, vy: -20, g: 0.4, life: 30, r: 28, glow: '255,190,80', h: { dmg: 45, stun: 20, bstun: 12, push: 1, hitstop: 12, gdrain: 10, meteor: true, kd: true, kdVx: 1, kdVy: -8, juggle: true, label: 'Boulder Crash' } }); sfx('rise'); } });
  if (id === 'afjShoulder') return pdef('Stone Arm', { startup: 6, active: 2, recovery: 18, wind: 'alBrace', pose: 'alThrowLow', // (in a juggle) the stone arm bursts up under them
    onFrame: (f, o, mf) => { f.vx = 0; if (mf !== 6) return; const x = clamp(o.x, WALL_L + 20, WALL_R - 20); erupt(f, x, Math.min(300, o.y + 130), 34); rockHit(f, o, x, 46, o.y + 160, { dmg: 55, stun: 20, bstun: 12, push: 3, kd: true, kdVx: 15, kdVy: 9, hitstop: 13, juggle: true, label: 'Stone Arm' }); } });
  // ...and their juggle versions (on someone launched), like Tetsu's
  if (id === 'afjGeyser') return pdef('Core Geyser', { startup: 5, active: 16, recovery: 16, wind: 'alOpus', pose: 'alThrowLow', // core light bursts up out of the floor under them, again and again; the last burst lifts them (wherever they are)
    onFrame: (f, o, mf) => { f.vx = 0; if (mf === 5) { sfx('flame'); dustAt(o.x, true); } if (mf > 5 && mf <= 21) for (let i = 0; i < 2; i++) parts.push({ type: 'spark', x: o.x + rnd(-22, 22), y: GROUND - rnd(0, 30), vx: rnd(-1, 1), vy: rnd(6, 11), life: 14, max: 14, col: i ? '255,210,130' : '170,130,80' });
      const i = [6, 10, 14, 18].indexOf(mf); if (i < 0 || Math.abs(o.x - f.x) > 380) return; const last = i === 3;
      rockHit(f, o, o.x, 34, 320, { dmg: last ? 30 : 15, stun: 18, bstun: 8, push: 0.2, hitstop: last ? 8 : 4, juggle: true, jugVy: last ? 10.5 : 6.5, fixedLift: true, gdrain: 4, label: 'Core Geyser' }); } });
  if (id === 'afjSpiral') return fused('jSpiral', { label: 'Stone Spiral', wind: 'alOpus', pose: 'alThrowLow', // stones burst up out of the floor through them, one after another
    onFrame: (f, o, mf) => { if (mf >= 6 && mf <= 21 && (mf - 6) % 5 === 0) { const i = (mf - 6) / 5; spawnPJ(f, 'stone', { dir: f.facing, x: o.x + (i % 2 ? 14 : -14), y: 4, vx: 0, vy: 13, life: 26, r: 13, glow: ['110,255,220', '255,190,80', '150,170,255', '255,230,120'][i],
      h: { dmg: i === 3 ? 26 : 15, stun: 18, bstun: 10, push: 0.3, hitstop: 4, juggle: true, jugVy: i === 3 ? 9 : 6.5, fixedLift: true, chip: true, label: 'Stone Spiral' } }); sfx('throw'); } } });
  if (id === 'afCannon') return { ...smb('qiCannon'), id, name: 'GREAT CORE CANNON', label: 'Core Cannon', wind: 'alOpus', pose: 'alBrace', aura: true, // U + J in the armour: the golem's core in his belly fires a great beam
    onStart(f, o) { f.invul = 30; if (['hitstun', 'stunned', 'knock'].includes(o.state)) f.move.startup = 9; }, // (in a combo the core is already lit: it fires at once)
    onFrame: (f, o, mf) => { const S = f.move.startup; if (mf < S && mf % 2 === 0) rocks(f, 3, 60, 85, '255,210,130'); if (mf === S + 1) { spawnBeam(f); const b = projs[projs.length - 1]; if (b && b.type === 'beam') b.coreBeam = true; } } };
  return smb(id); }; }
TELLS.alchemist = { a: 'alStoneUp', b: 'alBrace', fx: 'gems' }; // (before a technique: three of his glowing stones circle his hands)
TECH_TIER.alShield = 'fast'; TECH_TIER.alTackle = 'fast'; TECH_TIER.alUpStone = 'fast'; TECH_TIER.alTrap = 'fast'; Object.assign(JUGGLE_SP, { afBeam: 'afjGeyser', afBoulder: 'afjHammer', afShoulder: 'afjShoulder', afBoulderRoll: 'afjSpiral' }); for (const k of ['afjGeyser', 'afjHammer', 'afjShoulder', 'afjSpiral']) RISING_IDS.add(k); TECH_TIER.afPillar = 'fast'; // (in the armour, on someone launched: the juggle versions)
TECH_TIER.alFuse = 'fast'; TECH_TIER.alBedrock = 'heavy'; TECH_TIER.afWall = 'fast';
SUPER_DODGE.alOpus = 'guard'; SUPER_DODGE.afCannon = 'guard'; SUPER_EQ.afCannon = 1.028; SUPER_EQ.alOpus = 2.23; SUPER_REF.alchemist = 1; // (every super lands about the same total damage)
Object.assign(JA_SUPER, { 'MAGNUM OPUS': '大いなる錬成', 'GOLEM FUSION': 'ゴーレム融合', 'GREAT CORE CANNON': '大コアキャノン' });
// Magnum Opus (U + J): the golem bursts apart and its stones fly onto them, a shell of rock that pins them where they stand; he throws six
// glowing stones on the floor around them, and when the circle is closed it erupts and blasts them up. Then the golem pulls itself together.
const OPUS_FLY = [12, 26], OPUS_THROWS = [30, 37, 44, 51, 58, 65], OPUS_BURST = 76; // frames: the golem's stones in flight, his six throws, the burst
const OPUS_RX = 104; // the circle's radius on the floor
function opusFrame(f, o, mf) {
  const g = f.golem, mv = f.move; f.vx = 0;
  if (mf === 1) { f.opus = { cx: o.x, gx: g.x, gy: g.broken ? 0 : g.y, t: 0, stones: [], bind: false, burst: false }; g.broken = true; g.brokenT = 9999; g.hidden = true; g.act = null; g.queue = null; if (g.hold) golemRelease(f, o, false); }
  const c = f.opus; if (!c) return; c.t = mf;
  if (mf === OPUS_FLY[0]) { sfx('break'); game.shake = Math.max(game.shake, 5); for (let i = 0; i < 18; i++) parts.push({ type: 'spark', x: c.gx + rnd(-40, 40), y: GROUND - rnd(20, 150), vx: rnd(-4, 4), vy: rnd(-2, 4), life: 16, max: 16, col: '200,160,100' }); } // it bursts apart
  if (mf > OPUS_FLY[0] && mf < OPUS_FLY[1]) c.cx = lerp(c.cx, o.x, 0.35); // (the stones home in on them)
  if (mf === OPUS_FLY[1]) { c.cx = clamp(o.x, WALL_L + 40, WALL_R - 40); sfx('hitH'); game.shake = Math.max(game.shake, 7);
    if (Math.abs(o.x - c.cx) < 90) { columnHit(f, o, { dmg: 30, stun: 30, bstun: 20, push: 0, juggle: true, hitstop: 8, gdrain: 10, label: 'Magnum Opus', superHit: true }); if (o.state === 'hitstun' || o.state === 'knock') { c.bind = true; popText(o.x, GROUND - 200, L('ENCASED!', '岩封じ！'), '255,215,140'); } } }
  if (c.bind && !c.burst && !o.ko) { if (o.state !== 'stunned') { setState(o, 'stunned'); o.stunKind = 'held'; } o.stunT = 12; o.x = c.cx; o.vx = 0; o.vy = 0; o.juggle = false; if (o.y > 0) o.y = Math.max(0, o.y - 14); } // (the stone shell holds them: pulled down to the floor and kept there)
  const ti = OPUS_THROWS.indexOf(mf);
  if (ti >= 0) { const an = Math.PI * (0.5 + ti / 3), tx = c.cx + Math.cos(an) * OPUS_RX; c.stones.push({ an, x0: f.x + f.facing * 30, y0: GROUND - f.y - 120, tx, t: 0 }); sfx('throw'); mv.throwT = mf; } // a stone thrown to each point of the circle
  for (const st of c.stones) if (st.t < 10 && ++st.t === 10) { sfx('select'); parts.push({ type: 'ring', x: st.tx, y: GROUND - 4 + Math.sin(st.an) * OPUS_RX * 0.2, r: 6, vr: 3, life: 12, max: 12, col: '255,210,120' });
    if (c.bind) columnHit(f, o, { dmg: 9, stun: 20, bstun: 8, push: 0, juggle: true, hitstop: 2, gdrain: 3, label: 'Magnum Opus', superHit: true }); } // (each stone that lands sends a jolt through the circle)
  if (mf === OPUS_BURST) { c.burst = true; mv.active = mf - mv.startup + 2;
    for (let i = 0; i < 5; i++) f.pillars.push({ x: c.cx + (i - 2) * 30, t: 3, T: 30, h: 250 - Math.abs(i - 2) * 50, w: 30 });
    parts.push({ type: 'ering', x: c.cx, y: GROUND, r: 14, vr: 12, life: 20, max: 20, col: '255,200,110' }, { type: 'ering', x: c.cx, y: GROUND, r: 6, vr: 7, life: 24, max: 24, col: '255,240,200' });
    for (let i = 0; i < 24; i++) parts.push({ type: 'spark', x: c.cx + rnd(-30, 30), y: GROUND - rnd(20, 140), vx: rnd(-6, 6), vy: rnd(3, 11), life: 22, max: 22, col: i % 2 ? '255,220,140' : '170,130,80' }); // the shell shatters
    game.shake = Math.max(game.shake, 14); game.freeze = Math.max(game.freeze, 6); sfx('bounce'); dustAt(c.cx, true);
    if (Math.abs(o.x - c.cx) < 140) columnHit(f, o, { dmg: 90, stun: 30, bstun: 16, push: 2, kd: true, kdVx: 3, kdVy: 17, hitstop: 16, gdrain: 20, label: 'Magnum Opus', superHit: true }); // (burst up into the air, and down)
    opusEnd(f); }
}
function opusEnd(f) { // the super is over (or he was knocked out of it): the stones fall where the circle was and the golem pulls itself together there
  const g = f.golem, c = f.opus; if (!c || c.fade != null) return;
  c.fade = 0; c.bind = false; g.hidden = false; g.broken = true; g.quiet = true; g.brokenT = 50; g.x = clamp(c.cx - Math.sign(c.cx - f.x || 1) * 70, WALL_L, WALL_R); g.y = 0; g.vy = 0;
}
// the golem armour (← → + J + K with a full fusion gauge): the golem comes apart and its stones lock onto him piece by piece,
// boots first and the helmet last. For twenty seconds he fights in it himself — stone fists, heavier blows, harder to hurt —
// then the armour crumbles and the golem rises from the stones.
const FUSE_T = 1200, FUSE_IN = [2, 40]; // frames the armour lasts; the frames over which its pieces fly onto him
const FUSE_GAUGE_T = 1800; // frames of fighting that fill the fusion gauge on their own (thirty seconds; landing and taking hits fills it faster)
const ARMOR_PARTS = [ // the order the pieces lock on, and where on him (height in his units) each one flies to
  ['boots', 12], ['greaves', 38], ['knees', 55], ['thighs', 75], ['belt', 92], ['chest', 125], ['pauldrons', 150], ['vambraces', 112], ['gauntlets', 100], ['helmet', 178]];
const fusePartAt = i => FUSE_IN[0] + 8 + i * Math.round((FUSE_IN[1] - FUSE_IN[0] - 10) / ARMOR_PARTS.length); // (the frame each piece arrives)
function fuseFrame(f, o, mf) {
  const g = f.golem; f.vx = 0;
  if (mf === FUSE_IN[0]) { f.fuse = { t: 0, gx: g.x, gy: g.broken ? 0 : g.y, n: 0 }; g.broken = true; g.hidden = true; g.brokenT = 9999; g.act = null; g.queue = null; if (g.hold) golemRelease(f, o, true);
    sfx('break'); game.shake = Math.max(game.shake, 5); for (let i = 0; i < 18; i++) parts.push({ type: 'spark', x: g.x + rnd(-40, 40), y: GROUND - rnd(20, 150), vx: rnd(-4, 4), vy: rnd(-2, 4), life: 16, max: 16, col: '200,160,100' }); }
  const c = f.fuse; if (!c) return;
  for (let i = c.n; i < ARMOR_PARTS.length && mf >= fusePartAt(i); i++) { c.n = i + 1; const y = GROUND - f.y - ARMOR_PARTS[i][1] * f.ch.scale; // a piece locks on: a clack and a spark where it lands
    sfx(i === ARMOR_PARTS.length - 1 ? 'hitH' : 'block'); parts.push({ type: 'ring', x: f.x, y, r: 5, vr: 3, life: 10, max: 10, col: '255,210,130' }); for (let k = 0; k < 4; k++) parts.push({ type: 'spark', x: f.x + rnd(-14, 14), y, vx: rnd(-3, 3), vy: rnd(-2, 2), life: 9, max: 9, col: '255,220,150' }); }
  if (mf === FUSE_IN[1]) { f.ch = FUSED_CH; f.fuseT = FUSE_T; f.fuse = null; game.shake = Math.max(game.shake, 10); game.freeze = Math.max(game.freeze, 4); sfx('bounce');
    popText(f.x, GROUND - 240, L('GOLEM ARMOUR!', 'ゴーレムアーマー！'), '255,215,140');
    parts.push({ type: 'ring', x: f.x, y: GROUND - 110, r: 12, vr: 9, life: 20, max: 20, col: '255,200,110' }, { type: 'ering', x: f.x, y: GROUND, r: 10, vr: 9, life: 18, max: 18, col: '255,210,130' });
    for (let i = 0; i < 18; i++) { const an = i * Math.PI / 9; parts.push({ type: 'spark', x: f.x, y: GROUND - 110, vx: Math.cos(an) * 7, vy: Math.sin(an) * 7, life: 18, max: 18, col: '255,210,130' }); } }
}
function fuseEnd(f) { // twenty seconds are up: the armour crumbles off him and the golem pulls itself together beside him
  const g = f.golem; f.fuseT = 0; f.fuse = null; if (f.ch.fused) f.ch = CHARS.alchemist; if (!g) return;
  g.hidden = false; g.broken = true; g.quiet = true; g.brokenT = 50; g.x = clamp(f.x - f.facing * 70, WALL_L, WALL_R); g.y = 0; g.vy = 0;
  popText(f.x, GROUND - 220, L('ARMOUR OFF', 'アーマー解除'), '230,220,200'); sfx('break'); game.shake = Math.max(game.shake, 5);
  for (let i = 0; i < 20; i++) parts.push({ type: 'spark', x: f.x + rnd(-30, 30), y: GROUND - f.y - rnd(30, 150), vx: rnd(-4, 4), vy: rnd(-1, 4), life: 22, max: 22, col: i % 2 ? '170,130,80' : '139,106,71' });
}
function armourUp(f) { const g = f.golem; if (!g) return; f.ch = FUSED_CH; f.fuseT = FUSE_T; f.fuse = null; g.broken = true; g.hidden = true; g.brokenT = 9999; g.act = null; g.queue = null; g.hold = null; } // (a sample that starts with him already in the armour)
const armorOf = f => (f.ch.fused ? ARMOR_PARTS.length : f.fuse ? f.fuse.n : f.move && f.move.stoneSkin ? 'skin' : 0); // (how much of the armour to draw on him)
const GOLEM_ACT = { // startup / active / recovery (frames), and the blow
  lp: { su: 7, ac: 3, rec: 12, light: true, reach: [-20, 85], y: [40, 140], h: { dmg: 27, stun: 22, bstun: 11, push: 1.4, hitstop: 6, str: 0, gdrain: 4, label: 'Golem Jab' } }, // U: mid
  lp2: { su: 6, ac: 3, rec: 12, light: true, reach: [-20, 90], y: [40, 140], h: { dmg: 28, stun: 22, bstun: 11, push: 1.4, hitstop: 6, str: 0, gdrain: 5, label: 'Golem Hook' } }, // U, U: the other fist
  lowp: { su: 8, ac: 3, rec: 14, light: true, reach: [-20, 95], y: [0, 40], h: { dmg: 22, stun: 17, bstun: 11, push: 1.6, hitstop: 6, str: 0, gdrain: 4, low: true, label: 'Golem Low Punch' } }, // ↓ + U: low
  ham: { su: 10, ac: 3, rec: 31, reach: [-10, 105], y: [0, 175], h: { dmg: 48, stun: 24, bstun: 16, push: 3, hitstop: 10, str: 1, gdrain: 16, overhead: true, kd: true, kdVx: 7, kdVy: 8, label: 'Golem Hammer', heavy: true } }, // U, U, U: both fists down from above (stand to guard)
  upper: { su: 12, ac: 3, rec: 32, reach: [-10, 95], y: [10, 210], h: { dmg: 40, stun: 22, bstun: 14, push: 0.5, hitstop: 10, str: 1, gdrain: 10, launch: true, launchVy: 13.5, label: 'Golem Uppercut', heavy: true } }, // ↓ + I: the launcher
  rise: { su: 6, ac: 4, rec: 12, light: true, jug: true, reach: [-30, 95], y: [60, 290], h: { dmg: 26, stun: 18, bstun: 10, push: 0.6, hitstop: 6, str: 0, gdrain: 4, jugVy: 7, label: 'Golem Rising Jab' } }, // U in a juggle
  hp: { su: 10, ac: 2, rec: 22, grab: true, reach: [-35, 100], y: [0, 150], h: { dmg: 26, stun: 12, bstun: 12, push: 0, hitstop: 6, str: 1, gdrain: 0, grab: true, label: 'Golem Grab', heavy: true } }, // I: it seizes them and holds them for three seconds
  shield: { su: 10, ac: 6, rec: 20, shield: true, reach: [10, 95], y: [0, 150], h: { dmg: 34, stun: 22, bstun: 22, push: 5, hitstop: 8, str: 1, gdrain: 24, label: 'Golem Shield Bash', heavy: true } }, // →→U: a slab of stone held out front; it blocks shots and bashes
  tackle: { su: 8, ac: 18, rec: 22, rush: 13, reach: [10, 80], y: [0, 150], h: { dmg: 48, stun: 24, bstun: 16, push: 5, hitstop: 9, str: 1, gdrain: 16, kd: true, kdVx: 6, kdVy: 7, label: 'Golem Tackle', heavy: true } }, // →→I: it charges in
  heave: { su: 9, ac: 1, rec: 18 }, // I while it holds them: it hoists them overhead and throws them up (the first lift)
  pound: { su: 7, ac: 1, rec: 14 }, // the stone pillar: both fists pound the floor
  meteor: { su: 5, ac: 30, rec: 14, leap: 14, reach: [-50, 100], y: [30, 200], h: { dmg: 60, stun: 20, bstun: 14, push: 1, hitstop: 12, str: 1, gdrain: 12, launch: true, bounce: true, launchVy: 10, label: 'Golem Meteor', heavy: true } }, // → → + I in a juggle: it leaps and slams them into the floor (the bounce)
};
const GOLEM_ARMS = { lp: [[8, -92], [0, -92]], lp2: [[-4, -100], [4, -96]], lowp: [[10, -60], [0, -30]], ham: [[6, -178], [58, -26]], upper: [[24, -26], [30, -176]], rise: [[16, -60], [26, -184]], hp: [[30, -96], [62, -98]],
  shield: [[10, -118], [52, -92]], tackle: [[-14, -88], [36, -92]], heave: [[34, -50], [14, -176]], pound: [[24, -164], [60, -8]], meteor: [[6, -176], [52, -40]] }; // each blow's arm: drawn back, then thrown (x forward of the golem, y up)
function newGolem(f) { f.pillars = []; f.fuse = null; f.fuseT = 0; f.opus = null; f.fuseG = 0; return { x: f.x - f.facing * 90, facing: f.facing, act: null, queue: null, qT: 0, cd: 30, dashT: 0, ph: 0, spd: 0, y: 0, vy: 0, js: 0, crouch: false, hp: GOLEM_HP, max: GOLEM_HP, life: GOLEM_LIFE, broken: false, brokenT: 0, seen: {}, hold: null, flash: 0, grabCD: 0 }; }
function golemOrder(f, kind) { // queue the golem's next blow (I while it holds them: the heave)
  const g = f.golem; if (!g || f.ko || g.broken) return;
  if (g.hold) { if (kind !== 'hp') return; kind = 'heave'; }
  g.queue = kind; g.qT = 0; g.qBy = f.serial;
}
function golemStart(f, kind, by) { const g = f.golem, o = other(f); if (!g || g.broken) return; g.facing = Math.sign(o.x - g.x) || g.facing; g.alt = !g.alt; g.act = { kind, t: 0, id: ++serial, hit: false, alt: g.alt, by: by != null ? by : g.qBy }; g.queue = null; if (['hp', 'heave', 'ham', 'upper'].includes(kind)) sfx('swing'); }
function golemPound(f) { const g = f.golem; dustAt(g.x + g.facing * 60, true); cracks(g.x + g.facing * 60); game.shake = Math.max(game.shake, 4); sfx('land'); } // (the pillar rises from where its fists hit)
const GOLEM_FIRE = { pound: golemPound }; // blows that are a slam, not a reach
function golemHeave(f, o) { // the first lift: it hoists them overhead and flings them up
  const hu = hurtbox(o, false); if (!hu) return;
  const res = golemHit(f, o, { type: 'mid', chip: false, proj: false, dmg: 56, stun: 20, bstun: 12, push: 0, hitstop: 10, str: 1, gdrain: 0, launch: true, launchVy: 13, label: 'Golem Heave', heavy: true }, { x0: o.x - 40, x1: o.x + 40, y0: 0, y1: 200 }, hu);
  if (res) { dustAt(o.x, true); game.shake = Math.max(game.shake, 6); popText(o.x, GROUND - 200, L('HEAVE!', '持ち上げ！'), '255,215,140'); }
}
const live0 = (f, o) => game.phase === 'fight' && !f.ko && !o.ko;
function golemPlace(f, o) { // while it holds them: they stay where the swap put them, the golem behind them, both turned toward the alchemist
  const g = f.golem, hd = g.hold; o.x = hd.ox; g.x = hd.gx; g.facing = Math.sign(f.x - g.x) || g.facing; o.vx = 0;
}
function golemSeize(f, o) { // the grab: if the golem was in front of him, it turns them round and the two trade places, so they're between it and him (not pulled in to him)
  const g = f.golem, near = Math.abs(g.x - f.x) < Math.abs(o.x - f.x) ? g.x : o.x, far = near === g.x ? o.x : g.x, away = Math.sign(near - f.x) || 1;
  g.hold = { t: 180, c0: o.combo || 0, ox: clamp(near, WALL_L + 20, WALL_R - 20), gx: clamp(Math.abs(far - near) < 70 ? near + away * 70 : far, WALL_L, WALL_R) }; golemPlace(f, o); setState(o, 'stunned'); o.stunT = 184; o.stunKind = 'held'; o.stunUsed = true;
  popText(o.x, GROUND - 190, L('GRABBED!', '捕まえた！'), '255,215,140'); sfx('block'); game.shake = Math.max(game.shake, 3);
}
function golemRelease(f, o, recover) { const g = f.golem; g.hold = null; g.grabCD = GRAB_CD; if (recover && o.state === 'stunned') setState(o, 'recover'); }
function golemBox(g) { return { x0: g.x - 46, x1: g.x + 46, y0: g.y, y1: g.y + (g.crouch || (g.act && g.act.kind === 'lowp') ? 125 : 165) }; }
function golemBreak(f, text) { // it comes apart (beaten apart, or worn out): a heap of stones that pulls itself together four seconds later
  const g = f.golem; g.broken = true; g.brokenT = GOLEM_REBUILD; g.act = null; g.queue = null; g.vy = 0; g.y = 0; if (g.hold) golemRelease(f, other(f), true);
  popText(g.x, GROUND - 200, text, '255,170,110'); game.shake = Math.max(game.shake, 7); sfx('break');
  for (let i = 0; i < 22; i++) parts.push({ type: 'spark', x: g.x + rnd(-40, 40), y: GROUND - rnd(10, 150), vx: rnd(-5, 5), vy: rnd(-3, 5), life: 22, max: 22, col: golemPal(f).spark }); dustAt(g.x, true);
}
function golemDamage(f, n, x, y) { // the golem takes a hit; at zero health it comes apart
  const g = f.golem; if (g.broken) return; g.hp = Math.max(0, g.hp - n); g.flash = 5; sfx('hitH'); sparks(x, y, 'hit');
  if (g.hp <= 0) golemBreak(f, L('GOLEM DOWN!', 'ゴーレム撃破！'));
}
function golemTakeHits(f, o) { // the opponent's attacks can hit the golem too (it stands in the way of blows meant for him)
  const g = f.golem, gb = golemBox(g);
  if (o.state === 'attack' && o.move && o.move.hitbox && o.mf > o.move.startup && o.mf <= o.move.startup + (o.move.active || 1) && !g.seen['m' + o.serial]) {
    const hb = boxOf(o, o.move.hitbox); if (overlap(hb, gb)) { g.seen['m' + o.serial] = 1; golemDamage(f, Math.round((o.move.dmg || 20) * (o.ch.dmgMul || 1)), g.x, GROUND - 90 - g.y); }
  }
  for (const p of projs) {
    if (p.owner !== o || p.dead || g.seen['p' + p.id] || !(p.h || p.dmg) || p.type === 'decoy' || p.type === 'guardShadow') continue;
    const sa = g.act && GOLEM_ACT[g.act.kind]; if (sa && sa.shield && g.act.t >= sa.su - 4 && g.act.t <= sa.su + sa.ac + 4 && overlap(projBox(p), { x0: Math.min(g.x, g.x + g.facing * 90), x1: Math.max(g.x, g.x + g.facing * 90), y0: 0, y1: 160 })) { g.seen['p' + p.id] = 1; if (!p.pierce && p.type !== 'beam' && p.type !== 'flame') p.dead = true; sparks(p.x, GROUND - p.y, 'block'); sfx('block'); continue; } // (the shield stops shots)
    if (overlap(projBox(p), gb)) { g.seen['p' + p.id] = 1; golemDamage(f, Math.round(((p.h && p.h.dmg) || p.dmg || 15) * (o.ch.dmgMul || 1)), p.x, GROUND - p.y); if (!p.pierce && !p.hold && p.type !== 'beam' && p.type !== 'flame') p.dead = true; }
  }
}
function golemHit(f, o, h, hb, hu) { // resolved as if the golem were the attacker: its side decides the guard
  const g = f.golem, sv = [f.x, f.facing, f.vx, f.serial, f.kb]; f.x = g.x; f.facing = g.facing; f.serial = g.act ? g.act.id : ++serial;
  let res; try { res = applyHit(f, o, h, Math.sign(o.x - g.x) || g.facing, hb, hu); } finally { [f.x, f.facing, f.vx, f.serial, f.kb] = sv; } // (the wall pushes the attacker back: not the alchemist, when it's the golem that hit)
  return res;
}
const HIT_STATES = ['hitstun', 'knock', 'stunned', 'gbreak', 'down'];
function golemUpdate(f, o) {
  const g = f.golem; if (!g) return;
  const fight = game.phase === 'fight' && !f.ko;
  if (g.flash > 0) g.flash--;
  f.pillars = f.pillars.filter(p => ++p.t < p.T);
  if (f.fuse && !(f.move && f.move.id === 'alFuse')) { f.fuse = null; if (g.hidden) { g.hidden = false; g.brokenT = 50; g.quiet = true; } } else if (f.fuse) f.fuse.t++; // (knocked out of the fusion before it took: the stones fall back into a golem)
  if (f.opus && f.opus.fade == null && !(f.move && f.move.id === 'alOpus')) opusEnd(f); if (f.opus && f.opus.fade != null && ++f.opus.fade > 30) f.opus = null;
  if (f.fuseT > 0 && game.phase === 'fight' && --f.fuseT <= 0) fuseEnd(f);
  if (fight) { // the fusion gauge: it fills as the fight goes on, faster for every hit he lands or takes (training: always full)
    const dealt = Math.max(0, (f.oHp != null ? f.oHp : o.hp) - o.hp), taken = Math.max(0, (f.myHp != null ? f.myHp : f.hp) - f.hp);
    if (!f.ch.fused && !f.fuse) f.fuseG = Math.min(100, (f.fuseG || 0) + 100 / FUSE_GAUGE_T + dealt * 0.1 + taken * 0.08);
    if (game.training && !game.demo && !f.ch.fused && !f.fuse) f.fuseG = 100; }
  f.oHp = o.hp; f.myHp = f.hp;
  if (fight) { if (f.ammo < f.ch.ammo) { if ((f.stoneT = (f.stoneT || 0) + 1) >= STONE_REGEN) { f.stoneT = 0; f.ammo++; sfx('select'); parts.push({ type: 'ring', x: f.x, y: GROUND - f.y - 60, r: 8, vr: 3, life: 10, max: 10, col: '255,220,140' }); } } else f.stoneT = 0; } // (the stones come back one at a time)
  if (!g.broken && fight && --g.life <= 0) golemBreak(f, L('WORN OUT', '崩れた')); // (it lasts thirty seconds, whatever its health)
  if (g.broken) { g.act = null; g.queue = null; g.hold = null; if (g.hidden) return; if (--g.brokenT <= 0) { g.broken = false; g.hp = g.max; g.life = GOLEM_LIFE; g.seen = {}; sfx('select'); if (!g.quiet) popText(g.x, GROUND - 190, L('GOLEM REBUILT', 'ゴーレム復活'), '255,220,140'); g.quiet = false; for (let i = 0; i < 14; i++) parts.push({ type: 'spark', x: g.x + rnd(-40, 40), y: GROUND - rnd(5, 120), vx: 0, vy: 2, life: 14, max: 14, col: golemPal(f).glow }); } return; }
  const live = game.phase === 'fight' && !f.ko && !o.ko, dx = o.x - g.x, dir = Math.sign(dx) || g.facing, dist = Math.abs(dx);
  if (f.inp && f.inp.dashTap === 1) g.dashT = 18; // → → : the golem runs in too
  if (g.dashT > 0) g.dashT--;
  if (g.cd > 0) g.cd--;
  if (g.grabCD > 0) g.grabCD--;
  g.spd = 0;
  if (live0(f, o)) golemTakeHits(f, o);
  if (g.broken) return;
  if (HIT_STATES.includes(f.state)) { // hit the conductor: the order he gave is lost (a blow already on its way still lands), and a hold lets go
    g.queue = null; const A0 = g.act && GOLEM_ACT[g.act.kind]; if (A0 && g.act.t < A0.su && !A0.leap) g.act = null;
    if (g.hold) { golemRelease(f, o, true); popText(g.x, GROUND - 200, L('LET GO!', '手を離した！'), '220,220,230'); } }
  const inp = f.inp || EMPTY; // the golem copies the alchemist: where he walks, when he jumps or crouches
  if (g.js !== f.jumpSerial) { g.js = f.jumpSerial; if (f.state === 'jump' && g.y <= 0 && !g.act) g.vy = f.ch.jumpV || JUMP_V; }
  if (g.y > 0 || g.vy > 0) { g.vy -= G; g.y += g.vy; if (g.y <= 0) { g.y = 0; g.vy = 0; g.mvx = 0; dustAt(g.x, false); if (g.act && g.act.kind === 'meteor') { dustAt(g.x, true); game.shake = Math.max(game.shake, 5); sfx('land'); } } }
  g.crouch = !!inp.down && g.y <= 0 && !g.act;
  if (!live) { g.act = null; g.queue = null; return; }
  if (g.hold) { // holding them: pinned in front of it until the three seconds are up, they're knocked loose, or it heaves them up
    const hd = g.hold; hd.t--;
    if (g.queue === 'heave' && !g.act) golemStart(f, 'heave'); else if (g.queue !== 'heave') g.queue = null;
    if (g.act && g.act.kind === 'heave') { if (++g.act.t >= GOLEM_ACT.heave.su) { golemRelease(f, o, false); golemHeave(f, o); return; } }
    else g.act = null;
    if (hd.t <= 0 || o.ko || ['knock', 'down', 'getup'].includes(o.state) || (o.combo || 0) - hd.c0 >= HOLD_HITS) golemRelease(f, o, true);
    else { golemPlace(f, o); if (o.state !== 'stunned') { setState(o, 'stunned'); o.stunT = hd.t + 4; } }
    g.spd = 0; return;
  }
  const a = g.act;
  if (a) {
    const A = GOLEM_ACT[a.kind]; a.t++;
    if (a.t <= A.su && dist > 70 && A.reach && !A.rush && !A.leap) { const st = Math.min(4.5, (dist - 66) / 3); g.x += dir * st; g.spd = st; } // (it steps into the blow)
    if (A.rush && a.t > A.su && a.t <= A.su + A.ac && !a.hit) { g.x += g.facing * A.rush; g.spd = A.rush; } // (the tackle: it charges until it hits)
    if (A.leap && a.t === A.su) { const tx = o.x + (o.vx || 0) * 12; g.vy = A.leap; g.mvx = clamp((tx - g.x) / (A.leap / G), -11, 11); g.facing = Math.sign(tx - g.x) || g.facing; }
    if (A.leap && a.t > A.su && g.y > 0 && !a.hit) g.x += g.mvx || 0;
    if (A.reach) {
      if (a.t > A.su && a.t <= A.su + A.ac && !a.hit) {
        const x0 = g.x + g.facing * A.reach[0], x1 = g.x + g.facing * A.reach[1], hb = { x0: Math.min(x0, x1), x1: Math.max(x0, x1), y0: A.y[0] + g.y, y1: A.y[1] + g.y }, hu = hurtbox(o, !!(A.leap || A.jug), !!A.h.low); // (a low punch reaches someone lying on the floor too)
        const slip = A.grab && (o.y > 20 || o.state === 'knock' || g.grabCD > 0); // (no grabbing someone in the air, or again too soon after letting go)
        if (hu && overlap(hb, hu) && !slip) { const res = golemHit(f, o, { type: 'mid', chip: false, proj: false, gbstun: 45, juggle: !!A.jug, ...A.h }, hb, hu); if (res) { a.hit = true; a.res = res; if (A.grab && res === 'hit') golemSeize(f, o); if (A.leap) { g.mvx = 0; g.vy = Math.min(g.vy, 2); } if (a.kind === 'ham') { dustAt(g.x + g.facing * 70, true); game.shake = Math.max(game.shake, 5); } } }
      }
    } else if (a.t === A.su && GOLEM_FIRE[a.kind]) GOLEM_FIRE[a.kind](f, o);
    if ((a.t >= A.su + A.ac + A.rec && (!A.leap || g.y <= 0)) || (a.hit && g.queue && A.light && a.t >= A.su + A.ac + 2)) { g.act = null; g.cd = 10; } // (a light blow that landed can be cancelled into the next order of the string)
  } else {
    g.facing = dir;
    const q = g.queue;
    if (q) { g.qT++; const Q = GOLEM_ACT[q]; if (!Q.reach || Q.rush || dist <= 100) golemStart(f, q); else if (g.qT > 45) g.queue = null; } // (the tackle starts from anywhere; punches and the grab come in first)
    if (!g.act) {
      if (inp.h) { const away = Math.sign(inp.h) === -(Math.sign(o.x - f.x) || f.facing), sp = g.dashT > 0 || away ? 7 : g.y > 0 ? 3.5 : 2.6; g.x += dir * sp; g.spd = sp; } // it always moves toward the opponent: when he backs away it dashes in, when he walks in it walks in
      else if (g.y <= 0 && !g.crouch && dist > (q ? 80 : GOLEM_GAP + 6)) { const sp = g.dashT > 0 || q ? 6.5 : 2.5; g.x += dir * sp; g.spd = sp; } // otherwise it walks to the opponent itself
      const between = Math.sign(g.x - o.x) === Math.sign(f.x - o.x); // (it belongs between him and them: on their far side, with nothing to do, it hops back over them)
      g.farT = !between && !q && !inp.h && g.y <= 0 ? (g.farT || 0) + 1 : 0;
      if (g.farT > 90) { g.farT = 0; g.vy = 13; g.mvx = clamp((o.x + (Math.sign(f.x - o.x) || -dir) * (GOLEM_GAP + 10) - g.x) / (2 * 13 / G), -9, 9); sfx('rise'); dustAt(g.x, false); }
    }
    if (!g.act && g.y > 0 && g.mvx) g.x += g.mvx; // (the hop)
  }
  g.x = clamp(g.x, WALL_L, WALL_R); g.ph += g.spd * 0.09;
  golemBlock(f, o);
}
const GOLEM_GAP = 64; // how close the opponent can come to the golem's middle: it's solid — they jump over it or break it, they don't walk through
function golemBlock(f, o) {
  const g = f.golem; if (g.broken || g.hidden || g.hold) return;
  const side = Math.sign(o.x - g.x) || g.oSide || 1;
  if (Math.abs(o.x - g.x) >= GOLEM_GAP || o.y > 40 || g.y > 60 || ['knock', 'down', 'getup'].includes(o.state) || o.ko) { g.oSide = side; return; } // (clear of it, over it, or lying on the floor: no push)
  const s = g.oSide || side, nx = g.x + s * GOLEM_GAP;
  if (nx > WALL_L + 4 && nx < WALL_R - 4) o.x = nx; else g.x = clamp(o.x - s * GOLEM_GAP, WALL_L, WALL_R); // (pinned against a wall: the golem gives way instead)
}
// the direction a defender guards in while the golem is the one attacking (0 when it isn't)
function golemGuardDir(f, o) { const g = o && o.golem; return g && g.act && golemThreatening(f, o) ? (Math.sign(g.x - f.x) || 0) : 0; }
function golemThreatening(f, o) { const g = o.golem, a = g.act, A = a && GOLEM_ACT[a.kind]; return !!(A && A.reach && a.t <= A.su + A.ac + 2 && Math.abs(g.x - f.x) < 220); }
function golemThreat(f, o) { return o.golem && o.golem.act && golemThreatening(f, o) ? { key: 'g' + o.golem.act.id, kind: GOLEM_ACT[o.golem.act.kind].h.low ? 'low' : 'mid' } : null; }
const golemLowAtk = o => !!(o && o.golem && o.golem.act && (GOLEM_ACT[o.golem.act.kind].h || {}).low); // (the golem's low punch: guard crouching)

/* ---------- drawing ---------- */
const GOLEM_PALS = [ // brown sandstone, and (for the second Hohen of a mirror match) blue-grey granite with a cold blue core
  { body: '#8b6a47', dark: '#7a5b3b', light: '#9a7852', head: '#94724c', line: '#4a3523', crack: '#5a4129', core: '255,190,80', hot: '255,230,150', eye: '255,170,60', spark: '170,130,80', glow: '255,200,110' },
  { body: '#7d8a99', dark: '#66727f', light: '#95a3b2', head: '#8794a3', line: '#2f3742', crack: '#465260', core: '110,215,255', hot: '200,245,255', eye: '120,230,255', spark: '140,155,175', glow: '150,225,255' }];
const golemPal = f => GOLEM_PALS[f && f.alt ? 1 : 0];
const GEMS = [['110,255,220', -0.5], ['255,190,80', 0], ['150,170,255', 0.5]]; // glowing stones on his chest
function gemGlow(p, col, r, t) { const g = ctx.createRadialGradient(p[0], p[1], 0.5, p[0], p[1], r * 2.6); g.addColorStop(0, `rgba(${col},.95)`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r * 2.6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = `rgba(255,255,255,.9)`; ctx.beginPath(); ctx.arc(p[0], p[1], r * 0.55, 0, Math.PI * 2); ctx.fill(); }
function drawAlchemist(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]], fx = !o.tint && !o.flash, A = o.tint ? 0 : o.armor || 0, pal = GOLEM_PALS[o.alt ? 1 : 0];
  const add = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k], has = i => A === 'skin' ? (i === 5 || i === 7 || i === 8) : A > i; // (the stone skin: just the cuirass, vambraces and gauntlets)
  seg(J.hip, J.k2, 10, C.pantsB); seg(J.k2, J.f2, 9, C.pantsB); foot(J.k2, J.f2, 8.5, 6.5, C.shoe);
  seg(J.hip, J.k1, 10, C.pants); seg(J.k1, J.f1, 9, C.pants); foot(J.k1, J.f1, 9, 6.5, C.shoe);
  if (A) armourLegs(J, pal, has, fx);
  seg(J.sh, J.e2, 9, C.coatB); seg(J.e2, J.h2, 8, C.coatB); dot(J.h2, 4.6, C.skin);
  if (A) armourArm(J.e2, J.h2, pal, has, 0.85);
  seg(J.hip, J.sh, 21, C.coat);                                                                                     // the white coat
  const bl = add(J.hip, n, -15), br = add(J.hip, n, 15); bl[0] -= td[0] * 34; bl[1] -= td[1] * 34; br[0] -= td[0] * 34; br[1] -= td[1] * 34;
  ctx.fillStyle = C.coat; ctx.beginPath(); ctx.moveTo(...add(J.hip, n, -10)); ctx.lineTo(...bl); ctx.lineTo(...br); ctx.lineTo(...add(J.hip, n, 10)); ctx.closePath(); ctx.fill(); // its skirts, down to the knees
  seg(add(J.hip, td, -20), add(add(J.hip, td, -20), n, 14), 1.6, C.coatB);                                                // the hem's fold
  if (A && has(4)) { const tl = add(J.hip, td, -30); for (const sd of [-1, 1]) { const p0 = add(J.hip, n, sd * 3), p1 = add(J.hip, n, sd * 15), p2 = add(tl, n, sd * 17), p3 = add(tl, n, sd * 2); // stone tassets over the coat's skirts
    ctx.fillStyle = sd < 0 ? pal.dark : pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.lineTo(...p2); ctx.lineTo(...p3); ctx.closePath(); ctx.fill(); ctx.stroke(); seg(mid(p0, p3, 0.5), mid(p1, p2, 0.5), 1.4, pal.line); } }
  seg(mid(J.hip, J.sh, 0.5), [J.sh[0] + n[0] * 3, J.sh[1] + n[1] * 3], 6, C.shirt);                                   // the shirt under the lapels
  const nk = [J.sh[0] + n[0] * 2, J.sh[1] + n[1] * 2], ch = mid(J.hip, J.sh, 0.45);
  ctx.strokeStyle = C.stetho; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(J.sh[0] - n[0] * 6, J.sh[1] - n[1] * 6); ctx.quadraticCurveTo(ch[0] - n[0] * 5, ch[1] - 6, ch[0] + n[0] * 5, ch[1] - 2); ctx.quadraticCurveTo(ch[0] + n[0] * 8, ch[1] + 2, nk[0], nk[1]); ctx.stroke(); // a stethoscope round his neck
  if (fx && !has(5)) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pu = 0.75 + 0.25 * Math.sin(t * 0.12); // glowing stones: three on the chest, one in each pocket
    GEMS.forEach(([c, k], i) => gemGlow(add(add(mid(J.hip, J.sh, 0.62 + (i === 1 ? 0.08 : 0)), n, 9), td, k * 6 - 3 * (i === 1)), c, 5 * (0.8 + 0.2 * Math.sin(t * 0.1 + i * 2)) * pu, t));
    const pk = add(J.hip, td, -10); gemGlow(add(pk, n, 12), '255,120,110', 4.4 * pu, t); gemGlow(add(pk, n, -8), '120,255,160', 4.4 * (1.05 - pu * 0.2), t);
    ctx.restore(); }
  if (A) armourBody(J, n, td, add, pal, has, fx, A === 'skin');
  seg(J.sh, J.head, 8, C.skin);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1])); ctx.scale(1.15, 1.15);
  dot([0, 0], 11, C.skin); ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(-1, 2, 11.5, Math.PI * 0.05, Math.PI * 1.15); ctx.closePath(); ctx.fill();   // grey, swept-back hair
  dot([-6, -1], 2.4, C.skin);
  const hurt = o.face === 'hitstun' || o.face === 'knock' || o.face === 'stunned';
  for (const ex of [3.8, 8.6]) { dot([ex, 1.6], 2.2, '#ffffff'); dot([ex + 0.4, 1.4], 1.2, '#1a1a1a'); ctx.strokeStyle = C.glass; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(ex, 1.6, 3.2, 0, Math.PI * 2); ctx.stroke(); } // round spectacles
  seg([6.6, 1.6], [7.2, 1.6], 1, C.glass); seg([9.6, -1], [10.8, -3], 1.1, '#d9a585');
  if (hurt || o.face === 'attack') { ctx.fillStyle = '#5a2a2a'; ctx.beginPath(); ctx.ellipse(7.2, -5.4, 2, hurt ? 2.4 : 1.4, 0, 0, Math.PI * 2); ctx.fill(); } else seg([5.6, -5.4], [9, -5.8], 1.2, '#8a4a3a');
  if (has(9)) armourHelmet(pal, fx, t);
  ctx.restore();
  const pkt = add(add(J.hip, n, 4), td, 3), pocketed = !A && Math.hypot(J.h1[0] - pkt[0], J.h1[1] - pkt[1]) < 8; // (the front hand resting in its coat pocket)
  seg(J.sh, J.e1, 9, C.coat); seg(J.e1, J.h1, 8, C.coat); seg(mid(J.e1, J.h1, 0.85), J.h1, 6, C.coatB);
  if (pocketed) { const q = add(pkt, td, -4.5); seg(add(q, n, -3), add(q, n, 3), 9, C.coat); seg(add(pkt, n, -5.5), add(pkt, n, 5.5), 1.6, C.coatB); } else dot(J.h1, 4.8, C.skin); // (the cuff slips under the pocket's mouth)
  if (A) armourArm(J.e1, J.h1, pal, has, 1);
  if (A && has(6)) armourPauldron(add(J.sh, n, 9), td, pal, 1); // (the near shoulder's guard, over the arm)
}
// the golem armour, in pieces (has(i): piece i of ARMOR_PARTS is on him): a dark outline, the stone, a lighter edge and glowing seams
const stoneSeg = (a, b, w, pal, c) => { seg(a, b, w + 4, pal.line); seg(a, b, w, c || pal.body); };
const stonePlate = (p, w, h, rot, pal, c) => { ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(rot); ctx.fillStyle = c || pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, Math.min(w, h) * 0.3); ctx.fill(); ctx.stroke(); ctx.restore(); };
const seam = (pts, pal, a = 0.85) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${pal.core},${a})`; ctx.lineWidth = 1.6; ctx.beginPath(); pts.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p[0], p[1])); ctx.stroke(); ctx.restore(); };
function armourLegs(J, pal, has, fx) {
  for (const [k, f] of [[J.k2, J.f2], [J.k1, J.f1]]) {
    if (has(3)) stoneSeg(mid(J.hip, k, 0.25), mid(J.hip, k, 0.85), 11, pal, pal.dark);                                   // thigh plates
    if (has(1)) { stoneSeg(mid(k, f, 0.2), mid(k, f, 0.88), 11, pal); seam([mid(k, f, 0.3), mid(k, f, 0.75)], pal, fx ? 0.6 : 0); } // greaves, a glowing seam down the shin
    if (has(0)) { foot(k, f, 12, 9, pal.line); foot(k, f, 10.5, 7.5, pal.dark); }                                      // stone boots
    if (has(2)) { ctx.fillStyle = pal.light; ctx.strokeStyle = pal.line; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(k[0], k[1], 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // knee guards with a glowing stud
      if (fx) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; gemGlow(k, pal.core, 1.8, globalT); ctx.restore(); } }
  }
}
function armourArm(e, h, pal, has, k) {
  if (has(7)) { stoneSeg(mid(e, h, 0.15), mid(e, h, 0.8), 10 * k, pal); seam([mid(e, h, 0.25), mid(e, h, 0.7)], pal, 0.55); } // vambraces
  if (has(8)) { ctx.fillStyle = pal.light; ctx.strokeStyle = pal.line; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(h[0], h[1], 9.5 * k, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // gauntlets: a heavy stone fist with knuckle ridges
    ctx.strokeStyle = pal.line; ctx.lineWidth = 1.4; for (const d of [-0.5, 0.5]) { ctx.beginPath(); ctx.arc(h[0], h[1], 6 * k, d - 0.3, d + 0.3); ctx.stroke(); } }
}
function armourPauldron(p, td, pal, k) { // a shoulder guard: two overlapping shells
  const an = Math.atan2(td[1], td[0]) - Math.PI / 2;
  stonePlate([p[0] + td[0] * 2, p[1] + td[1] * 2], 22 * k, 16 * k, an, pal, pal.light); stonePlate([p[0] - td[0] * 5, p[1] - td[1] * 5], 18 * k, 10 * k, an, pal, pal.body);
}
function armourBody(J, n, td, add, pal, has, fx, skin) {
  const an = Math.atan2(td[1], td[0]) - Math.PI / 2;
  if (has(4)) { stoneSeg(add(J.hip, n, -13), add(J.hip, n, 13), 8, pal, pal.dark); if (fx) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; gemGlow(add(J.hip, n, 6), pal.core, 2.2, globalT); ctx.restore(); } } // the belt and its buckle stone
  if (has(5)) { // the cuirass: a broad chest plate over the coat, three ab plates under it, the core in the middle
    if (skin) ctx.globalAlpha *= 0.85;
    const c = mid(J.hip, J.sh, 0.62); ctx.fillStyle = pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(...add(add(J.sh, n, -16), td, -2)); ctx.lineTo(...add(add(J.sh, n, 16), td, -2)); ctx.lineTo(...add(add(mid(J.hip, J.sh, 0.45), n, 13), td, 0)); ctx.lineTo(...add(mid(J.hip, J.sh, 0.38), n, 0)); ctx.lineTo(...add(mid(J.hip, J.sh, 0.45), n, -13)); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 3; i++) stonePlate(mid(J.hip, J.sh, 0.12 + i * 0.1), 22 - i * 2, 7, an, pal, pal.dark);
    seam([add(c, n, -12), add(add(c, n, -4), td, -8), add(add(c, n, 4), td, -8), add(c, n, 12)], pal, fx ? 0.7 : 0);
    if (fx) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; gemGlow(add(c, n, 2), pal.core, (skin ? 4 : 6) * (0.85 + 0.15 * Math.sin(globalT * 0.12)), globalT); ctx.restore(); }
    if (skin) ctx.globalAlpha /= 0.85; }
  if (has(6)) armourPauldron(add(J.sh, n, -9), td, pal, 0.9); // (the far shoulder's guard)
}
function armourHelmet(pal, fx, t) { // the helmet, drawn in the head's own frame (it faces +x, up is +y): a dome, a crest, a faceplate and a glowing visor slit
  ctx.fillStyle = pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(0, 1, 13.5, -0.35, Math.PI * 1.25); ctx.lineTo(-6, -11); ctx.lineTo(9, -12); ctx.lineTo(14, -4); ctx.closePath(); ctx.fill(); ctx.stroke(); // dome and jaw
  ctx.fillStyle = pal.dark; ctx.beginPath(); ctx.moveTo(-12, 9); ctx.quadraticCurveTo(0, 20, 12, 8); ctx.lineTo(9, 6); ctx.quadraticCurveTo(0, 15, -10, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); // the crest along the top
  ctx.fillStyle = pal.light; ctx.beginPath(); ctx.moveTo(4, -2); ctx.lineTo(14, -2); ctx.lineTo(12, -10); ctx.lineTo(5, -10); ctx.closePath(); ctx.fill(); ctx.stroke(); // the faceplate
  ctx.fillStyle = '#15151c'; ctx.fillRect(1, 0, 13, 4); // the visor slit
  if (fx) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pu = 0.75 + 0.25 * Math.sin(t * 0.2); ctx.fillStyle = `rgba(${pal.eye},${pu})`; ctx.fillRect(2, 0.6, 11, 2.8);
    const g = ctx.createLinearGradient(14, 2, 26, 2); g.addColorStop(0, `rgba(${pal.eye},${0.5 * pu})`); g.addColorStop(1, `rgba(${pal.eye},0)`); ctx.fillStyle = g; ctx.fillRect(13, -0.5, 13, 5); ctx.restore(); }
}
DRAWERS.alchemist = drawAlchemist;
function drawGolemPile(g, pal) { // it has come apart: pieces fall and settle in a heap, then pull together again for the last moments
  const t = GOLEM_REBUILD - g.brokenT, fall = Math.min(1, t / 30), rise = Math.max(0, 1 - g.brokenT / 45), k = fall * (1 - rise * rise);
  ctx.save(); ctx.translate(g.x, GROUND); ctx.scale(1.4, 1.4); ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(0, 0, 40, 8, 0, 0, Math.PI * 2); ctx.fill();
  const PIECES = [[-30, -34, 20, 24, -38, -6, 0.3], [8, -34, 20, 24, 18, -5, -0.4], [-34, -86, 30, 34, -44, -12, 0.9], [4, -80, 34, 40, 6, -9, -0.5], [-16, -122, 30, 30, -10, -22, 1.2], [-42, -70, 14, 26, -58, -6, 1.4], [30, -64, 14, 26, 40, -7, -1.1], [14, -50, 18, 18, 26, -12, 0.7], [-12, -60, 16, 16, -22, -15, -0.9]];
  for (const [x, y, w, h, hx, hy, rot] of PIECES) { const px = lerp(x, hx, k), py = lerp(y, hy - h * 0.2 + 14, k) + (rise > 0 ? Math.sin(t * 0.8 + x) * 2 * rise : 0);
    ctx.save(); ctx.translate(px + w / 2, py + h / 2); ctx.rotate(rot * k); ctx.fillStyle = pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 4); ctx.fill(); ctx.stroke(); ctx.restore(); }
  if (rise > 0) { ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(0, -60, 2, 0, -60, 70); gg.addColorStop(0, `rgba(${pal.core},${0.7 * rise})`); gg.addColorStop(1, `rgba(${pal.core},0)`); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, -60, 70, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  if (g.brokenT <= GOLEM_REBUILD) { const w = 60, x = g.x - w / 2, y = GROUND - 62; ctx.fillStyle = 'rgba(8,8,20,.7)'; ctx.fillRect(x - 2, y - 2, w + 4, 8); ctx.fillStyle = '#ffd98a'; ctx.fillRect(x, y, w * (1 - g.brokenT / GOLEM_REBUILD), 4); } // the time until it's rebuilt
}
const GOLEM_ROCKS = [[-30, -34, 20, 24], [8, -34, 20, 24], [-34, -86, 30, 34], [4, -80, 34, 40], [-16, -122, 30, 30], [-42, -70, 14, 26], [30, -64, 14, 26], [14, -50, 18, 18], [-12, -60, 16, 16], [-6, -100, 22, 20]]; // the golem's pieces
const rockAt = (x, y, w, h, rot, pal) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 4); ctx.fill(); ctx.stroke(); ctx.restore(); };
function drawFuseFront(f) { // the armour assembling: the golem's pieces rise from where it stood, hang a moment, then fly to him one by one and lock on
  const c = f.fuse; if (!c) return; const mf = c.t + FUSE_IN[0], pal = golemPal(f), s = f.ch.scale;
  ARMOR_PARTS.forEach(([, hgt], i) => { const land = fusePartAt(i), go = land - 10; if (mf >= land) return; const [x, y, w, h] = GOLEM_ROCKS[i];
    const sx = c.gx + x * 1.4 + w * 0.7, sy = GROUND - c.gy + y * 1.4 + h * 0.7, lift = Math.min(1, (mf - FUSE_IN[0]) / 8), hx = sx + Math.sin(mf * 0.25 + i) * 6, hy = sy - 30 * lift - Math.cos(mf * 0.2 + i * 1.7) * 5; // (rising and hanging over the heap)
    const tx = f.x + f.facing * (i === 7 || i === 8 ? 26 : 0), ty = GROUND - f.y - hgt * s, e = mf < go ? 0 : (mf - go) / 10, ee = e * e;
    const px = lerp(hx, tx, ee), py = lerp(hy, ty, ee) - Math.sin(Math.PI * e) * 40, sz = 1 - 0.45 * ee;
    if (e > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${pal.core},${0.5 * e})`; ctx.lineWidth = 4 * sz; ctx.beginPath(); ctx.moveTo(lerp(hx, tx, Math.max(0, ee - 0.3)), lerp(hy, ty, Math.max(0, ee - 0.3))); ctx.lineTo(px, py); ctx.stroke(); ctx.restore(); } // a streak of core light behind it
    rockAt(px, py, w * sz, h * sz, (1 - ee) * (mf * 0.15 + i), pal);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; gemGlow([px, py], pal.core, 2.5, globalT); ctx.restore(); });
}
function drawFuseBar(f) { // the time left in the armour, over his head
  const k = f.fuseT / FUSE_T, x = f.x - 30, y = GROUND - f.y - 222 * f.ch.scale;
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(x - 1, y - 1, 62, 7); ctx.fillStyle = k > 0.25 ? '#e0a95a' : '#e06a4a'; ctx.fillRect(x, y, 60 * k, 5);
}
function fuseGauge(f, x, y, left) { // under his stones: the fusion gauge (full: ← → + J + K), or the armour's time left while he wears it
  const w = 108, x0 = left ? x - w + 6 : x - 6, fused = f.ch.fused, k = fused ? f.fuseT / FUSE_T : (f.fuseG || 0) / 100, full = !fused && k >= 1;
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(x0 - 1, y - 1, w + 2, 6);
  ctx.fillStyle = fused ? '#e0a95a' : full ? `rgba(255,215,120,${0.75 + 0.25 * Math.sin(globalT * 0.25)})` : '#9c7a52'; ctx.fillRect(left ? x0 + w * (1 - k) : x0, y, w * k, 4);
  ctx.font = SMALL; ctx.textBaseline = 'top'; ctx.textAlign = left ? 'right' : 'left'; ctx.fillStyle = full ? '#ffe6a8' : 'rgba(255,255,255,.7)';
  ctx.fillText(fused ? L('ARMOUR', 'アーマー') : full ? L('FUSION ← → J+K', '融合 ← → J+K') : L('FUSION', '融合'), left ? x0 + w : x0, y + 6);
}
function drawPillar(p, pal) { // a pillar (or spike) of rock bursting up out of the floor, glowing cracks up its side, then sinking back
  const up = 1 - Math.pow(1 - Math.min(1, p.t / 4), 3), down = p.t > p.T - 8 ? Math.max(0, (p.T - p.t) / 8) : 1, h = p.h * up * down, w = p.w; if (h < 2) return;
  ctx.save(); ctx.translate(p.x, GROUND); ctx.lineJoin = 'round';
  ctx.fillStyle = pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w / 2 - 6, 0); ctx.lineTo(-w / 2, -h + 10); ctx.lineTo(-w / 6, -h); ctx.lineTo(w / 5, -h + 6); ctx.lineTo(w / 2, -h + 16); ctx.lineTo(w / 2 + 6, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = pal.dark; ctx.fillRect(w / 8, -h + 18, w / 3, h - 18); // its shaded side
  ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${pal.core},${0.9 * down})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-w / 5, -8); ctx.lineTo(0, -h * 0.4); ctx.lineTo(-w / 6, -h * 0.7); ctx.lineTo(w / 8, -h + 14); ctx.stroke();
  ctx.restore();
}
function drawOpusFloor(f) { // under them: the stones he has thrown, and the circle that joins them once they've landed
  const c = f.opus, pal = golemPal(f), landed = c.stones.filter(st => st.t >= 10), k = c.fade != null ? Math.max(0, 1 - c.fade / 30) : 1, full = c.burst ? 1 : landed.length / OPUS_THROWS.length;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  if (landed.length) { ctx.save(); ctx.translate(c.cx, GROUND - 2); ctx.scale(1, 0.2); ctx.lineWidth = 4; ctx.strokeStyle = `rgba(${pal.glow},${(0.4 + 0.5 * full) * k})`; ctx.beginPath(); ctx.arc(0, 0, OPUS_RX, Math.PI / 2, Math.PI / 2 + Math.PI * 2 * full); ctx.stroke(); // the circle draws itself from stone to stone
    if (full >= 1) { ctx.strokeStyle = `rgba(${pal.hot},${0.7 * k})`; ctx.lineWidth = 3; for (const r0 of [0, Math.PI]) { ctx.beginPath(); for (let i = 0; i <= 3; i++) { const an = r0 + Math.PI / 2 + i * Math.PI * 2 / 3; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(an) * OPUS_RX, Math.sin(an) * OPUS_RX); } ctx.stroke(); }
      const gg = ctx.createRadialGradient(0, 0, 4, 0, 0, OPUS_RX * 1.2); gg.addColorStop(0, `rgba(${pal.core},${0.45 * k})`); gg.addColorStop(1, `rgba(${pal.core},0)`); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, OPUS_RX * 1.2, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore(); }
  for (const st of c.stones) { const e = Math.min(1, st.t / 10), y1 = GROUND - 4 + Math.sin(st.an) * OPUS_RX * 0.2, x = lerp(st.x0, st.tx, e), y = lerp(st.y0, y1, e) - Math.sin(Math.PI * e) * 90; gemGlow([x, y], ['110,255,220', '255,190,80', '150,170,255'][c.stones.indexOf(st) % 3], 5 * k, globalT); }
  ctx.restore();
}
function drawOpusFront(f) { // in front of them: the golem's pieces flying in, then the shell of rock around them, glowing as the circle fills
  const c = f.opus; if (!c || c.burst) return; const o = other(f), t = c.t, pal = golemPal(f);
  if (t < OPUS_FLY[0]) return;
  const e = Math.min(1, (t - OPUS_FLY[0]) / (OPUS_FLY[1] - OPUS_FLY[0])), ee = e * e * (3 - 2 * e);
  GOLEM_ROCKS.forEach(([x, y, w, h], i) => { const sx = c.gx + x * 1.4 + w * 0.7, sy = GROUND - c.gy + y * 1.4 + h * 0.7, an = i * 0.7, tx = o.x + Math.cos(an) * 26, ty = GROUND - o.y - 22 - (i * 17) % 130; // (each piece settles somewhere on them, legs to shoulders)
    rockAt(lerp(sx, tx, ee), lerp(sy, ty, ee) - Math.sin(Math.PI * e) * 70, w * 1.1, h * 1.1, (1 - ee) * (i % 2 ? 4 : -4) + i, pal); });
  if (e >= 1 && c.bind) { const lit = c.stones.filter(st => st.t >= 10).length / OPUS_THROWS.length; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${pal.core},${0.3 + 0.6 * lit})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(o.x - 10, GROUND - 10); ctx.lineTo(o.x + 6, GROUND - 60); ctx.lineTo(o.x - 8, GROUND - 110); ctx.moveTo(o.x + 14, GROUND - 30); ctx.lineTo(o.x + 4, GROUND - 90); ctx.stroke(); ctx.restore(); } // (cracks of light through the shell)
}
function drawGolemFront(f) { if (f.fuse) drawFuseFront(f); if (f.opus) drawOpusFront(f); } // (drawn over both fighters)
function drawGolemFigure(x, y, facing, k) { // the golem on its own, with a fist raised (the opening's group shot): it rises out of the ground as k goes 0 → 1
  const f = { golem: { x, y: 0, facing, act: null, hold: null, broken: false, hidden: false, spd: 0, ph: 0, hp: 1, max: 1, life: GOLEM_LIFE, flash: 0, crouch: false }, pillars: [], state: 'win', st: 99, side: 0, alt: false, fuseT: 0, ch: CHARS.alchemist, bare: true };
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, y - GROUND + (1 - k) * 40); drawGolem(f); ctx.restore();
}
function drawGolem(f) { // a stone golem, drawn in the world where it stands
  const g = f.golem; if (!g) return; const pal = golemPal(f);
  if (f.opus) drawOpusFloor(f);
  for (const p of f.pillars) drawPillar(p, pal);
  if (f.fuseT > 0) drawFuseBar(f);
  if (g.hidden) return; // (in pieces: on him, or flying)
  if (g.broken) { drawGolemPile(g, pal); return; }
  const t = globalT, a = g.act, A = a && GOLEM_ACT[a.kind], s = 1.4, wk = Math.sin(g.ph * 6) * (g.spd > 0 ? 1 : 0), e = x => x * x * (3 - 2 * x);
  let squat = g.crouch ? 0.78 : 1, lean = 0, glow = 1;
  if (a) { const k = a.t, su = A.su;
    if (a.kind === 'lowp') { squat = k <= su ? 1 - 0.28 * e(k / su) : 0.72; lean = k <= su ? -0.05 : 0.14; } // the low punch: it drops into a crouch
    if (a.kind === 'tackle') lean = k <= su ? -0.1 : 0.32; if (a.kind === 'shield') lean = k <= su ? -0.04 : 0.1;
    if (a.kind === 'hp') lean = k <= su ? -0.06 : 0.1; if (a.kind === 'lp' || a.kind === 'lp2') lean = k <= su ? -0.04 : 0.06;
    if (a.kind === 'ham') { lean = k <= su ? -0.12 * e(k / su) : 0.28; squat = k <= su ? 1.05 : 0.86; glow = k <= su ? 1 + e(k / su) : 1; } // rears up, then brings both fists down
    if (a.kind === 'upper') { squat = k <= su ? 1 - 0.25 * e(k / su) : lerp(0.75, 1.08, Math.min(1, (k - su) / 3)); lean = k <= su ? 0.12 : -0.14; } // dips, then drives up
    if (a.kind === 'rise') lean = k <= su ? 0.04 : -0.12;
    if (a.kind === 'heave') { squat = k <= su ? 1 - 0.18 * e(k / su) : lerp(0.82, 1.06, Math.min(1, (k - su) / 3)); lean = k <= su ? 0.08 : -0.12; } // it sinks under their weight, then stands up tall
    if (a.kind === 'pound') { squat = k <= su ? 1.04 : 0.76; lean = k <= su ? -0.1 : 0.22; }
    if (a.kind === 'meteor') { lean = g.vy > 0 ? -0.08 : 0.26; squat = g.y <= 0 && k > su + 2 ? 0.8 : 1; } }
  ctx.save(); ctx.translate(g.x, GROUND - g.y); ctx.scale(g.facing * s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(0, 0, 38, 8, 0, 0, Math.PI * 2); ctx.fill();
  const rock = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, 5); ctx.fill(); ctx.stroke(); };
  const bob = g.spd > 0 ? Math.abs(Math.sin(g.ph * 6)) * 3 : Math.sin(t * 0.05) * 1.2;
  rock(-24, -34 + Math.max(0, wk) * 6, 18, 34 - Math.max(0, wk) * 6, pal.dark); // legs
  rock(6, -34 + Math.max(0, -wk) * 6, 18, 34 - Math.max(0, -wk) * 6, pal.body);
  ctx.save(); ctx.translate(0, -34); ctx.rotate(lean); ctx.scale(1, squat); ctx.translate(0, 34); // the whole upper body sinks, leans and rises
  const arm = (sx, sy, fx, fy, c) => { ctx.strokeStyle = pal.line; ctx.lineWidth = 19; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(fx, fy); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 13; ctx.stroke(); ctx.fillStyle = c; ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, fy, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); };
  const hand = (rest, two) => { if (g.hold) { const D = Math.abs(other(f).x - g.x) / 1.4; return [clamp(D - 6, 40, 110), -98]; } // (holding them: both arms stretch out to where they stand)
    if (!a) return rest; const [pull, fw] = GOLEM_ARMS[a.kind] || GOLEM_ARMS.lp, k = a.t, su = A.su, end = su + A.ac;
    if (A.leap) { const up = g.y > 0 && g.vy > -2 && !a.hit; return up ? pull : fw; } // (leaping: both fists raised over its head, then brought down)
    const oc = other(f), near = Math.sign(oc.x - g.x) === g.facing ? Math.abs(oc.x - g.x) / 1.4 + 12 : 99; // (up close the fist stops at them instead of flying through)
    const fwd = A.reach && (a.kind === 'lp' || a.kind === 'lp2' || a.kind === 'lowp') ? [Math.min(30 + A.reach[1] * 0.8, Math.max(30, near)), fw[1]] : fw;
    const sh = two ? -2 : 0; // (the other hand of a two-handed blow trails a little)
    return k <= su ? [lerp(rest[0], pull[0], e(k / su)), lerp(rest[1], pull[1], e(k / su))] : k <= end + 2 ? [lerp(pull[0], fwd[0] + sh, Math.min(1, (k - su) / 2)), lerp(pull[1], fwd[1], Math.min(1, (k - su) / 2))]
      : [lerp(fwd[0], rest[0], e(Math.min(1, (k - end - 2) / (A.rec * 0.8)))), lerp(fwd[1], rest[1], e(Math.min(1, (k - end - 2) / (A.rec * 0.8))))]; };
  const twoHanded = (a && ['hp', 'tackle', 'heave', 'pound', 'meteor', 'ham'].includes(a.kind)) || !!g.hold;
  const cheer = !a && !g.hold && ((f.state === 'win' && f.st > 25) || (showOn() && game.round === 1 && f.state === 'stand' && game.phaseT - (f.side ? 8 : 0) > 100)); // (it raises a fist with him)
  const farRest = [-42, -46 - bob], nearRest = [34, -48 - bob], useFar = a && a.alt && !twoHanded;
  const farH = twoHanded ? hand([-30, -50], true) : useFar ? hand(farRest) : farRest, nearH = cheer ? [34, -136 - bob + Math.sin(t * 0.15) * 3] : (a && !useFar) ? hand(nearRest) : nearRest;
  if (!useFar) arm(-30, -86 - bob, farH[0] - (twoHanded ? 8 : 0), farH[1], pal.dark);                       // the far arm
  ctx.fillStyle = pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -34 - bob); ctx.lineTo(30, -34 - bob); ctx.lineTo(38, -90 - bob); ctx.lineTo(-38, -90 - bob); ctx.closePath(); ctx.fill(); ctx.stroke(); // the body
  ctx.strokeStyle = pal.crack; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, -90 - bob); ctx.lineTo(-6, -66 - bob); ctx.lineTo(-16, -48 - bob); ctx.moveTo(18, -76 - bob); ctx.lineTo(10, -58 - bob); ctx.stroke(); // cracks
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pu = (0.7 + 0.3 * Math.sin(t * 0.1)) * Math.min(1.4, glow), rr = 18 * Math.min(2.4, glow), gg = ctx.createRadialGradient(0, -62 - bob, 1, 0, -62 - bob, rr); gg.addColorStop(0, `rgba(${glow > 1.5 ? pal.hot : pal.core},${Math.min(1, 0.9 * pu)})`); gg.addColorStop(1, `rgba(${pal.core},0)`); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, -62 - bob, rr, 0, Math.PI * 2); ctx.fill(); ctx.restore(); // the stone that moves it
  rock(-15, -122 - bob, 30, 30, pal.head);                                                                    // the head
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${pal.eye},.95)`; ctx.fillRect(1, -112 - bob, 6, 4); ctx.fillRect(9, -112 - bob, 5, 4); ctx.restore();
  if (useFar) arm(-30, -86 - bob, farH[0], farH[1], pal.light);                                               // (the other fist throws the second punch of a string)
  else arm(30, -86 - bob, nearH[0], nearH[1], pal.light);
  if (a && a.kind === 'shield') { ctx.save(); ctx.translate(nearH[0] + 12, nearH[1]); ctx.fillStyle = pal.dark; ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-9, -52, 20, 108, 6); ctx.fill(); ctx.stroke(); ctx.strokeStyle = pal.crack; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-4, -30); ctx.lineTo(4, -8); ctx.lineTo(-3, 18); ctx.stroke(); ctx.restore(); } // the slab of stone
  ctx.restore();
  ctx.restore();
  if (f.bare) return; // (a figure in the opening: no bars)
  const w = 60, x = g.x - w / 2, y = GROUND - g.y - 178 * (g.crouch ? 0.85 : 1); ctx.fillStyle = 'rgba(8,8,20,.7)'; ctx.fillRect(x - 2, y - 2, w + 4, 10); // its health, and under it the time it has left
  ctx.fillStyle = g.hp / g.max > 0.35 ? '#d9a65a' : '#e06a4a'; ctx.fillRect(x, y, w * g.hp / g.max, 4); ctx.fillStyle = `rgba(${pal.glow},.85)`; ctx.fillRect(x, y + 5, w * g.life / GOLEM_LIFE, 2);
  if (g.flash > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,255,255,${0.12 * g.flash})`; ctx.fillRect(g.x - 50, GROUND - g.y - 170, 100, 170); ctx.restore(); }
}
STRINGS.alchemist = { // the duet strings (any mix of U and J, three presses, then a finisher) and, in a juggle, the golem's rising jab (U), the Stone Pillar (I) and his Stone Comet (K)
  aU2: beat('Golem Hook', 'gAim', 'lp2', { startup: 2, chain: DUET2, holdPunch: true }), // (the golem's other fist)
  aJ2: hStone('Stone Knuckle / Throw', DUET2),
  aHam: beat('Golem Hammer', 'gTwin', 'ham', { startup: 2 }),
  aGrab: beat('Golem Grab', 'gTwin', 'hp', { startup: 2 }),
  aUp: beat('Golem Uppercut', 'gTwin', 'upper', { startup: 2 }), // (in a string the order comes quicker: he's already pointing)
  aVol: beat('Stone Volley', 'alThrow', null, { noSmear: true, wind: 'alThrowW', startup: 6, recovery: 14, each: volleyBeat(1), poseFn: throwAnim(16) }),
  aJF: beat('Stone Barrage', 'alThrow', null, { noSmear: true, wind: 'alThrowW', startup: 6, recovery: 26, near: { ...KNUCKLE, recovery: 26 }, // (a string-ender: it keeps its own long recovery up close too)
    poseFn: throwAnim(9), // two blows (knuckles up close, stones from afar), the second one knocks them down
    each: (f, o, k) => { if (k === 0) hohenStone(f, o, { label: 'Stone Barrage' }); if (k === 7) hohenStone(f, o, { k: 1.3, label: 'Stone Barrage', h: { kd: true, kdVx: 9, kdVy: 7, hitstop: 9 } }); } }),
  jPalm: beat('Golem Rising Jab', 'gAim', 'rise', { jug: true, stay: true }),
  jStone: beat('Aimed Stone', 'alThrow', null, { noSmear: true, jug: true, stay: true, wind: 'alThrowW', startup: 7, recovery: 10, also: (f, o) => alchemistStone(f, o, 70, { k: 1.2, h: { juggle: true } }) }), // (J after the golem's rising jab: his stone while it holds them up)
  jRise: { kind: 'p', str: 1, label: 'Stone Pillar', jug: true, stay: true, startup: 9, active: 2, recovery: 16, wind: 'gTwin', pose: 'alThrowLow', hitbox: null, antiDone: true, relaunch: true,
    onFrame: (f, o, mf) => { if (mf === 1) golemStart(f, 'pound', f.serial); if (mf === f.move.startup) stonePillar(f, o); } },
  jSpin: { kind: 'k', str: 1, label: 'Stone Comet', jug: true, stay: true, startup: 8, active: 2, recovery: 16, wind: 'alThrowW', pose: 'alThrow', hitbox: null, antiDone: true, kd: true,
    onFrame: (f, o, mf) => { if (mf === f.move.startup) stoneComet(f, o); } },
};
{ const t = STRINGS.alchemist; t.jElbow = { ...t.jPalm, label: 'Golem Rising Jab 2' }; t.jUpper = { ...t.jPalm, label: 'Golem Rising Jab 3' };
  t.jPalm.chain = { lp: 'jElbow', lk: 'jStone', hp: 'jRise', hk: 'jSpin' }; t.jElbow.chain = { lp: 'jUpper', lk: 'jStone', hp: 'jRise', hk: 'jSpin' }; t.jUpper.chain = { lk: 'jStone', hp: 'jRise', hk: 'jSpin' };
  t.jStone.chain = { lp: 'jUpper', hp: 'jRise', hk: 'jSpin' }; t.jRise.chain = { hk: 'jSpin' }; } // (in a juggle the golem and he trade off: U, J, U, I...)
// in the golem armour: he fights in its stone himself
const FUSED_LOOK = {}; for (const k of ['sk0', 'ck0', 'ck1', 'jk0', 'jk1', 'sk1']) FUSED_LOOK[k] = CHARS.alchemist.normalLook[k];
Object.assign(FUSED_LOOK, { sp0: { label: 'Stone Jab', advHit: 11, push: 2 }, cp0: { label: 'Low Stone Jab' }, sp1: { label: 'Stone Smash' }, cp1: { label: 'Stone Uppercut' }, jp0: { label: 'Air Stone Jab' }, jp1: { label: 'Air Stone Smash' } }); // (his own stone fists)
const FUSED_CH = { ...CHARS.alchemist, fused: true, lookKey: 'alchemistFused', normalLook: FUSED_LOOK, dmgMul: 1.15 * 1.3, takeMul: 0.7, scale: 1.12, idle: 'alArmorIdle', walk: 3.3, back: 2.8, pDmg: 1.1,
  sp: { fP: 'afBeam', fPH: 'afBoulder', fK: 'afSlide', fKH: 'afShoulder', bP: 'afBoulderRoll', bPH: 'afWall', bK: 'afQuake', bKH: 'afCyclone', dP: 'afPillar' }, sup: 'afCannon', fuseSp: null }; // (Tetsu's commands, his own techniques)
STRINGS.alchemistFused = { // stone fists: overhand smashes, a core-light burst from his belly, pillars of rock
  n2: SG('p', 'Stone Straight', 'jabW', 'straight'), n3: SG('p', 'Stone Hook', 'alKnuckleW', 'alKnuckle', { dmg: 30 }), n4: SG('p', 'Overhand Smash', 'alOpus', 'alThrowLow', { hitbox: [20, 90, 40, 130], push: 2 }),
  nF: SF('p', 'Golem Hammer', 'alOpus', 'alThrowLow', { dmg: 70, kdVx: 13, onFrame: (f, o, mf) => { if (mf === f.move.startup + 1) { dustAt(f.x + f.facing * 60, true); cracks(f.x + f.facing * 60); } } }),
  nL: SL('Pillar Upper', 'uppercutW', 'uppercut', { onFrame: (f, o, mf) => { if (mf === f.move.startup) f.pillars.push({ x: f.x + f.facing * 60, t: 3, T: 22, h: 130, w: 34 }); } }),
  nE: SF('k', 'Boulder Kick', 'kickW', 'highKick', { dmg: 54, kdVx: 6, kdVy: 10 }),
  nl2: SG('k', 'Low Stone Kick', 'kickW', 'lowKick', { low: true, hitbox: [20, 80, 8, 44] }), nlE: SF('k', 'Rock Sweep', 'crouch', 'slideKick', { low: true, hitbox: [0, 95, 0, 40], dmg: 52 }),
  jPalm: SJ('p', 'Stone Lift', 'alKnuckleW', 'alKnuckle'), jElbow: SJ('p', 'Overhand Smash', 'alOpus', 'alThrowLow', { dmg: 28 }), jUpper: SJ('p', 'Core Upper', 'uppercutW', 'uppercut', { dmg: 30, jugVy: 8 }),
  jRise: JR('Pillar Upper', 'uppercutW', 'uppercut', { onFrame: (f, o, mf) => { if (mf === f.move.startup) f.pillars.push({ x: o.x, t: 3, T: 24, h: Math.min(280, o.y + 100), w: 36 }); } }),
  jSpin: SJF('Core Burst', 'alOpus', 'alBrace', { kdVx: 14, onFrame: (f, o, mf) => { if (mf === f.move.startup) { const x = f.x + f.facing * 40, y = GROUND - f.y - 85; parts.push({ type: 'ring', x, y, r: 10, vr: 7, life: 14, max: 14, col: '255,210,130' }); for (let i = 0; i < 12; i++) parts.push({ type: 'spark', x, y, vx: f.facing * rnd(2, 9), vy: rnd(-4, 4), life: 14, max: 14, col: '255,200,110' }); sfx('flame'); } } }), // (a blast of core light from his belly)
};
{ const t = STRINGS.alchemistFused; // (wired like everyone's: U U U U K, U U I, U U K; in a juggle U U U, I, K)
  t.n2.chain = { lp: 'n3', hp: 'nL', hk: 'nE' }; t.n3.chain = { lp: 'n4', hp: 'nL', hk: 'nE' }; t.n4.chain = { hk: 'nF', hp: 'nL' }; t.nl2.chain = { hk: 'nlE' };
  t.$start = { p: { lp: 'n2', hp: 'nL', hk: 'nE' }, k: null };
  t.jPalm.chain = { lp: 'jElbow', hp: 'jRise', hk: 'jSpin' }; t.jElbow.chain = { lp: 'jUpper', hp: 'jRise', hk: 'jSpin' }; t.jUpper.chain = { hk: 'jSpin', hp: 'jRise' }; t.jRise.chain = { hk: 'jSpin' }; }
// the CPU Hohen: the armour as soon as it's ready, the super when it will land, room when someone gets past the golem, stones from afar
function hohenPlan(f, o, dist, r) {
  const g = f.golem, between = g && !g.broken && !g.hidden && Math.sign(g.x - o.x) === Math.sign(f.x - o.x), reeling = o.state === 'stunned' || o.state === 'hitstun';
  if (f.ch.fuseSp && f.fuseG >= 100 && dist > 80) return { btn: 'hk', fuse: true };
  if (f.meter >= 100 && f.ch.sup && (reeling || (dist < 320 && r < 0.4))) return { btn: 'hp', sup: true };
  if (f.ch.fused) return null; // (in the armour he fights up close: the usual plans and his armour routes)
  if (dist < 95 && !between && r < 0.45) return r < 0.25 ? { dash: -1 } : { jump: -1 }; // someone got inside, past the golem: make room
  if (dist < 95 && r < 0.75) return r < 0.2 ? { btn: 'lk' } : r < 0.35 ? { btn: 'lp' } : r < 0.45 ? { btn: 'hk', bb: true } : r < 0.6 ? { btn: 'hp' } : { btn: 'hp', down: true }; // close: knuckle, golem jab, Bedrock Stride, grab, uppercut
  if (dist > 300) return r < 0.25 ? { btn: 'hk' } : r < 0.4 ? { btn: 'lk', ff: true } : r < 0.52 ? { btn: 'hk', ff: true } : r < 0.66 ? { btn: 'lk' } : r < 0.75 ? { btn: 'hp', ff: true } : { walk: -0.5 }; // far: volleys, lobs, traps, the tackle
  if (dist > 150) return r < 0.22 ? { btn: 'lk' } : r < 0.36 ? { btn: 'lp' } : r < 0.46 ? { btn: 'lk', ff: true } : r < 0.54 ? { btn: 'lp', ff: true } : r < 0.6 ? { btn: 'hp', ff: true } : r < 0.7 ? { walk: -1 } : null;
  return null;
}
// a CPU fighting Hohen: the golem stands in the way, so jump over it to get at him, or pound it until it breaks — and watch for his stones
function vsGolemPlan(f, o, dist) {
  const g = o.golem; if (!g || g.broken || g.hidden || f.ch.fused) return null;
  const toG = g.x - f.x, gd = Math.abs(toG), between = Math.sign(toG) === Math.sign(o.x - f.x) && gd < dist, r = Math.random();
  if (!between) return null;
  if (projs.some(p => p.owner === o && !p.dead && (p.type === 'stone' || p.type === 'spikes') && Math.abs(p.x - f.x) < 260 && Math.sign(f.x - p.x) === Math.sign(p.vx || 0))) return null; // (a stone on its way: the guard logic takes it)
  if (gd > 160) return r < 0.6 ? { walk: 1 } : null; // get to it
  if (r < (g.hp < g.max * 0.5 ? 0.1 : 0.3)) return { jump: 1 }; // over it, onto Hohen (less often once it's half broken)
  return r < 0.6 ? { btn: 'lp', chain: ['lp', 'lp', 'hk'] } : r < 0.85 ? { btn: 'hp' } : { btn: 'hk' }; // break it: whole strings into it
}
// his entrance before the first round, and his victories (the golem joins in: see drawGolem)
SHOW.alchemist = { intro: [['alGlasses', 50], ['alStoneUp', 95], ['alPresent', 140]], introLine: ['Hold still. This won’t hurt... much.', 'じっとしていなさい。痛くは…ないはずだ。'],
  win: [['alStoneUp', 60], ['alPresent', 999]], winLine: ['Diagnosis: complete.', '診断終了。'] };
WIN.alchemist = {
  a: { seq: [['alStoneUp', 35], ['alGlasses', 75], ['alIdle', 999]], line: ['A textbook case.', '教科書どおりの症例だ。'] },
  b: { seq: [['alBowDoc', 55], ['alGlasses', 95], ['alIdle', 999]], line: ['Rest now. Doctor’s orders.', '安静にしなさい。医者の指示だ。'] },
  c: { seq: [['vTired', 60], ['alGlasses', 999]], line: ['My golem needs repairs... and so do I.', 'ゴーレムも…私も、修理が必要だな。'] },
  final: { seq: [['alOpus', 45], ['alStoneUp', 90], ['alPresent', 999]], line: ['The great work is complete.', '大いなる業、ここに成れり。'] },
};
// joining the roster
Object.assign(DIVE_STRIKE, { alchemist: 'Falling Stone', alchemistFused: 'Boulder Dive' }); // (↓ + U in the air)
CHAR_ORDER.push('alchemist'); DEMO_VS.alchemist = 'ninja'; GHOST_TINT.alchemist = new Proxy({}, { get: () => '#e8f4ff' });
// sample combos: one quick and one long for each way the three of them can stand — the golem in front of him or behind the opponent,
// Hohen close in or far back — then the super, the armour and the stone skin
const ALCHEMIST_DEMOS = [
  { name: '1. Golem in front (quick): jab, stone, hammer', tail: 'golem jab, stone over its shoulder, golem hammer', ax: 250, bx: 410, gx: 330, cpu: { min: 120, max: 240, golem: 'front' },
    note: 'Hohen close behind his golem. U: the golem jabs, J: his stone flies past its shoulder, U: the golem brings both fists down (stand to guard it).',
    steps: [S('U', 'start', { btn: 'lp' }), S('J', 'chain', { btn: 'lk' }), S('U', 'chain', { btn: 'lp' })] },
  { name: '2. Golem in front (long): lift, lift, bounce', tail: 'grab, knuckle, heave, rising jab, pillar, meteor, comet', ax: 250, bx: 410, gx: 330, cpu: { min: 120, max: 240, golem: 'front' },
    note: 'I: the golem grabs them and swings them round to face him. J: a stone-knuckle while they’re held. I: it heaves them up (lift 1). U: its rising jab, I: a pillar of rock rises under them (lift 2), → → + I: it leaps and slams them down (bounce). K: his Stone Comet finishes.',
    steps: [S('I', 'start', { btn: 'hp' }), S('J', 'link', { btn: 'lk' }), S('I', 'link', { btn: 'hp' }), S('U', 'air', { btn: 'lp' }), S('I', 'air', { btn: 'hp' }), S('→ → + I', 'air', { btn: 'hp', ff: true }), S('K', 'air', { btn: 'hk' })] },
  { name: '3. Hohen far back (quick): jab, jab, volley', tail: 'golem jab, golem jab, stone volley', ax: 120, bx: 470, gx: 400, cpu: { min: 260, max: 460, golem: 'front' },
    note: 'Hohen stays back while the golem works. U, U: two golem jabs hold them there, K: his three stones fly the length of the stage and knock them down.',
    steps: [S('U', 'start', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: '4. Hohen far back (long): uppercut, stone, pillar, meteor', tail: 'golem uppercut, rising jab, aimed stone, pillar, meteor, comet', ax: 150, bx: 470, gx: 400, cpu: { min: 260, max: 460, golem: 'front' },
    note: '↓ + I: the golem uppercuts them (lift 1). U: its rising jab holds them up and J: his stone from afar meets them there. I: the stone pillar (lift 2), → → + I: Golem Meteor (bounce), K: Stone Comet.',
    steps: [S('↓ + I', 'start', { btn: 'hp', down: true }), S('U', 'air', { btn: 'lp' }), S('J', 'chain', { btn: 'lk' }), S('I', 'chain', { btn: 'hp' }), S('→ → + I', 'air', { btn: 'hp', ff: true }), S('K', 'air', { btn: 'hk' })] },
  { name: '5. Pincer (quick): knuckle, golem, volley', tail: 'stone-knuckle, golem jab from behind, stone volley', ax: 300, bx: 385, gx: 470, cpu: { min: 50, max: 115, golem: 'behind' },
    note: 'They’re caught between the two. J: his stone-knuckle from the front, U: the golem from behind (they have to turn to guard it), K: his volley from the front again.',
    steps: [S('J', 'start', { btn: 'lk' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: '6. Pincer (long): grab from behind', tail: 'knuckle, grab from behind, knuckle, heave, rising jab, pillar, meteor, comet', ax: 300, bx: 385, gx: 470, cpu: { min: 50, max: 115, golem: 'behind' },
    note: 'J: a stone-knuckle, I: the golem seizes them from behind and holds them facing him. J: another knuckle, I: the heave (lift 1), U, I: rising jab and pillar (lift 2), → → + I: meteor (bounce), K: comet.',
    steps: [S('J', 'start', { btn: 'lk' }), S('I', 'chain', { btn: 'hp' }), S('J', 'link', { btn: 'lk' }), S('I', 'link', { btn: 'hp' }), S('U', 'air', { btn: 'lp' }), S('I', 'air', { btn: 'hp' }), S('→ → + I', 'air', { btn: 'hp', ff: true }), S('K', 'air', { btn: 'hk' })] },
  { name: '7. Golem behind them (quick): jab, stone, volley', tail: 'golem jab from behind, stone, stone volley', ax: 120, bx: 430, gx: 510, cpu: { min: 240, max: 460, golem: 'behind' },
    note: 'Hohen far back, the golem on their far side. U: the golem punches them toward him, J: his stone meets them, K: the volley knocks them down.',
    steps: [S('U', 'start', { btn: 'lp' }), S('J', 'chain', { btn: 'lk' }), S('K', 'chain', { btn: 'hk' })] },
  { name: '8. Golem behind them (long): lob, grab, heave', tail: 'stone lob, grab from behind, heave, rising jab, pillar, meteor, comet', ax: 150, bx: 430, gx: 510, cpu: { min: 240, max: 460, golem: 'behind' },
    note: '→ → + J: a lobbed stone drops on them and stuns. I: the golem grabs them from behind, I: the heave (lift 1), U, I: rising jab and pillar (lift 2), → → + I: meteor (bounce), K: comet.',
    steps: [S('→ → + J', 'start', { btn: 'lk', ff: true }), S('I', 'link', { btn: 'hp' }), S('I', 'link', { btn: 'hp' }), S('U', 'air', { btn: 'lp' }), S('I', 'air', { btn: 'hp' }), S('→ → + I', 'air', { btn: 'hp', ff: true }), S('K', 'air', { btn: 'hk' })] },
  { name: '9. Magnum Opus', tail: 'lob and stun, Magnum Opus', ax: 250, bx: 470, cpu: { meter: true, min: 160, max: 420 },
    note: '→ → + J stuns them, then U + J: the golem bursts into stones that fly onto them and pin them in a shell of rock. He throws six glowing stones around them, and when the circle closes it erupts and blasts them up.',
    steps: [S('→ → + J', 'start', { btn: 'lk', ff: true }), S('U + J', 'link', { btn: 'hp', sup: true })] },
  { name: '10. Golem armour', tail: 'armour, stone jab, upper, stone lift, overhand smash, core burst', ax: 300, bx: 385, gx: 230, cpu: { min: 60, max: 110, fuse: true },
    note: '← → + J + K with a full fusion gauge: the golem comes apart and its stones lock onto him piece by piece, boots to helmet. For twenty seconds he fights in it himself: U stone jab, I pillar upper, U, U, K core burst from his belly.',
    steps: [S('← → + J + K', 'start', { btn: 'hk', fuse: true }), S('U', 'start', { btn: 'lp' }), S('I', 'chain', { btn: 'hp' }), S('U', 'air', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: '11. Bedrock Stride through a jab', tail: 'stone skin takes the jab, the burst, low stone on the ground', ax: 300, bx: 400, gx: 230, dummy: { at: 22, inp: { btn: 'lp' } },
    note: '← ← + K: his skin turns to stone as he strides in — their jab lands but doesn’t stop him (armour) — then it bursts all round him and knocks them down. ↓ + J: a low stone as they lie there.',
    steps: [S('← ← + K', 'start', { btn: 'hk', bb: true }), S('↓ + J', 'otg', { btn: 'lk', down: true })] },
  // in the golem armour (these start with it already on): a quick strong combo and a long one for each range, and for a counter
  { name: '12. Armour, close (quick): fists into the Stone Arm', tail: 'stone jab, stone straight, stone arm', ax: 330, bx: 410, armored: true, cpu: { min: 40, max: 110, fused: true },
    note: 'Up close in the armour. U, U, then → → + K: a giant arm of stone bursts out of the floor and smashes them away.',
    steps: [S('U', 'start', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('→ → + K', 'cancel', { btn: 'hk', ff: true })] },
  { name: '13. Armour, close (long): lift, lift, bounce', tail: 'pillar spike, stone lift, pillar upper, boulder crash, stone lift, overhand smash, core burst', ax: 400, bx: 470, armored: true, cpu: { min: 30, max: 90, fused: true },
    note: 'The most a combo allows, in the armour: ↓ + I: Pillar Spike (lift 1), U, I: pillar upper (lift 2), → → + I: Boulder Crash (bounce), U, U, K.',
    steps: [S('↓ + I', 'start', { btn: 'hp', down: true }), S('U', 'air', { btn: 'lp' }), S('I', 'chain', { btn: 'hp' }), S('→ → + I', 'cancel', { btn: 'hp', ff: true }), S('U', 'air', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: '14. Armour, mid range (quick): rubble wave, boulder crash', tail: 'rubble wave, boulder crash, stone arm', ax: 280, bx: 460, armored: true, cpu: { min: 140, max: 220, fused: true },
    note: '→ → + J: a low surge of rubble scoops them up. → → + I: a boulder drops out of the sky onto them (the bounce). → → + K: the stone arm bursts up under them as they come down.',
    steps: [S('→ → + J', 'start', { btn: 'lk', ff: true }), S('→ → + I', 'air', { btn: 'hp', ff: true, noChase: true }), S('→ → + K', 'air', { btn: 'hk', ff: true, noChase: true })] },
  { name: '15. Armour, mid range (long): rubble wave, crash, geyser', tail: 'rubble wave, stone lift, boulder crash, stone lift, core geyser, overhand smash, core burst', ax: 280, bx: 460, armored: true, cpu: { min: 140, max: 220, fused: true },
    note: '→ → + J scoops them up (lift 1). U, then → → + I: Boulder Crash (bounce). U, then → → + U: core light erupts under them (lift 2). U, K.',
    steps: [S('→ → + J', 'start', { btn: 'lk', ff: true }), S('U', 'air', { btn: 'lp' }), S('→ → + I', 'cancel', { btn: 'hp', ff: true }), S('U', 'air', { btn: 'lp' }), S('→ → + U', 'cancel', { btn: 'lp', ff: true }), S('U', 'air', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: '16. Armour, far (quick): boulder toss, stone spiral', tail: 'boulder toss, stone spiral', ax: 200, bx: 450, armored: true, cpu: { min: 200, max: 320, fused: true },
    note: 'From across the stage. → → + I: he hurls a boulder in an arc; it crashes down on them and bounces them. ← ← + U: stones burst up out of the floor through them.',
    steps: [S('→ → + I', 'start', { btn: 'hp', ff: true }), S('← ← + U', 'air', { btn: 'lp', bb: true, noChase: true })] },
  { name: '17. Armour, far (long): the stone does the work', tail: 'boulder toss, stone spiral, core geyser, stone arm', ax: 200, bx: 450, armored: true, cpu: { min: 200, max: 320, fused: true },
    note: 'He never comes in. → → + I: the boulder toss bounces them. ← ← + U: stones burst up through them. → → + U: core light erupts under them (a lift). → → + K: the stone arm bursts up under them and throws them away.',
    steps: [S('→ → + I', 'start', { btn: 'hp', ff: true }), S('← ← + U', 'air', { btn: 'lp', bb: true, noChase: true }), S('→ → + U', 'air', { btn: 'lp', ff: true, noChase: true }), S('→ → + K', 'air', { btn: 'hk', ff: true, noChase: true })] },
  { name: '18. Armour, counter (quick): stone wall', tail: 'stone wall, wall burst, overhand smash, core burst', ax: 400, bx: 500, armored: true, dummy: { at: 8, inp: { btn: 'hp' } },
    note: '← ← + I: a wall of stone springs up; their blow hits it and he bursts through, launching them. U, then K.',
    steps: [S('← ← + I', 'start', { btn: 'hp', bb: true }), S('U', 'air', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: '19. Armour, counter (long): stone wall, two lifts', tail: 'stone wall, wall burst, stone lift, pillar upper, stone lift, overhand smash, core burst', ax: 400, bx: 500, armored: true, dummy: { at: 8, inp: { btn: 'hp' } },
    note: '← ← + I: the wall takes their blow and he bursts through it (lift 1). U, I: pillar upper (lift 2). U, U, K.',
    steps: [S('← ← + I', 'start', { btn: 'hp', bb: true }), S('U', 'air', { btn: 'lp' }), S('I', 'chain', { btn: 'hp' }), S('U', 'air', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: '20. Armour: Rock Eruption into Core Geyser', tail: 'rock eruption, stone lift, core geyser, stone lift, overhand smash, core burst', ax: 330, bx: 420, armored: true, cpu: { min: 60, max: 120, fused: true },
    note: '← ← + K: three pillars of rock erupt in a line, marching out from him; the last throws them up. U, then → → + U: core light bursts up out of the floor under them (a second lift). U, U, K.',
    steps: [S('← ← + K', 'start', { btn: 'hk', bb: true }), S('U', 'air', { btn: 'lp' }), S('→ → + U', 'cancel', { btn: 'lp', ff: true }), S('U', 'air', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: '21. Armour: Great Core Cannon', tail: 'stone jab, stone straight, Great Core Cannon', ax: 330, bx: 410, armored: true, cpu: { min: 40, max: 110, fused: true, meter: true },
    note: 'U, U, then U + J: the golem’s core in his belly fires a great beam of gold that pins them and blasts them away.',
    steps: [S('U', 'start', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('U + J', 'cancel', { btn: 'hp', sup: true })] },
  // how to beat him: each of his risky moves, played by a mirror, guarded and punished (and the safe ones, just guarded)
  { name: 'Punish ↓ + I: Golem Uppercut', vs: 'self', tail: '', note: '', ax: 420, bx: 520, dummy: { at: 4, inp: { down: true, btn: 'hp' }, guardAfter: true },
    steps: [S('Guard ←', 'guard', {}), S('U', 'punish', { btn: 'lp', reach: 999 }), S('U', 'chain', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' })] },
  { name: 'Punish U, U, U: Golem Hammer', vs: 'self', tail: '', note: '', ax: 420, bx: 520, dummy: { at: 4, steps: [S('U', 'start', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' })], guardAfter: true },
    steps: [S('Guard ←', 'guard', {}), S('U', 'punish', { btn: 'lp', reach: 999 }), S('U', 'chain', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' })] },
  { name: 'Punish ← ← + K: Bedrock Stride', vs: 'self', tail: '', note: '', ax: 445, bx: 545, dummy: { at: 4, inp: { bb: true, btn: 'hk' }, guardAfter: true },
    steps: [S('Guard ←', 'guard', {}), S('I', 'punish', { btn: 'hp', reach: 999 }), S('I', 'link', { btn: 'hp' }), S('U', 'air', { btn: 'lp' }), S('I', 'chain', { btn: 'hp' })] },
  { name: 'Punish → → + I: Golem Tackle', vs: 'self', tail: '', note: '', ax: 400, bx: 560, dummy: { at: 4, inp: { ff: true, btn: 'hp' }, guardAfter: true },
    steps: [S('Guard ←', 'guard', {}), S('U', 'punish', { btn: 'lp', reach: 999 }), S('U', 'chain', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' })] },
  { name: 'Guard ↓ + U: Golem Low Punch (crouch)', vs: 'self', tail: '', note: '', ax: 380, bx: 520, dummy: { at: 4, inp: { down: true, btn: 'lp' }, guardAfter: true },
    steps: [S('Guard ↙', 'guard', {})] },
  { name: 'Guard → → + U: Shield Bash (safe)', vs: 'self', tail: '', note: '', ax: 380, bx: 520, dummy: { at: 4, inp: { ff: true, btn: 'lp' }, guardAfter: true },
    steps: [S('Guard ←', 'guard', {})] },
];
Object.assign(JA_DEMO, {
  '1. Golem in front (quick): jab, stone, hammer': { n: '1. ゴーレムが前（短）：ジャブ、石、ハンマー', tail: 'ゴーレムのジャブ、肩越しの石、ゴーレムハンマー', note: '博士はゴーレムのすぐ後ろ。U：ゴーレムのジャブ、J：石がゴーレムの肩越しに飛ぶ、U：ゴーレムが両拳を振り下ろす（立ってガード）。' },
  '2. Golem in front (long): lift, lift, bounce': { n: '2. ゴーレムが前（長）：浮かせ、浮かせ、バウンド', tail: '掴み、石拳、持ち上げ、ライジングジャブ、石柱、メテオ、コメット', note: 'I：ゴーレムが掴み、相手を博士の方へ向ける。J：捕まえた相手に石拳。I：持ち上げて投げ上げる（浮かせ1）。U：ライジングジャブ、I：足元から石柱（浮かせ2）、→→+I：跳んで叩きつける（バウンド）。K：ストーンコメットで締め。' },
  '3. Hohen far back (quick): jab, jab, volley': { n: '3. 博士が遠く（短）：ジャブ、ジャブ、三連投げ', tail: 'ゴーレムのジャブ、ジャブ、石の三連投げ', note: '博士は離れたまま、ゴーレムが戦う。U、U：ゴーレムのジャブで止め、K：三つの石が画面の端から飛んでダウン。' },
  '4. Hohen far back (long): uppercut, stone, pillar, meteor': { n: '4. 博士が遠く（長）：アッパー、石、石柱、メテオ', tail: 'ゴーレムアッパー、ライジングジャブ、狙い石、石柱、メテオ、コメット', note: '↓+I：ゴーレムのアッパー（浮かせ1）。U：ライジングジャブで浮かせたところへ、J：遠くから博士の石。I：石柱（浮かせ2）、→→+I：ゴーレムメテオ（バウンド）、K：ストーンコメット。' },
  '5. Pincer (quick): knuckle, golem, volley': { n: '5. 挟み撃ち（短）：石拳、ゴーレム、三連投げ', tail: '石拳、背後からゴーレムのジャブ、三連投げ', note: '相手は二人の間。J：前から博士の石拳、U：後ろからゴーレム（ガードの向きが変わる）、K：また前から三連投げ。' },
  '6. Pincer (long): grab from behind': { n: '6. 挟み撃ち（長）：背後から掴み', tail: '石拳、背後から掴み、石拳、持ち上げ、ライジングジャブ、石柱、メテオ、コメット', note: 'J：石拳、I：ゴーレムが背後から掴み、博士の方へ向けて押さえる。J：もう一度石拳、I：持ち上げ（浮かせ1）、U、I：ライジングジャブと石柱（浮かせ2）、→→+I：メテオ（バウンド）、K：コメット。' },
  '7. Golem behind them (quick): jab, stone, volley': { n: '7. ゴーレムが相手の後ろ（短）：ジャブ、石、三連投げ', tail: '背後からゴーレムのジャブ、石、三連投げ', note: '博士は遠く、ゴーレムは相手の向こう側。U：ゴーレムが博士の方へ殴り、J：石で迎え、K：三連投げでダウン。' },
  '8. Golem behind them (long): lob, grab, heave': { n: '8. ゴーレムが相手の後ろ（長）：山なり、掴み、持ち上げ', tail: '山なり投げ、背後から掴み、持ち上げ、ライジングジャブ、石柱、メテオ、コメット', note: '→→+J：山なりの石で気絶。I：ゴーレムが背後から掴み、I：持ち上げ（浮かせ1）、U、I：ライジングジャブと石柱（浮かせ2）、→→+I：メテオ（バウンド）、K：コメット。' },
  '9. Magnum Opus': { n: '9. 大いなる錬成', tail: '山なり投げ（気絶）、大いなる錬成', note: '→→+Jで気絶させ、U+J：ゴーレムが石に砕けて相手に飛びつき、岩の殻で閉じ込める。博士が周りに光る石を6つ投げ、円が閉じると錬成陣が炸裂して打ち上げる。' },
  '10. Golem armour': { n: '10. ゴーレムアーマー', tail: 'アーマー、石のジャブ、石柱アッパー、石の持ち上げ、振り下ろし、コアバースト', note: '融合ゲージ満タンで← → + J + K：ゴーレムが砕け、石がブーツからヘルメットまで一つずつ博士に装着される。20秒間、博士自身が鎧で戦う：U 石のジャブ、I 石柱アッパー、U、U、K コアバースト。' },
  '11. Bedrock Stride through a jab': { n: '11. 岩肌の行進でジャブを受け止める', tail: '石の肌でジャブを受け、炸裂、倒れた相手に下段の石', note: '←←+K：肌が石になって前進する——相手のジャブは当たるが止まらない（アーマー）——そして周囲に炸裂してダウン。↓+J：倒れた相手に下段の石。' },
  '12. Armour, close (quick): fists into the Stone Arm': { n: '12. アーマー・近距離（短）：拳からストーンアーム', tail: '石のジャブ、ストレート、ストーンアーム', note: 'アーマーで接近戦。U、U、そして→→+K：床から巨大な石の腕が突き出し、殴り飛ばす。' },
  '13. Armour, close (long): lift, lift, bounce': { n: '13. アーマー・近距離（長）：浮かせ、浮かせ、バウンド', tail: 'ピラースパイク、石の持ち上げ、石柱アッパー、ボルダークラッシュ、石の持ち上げ、振り下ろし、コアバースト', note: 'アーマー中のコンボ上限：↓+I：ピラースパイク（浮かせ1）、U、I：石柱アッパー（浮かせ2）、→→+I：ボルダークラッシュ（バウンド）、U、U、K。' },
  '14. Armour, mid range (quick): rubble wave, boulder crash': { n: '14. アーマー・中距離（短）：ラブルウェーブ、ボルダークラッシュ', tail: 'ラブルウェーブ、ボルダークラッシュ、ストーンアーム', note: '→→+J：低く押し寄せる瓦礫がすくい上げる。→→+I：空から大岩が落ちてくる（バウンド）。→→+K：落ちてくる相手の真下から石の腕が突き出す。' },
  '15. Armour, mid range (long): rubble wave, crash, geyser': { n: '15. アーマー・中距離（長）：瓦礫、大岩、ガイザー', tail: 'ラブルウェーブ、石の持ち上げ、ボルダークラッシュ、石の持ち上げ、コアガイザー、振り下ろし、コアバースト', note: '→→+Jですくい上げ（浮かせ1）。U、→→+I：ボルダークラッシュ（バウンド）。U、→→+U：足元からコアの光が噴き上がる（浮かせ2）。U、K。' },
  '16. Armour, far (quick): boulder toss, stone spiral': { n: '16. アーマー・遠距離（短）：ボルダートス、ストーンスパイラル', tail: 'ボルダートス、ストーンスパイラル', note: '画面の端から。→→+I：大岩を弧を描いて投げ、落ちてバウンドさせる。←←+U：床から石が次々と突き上がる。' },
  '17. Armour, far (long): the stone does the work': { n: '17. アーマー・遠距離（長）：石にまかせる', tail: 'ボルダートス、ストーンスパイラル、コアガイザー、ストーンアーム', note: '博士は一歩も詰めない。→→+I：ボルダートスでバウンド。←←+U：床から石が次々と突き上がる。→→+U：足元からコアの光が噴き上がる（浮かせ）。→→+K：相手の真下から石の腕が突き出して吹き飛ばす。' },
  '18. Armour, counter (quick): stone wall': { n: '18. アーマー・返し技（短）：ストーンウォール', tail: 'ストーンウォール、ウォールバースト、振り下ろし、コアバースト', note: '←←+I：石の壁がせり上がり、相手の攻撃を受け止めて突き破り、浮かせる。U、そしてK。' },
  '19. Armour, counter (long): stone wall, two lifts': { n: '19. アーマー・返し技（長）：ストーンウォール、二回浮かせ', tail: 'ストーンウォール、ウォールバースト、石の持ち上げ、石柱アッパー、石の持ち上げ、振り下ろし、コアバースト', note: '←←+I：壁が攻撃を受け止めて突き破る（浮かせ1）。U、I：石柱アッパー（浮かせ2）。U、U、K。' },
  '20. Armour: Rock Eruption into Core Geyser': { n: '20. アーマー：ロックイラプションからコアガイザー', tail: 'ロックイラプション、石の持ち上げ、コアガイザー、石の持ち上げ、振り下ろし、コアバースト', note: '←←+K：岩の柱が三本、博士から順に噴き出し、最後の一本で打ち上げる。U、そして→→+U：足元の床からコアの光が噴き上がる（2回目の浮かせ）。U、U、K。' },
  '21. Armour: Great Core Cannon': { n: '21. アーマー：大コアキャノン', tail: '石のジャブ、ストレート、大コアキャノン', note: 'U、U、そしてU+J：腹のゴーレムのコアから金色の巨大なビームが相手を押さえつけ、吹き飛ばす。' },
  'Punish ↓ + I: Golem Uppercut': { n: '反撃 ↓ + I：ゴーレムアッパー', tail: '', note: '' },
  'Punish U, U, U: Golem Hammer': { n: '反撃 U、U、U：ゴーレムハンマー', tail: '', note: '' },
  'Punish ← ← + K: Bedrock Stride': { n: '反撃 ← ← + K：岩肌の行進', tail: '', note: '' },
  'Punish → → + I: Golem Tackle': { n: '反撃 → → + I：ゴーレムタックル', tail: '', note: '' },
  'Guard ↓ + U: Golem Low Punch (crouch)': { n: 'ガード ↓ + U：ゴーレムの下段パンチ（しゃがんでガード）', tail: '', note: '' },
  'Guard → → + U: Shield Bash (safe)': { n: 'ガード → → + U：シールドバッシュ（反撃不可）', tail: '', note: '' },
});
const FUSED_ROUTES = [ // what the CPU plays in the golem armour (like Tetsu's routes, with his own techniques)
  { name: 'Armour: stone fists', vs: 'route', cpu: { min: 40, max: 110, fused: true }, steps: [S('U', 'start', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('I', 'chain', { btn: 'hp' }), S('U', 'air', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: 'Armour: pillar spike', vs: 'route', cpu: { min: 30, max: 90, fused: true }, steps: [S('↓ + I', 'start', { btn: 'hp', down: true }), S('U', 'air', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: 'Armour: rubble wave', vs: 'route', cpu: { min: 110, max: 230, fused: true }, steps: [S('→ → + J', 'start', { btn: 'lk', ff: true }), S('U', 'air', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
  { name: 'Armour: boulder toss', vs: 'route', cpu: { min: 130, max: 260, fused: true }, steps: [S('→ → + I', 'start', { btn: 'hp', ff: true }), S('U', 'air', { btn: 'lp' }), S('U', 'chain', { btn: 'lp' }), S('K', 'chain', { btn: 'hk' })] },
];
DEMOS.alchemist = [...ALCHEMIST_DEMOS, ...FUSED_ROUTES]; COMBO_SET.alchemist = ALCHEMIST_DEMOS.filter(d => d.vs !== 'self'); PUNISH_SET.alchemist = ALCHEMIST_DEMOS.filter(d => d.vs === 'self');
