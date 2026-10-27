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
      if (!mv.lvl) mv.startup = Math.max(mf + 2, heavyTap(mv.tapStartup)); // a tap is a heavy attack too: a full wind-up
      else { const L = mv.chargeLv[mv.lvl - 1]; Object.assign(mv, L.set); mv.startup = mf + (L.rel || 6); if (L.dash) { mv.dashLeft = lerp(W / 4 - 30, W / 2 - 34, clamp((mf - 30) / 41, 0, 1)); mv.dashV = mv.dashLeft / (L.rel || 6); } if (L.onFire) L.onFire(f, o); sfx('draw'); } // (a dash covers a quarter to half the stage)
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
function heavyCharge(f, o, mf) { return gunCharge(f, o, mf, (f, o, what) => { const L = f.move.lvl;
  if (what === 'name') { f.move.label = ['Heavy Shot', 'Charged Heavy Shot', 'Buffalo Blast'][L]; f.move.pose = 'gRecoil'; return; }
  if (L === 0) shoot(f, { y: 122, dmg: 50, big: true, kd: true, range: 300 });
  else if (L === 1) shoot(f, { y: 122, dmg: 70, push: 6, range: 400, lvl: 1, ...(Math.abs(o.x - f.x) < 230 ? { launch: true, launchVy: 11.5, jugVy: 10 } : { kd: true }) });
  else { shoot(f, { y: 128, dmg: 72, range: 300, lvl: 2, launch: true, launchVy: 12.5, jugVy: 10 }); // one huge blast of pellets: it launches
    for (const vy of [-4, 4]) for (let i = 0; i < 4; i++) parts.push({ type: 'spark', x: f.x + f.facing * 80, y: GROUND - f.y - 118, vx: f.facing * rnd(8, 14), vy: vy * rnd(0.6, 1.2), life: 12, max: 12, col: '255,190,90' }); } }); }
