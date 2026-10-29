'use strict';
/* ================= game state ================= */
const CHAR_ORDER = ['ninja', 'brawler', 'staff', 'psychic', 'paladin', 'kappa', 'gunman', 'salary'];
const L = (en, ja) => game.lang === 'ja' ? ja : en; // English or Japanese
const nm = ch => game.lang === 'ja' ? ch.nameJa : ch.name;
const JA_POP = { 'TOSS!': '投げ！', 'AEGIS': 'イージス', 'NO MP': 'MP不足', 'BRAND': '烙印', 'DEFLECT!': '弾いた！', 'SHIELD': '盾', 'LAUNCH!': '打ち上げ！', 'BOUNCE!': 'バウンド！', 'COUNTER!': 'カウンター！', 'COUNTER LAUNCH!': 'カウンター打ち上げ！', 'PUNISH!': '確定反撃！',
  'GUARD BREAK!': 'ガードブレイク！', 'STUNNED!': '気絶！', 'INTERRUPTED!': '中断！', 'LIFT LIMIT': '打ち上げ上限', 'BOUNCE LIMIT': 'バウンド上限', 'GROUND HIT': 'ダウン追い打ち', 'PARRY!': '受け流し！',
  'ARMOR': 'アーマー', 'PASS': 'すり抜け', 'REFLECT!': '反射！', 'CLONE BROKEN': '分身破壊', 'DECOY!': '身代わり！', 'COUNTER VANISH!': 'カウンター消失！',
  '3 STRONG ORBS': '強オーブ×3', '5 LONG ORBS': '長オーブ×5', 'RAY': '光線', 'BARRIER': 'バリア' };
const JA_SUPER = { 'ANGEL POSSESSION!': '天使憑依！', 'DEVIL POSSESSION!': '悪魔憑依！', 'GREAT FLOOD': '大洪水', 'HIGH NOON': '真昼の決闘', 'DEADLINE RUSH': '締め切りラッシュ', "HEAVEN'S GATE": '天国の門', 'INFERNAL CONTRACT': '地獄の契約', 'SANCTUARY': '聖域', 'HOLY JUDGEMENT': '聖なる審判', 'SHADOW ARMY': '影分身・軍勢', 'GREAT QI CANNON': '大気功砲', 'GREAT SAGE PILLAR': '斉天大聖の柱', 'CRYSTAL STORM': '水晶の嵐' };
const game = { mode: 'menu', paused: false, vsCPU: true, p1Char: 'ninja', p2Char: 'brawler', lang: (() => { try { return localStorage.getItem('sq-lang') || 'ja'; } catch (e) { return 'ja'; } })(), diff: (() => { try { return localStorage.getItem('sq-diff') || 'medium'; } catch (e) { return 'medium'; } })(), round: 1, phase: 'intro', phaseT: 0, timer: 99 * 60,
  frame: 0, freeze: 0, slow: 0, shake: 0, combo: null, superFlash: null, roundWinner: null,
  training: false, watch: false, dummyMode: 'stand', mpFull: true, track: null, advInfo: null,
  heights: (() => { try { return localStorage.getItem('sq-heights') !== '0'; } catch (e) { return true; } })(), // training: show each attack's height
  autoGuard: (() => { try { return localStorage.getItem('sq-autoguard') !== '0'; } catch (e) { return true; } })() }; // the player guards by himself (Settings)
let fighters = [];
const projs = [], parts = [];
// mirror matches: the second fighter (the one in the second palette) has its effects — sparks, auras, projectiles, spells — drawn in another hue,
// so you can always tell whose they are. Particles are tagged with whoever was acting when they were made
const ALT_HUE = 165; // (how far round the colour wheel the second fighter's effects are turned)
let FX_OWNER = null;
const altCache = new Map();
function altCol(col) { // a particle colour 'r,g,b' turned round the colour wheel, once, when the particle is made (filtering while drawing is far too slow)
  if (typeof col !== 'string' || !/^\d+,\d+,\d+$/.test(col)) return col; if (altCache.has(col)) return altCache.get(col);
  const [r, g, b] = col.split(',').map(Number), a = ALT_HUE * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const m = [0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928, 0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.140, 0.072 - c * 0.072 - s * 0.283, 0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072];
  const k = v => Math.max(0, Math.min(255, Math.round(v))), out = `${k(m[0] * r + m[1] * g + m[2] * b)},${k(m[3] * r + m[4] * g + m[5] * b)},${k(m[6] * r + m[7] * g + m[8] * b)}`;
  altCache.set(col, out); return out;
}
{ const push = parts.push; parts.push = function (...xs) { if (FX_OWNER && FX_OWNER.alt) for (const x of xs) if (x && x.alt == null && !x.text) { x.alt = true; if (x.col) x.col = altCol(x.col); } return push.apply(this, xs); }; } // (words keep their colours)
const other = f => fighters[0] === f ? fighters[1] : fighters[0];

function makeFighter(key, side, ctrl) { return { key, ch: CHARS[key], side, ctrl, wins: 0, meter: 0 }; }
function resetFighter(f) {
  Object.assign(f, {
    x: f.side === 0 ? 300 : 660, y: 0, vx: 0, vy: 0, facing: f.side === 0 ? 1 : -1, hp: 1000, dispHp: 1000,
    state: 'stand', st: 0, move: null, mf: 0, str: 0, hitCount: 0, lastHitMf: -99, hitConnected: false,
    airAttacked: false, airShuri: false, invul: 0, stun: 0, combo: 0, flash: 0, inp: EMPTY, hidden: false, landT: 0,
    ko: false, cguard: false, crouchHit: false, backHeld: false, walkPh: 0, pose: { ...POSES.idle }, prevPose: { ...POSES.idle },
    hipUp: null, serial: 0, jumpSerial: 0, guard: 100, guardIdle: 0, lastToward: 0, sideT: -99, calm: 0,
    shadow: false, followQ: null, lastResult: null, shadowRun: false, atkCD: 0, resting: 0, ammo: f.ch.ammo || 0, reloadT: 0,
  });
  f.golem = f.key === 'alchemist' ? newGolem(f) : null; // (the alchemist's stone golem, standing behind him)
  if (f.ctrl.reset) f.ctrl.reset();
}
function setState(f, s) {
  f.state = s; f.st = 0;
  if (s !== 'knock') { f.jugSpent = false; f.airT = 0; } // back on the floor (or hit out of it): a new juggle can start
  if (s === 'stand' || s === 'crouch') f.stunUsed = false;
  if (s === 'stand' || s === 'crouch' || s === 'down') { f.ups = 0; f.bounces = 0; f.rises = ''; f.extendBonus = 0; } // the combo is over: lifts and bounces start counting again
}
// each combo can lift the opponent up twice (a launch, a relaunch or a bounce); the third one barely raises them
// The only ways a combo can lift (L) and bounce (B) them, each followed by a finisher:
//   L L,  L L B,  L B,  L B L,  B B,  B L   (and the start of any of these)
// Anything else (a third lift, B L L, L B B, B B L...) and they drop out of the combo, untouchable until they land.
const RISE_PATTERNS = ['LLB', 'LBL', 'BB', 'BL'];
const AIR_MAX = 300; // frames (5 seconds) a juggle can keep them in the air
function loopGuardTick(f) { // the endless-loop guard (counted on every frame of the fight, hit-stop included, so it's real time): anyone held in hit-stun, stun or a juggle for 4.5 seconds in a row can't be hit again until they've been free a moment
    const stuck = ['hitstun', 'knock', 'stunned', 'slashed', 'dizzy'].includes(f.state);
    if (stuck) { f.stuckT = (f.stuckT || 0) + 1; f.freeT = 0; if (f.stuckT === LOOP_MAX && !f.loopGuard) { f.loopGuard = 1; if (f.state === 'knock') { f.juggle = false; f.jugSpent = true; } popText(f.x, GROUND - f.y - 205, L('COMBO BREAK', 'コンボ終了'), '205,205,220'); } }
    else { f.freeT = (f.freeT || 0) + 1; if (f.freeT >= 12) { f.stuckT = 0; if (f.loopGuard) f.loopGuard = 0; } else if (f.loopGuard) f.loopGuard = 1; }
  }
