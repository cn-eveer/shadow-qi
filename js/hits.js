'use strict';
/* ================= hit detection ================= */
function boxOf(f, hb) {
  const s = f.ch.scale, [x0, x1, y0, y1] = hb;
  return f.facing > 0
    ? { x0: f.x + x0 * s, x1: f.x + x1 * s, y0: f.y + y0 * s, y1: f.y + y1 * s }
    : { x0: f.x - x1 * s, x1: f.x - x0 * s, y0: f.y + y0 * s, y1: f.y + y1 * s };
}
// every → → and ← ← technique can be punished when it's guarded, at least by a quick U, U:
// its user stays stuck in recovery until the guard ends, plus the 9 frames of a U, a margin, and time to dash in if they're far away
// every → → / ← ← technique has a tier:
//  fast  — quick, small: safe when guarded; only a faster attack beats it
//  mod   — a readable tell first (hand signs, a twirl, a wind-up…): a quick jab during the tell counters it; guarded, it's punishable by quick attacks only
//  heavy — a long tell: easy to counter; guarded, it's punished hard (a launcher and a juggle)
// parries and stances count as fast; anything not listed: launchers are heavy, the rest moderate
const TECH_TIER = {
  // Kuro
  shadowCharge: 'heavy', swordSlash: 'heavy', cloneStrike: 'mod', teleKick: 'mod', flame: 'mod', fireballs: 'mod', vanishSlide: 'heavy', vanishDrop: 'mod',
  // Tetsu (Rising Fist: his uppercut comes out without a tell, but it's punished hard if guarded)
  qiBlast: 'mod', meteorFist: 'heavy', qiSweep: 'heavy', shoulder: 'mod', qiOrb: 'fast', qiParry: 'fast', stomp: 'heavy', tornado: 'heavy', risingFist: 'heavy',
  // Mei
  extendStaff: 'fast', vaultSmash: 'heavy', sweepStaff: 'mod', poleKick: 'mod', windmill: 'mod', cloudLeap: 'heavy', somersault: 'heavy', feint: 'fast',
  // Lyra
  phantomFist: 'fast', crushFist: 'heavy', psyLift: 'heavy', forceWave: 'mod', orbBurst: 'mod', tripleRay: 'mod', orbStrong: 'mod', orbLong: 'mod',
  // Aldric
  plRampart: 'mod', plJudgeThrust: 'heavy', plWindmill: 'mod', plLeap: 'heavy', plParryRise: 'fast', plParryStun: 'fast', plAegis: 'mod', plPray: 'heavy',
  // Kappa
  kpPlate: 'fast', kpCannon: 'mod', kpPounce: 'heavy', kpFrenzy: 'mod', kpBubble: 'mod', kpGeyser: 'heavy', kpShell: 'fast', kpCucumber: 'heavy',
  // Jesse
  gnFan: 'mod', gnQuick: 'fast', gnRoll: 'fast', gnJumpShot: 'mod', gnDyna: 'heavy', gnDance: 'mod', gnBackflip: 'fast', gnShowdown: 'fast',
  // Tanaka, and his angel and devil forms
  smCard: 'fast', smCase: 'heavy', smTackle: 'heavy', smUpper: 'heavy', smCoffee: 'mod', smAngel: 'mod', smBow: 'mod', smDevil: 'mod',
  saJab: 'fast', saFist: 'mod', saGlide: 'mod', saAscend: 'heavy', saBless: 'mod', saWard: 'fast', saStep: 'fast',
  smSlide: 'mod', smSpill: 'mod', smSkid: 'fast', sdCrawl: 'heavy', sdTail: 'mod', sdTrail: 'mod',
  sdWhip: 'mod', sdTailDrop: 'mod', sdTailLash: 'mod', sdTailUpper: 'heavy', sdChainB: 'mod', saRay: 'mod', saRayLow: 'mod', saRayFly: 'mod', saDive: 'heavy',
  sdLunge: 'mod', sdMaul: 'mod', sdClaw: 'mod', sdUpper: 'heavy', sdBeckon: 'fast', sdChain: 'mod', sdDrain: 'heavy',
};
const NO_TELL = new Set(['risingFist', 'smBow', 'saRayFly', 'saDive', 'smAngel', 'smDevil']); // (these have their own long lead-in)
function hasArmor(f) { const mv = f.move; return !!mv && ((mv.armorDive && f.mf >= 24) || (f.key === 'brawler' && !mv.normal && !mv.super && techTier(mv) !== 'fast') || mv.id === 'plRampart'); }
function techTier(mv) { return TECH_TIER[mv.id] || (mv.parry ? 'fast' : mv.launch ? 'heavy' : 'mod'); }
const TELL = { mod: 14, heavy: 20 }; // frames of the tell before the wind-up: long enough that a jab pressed after it starts still lands first
const U_REACH = {};
function uReach(d) { // how far the defender's U reaches (Lyra and Jesse reach much further)
  if (d.key === 'psychic') return LYRA_RANGE; if (d.key === 'gunman') return 330;
  if (U_REACH[d.key] == null) { const m = normalMove(d.ch, 'p', 0, 's'), hb = m && m.hitbox; U_REACH[d.key] = hb ? (hb[0] + hb[1]) * d.ch.scale + 20 : 100; }
  return U_REACH[d.key];
}
function techGuardLag(a, d, h) {
  const five = a.state === 'attack' && a.move && a.move.fiveEnder && a.move.startup < 900;
  if (a.state === 'attack' && a.move && a.move.super && a.move.startup < 900) { const left = a.move.startup + (a.move.active || 0) + a.move.recovery - a.mf, cap = (h.bstun || 10) + 8; if (left > cap) a.move.recovery = Math.max(2, a.move.recovery - (left - cap)); return; } // (supers are safe when guarded)
  if ((!a.lastMoveTech && !five) || a.ko) return;
  const R = uReach(d), dist = Math.abs(a.x - d.x) + 30, travel = dist > R ? 16 + Math.ceil(Math.max(0, dist - R - 110) / 8) : 0; // (a dash in takes about 16 frames; the guard pushes them apart a little more)
  const tier = five ? 'heavy' : a.move && a.state === 'attack' && !a.move.normal ? techTier(a.move) : a.lastTechTier || 'mod'; // (the end of a five-hit string is punished hard)
  if (tier === 'fast') { // quick techniques are safe: if one would leave him open, he recovers sooner
    if (a.state === 'attack' && a.move && !a.move.normal && a.move.startup < 900) { const left = a.move.startup + (a.move.active || 0) + a.move.recovery - a.mf, cap = (h.bstun || 10) + 8; if (left > cap) a.move.recovery = Math.max(2, a.move.recovery - (left - cap)); }
    return;
  }
  const need = (h.bstun || 10) + (tier === 'heavy' ? 32 : 20) + travel; // moderate: time for a quick U only (a launcher is too slow); heavy: time for a launcher (18) and more
  if (a.state === 'attack' && a.move) {
    if ((a.move.normal && !five) || a.move.super || a.move.startup >= 900) return;
    const left = a.move.startup + (a.move.active || 0) + a.move.recovery - a.mf;
    if (left < need) { a.move.recovery += need - left; a.guardLagT = need; }
    a.guardLagUntil = Math.max(a.guardLagUntil || 0, game.frame + need); // (even if the technique cuts itself short after being guarded)
    if (a.y > 0 || a.move.air || a.move.untilLand) { a.guardLagNeed = Math.max(a.guardLagNeed || 0, need); a.guardLagAt = game.frame; } // (in the air: the landing is held too)
  } else if (a.y > 0) { a.guardLagNeed = Math.max(a.guardLagNeed || 0, need); a.guardLagAt = game.frame; }
  else if (['stand', 'crouch', 'guard', 'land'].includes(a.state)) { setState(a, 'land'); a.landT = need; a.vx = 0; a.guardLagT = need; } // (a projectile guarded after he'd already recovered: caught off balance)
  if (!a.lagShown || game.frame - a.lagShown > 30) { a.lagShown = game.frame; popText(a.x, GROUND - a.y - 175, L('OPEN!', '隙あり！'), '255,170,120'); }
}
function popTextOnce(f, t) { if (!f.airGuardT || game.frame - f.airGuardT > 20) { f.airGuardT = game.frame; popText(f.x, GROUND - f.y - 170, t, '190,225,255'); } }
function hurtbox(d, juggle, low) {
  if (d.invul > 0 || d.hidden || d.ko || d.state === 'getup' || d.state === 'roll' || d.state === 'slashed') return null;
  // lying down: only a low attack can still reach, once per knockdown
  if (d.state === 'down') return (low && !d.otgUsed && d.st > 4) ? { x0: d.x - 58, x1: d.x + 58, y0: 0, y1: 28 } : null;
  if (d.state === 'knock' && (d.jugSpent || (!juggle && !d.juggle))) return null; // launched opponents can be hit by anything (until the juggle is spent)
  const s = d.ch.scale;
  let h = 135;
  const crouching = d.state === 'crouch' || (d.state === 'blockstun' && d.cguard) || (d.state === 'hitstun' && d.crouchHit) || (d.state === 'attack' && d.move && d.move.crouch);
  if (crouching) h = 95;
  if (d.state === 'land') h = 110;
  if (d.y > 0 || d.state === 'knock') h = 118;
  return { x0: d.x - 25 * s, x1: d.x + 25 * s, y0: d.y, y1: d.y + h * s };
}
const overlap = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const atWall = d => d.x <= WALL_L + 1 || d.x >= WALL_R - 1;
// the wall stops the defender: whatever push they can't take, the attacker gets, the same way back
function wallPush(a, d, side) {
  const v = Math.abs(d.vx); if (!v) return;
  const room = side > 0 ? WALL_R - d.x : d.x - WALL_L, travel = v / 0.2; // how far the push would carry them, and how much room is left
  const lost = clamp(1 - room / travel, 0, 1);
  if (lost <= 0) return;
  a.kb = -side * v * lost; // carried back the same way the defender would have been (it decays like their knockback, whatever the attacker is doing)
}