// the kappa's throws: grab, then swing them over his head to the other side
function kappaToss(f, o, mf) {
  const mv = f.move;
  if (mf < mv.startup) f.vx = Math.abs(o.x - f.x) > 70 ? f.facing * 2 : 0; else f.vx *= 0.6;
  if (f.hitConnected && f.lastResult !== 'block' && !mv.tossed) {
    mv.tossed = true; o.x = clamp(f.x - f.facing * 64, WALL_L, WALL_R);
    dustAt(o.x, true); sfx('hitH'); game.shake = Math.max(game.shake, 5); popText(f.x, GROUND - 190, 'TOSS!', '150,215,255');
  }
}
// Aldric's held heavies: hold the button to gather light (a cross per level above his helm), let go to strike
const CHARGE_LV = [60, 120, 180]; // one level per second of holding, three seconds for the maximum
function chargeLevel(f, mf, rel) {
  const mv = f.move;
  if (mv.fired) return false;
  mv.chargeMarks = [[CHARGE_LV[0], 'Lv1'], [CHARGE_LV[1], 'Lv2'], [CHARGE_LV[2], 'MAX']]; // (Aldric: one level per second)
  if (mv.dmgFixed && !mv.baseSet) { mv.baseSet = true; mv.dmg = mv.dmgFixed; }
  f.vx *= 0.6; mv.lvl = mf >= CHARGE_LV[2] ? 3 : mf >= CHARGE_LV[1] ? 2 : mf >= CHARGE_LV[0] ? 1 : 0;
  if (CHARGE_LV.includes(mf)) { sfx('charge'); parts.push({ type: 'ring', x: f.x + f.facing * 30, y: GROUND - 120, r: 14 + mv.lvl * 4, vr: -0.8, life: 14, max: 14, col: '190,225,255' }); }
  if (!holding(f) || mf >= CHARGE_LV[2]) { mv.fired = true; mv.startup = mf + (mv.lvl ? rel : heavyTap(rel)); sfx('draw'); return 'fire'; }
  return true;
}
function chargeCleave(f, o, mf) { // I: Heavy Cleave. Lv2 smashes guard, Lv3 Heaven Splitter: bounces them and sends a wave of light along the ground
  const st = chargeLevel(f, mf, 9), mv = f.move;
  if (st === 'fire') {
    if (mv.lvl === 1) Object.assign(mv, { label: 'Heavy Cleave Lv1', dmg: Math.round(mv.dmg * 1.12), gdrain: 26, kdVx: 8, hitstop: 13 });
    if (mv.lvl === 2) Object.assign(mv, { label: 'Heavy Cleave Lv2', dmg: Math.round(mv.dmg * 1.25), gdrain: 45, kdVx: 9, hitstop: 14 });
    if (mv.lvl === 3) Object.assign(mv, { label: 'Heaven Splitter', dmg: Math.round(mv.dmg * 1.35), gdrain: 60, kd: false, kdVx: 0, push: 1, launch: true, launchVy: 12.5, hitstop: 16 });
  }
  if (st) return;
  if (mv.lvl === 3) hitRecover(f, 8);
  if (mf === mv.startup + 1) { dustAt(f.x + f.facing * 120, true); game.shake = Math.max(game.shake, mv.lvl * 2 + 2); sfx(mv.lvl > 1 ? 'hitH' : 'land');
    if (mv.lvl === 3) { cracks(f.x + f.facing * 120); spawnHolyWave(f); } }
}
// K: a tap is a short pushing thrust. Held, the blade gathers light into a giant aura sword raised over his head: Excalibur.
// Let go and he swings it down: Lv1 reaches a fifth of the stage, Lv2 a third, Lv3 (three seconds) half the stage
const EXCAL = [0, 200, 320, 480];
function chargeThrust(f, o, mf) {
  const st = chargeLevel(f, mf, 9), mv = f.move;
  if (st === 'fire') {
    if (mv.lvl === 0) Object.assign(mv, { label: 'Short Thrust', push: 7, bpush: 6, startup: mf + heavyTap(5), recovery: 16, kd: false, gdrain: 8 }); // (a tap is a heavy attack too: a full wind-up)
    else Object.assign(mv, { label: mv.lvl === 3 ? 'Excalibur' : 'Excalibur Lv' + mv.lvl, excal: EXCAL[mv.lvl], dmg: Math.round(mv.dmg * [1, 1.15, 1.3, 1.55][mv.lvl]),
      gdrain: [0, 20, 30, 40][mv.lvl], hitbox: [10, EXCAL[mv.lvl], 0, 230], wrist: undefined, pose: 'pCleave', kd: mv.lvl < 3, kdVx: 9, kdVy: 9,
      launch: mv.lvl === 3, launchVy: 10, bounce: mv.lvl === 3, hitstop: 12 + mv.lvl * 2, active: 6, recovery: 26 });
  }
  if (st) return;
  if (!mv.excal) { if (mf <= mv.startup) f.vx = f.facing * 4; else f.vx *= 0.6; return; }
  f.vx *= 0.5; hitRecover(f, 10);
  if (mf === mv.startup) { sfx('slash'); sfx('hitH'); game.shake = Math.max(game.shake, 3 + mv.lvl * 2); cracks(f.x + f.facing * Math.min(mv.excal - 40, 300));
    for (let i = 0; i < 6; i++) parts.push({ type: 'spark', x: f.x + f.facing * rnd(60, mv.excal), y: GROUND - rnd(4, 30), vx: rnd(-2, 2), vy: -rnd(2, 5), life: 16, max: 16, col: '220,240,255' }); }
}
function excaliburFX(f) { // the aura sword: raised and growing while he charges, then swung down
  const mv = f.move; if (!mv) return;
  const charging = !mv.fired && mv.lvl >= 1, s = f.ch.scale;
  if (!charging && !mv.excal) return;
  let L, an, a = 1;
  if (charging) { L = EXCAL[mv.lvl] * Math.min(1, 0.6 + 0.4 * ((f.mf % 60) / 60 + (mv.lvl === 3 ? 1 : 0))); an = -Math.PI / 2 - 0.12; a = 0.55 + 0.15 * Math.sin(globalT * 0.3); }
  else { const e = clamp((f.mf - (mv.startup - 4)) / 6, 0, 1); L = mv.excal; an = lerp(-Math.PI / 2 - 0.12, 0.12, ease(e)); if (f.mf > mv.startup + 8) a = Math.max(0, 1 - (f.mf - mv.startup - 8) / 10); }
  if (a <= 0) return;
  const bx = f.x + f.facing * 10 * s, by = GROUND - f.y - 128 * s, dx = Math.cos(an) * f.facing, dy = Math.sin(an), nx = -dy, ny = dx, w = 10 + L * 0.05;
  fxLighter(() => {
    const g = ctx.createLinearGradient(bx, by, bx + dx * L, by + dy * L); g.addColorStop(0, `rgba(190,225,255,${0.85 * a})`); g.addColorStop(1, `rgba(255,255,255,${0.95 * a})`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(bx + nx * w, by + ny * w); ctx.lineTo(bx + dx * L * 0.9 + nx * w * 0.8, by + dy * L * 0.9 + ny * w * 0.8); ctx.lineTo(bx + dx * L, by + dy * L);
    ctx.lineTo(bx + dx * L * 0.9 - nx * w * 0.8, by + dy * L * 0.9 - ny * w * 0.8); ctx.lineTo(bx - nx * w, by - ny * w); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${0.8 * a})`; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = `rgba(255,220,140,${0.9 * a})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx + nx * w * 2.4, by + ny * w * 2.4); ctx.lineTo(bx - nx * w * 2.4, by - ny * w * 2.4); ctx.stroke(); // crossguard
    if (!charging && f.mf >= mv.startup && f.mf <= mv.startup + 8) { ctx.strokeStyle = `rgba(190,225,255,${0.5 * a})`; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(bx, by, L * 0.92, f.facing > 0 ? -Math.PI / 2 : -Math.PI / 2, f.facing > 0 ? 0.1 : Math.PI - 0.1, f.facing < 0); ctx.stroke(); } // the arc of the swing
  });
}
