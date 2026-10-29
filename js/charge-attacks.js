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
// Jesse's charge shots: hold the button and the gun gathers power — a medium shot at 0.4 s, a high shot at 0.9 s (it fires by itself at 1.4 s)
const GUN_LV = [24, 54];
function gunCharge(f, o, mf, fire) {
  const mv = f.move;
  if (!mv.fired) {
    mv.chargeMarks = [[GUN_LV[0], 'Lv1'], [GUN_LV[1], 'MAX']];
    f.vx *= 0.6; mv.lvl = mf >= GUN_LV[1] ? 2 : mf >= GUN_LV[0] ? 1 : 0;
    if (GUN_LV.includes(mf)) { sfx('charge'); parts.push({ type: 'ring', x: f.x + f.facing * 70, y: GROUND - f.y - 118, r: 26 + mv.lvl * 8, vr: -1.6, life: 14, max: 14, col: '255,200,110' }); }
    if (mv.lvl && mf % 2 === 0) { const an = rnd(0, Math.PI * 2), r = rnd(30, 60); parts.push({ type: 'spark', x: f.x + f.facing * 70 + Math.cos(an) * r, y: GROUND - f.y - 118 + Math.sin(an) * r, vx: -Math.cos(an) * r / 8, vy: -Math.sin(an) * r / 8, life: 8, max: 8, col: mv.lvl === 2 ? '255,170,80' : '255,220,140' }); }
    if (!holding(f) || mf >= 84) { mv.fired = true; mv.startup = mv.lvl ? mf + 4 : Math.max(mf + 2, heavyTap(mv.tapStartup || 9)); mv.recovery = [18, 22, 28][mv.lvl]; fire(f, o, 'name'); } // (a tap fires at the normal speed)
    return;
  }
  if (mf === mv.startup) fire(f, o, 'shoot');
  if (mf > mv.startup) { f.vx *= 0.8; if (o.state === 'knock' && o.juggle) mv.recovery = Math.min(mv.recovery, 6); } // quick to follow a launch
}
function mf0(f) { return f.mf; }
function twinCharge(f, o, mf) { return gunCharge(f, o, mf, (f, o, what) => { const L = f.move.lvl;
  if (what === 'name') { f.move.label = ['Twin Shot', 'Charged Twin Shot', 'Thunder Shot'][L]; f.move.pose = L === 2 ? 'gRecoil' : 'gTwin'; return; }
  if (L === 0) { shoot(f, { y: 122, dmg: 22, range: 290 }); shoot(f, { y: 116, dmg: 22, range: 290 }); return; } // (a tap: just the two shots)
  const near = Math.abs(o.x - f.x) < 230; // up close the charged shots set up a combo
  if (L === 1) { shoot(f, { y: 124, dmg: 34, push: near ? 1 : 4, stun: 30, range: 380, lvl: 1 }); shoot(f, { y: 120, dmg: 34, push: near ? 1 : 4, stun: 30, range: 380, lvl: 1 }); }
  else shoot(f, { y: 128, dmg: 80, push: 6, range: 760, lvl: 2, pierce: true, stun: 26, ...(near ? { launch: true, launchVy: 12.5, jugVy: 11 } : { kd: true }) }); }); }
// the kappa's throws: grab, then swing them over his head to the other side
function kappaToss(f, o, mf) {
  const mv = f.move;
  if (mf < mv.startup) f.vx = Math.abs(o.x - f.x) > 70 ? f.facing * 2 : 0; else f.vx *= 0.6;
  if (f.hitConnected && f.lastResult !== 'block' && !mv.tossed) {
    mv.tossed = true; o.x = clamp(f.x - f.facing * 64, WALL_L, WALL_R);
    dustAt(o.x, true); sfx('hitH'); game.shake = Math.max(game.shake, 5); popText(f.x, GROUND - 190, 'TOSS!', '150,215,255');
  }
}
