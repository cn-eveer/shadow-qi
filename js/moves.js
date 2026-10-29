'use strict';
/* ================= moves ================= */
// Two strengths: light (U, J) and heavy (I, K). Specials are one direction + Punch or Kick.
const STR = { l: 0, h: 1 };
// hitboxes [x0, x1, y0, y1] in local units: x forward from hip, y up from the fighter's base
const NB = {
  s: { p: [[20,64,106,124],[20,74,106,126]], k: [[20,70,8,44],[20,72,44,100]] },
  c: { p: [[25,80,56,80],[12,60,60,148]], k: [[20,64,0,26],[20,92,0,26]] },
  j: { p: [[15,60,55,96],[10,74,30,100]], k: [[15,62,5,50],[10,84,20,78]] },
};
const NP = {
  s: { p: [['jabW','jab'],['hookW','hook']], k: [['kickW','lowKick'],['kickW','midKick']] },
  c: { p: [['cPunchW','cPunch'],['cPunchW','cUpper']], k: [['crouch','cKick'],['crouch','sweep']] },
  j: { p: [['jump','jPunch'],['jump','jPunchH']], k: [['jump','jKick'],['jump','jKickH']] },
};
const NLABEL = {
  s: { p: ['Light Punch','Heavy Punch'], k: ['Light Kick','Heavy Kick'] },
  c: { p: ['Low Punch','Crouch Uppercut'], k: ['Low Kick','Sweep'] },
  j: { p: ['Jump Punch','Hammer Fist'], k: ['Jump Kick','Flying Kick'] },
};
function stretchReach(mv, k) { // Lyra: every attack reaches further (the glyphs and fists appear further out to match)
  if (!mv || !k || !mv.hitbox) return mv;
  const hb = mv.hitbox.slice(); hb[1] = hb[0] + (hb[1] - hb[0]) * k; mv.hitbox = hb;
  for (const key of ['psyFist', 'giantFist']) if (mv[key]) { mv[key] = mv[key].slice(); mv[key][0] *= k; }
  if (mv.floorGlyph) mv.floorGlyph *= k;
  if (mv.groundBurst) mv.groundBurst *= k;
  return mv;
}
function normalMove(ch, kind, str, stance) {
  const mv = normalMoveBase(ch, kind, str, stance);
  const nl = mv && ch.normalLook && ch.normalLook[stance + kind + str]; if (nl) Object.assign(mv, nl);
  const sst = STRINGS[ch.lookKey || ch.key]; if (mv && sst && sst.$start && stance === 's' && str === 0 && sst.$start[kind]) mv.chain = sst.$start[kind];
  stretchReach(mv, ch.reachMul);
  if (ch.reachAdd && mv && Array.isArray(mv.hitbox) && mv.hitbox[1] > 60) { mv.hitbox = mv.hitbox.slice(); mv.hitbox[1] += ch.reachAdd; } // (Mei: her staff hits out at its tip)
  if (ch === CHARS.kappa && mv && Array.isArray(mv.hitbox) && stance !== 'j') mv.stepIn = mv.hitbox[1] - 20; // (the kappa darts in with every claw: short arms, quick feet)
  if (mv && ch.stringDelay && !mv.air && mv.str === 0) mv.recovery += ch.stringDelay; // Lyra: a pause after each light U / J before the next one
  if (mv && ch.slowTech && !mv.air) { mv.startup += 1; mv.recovery = Math.round(mv.recovery * 1.1); }
  if (mv && ch.sturdy && !mv.air && !mv.held) { mv.startup += 2; mv.recovery = Math.round(mv.recovery * 1.15); } // Aldric: heavy armor, slow, deliberate swings // Mei and Lyra swing a little slower
  if (mv && ch.normalPre && !mv.air) mv.pre = ch.normalPre; // Lyra gathers her power for a moment before every attack
  if (mv && mv.floorGlyph && ch.normalLook) { mv.low = true; mv.lunge = null; } // a fighter's own animation for this button
  if (mv && ch === CHARS.ninja && mv.recovery < 90) mv.recovery = Math.max(5, Math.round(mv.recovery * 0.75)); // Kuro recovers faster
  return mv;
}
function normalMoveBase(ch, kind, str, stance) {
  const isK = kind === 'k', air = stance === 'j';
  const hb = NB[stance][kind][str].slice();
  hb[1] = hb[0] + (hb[1] - hb[0]) * (isK ? ch.kReach : ch.pReach);
  const mv = {
    normal: true, kind, str, stance, air, crouch: stance === 'c', label: NLABEL[stance][kind][str],
    startup: (air ? [4,7] : [4,8])[str] + (isK ? 1 : 0),
    active: air ? 7 : [3,4][str],
    recovery: air ? 6 : [6,19][str] + (isK ? 2 : 0),
    dmg: Math.round((isK ? [36,80] : [32,75])[str] * (isK ? ch.kDmg : ch.pDmg)),
    stun: [14,20][str], bstun: [10,14][str], push: [3,5][str], hitstop: [5,9][str],
    // frames of advantage once it connects: light is safe on guard, heavy can be punished by a light attack
    advHit: [5,3][str], advBlock: [2,-10][str], bpush: [2.5,1.8][str], gdrain: [2,16][str],
    hitbox: hb, type: 'mid', kd: stance === 'c' && str === 1,
    wind: NP[stance][kind][str][0], pose: NP[stance][kind][str][1],
  };
  // punches hit high (a crouching opponent ducks under them); standing J and crouching kicks hit low
  if (kind === 'p' && stance === 's') mv.high = true;
  if (kind === 'k' && (stance === 'c' || (stance === 's' && str === 0))) mv.low = true;
  // combo chains start from the standing light punch and light kick
  if (stance === 's' && str === 0) mv.chain = kind === 'p' ? { lp: 'jab2', hp: 'oneTwo', hk: 'jabKick' } : { lk: 'kick2', hk: 'lowMid' };
  // crouching heavy punch is the uppercut launcher (Tekken style): slow and punishable, but it starts a juggle
  if (kind === 'p' && stance === 'c' && str === 1) Object.assign(mv, { launch: true, launchVy: 14, label: 'Uppercut Launcher', startup: 12, recovery: 16 });
  // standing heavy punch / kick: each fighter's own technique, stepping in with longer reach
  const tech = stance === 's' && str === 1 && ch.heavy && ch.heavy[kind];
  if (tech) {
    Object.assign(mv, tech, { selfMove: true });
    if (!tech.onFrame) mv.onFrame = (f, o, mf) => {
      const [a, b, sp] = mv.lunge;
      f.vx = (mf >= a && mf <= b && Math.abs(o.x - f.x) > 60) ? f.facing * sp : f.vx * 0.7;
      if (mf === mv.startup + 1) heavyFX(f, mv);
    };
  }
  return mv;
}
function heavyFX(f, mv) {
  const s = f.ch.scale, wx = lx => f.x + f.facing * lx * s, wy = ly => GROUND - f.y - ly * s;
  if (mv.burst) {
    const x = wx(mv.burst[0]), y = wy(mv.burst[1]);
    parts.push({ type: 'ring', x, y, r: 6, vr: 4.5, life: 14, max: 14, col: f.ch.fxCol });
    for (let i = 0; i < 10; i++) parts.push({ type: 'aura', x: x + rnd(-10, 10), y: y + rnd(-14, 14), vx: f.facing * rnd(2, 5), vy: rnd(-1, 1), life: rnd(10, 18), max: 18, r: rnd(2.5, 5), col: f.ch.fxCol });
    sfx('palm');
  }
  if (mv.stomp) {
    const x = wx(mv.stomp[0]);
    dustAt(x, true);
    parts.push({ type: 'ering', x, y: GROUND, r: 8, vr: 6, life: 16, max: 16, col: '255,215,160' });
    game.shake = Math.max(game.shake, 3); sfx('land');
  }
  if (mv.trail) sfx('slash');
}
// Kuro's techniques recover faster (kept long enough for each one's animation to finish)
const POUNCE_MAX = 240, RIP_REACH = 380, RIP_PULL = 240; // the kappa's Pounce leaps this far at most; Riptide catches them this far away at most, and drags them this far at most
const KURO_REC = { cloneStrike: 8, shadowCharge: 14, counterVanish: 12, swordSlash: 18, ambushBehind: 16, ambushLeap: 20, ambushSlide: 16, ambushKick: 18, // Shadow Charge and its follow-ups can be punished
  teleKick: 7, teleSlide: 9, teleSpin: 12, flame: 10, fireballs: 1, vanishDrop: 10, vanishSlide: 6, jFire: 10, jRain: 8, jClone: 8, jIai: 15, jVanishHeel: 9, shadowArmy: 22 };
const SLOW_SPECIALS = { staff: new Set(['extendStaff', 'vaultSmash', 'sweepStaff', 'poleKick', 'windmill', 'cloudLeap', 'somersault', 'feint']),
  psychic: new Set(['phantomFist', 'crushFist', 'psyLift', 'forceWave', 'orbBurst', 'tripleRay', 'orbStrong', 'orbLong']) };
