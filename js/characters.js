'use strict';
/* ================= characters ================= */
const CHARS = {
  ninja: {
    // frames: wind-up 2 shorter (light) / 4 shorter (heavy), hand signs 20% shorter (still long enough to jab him first); every attack out 3 frames longer; recovery 3 / 5 / 5 longer
    frameMod: { su: { light: 2, heavy: 4 }, tell: 0.8, act: 3, rec: { light: 3, heavy: 5, tech: 5 } },
    // his techniques' 発生 (frames until they can hit) brought to about 16–22: how many times faster their lead-up plays (see techSpeed)
    techSpeed: { shadowCharge: 4.5, swordSlash: 2.4, cloneStrike: 1.2, teleKick: 2.25, flame: 2.1, fireballs: 10, vanishSlide: 5, vanishDrop: 5.5, ambushLeap: 5, teleSpin: 1.68, ambushBehind: 1.35, ambushSlide: 1.25, ambushKick: 1.3,
      jFire: 1.45, jRain: 1.5, jClone: 1.55, jIai: 1.45, jVanishHeel: 1.45 },
    techDelay: { teleSlide: 5 }, // (and the other way: frames added before this one — the Drop Slide comes out a little later)
    spBF: { lp: 'moonTempest', hp: 'fullMoon' }, // ← → + U / I: Moon Tempest, Full Moon Tempest (his I is no longer held to charge)
    superPreMul: 0.2, // (Shadow Army: a shorter warning before the clones come — 発生 faster)
    noLowSp: true, // (no ↓ versions of his techniques on demand: they still come out by themselves on someone in the air)
    name: 'KURO', dmgMul: 1.08, title: 'Shadow Ninja', nameJa: 'クロ', titleJa: '影の忍者', jugDmg: 1.15, scale: 1, walk: 3.4, back: 2.8, jumpX: 4.4,
    pDmg: 0.9, kDmg: 0.92, pReach: 1, kReach: 1.08, chargeRate: 0.5, auraCol: '185,145,255',
    sp: { fP: 'shadowCharge', fPH: 'swordSlash', fK: 'cloneStrike', fKH: 'teleKick', bP: 'flame', bPH: 'fireballs', bK: 'vanishSlide', bKH: 'vanishDrop' }, sup: 'shadowArmy',
    heavy: {
      p: { label: 'Kunai Slash', startup: 9, active: 5, recovery: 18, hitbox: [10,104,106,140], wind: 'slashW', pose: 'slash', blade: true, lunge: [3, 9, 4.5], hitstop: 10, speedFx: true,
        trail: { cx: 15, cy: 105, r: 80, a0: 80, a1: -35, col: '225,235,255' } },
      k: { label: 'Crescent Kick', startup: 10, active: 5, recovery: 19, hitbox: [15,92,45,140], wind: 'crescentW', pose: 'crescent', lunge: [2, 8, 3.5], cpLaunch: true, launchVy: 13,
        trail: { cx: 0, cy: 62, r: 78, a0: -45, a1: 95, col: '190,150,255' } },
    },
    colors: { cloth: '#29324d', back: '#181d2e', dark: '#0f131e', wrap: '#4a5674', glove: '#141822', accent: '#dd3a52', skin: '#f1d0aa', metal: '#8d97b0' },
    meterCol: ['#7d4ff0', '#d8c0ff'], bannerCol: 'rgba(110,70,220,.88)', fxCol: '190,150,255', idle: 'idle', chargePose: 'seal', winPose: 'seal', atkCD: 8, recoverT: 8, hitFx: 'slash',
  },
  brawler: {
    name: 'TETSU', dmgMul: 0.97, title: 'Qi Brawler', nameJa: 'テツ', titleJa: '気の拳士', armor: 3, jugDmg: 1.2, scale: 1.08, walk: 3.0, back: 2.4, jumpX: 3.9,
    pDmg: 1.4, kDmg: 1.2, pReach: 1.04, kReach: 0.96, chargeRate: 0.68, auraCol: '125,235,255',
    sp: { fP: 'meteorFist', fPH: 'duckUpper', fK: 'qiSweep', fKH: 'shoulder', bP: 'pushParry', bPH: 'kickParry', bK: 'stomp', bKH: 'tornado', dP: 'risingFist' }, sup: 'qiCannon',
    spBF: { lp: 'qiBlast', hp: 'tripleQi' }, // ← → + U: Qi Blast, ← → + I: Triple Qi Blast
    hitPlus: 4, counterStun: 8, // every hit leaves him 4 frames further ahead; a counter hit 8 (everyone else: 4)
    frames: { // 発生, 持続, 硬直 and 硬直差 on guard for each attack (see moveFrames)
      U: { su: 6, act: 6, rec: 9, blk: -4 }, dU: { su: 6, act: 6, rec: 9, blk: -4 }, J: { su: 6 }, dJ: { su: 10, act: 6, blk: -10 },
      I: { su: 12, rec: 11, blk: -8, set: { cpLaunch: true, launchVy: 13 } }, // (a counter or a punish launches: a combo)
      K: { su: 14, act: 7, rec: 22, blk: -14, set: { launchVy: 14.5 } }, // (a counter launches a little higher: the follow-up comes later after the longer recovery)
      dK: { su: 12, act: 8, blk: -12, set: { launch: false, kd: true, kdVx: 3, kdVy: 5, cpLaunch: true, launchVy: 13 } }, // (sweeps them off their feet; a counter or a punish launches)
      risingFist: { su: 14, act: 18, blk: -18 },
      meteorFist: { su: 18, act: 20, blk: -18, set: { cutOnHit: true, launch: false, bounce: false, kd: true, kdVx: 16, kdVy: 9, cpLaunch: true, launchVy: 12, guardPush: 16, gdrain: 32, chip: true, hitbox: [-10,80,28,110] } }, // (a mid: the fists come down at body height) // (guarded: shoves them far back and tears at the guard)
      duckUpper: { su: 18, act: 16, blk: -14, set: { cutOnHit: true } },
      qiBlast: { su: 14, act: 3, rec: 3, blk: 0 }, tripleQi: { su: 16, act: 3, rec: 3, blk: 0 },
      qiSweep: { su: 18, act: 18, blk: -21 },
      shoulder: { su: 18, act: 12, blk: -21, set: { maxTravel: 300, tArmor: true } }, // (armor: shrugs off up to three light hits)
      stomp: { su: 14, act: 6, rec: 3, blk: 0 },
      tornado: { su: 18, act: 27, blk: -14, set: { maxTravel: 320, advByStun: true, tArmor: true } }, // (armor)
      $t2: { su: 10, act: 6, rec: 14, blk: -2 }, $t3: { su: 10, act: 6, rec: 14, blk: -2 }, $t4: { su: 10, act: 6, rec: 14, blk: -2 }, // U, U / U, U, U / U, U, U, U
      $tF: { su: 18, act: 7, rec: 24, blk: -16, set: { bpush: 16, gdrain: 30 } }, // U, U, U, U, K: guarded, it shoves them far back and tears at the guard
      $tD: { su: 18, act: 8, rec: 24, blk: -21 }, // U, U, U, U, ↓ + K
      $tL: { su: 14, blk: -13 }, // U, I and U, U, I (−16 measured: the launch adds 3)
      $tl2: { su: 10 }, // J, J
      $tlE: { su: 18, act: 7, rec: 24, blk: -16 }, // J, J, K and J, K (high)
      $tlD: { su: 21, act: 8, rec: 24, blk: -16 }, // J, J, ↓ + K (mid)
    },
    heavy: {
      p: { label: 'Qi Palm', startup: 10, active: 4, recovery: 19, hitbox: [20,118,106,130], wind: 'palmW', pose: 'palm', lunge: [3, 11, 5], push: 10, gdrain: 22, burst: [80, 108] },
      k: { label: 'Axe Kick', startup: 10, active: 4, recovery: 19, hitbox: [20,104,0,150], wind: 'axeW', pose: 'axe', lunge: [3, 11, 5.5], cpLaunch: true, launchVy: 13, kd: true, stomp: [56, 0],
        trail: { cx: 5, cy: 62, r: 72, a0: 100, a1: -20, col: '255,215,160' } },
    },
    colors: { skin: '#c98b5e', skinB: '#a46c45', pants: '#2d303c', pantsB: '#1e2029', vest: '#2f7d5c', vestB: '#235c44', wrap: '#f0e8d8', wrapB: '#cdc4b1', hair: '#18120e', band: '#8a5129', belt: '#5a3a1f', shoe: '#17181c', bead: '#7a4b2a', sash: '#c23b2e' },
    meterCol: ['#14a8c8', '#b4f7ff'], bannerCol: 'rgba(16,150,190,.88)', fxCol: '125,235,255', idle: 'idleT', chargePose: 'charge', winPose: 'win', atkCD: 14, recoverT: 12, hitFx: 'hex',
  },
  staff: {
    reachAdd: 28, name: 'MEI', title: 'Staff Prodigy', nameJa: 'メイ', titleJa: '棍の天才', dmgMul: 0.88, guardDmgMul: 0.6, slowTech: 4, pushMul: 1.6, prePose: 'chargeB', jugDmg: 1.15, scale: 0.94, walk: 3.6, back: 3.0, jumpX: 4.8, jumpV: 19.5, doubleJump: true,
    pDmg: 1.35, kDmg: 1.2, pReach: 1.9, kReach: 1.0, chargeRate: 0.66, auraCol: '255,200,90', fxCol: '255,205,110',
    spBF: { lp: 'staffThrow', hp: 'staffWhirl' }, // ← → + U: Staff Boomerang, ← → + I: Staff Whirlwind
    sp: { fP: 'extendStaff', fPH: 'vaultSmash', fK: 'poleKick', fKH: 'sweepStaff', bP: 'windmill', bPH: 'cloudLeap', bK: 'somersault', bKH: 'feint' }, sup: 'greatSage',
    recPlus: 5, // every attack recovers 5 frames slower (see moveFrames)
    antiAir: 250, // her mid and top attacks reach up to here, over her head as well: they catch a jump or a drop from above
    frames: { // 発生, 持続, 硬直 and 硬直差 on guard for each attack (see moveFrames)
      U: { su: 6, act: 5, rec: 9, blk: -4 }, dU: { su: 8, act: 5, rec: 9, blk: -4 }, J: { su: 6, act: 5, rec: 9, blk: -4 }, dJ: { su: 8, act: 5, rec: 9, blk: -4 },
      I: { su: 12, act: 6, rec: 16, blk: -12 }, K: { su: 16, act: 8, rec: 18, blk: -14 },
      dI: { su: 13.5, act: 6, rec: 18, blk: -16 }, /* (14F measured: its wind-up speeds up unevenly) */ dK: { su: 14, act: 6, rec: 20, blk: -14 },
      $m2: { su: 12, act: 5, rec: 12, blk: -6 }, $m3: { su: 14, act: 5, rec: 12, blk: -6 }, $m4: { su: 16, act: 5, rec: 12, blk: -6 }, // U, U / U, U, U (low) / U, U, U, U (low)
      $mD: { su: 16, act: 6, rec: 16, blk: -14 }, $mUD: { su: 21, act: 6, rec: 20, blk: -16 }, // U×4, ↓ + K (low) / U, ↓ + K (low)
      $mF: { su: 14, act: 6, rec: 20, blk: -12 }, $mL: { su: 14, blk: -13 }, /* (−16 measured: the launch adds 3) */ $mE: { su: 18, act: 6, rec: 20, blk: -16 }, // U×4, K / U, I / U, K
      $ml2: { su: 10, act: 5, rec: 12, blk: -6 }, $mlE: { su: 15, act: 6, rec: 20, blk: -16 }, // J, J (mid) / J, J, K and J, K
      extendStaff: { su: 21, blk: -10 }, vaultSmash: { su: 21, blk: -18 }, poleKick: { su: 14, blk: -14 }, sweepStaff: { su: 18, blk: -18 }, // (→ → + J Pole Spin Kick, → → + K Sweeping Staff)
      staffThrow: { su: 16, act: 2, rec: 3, set: { noGuardLag: true } }, staffWhirl: { su: 18, act: 2, rec: 3, set: { noGuardLag: true } }, // (硬直 8 with her +5, guarded or not)
      windmill: { su: 18, blk: -16 }, cloudLeap: { su: 21, act: 20, blk: -18 }, somersault: { su: 14, blk: -14 }, feint: { su: 18, blk: -8 },
    },
    heavy: {
      p: { label: 'Staff Sweep', startup: 10, active: 5, recovery: 18, hitbox: [10,250,50,150], wind: 'staffSwingW', pose: 'staffSwing', lunge: [3, 9, 1], /* (a long sweep: she hardly steps in) */ hitstop: 10, spinWind: true,
        trail: { cx: 20, cy: 100, r: 120, a0: 120, a1: -20, col: '255,205,110' } },
      k: { label: 'Round Swing', startup: 11, active: 8, recovery: 18, hitbox: [-150,195,20,170], wind: 'staffSwingW', pose: 'staffWhirl', lunge: [3, 9, 1], cpLaunch: true, launchVy: 13, kd: true, kdVx: 10,
        spin: [11, 19], spinStaff: true, trail: { cx: 0, cy: 95, r: 150, a0: -170, a1: 170, col: '255,205,110' } },
    },
    normalLook: {
      sp0: { label: 'Staff Thrust', wind: 'thrustW', pose: 'thrust', staffExt: 40, hitbox: [20,175,92,128] },
      cp1: { label: 'Rising Staff', wind: 'crouch', pose: 'staffRise', trail: { cx: 20, cy: 90, r: 110, a0: -40, a1: 100, col: '255,205,110' } },
      jp0: { label: 'Air Staff Poke', wind: 'jump', pose: 'airStaff' },
      sk0: { label: 'Low Thrust', wind: 'staffHighW', pose: 'staffLowThrust', staffExt: 30, hitbox: [20,165,0,60], trail: { cx: 20, cy: 85, r: 125, a0: 60, a1: -35, col: '255,205,110' } },
      ck0: { label: 'Crouch Staff Poke', wind: 'crouch', pose: 'staffLowCrouch', hitbox: [20,150,0,30] },
      ck1: { label: 'Staff Floor Sweep', wind: 'crouch', pose: 'staffSweep', spinStaff: true, hitbox: [20,195,0,30] },
      jk0: { label: 'Air Staff Low Swing', wind: 'jump', pose: 'airStaffDown', hitbox: [10,135,0,60] },
      jk1: { label: 'Air Staff Whirl', wind: 'jump', pose: 'airStaffWhirl', spinStaff: true, hitbox: [-40,145,0,90] },
      jp1: { label: 'Falling Staff', wind: 'slamWAir', pose: 'airStaffDown', launch: true, launchVy: 10, bounce: true, hitbox: [0,145,-10,110], spinWind: true,
        trail: { cx: 20, cy: 90, r: 110, a0: 110, a1: -40, col: '255,205,110' } },
    },
    colors: { jacket: '#c8322d', jacketB: '#9a231f', trim: '#f2c14e', pants: '#23252f', pantsB: '#17181f', skin: '#f2cba3', hair: '#1c1410', shoe: '#121216', sock: '#f4f1ea', staff: '#8a4f22', staffB: '#5e3416', cap: '#f2c14e' },
    meterCol: ['#d98a1c', '#ffe28a'], bannerCol: 'rgba(200,120,20,.88)', idle: 'idleB', chargePose: 'chargeB', winPose: 'winB', atkCD: 8, recoverT: 8, hitFx: 'star',
  },
  psychic: {
    name: 'LYRA', title: 'Psychic Sage', nameJa: 'ライラ', titleJa: '超能力の賢者', dmgMul: 1.23, slowTech: 13, normalPre: 6, pushMul: 1.5, reachMul: 1.22, stringDelay: 9, prePose: 'psyCast', jugDmg: 1.0, jugHitMul: 1.2, scale: 1.0, walk: 4.0, back: 4.0, jumpX: 5.0, // (her magic is the slowest to come out, but she moves quickly)
    hover: true, orbs: true,
    pDmg: 0.9, kDmg: 0.9, pReach: 1.15, kReach: 1.0, chargeRate: 0.48, auraCol: '200,160,255', fxCol: '210,190,255',
    sp: { fP: 'phantomFist', fPH: 'crushFist', fK: 'psyLift', fKH: 'forceWave', bP: 'orbBurst', bPH: 'tripleRay', bK: 'orbStrong', bKH: 'orbLong' }, sup: 'thousandFists',
    frames: { // 発生, 持続, 硬直 and 硬直差 on guard for each attack (see moveFrames)
      U: { su: 14, act: 8, rec: 10, blk: -4 }, dU: { su: 14, act: 8, rec: 10, blk: -4 }, J: { su: 14, act: 8, rec: 10, blk: -4 }, dJ: { su: 14, act: 8, rec: 10, blk: -4 }, // (her spells last longer and she recovers sooner)
      I: { su: 16, suFar: 28, act: 10, rec: 14, blk: -10 }, K: { su: 16, suFar: 28, act: 10, rec: 14, blk: -10 }, dI: { su: 16, suFar: 28, act: 10, rec: 14, blk: -16 }, dK: { su: 16, suFar: 28, act: 10, rec: 14, blk: -14 }, // (her heavy spells reach end to end: 16F up close, up to 28F across the stage)
      $y2: { su: 12, act: 8, rec: 12, blk: -6 }, $y3: { su: 12, act: 8, rec: 12, blk: -6 }, $y4: { su: 12, act: 8, rec: 12, blk: -6 }, $yF: { su: 18, act: 8, rec: 18, blk: -18 }, $yL: { su: 16, act: 6, rec: 18, blk: -15 }, /* (−16 measured) */ $yE: { su: 20, act: 6, rec: 18, blk: -15 }, /* (U, K: −16 measured) */
      $yl2: { su: 12, act: 8, rec: 12, blk: -6 }, $ylE: { su: 18, act: 8, rec: 18, blk: -16 },
      phantomFist: { su: 18, blk: -6 }, crushFist: { su: 19, blk: -16 }, /* (the star drops on its own time) */ psyLift: { su: 22, blk: -16 }, forceWave: { su: 14, blk: -16, set: { kdVx: 18, kdVy: 7, hitbox: [30,290,30,170], giantFist: [190, 105, 1.4] } }, // (Spirit Fist: quicker, reaches further, sends them flying further)
      orbBurst: { su: 24, blk: -12 }, tripleRay: { su: 13.5, blk: -14 }, /* (14F measured) */ orbStrong: { su: 14 }, orbLong: { su: 16 },
    },
    heavy: {
      p: { label: 'Glyph Burst', startup: 12, active: 5, recovery: 18, hitbox: [40,195,85,145], wind: 'psyW', pose: 'psyPush', lunge: [2, 8, 1], hitstop: 10, push: 8, psyFist: [150, 115, 1], onStart: (f, o) => lyraReach(f, o, LYRA_FAR, 120) },
      k: { label: 'Gravity Well', startup: 13, active: 4, recovery: 19, hitbox: [40,185,0,170], wind: 'psyRaise', pose: 'psyDown', lunge: [2, 8, 1], cpLaunch: true, launchVy: 13, kd: true, psyFist: [130, 55, 1.15, 1], onStart: (f, o) => lyraReach(f, o, LYRA_FAR, 110) },
    },
    normalLook: {
      sp0: { label: 'Ripple', noCrystal: true, wind: 'psyW', pose: 'psyPush', hitbox: [40,138,94,132], psyFist: [100, 112, 0.55], onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 80), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 80); } },
      cp1: { label: 'Ground Burst', wind: 'psyW', pose: 'psyUp', crouch: false, hitbox: [40,175,0,200], groundBurst: 115, low: true, multi: 3, interval: 4, dmg: 22, lastDmg: 30, push: 0.4, lastPush: 2, launch: false, kd: false, onStart: (f, o) => lyraReach(f, o, LYRA_FAR, 115) }, // (bursts up under them, wherever they are: a low, three hits, no launch)
      jp1: { label: 'Falling Glyph', pose: 'airPsyDown', hitbox: [10,115,10,100], psyFist: [85, 60, 0.8, 0.5] },
      sk0: { label: 'Floor Glyph', wind: 'psyW', pose: 'psyLowCast', hitbox: [80,195,0,42], floorGlyph: 145, onStart: (f, o) => lyraReach(f, o, LYRA_RANGE, 110), onFrame: (f, o, mf) => { if (mf <= f.move.startup) lyraReach(f, o, LYRA_RANGE, 80); } },
      sk1: null,
      ck0: { label: 'Crouch Floor Glyph', wind: 'crouch', pose: 'psyLowCast', hitbox: [70,180,0,30], floorGlyph: 130 },
      ck1: { label: 'Glyph Trip', wind: 'crouch', pose: 'psyLowCast', hitbox: [90,215,0,30], floorGlyph: 160, kd: false, launch: true, launchVy: 12, guardPop: true, onStart: (f, o) => lyraReach(f, o, LYRA_FAR, 160) }, // (the glyph opens under them, wherever they are: a low that launches; guarded, it still pops them up off the ground)
      jk0: { label: 'Air Glyph Drop', wind: 'jump', pose: 'airPsyDown', hitbox: [10,110,0,60], psyFist: [70, 25, 0.6, 1] },
      jk1: { label: 'Air Glyph Spin', wind: 'jump', pose: 'airPsyBoth', hitbox: [-30,120,0,90], psyFist: [60, 50, 0.75, 0.5] },
    },
    crouchPose: 'crouchL',
    colors: { robe: '#4d2a72', robeB: '#2f1a48', trim: '#f4c6f0', sash: '#d6539f', skin: '#f4d6c6', hair: '#ece6fb', hairB: '#bdb3dc', shoe: '#2a1b3a', gem: '#ff7ad9' },
    meterCol: ['#c04fd8', '#ffc3f4'], bannerCol: 'rgba(170,60,190,.88)', idle: 'idleL', chargePose: 'chargeL', winPose: 'winL', atkCD: 12, recoverT: 12, hitFx: 'ripple',
  },
  paladin: {
    name: 'ALDRIC', title: 'Holy Paladin', nameJa: 'アルドリック', titleJa: '聖騎士', autoBlock: true, dmgMul: 1.08, guardDmgMul: 0.55, guardMul: 0.42, sturdy: true, jugDmg: 1.2, scale: 1.08, walk: 2.5, back: 1.9, jumpX: 3.0, jumpV: 14,
    pDmg: 1.05, kDmg: 1.0, pReach: 1.5, kReach: 1.3, chargeRate: 0.55, auraCol: '190,225,255', fxCol: '205,232,255',
    sp: { fP: 'plRampart', fPH: 'plJudgeThrust', fK: 'plWindmill', fKH: 'plLeap', bP: 'plParryRise', bPH: 'plParryStun', bK: 'plAegis', bKH: 'plPray' }, sup: 'plJudgement',
    frames: { // 発生, 持続, 硬直 and 硬直差 on guard for each attack (see moveFrames)
      U: { su: 10, blk: -4 }, dU: { su: 10, blk: -4 }, J: { su: 10, blk: -4 }, dJ: { su: 10, blk: -4 },
      I: { su: 16, blk: -12 }, K: { su: 18, blk: -14 }, dI: { su: 16, blk: -16 }, dK: { su: 16, blk: -14 },
      $p2: { su: 18, blk: -6 }, $p3: { su: 14, blk: -6 }, $p4: { su: 16, blk: -6 }, $pF: { su: 18, blk: -18 }, $pL: { su: 16, blk: -16 }, $pE: { su: 24, blk: -16 }, // U, U … U×4 / U×4, K / U, I / U, K
      $pUI: { su: 18, blk: -16 }, $pUK: { su: 18, blk: -16 }, // U, ↓ + I / U, ↓ + K (both low)
      $pl2: { su: 12, blk: -6 }, $plE: { su: 18, blk: -16 }, // J, J / J, J, K and J, K
      plRampart: { blk: -16, held: true }, plJudgeThrust: { su: 22, blk: -16 }, plWindmill: { su: 16, blk: -16 }, plLeap: { su: 30, blk: -16 },
    },
    heavy: {
      p: { label: 'Heavy Cleave', dmg: 66, startup: 9, active: 6, recovery: 24, hitbox: [10,180,0,195], wind: 'pCleaveW', pose: 'pCleave', hitstop: 12, kd: true, kdVx: 7, gdrain: 16,
        onFrame: (f, o, mf) => { if (mf === f.move.startup + 1) { dustAt(f.x + f.facing * 120, true); game.shake = Math.max(game.shake, 2); sfx('land'); } } },
      k: { label: 'Heavy Thrust', dmg: 58, startup: 9, active: 5, recovery: 16, hitbox: [20,170,80,135], wind: 'pThrustW', pose: 'pThrust', wrist: 0, hitstop: 10, push: 7, bpush: 6, gdrain: 8,
        onFrame: (f, o, mf) => { if (mf <= f.move.startup) f.vx = f.facing * 4; else f.vx *= 0.6; } }, // (a pushing thrust: he steps in with it)
    },
    normalLook: {
      sp0: { label: 'Pommel Strike', wind: 'pBashW', pose: 'pSlash', hitbox: [20,150,85,140] },
      cp1: { label: 'Rising Shield', wind: 'pQuake', pose: 'pShieldUp', hitbox: [10,135,40,200] },
      sk0: { label: 'Low Cut', wind: 'pThrustW', pose: 'pLowCut', hitbox: [20,165,0,50] },
      ck0: { label: 'Crouch Sword Poke', wind: 'crouch', pose: 'pLowCut', hitbox: [20,150,0,32] },
      ck1: { label: 'Shield Trip', wind: 'crouch', pose: 'pLowCut', hitbox: [20,170,0,32] },
      jp0: { label: 'Air Pommel', wind: 'jump', pose: 'pAir', hitbox: [10,95,40,120] },
      jp1: { label: 'Air Slash', wind: 'jump', pose: 'pAirDown', hitbox: [10,130,0,110] },
      jk0: { label: 'Air Shield Knee', wind: 'jump', pose: 'pAir', hitbox: [10,90,10,90] },
      jk1: { label: 'Air Shield Drop', wind: 'jump', pose: 'pAirDown', hitbox: [0,110,0,100] },
    },
    crouchPose: 'crouchP',
    colors: { plate: '#c9d1db', plateB: '#98a2b0', plateD: '#5c6675', trim: '#e8c25a', trimB: '#b8912f', tabard: '#f4f1e8', tabardB: '#d6cfbf', cross: '#2f5aa8',
      cape: '#2f4f8f', capeB: '#203763', shield: '#2f5aa8', shieldB: '#203763', blade: '#e9eef5', grip: '#5a3a22', plume: '#c0392b', visor: '#1b1e26' },
    meterCol: ['#d6a22c', '#fff0b8'], bannerCol: 'rgba(200,160,40,.9)', idle: 'idleP', chargePose: 'chargeP', winPose: 'winP', atkCD: 10, recoverT: 10, hitFx: 'holy',
  },
};
Object.assign(CHARS, {
  kappa: {
    name: 'KAPPA', title: 'Mythic Kappa', nameJa: 'カッパ', titleJa: '幻獣カッパ', dmgMul: 1.03, scale: 0.86, walk: 3.3, back: 2.9, jumpX: 4.4, jumpV: 18, jugDmg: 1.1,
    pDmg: 1.0, kDmg: 1.0, pReach: 1.1, kReach: 0.9, chargeRate: 0.62, auraCol: '120,220,200', fxCol: '140,215,255',
    sp: { fP: 'kpPlate', fPH: 'kpCannon', fK: 'kpPounce', fKH: 'kpFrenzy', bP: 'kpBubble', bPH: 'kpGeyser', bK: 'kpShell', bKH: 'kpRiptide' }, sup: 'kpFlood',
    frames: { // 発生, 持続, 硬直 and 硬直差 on guard for each attack (see moveFrames)
      U: { su: 10, blk: -4 }, dU: { su: 10, blk: -4 }, dJ: { su: 10, blk: -4 }, J: { su: 18, act: 13 }, // (J and K are throws: unblockable, no guard number; ten more frames of 持続 so the one caught can break them)
      I: { su: 16, blk: -12 }, K: { su: 18, act: 13 }, dI: { su: 16, blk: -16 }, dK: { su: 16, blk: -14 },
      $c2: { su: 14, blk: -6 }, $c3: { su: 17, blk: -6 }, $c4: { su: 21, blk: -6 }, $cF: { su: 21, act: 14 }, $cUI: { su: 18, blk: -16 }, $cUK: { su: 18, blk: -16 }, // (U, U 14F / U×3 low 17F / U×4 low 21F; U, ↓ + I a low launcher, U, ↓ + K a low)
       $cL: { su: 16, blk: -15 }, $cE: { su: 20, blk: -12 }, // U, U … U×4 / U×4, K (throw) / U, I / U, K
      $cl2: { su: 12, blk: -6 }, $clE: { su: 18, blk: -16 },
      kpPlate: { su: 16, blk: -6 }, kpCannon: { su: 20, blk: -16 }, kpPounce: { su: 22, blk: -16 }, kpFrenzy: { su: 20, blk: -16 },
      kpBubble: { su: 20, blk: -16 }, kpGeyser: { su: 24, blk: -15 }, kpRiptide: { su: 17, blk: -16 }, /* (the wall then takes a few frames to reach them: first hit at 24F up close) */
    },
    heavy: { // no kicks: the K button grabs and throws
      p: { label: 'Rending Claws', startup: 10, active: 5, recovery: 18, hitbox: [10,150,40,160], wind: 'kClawUp', pose: 'kClawX', lunge: [3, 9, 4.5], hitstop: 11, claw: [95, 110, 0.9, 70] },
      k: { label: 'Whirlpool Toss', grab: true, startup: 7, active: 3, recovery: 26, hitbox: [10,92,20,150], wind: 'kGrab', pose: 'kToss', dmg: 58, stun: 24, launch: true, launchVy: 13, hitstop: 12, gdrain: 0, onFrame: kappaToss },
    },
    normalLook: {
      sp0: { label: 'Claw Swipe', wind: 'kClawUp', pose: 'kClawDown', claw: [80, 100, 0.8, 44] },
      sp1: { label: 'Rending Claws', claw: [95, 110, 0.9, 70] },
      cp1: { label: 'Upward Rake', wind: 'kClawDown', pose: 'kClawUp', hitbox: [10,135,40,195], claw: [60, 140, -1.3, 70] },
      sk0: { label: 'Sumo Toss', grab: true, wind: 'kGrab', pose: 'kToss', hitbox: [10,92,20,150], startup: 6, recovery: 22, dmg: 46, kd: true, kdVx: 6, kdVy: 9, chain: null, low: false, onFrame: kappaToss },
      ck0: { label: 'Low Claw', wind: 'crouch', pose: 'kLowClaw', hitbox: [20,120,0,40], claw: [80, 30, 0.2, 40] },
      ck1: { label: 'Ankle Rake', wind: 'crouch', pose: 'kLowClaw', hitbox: [20,150,0,30], claw: [95, 24, 0.1, 54] },
      jk0: { label: 'Air Claw Drop', wind: 'jump', pose: 'kAirClaw', hitbox: [10,100,0,90], claw: [70, 70, 1.0, 50] },
      jp0: { label: 'Air Rake', wind: 'jump', pose: 'kAirClaw', claw: [70, 90, 0.8, 44] },
      jp1: { label: 'Air Rending Claws', wind: 'jump', pose: 'kClawDown', claw: [80, 80, 0.9, 60] },
      jk1: { label: 'Water Drop', wind: 'jump', pose: 'kAirClaw', hitbox: [0,110,-10,80], onFrame: (f, o, mf) => { if (mf === 6) spawnPJ(f, 'water', { x: f.x + f.facing * 30, y: f.y + 60, vx: f.facing * 6, vy: -8, life: 30, r: 12, h: { dmg: 26, stun: 18, bstun: 10, push: 2, gdrain: 6, label: 'Water Drop', juggle: true, jugVy: 5 } }); } },
    },
    colors: { skin: '#6fc27a', skinB: '#4f9a5a', belly: '#f3e7a4', shell: '#4f8a3d', shellB: '#35652a', beak: '#f2b134', plate: '#f4f7fb', water: '#8fd3f4', hair: '#2f5d2a', claw: '#f6f0dc' },
    meterCol: ['#3fb39a', '#b8f3ff'], bannerCol: 'rgba(40,150,130,.88)', idle: 'kIdle', chargePose: 'kEat', winPose: 'kWin', atkCD: 9, recoverT: 9, hitFx: 'claw',
  },
  gunman: {
    idle: 'gHolster', name: 'JESSE', title: 'Gunslinger', nameJa: 'ジェシー', titleJa: 'ガンマン', ammo: 15, dmgMul: 1.43, scale: 1.02, walk: 3.3, back: 2.9, jumpX: 4.4, jumpV: 17.5, jugDmg: 1.05,
    pDmg: 0.95, kDmg: 0.95, pReach: 1.0, kReach: 1.0, chargeRate: 0.6, auraCol: '255,210,140', fxCol: '255,230,160',
    sp: { fP: 'gnFan', fPH: 'gnQuick', fK: 'gnRoll', fKH: 'gnJumpShot', bP: 'gnDyna', bPH: 'gnDance', bK: 'gnBackflip', bKH: 'gnShowdown' }, sup: 'gnHighNoon',
    recPlus: 6, recRefund: true, // every attack recovers 6 frames slower on a miss or a guard; any hit that lands gives it back (see moveFrames)
    frames: { // 発生, 持続, 硬直 and 硬直差 on guard for each attack (see moveFrames)
      U: { su: 12, blk: -4 }, dU: { su: 12, blk: -4 }, J: { su: 10, blk: -4 }, dJ: { su: 10, blk: -4 },
      I: { su: 16, blk: -12, held: true }, K: { su: 18, blk: -14, held: true }, dI: { su: 16, blk: -16 }, dK: { su: 16, blk: -14 }, /* (held: his charge shots; the tap's start-up is its own) */
      $g2: { su: 12, blk: -6 }, $g3: { su: 15, blk: -6 }, $g4: { su: 18, blk: -6 }, $gF: { su: 18, blk: -18 }, $gL: { su: 16, blk: -16 }, $gE: { su: 20, blk: -12 }, // U, U … U×4 (12 / 15 / 18F) / U×4, K / U, I / U, K
      $gl2: { su: 12, blk: -6 }, $glE: { su: 18, blk: -16 },
      gnFan: { su: 20, blk: -16 }, gnQuick: { su: 12, blk: -8, held: true }, gnRoll: { su: 20, blk: -16 }, gnJumpShot: { su: 22, blk: -16 }, // (Quick Draw stays his fastest)
      gnDyna: { su: 21, blk: -16 }, gnDance: { su: 20, blk: -16 }, gnBackflip: { blk: -6 }, /* (the flip fires its shot at a fixed moment: 23F) */
    },
   heavy: { // no kicks: both heavies are gunshots at mid range
      p: { label: 'Twin Shot', held: true, tapStartup: 9, startup: 999, active: 2, recovery: 20, hitbox: null, wind: 'gAim', pose: 'gTwin', onFrame: twinCharge },
      k: { label: 'Heavy Shot', held: true, tapStartup: 13, startup: 999, active: 2, recovery: 24, hitbox: null, wind: 'gAim', pose: 'gRecoil', onFrame: heavyCharge },
    },
    normalLook: {
      sp0: { label: 'Hip Shot', startup: 4, wind: 'gIdle', pose: 'gAim', hitbox: null, chain: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { y: 118, dmg: 22, range: 270 }); } }, // (upper body: crouch and it passes over)
      cp0: { label: 'Low Shot', startup: 5, wind: 'crouch', pose: 'gLow', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { y: 44, dmg: 20, low: true, range: 280 }); } }, // (↓ + U: a low shot, at knee height)
      cp1: { label: 'Sky Shot', startup: 6, wind: 'gLow', pose: 'gUp', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { x: f.x + f.facing * 34, y: 84, vx: 16, vy: 8, life: 14, dmg: 34, launch: true, launchVy: 12, jugVy: 11 }); } },
      sk0: { label: 'Low Shot', startup: 5, wind: 'crouch', pose: 'gLow', crouch: true, hitbox: null, chain: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { y: 44, dmg: 22, low: true, range: 260 }); } }, // (he drops into a crouch and fires at knee height)
      ck0: { label: 'Crouch Shot', startup: 5, wind: 'crouch', pose: 'gLow', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { y: 44, dmg: 20, low: true, range: 290 }); } },
      ck1: { label: 'Ground Shot', startup: 8, wind: 'crouch', pose: 'gLow', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { y: 46, dmg: 36, low: true, kd: true, range: 310, big: true }); } },
      jp0: { label: 'Air Hip Shot', startup: 4, wind: 'jump', pose: 'gAirDown', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { x: f.x + f.facing * 40, y: f.y + 80, vy: -8, vx: 18, life: 18, dmg: 30 }); } },
      jp1: { label: 'Air Twin Shot', startup: 6, wind: 'jump', pose: 'gAirDown', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { shoot(f, { x: f.x + f.facing * 40, y: f.y + 84, vy: -9, vx: 16, life: 18, dmg: 34 }); shoot(f, { x: f.x + f.facing * 40, y: f.y + 70, vy: -12, vx: 13, life: 18, dmg: 34 }); } } },
      jk0: { label: 'Air Shot', startup: 4, wind: 'jump', pose: 'gAirDown', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) shoot(f, { x: f.x + f.facing * 40, y: f.y + 70, vy: -10, vx: 15, life: 20, dmg: 36 }); } },
      jk1: { label: 'Air Double Shot', startup: 6, wind: 'jump', pose: 'gAirDown', hitbox: null, onFrame: (f, o, mf) => { if (mf === f.move.startup) { shoot(f, { x: f.x + f.facing * 40, y: f.y + 70, vy: -10, vx: 15, life: 20, dmg: 33 }); shoot(f, { x: f.x + f.facing * 40, y: f.y + 60, vy: -14, vx: 11, life: 20, dmg: 33 }); } } },
    },
    colors: { hat: '#6b4a2b', hatB: '#4a321c', band: '#2b1d12', coat: '#8a6a4a', coatB: '#6b5038', shirt: '#d9cdb0', vest: '#3a2c22', pants: '#3a3f4a', pantsB: '#2a2e37', boots: '#4a2f1d', skin: '#e8bf98', hair: '#3a2a1a', gun: '#a8b0ba', grip: '#5a3a22', scarf: '#b8322d' },
    meterCol: ['#d98a2c', '#ffe0a8'], bannerCol: 'rgba(170,110,40,.9)', idle: 'gIdle', chargePose: 'gUp', winPose: 'gWin', atkCD: 10, recoverT: 10, hitFx: 'gun',
  },
  salary: {
    name: 'TANAKA', title: 'Salaryman', nameJa: '田中', titleJa: 'サラリーマン', autoBlock: true, dmgMul: 1.0, scale: 1.0, walk: 3.0, back: 2.7, jumpX: 4.2, jumpV: 17, jugDmg: 1.25,
    pDmg: 0.95, kDmg: 0.95, pReach: 1.05, kReach: 1.0, chargeRate: 0.6, auraCol: '200,205,220', fxCol: '235,235,245',
    sp: { fP: 'smCard', fPH: 'smCase', fK: 'smTackle', fKH: 'smUpper', bP: 'smCoffee', bPH: 'smAngel', bK: 'smBow', bKH: 'smDevil' }, sup: 'smDeadline',
    frames: { // 発生, 持続, 硬直 and 硬直差 on guard for each attack (see moveFrames)
      U: { su: 10, blk: -4 }, dU: { su: 10, blk: -4 }, J: { su: 10, blk: -4 }, dJ: { su: 10, blk: -4 },
      I: { su: 16, blk: -12 }, K: { su: 18, blk: -14 }, dI: { su: 16, blk: -16 }, dK: { su: 16, blk: -14 },
      $s2: { su: 12, blk: -6 }, $s3: { su: 12, blk: -6 }, $s4: { su: 12, blk: -6 }, $sF: { su: 18, blk: -18 }, $sL: { su: 16, blk: -13 }, $sE: { su: 20, blk: -12 }, // U, U … U×4 / U×4, K / U, I / U, K
      $sl2: { su: 12, blk: -6 }, $slE: { su: 18, blk: -16 },
      smCard: { su: 16, blk: -6 }, smCase: { su: 22, blk: -16 }, smTackle: { su: 20, blk: -16 }, smUpper: { su: 20, blk: -16 },
      smCoffee: { su: 20, blk: -16 }, smBow: { su: 20, blk: -16 },
      smSlide: { su: 20, blk: -16 }, smSpill: { su: 15, blk: -16 }, smSkid: { su: 16, blk: -6 }, // (the low versions: → → ↓ + J, ← ← ↓ + J, → → ↓ + K)
    },
    heavy: {
      p: { label: 'Briefcase Swing', startup: 11, active: 5, recovery: 19, hitbox: [10,150,40,160], wind: 'slamW', pose: 'sCase', lunge: [3, 9, 3.5], hitstop: 10, kd: true, kdVx: 8 },
      k: { label: 'Shove and Run', startup: 9, active: 4, recovery: 20, hitbox: [10,100,50,150], wind: 'crouch', pose: 'sShove', dmg: 32, push: 8, bpush: 7, onFrame: shoveRun },
    },
    colors: { suit: '#2f3542', suitB: '#232833', shirt: '#f2f2f2', tie: '#c0392b', skin: '#f1c9a5', hair: '#1c1c1c', shoe: '#141414', bag: '#5a3a1e', glasses: '#222831' },
    meterCol: ['#7f8fa6', '#dfe6f0'], bannerCol: 'rgba(90,100,120,.9)', idle: 'sIdle', chargePose: 'charge', winPose: 'win', atkCD: 10, recoverT: 10, hitFx: 'paper',
  },
});
CHARS.salary.lookKey = 'salary';
// each fighter's own heavy attack in the air (I while jumping)
const addLook = (ch, look) => { ch.normalLook = { ...(ch.normalLook || {}), ...look }; };
addLook(CHARS.ninja, { jp1: { label: 'Air Kunai Slash', pose: 'slash', blade: true, trail: { cx: 15, cy: 100, r: 75, a0: 70, a1: -40, col: '225,235,255' } },
  cp1: { hitbox: [12,125,50,165], startup: 9 }, // ↓ + I, the Uppercut Launcher: reaches about twice as far, and comes out a little sooner (15F → 14F)
  ck1: { hitbox: [20,150,0,30], cpLaunch: true, launchVy: 13 } }); // ↓ + K, the Sweep: reaches further, and like the Crescent Kick it launches on a counter or a punish (a juggle), knocking down otherwise
