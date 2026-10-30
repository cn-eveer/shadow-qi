'use strict';
/* ================= each fighter's own combo strings ================= */
const SG = (kind, label, wind, pose, o = {}) => ({ kind, str: 0, label, wind, pose, startup: 5, active: 3, recovery: 11, dmg: kind === 'p' ? 26 : 30, hitbox: [20,90,60,130], advHit: 8, advBlock: 0, push: 0.7, stun: 18, step: 5, ...o });
const SF = (kind, label, wind, pose, o = {}) => ({ kind, str: 1, label, wind, pose, step: 5, startup: 10, active: 4, recovery: 20, dmg: 62, hitbox: [15,100,40,140], kd: true, kdVx: 12, kdVy: 8, advHit: 3, advBlock: -12, gdrain: 14, hitstop: 12, ...o });
const SL = (label, wind, pose, o = {}) => ({ kind: 'p', str: 1, label, wind, pose, step: 5, startup: 9, active: 4, recovery: 18, dmg: 40, hitbox: [10,95,40,195], launch: true, launchVy: 13.5, advBlock: -12, gdrain: 10, hitstop: 10, ...o });
const SJ = (kind, label, wind, pose, o = {}) => ({ kind, str: 0, label, wind, pose, jug: true, startup: 4, active: 4, recovery: 10, dmg: 24, hitbox: [10,95,45,250], jugVy: 7.5, advHit: 6, ...o });
const SJF = (label, wind, pose, o = {}) => ({ kind: 'k', str: 1, label, wind, pose, jug: true, startup: 7, active: 4, recovery: 16, dmg: 40, hitbox: [10,110,30,290], kd: true, kdVx: 11, kdVy: 8, hitstop: 11, gdrain: 12, ...o });
const SA = (kind, label, pose, o = {}) => ({ kind, str: 0, stance: 'j', air: true, hover: true, label, wind: 'jump', pose, startup: 3, active: 3, recovery: 7, dmg: 20, hitbox: [5,86,5,135], jugVy: 4.5, ...o });
const SAF = (label, pose, o = {}) => ({ kind: 'k', str: 1, stance: 'j', air: true, label, wind: 'jump', pose, startup: 4, active: 4, recovery: 10, dmg: 38, hitbox: [5,104,0,135], kd: true, kdVx: 12, kdVy: 6, hitstop: 11, gdrain: 10, ...o });
const gun = (opts) => (f, o, mf) => { if (mf === f.move.startup) [].concat(opts).forEach(q => shoot(f, q)); };
const tieWhip = f => { // Tanaka's necktie, cracked like a whip
  if (f.mf < f.move.startup - 1 || f.mf > f.move.startup + f.move.active + 2) return;
  const s = f.ch.scale, x0 = f.x + f.facing * 20 * s, y0 = GROUND - f.y - 130 * s, k = Math.min(1, (f.mf - f.move.startup + 2) / 3);
  ctx.save(); ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(x0 + f.facing * 50 * k, y0 - 30 * k, x0 + f.facing * 95 * k, y0 + 6); ctx.stroke(); ctx.restore();
};
const LCR = (label, o = {}) => ({ kind: 'p', str: 0, label, wind: 'psyRaise', pose: 'psyUp', jug: true, stay: true, startup: 13, active: 10, recovery: 10, dmg: 0, hitbox: null, jugVy: 7.5, onFrame: lyraCrystals, ...o, active: (o.crystals || 2) * (o.gap || 3) + 2 });
const STRINGS = {
  ninja: { // Kuro: kunai slashes and shadow steps
    // U, U, U, U, K (Street Fighter 6 style: every hit has its own job; guarded, the string has holes)
    //  U, U:  two fast hits (high, mid); guard the first U and a U of their own beats the second
    //  3rd U: a medium (a mid), slower — slower than 10 frames, so they can guard it even on a hit (GUARD_BACK); guarded, a 20-frame hole before it
    //  4th U: fast and low, no gap after the 3rd, safe when guarded; on a hit it trips them, and the K catches them as they fall
    //  K:     the final blow, a high: guard the low 4th crouching and it passes over; slow, out a long time and slow to recover;
    //         guarded standing, a fast attack punishes it from up close
    n2: SG('p', 'Kunai Slash', 'slashW', 'slash', { fixedFrames: true, guardGap: 12, startup: 4, active: 6, recovery: 12, advHit: 14, advBlock: -2, blade: true, trail: { cx: 15, cy: 105, r: 70, a0: 70, a1: -30, col: '225,235,255' } }),
    n3: SG('p', 'Reverse Slash', 'slash', 'kReverse', { fixedFrames: true, str: 1, dmg: 40, pre: 10, guardGap: 12, startup: 6, active: 6, recovery: 18, advHit: 14, advBlock: -5, hitbox: [20,98,55,140], blade: true, trail: { cx: 15, cy: 110, r: 70, a0: -30, a1: 70, col: '225,235,255' } }),
    n4: SG('p', 'Shadow Step', 'crouch', 'cPunch', { fixedFrames: true, startup: 3, active: 6, recovery: 10, advBlock: 0, /* (−6 with the guard stall: safe even against an 8F jab) */ low: true, hitbox: [15,105,0,42], launch: true, launchVy: 9, trip: true, blade: true, step: 10, speedFx: true }),
    nF: SF('k', 'Shadow Crescent', 'spinW', 'roundhouse', { fixedFrames: true, pre: 8, startup: 10, active: 9, recovery: 24, advBlock: -6, /* (−12 once the guard stall is added) */ bpush: 3.5, noFiveLag: true, spin: [3, 9], hitbox: [15,105,112,175], high: true, // (a high: it passes over someone crouching)
      dmg: 88, hitstop: 16, gdrain: 26, kdVx: 17, kdVy: 10, push: 6, // a heavy blow: hits hard, freezes the screen longer, sends them flying, tears into a guard
      trail: { cx: 0, cy: 80, r: 120, a0: -80, a1: 70, col: '190,150,255' },
      onFrame(f, o, mf) { if (mf === f.move.startup + 1) { sfx('swing'); game.shake = Math.max(game.shake, 4); const x = f.x + f.facing * 70, y = GROUND - f.y - 90; parts.push({ type: 'ring', x, y, r: 10, vr: 7, life: 14, max: 14, col: '190,150,255' }); for (let i = 0; i < 8; i++) parts.push({ type: 'speed', x, y: y + rnd(-30, 30), vx: f.facing * rnd(6, 11), vy: rnd(-1, 1), life: 10, max: 10, col: '190,150,255' }); }
        if (f.hitConnected && f.lastResult === 'hit' && !f.move.heavyHit) { f.move.heavyHit = true; game.shake = Math.max(game.shake, 9); sfx('hitH'); } } }),
    nL: SL('Kunai Rise', 'uppercutW', 'kunaiRise', { blade: true, trail: { cx: 10, cy: 90, r: 95, a0: -30, a1: 95, col: '225,235,255' } }),
    nE: SF('k', 'Crescent Kick', 'kickW', 'highKick', { dmg: 50, trail: { cx: 0, cy: 62, r: 78, a0: -45, a1: 95, col: '190,150,255' } }),
    nl2: SG('k', 'Sweep Slash', 'crouch', 'lowKick', { low: true, blade: true, hitbox: [20,90,8,44] }),
    nlE: SF('k', 'Shadow Snap Kick', 'kickW', 'midKick', { step: 8, hitbox: [15,100,45,130], kdVy: 5 }), // J, J, K / J, K: low, low… then a mid (guard the lows crouching and this one hits)
    nD: SF('k', 'Shadow Reaper', 'crouch', 'sweep', { fixedFrames: true, pre: 6, startup: 10, active: 7, recovery: 22, advBlock: -6, /* (−12 with the guard stall) */ noFiveLag: true, low: true, step: 8, hitbox: [0,105,0,34], kd: true, kdVx: 6, kdVy: 6 }), // U, U, ↓ + K: the low ending (U, U, K drops from above instead)
    jPalm: SJ('p', 'Rising Kunai Slash', 'jabW', 'kunaiRise', { blade: true, trail: { cx: 10, cy: 90, r: 80, a0: -30, a1: 90, col: '225,235,255' } }),
    jElbow: SJ('p', 'Twin Kunai', 'slashW', 'slash', { blade: true, multi: 2, interval: 3, dmg: 14, lastDmg: 16 }),
    jUpper: SJ('p', 'Shadow Upper', 'uppercutW', 'uppercut', { speedFx: true, dmg: 30, jugVy: 8 }),
    jSpin: SJF('Moon Crescent', 'spinW', 'roundhouse', { spin: [1, 6], trail: { cx: 0, cy: 90, r: 110, a0: -70, a1: 70, col: '190,150,255' } }),
  },
  brawler: { // Tetsu: a boxer's body work and qi palms
    t2: SG('p', 'Qi Straight', 'jabW', 'straight', { burst: [80, 115] }),
    t3: SG('p', 'Body Blow', 'jabW', 'tBody', { hitbox: [20,80,50,110], push: 2 }),
    t4: SG('p', 'Elbow Smash', 'palmW', 'tElbow', { step: 6, startup: 7, hitbox: [10,72,70,130], dmg: 34 }),
    tF: SF('p', 'Twin Qi Palms', 'blastW', 'blast', { burst: [100, 115], kdVx: 15, aura: true, dmg: 70 }),
    tL: SL('Rising Dragon', 'uppercutW', 'uppercut', { aura: true, burst: [60, 170] }),
    tE: SF('k', 'Axe Kick', 'kickW', 'axe', { dmg: 54, kdVx: 6, kdVy: 10 }),
    tl2: SG('k', 'Low Kick', 'kickW', 'lowKick', { low: true, hitbox: [20,80,8,44] }),
    tlE: SF('k', 'Crescent High Kick', 'kickW', 'highKick', { high: true, hitbox: [15,110,110,170], dmg: 56, kdVx: 14, kdVy: 8 }), // J, J, K: a high kick to the head (crouch under it) that knocks them away
    tlD: SF('k', 'Mountain Front Kick', 'kickW', 'midKick', { hitbox: [15,115,50,125], dmg: 60, kdVx: 15, kdVy: 7 }), // J, J, ↓ + K: a heavy front kick to the body
    tD: SF('k', 'Dragon Sweep', 'crouch', 'sweep', { low: true, step: 8, hitbox: [0,115,0,34], dmg: 54, kd: true, kdVx: 3, kdVy: 5, cpLaunch: true, launchVy: 13 }), // U, U, U, U, ↓ + K: a low sweep that takes their feet (a counter launches)
    jPalm: SJ('p', 'Twin Palm Lift', 'jabW', 'palmUp', { burst: [70, 160] }),
    jElbow: SJ('p', 'Hammer Fist', 'palmW', 'tHammer', { hitbox: [10,90,40,260], dmg: 28 }),
    jUpper: SJ('p', 'Body Upper', 'uppercutW', 'uppercut', { aura: true, dmg: 30, jugVy: 8 }),
    jSpin: SJF('Qi Explosion', 'blastW', 'blast', { burst: [100, 150], kdVx: 14, aura: true }),
    aPalm: SA('p', 'Air Palm', 'blast'), aElbow: SA('p', 'Air Elbow', 'tElbow'),
    aKunai: SA('p', 'Air Qi Flurry', 'palm', { str: 1, startup: 4, active: 9, recovery: 8, multi: 3, interval: 3, dmg: 12, lastDmg: 20, jugVy: 3.5 }),
    aSpin: SAF('Air Qi Burst', 'blast', { burst: [80, 110] }),
  },
  staff: { // Mei: thrusts, twirls and sweeps with the staff
    m2: SG('p', 'Twin Thrust', 'thrustW', 'thrust', { step: 0, hitbox: [20,170,80,130], staffExt: 30 }), // (her string stays at the staff's length: no stepping in)
    m3: SG('p', 'Low Staff Twirl', 'staffLowW', 'staffLow', { step: 0, low: true, hitbox: [20,170,0,44], spinStaff: true, dmg: 28 }), // U, U, U: low
    m4: SG('k', 'Low Spin Sweep', 'crouch', 'staffSweep', { step: 0, low: true, hitbox: [10,175,0,40], spinStaff: true, dmg: 30 }), // U, U, U, U: low
    mD: SG('k', 'Ground Thrust', 'staffHighW', 'staffLowThrust', { step: 0, low: true, hitbox: [20,185,0,44], staffExt: 30, dmg: 44, counterStun: 12 }), // U, U, U, U, ↓ + K: low, and a counter leaves them stunned longer
    mUD: SF('k', 'Dragon Tail Sweep', 'crouch', 'staffSweep', { step: 0, low: true, hitbox: [0,185,0,40], spinStaff: true, dmg: 52, kdVx: 4, kdVy: 6 }), // U, ↓ + K: a low sweep that trips them
    mF: SF('p', 'Great Sweep', 'staffSwingW', 'staffSweep', { step: 0, hitbox: [10,180,0,120], spinStaff: true, trail: { cx: 30, cy: 40, r: 140, a0: -70, a1: 40, col: GOLD } }),
    mL: SL('Rising Staff', 'staffLow', 'staffRise', { step: 0, hitbox: [10,160,40,200], trail: { cx: 20, cy: 90, r: 130, a0: -40, a1: 100, col: GOLD } }),
    mE: SF('p', 'Overhead Crash', 'slamW', 'staffSlam', { step: 0, hitbox: [10,170,0,170], dmg: 56, kdVx: 6, kdVy: 10 }),
    ml2: SG('k', 'Staff Jab', 'thrustW', 'thrust', { step: 0, hitbox: [20,170,70,125], staffExt: 30 }), // J, J: a mid
    mlE: SF('k', 'Floor Sweep', 'crouch', 'staffSweep', { step: 0, low: true, hitbox: [0,175,0,40], spinStaff: true, dmg: 50 }),
  },
  psychic: { // Lyra: every hit comes from her staff, as runes and crystals at a distance
    y2: SG('p', 'Glyph Spark', 'lStaffBack', 'lStaffThrust', { noCrystal: true, step: 0, onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 90), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 90); }, hitbox: [40,130,80,140], psyFist: [105, 115, 0.6] }),
    y3: SG('p', 'Crystal Needle', 'lStaffThrust', 'lStaffUp', { step: 0, onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 90), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 90); }, hitbox: [40,140,90,170], psyFist: [115, 150, 0.6, -0.5] }),
    y4: SG('k', 'Floor Rune', 'lStaffUp', 'lStaffSweep', { step: 0, onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 90), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 90); }, low: true, hitbox: [60,170,0,42], floorGlyph: 125 }),
    yF: SF('p', 'Starburst', 'lStaffBack', 'psyBoth', { step: 0, onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 90), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 90); }, hitbox: [40,170,40,170], psyFist: [125, 110, 1.05], burst: [125, 110], kdVx: 14 }),
    yL: SL('Levitation Rune', 'lStaffSweep', 'lStaffUp', { step: 0, onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 90), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 90); }, hitbox: [40,150,0,200], floorGlyph: 105 }),
    yE: SF('p', 'Repulse', 'lStaffBack', 'psyPush', { step: 0, onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 90), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 90); }, hitbox: [40,160,50,150], psyFist: [115, 110, 0.85], dmg: 52 }),
    yl2: SG('k', 'Floor Glyph 2', 'psyW', 'psyLowCast', { step: 0, onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 90), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 90); }, low: true, hitbox: [80,200,0,42], floorGlyph: 150 }),
    ylE: SF('k', 'Glyph Trip', 'psyW', 'psyLowCast', { step: 0, onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 90), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 90); }, low: true, hitbox: [90,220,0,40], floorGlyph: 165, dmg: 48 }),
    jPalm: LCR('Rune Burst', { runes: true, crystals: 2, gap: 4, cdmg: [16, 16], jugVy: 7.5 }),
    jElbow: LCR('Rune Chain', { runes: true, crystals: 4, gap: 3, cdmg: [8, 8, 8, 12], jugVy: 5.5, lastJug: 7.5, csize: 13 }),
    jUpper: LCR('Twin Runes', { runes: true, crystals: 2, gap: 5, cdmg: [16, 20], jugVy: 8, csize: 22 }),
    jSpin: { kind: 'k', str: 1, label: 'Trinity Burst', wind: 'psyRaise', pose: 'psyCast', jug: true, stay: true, startup: 14, active: 3, recovery: 16, dmg: 0, hitbox: null, // a triangular magic circle closes around them... and explodes
    onFrame: (f, o, mf) => { f.vx = 0; if (mf === 2) sfx('charge'); if (mf === f.move.startup && Math.abs(o.x - f.x) <= LYRA_RANGE) { const y = GROUND - o.y - 70 * o.ch.scale; columnHit(f, o, { dmg: 46, stun: 24, bstun: 12, push: 2, kd: true, kdVx: 11, kdVy: 9, hitstop: 14, label: 'Trinity Burst' }); triExplode(o.x, y); if (o.state === 'knock') { f.hitConnected = true; f.lastResult = 'hit'; } } },
    drawFX: (f, o) => { const S = f.move.startup; if (!o || f.mf < 1 || f.mf > S + 1) return; const k = f.mf / S; drawTriCircle(o.x, GROUND - o.y - 70 * o.ch.scale, 110 - 45 * k, Math.min(1, 0.3 + k), f.mf * 0.18); } },
    aPalm: SA('p', 'Air Rune', 'airPsyBoth', { psyFist: [80, 70, 0.6] }), aElbow: SA('p', 'Air Crystal', 'airPsyDown', { psyFist: [80, 50, 0.6, 0.5] }),
    aKunai: SA('p', 'Air Crystal Storm', 'airPsyBoth', { str: 1, startup: 4, active: 9, recovery: 8, multi: 3, interval: 3, dmg: 12, lastDmg: 20, jugVy: 3.5, psyFist: [90, 70, 0.75] }),
    aSpin: SAF('Air Starburst', 'airPsyBoth', { psyFist: [90, 70, 1.0], burst: [90, 70] }),
  },
  paladin: { // Aldric: shield, rising cut, cleave, thrust — heavy and deliberate
    p2: SG('p', 'Shield Bash', 'pBashW', 'pBash', { hitbox: [10,125,50,160], push: 2 }),
    p3: SG('p', 'Rising Slash', 'pRiseW', 'pRise', { hitbox: [15,170,40,180], dmg: 30 }),
    p4: SG('p', 'Overhead Cleave', 'pCleaveW', 'pCleave', { hitbox: [10,180,0,190], dmg: 34, startup: 8 }),
    pF: SF('k', 'Holy Thrust', 'pThrustW', 'pThrust', { wrist: 0, staffExt: 70, hitbox: [20,260,80,140], kdVx: 16, step: 6 }),
    pL: SL('Ascending Shield', 'pQuake', 'pShieldUp', { hitbox: [10,135,40,200] }),
    pE: SF('p', 'Pommel Smash', 'pBashW', 'pSlash', { dmg: 54, hitbox: [15,150,60,150] }),
    pl2: SG('k', 'Low Cut 2', 'pThrustW', 'pLowCut', { low: true, hitbox: [20,170,0,50] }),
    plE: SF('k', 'Shield Sweep', 'pBashW', 'pQuake', { low: true, hitbox: [0,150,0,45], dmg: 52 }),
    jPalm: SJ('p', 'Shield Lift', 'pBashW', 'pShieldUp', { hitbox: [10,135,40,250] }),
    jElbow: SJ('p', 'Sword Lift', 'pRiseW', 'pRise', { hitbox: [10,170,40,260], dmg: 26 }),
    jUpper: SJ('p', 'Rising Cleave', 'pRiseW', 'pRise', { hitbox: [10,170,40,270], dmg: 30, jugVy: 8 }),
    jSpin: SJF('Judgement Cleave', 'pCleaveW', 'pCleave', { hitbox: [10,190,30,300], burst: [130, 170], kdVx: 10 }),
    aPalm: SA('p', 'Air Slash', 'pAir', { hitbox: [5,150,10,130] }), aElbow: SA('p', 'Air Shield Bash', 'pAir', { hitbox: [5,110,10,130] }),
    aKunai: SA('p', 'Air Sword Flurry', 'pAir', { str: 1, startup: 4, active: 9, recovery: 8, multi: 3, interval: 3, dmg: 12, lastDmg: 20, jugVy: 3.5, hitbox: [5,155,0,130] }),
    aSpin: SAF('Air Cleave', 'pAirDown', { hitbox: [5,160,0,140] }),
  },
  kappa: { // Kappa: claws, beak bites, the shell — and a throw to end the string
    c2: SG('p', 'Backhand Claw', 'kClawDown', 'kClawUp', { claw: [80, 120, -0.8, 46], advHit: 11 }), // (advHit: it leads into the 17F ankle bite as a true combo)
    c3: SG('p', 'Ankle Bite', 'crouch', 'kLowClaw', { low: true, step: 4, hitbox: [20,105,0,40], claw: [80, 26, 0.2, 44], advHit: 15 }), // U, U, U: a low (advHit: it leads into the 21F tail sweep as a true combo)
    c4: SG('p', 'Tail Sweep', 'crouch', 'kBelly', { low: true, step: 6, hitbox: [0,135,0,40], dmg: 30, advHit: 15 }), // U, U, U, U: a low, the slowest
    cF: SF('k', 'Whirlpool Toss', 'kGrab', 'kToss', { grab: true, kd: false, launch: true, launchVy: 13, hitbox: [10,95,20,150], dmg: 56, onFrame: kappaToss }),
    cL: SL('Upward Rake', 'kClawDown', 'kClawUp', { claw: [60, 140, -1.3, 70] }),
    cE: SF('p', 'Shell Slam', 'kCurl', 'kCurl', { spin: [2, 10], step: 7, hitbox: [10,100,0,110], dmg: 54 }),
    cl2: SG('k', 'Ankle Claw', 'crouch', 'kLowClaw', { low: true, hitbox: [20,110,0,40], claw: [80, 26, 0.2, 44] }),
    clE: SF('k', 'Belly Trip', 'crouch', 'kBelly', { low: true, step: 9, hitbox: [0,120,0,40], dmg: 48 }),
    // juggles: he hops up into them every time, claws raking right where they are
    jPalm: SJ('p', 'Rake Lift', 'kClawDown', 'kClawUp', { hop: 45, hitbox: [5,95,20,240], claw: [0, 0, -1.2, 62, null, 'tgt'] }),
    jElbow: SJ('p', 'Beak Peck', 'kIdle', 'kPeckUp', { hop: 'tgt', multi: 3, interval: 3, dmg: 10, lastDmg: 12, hitbox: [5,90,40,230], recovery: 12,
      onFrame: (f, o, mf) => { const k = mf - f.move.startup; if (k === 1 || k === 4 || k === 7) { parts.push({ type: 'ring', x: o.x - f.facing * 6, y: GROUND - o.y - 70 * o.ch.scale, r: 4, vr: 3, life: 8, max: 8, col: '255,210,90' }); sfx('block'); } } }),
    jUpper: SJ('p', 'Rising Rake', 'kClawDown', 'kClawUp', { hop: 80, hitbox: [5,95,20,240], dmg: 30, jugVy: 8, claw: [0, 0, -1.3, 72, null, 'tgt'] }),
    jRise: { kind: 'p', str: 1, label: 'Geyser Hop', wind: 'kClawDown', pose: 'kClawUp', jug: true, hop: 115, startup: 6, active: 5, recovery: 17, dmg: 34, hitbox: [5,100,20,240],
      relaunch: true, jugVy: 8, advHit: 4, advBlock: -10, hitstop: 9, claw: [0, 0, -1.4, 76, null, 'tgt'],
      onFrame: (f, o, mf) => { if (mf === 2) { parts.push({ type: 'wcol', x: f.x, w: 36, life: 16, max: 16, col: '150,215,255' }); sfx('flame'); } } },
    jSpin: SJF('Shell Cannonball', 'kCurl', 'kCurl', { hop: 'tgt', spin: [1, 12], hitbox: [-30,95,0,150], kdVx: 14, recovery: 14,
      onFrame: (f, o, mf) => { if (mf % 3 === 0 && mf < 14) parts.push({ type: 'aura', x: f.x - f.facing * 14, y: GROUND - f.y - 40, vx: -f.facing, vy: 0.5, life: 10, max: 10, r: 3, col: '150,215,255' }); } }),
    aPalm: SA('p', 'Air Rake', 'kAirClaw', { claw: [70, 90, 0.8, 44] }), aElbow: SA('p', 'Air Peck', 'kBite'),
    aKunai: SA('p', 'Air Claw Flurry', 'kAirClaw', { str: 1, startup: 4, active: 9, recovery: 8, multi: 3, interval: 3, dmg: 12, lastDmg: 20, jugVy: 3.5, claw: [70, 90, -0.8, 50] }),
    aSpin: SAF('Air Shell Spin', 'kCurl', { spin: [1, 5] }),
  },
  gunman: { // Jesse: a string of shots, ending point-blank
    g2: SG('p', 'Second Shot', 'gIdle', 'gAim', { hitbox: null, onFrame: gun({ y: 120, vx: 24, life: 12, dmg: 22 }) }),
    g3: SG('p', 'Cross Draw', 'gAim', 'gTwin', { hitbox: null, onFrame: gun([{ y: 126, vx: 24, life: 12, dmg: 14 }, { y: 104, vx: 24, life: 12, dmg: 14 }]) }),
    g4: SG('p', 'Spin Shot', 'gTwin', 'gTwin', { spin: [1, 7], startup: 8, hitbox: null, onFrame: gun({ y: 116, vx: 24, life: 12, dmg: 26 }) }),
    gF: SF('k', 'Point-Blank Blast', 'gAim', 'gRecoil', { hitbox: null, onFrame: gun({ y: 118, vx: 26, life: 10, dmg: 64, big: true, kd: true }) }),
    gL: SL('Sky Shot', 'gLow', 'gUp', { hitbox: null, onFrame: (f, o, mf) => { gun({ y: 84, vx: 16, vy: 8, life: 14, dmg: 36, launch: true, launchVy: 12, jugVy: 11 })(f, o, mf); if (o.state === 'knock' && mf > f.move.startup) f.move.recovery = Math.min(f.move.recovery, 6); } }),
    gE: SF('k', 'Heavy Shot', 'gAim', 'gRecoil', { hitbox: null, onFrame: gun({ y: 118, dmg: 50, big: true, kd: true }) }),
    gl2: SG('k', 'Low Shot 2', 'gAimLow', 'gAimLow', { hitbox: null, onFrame: gun({ y: 30, dmg: 22, low: true }) }),
    glE: SF('k', 'Ground Shot', 'gLow', 'gLow', { hitbox: null, onFrame: gun({ y: 24, dmg: 40, low: true, kd: true }) }),
  },
  salary: { // Tanaka: a desperate office worker's string
    s2: SG('p', 'Briefcase Swing', 'slamW', 'sCase', { hitbox: [10,110,50,150], dmg: 30 }),
    s3: SG('p', 'Necktie Whip', 'palmW', 'sTie', { hitbox: [30,130,90,150], drawFX: tieWhip }),
    s4: SG('p', 'Shoulder Bump', 'crouch', 'sShove', { step: 8, hitbox: [10,90,40,150], push: 4, dmg: 30 }),
    sF: SF('p', 'Panic Shove', 'crouch', 'sShove', { kdVx: 14, onFrame: (f, o, mf) => hopBack(f, f.move.startup + 4, 16, 10) }), // ...and run away
    sL: SL('Briefcase Upper', 'crouch', 'uppercut', { hitbox: [10,100,40,195] }),
    sE: SF('p', 'Desk Slam', 'slamW', 'sCase', { dmg: 52, kdVx: 6, kdVy: 10 }),
    sl2: SG('k', 'Shin Kick', 'kickW', 'lowKick', { low: true, hitbox: [20,80,8,44] }),
    slE: SF('k', 'Briefcase Sweep', 'crouch', 'slideKick', { low: true, step: 8, hitbox: [0,95,0,34], dmg: 48 }),
    jPalm: SJ('p', 'Briefcase Lift', 'slamW', 'sCase'), jElbow: SJ('p', 'Necktie Whip', 'palmW', 'sTie', { drawFX: tieWhip, hitbox: [20,130,50,260] }),
    jUpper: SJ('p', 'Overtime Upper', 'uppercutW', 'uppercut', { dmg: 30, jugVy: 8 }), jSpin: SJF('Desk Drop Heel', 'kickW', 'axe', { kdVx: 8, kdVy: 9 }),
    aPalm: SA('p', 'Air Briefcase', 'sCase'), aElbow: SA('p', 'Air Tie Whip', 'sTie', { drawFX: tieWhip }),
    aKunai: SA('p', 'Air Paper Storm', 'palm', { str: 1, startup: 4, active: 9, recovery: 8, multi: 3, interval: 3, dmg: 12, lastDmg: 20, jugVy: 3.5 }),
    aSpin: SAF('Air Commuter Kick', 'roundhouse', { spin: [1, 4] }),
  },
  salaryAngel: { // possessed by the angel: open palms, wings and light
    a2: SG('p', 'Wing Slap', 'palmW', 'saIdle', { burst: [80, 130] }),
    a3: SG('p', 'Halo Chop', 'slamW', 'palm', { hitbox: [20,95,70,160], burst: [90, 150] }),
    a4: SG('p', 'Feather Palm', 'palmW', 'blast', { step: 6, burst: [100, 115], dmg: 30 }),
    aF: SF('p', 'Judgement Fist', 'saPray', 'straight', { kd: false, stunT: 56, stunKind: 'holy', push: 3, burst: [100, 118], onFrame: (f, o, mf) => hopBack(f, f.move.startup + 4, 14, 8) }), // stuns, and he steps back
    aL: SL('Holy Rise', 'crouch', 'uppercut', { burst: [60, 170] }),
    aE: SF('p', 'Light Palm', 'palmW', 'blast', { burst: [100, 115], dmg: 54 }),
    al2: SG('k', 'Feather Kick', 'kickW', 'lowKick', { low: true, hitbox: [20,80,8,44] }), alE: SF('k', 'Halo Sweep', 'crouch', 'slideKick', { low: true, step: 8, hitbox: [0,95,0,34] }),
    jPalm: SJ('p', 'Feather Lift', 'palmW', 'blast', { burst: [90, 130] }), jElbow: SJ('p', 'Wing Strike', 'palmW', 'saIdle', { burst: [70, 140] }),
    jUpper: SJ('p', 'Rising Light', 'uppercutW', 'uppercut', { burst: [70, 160], jugVy: 8 }), jSpin: SJF('Halo Kick', 'kickW', 'highKick', { burst: [100, 160] }),
  },
  salaryDevil: { // possessed by the devil: claws, horns and a tail
    d2: SG('p', 'Hellclaw', 'kClawUp', 'kClawDown', { claw: [80, 100, 0.8, 48, '255,120,90'] }),
    d3: SG('p', 'Horn Butt', 'crouch', 'sdIdle', { hitbox: [20,90,90,160], dmg: 30 }),
    d4: SG('k', 'Tail Whip', 'spinW', 'roundhouse', { spin: [2, 8], hitbox: [-30,100,30,120], dmg: 30 }),
    dF: SF('k', 'Brimstone Kick', 'kickW', 'highKick', { claw: [90, 130, 0.6, 70, '255,140,60'], kdVx: 14 }),
    dL: SL('Hellclaw Upper', 'kClawDown', 'kClawUp', { claw: [60, 150, -1.3, 70, '255,120,90'] }),
    dE: SF('p', 'Demon Palm', 'kClawUp', 'kClawX', { claw: [90, 110, 0.9, 64, '255,120,90'], dmg: 56 }),
    dl2: SG('k', 'Low Talon', 'crouch', 'kLowClaw', { low: true, hitbox: [20,110,0,40], claw: [80, 26, 0.2, 44, '255,120,90'] }), dlE: SF('k', 'Tail Sweep', 'crouch', 'slideKick', { low: true, step: 8, hitbox: [0,100,0,34] }),
    jPalm: SJ('p', 'Claw Lift', 'kClawDown', 'kClawUp', { claw: [60, 150, -1.3, 60, '255,120,90'] }), jElbow: SJ('p', 'Horn Butt', 'crouch', 'sdIdle', { hitbox: [10,95,50,250] }),
    jUpper: SJ('p', 'Hellclaw Upper', 'kClawDown', 'kClawUp', { claw: [60, 160, -1.3, 70, '255,120,90'], jugVy: 8 }), jSpin: SJF('Hellfire Kick', 'kickW', 'highKick', { claw: [90, 170, 0.6, 80, '255,140,60'] }),
  },
};
// wire every table into the same shape: U U U U K, I launches from any point, K finishes from any point; J J K low; U U K / U I in the air
function wireStrings() {
for (const [key, t] of Object.entries(STRINGS)) {
  const pre = Object.keys(t).find(k => k.endsWith('2') && !k.includes('l')).slice(0, -1);
  t[pre + '2'].chain = { lp: pre + '3', hp: pre + 'L', hk: pre + 'E' };
  t[pre + '3'].chain = { lp: pre + '4', hp: pre + 'L', hk: pre + 'E' };
  t[pre + '4'].chain = { hk: pre + 'F', hp: pre + 'L' };
  t[pre + 'l2'].chain = { hk: pre + 'lE' };
  t.$start = { p: { lp: pre + '2', hp: pre + 'L', hk: pre + 'E' }, k: { lk: pre + 'l2', hk: pre + 'lE' } };
  if (t.jPalm) t.jPalm.chain = { lp: 'jElbow', hp: 'jRise', hk: 'jSpin' };
  if (t.jElbow) t.jElbow.chain = { lp: 'jUpper', hp: 'jRise', hk: 'jSpin' };
  if (t.jUpper) t.jUpper.chain = { hk: 'jSpin', hp: 'jRise' };
  if (t.aPalm) t.aPalm.chain = { lp: 'aElbow', hp: 'aKunai', hk: 'aSpin', dhk: 'aMeteor' };
  if (t.aElbow) t.aElbow.chain = { hp: 'aKunai', hk: 'aSpin', dhk: 'aMeteor' };
  if (t.aKunai) t.aKunai.chain = { hk: 'aSpin', dhk: 'aMeteor' };
  if (t.jRise && !t.jRise.chain) t.jRise.chain = { hk: 'jSpin' };
}
}
wireStrings();
STRINGS.kappa.$start.k = null; // the kappa's J is a throw, not the start of a string
/* ================= U U I and U U K in the air: each fighter's own aerial versions =================
   In a juggle (they're up, you're on the ground): U, U, I relaunches and U, U, K finishes, each different from the ground string.
   Jumping (both in the air): U, U, I is a flurry and U, U, K an aerial finisher. */