const DIVE_STRIKE = { ninja: 'Kunai Dive', brawler: 'Meteor Elbow', staff: 'Staff Pogo Strike', psychic: 'Crystal Dive', paladin: 'Shield Dive', kappa: 'Claw Dive', gunman: 'Rain of Lead', salary: 'Briefcase Drop', salaryAngel: 'Feather Dive', salaryDevil: 'Hellfire Drop' }; // ↓ + U in the air
const CEILING = 340; // the highest anyone can go (their head stays on screen)
const LOOP_MAX = 270; // frames (4.5 seconds) anyone can be kept stuck in one combo, on the ground or in the air
const RISE_OK = new Set(RISE_PATTERNS.flatMap(p => [...p].map((_, i) => p.slice(0, i + 1))));
function registerRise(d, kind, a) {
  const seq = (d.rises || '') + kind;
  if (kind === 'L') d.ups = (d.ups || 0) + 1; else d.bounces = (d.bounces || 0) + 1;
  if (RISE_OK.has(seq)) { if (seq.length === 2 && (d.rises || '').length === 1) d.extendBonus = EXTEND_BONUS; d.rises = seq; d.liftT = globalT; return false; } // (the second lift or bounce: the combo earns its extension bonus) // (every lift or bounce within the rules restarts the hold timer)
  popText(d.x, GROUND - d.y - 200, kind === 'L' ? 'LIFT LIMIT' : 'BOUNCE LIMIT', '205,205,220'); d.jugSpent = true;
  return true;
}
const registerUp = (d, a) => registerRise(d, 'L', a);
const registerBounce = d => registerRise(d, 'B');
function pjHitFX(p, tgt) {
  const x = tgt.x, y = GROUND - tgt.y - 40;
  if (p.type === 'puddle') { popText(x, GROUND - 190, L('SLIP!', 'ツルッ！'), '200,150,90'); for (let i = 0; i < 10; i++) parts.push({ type: 'aura', x: x + vrnd(-30, 30), y: GROUND - 6, vx: vrnd(-3, 3), vy: -vrnd(2, 6), life: 18, max: 18, r: 3.5, col: '120,75,40' }); } // coffee everywhere
  if (p.type === 'skidcase') { popText(x, GROUND - 190, L('PAPERWORK!', '書類地獄！'), '240,240,240'); for (let i = 0; i < 14; i++) parts.push({ type: 'paper', x, y: y - 20, vx: vrnd(-4, 4), vy: -vrnd(2, 7), rot: vrnd(0, 6), vr: vrnd(-0.3, 0.3), life: 50, max: 50, col: '245,245,240' }); } // the case bursts open: papers flutter everywhere
  if (p.type === 'brimstone') { parts.push({ type: 'ring', x, y: GROUND - 10, r: 10, vr: 7, life: 14, max: 14, col: '255,120,40' }); for (let i = 0; i < 8; i++) parts.push({ type: 'aura', x: x + vrnd(-20, 20), y: GROUND - 10, vx: 0, vy: -vrnd(3, 7), life: 20, max: 20, r: vrnd(6, 10), col: '255,140,50' }); } // a pillar of hellfire
}
function countProj(f, type) { let n = 0; for (const p of projs) if (p.owner === f && p.type === type && !p.dead) n++; return n; }