addLook(CHARS.brawler, { jp1: { label: 'Air Hammer Fist', pose: 'tHammer', burst: [70, 70], aura: true } });
addLook(CHARS.salary, { jp1: { label: 'Air Briefcase Drop', pose: 'sCase' }, jk1: { label: 'Air Briefcase Swing', pose: 'sCase' }, ck1: { label: 'Briefcase Trip', wind: 'crouch', pose: 'sCase', hitbox: [20,120,0,40] } });
for (const k in CHARS) CHARS[k].key = k;

// ---------- charge attacks (hold I) ----------
// (Tetsu's I is no longer held to charge)
// (Mei's I is no longer held to charge)
// (Lyra's I is no longer held to charge)
// (the kappa's I is no longer held to charge)
Object.assign(CHARS.salary, { spLow: { fK: 'smSlide', bK: 'smSpill', fKH: 'smSkid' } });
// Tanaka's forms pick the right version of ← ← + J by themselves (the ↑ / ↓ commands still work):
// the angel's ray goes up after someone in the air and down at someone crouching; the devil's tail comes down from overhead on someone crouching
const tCrouch = o => o.y <= 0 && (o.state === 'crouch' || (o.inp && o.inp.down && (o.state === 'guard' || o.state === 'blockstun')));
const angelAuto = (f, o, k) => k === 'bK' ? (inAir(o) || o.y > 40 ? 'saRayFly' : tCrouch(o) ? 'saRayLow' : null) : null;
const devilAuto = (f, o, k) => k === 'bK' && tCrouch(o) ? 'sdTailDrop' : null;
 // (himself; his angel and devil forms set their own)