const JR = (label, wind, pose, o = {}) => ({ kind: 'p', str: 1, label, wind, pose, jug: true, startup: 7, active: 4, recovery: 17, dmg: 34, hitbox: [5,100,45,255], relaunch: true, jugVy: 8, advHit: 4, advBlock: -10, hitstop: 9, ...o });
const AK = (label, pose, o = {}) => ({ kind: 'p', str: 1, stance: 'j', air: true, hover: true, label, wind: 'jump', pose, startup: 4, active: 9, recovery: 8, multi: 3, interval: 3, dmg: 12, lastDmg: 20, hitbox: [5,92,0,135], jugVy: 3.5, ...o });
const atO = (o, dy = 70) => [o.x, GROUND - o.y - dy * o.ch.scale];
Object.assign(STRINGS.ninja, {
  aPalm: SA('p', 'Air Kunai Slash', 'slash', { blade: true }), aElbow: SA('p', 'Air Reverse Slash', 'kReverse', { blade: true }),
  jRise: JR('Shadow Clone Rise', 'uppercutW', 'kunaiRise', { blade: true, // a shadow clone springs up beneath them and uppercuts them back into the air
    drawFX(f, o) { if (!o || f.mf < 2 || f.mf > f.move.startup + 9) return; const k = Math.min(1, f.mf / f.move.startup);
      drawBody('ninja', POSES.uppercut, o.x - f.facing * 26, GROUND - Math.max(0, o.y - 60) + 30 * (1 - k), f.facing, hipFor(POSES.uppercut), { tint: '#7a5ad0', alpha: 0.55 }); } }),
  jSpin: SJF('Shadow Slash', 'slashW', 'slash', { kind: 'p', blade: true, // a huge kunai slash, shadow afterimages behind it
    trail: { cx: 15, cy: 110, r: 120, a0: 100, a1: -50, col: '225,235,255' },
    onFrame: (f, o, mf) => { if (mf === f.move.startup + 1) { const [x, y] = atO(o); parts.push({ type: 'slashx', x, y, r: 58, life: 12, max: 12, col: '190,150,255', rot: -0.6 }); sfx('slash'); } },
    drawFX(f) { const S = f.move.startup; if (f.mf < S - 2 || f.mf > S + 7) return;
      for (let k = 3; k >= 1; k--) drawBody('ninja', f.pose, f.x - f.facing * k * 16, GROUND - f.y, f.facing, f.hipUp, { tint: '#6a4ac0', alpha: 0.42 - k * 0.1 }); } }),
  aKunai: AK('Kunai Rain', 'slash', { blade: true, // three kunai fanned down at them
    drawFX(f, o) { const S = f.move.startup; if (!o || f.mf < S || f.mf > S + 9) return; const a = 1 - (f.mf - S) / 10;
      fxLighter(() => { for (let k = 0; k < 3; k++) { const x0 = f.x + f.facing * 30, y0 = GROUND - f.y - 110, x1 = o.x + (k - 1) * 18, y1 = GROUND - o.y - 40 - k * 20; ctx.strokeStyle = `rgba(230,238,255,${a})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); } }); } }),
  aSpin: SAF('Shadow Wheel', 'roundhouse', { spin: [1, 6], // a cartwheel inside a violet wheel
    drawFX(f) { if (f.mf > 14) return; fxLighter(() => { ctx.strokeStyle = 'rgba(170,130,255,.7)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(f.x, GROUND - f.y - 80, 62, f.mf * 0.6, f.mf * 0.6 + 4.6); ctx.stroke(); }); } }),
});
Object.assign(STRINGS.brawler, {
  jRise: JR('Qi Geyser Palm', 'palmUp', 'tHammer', { aura: true, // he doesn't punch up at them: he slams his palm into the floor, and the qi tears along the ground and erupts under them
    onFrame: (f, o, mf) => { const S = f.move.startup;
      if (mf === S - 2) { parts.push({ type: 'ering', x: f.x + f.facing * 40, y: GROUND, r: 8, vr: 7, life: 12, max: 12, col: '125,235,255' }); cracks(f.x + f.facing * 40); game.shake = Math.max(game.shake, 3); sfx('land'); }
      if (mf >= S - 2 && mf < S) for (let i = 0; i < 3; i++) parts.push({ type: 'aura', x: lerp(f.x, o.x, (mf - S + 3) / 3 + rnd(-0.08, 0.08)), y: GROUND - 6, vx: 0, vy: -rnd(1, 3), life: 12, max: 12, r: rnd(3, 5), col: '125,235,255' }); // qi racing along the floor
      if (mf === S) { parts.push({ type: 'wcol', x: o.x, w: 38, life: 18, max: 18, col: '125,235,255' }); cracks(o.x); sfx('qi'); } } }),
  jSpin: SJF('Thunder Palms', 'blastW', 'blast', { aura: true, kdVx: 15, // both palms, and a sphere of hexagons bursts on them
    drawFX(f, o) { const S = f.move.startup; if (!o || f.mf < S || f.mf > S + 10) return; const [x, y] = atO(o), r = 18 + (f.mf - S) * 7, a = 1 - (f.mf - S) / 11;
      fxLighter(() => { for (let k = 0; k < 2; k++) { ctx.strokeStyle = `rgba(125,235,255,${0.8 * a})`; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 6; i++) { const an = i * Math.PI / 3 + k * 0.5; const px = x + Math.cos(an) * (r + k * 12), py = y + Math.sin(an) * (r + k * 12); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); } }); } }),
  aKunai: AK('Hundred Fists', 'palm', { multi: 4, interval: 2, dmg: 9, lastDmg: 18, aura: true, // a blur of fists
    drawFX(f) { const S = f.move.startup; if (f.mf < S || f.mf > S + 10) return; fxLighter(() => { for (let k = 0; k < 5; k++) { const x = f.x + f.facing * (50 + ((f.mf * 7 + k * 13) % 40)), y = GROUND - f.y - 90 - ((k * 17) % 50); ctx.fillStyle = 'rgba(125,235,255,.45)'; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill(); } }); } }),
  aSpin: SAF('Falling Mountain', 'tHammer', { kdVx: 4, kdVy: -9, aura: true, // a hammer fist that drives them into the ground
    onFrame: (f, o, mf) => { if (mf === f.move.startup) parts.push({ type: 'ering', x: o.x, y: GROUND, r: 10, vr: 8, life: 16, max: 16, col: '125,235,255' }); } }),
});
Object.assign(STRINGS.staff, {
  jRise: JR('Pinwheel Rise', 'staffLow', 'staffRise', { spinStaff: true, hitbox: [5,150,45,260], // the staff whirls like a pinwheel, carrying them up
    onFrame: (f, o, mf) => { if (mf === f.move.startup) for (let i = 0; i < 5; i++) parts.push({ type: 'star', x: o.x + rnd(-20, 20), y: GROUND - o.y - rnd(40, 120), vx: 0, vy: -rnd(2, 4), r: 3.5, vr: -0.1, life: 16, max: 16, col: '255,210,110', rot: R() * 3 }); } }),
  jSpin: SJF('Cloud Staff Smash', 'staffRise', 'staffSlam', { kind: 'p', hop: 'tgt', spinStaff: true, staffExt: 30, hitbox: [10,190,-90,260], kdVx: 12, recovery: 16, // (the slam reaches down below her: it catches them as they fall) she springs up on a cloud, the staff whirling, and smashes it down on them
    trail: { cx: 20, cy: 90, r: 140, a0: 110, a1: -40, col: '255,205,110' },
    poseFn: (f, mf) => mf < f.move.startup ? POSES.staffRise : null,
    onFrame: (f, o, mf) => { f.move.spinStaff = mf < f.move.startup; if (mf % 2 === 0 && mf < 12) cloudPuff(f.x - f.facing * 10, GROUND - f.y + 4);
      if (mf === f.move.startup + 1) { sfx('hitH'); for (let i = 0; i < 6; i++) parts.push({ type: 'star', x: o.x + rnd(-20, 20), y: GROUND - o.y - rnd(30, 90), vx: rnd(-3, 3), vy: rnd(-3, 1), r: 3.5, vr: -0.1, life: 18, max: 18, col: '255,210,110', rot: R() * 3 }); } } }),
  aKunai: AK('Air Staff Flurry', 'airStaff', { spinStaff: true, hitbox: [5,155,0,135],
    drawFX(f) { const S = f.move.startup; if (f.mf < S || f.mf > S + 9) return; fxLighter(() => { ctx.strokeStyle = 'rgba(255,210,110,.6)'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { const y = GROUND - f.y - 80 - k * 18; ctx.beginPath(); ctx.moveTo(f.x + f.facing * 30, y); ctx.lineTo(f.x + f.facing * 150, y + 6); ctx.stroke(); } }); } }),
  aSpin: SAF('Golden Pinwheel', 'airStaffWhirl', { spinStaff: true, hitbox: [-60,165,0,140],
    drawFX(f) { if (f.mf > 14) return; fxLighter(() => { ctx.strokeStyle = 'rgba(255,210,110,.75)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(f.x, GROUND - f.y - 80, 120, 40, 0, f.mf * 0.7, f.mf * 0.7 + 4.4); ctx.stroke(); }); } }),
});
Object.assign(STRINGS.psychic, {
  jRise: { kind: 'p', str: 1, label: 'Crystal Meteor', wind: 'psyRaise', pose: 'psyCast', jug: true, stay: true, startup: 19, active: 3, recovery: 17, dmg: 0, hitbox: null, relaunch: true, // a great magic circle opens high above them and a giant crystal meteor falls out of it
    onFrame: (f, o, mf) => { f.vx = 0; const S = f.move.startup; if (mf === 2) sfx('charge');
      if (mf === S && Math.abs(o.x - f.x) <= LYRA_RANGE) { const y = GROUND - o.y - 70 * o.ch.scale;
        columnHit(f, o, { dmg: 36, stun: 24, bstun: 12, push: 0.4, juggle: true, jugVy: 10, relaunch: true, hitstop: 12, label: 'Crystal Meteor' });
        crystalShatter(o.x, y, true); crystalShatter(o.x, y, true); parts.push({ type: 'ring', x: o.x, y, r: 12, vr: 9, life: 16, max: 16, col: '255,210,250' }); game.shake = Math.max(game.shake, 7); sfx('hitH');
        if (o.state === 'knock') { f.hitConnected = true; f.lastResult = 'hit'; } } },
    drawFX: (f, o) => { const S = f.move.startup; if (!o || f.mf < 1 || f.mf > S + 6) return;
      const tx = o.x, ty = GROUND - o.y - 70 * o.ch.scale, cy = Math.max(160, ty - 170), cx = tx - f.facing * 180, k = Math.min(1, f.mf / S), fade = f.mf > S ? 1 - (f.mf - S) / 6 : 1; // the circle opens up and back, below the HUD, so the meteor streaks in at an angle
      ctx.save(); ctx.translate(cx, cy); ctx.scale(1, 0.38); drawTriCircle(0, 0, 96, Math.min(1, f.mf / 4) * fade, f.mf * 0.12); drawTriCircle(0, 0, 70, 0.6 * Math.min(1, f.mf / 4) * fade, -f.mf * 0.16); ctx.restore(); // the great circle in the sky
      if (f.mf <= S) { const e = k * k, x = lerp(cx, tx, e), y = lerp(cy, ty, e), rot = Math.atan2(tx - cx, -(ty - cy)) + Math.PI; // the meteor: a giant crystal with a blazing tail
        fxLighter(() => { const g = ctx.createLinearGradient(cx, cy, x, y); g.addColorStop(0, 'rgba(255,190,245,0)'); g.addColorStop(1, 'rgba(255,230,255,.9)'); ctx.strokeStyle = g; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); });
        drawCrystal(x, y, 40, 1, rot);
      } else fxLighter(() => { ctx.fillStyle = `rgba(255,240,255,${0.7 * fade})`; ctx.beginPath(); ctx.arc(tx, ty, 70 * (1.4 - fade * 0.4), 0, Math.PI * 2); ctx.fill(); }); } },
  jSpin: LCR('Trinity Burst', { kind: 'k', str: 1, crystals: 3, gap: 4, cdmg: [12, 12, 34], jugVy: 5, kdEnd: true, kdVx: 6, kdVy: -6, csize: 30, recovery: 16, startup: 9 }), // a giant crystal crashes down on them
  aKunai: AK('Shard Barrage', 'airPsyBoth', { hitbox: [5,140,0,135],
    drawFX(f, o) { const S = f.move.startup; if (!o || f.mf < S || f.mf > S + 9) return; const k = (f.mf - S) / 9;
      for (let i = 0; i < 3; i++) { const x = lerp(f.x + f.facing * 30, o.x, Math.min(1, k * 1.4 - i * 0.15)), y = lerp(GROUND - f.y - 100, GROUND - o.y - 70, Math.min(1, k * 1.4 - i * 0.15)) + (i - 1) * 12;
        ctx.fillStyle = 'rgba(220,240,255,.95)'; ctx.beginPath(); ctx.moveTo(x + f.facing * 12, y); ctx.lineTo(x, y - 5); ctx.lineTo(x - f.facing * 8, y); ctx.lineTo(x, y + 5); ctx.closePath(); ctx.fill(); } } }),
  aSpin: SAF('Orbit Burst', 'airPsyBoth', { hitbox: [-40,140,0,150], // runes orbit her, then burst outward
    drawFX(f) { if (f.mf > 16) return; for (let i = 0; i < 4; i++) { const an = f.mf * 0.4 + i * Math.PI / 2, r = 40 + f.mf * 3; drawPsyFist(f.x + Math.cos(an) * r, GROUND - f.y - 90 + Math.sin(an) * r * 0.5, 0.35, 1, 1 - f.mf / 17, an); } } }),
});
Object.assign(STRINGS.paladin, {
  jRise: JR('Ascension', 'pBashW', 'pShieldUp', { hitbox: [10,140,45,260],
    onFrame: (f, o, mf) => { if (mf === f.move.startup) { parts.push({ type: 'lbeam', x: o.x, w: 30, life: 14, max: 14 }); for (let i = 0; i < 5; i++) parts.push({ type: 'spark', x: o.x + rnd(-20, 20), y: GROUND - o.y - rnd(20, 120), vx: 0, vy: -rnd(2, 3), life: 18, max: 18, col: '235,245,255' }); sfx('orb'); } } }),
  jSpin: SJF('Cross of Judgement', 'pCleaveW', 'pCleave', { hitbox: [10,190,0,300], startup: 7, kdVx: 12,
    onFrame: (f, o, mf) => { if (mf === f.move.startup + 1) { const [x, y] = atO(o); for (const rot of [Math.PI / 4, -Math.PI / 4]) parts.push({ type: 'slashx', x, y, r: 56, life: 14, max: 14, col: '190,225,255', rot }); } } }),
  aKunai: AK('Blade Halo Flurry', 'pAir', { hitbox: [5,155,0,135],
    drawFX(f) { const S = f.move.startup; if (f.mf < S || f.mf > S + 9) return; fxLighter(() => { ctx.strokeStyle = 'rgba(190,225,255,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(f.x, GROUND - f.y - 90, 110, -0.9 + f.mf * 0.3, -0.1 + f.mf * 0.3); ctx.stroke(); }); } }),
  aSpin: SAF('Plunging Light', 'pAirDown', { hitbox: [5,160,0,140], kdVx: 4, kdVy: -9,
    onFrame: (f, o, mf) => { if (mf === f.move.startup) parts.push({ type: 'lbeam', x: o.x, w: 22, life: 10, max: 10 }); } }),
});
Object.assign(STRINGS.kappa, {
  aKunai: AK('Rain Claws', 'kAirClaw', { claw: [0, 0, 0.9, 52, null, 'tgt'],
    onFrame: (f, o, mf) => { if (mf === f.move.startup + 4 || mf === f.move.startup + 7) { clawSwipe(f, [0, 0, mf % 2 ? -0.9 : 0.9, 52, null, 'tgt'], o); parts.push({ type: 'aura', x: o.x, y: GROUND - o.y - 60, vx: 0, vy: 2, life: 12, max: 12, r: 3, col: '150,215,255' }); } } }),
  aSpin: SAF('Waterfall Dive', 'kCurl', { spin: [1, 8], kdVx: 5, kdVy: -9,
    onFrame: (f, o, mf) => { if (mf % 2 === 0 && mf < 12) parts.push({ type: 'aura', x: f.x, y: GROUND - f.y - 40, vx: 0, vy: 2.5, life: 14, max: 14, r: 4, col: '150,215,255' }); } }),
});
Object.assign(STRINGS.gunman, {
  jRise: JR('Coin Shot', 'gIdle', 'gUp', { hitbox: null, poseFn: aimPose, // flips a coin up past them and shoots it: the ricochet knocks them higher
    onFrame: (f, o, mf) => { if (mf === 2) { parts.push({ type: 'star', x: f.x + f.facing * 20, y: GROUND - f.y - 120, vx: f.facing * 0.5, vy: -6, r: 4, vr: 0, life: 14, max: 14, col: '255,215,90', rot: 0 }); sfx('select'); }
      if (mf === f.move.startup) aimShot(f, o, { dmg: 30, jugVy: 11 }); } }),
  jSpin: SJF('Six-Shooter Finale', 'gAim', 'gTwin', { hitbox: null, recovery: 18, // six shots in a heartbeat, the last one knocks them away
    poseFn: (f, mf) => { const p = aimPose(f); if (mf > f.move.startup && (mf - f.move.startup) % 2) { p.a1u += 14; p.a1l += 22; } return p; }, // each shot kicks the gun up
    onFrame: (f, o, mf) => { const k = (mf - f.move.startup) / 2; if (mf >= f.move.startup && Number.isInteger(k) && k < 6) aimShot(f, o, { dmg: k < 5 ? 7 : 22, jugVy: k < 5 ? 3 : 4, kd: k === 5 }); } }),
  aKunai: AK('Air Fan', 'gAirDown', { hitbox: null, multi: 1, poseFn: aimPose, onFrame: (f, o, mf) => { const S = f.move.startup; if (mf === S || mf === S + 3 || mf === S + 6) aimShot(f, o, { dmg: 10, jugVy: 3.5 }); } }),
  aSpin: SAF('Diving Volley', 'gAirDown', { hitbox: null, poseFn: aimPose, onFrame: (f, o, mf) => { const S = f.move.startup; if (mf === S || mf === S + 2 || mf === S + 4) aimShot(f, o, { dmg: mf === S + 4 ? 22 : 10, jugVy: 2, kd: mf === S + 4 }); } }),
});
Object.assign(STRINGS.salary, {
  jRise: JR('Elevator Uppercut', 'crouch', 'uppercut', { // going up!
    onFrame: (f, o, mf) => { if (mf === f.move.startup) { popText(f.x, GROUND - 210, L('GOING UP!', '上へ参ります！'), '230,230,240'); sfx('rise'); } } }),
  jSpin: SJF('Paperwork Storm', 'palmW', 'blast', {
    onFrame: (f, o, mf) => { if (mf === f.move.startup) for (let i = 0; i < 10; i++) parts.push({ type: 'spark', x: o.x, y: GROUND - o.y - 70, vx: rnd(-6, 6), vy: rnd(-6, 2), life: 26, max: 26, col: '250,250,255' }); } }),
  aSpin: SAF('Briefcase Meteor', 'sCase', { kdVx: 4, kdVy: -9 }),
});
Object.assign(STRINGS.salaryAngel, {
  jRise: JR('Feather Ascension', 'palmW', 'uppercut', { burst: [60, 170], onFrame: (f, o, mf) => { if (mf === f.move.startup) for (let i = 0; i < 8; i++) parts.push({ type: 'spark', x: o.x + rnd(-20, 20), y: GROUND - o.y - rnd(0, 80), vx: rnd(-1, 1), vy: -rnd(2, 4), life: 22, max: 22, col: '255,250,230' }); } }),
  jSpin: SJF('Halo Kick', 'kickW', 'highKick', { burst: [100, 160], drawFX(f) { const S = f.move.startup; if (f.mf < S || f.mf > S + 8) return; fxLighter(() => { ctx.strokeStyle = 'rgba(255,220,110,.9)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(f.x + f.facing * 90, GROUND - f.y - 150, 26, 8, 0, 0, Math.PI * 2); ctx.stroke(); }); } }),
});
Object.assign(STRINGS.salaryDevil, {
  jRise: JR('Brimstone Rise', 'kClawDown', 'kClawUp', { claw: [0, 0, -1.3, 64, '255,120,90', 'tgt'], onFrame: (f, o, mf) => { if (mf === f.move.startup) { parts.push({ type: 'wcol', x: o.x, w: 36, life: 16, max: 16, col: '255,100,40' }); sfx('flame'); } } }),
});
wireStrings(); // chain the aerial versions as well
STRINGS.ninja.n2.chain = { ...STRINGS.ninja.n2.chain, dhk: 'nD' }; // Kuro: U, U, ↓ + K ends low
STRINGS.staff.m4.chain = { ...STRINGS.staff.m4.chain, dhk: 'mD' }; STRINGS.staff.$start.p = { ...STRINGS.staff.$start.p, dhk: 'mUD' }; // Mei: U, U, U, U, ↓ + K and U, ↓ + K end low
STRINGS.paladin.pUI = SF('p', 'Low Cleave', 'pThrustW', 'pLowCut', { step: 0, low: true, hitbox: [20,180,0,50], dmg: 46, kd: false, launch: true, launchVy: 13.5, recovery: 16 }); // Aldric: U, ↓ + I (a low that lifts them, as high as his other launchers)
STRINGS.paladin.pUK = SF('k', 'Shield Trip', 'crouch', 'pQuake', { step: 0, low: true, hitbox: [0,165,0,45], dmg: 50 }); // Aldric: U, ↓ + K (a low that trips them)
STRINGS.paladin.$start.p = { ...STRINGS.paladin.$start.p, dhp: 'pUI', dhk: 'pUK' };
STRINGS.kappa.cUI = SL('Surfacing Rake', 'crouch', 'kClawUp', { step: 0, low: true, hitbox: [10,140,0,60], claw: [60, 40, -1.3, 60], launchVy: 13.5, recovery: 16 }); // Kappa: U, ↓ + I (a low launcher)
STRINGS.kappa.cUK = SF('k', 'Shell Sweep', 'crouch', 'kBelly', { step: 0, low: true, hitbox: [0,145,0,40], dmg: 50 }); // Kappa: U, ↓ + K (a low that trips them)
STRINGS.kappa.$start.p = { ...STRINGS.kappa.$start.p, dhp: 'cUI', dhk: 'cUK' };
STRINGS.brawler.t4.chain = { ...STRINGS.brawler.t4.chain, dhk: 'tD' }; STRINGS.brawler.tl2.chain = { ...STRINGS.brawler.tl2.chain, dhk: 'tlD' }; // Tetsu: U, U, U, U, ↓ + K ends low; J, J, ↓ + K with a mid kick (J, J, K the high one)
STRINGS.kappa.$start.k = null;
// fists, kunai and briefcases are short: in a juggle these fighters spring up to where the opponent is, so the blow really reaches them
// (instead of a short blade somehow hitting someone high above). The hit area is now measured from where he is in the air.
for (const key of ['ninja', 'brawler', 'salary', 'salaryAngel', 'salaryDevil']) for (const id of ['jPalm', 'jElbow', 'jUpper', 'jSpin']) {
  const d = STRINGS[key] && STRINGS[key][id]; if (!d) continue;
  if (id === 'jPalm' && (key === 'ninja' || key === 'brawler')) { d.reachFX = key; continue; } // (their first juggle hit can be cancelled into a technique, so it stays on the ground: a wave of shadow / qi carries the blow up to them)
  d.hop = 'tgt'; const hb = d.hitbox || [10, 95, 45, 250]; d.hitbox = [hb[0], Math.min(hb[1], id === 'jSpin' ? 120 : 105), 10, 200];
}

/* ================= signature U U K (finisher) and U U I (launcher) for every fighter, built on their theme =================
   Kuro    — shadow & moonlight (violet, silver): vanishes and drops a crescent; a full moon of kunai rises
   Tetsu   — iron qi & mountains (cyan, bronze): stomps the ground open, then twin palms; a qi dragon spirals up
   Mei     — monkey king & golden cloud (gold, red): pole-vaults and crashes down; rides a cloud up with the staff
   Lyra    — astral crystal (lilac, crystal blue): a constellation of runes bursts; crystal spires grow under them
   Aldric  — holy steel (pale blue, silver): shield then a cross-shaped cleave of light; a pillar of light lifts them
   Kappa   — river spirit (teal, water blue): a whirlpool of claws; belly-flop splash and a geyser
   Jesse   — desert sundown (amber, dust): a gun twirl and a fanned finale; a ricochet off the floor
   Tanaka  — office overtime (slate, red tie): a deadline dropkick; a promotion uppercut (angel: wings and halo; devil: fire) */
const fxLighter = (fn) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; fn(); ctx.restore(); };
const confetti = (x, y, n = 12) => { const cols = ['255,90,90', '255,210,80', '120,220,140', '120,180,255', '230,140,255']; for (let i = 0; i < n; i++) parts.push({ type: 'spark', x, y, vx: rnd(-5, 5), vy: rnd(-7, -2), life: 26, max: 26, col: cols[i % cols.length] }); };
Object.assign(STRINGS.ninja, {
  nE: { kind: 'k', str: 1, label: 'Crescent Moon Drop', wind: 'jump', pose: 'axe', startup: 16, active: 6, recovery: 18, dmg: 60, hitbox: [-10,75,20,100], // (hitbox: the fallback for other systems; the real one below is the kicking leg)
    limbJoint: 'f1', limbReach: 26, limbBack: 26, limbUp: 16, limbDown: 16, sweepBox: true, // the box rides the leg itself, swept along its own path the same way Vanish Drop Kick's does
    bodyHurt: true, // (fitted to his actual silhouette on the vanish and the drop)
    launch: true, launchVy: 8, bounce: true, hitstop: 12, gdrain: 14, advBlock: -6, /* (−12 once the guard stall is added) */ manualY: true, noPush: true,
    poseFn: (f, mf) => mf < 9 ? POSES.slashW : mf < f.move.startup ? POSES.jump : null,
    onFrame(f, o, mf) { // vanishes, reappears above them, and drops a crescent-moon heel
      const S = f.move.startup;
      if (mf === 1) { f.cm = { x0: f.x, tx: clamp(f.x + f.facing * Math.min(100, Math.max(0, f.facing * (o.x - f.x) - 36)), WALL_L, WALL_R), landed: false }; /* (a short hop: 100px at most — from further away it comes down short) */ sfx('vanish'); for (let i = 0; i < 8; i++) parts.push({ type: 'smoke', x: f.x + rnd(-20, 20), y: GROUND - rnd(30, 150), vx: rnd(-1, 1), vy: -0.6, r: rnd(6, 10), vr: 0.3, life: 20, max: 20, col: '120,90,190' }); }
      f.hidden = mf >= 3 && mf <= 8;
      if (mf <= S) { const e = mf / S; f.x = lerp(f.cm.x0, f.cm.tx, ease(e)); f.y = 140 * Math.sin(Math.PI / 2 * Math.min(1, e / 0.7)); }
      else f.y = Math.max(0, 140 - (mf - S) * 30);
      if (mf === 9) { sfx('slash'); for (let i = 0; i < 6; i++) parts.push({ type: 'smoke', x: f.x + rnd(-14, 14), y: GROUND - f.y - rnd(40, 140), vx: 0, vy: -0.4, r: 7, vr: 0.3, life: 16, max: 16, col: '150,120,220' }); }
      if (mf > S && f.y === 0 && !f.cm.landed) { f.cm.landed = true; parts.push({ type: 'ering', x: f.x + f.facing * 30, y: GROUND, r: 10, vr: 9, life: 16, max: 16, col: '190,150,255' }); game.shake = Math.max(game.shake, 5); sfx('hitH'); dustAt(f.x, true); }
    },
    drawFX(f) { const S = f.move.startup; if (f.mf < S - 5 || f.mf > S + 10) return; const a = f.mf <= S + 4 ? 1 : 1 - (f.mf - S - 4) / 6;
      fxLighter(() => { const cx = f.x + f.facing * 10, cy = GROUND - f.y - 70; // a crescent moon traced by the heel
        ctx.fillStyle = `rgba(230,220,255,${0.75 * a})`; ctx.beginPath(); ctx.arc(cx, cy, 64, Math.PI * 0.15, Math.PI * 0.85); ctx.arc(cx, cy - 16, 52, Math.PI * 0.8, Math.PI * 0.2, true); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = `rgba(170,130,255,${0.8 * a})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 66, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke(); }); } },
  nL: { kind: 'p', str: 1, label: 'Moonrise Kunai', wind: 'uppercutW', pose: 'kunaiRise', startup: 9, active: 7, recovery: 18, dmg: 44, hitbox: [0,95,30,225],
    launch: true, launchVy: 14, blade: true, spin: [3, 13], manualY: true, noPush: true, hitstop: 11, gdrain: 10, advBlock: -12,
    onFrame(f, o, mf) { const T = f.move.startup + f.move.active + f.move.recovery; f.y = 75 * Math.sin(Math.PI * Math.min(1, mf / (T * 0.9))); if (mf === f.move.startup) sfx('slash'); },
    drawFX(f) { const S = f.move.startup; if (f.mf < S - 2 || f.mf > S + 12) return; const a = f.mf <= S + 7 ? 1 : 1 - (f.mf - S - 7) / 5, cx = f.x, cy = GROUND - f.y - 100;
      fxLighter(() => { const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80); g.addColorStop(0, `rgba(170,130,255,${0.35 * a})`); g.addColorStop(1, 'rgba(120,90,200,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2); ctx.fill(); // a full moon
        for (let k = 0; k < 3; k++) { const r0 = f.mf * 0.5 + k * Math.PI * 2 / 3; ctx.strokeStyle = `rgba(230,238,255,${0.9 * a})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, 72, r0, r0 + 1.6); ctx.stroke();
          const tx = cx + Math.cos(r0 + 1.6) * 72, ty = cy + Math.sin(r0 + 1.6) * 72; ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.arc(tx, ty, 4, 0, Math.PI * 2); ctx.fill(); } }); } },
});
Object.assign(STRINGS.brawler, {
  tE: { kind: 'p', str: 1, label: 'Mountain Splitter', wind: 'stompW', pose: 'blast', startup: 16, active: 5, recovery: 20, dmg: 66, hitbox: [10,110,30,150],
    kd: true, kdVx: 16, kdVy: 7, hitstop: 13, gdrain: 16, advBlock: -12, aura: true,
    poseFn: (f, mf) => mf < 9 ? POSES.stompW : mf < f.move.startup ? POSES.stomp : null,
    onFrame(f, o, mf) { // stomps the ground open, then drives both palms through them
      f.vx = mf === f.move.startup ? f.facing * 5 : f.vx * 0.6;
      if (mf === 9) { cracks(f.x + f.facing * 30); parts.push({ type: 'ering', x: f.x + f.facing * 40, y: GROUND, r: 10, vr: 8, life: 16, max: 16, col: '125,235,255' }); for (const dx of [60, 95, 130]) parts.push({ type: 'wcol', x: f.x + f.facing * dx, w: 12, life: 12, max: 12, col: '190,150,100' }); game.shake = Math.max(game.shake, 5); sfx('land'); }
      if (mf === f.move.startup) { sfx('palm'); for (let i = 0; i < 3; i++) parts.push({ type: 'hex', x: f.x + f.facing * 90, y: GROUND - 110, r: 10 + i * 8, vr: 3, life: 14, max: 14, col: '125,235,255', rot: i }); }
    },
    drawFX(f) { if (f.mf < 9 || f.mf > 20) return; const a = 1 - (f.mf - 9) / 12; fxLighter(() => { for (let k = 0; k < 2; k++) { const r = 40 + (f.mf - 9) * 12 + k * 26; ctx.strokeStyle = `rgba(125,235,255,${0.7 * a})`; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= 6; i++) { const an = i * Math.PI / 3; const x = f.x + Math.cos(an) * r, y = GROUND + Math.sin(an) * r * 0.25; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } }); } },
  tL: { kind: 'p', str: 1, label: 'Ascending Dragon', wind: 'uppercutW', pose: 'uppercut', startup: 8, active: 7, recovery: 20, dmg: 46, hitbox: [0,95,30,230],
    launch: true, launchVy: 14.5, aura: true, manualY: true, noPush: true, hitstop: 11, gdrain: 10, advBlock: -12,
    onFrame(f, o, mf) { const T = f.move.startup + f.move.active + f.move.recovery; f.y = 60 * Math.sin(Math.PI * Math.min(1, mf / (T * 0.85))); if (mf === f.move.startup) sfx('qi'); },
    drawFX(f) { const S = f.move.startup; if (f.mf < S - 2 || f.mf > S + 14) return; const k = Math.min(1, (f.mf - S + 2) / 6), a = f.mf <= S + 8 ? 1 : 1 - (f.mf - S - 8) / 6;
      fxLighter(() => { for (const ph of [0, Math.PI]) { ctx.strokeStyle = `rgba(125,235,255,${0.85 * a})`; ctx.lineWidth = 5; ctx.beginPath(); // a qi dragon coiling up around him
        for (let t = 0; t <= 1; t += 0.04) { const an = t * Math.PI * 4 + f.mf * 0.4 + ph, x = f.x + Math.cos(an) * 34, y = GROUND - t * 250 * k; t ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
        const hx = f.x + Math.cos(Math.PI * 4 + f.mf * 0.4) * 34, hy = GROUND - 250 * k; ctx.fillStyle = `rgba(220,250,255,${a})`; ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(220,250,255,${a})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx + 20, hy - 14, hx + 30, hy - 4); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx - 20, hy - 14, hx - 30, hy - 4); ctx.stroke(); }); } },
});
Object.assign(STRINGS.staff, {
  mE: { kind: 'p', str: 1, label: 'Golden Cudgel Crash', wind: 'staffRise', pose: 'staffSlam', startup: 18, active: 5, recovery: 18, dmg: 60, hitbox: [0,150,0,170],
    launch: true, launchVy: 8, bounce: true, hitstop: 12, gdrain: 14, advBlock: -12, manualY: true, noPush: true, spinStaff: true, staffExt: 20,
    poseFn: (f, mf) => mf < f.move.startup * 0.6 ? POSES.staffRise : mf < f.move.startup ? POSES.slamW : null,
    onFrame(f, o, mf) { // vaults up on the staff, then crashes it down on them
      const S = f.move.startup; f.move.spinStaff = mf < S - 3;
      if (mf === 1) f.vz = { x0: f.x, tx: clamp(o.x - f.facing * 70, WALL_L, WALL_R), landed: false };
      if (mf <= S) { const e = mf / S; f.x = lerp(f.vz.x0, f.vz.tx, ease(e)); f.y = 120 * Math.sin(Math.PI * 0.95 * e); } else f.y = Math.max(0, f.y - 26);
      if (mf === 3) { cloudPuff(f.x, GROUND - 4); sfx('rise'); }
      if (mf > S && f.y === 0 && !f.vz.landed) { f.vz.landed = true; for (let i = 0; i < 8; i++) parts.push({ type: 'star', x: f.x + f.facing * 110, y: GROUND - 20, vx: rnd(-4, 4), vy: rnd(-6, -1), r: rnd(3, 5), vr: -0.1, life: 20, max: 20, col: '255,210,110', rot: R() * 3 }); cloudPuff(f.x + f.facing * 110, GROUND - 4); game.shake = Math.max(game.shake, 6); sfx('hitH'); }
    },
    drawFX(f) { const S = f.move.startup; if (f.mf < S - 3 || f.mf > S + 8) return; const a = f.mf <= S + 3 ? 1 : 1 - (f.mf - S - 3) / 5;
      fxLighter(() => { ctx.strokeStyle = `rgba(255,210,110,${0.85 * a})`; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(f.x + f.facing * 20, GROUND - f.y - 60, 120, -Math.PI / 2 + (f.facing > 0 ? 0 : Math.PI), (f.facing > 0 ? 0.35 : Math.PI - 0.35), f.facing < 0); ctx.stroke(); }); } },
  mL: { kind: 'p', str: 1, label: 'Cloud Launcher', wind: 'staffLow', pose: 'staffRise', startup: 9, active: 6, recovery: 18, dmg: 42, hitbox: [0,150,0,205],
    launch: true, launchVy: 14, spinStaff: true, manualY: true, noPush: true, hitstop: 11, gdrain: 10, advBlock: -12,
    onFrame(f, o, mf) { const T = f.move.startup + f.move.active + f.move.recovery; f.y = 46 * Math.sin(Math.PI * Math.min(1, mf / (T * 0.9))); // she rides a little cloud up with the swing
      if (mf === f.move.startup) { cloudPuff(o.x, GROUND - 6); sfx('rise'); for (let i = 0; i < 5; i++) parts.push({ type: 'star', x: o.x + rnd(-20, 20), y: GROUND - rnd(20, 120), vx: 0, vy: -rnd(2, 4), r: 3.5, vr: -0.1, life: 18, max: 18, col: '255,210,110', rot: R() * 3 }); } },
    drawFX(f) { if (f.y < 3) return; fxLighter(() => { for (const [dx, r] of [[-16, 12], [0, 15], [16, 12]]) { ctx.fillStyle = 'rgba(255,245,215,.85)'; ctx.beginPath(); ctx.ellipse(f.x + dx, GROUND - f.y + 6, r, r * 0.55, 0, 0, Math.PI * 2); ctx.fill(); } }); } },
});
Object.assign(STRINGS.psychic, {
  yE: { kind: 'p', str: 1, label: 'Constellation Burst', wind: 'lStaffBack', pose: 'lStaffUp', startup: 16, active: 2, recovery: 20, dmg: 62, hitbox: null, gdrain: 16, advBlock: -12,
    onFrame(f, o, mf) { // three stars of runes around them, joined by light, then the whole constellation bursts
      const S = f.move.startup;
      if (mf === 4 || mf === 8 || mf === 12) sfx('orb');
      if (mf === S && Math.abs(o.x - f.x) <= LYRA_RANGE) { columnHit(f, o, { dmg: 62, stun: 24, bstun: 14, push: 3, kd: true, kdVx: 10, kdVy: 8, hitstop: 12, gdrain: 16, label: 'Constellation Burst' }); triExplode(o.x, GROUND - o.y - 90); }
    },
    drawFX(f, o) { const S = f.move.startup; if (!o || f.mf < 3 || f.mf > S + 10) return; const a = f.mf <= S ? 1 : 1 - (f.mf - S) / 10, cx = o.x, cy = GROUND - o.y - 90;
      const pts = [-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6].map((an, k) => ({ x: cx + Math.cos(an) * 62, y: cy + Math.sin(an) * 62, on: f.mf >= 4 + k * 4 }));
      if (pts[2].on && f.mf < S) drawTriCircle(cx, cy, 62 / 0.86, a, f.mf * 0.05); // all three runes lit: the triangle closes into a full magic circle
      else fxLighter(() => { ctx.strokeStyle = `rgba(230,200,255,${0.8 * a})`; ctx.lineWidth = 2; ctx.beginPath(); let first = true; for (const p of pts) if (p.on) { first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); first = false; } ctx.stroke(); });
      for (const p of pts) if (p.on) drawPsyFist(p.x, p.y, 0.42, 1, a, f.mf * 0.1); } },
  yL: { kind: 'p', str: 1, label: 'Crystal Ascension', wind: 'lStaffSweep', pose: 'lStaffUp', startup: 12, active: 2, recovery: 20, hitbox: null, gdrain: 10, advBlock: -12,
    onFrame(f, o, mf) { // crystal spires grow out of the floor under them and lift them
      if (mf === 4) { f.cxs = clamp(o.x, f.x - 280, f.x + 280); sfx('charge'); }
      if (mf === f.move.startup && Math.abs(o.x - f.cxs) < 60) { columnHit(f, o, { dmg: 44, stun: 22, bstun: 12, push: 0.4, launch: true, launchVy: 14, hitstop: 11, gdrain: 10, label: 'Crystal Ascension' }); sfx('orb'); }
      if (o.state === 'knock' && mf > f.move.startup) f.move.recovery = Math.min(f.move.recovery, 6); },
    drawFX(f) { if (f.mf < 4 || f.mf > f.move.startup + 16 || f.cxs == null) return; const S = f.move.startup, k = Math.min(1, (f.mf - 4) / (S - 4)), a = f.mf <= S + 8 ? 1 : 1 - (f.mf - S - 8) / 8;
      for (const [dx, h, w] of [[-26, 110, 14], [0, 170, 20], [24, 130, 15]]) { const x = f.cxs + dx, top = GROUND - h * k;
        const g = ctx.createLinearGradient(0, GROUND, 0, top); g.addColorStop(0, `rgba(150,200,255,${0.85 * a})`); g.addColorStop(1, `rgba(255,190,245,${0.9 * a})`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w, GROUND); ctx.lineTo(x - w * 0.6, top + 14); ctx.lineTo(x, top); ctx.lineTo(x + w * 0.6, top + 14); ctx.lineTo(x + w, GROUND); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${0.7 * a})`; ctx.lineWidth = 1.5; ctx.stroke(); } } },
});
Object.assign(STRINGS.paladin, {
  pE: { kind: 'p', str: 1, label: 'Bulwark Breaker', wind: 'pBashW', pose: 'pSlash', startup: 10, active: 12, recovery: 20, multi: 2, interval: 8, dmg: 24, lastDmg: 50, hitbox: [10,175,30,170],
    push: 1, lastPush: 10, kd: true, kdVx: 15, kdVy: 7, hitstop: 10, gdrain: 18, advBlock: -12,
    poseFn: (f, mf) => mf < f.move.startup ? POSES.pBashW : mf <= f.move.startup + 6 ? POSES.pBash : mf <= f.move.startup + 7 ? POSES.pSlashW : null,
    onFrame(f, o, mf) { const S = f.move.startup; // the shield first, then a cleave that leaves a cross of light
      if (mf === S + 1) { sfx('palm'); game.shake = Math.max(game.shake, 3); }
      if (mf === S + 8) { sfx('slash'); for (const rot of [0, Math.PI / 2]) parts.push({ type: 'slashx', x: f.x + f.facing * 120, y: GROUND - 110, r: 54, life: 14, max: 14, col: '190,225,255', rot }); } },
    drawFX(f) { const S = f.move.startup; if (f.mf < S + 7 || f.mf > S + 16) return; const a = 1 - (f.mf - S - 7) / 9; fxLighter(() => { const g = ctx.createLinearGradient(f.x, 0, f.x + f.facing * 260, 0); g.addColorStop(0, `rgba(190,225,255,${0.7 * a})`); g.addColorStop(1, 'rgba(190,225,255,0)');
      ctx.fillStyle = g; ctx.fillRect(Math.min(f.x, f.x + f.facing * 260), GROUND - 118, 260, 10); }); } },
  pL: { kind: 'p', str: 1, label: "Heaven's Rise", wind: 'pQuake', pose: 'pShieldUp', startup: 10, active: 5, recovery: 20, dmg: 46, hitbox: [10,140,30,225],
    launch: true, launchVy: 14, hitstop: 11, gdrain: 10, advBlock: -12,
    onFrame(f, o, mf) { if (mf === f.move.startup) { parts.push({ type: 'lbeam', x: f.x + f.facing * 80, w: 34, life: 16, max: 16 }); sfx('orb'); for (let i = 0; i < 6; i++) parts.push({ type: 'spark', x: f.x + f.facing * 80 + rnd(-20, 20), y: GROUND - rnd(20, 160), vx: 0, vy: -rnd(2, 4), life: 18, max: 18, col: '235,245,255' }); } } },
});
Object.assign(STRINGS.kappa, {
  cE: { kind: 'p', str: 1, label: 'Whirlpool Rake', wind: 'kIdle', pose: 'kClawX', startup: 8, active: 18, recovery: 18, multi: 3, interval: 6, dmg: 14, lastDmg: 30, hitbox: [-40,115,0,150],
    push: 1, lastPush: 9, kd: true, kdVx: 14, kdVy: 8, spin: [6, 24], hitstop: 6, gdrain: 10, advBlock: -12,
    onFrame(f, o, mf) { const S = f.move.startup; if (mf > S && (mf - S) % 6 === 1) clawSwipe(f, [70, 100, (mf % 12 < 6 ? 1 : -1) * 0.8, 58]); if (mf === S) sfx('flame'); },
    drawFX(f) { const S = f.move.startup; if (f.mf < S - 2 || f.mf > S + 22) return; const a = f.mf <= S + 16 ? 1 : 1 - (f.mf - S - 16) / 6;
      fxLighter(() => { for (let k = 0; k < 3; k++) { const r = 54 + k * 14, an = f.mf * 0.45 + k * 2; ctx.strokeStyle = `rgba(${k ? '150,215,255' : '230,250,255'},${0.6 * a})`; ctx.lineWidth = 4 - k; ctx.beginPath(); ctx.ellipse(f.x, GROUND - f.y - 70, r, r * 0.42, 0, an, an + 4.2); ctx.stroke(); } }); } },
  cL: { kind: 'p', str: 1, label: 'Splash Geyser', wind: 'kIdle', pose: 'kToss', startup: 14, active: 2, recovery: 20, hitbox: null, manualY: true, noPush: true, gdrain: 10, advBlock: -12,
    poseFn: (f, mf) => mf < 9 ? POSES.kBelly : null,
    onFrame(f, o, mf) { // a belly-flop splash, then the water bursts up under them
      f.y = mf < 9 ? 34 * Math.sin(Math.PI * mf / 9) : 0;
      if (mf === 9) { parts.push({ type: 'ring', x: f.x + f.facing * 20, y: GROUND - 6, r: 10, vr: 6, life: 14, max: 14, col: '150,215,255' }); for (let i = 0; i < 10; i++) parts.push({ type: 'aura', x: f.x + rnd(-30, 30), y: GROUND - 8, vx: rnd(-3, 3), vy: -rnd(2, 5), life: 18, max: 18, r: rnd(3, 5), col: '150,215,255' }); sfx('land'); }
      if (mf === f.move.startup && Math.abs(o.x - f.x) < 240) geyser(f, o, o.x);
      if (o.state === 'knock' && mf > f.move.startup) f.move.recovery = Math.min(f.move.recovery, 6); } },
});
Object.assign(STRINGS.gunman, {
  gE: { kind: 'k', str: 1, label: 'Hammer Fan Finale', wind: 'gIdle', pose: 'gTwin', startup: 10, active: 8, recovery: 18, hitbox: null, gdrain: 10, advBlock: -12,
    poseFn: (f, mf) => mf < f.move.startup ? POSES.gIdle : ((mf - f.move.startup) % 2 ? POSES.gRecoil : POSES.gTwin),
    onFrame(f, o, mf) { const S = f.move.startup, k = (mf - S) / 2; // a gun twirl, then three shots fanned from the hip
      if (mf === 2) sfx('draw');
      if (mf >= S && Number.isInteger(k) && k < 3) shoot(f, { y: 122 - k * 2, vx: 26, life: 10, dmg: k < 2 ? 16 : 36, push: k < 2 ? 0.6 : 4, kd: k === 2, big: k === 2 });
      if (mf === S + 6) for (let i = 0; i < 5; i++) parts.push({ type: 'smoke', x: f.x + f.facing * rnd(50, 90), y: GROUND - rnd(100, 130), vx: f.facing * 0.5, vy: -0.6, r: rnd(5, 9), vr: 0.25, life: 24, max: 24, col: '215,205,190' }); },
    drawFX(f) { if (f.mf >= f.move.startup) return; const s = f.ch.scale, x = f.x + f.facing * 46 * s, y = GROUND - f.y - 112 * s, an = f.mf * 0.9 * f.facing;
      ctx.save(); ctx.translate(x, y); ctx.rotate(an); ctx.fillStyle = '#a8b0ba'; ctx.fillRect(-2, -12, 4, 18); ctx.fillStyle = '#5a3a22'; ctx.fillRect(-3, 4, 6, 8); ctx.restore(); // the twirl
      fxLighter(() => { ctx.strokeStyle = 'rgba(255,230,160,.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 14, an, an + 2.5); ctx.stroke(); }); } },
  gL: { kind: 'p', str: 1, label: 'Ricochet Launcher', wind: 'gIdle', pose: 'gAimLow', startup: 8, active: 2, recovery: 18, hitbox: null, gdrain: 10, advBlock: -12,
    onFrame(f, o, mf) { if (mf === f.move.startup) { shoot(f, { y: 46, vx: 18, vy: -7, life: 26, bounce: 1, dmg: 38, launch: true, launchVy: 13, jugVy: 12 }); dustAt(f.x + f.facing * 60, false); }
      if (o.state === 'knock' && mf > f.move.startup) f.move.recovery = Math.min(f.move.recovery, 6); } },
});
Object.assign(STRINGS.salary, {
  sE: { kind: 'p', str: 1, label: 'Deadline Dash', wind: 'crouch', pose: 'sShove', startup: 10, active: 5, recovery: 22, dmg: 50, hitbox: [10,105,40,150],
    kd: true, kdVx: 13, kdVy: 7, hitstop: 12, gdrain: 12, advBlock: -10, selfMove: true,
    onFrame(f, o, mf) { const S = f.move.startup; // a desperate shove... and he sprints off with papers flying everywhere
      if (mf <= S) f.vx = Math.abs(o.x - f.x) > 70 ? f.facing * 6 : 0; else hopBack(f, S + 5, 16, 10);
      if (mf === S) { popText(f.x, GROUND - 210, L('DEADLINE!', '締め切り！'), '255,140,120'); sfx('palm'); for (let i = 0; i < 8; i++) parts.push({ type: 'spark', x: f.x, y: GROUND - f.y - 100, vx: rnd(-4, 4), vy: rnd(-4, 1), life: 24, max: 24, col: '250,250,255' }); } } },
  sL: { kind: 'p', str: 1, label: 'Promotion Uppercut', wind: 'crouch', pose: 'uppercut', startup: 9, active: 6, recovery: 20, dmg: 46, hitbox: [0,100,40,205],
    launch: true, launchVy: 14, hitstop: 11, gdrain: 10, advBlock: -12, manualY: true, noPush: true,
    onFrame(f, o, mf) { const T = f.move.startup + f.move.active + f.move.recovery; f.y = 50 * Math.sin(Math.PI * Math.min(1, mf / (T * 0.85)));
      if (mf === f.move.startup) { popText(f.x, GROUND - 220, L('PROMOTED!', '昇進！'), '255,215,90'); confetti(f.x + f.facing * 40, GROUND - 160); sfx('full'); } } },
});
Object.assign(STRINGS.salaryAngel, {
  aE: { kind: 'p', str: 1, label: 'Seraph Wing Sweep', wind: 'saIdle', pose: 'saIdle', startup: 10, active: 8, recovery: 20, multi: 2, interval: 5, dmg: 22, lastDmg: 40, hitbox: [-20,150,30,170],
    push: 1, lastPush: 3, kd: false, stunT: 50, stunKind: 'holy', spin: [4, 12], hitstop: 10, gdrain: 12, advBlock: -12,
    onFrame(f, o, mf) { if (mf === f.move.startup) { sfx('swing'); for (let i = 0; i < 8; i++) parts.push({ type: 'spark', x: f.x + f.facing * rnd(20, 120), y: GROUND - rnd(60, 170), vx: f.facing * rnd(1, 4), vy: rnd(-2, 1), life: 22, max: 22, col: '255,250,230' }); } },
    drawFX(f) { const S = f.move.startup; if (f.mf < S - 2 || f.mf > S + 12) return; const a = f.mf <= S + 8 ? 1 : 1 - (f.mf - S - 8) / 4; fxLighter(() => { // two great wings sweep forward
      for (const side of [-1, 1]) for (let i = 0; i < 6; i++) { const an = (f.facing > 0 ? 0 : Math.PI) + side * (0.2 + i * 0.18) - side * (f.mf - S) * 0.08, L2 = 70 + i * 14;
        ctx.strokeStyle = `rgba(255,${245 - i * 6},${220 - i * 10},${0.6 * a})`; ctx.lineWidth = 8 - i; ctx.beginPath(); ctx.moveTo(f.x, GROUND - f.y - 120); ctx.lineTo(f.x + Math.cos(an) * L2, GROUND - f.y - 120 + Math.sin(an) * L2 * 0.6); ctx.stroke(); } }); } },
  aL: { kind: 'p', str: 1, label: 'Halo Ascension', wind: 'saIdle', pose: 'uppercut', startup: 11, active: 2, recovery: 20, hitbox: null, gdrain: 10, advBlock: -12,
    onFrame(f, o, mf) { if (mf === 4) { f.hx = clamp(o.x, f.x - 260, f.x + 260); sfx('charge'); }
      if (mf === f.move.startup && Math.abs(o.x - f.hx) < 60) { columnHit(f, o, { dmg: 44, stun: 22, bstun: 12, push: 0.4, launch: true, launchVy: 14, hitstop: 11, label: 'Halo Ascension' }); parts.push({ type: 'lbeam', x: f.hx, w: 30, life: 14, max: 14 }); sfx('orb'); }
      if (o.state === 'knock' && mf > f.move.startup) f.move.recovery = Math.min(f.move.recovery, 6); },
    drawFX(f) { if (f.mf < 4 || f.mf > f.move.startup + 12 || f.hx == null) return; const S = f.move.startup, rise = f.mf <= S ? 0 : (f.mf - S) * 14, a = f.mf <= S + 6 ? 1 : 1 - (f.mf - S - 6) / 6;
      fxLighter(() => { ctx.strokeStyle = `rgba(255,220,110,${0.9 * a})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(f.hx, GROUND - 6 - rise, 36, 9, 0, 0, Math.PI * 2); ctx.stroke(); }); } },
});
Object.assign(STRINGS.salaryDevil, {
  dE: { kind: 'k', str: 1, label: 'Infernal Tail Lash', wind: 'spinW', pose: 'roundhouse', startup: 9, active: 10, recovery: 20, multi: 2, interval: 5, dmg: 22, lastDmg: 42, hitbox: [-60,130,20,130],
    push: 1, lastPush: 10, kd: true, kdVx: 14, kdVy: 8, spin: [3, 14], hitstop: 10, gdrain: 12, advBlock: -12,
    onFrame(f, o, mf) { if (mf === f.move.startup) sfx('flame'); },
    drawFX(f) { const S = f.move.startup; if (f.mf < S - 1 || f.mf > S + 14) return; const a = f.mf <= S + 9 ? 1 : 1 - (f.mf - S - 9) / 5; fxLighter(() => { // a ring of fire swept by the tail
      for (let k = 0; k < 3; k++) { const an = f.mf * 0.55 + k * 0.5; ctx.strokeStyle = `rgba(255,${120 + k * 40},${40 + k * 20},${0.7 * a})`; ctx.lineWidth = 9 - k * 2; ctx.beginPath(); ctx.ellipse(f.x, GROUND - f.y - 60, 90 - k * 10, 28, 0, an, an + 3.4); ctx.stroke(); } }); } },
  dL: { kind: 'p', str: 1, label: 'Hellgate Upper', wind: 'kClawDown', pose: 'kClawUp', startup: 10, active: 6, recovery: 20, dmg: 50, hitbox: [0,110,40,225],
    launch: true, launchVy: 14, hitstop: 12, gdrain: 10, advBlock: -12, claw: [60, 150, -1.3, 70, '255,120,90'],
    onFrame(f, o, mf) { if (mf === f.move.startup) { parts.push({ type: 'wcol', x: f.x + f.facing * 70, w: 40, life: 18, max: 18, col: '255,100,40' }); sfx('flame'); } } },
});

function chainMoveBase(id, f) {
  const ch = f.ch, K = f.key === 'ninja', FXC = ch.fxCol;
  const base = { normal: true, stance: 's', type: 'mid', stun: 16, bstun: 10, push: 3, hitstop: 6, bpush: 2, gdrain: 3 };
  const hop = (f, o, mf, land) => { // a short hop forward that lands on frame 18
    if (mf === 1) f.hop = { x0: f.x, tx: clamp(f.x + f.facing * Math.min(60, Math.max(0, Math.abs(o.x - f.x) - 50)), WALL_L, WALL_R) };
    if (mf <= 18) { const e = mf / 18; f.x = lerp(f.hop.x0, f.hop.tx, e); f.y = 55 * Math.sin(Math.PI * e); f.vx = 0; }
    if (mf === 18) { f.y = 0; land(f); }
  };
  switch (id) {
    case 'jab2': return { ...base, kind: 'p', str: 0, label: 'Jab 2', startup: 4, active: 3, recovery: 8, dmg: Math.round(28 * ch.pDmg), hitbox: [20,66,106,124], high: true,
      advHit: 8, advBlock: 1, wind: 'jabW', pose: 'straight', chain: { hp: K ? 'leapSlash' : 'leapHammer', lk: 'chainSlide' } };
    case 'leapSlash': return { ...base, kind: 'p', str: 1, label: 'Leaping Slash', startup: 12, active: 6, recovery: 16, dmg: 70, hitbox: [10,92,20,130],
      kd: true, kdVx: 6, blade: true, advHit: 3, advBlock: -10, gdrain: 12, hitstop: 10, wind: 'slashW', pose: 'slash', manualY: true, selfMove: true,
      trail: { cx: 15, cy: 105, r: 80, a0: 80, a1: -35, col: '225,235,255' },
      onFrame(f, o, mf) { hop(f, o, mf, f => dustAt(f.x, false)); if (mf === 12) sfx('slash'); } };
    case 'leapHammer': return { ...base, kind: 'p', str: 1, label: 'Leaping Hammer', startup: 12, active: 6, recovery: 16, dmg: Math.round(72 * ch.pDmg), hitbox: [10,82,20,125],
      kd: true, kdVx: 6, advHit: 3, advBlock: -10, gdrain: 12, hitstop: 10, wind: 'jump', pose: 'jPunchH', manualY: true, selfMove: true, aura: true,
      onFrame(f, o, mf) { hop(f, o, mf, f => { dustAt(f.x + f.facing * 40, true); parts.push({ type: 'ering', x: f.x + f.facing * 40, y: GROUND, r: 8, vr: 6, life: 14, max: 14, col: '125,235,255' }); game.shake = Math.max(game.shake, 3); }); } };
    case 'chainSlide': return { ...base, kind: 'k', str: 1, label: 'Combo Slide', startup: 6, active: 12, recovery: 16, dmg: Math.round(45 * ch.kDmg), hitbox: [0,64,0,34],
      low: true, kd: true, kdVx: 1.5, kdVy: 4, advBlock: -10, gdrain: 8, wind: 'crouch', pose: 'slideKick', selfMove: true,
      onFrame(f, o, mf) {
        if (mf > 4 && mf <= 18 && !f.hitConnected && Math.abs(o.x - f.x) > 45) { f.vx = f.facing * 8; if (mf % 2 === 0) dustAt(f.x, false); }
        else f.vx *= 0.6;
      } };
    case 'oneTwo': return { ...base, kind: 'p', str: 0, label: 'One-Two', startup: 5, active: 3, recovery: 10, dmg: Math.round(40 * ch.pDmg), hitbox: [20,72,106,126], high: true,
      advHit: 8, advBlock: -2, wind: 'jabW', pose: 'straight', chain: { hk: 'risingKick', lk: 'chainSlide' } };
    case 'risingKick': return { ...base, kind: 'k', str: 1, label: 'Rising Kick', startup: 9, active: 4, recovery: 20, dmg: Math.round(45 * ch.kDmg), hitbox: [15,80,40,140],
      kd: true, kdVx: 9, kdVy: 8, advHit: 3, advBlock: -12, gdrain: 10, hitstop: 9, wind: 'kickW', pose: 'highKick',
      trail: { cx: 0, cy: 62, r: 78, a0: -45, a1: 95, col: K ? '190,150,255' : FXC } };
    case 'jabKick': return { ...base, kind: 'k', str: 0, label: 'Jab, Kick', startup: 7, active: 3, recovery: 14, dmg: Math.round(48 * ch.kDmg), hitbox: [20,78,44,100],
      push: 6, advHit: 3, advBlock: -5, wind: 'kickW', pose: 'midKick' };
    case 'lowMid': return { ...base, kind: 'k', str: 0, label: 'Low-Mid Kick', startup: 7, active: 3, recovery: 14, dmg: Math.round(48 * ch.kDmg), hitbox: [20,78,44,100],
      push: 6, advHit: 3, advBlock: -5, wind: 'kickW', pose: 'midKick' };
    // juggle attacks (used automatically while the opponent is launched); each has its own animation and reaches up high
    case 'jPalm': return { ...base, kind: 'p', str: 0, label: 'Rising Palm', startup: 4, active: 4, recovery: 10, dmg: 24, hitbox: [10,88,45,235],
      jugVy: 7.5, advHit: 6, advBlock: 0, wind: 'jabW', pose: 'palmUp', selfMove: true, onFrame: juggleStep, chain: { lp: 'jElbow', hk: 'jSpin', hp: 'jRise' } };
    case 'jElbow': return { ...base, kind: 'p', str: 0, label: 'Elbow Lift', startup: 4, active: 4, recovery: 10, dmg: 24, hitbox: [5,80,45,235],
      jugVy: 7.5, advHit: 6, advBlock: 0, wind: 'jabW', pose: 'elbowUp', selfMove: true, onFrame: juggleStep, chain: { lp: 'jUpper', hk: 'jSpin', hp: 'jRise' } };
    case 'jUpper': return { ...base, kind: 'p', str: 0, label: 'Uppercut', startup: 5, active: 4, recovery: 12, dmg: 30, hitbox: [5,80,45,240],
      jugVy: 8, advHit: 6, advBlock: -2, wind: 'uppercutW', pose: 'uppercut', selfMove: true, onFrame: juggleStep, chain: { hk: 'jSpin', hp: 'jRise' } };
    case 'jRise': return { ...base, kind: 'p', str: 1, label: K ? 'Rising Kunai' : 'Rising Qi Fist', startup: 7, active: 4, recovery: 17, dmg: 34, hitbox: [5,92,45,240],
      relaunch: true, jugVy: 8, blade: K, aura: !K, advHit: 4, advBlock: -10, hitstop: 9, wind: 'uppercutW', pose: 'kunaiRise', selfMove: true, onFrame: juggleStep,
      trail: { cx: 10, cy: 90, r: 95, a0: -30, a1: 95, col: K ? '225,235,255' : FXC }, chain: { hk: 'jSpin' } };
    case 'jSpin': return { ...base, kind: 'k', str: 1, label: 'Spin Kick', startup: 7, active: 4, recovery: 16, dmg: 40, hitbox: [10,104,30,270],
      kd: true, kdVx: 11, kdVy: 8, advHit: 3, advBlock: -10, gdrain: 12, hitstop: 11, wind: 'spinW', pose: 'roundhouse', spin: [1, 6], selfMove: true, onFrame: juggleStep,
      trail: { cx: 0, cy: 80, r: 90, a0: -60, a1: 50, col: K ? '190,150,255' : FXC } };
    case 'airSmash': return { ...base, kind: 'k', str: 1, stance: 'j', air: true, label: 'Air Smash', startup: 4, active: 8, recovery: 8, dmg: 45, hitbox: [-25,85,-45,95],
      kd: true, kdVx: 2, kdVy: -7, hitstop: 12, gdrain: 12, wind: 'jump', pose: 'axe',
      trail: { cx: 5, cy: 62, r: 72, a0: 110, a1: -20, col: K ? '190,150,255' : FXC } };
    // air juggle string: jump near a launched opponent and press U / I / K; he floats a moment on each hit
    case 'aPalm': return { ...base, kind: 'p', str: 0, stance: 'j', air: true, hover: true, label: 'Air Palm', startup: 3, active: 3, recovery: 7, dmg: 20, hitbox: [5,82,5,130],
      jugVy: 4.5, wind: 'jump', pose: 'palmUp', chain: { lp: 'aElbow', hp: 'aKunai', hk: 'aSpin', dhk: 'aMeteor' } };
    case 'aElbow': return { ...base, kind: 'p', str: 0, stance: 'j', air: true, hover: true, label: 'Air Elbow', startup: 3, active: 3, recovery: 7, dmg: 22, hitbox: [5,78,5,130],
      jugVy: 4.5, wind: 'jump', pose: 'elbowUp', chain: { hp: 'aKunai', hk: 'aSpin', dhk: 'aMeteor' } };
    case 'aKunai': return { ...base, kind: 'p', str: 1, stance: 'j', air: true, hover: true, label: K ? 'Air Kunai Flurry' : 'Air Fist Flurry', startup: 4, active: 9, recovery: 8,
      multi: 3, interval: 3, dmg: 12, lastDmg: 20, hitbox: [5,90,0,135], jugVy: 3.5, blade: K, wind: 'jump', pose: 'slash',
      trail: { cx: 15, cy: 100, r: 75, a0: 70, a1: -40, col: K ? '225,235,255' : FXC }, chain: { hk: 'aSpin', dhk: 'aMeteor' } };
    // ↓ + K in the air: dive feet-first through them and bounce them off the ground (once per combo)
    case 'aMeteor': return { ...base, kind: 'k', str: 1, stance: 'j', air: true, untilLand: true, landT: 5, label: K ? 'Shadow Meteor' : 'Meteor Knee', startup: 3, active: 22, recovery: 30, dmg: 40,
      hitbox: [-15,90,-40,115], meteor: true, kd: true, kdVx: 1, kdVy: -8, hitstop: 11, gdrain: 10, wind: 'jump', pose: 'diveKick', selfMove: true,
      trail: { cx: 0, cy: 40, r: 70, a0: 160, a1: 260, col: K ? '190,150,255' : FXC },
      onStart(f) { f.vy = 3; f.vx = f.facing * 2; }, // a little hop over them...
      onFrame(f, o, mf) { if (mf === 4) { f.vy = -14; f.vx = f.facing * 5; } } }; // ...then dive feet-first
    case 'aSpin': return { ...base, kind: 'k', str: 1, stance: 'j', air: true, label: 'Air Spin Kick', startup: 4, active: 4, recovery: 10, dmg: 38, hitbox: [5,100,0,130],
      kd: true, kdVx: 12, kdVy: 6, hitstop: 11, gdrain: 10, wind: 'spinW', pose: 'roundhouse', spin: [1, 4],
      trail: { cx: 0, cy: 70, r: 88, a0: -60, a1: 50, col: K ? '190,150,255' : FXC } };
    case 'kick2': return { ...base, kind: 'k', str: 0, label: 'Low Kick 2', startup: 4, active: 3, recovery: 8, dmg: Math.round(30 * ch.kDmg), hitbox: [20,70,8,44],
      low: true, advHit: 8, advBlock: 1, wind: 'kickW', pose: 'lowKick', chain: { lk: 'kick3', hk: 'chainRound' } };
    case 'kick3': return { ...base, kind: 'k', str: 0, label: 'Snap Kick', startup: 6, active: 3, recovery: 14, dmg: Math.round(45 * ch.kDmg), hitbox: [20,76,44,86],
      push: 7, advHit: 2, advBlock: -6, wind: 'kickW', pose: 'midKick' };
    case 'chainRound': return { ...base, kind: 'k', str: 1, label: 'Combo Roundhouse', startup: 12, active: 4, recovery: 18, dmg: Math.round(70 * ch.kDmg), hitbox: [10,98,40,118],
      kd: true, kdVx: 12, kdVy: 9, advHit: 3, advBlock: -10, gdrain: 14, hitstop: 11, wind: 'spinW', pose: 'roundhouse', spin: [5, 12], poseFn: spinKickPose(12),
      trail: { cx: 0, cy: 70, r: 86, a0: -60, a1: 40, col: K ? '190,150,255' : FXC },
      onFrame(f, o, mf) { if (mf === 5) sfx('swing'); if (mf === 11) sfx('slash'); } };
  }
  return null;
}
// juggle attacks step in a little if the opponent has drifted away
function juggleStep(f, o, mf) { f.vx = (mf <= 7 && Math.abs(o.x - f.x) > 55) ? f.facing * Math.min(7, (Math.abs(o.x - f.x) - 45) / 4) : f.vx * 0.6; } // chases them as they're knocked away
// a full turn before a roundhouse: wind up, spin with the leg chambered, then bring the leg around
function spinKickPose(su) {
  return (f, mf) => {
    if (mf <= 4) return lerpPose(f.prevPose, POSES.spinW, mf / 4);
    if (mf <= su) {
      const k = (mf - 4) / (su - 4);
      return k < 0.7 ? lerpPose(POSES.spinW, POSES.spinTurn, Math.min(1, k / 0.35)) : lerpPose(POSES.spinTurn, POSES.roundW, (k - 0.7) / 0.3);
    }
    return null;
  };
}
// Kuro's fire techniques
const handSign = mf => ((mf >> 2) & 1) ? POSES.seal : POSES.seal2;
function ember(f) {
  parts.push({ type: 'aura', x: f.x + f.facing * rnd(10, 26), y: GROUND - f.y - rnd(85, 112), vx: rnd(-0.4, 0.4), vy: -rnd(0.8, 2), life: rnd(12, 20), max: 20, r: rnd(1.5, 3), col: '255,170,70' });
}
function shadowRetreat(f, mf) { // leave a shadow standing on guard, then back-dash as a shadow (can't be hit)
  if (mf === 4) { spawnGuardShadow(f); sfx('vanish'); }
  if (mf > 4) { f.shadowRun = true; f.invul = Math.max(f.invul, 2); f.vx = -f.facing * 8; if (mf % 3 === 0) wisp(f); }
  else f.vx = 0;
  if (mf === 20) f.shadowRun = false;
}
function spawnFlame(f) {
  projs.push({ id: ++serial, type: 'flame', owner: f, life: 50, t: 0, hits: 0, max: 8, interval: 6, last: -99, dmg: 13, lastDmg: 26, stun: 12, bstun: 9, push: 1.2, dir: f.facing });
  sfx('flame');
}
function orbHold(p) {
  const f = p.owner, s = f.ch.scale;
  p.x = f.x + f.facing * (-26 + p.idx * 26) * s;
  p.y = f.y + (158 + (p.idx === 1 ? 16 : 0) + Math.sin(globalT * 0.2 + p.idx) * 3) * s;
}
function spawnOrb(f, idx) {
  const p = { id: ++serial, type: 'homing', owner: f, idx, hold: true, x: 0, y: 0, vx: 0, vy: 0, r: 13, dmg: 34, stun: 16, bstun: 10, push: 3, hitstop: 6,
    stunT: 70, stunKind: 'shock', life: 200, chip: true, air: true, dir: f.facing };
  orbHold(p); projs.push(p); sfx('zap');
}
function launchOrb(f, idx) {
  for (const p of projs) if (p.owner === f && p.type === 'homing' && p.hold && p.idx === idx) {
    const o = other(f), dx = o.x - p.x, dy = o.y + 70 - p.y, L = Math.hypot(dx, dy) || 1;
    p.hold = false; p.vx = dx / L * 5; p.vy = dy / L * 5; p.dir = Math.sign(dx) || f.facing; sfx('throw');
  }
}
function projBox(p) {
  if (p.type === 'flame') {
    const f = p.owner, s = f.ch.scale, ox = f.x + f.facing * 28 * s, len = Math.min(340, 30 + p.t * 16);
    return f.facing > 0 ? { x0: ox, x1: ox + len, y0: 70 * s, y1: 135 * s } : { x0: ox - len, x1: ox, y0: 70 * s, y1: 135 * s };
  }
  if (p.type === 'beam') {
    const f = p.owner, ox = f.x + f.facing * 50 * f.ch.scale;
    return f.facing > 0 ? { x0: ox, x1: W + 60, y0: 0, y1: 250 } : { x0: -60, x1: ox, y0: 0, y1: 250 }; // (the Great Qi Cannon fills the screen: it can't be jumped, only guarded)
  }
  if (p.type === 'clone') { const t = other(p.owner), up = p.superHit && !p.fall && t && caughtIn(t) ? Math.max(0, t.y + 60 - p.h1) : 0; return { x0: p.x - p.w, x1: p.x + p.w, y0: p.h0 + (p.yOff || 0), y1: p.h1 + (p.yOff || 0) + up }; } // (in a combo, the super's clones leap up to catch someone already juggled)
  if (p.type === 'decoy' || p.type === 'guardShadow') return { x0: p.x - 25, x1: p.x + 25, y0: 0, y1: 135 };
  if (p.type === 'wave') return { x0: p.x - p.w, x1: p.x + p.w, y0: 0, y1: 34 };
  if (p.type === 'staffBoom') return { x0: p.x - 46, x1: p.x + 46, y0: p.y - 40, y1: p.y + 40 };
  const back = p.vx && Math.abs(p.vx) > p.r ? p.vx : 0; // a fast projectile (a bullet) sweeps the whole stretch it crossed this frame, so it can't skip through someone point-blank
  return { x0: Math.min(p.x, p.x - back) - p.r, x1: Math.max(p.x, p.x - back) + p.r, y0: p.y - p.r, y1: p.y + p.r };
}
// simple projectiles (plates, water, bubbles, bullets, dynamite, business cards, feathers, halos, hellfire)
const PJ = new Set(['spikes', 'puddle', 'skidcase', 'brimstone', 'pen', 'stapler', 'mug', 'plate', 'dish', 'crescent', 'water', 'bubble', 'bullet', 'dyna', 'card', 'feather', 'haloP', 'hellfire', 'stone', 'core', 'trap']);
function spawnPJ(f, type, o) {
  const p = Object.assign({ id: ++serial, type, owner: f, dir: f.facing, x: f.x + f.facing * 60, y: 100, vx: f.facing * 10, vy: 0, g: 0, life: 60, r: 14, hits: 1, interval: 8, n: 0, last: -99, t: 0, spin: 0 }, o);
  const mv = f.state === 'attack' && f.move;
  if (mv && (!mv.normal || mv.lvl || mv.super) && p.h) p.h = { ...p.h, spx: true }; // (thrown by a technique, a charged attack or a super: costs far more to guard)
  p.x0 = p.x; p.sup = !!((mv && mv.super) || (p.h && p.h.superHit)); // (where it started: see PROJ_RANGE)
  projs.push(p); return p;
}
function pjExplode(p) { // dynamite and water bubbles burst, hitting anyone close
  const own = p.owner, tgt = other(own), e = p.explode;
  for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6; parts.push({ type: e.water ? 'aura' : 'spark', x: p.x, y: GROUND - p.y, vx: Math.cos(an) * 5, vy: Math.sin(an) * 5 - 1, life: 16, max: 16, r: 4, col: e.water ? '150,215,255' : '255,180,80' }); }
  parts.push({ type: 'ring', x: p.x, y: GROUND - Math.max(20, p.y), r: 10, vr: e.water ? 5 : 7, life: 14, max: 14, col: e.water ? '150,215,255' : '255,160,70' });
  if (!e.water) { game.shake = Math.max(game.shake, 6); sfx('hitH'); dustAt(p.x, true); } else sfx('orb');
  const hu = hurtbox(tgt, true), hb = { x0: p.x - e.r, x1: p.x + e.r, y0: Math.max(0, p.y - e.r), y1: p.y + e.r };
  if (hu && overlap(hb, hu)) applyHit(own, tgt, { type: 'mid', chip: true, proj: true, str: 1, hitstop: 8, ...e.h }, Math.sign(tgt.x - p.x) || p.dir, hb, hu);
}
function pjUpdate(p) {
  if (p.type === 'trap') { trapUpdate(p); return; } // (the alchemist's trap stones)
  const own = p.owner, tgt = other(own);
  p.life--; p.spin += 0.35;
  if (p.boomerang && p.t > p.boomerang) { // a thrown plate curves back to its owner
    const dx = own.x - p.x; p.vx = Math.sign(dx) * Math.min(14, Math.abs(dx) * 0.18 + 5); p.vy = ((own.y + 120 * own.ch.scale) - p.y) * 0.12;
    if (Math.abs(dx) < 30) { p.dead = true; own.plateOut = false; return; }
  }
  p.vy -= p.g || 0; p.x += p.vx; p.y += p.vy;
  if (p.big && p.t % 2 === 0) for (let i = 0; i < 3; i++) { const yy = p.y + rnd(-p.r, p.r) * 0.9; parts.push({ type: i ? 'aura' : 'star', x: p.x - Math.sign(p.vx) * rnd(10, 40), y: GROUND - yy, vx: -Math.sign(p.vx) * rnd(0.5, 2), vy: -rnd(0, 1), life: 18, max: 18, r: rnd(2, 4), vr: -0.1, rot: rnd(0, 3), col: i ? '200,170,255' : '255,250,235' }); } // (the full moon: a wake of moonlight)
  if (p.bounce && p.y <= 0 && p.vy < 0) { p.y = 0; p.vy = -p.vy * 0.75; p.bounce--; sfx('block'); parts.push({ type: 'spark', x: p.x, y: GROUND, vx: 0, vy: -3, life: 8, max: 8, col: '255,230,150' }); }
  if (p.type === 'skidcase' && p.t % 2 === 0) { parts.push({ type: 'spark', x: p.x - p.vx * 0.6, y: GROUND - 4, vx: -p.vx * 0.15 + vrnd(-1, 1), vy: -vrnd(1, 3), life: 10, max: 10, col: '255,220,150' }); } // sparks where it scrapes the floor
  if (p.type === 'brimstone' && p.t % 3 === 0) { parts.push({ type: 'aura', x: p.x + vrnd(-6, 6), y: GROUND - 6, vx: 0, vy: -vrnd(2, 4), life: 22, max: 22, r: vrnd(5, 9), col: p.t % 6 ? '255,110,40' : '255,200,80' }); parts.push({ type: 'aura', x: p.x - p.vx * 2, y: GROUND - 2, vx: 0, vy: -0.2, life: 40, max: 40, r: 6, col: '120,20,10' }); } // flames erupt along its path, scorching the floor
  if (p.type === 'puddle' && p.t % 9 === 0) parts.push({ type: 'smoke', x: p.x + vrnd(-20, 20), y: GROUND - 8, vx: 0, vy: -0.7, r: 5, vr: 0.25, life: 30, max: 30, col: '230,225,215' }); // hot coffee steaming
  if (p.type === 'water' && p.t % 2 === 0) parts.push({ type: 'aura', x: p.x - p.vx * 0.5, y: GROUND - p.y + vrnd(-6, 6), vx: 0, vy: 0.5, life: 12, max: 12, r: 3, col: '150,215,255' });
  if (p.type === 'hellfire' && p.t % 2 === 0) parts.push({ type: 'aura', x: p.x - p.vx * 0.5, y: GROUND - p.y + vrnd(-6, 6), vx: 0, vy: -0.8, life: 14, max: 14, r: 4, col: '255,110,40' });
  if (p.type === 'dyna' && p.t % 3 === 0) parts.push({ type: 'spark', x: p.x, y: GROUND - p.y - 10, vx: vrnd(-1, 1), vy: -2, life: 6, max: 6, col: '255,220,120' });
  if ((p.g && p.y <= 0) || p.life <= 0 || p.x < -60 || p.x > W + 60) { if (p.boomerang) own.plateOut = false; if (p.explode) pjExplode(p); p.dead = true; return; }
  if (p.delay > 0) { p.delay--; return; } // (Hohen's stones: a frame or two in the air before they can hit, so they're seen even point-blank)
  if (p.n >= p.hits || p.t - p.last < p.interval) return;
  if (p.type === 'puddle' && p.t < 8) return; // (the coffee spreads for a moment before it's slippery: time to see it and crouch)
  const hu = hurtbox(tgt, !(p.type === 'stone' && tgt.state === 'knock' && !tgt.juggle), p.type === 'stone' && !!(p.h && p.h.low)), hb = projBox(p); // (Hohen's stones fly over someone knocked down and falling: they can't turn a knockdown back into a juggle) // (fast ones sweep the stretch they crossed) (a low stone can still hit someone lying on the floor)
  if (hu && !p.n && !p.passed && !overlap(hb, hu) && hb.x0 < hu.x1 && hb.x1 > hu.x0 && p.h) { p.passed = true; showHeight(tgt, Math.sign(p.vx) || p.dir, hb, p.h, true); } // (over or under them)
  if (tgt.state === 'attack' && tgt.move && tgt.move.reflectAll && tgt.mf > tgt.move.startup && tgt.mf <= tgt.move.startup + tgt.move.active && !p.reflected) { // the kappa's shell sends it straight back at them
    const fb = { x0: tgt.x - 70, x1: tgt.x + 70, y0: 0, y1: 170 };
    if (overlap(hb, fb)) { p.owner = tgt; p.vx = -p.vx || tgt.facing * 8; p.vy = -p.vy * 0.5; p.dir = -p.dir; p.boomerang = 0; p.reflected = true; p.n = 0; p.life = Math.max(p.life, 40); if (p.h) p.h = { ...p.h, label: (p.h.label || '') + ' (reflected)' };
      popText(tgt.x, GROUND - 160, 'REFLECT!', '150,215,255'); sparks(p.x, GROUND - p.y, 'block'); sfx('block'); return; }
  }
  if (hu && overlap(hb, hu)) {
    if (p.explode) { pjExplode(p); p.dead = true; return; }
    const pr = applyHit(own, tgt, { type: 'mid', chip: true, proj: true, str: 1, hitstop: 5, ...p.h }, Math.sign(p.vx) || p.dir, hb, hu);
    if (pr === 'hit') pjHitFX(p, tgt); // (some projectiles have their own flourish when they land)
    p.n++; p.last = p.t;
    if (p.n >= p.hits && !p.boomerang && !p.pierce) p.dead = true;
  }
}
function pjDraw(p) {
  const x = p.x, y = GROUND - p.y;
  ctx.save(); ctx.translate(x, y);
  switch (p.type) {
    case 'crescent': { ctx.globalCompositeOperation = 'lighter'; const d = Math.sign(p.vx) || 1, k = (p.r || 40) / 40; ctx.scale(d * k, k); // a crescent of shadow flying along the floor (drawn as big as it hits)
      if (p.big) { // the full moon: a halo of moonlight round it, pulsing, and a second, brighter edge
        const pu = 0.8 + 0.2 * Math.sin(globalT * 0.4), g = ctx.createRadialGradient(-20, 0, 8, -20, 0, 78); g.addColorStop(0, `rgba(235,225,255,${0.45 * pu})`); g.addColorStop(0.6, `rgba(170,130,255,${0.25 * pu})`); g.addColorStop(1, 'rgba(120,80,220,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(-20, 0, 78, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = p.big ? 'rgba(205,175,255,.85)' : 'rgba(190,150,255,.75)'; ctx.beginPath(); ctx.arc(-10, 0, 60, -1.2, 1.2); ctx.arc(-34, 0, 52, 1.05, -1.05, true); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(240,235,255,.9)'; ctx.lineWidth = 2.5 / k * (p.big ? 2 : 1); ctx.beginPath(); ctx.arc(-10, 0, 60, -1.2, 1.2); ctx.stroke();
      if (p.big) { ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 1.2 / k; ctx.beginPath(); ctx.arc(-6, 0, 63, -1.25, 1.25); ctx.stroke(); }
      break; }
    case 'plate': case 'dish': { // the kappa's dish, spinning edge-on
      ctx.scale(1, 0.45 + 0.25 * Math.abs(Math.sin(p.spin))); ctx.fillStyle = '#f4f7fb'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7cc6ef'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#b9dff5'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.stroke(); break; }
    case 'water': case 'bubble': {
      const r = p.type === 'bubble' ? 16 : 11; ctx.fillStyle = p.type === 'bubble' ? 'rgba(150,215,255,.45)' : 'rgba(110,190,255,.85)'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(230,248,255,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.35, r * 0.25, 0, Math.PI * 2); ctx.fill(); break; }
    case 'bullet': { ctx.globalCompositeOperation = 'lighter'; ctx.rotate(Math.atan2(-p.vy, p.vx)); const L = p.lvl || 0, len = 46 + L * 40, w = 6 + L * 6; // a long tracer; charged shots are much bigger
      const g = ctx.createLinearGradient(-len, 0, 0, 0); g.addColorStop(0, 'rgba(255,200,110,0)'); g.addColorStop(1, L ? 'rgba(255,190,90,.85)' : 'rgba(255,230,150,.75)');
      ctx.strokeStyle = g; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-len, 0); ctx.lineTo(0, 0); ctx.stroke();
      if (L) { ctx.strokeStyle = `rgba(255,240,200,${0.5 + 0.3 * Math.sin(p.t)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(-8, 0, 6 + L * 4, 10 + L * 7, 0, 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.ellipse(0, 0, 7 + L * 4, 3 + L * 3, 0, 0, Math.PI * 2); ctx.fill(); break; }
    case 'dyna': ctx.rotate(p.spin); ctx.fillStyle = '#c0392b'; ctx.fillRect(-12, -5, 24, 10); ctx.fillStyle = '#f1c40f'; ctx.fillRect(-3, -5, 6, 10); ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(18, -6); ctx.stroke(); break;
    case 'puddle': { const sp = Math.min(1, p.t / 8); ctx.fillStyle = 'rgba(95,58,30,.85)'; ctx.beginPath(); ctx.ellipse(0, 6, 36 * sp + 6, 8 * sp + 2, 0, 0, Math.PI * 2); ctx.fill(); // a spreading puddle of coffee, rippling and gleaming
      ctx.strokeStyle = 'rgba(200,160,110,.5)'; ctx.lineWidth = 1.2; const rr2 = (p.t * 0.8) % 30; ctx.beginPath(); ctx.ellipse(6, 6, rr2, rr2 * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.2 * Math.sin(p.t * 0.2)})`; ctx.beginPath(); ctx.ellipse(-10 * sp, 4, 12 * sp, 2.5, 0, 0, Math.PI * 2); ctx.fill(); break; }
    case 'skidcase': { const d = Math.sign(p.vx) || 1; for (let i = 1; i <= 3; i++) { ctx.fillStyle = `rgba(245,245,240,${0.5 - i * 0.12})`; ctx.save(); ctx.translate(-d * i * 16, -10 - Math.sin(p.t * 0.6 + i) * 6); ctx.rotate(Math.sin(p.t * 0.4 + i)); ctx.fillRect(-5, -6, 10, 12); ctx.restore(); } // papers flapping out behind it
      ctx.fillStyle = '#3a2a1c'; ctx.fillRect(-16, -9, 32, 18); ctx.fillStyle = '#c9a36a'; ctx.fillRect(-4, -12, 8, 4); ctx.fillRect(-16, -1, 32, 2); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(-14, -8, 28, 3); break; } // his briefcase, skidding flat
    case 'brimstone': { ctx.globalCompositeOperation = 'lighter'; const d = Math.sign(p.vx || 1); for (let i = 0; i < 6; i++) { const fl = 14 + 12 * Math.sin(globalT * 0.5 + i * 1.3); ctx.fillStyle = `rgba(255,${70 + i * 25},${30 + i * 8},${0.75 - i * 0.1})`; ctx.beginPath(); ctx.moveTo(-i * 9 * d - 8, 0); ctx.quadraticCurveTo(-i * 9 * d, -fl * 1.6, -i * 9 * d + 8, 0); ctx.closePath(); ctx.fill(); } // tongues of hellfire racing along the floor
      ctx.strokeStyle = 'rgba(255,60,20,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 2); for (let i = 1; i < 8; i++) ctx.lineTo(-i * 12 * d, 2 + (i % 2 ? -3 : 3)); ctx.stroke(); break; } // the crack it tears in the floor
    case 'pen': ctx.rotate(Math.atan2(-p.vy, p.vx)); ctx.fillStyle = '#2b4c9a'; ctx.fillRect(-12, -2.5, 20, 5); ctx.fillStyle = '#d8d8d8'; ctx.fillRect(8, -2, 5, 4); ctx.fillStyle = '#1a1a1a'; ctx.fillRect(12, -1, 3, 2); break; // a ballpoint pen
    case 'trap': { const pu = 0.7 + 0.3 * Math.sin(p.t * (p.life < 90 ? 0.6 : 0.18)), c = p.glow; ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `rgba(${c},${0.45 * pu})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 12, 34 + 4 * pu, 8, 0, 0, Math.PI * 2); ctx.stroke(); // a glowing ring on the floor
      const gg = ctx.createRadialGradient(0, 0, 2, 0, 0, 38 * pu + 10); gg.addColorStop(0, `rgba(${c},.9)`); gg.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, 38 * pu + 10, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#8b6a47'; ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-11, 8); ctx.lineTo(-7, -9); ctx.lineTo(5, -12); ctx.lineTo(12, 2); ctx.lineTo(8, 10); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${c},${0.85 * pu})`; ctx.beginPath(); ctx.arc(0, -1, 5, 0, Math.PI * 2); ctx.fill(); break; } // a trap stone, glowing
    case 'core': { const d = Math.sign(p.vx) || 1; ctx.globalCompositeOperation = 'lighter'; ctx.scale(d, 1); const tr = ctx.createLinearGradient(-110, 0, 0, 0); tr.addColorStop(0, 'rgba(255,150,40,0)'); tr.addColorStop(1, 'rgba(255,200,90,.9)'); ctx.fillStyle = tr; ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(0, -15); ctx.lineTo(14, 0); ctx.lineTo(0, 15); ctx.closePath(); ctx.fill();
      const gc = ctx.createRadialGradient(0, 0, 2, 0, 0, 30 + Math.sin(p.t * 0.8) * 3); gc.addColorStop(0, 'rgba(255,255,230,1)'); gc.addColorStop(0.35, 'rgba(255,210,100,.9)'); gc.addColorStop(1, 'rgba(255,130,30,0)'); ctx.fillStyle = gc; ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2); ctx.fill(); break; } // the golem's core blast
    case 'spikes': { const d = Math.sign(p.vx) || 1, pal = GOLEM_PALS[p.owner && p.owner.alt ? 1 : 0]; // Hohen's Quake Fist: rock spikes bursting up one after another along the floor
      for (let i = 3; i >= 0; i--) { const hgt = (24 + 10 * Math.sin(p.t * 0.7 + i * 1.3)) * (1 - i * 0.2), x = -d * i * 22; ctx.fillStyle = i ? pal.dark : pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 10, 14); ctx.lineTo(x - 2, 4 - hgt); ctx.lineTo(x + 10, 14); ctx.closePath(); ctx.fill(); ctx.stroke(); } break; }
    case 'stone': ctx.rotate(p.spin); if (p.r > 13) ctx.scale(p.r / 12, p.r / 12); ctx.fillStyle = '#8b6a47'; ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(-3, -11); ctx.lineTo(9, -7); ctx.lineTo(11, 5); ctx.lineTo(0, 11); ctx.lineTo(-9, 7); ctx.closePath(); ctx.fill(); ctx.stroke(); if (p.glow) { ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(0, 0, 1, 0, 0, 24); gg.addColorStop(0, `rgba(${p.glow},.95)`); gg.addColorStop(1, `rgba(${p.glow},0)`); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill(); } break; // a thrown stone (his own are glowing)
    case 'stapler': ctx.rotate(p.spin * 1.2); ctx.fillStyle = '#c0392b'; ctx.fillRect(-13, -5, 26, 6); ctx.fillStyle = '#3a3a42'; ctx.fillRect(-13, 1, 26, 4); break; // the office stapler, spinning
    case 'mug': ctx.rotate(p.spin * 0.8); ctx.fillStyle = '#f4f1ea'; ctx.fillRect(-8, -9, 16, 18); ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(10, 0, 5, -1.2, 1.2); ctx.stroke(); ctx.fillStyle = '#6b3e1f'; ctx.fillRect(-7, -9, 14, 3); break; // his coffee mug
    case 'card': ctx.rotate(p.spin * 1.5); ctx.fillStyle = '#ffffff'; ctx.fillRect(-11, -6, 22, 12); ctx.fillStyle = '#2f3542'; ctx.fillRect(-7, -3, 9, 2); ctx.fillRect(-7, 1, 13, 1.5); break;
    case 'feather': ctx.globalCompositeOperation = 'lighter'; ctx.rotate(Math.atan2(-p.vy, p.vx)); ctx.fillStyle = 'rgba(255,252,235,.95)'; ctx.beginPath(); ctx.ellipse(0, 0, 16, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(255,215,120,.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(14, 0); ctx.stroke(); break;
    case 'haloP': ctx.globalCompositeOperation = 'lighter'; ctx.scale(1, 0.4 + 0.3 * Math.abs(Math.sin(p.spin))); ctx.strokeStyle = 'rgba(255,225,120,.95)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = 'rgba(255,250,220,.7)'; ctx.lineWidth = 2; ctx.stroke(); break;
    case 'hellfire': { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 20); g.addColorStop(0, 'rgba(255,240,180,1)'); g.addColorStop(0.5, 'rgba(255,110,40,.8)'); g.addColorStop(1, 'rgba(160,20,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.fill(); break; }
  }
  ctx.restore();
}
// no shot travels further than this from where it was thrown (supers, and the shield that comes back, aside): it fades out
const PROJ_RANGE = 520, PROJ_FREE = new Set(['beam', 'aegis', 'staffBoom', 'decoy', 'guardShadow', 'trap']);
function updateProjs() {
  for (const p of projs) {
    FX_OWNER = p.owner; // (sparks from a projectile are its owner's)
    if (p.dead) continue;
    p.t = (p.t || 0) + 1;
    if (p.vx && !p.sup && !p.boomerang && p.x0 != null && !PROJ_FREE.has(p.type) && Math.abs(p.x - p.x0) > PROJ_RANGE) {
      p.dead = true; for (let i = 0; i < 5; i++) parts.push({ type: 'aura', x: p.x, y: GROUND - p.y, vx: rnd(-1, 1), vy: rnd(-1, 1), life: 12, max: 12, r: 3, col: '220,220,235' }); continue; }
    if (PJ.has(p.type)) { pjUpdate(p); continue; }
    if (p.type === 'beam') {
      const own = p.owner;
      p.life--;
      if (own.state !== 'attack' || !own.move || (own.move.id !== 'qiCannon' && own.move.id !== 'afCannon') || p.life <= 0) { p.dead = true; continue; } // (Tetsu's Qi Cannon, or Hohen's Core Cannon in the golem armour)
      if (p.hits < p.max && p.t - p.last >= p.interval) {
        const tgt = other(own), hu = hurtbox(tgt, true), hb = projBox(p);
        if (hu && overlap(hb, hu)) {
          const last = p.hits === p.max - 1;
          applyHit(own, tgt, { dmg: last ? p.lastDmg : p.dmg, stun: p.stun, bstun: p.bstun, push: last ? 6 : p.push, kd: last, type: 'mid', chip: true,
            hitstop: last ? 12 : 3, proj: true, str: last ? 2 : 1, gdrain: 3, superHit: true, hold: true, kdVx: last ? 9 : 0, kdVy: last ? 10 : 0, label: p.coreBeam ? 'Core Cannon' : 'Qi Cannon' }, own.facing, hb, hu);
          p.hits++; p.last = p.t;
        }
      }
      continue;
    }
    if (p.type === 'staffBoom') { // Mei's thrown staff: out, then back to her hand
      const own = p.owner, tgt = other(own); p.life--;
      if (p.stay > 0) { p.stay--; p.vx = (tgt.x - p.x) * 0.35; } else if (p.t < p.outT) p.vx *= p.mode === 'boom' ? 0.955 : 0.96; else { /* (stay: the whirlwind stops where it catches them, for its three hits) */ const dx = own.x - p.x; p.vx = Math.sign(dx) * Math.min(16, Math.abs(dx) * 0.2 + 7); }
      p.x += p.vx; p.y += ((100 + Math.max(0, own.y)) - p.y) * 0.1;
      if ((p.t > p.outT && Math.abs(own.x - p.x) < 34) || p.life <= 0 || p.x < -60 || p.x > W + 60 || own.ko) { p.dead = true; own.staffOut = false; sfx('block'); continue; }
      const hu = hurtbox(tgt, true), hb = { x0: p.x - 46, x1: p.x + 46, y0: p.y - 40, y1: p.y + 40 }, back = p.t > p.outT;
      const can = p.mode === 'boom' ? (p.hits === 0 && !back) || (p.hits <= 1 && back && !p.backHit) : p.hits < 3 && !back && p.t - p.last >= 6;
      if (can && hu && overlap(hb, hu)) {
        const last = p.mode === 'triple' && p.hits === 2;
        applyHit(own, tgt, { dmg: p.mode === 'boom' ? (back ? 30 : 42) : (last ? 30 : 20), stun: p.mode === 'boom' ? 22 : 18, bstun: p.mode === 'boom' ? 14 : 10, push: last || back ? 3 : 1.2, type: 'mid', chip: true, hitstop: last ? 8 : 5, proj: true, str: 1, gdrain: 8,
          juggle: true, jugVy: 5, label: p.mode === 'boom' ? 'Staff Boomerang' : 'Staff Whirlwind' }, Math.sign(p.vx) || p.dir, hb, hu);
        if (back) p.backHit = true; p.hits++; p.last = p.t;
        if (p.mode === 'triple') { if (p.hits < 3) p.stay = 7; else { p.stay = 0; p.t = Math.max(p.t, p.outT + 1); } } // (it whirls on the spot, then comes back)
      }
      continue;
    }
    if (p.type === 'aegis') { // out, then back to Aldric's hand
      const own = p.owner, tgt = other(own);
      p.life--;
      if (p.t < 22) p.vx *= 0.94; else { const dx = own.x - p.x; p.vx = Math.sign(dx) * Math.min(14, Math.abs(dx) * 0.2 + 6); }
      p.x += p.vx; p.y += ((GROUND - own.y > 0 ? 100 + own.y : 100) - p.y) * 0.1;
      if ((p.t > 22 && (p.backHit || p.t > 40) && Math.abs(own.x - p.x) < 30) || p.life <= 0 || p.x < -60 || p.x > W + 60) { p.dead = true; own.shieldOut = false; sfx('block'); continue; }
      const hu = hurtbox(tgt, true), hb = { x0: p.x - 26, x1: p.x + 26, y0: p.y - 34, y1: p.y + 34 };
      if (p.hits < 3 && (p.t - p.last >= 8 || (p.t > 22 && !p.backHit)) && hu && overlap(hb, hu)) {
        const last = p.hits === 2 || p.t > 22;
        const back = p.t > 22; if (back) p.backHit = true; // on its way back it drags them toward Aldric and pops them up
        applyHit(own, tgt, { dmg: back ? 30 : 18, stun: 24, bstun: 12, push: back ? 1.5 : 1, launch: back, launchVy: 9.5, type: 'mid', chip: true, hitstop: back ? 8 : 5, proj: true, str: 1, gdrain: 10,
          juggle: true, jugVy: back ? 9 : 5, brand: 1, label: 'Aegis Throw' }, Math.sign(p.vx) || p.dir, hb, hu);
        if (back && tgt.state === 'knock') tgt.vx = pullV(own, tgt) * 1.2; // dragged back toward him
        p.hits++; p.last = p.t;
      }
      continue;
    }
    if (p.type === 'decoy' || p.type === 'guardShadow') { // stand still; the decoy fades once the charge is over
      p.life--;
      const own = p.owner, charging = own.state === 'attack' && own.move && own.move.id === 'shadowCharge';
      if (p.life <= 0 || (p.type === 'decoy' && !charging && p.t > 6)) { p.dead = true; puff(p.x, 60); }
      continue;
    }
    if (p.type === 'crush') { // Crushing Fist: hangs above, then slams down
      p.life--;
      if (p.t > p.hold && !p.juggle) { p.vy = Math.max(p.vy - 3, -20); p.y += p.vy; } // on the ground: the giant fist drops straight down, as it always did
      if (p.t > p.hold && p.juggle) { p.vy = Math.max(p.vy - 3.5, -24); p.y += p.vy; p.tx = tgt0(p).x; p.vx = (p.tx - p.x) * 0.3; p.x += p.vx; // in a combo: a meteor streaking in at an angle, homing on them
        p.trail.push([p.x, p.y]); if (p.trail.length > 8) p.trail.shift();
        if (p.t % 2 === 0) parts.push({ type: 'spark', x: p.x, y: GROUND - p.y, vx: -p.vx * 0.3 + rnd(-1, 1), vy: rnd(-1, 2), life: 12, max: 12, col: R() < 0.5 ? '255,170,90' : '255,200,245' }); }
      if (p.y <= 20) { p.dead = true; dustAt(p.x, true); cracks(p.x); game.shake = Math.max(game.shake, 5); sfx('land'); continue; }
      const tgt = other(p.owner), hu = hurtbox(tgt, true), hb = { x0: p.x - 36, x1: p.x + 36, y0: p.y - 40, y1: p.y + 30 };
      if (p.t > p.hold && hu && overlap(hb, hu)) {
        const h = p.juggle ? { dmg: p.dmg, stun: 20, bstun: 14, push: 1, meteor: true, kd: true, kdVx: 1, kdVy: -8, type: 'mid', chip: true, hitstop: 12, proj: true, str: 2, gdrain: 8, label: 'Falling Star' }
          : { dmg: p.dmg, stun: 20, bstun: 14, push: 2, launch: true, launchVy: 12, bounce: true, type: 'mid', chip: true, hitstop: 11, proj: true, str: 2, gdrain: 12, label: 'Falling Star' };
        applyHit(p.owner, tgt, h, Math.sign(tgt.x - p.owner.x) || p.dir, hb, hu);
        if (!p.juggle && tgt.juggle) tgt.vx = pullV(p.owner, tgt); // the bounce carries them back toward her
        p.dead = true; cracks(p.x);
        if (p.juggle) { game.shake = Math.max(game.shake, 8); sfx('hitH'); tgt.meteorFX = 20; // the meteor slams them down: flash, shockwave, sparks — and a blast on the floor when they hit it
          parts.push({ type: 'star', x: p.x, y: GROUND - p.y, r: 30, vr: 3, life: 10, max: 10, col: '255,230,200', rot: 0 }); parts.push({ type: 'ring', x: p.x, y: GROUND - p.y, r: 12, vr: 8, life: 14, max: 14, col: '255,180,120' });
          for (let i = 0; i < 12; i++) { const an = R() * Math.PI * 2; parts.push({ type: 'spark', x: p.x, y: GROUND - p.y, vx: Math.cos(an) * rnd(3, 8), vy: Math.sin(an) * rnd(3, 8), life: 16, max: 16, col: i % 2 ? '255,180,110' : '255,210,250' }); } }
      }
      continue;
    }
    if (p.type === 'lift') { // Psychic Lift / Levitate: a ring under them, then a column of light
      p.life--;
      if (p.life <= 0) { p.dead = true; continue; }
      if (p.t >= p.erupt && !p.done) {
        const tgt = other(p.owner), hu = hurtbox(tgt, true), hb = { x0: p.x - 42, x1: p.x + 42, y0: 0, y1: 330 };
        if (hu && overlap(hb, hu) && !jumpedOver(tgt)) { // (jump clear of the ring and the column misses)
          p.done = true;
          const h = p.juggle ? { dmg: 30, stun: 18, bstun: 10, push: 0.4, jugVy: 10.5, fixedLift: true, type: 'mid', chip: true, hitstop: 8, proj: true, str: 1, gdrain: 6, juggle: true, label: 'Levitate' }
            : { dmg: 46, stun: 20, bstun: 12, push: 1, launch: true, launchVy: 13, type: 'mid', chip: true, hitstop: 9, proj: true, str: 1, gdrain: 10, label: 'Psychic Lift' };
          applyHit(p.owner, tgt, h, Math.sign(tgt.x - p.owner.x) || p.dir, hb, hu);
          if (tgt.juggle) tgt.vx = pullV(p.owner, tgt); // drawn back toward her
        }
      }
      continue;
    }
    if (p.type === 'pillar') { // Great Sage Pillar: hits several times, then bounces them back to Mei (up close) or knocks them down
      p.life--;
      if (p.t === 6) { game.shake = Math.max(game.shake, 9); dustAt(p.x, true); cracks(p.x); parts.push({ type: 'ering', x: p.x, y: GROUND, r: 12, vr: 9, life: 18, max: 18, col: '255,205,110' }); sfx('land'); }
      if (p.life <= 0) { p.dead = true; continue; }
      const tgt = other(p.owner), hu = hurtbox(tgt, true), hb = { x0: p.x - 62, x1: p.x + 62, y0: 0, y1: 320 }; // the pillar and its shockwave (step off the golden mark and it misses)
      if (p.t >= 6 && p.hits < p.max && hu && overlap(hb, hu) && p.t - p.last >= 4) {
        const last = p.hits === p.max - 1;
        applyHit(p.owner, tgt, { dmg: last ? 70 : 26, stun: 22, bstun: 12, push: last ? 3 : 0.5, kd: last && !p.close, kdVx: 8, kdVy: 10, launch: last && p.close, launchVy: 12, bounce: last && p.close,
          type: 'mid', chip: true, hitstop: last ? 12 : 3, proj: true, str: 2, gdrain: 4, superHit: true, label: 'Great Sage Pillar' }, Math.sign(tgt.x - p.owner.x) || p.dir, hb, hu);
        p.hits++; p.last = p.t;
        if (last && p.close && tgt.juggle) { tgt.vx = (Math.sign(p.owner.x - tgt.x) || 1) * 2.2; if (p.owner.state === 'attack' && p.owner.move && p.owner.move.super) endMove(p.owner); }
      }
      continue;
    }
    if (p.type === 'orb') { // slow multi-hit orb
      p.x += p.vx; p.life--;
      if (p.t % 2 === 0) parts.push({ type: 'aura', x: p.x + rnd(-14, 14), y: GROUND - p.y + rnd(-14, 14), vx: -p.vx * 0.2, vy: rnd(-0.6, 0.6), life: 16, max: 16, r: rnd(3, 6), col: '125,235,255' });
      if (p.x < -60 || p.x > W + 60 || p.life <= 0) { p.dead = true; continue; }
      const tgt = other(p.owner), hu = hurtbox(tgt, true), hb = projBox(p);
      if (hu && overlap(hb, hu) && p.t - p.last >= 7) {
        const last = p.hits === p.max - 1;
        applyHit(p.owner, tgt, { dmg: last ? p.lastDmg : p.dmg, stun: p.stun, bstun: p.bstun, push: last ? 6 : p.push, kd: last, kdVx: 6, kdVy: 7, type: 'mid', chip: true,
          hitstop: last ? 9 : 4, proj: true, str: last ? 2 : 1, gdrain: 4, label: 'Qi Orb' }, Math.sign(p.vx) || p.dir, hb, hu);
        p.hits++; p.last = p.t;
        if (p.hits >= p.max) { p.dead = true; sparks(p.x, GROUND - p.y, 'big'); }
      }
      continue;
    }
    if (p.type === 'clone' && p.fall) { // dive from above, then fade after landing
      p.yOff = Math.max(0, p.yOff - (p.fallSp || 18));
      if (p.yOff === 0) { p.landT = (p.landT || 0) + 1; if (p.landT === 1) { dustAt(p.x, true); parts.push({ type: 'ering', x: p.x, y: GROUND, r: 10, vr: 8, life: 16, max: 16, col: '190,150,255' }); game.shake = Math.max(game.shake, 6); } if (p.landT > 6) p.dead = true; }
    }
    if (p.type === 'flame') {
      const own = p.owner;
      p.life--;
      if (own.state !== 'attack' || !own.move || own.move.id !== 'flame' || p.life <= 0) { p.dead = true; continue; }
      const hb = projBox(p);
      if (p.t % 2 === 0) parts.push({ type: 'aura', x: rnd(hb.x0, hb.x1), y: GROUND - rnd(85, 130), vx: own.facing * rnd(1, 3), vy: -rnd(0.5, 1.5), life: rnd(10, 18), max: 18, r: rnd(2, 4), col: '255,150,60' });
      if (p.hits < p.max && p.t - p.last >= p.interval) {
        const tgt = other(own), hu = hurtbox(tgt, false);
        if (hu && overlap(hb, hu)) {
          const last = p.hits === p.max - 1;
          applyHit(own, tgt, { dmg: last ? p.lastDmg : p.dmg, stun: p.stun, bstun: p.bstun, push: last ? 4 : p.push, kd: false, type: 'mid', chip: true,
            hitstop: last ? 8 : 2, proj: true, str: last ? 2 : 1, gdrain: 2, label: 'Fire Breath' }, own.facing, hb, hu);
          p.hits++; p.last = p.t;
        }
      }
      continue;
    }
    if (p.type === 'homing') {
      if (p.hold) {
        const own = p.owner;
        if (own.state !== 'attack' || !own.move || own.move.id !== 'fireballs') { p.dead = true; puff(p.x, p.y); continue; } // interrupted before launch
        orbHold(p); continue;
      }
      p.ft = (p.ft || 0) + 1;
      if (p.ft < 60) { // track the opponent for about a second
        const o = other(p.owner), dx = o.x - p.x, dy = (caughtIn(o) ? o.y : 0) + 70 * o.ch.scale - p.y, L = Math.hypot(dx, dy) || 1; // (they home in at body height: jump over them)
        if (caughtIn(o) || o.y < 20) p.vx += (dx / L * 6 - p.vx) * 0.07; if (caughtIn(o)) p.vy += (dy / L * 6 - p.vy) * 0.07; else { p.vy = 0; p.y += (70 - p.y) * 0.25; } // (on someone not in a combo they drop to body height and fly level: a jump clears them)
      }
      if (p.t % 2 === 0) parts.push({ type: 'aura', x: p.x - p.vx + rnd(-4, 4), y: GROUND - p.y + rnd(-4, 4), vx: 0, vy: -0.4, life: 12, max: 12, r: rnd(2.5, 5), col: '160,200,255' });
    }
    p.x += p.vx; p.y += p.vy; p.life--;
    if (p.hx !== undefined) p.x = p.hx + Math.cos(p.hph + p.t * 0.45) * 30; // Qi Spiral: circling as it rises
    if (p.rot !== undefined) p.rot += 0.45 * Math.sign(p.vx);
    if (p.type === 'wave' && p.t % 2 === 0) dustAt(p.x, false);
    if (p.type === 'qi' && p.t % 2 === 0) parts.push({ type: 'aura', x: p.x - p.vx * 2 + rnd(-6, 6), y: GROUND - p.y + rnd(-10, 10), vx: -p.vx * 0.1, vy: rnd(-0.6, 0.6), life: 14, max: 14, r: rnd(3, 6), col: '125,235,255' });
    if (p.air && p.y <= 8) { p.dead = true; sparks(p.x, GROUND - 8, 'block'); continue; }
    if (p.x < -60 || p.x > W + 60 || p.life <= 0) { p.dead = true; if (p.type === 'clone') puff(p.x, 60); continue; }
    const tgt = other(p.owner), hu = hurtbox(tgt, !!p.juggle, !!p.low);
    if (tgt.state === 'attack' && tgt.move && tgt.move.barrier && tgt.mf > tgt.move.startup && tgt.mf <= tgt.move.startup + tgt.move.active && ['qi', 'homing', 'shuriken', 'orb', 'pfist', 'wave', 'rain'].includes(p.type)) {
      const fb = { x0: tgt.x + (tgt.facing > 0 ? 0 : -90), x1: tgt.x + (tgt.facing > 0 ? 90 : 0), y0: 0, y1: 190 };
      if (overlap(projBox(p), fb)) { // reflected: it now belongs to her
        p.owner = tgt; p.vx = -p.vx || tgt.facing * 6; p.vy = -p.vy * 0.5; p.dir = -p.dir; p.ft = 999; p.hold = false;
        popText(tgt.x, GROUND - 190, 'REFLECT!', '255,170,240'); sfx('block'); continue;
      }
    }
    if (tgt.state === 'attack' && tgt.move && tgt.move.destroysProj && tgt.mf > tgt.move.startup && tgt.mf <= tgt.move.startup + tgt.move.active && p.type !== 'beam' && p.type !== 'flame' && p.type !== 'pillar') {
      const fb = { x0: tgt.x + (tgt.facing > 0 ? 0 : -140), x1: tgt.x + (tgt.facing > 0 ? 140 : 0), y0: 20, y1: 190 };
      if (overlap(projBox(p), fb)) {
        if (tgt.move.reflectAll && PJ.has(p.type)) { p.owner = tgt; p.vx = -p.vx || tgt.facing * 8; p.vy = -p.vy * 0.5; p.dir = -p.dir; p.boomerang = 0; popText(tgt.x, GROUND - 180, 'REFLECT!', '150,215,255'); sfx('block'); continue; } // the kappa's shell sends it straight back
        p.dead = true; sparks(p.x, GROUND - p.y, 'clash'); sfx('block'); continue; } // the spinning staff swats it away
    }
    if (hu) {
      const hb = projBox(p);
      if (overlap(hb, hu)) {
        const pr = applyHit(p.owner, tgt, { dmg: p.dmg, stun: p.stun, bstun: p.bstun, push: p.push, kd: !!p.kd, type: 'mid', chip: !!p.chip, hitstop: p.hitstop,
          proj: true, str: p.kd ? 2 : 1, superHit: !!p.superHit, gMul: p.gMul, low: !!p.lowHit, overhead: !!p.overhead, kdVx: p.kdVx, kdVy: p.kdVy, jugVy: p.jugVy, fixedLift: !!p.fixedLift, launch: !!p.launch, launchVy: p.launchVy, bounce: !!p.bounce, stunT: p.stunT, stunKind: p.stunKind, gdrain: p.type === 'shuriken' || p.type === 'homing' ? 5 : p.juggle ? 4 : 8,
          label: p.type === 'pfist' ? (p.superHit ? 'Crystal Storm' : 'Crystal Shard') : p.type === 'shuriken' ? 'Shuriken' : p.type === 'homing' ? 'Lightning Ball' : p.type === 'wave' ? 'Earth Stomp' : p.type === 'rain' ? (p.qi ? 'Qi Spiral' : 'Lightning Rain') : p.type === 'qi' ? 'Qi Blast' : p.relay ? 'Clone Relay' : p.juggle ? 'Shadow Army' : 'Shadow Clone' }, Math.sign(p.vx) || p.dir, hb, hu);
        p.dead = true;
        if (p.type === 'clone') puff(p.x, 70);
        if (p.army) p.armyRes = pr;
        if (p.army && pr && pr !== 'block') Object.assign(spawnClone(p.owner, true, p.army === 'front' ? 0 : 1, 0, 'mid', true), ARMY_LAST); // Shadow Army: the dive hit — the last clone comes at once, at body height, to catch them as they bounce
        if (p.endOwner && tgt.juggle) { // Shadow Army up close: Kuro drops the hand sign right away to follow up
          tgt.vx = (Math.sign(p.owner.x - tgt.x) || 1) * 2.2;
          if (p.owner.state === 'attack' && p.owner.move && p.owner.move.super) endMove(p.owner);
        }
      }
    }
  }
  for (let i = 0; i < projs.length; i++) for (let j = i + 1; j < projs.length; j++) {
    const a = projs[i], b = projs[j];
    if (a.dead || b.dead || a.owner === b.owner || a.hold || b.hold || NO_CLASH.has(a.type) || NO_CLASH.has(b.type)) continue;
    const ba = projBox(a), bb = projBox(b);
    if (!overlap(ba, bb)) continue;
    const ga = a.type === 'guardShadow' ? a : b.type === 'guardShadow' ? b : null;
    if (ga && !(a.type === 'beam' || a.type === 'flame' || b.type === 'beam' || b.type === 'flame')) { // the guarding shadow blocks the projectile
      const other2 = ga === a ? b : a; other2.dead = true;
      sparks(other2.x || ga.x, GROUND - 90, 'block'); sfx('block');
      if (++ga.hits >= 2) { ga.dead = true; puff(ga.x, 60); }
      continue;
    }
    const strong = p => p.type === 'beam' || p.type === 'flame' || !!p.sup || !!p.superHit, sa = strong(a), sb = strong(b); // (a super's shot beats an ordinary one)
    if (sa && sb) continue;
    const knock = p => { if (p.type === 'staffBoom' || p.type === 'aegis') { p.t = Math.max(p.t, (p.outT || 22) + 1); p.stay = 0; return; } p.dead = true; if (p.type === 'plate' && p.owner) p.owner.plateOut = false; }; // (a thrown staff or shield is knocked back to its owner)
    if (sa) knock(b); else if (sb) knock(a); else { knock(a); knock(b); }
    const mx = (Math.max(ba.x0, bb.x0) + Math.min(ba.x1, bb.x1)) / 2, my = GROUND - (Math.max(ba.y0, bb.y0) + Math.min(ba.y1, bb.y1)) / 2;
    sparks(mx, my, 'clash'); sfx('block');
  }
  for (let i = projs.length - 1; i >= 0; i--) if (projs[i].dead) projs.splice(i, 1);
}

