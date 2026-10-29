'use strict';
/* ================= input ================= */
const MAPS = {
  p1: { left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', lp: 'KeyU', hp: 'KeyI', lk: 'KeyJ', hk: 'KeyK', charge: 'KeyP' },
};
const ALT = { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' };
const ALT2 = { up: 'Space' }; // Space jumps too
const GAME_KEYS = new Set([...Object.values(MAPS.p1), ...Object.values(ALT), 'Space']);
const BTN_ORDER = ['hp','lp','hk','lk'];
const EMPTY = Object.freeze({ h: 0, down: false, up: false, btn: null, sup: false, ff: false, ffNow: false, bb: false, bbNow: false, dashTap: 0, charge: false });
// a phone or tablet (touch controls, landscape) rather than a computer with a keyboard
const IS_MOBILE = (() => { try { return /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(navigator.userAgent) || (matchMedia('(pointer: coarse)').matches && navigator.maxTouchPoints > 0); } catch (e) { return false; } })();
const keys = new Set(), pressed = new Set(), pressT = {}; // pressT: real tick of each key press (keeps counting through hit pauses)
class Human {
  constructor(map) { this.m = map; this.reset(); }
  reset() { this.held = null; this.lastP = -99; this.lastK = -199; this.tapDir = 0; this.tapT = -99; this.ffDir = 0; this.ffT = -99; this.bfT = -99; this.lastJ = -99; this.lastKk = -199; }
  consume() { this.held = null; }
  consumeIf(t) { if (this.held && this.held.t === t) this.held = null; }
  read(f, frame, o) {
    const m = this.m, k = c => keys.has(m[c]) || keys.has(ALT[c]) || keys.has(ALT2[c]), toward0 = Math.sign(o.x - f.x) || f.facing;
    const h = (k('right') ? 1 : 0) - (k('left') ? 1 : 0);
    // double tap: the same direction pressed twice within 14 frames
    for (const [c, dir] of [['left', -1], ['right', 1]]) {
      if (!pressed.has(m[c]) && !pressed.has(ALT[c])) continue;
      if (dir === toward0 && this.lastTap && this.lastTap.dir === -toward0 && frame - this.lastTap.t <= 16) this.bfT = frame; // ← then → (back, then toward them)
      if (this.tapDir === dir && frame - this.tapT <= 14) { this.ffDir = dir; this.ffT = frame; this.tapT = -99; }
      else { this.tapDir = dir; this.tapT = frame; }
      this.lastTap = { dir, t: frame };
    }
    const toward = toward0;
    const tap = this.lastTap && frame - this.lastTap.t <= 6 ? this.lastTap.dir : 0;
    const ff = this.ffDir === toward && frame - this.ffT <= 12, bb = this.ffDir === -toward && frame - this.ffT <= 18; // (← ← then → + button: a little longer to fit the → in)
    let btn = null;
    for (const b of BTN_ORDER) if (pressed.has(m[b])) { btn = b; break; }
    if (btn) {
      // Punch + Kick only counts as "together" if the real key presses were close, even across a hit pause
      if (pressed.has(m.lp) || pressed.has(m.hp)) this.lastP = Math.max(pressed.has(m.lp) ? pressT[m.lp] : -999, pressed.has(m.hp) ? pressT[m.hp] : -999);
      if (pressed.has(m.lk) || pressed.has(m.hk)) this.lastK = Math.max(pressed.has(m.lk) ? pressT[m.lk] : -999, pressed.has(m.hk) ? pressT[m.hk] : -999);
      if (pressed.has(m.lk)) this.lastJ = pressT[m.lk]; if (pressed.has(m.hk)) this.lastKk = pressT[m.hk];
      // Punch + Kick within 4 frames of each other = super; ← → then J + K together = Hohen's fusion
      this.held = { btn, sup: Math.abs(this.lastP - this.lastK) <= 4, fuse: Math.abs(this.lastJ - this.lastKk) <= 4 && frame - this.bfT <= 20, bf: frame - this.bfT <= 20, ff, bb, t: frame }; // (bf: ← then → before the button)
    }
    // a press stays buffered for a few frames, so a punish can be entered during guard stun
    const hb = this.held && frame - this.held.t <= 5 ? this.held : null;
    return { held: { lp: k('lp'), hp: k('hp'), lk: k('lk'), hk: k('hk') }, h, down: k('down'), up: k('up'), upPress: pressed.has(m.up) || pressed.has(ALT.up) || pressed.has(ALT2.up), btn: hb ? hb.btn : null, sup: hb ? hb.sup : false, fuse: hb ? !!hb.fuse : false, bf: hb ? !!hb.bf && !hb.fuse : false, ff: hb ? hb.ff : false, bb: hb ? hb.bb : false, bt: hb ? hb.t : -1,
      ffNow: this.ffDir === toward && frame - this.ffT <= 2, bbNow: this.ffDir === -toward && frame - this.ffT <= 2, tap, charge: keys.has(m.charge),
      dashTap: this.ffT === frame ? (this.ffDir === toward ? 1 : -1) : 0 }; // the second tap itself: dash forward or roll back
  }
}

/* ================= CPU ================= */
function threatOfLowDummy() {}
// a low is coming (guard crouching)? judged like the hit itself (heightClass): anything else is guarded standing
const isLowAtk = o => golemLowAtk(o) || !!(o && o.state === 'attack' && o.move && (o.move.hitbox ? heightClass(o.move, boxOf(o, o.move.hitbox)) === 'low' : (!o.move.midHit && !fromAbove(o.move) && (o.move.low || (!rising(o.move) && /low|Low|slide|Sweep|sweep|Belly/.test(o.move.pose || '')))))) ||
  nearestProjLow(o); // (a shockwave along the floor, a shot at the feet...; a ring that rises into a column isn't) (midHit: a kick button that throws or punches at body height — not a low)
function nearestProjLow(o) { // guard at the height of whichever of their projectiles reaches you first (a low one further back can wait: stand for the mid in front of it)
  const t = o && other(o); let best = null, bd = Infinity;
  for (const p of projs) { if (p.owner !== o || p.type === 'decoy' || p.type === 'guardShadow') continue;
    const b = projBox(p), d = t ? Math.max(0, b.x0 - t.x, t.x - b.x1) : 0; if (d < bd) { bd = d; best = p; } }
  return !!best && (best.h ? heightClass(best.h, projBox(best)) : (best.low && !fromAbove(best) ? 'low' : 'mid')) === 'low';
}
function threatOf(f, o) {
  const dist = Math.abs(o.x - f.x), gt = golemThreat(f, o); if (gt) return gt; // (the golem's blow)
  if (o.state === 'attack' && o.move && o.move.hitbox && o.mf <= o.move.startup + o.move.active && dist < 210)
    return { key: 'm' + o.serial, kind: o.y > 0 ? 'air' : o.move.high ? 'high' : isLowAtk(o) ? 'low' : 'mid' };
  if (o.state === 'jump' && dist < 200 && o.vx !== 0 && Math.sign(o.vx) === Math.sign(f.x - o.x))
    return { key: 'j' + o.jumpSerial, kind: 'air' };
  for (const p of projs) {
    if (p.owner !== o || p.dead || p.hold || p.type === 'decoy' || p.type === 'guardShadow') continue;
    if (p.type === 'beam' || p.type === 'flame') return { key: 'p' + p.id, kind: 'proj' };
    if (Math.sign(f.x - p.x) === Math.sign(p.vx) && Math.abs(p.x - f.x) < 240) return { key: 'p' + p.id, kind: 'proj' };
  }
  return null;
}
// CPU difficulty: how fast it reacts, how often it guards, how often it thinks, how often it goes for combos and punishes,
// and how hard it hits (CPU vs CPU always plays its own way)
const DIFFS = {
  easy: { react: [26, 44], block: 0.45, think: [60, 100], combo: 0.25, punish: 0.1, dmg: 0.8 },
  medium: { react: [10, 22], block: 0.8, think: [32, 72], combo: 1, punish: 0.35, dmg: 1 },
  hard: { react: [6, 12], block: 0.9, think: [16, 36], combo: 1.8, punish: 0.65, dmg: 1.15 },
  hell: { react: [2, 6], block: 0.96, think: [10, 24], combo: 2.6, punish: 0.9, dmg: 1.3 },
};
const DIFF_ORDER = ['easy', 'medium', 'hard', 'hell'], DIFF_NAMES = { easy: ['Easy', 'かんたん'], medium: ['Medium', 'ふつう'], hard: ['Hard', 'むずかしい'], hell: ['Hell', '地獄'] };
const dif = () => DIFFS[game.diff] || DIFFS.medium;
const cpuP = (p, watchP) => game.watch ? watchP : Math.min(0.95, p * dif().combo); // chance of going for a combo route
class CPU {
  constructor() { this.reset(); }
  reset() { this.plan = {}; this.next = 0; this.def = null; this.threatKey = null; this.reactAt = 0; this.chargeUntil = 0; this.cancelTried = false; this.punishKey = null; }
  read(f, frame, o) { // (Jesse reloading doesn't shoot: he backs off and guards, and only throws Dynamite, counters with Showdown or goes for High Noon)
    if (f.reloadT > 0) { this.route = null; this.chainSeq = null; }
    if (f.state === 'hitstun' && f.y <= 0) { // in a ground combo it may hold its guard, to stop a slow next attack (GUARD_BACK; decided once per combo)
      if (this.mcFor !== f.comboSerial) { this.mcFor = f.comboSerial; this.mcGuard = Math.random() < (game.watch ? 0.6 : dif().block); }
      if (this.mcGuard) return { ...EMPTY, h: -(golemGuardDir(f, o) || Math.sign(o.x - f.x) || f.facing), down: isLowAtk(o) };
    }
    const out = this.think(f, frame, o);
    if (f.reloadT > 0 && out.btn && !out.sup && !(out.bb && (out.btn === 'lp' || out.btn === 'hk'))) Object.assign(out, { btn: null, ff: false, down: false, h: -(Math.sign(o.x - f.x) || f.facing) });
    return out;
  }
  think(f, frame, o) {
    const out = { h: 0, down: false, up: false, btn: null, sup: false, ff: false, bb: false, charge: false };
    const dx = o.x - f.x, dist = Math.abs(dx), fwd = Math.sign(dx) || f.facing, N = f.key === 'ninja', gdir = golemGuardDir(f, o) || fwd; // (gdir: which way to guard — toward the golem when it is the one attacking, else toward the alchemist)
    if (f.state === 'down' && !f.ko) { // roll away or get up
      if (this.wakeFor !== f.kdSerial) { this.wakeFor = f.kdSerial; const r = Math.random(); this.wakeRoll = r < 0.3 ? -fwd : r < 0.42 ? fwd : 0; this.wakeAtk = Math.random() < 0.3; }
      if (this.wakeRoll && f.st >= 20) out.tap = this.wakeRoll;
      return out;
    }
    if (f.state === 'getup') {
      if (this.wakeAtk && f.st >= 8) { this.wakeAtk = false; out.btn = N ? 'lp' : 'hp'; out.down = !N; }
      return out;
    }
    if (this.route) { // playing a combo route: one of the fighter's sample combos
      const r = this.route, next = r.steps[r.i];
      if (!r.last) r.last = frame;
      const hurt = f.state === 'hitstun' || f.state === 'knock' || f.state === 'down' || f.state === 'getup' || f.state === 'gbreak' || f.state === 'stunned' || f.state === 'blockstun' || f.state === 'slashed';
      const blocked = r.i > 0 && o.state === 'blockstun' && !(next && next.when === 'follow');
      const launchedInstead = next && next.when === 'follow' && o.state === 'knock' && o.juggle; // the charge uppercut hit: juggle it freely instead
      if (blocked && f.state === 'attack' && f.move && f.move.follow && f.move.id === 'shadowCharge' && !r.switched) { // guarded: switch to a Shadow Ambush combo
        const alts = DEMOS[f.key].filter(d => d.steps.some(st => st.when === 'follow'));
        if (alts.length) { const d = alts[Math.random() * alts.length | 0], k = d.steps.findIndex(st => st.when === 'follow');
          Object.assign(r, { name: d.name, steps: d.steps, i: k, i0: k - 1, wait: null, last: frame, shown: false, switched: true }); return out; }
      }
      if (!next || hurt || blocked || launchedInstead || frame - r.last > 160 || (r.i > r.i0 && o.state === 'down' && next.when !== 'ground')) this.route = null;
      else {
        const i0 = r.i;
        comboStep(f, o, r.steps, r, out);
        if (r.i !== i0) { r.last = frame; if (r.i >= Math.max(2, r.i0 + 1) && !r.shown) { r.shown = true; game.routeName = { side: f.side, text: r.name, demo: r.demo, kind: r.kind, t: 150 }; } }
        if (r.i >= r.steps.length) this.route = null;
        return out;
      }
    }
    if (f.state === 'attack' && f.move) {
      const mv = f.move;
      if (mv.normal && mv.str === 0 && f.hitConnected && f.lastResult === 'hit' && f.y <= 0 && this.confirmFor !== f.serial && o.state === 'hitstun') {
        this.confirmFor = f.serial; // hit-confirm: the jab landed, so go for a launcher combo
        if (Math.random() < cpuP(0.3, 0.7)) { const r = pickRoute(f, 'confirm', dist); if (r) { this.route = r; return out; } }
      }
      // keep a juggle going with quick hits, finish with a kick
      if (o.state === 'knock' && o.juggle && mv.normal && mv.str === 0 && f.hitConnected && f.mf >= mv.startup + mv.active && dist < 120) {
        out.btn = o.jug >= 3 ? 'hk' : 'lp'; return out;
      }
      if (this.chainSeq && this.chainSeq.length) { // keep pressing the next button of a combo
        if (mv.chain && !f.chainQ && f.mf >= 2) { out.btn = this.chainSeq.shift(); return out; }
        if (!mv.chain) this.chainSeq = null;
      }
      if (mv.follow) { // pick a follow-up for Shadow Ambush or Sky Drop Kick
        if (this.followFor !== f.serial) {
          this.followFor = f.serial;
          const r = Math.random();
          const keys = Object.keys(mv.follow.opts);
          this.followBtn = mv.id === 'shadowCharge' ? (r < 0.3 ? 'lp' : r < 0.5 ? 'hp' : r < 0.75 ? 'lk' : 'hk') : f.key === 'staff' ? (r < 0.85 ? keys[Math.random() * keys.length | 0] : null) : (r < 0.4 ? 'lk' : r < 0.85 ? 'hk' : null);
          this.followAt = mv.follow.from + (Math.random() * 10 | 0);
        }
        if (mv.id === 'sweepStaff' && f.lastResult === 'hit') this.followBtn = null; // it launched: juggle instead
        const ready = f.mf >= this.followAt;
        if (this.followBtn && ready && f.mf <= mv.follow.to) { out.btn = this.followBtn; this.followBtn = null; }
        return out;
      }
      if (f.move.normal && f.hitConnected && !this.cancelTried && f.y <= 0 && f.mf > f.move.startup) {
        this.cancelTried = true;
        if (Math.random() < 0.5) { out.ff = true; out.btn = (N ? Math.random() < 0.5 : dist < 90 && Math.random() < 0.6) ? 'lk' : 'lp'; }
      }
      return out;
    }
    this.cancelTried = false;
    if (o.state === 'knock' && o.juggle && (f.state === 'stand' || f.state === 'crouch' || f.state === 'guard') && this.jugFor !== o.kdSerial + ':' + (o.ups || 0)) {
      this.jugFor = o.kdSerial + ':' + (o.ups || 0); // they're launched: finish with one of the sample combos
      if ((o.ups || 0) <= 1 && Math.random() < cpuP(0.4, 0.85)) { const r = pickRoute(f, 'juggle', dist); if (r) { this.route = r; return out; } }
    }
    if (o.state === 'stunned' && (f.state === 'stand' || f.state === 'crouch' || f.state === 'guard') && this.stunFor !== o.serial + ':' + o.st0) {
      this.stunFor = o.serial + ':' + o.st0;
      if (Math.random() < cpuP(0.5, 0.9)) { const r = pickRoute(f, 'stun', dist); if (r) { this.route = r; return out; } }
    }
    if (o.state === 'knock' && o.juggle && (f.state === 'stand' || f.state === 'crouch' || f.state === 'guard') && dist < 150) { // juggle a launched opponent
      if (dist > 72) { if (dist > 130 && f.state !== 'dash') out.dashTap = 1; else out.h = fwd; return out; } // chase them down
      if (o.y > 170) return out; // wait until they come down within reach
      out.btn = o.jug >= 3 ? 'hk' : (Math.random() < 0.6 ? 'lp' : 'hp'); return out;
    }
    const canAct = f.state === 'stand' || f.state === 'crouch' || f.state === 'guard';
    // like a player, it keeps holding guard as it comes out of a hit while they're still pressing (so a string can't just be restarted on it)
    if (f.state === 'hitstun' || f.state === 'blockstun') { if (!this.holdDecided) { this.holdDecided = true; this.holdGuard = Math.random() < (game.watch ? 0.6 : dif().block); } this.holdUntil = frame + 14; }
    else this.holdDecided = false;
    if (canAct && this.holdGuard && frame < this.holdUntil && dist < 170 && (o.state === 'attack' || o.atkCD > 0)) { out.h = -gdir; if (isLowAtk(o)) out.down = true; return out; }
    if (canAct && f.atkCD <= 0 && o.state === 'attack' && o.move && o.y <= 0 && this.routeReact !== o.serial && dist < 150) {
      this.routeReact = o.serial;
      const early = o.mf <= Math.min(3, o.move.startup);
      const kind = (!N && early && o.move.startup >= 12 && Math.random() < 0.5) ? 'parry' : (dist < 130 && o.move.startup - o.mf >= 8) ? 'counter' : null;
      if (kind && Math.random() < cpuP(0.2, 0.45)) { const r = pickRoute(f, kind, dist); if (r) { this.route = r; return out; } }
    }
    if (canAct && o.state === 'stunned' && f.atkCD <= 0) { // stunned: close in and launch them
      if (dist > 85) { if (dist > 170 && Math.random() < 0.15) out.dashTap = 1; else out.h = fwd; return out; }
      out.btn = 'hp'; out.down = true; return out;
    }
    if (canAct && o.state === 'attack' && o.move && (o.pre > 0 || (o.move.slow && o.mf < o.move.startup - 5)) && dist < 110 && this.interruptKey !== o.serial) {
      this.interruptKey = o.serial; // jab the opponent out of a slow turn or hand signs
      if (Math.random() < (o.pre > 0 ? 0.35 : (o.move.interruptChance || 0.6))) { out.btn = 'lp'; return out; }
    }
    if (o.state === 'attack' && o.move && o.move.walkAway && o.mf <= o.move.startup) { // try to step out of Shadow Leap
      if (this.evadeFor !== o.serial) { this.evadeFor = o.serial; this.evade = Math.random() < 0.5; }
      if (this.evade && (f.state === 'stand' || f.state === 'guard' || f.state === 'crouch')) { out.h = -(Math.sign(o.x - f.x) || f.facing); return out; }
    }
    const th = threatOf(f, o);
    if (th) {
      if (this.threatKey !== th.key) {
        this.threatKey = th.key; this.reactAt = frame + (game.watch ? 4 + Math.random() * 7 : dif().react[0] + Math.random() * (dif().react[1] - dif().react[0])) | 0; // reacts later against a player
        const r = Math.random(), jumpProj = game.watch ? 0.7 : 0.85, blockP = Math.max(game.watch ? 0.62 : dif().block, f.ch.cpuBlock || 0, th.kind === 'proj' && o.golem ? 0.85 : 0); // (Hohen's stones: guard them) // (more defensive: guards most attacks) // watching: a little less perfect defense, so more combos land
        this.def = (th.kind === 'high' && r < 0.3) ? 'duck' : r < blockP ? 'block' : (th.kind === 'proj' && r < jumpProj) ? 'jump' : (th.kind === 'air' && !N && r < 0.72) ? 'dp' : (th.kind === 'air' && r < 0.88) ? 'aa' : 'none';
        this.duckHit = false;
      }
    } else { this.threatKey = null; this.def = null; }
    const free = f.state === 'stand' || f.state === 'crouch' || f.state === 'guard' || f.state === 'blockstun' || f.state === 'charge' || f.state === 'recover';
    if (th && this.def && frame >= this.reactAt && free) {
      if (this.def === 'block') { out.h = -gdir; if (th.kind === 'low' || isLowAtk(o)) out.down = true; return out; } // (crouching for a low)
      if (this.def === 'duck') { // duck under a punch, then kick low
        out.down = true;
        if (!this.duckHit && o.mf > o.move.startup + o.move.active) { this.duckHit = true; out.btn = 'lk'; }
        return out;
      }
      if (this.def === 'jump') { this.def = 'none'; out.up = true; out.h = fwd; return out; }
      if (this.def === 'dp') { this.def = 'none'; out.btn = 'hp'; out.down = true; return out; }
      if (this.def === 'aa') { // anti-air: the rising palm, or the rising version of a special
        if (dist < 115 && o.y > 25) { this.def = 'none'; out.btn = 'lp'; if (Math.random() < 0.4) { if (N) out.bb = true; else out.ff = true; } }
        return out;
      }
    }
    if (f.state === 'jump') {
      if (f.ch.doubleJump && !f.dj && f.vy < 2 && f.vy > -4 && Math.random() < (o.state === 'attack' ? 0.3 : 0.02)) { out.up = true; out.upPress = true; out.h = fwd; return out; } // Mei's second jump
      if (!f.airAttacked && f.y > 60 && f.vy < 0 && dist > 50 && dist < 170 && Math.random() < 0.05) { out.btn = 'hk'; out.down = true; return out; } // dive kick
      if (!f.airAttacked && dist < 120 && f.vy < 0 && f.y < 110 && Math.random() < 0.35) out.btn = Math.random() < 0.5 ? 'hk' : 'hp';
      return out;
    }
    const actionable = f.state === 'stand' || f.state === 'crouch' || f.state === 'guard' || f.state === 'charge';
    if (actionable && (o.state === 'getup' || (o.wakeT > 0))) { // they're getting up and can't be hit yet: wait, and be ready
      this.wakeWait = o.kdSerial; if (dist < 90) out.h = -fwd * 0.5; return out; }
    if (actionable && this.wakeWait != null && o.state === 'stand' && !(o.wakeT > 0)) { // the moment they're hittable again: press in (or keep guarding)
      this.wakeWait = null; if (dist < 115 && Math.random() < (game.watch ? 0.7 : 0.55)) { out.btn = 'lp'; return out; } }
    if (actionable && !th && o.state === 'attack' && o.move && dist < 140 && o.mf <= o.move.startup && Math.random() < 0.5) { out.h = -gdir; if (isLowAtk(o)) out.down = true; return out; } // they're starting something nearby: guard first
    if (actionable && !th && o.state === 'attack' && o.move && o.move.normal && !o.move.air && o.mf > o.move.startup + o.move.active && dist < 105 && this.punishKey !== o.serial) {
      this.punishKey = o.serial;
      if (Math.random() < (game.watch ? 0.65 : dif().punish)) { out.btn = dist < 82 ? 'lp' : 'lk'; this.chargeUntil = 0; return out; }
    }
    if (frame < this.chargeUntil && f.meter < 100 && actionable && !th) { out.charge = true; return out; }
    if (frame >= this.next) { this.plan = this.decide(f, o, dist); this.next = frame + (game.watch ? 16 + Math.random() * 26 : dif().think[0] + Math.random() * (dif().think[1] - dif().think[0])) | 0; } // thinks less often against a player (and attacks less recklessly)
    const p = this.plan;
    if (p.walk) out.h = p.walk * fwd;
    if (p.crouch) out.down = true;
    if (p.jump) { out.up = true; out.h = p.jump * fwd; p.jump = 0; }
    if (p.dash) { out.dashTap = p.dash; p.dash = 0; }
    if (p.btn) {
      out.btn = p.btn; out.sup = !!p.sup; out.fuse = !!p.fuse; // (fuse: Hohen's ← → + J + K)
      if (p.ff) out.ff = true; else if (p.bb) out.bb = true; else if (p.dir === 'd') out.down = true;
      if (p.down) out.down = true; // rising version of a special
      p.btn = null;
    }
    if (p.chain) { this.chainSeq = p.chain.slice(); p.chain = null; }
    if (p.chargeMP) { this.chargeUntil = frame + p.chargeMP; p.chargeMP = 0; }
    return out;
  }
  decide(f, o, dist) {
    const N = f.key === 'ninja', r = Math.random(), s = Math.random() < 0.5 ? 'l' : 'h';
    if (f.golem && (f.fuseG >= 100 || f.meter >= 100)) { const hp = hohenPlan(f, o, dist, r); if (hp && (hp.fuse || hp.sup)) return hp; } // (Hohen: the armour or the super first, when they're ready)
    if (o.golem && Math.random() < 0.75) { const vg = vsGolemPlan(f, o, dist); if (vg) return vg; } // (against Hohen: over the golem, or through it)
    if (Math.random() < (game.watch ? (dist < 95 ? 0.1 : 0.5) : Math.min(0.6, 0.18 * dif().combo))) { const rt = pickRoute(f, 'neutral', dist); if (rt) { this.route = rt; return {}; } } // go for one of the sample combos
    if (f.meter >= 100 && dist < 520 && r < 0.3) return { btn: 'hp', sup: true };
    if (dist < 330 && Math.random() < 0.07) { // rising versions used on their own
      const opts = N ? (dist < 110 ? [{ btn: 'lp', bb: true, down: true }, { btn: 'hk', bb: true, down: true }] : [{ btn: 'hp', bb: true, down: true }, { btn: 'lk', ff: true, down: true }, { btn: 'hp', ff: true, down: true }])
        : (dist < 110 ? [{ btn: 'lp', ff: true, down: true }, { btn: 'hk', ff: true, down: true }, { btn: 'hk', bb: true, down: true }] : [{ btn: 'lp', bb: true, down: true }, { btn: 'hp', ff: true, down: true }]);
      return opts[Math.random() * opts.length | 0];
    }
    if (f.golem) { const hp = hohenPlan(f, o, dist, Math.random()); if (hp) return hp; } // Hohen: zones with stones and keeps the golem between them
    if (f.key === 'staff') { // Mei: jumps in a lot, pokes with the staff from mid range
      if (dist > 340) return r < 0.3 ? { dash: 1 } : r < 0.4 ? { jump: 1 } : (r < 0.6 && f.meter < 100) ? { chargeMP: rnd(40, 90) | 0 } : r < 0.7 ? { btn: 'hp', bb: true } : { walk: 1 };
      if (dist > 150) return r < 0.26 ? { btn: 'lp', ff: true } : r < 0.38 ? { btn: 'hp', ff: true } : r < 0.52 ? { btn: 'lk', ff: true } : r < 0.58 ? { jump: 1 } : r < 0.64 ? { btn: 'hp', bb: true }
        : r < 0.75 ? { btn: 'lp', bb: true } : r < 0.82 ? { dash: 1 } : { walk: 1 };
      if (r < 0.05) return { jump: 1 }; if (r < 0.13) return { btn: 'lp', bb: true }; if (r < 0.19) return { btn: 'hk', ff: true }; if (r < 0.25) return { btn: Math.random() < 0.5 ? 'hp' : 'hk' }; // long staff pokes
    }
    if (f.key === 'psychic') { // Lyra: keeps her distance and fights from afar
      if (dist > 380) return r < 0.3 ? { btn: 'lp', ff: true } : r < 0.45 ? { btn: 'hp', ff: true } : r < 0.55 ? { btn: 'lk', ff: true } : (r < 0.72 && f.meter < 100) ? { chargeMP: rnd(40, 100) | 0 } : r < 0.8 ? { btn: 'lp', bb: true } : { walk: 1 };
      if (dist > 150) return r < 0.22 ? { btn: 'lp', ff: true } : r < 0.34 ? { btn: 'hp', ff: true } : r < 0.44 ? { btn: 'lk', ff: true } : (r < 0.52 && dist < 250) ? { btn: 'hp', bb: true }
        : r < 0.58 ? { btn: 'hk', ff: true } : r < 0.66 ? { btn: 'lp', bb: true } : r < 0.72 ? { walk: -1 } : r < 0.78 ? { btn: 'lk', bb: true } : { walk: 1 };
      if (r < 0.15) return { btn: 'hk', ff: true }; if (r < 0.22) return { btn: 'lk', bb: true }; if (r < 0.28) return { dash: -1 }; if (r < 0.32) return { btn: 'hk', bb: true };
    }
    if (dist > 380) {
      if (N) return r < 0.3 ? { btn: 'lk', ff: true } : r < 0.4 ? { btn: 'hp', bb: true } : r < 0.5 ? { btn: 'hk', ff: true } : r < 0.6 ? { jump: 1 } : (r < 0.76 && f.meter < 100) ? { chargeMP: rnd(40, 100) | 0 } : { walk: 1 };
      return r < 0.22 ? { btn: s + 'p', ff: true } : (r < 0.45 && f.meter < 100) ? { chargeMP: rnd(40, 110) | 0 } : { walk: 1 };
    }
    if (dist > 150) {
      if (N) return (r < 0.08 && dist < 300) ? { btn: 'lp', ff: true } : r < 0.26 ? { btn: 'lk', ff: true } : (r < 0.32 && dist < 200) ? { btn: 'hp', ff: true } : r < 0.37 ? { btn: 'hk', ff: true }
        : (r < 0.45 && dist < 330) ? { btn: 'lp', bb: true } : r < 0.49 ? { btn: 'hp', bb: true } : r < 0.53 ? { btn: Math.random() < 0.5 ? 'lk' : 'hk', bb: true }
        : r < 0.63 ? { jump: 1 } : r < 0.75 ? { walk: -1 } : { walk: 1 };
      return (r < 0.16 && dist < 300) ? { btn: 'lk', ff: true } : r < 0.24 ? { btn: 'hp', ff: true } : r < 0.31 ? { btn: 'hk', bb: true } : r < 0.37 ? { btn: 'lp', bb: true }
        : r < 0.43 ? { btn: 'hk', ff: true } : r < 0.52 ? { jump: 1 } : r < 0.62 ? { btn: 'lp', ff: true } : r < 0.7 ? { dash: 1 } : { walk: 1 };
    }
    if (dist > 95 && Math.random() < (N ? 0.2 : 0.35)) return (N && dist > 110 && Math.random() < 0.4) ? { btn: 'hp', ff: true } : { btn: Math.random() < 0.5 ? 'hp' : 'hk' }; // long-reach poke (Kuro sometimes draws his sword)
    if (Math.random() < 0.05) return { dash: -1 }; // back dash out
    if (N && r < 0.14) return { walk: -1 };
    if (N && r < 0.17) return { btn: 'hk', ff: true };
    if (N && r < 0.21) return { btn: Math.random() < 0.5 ? 'lk' : 'hk', bb: true };
    if (N && r < 0.26) return { jump: -1 };
    if ((!N && r < 0.1) || Math.random() < 0.06) return { btn: 'hp', dir: 'd' }; // launcher
    if (r < 0.4) { // strings
      const list = [{ btn: 'lp', chain: ['lp', 'hp'] }, { btn: 'lp', chain: ['lp', 'lk'] }, { btn: 'lk', chain: ['lk', 'lk'] }, { btn: 'lk', chain: ['lk', 'hk'] },
        { btn: 'lp', chain: ['hp', 'hk'] }, { btn: 'lp', chain: ['hk'] }, { btn: 'lk', chain: ['hk'] }];
      return list[Math.random() * list.length | 0];
    }
    if (r < 0.45) return { btn: s + 'p' };
    if (r < 0.75) return { btn: s + 'k', dir: Math.random() < 0.35 ? 'd' : null };
    if (r < 0.85) return { crouch: true, walk: -1 };
    return { walk: 1 };
  }
}
// training dummy: guards, stands, jumps, or hands control to the CPU
// how the training dummy defends (T); repeating one of its own commands is set in the 技表's 相手 tab (game.repeat), on top of any of these
const DUMMY_MODES = ['guard', 'sguard', 'cguard', 'jump', 'stand'];
const DUMMY_LABEL_EN = { guard: 'Always guard', sguard: 'Stand guard', cguard: 'Crouch guard', jump: 'Jump', stand: 'No guard' };
const DUMMY_LABEL_JA = { guard: '常にガード', sguard: '立ちガード', cguard: 'しゃがみガード', jump: 'ジャンプ', stand: 'ガードなし' };
const DUMMY_LABEL = new Proxy({}, { get: (t, k) => (game.lang === 'ja' ? DUMMY_LABEL_JA : DUMMY_LABEL_EN)[k] });
class Dummy {
  constructor() { this.cpu = new CPU(); }
  reset() { this.cpu.reset(); this.rst = null; this.next = null; }
  read(f, frame, o) {
    if (game.demo) { // in Kuro's sample combos the dummy sometimes attacks once, so he can counter it
      const st = game.demoState, d = curDemos()[game.demoIdx];
      if (d.dummy && d.dummy.guard && st && st.phase === 'run') {
        if (f.state === 'blockstun') st.guardSeen = true; else if (st.guardSeen && d.dummy.guard !== 'all') st.guardDone = true; // 'all': keeps guarding the whole time
        if (!st.guardDone && (threatened(f, o) || f.state === 'blockstun')) return { h: -(golemGuardDir(f, o) || Math.sign(o.x - f.x) || f.facing), down: isLowAtk(o), up: false, btn: null, sup: false, ff: false, bb: false, charge: false };
        if (!st.guardDone) return { h: 0, down: false, up: false, btn: null, sup: false, ff: false, bb: false, charge: false };
      }
      if (d.dummy && d.dummy.steps && st && st.phase === 'run' && st.t >= (d.dummy.at || 0)) { st.dSt = st.dSt || { i: 0 }; const out = comboStep(f, o, d.dummy.steps, st.dSt, { h: 0, down: false, up: false, btn: null, sup: false, ff: false, bb: false, charge: false }); if (st.dSt.i >= d.dummy.steps.length) st.dummyDone = true; if (!st.dummyDone || out.btn) return out; }
      if (d.dummy && d.dummy.seq && st && st.phase === 'run') { const e = d.dummy.seq.find(q => q[0] === st.t); if (e) { if (e[2]) st.dummyDone = true; return { h: 0, down: false, up: false, btn: null, sup: false, ff: false, bb: false, charge: false, ...e[1] }; } } // (a sequence of presses: a whole string)
      if (d.dummy && d.dummy.inp && st && st.phase === 'run' && !st.dummyDone && st.t >= (d.dummy.at || 0)) { st.dummyDone = true; return { h: 0, down: false, up: false, btn: null, sup: false, ff: false, bb: false, charge: false, ...d.dummy.inp }; }
      if (d.dummy && d.dummy.guardAfter && st && st.dummyDone && f.state !== 'attack' && (threatened(f, o) || f.state === 'blockstun')) return { h: -(golemGuardDir(f, o) || Math.sign(o.x - f.x) || f.facing), down: isLowAtk(o), up: false, btn: null, sup: false, ff: false, bb: false, charge: false }; // (a punish sample: once its technique is over, the opponent guards — only a real punish gets in)
    }
    if (game.repeat) { const r = this.repeat(f, frame, o); if (r) return r; } // (its command, when it's time; otherwise it defends as set)
    const out = { h: 0, down: false, up: false, btn: null, sup: false, ff: false, bb: false, charge: false }, threat = threatened(f, o) || f.state === 'blockstun' || f.state === 'hitstun';
    const away = -(golemGuardDir(f, o) || Math.sign(o.x - f.x) || f.facing);
    if (game.dummyMode === 'guard' && threat) { out.h = away; out.down = isLowAtk(o); } // always guard: at the right height
    if (game.dummyMode === 'sguard' && threat) out.h = away; // stand guard: lows get through
    if (game.dummyMode === 'cguard') { out.down = true; if (threat) out.h = away; } // crouch guard: only lows are stopped
    if (game.dummyMode === 'jump') out.up = true;
    return out;
  }
  // punish training: the chosen command (game.repeat, picked in the training bar), again and again — walks in to striking distance,
  // does it, then waits the chosen interval before the next one
  repeat(f, frame, o) {
    const R = game.repeat, idle = null; // (null: not now — it defends as set)
    if (!R) return idle;
    if (this.rid !== R.id) { this.rid = R.id; this.rst = null; this.next = frame + 30; }
    if (this.rst) { // doing it
      const out = comboStep(f, o, R.steps, this.rst, { ...EMPTY });
      if ((this.rst.i >= R.steps.length && f.state !== 'attack' && f.y <= 0) || frame - this.rt0 > 420) { this.rst = null; this.next = frame + R.every; }
      return out;
    }
    if (frame < this.next || !((f.state === 'stand' || f.state === 'crouch') && f.atkCD <= 0)) return idle;
    if (R.sup) f.meter = 100; // (a super needs a full gauge)
    this.rst = { i: 0 }; this.rt0 = frame;
    return comboStep(f, o, R.steps, this.rst, { ...EMPTY });
  }
}

