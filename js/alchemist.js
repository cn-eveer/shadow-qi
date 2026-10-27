'use strict';
/* ================= the Alchemist and his stone golem =================
   The alchemist doesn't fight himself: he points, and his golem does it. The golem is not a second fighter but a small
   object riding on the alchemist (f.golem). It walks to the opponent by itself (wherever they are, even between the two
   of them), punches on its own when it's next to them, and obeys U, I, J and K. Its blows are resolved from the golem's own
   position, so a defender guards relative to whoever is attacking: the golem's side for the golem, the alchemist's for him. */
CHARS.alchemist = {
  name: 'ALCHEMIST', title: 'Golem Master', nameJa: '錬金術師', titleJa: 'ゴーレム使い', dmgMul: 1, scale: 1, walk: 3.0, back: 2.6, jumpX: 4.0, jumpV: 17, jugDmg: 1,
  pDmg: 1, kDmg: 1, pReach: 1, kReach: 1, chargeRate: 0.6, auraCol: '255,200,120', fxCol: '255,200,120',
  sp: {}, sup: null, // (his own super comes later)
  normalLook: {},
  colors: { coat: '#f4f6f8', coatB: '#d4d9de', pants: '#3a3f4f', pantsB: '#2b2f3b', shoe: '#2a2a30', shirt: '#cfe3f2', skin: '#efc9a4', hair: '#8e8f96', glass: '#2a2a30', stetho: '#2b2b33' },
  meterCol: ['#d98a2c', '#ffe0a8'], bannerCol: 'rgba(150,110,60,.9)', idle: 'idle', chargePose: 'gAim', winPose: 'win', atkCD: 8, recoverT: 10, hitFx: 'star',
};
Object.assign(CHARS.alchemist, { altColors: { ...CHARS.alchemist.colors, coat: '#d9e6dc', coatB: '#b7c9bb', shirt: '#f0d8c0', hair: '#4a3b2e' } });
Object.assign(POSES, { // throwing a stone: the arm drawn back behind him with the weight on the back foot, then whipped through and forward
  alThrowW: P(-14, -105,-150, 30,60, 22,10, -26,-14),
  alThrow: P(26, 112,78, -20,20, 36,6, -24,-10),
  alThrowLow: P(30, 70,86, -10,30, 40,4, -26,-12) });
{ // every button is an order to the golem (standing, crouching and in the air); the alchemist himself only points
  const order = (kind, label, pose, st, ex) => ({ label, startup: 6, active: 2, recovery: 12, wind: 'idle', pose, hitbox: null, chain: null, launch: false, kd: false, ...ex, onFrame: (f, o, mf) => { if (mf === f.move.startup) { if (kind === 'stone' || kind === 'stones') alchemistThrow(f, o, kind); else golemOrder(f, kind); } } });
  const L = CHARS.alchemist.normalLook;
  for (const st of ['s', 'c', 'j']) {
    const ex = st === 'j' ? {} : { startup: 6 };
    L[st + 'p0'] = order(st === 'c' ? 'lowp' : 'lp', st === 'c' ? 'Order: Low Punch' : 'Order: Punch', st === 'c' ? 'gLow' : 'gAim', st, ex); L[st + 'p1'] = order('hp', 'Order: Smash', 'gTwin', st, ex);
    const th = { startup: 9, recovery: 14 }; L[st + 'k0'] = order('stone', 'Stone Throw', 'alThrowLow', st, { ...ex, ...th, wind: 'alThrowW' }); L[st + 'k1'] = order('stones', 'Stone Volley', 'alThrow', st, { ...ex, ...th, startup: 11, wind: 'alThrowW' });
  }
}
const GOLEM_ACT = { // startup / active / recovery (frames), and the blow
  lp: { su: 7, ac: 3, rec: 12, reach: [10, 85], y: [10, 135], h: { dmg: 28, stun: 19, bstun: 11, push: 1.6, hitstop: 6, str: 0, gdrain: 4, label: 'Golem Punch' } },
  hp: { su: 14, ac: 4, rec: 20, reach: [10, 105], y: [10, 140], h: { dmg: 62, stun: 24, bstun: 14, push: 3, hitstop: 10, str: 1, gdrain: 14, kd: true, kdVx: 9, kdVy: 7, label: 'Golem Smash', heavy: true } },
  lowp: { su: 8, ac: 3, rec: 14, reach: [10, 95], y: [0, 40], h: { dmg: 26, stun: 19, bstun: 11, push: 1.6, hitstop: 6, str: 0, gdrain: 4, low: true, label: 'Golem Low Punch' } },
};
function newGolem(f) { return { x: f.x - f.facing * 90, facing: f.facing, act: null, queue: null, qT: 0, cd: 30, dashT: 0, ph: 0, spd: 0, y: 0, vy: 0, js: 0, crouch: false }; }
function golemOrder(f, kind) { const g = f.golem; if (g && !f.ko) { g.queue = kind; g.qT = 0; } }
function golemStart(f, kind, auto) { const g = f.golem, o = other(f); g.facing = Math.sign(o.x - g.x) || g.facing; g.act = { kind, t: 0, id: ++serial, hit: false, auto: !!auto }; g.queue = null; if (kind === 'hp') sfx('swing'); }
function alchemistThrow(f, o, kind) { // he throws his own glowing stones: low (J), or low and medium (K); in the air they are aimed at the opponent
  const d = f.facing, ys = kind === 'stone' ? [24] : [24, 54, 84], cols = ['110,255,220', '255,190,80', '150,170,255'], air = f.y > 20;
  ys.forEach((y, i) => {
    const x0 = f.x + d * 40, y0 = f.y + (air ? 70 : y), h = { dmg: kind === 'stone' ? 26 : 18, stun: 17, bstun: 10, push: 1.4, gdrain: 6, hitstop: 5, low: !air && y < 40, label: kind === 'stone' ? 'Stone Throw' : 'Stone Volley' };
    let vx = d * (9 + i * 0.8), vy = 0;
    if (air) { const an = Math.atan2(o.y + 60 - y0, o.x - x0) + (i - (ys.length - 1) / 2) * 0.16, sp = 11; vx = Math.cos(an) * sp; vy = Math.sin(an) * sp; } // (a volley fans out a little)
    spawnPJ(f, 'stone', { dir: Math.sign(vx) || d, x: x0, y: y0, vx, vy, life: 64, r: 11, glow: cols[i % 3], h });
  });
  sfx('throw');
}
function golemHit(f, o, h, hb, hu) { // resolved as if the golem were the attacker: its side decides the guard
  const g = f.golem, sv = [f.x, f.facing, f.vx, f.serial]; f.x = g.x; f.facing = g.facing; f.serial = g.act.id;
  let res; try { res = applyHit(f, o, h, Math.sign(o.x - g.x) || g.facing, hb, hu); } finally { [f.x, f.facing, f.vx, f.serial] = sv; }
  return res;
}
function golemUpdate(f, o) {
  const g = f.golem; if (!g) return;
  const live = game.phase === 'fight' && !f.ko && !o.ko, dx = o.x - g.x, dir = Math.sign(dx) || g.facing, dist = Math.abs(dx);
  if (f.inp && f.inp.dashTap === 1) g.dashT = 18; // → → : the golem runs in too
  if (g.dashT > 0) g.dashT--;
  if (g.cd > 0) g.cd--;
  g.spd = 0;
  const inp = f.inp || EMPTY; // the golem copies the alchemist: where he walks, when he jumps or crouches
  if (g.js !== f.jumpSerial) { g.js = f.jumpSerial; if (f.state === 'jump' && g.y <= 0) g.vy = f.ch.jumpV || JUMP_V; }
  if (g.y > 0 || g.vy > 0) { g.vy -= G; g.y += g.vy; if (g.y <= 0) { g.y = 0; g.vy = 0; dustAt(g.x, false); } }
  g.crouch = !!inp.down && g.y <= 0;
  if (!live) { g.act = null; g.queue = null; return; }
  const a = g.act;
  if (a) {
    const A = GOLEM_ACT[a.kind]; a.t++;
    if (a.t <= A.su && dist > 70 && A.reach) { g.x += dir * 1.6; g.spd = 1.6; }
    if (A.reach) {
      if (a.t > A.su && a.t <= A.su + A.ac && !a.hit) {
        const x0 = g.x + g.facing * A.reach[0], x1 = g.x + g.facing * A.reach[1], hb = { x0: Math.min(x0, x1), x1: Math.max(x0, x1), y0: A.y[0] + g.y, y1: A.y[1] + g.y }, hu = hurtbox(o, false, false);
        if (hu && overlap(hb, hu)) { const res = golemHit(f, o, { type: 'mid', chip: false, proj: false, gbstun: 45, ...A.h }, hb, hu); if (res) a.hit = true; }
      }
    }
    if (a.t >= A.su + A.ac + A.rec) { g.act = null; g.cd = a.auto ? 36 : 10; }
  } else {
    g.facing = dir;
    const q = g.queue;
    if (q) { g.qT++; if (dist <= 100) golemStart(f, q, false); else if (g.qT > 70) g.queue = null; }
    else if (dist < 95 && g.cd <= 0) golemStart(f, 'lp', true); // next to them it punches on its own
    if (!g.act) {
      if (inp.h) { const sp = g.dashT > 0 ? 7 : g.y > 0 ? 3.5 : 2.6; g.x += Math.sign(inp.h) * sp; g.spd = sp; } // his movement comes first
      else if (g.y <= 0 && !g.crouch && dist > (q ? 80 : 60)) { const sp = g.dashT > 0 || q ? 6.5 : 2.5; g.x += dir * sp; g.spd = sp; } // otherwise it walks to the opponent itself
    }
  }
  g.x = clamp(g.x, WALL_L, WALL_R); g.ph += g.spd * 0.09;
}
// the direction a defender guards in while the golem is the one attacking (0 when it isn't)
function golemGuardDir(f, o) { const g = o && o.golem; return g && g.act && golemThreatening(f, o) ? (Math.sign(g.x - f.x) || 0) : 0; }
function golemThreatening(f, o) { const g = o.golem, a = g.act, A = a && GOLEM_ACT[a.kind]; return !!(A && A.reach && a.t <= A.su + A.ac + 2 && Math.abs(g.x - f.x) < 220); }
function golemThreat(f, o) { return o.golem && o.golem.act && golemThreatening(f, o) ? { key: 'g' + o.golem.act.id, kind: 'mid' } : null; }