// Tanaka throws whatever's in his office: a pen, the stapler, his coffee mug (himself only, not when possessed)
Object.assign(CHARS.salary, { normalLook: { ...(CHARS.salary.normalLook || {}),
  cp0: { label: 'Pen Throw', startup: 6, active: 2, recovery: 14, wind: 'crouch', pose: 'sShove', hitbox: null, crouch: true,
    onFrame: (f, o, mf) => { if (mf === f.move.startup) { sfx('throw'); spawnPJ(f, 'pen', { x: f.x + f.facing * 40, y: 62, vx: f.facing * 15, life: 40, r: 9, h: { dmg: 24, stun: 16, bstun: 8, push: 1.5, gdrain: 4, low: false, label: 'Pen Throw' } }); } } },
  ck0: { label: 'Stapler Toss', startup: 9, active: 2, recovery: 16, wind: 'crouch', pose: 'sCase', hitbox: null, crouch: true, midHit: true, /* (↓ + J, but the stapler flies at body height) */
    onFrame: (f, o, mf) => { if (mf === f.move.startup) { sfx('throw'); spawnPJ(f, 'stapler', { x: f.x + f.facing * 36, y: 80, vx: f.facing * 8.5, vy: 6.5, g: 0.42, life: 70, r: 12, h: { dmg: 34, stun: 18, bstun: 10, push: 2, gdrain: 6, label: 'Stapler Toss' } }); } } },
  jp1: { label: 'Mug Drop', startup: 8, active: 2, recovery: 14, wind: 'jump', pose: 'sCase', hitbox: null,
    onFrame: (f, o, mf) => { if (mf === f.move.startup) { sfx('throw'); spawnPJ(f, 'mug', { x: f.x + f.facing * 30, y: f.y + 100, vx: f.facing * 7, vy: -7, life: 50, r: 14, h: { dmg: 64, stun: 24, bstun: 12, push: 2, gdrain: 10, overhead: true, label: 'Mug Drop' } }); } } }, // (a heavy mug: an overhead)
} });
// the salaryman's two possessed forms: the same body, a different move set (and look) until the timer runs out
const ANGEL_CH = { ...CHARS.salary, spLow: { bK: 'saRayLow' }, spUp: { bK: 'saRayFly' }, spFwd: { bK: 'saDive' }, possess: 'angel', dmgMul: 1.15, regen: 0.08, lookKey: 'salaryAngel', idle: 'saPray', hover: false, doubleJump: true, pDmg: 1.1, kDmg: 1.1, walk: 3.5, auraCol: '255,235,170', fxCol: '255,240,190', hitFx: 'holy', meterCol: ['#e6b84a', '#fff4c8'],
  sp: { fP: 'saJab', fPH: 'saFist', fK: 'saGlide', fKH: 'saAscend', bP: 'saBless', bPH: 'saWard', bK: 'saRay', bKH: 'smDevil' }, sup: 'saHeaven',
  heavy: { p: { label: 'Holy Palm', startup: 10, active: 5, recovery: 18, hitbox: [10,150,50,150], wind: 'palmW', pose: 'palm', lunge: [3, 9, 3.5], hitstop: 10, cpLaunch: true, launchVy: 13, burst: [90, 110] },
           k: { label: 'Wing Kick', startup: 9, active: 5, recovery: 18, hitbox: [10,150,40,150], wind: 'kickW', pose: 'highKick', lunge: [3, 8, 4], cpLaunch: true, launchVy: 12 } } };
