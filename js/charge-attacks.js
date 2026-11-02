'use strict';
/* ================= charge attacks (hold a heavy button) ================= */
// loaded before characters.js, which hands these to the fighters' heavy attacks
function shoveRun(f, o, mf) { const mv = f.move; if (mf <= mv.startup) f.vx = Math.abs(o.x - f.x) > 70 ? f.facing * 3 : 0; else hopBack(f, mv.startup + mv.active, 14, 9); if (mf === mv.startup) sfx('palm'); }
// hold I: a short charge (0.5 s) gives a move that leads into a combo, a long one (1.2 s) one that sends them flying; a tap is the normal heavy
function chargedHeavy(f, o, mf) {
  const mv = f.move;
  if (!mv.fired) {
    mv.chargeMarks = [[30, 'Lv1'], [72, 'MAX']];
    f.vx *= 0.6; mv.lvl = mf >= 72 ? 2 : mf >= 30 ? 1 : 0;
    if (mf === 30 || mf === 72) { sfx('charge'); parts.push({ type: 'ring', x: f.x, y: GROUND - f.y - 100, r: 40 + mv.lvl * 14, vr: -2, life: 14, max: 14, col: f.ch.auraCol }); }
    if (!holding(f) || mf >= 100) {
      mv.fired = true;
      const FM = f.ch.frameMod; // (the fighter's own frame tuning, as for his other heavy attacks: see startMove)
      if (!mv.lvl) mv.startup = Math.max(mf + 2, heavyTap(mv.tapStartup) - (FM ? FM.su.heavy : 0)); // a tap is a heavy attack too: a full wind-up
      else { const L = mv.chargeLv[mv.lvl - 1]; Object.assign(mv, L.set); mv.startup = mf + (L.rel || 6); if (L.dash) { mv.dashLeft = lerp(110, MOVE_TRAVEL, clamp((mf - 30) / 41, 0, 1)); mv.dashV = mv.dashLeft / (L.rel || 6); } if (L.onFire) L.onFire(f, o); sfx('draw'); } // (a dash covers 110 to 180: never more than any attack carries its user)
      if (FM) { mv.active += FM.act; mv.recovery += FM.rec.heavy; mv.fmRec = FM.rec.heavy; }
    }
    return;
  }
  const L = mv.lvl ? mv.chargeLv[mv.lvl - 1] : null;
  if (L) { if (L.act) L.act(f, o, mf); else f.vx *= 0.7; if (mf > mv.startup && o.state === 'knock' && o.juggle) mv.recovery = Math.min(mv.recovery, 8); }
  else { const lg = mv.tapLunge; if (mf <= mv.startup && Math.abs(o.x - f.x) > 80) f.vx = f.facing * (lg ? lg[2] : 3); else f.vx *= 0.6; }
}
function makeCharged(key, levels) { const h = CHARS[key].heavy.p; Object.assign(h, { held: true, tapStartup: h.startup, tapLunge: h.lunge, startup: 999, chargeLv: levels, onFrame: chargedHeavy }); }
function mf0(f) { return f.mf; }
// the kappa's throws: grab, then swing them over his head to the other side
const kappaHolding = f => f.move.grabT != null && !f.move.broken && game.frame - f.move.grabT < GRAB_WINDOW;
const kappaHold = (f, mf) => { if (!kappaHolding(f)) return null; const p = { ...POSES[/Sumo/.test(f.move.label) ? 'kSumoHold' : 'kLiftHold'] }, w = Math.sin(globalT * 0.6); p.t += w * 3; return p; }; // (holding them while they struggle: J a low sumo grip round the waist, K hoisting them up — not yet the toss)
function kappaToss(f, o, mf) {
  const mv = f.move;
  if (mf < mv.startup) f.vx = Math.abs(o.x - f.x) > 70 ? f.facing * 2 : 0; else f.vx *= 0.6;
  if (kappaHolding(f) && !/Sumo/.test(mv.label) && mf % 3 === 0) { const an = mf * 0.5; parts.push({ type: 'aura', x: o.x + Math.cos(an) * 40, y: GROUND - o.y - 40 - (mf % 9) * 8, vx: -Math.sin(an) * 2, vy: -1.2, life: 14, max: 14, r: 4, col: '150,215,255' }); } // (the whirlpool grip: water swirling up round them)
  if (f.hitConnected && f.lastResult !== 'block' && !mv.tossed) {
    mv.tossed = true; o.x = clamp(f.x - f.facing * 64, WALL_L, WALL_R);
    dustAt(o.x, true); sfx('hitH'); game.shake = Math.max(game.shake, 5); popText(f.x, GROUND - 190, 'TOSS!', '150,215,255');
  }
}