// Tetsu's standing techniques drive forward while they wind up (speed per technique)
const TETSU_STEP = { qiBlast: 4, qiOrb: 4, stomp: 4, qiParry: 3, qiCannon: 3 };
const LYRA_IDS = new Set(['forceWave', 'mindGrip', 'tpStrike', 'jWave']);
function specialMove(id) {
  const mv = specialMoveBase(id);
  if (mv && KURO_REC[id] != null) mv.recovery = KURO_REC[id];
  if (mv && TETSU_STEP[id]) {
    const of = mv.onFrame, sp = TETSU_STEP[id], end = Math.min(mv.startup, 12);
    mv.onFrame = function (f, o, mf) { if (mf >= 1 && mf <= end && Math.abs(o.x - f.x) > 70) f.vx = f.facing * sp; if (of) of.call(this, f, o, mf); };
  }
  if (mv && LYRA_IDS.has(id)) stretchReach(mv, CHARS.psychic.reachMul);
  return mv;
}
function specialMoveBase(id) {
  switch (id) {
    case 'cloneStrike': return { id, label: 'Shadow Clone', startup: 13, active: 6, recovery: 8, blockAdv: 0, noFmRec: true, noGuardLag: true, /* (the clone does the work: if it's guarded after he's recovered, he isn't caught off balance) */ /* (no recovery added by his frame tuning) */ wind: 'seal', pose: 'seal', proj: 'clone', limit: 1,
      onFrame(f, o, mf) { if (mf === 12) spawnClone(f, false, 0); } };
    case 'shadowCharge': return { id, label: 'Shadow Charge Upper', startup: 46, active: 9, recovery: 16, blockAdv: -21, wind: 'seal', pose: 'uppercut', selfMove: true, counterVanish: true, slow: true, interruptChance: 0.2,
      hitbox: [10,82,40,175], dmg: 45, stun: 22, bstun: 12, push: 2, launch: true, launchVy: 13, type: 'mid', hitstop: 9, gdrain: 6,
      trail: { cx: 15, cy: 90, r: 95, a0: -70, a1: 100, col: '190,150,255' },
      // the follow-ups are for when the kick is guarded or misses; on a hit you juggle with any attack instead
      follow: { from: 14, to: 66, at: 51, notOnHit: true, opts: { lp: 'ambushBehind', hp: 'ambushLeap', lk: 'ambushSlide', hk: 'ambushKick' } },
      poseFn(f, mf) {
        if (mf <= 12) return lerpPose(f.prevPose, POSES.seal, Math.min(1, mf / 5));
        if (mf <= 46) return f.chargeStop ? lerpPose(POSES.dash, POSES.uppercutW, Math.min(1, (mf - f.stopMf) / 4)) : POSES.dash;
        if (mf <= 51) return lerpPose(POSES.uppercutW, POSES.uppercut, Math.min(1, (mf - 46) / 4)); // a smooth rising uppercut out of the dash
        return null;
      },
      speedHold: f => f.mf > 12 && !f.chargeStop,
      maxTravel: W * 0.3, // (the charge covers up to 3/10 of the screen) // (sped up — techSpeed — only for the hand signs and the turn into the uppercut: the charge itself runs at its own pace)
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; f.chargeStop = false; },
      onFrame(f, o, mf) {
        // same hand sign and timing as Shadow Clone Strike, but a decoy stays behind and the real Kuro is the shadow
        if (mf === 12) { spawnDecoy(f); puff(f.x + f.facing * 20, 60); sfx('clone'); }
        if (mf > 12 && !f.chargeStop) {
          f.shadowRun = true; f.vx = f.facing * 10; // (a charge you can see coming, at its own pace)
          if ((mf >= 14 && Math.abs(o.x - f.x) < 80) || mf >= 42) { f.vx = 0; f.chargeStop = true; f.shadowRun = false; f.mf = Math.min(f.mf, 42); f.stopMf = f.mf; }
        } else if (mf > 12) f.vx *= 0.6;
        if (mf === 47) sfx('rise');
        if (mf >= 47 && mf <= 51) f.y = Math.max(0, 14 * Math.sin(Math.PI * (mf - 46) / 6)); // a little lift as he rises into it
      } };
    case 'counterVanish': return { id, label: 'Counter Vanish', startup: 6, active: 3, recovery: 18, wind: 'crouch', pose: 'slash', blade: true, noGrace: true,
      hitbox: [10,88,40,130], dmg: 62, stun: 20, bstun: 12, push: 2, stunT: 62, stunKind: 'shadow', type: 'mid', hitstop: 10, gdrain: 10,
      trail: { cx: 15, cy: 105, r: 72, a0: 70, a1: -30, col: '200,170,255' } };
    case 'swordSlash': return { id, label: 'Iai Slash', startup: 16, active: 12, recovery: 26, blockAdv: -20, /* (−18 measured: it cuts through) */ cpLaunch: true, launchVy: 13, wind: 'iaiStance', pose: 'iaiDash', sword: true, iai: true, slow: true, selfMove: true, noPush: true,
      hitbox: [-60,60,30,130], dmg: 80, stun: 20, bstun: 12, push: 0, slash: true, type: 'mid', hitstop: 12, gdrain: 20,
      poseFn(f, mf) {
        if (mf <= 16) return lerpPose(f.prevPose, POSES.iaiStance, Math.min(1, mf / 6));
        if (mf <= 24) return POSES.iaiDash;
        return mf <= 40 ? POSES.iaiEnd : lerpPose(POSES.iaiEnd, POSES.idle, Math.min(1, (mf - 40) / 10));
      },
      onFrame(f, o, mf) {
        if (mf === 16) { f.iaiX0 = f.x; f.iaiDir = Math.sign(o.x - f.x) || f.facing; sfx('slash'); }
        if (mf > 16 && mf <= 24) {
          f.vx = f.iaiDir * 32;
          const past = Math.sign(f.x - o.x) === f.iaiDir && Math.abs(f.x - o.x) > 70;
          parts.push({ type: 'streak', x: 0, x0: f.iaiX0, x1: f.x + f.vx, y: GROUND - 100 * f.ch.scale, life: 18, max: 18 });
          if (past || f.x <= WALL_L + 1 || f.x >= WALL_R - 1) { f.vx = 0; f.mf = 24; }
        } else if (mf > 24) f.vx = 0;
        if (mf === 45) sfx('sheath');
      } };
    case 'ambushBehind': return { id, label: 'Shadow Strike', startup: 14, active: 3, recovery: 14, blockAdv: -10, wind: 'crouch', pose: 'slash', blade: true, noGrace: true,
      hitbox: [10,82,60,130], dmg: 58, stun: 18, bstun: 12, push: 2, stunT: 44, stunKind: 'shadow', type: 'mid', hitstop: 8, gdrain: 8, // a slash from behind leaves them stunned (slow enough to see coming)
      trail: { cx: 15, cy: 105, r: 70, a0: 70, a1: -30, col: '200,170,255' },
      onStart(f, o) {
        let x = o.x - o.facing * 62;
        if (x < WALL_L + 5 || x > WALL_R - 5) x = o.x + o.facing * 62;
        if (Math.abs(x - f.x) > W * 0.3) x = f.x + (Math.sign(x - f.x) || f.facing) * W * 0.3; // (he reappears 3/10 of the screen away at most: from further off he falls short)
        f.x = clamp(x, WALL_L, WALL_R); f.facing = Math.sign(o.x - f.x) || f.facing; puff(f.x, 50); sfx('vanish');
      } };
    case 'ambushLeap': return { id, label: 'Shadow Leap', startup: 42, active: 22, recovery: 20, blockAdv: -14, /* (out a long time on the way down: hit him in the air) */ wind: 'jump', pose: 'stomp', manualY: true, noPush: true, selfMove: true, walkAway: true,
      hitbox: [-36,36,-10,58], dmg: 80, stun: 20, bstun: 16, push: 4, launch: true, launchVy: 10, bounce: true, type: 'mid', hitstop: 11, gdrain: 24, // (crashes onto a guard: a big piece of the guard meter)
      poseFn(f, mf) { return mf <= 42 ? POSES.jump : null; },
      onStart(f, o) { f.leap = { x0: f.x, tx: clamp(o.x, WALL_L, WALL_R) }; f.facing = Math.sign(o.x - f.x) || f.facing; puff(f.x, 30); sfx('rise'); },
      onFrame(f, o, mf) {
        // up to above where the opponent stood, hang, then crash down about a second after the leap
        const L = f.leap; f.vx = 0;
        if (mf <= 26) { const e = mf / 26; f.x = lerp(L.x0, L.tx, e); f.y = 230 * Math.sin(e * Math.PI / 2); }
        else if (mf <= 42) { f.x = L.tx; f.y = 230 + Math.sin((mf - 26) * 0.4) * 4; }
        else if (mf <= 54) f.y = Math.max(0, 230 * (1 - (mf - 42) / 12));
        if (mf === 54) {
          f.y = 0; dustAt(f.x, true); game.shake = Math.max(game.shake, 5); sfx('land');
          parts.push({ type: 'ering', x: f.x, y: GROUND, r: 10, vr: 7, life: 16, max: 16, col: '190,150,255' });
        }
      } };
    case 'ambushSlide': return { id, label: 'Shadow Slide', startup: 4, active: 22, recovery: 14, blockAdv: -18, hitAdv: 4, cpLaunch: true, /* (a hit leaves him ahead; a counter or a punish pops them up) */ wind: 'crouch', pose: 'slideKick', selfMove: true, noPush: true,
      hitbox: [0,64,0,34], dmg: 50, stun: 30, bstun: 10, push: 0, launchVy: 10, low: true, type: 'mid', hitstop: 6, gdrain: 6,
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; f.slideDir = f.facing; puff(f.x, 20); },
      onFrame(f, o, mf) {
        if (mf > 4 && mf <= 26) {
          if (f.hitConnected && f.lastResult === 'block') { f.vx = 0; return; } // (guarded: he stops where he is — the frames left are his opening: blockAdv)
          f.vx = f.slideDir * 9;
          // after a hit, keep sliding until he is past the opponent
          if (f.hitConnected && Math.sign(f.x - o.x) === f.slideDir && Math.abs(f.x - o.x) > 60) { f.vx = 0; f.mf = 26; }
          if (mf % 2 === 0) dustAt(f.x, false);
        } else f.vx *= 0.7;
      } };
    case 'ambushKick': return { id, label: 'Shadow Roundhouse', startup: 20, active: 5, recovery: 18, blockAdv: -16, wind: 'spinW', pose: 'roundhouse', spin: [5, 20], slow: true,
      poseFn: spinKickPose(20),
      hitbox: [10,98,40,118], dmg: 110, stun: 20, bstun: 14, push: 7, kd: true, kdVx: 22, kdVy: 12, type: 'mid', hitstop: 14, gdrain: 18, // (a heavier blow: more damage, sends them further)
      trail: { cx: 0, cy: 70, r: 86, a0: -60, a1: 40, col: '190,150,255' },
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; puff(f.x, 40); },
      onFrame(f, o, mf) { if (mf === 5) { dustAt(f.x, false); sfx('swing'); } if (mf === 18) sfx('slash'); } };
    case 'teleKick': return { id, label: 'Sky Drop Kick', startup: 20, active: 14, recovery: 16, blockAdv: -21, wind: 'seal', pose: 'diveKick', manualY: true, noPush: true, selfMove: true,
      hitbox: [-10,52,-12,50], dmg: 58, stun: 24, bstun: 14, push: 2, launch: true, launchVy: 10, bounce: true, type: 'mid', hitstop: 9, gdrain: 10,
      follow: { from: 18, to: 48, at: 35, opts: { lk: 'teleSlide', hk: 'teleSpin' } },
      poseFn(f, mf) { return mf > 6 && mf <= 20 ? POSES.jump : null; },
      onStart(f) { f.invul = 6; },
      onFrame(f, o, mf) {
        f.vx = 0;
        if (mf === 6) { f.hidden = true; f.invul = 10; puff(f.x, 60); sfx('vanish'); }
        if (mf === 14) {
          // reappear above the opponent, then drop through them and land behind
          const side = Math.sign(o.x - f.x) || f.facing;
          f.tele = { x1: clamp(o.x - side * 30, WALL_L, WALL_R), x2: clamp(o.x + side * 55, WALL_L, WALL_R) };
          f.x = f.tele.x1; f.y = 175; f.facing = side; f.hidden = false; puff(f.x, f.y + 60);
        }
        if (mf > 14 && mf <= 20) f.y = 175 + Math.sin((mf - 14) * 0.5) * 3; // brief hang so the opponent can react
        if (mf > 20 && mf <= 34) { const e = (mf - 20) / 14; f.x = lerp(f.tele.x1, f.tele.x2, e); f.y = 175 * (1 - e); }
        if (mf === 34) { f.y = 0; dustAt(f.x, false); }
      } };
    case 'teleSlide': return { id, label: 'Drop Slide', startup: 3, active: 16, recovery: 14, blockAdv: -16, wind: 'crouch', pose: 'slideKick', selfMove: true,
      hitbox: [0,64,0,34], dmg: 48, stun: 18, bstun: 10, push: 2, kd: true, kdVx: 1.5, kdVy: 4, low: true, type: 'mid', hitstop: 7, gdrain: 6,
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; },
      onFrame(f, o, mf) {
        if (mf > 3 && mf <= 19 && !f.hitConnected && Math.abs(o.x - f.x) > 50) { f.vx = f.facing * 8; if (mf % 2 === 0) dustAt(f.x, false); }
        else f.vx *= 0.6;
      } };
    case 'teleSpin': return { id, label: 'Turnaround Kick', startup: 14, active: 4, recovery: 18, blockAdv: -16, wind: 'spinW', pose: 'roundhouse', spin: [5, 14], slow: true,
      poseFn: spinKickPose(14),
      hitbox: [10,98,40,118], dmg: 85, stun: 20, bstun: 14, push: 5, kd: true, kdVx: 15, kdVy: 10, type: 'mid', hitstop: 11, gdrain: 14,
      trail: { cx: 0, cy: 70, r: 86, a0: -60, a1: 40, col: '190,150,255' },
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; sfx('slash'); } };
    case 'flame': return { id, label: 'Fire Breath', startup: 24, active: 32, recovery: 16, /* (a shorter stream: 32 + 3 active) */ blockAdv: -14, hitAdv: 10, wind: 'seal', pose: 'breath', proj: 'flame', limit: 1, slow: true, interruptChance: 0.4,
      poseFn(f, mf) { return mf <= 24 ? handSign(mf) : null; },
      onFrame(f, o, mf) { if (mf <= 24 && mf % 2 === 0) ember(f); if (mf === 25) spawnFlame(f); } };
    case 'fireballs': return { id, label: 'Lightning Volley', startup: 34, active: 15, recovery: 1, noGuardLag: true, fixedFrames: true, /* (he's free once the last ball flies, frame 48: a projectile — no frameMod recovery added) */ wind: 'seal', pose: 'throw', proj: 'homing', limit: 1, slow: true, interruptChance: 0.4,
      poseFn(f, mf) { return mf <= 34 ? handSign(mf) : null; },
      onFrame(f, o, mf) {
        if (mf === 8 || mf === 16 || mf === 24) spawnOrb(f, (mf - 8) / 8);       // three lightning balls crackle into being overhead during the hand signs
        if (mf === 36 || mf === 42 || mf === 48) launchOrb(f, (mf - 36) / 6);    // then fly at the opponent one after another
        if (mf <= 34 && mf % 2 === 0) crackle(f);
      } };
    case 'vanishDrop': return { id, label: 'Vanish Drop Kick', startup: 36, active: 22, recovery: 15, blockAdv: -16, /* (a longer fall: out longer in the air, where it can be punished) */ wind: 'crouch', pose: 'axe', manualY: true,
      trail: { cx: 5, cy: 62, r: 72, a0: 110, a1: -20, col: '190,150,255' }, noPush: true, selfMove: true,
      hitbox: [-40,40,-20,60], dmg: 60, stun: 20, bstun: 14, push: 4, launch: true, launchVy: 10, bounce: true, type: 'mid', hitstop: 10, gdrain: 12,
      poseFn(f, mf) { return mf <= 20 ? POSES.crouch : mf <= 36 ? POSES.axeW : null; },
      onFrame(f, o, mf) {
        if (mf <= 20) { shadowRetreat(f, mf); return; }
        if (mf === 21) {
          const side = Math.sign(o.x - f.x) || f.facing;
          f.shadow = false; f.vx = 0; f.facing = side; f.invul = 2; puff(f.x, 30);
          const want = o.x + side * 65; // over the opponent, but never more than about a third of the stage
          f.leap = { x0: f.x, tx: clamp(f.x + side * Math.min(Math.abs(want - f.x), 230), WALL_L, WALL_R) };
        }
        // a high arc (well above projectiles and beams) that passes over the opponent's head and lands behind them
        if (mf > 21 && mf <= 57) { const e = (mf - 21) / 36; f.vx = 0; f.x = lerp(f.leap.x0, f.leap.tx, e); f.y = 215 * Math.sin(Math.PI * e); }
        if (mf === 57) { f.y = 0; dustAt(f.x, true); game.shake = Math.max(game.shake, 3); sfx('land'); }
      } };
    case 'vanishSlide': return { id, label: 'Vanish Slide', startup: 20, active: 42, recovery: 8, blockAdv: -16, cpLaunch: true, wind: 'crouch', pose: 'slideKick', selfMove: true, noPush: true,
      hitbox: [0,64,0,34], dmg: 52, stun: 30, bstun: 10, push: 0, kd: true, kdVx: 4, kdVy: 6, launchVy: 13, low: true, type: 'mid', hitstop: 6, gdrain: 6, // (knocks down; a counter or a punish launches: cpLaunch)
      poseFn(f, mf) { return mf <= 20 ? POSES.crouch : null; },
      onFrame(f, o, mf) {
        if (mf <= 20) { shadowRetreat(f, mf); return; }
        if (mf === 21) { f.shadow = false; f.slideDir = Math.sign(o.x - f.x) || f.facing; f.facing = f.slideDir; puff(f.x, 20); }
        if (mf <= 56) {
          if (f.hitConnected && f.lastResult === 'block') { f.vx = 0; return; } // (guarded: he stops where he is — the frames left are his opening: blockAdv)
          if (f.hitConnected && f.lastResult === 'hit') { f.vx = 0; f.mf = Math.max(f.mf, f.move.startup + f.move.active); hitRecover(f, 4); return; } // (a hit: he stops right there and recovers at once — after a counter launch he's free to juggle)
          f.vx = f.slideDir * 10;
          if (Math.sign(f.x - o.x) === f.slideDir && Math.abs(f.x - o.x) > (f.lastResult === 'hit' ? 40 : 85)) { f.vx = 0; f.mf = 56; } // past the opponent (stop sooner on a hit so you can juggle)
          if (mf % 2 === 0) dustAt(f.x, false);
        } else f.vx *= 0.7;
      } };
    // juggle versions of Kuro's techniques (used automatically while the opponent is launched)
    case 'jFire': return { id, label: 'Fire Spout', startup: 5, active: 16, recovery: 16, wind: 'seal', pose: 'palmUp', fireCol: true,
      hitbox: [20,95,20,230], multi: 4, interval: 4, dmg: 14, lastDmg: 32, jugVy: 6.5, lastJugVy: 10.5, fixedLift: true, neutralLaunch: true, launchVy: 11, type: 'mid', hitstop: 4, chip: true, gdrain: 4, // carries them up for an air combo
      onFrame(f, o, mf) { if (mf === 5) sfx('flame'); if (mf > 5 && mf <= 21) ember(f); } };
    case 'jRain': return { id, label: 'Lightning Rain', startup: 8, active: 14, recovery: 12, wind: 'seal', pose: 'seal',
      poseFn(f, mf) { return mf <= 8 ? handSign(mf) : null; },
      onFrame(f, o, mf) { if (mf === 8 || mf === 13 || mf === 18) spawnRain(f, o, (mf - 8) / 5); if (mf <= 8 && mf % 2 === 0) crackle(f); } };
    case 'jClone': return { id, label: 'Clone Relay', startup: 6, active: 2, recovery: 12, wind: 'seal', pose: 'seal',
      onFrame(f, o, mf) { if (mf === 6) spawnRelay(f, o); } };
    case 'jIai': return { id, label: 'Air Iai', startup: 6, active: 10, recovery: 16, wind: 'iaiStance', pose: 'iaiDash', sword: true, manualY: true, noPush: true, selfMove: true, ghost: true,
      hitbox: [-60,60,10,140], dmg: 60, stun: 20, bstun: 12, push: 0, kd: true, kdVx: 5, kdVy: 5, slashMark: true, type: 'mid', hitstop: 12, gdrain: 14,
      onFrame(f, o, mf) {
        f.vx = 0;
        if (mf === 6) { const side = Math.sign(o.x - f.x) || f.facing; f.ia = { x0: f.x, x1: clamp(f.x + side * Math.min(Math.abs(o.x - f.x) + 90, 300), WALL_L, WALL_R), peak: clamp(o.y + 30, 50, 200), px: f.x, py: f.y }; sfx('slash'); }
        if (mf > 6 && mf <= 16) { // slash up through them and come down on the far side
          const e = (mf - 6) / 10; f.x = lerp(f.ia.x0, f.ia.x1, e); f.y = f.ia.peak * Math.sin(Math.PI * e);
          parts.push({ type: 'streak', x: 0, x0: f.ia.px, x1: f.x, y0: GROUND - f.ia.py - 90, y1: GROUND - f.y - 90, life: 18, max: 18 });
          f.ia.px = f.x; f.ia.py = f.y;
        }
        if (mf === 16) { f.y = 0; dustAt(f.x, false); }
        if (mf === 28) sfx('sheath');
      } };
    case 'jVanishHeel': return { id, label: 'Vanish Heel', startup: 12, active: 10, recovery: 14, wind: 'seal', pose: 'axe', manualY: true, noPush: true, selfMove: true,
      hitbox: [-35,35,-30,60], dmg: 50, stun: 20, bstun: 14, push: 2, kd: true, kdVx: 1, kdVy: -8, type: 'mid', hitstop: 12, gdrain: 10,
      trail: { cx: 5, cy: 62, r: 72, a0: 110, a1: -20, col: '190,150,255' },
      poseFn(f, mf) { return mf <= 12 ? POSES.axeW : null; },
      onFrame(f, o, mf) {
        f.vx = 0;
        if (mf === 2) { f.hidden = true; f.invul = 12; puff(f.x, 60); sfx('vanish'); }
        if (mf === 10) { f.hidden = false; f.x = clamp(f.x + clamp(o.x - f.facing * 10 - f.x, -260, 260), WALL_L, WALL_R); f.vh = o.y + 95; f.y = f.vh; puff(f.x, f.y + 60); }
        if (mf > 10 && mf <= 22) f.y = Math.max(0, f.vh * (1 - (mf - 10) / 12)); // drop the heel on them, spiking them into the floor
        if (mf === 22) { f.y = 0; dustAt(f.x, true); game.shake = Math.max(game.shake, 5); }
      } };
    // ----- Mei -----
    case 'extendStaff': return { id, label: 'Extending Staff', startup: 11, active: 6, recovery: 18, wind: 'thrustW', pose: 'thrust', staffExt: 170, speedFx: true, spinWind: true,
      hitbox: [30,320,82,122], dmg: 62, stun: 20, bstun: 12, push: 7, type: 'mid', hitstop: 9, gdrain: 10,
      onFrame(f, o, mf) { if (mf === 11) { sfx('slash'); parts.push({ type: 'streak', x: 0, x0: f.x + f.facing * 60, x1: f.x + f.facing * 320, y: GROUND - f.y - 100 * f.ch.scale, life: 10, max: 10 }); } } };
    case 'vaultSmash': return { id, label: 'Pole Vault Smash', startup: 22, active: 10, recovery: 16, wind: 'vault', pose: 'staffSlamAir', manualY: true, noPush: true, selfMove: true, spinWind: true,
      hitbox: [-10,230,-20,130], dmg: 62, stun: 20, bstun: 14, push: 3, launch: true, launchVy: 10, bounce: true, type: 'mid', hitstop: 11, gdrain: 12,
      trail: { cx: 20, cy: 90, r: 120, a0: 110, a1: -30, col: '255,205,110' },
      onStart(f, o) {
        const side = Math.sign(o.x - f.x) || f.facing; f.facing = side;
        f.leap = { x0: f.x, tx: clamp(f.x + side * Math.min(Math.max(0, Math.abs(o.x - f.x) - 130), 210), WALL_L, WALL_R) }; sfx('rise'); // (lands well short of them: the staff reaches the rest)
      },
      onFrame(f, o, mf) { // plants the staff, vaults over the gap and slams it down
        if (f.hitConnected && f.hookFor !== f.serial && o.juggle) { f.hookFor = f.serial; o.vx = Math.sign(f.x - o.x) * clamp((Math.abs(o.x - f.x) - 70) / 30, 0, 4); } // (the staff hooks them back in: she landed short of them)
        f.vx = 0;
        if (mf <= 32) { const e = mf / 32; f.x = lerp(f.leap.x0, f.leap.tx, e); f.y = 175 * Math.sin(Math.PI * e); }
        if (mf === 32) { f.y = 0; dustAt(f.x + f.facing * 60, true); parts.push({ type: 'ering', x: f.x + f.facing * 70, y: GROUND, r: 8, vr: 7, life: 14, max: 14, col: '255,205,110' }); game.shake = Math.max(game.shake, 5); sfx('land'); }
      } };
    case 'sweepStaff': return { id, label: 'Sweeping Staff', startup: 9, active: 14, recovery: 16, wind: 'crouch', pose: 'staffSweep', selfMove: true, speedFx: true, spinStaff: true,
      hitbox: [0,230,0,44], low: true, dmg: 46, stun: 20, bstun: 14, push: 2, launch: true, launchVy: 11, type: 'mid', hitstop: 8, gdrain: 8, // (a long sweep: she slides in less)
      rushTag: true, rushOpen: true, follow: { from: 8, to: 30, at: 22, opts: { lp: 'srPoke', hp: 'srVault', lk: 'srSweep2', hk: 'srSlam' } },
      trail: { cx: 40, cy: 18, r: 90, a0: -70, a1: 40, col: '255,205,110' },
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; },
      onFrame(f, o, mf) {
        if (mf > 6 && mf <= 22 && !f.hitConnected && Math.abs(o.x - f.x) > 170) { f.vx = f.facing * 5; if (mf % 2 === 0) dustAt(f.x, false); } else f.vx *= 0.6;
        if (f.hitConnected && f.hookFor !== f.serial && o.juggle) { f.hookFor = f.serial; o.vx = Math.sign(f.x - o.x) * clamp((Math.abs(o.x - f.x) - 70) / 30, 0, 4); } // the staff hooks them in toward him
      } };
    // Monkey Staff Rush: → → + K opens a string that keeps going whether it hits or is guarded; each part leads to others
    case 'poleKick': return { id, label: 'Pole Spin Kick', startup: 10, active: 12, recovery: 18, wind: 'thrustW', pose: 'poleKick', spin: [10, 22], selfMove: true, spinStaff: true,
      hitbox: [10,180,40,160], multi: 2, interval: 6, dmg: 26, lastDmg: 32, stun: 22, bstun: 14, push: 2, lastPush: 3, type: 'mid', hitstop: 8, gdrain: 10,
      trail: { cx: 0, cy: 80, r: 100, a0: -60, a1: 60, col: '255,205,110' },
      rushTag: true, rushOpen: true, follow: { from: 8, to: 30, at: 23, opts: { lp: 'mrThrust', hp: 'mrCrash', lk: 'mrSweep', hk: 'mrFinish' } },
      onFrame(f, o, mf) { if (mf > 6 && mf <= 16 && Math.abs(o.x - f.x) > 150) f.vx = f.facing * 2; else f.vx *= 0.7; if (mf === 10) sfx('swing'); } }; // (barely steps in: the staff reaches)
    case 'srPoke': return { id, label: 'Dance: Rising Poke', rushTag: true, startup: 5, active: 4, recovery: 16, wind: 'staffLowW', pose: 'staffRise', staffExt: 40, selfMove: true,
      hitbox: [10,195,40,235], dmg: 26, stun: 22, bstun: 14, push: 2, jugVy: 7, type: 'mid', hitstop: 7, gdrain: 12,
      trail: { cx: 20, cy: 90, r: 120, a0: -40, a1: 100, col: '255,205,110' },
      follow: { from: 5, to: 22, at: 13, opts: { hp: 'srVault', lk: 'srSweep2', hk: 'srSlam' } },
      onFrame(f, o, mf) { if (mf <= 6 && Math.abs(o.x - f.x) > 90) f.vx = f.facing * 5; else f.vx *= 0.6; } };
    case 'srSweep2': return { id, label: 'Dance: Second Sweep', rushTag: true, guardGap: 14, startup: 6, active: 6, recovery: 16, wind: 'crouch', pose: 'staffSweep', spinStaff: true, selfMove: true,
      hitbox: [0,190,0,44], low: true, dmg: 26, stun: 22, bstun: 14, push: 2, type: 'mid', hitstop: 7, gdrain: 14,
      trail: { cx: 40, cy: 18, r: 100, a0: -70, a1: 40, col: '255,205,110' },
      follow: { from: 6, to: 22, at: 14, opts: { lp: 'srPoke', hp: 'srVault', hk: 'srSlam' } },
      onFrame(f, o, mf) { if (mf <= 8 && Math.abs(o.x - f.x) > 90) { f.vx = f.facing * 6; dustAt(f.x, false); } else f.vx *= 0.6; } };
    case 'srVault': return { id, label: 'Dance: Vault Strike', rushTag: true, startup: 12, active: 5, recovery: 16, wind: 'vault', pose: 'staffSwing', manualY: true, noPush: true, selfMove: true, spinWind: true,
      hitbox: [0,175,30,160], dmg: 30, stun: 22, bstun: 14, push: 2, type: 'mid', hitstop: 8, gdrain: 16,
      trail: { cx: 20, cy: 100, r: 130, a0: 120, a1: -20, col: '255,205,110' },
      follow: { from: 10, to: 28, at: 20, opts: { lp: 'srPoke', lk: 'srSweep2', hk: 'srSlam' } },
      onStart(f, o) { const side = Math.sign(o.x - f.x) || f.facing; f.vt = { x0: f.x, tx: clamp(o.x + side * 75, WALL_L, WALL_R) }; sfx('rise'); },
      onFrame(f, o, mf) { // vaults over them on the staff and strikes from the other side
        f.vx = 0;
        if (mf <= 12) { const e = mf / 12; f.x = lerp(f.vt.x0, f.vt.tx, e); f.y = 95 * Math.sin(Math.PI * e); }
        if (mf === 12) { f.y = 0; f.facing = Math.sign(o.x - f.x) || f.facing; dustAt(f.x, false); }
      } };
    case 'srSlam': return { id, label: 'Dance: Pole Slam', rushTag: true, startup: 10, active: 6, recovery: 20, wind: 'slamW', pose: 'staffSlam', spinWind: true, selfMove: true,
      hitbox: [10,205,0,165], dmg: 48, stun: 20, bstun: 18, push: 4, kd: true, kdVx: 8, kdVy: 10, type: 'mid', hitstop: 12, gdrain: 28,
      trail: { cx: 20, cy: 90, r: 130, a0: 100, a1: -15, col: '255,205,110' },
      onFrame(f, o, mf) {
        if (mf <= 8 && Math.abs(o.x - f.x) > 90) f.vx = f.facing * 4; else f.vx *= 0.6;
        if (mf === 11) { cracks(f.x + f.facing * 130); dustAt(f.x + f.facing * 130, true); parts.push({ type: 'ering', x: f.x + f.facing * 130, y: GROUND, r: 10, vr: 9, life: 16, max: 16, col: '255,205,110' }); game.shake = Math.max(game.shake, 6); sfx('land'); }
      } };
    case 'mrThrust': return { id, label: 'Rush: Staff Thrust', startup: 6, active: 4, recovery: 16, wind: 'thrustW', pose: 'thrust', staffExt: 90, selfMove: true, speedFx: true, spinWind: true,
      hitbox: [20,235,80,125], dmg: 32, stun: 22, bstun: 14, push: 4, type: 'mid', hitstop: 7, gdrain: 14,
      rushTag: true, follow: { from: 6, to: 22, at: 14, opts: { hp: 'mrCrash', lk: 'mrSweep', hk: 'mrFinish' } },
      onFrame(f, o, mf) { if (mf <= 8 && Math.abs(o.x - f.x) > 90) f.vx = f.facing * 6; else f.vx *= 0.6; if (mf === 6) sfx('slash'); } };
    // the J sweep combos on a hit, but after a guarded part it winds up slowly (guardGap): the opponent can hit Mei before it comes out
    case 'mrSweep': return { id, label: 'Rush: Low Sweep', guardGap: 14, startup: 6, active: 6, recovery: 16, wind: 'crouch', pose: 'staffSweep', selfMove: true, spinStaff: true,
      hitbox: [0,190,0,44], low: true, dmg: 30, stun: 22, bstun: 14, push: 2, type: 'mid', hitstop: 7, gdrain: 14,
      trail: { cx: 40, cy: 18, r: 100, a0: -70, a1: 40, col: '255,205,110' },
      rushTag: true, follow: { from: 6, to: 22, at: 14, opts: { lp: 'mrThrust', hp: 'mrCrash', hk: 'mrFinish' } },
      onFrame(f, o, mf) { if (mf <= 8 && Math.abs(o.x - f.x) > 90) { f.vx = f.facing * 6; dustAt(f.x, false); } else f.vx *= 0.6; } };
    case 'mrCrash': return { id, label: 'Rush: Overhead Crash', startup: 12, active: 6, recovery: 18, wind: 'slamWAir', pose: 'staffSlamAir', manualY: true, noPush: true, selfMove: true, spinWind: true,
      hitbox: [0,185,0,170], dmg: 44, stun: 20, bstun: 16, push: 3, launch: true, launchVy: 10, bounce: true, type: 'mid', hitstop: 11, gdrain: 22,
      trail: { cx: 20, cy: 90, r: 130, a0: 110, a1: -30, col: '255,205,110' },
      rushTag: true, follow: { from: 10, to: 30, at: 22, notOnHit: true, opts: { hk: 'mrFinish', lp: 'mrThrust', lk: 'mrSweep' } },
      onFrame(f, o, mf) { // a short hop, then the staff crashes down
        f.vx = Math.abs(o.x - f.x) > 80 && mf <= 12 ? f.facing * 4 : 0;
        f.y = mf <= 18 ? 70 * Math.sin(Math.PI * mf / 18) : 0;
        if (mf === 18) { dustAt(f.x + f.facing * 90, true); parts.push({ type: 'ering', x: f.x + f.facing * 110, y: GROUND, r: 8, vr: 7, life: 14, max: 14, col: '255,205,110' }); game.shake = Math.max(game.shake, 4); sfx('land'); }
      } };
    case 'mrFinish': return { id, label: 'Rush: Spinning Finish', startup: 8, active: 10, recovery: 20, wind: 'staffSwingW', pose: 'staffWhirl', spin: [8, 18], spinStaff: true, selfMove: true,
      hitbox: [-120,205,20,180], multi: 2, interval: 5, dmg: 24, lastDmg: 46, stun: 20, bstun: 18, push: 2, lastPush: 10, kd: true, kdVx: 14, kdVy: 9, type: 'mid', hitstop: 10, gdrain: 26,
      trail: { cx: 0, cy: 95, r: 150, a0: -170, a1: 170, col: '255,205,110' },
      onFrame(f, o, mf) { if (mf <= 8 && Math.abs(o.x - f.x) > 80) f.vx = f.facing * 4; else f.vx *= 0.7; if (mf === 8) sfx('swing'); } };
    case 'windmill': return { id, label: 'Staff Windmill', startup: 8, active: 24, recovery: 14, wind: 'thrustW', pose: 'staffJab', spinStaff: true, destroysProj: true,
      hitbox: [10,245,30,185], multi: 4, interval: 6, dmg: 14, lastDmg: 30, /* (a wide windmill: long reach) */ stun: 16, bstun: 10, push: 1.5, lastPush: 7, kd: true, kdVx: 8, kdVy: 7, type: 'mid', hitstop: 4, chip: true, gdrain: 6,
      onFrame(f, o, mf) { if (mf % 6 === 0 && mf > 6 && mf <= 32) sfx('swing'); } };
    case 'cloudLeap': return { id, label: 'Cloud Somersault', startup: 30, active: 14, recovery: 14, wind: 'cloudSit', pose: 'airStaffDown', manualY: true, noPush: true, selfMove: true, cloud: [6, 30], spinWind: true,
      hitbox: [0,150,-20,120], dmg: 72, stun: 20, bstun: 14, push: 4, kd: true, kdVx: 6, kdVy: 8, type: 'mid', hitstop: 11, gdrain: 14,
      trail: { cx: 20, cy: 80, r: 110, a0: 120, a1: -40, col: '255,205,110' },
      onStart(f, o) { f.cl = { x0: f.x, tx: clamp(f.x + (Math.sign(o.x - f.x) || f.facing) * Math.min(130, Math.abs(o.x - f.x) * 0.5), WALL_L, WALL_R) }; f.flipT = 18; f.flipMax = 18; sfx('rise'); cloudPuff(f.x, GROUND); },
      onFrame(f, o, mf) { // up onto a cloud, a moment's pause, then a staff dive at where they are
        f.vx = 0;
        if (mf <= 16) { const e = mf / 16; f.x = lerp(f.cl.x0, f.cl.tx, e); f.y = 220 * Math.sin(e * Math.PI / 2); }
        else if (mf <= 30) { f.y = 220 + Math.sin(mf * 0.4) * 3; if (mf % 4 === 0) cloudPuff(f.x, GROUND - f.y + 8); if (mf === 30) { f.facing = Math.sign(o.x - f.x) || f.facing; f.dive = { x0: f.x, tx: clamp(f.x + f.facing * Math.min(180, Math.max(0, f.facing * (o.x - f.x) - 30)), WALL_L, WALL_R) }; sfx('slash'); } }
        else if (mf <= 44) { const e = (mf - 30) / 14; f.x = lerp(f.dive.x0, f.dive.tx, e); f.y = Math.max(0, 220 * (1 - e)); }
        if (mf === 44) { f.y = 0; dustAt(f.x, true); game.shake = Math.max(game.shake, 4); }
      } };
    case 'somersault': return { id, label: 'Somersault Kick', startup: 4, active: 10, recovery: 99, untilLand: true, landT: 6, wind: 'crouch', pose: 'flipKick',
      hitbox: [-10,90,40,190], dmg: 70, stun: 20, bstun: 16, push: 3, launch: true, launchVy: 13, type: 'mid', hitstop: 10, gdrain: 8,
      trail: { cx: 0, cy: 90, r: 90, a0: -80, a1: 120, col: '255,205,110' },
      onStart(f) { f.invul = 6; },
      onFrame(f, o, mf) { if (mf === 4) { f.vy = 11; f.y = 0.5; f.vx = f.facing * 0.6; f.flipT = 22; f.flipMax = 22; sfx('rise'); } } };
    case 'feint': return { id, label: 'Monkey Feint', startup: 22, active: 6, recovery: 16, wind: 'crouch', pose: 'thrust', staffExt: 60, selfMove: true, speedFx: true,
      hitbox: [20,220,70,125], dmg: 52, stun: 20, bstun: 12, push: 6, type: 'mid', hitstop: 9, gdrain: 10,
      poseFn(f, mf) { return mf <= 12 ? POSES.tuck : null; },
      onFrame(f, o, mf) { // hop back out of reach, then spring straight back in with a thrust
        if (mf === 1) { f.flipT = 12; f.flipMax = 12; }
        if (mf <= 12) { f.vx = -f.facing * 6; f.invul = Math.max(f.invul, 2); }
        else if (mf <= 24) { f.vx = Math.abs(o.x - f.x) > 110 ? f.facing * 11 : f.vx * 0.5; }
        else f.vx *= 0.6;
      } };
    // ---------- Aldric, the paladin: parry, heal, charge, protect ----------
    // → → + U: Rampart Charge. Hold U: he lowers the shield and builds into a raging charge (front attacks and projectiles bounce off);
    // let go, or crash into them, for the Rampart Slam that sends them flying
    case 'plRampart': return { id, label: 'Rampart Charge', startup: 999, active: 6, recovery: 22, wind: 'pBashW', pose: 'pBash', selfMove: true, held: true, rage: true, // (armor: hits hurt him but don't stop the charge)
      hitbox: [10,130,20,175], dmg: 80, fullDmg: true, stun: 26, bstun: 18, push: 4, bpush: 10, kd: true, kdVx: 6, kdVy: 9, type: 'mid', hitstop: 14, gdrain: 30,
      poseFn: (f, mf) => (!f.move.fired && mf > 10) ? POSES.pDash : null,
      onFrame(f, o, mf) {
        const mv = f.move;
        if (!mv.fired) {
          if (mf <= 10) { f.vx = 0; if (mf === 2) sfx('charge'); return; } // digs in and lowers the shield
          f.vx = f.facing * Math.min(8, (mf - 10) * 0.55); mv.speedFx = f.vx * f.facing > 5;
          if (mf % 5 === 0) { dustAt(f.x, false); sfx('land'); parts.push({ type: 'spark', x: f.x + f.facing * 40, y: GROUND - 120 + rnd(-20, 20), vx: -f.facing * rnd(2, 5), vy: rnd(-2, 2), life: 10, max: 10, col: '255,170,120' }); }
          if (mv.x0 == null) mv.x0 = f.x; const run = Math.abs(f.x - mv.x0); // (a quarter to half of the stage)
          if ((!holding(f) && mf > 14 && run >= W / 4 - 18) || run >= W / 2 - 18 || mf >= 140 || Math.abs(o.x - f.x) < 80) { mv.fired = true; mv.startup = mf + 3; mv.label = 'Rampart Slam'; }
          return;
        }
        if (mf === mv.startup) { sfx('hitH'); game.shake = Math.max(game.shake, 5); }
        f.vx *= 0.5; hitRecover(f, 12);
      } };
    // → → + I: Judgement Thrust. A slow, deliberate wind-up, then a lunging thrust across a third of the stage that lifts them
    case 'plJudgeThrust': return { id, label: 'Judgement Thrust', startup: 18, active: 6, recovery: 26, wind: 'pThrustW', pose: 'pThrust', wrist: 0, selfMove: true, speedFx: true, staffExt: 30,
      hitbox: [20,215,80,140], dmg: 58, stun: 26, bstun: 16, push: 2, launch: true, launchVy: 11.5, type: 'mid', hitstop: 12, gdrain: 18,
      onFrame(f, o, mf) {
        if (mf === 4) sfx('draw');
        if (mf > 10 && mf <= 20 && Math.abs(o.x - f.x) > 110) f.vx = f.facing * 13; else f.vx *= 0.6;
        hitRecover(f, 8);
        if (mf === 19) { sfx('slash'); parts.push({ type: 'slashx', x: f.x + f.facing * 180, y: GROUND - 110, r: 30, life: 10, max: 10, col: '190,225,255', rot: Math.PI / 4 }); }
      } };
    // → → + J: Windmill. The greatsword whirls like a millstone in front of him; hold J to keep it turning as he grinds forward,
    // let go for the Windmill Crash that bounces them up
    case 'plWindmill': return { id, label: 'Windmill', startup: 14, active: 999, recovery: 10, wind: 'pSlashW', pose: 'pThrust', spinStaff: true, held: true, selfMove: true,
      hitbox: [20,195,20,195], multi: 12, interval: 7, dmg: 9, stun: 20, bstun: 10, push: 0.6, type: 'mid', hitstop: 3, chip: true, gdrain: 5,
      onFrame(f, o, mf) {
        f.vx = mf > 14 && Math.abs(o.x - f.x) > 85 ? f.facing * 1.6 : 0;
        if (mf % 7 === 0 && mf > 10) sfx('swing');
        if (mf > 15 && (!holding(f) || mf >= 76)) startMove(f, specialMove('plWindmillEnd'), 1, true);
      } };
    case 'plWindmillEnd': return { id, label: 'Windmill Crash', startup: 7, active: 5, recovery: 26, wind: 'pCleaveW', pose: 'pCleave', selfMove: true,
      hitbox: [10,195,0,205], dmg: 42, stun: 22, bstun: 16, push: 2, launch: true, launchVy: 10, bounce: true, type: 'mid', hitstop: 13, gdrain: 22,
      onFrame(f, o, mf) { f.vx *= 0.5; hitRecover(f, 8); if (mf === 8) { parts.push({ type: 'slashx', x: f.x + f.facing * 130, y: GROUND - 20, r: 40, life: 12, max: 12, col: '190,225,255', rot: Math.PI / 4 }); dustAt(f.x + f.facing * 130, true); game.shake = Math.max(game.shake, 6); sfx('hitH'); } } };
    // → → + K: Crusader Leap. A heavy, slow leap; he crashes down sword-first and the impact rolls out to both sides (it even hits them lying down)
    case 'plLeap': return { id, label: 'Crusader Leap', startup: 30, active: 5, recovery: 28, wind: 'pCleaveW', pose: 'pPlant', manualY: true, noPush: true, selfMove: true,
      hitbox: [-120,175,0,80], low: true, dmg: 70, fullDmg: true, stun: 24, bstun: 16, push: 3, launch: true, launchVy: 10, bounce: true, type: 'mid', hitstop: 13, gdrain: 24,
      onStart(f, o) { f.lp = { x0: f.x, tx: clamp(o.x - (Math.sign(o.x - f.x) || f.facing) * 30, WALL_L, WALL_R) }; sfx('rise'); },
      onFrame(f, o, mf) {
        f.vx = 0;
        if (mf <= 30) { const e = mf / 30; f.x = lerp(f.lp.x0, f.lp.tx, e); f.y = 150 * Math.sin(Math.PI * e); }
        if (mf === 30) { f.y = 0; for (const dx of [-90, -40, 40, 90]) parts.push({ type: 'ring', x: f.x + dx, y: GROUND - 10, r: 6, vr: 6, life: 14, max: 14, col: '190,225,255' });
          parts.push({ type: 'lbeam', x: f.x + f.facing * 30, w: 30, life: 10, max: 10 }); dustAt(f.x, true); cracks(f.x + f.facing * 30); game.shake = Math.max(game.shake, 9); sfx('hitH'); }
      } };
    // ← ← + U: Parry. A short, sharp guard with the shield; parry a front attack and he answers with a lightning Riposte that lifts them
    case 'plParryRise': return { id, label: 'Parry', startup: 3, active: 16, recovery: 24, wind: 'pCounter', pose: 'pCounter', parry: true, frontOnly: true, parryInto: 'plRiposte', fx: 'ward' };
    case 'plRiposte': return { id, label: 'Riposte', startup: 4, active: 5, recovery: 18, wind: 'pThrustW', pose: 'pThrust', wrist: 0, selfMove: true, speedFx: true, noGrace: true, staffExt: 30,
      hitbox: [20,210,70,150], dmg: 52, stun: 22, bstun: 12, push: 2, launch: true, launchVy: 12.5, type: 'mid', hitstop: 14, gdrain: 10,
      onFrame(f, o, mf) { if (mf <= 5 && Math.abs(o.x - f.x) > 70) f.vx = f.facing * 12; else f.vx *= 0.5; if (mf === 4) sfx('slash'); } };
    // ← ← + I: Shield Parry. Parry with the shield and bash them senseless (stunned)
    case 'plParryStun': return { id, label: 'Shield Parry', startup: 3, active: 16, recovery: 24, wind: 'pCounter', pose: 'pCounter', parry: true, frontOnly: true, parryInto: 'plShieldStun', fx: 'ward' };
    case 'plShieldStun': return { id, label: 'Stunning Bash', startup: 7, active: 5, recovery: 18, wind: 'pDash', pose: 'pBash', selfMove: true, speedFx: true, noGrace: true,
      hitbox: [10,125,40,170], dmg: 40, stun: 24, bstun: 12, push: 1, stunT: 72, stunKind: 'holy', type: 'mid', hitstop: 12, gdrain: 10,
      onFrame(f, o, mf) { if (mf <= 7 && Math.abs(o.x - f.x) > 60) f.vx = f.facing * 12; else f.vx *= 0.5; if (mf === 7) sfx('palm'); } };
    // ← ← + J: Aegis. Hold J: a dome of light closes around him and stops everything, from the front, from behind and from above.
    // It feeds on his guard meter (a little every moment, more for each hit); if the meter runs out, his guard breaks
    case 'plAegis': return { id, label: 'Aegis', startup: 14, active: 999, recovery: 14, wind: 'pCounter', pose: 'pCounter', aegis: true, held: true, selfMove: true,
      onFrame(f, o, mf) {
        const mv = f.move;
        if (mf === 3) sfx('charge'); if (mf === 14) sfx('orb');
        if (mf < 14 && mf % 3 === 0) parts.push({ type: 'ring', x: f.x, y: GROUND - f.y - 100, r: 70 - mf * 4, vr: -1, life: 6, max: 6, col: '190,225,255' }); // casting: the light gathers (hit him now: counter)
        if (mv.ended) { f.vx *= 0.5; return; }
        mv.aegisOn = mf >= 14;
        f.vx = mv.aegisOn ? (f.inp ? f.inp.h : 0) * f.ch.walk * 0.6 : 0; // he can walk while he holds it
        if (mv.aegisOn) f.guard = Math.max(0, f.guard - 0.16); // (the light feeds on his guard meter: about ten a second)
        if (mf > 16 && (!holding(f) || mf >= 254 || f.guard <= 0)) { mv.ended = true; mv.aegisOn = false; mv.active = Math.max(1, mf - mv.startup); aegisSpent(f); } // (four seconds at most)
      } };
    // ← ← + K: Lay on Hands. Hold K: he kneels and prays, turning MP into health. Hit him while he prays and it's a counter hit
    case 'plPray': return { id, label: 'Lay on Hands', startup: 10, active: 999, recovery: 18, wind: 'chargeP', pose: 'chargeP', held: true, heal: true,
      onFrame(f, o, mf) {
        const mv = f.move; f.vx = 0;
        if (mv.ended || mf <= 10) return;
        if (f.meter <= 0) popText(f.x, GROUND - 190, 'NO MP', '190,225,255');
        if (!holding(f) || f.meter <= 0 || f.hp >= 1000 || mf >= 300) { mv.ended = true; mv.active = Math.max(1, mf - mv.startup); return; }
        f.meter = Math.max(0, f.meter - 0.55); f.hp = Math.min(1000, f.hp + 1.5); f.healT = 90;
        if (mf % 4 === 0) parts.push({ type: 'aura', x: f.x + rnd(-36, 36), y: GROUND - rnd(10, 150), vx: 0, vy: -rnd(0.8, 1.6), life: 22, max: 22, r: rnd(2, 3.5), col: '210,255,225' });
        if (mf % 14 === 0) { parts.push({ type: 'lbeam', x: f.x, w: 34, life: 14, max: 14 }); sfx('orb'); }
      } };
    // super: Sanctuary. He plants the sword and a dome of light swells around him: caught inside, they're held and burned
    // again and again while his guard refills and his wounds close, then the dome bursts
    case 'plJudgement': return { id, super: true, name: 'SANCTUARY', label: 'Sanctuary', startup: 16, active: 44, recovery: 20, wind: 'pCleaveW', pose: 'pPlant', aura: true, wings: true, sanctuary: true,
      onStart(f) { f.invul = 64; },
      onFrame(f, o, mf) {
        f.vx = 0;
        if (mf === 16) { sfx('super'); cracks(f.x + f.facing * 30); game.shake = Math.max(game.shake, 6); }
        if (mf <= 16) return;
        const R = Math.min(200, (mf - 16) * 6), inside = Math.abs(o.x - f.x) < R + 20 && o.y < R; // (the dome swells slowly: dash out before it reaches you)
        f.guard = Math.min(100, f.guard + 2); f.hp = Math.min(1000, f.hp + 3); f.healT = 90;
        if (inside && mf < 58 && (mf - 16) % 6 === 0) sanctHit(f, o, false);
        if (mf === 58) { if (inside) sanctHit(f, o, true); parts.push({ type: 'ring', x: f.x, y: GROUND - 60, r: 40, vr: 14, life: 16, max: 16, col: '190,225,255' }); game.shake = Math.max(game.shake, 9); sfx('hitH'); }
      } };
    // ================= KAPPA =================
    // → → + U: Plate Throw. The dish on his head flies out spinning and comes back (he's bald until it does)
    case 'kpPlate': return { id, label: 'Plate Throw', startup: 12, active: 2, recovery: 18, wind: 'kToss', pose: 'kThrow', proj: 'plate', limit: 1,
      onFrame(f, o, mf) { if (mf === 12) { f.plateOut = true; sfx('throw'); spawnPJ(f, 'plate', { x: f.x + f.facing * 30, y: 150 * f.ch.scale, vx: f.facing * 12, life: 110, r: 20, hits: 2, interval: 14, boomerang: 26,
        h: { dmg: 30, stun: 20, bstun: 10, push: 2, gdrain: 8, juggle: true, jugVy: 6, label: 'Plate Throw' } }); } } };
    // → → + I: Water Cannon. A jet of water from the beak, five quick hits that push them away
    case 'kpCannon': return { id, label: 'Water Cannon', startup: 14, active: 24, recovery: 18, wind: 'kGrab', pose: 'kBlast',
      hitbox: [40,300,70,130], multi: 6, interval: 4, dmg: 9, lastDmg: 22, stun: 16, bstun: 10, push: 1.2, lastPush: 7, kd: true, kdVx: 9, kdVy: 6, type: 'mid', hitstop: 3, chip: true, gdrain: 6,
      onFrame(f, o, mf) { f.vx = 0; if (mf === 14) sfx('flame'); },
      drawFX(f) { if (f.mf <= 13 || f.mf > 38) return; const s = f.ch.scale, x0 = f.x + f.facing * 38 * s, y0 = GROUND - f.y - 128 * s, L = Math.min(300, (f.mf - 13) * 40);
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 3; i++) { ctx.strokeStyle = `rgba(${i ? '170,225,255' : '230,248,255'},${0.55 - i * 0.12})`; ctx.lineWidth = 22 - i * 7; ctx.beginPath(); ctx.moveTo(x0, y0);
          for (let k = 1; k <= 8; k++) ctx.lineTo(x0 + f.facing * L * k / 8, y0 + Math.sin(globalT * 0.6 + k + i) * 4); ctx.stroke(); }
        ctx.restore(); } };
    // → → + J: Belly Slide. Slides along on his belly; it hits low and pops them up
    case 'kpSlide': return { id, label: 'Belly Slide', startup: 8, active: 16, recovery: 16, wind: 'crouch', pose: 'kBelly', selfMove: true, speedFx: true,
      hitbox: [0,120,0,45], low: true, dmg: 44, stun: 22, bstun: 14, push: 2, launch: true, launchVy: 11.5, type: 'mid', hitstop: 9, gdrain: 10,
      onFrame(f, o, mf) { if (mf > 4 && mf <= 22 && !f.hitConnected && Math.abs(o.x - f.x) > 50) { f.vx = f.facing * 11; if (mf % 2 === 0) parts.push({ type: 'aura', x: f.x - f.facing * 20, y: GROUND - 4, vx: -f.facing, vy: -1.5, life: 12, max: 12, r: 3, col: '150,215,255' }); } else f.vx *= 0.7; } };
    // → → + J: Pounce. Leaps on them like a wild animal, latches on and rakes three times, then kicks off them into the air
    case 'kpPounce': return { id, label: 'Pounce', startup: 8, active: 22, recovery: 18, wind: 'kIdle', pose: 'kPounce', manualY: true, noPush: true, selfMove: true, speedFx: true,
      hitbox: [0,120,20,150], dmg: 14, stun: 30, bstun: 14, push: 0.3, type: 'mid', hitstop: 6, gdrain: 10,
      onStart(f, o) { f.pz = { x0: f.x, tx: clamp(clamp(o.x - (Math.sign(o.x - f.x) || f.facing) * 40, f.x - POUNCE_MAX, f.x + POUNCE_MAX), WALL_L, WALL_R) }; sfx('rise'); }, // (a leap of POUNCE_MAX at most: from further away it falls short)
      onFrame(f, o, mf) {
        const mv = f.move; f.vx = 0;
        if (!mv.latch) {
          if (mf <= 26) { const e = mf / 26; f.x = lerp(f.pz.x0, f.pz.tx, e); f.y = 110 * Math.sin(Math.PI * e); }
          if (f.hitConnected && f.lastResult !== 'block') { mv.latch = mf; mv.active = 999; popText(f.x, GROUND - 200, 'WILD!', '150,240,200'); }
          if (mf >= 26) f.y = 0;
          return;
        }
        const k = mf - mv.latch; f.x = clamp(o.x - f.facing * 34, WALL_L, WALL_R); f.y = Math.max(0, o.y + 30); o.stun = Math.max(o.stun, 8);
        if (k === 6 || k === 12 || k === 18) { clawSwipe(f, [40, 110, k === 12 ? -0.9 : 0.9, 56]); columnHit(f, o, { dmg: 14, stun: 30, bstun: 10, push: 0, label: 'Pounce' }); }
        if (k === 24) { columnHit(f, o, { dmg: 26, stun: 22, bstun: 10, push: 2, launch: true, launchVy: 12, hitstop: 10, label: 'Pounce' }); mv.active = mf - mv.startup; mv.recovery = 10; f.vx = -f.facing * 5; }
      } };
    // → → + K: Claw Frenzy. A wild, screeching flurry of claws, every swipe leaving its marks
    case 'kpFrenzy': return { id, label: 'Claw Frenzy', startup: 8, active: 28, recovery: 18, wind: 'kIdle', pose: 'kClawUp', selfMove: true,
      hitbox: [10,135,40,160], multi: 7, interval: 4, dmg: 8, lastDmg: 28, stun: 18, bstun: 10, push: 1, lastPush: 8, kd: true, kdVx: 9, kdVy: 8, type: 'mid', hitstop: 3, gdrain: 6,
      poseFn: (f, mf) => mf > 8 && mf <= 36 ? [POSES.kClawUp, POSES.kClawDown, POSES.kClawX][Math.floor(mf / 2) % 3] : null,
      onFrame(f, o, mf) { if (mf > 8 && mf <= 36 && Math.abs(o.x - f.x) > 70) f.vx = f.facing * 3; else f.vx *= 0.7;
        if (mf > 8 && mf <= 36 && mf % 4 === 1) clawSwipe(f, [90, 100 + (mf % 8 === 1 ? 20 : -10), (mf % 8 === 1 ? 1 : -1) * 0.9, 52]); if (mf === 9) sfx('vanish'); } };
    // → → + K (old): Tsuppari Rush. A flurry of sumo palm-claws
    case 'kpTsuppari': return { id, label: 'Tsuppari Rush', startup: 8, active: 24, recovery: 18, wind: 'kGrab', pose: 'kClaw', selfMove: true,
      hitbox: [10,125,50,140], multi: 6, interval: 4, dmg: 8, lastDmg: 26, stun: 18, bstun: 10, push: 1.2, lastPush: 8, kd: true, kdVx: 9, kdVy: 7, type: 'mid', hitstop: 3, gdrain: 6,
      poseFn: (f, mf) => mf > 8 && mf <= 32 ? (Math.floor(mf / 2) % 2 ? POSES.kClaw : POSES.kGrab) : null,
      onFrame(f, o, mf) { if (mf > 8 && mf <= 32 && Math.abs(o.x - f.x) > 70) f.vx = f.facing * 2.5; else f.vx *= 0.7; if (mf % 4 === 0 && mf > 8 && mf <= 32) sfx('palm'); } };
    // ← ← + U: Water Bubble. A bubble lobbed onto them; it bursts and leaves them dizzy and dripping (stunned)
    case 'kpBubble': return { id, label: 'Water Bubble', startup: 14, active: 2, recovery: 20, wind: 'kToss', pose: 'kThrow', proj: 'bubble', limit: 1,
      onFrame(f, o, mf) { if (mf === 14) { sfx('orb'); const dx = clamp(Math.abs(o.x - f.x), 110, 430);
        spawnPJ(f, 'bubble', { x: f.x + f.facing * 30, y: 130, vx: f.facing * dx / 46, vy: 9, g: 0.5, life: 140, r: 16, explode: { r: 60, water: true, h: { dmg: 32, stun: 22, bstun: 12, push: 1, gdrain: 10, stunT: 56, stunKind: 'wet', label: 'Water Bubble' } } }); } } };
    // ← ← + I: Geyser. A column of water bursts up under them and throws them high
    case 'kpGeyser': return { id, label: 'Geyser', startup: 18, active: 2, recovery: 22, wind: 'kGrab', pose: 'kToss',
      onFrame(f, o, mf) { f.vx = 0; if (mf === 8) { f.gx = clamp(o.x, f.x - 430, f.x + 430); parts.push({ type: 'ring', x: f.gx, y: GROUND - 4, r: 34, vr: -1.2, life: 12, max: 12, col: '150,215,255' }); sfx('charge'); }
        if (mf === 18) geyser(f, o, f.gx); } };
    // ← ← + J: Shell Guard. Pulls into his shell: everything bounces off, and if something did, he spins out of it
    // ← ← + K: Riptide. The water rises up BEHIND them and rolls in toward him, carrying them right up to him — guarding or not.
    // On a hit they arrive stunned in front of him, so his ground string follows. The answer to anyone who keeps their distance. Jump the wave and it passes under them
    case 'kpRiptide': return { id, label: 'Riptide', startup: 16, active: 40, recovery: 18, wind: 'kToss', pose: 'kBlast', hitbox: null,
      onFrame(f, o, mf) { const mv = f.move; f.vx = 0;
        if (mf === 4) { const side = Math.sign(o.x - f.x) || f.facing; mv.dir = -side; mv.wx = clamp(Math.abs(o.x - f.x) <= RIP_REACH ? o.x + side * 150 : f.x + side * RIP_REACH, WALL_L - 20, WALL_R + 20); sfx('flame'); } // (the water rises behind them — if they're within RIP_REACH; further away it rises short of them and misses)
        if (mf < 16 || mv.wx == null) return;
        if (mf === 16) { sfx('splash'); game.shake = Math.max(game.shake, 3); }
        mv.wx += mv.dir * 13;
        if (mv.dir * (f.x - mv.wx) < 50) { mv.done = true; if (mv.carry === 'hit' && o.state === 'hitstun') { o.stun = Math.max(o.stun, 26); o.x = clamp(f.x + f.facing * 72, WALL_L, WALL_R); popText(o.x, GROUND - 190, L('DRAGGED IN!', '引き寄せ！'), '150,215,255'); } else if (mv.carry) o.x = clamp(f.x + f.facing * 80, WALL_L, WALL_R); hitRecover(f, 6); return; } // (it breaks at his feet, leaving them right in front of him: on a hit, still stunned — start the string)
        const near = Math.abs(o.x - mv.wx) < 60 && o.y < 80;
        if (near && !mv.hit) { mv.hit = true; const r = columnHit(f, o, { dmg: 34, stun: 40, bstun: 16, push: 0, gdrain: 10, label: 'Riptide' }); mv.carry = o.state === 'hitstun' ? 'hit' : 'guard'; mv.cx = o.x; }
        if (mv.carry && !mv.done && Math.abs(o.x - mv.cx) >= RIP_PULL) { mv.done = true; hitRecover(f, 6); return; } // (it carries them RIP_PULL at most, then lets go where they are)
        if (mv.carry && !mv.done) { // caught in it — hit or guarding — they're carried along to him
          o.x = clamp(lerp(o.x, mv.wx + mv.dir * 10, 0.6), WALL_L, WALL_R); o.vx = 0;
          if (o.state === 'hitstun') o.stun = Math.max(o.stun, 30); else if (o.state === 'blockstun') o.bstun = Math.max(o.bstun || 0, 8); else if (['stand', 'guard', 'crouch', 'walk'].includes(o.state)) { setState(o, 'blockstun'); o.bstun = 8; } }
        if (mf % 3 === 0) parts.push({ type: 'aura', x: mv.wx + vrnd(-30, 30), y: GROUND - vrnd(10, 70), vx: mv.dir * 2, vy: -vrnd(0.5, 2), life: 14, max: 14, r: 3, col: '170,225,255' });
      },
      drawFX(f) { const mv = f.move; if (mv.wx == null || mv.done || f.mf < 4) return; const k = Math.min(1, (f.mf - 4) / 12), d = mv.dir; // the water rising behind them, then a wave rolling in toward him
        ctx.save(); const g = ctx.createLinearGradient(0, GROUND - 120, 0, GROUND); g.addColorStop(0, 'rgba(170,225,255,.8)'); g.addColorStop(1, 'rgba(40,110,200,.85)'); ctx.fillStyle = g;
        const x0 = mv.wx - d * 170, x1 = mv.wx; ctx.beginPath(); ctx.moveTo(x0, GROUND);
        for (let i = 0; i <= 16; i++) { const u = i / 16, x = lerp(x0, x1, u); ctx.lineTo(x, GROUND - (16 + 70 * u * u) * k - Math.sin(globalT * 0.4 + i) * 4); }
        ctx.lineTo(x1, GROUND); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(235,250,255,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x1 - d * 10, GROUND - 78 * k, 14 * k, d > 0 ? -Math.PI / 2 : Math.PI / 2, d > 0 ? Math.PI / 2 : Math.PI * 1.5, d < 0); ctx.stroke(); ctx.restore(); } };
    case 'kpShell': return { id, label: 'Shell Guard', startup: 3, active: 30, recovery: 14, wind: 'crouch', pose: 'kCurl', crouch: true, deflect: [2, 32], destroysProj: true, reflectAll: true,
      onStart(f) { f.deflected = false; },
      onFrame(f, o, mf) { f.vx = 0; if (mf === 3) sfx('block'); if (f.deflected && mf > 6) { f.deflected = false; startMove(f, specialMove('kpShellSpin'), 1, true); } } };
    case 'kpShellSpin': return { id, label: 'Shell Spin', startup: 4, active: 20, recovery: 16, wind: 'kCurl', pose: 'kCurl', selfMove: true, crouch: true, spin: [4, 24],
      hitbox: [-40,110,0,90], multi: 4, interval: 5, dmg: 12, lastDmg: 26, stun: 18, bstun: 10, push: 1.5, lastPush: 8, kd: true, kdVx: 9, kdVy: 7, type: 'mid', hitstop: 4, gdrain: 8,
      onFrame(f, o, mf) { if (mf > 4 && mf <= 24) f.vx = f.facing * 7; else f.vx *= 0.6; if (mf % 5 === 0) sfx('swing'); } };
    // ← ← + K: Cucumber Snack. Munches a cucumber and heals a little (hit him while he eats and it's a counter hit)
    case 'kpCucumber': return { id, label: 'Cucumber Snack', startup: 8, active: 30, recovery: 12, wind: 'kIdle', pose: 'kEat', heal: true,
      onFrame(f, o, mf) { f.vx = 0; if (mf > 8 && mf <= 38) { f.hp = Math.min(1000, f.hp + 2.2); f.healT = 60;
        if (mf % 6 === 0) { sfx('select'); for (let i = 0; i < 3; i++) parts.push({ type: 'spark', x: f.x + f.facing * 14, y: GROUND - f.y - 118 * f.ch.scale, vx: rnd(-2, 2), vy: rnd(-3, 0), life: 10, max: 10, col: '120,200,90' }); } } },
      drawFX(f) { if (f.mf <= 6 || f.mf > 38) return; const s = f.ch.scale, x = f.x + f.facing * 16 * s, y = GROUND - f.y - 132 * s, L = 26 * (1 - (f.mf - 8) / 34);
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.4 * f.facing); ctx.fillStyle = '#4caf50'; ctx.fillRect(-3, -Math.max(4, L), 7, Math.max(4, L)); ctx.fillStyle = '#a5d66b'; ctx.fillRect(-1, -Math.max(4, L), 2, Math.max(4, L)); ctx.restore(); } };
    // super: Great Flood. A wave rises behind him and sweeps across the stage, carrying them with it
    case 'kpFlood': return { id, super: true, name: 'GREAT FLOOD', label: 'Great Flood', startup: 18, active: 26, recovery: 16, wind: 'kToss', pose: 'kToss', aura: true,
      onStart(f) { f.invul = 40; },
      onFrame(f, o, mf) { // no direct hit: a great wave rolls across and the whole stage floods for eight seconds — the kappa swims, they wade
        f.vx = 0; if (mf < 18) return;
        if (mf === 18) { sfx('flame'); game.shake = Math.max(game.shake, 6); }
        if (mf === 40) { game.flood = { owner: f, t: FLOOD_T }; popText(W / 2, GROUND - 230, L('THE STAGE FLOODS!', '水没！'), '150,215,255'); sfx('charge'); }
      },
      drawFX(f) { if (f.mf < 18 || f.mf > 72) return; const front = f.x + f.facing * ((f.mf - 18) * 40 - 60), back = front - f.facing * 520, a = f.mf > 64 ? Math.max(0, 1 - (f.mf - 64) / 8) : 1;
        ctx.save(); ctx.globalAlpha = a; const x0 = Math.min(front, back), x1 = Math.max(front, back), g = ctx.createLinearGradient(0, GROUND - 220, 0, GROUND); g.addColorStop(0, 'rgba(160,220,255,.75)'); g.addColorStop(1, 'rgba(40,110,200,.85)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, GROUND);
        for (let k = 0; k <= 24; k++) { const x = lerp(x0, x1, k / 24), crest = (f.facing > 0 ? k / 24 : 1 - k / 24); ctx.lineTo(x, GROUND - 20 - 66 * crest * crest - Math.sin(globalT * 0.3 + k) * 5); } // (the wave: low at the back, curling up to a crest about knee-to-waist high)
        ctx.lineTo(x1, GROUND); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 4; ctx.beginPath(); for (let k = 0; k <= 24; k++) { const x = lerp(x0, x1, k / 24), crest = (f.facing > 0 ? k / 24 : 1 - k / 24); const y = GROUND - 120 - 90 * crest - Math.sin(globalT * 0.3 + k) * 8; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        ctx.restore(); } };
    // ================= GUNSLINGER (no kicks: everything is a shot or a pistol whip) =================
    // → → + U: Fan the Hammer. Six fast shots at mid range
    case 'gnFan': return { id, label: 'Fan the Hammer', startup: 10, active: 18, recovery: 20, wind: 'gAim', pose: 'gAim',
      onFrame(f, o, mf) { f.vx = 0; if (mf >= 10 && mf <= 25 && (mf - 10) % 3 === 0) { const k = (mf - 10) / 3; shoot(f, { y: 118 + (k % 3 - 1) * 2, dmg: k === 5 ? 16 : 9, stun: 16, bstun: 8, push: 0.8, gdrain: 4, kd: k === 5 }); } } };
    // → → + I: Quick Draw. Fast as lightning, one long shot that staggers them
    case 'gnQuick': return { id, label: 'Quick Draw', startup: 999, active: 2, recovery: 16, wind: 'gIdle', pose: 'gAim', held: true,
      onFrame(f, o, mf) { const mv = f.move; f.vx = 0; // tap: a lightning-fast shot; hold: the Dead-Eye, a crosshair locks on, then a piercing shot across the stage
        if (!mv.fired) { mv.chargeMarks = [[40, 'MAX']]; mv.lvl = mf >= 40 ? 2 : 0; if (mf === 40) { sfx('charge'); popText(f.x, GROUND - 200, 'DEAD-EYE', '255,90,70'); }
          if (!holding(f) || mf >= 70) { mv.fired = true; mv.startup = mf + (mv.lvl ? 3 : 4); mv.label = mv.lvl ? 'Dead-Eye Shot' : 'Quick Draw'; mv.recovery = mv.lvl ? 24 : 16; } return; }
        if (mf === mv.startup) { if (mv.lvl) shoot(f, { y: 128, vx: 34, dmg: 85, range: 900, lvl: 2, pierce: true, stun: 30, ...(Math.abs(o.x - f.x) < 230 ? { launch: true, launchVy: 12.5, jugVy: 11 } : { kd: true }) }); else shoot(f, { y: 122, vx: 30, range: 340, dmg: 42, stun: 30, big: true }); }
        if (mf > mv.startup && o.state === 'knock' && o.juggle) mv.recovery = Math.min(mv.recovery, 6); },
      drawFX(f, o) { const mv = f.move; if (!o || mv.fired || mf0(f) < 40) return; const x = o.x, y = GROUND - o.y - 100 * o.ch.scale, r = 26 + Math.max(0, 70 - f.mf) * 0.6;
        ctx.save(); ctx.strokeStyle = 'rgba(255,80,60,.95)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { ctx.beginPath(); ctx.moveTo(x + dx * r * 0.4, y + dy * r * 0.4); ctx.lineTo(x + dx * r * 1.3, y + dy * r * 1.3); ctx.stroke(); } ctx.restore(); } };
    // → → + J: Roll Shot. Rolls forward (can't be hit while rolling) and fires both guns
    case 'gnRoll': return { id, label: 'Roll Shot', startup: 18, active: 2, recovery: 18, wind: 'gLow', pose: 'gTwin', selfMove: true, crouch: true,
      onStart(f) { f.invul = 14; },
      poseFn: (f, mf) => mf < 16 ? POSES.gLow : null,
      onFrame(f, o, mf) { if (mf <= 14) { f.vx = f.facing * 8; if (mf % 3 === 0) dustAt(f.x, false); } else f.vx *= 0.5; if (mf === 18) { shoot(f, { y: 122, dmg: 24 }); shoot(f, { y: 116, dmg: 24 }); } } };
    // → → + K: Jump Shot. Leaps forward and fires three shots down on them
    case 'gnJumpShot': return { id, label: 'Jump Shot', startup: 8, active: 26, recovery: 12, wind: 'jump', pose: 'gAirDown', manualY: true, noPush: true, selfMove: true,
      onFrame(f, o, mf) { f.vx = f.facing * 4.5; f.y = mf <= 34 ? 150 * Math.sin(Math.PI * mf / 34) : 0;
        if (mf === 12 || mf === 18 || mf === 24) shoot(f, { x: f.x + f.facing * 36, y: f.y + 70, vx: 14, vy: -12, life: 22, dmg: 20, juggle: true });
        if (mf === 34) { f.y = 0; dustAt(f.x, false); } } };
    // ← ← + U: Dynamite. A lit stick lobbed at them; it blows them into the air
    case 'gnDyna': return { id, label: 'Dynamite', startup: 14, active: 2, recovery: 20, wind: 'gIdle', pose: 'gUp', proj: 'dyna', limit: 1,
      onFrame(f, o, mf) { if (mf === 14) { sfx('throw'); const dx = clamp(Math.abs(o.x - f.x), 100, 420);
        spawnPJ(f, 'dyna', { x: f.x + f.facing * 30, y: 140, vx: f.facing * dx / 44, vy: 9, g: 0.45, life: 140, r: 14, explode: { r: 74, h: { dmg: 56, stun: 22, bstun: 14, push: 2, gdrain: 16, launch: true, launchVy: 12, label: 'Dynamite' } } }); } } };
    // ← ← + I: Make 'em Dance! Shots at their feet: they hop with every one, and the last one sends them up for a juggle
    case 'gnDance': return { id, label: "Make 'em Dance", startup: 10, active: 24, recovery: 18, wind: 'gIdle', pose: 'gAimLow',
      poseFn: (f, mf) => mf > 10 && mf <= 34 && (mf - 10) % 6 < 2 ? POSES.gRecoil : null,
      onFrame(f, o, mf) { f.vx = 0; if (mf === 10) popText(f.x, GROUND - 190, L('DANCE!', '踊れ！'), '255,220,150');
        if (mf >= 10 && mf <= 34 && (mf - 10) % 6 === 0) { const last = mf === 34; shoot(f, { y: last ? 44 : 40, vx: 24, life: 18, dmg: last ? 22 : 9, stun: 24, push: 0.2, low: true, ...(last ? { stunT: 64, stunKind: 'dance' } : {}) }); } } };
    // ← ← + I (old): Ricochet. Shoots the floor in front of them: the bullet bounces up into them
    case 'gnRicochet': return { id, label: 'Ricochet', startup: 10, active: 2, recovery: 18, wind: 'gIdle', pose: 'gAimLow',
      onFrame(f, o, mf) { if (mf === 10) shoot(f, { y: 90, vx: 16, vy: -7, life: 36, dmg: 30, bounce: 1 }); } };
    // ← ← + J: Backflip Shot. Flips away (can't be hit at first) and shoots on the way
    case 'gnBackflip': return { id, label: 'Backflip Shot', startup: 6, active: 20, recovery: 10, wind: 'jump', pose: 'gAirDown', manualY: true, noPush: true, selfMove: true,
      onStart(f) { f.invul = 12; f.bfx = f.x; },
      onFrame(f, o, mf) { f.vx = 0; f.x = clamp(f.bfx - f.facing * 130 * Math.min(1, mf / 26), WALL_L, WALL_R); f.y = mf <= 26 ? 110 * Math.sin(Math.PI * mf / 26) : 0; f.flipT = mf < 18 ? 18 - mf : 0; f.flipMax = 18;
        if (mf === 16) shoot(f, { x: f.x + f.facing * 36, y: f.y + 80, vx: 18, vy: -6, life: 22, dmg: 26 }); } };
    // ← ← + K: Showdown. Stands still, hand over the holster; attack him from the front and he draws first
    case 'gnShowdown': return { id, label: 'Showdown', startup: 4, active: 22, recovery: 22, wind: 'gIdle', pose: 'gIdle', parry: true, frontOnly: true, parryInto: 'gnDraw', fx: 'ward' };
    case 'gnDraw': return { id, label: 'Draw!', startup: 3, active: 3, recovery: 18, wind: 'gIdle', pose: 'gTwin', noGrace: true, burst: [110, 120],
      hitbox: [10,170,60,150], dmg: 50, stun: 22, bstun: 12, push: 2, launch: true, launchVy: 12.5, type: 'mid', hitstop: 14, gdrain: 10,
      onFrame(f, o, mf) { if (mf === 3) { sfx('shot'); sfx('hitH'); } } };
    // super: High Noon. Everything stops; six shots from the hip, then the last one knocks them flat
    case 'gnHighNoon': return { id, super: true, name: 'HIGH NOON', label: 'High Noon', startup: 20, active: 40, recovery: 18, wind: 'gAim', pose: 'gTwin', aura: true,
      onStart(f) { f.invul = 66; },
      onFrame(f, o, mf) { f.vx = 0; if (mf < 20) return; // six shots at their feet, then one that knocks them flat — across the whole stage
        const mv = f.move, caught = o.state === 'knock' && o.juggle, hb = caught ? { x0: o.x - 34, x1: o.x + 34, y0: 0, y1: 400 } : { x0: o.x - 34, x1: o.x + 34, y0: 0, y1: 40 };
        const shot = big => { mv.shotT = mf; mv.shotX = o.x; mv.shotBig = big; sfx('shot'); game.shake = Math.max(game.shake, big ? 10 : 3);
          for (let i = 0; i < (big ? 18 : 7); i++) parts.push({ type: 'spark', x: o.x + vrnd(-20, 20), y: GROUND - 6, vx: vrnd(-4, 4), vy: -vrnd(2, big ? 9 : 6), life: 14, max: 14, col: '255,220,140' }); // sparks and grit where it strikes the floor
          parts.push({ type: 'star', x: f.x + f.facing * 64, y: GROUND - f.y - 112, r: big ? 34 : 18, vr: 1.4, life: 6, max: 6, col: '255,245,200', rot: vrnd(0, 1) }); dustAt(o.x, big); };
        if (mf <= 40 && (mf - 20) % 4 === 0) { shot(false); zoneHit(f, o, { dmg: 18, stun: 22, bstun: 10, push: 0.3, hold: true, juggle: true, jugVy: 3, low: true, label: 'High Noon', superHit: true }, hb); }
        if (mf === 46) { shot(true); sfx('hitH'); parts.push({ type: 'ring', x: o.x, y: GROUND - 10, r: 12, vr: 10, life: 16, max: 16, col: '255,210,120' });
          zoneHit(f, o, { dmg: 95, stun: 24, bstun: 12, push: 8, kd: true, kdVx: 12, kdVy: 9, hitstop: 16, low: true, label: 'High Noon', superHit: true }, hb); } },
      drawFX(f, o) { if (f.mf < 1 || f.mf > 58 || !o) return; const x = o.x, y = GROUND - o.y - 22, r = 26 + Math.max(0, 20 - (f.mf - 16)) * 2; // (the crosshair sits on their feet)
        ctx.save(); ctx.strokeStyle = 'rgba(255,80,60,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { ctx.beginPath(); ctx.moveTo(x + dx * r * 0.5, y + dy * r * 0.5); ctx.lineTo(x + dx * r * 1.3, y + dy * r * 1.3); ctx.stroke(); }
        const mv = f.move; if (mv.shotT != null && f.mf - mv.shotT < (mv.shotBig ? 5 : 3)) { const k = 1 - (f.mf - mv.shotT) / (mv.shotBig ? 5 : 3), gx = f.x + f.facing * 64, gy = GROUND - f.y - 112; ctx.globalCompositeOperation = 'lighter'; // the tracer: from his gun down to the floor at their feet
          for (const [w, c] of [[mv.shotBig ? 22 : 10, `rgba(255,190,90,${0.35 * k})`], [mv.shotBig ? 8 : 4, `rgba(255,245,200,${0.95 * k})`]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(mv.shotX, GROUND - 8); ctx.stroke(); }
          const g = ctx.createRadialGradient(mv.shotX, GROUND - 8, 2, mv.shotX, GROUND - 8, mv.shotBig ? 70 : 34); g.addColorStop(0, `rgba(255,240,190,${k})`); g.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mv.shotX, GROUND - 8, mv.shotBig ? 70 : 34, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore(); } };
    // ================= SALARYMAN =================
    case 'smCard': return { id, label: 'Business Card', startup: 10, active: 2, recovery: 16, wind: 'palmW', pose: 'gAim', proj: 'card', limit: 2,
      onFrame(f, o, mf) { if (mf === 10) { sfx('throw'); spawnPJ(f, 'card', { x: f.x + f.facing * 50, y: 120, vx: f.facing * 14, life: 44, r: 11, h: { dmg: 40, stun: 20, bstun: 10, push: 2, gdrain: 6, label: 'Business Card' } }); } } };
    case 'smCase': return { id, label: 'Briefcase Smash', startup: 20, active: 6, recovery: 22, wind: 'sArch', pose: 'sCase', selfMove: true, manualY: true, noPush: true,
      hitbox: [10,155,0,175], dmg: 62, stun: 22, bstun: 16, push: 3, kd: true, kdVx: 9, kdVy: 9, type: 'mid', hitstop: 12, gdrain: 20,
      onFrame(f, o, mf) { f.y = mf <= 20 ? 90 * Math.sin(Math.PI * mf / 20) : 0; if (mf <= 18 && Math.abs(o.x - f.x) > 90) f.vx = f.facing * 5; else f.vx *= 0.6; // a desperate leap, briefcase over his head
        if (mf === 21) { sfx('hitH'); dustAt(f.x + f.facing * 100, true); cracks(f.x + f.facing * 90); game.shake = Math.max(game.shake, 6); for (let i = 0; i < 6; i++) parts.push({ type: 'spark', x: f.x + f.facing * 100, y: GROUND - 20, vx: rnd(-4, 4), vy: -rnd(3, 7), life: 22, max: 22, col: '250,250,255' }); } } };
    // ---- Tanaka's low techniques (himself): → → ↓ + J, ← ← ↓ + J, → → ↓ + K ----
    case 'smSlide': return { id, label: 'Wet Floor Slide', startup: 9, active: 14, recovery: 20, wind: 'crouch', pose: 'slideKick', selfMove: true, speedFx: true, // he sets down a "Caution: wet floor" sign... and promptly slips past it, feet first
      hitbox: [0,110,0,38], low: true, dmg: 40, stun: 22, bstun: 12, push: 2, kd: true, kdVx: 3, kdVy: 5, type: 'mid', hitstop: 8, gdrain: 10,
      poseFn(f, mf) { return mf <= 4 ? POSES.sBow : mf <= 8 ? POSES.sArch : null; }, // bends to set the sign down, arms flail as he slips...
      onFrame(f, o, mf) { const mv = f.move;
        if (mf === 1) { mv.signX = f.x - f.facing * 34; popText(f.x, GROUND - 190, L('CAUTION: WET FLOOR', '足元注意：濡れています'), '255,215,60'); }
        if (mf === 6) { sfx('swing'); popText(f.x, GROUND - 160, L('WHOA—!', 'うわっ！'), '150,210,255'); }
        if (mf > 4 && mf <= 22 && !f.hitConnected && Math.abs(o.x - f.x) > 45) { f.vx = f.facing * 11; for (let i = 0; i < 2; i++) parts.push({ type: 'aura', x: f.x - f.facing * 18, y: GROUND - 6, vx: -f.facing * vrnd(1, 3), vy: -vrnd(1.5, 4), life: 14, max: 14, r: vrnd(2, 3.5), col: '150,210,255' }); } else f.vx *= 0.6; // a spray of water behind him
        if (f.hitConnected && !mv.splashed) { mv.splashed = true; parts.push({ type: 'ring', x: o.x, y: GROUND - 8, r: 8, vr: 6, life: 14, max: 14, col: '150,210,255' }); for (let i = 0; i < 12; i++) parts.push({ type: 'aura', x: o.x + vrnd(-20, 20), y: GROUND - 8, vx: vrnd(-4, 4), vy: -vrnd(3, 8), life: 18, max: 18, r: 3, col: '170,220,255' }); popText(o.x, GROUND - 170, L('SPLASH!', 'バシャッ！'), '150,210,255'); } },
      drawFX(f) { const mv = f.move; if (mv.signX == null) return; const a = Math.min(1, f.mf / 3) * (f.mf > 40 ? Math.max(0, 1 - (f.mf - 40) / 10) : 1), x = mv.signX, y = GROUND; // the yellow A-frame sign
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = '#3a3020'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x, y - 46); ctx.lineTo(x + 14, y); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#3a3020'; ctx.font = "bold 16px 'Rajdhani', system-ui, sans-serif"; ctx.textAlign = 'center'; ctx.fillText('!', x, y - 14); ctx.font = "bold 6px system-ui, sans-serif"; ctx.fillText('CAUTION', x, y - 4); ctx.restore(); } };
    case 'smSpill': return { id, label: 'Spilled Coffee', startup: 11, active: 2, recovery: 18, wind: 'sCase', pose: 'sShove', hitbox: null, // he trips over his own feet — the cup flies, coffee arcs through the air and splashes across the floor
      poseFn(f, mf) { return mf <= 5 ? POSES.sCase : mf <= 10 ? POSES.sArch : null; },
      onFrame(f, o, mf) { if (mf === 5) { sfx('swing'); popText(f.x, GROUND - 190, L('OOPS!', 'あっ！'), '200,150,90'); }
        if (mf === 11) { sfx('throw'); spawnPJ(f, 'puddle', { x: f.x + f.facing * 90, y: 8, vx: f.facing * 5, life: 150, r: 26, h: { dmg: 30, stun: 30, bstun: 12, push: 1, low: true, kd: true, kdVx: 2, kdVy: 6, gdrain: 8, label: 'Spilled Coffee' } });
          for (let i = 0; i < 10; i++) parts.push({ type: 'aura', x: f.x + f.facing * (80 + vrnd(0, 30)), y: GROUND - 10, vx: f.facing * vrnd(0, 3), vy: -vrnd(1, 5), life: 16, max: 16, r: 3, col: '120,75,40' }); } },
      drawFX(f) { const mf = f.mf; if (mf < 5 || mf > 12) return; const k = (mf - 5) / 7, s0 = f.ch.scale; // the cup tumbling through the air, coffee streaming out of it
        const x = f.x + f.facing * (20 + 75 * k), y = GROUND - f.y - 120 * s0 - Math.sin(k * Math.PI) * 60 + k * 100;
        ctx.save(); ctx.translate(x, y); ctx.rotate(k * 7); ctx.fillStyle = '#f4f1ea'; ctx.fillRect(-7, -8, 14, 16); ctx.fillStyle = '#6b3e1f'; ctx.fillRect(-6, -8, 12, 3); ctx.restore();
        for (let i = 1; i < 6; i++) { const kk = Math.max(0, k - i * 0.06); ctx.fillStyle = `rgba(110,70,35,${0.8 - i * 0.12})`; ctx.beginPath(); ctx.arc(f.x + f.facing * (20 + 75 * kk), GROUND - f.y - 120 * s0 - Math.sin(kk * Math.PI) * 60 + kk * 100, 4 - i * 0.5, 0, Math.PI * 2); ctx.fill(); } } };
    case 'smSkid': return { id, label: 'Briefcase Skid', startup: 8, active: 2, recovery: 14, wind: 'crouch', pose: 'sShove', hitbox: null, // a bowler's crouch, a long underarm swing: the briefcase goes skidding along the floor, papers spilling out
      poseFn(f, mf) { return mf <= 5 ? POSES.sCase : null; },
      onFrame(f, o, mf) { if (mf === 3) popText(f.x, GROUND - 190, L('SPECIAL DELIVERY!', '速達です！'), '240,220,170');
        if (mf === 8) { sfx('throw'); spawnPJ(f, 'skidcase', { x: f.x + f.facing * 40, y: 12, vx: f.facing * 12, life: 50, r: 14, h: { dmg: 26, stun: 18, bstun: 10, push: 2, low: true, gdrain: 6, label: 'Briefcase Skid' } }); parts.push({ type: 'ring', x: f.x + f.facing * 40, y: GROUND - 8, r: 6, vr: 4, life: 10, max: 10, col: '255,230,170' }); } } };
    case 'sdCrawl': return { id, label: 'Hell Crawl', startup: 10, active: 10, recovery: 22, wind: 'sdIdle', pose: 'kLowClaw', selfMove: true, speedFx: true, // he drops onto all fours, eyes burning red, and scuttles in clawing at their legs — then rips upward
      hitbox: [0,100,0,44], low: true, dmg: 44, stun: 26, bstun: 12, push: 1, launch: true, launchVy: 11.5, type: 'mid', hitstop: 9, gdrain: 10, claw: [70, 24, 0.2, 44, '255,120,90'],
      onFrame(f, o, mf) { const mv = f.move;
        if (mf === 1) { sfx('vanish'); popText(f.x, GROUND - 190, L('GRRRAAH!', 'グルルァ！'), '255,90,70'); }
        if (mf > 3 && mf <= 16 && !f.hitConnected && Math.abs(o.x - f.x) > 50) { f.vx = f.facing * 9; if (mf % 2 === 0) { parts.push({ type: 'aura', x: f.x - f.facing * 10, y: GROUND - 3, vx: 0, vy: -0.1, life: 50, max: 50, r: 5, col: '90,10,10' }); parts.push({ type: 'spark', x: f.x, y: GROUND - 6, vx: -f.facing * 2, vy: -vrnd(1, 3), life: 12, max: 12, col: '255,110,60' }); } } else f.vx *= 0.6; // scorched claw marks and embers on the floor
        if (f.hitConnected && !mv.ripped) { mv.ripped = true; for (let i = 0; i < 3; i++) parts.push({ type: 'slashx', x: o.x + (i - 1) * 12, y: GROUND - o.y - 60 - i * 10, r: 40, life: 12, max: 12, col: '255,70,50', rot: -1.2 }); parts.push({ type: 'ring', x: o.x, y: GROUND - 40, r: 10, vr: 7, life: 14, max: 14, col: '255,110,60' }); }
        hitRecover(f, 8); },
      drawFX(f) { if (f.mf > 22) return; const J = solve(f.pose), s0 = f.ch.scale, hx = f.x + (f.animDX || 0) + f.facing * s0 * J.head[0], hy = GROUND - f.y - s0 * (J.head[1] + f.hipUp); // two burning red eyes, streaking
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const dx of [0, 7]) { const ex = hx + f.facing * (8 + dx), ey = hy - 2; ctx.strokeStyle = 'rgba(255,60,40,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - f.facing * 24, ey + 2); ctx.stroke(); ctx.fillStyle = '#ffdddd'; ctx.beginPath(); ctx.arc(ex, ey, 2.2, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); } };
    case 'sdTail': return { id, label: 'Tail Sweep', startup: 12, active: 10, recovery: 20, wind: 'sdIdle', pose: 'sdIdle', tailTurn: true, // he whirls round, back to them, and his great devil tail sweeps out across the floor at their ankles
      hitbox: [-70,160,0,36], low: true, dmg: 38, stun: 22, bstun: 12, push: 3, kd: true, kdVx: 4, kdVy: 6, type: 'mid', hitstop: 8, gdrain: 10,
      onFrame(f, o, mf) { if (mf === 2) popText(f.x, GROUND - 190, L('TAIL!', '尻尾！'), '255,90,70'); if (mf === 9) sfx('swing'); if (mf === 12) { cracks(f.x + f.facing * 70); parts.push({ type: 'ring', x: f.x, y: GROUND - 6, r: 20, vr: 9, life: 16, max: 16, col: '255,100,50' }); }
        if (mf >= 11 && mf <= 22 && mf % 2 === 0) for (let i = 0; i < 3; i++) { const an = vrnd(0, Math.PI); parts.push({ type: 'aura', x: f.x + Math.cos(an) * 120, y: GROUND - 6, vx: 0, vy: -vrnd(1, 3), life: 18, max: 18, r: vrnd(3, 6), col: '255,120,50' }); } },
      drawFX(f) { // the tail itself: big, thick, with a spade tip — it swings from behind him, round, and out along the floor in front, trailing fire
        const S = f.move.startup, mf = f.mf; if (mf < 2 || mf > S + 16) return;
        const s0 = f.ch.scale, J = solve(f.pose), bx = f.x + (f.animDX || 0) + f.facing * 14 * s0, by = GROUND - f.y - s0 * (J.hip[1] + f.hipUp) + 4; // from his rear
        const k = mf < S ? 0.18 * (mf / S) : Math.min(1, 0.18 + (mf - S) / 10 * 0.82), fade = mf > S + 10 ? 1 - (mf - S - 10) / 6 : 1;
        const an = Math.PI * (1 - k), L = 150 * s0; // from behind him (π) round to straight in front (0)
        const tip = [bx + Math.cos(an) * L * f.facing, GROUND - 12 - Math.sin(an) * 26], ctl = [bx + Math.cos(an + 0.5 * f.facing) * L * 0.5 * f.facing, by + 30];
        ctx.save();
        if (mf >= S) { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 10; i++) { const a2 = Math.PI * (1 - Math.max(0, k - i * 0.04)), x = bx + Math.cos(a2) * L * f.facing, y = GROUND - 12 - Math.sin(a2) * 26; ctx.fillStyle = `rgba(255,${100 + i * 12},50,${(0.55 - i * 0.05) * fade})`; ctx.beginPath(); ctx.arc(x, y, 12 - i, 0, Math.PI * 2); ctx.fill(); } ctx.globalCompositeOperation = 'source-over'; } // a trail of fire behind the tip
        ctx.globalAlpha = fade; ctx.lineCap = 'round';
        for (let i = 0; i < 16; i++) { const u0 = i / 16, u1 = (i + 1) / 16, q = (u, P0, P1, P2) => (1 - u) * (1 - u) * P0 + 2 * (1 - u) * u * P1 + u * u * P2;
          ctx.strokeStyle = i % 2 ? '#7a1010' : '#941818'; ctx.lineWidth = 18 - u0 * 12; ctx.beginPath(); ctx.moveTo(q(u0, bx, ctl[0], tip[0]), q(u0, by, ctl[1], tip[1])); ctx.lineTo(q(u1, bx, ctl[0], tip[0]), q(u1, by, ctl[1], tip[1])); ctx.stroke(); } // the tail, thick at the base, tapering
        const d = Math.atan2(tip[1] - ctl[1], tip[0] - ctl[0]); ctx.translate(tip[0], tip[1]); ctx.rotate(d);
        ctx.fillStyle = '#b01c1c'; ctx.strokeStyle = '#ffb08a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(32, 0); ctx.lineTo(0, -16); ctx.lineTo(7, 0); ctx.lineTo(0, 16); ctx.closePath(); ctx.fill(); ctx.stroke(); // the spade at its tip
        ctx.restore(); } };
    case 'sdTrail': return { id, label: 'Brimstone Trail', startup: 12, active: 2, recovery: 18, wind: 'sdBeckon', pose: 'stomp', hitbox: null, // he stamps the floor: it cracks open, and hellfire races along the crack toward them
      onFrame(f, o, mf) { if (mf === 4) popText(f.x, GROUND - 190, L('BURN!', '燃えろ！'), '255,110,50');
        if (mf === 12) { sfx('flame'); cracks(f.x + f.facing * 20); game.shake = Math.max(game.shake, 4); parts.push({ type: 'ring', x: f.x + f.facing * 20, y: GROUND - 4, r: 10, vr: 8, life: 14, max: 14, col: '255,110,50' });
          spawnPJ(f, 'brimstone', { x: f.x + f.facing * 50, y: 14, vx: f.facing * 8, life: 70, r: 16, h: { dmg: 32, stun: 22, bstun: 12, push: 2, low: true, gdrain: 8, label: 'Brimstone Trail' } }); } } };
    case 'smTackle': return { id, label: 'Rush Hour Kick', startup: 14, active: 12, recovery: 20, wind: 'crouch', pose: 'jKickH', selfMove: true, speedFx: true, // → → + J: a sprint for the train — and a flying kick at the end of it
      hitbox: [10,120,40,150], dmg: 46, stun: 22, bstun: 16, push: 3, launch: true, launchVy: 11, type: 'mid', hitstop: 10, gdrain: 34, // (heavy on guard: it smashes through)
      poseFn(f, mf) { return mf < 3 ? POSES.crouch : mf < 11 ? (mf % 4 < 2 ? POSES.dash : POSES.shoulder) : null; }, // crouch, sprint (arms pumping)... then the kick
      onFrame(f, o, mf) { if (mf === 2) popText(f.x, GROUND - 190, L("I'M LATE!", '遅刻だ！'), '255,210,120');
        if (mf > 2 && mf <= 24 && !f.hitConnected && Math.abs(o.x - f.x) > 55) { f.vx = f.facing * (mf < 11 ? 9 : 12); if (mf % 2 === 0) parts.push({ type: 'smoke', x: f.x - f.facing * 20, y: GROUND - 6, vx: -f.facing, vy: -0.5, r: 5, vr: 0.3, life: 14, max: 14, col: '220,215,205' }); } else f.vx *= 0.6;
        if (mf >= 11 && mf <= 22) f.y = 34 * Math.sin(Math.PI * Math.min(1, (mf - 11) / 11)); else f.y = 0;
        if (f.hitConnected && f.lastResult === 'block' && !f.move.smashed) { f.move.smashed = true; game.shake = Math.max(game.shake, 5); parts.push({ type: 'ring', x: o.x, y: GROUND - 90, r: 10, vr: 7, life: 12, max: 12, col: '255,210,120' }); }
        hitRecover(f, 8); }, manualY: true };
    case 'smUpper': return { id, label: 'Overtime Uppercut', startup: 7, active: 6, recovery: 22, wind: 'uppercutW', pose: 'uppercut', burst: [60, 170], manualY: true, noPush: true,
      onFrame(f, o, mf) { f.y = mf <= 14 ? 70 * Math.sin(Math.PI / 2 * mf / 14) : Math.max(0, 70 - (mf - 14) * 6); if (mf === 7) { popText(f.x, GROUND - 210, L('OVERTIME!', '残業！'), '255,140,90'); sfx('rise'); } if (mf > 6 && mf < 14) parts.push({ type: 'aura', x: f.x + f.facing * 30, y: GROUND - f.y - rnd(120, 180), vx: 0, vy: -2, life: 12, max: 12, r: 4, col: '255,140,60' }); },
      hitbox: [10,120,40,195], dmg: 52, stun: 22, bstun: 12, push: 2, launch: true, launchVy: 13, type: 'mid', hitstop: 11, gdrain: 10, onStart(f) { f.invul = 6; } };
    case 'smCoffee': return { id, label: 'Hot Coffee', startup: 10, active: 6, recovery: 20, wind: 'palmW', pose: 'palm',
      hitbox: [20,140,60,150], dmg: 34, stun: 20, bstun: 12, push: 1, stunT: 54, stunKind: 'burn', type: 'mid', hitstop: 8, gdrain: 8,
      onFrame(f, o, mf) { if (mf === 10) sfx('flame'); },
      drawFX(f) { if (f.mf < 9 || f.mf > 20) return; ctx.save(); const x = f.x + f.facing * 60, y = GROUND - f.y - 115;
        for (let i = 0; i < 9; i++) { const k = (f.mf - 9 + i * 0.4) / 10; ctx.fillStyle = `rgba(${110 + i * 6},${70 + i * 4},40,.85)`; ctx.beginPath(); ctx.arc(x + f.facing * k * 90, y - Math.sin(k * Math.PI) * 30 + i * 3, 5 - i * 0.3, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore(); } };
    case 'smBow': return { id, label: 'Dogeza Spring', startup: 36, active: 6, recovery: 16, wind: 'sDogeza', pose: 'sSpring', crouch: true, // a long, deep, shining bow — untouchable while he grovels — then he springs up
      poseFn: (f, mf) => mf < 34 ? POSES.sDogeza : null,
      drawFX(f) { if (f.mf > 36) return; const k = Math.min(1, f.mf / 8), x = f.x, y = GROUND - 30; ctx.save(); ctx.globalCompositeOperation = 'lighter'; // he glows with sincerity: a halo of light, rays, sparkles
        const g = ctx.createRadialGradient(x, y, 6, x, y, 110); g.addColorStop(0, `rgba(255,250,220,${0.6 * k})`); g.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 110, 60, 0, 0, Math.PI * 2); ctx.fill();
        for (let i = 0; i < 8; i++) { const an = -Math.PI + i * Math.PI / 7 + Math.sin(globalT * 0.05) * 0.1; ctx.strokeStyle = `rgba(255,245,200,${0.35 * k})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an) * 120, y + Math.sin(an) * 90); ctx.stroke(); }
        for (let i = 0; i < 5; i++) { const ph = (globalT * 0.05 + i * 0.2) % 1; ctx.fillStyle = `rgba(255,255,230,${(1 - ph) * k})`; ctx.beginPath(); ctx.arc(x + Math.sin(i * 2.3) * 50, y - ph * 70, 2.5, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); },
      hitbox: [10,100,40,180], dmg: 44, stun: 22, bstun: 12, push: 2, launch: true, launchVy: 12, type: 'mid', hitstop: 11, gdrain: 10,
      onFrame(f, o, mf) { if (mf < 34) f.invul = Math.max(f.invul, 2); f.vx = mf > 34 && mf <= 40 ? f.facing * 7 : 0; if (mf === 2) popText(f.x, GROUND - 170, L('I\'M SO SORRY!', '申し訳ございません！'), '230,230,240'); if (mf === 36) { sfx('rise'); popText(f.x, GROUND - 210, L('...JUST KIDDING!', '…なんてね！'), '255,200,120'); } } };
    case 'smAngel': return { id, label: 'Angel Possession', startup: 46, active: 2, recovery: 26, wind: 'saPray', pose: 'sArch', aura: true, manualY: true,
      poseFn: (f, mf) => mf < 30 ? POSES.saPray : null,
      onStart(f) { f.invul = 58; f.move.toDouble = f.ch.possess === 'devil'; },
      onFrame(f, o, mf) { f.vx = 0; f.y = mf < 30 ? 0 : 40 * Math.sin(Math.PI * Math.min(1, (mf - 30) / 16)); if (mf === 2) { sfx('charge'); game.superFlash = { f, name: f.move.toDouble ? 'DOUBLE POSSESSION!!' : 'ANGEL POSSESSION!', t: POSSESS_CUT, max: POSSESS_CUT }; } if (mf === 14) sfx('orb'); if (mf >= 30 && mf % 3 === 0) parts.push({ type: 'spark', x: f.x + vrnd(-30, 30), y: GROUND - f.y - vrnd(30, 190), vx: 0, vy: -1, life: 14, max: 14, col: '255,245,200' }); if (mf === 44) startPossession(f, 'angel'); if (mf >= 46) f.y = 0; },
      drawFX(f) { if (f.mf > (f.move.toDouble ? 52 : 44)) return; const k = Math.min(1, f.mf / 26); ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const g = ctx.createLinearGradient(f.x - 50, 0, f.x + 50, 0); g.addColorStop(0, 'rgba(255,230,150,0)'); g.addColorStop(0.5, `rgba(255,250,220,${0.5 * k})`); g.addColorStop(1, 'rgba(255,230,150,0)');
        ctx.fillStyle = g; ctx.fillRect(f.x - 50, 0, 100, GROUND); ctx.restore(); if (f.move.toDouble) possessDoubleFX(f); else possessFX(f, 'angel'); } };
    case 'smDevil': return { id, label: 'Devil Possession', startup: 46, active: 2, recovery: 26, wind: 'sdIdle', pose: 'sArch', aura: true, manualY: true,
      poseFn: (f, mf) => mf >= 30 && mf < 44 ? (mf % 4 < 2 ? POSES.sdIdle : POSES.sArch) : null, // as it enters him he shakes with rage
      onStart(f) { f.invul = 58; f.move.toDouble = f.ch.possess === 'angel'; },
      onFrame(f, o, mf) { f.vx = mf >= 30 && mf < 44 ? (mf % 2 ? 1.5 : -1.5) : 0; f.y = 0; if (mf === 2) { sfx('flame'); game.superFlash = { f, name: f.move.toDouble ? 'DOUBLE POSSESSION!!' : 'DEVIL POSSESSION!', t: POSSESS_CUT, max: POSSESS_CUT }; } if (mf === 14) sfx('ko'); if (mf === 30) popText(f.x, GROUND - 210, L('GRRAAAAH!!', 'ウオオオォ！！'), '255,80,60'); if (mf >= 30 && mf % 3 === 0) parts.push({ type: 'smoke', x: f.x + vrnd(-20, 20), y: GROUND - f.y - vrnd(140, 190), vx: 0, vy: -1.4, r: 6, vr: 0.4, life: 18, max: 18, col: '200,60,50' }); if (mf === 44) startPossession(f, 'devil'); if (mf % 3 === 0) parts.push({ type: 'aura', x: f.x + rnd(-40, 40), y: GROUND - rnd(0, 60), vx: 0, vy: -rnd(1.5, 3), life: 18, max: 18, r: rnd(3, 6), col: '255,80,40' }); },
      drawFX(f) { if (f.mf > (f.move.toDouble ? 52 : 44)) return; if (f.move.toDouble) possessDoubleFX(f); else possessFX(f, 'devil'); } };

    // ---- the devil: everything on J and K is done with his tail, and reaches further ----
    case 'sdWhip': return { id, label: 'Tail Whip', startup: 12, active: 6, recovery: 20, wind: 'sdIdle', pose: 'sdIdle', tail: { a0: 2.7, a1: -0.05, len: 175, h: 95 }, // ← ← + J: the tail cracks out across at waist height
      hitbox: [30,205,60,140], dmg: 40, stun: 22, bstun: 12, push: 3, type: 'mid', hitstop: 9, gdrain: 10, onFrame(f, o, mf) { if (mf === 10) sfx('swing'); } };
    case 'sdTailDrop': return { id, label: 'Tail Hammer', startup: 18, active: 6, recovery: 22, wind: 'sdIdle', pose: 'sArch', overhead: true, tail: { a0: 2.2, a1: -0.7, len: 185, h: 120 }, // ← ← ↑ + J: he turns his back, looks over his shoulder, and brings the tail down from overhead (guard it standing)
      hitbox: [30,190,0,220], dmg: 46, stun: 24, bstun: 14, push: 2, kd: true, kdVx: 3, kdVy: 6, type: 'mid', hitstop: 11, gdrain: 12,
      onFrame(f, o, mf) { if (mf === 2) popText(f.x, GROUND - 200, L('LOOK OUT—', '上だ——'), '255,90,70'); if (mf === 16) sfx('swing'); if (mf === 19) { cracks(f.x + f.facing * 150); game.shake = Math.max(game.shake, 5); parts.push({ type: 'ring', x: f.x + f.facing * 150, y: GROUND - 6, r: 10, vr: 8, life: 14, max: 14, col: '255,100,50' }); } } };
    case 'sdTailLash': return { id, label: 'Tail Lash', startup: 10, active: 6, recovery: 20, wind: 'sdIdle', pose: 'sdIdle', selfMove: true, tail: { a0: 2.5, a1: 0.1, len: 190, h: 100 }, // → → + J: a step in and a long lash of the tail
      hitbox: [30,220,50,140], dmg: 42, stun: 22, bstun: 12, push: 3, type: 'mid', hitstop: 9, gdrain: 10,
      onFrame(f, o, mf) { f.vx = mf <= 8 ? f.facing * 4 : f.vx * 0.6; if (mf === 9) sfx('swing'); } };
    case 'sdTailUpper': return { id, label: 'Tail Hook', startup: 9, active: 7, recovery: 24, wind: 'sdIdle', pose: 'sdIdle', tail: { a0: -0.5, a1: 1.4, len: 170, h: 70 }, // → → + K: the tail scoops up under them and flings them into the air
      hitbox: [30,190,0,210], dmg: 48, stun: 22, bstun: 12, push: 2, launch: true, launchVy: 13, type: 'mid', hitstop: 11, gdrain: 10, onFrame(f, o, mf) { if (mf === 8) sfx('rise'); } };
    case 'sdChainB': return { id, label: 'Hell Chain', startup: 12, active: 6, recovery: 18, wind: 'sdIdle', pose: 'sdBeckon', // ← ← → + J: the chain lashes out from his belly, at waist height
      hitbox: [40,290,40,120], dmg: 24, stun: 30, bstun: 12, push: 0, type: 'mid', hitstop: 8, gdrain: 8,
      onFrame(f, o, mf) { const mv = f.move; f.vx = 0; if (mf === 12) sfx('throw');
        if (f.hitConnected && f.lastResult !== 'block' && !mv.pulled) { mv.pulled = true; mv.pullT = 10; popText(o.x, GROUND - 200, L('GET OVER HERE!', 'こっちへ来い！'), '255,90,60'); }
        if (mv.pullT > 0) { mv.pullT--; o.x = lerp(o.x, clamp(f.x + f.facing * 70, WALL_L, WALL_R), 0.35); o.stun = Math.max(o.stun, 22); }
        if (mv.pulled) hitRecover(f, 6); },
      drawFX(f, o) { const mv = f.move; if (f.mf < 10 || f.mf > 30) return; const s0 = f.ch.scale, x0 = f.x + f.facing * 20 * s0, y0 = GROUND - f.y - 82 * s0; // from his belly
        const tip = mv.pulled && o ? o.x : f.x + f.facing * Math.min(290, (f.mf - 10) * 60), ty = mv.pulled && o ? GROUND - o.y - 80 : y0;
        ctx.save(); ctx.strokeStyle = '#3a2a2a'; ctx.lineWidth = 5; ctx.setLineDash([8, 5]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(tip, ty); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = '#ff6a3a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(tip, ty); ctx.stroke(); ctx.fillStyle = '#8a1414'; ctx.beginPath(); ctx.moveTo(tip + f.facing * 12, ty); ctx.lineTo(tip, ty - 8); ctx.lineTo(tip, ty + 8); ctx.closePath(); ctx.fill(); ctx.restore(); } };
    // ---- the angel: rays of light from his eyes ----
    case 'saRay': return angelRay(id, 'Heaven\u2019s Gaze', 'mid'); // ← ← + J: a ray from his eyes, at waist height
    case 'saRayLow': return angelRay(id, 'Humble Gaze', 'low'); // ← ← ↓ + J: the ray aimed at their feet
    case 'saRayFly': return { id, label: 'Ascending Gaze', startup: 26, active: 6, recovery: 20, wind: 'saPray', pose: 'saPray', manualY: true, hitbox: null, // ← ← ↑ + J: he soars up out of reach (invincible while rising) and fires the ray down at them
      onFrame(f, o, mf) { f.vx = 0; f.y = mf <= 18 ? 170 * Math.sin(Math.PI / 2 * mf / 18) : mf <= 34 ? 170 : Math.max(0, 170 - (mf - 34) * 12); if (mf <= 26) f.invul = Math.max(f.invul, 2);
        if (mf === 2) { sfx('rise'); for (let i = 0; i < 8; i++) parts.push({ type: 'aura', x: f.x + vrnd(-20, 20), y: GROUND - 20, vx: vrnd(-1, 1), vy: -vrnd(2, 4), life: 18, max: 18, r: 3, col: '255,245,210' }); }
        if (mf === 26) { sfx('beam'); if (Math.abs(o.x - f.x) < 460) columnHit(f, o, { dmg: 38, stun: 22, bstun: 12, push: 2, type: 'mid', hitstop: 9, gdrain: 10, label: 'Ascending Gaze' }); } if (mf >= 40) f.y = 0; },
      drawFX(f, o) { if (f.mf < 22 || f.mf > 32 || !o) return; const e = eyePos(f), tx = o.x, ty = GROUND - o.y - 90 * o.ch.scale; rayDraw(e, [tx, ty], 1 - Math.max(0, f.mf - 27) / 6); } };
    case 'saDive': return { id, label: 'Seraph Dive', startup: 24, active: 14, recovery: 22, wind: 'saPray', pose: 'saPray', manualY: true, armorDive: true, // ← ← → + J: up into the air (hit him now!), then a dive onto them — armored all the way down
      hitbox: [-10,90,0,150], dmg: 50, stun: 24, bstun: 14, push: 3, kd: true, kdVx: 6, kdVy: 8, type: 'mid', hitstop: 12, gdrain: 12,
      onFrame(f, o, mf) { const mv = f.move;
        if (mf <= 18) { f.y = 150 * Math.sin(Math.PI / 2 * mf / 18); f.vx = 0; if (mf === 2) sfx('rise'); }
        else if (mf < 24) { f.y = 150; f.vx = 0; }
        else { if (mf === 24) { mv.dx = (clamp(o.x, WALL_L, WALL_R) - f.x) / 12; sfx('swing'); } f.y = Math.max(0, 150 - (mf - 24) * 13); f.vx = mf - 24 < 12 ? mv.dx : 0; if (mf % 2 === 0) parts.push({ type: 'aura', x: f.x, y: GROUND - f.y - 60, vx: 0, vy: 0, life: 14, max: 14, r: 8, col: '255,240,190' }); }
        if (mf > 24 && f.y <= 0 && !mv.landed) { mv.landed = true; parts.push({ type: 'ring', x: f.x, y: GROUND - 6, r: 12, vr: 9, life: 16, max: 16, col: '255,240,190' }); game.shake = Math.max(game.shake, 5); } } };
    // the angel: still and prayerful; he strikes with fists of light, and steps away
    case 'saJab': return { id, label: 'Divine Jab', startup: 5, active: 3, recovery: 14, wind: 'saPray', pose: 'straight', selfMove: true, burst: [90, 118],
      hitbox: [10,105,80,140], dmg: 30, stun: 20, bstun: 12, push: 2, type: 'mid', hitstop: 8, gdrain: 6,
      onFrame(f, o, mf) { if (mf <= 5 && Math.abs(o.x - f.x) > 70) f.vx = f.facing * 6; else hopBack(f, 8, 12, 8); if (mf === 5) sfx('orb'); } };
    case 'saFist': return { id, label: 'Halo Fist', startup: 12, active: 4, recovery: 20, wind: 'saPray', pose: 'straight', selfMove: true, burst: [100, 118],
      hitbox: [10,125,70,150], dmg: 46, stun: 22, bstun: 14, push: 2, stunT: 56, stunKind: 'holy', type: 'mid', hitstop: 12, gdrain: 10,
      onFrame(f, o, mf) { if (mf <= 12 && Math.abs(o.x - f.x) > 80) f.vx = f.facing * 5; else hopBack(f, 17, 14, 8); if (mf === 12) { sfx('hitH'); parts.push({ type: 'lbeam', x: f.x + f.facing * 90, w: 22, life: 10, max: 10 }); } },
      drawFX(f) { if (f.mf < 6 || f.mf > 18) return; const s = f.ch.scale, x = f.x + f.facing * (f.mf >= 12 ? 92 : 30) * s, y = GROUND - f.y - 118 * s; // a halo around the fist
        fxLighter(() => { ctx.strokeStyle = 'rgba(255,220,110,.95)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y, 8, 22, 0, 0, Math.PI * 2); ctx.stroke(); }); } };
    case 'saStep': return { id, label: 'Feather Step', startup: 2, active: 14, recovery: 8, wind: 'saPray', pose: 'saPray', selfMove: true,
      onStart(f) { f.invul = 12; sfx('vanish'); },
      onFrame(f, o, mf) { f.vx = mf <= 14 ? -f.facing * 10 * (1 - mf / 18) : 0; if (mf % 2 === 0 && mf < 14) parts.push({ type: 'spark', x: f.x + f.facing * 10, y: GROUND - rnd(40, 150), vx: f.facing * rnd(1, 3), vy: rnd(-1, 1), life: 16, max: 16, col: '255,250,230' }); } };
    // the devil: low, fast and wild; he lures them in
    case 'sdLunge': return { id, label: 'Beast Lunge', startup: 6, active: 10, recovery: 14, wind: 'sdIdle', pose: 'kClawDown', manualY: true, noPush: true, selfMove: true, speedFx: true,
      hitbox: [0,120,30,150], multi: 2, interval: 5, dmg: 18, lastDmg: 24, stun: 20, bstun: 10, push: 1, lastPush: 4, type: 'mid', hitstop: 6, gdrain: 8,
      onStart(f, o) { f.ln = { x0: f.x, tx: clamp(o.x - f.facing * 50, WALL_L, WALL_R) }; sfx('rise'); },
      onFrame(f, o, mf) { if (mf <= 16) { const e = mf / 16; f.x = lerp(f.ln.x0, f.ln.tx, ease(e)); f.y = 40 * Math.sin(Math.PI * e); } else f.y = 0;
        if (mf === 7 || mf === 12) clawSwipe(f, [80, 110, mf === 7 ? 0.9 : -0.9, 54, '255,120,90']); } };
    case 'sdMaul': return { id, label: 'Savage Maul', startup: 6, active: 22, recovery: 16, wind: 'sdIdle', pose: 'kClawX', selfMove: true,
      hitbox: [10,130,30,160], multi: 5, interval: 4, dmg: 9, lastDmg: 26, stun: 18, bstun: 10, push: 0.8, lastPush: 8, kd: true, kdVx: 11, kdVy: 8, type: 'mid', hitstop: 4, gdrain: 6,
      poseFn: (f, mf) => mf > 6 && mf <= 28 ? [POSES.kClawUp, POSES.kClawDown, POSES.kClawX][Math.floor(mf / 2) % 3] : null,
      onFrame(f, o, mf) { if (mf > 6 && mf <= 28 && Math.abs(o.x - f.x) > 70) f.vx = f.facing * 3; else f.vx *= 0.7; if (mf > 6 && mf <= 28 && mf % 4 === 3) clawSwipe(f, [85, 105 + (mf % 8 < 4 ? 20 : -15), (mf % 8 < 4 ? 1 : -1) * 0.9, 56, '255,120,90']); if (mf === 7) sfx('flame'); } };
    case 'sdBeckon': return { id, label: 'Beckon', startup: 3, active: 34, recovery: 16, wind: 'sdBeckon', pose: 'sdBeckon', parry: true, parryInto: 'sdBeckonMaul', fx: 'ward',
      onFrame(f, o, mf) { f.vx = 0; if (mf === 3) popText(f.x, GROUND - 200, L('COME HERE~', 'おいで～'), '255,120,90'); if (mf % 8 === 0) parts.push({ type: 'aura', x: f.x + f.facing * 60, y: GROUND - 120, vx: -f.facing, vy: -0.5, life: 14, max: 14, r: 4, col: '255,90,60' }); } };
    case 'sdBeckonMaul': return { id, label: 'Gotcha!', startup: 3, active: 14, recovery: 16, wind: 'sdIdle', pose: 'kClawX', noGrace: true, selfMove: true,
      hitbox: [0,130,30,170], multi: 3, interval: 4, dmg: 18, lastDmg: 30, stun: 22, bstun: 12, push: 1, lastPush: 2, launch: true, launchVy: 12.5, type: 'mid', hitstop: 8, gdrain: 10,
      onFrame(f, o, mf) { if (mf === 3) { popText(f.x, GROUND - 200, L('GOTCHA!', 'つかまえた！'), '255,90,60'); sfx('flame'); } if (mf % 4 === 3 && mf < 16) clawSwipe(f, [70, 120, (mf % 8 < 4 ? 1 : -1), 60, '255,120,90']); } };
    case 'sdChain': return { id, label: 'Hell Chain', startup: 12, active: 6, recovery: 18, wind: 'sdIdle', pose: 'blast',
      hitbox: [40,290,60,150], dmg: 24, stun: 30, bstun: 12, push: 0, type: 'mid', hitstop: 8, gdrain: 8,
      onFrame(f, o, mf) { const mv = f.move; f.vx = 0; if (mf === 12) sfx('throw');
        if (f.hitConnected && f.lastResult !== 'block' && !mv.pulled) { mv.pulled = true; mv.pullT = 10; popText(o.x, GROUND - 200, L('GET OVER HERE!', 'こっちへ来い！'), '255,90,60'); }
        if (mv.pullT > 0) { mv.pullT--; o.x = lerp(o.x, clamp(f.x + f.facing * 70, WALL_L, WALL_R), 0.35); o.stun = Math.max(o.stun, 22); }
        if (mv.pulled) hitRecover(f, 6); },
      drawFX(f, o) { const mv = f.move; if (f.mf < 10 || f.mf > 30) return; const s = f.ch.scale, x0 = f.x + f.facing * 40 * s, y0 = GROUND - f.y - 120 * s;
        const tip = mv.pulled && o ? o.x : f.x + f.facing * Math.min(290, (f.mf - 10) * 60), ty = mv.pulled && o ? GROUND - o.y - 100 : y0;
        ctx.save(); ctx.strokeStyle = '#2b1010'; ctx.lineWidth = 4; ctx.setLineDash([7, 4]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(tip, ty); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.moveTo(tip + f.facing * 12, ty); ctx.lineTo(tip, ty - 7); ctx.lineTo(tip, ty + 7); ctx.closePath(); ctx.fill(); ctx.restore(); } };
    case 'smDeadline': return { id, super: true, name: 'ULTIMATE DOGEZA', label: 'Ultimate Dogeza', startup: 14, active: 44, recovery: 22, wind: 'sBow', pose: 'sDogeza', aura: true, selfMove: true,
      hitbox: [0,160,0,62], multi: 8, interval: 5, dmg: 16, lastDmg: 70, low: true, stun: 22, bstun: 10, push: 0.4, hold: true, kd: false, type: 'low', hitstop: 5, gdrain: 8, superHit: true, // the deepest apology ever made: flat on the floor, sliding at them — low hits (jump it, or guard crouching)
      onStart(f) { f.invul = 22; popText(f.x, GROUND - 200, L('I AM SO SORRY!!', '誠に申し訳ございません！！'), '255,235,200'); },
      onFrame(f, o, mf) { if (mf <= 14) { f.vx = 0; return; } if (mf <= 58 && Math.abs(o.x - f.x) > 70) f.vx = f.facing * 10; else f.vx *= 0.6;
        if (mf % 4 === 0) { parts.push({ type: 'ring', x: f.x + f.facing * 60, y: GROUND - 8, r: 10, vr: 6, life: 12, max: 12, col: '255,240,210' }); cloudPuff(f.x - f.facing * 30, GROUND - 4); }
        if (mf === 58 && f.hitConnected) { sfx('hitH'); game.shake = Math.max(game.shake, 9); parts.push({ type: 'ring', x: f.x, y: GROUND - 20, r: 20, vr: 14, life: 18, max: 18, col: '255,230,170' }); } } };
    case 'saFeather': return { id, label: 'Feather Shot', startup: 10, active: 2, recovery: 16, wind: 'palmW', pose: 'blast', proj: 'feather', limit: 3,
      onFrame(f, o, mf) { if (mf === 10) { sfx('orb'); for (const vy of [-1.5, 0, 1.5]) spawnPJ(f, 'feather', { x: f.x + f.facing * 50, y: 120, vx: f.facing * 12, vy, life: 50, r: 10, h: { dmg: 16, stun: 16, bstun: 8, push: 1.2, gdrain: 5, label: 'Feather Shot' } }); } } };
    case 'saHalo': return { id, label: 'Halo Throw', startup: 12, active: 2, recovery: 18, wind: 'charge', pose: 'blast', proj: 'haloP', limit: 1,
      onFrame(f, o, mf) { if (mf === 12) { sfx('throw'); spawnPJ(f, 'haloP', { x: f.x + f.facing * 30, y: 160, vx: f.facing * 12, life: 110, r: 18, hits: 2, interval: 14, boomerang: 24, h: { dmg: 28, stun: 20, bstun: 10, push: 2, gdrain: 8, juggle: true, jugVy: 6, label: 'Halo Throw' } }); } } };
    case 'saGlide': return { id, label: 'Angel Glide', startup: 6, active: 20, recovery: 14, wind: 'jump', pose: 'blast', manualY: true, noPush: true, selfMove: true, speedFx: true, projInvul: [1, 26],
      hitbox: [0,130,30,160], dmg: 36, stun: 22, bstun: 12, push: 3, kd: true, kdVx: 8, kdVy: 8, type: 'mid', hitstop: 10, gdrain: 10,
      onFrame(f, o, mf) { f.vx = mf <= 26 && !f.hitConnected ? f.facing * 9 : f.hitConnected ? -f.facing * 7 : f.vx * 0.6; f.y = mf <= 26 ? 30 * Math.sin(Math.PI * mf / 26) : 0; if (mf % 3 === 0) parts.push({ type: 'spark', x: f.x - f.facing * 20, y: GROUND - f.y - 120, vx: -f.facing * 2, vy: 1, life: 14, max: 14, col: '255,250,230' }); } };
    case 'saAscend': return { id, label: 'Holy Ascension', startup: 6, active: 10, recovery: 20, wind: 'uppercutW', pose: 'uppercut', manualY: true, noPush: true,
      hitbox: [0,130,40,230], dmg: 52, stun: 22, bstun: 12, push: 2, launch: true, launchVy: 13.5, type: 'mid', hitstop: 11, gdrain: 10,
      onStart(f) { f.invul = 8; },
      onFrame(f, o, mf) { f.vx = 0; f.y = mf <= 16 ? 120 * Math.sin(Math.PI / 2 * mf / 16) : Math.max(0, 120 - (mf - 16) * 9); if (mf === 6) sfx('rise'); if (mf % 2 === 0 && mf < 16) parts.push({ type: 'spark', x: f.x + rnd(-20, 20), y: GROUND - f.y - rnd(40, 160), vx: 0, vy: 2, life: 14, max: 14, col: '255,245,200' }); } };
    case 'saBless': return { id, label: 'Blessing', startup: 8, active: 24, recovery: 14, wind: 'charge', pose: 'win', heal: true,
      onFrame(f, o, mf) { f.vx = 0; if (mf > 8 && mf <= 32) { if (f.ch.possess === 'angel') { f.hp = Math.min(1000, f.hp + 2.5); f.healT = 60; } f.guard = Math.min(100, f.guard + 1.6); if (mf % 8 === 0) { sfx('orb'); parts.push({ type: 'lbeam', x: f.x, w: 30, life: 12, max: 12 }); } } } };
    case 'saWard': return { id, label: 'Holy Ward', startup: 3, active: 26, recovery: 16, wind: 'charge', pose: 'blast', deflect: [2, 28], destroysProj: true,
      onFrame(f, o, mf) { f.vx = 0; if (mf === 3) sfx('orb'); },
      drawFX(f) { if (f.mf < 2 || f.mf > 28) return; const cx = f.x + f.facing * 30, cy = GROUND - f.y - 100; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,230,140,.8)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(cx, cy, 30, 80, 0, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = 'rgba(255,240,180,.15)'; ctx.fill(); ctx.restore(); } };
    case 'saHeaven': return { id, super: true, name: "HEAVEN'S GATE", label: "Heaven's Gate", startup: 18, active: 40, recovery: 18, wind: 'saKneelPray', pose: 'saKneelPray', aura: true, // he prays to heaven, and holy rays pour down on them
      drawFX(f, o) { if (!o || f.mf > 60) return; const k = Math.min(1, f.mf / 18); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, 0, 0, GROUND); g.addColorStop(0, `rgba(255,245,200,${0.35 * k})`); g.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = g; ctx.fillRect(f.x - 46, 0, 92, GROUND - f.y); if (f.mf >= 18) { ctx.fillStyle = `rgba(255,250,220,${0.25})`; ctx.fillRect(o.x - 70, 0, 140, GROUND); } ctx.restore(); }, // a shaft of light on him as he prays; then on them
      onStart(f) { f.invul = 60; },
      onFrame(f, o, mf) { f.vx = 0; if (mf < 18) return; if (mf <= 46 && (mf - 18) % 7 === 0) { parts.push({ type: 'lbeam', x: o.x + rnd(-20, 20), w: 40, life: 14, max: 14 }); sfx('orb'); if (Math.abs(o.x - f.x) < 600) columnHit(f, o, { dmg: 16, stun: 22, bstun: 10, push: 0.3, hold: true, juggle: true, jugVy: 3, label: "Heaven's Gate", superHit: true }); }
        if (mf === 52) { parts.push({ type: 'lbeam', x: o.x, w: 80, life: 20, max: 20 }); sfx('hitH'); columnHit(f, o, { dmg: 80, stun: 24, bstun: 12, push: 3, launch: true, launchVy: 13, hitstop: 14, label: "Heaven's Gate", superHit: true }); game.shake = Math.max(game.shake, 8); } } };
    // the devil's moves
    case 'sdFire': return { id, label: 'Hellfire', startup: 12, active: 2, recovery: 18, wind: 'palmW', pose: 'blast', proj: 'hellfire', limit: 1,
      onFrame(f, o, mf) { if (mf === 12) { sfx('flame'); spawnPJ(f, 'hellfire', { x: f.x + f.facing * 50, y: 115, vx: f.facing * 9, life: 70, r: 18, h: { dmg: 42, stun: 22, bstun: 12, push: 3, gdrain: 10, label: 'Hellfire' } }); } } };
    case 'sdFork': return { id, label: 'Pitchfork Thrust', startup: 14, active: 6, recovery: 22, wind: 'thrustW', pose: 'thrust', selfMove: true,
      hitbox: [20,245,80,140], dmg: 52, stun: 22, bstun: 14, push: 3, cpLaunch: true, launchVy: 12, kd: true, kdVx: 8, type: 'mid', hitstop: 12, gdrain: 16,
      onFrame(f, o, mf) { if (mf <= 10 && Math.abs(o.x - f.x) > 120) f.vx = f.facing * 4; else f.vx *= 0.6; if (mf === 14) sfx('slash'); },
      drawFX(f) { if (f.mf < 10 || f.mf > 26) return; const k = Math.min(1, (f.mf - 10) / 4), y = GROUND - f.y - 112, x0 = f.x + f.facing * 20, x1 = f.x + f.facing * (40 + 200 * k);
        ctx.save(); ctx.strokeStyle = '#2b1010'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 3.5;
        for (const dy of [-10, 0, 10]) { ctx.beginPath(); ctx.moveTo(x1, y + dy); ctx.lineTo(x1 + f.facing * 22, y + dy); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(x1, y - 10); ctx.lineTo(x1, y + 10); ctx.stroke(); ctx.restore(); } };
    case 'sdClaw': return { id, label: 'Shadow Claw', startup: 8, active: 16, recovery: 18, wind: 'palmW', pose: 'kClaw', selfMove: true, speedFx: true,
      hitbox: [10,145,40,170], multi: 3, interval: 5, dmg: 18, lastDmg: 30, stun: 22, bstun: 12, push: 1, lastPush: 2, launch: true, launchVy: 11.5, type: 'mid', hitstop: 6, gdrain: 10,
      onFrame(f, o, mf) { if (mf > 4 && mf <= 16 && Math.abs(o.x - f.x) > 60) f.vx = f.facing * 9; else f.vx *= 0.6; if (mf % 5 === 0 && mf > 8) { sfx('slash'); parts.push({ type: 'slashx', x: f.x + f.facing * 70, y: GROUND - 120, r: 24, life: 8, max: 8, col: '255,80,60', rot: rnd(-0.6, 0.6) }); } } };
    case 'sdUpper': return { id, label: 'Demon Uppercut', startup: 6, active: 8, recovery: 22, wind: 'uppercutW', pose: 'uppercut',
      hitbox: [10,125,40,225], dmg: 58, stun: 22, bstun: 12, push: 2, launch: true, launchVy: 13.5, type: 'mid', hitstop: 12, gdrain: 10,
      onStart(f) { f.invul = 6; },
      onFrame(f, o, mf) { if (mf === 6) { sfx('flame'); parts.push({ type: 'wcol', x: f.x + f.facing * 40, w: 40, life: 16, max: 16, col: '255,110,40' }); } } };
    case 'sdBreath': return { id, label: 'Brimstone Breath', startup: 12, active: 18, recovery: 20, wind: 'charge', pose: 'blast',
      hitbox: [30,200,70,150], multi: 3, interval: 6, dmg: 14, lastDmg: 20, stun: 18, bstun: 10, push: 1, stunT: 60, stunKind: 'burn', type: 'mid', hitstop: 4, chip: true, gdrain: 8,
      onFrame(f, o, mf) { f.vx = 0; if (mf === 12) sfx('flame'); if (mf > 12 && mf <= 30) for (let i = 0; i < 2; i++) parts.push({ type: 'aura', x: f.x + f.facing * rnd(40, 200), y: GROUND - f.y - rnd(80, 150), vx: f.facing * rnd(1, 3), vy: -rnd(0.5, 1.5), life: 14, max: 14, r: rnd(4, 8), col: '255,110,40' }); } };
    case 'sdDrain': return { id, label: 'Soul Drain', startup: 8, active: 4, recovery: 26, wind: 'sdIdle', pose: 'kGrab', grab: true, tail: { a0: 2.6, a1: 0.1, len: 170, h: 100 }, // the tail coils round them and drinks their soul
      hitbox: [10,190,20,160], dmg: 60, stun: 24, bstun: 12, push: 3, kd: true, kdVx: 6, kdVy: 8, type: 'mid', hitstop: 14, gdrain: 0,
      onFrame(f, o, mf) { if (f.hitConnected && f.lastResult !== 'block' && !f.move.drained) { f.move.drained = true; sfx('vanish');
        for (let i = 0; i < 10; i++) parts.push({ type: 'aura', x: o.x + rnd(-20, 20), y: GROUND - o.y - rnd(40, 140), vx: (f.x - o.x) / 18, vy: -0.4, life: 18, max: 18, r: rnd(3, 5), col: '170,60,200' }); } } };
    case 'sdInferno': return { id, super: true, name: 'HELLISH FRENZY', label: 'Hellish Frenzy', startup: 16, active: 68, recovery: 20, wind: 'sdIdle', pose: 'sdIdle', aura: true, selfMove: true, tail: { a0: 2.5, a1: 0.1, len: 200, h: 100 },
      onStart(f) { f.invul = 30; popText(f.x, GROUND - 220, L('GRRAAAAH!!', 'グオオオオ！！'), '255,90,60'); },
      onFrame(f, o, mf) { const mv = f.move; f.vx = Math.abs(o.x - f.x) > 150 ? f.facing * 6 : f.vx * 0.5; if (mf < 16) return;
        const SW = [ { a0: 2.6, a1: 0.9, h: 160, y: [110, 220], over: true }, { a0: 2.4, a1: 0.1, h: 100, y: [60, 150] }, { a0: -1.2, a1: 0.3, h: 30, y: [0, 60], low: true } ]; // high (overhead), mid, low
        if (mf <= 79 && (mf - 16) % 7 === 0) { const n = (mf - 16) / 7, // (one strike every 7 frames)
           sw = SW[[0, 2, 1, 2, 0, 1, 2, 0, 1, 2][n] || 1], last = n === 9; mv.tail = { a0: sw.a0, a1: sw.a1, len: 200, h: sw.h }; mv.tailS = mf; sfx('swing');
          zoneHit(f, o, { dmg: last ? 60 : 16, stun: 20, bstun: 9, push: last ? 6 : 0.5, type: 'mid', // (every strike is a mid: guard it either way)
             hold: !last, juggle: !last, jugVy: 3, launch: last, launchVy: 12, hitstop: last ? 12 : 4, label: 'Hellish Frenzy', superHit: true },
            { x0: Math.min(f.x, f.x + f.facing * 230), x1: Math.max(f.x, f.x + f.facing * 230), y0: 40, y1: Math.max(128, o.y + 80) }); } } }; // (it follows anyone who jumps; the tail swings high, mid and low, but it always strikes the body: a mid, guarded standing or crouching)
    case 'greatSage': return { id, super: true, name: 'GREAT SAGE PILLAR', label: 'Great Sage Pillar', startup: 18, active: 40, recovery: 12, wind: 'slamW', pose: 'winB', aura: true, spinWind: true, spinStaff: true,
      onStart(f) { f.invul = 26; },
      onFrame(f, o, mf) { if (mf === 18) spawnPillar(f, o, f.move.lockX); },
      drawFX(f) { const mv = f.move; if (mv.lockX == null || f.mf > 22) return; const x = clamp(f.x + clamp(mv.lockX - f.x, -420, 420), WALL_L, WALL_R), k = (globalT % 20) / 20; // the golden mark where it will land
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,205,110,.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, GROUND - 4, 62, 13, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = `rgba(255,230,160,${1 - k})`; ctx.beginPath(); ctx.ellipse(x, GROUND - 4, 62 * (1 - k * 0.6), 13 * (1 - k * 0.6), 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); } };
    // Mei's juggle versions
    case 'jExtend': return { id, label: 'Staff Lift', startup: 5, active: 14, recovery: 14, wind: 'thrustW', pose: 'thrustUp', staffExt: 70,
      hitbox: [10,215,40,250], multi: 3, interval: 5, dmg: 16, lastDmg: 30, jugVy: 6.5, lastJugVy: 10.5, fixedLift: true, neutralLaunch: true, launchVy: 11, type: 'mid', hitstop: 4, gdrain: 4,
      trail: { cx: 20, cy: 100, r: 120, a0: -20, a1: 80, col: '255,205,110' } };
    case 'jVault': return { id, label: 'Vault Spike', startup: 8, active: 12, recovery: 14, wind: 'vault', pose: 'staffSlamAir', manualY: true, noPush: true, selfMove: true,
      hitbox: [-30,110,-40,100], meteor: true, kd: true, kdVx: 1, kdVy: -8, dmg: 45, type: 'mid', hitstop: 12, gdrain: 10,
      trail: { cx: 20, cy: 90, r: 120, a0: 110, a1: -30, col: '255,205,110' },
      onStart(f, o) { f.hj = { x0: f.x, tx: clamp(o.x - f.facing * 30, WALL_L, WALL_R), top: Math.min(240, o.y + 80) }; sfx('rise'); },
      onFrame(f, o, mf) {
        f.vx = 0;
        if (mf <= 8) { const e = mf / 8; f.x = lerp(f.hj.x0, f.hj.tx, e); f.y = f.hj.top * Math.sin(e * Math.PI / 2); }
        else if (mf <= 20) f.y = Math.max(0, f.hj.top * (1 - (mf - 8) / 12));
        if (mf === 20) { f.y = 0; dustAt(f.x, true); game.shake = Math.max(game.shake, 4); }
      } };
    case 'jCloud': return { id, label: 'Cloud Chase', startup: 6, active: 18, recovery: 6, wind: 'cloudSit', pose: 'airStaffWhirl', spinStaff: true, manualY: true, noPush: true, selfMove: true, airFollow: true,
      hitbox: [-30,110,0,150], multi: 3, interval: 6, dmg: 15, lastDmg: 22, jugVy: 5.5, fixedLift: true, type: 'mid', hitstop: 4, gdrain: 6,
      onStart(f, o) { f.tj = { x0: f.x, tx: clamp(o.x - f.facing * 35, WALL_L, WALL_R), top: clamp(o.y + 10, 60, 210) }; sfx('rise'); cloudPuff(f.x, GROUND); },
      onFrame(f, o, mf) { // rides a cloud up to them, staff whirling; she stays airborne for an air string
        f.vx = 0;
        if (mf <= 8) { const e = mf / 8; f.x = lerp(f.tj.x0, f.tj.tx, e); f.y = f.tj.top * e; }
        else if (mf <= 24) { f.y = Math.max(f.y, f.y + (o.y + 10 - f.y) * 0.3); f.x = clamp(o.x - f.facing * 35, WALL_L, WALL_R); }
        if (mf % 3 === 0) cloudPuff(f.x, GROUND - f.y + 6);
      } };
    case 'jWindmill': return { id, label: 'Rising Windmill', startup: 5, active: 22, recovery: 12, wind: 'thrustW', pose: 'staffUp', spinStaff: true,
      hitbox: [10,175,40,240], multi: 4, interval: 5, dmg: 13, lastDmg: 22, jugVy: 5.5, fixedLift: true, type: 'mid', hitstop: 4, gdrain: 4 };
    case 'jPoleKick': return { id, label: 'Pole Rocket Kick', startup: 6, active: 6, recovery: 18, wind: 'thrustW', pose: 'poleKick', spin: [4, 12],
      hitbox: [10,180,40,240], dmg: 50, kd: true, kdVx: 14, kdVy: 9, type: 'mid', hitstop: 13, gdrain: 10, spinStaff: true,
      trail: { cx: 0, cy: 90, r: 110, a0: -60, a1: 80, col: '255,205,110' } };
    // ----- Lyra -----
    case 'phantomFist': return { id, label: 'Crystal Shard', startup: 12, active: 2, recovery: 24, wind: 'psyW', pose: 'psyPush', proj: 'pfist', limit: 1,
      onFrame(f, o, mf) { if (mf === 12) { const tip = lyraTip(f); spawnPFist(f, { x: tip[0] + f.facing * 10, y: Math.max(60, GROUND - tip[1]), vx: f.facing * 7, vy: 0, sc: 0.7, dmg: 40, push: 6, life: 110 }); } } }; // (the shard flies out of the crystal on her staff)
    case 'crushFist': return { id, label: 'Falling Star', startup: 24, active: 4, recovery: 12, wind: 'psyRaise', pose: 'psyDown', proj: 'crush', limit: 1,
      onFrame(f, o, mf) { if (mf === 6) spawnCrush(f, o, false); } };
    case 'psyLift': return { id, label: 'Psychic Lift', startup: 20, active: 4, recovery: 14, wind: 'psyW', pose: 'psyUp', proj: 'lift', limit: 1,
      onFrame(f, o, mf) { if (mf === 4) spawnLift(f, o, false); } };
    case 'forceWave': return { id, label: 'Spirit Fist', startup: 10, active: 9, recovery: 18, wind: 'psyW', pose: 'psyPush', giantFist: [135, 105, 1.15],
      hitbox: [30,175,30,170], multi: 3, interval: 3, dmg: 18, lastDmg: 30, stun: 18, bstun: 10, push: 2, lastPush: 12, kd: true, kdVx: 10, kdVy: 6, type: 'mid', hitstop: 5, chip: true, gdrain: 8,
      onFrame(f, o, mf) { if (mf === 10) sfx('palm'); } };
    case 'orbBurst': return { id, label: 'Orb Burst', startup: 12, active: 12, recovery: 18, wind: 'psyCast', pose: 'psyBoth',
      onFrame(f, o, mf) { // every orb (or one from her hand, if she has none) fires a ray at them
        const n = Math.max(1, Math.min(5, orbCount(f)));
        if (mf >= 12 && (mf - 12) % 3 === 0 && (mf - 12) / 3 < n) burstRay(f, o, (mf - 12) / 3, n);
      } };
    case 'tripleRay': return { id, label: 'Triple Ray', startup: 14, active: 4, recovery: 20, wind: 'psyCast', pose: 'psyBoth',
      onFrame(f, o, mf) { if (mf === 14) tripleRay(f, o); } };
    case 'mindGrip': return { id, label: 'Mind Grip', startup: 16, active: 6, recovery: 20, wind: 'psyW', pose: 'psyPush', psyFist: [150, 100, 0.85],
      hitbox: [40,255,20,165], dmg: 30, stun: 18, bstun: 10, push: 0, stunT: 62, stunKind: 'psy', type: 'mid', hitstop: 8, gdrain: 10 };
    case 'teleport': return { id, label: 'Teleport', startup: 6, active: 1, recovery: 12, wind: 'psyCast', pose: 'psyCast', selfMove: true,
      follow: { from: 3, to: 18, at: 12, opts: { lp: 'tpStrike', hp: 'tpStrike' } },
      onFrame(f, o, mf) { // vanish, then reappear behind them (or closer, if they're far)
        if (mf === 2) { f.hidden = true; puffCol(f.x, 70, '255,170,240'); sfx('vanish'); }
        if (mf >= 2 && mf < 10) f.invul = Math.max(f.invul, 2);
        if (mf === 10) {
          const d = o.x - f.x; let x = Math.abs(d) < 360 ? o.x + Math.sign(d || f.facing) * 70 : f.x + Math.sign(d) * 200;
          if (x < WALL_L + 5 || x > WALL_R - 5) x = o.x - Math.sign(d || f.facing) * 70;
          f.x = clamp(x, WALL_L, WALL_R); f.facing = Math.sign(o.x - f.x) || f.facing; f.hidden = false; puffCol(f.x, 70, '255,170,240');
        }
      } };
    case 'tpStrike': return { id, label: 'Psychic Palm', startup: 5, active: 4, recovery: 16, wind: 'psyW', pose: 'psyPush', noGrace: true, psyFist: [85, 112, 0.8],
      hitbox: [10,115,60,150], dmg: 48, stun: 20, bstun: 12, push: 3, launch: true, launchVy: 12, type: 'mid', hitstop: 10, gdrain: 10,
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; } };
    case 'orbStrong': return { id, label: 'Strong Orbs', summon: true, startup: 10, active: 2, recovery: 16, wind: 'psyCast', pose: 'chargeL',
      onFrame(f, o, mf) { if (mf === 10) summonOrbs(f, 'strong', 3); } };
    case 'orbLong': return { id, label: 'Long Orbs', summon: true, startup: 12, active: 2, recovery: 16, wind: 'psyCast', pose: 'chargeL',
      onFrame(f, o, mf) { if (mf === 12) summonOrbs(f, 'long', 5); } };
    case 'barrier': return { id, label: 'Barrier', startup: 4, active: 26, recovery: 14, wind: 'psyBoth', pose: 'psyBoth', barrier: true, fx: 'barrier' };
    case 'thousandFists': return { id, super: true, name: 'CRYSTAL STORM', label: 'Crystal Storm', startup: 16, active: 48, recovery: 14, wind: 'psyCast', pose: 'chargeL', aura: true,
      onStart(f) { f.invul = 24; },
      onFrame(f, o, mf) {
        if (mf >= 16 && mf <= 51 && (mf - 16) % 5 === 0) { // phantom fists from all around them
          const a = rnd(0, Math.PI * 2), r = 150, cx = o.x, cy = o.y + 80;
          const x = cx + Math.cos(a) * r, y = Math.max(20, cy + Math.sin(a) * r * 0.7);
          const dx = cx - x, dy = cy - y, L = Math.hypot(dx, dy) || 1;
          spawnPFist(f, { x, y, vx: dx / L * 13, vy: dy / L * 13, sc: 0.55, dmg: 14, push: 0.5, life: 24, juggle: true, superHit: true, stun: 22 });
        }
        if (mf === 56) { // and one giant fist; up close it bounces them back to her
          const close = Math.abs(o.x - f.x) < 240;
          spawnPFist(f, { x: o.x - f.facing * 160, y: o.y + 90, vx: f.facing * 14, vy: 0, sc: 1.3, dmg: 65, push: 3, life: 20, juggle: true, superHit: true, stun: 24,
            kd: !close, kdVx: 9, kdVy: 10, launch: close, launchVy: 12, bounce: close, endOwner: close, r: 40 });
        }
      } };
    // Lyra's juggle versions
    case 'jPhantom': return { id, label: 'Shard Flurry', startup: 6, active: 16, recovery: 12, wind: 'psyW', pose: 'psyBoth',
      onFrame(f, o, mf) { if (mf >= 6 && mf <= 21 && (mf - 6) % 5 === 0) {
        const k = (mf - 6) / 5, x = o.x - f.facing * (40 + k * 6), y = Math.max(10, (caughtIn(o) ? o.y : 0) - 30 + k * 10); // (on someone not in a combo, the shards fly along the ground: jump them)
        spawnPFist(f, { x, y, vx: f.facing * 6, vy: 6, sc: 0.5, dmg: 14, push: 0.4, life: 18, juggle: true, jugVy: 6, stun: 16 }); } } };
    case 'jCrush': return { id, label: 'Falling Star', startup: 8, active: 6, recovery: 14, wind: 'psyRaise', pose: 'psyDown',
      onFrame(f, o, mf) { if (mf === 6) spawnCrush(f, o, true); } };
    case 'jLift': return { id, label: 'Levitate', startup: 6, active: 10, recovery: 14, wind: 'psyW', pose: 'psyUp',
      onFrame(f, o, mf) { if (mf === 4) spawnLift(f, o, true); } };
    case 'jWave': return { id, label: 'Spirit Fist Burst', startup: 6, active: 6, recovery: 18, wind: 'psyW', pose: 'psyUp', giantFist: [115, 150, 1.1, -0.5],
      hitbox: [30,175,30,250], dmg: 50, kd: true, kdVx: 14, kdVy: 9, type: 'mid', hitstop: 13, gdrain: 10 };
    // ----- Tetsu -----
    case 'meteorFist': return { id, label: 'Meteor Fist', pre: 6, startup: 22, active: 10, recovery: 18, wind: 'meteorW', pose: 'meteorPunch', fx: 'comet', manualY: true, noPush: true, selfMove: true, aura: true,
      hitbox: [-10,80,-20,90], dmg: 62, stun: 20, bstun: 14, push: 3, launch: true, launchVy: 10, bounce: true, type: 'mid', hitstop: 11, gdrain: 12,
      onStart(f, o) {
        const side = Math.sign(o.x - f.x) || f.facing; f.facing = side;
        f.leap = { x0: f.x, tx: clamp(f.x + side * Math.min(Math.max(0, Math.abs(o.x - f.x) - 30), 250), WALL_L, WALL_R) }; sfx('rise');
      },
      onFrame(f, o, mf) { // leap in and slam both fists down
        f.vx = 0;
        const L = f.key === 'brawler' ? f.move.startup + 2 : 32; // (Tetsu's lands as the blow comes out)
        if (mf <= L) { const e = mf / L; f.x = lerp(f.leap.x0, f.leap.tx, e); f.y = 140 * Math.sin(Math.PI * e); }
        if (mf === L) { f.y = 0; dustAt(f.x + f.facing * 30, true); cracks(f.x + f.facing * 40); parts.push({ type: 'ering', x: f.x + f.facing * 40, y: GROUND, r: 8, vr: 7, life: 14, max: 14, col: '125,235,255' }); game.shake = Math.max(game.shake, 5); sfx('land'); }
      } };
    case 'qiSweep': return { id, label: 'Qi Sweep', pre: 7, startup: 8, active: 14, recovery: 16, wind: 'scoopW', pose: 'scoop', selfMove: true, aura: true, speedFx: true,
      trail: { cx: 30, cy: 20, r: 62, a0: -75, a1: 65, col: '125,235,255' },
      hitbox: [0,70,0,36], low: true, dmg: 48, stun: 20, bstun: 10, push: 2, launch: true, launchVy: 11, type: 'mid', hitstop: 8, gdrain: 8,
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; },
      onFrame(f, o, mf) { if (mf > 4 && mf <= 22 && !f.hitConnected && Math.abs(o.x - f.x) > 50) { f.vx = f.facing * 11; if (mf % 2 === 0) dustAt(f.x, false); } else f.vx *= 0.6; } };
    case 'shoulder': return { id, label: 'Shoulder Charge', pre: 6, startup: 12, active: 8, recovery: 22, wind: 'crouch', pose: 'shoulder', selfMove: true, speedFx: true,
      hitbox: [10,62,40,120], dmg: 70, stun: 20, bstun: 12, push: 3, kd: true, kdVx: 10, kdVy: 6, type: 'mid', hitstop: 12, gdrain: 14,
      onFrame(f, o, mf) { if (mf > 3 && mf <= f.move.startup + f.move.active && !f.hitConnected && Math.abs(o.x - f.x) > 52) f.vx = f.facing * 13; else f.vx *= 0.6; } }; // (charges in from about a third of the screen)
    case 'qiOrb': return { id, label: 'Qi Orb', pre: 12, startup: 14, active: 2, recovery: 18, wind: 'blastW', pose: 'blast', proj: 'orb', limit: 1, aura: true,
      onFrame(f, o, mf) { if (mf === 14) spawnQiOrb(f); } };
    case 'qiParry': return { id, label: 'Qi Parry', startup: 7, active: 22, recovery: 20, wind: 'charge', pose: 'parryStance', parry: true, aura: true, fx: 'ward',
      onFrame(f, o, mf) { if (mf > 7 && mf <= 29 && mf % 3 === 0) auraParticle(f); } };
    case 'pushParry': return { id, label: 'Push Parry', startup: 4, active: 10, recovery: 26, wind: 'charge', pose: 'parryStance', parry: true, parryInto: 'parryShove', aura: true, fx: 'ward', // ← ← + U: parries from the 5th frame; a parried blow gets a shove that sends them away (no damage)
      onFrame(f, o, mf) { if (mf > 4 && mf <= 14 && mf % 3 === 0) auraParticle(f); } };
    case 'kickParry': return { id, label: 'Kick Parry', startup: 4, active: 10, recovery: 32, wind: 'charge', pose: 'parryStance', parry: true, parryInto: 'parryKick', aura: true, fx: 'ward', // ← ← + I: the same, but he answers with a kick
      onFrame(f, o, mf) { if (mf > 4 && mf <= 14 && mf % 3 === 0) auraParticle(f); } };
    case 'parryShove': return { id, label: 'Qi Shove', startup: 2, active: 3, recovery: 14, wind: 'palmW', pose: 'blast', hitbox: null, aura: true, burst: [80, 110],
      onStart(f, o) { const side = Math.sign(o.x - f.x) || f.facing; if (o.state !== 'ko') { setState(o, 'blockstun'); o.stun = 14; o.move = null; o.vx = side * 30; } sfx('qi'); game.shake = Math.max(game.shake, 3); } }; // (pushed far back, unhurt: back to neutral at a distance)
    case 'parryKick': return { id, label: 'Counter Kick', startup: 4, active: 4, recovery: 18, wind: 'kickW', pose: 'midKick', hitbox: [10,115,50,135],
      dmg: 64, stun: 20, bstun: 12, push: 6, kd: true, kdVx: 15, kdVy: 7, noGrace: true, type: 'mid', hitstop: 12, gdrain: 10 }; // (a kick to the body that knocks them away)
    case 'parryStrike': return { id, label: 'Parry Palm', startup: 4, active: 4, recovery: 16, wind: 'palmW', pose: 'palm', hitbox: [10,95,40,160], burst: [80, 108],
      dmg: 50, stun: 20, bstun: 12, push: 3, launch: true, launchVy: 13, noGrace: true, type: 'mid', hitstop: 12, gdrain: 10 };
    case 'stomp': return { id, label: 'Earth Stomp', low: true, projInvul: [0, 32], pre: 7, startup: 12, active: 2, recovery: 18, wind: 'stompW', pose: 'stompDown', proj: 'wave', limit: 1, // (low: its shockwave runs along the floor)
      onFrame(f, o, mf) { if (mf === 12) { spawnWave(f); dustAt(f.x + f.facing * 40, true); cracks(f.x + f.facing * 22); game.shake = Math.max(game.shake, 4); sfx('land'); } } };
    case 'tornado': return { id, label: 'Cyclone Lariat', projInvul: [1, 34], pre: 7, startup: 12, active: 21, recovery: 12, wind: 'lariatW', pose: 'lariat', fx: 'cyclone', manualY: true, noPush: true, selfMove: true, spin: [13, 33],
      hitbox: [-20,100,20,140], multi: 3, interval: 5, dmg: 22, lastDmg: 34, stun: 18, bstun: 10, push: 1.5, lastPush: 3, launch: true, launchVy: 12, type: 'mid', hitstop: 6, gdrain: 10,
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; },
      onFrame(f, o, mf) { // a small backstep, then a jumping spinning lariat forward
        if (mf <= 6) { f.vx = -f.facing * 3; f.y = 0; } else if (mf <= 8) f.vx = 0;
        const end = f.key === 'brawler' ? f.move.startup + f.move.active : 32, reach = f.key === 'brawler' ? 320 : 230; // (Tetsu's spins further and longer)
        if (mf === 8) { f.tor = { x0: f.x, tx: clamp(f.x + f.facing * Math.min(reach, Math.max(70, Math.abs(o.x - f.x) - 10)), WALL_L, WALL_R) }; sfx('slash'); }
        if (mf > 8 && mf <= end) { const e = (mf - 8) / (end - 8); f.vx = 0; f.x = lerp(f.tor.x0, f.tor.tx, Math.sin(e * Math.PI / 2)); f.y = 85 * Math.sin(Math.PI * e); }
        if (mf === end) { f.y = 0; dustAt(f.x, false); }
      } };
    // Tetsu's juggle versions (used automatically while the opponent is launched)
    case 'jGeyser': return { id, label: 'Qi Geyser', startup: 5, active: 16, recovery: 16, wind: 'blastW', pose: 'palmUp', fireCol: 'qi', aura: true,
      hitbox: [20,95,20,230], multi: 4, interval: 4, dmg: 15, lastDmg: 30, jugVy: 6.5, lastJugVy: 10.5, fixedLift: true, neutralLaunch: true, launchVy: 11, type: 'mid', hitstop: 4, chip: true, gdrain: 4,
      onFrame(f, o, mf) { if (mf === 5) sfx('qi'); if (mf > 5 && mf <= 21) auraParticle(f); } };
    case 'jHammer': return { id, label: 'Hammer Spike', startup: 8, active: 12, recovery: 14, wind: 'hammerW', pose: 'airHammer', fx: 'comet', manualY: true, noPush: true, selfMove: true, aura: true,
      hitbox: [-30,70,-40,90], meteor: true, kd: true, kdVx: 1, kdVy: -8, dmg: 45, type: 'mid', hitstop: 12, gdrain: 10,
      onStart(f, o) { f.hj = { x0: f.x, tx: clamp(o.x - f.facing * 20, WALL_L, WALL_R), top: Math.min(230, o.y + 70) }; sfx('rise'); },
      onFrame(f, o, mf) { // jump up to them, then hammer them into the floor so they bounce
        f.vx = 0;
        if (mf <= 8) { const e = mf / 8; f.x = lerp(f.hj.x0, f.hj.tx, e); f.y = f.hj.top * Math.sin(e * Math.PI / 2); }
        else if (mf <= 20) f.y = Math.max(0, f.hj.top * (1 - (mf - 8) / 12));
        if (mf === 20) { f.y = 0; dustAt(f.x, true); cracks(f.x + f.facing * 20); game.shake = Math.max(game.shake, 4); }
      } };
    case 'jShoulder': return { id, label: 'Shoulder Rocket', startup: 6, active: 10, recovery: 18, wind: 'crouch', pose: 'shoulder', fx: 'comet', manualY: true, noPush: true, selfMove: true, aura: true,
      hitbox: [0,75,10,150], dmg: 55, kd: true, kdVx: 15, kdVy: 9, type: 'mid', hitstop: 13, gdrain: 10,
      onStart(f, o) { f.sr = { x0: f.x, tx: clamp(o.x - f.facing * 45, WALL_L, WALL_R), top: clamp(o.y - 10, 0, 200) }; sfx('rise'); },
      onFrame(f, o, mf) { // rockets up at them shoulder-first, then drops back down
        f.vx = 0;
        if (mf <= 12) { const e = Math.min(1, mf / 10); f.x = lerp(f.sr.x0, f.sr.tx, e); f.y = f.sr.top * Math.sin(e * Math.PI / 2); }
        else f.y = Math.max(0, f.y - 10);
      } };
    case 'jSpiral': return { id, label: 'Qi Spiral', startup: 6, active: 16, recovery: 12, wind: 'charge', pose: 'blast', aura: true,
      onFrame(f, o, mf) { if (mf >= 6 && mf <= 21 && (mf - 6) % 5 === 0) spawnSpiral(f, o, (mf - 6) / 5); } };
    case 'jTornado': return { id, label: 'Air Cyclone', projInvul: [1, 28], startup: 6, active: 20, recovery: 6, wind: 'lariatW', pose: 'lariat', fx: 'cyclone', manualY: true, noPush: true, selfMove: true, spin: [7, 26], airFollow: true,
      hitbox: [-30,90,0,140], multi: 4, interval: 5, dmg: 15, lastDmg: 22, jugVy: 5.5, fixedLift: true, type: 'mid', hitstop: 4, gdrain: 6,
      onStart(f, o) { f.tj = { x0: f.x, tx: clamp(o.x - f.facing * 30, WALL_L, WALL_R), top: clamp(o.y + 10, 60, 200) }; sfx('slash'); },
      onFrame(f, o, mf) { // spin up to them and keep spinning alongside them; he stays airborne for an air string
        f.vx = 0;
        if (mf <= 8) { const e = mf / 8; f.x = lerp(f.tj.x0, f.tj.tx, e); f.y = f.tj.top * e; }
        else if (mf <= 26) { f.y = Math.max(f.y, f.y + (o.y + 10 - f.y) * 0.3); f.x = clamp(o.x - f.facing * 30, WALL_L, WALL_R); } // keep level with them as they rise
      } };
    case 'duckUpper': return { id, label: 'Crouching Upper', pre: 6, startup: 11, active: 10, recovery: 18, wind: 'crouch', pose: 'uppercut', selfMove: true, speedFx: true, aura: true, burst: [60, 170], // → → + I: ducks in low and drives an uppercut up through them
      hitbox: [10,95,30,180], dmg: 64, stun: 22, bstun: 14, push: 4, cpLaunch: true, launchVy: 13.5, type: 'mid', hitstop: 11, gdrain: 14, // (a counter or a punish launches: a combo)
      onStart(f, o) { f.facing = Math.sign(o.x - f.x) || f.facing; },
      onFrame(f, o, mf) { if (mf <= f.move.startup && !f.hitConnected && Math.abs(o.x - f.x) > 60) { f.vx = f.facing * 9; if (mf % 2 === 0) dustAt(f.x, false); } else f.vx *= 0.6; } };
    case 'tripleQi': return { id, label: 'Triple Qi Blast', pre: 8, startup: 13, active: 2, recovery: 22, wind: 'blastW', pose: 'blast', proj: 'qi', limit: 1, aura: true, // ← → + I: three blasts at once, each a little faster than the last — they arrive one after another
      onFrame(f, o, mf) { if (mf === 13) for (const sp of [5, 7, 9.5]) { spawnQi(f); Object.assign(projs[projs.length - 1], { vx: f.facing * sp, dmg: 32, stun: 16, bstun: 12, push: 2.5 }); } } };
    case 'qiBlast': return { id, label: 'Qi Blast', pre: 8, startup: 13, active: 2, recovery: 22, wind: 'blastW', pose: 'blast', proj: 'qi', limit: 1, aura: true,
      onFrame(f, o, mf) { if (mf === 13) spawnQi(f); } };
    case 'risingFist': return { id, label: 'Rising Fist', startup: 3, active: 14, recovery: 99, untilLand: true, landT: 12, wind: 'uppercutW', pose: 'dragonFist', spin: [4, 11], fx: 'helix', aura: true,
      hitbox: [0,52,40,170], dmg: 85, stun: 20, bstun: 16, push: 4, launch: true, launchVy: 14, type: 'mid', hitstop: 10, chip: true, gdrain: 8,
      onStart(f) { f.invul = 5; },
      onFrame(f, o, mf) {
        if (mf === 4) { f.vy = 12.5; f.y = 0.5; f.vx = f.facing * 3.5; sfx('rise'); }
        if (f.hitConnected && f.lastResult === 'hit' && f.vy > 2) f.vy = 2; // on a hit, come down quickly to follow the launch
      } };
    case 'rushFists': return { id, label: 'Rush Fists', startup: 6, active: 30, recovery: 16, selfMove: true, wind: 'blastW', pose: 'rushA',
      hitbox: [8,64,74,126], multi: 6, interval: 5, dmg: 16, lastDmg: 42, stun: 16, bstun: 12, push: 1.2, lastPush: 6, kd: true, type: 'mid', hitstop: 4, chip: true, gdrain: 2,
      poseFn(f, mf) { return (mf > 6 && mf <= 36) ? (((mf >> 2) & 1) ? POSES.rushA : POSES.rushB) : null; },
      onFrame(f, o, mf) {
        if (mf > 6 && mf <= 36) f.vx = (!f.hitConnected && Math.abs(o.x - f.x) > 58) ? f.facing * 6.5 : 0;
        else f.vx *= 0.7;
      } };
    // ← → + U / I: a crescent of shadow along the floor — Moon Tempest is a mid you can jump, short-lived; Full Moon Tempest is tall
    // (no jumping it, and it hits a crouching guard: TOP), slower and out much longer. Both: 5 frames of recovery, even when guarded
    case 'moonTempest': return { id, label: 'Moon Tempest', startup: 13, active: 2, recovery: 5, fixedFrames: true, blockAdv: 0, wind: 'slashW', pose: 'slash', hitbox: null,
      onFrame(f, o, mf) { f.vx *= 0.6; if (mf === f.move.startup) { sfx('slash'); spawnPJ(f, 'crescent', { x: f.x + f.facing * 70, y: 70, vx: f.facing * 13, life: 24, r: 34, h: { dmg: 60, stun: 22, bstun: 8, push: 3, kd: true, kdVx: 12, kdVy: 7, gdrain: 10, label: 'Moon Tempest' } }); } } };
    case 'fullMoon': return { id, label: 'Full Moon Tempest', startup: 17, active: 2, recovery: 5, fixedFrames: true, blockAdv: 0, wind: 'slashW', pose: 'slash', hitbox: null, aura: true,
      drawFX(f) { const S = f.move.startup, mf = f.mf; if (mf > S + 6) return; const k = Math.min(1, mf / S), a = mf <= S ? k : 1 - (mf - S) / 6; // a full moon rises behind him as he gathers it
        fxLighter(() => { const x = f.x - f.facing * 10, y = GROUND - f.y - 150, g = ctx.createRadialGradient(x, y, 4, x, y, 70 * k + 10); g.addColorStop(0, `rgba(255,250,235,${0.9 * a})`); g.addColorStop(0.5, `rgba(210,190,255,${0.5 * a})`); g.addColorStop(1, 'rgba(150,110,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 70 * k + 10, 0, Math.PI * 2); ctx.fill(); }); },
      onFrame(f, o, mf) { f.vx *= 0.6; if (mf < f.move.startup && mf % 3 === 0) parts.push({ type: 'ring', x: f.x - f.facing * 10, y: GROUND - f.y - 150, r: 70 - mf * 3, vr: -1.5, life: 8, max: 8, col: '220,200,255' });
        if (mf === f.move.startup) { sfx('slash'); sfx('super'); game.shake = Math.max(game.shake, 8); for (let i = 0; i < 3; i++) parts.push({ type: 'ring', x: f.x + f.facing * 70, y: GROUND - 100, r: 20 + i * 18, vr: 6 + i * 2, life: 16, max: 16, col: i ? '200,170,255' : '255,250,235' }); dustAt(f.x + f.facing * 60, true);
        spawnPJ(f, 'crescent', { big: true, x: f.x + f.facing * 70, y: 100, vx: f.facing * 8, life: 70, r: 100, h: { dmg: 90, stun: 24, bstun: 8, push: 4, kd: true, kdVx: 16, kdVy: 8, gdrain: 18, overhead: true, floor: true, label: 'Full Moon Tempest' } }); /* (from the floor up to well above a jump: nothing ducks or dives under it) */ } } };
    case 'shadowArmy': return { id, super: true, name: 'SHADOW ARMY', label: 'Shadow Army', startup: 14, active: 125, recovery: 22, blockAdv: 0, cutOnGuard: true, /* (out longer, slower to recover; even when guarded: once its clones are guarded he's done) */ wind: 'seal', pose: 'seal', aura: true,
      supArmor: true, // not invincible: until the clones come out, light hits from up close don't stop him (taken in full); strong ones do
      onStart(f) {},
      onFrame(f, o, mf) { // three tides: mid clones from both sides, low clones from both sides, then one dives from above (TOP) and one last clone from behind
        const mv = f.move;
        if (mf === 1) { const back = Math.sign(o.x - f.x) || f.facing; mv.wall = back > 0 ? WALL_R - o.x < 150 : o.x - WALL_L < 150; // (they're in the corner: nothing can come from behind them)
          mv.tr = Math.round(Math.max(0, Math.abs(o.x - f.x) - 40) / 16); // (how long the clones take to get to them)
          if (mv.dodge) { mv.active += mv.tr + 20 + (mv.wall ? 40 : 0); if (f.fd) f.fd.act = mv.active; } } // (in the corner the tides come from his side only, one clone after another: it lasts longer)
        if (mv.dodge) { const W2 = mv.wall, a = W2 ? 2 : 1, n = W2 ? 9 : 6, t1 = 12, t2 = W2 ? 44 : 36, t3 = t2 + n * a + 12 + mv.tr, dm = W2 ? 13 : 19; // (each clone lighter in the corner: about the same total; the dive only once the last low has reached them — far away, later)
          const tide = (t0, lvl) => { const k = mf - t0; if (k >= 0 && k < n * a && k % a === 0) spawnClone(f, true, W2 ? 2 * (k / a) : k / a, dm, lvl).gMul = W2 ? 0.66 : 1; }; // (in the corner: even numbers only — all from his side; more of them, each wearing the guard down less)
          tide(t1, 'mid'); // 1: mids — guard standing
          tide(t2, 'low'); // 2: lows — guard crouching
          if (mf === t3) { mv.dive = spawnDiveClone(f, true); mv.dive.army = W2 ? 'front' : 'back'; } // 3: one drops from above — stand…
          const dv = mv.dive;
          if (dv && dv.armyRes && dv.armyRes !== 'block' && !mv.short) { mv.short = true; mv.active = Math.min(mv.active, mf - mv.startup + 20); } // (it hit: the last clone came at once, as a mid — strings.js — and he's done soon after)
          if (dv && dv.dead && !mv.finalT && !(dv.armyRes && dv.armyRes !== 'block')) mv.finalT = mf + (dv.armyRes ? 14 : 7); // (guarded or missed: once it's down…
          if (mf === mv.finalT) Object.assign(spawnClone(f, true, W2 ? 0 : 1, 0, 'low'), ARMY_SWEEP); // …one comes in low from behind (from his side in the corner) — crouch, and turn if it's behind)
          mv.cutOnGuard = !!mv.finalT && mf >= mv.finalT; } // (guarded: he's done only once the last clone is out — ±0 then)
        else { if (mf >= 12 && mf <= 75 && (mf - 12) % 7 === 0) spawnClone(f, true, (mf - 12) / 7, 16); mv.cutOnGuard = mf >= 80; } // (in a combo, one after another — ten of them: they keep the juggled opponent up until the last one drops)
        if (!f.move.dodge && mf === 80) spawnDiveClone(f); // (in a combo it drops right onto them as the last clone passes)
        if (!f.move.dodge && mf === 86) { f.move.active = 86 - f.move.startup; f.move.recovery = 8; } // (in a combo he's free right after the last clone lands: follow up as they bounce)
      } };
    case 'qiCannon': return { id, super: true, name: 'GREAT QI CANNON', label: 'Qi Cannon', startup: 26, active: 56, recovery: 20, wind: 'blastW', pose: 'blast', aura: true,
      supArmor: true, // Tetsu (and Kuro's Shadow Army): not invincible — until the beam fires, light hits from up close don't stop him (he still takes them in full); strong ones do
      onStart(f) { if (f.key !== 'brawler') f.invul = 30; }, // (Hohen's Core Cannon, built on this one, keeps its invincibility)
      onFrame(f, o, mf) { if (mf === 27) spawnBeam(f); if (mf < 27 && mf % 2 === 0) auraParticle(f); } };
  }
  return null;
}

