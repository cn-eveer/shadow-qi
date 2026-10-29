'use strict';
/* ================= hit detection ================= */
// Mei's staff: where it actually is this frame (the same geometry the drawing uses: held near the back end, the long end out front).
// The hit area runs along the staff from her front hand out to the tip (and covers where it swept since the last frame).
function staffTipBox(f, mv, hb0) {
  if (!f.pose || mv.spinStaff || /kick|Kick/.test(mv.pose || '') || /kick|Kick/.test(mv.label || '')) return hb0; // (twirls and kicks keep their own hit areas)
  const J = solve(f.pose), s = f.ch.scale, d = f.facing, hu = f.hipUp || 0;
  let dx = J.h1[0] - J.h2[0], dy = J.h1[1] - J.h2[1], L = Math.hypot(dx, dy);
  if (L < 14) { dx = J.h1[0] - J.e1[0]; dy = J.h1[1] - J.e1[1]; L = Math.hypot(dx, dy) || 1; }
  const ux = dx / L, uy = dy / L, len = 150 + (mv.staffExt || 0);
  const W = (lx, ly) => [f.x + (f.animDX || 0) + d * s * lx, f.y + s * (ly + hu)]; // pose space → world (x, height above the floor)
  const p0 = W(J.h1[0], J.h1[1]), p1 = W(J.h1[0] + ux * len, J.h1[1] + uy * len), pad = 20;
  const box = { x0: Math.min(p0[0], p1[0]) - pad, x1: Math.max(p0[0], p1[0]) + pad, y0: Math.max(0, Math.min(p0[1], p1[1]) - pad), y1: Math.max(p0[1], p1[1]) + pad };
  const prev = mv.tipBox && mv.tipBoxMf === f.mf - 1 ? mv.tipBox : null; mv.tipBox = box; mv.tipBoxMf = f.mf;
  const U = (p, q) => q ? { x0: Math.min(p.x0, q.x0), x1: Math.max(p.x1, q.x1), y0: Math.min(p.y0, q.y0), y1: Math.max(p.y1, q.y1) } : p;
  let out = U(box, prev); // (a fast swing: the whole stretch it swept)
  if (mv.launch || mv.jug || mv.air || f.y > 0 || /rise|Rise|Up\b|up\b|Upper|Cudgel|Swing/.test((mv.pose || '') + ' ' + (mv.label || ''))) out = U(out, hb0); // (rising swings and juggle hits scoop up close to her too)
  return out;
}
// no blow reaches further than this in front of its user (Lyra's spells have their own range, LYRA_RANGE)
const MELEE_REACH = 220;
const meleeBox = (f, hb) => f.key === 'psychic' || (f.move && f.move.longRange) || hb[1] <= MELEE_REACH ? hb : [hb[0], Math.max(hb[0] + 30, MELEE_REACH), hb[2], hb[3]];
function boxOf(f, hb) {
  const s = f.ch.scale, [x0, x1, y0, y1] = hb, b0 = f.y + y0 * (f.ch.tallBox ? 1 : s); // tallBox (Tanaka's double possession, 1.4× his size): the blow grows forward and up, but still reaches as low as at normal size
  return f.facing > 0
    ? { x0: f.x + x0 * s, x1: f.x + x1 * s, y0: b0, y1: f.y + y1 * s }
    : { x0: f.x - x1 * s, x1: f.x - x0 * s, y0: b0, y1: f.y + y1 * s };
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
  moonTempest: 'fast', fullMoon: 'fast', shadowCharge: 'heavy', swordSlash: 'heavy', cloneStrike: 'mod', teleKick: 'mod', flame: 'mod', fireballs: 'mod', vanishSlide: 'heavy', vanishDrop: 'mod',
  // Tetsu (Rising Fist: his uppercut comes out without a tell, but it's punished hard if guarded)
  qiBlast: 'mod', tripleQi: 'mod', staffThrow: 'mod', staffWhirl: 'mod', pushParry: 'fast', kickParry: 'fast', parryShove: 'fast', parryKick: 'fast', duckUpper: 'mod', meteorFist: 'heavy', qiSweep: 'heavy', shoulder: 'mod', qiOrb: 'fast', qiParry: 'fast', stomp: 'heavy', tornado: 'heavy', risingFist: 'heavy',
  // Mei
  extendStaff: 'fast', vaultSmash: 'heavy', sweepStaff: 'mod', poleKick: 'mod', windmill: 'mod', cloudLeap: 'heavy', somersault: 'heavy', feint: 'fast',
  // Lyra
  phantomFist: 'fast', crushFist: 'heavy', psyLift: 'heavy', forceWave: 'mod', orbBurst: 'mod', tripleRay: 'mod', orbStrong: 'mod', orbLong: 'mod',
  // Aldric
  plRampart: 'mod', plJudgeThrust: 'heavy', plWindmill: 'mod', plLeap: 'heavy', plParryRise: 'fast', plParryStun: 'fast', plAegis: 'mod', plPray: 'fast', plShove: 'fast', plRiposte: 'fast', plRiseStrike: 'fast', /* (the answers to a parry come out at once) */
  // Kappa
  kpPlate: 'fast', kpCannon: 'mod', kpPounce: 'heavy', kpFrenzy: 'mod', kpBubble: 'mod', kpGeyser: 'heavy', kpShell: 'fast', kpRiptide: 'mod',
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
// Kappa's throws and U-string hits can be broken by the one they catch: I + U for the J throw, J + K for the K throw (and the string's), U + I + J for the U string.
// The buttons are pressed together. A throw holds them for ten frames first (they can't move, only press): break it in time and nothing lands, the two are
// pushed apart; if not, the throw lands. A string hit is broken by buttons pressed in the ten frames before it.
const BREAK_BTN = { J: ['lp', 'hp'], K: ['lk', 'hk'], S: ['lp', 'hp', 'lk'] }, BREAK_WINDOW = 10;
function throwBreak(a, d, h) {
  const mv = a.move; if (a.key !== 'kappa' || !mv) return false;
  if (mv.broken) return true; // (this one was already broken)
  const need = h.grab ? (mv.normal && mv.kind === 'k' && mv.str === 0 ? BREAK_BTN.J : BREAK_BTN.K) : mv.inString && ['c2', 'c3', 'c4'].includes(mv.strKey) ? BREAK_BTN.S : null;
  if (!need || ['knock', 'down', 'getup', 'gbreak', 'stunned', 'slashed', 'attack', 'jump'].includes(d.state)) return false;
  const now = game.frame; if (h.grab && mv.grabT == null) { mv.grabT = now; d.grabLock = BREAK_WINDOW; popText(d.x, GROUND - d.y - 185, L('GRABBED!', '掴まれた！'), '255,200,120'); }
  const from = h.grab ? mv.grabT - BREAK_WINDOW : now - BREAK_WINDOW, ts = need.map(b => d.btnEdge && d.btnEdge[b] != null ? d.btnEdge[b] : -99);
  if (Math.min(...ts) >= from && Math.max(...ts) - Math.min(...ts) <= 5) {
    const side = Math.sign(d.x - a.x) || a.facing; mv.broken = true; d.grabLock = 0;
    sparks(d.x - side * 24, GROUND - d.y - 100, 'block'); sfx('block'); popText(d.x, GROUND - d.y - 185, L('BREAK!', 'ブレイク！'), '255,235,140'); game.freeze = Math.max(game.freeze, 8);
    a.kb = -side * 6; d.kb = side * 6; d.btnEdge = {};
    return true;
  }
  return !!(h.grab && now - mv.grabT < BREAK_WINDOW); // (still inside the window: not thrown yet)
}
function hasArmor(f) { const mv = f.move; return !!mv && ((mv.armorDive && f.mf >= 24) || (f.key === 'kappa' && (mv.id === 'kpPounce' || mv.id === 'kpFrenzy' || (mv.dashLeft > 0))) || (f.key === 'brawler' && mv.tArmor) || mv.id === 'plRampart' || mv.stoneSkin || (f.ch.fused && !mv.normal && !mv.super && techTier(mv) !== 'fast')); } // (Hohen's Bedrock Stride: stone skin; in the golem armour, his techniques have armour like Tetsu's)
function techTier(mv) { return TECH_TIER[mv.id] || (mv.parry ? 'fast' : mv.launch ? 'heavy' : 'mod'); }
const TELL = { mod: 14, heavy: 20 }; // frames of the tell before the wind-up: long enough that a jab pressed after it starts still lands first
const U_REACH = {};
function uReach(d) { // how far the defender's U reaches (Lyra and Jesse reach much further)
  if (d.key === 'psychic') return LYRA_RANGE; if (d.key === 'gunman') return 330;
  if (U_REACH[d.key] == null) { const m = normalMove(d.ch, 'p', 0, 's'), hb = m && m.hitbox; U_REACH[d.key] = hb ? (hb[0] + hb[1]) * d.ch.scale + 20 : 100; }
  return U_REACH[d.key];
}
function techGuardLag(a, d, h) {
  const five = a.state === 'attack' && a.move && a.move.fiveEnder && !a.move.noFiveLag && a.move.startup < 900; // (noFiveLag: an ender with its own block frames)
  if (a.state === 'attack' && a.move && a.move.super && a.move.startup < 900) { const left = a.move.startup + (a.move.active || 0) + a.move.recovery - a.mf, cap = (h.bstun || 10) + 8; if (left > cap) a.move.recovery = Math.max(2, a.move.recovery - (left - cap)); return; } // (supers are safe when guarded)
  if ((!a.lastMoveTech && !five) || a.ko || (a.move && a.move.noGuardLag)) return;
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
  if (d.loopGuard > 0) return null; // stuck too long in one combo: nothing more can hit them until they're free (no endless loops)
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
// every super's full damage evened out to about 220 (measured landing in full on a standing opponent); the kappa's Great Flood and Aldric's Sanctuary keep their own
const SUPER_EQ = { shadowArmy: 0.756, qiCannon: 1.142, greatSage: 1.154, thousandFists: 1.05, gnHighNoon: 0.841, smDeadline: 1.115, saHeavenangel: 0.969, sdInfernodevil: 0.55, sdInfernodouble: 0.559 };
const SUPER_REF = { ninja: 1.08, brawler: 0.9, staff: 1.08, psychic: 1.25, gunman: 1.42, salary: 1.15 }; // each fighter's overall damage when the supers were evened out
// guarding costs: every guarded hit takes a little health and a piece of the guard meter — techniques, charged attacks and supers far more
const CHIP = 0.03, CHIP_BIG = 0.12;
const guardBig = (a, h) => !!(h.superHit || h.spx || (!h.proj && a.state === 'attack' && a.move && (a.move.super || !a.move.normal || a.move.lvl)));
const GUARD_METER = 1.5; // the guard meter lasts this many times as long (every guarded hit costs that much less)
function guardCost(a, d, h, big) {
  const sup = h.superHit || (a.move && a.move.super), rush = a.move && ((a.move.rushTag && !a.move.rushOpen) || FINISHERS.has(a.move.id)), base = (h.gdrain || 0) * 0.6 + (h.dmg || 0) * 0.1;
  return base * (big ? (sup ? 1.3 : rush ? 1.2 : 2.6) : 1) /* (a rush is one technique: only its opening costs the full price) */ * (d.ch.guardMul || 1) * (a.ch.guardDmgMul || 1) * (h.gMul || 1) / GUARD_METER;// (gMul: a hit that's heavy only when it lands)
}
const chipOf = (h, big) => Math.max(1, Math.ceil((h.dmg || 0) * (big ? CHIP_BIG : h.chip ? 0.075 : CHIP)));
// Kuro's launchers (U, U, I, ↓ + I, any attack that lifts them) leave a big opening when guarded
const LAUNCH_LAG = 36;
function launcherGuardLag(a, d, h) {
  const mv = a.move;
  if (a.key !== 'ninja' || a.state !== 'attack' || !mv || !(mv.launch || h.launch) || mv.trip || h.proj || mv.super || mv.startup >= 900 || a.y > 0 || a.ko) return; // (Kuro only: the others' launchers keep their own frames) // (a trip — a low that makes them fall — isn't a launcher)
  const need = (h.bstun || 10) + LAUNCH_LAG, left = mv.startup + (mv.active || 0) + mv.recovery - a.mf;
  if (left < need) mv.recovery += need - left;
  mv.lagLock = true; a.guardLagT = need; a.guardLagUntil = Math.max(a.guardLagUntil || 0, game.frame + need);
  if (!a.lagShown || game.frame - a.lagShown > 30) { a.lagShown = game.frame; popText(a.x, GROUND - a.y - 175, L('OPEN!', '隙あり！'), '255,170,120'); }
}
// auto guard (Settings, on by default): the player — on this machine, not online, not the CPU — guards without holding back whenever
// he isn't attacking and isn't moving toward the opponent (toward: the way to them): standing still guards standing (not lows),
// crouching guards crouching (lows only); a back dash guards too
const autoGuardFor = (f, toward) => game.autoGuard && !game.online && f.ctrl instanceof Human && f.inp && f.inp.h !== toward;
// a ground combo (not in the air, not stunned or knocked down): whoever is being hit can guard the next attack — holding back, or standing
// or crouching with auto guard — if its 発生 (frames from its start until it reaches them) is more than GUARD_BACK; after a counter hit
// they get back to guard 4 frames later (GUARD_BACK_CH). Fast follow-ups (U, U) stay a combo; slower ones (U, I — a medium) can be guarded
const GUARD_BACK = 10, GUARD_BACK_CH = 14;
const COUNTER_STUN = 4; // a counter hit (caught as they started something) stuns 4 frames longer: −4 for them, +4 for whoever countered
const counterStunOf = a => (a && a.move && a.move.counterStun) || (a && a.ch.counterStun) || COUNTER_STUN; // (a move's or a fighter's own: Tetsu's counters stun 8 longer)
const GUARD_STALL = 6;
// (applyHit, below, reports each first hit or guard to the training frame data: fdContact) // frames an attacker loses when his attack is guarded (shown as a recoil)
const JUG_HOLD_MAX = 150; // frames (2.5 s) U, U... can keep them up after the last lift or bounce: then only a new lift or the finisher still lands
const JUG_ATTACKS_MAX = 7; // attacks a juggle can take before a new lift or bounce (finishers still land)
const JUG_HOLD = 2, JUG_FLOAT = 22; // an ordinary juggle hit doesn't raise them: it barely pushes them up, and they hang (light gravity) for a moment
const STUN_DECAY_AFTER = 6; // hits in a combo before ground hit-stun starts to shrink
const COMBO_DECAY = 0.08, COMBO_DECAY_TECH = 0.1, COMBO_FLOOR = 0.25, COMBO_FLOOR_TECH = 0.2; // each hit after the second in a combo does 8% less (10% for techniques), down to a quarter (a fifth for techniques)
const AFTER_TWO_RISES = 1.0; // hits after the second lift or bounce do their normal damage
const EXTEND_BONUS = 26; // a combo that adds its second lift or bounce (within the rules) earns this much extra damage, once — so juggle → bounce → finisher always does clearly more than juggle → finisher
const BOUNCE_DMG = 1.3; // a bounce (slammed into the floor and back up) hits 30% harder
// How high an attack hits, from its animation (where its hitbox reaches when it connects) and what it does:
//   'low'     legs only (sweeps, slides, floor shockwaves): a crouching guard stops it, a standing one doesn't; jump over it
//   'midlow'  reaches the legs and the body (launchers rising off the floor, bounces and drops crashing down to it,
//             big low swings, supers that fill the screen): it hits a crouching guard; a standing guard stops it; jump over it
//   'mid'     the body, or the body and the head: a standing guard stops it; it hits a crouching fighter, as a counter hit
//             (punches and anything higher pass over a crouching fighter)
const LOW_TOP = 45, SHIN = 24; // (in game units from the floor)
const fromAbove = m => !!(m && (m.bounce || m.meteor || m.overhead)), rising = m => !!(m && (m.launch || m.relaunch || m.neutralLaunch));
function heightClass(h, hb) {
  if (fromAbove(h) || (hb && hb.y1 - hb.y0 >= 390)) return 'midlow'; // bounces, drops and overheads crashing down; column hits (supers, crystals, pillars)
  if (h.low) return 'low'; // slides and sweeps along the floor, even the ones that scoop them up into a juggle
  if (rising(h)) return 'midlow'; // launchers rising off the floor
  if (hb && hb.y1 <= LOW_TOP) return 'low';
  if (hb && hb.y0 < SHIN) return 'midlow'; // a swing that sweeps the legs as well as the body
  return 'mid';
}
// Training: each attack's height, shown where it lands (Settings → attack heights). A mid is split by how far up it reaches on them:
// high (passes over a crouching fighter), high + mid (from the body to above the head, so it can't be ducked or jumped early) and mid (the body)
const HEIGHT_TAGS = { high: ['HIGH', '上段', '150,205,255'], highmid: ['HIGH + MID', '上中段', '140,235,215'], mid: ['MID', '中段', '255,226,120'], midlow: ['MID + LOW', '中下段', '255,165,90'], low: ['LOW', '下段', '255,125,160'] };
function heightTag(h, hb, d) {
  const c = heightClass(h, hb), s = d.ch.scale;
  return c !== 'mid' || !hb ? c : hb.y0 >= 95 * s ? 'high' : hb.y1 > 135 * s ? 'highmid' : 'mid'; // (a crouching fighter is 95 tall, a standing one 135)
}
function showHeight(d, side, hb, h, miss) {
  if (!game.training || game.demo || !game.heights || !hb || d.state === 'knock' || d.state === 'down') return; // (not on a juggle or someone lying down)
  const t = HEIGHT_TAGS[heightTag(h, hb, d)], s = d.ch.scale;
  for (const q of parts) if (q.type === 'htag' && q.who === d) q.life = 0; // (one at a time)
  parts.push({ type: 'htag', who: d, side, x: d.x + side * 34 * s, y: GROUND - clamp((Math.max(hb.y0, 0) + Math.min(hb.y1, d.y + 135 * s)) / 2, 14, 210), vx: 0, vy: -0.25, life: 70, max: 70,
    text: L(t[0], t[1]) + (miss ? L(' (miss)', '（空振り）') : ''), col: t[2] });
}
function applyHit(a, d, h, side, hb, hu) {
  if (d.jugSpent && d.state === 'knock') return null; // the juggle limit was reached: nothing can pick them up again before they land (no infinite juggles)
  if (a.ch.dmgMul && h.dmg) h = { ...h, dmg: Math.round(h.dmg * a.ch.dmgMul) }; // a fighter-wide power boost (Mei, Lyra)
  { const sk = a.move && a.move.super ? a.move.id + (a.ch.possess || '') : null; if (sk && SUPER_EQ[sk] && h.dmg) h = { ...h, dmg: Math.max(1, Math.round(h.dmg * SUPER_EQ[sk] * (SUPER_REF[a.key] && !a.ch.possess ? SUPER_REF[a.key] / (a.ch.dmgMul || 1) : 1))) }; } // (supers stay even whatever a fighter's overall damage is set to) // every super lands about the same total damage (not the kappa's flood or Aldric's sanctuary)
  if (h.dmg && a.ctrl instanceof CPU && !game.watch && !game.training && !game.online) h = { ...h, dmg: Math.round(h.dmg * dif().dmg) }; // the CPU hits softer on Easy, harder on Hard and Hell
  if (d.ch.possess === 'double') h = { ...h, dmg: Math.round((h.dmg || 0) * 0.5), launch: false, relaunch: false, bounce: false, wallSplat: false }; // double possession: he can't guard, so he takes half damage and can't be launched into a juggle
  if (a.ch.jugHitMul && h.dmg && d.state === 'knock' && d.juggle) h = { ...h, dmg: Math.round(h.dmg * a.ch.jugHitMul) }; // Lyra: everything she lands on a juggled opponent (crystals, orbs, rays too) hits harder
  const cx = (Math.max(hb.x0, hu.x0) + Math.min(hb.x1, hu.x1)) / 2;
  if (h.grab && (d.state === 'blockstun' || d.state === 'guard') && a.move && a.move.fiveEnder) { // a throw at the end of a guarded string can't take someone still guarding: it's stopped, and he's open
    sparks(cx, GROUND - (hu.y0 + hu.y1) / 2, 'block'); sfx('block'); techGuardLag(a, d, { ...h, bstun: h.bstun || 12 }); return 'block'; }
  const cy = GROUND - (Math.max(hb.y0, hu.y0) + Math.min(hb.y1, hu.y1)) / 2;
  if (h.proj && !h.superHit && !h.floor && d.key === 'kappa' && d.state === 'dash') { // the kappa dives under projectiles as he darts in (not one that reaches the floor: floor)
    if (!d.passT || game.frame - d.passT > 20) { d.passT = game.frame; popText(d.x, GROUND - d.y - 150, 'DIVE', '150,215,255'); }
    return null;
  }
  if (h.proj && d.state === 'attack' && d.move && d.move.projInvul && d.mf >= d.move.projInvul[0] && d.mf <= d.move.projInvul[1]) { // spinning qi: projectiles and rays pass through
    if (!d.passT || game.frame - d.passT > 20) { d.passT = game.frame; popText(d.x, GROUND - d.y - 180, 'PASS', '125,235,255'); }
    return null;
  }
  if (throwBreak(a, d, h)) return null;
  // armor: Tetsu during his moderate and heavy techniques (tell included), and Aldric's Rampart Charge — the hits land and hurt,
  // but they don't stop him: the technique keeps going (no counter). They can only be punished afterwards.
  const dblArmor = d.ch.possess === 'double' && !h.grab && !h.superHit && !['knock', 'down', 'getup'].includes(d.state); // double possession: light hits can't stop him
  const kDash = d.key === 'kappa' && d.state === 'dash' && !h.grab && !h.superHit; // the kappa's dash has armor: hits land, but don't stop him
  const strong = !!(h.heavy || h.tech || h.launch || h.kd || (h.str || 0) >= 1); // (a heavy blow, a technique, a launcher, a knockdown)
  const supArmor = d.state === 'attack' && d.move && d.move.supArmor && d.mf <= d.move.startup && !h.grab && !h.superHit && !strong && Math.abs(a.x - d.x) < 220; // Tetsu's and Kuro's supers, before they come out: light hits from up close don't stop it (strong ones and anything from further away do)
  if (supArmor || dblArmor || kDash || (d.state === 'attack' && d.move && !h.grab && !h.superHit && hasArmor(d) && !(d.key === 'brawler' && strong) && (d.pre > 0 || d.move.startup >= 900 || d.mf <= d.move.startup + (d.move.active || 0)))) {
    const dmg = Math.max(1, Math.round(h.dmg * (supArmor ? 1 : 0.85))); // (the super's armor takes them in full: one that would finish him still does)
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
  if (d.aegisT > 0 && !['hitstun', 'knock', 'down', 'getup', 'gbreak', 'stunned', 'slashed'].includes(d.state)) { // Aegis: from any side, at the cost of guard meter
    d.guard -= (h.gdrain || 6) * 2.4 + (h.dmg || 0) * 0.35 + 6; d.guardIdle = 0; d.aegisHitT = game.frame; // (each hit tears a big piece out of the light: two to four hits break it)
    d.hp = Math.max(1, d.hp - Math.ceil((h.dmg || 0) * 0.25)); // a quarter of the damage still gets through the light
    if (d.guard <= 0) { d.guard = 0; d.guardSlowT = 600; d.aegisT = 0; setState(d, 'gbreak'); d.stun = 50; d.move = null; popText(d.x, GROUND - d.y - 165, 'GUARD BREAK!', '255,120,130'); sparks(cx, cy, 'big'); sfx('break'); game.freeze = Math.max(game.freeze, 10); return 'block'; }
    sparks(cx, cy, 'block'); sfx('block'); if (!d.passT || game.frame - d.passT > 12) { d.passT = game.frame; popText(d.x, GROUND - d.y - 190, 'AEGIS', '190,225,255'); }
    game.freeze = Math.max(game.freeze, 3); return 'block';
  }
  if (d.state === 'attack' && d.move && d.move.frontGuard && d.mf >= d.move.frontGuard[0] && d.mf <= d.move.frontGuard[1] && side === -d.facing) { // shield first: front attacks bounce off
    sparks(cx, cy, 'block'); sfx('block'); if (!d.passT || game.frame - d.passT > 12) { d.passT = game.frame; popText(d.x, GROUND - d.y - 180, 'SHIELD', '255,225,140'); }
    game.freeze = Math.max(game.freeze, 3); return 'block';
  }
  if (d.state === 'attack' && d.move && d.move.parry && d.mf > d.move.startup && d.mf <= d.move.startup + d.move.active && !(d.move.frontOnly && side !== -d.facing) && !(h.proj && d.move.noProjParry) && a.key !== 'psychic') { parryCounter(d, a, h); return null; } // (noProjParry: Tetsu's and Aldric's parries answer blows, not projectiles; Lyra's magic can't be parried at all)
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
  const midCombo = d.state === 'hitstun' && d.y <= 0 && a.state === 'attack' && a.move && a.move.t0 != null && a.serial !== d.comboMoveSerial && game.frame - a.move.t0 + 1 > (d.wasCounter ? GUARD_BACK_CH : GUARD_BACK); // a slow next attack in a ground combo can be guarded
  const canGuard = !d.ch.noGuard && ((d.state === 'stand' || d.state === 'crouch' || d.state === 'guard' || d.state === 'blockstun' || d.state === 'recover' || d.state === 'bdash' || midCombo) && d.y <= 0 && !h.grab) || airGuard; // a throw can't be guarded; a back dash still guards
  const autoAll = !airGuard && autoGuardFor(d, -side), hc = heightClass(h, hb);
  const low = !!d.inp.down || d.state === 'crouch'; // (crouching: the guard is a crouching one — lows only)
  // holding away guards every attack, standing or crouching;
  // for a moment after the sides swap (a cross-up), holding either direction still guards
  const holding = d.inp.h === side || (!h.noGrace && d.inp.h !== 0 && game.frame - d.sideT <= 10)
    || (h.proj && d.inp.h === -(Math.sign(a.x - d.x) || -d.facing)); // projectiles from behind or above (clones, rays, crystals) are guarded by holding away from the attacker
  // Aldric and Tanaka guard by themselves, but only while standing still: settled (not just after an attack), not walking, not pressing anything
  const autoBlock = d.ch.autoBlock && !d.ch.noGuard && d.state === 'stand' && d.y <= 0 && d.st >= 10 && Math.abs(d.vx) < 0.5 && !(d.inp && (d.inp.h || d.inp.btn || d.inp.down)) && !h.grab
    && !(d.ctrl instanceof Dummy && game.dummyMode !== 'guard'); // (a training dummy set to stand still stays hittable, for practising combos)
  if (autoBlock && !holding) popTextOnce(d, L('AUTO GUARD', 'オートガード'));
  // a crouching guard stops lows only — a mid or a mid + low hits someone crouching, as a counter hit (highs pass over them);
  // a standing guard stops highs, mids and mid + lows but not lows
  const lowHit = !airGuard && ((hc === 'low' && !low) || ((hc === 'midlow' || hc === 'mid') && low));
  showHeight(d, side, hb, h);
  if (hc !== 'low' && low && !airGuard && canGuard && (holding || autoAll)) popText(d.x, GROUND - d.y - 175, hc === 'midlow' ? L('MID + LOW!', '中下段！') : L('MID!', '中段！'), '255,200,120'); // (crouch-guarding a mid or a mid + low: it hits)
  if (canGuard && (holding || autoBlock || autoAll) && !lowHit) {
    const pushB = (h.bpush != null ? h.bpush : (h.push || 1) * 0.9) * (h.rushTag ? 1 : a.ch.pushMul || 1); // (rush strings keep their own spacing)
    const big = guardBig(a, h); d.guard -= guardCost(a, d, h, big); d.guardIdle = 0;
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
      d.hp = Math.max(1, d.hp - chipOf(h, big));
      d.meter = Math.min(100, d.meter + 2); sparks(cx, cy, 'block'); sfx('block'); popTextOnce(d, L('AIR GUARD', '空中ガード'));
      trackAdv(a, d, 'block', h.label); game.freeze = Math.max(game.freeze, 3); techGuardLag(a, d, h); launcherGuardLag(a, d, h);
      return 'block';
    }
    setState(d, 'blockstun'); d.stun = h.bstun || 10; d.cguard = low; d.vx = side * pushB;
    if (h.guardPop && d.y <= 0) { d.y = 1; d.vy = 7.5; } // (Lyra's Glyph Trip: guarded, it still pops them up off the ground — they land, still guarding)
    techGuardLag(a, d, h); launcherGuardLag(a, d, h); // a technique or a launcher that's guarded leaves its user open
    d.hp = Math.max(1, d.hp - chipOf(h, big)); // chip damage through the guard: a little for anything, more for techniques and supers
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
  const crouchCaught = !airGuard && d.y <= 0 && low && hc !== 'low' && ['stand', 'crouch', 'guard', 'blockstun', 'recover'].includes(d.state); // a mid caught them crouching
  const counter = (d.state === 'attack' && d.move && (d.mf <= d.move.startup || d.move.heal)) || crouchCaught; // (praying leaves Aldric wide open)
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
  if (d.combo <= 1) { d.comboMoves = 1; d.comboMoveSerial = a.serial; } else if (a.serial !== d.comboMoveSerial) { d.comboMoveSerial = a.serial; d.comboMoves = (d.comboMoves || 1) + 1; } // (the decay counts attacks, not hits: a four-hit palm barrage or a three-hit lariat is one attack)
  const scale = d.combo <= 1 ? 1 : Math.max(h.superHit ? 0.5 : tech ? COMBO_FLOOR_TECH : COMBO_FLOOR, 0.9 - (tech ? COMBO_DECAY_TECH : COMBO_DECAY) * (Math.max(0, (d.comboMoves || 2) - 2) + 0.45 * Math.max(0, d.combo - (d.comboMoves || 1)))); // (extra hits inside one attack count a little under half)
  const isSup = h.superHit || (a.move && a.move.super), riseScale = (d.rises || '').length >= 2 ? (isSup ? 0.6 : a.ch.riseBonus || AFTER_TWO_RISES) : 1; // (a super at the end of a long combo still does less) // (Tetsu's riseBonus: his juggles hit harder the longer he keeps them up — the limits on lifts and bounces are the same)
  // a single attack does its full damage (all of its own hits); every attack that follows it in the same combo does half
  // the attack that starts a combo does full damage; each following attack keeps 65–95% of its damage depending on how long it takes:
  // a quick jab (about 15 frames from start to finish) keeps 72%, a heavy blow (about 40) 93%, a big technique 95%
  const cm = a.move, frames = cm ? Math.min(cm.startup, 60) + (cm.active || 0) + Math.min(cm.recovery || 0, 60) : 30;
  const comboScale = d.combo > 1 && a.serial !== d.comboSerial && !h.fullDmg ? clamp(0.6 + frames / 120, 0.65, 0.95) : 1; // (a few big, separate heavy techniques keep it all)
  let dmg = Math.max(1, Math.round(h.dmg * scale * riseScale * comboScale * (tech ? (airTech ? AIR_TECH : TECH_DMG) : 1) * (h.bounce && h.launch ? BOUNCE_DMG : 1) * (d.ch.takeMul || 1))); // (takeMul: a form that's harder to hurt — Hohen fused with his golem)
  if (d.extendBonus && !isSup) { dmg += d.extendBonus; d.extendBonus = 0; popText(d.x, GROUND - d.y - 175, L('EXTENDED +', '追撃ボーナス +') + EXTEND_BONUS, '255,225,140'); } // (the second lift or bounce extends the combo: a one-time bonus)
  d.hp = Math.max(0, d.hp - dmg);
  if (a.y > 0 && a.state === 'attack' && a.move && a.move.air && d.juggle && !a.move.manualY && a.move.chain && Object.values(a.move.chain).some(Boolean)) a.vy = Math.max(a.vy, 3.2); // an air combo: hitting them keeps him hanging in the air a moment
  if (a.key === 'kappa' && d.lastVenom !== a.serial) { // the kappa's claws carry river venom
    d.lastVenom = a.serial; d.venom = (d.venomT > 0 ? d.venom : 0) + 1; d.venomT = 180;
    if (d.venom >= 3 && !(d.poisonT > 0)) { d.poisonT = 480; d.venom = 0; popText(d.x, GROUND - d.y - 190, L('POISONED!', '毒！'), '120,220,90'); sfx('vanish'); }
  }
  if (h.brand && a.key === 'paladin') addBrand(d, h.brand);
  if (game.training && d.hp <= 0) d.hp = 1;
  d.flash = 7; d.move = null; d.hidden = false; d.shadow = false; d.shadowRun = false;
  a.meter = Math.min(100, a.meter + dmg * 0.11); // MP fills by fighting: dealing damage...
  d.meter = Math.min(100, d.meter + dmg * 0.07); // ...and taking it
  if (d.hp <= 0) { d.ko = true; setState(d, 'knock'); d.vy = 9; d.vx = side * 4.5; d.y = Math.max(d.y, 1); }
  else if (h.slash && d.y <= 0 && !cpl) { // (a slash that's a counter or a punish launches instead, if the move says so: cpLaunch)
    setState(d, 'slashed'); d.stun = h.iai ? 38 : 26; d.slashDir = side; d.vx = side * 1.5;
    parts.push({ type: 'slashmark', x: d.x, y: GROUND - 80 * d.ch.scale, dir: side, life: 34, max: 34, delay: h.iai ? 16 : 0 }); // after an iai the cut shows a moment later
  }
  else if (meteorBounce) { // spike them into the floor; they bounce back up off it (see land)
    d.mBounced = true; setState(d, 'knock'); d.juggle = true; d.jug = d.jug || 0; d.bounceOnLand = true; d.vy = -12; d.vx = side * 0.6; d.y = Math.max(d.y, 1);
  }
  else if (h.launch || cpl || nl) { // launcher: pop them high so they can be juggled
    const weak = h.bounce ? registerBounce(d) : registerUp(d, a); // (a bounce counts on its own, not as a lift)
    setState(d, 'knock'); d.juggle = true; d.relaunched = false; d.relaunchN = 0; d.vy = weak ? Math.min(d.vy, 0) : (h.launchVy || 12.5); d.vx = side * 0.4; d.y = Math.max(d.y, 1); // (same height as before: combos are timed to it)
    if (!weak) { d.jug = 0; d.jugMoves = 0; d.liftT = globalT; }
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
    const holdOver = d.liftT != null && globalT - d.liftT > JUG_HOLD_MAX && !h.relaunch && !h.bounce && !(re || big); // (U, U... has held them long enough since the last lift: from now on they only fall)
    if ((d.jugMoves || 0) > (a.key === 'psychic' ? JUG_ATTACKS_MAX - 2 : JUG_ATTACKS_MAX) && !h.relaunch && !h.bounce && !h.kd && !(re || big)) { d.juggle = false; d.jugSpent = true; popText(d.x, GROUND - d.y - 200, 'LIFT LIMIT', '205,205,220'); } // (too many attacks without a new lift: they drop out)
    const liftsUsed = ((d.rises || '').match(/L/g) || []).length;
    if (weak) d.vy = Math.min(d.vy, 0); // past the rules: U, U, I doesn't raise them at all
    else if (big) { d.vy = Math.max(d.vy, lift); d.liftT = globalT; } // a lift within the rules (U, U, I, Rising Kunai...) raises them
    else if ((d.rises || '').length >= 2) { d.vy = Math.max(Math.min(d.vy, 2), 0.8); d.floatT = Math.max(d.floatT || 0, Math.max(6, 14 - 2 * (d.jugMoves || 0))); } // after the second lift or bounce, U, U only holds them where they are for a moment (never higher): enough for the finisher, no more
    else { d.vy = Math.max(d.vy, Math.min(lift, JUG_HOLD)); d.floatT = Math.max(0, JUG_FLOAT - 3 * (d.jugMoves || 0)); } // before that, U, U only holds them a moment (each attack a little less) // only a real lift raises them; other juggle hits (U, U, crystals...) just hold them in the air a moment d.vx = side * ((h.str >= 1 || h.kd) ? 1.2 : 0.6) * (h.jugVy ? 0.75 : 1); d.y = Math.max(d.y, 1); // pushed away in the air only a little (more for heavy hits), so juggles stay together
    if (h.hold) { d.vy = 0.8; d.y = Math.max(1, d.y + (35 - d.y) * 0.3); d.vx = side * 0.3; } // the beam holds a juggled opponent inside it
    if (holdOver) { d.vy = Math.min(d.vy, -2); d.floatT = 0; } // held long enough: they fall (the finisher can still catch them on the way down)
    if (d.jug >= (a.key === 'ninja' ? 14 : a.key === 'psychic' ? 16 : a.ch.possess === 'angel' ? 18 : 10)) { d.juggle = false; d.jugSpent = true; } // Kuro (and Lyra, whose crystals each count as a hit) can juggle longer // (spent: they drop out, untouchable until they land)
  }
  else if (h.kd || d.y > 0 || d.state === 'knock') {
    const air = d.y > 0 && !h.kd, wasKnock = d.state === 'knock'; // a hit on a jumping opponent can be juggled too
    setState(d, 'knock'); d.juggle = air; d.jug = air ? (wasKnock ? Math.max(d.jug || 0, 2) : 2) : 0; // (still flying from this combo: the juggle count carries on, it doesn't start over)
    d.vy = h.kd ? (h.kdVy || 8.5) : 6.5; d.vx = side * (h.kd ? (h.kdVx || 4) : 1.4); d.y = Math.max(d.y, 1); // (hit out of the air: a smaller push unless it knocks them away)
  }
  else { if (d.repLabel === h.label && d.stuckT > 0 && !(h.superHit && a.key === 'alchemist')) d.repN = (d.repN || 0) + 1; else { d.repLabel = h.label; d.repN = 0; } setState(d, 'hitstun'); d.stun = Math.max(5, Math.round(((h.stun || 16) - Math.max(0, d.combo - STUN_DECAY_AFTER) * 3) * Math.pow(0.6, d.repN))) + (counter ? counterStunOf(a) : 0); /* (a counter hit: longer — COUNTER_STUN) (the same attack again and again in one combo — against a wall, say — stuns less each time: no repeat loops) */ d.crouchHit = low; /* (hit-stun decay: past the first few hits each one stuns less, so a string can't loop forever) */ d.vx = side * (h.push || 1) * 3 * (h.rushTag ? 1 : a.ch.pushMul || 1) * (d.ch.sturdy ? 0.5 : 1); } // knocked back by the hit (further by Mei and Lyra, except in Mei's rush strings)
  if (!h.proj) wallPush(a, d, side); // pinned at the wall: the attacker is pushed back the same way instead
  // Lightning Ball / Fire Breath: once the hit wears off they're left stunned (once until they're back on their feet)
  if (d.state === 'hitstun' && h.stunT && !d.stunUsed && d.hp > 0) { d.pendingStun = Math.max(d.pendingStun || 0, h.stunT); d.stunKind = h.stunKind; }
  else if (d.state !== 'hitstun') d.pendingStun = 0;
  if (h.slashMark) parts.push({ type: 'slashmark', x: d.x, y: GROUND - d.y - 70, dir: side, life: 34, max: 34, delay: 8 });
  if (d.combo >= 2) game.combo = { side: a.side, n: d.combo, t: 70 };
  d.wasCounter = !!counter; // (caught as they started something: they get back to guard later — GUARD_BACK_CH)
  if (punish) popText(cx, cy - 46, 'PUNISH!', '255,210,90');
  else if (counter) popText(cx, cy - 46, 'COUNTER!', '255,160,90');
  const big = h.kd || h.str >= 2 || h.heavy;
  sparks(cx, cy, big ? 'big' : 'hit'); hitSound(a, h, big); // (audio.js: each fighter's hits sound like their weapon)
  if (d.ch.orbs) psyRetaliate(d, a);
  hitFX(a, cx, cy, big, side); // each fighter's hits burst in their own style
  game.freeze = Math.max(game.freeze, h.hitstop || 6);
  if (big) game.shake = Math.max(game.shake, 6);
  trackAdv(a, d, 'hit', h.label);
  if (a.state === 'attack' && a.move && a.move.fmRec && !(a.move.normal && !a.move.air)) { a.move.recovery -= a.move.fmRec; a.move.fmRec = 0; } // (a technique's longer recovery (frameMod) is for misses and guards: a hit, by blade, shot or clone, keeps the combo's timing — a normal's hit-stun already grows with it)
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
  let hb = boxOf(a, meleeBox(a, mv.hitbox));
  if (a.key === 'staff') hb = staffTipBox(a, mv, hb);
  if (floodOwner(a)) hb = { ...hb, x0: -200, x1: W + 200 }; // the flood carries the kappa's every blow: it reaches them anywhere on the stage // Mei: the staff hits along its front half, out to the tip — not at her fists
  if (hitDecoys(a, hb)) { // a guarding shadow soaked up this attack
    a.hitCount = multi; a.hitConnected = true; a.lastResult = 'block'; a.vx -= (Math.sign(o.x - a.x) || a.facing) * 2;
    return;
  }
  const hu = hurtbox(o, !!mv.juggle, !!mv.low);
  if (!hu || !overlap(hb, hu)) {
    if (hu && hb.x0 < hu.x1 && hb.x1 > hu.x0) mv.passed = hb; // (in reach, but over or under them)
    if (mv.passed && !a.hitConnected && a.mf === mv.startup + mv.active) showHeight(o, Math.sign(o.x - a.x) || a.facing, mv.passed, mv, true);
    return;
  }
  const last = a.hitCount === multi - 1;
  const hit = {
    dmg: (multi > 1 && last && mv.lastDmg) ? mv.lastDmg : mv.dmg,
    stun: mv.stun, bstun: mv.bstun, gbstun: 45,
    push: (multi > 1 && last && mv.lastPush) ? mv.lastPush : mv.push,
    kd: multi > 1 ? (last && mv.kd) : mv.kd,
    type: mv.type, low: !!mv.low, overhead: !!mv.overhead, hitstop: mv.hitstop, chip: mv.chip, bpush: mv.guardPush, /* (a technique's own push on a guard: guardPush) */ guardPop: !!mv.guardPop, str: mv.str != null ? mv.str : a.str, proj: false, // (low: must be guarded crouching)
    gdrain: mv.gdrain != null ? mv.gdrain : (multi > 1 ? 2 : 8), rushTag: !!mv.rushTag, tech: isTech(mv), label: mv.label || '', slash: !!mv.slash, iai: !!mv.iai, heavy: !!(mv.normal && mv.str === 1), kdVx: mv.kdVx, kdVy: mv.kdVy, noGrace: !!mv.noGrace, launch: multi > 1 ? (last && !!mv.launch) : !!mv.launch, launchVy: mv.launchVy, bounce: !!mv.bounce, cpLaunch: !!mv.cpLaunch, jugVy: (multi > 1 && last && mv.lastJugVy) ? mv.lastJugVy : mv.jugVy, fixedLift: !!mv.fixedLift, meteor: !!mv.meteor, stunT: mv.stunT, stunKind: mv.stunKind, neutralLaunch: multi > 1 ? (last && !!mv.neutralLaunch) : !!mv.neutralLaunch, relaunch: !!mv.relaunch, slashMark: !!mv.slashMark, brand: mv.brand || 0, grab: !!mv.grab, fullDmg: !!mv.fullDmg,
  };
  if (mv.normal && !mv.air) {
    // stun is counted from the attacker's remaining frames, so the advantage per strength is always the same
    const remaining = mv.startup + mv.active + mv.recovery - a.mf;
    hit.stun = remaining + (mv.advHit != null ? mv.advHit : 3); // (a move that doesn't say: slightly plus, like a finisher)
    hit.bstun = Math.max(4, remaining + (mv.advBlock != null ? mv.advBlock : -2));
    hit.gbstun = remaining + 30;
    hit.bpush = mv.bpush;
  }
  const res = applyHit(a, o, hit, Math.sign(o.x - a.x) || a.facing, hb, hu);
  if (res) { a.hitCount++; a.lastHitMf = a.mf; a.hitConnected = true; a.lastResult = res; }
  if (res && floodOwner(a) && Math.abs(o.x - a.x) > 140) { const n = Math.ceil(Math.abs(o.x - a.x) / 26); for (let i = 0; i < n; i++) { const k = i / n; parts.push({ type: 'aura', x: lerp(a.x, o.x, k), y: GROUND - lerp(a.y + 90, o.y + 90, k) + Math.sin(k * Math.PI) * -20, vx: 0, vy: -0.4, life: 12 + i % 4, max: 16, r: 4, col: '150,220,255' }); } } // (a jet of water carries the blow across)
  if (res === 'block' && !mv.super && !mv.guardStalled) { mv.guardStalled = true; mv.recovery += GUARD_STALL; a.recoilT = GUARD_STALL + 8; } // guarded: he's knocked off balance — a short stall every fighter shows, before he can act again
  if (res === 'hit' && mv.hover && a.y > 0) a.vy = Math.max(a.vy, 2.5); // hang in the air a moment during air juggles
}


// a move that sets its own advantage — blockAdv when guarded, hitAdv on a hit (frames, + = the attacker acts first): once it connects,
// his remaining frames (guarded) or their hit-stun (a hit) are set to match, whatever the general rules for guarded techniques say
function fixAdv(a, d, h, r) {
  const mv = a.state === 'attack' && a.move; if (!mv || mv.startup >= 900) return;
  const left = mv.startup + (mv.active || 0) + mv.recovery - a.mf;
  if (r === 'block' && mv.blockAdv != null && d.state === 'blockstun' && (mv.advByStun || mv.untilLand)) { // (a move that carries him through the air: its end can't move, so the guard stun is set instead)
    let y = a.y, vy = a.vy, n = 0; if (mv.untilLand) while (y > 0 && n < 200) { vy -= G; y += vy; n++; } // (frames until he lands)
    const end = mv.untilLand ? n + (mv.landT || 0) : left;
    d.stun = Math.max(1, end + mv.blockAdv + (!h.proj && !mv.guardStalled && !mv.super && !mv.untilLand ? GUARD_STALL : 0)); /* (landing: no guard stall after it) */ a.guardLagUntil = 0; a.guardLagNeed = 0; mv.lagLock = false;
  }
  else if (r === 'block' && mv.blockAdv != null && d.state === 'blockstun') {
    const T = d.stun - mv.blockAdv - (!h.proj && !mv.guardStalled && !mv.super ? GUARD_STALL : 0); // (a blow — not a shot — still gets the guard stall afterwards: see checkHits)
    if (T < left - mv.recovery && (!h.proj || mv.cutOnGuard)) { mv.active = Math.max(0, a.mf - mv.startup); mv.recovery = Math.max(1, T); } // (more of the blow is still to come than the opening allows: it ends here)
    else mv.recovery = Math.max(1, mv.recovery + T - left);
    a.guardLagUntil = 0; a.guardLagNeed = 0; mv.lagLock = false;
  }
  if (r === 'hit' && mv.cutOnHit && a.mf > mv.startup) mv.active = Math.max(0, a.mf - mv.startup); // (a long-lasting blow that has landed: it ends there, so the follow-up isn't late)
  if (r === 'hit' && mv.hitAdv != null && d.state === 'hitstun') d.stun = Math.max(1, left + mv.hitAdv - (d.ch.recoverT || 12)) + (d.wasCounter ? counterStunOf(a) : 0); // (they act once their recovery after the hit-stun is over; a counter hit adds COUNTER_STUN)
}
{ const core = applyHit; applyHit = function (a, d, h, side, hb, hu) { const r = core.apply(this, arguments); if (r === 'hit' || r === 'block') fixAdv(a, d, h, r); if (r === 'hit' && a.ch.hitPlus && d.state === 'hitstun') d.stun += a.ch.hitPlus; /* (a fighter whose hits all leave him further ahead: Tetsu) */ if (r === 'hit' && a.move && a.move.recPlusAmt && (!a.move.normal || d.state !== 'hitstun')) { a.move.recovery -= a.move.recPlusAmt; a.move.recPlusAmt = 0; } /* (Mei's longer recovery: given back when a technique lands, or a hit launches or knocks down — the follow-up keeps its timing) */ if ((r === 'hit' || r === 'block' || r === 'armor') && a.fd) fdContact(a, r); if ((r === 'hit' || r === 'block') && a.sorbs && a.sorbs.length && !h.orbRay && game.frame - (a.orbT || -99) > 10) { a.orbT = game.frame; orbAssist(a, a.move || {}); } /* (Lyra's orbs fire when one of her attacks lands or is guarded: one volley per attack) */ return r; }; } // a move's own advantage; the training frame data