// Punch + Kick = super; → → + Punch / Kick and ↓ + Punch = specials (Kuro's light and heavy buttons give different moves)
// an opponent in the air: launched into a juggle, or jumping / attacking from a jump
const inAir = o => (o.state === 'knock' && o.juggle) || ((o.state === 'jump' || o.state === 'attack') && o.y > 25);
function resolveSpecial(f, o, inp) {
  if (!inp.btn) return null;
  if (inp.fuse && f.ch.fuseSp && f.fuseG >= 100) return f.ch.fuseSp; // ← → + J + K with his fusion gauge full (Hohen's golem armour)
  if (inp.bf && f.ch.spBF && f.ch.spBF[inp.btn]) return f.ch.spBF[inp.btn]; // ← → + a button (Kuro's Moon Tempests)
  if (inp.sup && f.meter >= 100) return f.ch.sup;
  const isP = inp.btn[1] === 'p', heavy = inp.btn[0] === 'h';
  if (inp.ff || inp.bb) {
    const k = (inp.ff ? 'f' : 'b') + (isP ? 'P' : 'K'), sid = (heavy && f.ch.sp[k + 'H']) || f.ch.sp[k] || null;
    const tw = Math.sign(o.x - f.x) || f.facing;
    if (inp.up && f.y <= 0 && f.ch.spUp) { const uid = (heavy && f.ch.spUp[k + 'H']) || f.ch.spUp[k]; if (uid) return uid; } // (an up version: hold ↑ with the technique)
    if (inp.bb && Math.sign(inp.h || 0) === tw && f.ch.spFwd) { const fid = (heavy && f.ch.spFwd[k + 'H']) || f.ch.spFwd[k]; if (fid) return fid; } // (← ← → + button: a forward version)
    if (f.ch.spAuto) { const aid = f.ch.spAuto(f, o, k, heavy, inp); if (aid) return aid; } // (Tanaka's forms: the right version comes out by itself)
    if (inp.down && f.y <= 0 && !inAir(o) && f.ch.spLow) { const lid = (heavy && f.ch.spLow[k + 'H']) || f.ch.spLow[k]; if (lid) return lid; } // (a low version: hold ↓ with the technique)
    // rising version: automatic against an opponent in the air, or on demand by holding ↓ with the button
    return (sid && JUGGLE_SP[sid] && f.y <= 0 && ((inp.down && !f.ch.noLowSp) || inAir(o))) ? JUGGLE_SP[sid] : sid;
  }
  if (inp.down && isP && heavy) return f.ch.sp.dP || null; // ↓ + I
  return null;
}
function startMove(f, mv, str, keepBuffer) {
  f.prevPose = { ...f.pose };
  f.move = mv; f.mf = 0; f.str = str; f.hitCount = 0; f.lastHitMf = -99; f.hitConnected = false; f.serial = ++serial; f.armorHits = 0;
  f.shadow = false; f.followQ = null; f.lastResult = null; f.chainQ = null; f.shadowRun = false;
  if (f.ctrl.consume && !keepBuffer) f.ctrl.consume();
  setState(f, 'attack');
  if (f.y <= 0 && !mv.selfMove) f.vx = 0;
  if (mv.super) { f.meter = 0; game.superFlash = { f, name: mv.name, t: SUPER_CUT, max: SUPER_CUT }; sfx('super');
    for (let i = 0; i < 16; i++) { const an = i * Math.PI / 8; parts.push({ type: 'speed', x: f.x + Math.cos(an) * 30, y: GROUND - f.y - 90 + Math.sin(an) * 30, vx: Math.cos(an) * 9, vy: Math.sin(an) * 9, life: 12, max: 12, col: f.ch.fxCol }); } }
  else if (!mv.normal) f.meter = Math.min(100, f.meter + 3); // ...and using techniques
  if (mv.normal) sfx('swing');
  if (f.sorbs) orbAssist(f, mv);
  if (mv.rushTag) f.rushN = mv.rushOpen ? 0 : (f.rushN || 0) + 1;
  if (mv.jug) { const oj = other(f); if (oj && Math.abs(oj.x - f.x) > 6) f.facing = Math.sign(oj.x - f.x); } // (a juggle attack turns to face them: a juggle can carry them over to the other side)
  f.pre = mv.pre || 0; // frames spent gathering qi before the technique itself starts
  if (mv.super) { const dg = SUPER_DODGE[mv.id], oc = other(f), caught = oc && ['hitstun', 'knock', 'stunned', 'down', 'getup', 'slashed', 'gbreak'].includes(oc.state); mv.dodge = caught ? null : dg; if (!caught && (dg === 'jump' || dg === 'dash')) { const sp = Math.round(SUPER_PRE * (f.ch.superPreMul || 1)); f.pre += sp; mv.superPre = sp; } f.invul = Math.max(f.invul || 0, f.pre + mv.startup + 6); } // (invincible all the way through the wind-up) // (in a combo it comes straight out: they can't get away anyway)
  const ksg = f.key === 'ninja' && (KURO_SIGNS[mv.id] || KURO_SPIRIT_LABEL[mv.label]);
  if (ksg) f.spirit = { sg: ksg, t0: game.frame, rise: mv.tellPre ? Math.min(12, mv.tellPre) : 6, hold: (mv.tellPre || 0) + 40, x: f.x - f.facing * 12, y: GROUND - f.y - 125 * f.ch.scale, dir: f.facing, hy: GROUND - f.y - 236 * f.ch.scale }; // the seal's spirit: it rises where he cast it and stays there a while, then fades slowly
  if (f.key === 'gunman' && !(f.gunOutT > 0)) for (const sd of [1, -1]) parts.push({ type: 'star', x: f.x + f.facing * sd * 14, y: GROUND - f.y - 92 * f.ch.scale, r: 8, vr: 1.4, life: 6, max: 6, col: '255,240,190', rot: 0.4 }); // the quick draw: a glint as the guns leave the holsters
  f.lastMoveTech = !mv.normal && !mv.super && !mv.noGuardLag; f.lastTechTier = f.lastMoveTech ? techTier(mv) : null; // (a guarded technique leaves him open: see techGuardLag)
  // every heavy attack gets a readable wind-up: at least 6 frames of early motion before it can hit (fast heavies gain a few frames)
  // every attack gets a wind-up animation before it can hit (frames are added where the move was quicker than that):
  // heavy buttons 12 frames, techniques 10, combo finishers and heavy string hits 9, everything else (jabs, string and juggle hits, air attacks, throws) 6
  if (mv.startup < 900 && !mv.held && !mv.parry && !mv.super && !mv.barrier && !mv.aegis && !(mv.startup <= 3 && mv.active >= 14) && !mv.antiDone) {
    mv.antiDone = true;
    const heavy = mv.str === 1 || str === 1, tier = !mv.normal ? techTier(mv) : null; mv.tier = tier;
    const want = !mv.normal ? (tier === 'fast' ? 6 : 10) : mv.air ? 6 : heavy && !mv.inString && !mv.jug ? 12 : heavy ? 9 : 6; // (attacks in the air: 6, there's only so long before landing)
    const oc = other(f), inCombo = oc && ['hitstun', 'knock', 'stunned', 'down', 'getup', 'slashed', 'gbreak'].includes(oc.state); // (inside a combo the technique comes out straight away: the tell is for neutral)
    if (tier && tier !== 'fast' && f.y <= 0 && !NO_TELL.has(mv.id) && !inCombo) { const tell = Math.max(0, TELL[tier] - (mv.pre || 0)); if (tell) { f.pre += tell; mv.tellPre = tell; } } // the tell: hand signs, a twirl, a wind-up…
    const need = want - (mv.startup - strikeFrames(mv.startup)) - (f.pre - (mv.tellPre || 0));
    if (need > 0) { f.pre += need; mv.antiPre = need; }
    mv.preTotal = f.pre;
    mv.windW = heavy || !mv.normal ? 1 : 0.55; // a jab winds up smaller than a heavy blow
  }
  const FM = f.ch.frameMod; // a fighter's own frame tuning: how much quicker his attacks come out, how much longer they stay out and how much longer he recovers
  if (FM && !mv.super && !mv.air && !mv.jug && !mv.fixedFrames && mv.startup < 900 && !mv.fmDone) { // (fixedFrames: a string hit with its own hand-set frames) // (not supers, air attacks or juggle hits: combos keep their timing)
    mv.fmDone = true; const cls = !mv.normal ? 'tech' : (mv.str === 1 || mv.launch) ? 'heavy' : 'light';
    if (cls === 'tech') { if (mv.tellPre) { const cut = Math.round(mv.tellPre * (1 - FM.tell)); f.pre -= cut; mv.tellPre -= cut; } } // (shorter hand signs)
    else { const cut = Math.min(FM.su[cls] + (mv.suCut || 0), Math.max(0, (mv.antiPre || 0) - 1)); f.pre -= cut; if (mv.antiPre) mv.antiPre -= cut; } // (a shorter wind-up: the move's own frames are untouched; suCut: a move's own extra)
    if (mv.preTotal != null) mv.preTotal = f.pre;
    if (mv.active < 60) mv.active += FM.act;
    if (mv.recovery < 90 && !mv.noFmRec) { mv.recovery += FM.rec[cls]; mv.fmRec = FM.rec[cls]; } // (normals: hit and block stun grow with it, so only a miss costs more; techniques: see checkHits)
  }
  if (f.ch.fastAtk && mv.normal && !mv.fastDone && mv.startup < 900) { mv.fastDone = true; mv.startup = Math.max(3, mv.startup - 2); mv.recovery = Math.max(4, Math.round(mv.recovery * 0.8)); } // the devil: wild and fast
  if (mv.held && f.inp) { if (!mv.holdBtn) mv.holdBtn = f.inp.btn; if (f.inp.holdFor && mv.holdFor == null) mv.holdFor = f.inp.holdFor; }
  moveFrames(f, mv); // (before onStart: with no wind-up left it starts right away)
  if (f.pre) sfx('charge');
  else if (mv.onStart) mv.onStart(f, other(f));
  mv.t0 = game.frame; // (when it started: its 発生 decides whether someone in a combo can guard it — GUARD_BACK)
  mv.speedUp = mv.speedUp || (!mv.super && f.ch.techSpeed && f.ch.techSpeed[mv.id]) || 0; f.spdAcc = 0; // (or already set by the fighter's frame table: moveFrames) // (a fighter's techniques sped up to their own 発生: techSpeed)
  if (f.ch.techDelay && f.ch.techDelay[mv.id] && !mv.delayed) { mv.delayed = true; f.pre += f.ch.techDelay[mv.id]; } // (…or slowed down: techDelay)
  fdStart(f, mv);
}
// a fighter's own frames for each of his attacks (ch.frames): keyed by technique id, for ground buttons U I J K (dU dI dJ dK crouching), or $ and the string hit's key ($t2…).
// su: 発生 (the lead-up plays faster, or waits longer, to reach it), act: 持続, rec: 硬直, blk: 硬直差 when guarded, set: anything else about the move
const NORMAL_KEY = { p0: 'U', p1: 'I', k0: 'J', k1: 'K' };
function moveFrames(f, mv) {
  const T = f.ch.frames; if (!T || mv.framesDone || mv.super || mv.air || mv.jug || mv.startup >= 900) return;
  const e = T[mv.inString ? '$' + mv.strKey : mv.normal ? (mv.stance === 'c' ? 'd' : '') + NORMAL_KEY[mv.kind + mv.str] : mv.id]; if (!e) return; // (a string hit: $ and its key, $t2, $tF…)
  mv.framesDone = true;
  if (e.set) Object.assign(mv, e.set);
  if (e.su) { const now = f.pre + mv.startup, want = e.su - (mv.hitbox ? 2 : 1); // (frames before it can hit: a blow lands on the frame after, a shot is thrown on it)
    if (want > now) f.pre += want - now;
    else if (want < now) { const cut = Math.min(f.pre, now - want); f.pre -= cut; if (mv.tellPre) mv.tellPre = Math.max(0, mv.tellPre - cut); if (mv.preTotal != null) mv.preTotal = f.pre; // (a shorter wind-up first: the move itself, its dash or leap, keeps its pace…
      if (now - cut > want) mv.speedUp = (now - cut) / want; } } // …and only if that isn't enough does the move play faster)
  if (e.act != null) mv.active = e.act;
  if (e.rec != null) mv.recovery = e.rec;
  if (e.blk != null) { mv.blockAdv = e.blk; mv.noGuardLag = true; f.lastMoveTech = false; } // (its own guard number: no extra off-balance on top)
}
function tryAttack(f, o, inp, noLight) { // (noLight: anything but a light attack — a string can't start itself over)
  if (!inp.btn) return false;
  const str = STR[inp.btn[0]], isP = inp.btn[1] === 'p';
  const sid = resolveSpecial(f, o, inp);
  if (sid) {
    const mv = specialMove(sid);
    if (mv) { mv.holdBtn = inp.btn; if (inp.holdFor) mv.holdFor = inp.holdFor; if (inp.then) mv.then = inp.then; } // Aldric's held techniques
    if (mv && f.key === 'brawler' && RISING_IDS.has(sid) && !(o.state === 'knock' && o.juggle)) mv.pre = inAir(o) ? 5 : 11; // on their own they need a moment to gather qi
    if (mv && f.ch.slowTech) { // Mei and Lyra: techniques take a moment longer and recover more slowly
      if (SLOW_SPECIALS[f.key] && SLOW_SPECIALS[f.key].has(sid)) mv.pre = f.ch.slowTech;
      else if (RISING_IDS.has(sid) && !(o.state === 'knock' && o.juggle)) mv.pre = Math.round(f.ch.slowTech * 0.8);
      if (mv.recovery < 90 && !(RISING_IDS.has(sid) && o.state === 'knock' && o.juggle)) mv.recovery = Math.round(mv.recovery * 1.12); // mid-juggle techniques keep their pace
    }
    if (mv && (!mv.proj || countProj(f, mv.proj) < mv.limit)) { startMove(f, mv, str); return true; }
  }
  if (f.y <= 0 && !inp.down && inp.btn !== 'lk' && o.state === 'knock' && o.juggle) { // juggle attacks, only on someone who has been launched (a plain jump is not a combo)
    const jm = chainMove(inp.btn === 'lp' ? 'jPalm' : inp.btn === 'hp' ? 'jRise' : 'jSpin', f);
    startMove(f, jm, jm.str); return true;
  }
  if (noLight && str === 0) return false;
  startMove(f, normalMove(f.ch, isP ? 'p' : 'k', str, inp.down ? 'c' : 's'), str);
  return true;
}
function startJump(f, inp) {
  setState(f, 'jump'); f.vy = (f.ch.jumpV || JUMP_V) * JUMP_HIGH * (floodVictim(f) ? 0.8 : 1); f.vx = inp.h * f.ch.jumpX * (f.poisonT > 0 ? 0.7 : 1) * (floodVictim(f) ? 0.8 : 1); f.airAttacked = false; f.airShuri = false; f.jumpSerial = ++serial; f.dj = false;
  dustAt(f.x, false);
}
function endMove(f) {
  const mv = f.move; f.move = null; f.shadow = false; f.hidden = false; f.shadowRun = false;
  if (mv && mv.normal && mv.str === 1 && !mv.launch) f.atkCD = f.ch.atkCD || 14; // heavy attacks: a short wait before the next attack (not after a launcher, so you can juggle)
  if (mv && !mv.air && !mv.jug) {
    if (mv.chainDepth) restAfter(f, STRING_REST, true);
    else if (mv.normal && mv.str === 0 && (reeling(other(f)) || projs.some(p => p.owner === f && !p.dead))) restAfter(f, JAB_REST, false);
  }
  if (f.y > 0) { setState(f, 'jump'); f.airAttacked = !(mv && mv.airFollow); } // Air Cyclone leaves him free to attack in the air
  else setState(f, (mv && mv.crouch && f.inp.down) ? 'crouch' : 'stand');
}
// No endless U: after a ground string (U U, U U U, U U U U K, J J K, or a technique it went into) its user stops for breath, and after a
// single U or J that hit or was guarded they wait a moment too. Either way they can't attack again until the opponent has been out of
// hit-stun or guard for that long (shots still in the air included), so the opponent always gets a moment to act.
const STRING_REST = 12, JAB_REST = 6;
// training: the frame data of each fighter's last attack, always on screen (see drawFrameData) — 発生 (the frame it can first hit,
// from the press), 持続 (active frames), 硬直 (recovery when it misses), and 硬直差 once it hits or is guarded: who can act first, by how much
const FD_FREE = s => s === 'stand' || s === 'crouch' || s === 'guard';
function fdStart(f, mv) {
  if (!game.training || game.demo) return;
  f.fd = { label: mv.label || '', su: mv.startup < 900 ? f.pre + mv.startup + 1 : null, act: mv.active < 900 ? mv.active : null, rec: mv.recovery, t0: game.frame, res: null, adv: null, wait: false, atkT: null, defT: null, held: mv.startup >= 900 };
}
function fdContact(a, r) { // each hit or guard of the attack: 発生 from the first, 硬直差 after the last
  const d = a.fd; if (!d) return;
  if (!d.res) d.su = game.frame - d.t0 + 1;
  d.res = r; d.adv = null; d.wait = true; d.atkT = d.defT = null;
  if (d.held && a.move) { d.act = a.move.active; d.rec = a.move.recovery; } // (a held attack: its frames are only known once it's let go)
}
function fdWatch() { // each step: once both can act again, the advantage
  for (const f of fighters) { const d = f.fd, o = other(f); if (d && !d.res && !d.live && f.state === 'attack' && f.move && f.move.startup < 900 && f.mf > f.move.startup) { d.live = true; d.su = game.frame - d.t0 + 1; } // (its first active frame, as it really came: a technique may have been sped up)
    if (!d || !d.wait) continue;
    if (['knock', 'down', 'getup', 'stunned', 'slashed', 'gbreak'].includes(o.state)) { d.adv = o.state === 'knock' ? 'launch' : o.state === 'stunned' ? 'stun' : o.state === 'gbreak' ? 'gb' : 'kd'; d.wait = false; continue; }
    if (d.atkT == null && FD_FREE(f.state) && f.state !== 'attack') d.atkT = game.frame; if (d.defT == null && FD_FREE(o.state)) d.defT = game.frame;
    if (d.atkT != null && d.defT != null) { d.adv = d.defT - d.atkT; d.wait = false; } }
}
// a technique sped up to the 発生 its fighter's techSpeed gives it (Kuro): everything before it can first hit — hand signs, wind-up,
// the run in, the leap — plays that many times faster (extra steps of the move, moving him as it goes); from the first active frame on,
// 持続 and 硬直 run at their normal speed
function techSpeed(f, o, inp) {
  const mv = f.move; if (!mv || !mv.speedUp || f.hitConnected || (f.pre <= 0 && f.mf >= mv.startup) || (mv.speedHold && mv.speedHold(f))) return; // (speedHold: a part of the move that keeps its own pace)
  f.spdAcc = (f.spdAcc || 0) + mv.speedUp - 1;
  while (f.spdAcc >= 1 && f.move === mv && f.state === 'attack' && !f.hitConnected && (f.pre > 0 || f.mf < mv.startup) && !(mv.speedHold && mv.speedHold(f))) { f.spdAcc -= 1; runMove(f, o, inp); if (!mv.manualY && !(mv.speedHold && mv.speedHold(f))) f.x = clamp(f.x + f.vx, WALL_L, WALL_R); }
}
// no attack carries its user further than this (dashes, rushes, lunges, step-ins, leaps out of them; supers and air attacks aside)
const MOVE_TRAVEL = 180;
function capTravel(f) {
  const mv = f.move; if (!mv || mv.super || mv.air) return; // (a ground move that leaps counts too: its flight is part of the move)
  const fw = f.vx * f.facing; if (fw <= 0) return;
  const left = (mv.maxTravel || MOVE_TRAVEL) - (mv.travel || 0); if (fw > left) f.vx = f.facing * Math.max(0, left); // (maxTravel: a move's own range)
  mv.travel = (mv.travel || 0) + f.vx * f.facing;
}
const reeling = o => o.state === 'hitstun' || o.state === 'blockstun' || o.state === 'recover';
function restAfter(f, n, breath) {
  const o = other(f), s = f.ch.scale;
  if ((o.state === 'knock' && o.juggle) || o.state === 'stunned') return; // (launched or stunned: the combo goes on)
  f.resting = n; f.atkCD = Math.max(f.atkCD || 0, n);
  if (breath) for (let i = 0; i < 3; i++) parts.push({ type: 'smoke', x: f.x + f.facing * (16 + i * 6) * s, y: GROUND - f.y - 124 * s, vx: f.facing * 0.7, vy: -0.3, r: 3 + i, vr: 0.3, life: 20, max: 20, col: '235,240,250', delay: i * 3 });
}
function runMove(f, o, inp) {
  const mv = f.move;
  if (!mv) { setState(f, 'stand'); return; }
  if (f.ch.possess === 'angel' && f.y > 0 && mv.air && f.hitConnected && inp && inp.upPress && !f.dj && f.mf > mv.startup) { // the angel's wings: jump again out of an air attack that hit, and keep the combo going
    f.move = null; setState(f, 'jump'); f.dj = true; f.vy = 11; f.vx = f.facing * 2; f.flipT = 20; f.airAttacked = false; sfx('rise');
    for (let i = 0; i < 6; i++) parts.push({ type: 'aura', x: f.x + rnd(-20, 20), y: GROUND - f.y - 40, vx: rnd(-1, 1), vy: rnd(0.5, 2), life: 16, max: 16, r: 3, col: '255,248,225' }); return; }
  if (mv.stepIn && f.mf <= mv.startup + (mv.active || 0) && f.y <= 0 && !f.hitConnected && Math.abs(o.x - f.x) > mv.stepIn * f.ch.scale) f.vx = f.facing * (f.key === 'kappa' ? 12 : 9); // (a string's follow-up steps in after them)
  if (f.pre > 0) { // gathering qi: he can't act yet, and any hit cancels the technique
    if (mv.superPre && mv.lockX == null) mv.lockX = o.x; // (a super that lands on a spot aims at where they stood when it began)
    if (mv.superPre && f.pre % 3 === 0) superWindFX(f);
    f.pre--; f.vx *= 0.6; if (!(mv.antiPre && !mv.pre)) gatherFX(f);
    if (f.pre === 0) { f.prevPose = { ...f.pose }; if (mv.onStart) mv.onStart(f, o); }
    return;
  }
  f.mf++;
  if (mv.fx && FX_TICK[mv.fx]) FX_TICK[mv.fx](f, mv);
  // combos: the next button pressed while this hit is still going queues the next hit of the chain
  const ckey = inp.btn && mv.chain ? ((inp.down && mv.chain['d' + inp.btn]) ? 'd' + inp.btn : inp.btn) : null; // ↓ + button can pick a different next hit
  if (ckey && !f.chainQ && !mv.lagLock && mv.chain[ckey] && !inp.ff && !inp.bb && !inp.sup && !inp.fuse) { f.chainQ = mv.chain[ckey]; f.chainBt = inp.bt; }
  if (f.chainQ && f.mf >= mv.startup + mv.active) {
    const id = f.chainQ; f.chainQ = null;
    const nm = chainMove(id, f);
    // only the press that queued this hit is used up, so a quick next press still counts for the following hit
    if (nm) { const gap = nm.guardGap && f.lastResult === 'block' ? nm.guardGap : 0; nm.chainDepth = (mv.chainDepth || 0) + 1; nm.fiveEnder = nm.chainDepth >= 4 && !nm.air && !nm.jug; startMove(f, nm, nm.str, true); if (gap) { f.pre += gap; nm.preTotal = f.pre; } // (guardGap: when the last hit was guarded, this one comes later — a hole to hit into; on a hit the string stays a combo)
      if (f.ctrl.consumeIf) f.ctrl.consumeIf(f.chainBt); return; } // (the fifth hit of a string: punishable when guarded)
  }
  // natural combos (Tekken style): a light attack that hit or was guarded can go straight into any other attack —
  // into another light one only from the first hit, so U and J strings can't run into each other over and over
  if (mv.normal && mv.str === 0 && !mv.air && !mv.lagLock && f.y <= 0 && f.hitConnected && inp.btn && !f.chainQ && !(mv.chain && mv.chain[inp.btn])
      && !inp.ff && !inp.bb && !inp.sup && !inp.fuse && f.mf >= mv.startup + mv.active) {
    if (tryAttack(f, o, inp, !!mv.chainDepth)) { f.move.chainDepth = (mv.chainDepth || 0) + 1; return; }
  }
  // follow-ups (Shadow Ambush, Sky Drop Kick): a button inside the window queues the next move
  if (mv.follow && inp.btn && !f.followQ && !mv.lagLock && f.mf >= mv.follow.from && f.mf <= mv.follow.to && mv.follow.opts[inp.btn] && !(mv.follow.notOnHit && f.lastResult === 'hit')
      && (!mv.rushTag || (f.rushN || 0) < 4 || FINISHERS.has(mv.follow.opts[inp.btn]))) f.followQ = mv.follow.opts[inp.btn]; // a rush allows four parts, then only its finisher
  if (f.followQ && mv.follow && mv.follow.notOnHit && f.lastResult === 'hit') f.followQ = null; // it connected: juggle instead
  if (f.followQ && f.mf >= (mv.follow.at || 0)) {
    const id = f.followQ, nm = specialMove(id); f.followQ = null;
    if (nm.guardGap && f.lastResult === 'block') { // guarded: a gap before this part (its own follow-ups move back to match)
      nm.startup += nm.guardGap;
      if (nm.follow) nm.follow = { ...nm.follow, from: nm.follow.from + nm.guardGap, to: nm.follow.to + nm.guardGap, at: nm.follow.at + nm.guardGap };
    }
    startMove(f, nm, f.str); return;
  }
  if (mv.normal && mv.stance === 's' && f.mf <= 2 && (inp.ffNow || inp.bbNow)) {
    // leniency: the second tap arrived a frame or two after the button
    const sid = resolveSpecial(f, o, { btn: (mv.str ? 'h' : 'l') + mv.kind, ff: inp.ffNow, bb: inp.bbNow, sup: false });
    const s2 = sid && specialMove(sid);
    if (s2 && (!s2.proj || countProj(f, s2.proj) < s2.limit)) { startMove(f, s2, mv.str); return; }
  }
  if (mv.normal && f.y <= 0 && inp.btn) {
    // cancel into a special after a hit, or into the super if Punch + Kick were pressed a frame or two apart
    const early = f.mf <= 4 && ((inp.sup && f.meter >= 100) || (inp.fuse && f.fuseG >= 100)); // (← → + J + K: the same grace for Hohen's fusion)
    if (early || (f.hitConnected && f.mf > mv.startup && !mv.lagLock)) { // (not out of a guarded launcher)
      const sid = resolveSpecial(f, o, inp);
      if (sid && (!early || sid === f.ch.sup || sid === f.ch.fuseSp)) {
        const s2 = specialMove(sid);
        if (s2 && !s2.air && (!s2.proj || countProj(f, s2.proj) < s2.limit)) { if (mv.chainDepth) s2.chainDepth = mv.chainDepth + 1; startMove(f, s2, STR[inp.btn[0]]); return; } // (out of a string: still a string, so it ends with a rest)
      }
    }
  }
  if (mv.onFrame) mv.onFrame(f, o, f.mf);
  if (mv.claw && f.mf === mv.startup + 1) clawSwipe(f, mv.claw, o); // the kappa's claws leave three slashes in the air
  if (f.move !== mv) return;
  if (f.mf >= mv.startup + mv.active + mv.recovery && !(f.guardLagUntil > game.frame && (!mv.normal || mv.fiveEnder) && f.y <= 0)) endMove(f); // (a guarded technique: still stuck until its opening is over)
}
function threatened(f, o) {
  const d = Math.abs(o.x - f.x);
  if (o.golem && golemThreatening(f, o)) return true; // (the golem is attacking)
  if (o.state === 'attack' && o.move && d < 280 && o.mf <= o.move.startup + o.move.active + 2 && !(o.move.walkAway && o.mf <= o.move.startup)) return true;
  for (const p of projs) if (p.owner === o && !p.dead && (p.type === 'beam' || p.type === 'flame' || (p.fall && Math.abs(p.x - f.x) < 150) || (Math.sign(f.x - p.x) === Math.sign(p.vx) && Math.abs(p.x - f.x) < 300))) return true; // (or one dropping on them from above)
  return false;
}
function teleport(f, o) {
  const side = Math.sign(o.x - f.x) || f.facing;
  let tx = o.x + side * 80;
  if (tx < WALL_L + 5 || tx > WALL_R - 5) tx = o.x - side * 80;
  f.x = clamp(tx, WALL_L, WALL_R);
  f.facing = Math.sign(o.x - f.x) || f.facing;
}
function land(f) {
  f.airAttacked = false; f.airShuri = false;
  const lagLeft = f.guardLagNeed ? f.guardLagNeed - (game.frame - f.guardLagAt) : 0; f.guardLagNeed = 0;
  if (f.state === 'jump') { setState(f, 'land'); f.landT = 3; f.vx = 0; dustAt(f.x, false); }
  else if (f.state === 'attack') {
    if (f.move && (f.move.air || f.move.untilLand)) { const lt = f.move.landT || 4; f.move = null; setState(f, 'land'); f.landT = lt; f.vx = 0; dustAt(f.x, false); }
  } else if (f.state === 'knock') {
    if (f.bounceOnLand && !f.ko) { // ground bounce from Shadow Meteor: back up into the air, still juggleable
      const weak = registerBounce(f);
      f.bounceOnLand = false; f.y = 1; f.vy = weak ? 0.5 : 9.5; f.jug = Math.max(0, (f.jug || 0) - 3);
      dustAt(f.x, true); parts.push({ type: 'ering', x: f.x, y: GROUND, r: 10, vr: 11, life: 18, max: 18, col: '190,150,255' }, { type: 'ering', x: f.x, y: GROUND, r: 4, vr: 6, life: 22, max: 22, col: '240,220,255' });
      game.shake = Math.max(game.shake, 10); if (!weak) popText(f.x, GROUND - 130, 'BOUNCE!', '255,190,90'); sfx('bounce');
      return;
    }
    setState(f, 'down'); f.vx *= 0.35; f.otgUsed = false; f.juggle = false; f.mBounced = false; f.bounceOnLand = false; f.kdSerial = ++serial; dustAt(f.x, true); game.shake = Math.max(game.shake, 4); sfx('land');
  }
  if (lagLeft > 0 && !f.ko && (f.state === 'land' || f.state === 'stand' || f.state === 'attack')) { if (f.state === 'attack' && f.move) { const left = f.move.startup + (f.move.active || 0) + f.move.recovery - f.mf; if (left < lagLeft) f.move.recovery += lagLeft - left; } else { setState(f, 'land'); f.landT = Math.max(f.landT || 0, lagLeft); f.vx = 0; } } // a guarded technique from the air: a heavy landing
}