const DOUBLE_CH_BASE = 1;
const DEVIL_CH = { ...CHARS.salary, spLow: { fK: 'sdCrawl', bK: 'sdTail', fKH: 'sdTrail' }, spUp: { bK: 'sdTailDrop' }, spFwd: { bK: 'sdChainB' }, possess: 'devil', dmgMul: 2.0, drain: 0.45, lookKey: 'salaryDevil', idle: 'sdIdle', walk: 3.9, back: 3.4, fastAtk: true, crouchPose: 'sdIdle', pDmg: 0.95, kDmg: 0.95, auraCol: '255,90,70', fxCol: '255,120,60', hitFx: 'flame', meterCol: ['#b8322d', '#ffb08a'],
  sp: { fP: 'sdLunge', fPH: 'sdMaul', fK: 'sdTailLash', fKH: 'sdTailUpper', bP: 'sdBeckon', bPH: 'smAngel', bK: 'sdWhip', bKH: 'sdDrain' }, sup: 'sdInferno',
  heavy: { p: { label: 'Hellclaw', startup: 10, active: 6, recovery: 18, hitbox: [10,160,40,170], wind: 'palmW', pose: 'kClaw', lunge: [3, 9, 4], hitstop: 11, kd: true, kdVx: 9 },
           k: { label: 'Demon Kick', startup: 10, active: 5, recovery: 18, hitbox: [10,150,30,130], wind: 'kickW', pose: 'highKick', lunge: [3, 8, 4], cpLaunch: true, launchVy: 12 } } };