/* ---------- drawing ---------- */
const GEMS = [['110,255,220', -0.5], ['255,190,80', 0], ['150,170,255', 0.5]]; // glowing stones on his chest
function gemGlow(p, col, r, t) { const g = ctx.createRadialGradient(p[0], p[1], 0.5, p[0], p[1], r * 2.6); g.addColorStop(0, `rgba(${col},.95)`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r * 2.6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = `rgba(255,255,255,.9)`; ctx.beginPath(); ctx.arc(p[0], p[1], r * 0.55, 0, Math.PI * 2); ctx.fill(); }
function drawAlchemist(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]], fx = !o.tint && !o.flash;
  const add = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k];
  seg(J.hip, J.k2, 10, C.pantsB); seg(J.k2, J.f2, 9, C.pantsB); foot(J.k2, J.f2, 8.5, 6.5, C.shoe);
  seg(J.hip, J.k1, 10, C.pants); seg(J.k1, J.f1, 9, C.pants); foot(J.k1, J.f1, 9, 6.5, C.shoe);
  seg(J.sh, J.e2, 9, C.coatB); seg(J.e2, J.h2, 8, C.coatB); dot(J.h2, 4.6, C.skin);
  seg(J.hip, J.sh, 21, C.coat);                                                                                     // the white coat
  const bl = add(J.hip, n, -15), br = add(J.hip, n, 15); bl[0] -= td[0] * 34; bl[1] -= td[1] * 34; br[0] -= td[0] * 34; br[1] -= td[1] * 34;
  ctx.fillStyle = C.coat; ctx.beginPath(); ctx.moveTo(...add(J.hip, n, -10)); ctx.lineTo(...bl); ctx.lineTo(...br); ctx.lineTo(...add(J.hip, n, 10)); ctx.closePath(); ctx.fill(); // its skirts, down to the knees
  seg(add(J.hip, td, -20), add(add(J.hip, td, -20), n, 14), 1.6, C.coatB);                                                // the hem's fold
  seg(mid(J.hip, J.sh, 0.5), [J.sh[0] + n[0] * 3, J.sh[1] + n[1] * 3], 6, C.shirt);                                   // the shirt under the lapels
  const nk = [J.sh[0] + n[0] * 2, J.sh[1] + n[1] * 2], ch = mid(J.hip, J.sh, 0.45);
  ctx.strokeStyle = C.stetho; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(J.sh[0] - n[0] * 6, J.sh[1] - n[1] * 6); ctx.quadraticCurveTo(ch[0] - n[0] * 5, ch[1] - 6, ch[0] + n[0] * 5, ch[1] - 2); ctx.quadraticCurveTo(ch[0] + n[0] * 8, ch[1] + 2, nk[0], nk[1]); ctx.stroke(); // a stethoscope round his neck
  if (fx) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pu = 0.75 + 0.25 * Math.sin(t * 0.12); // glowing stones: three on the chest, one in each pocket
    GEMS.forEach(([c, k], i) => gemGlow(add(add(mid(J.hip, J.sh, 0.62 + (i === 1 ? 0.08 : 0)), n, 9), td, k * 6 - 3 * (i === 1)), c, 5 * (0.8 + 0.2 * Math.sin(t * 0.1 + i * 2)) * pu, t));
    const pk = add(J.hip, td, -10); gemGlow(add(pk, n, 12), '255,120,110', 4.4 * pu, t); gemGlow(add(pk, n, -8), '120,255,160', 4.4 * (1.05 - pu * 0.2), t);
    ctx.restore(); }
  seg(J.sh, J.head, 8, C.skin);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1])); ctx.scale(1.15, 1.15);
  dot([0, 0], 11, C.skin); ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(-1, 2, 11.5, Math.PI * 0.05, Math.PI * 1.15); ctx.closePath(); ctx.fill();   // grey, swept-back hair
  dot([-6, -1], 2.4, C.skin);
  const hurt = o.face === 'hitstun' || o.face === 'knock' || o.face === 'stunned';
  for (const ex of [3.8, 8.6]) { dot([ex, 1.6], 2.2, '#ffffff'); dot([ex + 0.4, 1.4], 1.2, '#1a1a1a'); ctx.strokeStyle = C.glass; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(ex, 1.6, 3.2, 0, Math.PI * 2); ctx.stroke(); } // round spectacles
  seg([6.6, 1.6], [7.2, 1.6], 1, C.glass); seg([9.6, -1], [10.8, -3], 1.1, '#d9a585');
  if (hurt || o.face === 'attack') { ctx.fillStyle = '#5a2a2a'; ctx.beginPath(); ctx.ellipse(7.2, -5.4, 2, hurt ? 2.4 : 1.4, 0, 0, Math.PI * 2); ctx.fill(); } else seg([5.6, -5.4], [9, -5.8], 1.2, '#8a4a3a');
  ctx.restore();
  seg(J.sh, J.e1, 9, C.coat); seg(J.e1, J.h1, 8, C.coat); seg(mid(J.e1, J.h1, 0.85), J.h1, 6, C.coatB); dot(J.h1, 4.8, C.skin);
}
DRAWERS.alchemist = drawAlchemist;
function drawGolem(f) { // a brown stone golem, drawn in the world where it stands
  const g = f.golem; if (!g) return;
  const t = globalT, a = g.act, A = a && GOLEM_ACT[a.kind], s = 1.4, wk = Math.sin(g.ph * 6) * (g.spd > 0 ? 1 : 0);
  ctx.save(); ctx.translate(g.x, GROUND - g.y); ctx.scale(g.facing * s, s * (g.crouch ? 0.78 : 1)); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(0, 0, 38, 8, 0, 0, Math.PI * 2); ctx.fill();
  const rock = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, 5); ctx.fill(); ctx.stroke(); };
  const bob = g.spd > 0 ? Math.abs(Math.sin(g.ph * 6)) * 3 : Math.sin(t * 0.05) * 1.2;
  rock(-24, -34 + Math.max(0, wk) * 6, 18, 34 - Math.max(0, wk) * 6, '#7a5b3b'); rock(6, -34 + Math.max(0, -wk) * 6, 18, 34 - Math.max(0, -wk) * 6, '#8b6a47'); // legs
  const arm = (sx, sy, fx, fy, c) => { ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 19; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(fx, fy); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 13; ctx.stroke(); ctx.fillStyle = c; ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, fy, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); };
  arm(-30, -86 - bob, -42, -46 - bob, '#7a5b3b');                                                              // the far arm hangs
  ctx.fillStyle = '#8b6a47'; ctx.strokeStyle = '#4a3523'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -34 - bob); ctx.lineTo(30, -34 - bob); ctx.lineTo(38, -90 - bob); ctx.lineTo(-38, -90 - bob); ctx.closePath(); ctx.fill(); ctx.stroke(); // the body
  ctx.strokeStyle = '#5a4129'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, -90 - bob); ctx.lineTo(-6, -66 - bob); ctx.lineTo(-16, -48 - bob); ctx.moveTo(18, -76 - bob); ctx.lineTo(10, -58 - bob); ctx.stroke(); // cracks
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pu = 0.7 + 0.3 * Math.sin(t * 0.1), gg = ctx.createRadialGradient(0, -62 - bob, 1, 0, -62 - bob, 18); gg.addColorStop(0, `rgba(255,190,80,${0.9 * pu})`); gg.addColorStop(1, 'rgba(255,150,40,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, -62 - bob, 18, 0, Math.PI * 2); ctx.fill(); ctx.restore(); // the stone that moves it
  rock(-15, -122 - bob, 30, 30, '#94724c');                                                                    // the head
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,170,60,.95)'; ctx.fillRect(1, -112 - bob, 6, 4); ctx.fillRect(9, -112 - bob, 5, 4); ctx.restore();
  let fx = 34, fy = -48 - bob, hold = null; // the near arm: down by its side, or drawn back and thrown
  if (A) { const k = a.t, su = A.su, end = su + A.ac, rest = [34, -48 - bob], pull = a.kind === 'hp' ? [4, -118] : [8, -92], fwd = A.reach ? [30 + A.reach[1] * 0.8, a.kind === 'hp' ? -70 : -92] : [60, -88];
    const e = x => x * x * (3 - 2 * x);
    hold = k <= su ? [lerp(rest[0], pull[0], e(k / su)), lerp(rest[1], pull[1], e(k / su))] : k <= end + 2 ? [lerp(pull[0], fwd[0], Math.min(1, (k - su) / 2)), lerp(pull[1], fwd[1], Math.min(1, (k - su) / 2))] : [lerp(fwd[0], rest[0], e(Math.min(1, (k - end - 2) / (A.rec * 0.8)))), lerp(fwd[1], rest[1], e(Math.min(1, (k - end - 2) / (A.rec * 0.8))))]; }
  if (hold) { fx = hold[0]; fy = hold[1]; }
  arm(30, -86 - bob, fx, fy, '#9a7852');
  ctx.restore();
}
// joining the roster
CHAR_ORDER.push('alchemist'); DEMO_VS.alchemist = 'ninja'; GHOST_TINT.alchemist = new Proxy({}, { get: () => '#e8f4ff' });
DEMOS.alchemist = []; COMBO_SET.alchemist = []; PUNISH_SET.alchemist = []; // (no sample combos yet)