function update(f, o, inp) {
  f.inp = inp; f.st++;
  if (f.golem) golemUpdate(f, o);
  if (f.brands && --f.brandT <= 0) f.brands = 0; // holy brands fade
  if (f.healT > 0) f.healT--;
  if (f.possT > 0 && --f.possT === 0) endPossession(f);
  if (f.ch.possess === 'double' && !f.ko) { const o2 = other(f); // a field of holy light and hellfire: anyone close is burned
    if (globalT % 3 === 0) { const an = globalT * 0.12; for (const sd of [0, Math.PI]) parts.push({ type: 'aura', x: f.x + Math.cos(an + sd) * 95, y: GROUND - f.y - 90 + Math.sin(an + sd) * 40, vx: 0, vy: -0.6, life: 16, max: 16, r: 5, col: sd ? '255,90,60' : '255,240,190' }); }
    if (o2 && !o2.ko && !(o2.invul > 0) && o2.state !== 'getup' && Math.abs(o2.x - f.x) < 115 && Math.abs(o2.y - f.y) < 140 && game.frame % 24 === 0) { o2.hp = Math.max(1, o2.hp - 10); o2.flash = 4; parts.push({ type: 'spark', x: o2.x, y: GROUND - o2.y - 90, vx: 0, vy: -2, life: 10, max: 10, col: '255,150,120' }); } }
  if (f.ch.regen && f.hp > 0 && f.hp < 1000 && !f.ko) { f.hp = Math.min(1000, f.hp + f.ch.regen); f.healT = Math.max(f.healT || 0, 20); } // the angel heals him slowly
  if (f.ch.drain && f.hp > 1 && !f.ko && game.phase === 'fight') { f.hp = Math.max(1, f.hp - f.ch.drain * (f.wholeRound ? 0.35 : 1)); if (globalT % 10 === 0) parts.push({ type: 'aura', x: f.x + rnd(-20, 20), y: GROUND - f.y - rnd(40, 160), vx: 0, vy: -1.2, life: 16, max: 16, r: 3, col: '170,40,40' }); } // the devil eats his health
  if (f.meteorFX > 0) { f.meteorFX--; if (f.y <= 2 && f.meteorFX < 19) { f.meteorFX = 0; parts.push({ type: 'ring', x: f.x, y: GROUND - 6, r: 10, vr: 10, life: 16, max: 16, col: '255,180,120' }); for (let i = 0; i < 10; i++) parts.push({ type: 'spark', x: f.x, y: GROUND - 8, vx: rnd(-7, 7), vy: -rnd(3, 8), life: 18, max: 18, col: i % 2 ? '255,190,120' : '255,210,250' }); cracks(f.x); dustAt(f.x, true); game.shake = Math.max(game.shake, 6); sfx('land'); } }
  if (f.wakeT > 0 && --f.wakeT === 0) parts.push({ type: 'ring', x: f.x, y: GROUND - f.y - 70, r: 30, vr: -1.6, life: 10, max: 10, col: '255,150,120' }); // the invincibility ends: a ring closes in (now they can be hit)
  if (f.poisonT > 0) { f.poisonT--; if (f.hp > 1 && !f.ko) f.hp = Math.max(1, f.hp - 0.17); if (globalT % 5 === 0) parts.push({ type: 'aura', x: f.x + rnd(-22, 22), y: GROUND - f.y - rnd(30, 150), vx: 0, vy: -rnd(0.8, 1.6), life: 18, max: 18, r: rnd(2.5, 4.5), col: '120,220,90' }); }
  if (f.venomT > 0 && --f.venomT === 0) f.venom = 0;
  if (f.invul > 0) f.invul--;
  if (f.flipT > 0) f.flipT--;
  if (f.orbCD) for (let i = 0; i < f.orbCD.length; i++) if (f.orbCD[i] > 0) f.orbCD[i]--;
  if (f.sorbs && f.sorbs.length) { for (const q of f.sorbs) { q.life--; if (q.cd > 0) q.cd--; } f.sorbs = f.sorbs.filter(q => q.life > 0); }
  if (f.ch.orbs && game.phase === 'fight') haloFire(f);
  if (f.resting) { if (reeling(o)) f.atkCD = Math.max(f.atkCD, f.resting); else if (f.atkCD <= 0) f.resting = 0; } // (the rest after a U or a string)
  if (f.reloadT > 0 && --f.reloadT === 0) reloaded(f); // (Jesse's guns)
  if (f.atkCD > 0) f.atkCD--;
  if (f.flash > 0) f.flash--;
  const toward = Math.sign(o.x - f.x) || f.facing;
  if (toward !== f.lastToward) { f.lastToward = toward; f.sideT = game.frame; }
  f.backHeld = inp.h !== 0 && inp.h === -toward;
  switch (f.state) {
    case 'stand': case 'crouch': case 'guard': {
      if (f.st % 7 === 0) ambientFX(f);
      f.facing = toward; f.combo = 0;
      if (f.atkCD <= 0 && tryAttack(f, o, inp)) break; // (a technique with ↑ held is tried before jumping)
      if (inp.dashTap === 1) { setState(f, 'dash'); sfx('swing'); break; }
      if (inp.dashTap === -1) { setState(f, 'bdash'); sfx('swing'); break; }
      if (inp.up) { startJump(f, inp); break; }
      // (charging MP by holding P has been removed: MP fills only by fighting)
      if (inp.down) { if (f.state !== 'crouch') setState(f, 'crouch'); f.vx = !f.backHeld && Math.sign(inp.h) === toward ? toward * f.ch.walk * 0.45 * (f.poisonT > 0 ? 0.6 : 1) * floodWalkMul(f) : 0; break; } // (crouching, ↓ + forward edges forward; ↓ + back stays the crouching guard)
      if ((f.backHeld || autoGuardFor(f, toward)) && threatened(f, o)) { if (f.state !== 'guard') setState(f, 'guard'); f.vx = 0; break; } // (auto guard: standing still is enough)
      if (f.state !== 'stand') setState(f, 'stand');
      f.vx = inp.h * (f.backHeld ? f.ch.back : f.ch.walk) * (f.ctrl instanceof CPU && !game.watch ? 0.75 : 1) * (f.poisonT > 0 ? 0.6 : 1) * floodWalkMul(f); // the CPU walks slower against a player; poison slows anyone; in the flood the kappa swims fast and the other wades
      if (f.vx) f.walkPh += Math.abs(f.vx) * 0.085 * (f.backHeld ? -1 : 1);
      break;
    }
    case 'jump':
      if (floodOwner(f)) { // swimming through the flooded stage: ↑ strokes up, ↓ dives, ← → swims across; he hardly sinks
        f.vx += ((inp.h || 0) * f.ch.walk * 1.7 - f.vx) * 0.2;
        if (inp.up) f.vy = Math.min(f.vy + 0.9, 6); else if (inp.down) f.vy = Math.max(f.vy - 0.9, -7);
        if (inp.upPress) { f.vy = Math.max(f.vy, 7); for (let i = 0; i < 4; i++) parts.push({ type: 'aura', x: f.x + vrnd(-14, 14), y: GROUND - f.y - 10, vx: vrnd(-1, 1), vy: vrnd(0.5, 1.5), life: 16, max: 16, r: 3, col: '200,235,255' }); }
        if (!inp.up && !inp.down) f.vy *= 0.92; // (still water: he drifts gently down)
        f.y = Math.min(f.y, FLOOD_SWIM_MAX); f.airAttacked = false; // (he can attack again and again while swimming)
      }
      if (f.ch.doubleJump && inp.upPress && !f.dj && f.vy < 8 && f.y > 20) { // Mei: a second jump in mid-air, with a somersault
        f.dj = true; f.vy = 12.5; f.vx = inp.h * f.ch.jumpX; f.flipT = 20; f.airAttacked = false; sfx('rise');
        parts.push({ type: 'ring', x: f.x, y: GROUND - f.y, r: 6, vr: 3, life: 12, max: 12, col: f.ch.auraCol }); cloudPuff(f.x, GROUND - f.y + 6);
      }
      if (inp.btn && !f.airAttacked) {
        const isP = inp.btn[1] === 'p', str = STR[inp.btn[0]];
        f.airAttacked = true;
        // air juggle: near a launched opponent, U starts the air string, I the flurry, K smashes them down
        if (inAir(o) && Math.abs(o.x - f.x) < 130 && o.state === 'knock' && o.juggle) { const am = chainMove(inp.btn === 'lp' ? 'aPalm' : inp.btn === 'hp' ? 'aKunai' : inp.down ? 'aMeteor' : 'airSmash', f); startMove(f, am, am.str); }
        else if (inp.down && inp.btn === 'hk' && f.y > 30) { const am = chainMove('aMeteor', f); startMove(f, am, am.str); } // dive kick from any jump
        else if (inp.down && inp.btn === 'lp' && f.y > 30) { // ↓ + U in the air: a diving strike with his weapon or fist, straight down at them (an overhead: guard it standing)
          const am = chainMove('aMeteor', f), ai = normalMove(f.ch, 'p', 1, 'j'); am.label = DIVE_STRIKE[f.ch.lookKey || f.key] || 'Dive Strike'; if (ai && ai.pose && f.key !== 'gunman') am.pose = ai.pose; am.dmg = Math.round((am.dmg || 40) * 0.85); am.overhead = true; startMove(f, am, am.str); }
        else startMove(f, normalMove(f.ch, isP ? 'p' : 'k', str, 'j'), str);
      }
      break;
    case 'attack': if (floodVictim(f) && game.frame % 5 === 0 && f.move && f.mf <= f.move.startup) break; runMove(f, o, inp); if (f.state === 'attack') techSpeed(f, o, inp); if (floodOwner(f) && f.state === 'attack' && game.frame % 5 === 0 && f.move && f.mf <= f.move.startup + (f.move.active || 0)) runMove(f, o, inp); if (f.move && f.move.lvl != null && !f.move.fired && f.state === 'attack') qiGather(f, f.mf, Math.min(1, f.mf / 120), f.key === 'gunman' ? '255,200,110' : null); break; // held charge attacks gather qi too // (flooded: the kappa's attacks come out a fifth faster, the other's a fifth slower — but recovery isn't touched, so the kappa can still be punished and the other can still get away)
    case 'land': if (f.st >= f.landT) setState(f, 'stand'); break;
    case 'hitstun':
      if (f.st >= f.stun) {
        if (f.pendingStun && f.y <= 0 && !f.ko) { // left stunned: electrified or burning, open to a combo
          const k = f.stunKind;
          setState(f, 'stunned'); f.stunT = f.pendingStun; f.pendingStun = 0; f.stunUsed = true; f.st0 = ++serial;
          popText(f.x, GROUND - 185, 'STUNNED!', k === 'shock' ? '170,215,255' : k === 'shadow' ? '195,160,255' : k === 'psy' ? '255,160,235' : '255,170,90'); sfx(k === 'shock' ? 'zap' : k === 'shadow' ? 'vanish' : 'flame');
        } else setState(f, 'recover');
      }
      break;
    case 'stunned':
      f.vx *= 0.8; f.facing = toward;
      if (f.st % 3 === 0) stunFX(f);
      if (f.st >= f.stunT) setState(f, 'recover');
      break;
    case 'recover': // shaking off a hit: can guard, but can't attack or jump yet
      f.facing = toward; f.vx = 0;
      if (f.st >= (f.ch.recoverT || 12)) setState(f, inp.down ? 'crouch' : 'stand');
      break;
    case 'blockstun': if (f.st >= f.stun) { setState(f, inp.down ? 'crouch' : 'guard'); f.settleT = 10; } break;
    case 'down': // lie on the ground a while; tap ← or → to roll away instead of standing up in place
      if (f.ko) break;
      if (f.st >= 18 && inp.tap) { setState(f, 'roll'); f.rollDir = inp.tap; sfx('land'); }
      else if (f.st >= 46) { setState(f, 'getup'); f.wakeQ = null; }
      break;
    case 'getup': // can't be hit while rising; an attack pressed now comes out the moment you're up
      if (inp.btn) f.wakeQ = { ...inp };
      if (f.st >= 18) {
        setState(f, 'stand'); f.invul = 8; f.wakeT = 8; f.combo = 0; f.otgUsed = false; // (wakeT: the invincible moment after standing up, shown on screen)
        if (f.wakeQ) { const w = f.wakeQ; f.wakeQ = null; f.facing = toward; tryAttack(f, o, w); }
      }
      break;
    case 'dash': // forward dash: a quick burst toward the opponent; attacks (and → → specials) come straight out of it
      f.facing = toward;
      if (f.atkCD <= 0 && tryAttack(f, o, inp)) break;
      f.vx = f.facing * (f.st < 9 ? 8 : 4) * (f.poisonT > 0 ? 0.6 : 1) * (f.key === 'kappa' ? 1.35 : 1); // (the kappa darts in fast and low, under projectiles)
      if (f.st % 3 === 0) dustAt(f.x, false);
      if (f.st >= 14) setState(f, 'stand');
      break;
    case 'bdash': // back dash: a quick hop away (no invincibility); ← ← again near the end dashes again
      if (f.st <= 8 && inp.btn && inp.bb && tryAttack(f, o, inp)) break;
      if (f.st >= 8 && inp.dashTap === -1) { setState(f, 'bdash'); sfx('swing'); break; }
      f.facing = toward;
      f.vx = -f.facing * (f.st < 7 ? 10 : 3);
      if (f.st % 4 === 0) dustAt(f.x, false);
      if (f.st >= 12) { setState(f, 'stand'); f.vx = 0; }
      break;
    case 'broll': // back roll: a short gather, then tumble away; can't be hit for most of it. ← ← specials come out of the start, before he moves
      if (f.st <= 8 && inp.btn && inp.bb && tryAttack(f, o, inp)) break;
      f.vx = f.st < 4 ? 0 : -f.facing * (f.st < 20 ? 7 : 2); f.invul = (f.st >= 2 && f.st < 19) ? 2 : 0;
      if (f.st >= 24) { setState(f, 'stand'); f.vx = 0; }
      break;
    case 'slashed': // cut down: stagger for a moment, then collapse
      f.vx *= 0.7;
      if (f.st >= f.stun) { setState(f, 'knock'); f.vy = 2.5; f.vx = f.slashDir * 1.2; f.y = 1; }
      break;
    case 'roll':
      f.vx = f.rollDir * 5.5;
      if (f.st >= 24) { setState(f, 'stand'); f.vx = 0; f.invul = 6; f.combo = 0; f.otgUsed = false; }
      break;
    case 'charge':
      f.facing = toward;
      if (f.atkCD <= 0 && tryAttack(f, o, inp)) break;
      if (!inp.charge || f.meter >= 100) {
        if (f.meter >= 100) { sfx('full'); popText(f.x, GROUND - f.y - 165, 'MP FULL', '255,224,102'); }
        setState(f, 'stand'); break;
      }
      f.vx = 0;
      f.meter = Math.min(100, f.meter + f.ch.chargeRate);
      if (globalT % 3 === 0) auraParticle(f);
      qiGather(f, f.st, Math.min(1, f.st / 90)); // qi flows into him while he charges
      if (f.st % 18 === 0) sfx('charge');
      break;
    case 'gbreak': if (f.st >= f.stun) { setState(f, 'stand'); f.guard = 70; } break; // back on their feet with most of the guard meter
  }
  if ((f.y > 0 || f.vy > 0) && !(f.state === 'attack' && f.move && f.move.manualY)) {
    const hang = f.state === 'knock' && f.floatT > 0 ? (f.floatT--, 0.25) : 1; // held by a juggle hit: they hang in the air for a moment (without rising)
    const jugG = G * (0.62 + 0.04 * Math.min(f.jugMoves || 0, 10)); // the longer the juggle (in attacks), the faster they fall
    const wet = floodOwner(f) && f.state !== 'knock' ? 0.12 : floodVictim(f) && f.state === 'jump' ? 0.64 : 1; // (their jump: about the same height, a quarter slower) // (under the flood: the kappa barely sinks; the others float up and sink back slowly)
    f.vy -= ((f.state === 'knock' && f.juggle) ? jugG : G) * hang * wet; f.y += f.vy;
    if (f.y > CEILING) { f.y = CEILING; f.vy = Math.min(f.vy, 0); } // (the top of the screen: nobody is launched out of sight) // launched opponents float a little, like in Tekken
    if (f.state === 'knock' && f.juggle && !f.jugSpent && (f.airT = (f.airT || 0) + 1) > AIR_MAX) { f.jugSpent = true; f.juggle = false; popText(f.x, GROUND - f.y - 200, 'LIFT LIMIT', '205,205,220'); } // no juggle lasts longer than this, whatever is used
    if (f.y <= 0) { f.y = 0; f.vy = 0; land(f); }
  }
  if (f.state === 'attack') capTravel(f);
  f.x += f.vx;
  if (f.kb) { f.x += f.kb; f.kb *= 0.8; if (Math.abs(f.kb) < 0.1) f.kb = 0; } // pushback from hitting someone against the wall
  if (f.y <= 0) {
    if (f.state === 'attack') { if (!(f.move && f.move.selfMove)) f.vx *= 0.78; }
    else if (f.state !== 'stand' && f.state !== 'jump') f.vx *= 0.8;
  }
  f.x = clamp(f.x, WALL_L, WALL_R);
  f.dispHp = Math.max(f.hp, f.dispHp - ((f.state === 'hitstun' || f.state === 'knock') ? 0 : 6));
  // guard meter refills slowly once you stop guarding
  const guarding = f.state === 'guard' || f.state === 'blockstun' || f.state === 'gbreak' || (f.state === 'crouch' && f.backHeld) || (f.state === 'attack' && f.move && f.move.aegis); // (no recovery while the Aegis is up)
  if (guarding) f.guardIdle = 0;
  else if (++f.guardIdle > 45) f.guard = Math.min(100, f.guard + (f.guardSlowT > 0 ? 0.02 : 0.07)); // (slowly after the Aegis)
  if (f.guardSlowT > 0) f.guardSlowT--;
  if (f.meter >= 100 && globalT % 9 === 0) auraParticle(f);
}

function pushApart(a, b) {
  if (a.hidden || b.hidden) return;
  const ghost = f => f.state === 'attack' && f.move && f.move.noPush;
  if (ghost(a) || ghost(b)) return;
  const lying = s => s === 'down' || s === 'knock' || s === 'roll' || s === 'broll';
  if (lying(a.state) || lying(b.state)) return;
  if (Math.abs(a.y - b.y) > ((a.y > 30 || b.y > 30) ? 70 : 95)) return; // a jump high enough passes right over them
  const min = 46 * (a.ch.scale + b.ch.scale) / 2;
  const dx = b.x - a.x;
  if (Math.abs(dx) >= min) return;
  const dir = dx === 0 ? a.facing : Math.sign(dx);
  const over = (min - Math.abs(dx)) / 2;
  a.x -= dir * over; b.x += dir * over;
  a.x = clamp(a.x, WALL_L, WALL_R); b.x = clamp(b.x, WALL_L, WALL_R);
  if (Math.abs(b.x - a.x) < min - 0.5) {
    if (a.x <= WALL_L || a.x >= WALL_R) b.x = clamp(a.x + dir * min, WALL_L, WALL_R);
    else a.x = clamp(b.x - dir * min, WALL_L, WALL_R);
  }
}