// frames for the possessed forms (see moveFrames): the angel's strings and techniques, the devil's (two frames quicker: he is the faster of the two), and both for the double possession
const ANGEL_FRAMES = { ...CHARS.salary.frames,
  $a2: { su: 12, blk: -6 }, $a3: { su: 12, blk: -6 }, $a4: { su: 12, blk: -6 }, $aF: { su: 18, blk: -18 }, $aL: { su: 16, blk: -15 }, $aE: { su: 20, blk: -12 }, $al2: { su: 12, blk: -6 }, $alE: { su: 18, blk: -16 },
  saJab: { su: 12, blk: -6 }, saFist: { su: 20, blk: -16 }, saGlide: { su: 22, blk: -16 }, saAscend: { su: 22, blk: -16 }, saRay: { su: 24, blk: -16 }, saRayLow: { su: 24, blk: -16 }, saRayFly: { su: 24, blk: -15 }, saDive: { su: 24, blk: -16 } };
const DEVIL_FRAMES = { ...CHARS.salary.frames,
  $d2: { su: 10, blk: -6 }, $d3: { su: 10, blk: -6 }, $d4: { su: 10, blk: -6 }, $dF: { su: 16, blk: -18 }, $dL: { su: 14, blk: -16 }, $dE: { su: 18, blk: -12 }, $dl2: { su: 10, blk: -6 }, $dlE: { su: 16, blk: -16 },
  sdLunge: { su: 20, blk: -16 }, sdMaul: { su: 20, blk: -16 }, sdTailLash: { su: 20, blk: -16 }, sdTailUpper: { su: 20, blk: -16 }, sdWhip: { su: 20, blk: -16 }, sdCrawl: { su: 20, blk: -16 }, sdTail: { su: 18, blk: -14 }, sdTailDrop: { su: 22, blk: -16 }, sdChainB: { su: 20, blk: -16 }, sdTrail: { su: 20, blk: -16 }, sdDrain: { su: 24 } };