// Shadow Charge hit before the punch: vanish, reappear behind the attacker and strike (no follow-ups after this)
function counterVanish(d, a) {
  puff(d.x, d.y + 60);
  for (const p of projs) if (p.owner === d && p.type === 'decoy') { p.dead = true; puff(p.x, 60); }
  let x = a.x - a.facing * 62;
  if (x < WALL_L + 5 || x > WALL_R - 5) x = a.x + a.facing * 62;
  d.x = clamp(x, WALL_L, WALL_R); d.y = 0; d.vy = 0; d.vx = 0; d.shadowRun = false;
  d.facing = Math.sign(a.x - d.x) || d.facing;
  startMove(d, specialMove('counterVanish'), 1, true);
  d.invul = 10;
  popText(d.x, GROUND - 170, 'COUNTER VANISH!', '200,170,255'); sfx('vanish');
  game.freeze = Math.max(game.freeze, 6);
}
// a strong technique (any special, including its rising / juggle version, or a standing I / K technique), as opposed to the
// combo tools: juggle punches and kicks, chains, rush strings and supers
const isTech = mv => !!mv.lunge || (!mv.normal && !mv.super && !mv.rushTag);
const TECH_DMG = 0.8, AIR_TECH = 0.6; // strong techniques do a little less, and much less on a juggled opponent: combos beat a few big hits
const JUG_HOLD = 2, JUG_FLOAT = 22; // an ordinary juggle hit doesn't raise them: it barely pushes them up, and they hang (light gravity) for a moment
const STUN_DECAY_AFTER = 6; // hits in a combo before ground hit-stun starts to shrink
const COMBO_DECAY = 0.08, COMBO_DECAY_TECH = 0.1, COMBO_FLOOR = 0.25, COMBO_FLOOR_TECH = 0.2; // each hit after the second in a combo does 8% less (10% for techniques), down to a quarter (a fifth for techniques)
const AFTER_TWO_RISES = 0.6; // hits after the combo's second lift or bounce do 60%
const BOUNCE_DMG = 1.3; // a bounce (slammed into the floor and back up) hits 30% harder
function applyHit(a, d, h, side, hb, hu) {
  if (d.jugSpent && d.state === 'knock') return null; // the juggle limit was reached: nothing can pick them up again before they land (no infinite juggles)
  if (a.ch.dmgMul && h.dmg) h = { ...h, dmg: Math.round(h.dmg * a.ch.dmgMul) }; // a fighter-wide power boost (Mei, Lyra)
  if (h.dmg && a.ctrl instanceof CPU && !game.watch && !game.training && !game.online) h = { ...h, dmg: Math.round(h.dmg * dif().dmg) }; // the CPU hits softer on Easy, harder on Hard and Hell
  if (d.ch.possess === 'double') h = { ...h, dmg: Math.round((h.dmg || 0) * 0.5), launch: false, relaunch: false, bounce: false, wallSplat: false }; // double possession: he can't guard, so he takes half damage and can't be launched into a juggle
  if (a.ch.jugHitMul && h.dmg && d.state === 'knock' && d.juggle) h = { ...h, dmg: Math.round(h.dmg * a.ch.jugHitMul) }; // Lyra: everything she lands on a juggled opponent (crystals, orbs, rays too) hits harder
  const cx = (Math.max(hb.x0, hu.x0) + Math.min(hb.x1, hu.x1)) / 2;
  if (h.grab && (d.state === 'blockstun' || d.state === 'guard') && a.move && a.move.fiveEnder) { // a throw at the end of a guarded string can't take someone still guarding: it's stopped, and he's open
    sparks(cx, GROUND - (hu.y0 + hu.y1) / 2, 'block'); sfx('block'); techGuardLag(a, d, { ...h, bstun: h.bstun || 12 }); return 'block'; }
  const cy = GROUND - (Math.max(hb.y0, hu.y0) + Math.min(hb.y1, hu.y1)) / 2;
  if (h.proj && d.state === 'attack' && d.move && d.move.projInvul && d.mf >= d.move.projInvul[0] && d.mf <= d.move.projInvul[1]) { // spinning qi: projectiles and rays pass through
    if (!d.passT || game.frame - d.passT > 20) { d.passT = game.frame; popText(d.x, GROUND - d.y - 180, 'PASS', '125,235,255'); }
    return null;
  }
  // armor: Tetsu during his moderate and heavy techniques (tell included), and Aldric's Rampart Charge — the hits land and hurt,
  // but they don't stop him: the technique keeps going (no counter). They can only be punished afterwards.
  const dblArmor = d.ch.possess === 'double' && !h.grab && !h.superHit && (h.str === 0 || (h.proj && h.dmg <= 30)) && !['knock', 'down', 'getup'].includes(d.state); // double possession: light hits can't stop him
  if (dblArmor || (d.state === 'attack' && d.move && !h.grab && !h.superHit && hasArmor(d) && (d.pre > 0 || d.move.startup >= 900 || d.mf <= d.move.startup + (d.move.active || 0)))) {
    const dmg = Math.max(1, Math.round(h.dmg * 0.85));
    if (d.hp - dmg > 0) {
      d.hp -= dmg; d.flash = 4; d.healT = 0;
      sparks(cx, cy, 'hit'); sfx('hitL'); if (!d.armorT || game.frame - d.armorT > 20) { d.armorT = game.frame; popText(d.x, GROUND - d.y - 175, L('ARMOR', 'アーマー'), '125,235,255'); }
      parts.push({ type: 'hex', x: cx, y: cy, r: 8, vr: 3, life: 12, max: 12, col: d.key === 'paladin' ? '200,230,255' : '125,235,255', rot: R() * 3 });
      a.meter = Math.min(100, a.meter + dmg * 0.11); a.hitConnected = true; a.lastResult = 'armor';
      game.freeze = Math.max(game.freeze, 4); trackAdv(a, d, 'hit', h.label);
      return 'armor';
    }
  }
  if (d.state === 'attack' && d.move && d.move.counterVanish && d.mf <= d.move.startup && !(d.pre > 0 && d.move.tellPre)) { counterVanish(d, a); return null; } // (his hand signs come first: hit him then and he can't vanish)
  if (h.grab && (d.y > 0 || d.state === 'knock' || d.state === 'down' || d.state === 'getup' || d.invul > 0)) return null; // throws only catch someone on their feet
  if (d.state === 'attack' && d.move && d.move.deflect && d.mf >= d.move.deflect[0] && d.mf <= d.move.deflect[1]) { d.deflected = true; // Aldric's rotations: nothing gets through
    sparks(cx, cy, 'block'); sfx('block'); if (!d.passT || game.frame - d.passT > 12) { d.passT = game.frame; popText(d.x, GROUND - d.y - 180, 'DEFLECT!', '255,225,140'); }
    game.freeze = Math.max(game.freeze, 3); return null;
  }
  if (d.state === 'attack' && d.move && d.move.aegis && d.move.aegisOn) { // Aegis: from any side, at the cost of guard meter
    d.guard -= (h.gdrain || 6) * 0.45 * (d.ch.guardMul || 1) + 1; d.guardIdle = 0;
    d.hp = Math.max(1, d.hp - Math.ceil((h.dmg || 0) * 0.25)); // a quarter of the damage still gets through the light
    if (d.guard <= 0) { d.guard = 0; d.guardSlowT = 600; setState(d, 'gbreak'); d.stun = 50; d.move = null; popText(d.x, GROUND - d.y - 165, 'GUARD BREAK!', '255,120,130'); sparks(cx, cy, 'big'); sfx('break'); game.freeze = Math.max(game.freeze, 10); return 'block'; }
    sparks(cx, cy, 'block'); sfx('block'); if (!d.passT || game.frame - d.passT > 12) { d.passT = game.frame; popText(d.x, GROUND - d.y - 190, 'AEGIS', '190,225,255'); }
    game.freeze = Math.max(game.freeze, 3); return 'block';
  }
  if (d.state === 'attack' && d.move && d.move.frontGuard && d.mf >= d.move.frontGuard[0] && d.mf <= d.move.frontGuard[1] && side === -d.facing) { // shield first: front attacks bounce off
    sparks(cx, cy, 'block'); sfx('block'); if (!d.passT || game.frame - d.passT > 12) { d.passT = game.frame; popText(d.x, GROUND - d.y - 180, 'SHIELD', '255,225,140'); }
    game.freeze = Math.max(game.freeze, 3); return 'block';
  }
  if (d.state === 'attack' && d.move && d.move.parry && d.mf > d.move.startup && d.mf <= d.move.startup + d.move.active && !(d.move.frontOnly && side !== -d.facing)) { parryCounter(d, a, h); return null; }
  if (d.state === 'down') { // ground hit: a low attack on a downed opponent
    const dmg = Math.max(1, Math.round(h.dmg * 0.6));
    d.hp = Math.max(game.training ? 1 : 0, d.hp - dmg); d.otgUsed = true; d.flash = 7;
    d.st = Math.min(d.st, 22); d.y = 1; d.vy = 3;
    if (d.hp <= 0) d.ko = true;
    a.meter = Math.min(100, a.meter + dmg * 0.075);
    sparks(cx, cy, 'hit'); sfx('hit'); popText(cx, cy - 40, 'GROUND HIT', '255,200,120');
    game.freeze = Math.max(game.freeze, 5);
    trackAdv(a, d, 'hit', h.label);
    return 'hit';
  }
  if (d.state === 'attack' && d.move && d.move.barrier && d.mf > d.move.startup && d.mf <= d.move.startup + d.move.active) { // Lyra's barrier: guards anything
    d.vx = side * 1.2; sparks(cx, cy, 'block'); sfx('block'); game.freeze = Math.max(game.freeze, 3); trackAdv(a, d, 'block', h.label);
    if (!h.proj) a.vx -= side * 2;
    return 'block';
  }
  const airGuard = (d.state === 'jump' || (d.state === 'land' && d.y > 0)) && !h.grab; // jumping (not launched): they can guard in the air
  const canGuard = !d.ch.noGuard && ((d.state === 'stand' || d.state === 'crouch' || d.state === 'guard' || d.state === 'blockstun' || d.state === 'recover') && d.y <= 0 && !h.grab) || airGuard; // a throw can't be guarded
  const low = !!d.inp.down;
  // holding away guards every attack, standing or crouching;
  // for a moment after the sides swap (a cross-up), holding either direction still guards
  const holding = d.inp.h === side || (!h.noGrace && d.inp.h !== 0 && game.frame - d.sideT <= 10)
    || (h.proj && d.inp.h === -(Math.sign(a.x - d.x) || -d.facing)); // projectiles from behind or above (clones, rays, crystals) are guarded by holding away from the attacker
  // Aldric and Tanaka guard by themselves, but only while standing still: settled (not just after an attack), not walking, not pressing anything
  const autoBlock = d.ch.autoBlock && !d.ch.noGuard && d.state === 'stand' && d.y <= 0 && d.st >= 10 && Math.abs(d.vx) < 0.5 && !(d.inp && (d.inp.h || d.inp.btn || d.inp.down)) && !h.grab
    && !(d.ctrl instanceof Dummy && game.dummyMode !== 'guard'); // (a training dummy set to stand still stays hittable, for practising combos)
  if (autoBlock && !holding) popTextOnce(d, L('AUTO GUARD', 'オートガード'));
  const lowHit = (!!h.low && !low && !airGuard) || (!!h.overhead && low && !airGuard); // a low attack needs a crouching guard; an overhead (coming down from above) a standing one
  if (canGuard && (holding || autoBlock) && !lowHit) {
    const pushB = (h.bpush != null ? h.bpush : (h.push || 1) * 0.9) * (h.rushTag ? 1 : a.ch.pushMul || 1); // (rush strings keep their own spacing)
    d.guard -= (h.gdrain || 0) * 0.6 * (d.ch.guardMul || 1) * (a.ch.guardDmgMul || 1); d.guardIdle = 0; // the guard meter lasts twice as long as it used to
    if (d.guard <= 0) {
      d.guard = 0; setState(d, 'gbreak'); d.stun = h.gbstun || 45; d.vx = side * 3; d.move = null;
      popText(d.x, GROUND - d.y - 165, 'GUARD BREAK!', '255,120,130');
      sparks(cx, cy, 'big'); sfx('break');
      game.freeze = Math.max(game.freeze, 10); game.shake = Math.max(game.shake, 7);
      trackAdv(a, d, 'gbreak', h.label);
      return 'block';
    }
    if (airGuard) { // guarded in the air: pushed back a little, still falling, can't attack until the block wears off
      d.vx = side * Math.max(2, pushB * 0.7); d.vy = Math.min(d.vy, 3); d.atkCD = Math.max(d.atkCD || 0, h.bstun || 10); d.airAttacked = true;
      if (h.chip) d.hp = Math.max(1, d.hp - Math.ceil(h.dmg * 0.075));
      d.meter = Math.min(100, d.meter + 2); sparks(cx, cy, 'block'); sfx('block'); popTextOnce(d, L('AIR GUARD', '空中ガード'));
      trackAdv(a, d, 'block', h.label); game.freeze = Math.max(game.freeze, 3); techGuardLag(a, d, h);
      return 'block';
    }
    setState(d, 'blockstun'); d.stun = h.bstun; d.cguard = low; d.vx = side * pushB;
    techGuardLag(a, d, h); // a technique that's guarded leaves its user open
    if (h.chip) d.hp = Math.max(1, d.hp - Math.ceil(h.dmg * 0.075)); // chip damage through the guard: half what it was
    if (!h.proj) wallPush(a, d, side); // guarded against the wall: the attacker slides back instead
    d.meter = Math.min(100, d.meter + 3); // ...and guarding
    sparks(cx, cy, 'block'); sfx('block');
    game.freeze = Math.max(game.freeze, 3);
    trackAdv(a, d, 'block', h.label);
    return 'block';
  }
  const inCombo = d.state === 'hitstun' || d.state === 'knock' || d.state === 'stunned'; // a stunned fighter can't escape, so the combo keeps counting
  const juggling = d.state === 'knock' && d.juggle;
  const punish = (d.state === 'attack' && d.move && d.mf > d.move.startup + d.move.active) || d.state === 'land';
  if (d.spirit && !d.spirit.broken && d.state === 'attack' && d.move && (d.pre > 0 || d.mf <= d.move.startup)) d.spirit.broken = game.frame; // (his technique was stopped: the seal breaks)
  const counter = d.state === 'attack' && d.move && (d.mf <= d.move.startup || d.move.heal); // (praying leaves Aldric wide open)
  if (d.state === 'attack' && d.move && (d.pre > 0 || ((d.move.pre || d.move.slow) && d.mf <= d.move.startup))) { popText(d.x, GROUND - 200, 'INTERRUPTED!', '255,220,120'); d.pre = 0; } // a technique hit while gathering or casting is lost
  const cpl = h.cpLaunch && (punish || counter) && d.y <= 0; // Kuro's Crescent Kick launches on a counter or punish
  const meteorBounce = h.meteor && !d.mBounced && (d.y > 0 || d.juggle); // the meteor bounces someone in the air once per combo; otherwise it knocks down
  const nl = h.neutralLaunch && !juggling; // Fire Spout / Qi Geyser launch someone who isn't juggled yet
  if (d.state === 'gbreak') d.guard = 50;
  d.combo = inCombo ? d.combo + 1 : 1;
  if (d.combo === 1) d.comboSerial = a.serial; // the move that started the combo
  const tech = h.tech || (h.proj && !h.juggle && !h.superHit), airTech = tech && juggling;
  // the longer the combo, the less each hit does: the first hit is full, the second 90%, then 8% less for every hit after
  // (never below a floor), and once the combo has used its second lift or bounce every hit after that does less again
  const scale = d.combo <= 1 ? 1 : Math.max(h.superHit ? 0.5 : tech ? COMBO_FLOOR_TECH : COMBO_FLOOR, 0.9 - (tech ? COMBO_DECAY_TECH : COMBO_DECAY) * (d.combo - 2));
  const riseScale = (d.rises || '').length >= 2 ? AFTER_TWO_RISES : 1;
  // a single attack does its full damage (all of its own hits); every attack that follows it in the same combo does half
  // the attack that starts a combo does full damage; each following attack keeps 65–95% of its damage depending on how long it takes:
  // a quick jab (about 15 frames from start to finish) keeps 72%, a heavy blow (about 40) 93%, a big technique 95%
  const cm = a.move, frames = cm ? Math.min(cm.startup, 60) + (cm.active || 0) + Math.min(cm.recovery || 0, 60) : 30;
  const comboScale = d.combo > 1 && a.serial !== d.comboSerial && !h.fullDmg ? clamp(0.6 + frames / 120, 0.65, 0.95) : 1; // (a few big, separate heavy techniques keep it all)
  const dmg = Math.max(1, Math.round(h.dmg * scale * riseScale * comboScale * (tech ? (airTech ? AIR_TECH : TECH_DMG) : 1) * (h.bounce && h.launch ? BOUNCE_DMG : 1)));
  d.hp = Math.max(0, d.hp - dmg);
  if (a.y > 0 && a.state === 'attack' && a.move && a.move.air && d.juggle && !a.move.manualY && a.move.chain && Object.values(a.move.chain).some(Boolean)) a.vy = Math.max(a.vy, 3.2); // an air combo: hitting them keeps him hanging in the air a moment
  if (a.key === 'kappa' && d.lastVenom !== a.serial) { // the kappa's claws carry river venom
    d.lastVenom = a.serial; d.venom = (d.venomT > 0 ? d.venom : 0) + 1; d.venomT = 120;
    if (d.venom >= 4 && !(d.poisonT > 0)) { d.poisonT = 360; d.venom = 0; popText(d.x, GROUND - d.y - 190, L('POISONED!', '毒！'), '120,220,90'); sfx('vanish'); }
  }
  if (h.brand && a.key === 'paladin') addBrand(d, h.brand);
  if (game.training && d.hp <= 0) d.hp = 1;
  d.flash = 7; d.move = null; d.hidden = false; d.shadow = false; d.shadowRun = false;
  a.meter = Math.min(100, a.meter + dmg * 0.11); // MP fills by fighting: dealing damage...
  d.meter = Math.min(100, d.meter + dmg * 0.07); // ...and taking it
  if (d.hp <= 0) { d.ko = true; setState(d, 'knock'); d.vy = 9; d.vx = side * 4.5; d.y = Math.max(d.y, 1); }
  else if (h.slash && d.y <= 0) {
    setState(d, 'slashed'); d.stun = h.iai ? 38 : 26; d.slashDir = side; d.vx = side * 1.5;
    parts.push({ type: 'slashmark', x: d.x, y: GROUND - 80 * d.ch.scale, dir: side, life: 34, max: 34, delay: h.iai ? 16 : 0 }); // after an iai the cut shows a moment later
  }
  else if (meteorBounce) { // spike them into the floor; they bounce back up off it (see land)
    d.mBounced = true; setState(d, 'knock'); d.juggle = true; d.jug = d.jug || 0; d.bounceOnLand = true; d.vy = -12; d.vx = side * 0.6; d.y = Math.max(d.y, 1);
  }
  else if (h.launch || cpl || nl) { // launcher: pop them high so they can be juggled
    const weak = h.bounce ? registerBounce(d) : registerUp(d, a); // (a bounce counts on its own, not as a lift)
    setState(d, 'knock'); d.juggle = true; d.relaunched = false; d.relaunchN = 0; d.vy = weak ? Math.min(d.vy, 0) : (h.launchVy || 12.5); d.vx = side * 0.4; d.y = Math.max(d.y, 1); // (same height as before: combos are timed to it)
    if (!weak) { d.jug = 0; d.jugMoves = 0; }
    if (h.bounce) { // a bounce slams them into the floor: a crater of dust, two shockwaves, a heavy shake and a deep boom
      dustAt(d.x, true); dustAt(d.x + 30, true); dustAt(d.x - 30, true);
      parts.push({ type: 'ering', x: d.x, y: GROUND, r: 10, vr: 11, life: 18, max: 18, col: '255,200,140' }, { type: 'ering', x: d.x, y: GROUND, r: 4, vr: 6, life: 22, max: 22, col: '255,240,200' });
      for (let i = 0; i < 10; i++) parts.push({ type: 'spark', x: d.x + rnd(-40, 40), y: GROUND - 4, vx: rnd(-6, 6), vy: -rnd(4, 10), life: 16, max: 16, col: '255,220,160' });
      game.shake = Math.max(game.shake, 11); game.freeze = Math.max(game.freeze, 4); sfx('bounce');
    }
    if (!weak) popText(cx, cy - 50, cpl ? 'COUNTER LAUNCH!' : h.bounce ? 'BOUNCE!' : 'LAUNCH!', '255,190,90');
  }
  else if (juggling && !h.kd) { // juggle hit: lift them again, a little less each time
    if (!h.hold) d.jug++; setState(d, 'knock');
    if (a.serial !== d.jugMoveSerial) { d.jugMoveSerial = a.serial; d.jugMoves = (d.jugMoves || 0) + 1; } // (juggle decay counts attacks, not hits: a four-crystal rune chain is one attack)
    const re = h.relaunch && (!d.relaunched || (a.ch.possess === 'angel' && (d.relaunchN || 0) < 2)); // (the angel can relaunch twice: a triple juggle) // Rising Kunai / Rising Dragon Fist: a fresh lift, gentler the higher they already are
    const lift = re ? clamp(12.5 - d.y / 25, 8, 11.5) : h.fixedLift ? h.jugVy : (h.jugVy || 7) * (a.key === 'ninja' ? Math.max(0.62, 1 - 0.045 * d.jug) : Math.max(0.55, 1 - 0.06 * d.jug)); // juggle attacks keep a steady lift (Kuro's fade slower)
    if (h.relaunch) { d.relaunched = true; d.relaunchN = (d.relaunchN || 0) + 1; }
    const big = re || h.relaunch || lift >= 9.5, weak = big && registerUp(d, a); // a big lift (Rising Kunai, Fire Spout, Qi Geyser...) counts as a lift — every time, so U, U, I can't keep lifting them
    const liftsUsed = ((d.rises || '').match(/L/g) || []).length;
    if (weak) d.vy = Math.min(d.vy, 0); // past the rules: U, U, I doesn't raise them at all
    else if (big) d.vy = Math.max(d.vy, lift); // a lift within the rules (U, U, I, Rising Kunai...) raises them
    else if (liftsUsed >= 2) { d.vy = Math.min(d.vy, 0); d.floatT = 0; } // after the second lift, U, U only brings them down: just the finisher is left
    else { d.vy = Math.max(d.vy, Math.min(lift, JUG_HOLD)); d.floatT = Math.max(0, JUG_FLOAT - 3 * (d.jugMoves || 0)); } // before that, U, U only holds them a moment (each attack a little less) // only a real lift raises them; other juggle hits (U, U, crystals...) just hold them in the air a moment d.vx = side * ((h.str >= 1 || h.kd) ? 1.2 : 0.6) * (h.jugVy ? 0.75 : 1); d.y = Math.max(d.y, 1); // pushed away in the air only a little (more for heavy hits), so juggles stay together
    if (h.hold) { d.vy = 0.8; d.y = Math.max(1, d.y + (35 - d.y) * 0.3); d.vx = side * 0.3; } // the beam holds a juggled opponent inside it
    if (d.jug >= (a.key === 'ninja' ? 14 : a.key === 'psychic' ? 16 : a.ch.possess === 'angel' ? 18 : 10)) { d.juggle = false; d.jugSpent = true; } // Kuro (and Lyra, whose crystals each count as a hit) can juggle longer // (spent: they drop out, untouchable until they land)
  }
  else if (h.kd || d.y > 0 || d.state === 'knock') {
    const air = d.y > 0 && !h.kd, wasKnock = d.state === 'knock'; // a hit on a jumping opponent can be juggled too
    setState(d, 'knock'); d.juggle = air; d.jug = air ? (wasKnock ? Math.max(d.jug || 0, 2) : 2) : 0; // (still flying from this combo: the juggle count carries on, it doesn't start over)
    d.vy = h.kd ? (h.kdVy || 8.5) : 6.5; d.vx = side * (h.kd ? (h.kdVx || 4) : 1.4); d.y = Math.max(d.y, 1); // (hit out of the air: a smaller push unless it knocks them away)
  }
  else { setState(d, 'hitstun'); d.stun = Math.max(5, h.stun - Math.max(0, d.combo - STUN_DECAY_AFTER) * 3); d.crouchHit = low; /* (hit-stun decay: past the first few hits each one stuns less, so a string can't loop forever) */ d.vx = side * (h.push || 1) * 3 * (h.rushTag ? 1 : a.ch.pushMul || 1) * (d.ch.sturdy ? 0.5 : 1); } // knocked back by the hit (further by Mei and Lyra, except in Mei's rush strings)
  if (!h.proj) wallPush(a, d, side); // pinned at the wall: the attacker is pushed back the same way instead
  // Lightning Ball / Fire Breath: once the hit wears off they're left stunned (once until they're back on their feet)
  if (d.state === 'hitstun' && h.stunT && !d.stunUsed && d.hp > 0) { d.pendingStun = Math.max(d.pendingStun || 0, h.stunT); d.stunKind = h.stunKind; }
  else if (d.state !== 'hitstun') d.pendingStun = 0;
  if (h.slashMark) parts.push({ type: 'slashmark', x: d.x, y: GROUND - d.y - 70, dir: side, life: 34, max: 34, delay: 8 });
  if (d.combo >= 2) game.combo = { side: a.side, n: d.combo, t: 70 };
  if (punish) popText(cx, cy - 46, 'PUNISH!', '255,210,90');
  else if (counter) popText(cx, cy - 46, 'COUNTER!', '255,160,90');
  const big = h.kd || h.str >= 2 || h.heavy;
  sparks(cx, cy, big ? 'big' : 'hit'); hitSound(a, h, big); // (audio.js: each fighter's hits sound like their weapon)
  if (d.ch.orbs) psyRetaliate(d, a);
  hitFX(a, cx, cy, big, side); // each fighter's hits burst in their own style
  game.freeze = Math.max(game.freeze, h.hitstop || 6);
  if (big) game.shake = Math.max(game.shake, 6);
  trackAdv(a, d, 'hit', h.label);
  return 'hit';
}
// an attack that touches the opponent's clone or decoy breaks it; one that touches a guarding shadow is blocked
function hitDecoys(a, hb) {
  for (const p of projs) {
    if (p.dead || p.owner === a || (p.type !== 'clone' && p.type !== 'decoy' && p.type !== 'guardShadow') || (p.type === 'clone' && p.juggle)) continue;
    const pb = projBox(p);
    if (!overlap(hb, pb)) continue;
    const mx = (Math.max(hb.x0, pb.x0) + Math.min(hb.x1, pb.x1)) / 2, my = GROUND - (Math.max(hb.y0, pb.y0) + Math.min(hb.y1, pb.y1)) / 2;
    if (p.type === 'guardShadow') {
      sparks(mx, my, 'block'); sfx('block'); game.freeze = Math.max(game.freeze, 3);
      if (++p.hits >= 2) { p.dead = true; puff(p.x, 60); }
      return true;
    }
    p.dead = true; puff(p.x, 60); sparks(mx, my, 'hit'); sfx('hit');
    popText(p.x, GROUND - 160, p.type === 'clone' ? 'CLONE BROKEN' : 'DECOY!', '200,170,255');
  }
  return false;
}
function checkHits(a, o) {
  if (a.state !== 'attack' || !a.move || !a.move.hitbox) return;
  const mv = a.move;
  if (a.mf <= mv.startup || a.mf > mv.startup + mv.active) return;
  const multi = mv.multi || 1;
  if (a.hitCount >= multi) return;
  if (a.hitCount > 0 && a.mf - a.lastHitMf < (mv.interval || 99)) return;
  const hb = boxOf(a, mv.hitbox);
  if (hitDecoys(a, hb)) { // a guarding shadow soaked up this attack
    a.hitCount = multi; a.hitConnected = true; a.lastResult = 'block'; a.vx -= (Math.sign(o.x - a.x) || a.facing) * 2;
    return;
  }
  const hu = hurtbox(o, !!mv.juggle, !!mv.low);
  if (!hu || !overlap(hb, hu)) return;
  const last = a.hitCount === multi - 1;
  const hit = {
    dmg: (multi > 1 && last && mv.lastDmg) ? mv.lastDmg : mv.dmg,
    stun: mv.stun, bstun: mv.bstun, gbstun: 45,
    push: (multi > 1 && last && mv.lastPush) ? mv.lastPush : mv.push,
    kd: multi > 1 ? (last && mv.kd) : mv.kd,
    type: mv.type, low: !!mv.low, overhead: !!mv.overhead, hitstop: mv.hitstop, chip: mv.chip, str: mv.str != null ? mv.str : a.str, proj: false, // (low: must be guarded crouching)
    gdrain: mv.gdrain != null ? mv.gdrain : (multi > 1 ? 2 : 8), rushTag: !!mv.rushTag, tech: isTech(mv), label: mv.label || '', slash: !!mv.slash, iai: !!mv.iai, heavy: !!(mv.normal && mv.str === 1), kdVx: mv.kdVx, kdVy: mv.kdVy, noGrace: !!mv.noGrace, launch: multi > 1 ? (last && !!mv.launch) : !!mv.launch, launchVy: mv.launchVy, bounce: !!mv.bounce, cpLaunch: !!mv.cpLaunch, jugVy: (multi > 1 && last && mv.lastJugVy) ? mv.lastJugVy : mv.jugVy, fixedLift: !!mv.fixedLift, meteor: !!mv.meteor, stunT: mv.stunT, stunKind: mv.stunKind, neutralLaunch: multi > 1 ? (last && !!mv.neutralLaunch) : !!mv.neutralLaunch, relaunch: !!mv.relaunch, slashMark: !!mv.slashMark, brand: mv.brand || 0, grab: !!mv.grab, fullDmg: !!mv.fullDmg,
  };
  if (mv.normal && !mv.air) {
    // stun is counted from the attacker's remaining frames, so the advantage per strength is always the same
    const remaining = mv.startup + mv.active + mv.recovery - a.mf;
    hit.stun = remaining + mv.advHit;
    hit.bstun = Math.max(4, remaining + mv.advBlock);
    hit.gbstun = remaining + 30;
    hit.bpush = mv.bpush;
  }
  const res = applyHit(a, o, hit, Math.sign(o.x - a.x) || a.facing, hb, hu);
  if (res) { a.hitCount++; a.lastHitMf = a.mf; a.hitConnected = true; a.lastResult = res; }
  if (res === 'hit' && mv.hover && a.y > 0) a.vy = Math.max(a.vy, 2.5); // hang in the air a moment during air juggles
}