Object.assign(ANGEL_CH, { frames: ANGEL_FRAMES }); Object.assign(DEVIL_CH, { frames: DEVIL_FRAMES });
const DOUBLE_CH = { ...DEVIL_CH, possess: 'double', lookKey: 'salaryDevil', dmgMul: 2.1, drain: 2.2, scale: 1.4, tallBox: true, armorAll: true, /* (both spirits in him: far bigger, and nothing short of a super or a throw stops him) */ regen: 0, noGuard: true, doubleJump: true, auraCol: '255,170,200', fxCol: '255,190,160', meterCol: ['#d0607a', '#ffe0c0'], // angel and devil both: wings and halo, horns and tail
  sp: { fP: 'saJab', fPH: 'sdMaul', fK: 'sdTailLash', fKH: 'sdTailUpper', bP: 'sdBeckon', bPH: 'saFist', bK: 'saRay', bKH: 'sdDrain' },
  spLow: { bK: 'saRayLow', fK: 'sdCrawl', fKH: 'sdTrail' }, spUp: { bK: 'saRayFly' }, spFwd: { bK: 'sdChainB' } };
DOUBLE_CH.frames = { ...ANGEL_FRAMES, ...DEVIL_FRAMES }; /* (both spirits' strings and techniques) */
Object.assign(ANGEL_CH, { spAuto: angelAuto }); Object.assign(DEVIL_CH, { spAuto: devilAuto }); Object.assign(DOUBLE_CH, { spAuto: (f, o, k) => angelAuto(f, o, k) || devilAuto(f, o, k) });
Object.assign(DEVIL_CH, { normalLook: { // the devil's kicks are all tail now, and reach further
  sk0: { label: 'Tail Flick', low: false, wind: 'sdIdle', pose: 'sdIdle', hitbox: [30,165,60,130], tail: { a0: 2.4, a1: 0.1, len: 150, h: 95 } },
  sk1: { label: 'Tail Crack', low: false, wind: 'sdIdle', pose: 'sdIdle', hitbox: [30,200,50,140], tail: { a0: 2.8, a1: -0.1, len: 180, h: 100 } },
  ck0: { label: 'Low Tail Flick', wind: 'sdIdle', pose: 'sdIdle', hitbox: [30,160,0,44], low: true, tail: { a0: 2.9, a1: -0.25, len: 150, h: 40 } },
  ck1: { label: 'Tail Trip', wind: 'sdIdle', pose: 'sdIdle', hitbox: [30,190,0,40], low: true, kd: true, tail: { a0: 3.0, a1: -0.3, len: 180, h: 36 } },
} });
ANGEL_CH.normalLook = { ...(CHARS.salary.normalLook || {}), jp1: { label: 'Air Light Fist', pose: 'blast', burst: [80, 90] }, sp0: { label: 'Light Jab', burst: [70, 120] }, ck1: { label: 'Feather Sweep', wind: 'crouch', pose: 'slideKick', hitbox: [20,120,0,34] }, jk1: { label: 'Air Wing Kick', pose: 'roundhouse' } };
DEVIL_CH.normalLook = { ...(CHARS.salary.normalLook || {}), ...(DEVIL_CH.normalLook || {}), jp1: { label: 'Air Hellclaw', pose: 'kClawDown', claw: [80, 80, 0.9, 60, '255,120,90'] }, sp0: { label: 'Devil Swipe', pose: 'kClawDown', claw: [70, 100, 0.8, 40, '255,120,90'] }, ck1: { label: 'Tail Sweep', wind: 'crouch', pose: 'slideKick', hitbox: [20,130,0,34] }, jk1: { label: 'Air Tail Lash', pose: 'roundhouse' } };
DOUBLE_CH.normalLook = DEVIL_CH.normalLook; // (double possession fights with the devil's claws and tail too: it was copied from the devil before these were set)
// second palette, used when both online players pick the same fighter
CHARS.gunman.idle = 'gHolster'; CHARS.gunman.crouchPose = CHARS.gunman.crouchPose || 'crouch'; // Jesse stands with his hands resting on the holstered guns
Object.assign(CHARS.kappa, { altColors: { ...CHARS.kappa.colors, skin: '#7fb6e6', skinB: '#5a8fc0', shell: '#3d5f8a', shellB: '#2a4466', hair: '#24456b' } });
Object.assign(CHARS.gunman, { altColors: { ...CHARS.gunman.colors, hat: '#2b2b2b', hatB: '#1a1a1a', coat: '#3a3a42', coatB: '#2a2a30', scarf: '#2a6bb8', vest: '#5a1f1f' } });
Object.assign(CHARS.salary, { altColors: { ...CHARS.salary.colors, suit: '#7a5a3a', suitB: '#5c4229', tie: '#2a6bb8', shirt: '#e6eeff', bag: '#2b2b33' } });
Object.assign(CHARS.paladin, { altColors: { ...CHARS.paladin.colors, plate: '#585e6c', plateB: '#3f4450', plateD: '#2a2e37', tabard: '#2b2b33', tabardB: '#1e1e24', cross: '#a33232', cape: '#6e1f24', capeB: '#4a1418', shield: '#7a1f24', shieldB: '#4a1418', trim: '#c9ced8', trimB: '#8d939e', plume: '#e8e8e8' } });
Object.assign(CHARS.ninja, { altColors: { ...CHARS.ninja.colors, cloth: '#5a2232', back: '#3b1521', dark: '#250c15', wrap: '#8c4456', glove: '#1d0a11', accent: '#f2c14e', metal: '#b9a58a' } });
Object.assign(CHARS.brawler, { altColors: { ...CHARS.brawler.colors, vest: '#8c2f3e', vestB: '#66202c', pants: '#2b3652', pantsB: '#1c2439', band: '#2a5290', sash: '#e0a526', bead: '#2a3f6a' } });
Object.assign(CHARS.staff, { altColors: { ...CHARS.staff.colors, jacket: '#2f6dcc', jacketB: '#214e96', trim: '#f4f1ea', cap: '#f4f1ea', pants: '#2c2430', pantsB: '#1d171f' } });
Object.assign(CHARS.psychic, { altColors: { ...CHARS.psychic.colors, robe: '#1f5a70', robeB: '#133b4a', trim: '#c6f0f6', sash: '#36b4cc', gem: '#7ae6ff', hair: '#3a2a4e', hairB: '#261b35' } });
// afterimages, tinted per fighter
const GHOST_TINT = Object.fromEntries([['ninja', '#8a6be0'], ['brawler', '#5fd6ef'], ['staff', '#ffd27a'], ['psychic', '#ff9be8'], ['paladin', '#bfe0ff'], ['kappa', '#9ff0d8'], ['gunman', '#ffd9a0'], ['salary', '#d8dde8']].map(([k, c]) => [k, new Proxy({}, { get: () => c })]));
const DEMO_VS = { ninja: 'brawler', brawler: 'ninja', staff: 'brawler', psychic: 'ninja', paladin: 'ninja', kappa: 'ninja', gunman: 'ninja', salary: 'ninja' }; // who each fighter's sample combos are played against
const SHADOW_TINT = { cloth: '#4a3577', back: '#33255a', dark: '#22183d', wrap: '#6e58a8', glove: '#22183d', accent: '#9d7cf0', skin: '#b7a6ec' };
const FLASH = new Proxy({}, { get: () => '#ffffff' });

