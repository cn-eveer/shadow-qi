'use strict';
/* ================= drawing: fighters ================= */
const mid = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function seg(a, b, w, c) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
function dot(p, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill(); }
function foot(k, f, len, w, c) {
  const dx = f[0] - k[0], dy = f[1] - k[1], L = Math.hypot(dx, dy) || 1;
  seg(f, [f[0] - dy / L * len, f[1] + dx / L * len], w, c);
}
function drawAura(J, key) {
  const c = [J.hip[0] + J.td[0] * 24, J.hip[1] + J.td[1] * 24];
  const col = CHARS[key].auraCol;
  const g = ctx.createRadialGradient(c[0], c[1], 8, c[0], c[1], 95);
  g.addColorStop(0, `rgba(${col},.5)`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath();
  ctx.ellipse(c[0], c[1] + 10, 58 + Math.sin(globalT * 0.5) * 5, 98, 0, 0, Math.PI * 2); ctx.fill();
}
function drawNinja(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]];
  // scarf
  const nk = [J.sh[0] - n[0] * 2 + td[0] * 2, J.sh[1] - n[1] * 2 + td[1] * 2];
  ctx.strokeStyle = C.accent; let prev = nk;
  const stretch = Math.min(4, o.speed || 0);
  for (let i = 1; i <= 6; i++) {
    const p = [nk[0] - i * (9 + stretch), nk[1] - i * 2.2 + Math.sin(t * 0.22 + i * 0.8) * i * 0.9];
    ctx.lineWidth = 8 - i; ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); prev = p;
  }
  // back limbs
  seg(J.hip, J.k2, 12, C.back); seg(J.k2, J.f2, 10, C.back); seg(mid(J.k2, J.f2, 0.55), J.f2, 10, C.dark); foot(J.k2, J.f2, 8, 7, C.dark);
  seg(J.sh, J.e2, 9, C.back); seg(J.e2, J.h2, 8, C.back); dot(J.h2, 5, C.dark);
  // scabbard on the back; the handle shows while the sword is sheathed
  const sb0 = [J.sh[0] - n[0] * 9 + td[0] * 6, J.sh[1] - n[1] * 9 + td[1] * 6], sb1 = [J.hip[0] - n[0] * 16 - td[0] * 8, J.hip[1] - n[1] * 16 - td[1] * 8];
  seg(sb0, sb1, 5, '#2a1d14');
  if (!o.sword) seg(sb0, [sb0[0] + td[0] * 11 - n[0] * 3, sb0[1] + td[1] * 11 - n[1] * 3], 4, '#4a3524');
  // torso, strap, sash
  seg(J.hip, J.sh, 21, C.cloth);
  seg([J.sh[0] - n[0] * 7, J.sh[1] - n[1] * 7], [J.hip[0] + n[0] * 7 + td[0] * 8, J.hip[1] + n[1] * 7 + td[1] * 8], 3, C.wrap);
  const sp = [J.hip[0] + td[0] * 6, J.hip[1] + td[1] * 6];
  seg([sp[0] - n[0] * 10, sp[1] - n[1] * 10], [sp[0] + n[0] * 10, sp[1] + n[1] * 10], 6, C.accent);
  seg([sp[0] - n[0] * 9, sp[1] - n[1] * 9], [sp[0] - n[0] * 16 - 2, sp[1] - n[1] * 16 - 10], 4, C.accent);
  const cp = mid(J.hip, J.sh, 0.72); // a small chest plate
  seg([cp[0] - n[0] * 6, cp[1] - n[1] * 6], [cp[0] + n[0] * 6, cp[1] + n[1] * 6], 8, C.metal || '#8d97b0');
  seg([cp[0] - n[0] * 5 + td[0] * 2, cp[1] - n[1] * 5 + td[1] * 2], [cp[0] + n[0] * 5 + td[0] * 2, cp[1] + n[1] * 5 + td[1] * 2], 1.6, '#d6dcea');
  // front leg
  seg(J.hip, J.k1, 12, C.cloth); seg(J.k1, J.f1, 10, C.cloth); seg(mid(J.k1, J.f1, 0.55), J.f1, 10, C.wrap); foot(J.k1, J.f1, 8, 7, C.dark);
  // head
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1]));
  dot([0, 0], 11.5, C.cloth);
  ctx.fillStyle = C.skin; ctx.beginPath(); ctx.ellipse(5, 1.5, 7, 3.6, 0, 0, Math.PI * 2); ctx.fill();
  dot([8, 1.6], 1.4, '#14121c');
  ctx.fillStyle = C.accent; ctx.fillRect(-11.5, 5, 22.5, 3.6);
  ctx.fillStyle = C.metal || '#8d97b0'; ctx.fillRect(1.5, 4.2, 8.5, 5); ctx.fillStyle = '#d6dcea'; ctx.fillRect(2.5, 6.3, 6.5, 0.9); // forehead plate
  ctx.strokeStyle = C.accent; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(-11, 7); ctx.quadraticCurveTo(-18, 8 + Math.sin(t * 0.3) * 3, -25, 4 + Math.sin(t * 0.3 + 1) * 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-11, 6); ctx.quadraticCurveTo(-17, 3 + Math.sin(t * 0.27) * 3, -22, -2 + Math.sin(t * 0.27 + 1) * 4); ctx.stroke();
  ctx.restore();
  // front arm
  seg(J.sh, J.e1, 9, C.cloth); seg(J.e1, J.h1, 8, C.cloth); seg(mid(J.e1, J.h1, 0.45), J.h1, 8.5, C.wrap); dot(J.h1, 5.5, C.glove);
  seg(mid(J.e1, J.h1, 0.25), mid(J.e1, J.h1, 0.62), 9.5, C.metal || '#8d97b0'); // arm guard
  seg(J.sh, mid(J.sh, J.e1, 0.42), 13, C.metal || '#8d97b0'); seg(J.sh, mid(J.sh, J.e1, 0.42), 9, C.cloth); // shoulder guard
  if (o.sword) { // katana: grip, guard and a long blade along the forearm
    const dx = J.h1[0] - J.e1[0], dy = J.h1[1] - J.e1[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    seg([J.h1[0] - ux * 9, J.h1[1] - uy * 9], J.h1, 4, '#3b2a1e');
    seg([J.h1[0] - uy * 5, J.h1[1] + ux * 5], [J.h1[0] + uy * 5, J.h1[1] - ux * 5], 3, '#c9a227');
    seg(J.h1, [J.h1[0] + ux * 56, J.h1[1] + uy * 56], 3.4, '#e9eef7');
  }
  if (o.blade) { // kunai for the Kunai Slash
    const dx = J.h1[0] - J.e1[0], dy = J.h1[1] - J.e1[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    seg([J.h1[0] - uy * 4, J.h1[1] + ux * 4], [J.h1[0] + uy * 4, J.h1[1] - ux * 4], 2.5, '#6b7488');
    seg(J.h1, [J.h1[0] + ux * 21, J.h1[1] + uy * 21], 3.2, '#e3e8f3');
  }
}
function drawBrawler(J, C, o = {}) {
  const td = J.td, n = [td[1], -td[0]];
  // back limbs
  seg(J.hip, J.k2, 14, C.pantsB); seg(J.k2, J.f2, 12, C.pantsB); foot(J.k2, J.f2, 9, 8, C.shoe);
  seg(J.sh, J.e2, 11, C.skinB); seg(J.e2, J.h2, 10, C.skinB); seg(mid(J.e2, J.h2, 0.5), J.h2, 10.5, C.wrapB); dot(J.h2, 6.5, C.wrapB);
  // torso with open vest and belt
  seg(J.hip, J.sh, 24, C.skin);
  seg([J.hip[0] - n[0] * 3, J.hip[1] - n[1] * 3], [J.sh[0] - n[0] * 4 - td[0], J.sh[1] - n[1] * 4 - td[1]], 20, C.vest);
  seg([J.hip[0] + n[0] * 4 + td[0] * 6, J.hip[1] + n[1] * 4 + td[1] * 6], [J.sh[0] + n[0] * 3 - td[0] * 6, J.sh[1] + n[1] * 3 - td[1] * 6], 2.5, C.vestB);
  const bp = [J.hip[0] + td[0] * 4, J.hip[1] + td[1] * 4];
  seg([bp[0] - n[0] * 12, bp[1] - n[1] * 12], [bp[0] + n[0] * 12, bp[1] + n[1] * 12], 7, C.belt);
  seg([bp[0] - n[0] * 11, bp[1] - n[1] * 11], [bp[0] - n[0] * 18 + Math.sin(globalT * 0.18) * 3, bp[1] - n[1] * 18 - 24], 4, C.sash || '#c23b2e'); // sash tails
  seg([bp[0] - n[0] * 10, bp[1] - n[1] * 10], [bp[0] - n[0] * 13 + Math.sin(globalT * 0.15 + 1) * 3, bp[1] - n[1] * 13 - 20], 3, C.sash || '#c23b2e');
  for (let i = 0; i <= 6; i++) { // prayer beads across the chest
    const e = i / 6, q = [lerp(J.sh[0] - n[0] * 9, J.sh[0] + n[0] * 9, e) - td[0] * (8 * Math.sin(Math.PI * e) + 2), lerp(J.sh[1] - n[1] * 9, J.sh[1] + n[1] * 9, e) - td[1] * (8 * Math.sin(Math.PI * e) + 2)];
    dot(q, i === 3 ? 3.2 : 2.3, C.bead || '#7a4b2a');
  }
  // front leg
  seg(J.hip, J.k1, 14, C.pants); seg(J.k1, J.f1, 12, C.pants); foot(J.k1, J.f1, 9, 8, C.shoe);
  // neck & head
  seg(J.sh, J.head, 9, C.skin);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1]));
  dot([0, 0], 12, C.skin);
  ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(0, 0, 12.8, Math.PI * 0.12, Math.PI * 1.2); ctx.closePath(); ctx.fill();
  dot([-7, 12], 4.2, C.hair);
  dot([-2, 15.5], 5.4, C.hair); seg([-6, 14], [-12, 11 + Math.sin(globalT * 0.2) * 2], 2.2, C.sash || '#c23b2e'); // topknot and ribbon
  ctx.fillStyle = C.band; ctx.fillRect(-12.6, 3, 25, 3.5);
  dot([7.5, 0.5], 2.2, '#ffffff'); dot([8.4, 0.5], 1.2, '#111111');
  seg([4.5, 4.2], [10.5, 3.2], 2, C.hair);
  dot([-1, -1], 2.6, C.skinB);
  ctx.restore();
  // front arm
  seg(J.sh, J.e1, 11, C.skin); seg(J.e1, J.h1, 10, C.skin); seg(mid(J.e1, J.h1, 0.5), J.h1, 10.5, C.wrap); dot(J.h1, 7, C.wrap);
  if (!o.tint && !o.flash) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; seg(mid(J.e1, J.h1, 0.55), mid(J.e1, J.h1, 0.9), 2, `rgba(125,235,255,${0.35 + 0.25 * Math.sin(globalT * 0.15)})`); ctx.restore(); } // qi glowing through the wraps
}
// the staff: from beyond the back hand, through the front hand and on past it; gold caps on both ends
function drawStaff(J, C, o) {
  let dx = J.h1[0] - J.h2[0], dy = J.h1[1] - J.h2[1], L = Math.hypot(dx, dy);
  if (L < 14) { dx = J.h1[0] - J.e1[0]; dy = J.h1[1] - J.e1[1]; L = Math.hypot(dx, dy) || 1; }
  let ux = dx / L, uy = dy / L;
  if (o.staffSpin != null) { const an = o.staffSpin; ux = Math.cos(an); uy = Math.sin(an); }
  const spin = o.staffSpin != null || L < 14, back = spin ? 92 : 34, front = spin ? 92 : 150, c0 = spin ? J.h1 : J.h2, c1 = J.h1; // held near the back end: a short end behind her hands, the long end out in front (twirling, it spins about the middle)
  const a = [c0[0] - ux * back, c0[1] - uy * back], b = [c1[0] + ux * (front + (o.staffExt || 0)), c1[1] + uy * (front + (o.staffExt || 0))];
  seg(a, b, 5.2, C.staffB); seg(a, b, 3.6, C.staff);
  seg(a, [a[0] + ux * 9, a[1] + uy * 9], 6, C.cap); seg([b[0] - ux * 9, b[1] - uy * 9], b, 6, C.cap);
  if (o.staffExt) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; seg([b[0] - ux * 16, b[1] - uy * 16], b, 9, 'rgba(255,215,120,.45)'); ctx.restore(); }
}
function drawBao(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]];
  // back leg and back arm
  seg(J.hip, J.k2, 9.5, C.pantsB); seg(J.k2, J.f2, 8, C.pantsB); seg(mid(J.k2, J.f2, 0.7), J.f2, 7, C.sock); foot(J.k2, J.f2, 7.5, 6, C.shoe);
  seg(J.sh, J.e2, 8, C.jacketB); seg(J.e2, J.h2, 7, C.jacketB); seg(mid(J.e2, J.h2, 0.8), J.h2, 8.5, C.trim); dot(J.h2, 4.8, C.skin);
  // long ponytail streaming behind her head (drawn first, so it sits behind)
  { // (drawing space is already turned to face the opponent and y points up, so "behind" is -x)
    const lift = Math.min(1, (o.speed || 0) / 6), a0 = [J.head[0] - 8, J.head[1] + 4];
    let px = a0[0], py = a0[1];
    for (let i = 0; i < 6; i++) {
      const nx = px - (6.5 + lift * 3), ny = py - 5 + lift * 3.5 + Math.sin(t * 0.13 + i * 0.8) * 1.8;
      seg([px, py], [nx, ny], 7.5 - i * 0.95, C.hair); px = nx; py = ny;
    }
    dot(a0, 3.6, '#e8463c'); }
  // tunic: two side-slit panels hanging below the jacket, swaying with her legs
  { const panel = (k, col) => { const a = mid(J.hip, k, 0.92);
      ctx.fillStyle = col; ctx.beginPath();
      ctx.moveTo(J.hip[0] - n[0] * 9, J.hip[1] - n[1] * 9); ctx.lineTo(J.hip[0] + n[0] * 9, J.hip[1] + n[1] * 9);
      ctx.lineTo(a[0] + n[0] * 8, a[1] + n[1] * 8); ctx.lineTo(a[0] - n[0] * 8, a[1] - n[1] * 8); ctx.closePath(); ctx.fill();
      seg([a[0] - n[0] * 8, a[1] - n[1] * 8], [a[0] + n[0] * 8, a[1] + n[1] * 8], 2.4, C.trim); };
    panel(J.k2, C.jacketB); panel(J.k1, C.jacket); }
  // jacket: mandarin collar, gold trim down the front, frog buttons, a sash with tails
  seg(J.hip, J.sh, 17, C.jacket);
  seg([J.hip[0] + n[0] * 5, J.hip[1] + n[1] * 5], [J.sh[0] + n[0] * 5, J.sh[1] + n[1] * 5], 2.4, C.trim);
  for (let i = 1; i <= 3; i++) { const q = mid(J.hip, J.sh, 0.3 + i * 0.17); seg([q[0] + n[0] * 1, q[1] + n[1] * 1], [q[0] + n[0] * 9, q[1] + n[1] * 9], 2.2, C.trim); }
  seg([J.sh[0] - n[0] * 8 + td[0] * 3, J.sh[1] - n[1] * 8 + td[1] * 3], [J.sh[0] + n[0] * 8 + td[0] * 3, J.sh[1] + n[1] * 8 + td[1] * 3], 4, C.trim);
  const bp = [J.hip[0] + td[0] * 5, J.hip[1] + td[1] * 5];
  seg([bp[0] - n[0] * 10, bp[1] - n[1] * 10], [bp[0] + n[0] * 10, bp[1] + n[1] * 10], 5, C.trim);
  seg([bp[0] - n[0] * 9, bp[1] - n[1] * 9], [bp[0] - n[0] * 14 - 3 + Math.sin(t * 0.25) * 2, bp[1] - n[1] * 14 - 14], 3.4, C.trim);
  // front leg
  seg(J.hip, J.k1, 9.5, C.pants); seg(J.k1, J.f1, 8, C.pants); seg(mid(J.k1, J.f1, 0.7), J.f1, 7, C.sock); foot(J.k1, J.f1, 7.5, 6, C.shoe);
  // head: black hair with bangs, two buns tied with red ribbons, and the golden circlet
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1]));
  dot([0, 0], 10.5, C.skin);
  ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(0, 0.5, 11.4, Math.PI * 0.02, Math.PI * 1.2); ctx.closePath(); ctx.fill();
  dot([-6, 11], 5.6, C.hair); dot([5, 12], 5.2, C.hair);                                   // twin buns
  seg([-10.5, 9], [-13.5, 5], 2.2, '#e8463c'); seg([1.5, 15.5], [-0.5, 19], 2.2, '#e8463c'); // ribbons
  ctx.fillStyle = C.cap; ctx.fillRect(-11.2, 3.2, 22.4, 2.6); dot([0, 4.5], 2, '#e8463c');
  dot([6.8, 0.6], 2.1, '#ffffff'); dot([7.5, 0.6], 1.25, '#111111');
  seg([5, 3.4], [9.6, 2.6], 1.3, C.hair);                                                  // lashes
  dot([8.4, -4.2], 1.3, '#f08a8a');                                                        // a little blush
  ctx.restore();
  drawStaff(J, C, o);
  // front arm in a wide sleeve with gold cuffs
  seg(J.sh, J.e1, 8.5, C.jacket); seg(J.e1, J.h1, 7.5, C.jacket); seg(mid(J.e1, J.h1, 0.8), J.h1, 8.5, C.trim); dot(J.h1, 4.6, C.skin);
}
// the imaginary fist: a glowing translucent fist (ang: 0 punches forward, 1 down, -1 up)
// Lyra's psychic power: a rune circle with a crystal of light at its center (ang: 0 points forward, 1 down, -1 up)
function drawPsyFist(x, y, sc, dir, alpha, ang = 0) {
  if (alpha <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * sc, sc);
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(0, 0, 3, 0, 0, 50); g.addColorStop(0, `rgba(230,210,255,${0.5 * alpha})`); g.addColorStop(1, 'rgba(160,120,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fill();
  const spin = globalT * 0.06;
  ctx.strokeStyle = `rgba(220,200,255,${0.85 * alpha})`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.stroke();
  for (let k = 0; k < 8; k++) { const an = spin + k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(an) * 26, Math.sin(an) * 26); ctx.lineTo(Math.cos(an) * 34, Math.sin(an) * 34); ctx.stroke(); }
  ctx.beginPath(); // a six-pointed star inside, turning the other way
  for (let k = 0; k <= 6; k++) { const an = -spin * 1.5 + k * Math.PI * 2 / 3; k ? ctx.lineTo(Math.cos(an) * 22, Math.sin(an) * 22) : ctx.moveTo(Math.cos(an) * 22, Math.sin(an) * 22); }
  ctx.stroke(); ctx.beginPath();
  for (let k = 0; k <= 6; k++) { const an = -spin * 1.5 + Math.PI / 3 + k * Math.PI * 2 / 3; k ? ctx.lineTo(Math.cos(an) * 22, Math.sin(an) * 22) : ctx.moveTo(Math.cos(an) * 22, Math.sin(an) * 22); }
  ctx.stroke();
  ctx.rotate(ang * Math.PI / 2); // the crystal points where the power goes
  ctx.fillStyle = `rgba(200,235,255,${0.75 * alpha})`; ctx.strokeStyle = `rgba(255,255,255,${0.95 * alpha})`; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(40, 0); ctx.lineTo(4, -10); ctx.lineTo(-14, 0); ctx.lineTo(4, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40, 0); ctx.lineTo(-14, 0); ctx.stroke();
  ctx.restore();
}
// → → + K: a giant spirit fist of light (ang: 0 punches forward, negative angles upward)
function drawGiantFist(x, y, sc, dir, alpha, ang = 0) {
  if (alpha <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * sc, sc); ctx.rotate(ang * Math.PI / 2);
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 56); g.addColorStop(0, `rgba(235,215,255,${0.55 * alpha})`); g.addColorStop(1, 'rgba(170,130,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 56, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = `rgba(205,180,255,${0.45 * alpha})`; ctx.strokeStyle = `rgba(250,245,255,${0.95 * alpha})`; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(-34, 14); ctx.lineTo(2, 20); ctx.quadraticCurveTo(26, 22, 28, 0); ctx.quadraticCurveTo(26, -22, 2, -20); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(20, -15 + k * 10, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(4, 18, 12, 6, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillRect(-56, -10, 22, 20);
  ctx.strokeStyle = `rgba(220,200,255,${0.5 * alpha})`; for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(-60 - k * 14, -12 + k * 6); ctx.lineTo(-40 - k * 14, -12 + k * 6); ctx.stroke(); } // speed lines
  ctx.restore();
}
function drawLyra(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]];
  // long silver hair streaming behind
  const hb = [J.head[0] - n[0] * 6, J.head[1] - n[1] * 6];
  ctx.strokeStyle = C.hairB; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(hb[0], hb[1]);
  ctx.quadraticCurveTo(hb[0] - 18 + Math.sin(t * 0.12) * 4, hb[1] - 30, hb[0] - 26 + Math.sin(t * 0.1 + 1) * 6, hb[1] - 66); ctx.stroke();
  ctx.strokeStyle = C.hair; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(hb[0], hb[1]);
  ctx.quadraticCurveTo(hb[0] - 14 + Math.sin(t * 0.12) * 4, hb[1] - 28, hb[0] - 22 + Math.sin(t * 0.1 + 1) * 6, hb[1] - 60); ctx.stroke();
  // back arm in a wide sleeve
  seg(J.sh, J.e2, 11, C.robeB); seg(J.e2, J.h2, 12, C.robeB); dot(J.h2, 4.6, C.skin);
  // the robe: shoulders down past the knees, flaring with the legs
  const sway = Math.sin(t * 0.09) * 3;
  ctx.fillStyle = C.robe; ctx.beginPath();
  ctx.moveTo(J.sh[0] - n[0] * 11, J.sh[1] - n[1] * 11);
  ctx.lineTo(J.hip[0] - n[0] * 15, J.hip[1] - n[1] * 15);
  ctx.lineTo(J.f2[0] - n[0] * 8 - sway, J.f2[1] + 10);
  ctx.lineTo(J.f1[0] + n[0] * 8 + sway, J.f1[1] + 10);
  ctx.lineTo(J.hip[0] + n[0] * 15, J.hip[1] + n[1] * 15);
  ctx.lineTo(J.sh[0] + n[0] * 11, J.sh[1] + n[1] * 11);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.trim; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(J.f2[0] - n[0] * 8 - sway, J.f2[1] + 10); ctx.lineTo(J.f1[0] + n[0] * 8 + sway, J.f1[1] + 10); ctx.stroke();
  seg([J.sh[0] + td[0] * 2, J.sh[1] + td[1] * 2], [J.hip[0] + n[0] * 3, J.hip[1] + n[1] * 3], 2.4, C.trim);
  foot(J.k2, J.f2, 7, 5.5, C.shoe); foot(J.k1, J.f1, 7, 5.5, C.shoe);
  // sash with tails
  const bp = [J.hip[0] + td[0] * 10, J.hip[1] + td[1] * 10];
  seg([bp[0] - n[0] * 13, bp[1] - n[1] * 13], [bp[0] + n[0] * 13, bp[1] + n[1] * 13], 6, C.sash);
  seg([bp[0] - n[0] * 12, bp[1] - n[1] * 12], [bp[0] - n[0] * 18 + Math.sin(t * 0.15) * 3, bp[1] - n[1] * 18 - 26], 3.4, C.sash);
  // head: silver hair with a fringe, a glowing gem on the brow
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1]));
  dot([0, 0], 10.5, C.skin);
  ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(0, 0.5, 11.6, Math.PI * 0.08, Math.PI * 1.1); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-4, 11); ctx.quadraticCurveTo(8, 12, 11, 4); ctx.lineTo(5, 7); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([6.5, 6.6], 3.6, `rgba(255,120,230,${0.5 + 0.3 * Math.sin(t * 0.2)})`); ctx.restore();
  dot([6.5, 6.6], 1.8, C.gem);
  dot([7.2, 0.4], 1.9, '#ffffff'); dot([7.9, 0.4], 1.1, '#3a2050');
  seg([4.5, -4], [9.5, -3], 1.2, '#c06070');
  ctx.restore();
  drawMageStaff(J, C, o); // she casts with her staff, never her fists
  // front arm, wide sleeve, the hand closed around the staff
  seg(J.sh, J.e1, 11, C.robe); seg(J.e1, J.h1, 12, C.robe); seg(mid(J.e1, J.h1, 0.8), J.h1, 12.5, C.trim); dot(J.h1, 4.8, C.skin);
}
// Aldric's greatsword: grip in the front hand, blade along the forearm (or whirling); longer than a sword, shorter than Mei's staff
function excalAura(f, mv) { // how strongly the Excalibur aura shows on Aldric's sword: it forms as he swings, and fades after
  if (f.key !== 'paladin' || !mv || f.state !== 'attack' || /Shield|Bash|Pray|Hands|Aegis|Parry|Rampart|Kick|Knee|Quake|Sanctuary/.test(mv.label || '')) return 0; // (sword strikes only)
  if (mv.held && !mv.fired) return mv.lvl >= 2 ? 0.8 : 0;
  const S = mv.startup, on = clamp((f.mf - (S - 5)) / 4, 0, 1), off = clamp((S + (mv.active || 0) + 10 - f.mf) / 8, 0, 1);
  return on * off;
}
function drawGreatsword(J, C, o) {
  const th = Math.atan2(J.h1[1] - J.e1[1], J.h1[0] - J.e1[0]) + (o.wrist != null ? o.wrist : 0.6); // held at a raised wrist angle, not hanging off the forearm
  let ux = Math.cos(th), uy = Math.sin(th);
  if (o.staffSpin != null) { ux = Math.cos(o.staffSpin); uy = Math.sin(o.staffSpin); }
  const nx = -uy, ny = ux, h = J.h1, len = 104 + (o.staffExt || 0);
  const at = k => [h[0] + ux * k, h[1] + uy * k];
  seg(at(-16), at(8), 5, C.grip); dot(at(-18), 4.2, C.trim);                                      // grip and pommel
  seg([h[0] + ux * 9 - nx * 13, h[1] + uy * 9 - ny * 13], [h[0] + ux * 9 + nx * 13, h[1] + uy * 9 + ny * 13], 5, C.trim); // cross-guard
  const b0 = at(12), tip = at(12 + len);
  ctx.fillStyle = C.blade; ctx.beginPath();
  ctx.moveTo(b0[0] - nx * 5, b0[1] - ny * 5); ctx.lineTo(b0[0] + nx * 5, b0[1] + ny * 5);
  ctx.lineTo(tip[0] - ux * 14 + nx * 4.2, tip[1] - uy * 14 + ny * 4.2); ctx.lineTo(tip[0], tip[1]); ctx.lineTo(tip[0] - ux * 14 - nx * 4.2, tip[1] - uy * 14 - ny * 4.2);
  ctx.closePath(); ctx.fill();
  seg(at(16), at(10 + len * 0.78), 1.4, 'rgba(120,135,160,.75)');                                  // the fuller down the middle
  if (o.staffExt || o.edge) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; seg(at(12), tip, o.edge ? 13 : 16, 'rgba(150,205,255,.4)'); seg(at(12), tip, 5, 'rgba(235,248,255,.85)'); ctx.restore(); }
  const ea = o.tint || o.flash ? 0 : (o.edgeA || 0);
  if (ea > 0) { // when he strikes, the steel itself shines: a bright edge along the blade, a glint running to the tip — the sword stays its own size
    const base = at(12), g0 = 0.15 + 0.7 * ((globalT * 0.09) % 1); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    seg(base, tip, 7, `rgba(170,215,255,${0.35 * ea})`); seg(base, tip, 2.4, `rgba(255,255,255,${0.9 * ea})`); // the shining edge
    const gp = [base[0] + (tip[0] - base[0]) * g0, base[1] + (tip[1] - base[1]) * g0], gr = 7 + 4 * ea; // a glint sliding toward the tip
    const gg = ctx.createRadialGradient(gp[0], gp[1], 0, gp[0], gp[1], gr * 2); gg.addColorStop(0, `rgba(255,255,255,${0.95 * ea})`); gg.addColorStop(1, 'rgba(200,230,255,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(gp[0], gp[1], gr * 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${0.9 * ea})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(tip[0] - 7, tip[1]); ctx.lineTo(tip[0] + 7, tip[1]); ctx.moveTo(tip[0], tip[1] - 7); ctx.lineTo(tip[0], tip[1] + 7); ctx.stroke(); // a star of light at the point
    ctx.restore(); }
}
// Aldric's kite shield on the back arm, facing out; it whirls around him in Shield Rotation
function drawKiteShield(J, C, o) {
  let cx = J.h2[0] + 6, cy = J.h2[1] - 6, sx = 1;
  if (o.shieldSpin) { const an = globalT * 0.5; cx = J.sh[0] + Math.cos(an) * 34; cy = J.sh[1] - 34; sx = Math.max(0.2, Math.abs(Math.cos(an))); }
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sx, 1);
  const shape = (w, hTop, hBot) => { ctx.beginPath(); ctx.moveTo(-w, hTop); ctx.lineTo(w, hTop); ctx.quadraticCurveTo(w, -hBot * 0.35, 0, -hBot); ctx.quadraticCurveTo(-w, -hBot * 0.35, -w, hTop); ctx.closePath(); };
  ctx.fillStyle = C.trim; shape(19, 30, 40); ctx.fill();
  ctx.fillStyle = C.shield; shape(16, 27, 36); ctx.fill();
  ctx.fillStyle = C.shieldB; ctx.beginPath(); ctx.moveTo(0, 27); ctx.lineTo(16, 27); ctx.quadraticCurveTo(16, -12, 0, -36); ctx.closePath(); ctx.fill(); // shaded half
  ctx.fillStyle = C.trim; ctx.fillRect(-2.6, -24, 5.2, 44); ctx.fillRect(-11, 8, 22, 5);                                   // the gold cross
  ctx.restore();
}
function drawPaladin(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]];
  // cape hanging behind, swaying
  const sway = Math.sin(t * 0.08) * 4 - Math.min(10, (o.speed || 0) * 1.5);
  ctx.fillStyle = C.capeB; ctx.beginPath();
  ctx.moveTo(J.sh[0] - n[0] * 12, J.sh[1] - n[1] * 12); ctx.lineTo(J.sh[0] + n[0] * 8, J.sh[1] + n[1] * 8);
  ctx.quadraticCurveTo(J.hip[0] - 8 + sway, J.hip[1] - 10, J.hip[0] - 22 + sway, J.f2[1] + 14); ctx.lineTo(J.hip[0] - 54 + sway * 1.6, J.f2[1] + 22);
  ctx.quadraticCurveTo(J.hip[0] - 46 + sway, J.hip[1] + 10, J.sh[0] - n[0] * 12, J.sh[1] - n[1] * 12); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.trimB; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(J.hip[0] - 22 + sway, J.f2[1] + 14); ctx.lineTo(J.hip[0] - 54 + sway * 1.6, J.f2[1] + 22); ctx.stroke(); // gold hem
  // back leg: greave, knee cop, sabaton
  seg(J.hip, J.k2, 14, C.plateD); seg(J.k2, J.f2, 12, C.plateD); dot(J.k2, 6.6, C.plateB); foot(J.k2, J.f2, 10, 8.5, C.plateD);
  // back arm (it carries the shield)
  seg(J.sh, J.e2, 12, C.plateD); seg(J.e2, J.h2, 11, C.plateD); dot(J.e2, 6, C.plateB); dot(J.h2, 6.5, C.plateD);
  // tabard over the breastplate, with the cross
  seg(J.hip, J.sh, 26, C.plate);
  seg([J.hip[0] + n[0] * 5, J.hip[1] + n[1] * 5], [J.sh[0] + n[0] * 5 - td[0] * 4, J.sh[1] + n[1] * 5 - td[1] * 4], 4, C.plateB); // edge of the breastplate
  { const a = mid(J.hip, J.sh, 0.1), k = mid(mid(J.k1, J.k2, 0.5), J.hip, 0.25);
    ctx.fillStyle = C.tabard; ctx.beginPath();
    ctx.moveTo(J.sh[0] - n[0] * 9 - td[0] * 6, J.sh[1] - n[1] * 9 - td[1] * 6); ctx.lineTo(J.sh[0] + n[0] * 9 - td[0] * 6, J.sh[1] + n[1] * 9 - td[1] * 6);
    ctx.lineTo(a[0] + n[0] * 11, a[1] + n[1] * 11); ctx.lineTo(k[0] + n[0] * 10, k[1] - 6); ctx.lineTo(k[0] - n[0] * 10, k[1] - 6); ctx.lineTo(a[0] - n[0] * 11, a[1] - n[1] * 11);
    ctx.closePath(); ctx.fill();
    const c = mid(J.hip, J.sh, 0.6); seg([c[0] - td[0] * 14, c[1] - td[1] * 14], [c[0] + td[0] * 10, c[1] + td[1] * 10], 4.4, C.cross); seg([c[0] - n[0] * 8, c[1] - n[1] * 8], [c[0] + n[0] * 8, c[1] + n[1] * 8], 4.4, C.cross); }
  const bp = mid(J.hip, J.sh, 0.12); seg([bp[0] - n[0] * 13, bp[1] - n[1] * 13], [bp[0] + n[0] * 13, bp[1] + n[1] * 13], 6, C.trimB); dot(bp, 3.6, C.trim); // sword belt and buckle
  // front leg
  seg(J.hip, J.k1, 14, C.plate); seg(J.k1, J.f1, 12, C.plate); dot(J.k1, 7, C.plateB); seg(mid(J.k1, J.f1, 0.25), mid(J.k1, J.f1, 0.75), 2, C.plateB); foot(J.k1, J.f1, 10, 8.5, C.plateB);
  // head: a great helm with a visor slit, gold trim and a red plume
  seg(J.sh, J.head, 10, C.plateD);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1]));
  for (let i = 0; i < 5; i++) seg([-2 - i * 3, 13], [-10 - i * 4.5, 15 - i * 2 + Math.sin(t * 0.15 + i) * 1.5], 5 - i * 0.6, C.plume); // plume streaming back
  ctx.fillStyle = C.plate; ctx.beginPath(); ctx.moveTo(-11, -12); ctx.lineTo(10, -12); ctx.lineTo(12, 4); ctx.quadraticCurveTo(10, 14, 0, 14); ctx.quadraticCurveTo(-11, 14, -12, 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.plateB; ctx.fillRect(-12, -12, 9, 26);
  ctx.fillStyle = C.visor; ctx.fillRect(1, 1, 11, 3.2); ctx.fillRect(4.5, -8, 2.2, 9);            // visor slit and breaths
  if (!o.tint && !o.flash) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(150,215,255,${0.6 + 0.25 * Math.sin(t * 0.1)})`; ctx.fillRect(3, 1.6, 8, 2); ctx.restore(); } // eyes glowing in the dark of the helm
  ctx.fillStyle = C.trim; ctx.fillRect(-12, 6.5, 24, 2.2); ctx.fillRect(-1, -12, 2.4, 26);
  ctx.restore();
  if (!o.shieldOut) drawKiteShield(J, C, o);
  if (!o.bladeHalo) drawGreatsword(J, C, o);
  if (o.aegisRing || o.bladeHalo) { // the shields of light (Aegis Ring) or the circling blades (Blade Halo)
    const n = o.aegisRing ? 3 : 2, R0 = o.aegisRing ? 62 : 78;
    for (let i = 0; i < n; i++) {
      const an = globalT * (o.aegisRing ? 0.22 : 0.42) + i * Math.PI * 2 / n, cx = J.hip[0] + Math.cos(an) * R0, cy = J.sh[1] - 10 + Math.sin(an) * 22;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(cx, cy);
      if (o.aegisRing) { ctx.scale(Math.max(0.3, Math.abs(Math.cos(an))), 1); ctx.fillStyle = 'rgba(150,205,255,.35)'; ctx.strokeStyle = 'rgba(230,245,255,.9)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-15, 22); ctx.lineTo(15, 22); ctx.quadraticCurveTo(15, -8, 0, -30); ctx.quadraticCurveTo(-15, -8, -15, 22); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      else { ctx.rotate(an + Math.PI / 2); ctx.fillStyle = 'rgba(220,240,255,.75)'; ctx.beginPath(); ctx.moveTo(0, 56); ctx.lineTo(5, -40); ctx.lineTo(-5, -40); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(150,205,255,.85)'; ctx.fillRect(-12, -46, 24, 5); }
      ctx.restore();
    }
    if (o.bladeHalo) { const an = globalT * 0.42; ctx.save(); ctx.translate(J.hip[0], J.sh[1] - 10); ctx.rotate(an); drawGreatsword({ h1: [0, 0], e1: [-1, 0], sh: [0, 0] }, C, { staffSpin: 0 }); ctx.restore(); }
  }
  // front arm: pauldron, vambrace, gauntlet
  seg(J.sh, J.e1, 12, C.plate); seg(J.e1, J.h1, 11, C.plate); dot(J.e1, 6, C.plateB); dot(J.h1, 7, C.plateB);
  ctx.fillStyle = C.plateB; ctx.beginPath(); ctx.arc(J.sh[0], J.sh[1], 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = C.plate; ctx.beginPath(); ctx.arc(J.sh[0] + 1, J.sh[1] + 1, 11.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.trim; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(J.sh[0], J.sh[1], 12.5, Math.PI * 1.1, Math.PI * 1.95); ctx.stroke();
}
// Lyra's staff: a slender rod topped with a glowing crystal; she points it to cast
function drawMageStaff(J, C, o) {
  let ux = J.h1[0] - J.e1[0], uy = J.h1[1] - J.e1[1] + 9; const L = Math.hypot(ux, uy) || 1; ux /= L; uy /= L; // along the forearm, tipped upward
  const top = [J.h1[0] + ux * 104, J.h1[1] + uy * 104], bot = [J.h1[0] - ux * 24, J.h1[1] - uy * 24]; // (held low down: a short end below her hand, the long end with the crystal out in front)
  seg(bot, top, 5, '#3e2a55'); seg(bot, top, 3, '#7a5aa0'); dot(bot, 3, C.trim);
  const nx = -uy, ny = ux, c = [top[0] + ux * 9, top[1] + uy * 9];
  ctx.strokeStyle = C.trim; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c[0], c[1], 10, 0, Math.PI * 2); ctx.stroke();      // the ring holding the crystal
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(c[0], c[1], 1, c[0], c[1], 20); g.addColorStop(0, `rgba(255,190,245,${0.75 + 0.2 * Math.sin(globalT * 0.15)})`); g.addColorStop(1, 'rgba(200,120,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], 20, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.fillStyle = C.gem; ctx.beginPath(); ctx.moveTo(c[0] + ux * 11, c[1] + uy * 11); ctx.lineTo(c[0] + nx * 5, c[1] + ny * 5); ctx.lineTo(c[0] - ux * 8, c[1] - uy * 8); ctx.lineTo(c[0] - nx * 5, c[1] - ny * 5); ctx.closePath(); ctx.fill();
}
// the Kappa: round, green and cute, a turtle shell on the back, a dish of water on top of the head
function drawKappa(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]];
  const sc = mid(J.hip, J.sh, 0.5), sh = [sc[0] - n[0] * 11, sc[1] - n[1] * 11]; // the shell sits on the back
  ctx.save(); ctx.translate(sh[0], sh[1]); ctx.rotate(Math.atan2(td[1], td[0]) - Math.PI / 2);
  ctx.fillStyle = C.shellB; ctx.beginPath(); ctx.ellipse(0, 0, 17, 26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = C.shell; ctx.beginPath(); ctx.ellipse(1, 0, 14, 23, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.shellB; ctx.lineWidth = 1.6; for (const yy of [-10, 0, 10]) { ctx.beginPath(); ctx.moveTo(-10, yy); ctx.lineTo(12, yy); ctx.stroke(); }
  ctx.restore();
  seg(J.hip, J.k2, 10, C.skinB); seg(J.k2, J.f2, 9, C.skinB); foot(J.k2, J.f2, 9, 7, C.skinB);
  seg(J.sh, J.e2, 8, C.skinB); seg(J.e2, J.h2, 8, C.skinB); dot(J.h2, 5, C.skinB);
  seg(J.hip, J.sh, 28, C.skin); seg(mid(J.hip, J.sh, 0.1), mid(J.hip, J.sh, 0.9), 18, C.belly);                       // round body, pale belly
  seg(J.hip, J.k1, 10, C.skin); seg(J.k1, J.f1, 9, C.skin); foot(J.k1, J.f1, 9.5, 7, C.skin);
  seg(J.sh, J.head, 9, C.skin);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1]));
  ctx.scale(1.15, 1.15);
  dot([0, 2], 15, C.skin);                                                                                          // a big round head (extra big: he's a chibi)
  ctx.fillStyle = C.beak; ctx.beginPath(); ctx.moveTo(10, 2); ctx.quadraticCurveTo(22, 0, 20, -4); ctx.quadraticCurveTo(14, -6, 9, -3); ctx.closePath(); ctx.fill();
  dot([5.5, 6], 6, '#ffffff'); dot([7, 5.6], 3.8, '#1a1a1a'); dot([8.2, 7.2], 1.5, '#ffffff'); dot([6.2, 4.2], 0.8, '#ffffff');                            // big shiny eye
  dot([3, -2], 2.6, 'rgba(255,140,160,.6)');                                                                         // blush
  for (let i = 0; i < 7; i++) { const x = -11 + i * 3.4; ctx.fillStyle = C.hair; ctx.beginPath(); ctx.moveTo(x - 2, 13); ctx.lineTo(x, 18 + (i % 2) * 2); ctx.lineTo(x + 2, 13); ctx.closePath(); ctx.fill(); } // tufts around the dish
  if (!o.plateOut) { // the dish on top of the head, full of water
    ctx.fillStyle = C.plate; ctx.beginPath(); ctx.ellipse(-1, 17, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.water; ctx.beginPath(); ctx.ellipse(-1, 17.5, 8, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    dot([-4, 18.4], 1, `rgba(255,255,255,${0.6 + 0.3 * Math.sin(t * 0.2)})`);
  } else { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-1, 15, 8, 2.5, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  seg(J.sh, J.e1, 8, C.skin); seg(J.e1, J.h1, 8, C.skin); dot(J.h1, 5.5, C.skin);
  { const dx = J.h1[0] - J.e1[0], dy = J.h1[1] - J.e1[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;                // three little claws
    for (const k of [-0.45, 0, 0.45]) { const c = Math.cos(k), sn = Math.sin(k), vx = ux * c - uy * sn, vy = ux * sn + uy * c; seg(J.h1, [J.h1[0] + vx * 9, J.h1[1] + vy * 9], 2.4, C.claw); } }
}
// the gunslinger: wide-brimmed hat, a long duster coat, a red bandana and a revolver in each hand
function drawRevolver(h, e, C) {
  const dx = h[0] - e[0], dy = h[1] - e[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  seg([h[0] - nx * 2, h[1] - ny * 2], [h[0] - nx * 8 - ux * 3, h[1] - ny * 8 - uy * 3], 4.5, C.grip);                     // grip
  seg([h[0] + ux * 2, h[1] + uy * 2], [h[0] + ux * 20, h[1] + uy * 20], 3.6, C.gun);                                       // barrel
  dot([h[0] + ux * 5, h[1] + uy * 5], 3.4, C.gun);                                                                          // cylinder
}
function drawHolster(at, dir, C) { // a revolver sitting in its leather holster at the hip, grip up
  ctx.fillStyle = C.grip; ctx.beginPath(); ctx.moveTo(at[0] - 5, at[1] + 2); ctx.lineTo(at[0] + 6, at[1] + 2); ctx.lineTo(at[0] + 3 + dir * 2, at[1] - 22); ctx.lineTo(at[0] - 4 + dir * 2, at[1] - 22); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5a3a24'; ctx.fillRect(at[0] - 3, at[1] + 2, 7, 9); ctx.fillStyle = '#d4b06a'; ctx.fillRect(at[0] - 3, at[1] + 6, 7, 1.6); // the grip sticking out, a brass cap
}
function drawGunman(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]];
  const sway = Math.sin(t * 0.08) * 3 - Math.min(10, (o.speed || 0) * 1.4);
  ctx.fillStyle = C.coatB; ctx.beginPath();                                                                            // the back half of the duster, flaring
  ctx.moveTo(J.sh[0] - n[0] * 10, J.sh[1] - n[1] * 10); ctx.lineTo(J.hip[0] - n[0] * 14, J.hip[1] - n[1] * 14); ctx.lineTo(J.hip[0] - 26 + sway, Math.min(J.k1[1], J.k2[1]) - 14); ctx.lineTo(J.hip[0] + 4 + sway, Math.min(J.k1[1], J.k2[1]) - 18); ctx.lineTo(J.sh[0] + n[0] * 4, J.sh[1] + n[1] * 4); ctx.closePath(); ctx.fill();
  seg(J.hip, J.k2, 10, C.pantsB); seg(J.k2, J.f2, 9, C.pantsB); seg(mid(J.k2, J.f2, 0.5), J.f2, 10, C.boots); foot(J.k2, J.f2, 9, 7, C.boots);
  seg(J.sh, J.e2, 9, C.coatB); seg(J.e2, J.h2, 8, C.coatB); dot(J.h2, 4.6, C.skin); if (o.gunOut !== false) drawRevolver(J.h2, J.e2, C); else drawHolster([J.hip[0] - 6, J.hip[1] - 4], -1, C);
  seg(J.hip, J.sh, 18, C.shirt); seg(mid(J.hip, J.sh, 0.15), mid(J.hip, J.sh, 0.95), 13, C.vest);                       // shirt and vest
  const bp = mid(J.hip, J.sh, 0.08); seg([bp[0] - n[0] * 11, bp[1] - n[1] * 11], [bp[0] + n[0] * 11, bp[1] + n[1] * 11], 5, C.grip); dot(bp, 2.6, '#d4b06a'); // gun belt
  seg(J.hip, J.k1, 10, C.pants); seg(J.k1, J.f1, 9, C.pants); seg(mid(J.k1, J.f1, 0.5), J.f1, 10.5, C.boots); foot(J.k1, J.f1, 9.5, 7, C.boots); dot([J.f1[0] - 6, J.f1[1] + 2], 2, '#d4b06a'); // boot with a spur
  ctx.fillStyle = C.coat; ctx.beginPath();                                                                             // the front edge of the duster
  ctx.moveTo(J.sh[0] + n[0] * 8, J.sh[1] + n[1] * 8); ctx.lineTo(J.hip[0] + n[0] * 12, J.hip[1] + n[1] * 12); ctx.lineTo(J.hip[0] + n[0] * 16 + sway * 0.5, Math.min(J.k1[1], J.k2[1]) - 16); ctx.lineTo(J.hip[0] + n[0] * 6 + sway * 0.5, Math.min(J.k1[1], J.k2[1]) - 12); ctx.lineTo(J.hip[0] + n[0] * 4, J.hip[1] + n[1] * 4); ctx.lineTo(J.sh[0] + n[0] * 3, J.sh[1] + n[1] * 3); ctx.closePath(); ctx.fill();
  seg(J.sh, J.head, 8, C.skin);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1]));
  dot([0, 0], 11, C.skin); ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(-1, 1, 11.4, Math.PI * 0.55, Math.PI * 1.15); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.scarf; ctx.beginPath(); ctx.moveTo(-8, -8); ctx.lineTo(11, -6); ctx.lineTo(9, -12); ctx.lineTo(-6, -14); ctx.closePath(); ctx.fill(); // bandana at the neck
  dot([6.5, 1], 1.6, '#1a1a1a'); seg([3.5, 4], [9.5, 3.4], 1.6, C.hair);                                               // a narrowed eye under the brim
  seg([4, -4.5], [8.5, -4.5], 1.2, '#7a4a3a');
  ctx.fillStyle = C.hatB; ctx.beginPath(); ctx.ellipse(1, 8, 21, 4, -0.05, 0, Math.PI * 2); ctx.fill();                // wide brim
  ctx.fillStyle = C.hat; ctx.beginPath(); ctx.moveTo(-10, 8); ctx.quadraticCurveTo(-11, 22, -2, 21); ctx.quadraticCurveTo(1, 18, 4, 21); ctx.quadraticCurveTo(12, 22, 11, 8); ctx.closePath(); ctx.fill(); // creased crown
  ctx.fillStyle = C.band; ctx.fillRect(-10, 8, 21, 3);
  ctx.restore();
  if (o.gunOut === false) drawHolster([J.hip[0] + 8, J.hip[1] - 2], 1, C);
  seg(J.sh, J.e1, 9.5, C.coat); seg(J.e1, J.h1, 8.5, C.coat); dot(J.h1, 4.8, C.skin); if (o.gunOut !== false) drawRevolver(J.h1, J.e1, C);
}
// the salaryman, with a tiny angel and a tiny devil riding on his shoulders (until one of them takes him over)
function drawBigAngel(x, y, sc, a, t, face) { // a full-size angel: robes, a halo, great feathered wings, all light
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc * face, sc); ctx.globalAlpha = a;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, -170, 10, 0, -170, 210); g.addColorStop(0, 'rgba(255,248,220,.55)'); g.addColorStop(1, 'rgba(255,230,160,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -170, 210, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  for (const sd of [-1, 1]) for (let i = 0; i < 7; i++) { const an = -Math.PI / 2 + sd * (0.35 + i * 0.2) + Math.sin(t * 0.1) * 0.05 * sd, L = 150 - i * 12; // the wings: long feathers fanning out
    ctx.fillStyle = i % 2 ? 'rgba(255,252,240,.95)' : 'rgba(240,236,220,.95)'; ctx.save(); ctx.translate(sd * 14, -230); ctx.rotate(an + Math.PI / 2); ctx.beginPath(); ctx.ellipse(0, -L / 2, 13, L / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#fbf7ec'; ctx.beginPath(); ctx.moveTo(-34, -240); ctx.lineTo(34, -240); ctx.lineTo(56, 0); ctx.lineTo(-56, 0); ctx.closePath(); ctx.fill(); // the robe
  ctx.strokeStyle = '#e2c46a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-56, -6); ctx.lineTo(56, -6); ctx.moveTo(0, -240); ctx.lineTo(0, -10); ctx.stroke();
  ctx.fillStyle = '#f2d6b8'; ctx.beginPath(); ctx.arc(0, -266, 26, 0, Math.PI * 2); ctx.fill(); // head
  ctx.fillStyle = '#f6e3a6'; ctx.beginPath(); ctx.ellipse(0, -282, 30, 16, 0, Math.PI, 0); ctx.fill(); // golden hair
  ctx.fillStyle = '#5a4a3a'; ctx.fillRect(6, -270, 4, 3); ctx.fillRect(16, -270, 4, 3); // closed, peaceful eyes
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,225,120,.95)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(0, -306, 30, 8, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); // the halo
  ctx.strokeStyle = '#fbf7ec'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-26, -226); ctx.lineTo(-4, -190); ctx.moveTo(26, -226); ctx.lineTo(4, -190); ctx.stroke(); // hands together in prayer
  ctx.restore();
}
function drawBigDemon(x, y, sc, a, t, face) { // a full-size demon: hunched, horned, bat-winged, eyes burning
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc * face, sc); ctx.globalAlpha = a;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, -160, 10, 0, -160, 220); g.addColorStop(0, 'rgba(255,80,40,.45)'); g.addColorStop(1, 'rgba(120,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -160, 220, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  for (const sd of [-1, 1]) { const fl = Math.sin(t * 0.15) * 10; ctx.fillStyle = '#3a0d12'; ctx.beginPath(); ctx.moveTo(sd * 20, -220); ctx.lineTo(sd * 150, -300 - fl); ctx.lineTo(sd * 130, -240 - fl); ctx.lineTo(sd * 170, -200 - fl); ctx.lineTo(sd * 120, -180); ctx.lineTo(sd * 140, -130); ctx.lineTo(sd * 40, -170); ctx.closePath(); ctx.fill(); // bat wings
    ctx.strokeStyle = '#6a1a1a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sd * 20, -220); ctx.lineTo(sd * 150, -300 - fl); ctx.moveTo(sd * 20, -215); ctx.lineTo(sd * 170, -200 - fl); ctx.moveTo(sd * 20, -210); ctx.lineTo(sd * 140, -130); ctx.stroke(); }
  ctx.fillStyle = '#7a1414'; ctx.beginPath(); ctx.moveTo(-60, -230); ctx.quadraticCurveTo(0, -260, 60, -230); ctx.lineTo(44, -110); ctx.lineTo(30, 0); ctx.lineTo(8, 0); ctx.lineTo(0, -90); ctx.lineTo(-8, 0); ctx.lineTo(-30, 0); ctx.lineTo(-44, -110); ctx.closePath(); ctx.fill(); // a hulking body and legs
  ctx.strokeStyle = '#7a1414'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-56, -220); ctx.lineTo(-86, -150); ctx.lineTo(-70, -96); ctx.moveTo(56, -220); ctx.lineTo(90, -160); ctx.lineTo(96, -110); ctx.stroke(); // arms
  ctx.strokeStyle = '#f0e0c0'; ctx.lineWidth = 3; for (const [hx, hy] of [[-70, -96], [96, -110]]) for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(hx + i * 5, hy); ctx.lineTo(hx + i * 7, hy + 14); ctx.stroke(); } // claws
  ctx.fillStyle = '#8a1818'; ctx.beginPath(); ctx.arc(0, -262, 30, 0, Math.PI * 2); ctx.fill(); // head
  ctx.fillStyle = '#e8dcc0'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 18, -282); ctx.quadraticCurveTo(sd * 52, -300, sd * 44, -334); ctx.quadraticCurveTo(sd * 40, -300, sd * 8, -286); ctx.closePath(); ctx.fill(); } // horns
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#ffdd66'; for (const ex of [6, 18]) { ctx.beginPath(); ctx.ellipse(ex, -266, 5, 3, 0.2, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); // burning eyes
  ctx.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-6 + i * 7, -246); ctx.lineTo(-3 + i * 7, -238); ctx.lineTo(i * 7, -246); ctx.fill(); } // fangs
  ctx.strokeStyle = '#7a1414'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-20, -40); ctx.quadraticCurveTo(-120, -20, -110, -90); ctx.stroke(); ctx.fillStyle = '#7a1414'; ctx.beginPath(); ctx.moveTo(-110, -90); ctx.lineTo(-122, -112); ctx.lineTo(-98, -102); ctx.closePath(); ctx.fill(); // the tail
  ctx.restore();
}
function possessDoubleFX(f) {
  const mf = f.mf, s0 = f.ch.scale, face = f.facing, BIG = 1.5 * s0 * (200 / 300);
  const ax = f.x + face * 95 * s0, dx = f.x - face * 95 * s0, y0 = GROUND - f.y - 150 * s0; // the angel takes the side in front of him, the devil the side behind
  if (mf < 14) { const k = mf / 14; // both little ones rise off his shoulders, one each way, glowing
    for (const [kind, x] of [['angel', ax], ['devil', dx]]) { const px = lerp(f.x, x, k * 0.6), py = y0 - 50 * k; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = kind === 'angel' ? `rgba(255,245,200,${0.45 * k})` : `rgba(255,80,50,${0.45 * k})`; ctx.beginPath(); ctx.arc(px, py, 26 + 18 * k, 0, Math.PI * 2); ctx.fill(); ctx.restore(); drawMini(kind, px, py, 1.15 + k * 0.8, face); }
    return; }
  if (mf < 30) { const k = (mf - 14) / 16, sc = BIG * (0.25 + 0.75 * easeOutQ(k)), al = 0.3 + 0.7 * k; // they grow into their true forms, towering on either side of him, facing each other across him
    drawBigAngel(ax, GROUND, sc, al, globalT, -face); drawBigDemon(dx, GROUND + Math.sin(globalT * 0.9) * 2, sc, al, globalT, face);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,240,190,${0.5 * k})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, GROUND - 160 * s0); ctx.lineTo(f.x, GROUND - f.y - 100 * s0); ctx.stroke(); ctx.strokeStyle = `rgba(255,80,50,${0.5 * k})`; ctx.beginPath(); ctx.moveTo(dx, GROUND - 160 * s0); ctx.lineTo(f.x, GROUND - f.y - 100 * s0); ctx.stroke(); ctx.restore(); // light and fire reaching for him
    return; }
  if (mf < 44) { const k = (mf - 30) / 14, e = easeInOutQ(k); // ...and both step into him at once, from both sides
    drawBigAngel(lerp(ax, f.x, e), GROUND, BIG * (1 - 0.35 * k), 1 - k, globalT, -face); drawBigDemon(lerp(dx, f.x, e), GROUND, BIG * (1 - 0.35 * k), 1 - k, globalT, face);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cx = f.x, cy = GROUND - f.y - 100 * s0; // a spiral of light and fire winding into him
    for (let i = 0; i < 16; i++) { const an = globalT * 0.3 + i * Math.PI / 8, r = 120 * (1 - k) + 20; ctx.fillStyle = i % 2 ? `rgba(255,240,190,${0.7 * k})` : `rgba(255,80,50,${0.7 * k})`; ctx.beginPath(); ctx.arc(cx + Math.cos(an) * r, cy + Math.sin(an) * r * 0.6, 4, 0, Math.PI * 2); ctx.fill(); }
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 160); g.addColorStop(0, `rgba(255,220,220,${0.75 * k})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 160, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return; }
  if (mf < 52) { const k = (mf - 44) / 8; ctx.save(); ctx.globalCompositeOperation = 'lighter'; // the combined form revealed: a burst, half holy light and half hellfire
    for (const [col, a0] of [['255,240,190', -Math.PI / 2], ['255,80,50', Math.PI / 2]]) { ctx.strokeStyle = `rgba(${col},${1 - k})`; ctx.lineWidth = 8 * (1 - k) + 2; ctx.beginPath(); ctx.arc(f.x, GROUND - f.y - 100 * s0, 40 + 160 * k, a0, a0 + Math.PI); ctx.stroke(); }
    ctx.restore(); }
}
function possessFX(f, kind) { // the possession, in three acts: the little one rises and grows... into a full-size spirit behind him... which merges into him
  const mf = f.mf, s0 = f.ch.scale, face = f.facing, angel = kind === 'angel';
  const sx = f.x - face * 34 * s0, sy = GROUND, BIG_SC = 1.5 * s0 * (200 / 300); // full size: one and a half times his height
  if (mf < 14) { const k = mf / 14; drawMini(kind, f.x + (angel ? face : -face) * 24 * (1 - k) - face * 20 * k, GROUND - f.y - (150 + 60 * k) * s0, 1.15 + k * 0.8, face); // the little one floats up behind him, glowing
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = angel ? `rgba(255,245,200,${0.4 * k})` : `rgba(255,80,50,${0.4 * k})`; ctx.beginPath(); ctx.arc(f.x - face * 20 * k, GROUND - f.y - (150 + 60 * k) * s0, 30 + 20 * k, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return; }
  if (mf < 30) { const k = (mf - 14) / 16, sc = BIG_SC * (0.25 + 0.75 * easeOutQ(k)); // ...and grows into its true form, towering behind him
    if (angel) drawBigAngel(sx, sy, sc, 0.3 + 0.7 * k, globalT, face); else drawBigDemon(sx, sy + Math.sin(globalT * 0.9) * 2, sc, 0.3 + 0.7 * k, globalT, face);
    if (mf === 14) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = angel ? 'rgba(255,250,230,.6)' : 'rgba(255,90,50,.5)'; ctx.fillRect(0, 0, W, H); ctx.restore(); } return; }
  if (mf < 44) { const k = (mf - 30) / 14; // ...then it steps forward into him, fading as it merges with his body
    const x = lerp(sx, f.x, easeInOutQ(k)); if (angel) drawBigAngel(x, sy, BIG_SC * (1 - 0.35 * k), 1 - k, globalT, face); else drawBigDemon(x, sy, BIG_SC * (1 - 0.35 * k), 1 - k, globalT, face);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(f.x, GROUND - f.y - 100 * s0, 10, f.x, GROUND - f.y - 100 * s0, 140); g.addColorStop(0, angel ? `rgba(255,250,220,${0.7 * k})` : `rgba(255,70,40,${0.6 * k})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, GROUND - f.y - 100 * s0, 140, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
}
function drawMini(kind, x, y, sc, face) { // drawn the canvas way up (y down)
  const bob = Math.sin(globalT * 0.12 + (kind === 'angel' ? 0 : 2)) * 2;
  ctx.save(); ctx.translate(x, y + bob); ctx.scale(sc * face, sc);
  if (kind === 'angel') {
    ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.ellipse(-7, 2, 6, 3.5, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(7, 2, 6, 3.5, 0.5, 0, Math.PI * 2); ctx.fill(); // wings
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-5, 12); ctx.lineTo(5, 12); ctx.lineTo(2, 2); ctx.lineTo(-2, 2); ctx.closePath(); ctx.fill(); // little robe
    ctx.fillStyle = '#f6d3b5'; ctx.beginPath(); ctx.arc(0, -3, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f5d76e'; ctx.beginPath(); ctx.arc(0, -5, 5.6, Math.PI, 0); ctx.fill();                                   // golden hair
    ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, -12, 5, 1.6, 0, 0, Math.PI * 2); ctx.stroke(); // halo
    ctx.fillStyle = '#333'; ctx.fillRect(1.5, -3.5, 1.2, 1.4); ctx.fillRect(-2.5, -3.5, 1.2, 1.4);
  } else {
    ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-3, 9); ctx.quadraticCurveTo(-12, 10, -10, 2); ctx.stroke();      // tail
    ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.moveTo(-10, 2); ctx.lineTo(-13, 0); ctx.lineTo(-9, -1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d63b2f'; ctx.beginPath(); ctx.ellipse(0, 6, 4.5, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(0, -3, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2b1a1a'; ctx.beginPath(); ctx.moveTo(-4, -7); ctx.lineTo(-6, -12); ctx.lineTo(-2, -8); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(4, -7); ctx.lineTo(6, -12); ctx.lineTo(2, -8); ctx.closePath(); ctx.fill(); // horns
    ctx.strokeStyle = '#2b1a1a'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(6, 10); ctx.lineTo(6, -6); ctx.moveTo(4, -6); ctx.lineTo(4, -9); ctx.moveTo(6, -6); ctx.lineTo(6, -10); ctx.moveTo(8, -6); ctx.lineTo(8, -9); ctx.moveTo(4, -6); ctx.lineTo(8, -6); ctx.stroke(); // tiny pitchfork
    ctx.fillStyle = '#fff59a'; ctx.fillRect(1.5, -4, 1.4, 1.4); ctx.fillRect(-2.5, -4, 1.4, 1.4);
  }
  ctx.restore();
}
function drawSalary(J, C, o) {
  const t = globalT, td = J.td, n = [td[1], -td[0]], pos = o.possess;
  if ((pos === 'angel' || pos === 'double') && !o.tint && !o.flash) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; // feathered wings of light on his back
    for (const k of [0, 1]) { const b = [J.sh[0] - n[0] * 8, J.sh[1] - n[1] * 8 - 4]; ctx.fillStyle = `rgba(255,248,225,${0.55 - k * 0.2})`; ctx.beginPath(); ctx.moveTo(b[0], b[1]);
      ctx.quadraticCurveTo(b[0] - 30 - k * 10, b[1] + 30 + Math.sin(t * 0.15) * 4, b[0] - 46 - k * 8, b[1] + 6); ctx.quadraticCurveTo(b[0] - 26, b[1] - 6, b[0], b[1] - 14); ctx.closePath(); ctx.fill(); }
    ctx.restore(); }
  if ((pos === 'devil' || pos === 'double') && !o.tint && !o.flash) { ctx.strokeStyle = '#7a1414'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(J.hip[0] - n[0] * 8, J.hip[1]); ctx.quadraticCurveTo(J.hip[0] - 34, J.hip[1] - 20 + Math.sin(t * 0.2) * 5, J.hip[0] - 40, J.hip[1] + 6); ctx.stroke();
    ctx.fillStyle = '#7a1414'; ctx.beginPath(); ctx.moveTo(J.hip[0] - 40, J.hip[1] + 6); ctx.lineTo(J.hip[0] - 47, J.hip[1] + 2); ctx.lineTo(J.hip[0] - 41, J.hip[1] + 13); ctx.closePath(); ctx.fill(); } // a devil's tail
  seg(J.hip, J.k2, 10, C.suitB); seg(J.k2, J.f2, 9, C.suitB); foot(J.k2, J.f2, 8.5, 6.5, C.shoe);
  seg(J.sh, J.e2, 9, C.suitB); seg(J.e2, J.h2, 8, C.suitB); dot(J.h2, 4.6, C.skin);
  if (!pos) { ctx.fillStyle = C.bag; ctx.fillRect(J.h2[0] - 12, J.h2[1] - 22, 24, 17); ctx.fillStyle = '#c8a46a'; ctx.fillRect(J.h2[0] - 2, J.h2[1] - 8, 4, 3); seg([J.h2[0] - 4, J.h2[1] - 4], [J.h2[0] + 4, J.h2[1] - 4], 2, '#3a2512'); } // briefcase
  seg(J.hip, J.sh, 19, C.suit);
  seg(mid(J.hip, J.sh, 0.45), [J.sh[0] + n[0] * 2, J.sh[1] + n[1] * 2], 7, C.shirt);                                  // shirt front
  seg(mid(J.hip, J.sh, 0.5), [J.sh[0] + n[0] * 2 - td[0] * 3, J.sh[1] + n[1] * 2 - td[1] * 3], 3.2, C.tie);           // tie
  seg(J.hip, J.k1, 10, C.suit); seg(J.k1, J.f1, 9, C.suit); foot(J.k1, J.f1, 9, 6.5, C.shoe);
  seg(J.sh, J.head, 8, C.skin);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1]));
  ctx.scale(1.2, 1.2);
  dot([0, 0], 11, C.skin); ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(-1, 1.5, 11.3, Math.PI * 0.1, Math.PI * 1.12); ctx.closePath(); ctx.fill(); // neat side part
  dot([-6, -1], 2.4, C.skin);                                                                                             // ear
  const hurt = o.face === 'hitstun' || o.face === 'knock' || o.face === 'stunned', eye = pos === 'devil' ? '#ff2a1a' : pos === 'angel' ? '#4aa3ff' : '#1a1a1a';
  for (const [ex, er] of [[3.6, 1.5], [8.6, 1.3]]) { dot([ex, 1.6], 2.3, '#ffffff'); dot([ex + 0.4, 1.4], er, eye); }  // both eyes, so you can read his face
  ctx.strokeStyle = C.glasses; ctx.lineWidth = 1.2; ctx.strokeRect(1.2, -0.6, 4.8, 4.2); ctx.strokeRect(6.6, -0.6, 4.4, 4.2); seg([6, 1.4], [6.6, 1.4], 1, C.glasses);
  const browY = pos === 'devil' ? 4.6 : hurt ? 6 : 5.2, tilt = pos === 'devil' ? -1.4 : pos === 'angel' ? 0.6 : hurt ? 1.2 : 0;
  seg([1.6, browY + tilt], [5.6, browY - tilt * 0.3], 1.2, C.hair); seg([7, browY - tilt * 0.3], [10.6, browY + tilt], 1.2, C.hair); // eyebrows
  seg([9.6, -1], [10.8, -3], 1.1, '#d9a585');                                                                               // nose
  if (pos === 'devil') { ctx.fillStyle = '#5a0a0a'; ctx.beginPath(); ctx.moveTo(3, -5.5); ctx.quadraticCurveTo(7, -9, 10.5, -5); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(4.5, -6, 1.2, 1.4); ctx.fillRect(8, -6, 1.2, 1.4); } // fanged grin
  else if (pos === 'angel') { ctx.strokeStyle = '#8a4a3a'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(7, -4.6, 2.6, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }                  // serene smile
  else if (hurt || o.face === 'attack') { ctx.fillStyle = '#5a2a2a'; ctx.beginPath(); ctx.ellipse(7.2, -5.4, 2.2, hurt ? 2.6 : 1.8, 0, 0, Math.PI * 2); ctx.fill(); }       // a shout, or a yelp
  else seg([5.4, -5.4], [9, -5.6], 1.2, '#8a4a3a');                                                                        // tired office mouth
  if (!pos && !hurt) { ctx.fillStyle = 'rgba(120,120,160,.25)'; ctx.fillRect(2, -2.6, 3.6, 1); ctx.fillRect(7, -2.6, 3.4, 1); } // the bags under his eyes
  if (pos === 'devil' || pos === 'double') { ctx.fillStyle = '#d32f2f'; ctx.beginPath(); ctx.moveTo(-6, 9); ctx.quadraticCurveTo(-10, 18, -6, 23); ctx.lineTo(-3, 10); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(4, 10); ctx.quadraticCurveTo(4, 20, 9, 23); ctx.lineTo(7, 9); ctx.closePath(); ctx.fill(); } // red horns
  if (pos === 'angel' || pos === 'double') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,220,110,${0.85 + 0.15 * Math.sin(t * 0.2)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 18 + Math.sin(t * 0.1) * 1.5, 10, 3, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); } // halo
  ctx.restore();
  seg(J.sh, J.e1, 9, C.suit); seg(J.e1, J.h1, 8, C.suit); seg(mid(J.e1, J.h1, 0.85), J.h1, 6, C.shirt); dot(J.h1, 4.8, pos === 'devil' ? '#e05a4a' : C.skin);
  if (pos === 'angel' && !o.tint && o.praying) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const m = [(J.h1[0] + J.h2[0]) / 2, Math.max(J.h1[1], J.h2[1]) + 10]; // praying: palms pressed together, a thin line of light rising from the fingertips
    ctx.strokeStyle = 'rgba(255,245,200,.7)'; ctx.lineWidth = 2; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(m[0], m[1]); ctx.lineTo(m[0] + i * 9, m[1] + 30 + (i ? 0 : 12)); ctx.stroke(); } ctx.restore(); }
  else if (pos === 'angel' && !o.tint) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const h of [J.h1, J.h2]) { const g = ctx.createRadialGradient(h[0], h[1], 1, h[0], h[1], 16); g.addColorStop(0, 'rgba(255,250,220,.95)'); g.addColorStop(1, 'rgba(255,220,120,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h[0], h[1], 16 + Math.sin(t * 0.2) * 2, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); } // fists of light
  if (!o.tint && !o.flash && !o.noMinis) { // the two little passengers (the one who has taken him over is gone from his shoulder)
    const up = [-td[0], -td[1]];
    // they sit out on the points of his shoulders, below his face, so his expressions stay readable
    if (pos !== 'angel' && pos !== 'double' && o.hideMini !== 'angel' && o.hideMini !== 'both') { ctx.save(); ctx.translate(J.sh[0] + n[0] * 24 - td[0] * 10, J.sh[1] + n[1] * 24 - td[1] * 10); ctx.scale(1, -1); drawMini('angel', 0, 0, 1.15, 1); ctx.restore(); }
    if (pos !== 'devil' && pos !== 'double' && o.hideMini !== 'devil' && o.hideMini !== 'both') { ctx.save(); ctx.translate(J.sh[0] - n[0] * 24 - td[0] * 10, J.sh[1] - n[1] * 24 - td[1] * 10); ctx.scale(1, -1); drawMini('devil', 0, 0, 1.15, 1); ctx.restore(); }
  }
}
function drawBody(key, pose, x, yS, facing, hipUp, o = {}) {
  const ch = CHARS[key], s = o.scale || ch.scale, J = solve(pose); // (o.scale: a form that changes his size — Tanaka's double possession)
  const C = o.flash ? FLASH : (o.tint || (o.alt && ch.altColors) || ch.colors);
  ctx.save();
  const sx = o.sx == null ? 1 : (o.sx >= 0 ? 1 : -1) * Math.max(0.18, Math.abs(o.sx));
  ctx.translate(x, yS); ctx.scale(facing * s * sx, -s); ctx.translate(0, hipUp);
  if (o.rot) ctx.rotate(o.rot);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.aura) drawAura(J, key);
  DRAWERS[key](J, C, o);
  ctx.restore();
}
const DRAWERS = { ninja: (J, C, o) => drawNinja(J, C, o), brawler: (J, C, o) => drawBrawler(J, C, o), staff: (J, C, o) => drawBao(J, C, o), psychic: (J, C, o) => drawLyra(J, C, o), paladin: (J, C, o) => drawPaladin(J, C, o), kappa: (J, C, o) => drawKappa(J, C, o), gunman: (J, C, o) => drawGunman(J, C, o), salary: (J, C, o) => drawSalary(J, C, o) };
const hoverOf = f => (f.y <= 0 && (f.state === 'stand' || f.state === 'guard' || f.state === 'charge' || f.state === 'win')) ? 5 + Math.sin(globalT * 0.08 + f.side) * 3 : 0; // Lyra floats a little
function drawShadow(x, y, s) {
  const k = 1 - Math.min(y, 220) / 320;
  ctx.fillStyle = `rgba(10,4,14,${0.38 * k})`;
  ctx.beginPath(); ctx.ellipse(x, GROUND + 3, 34 * s * k, 7 * k, 0, 0, Math.PI * 2); ctx.fill();
}
// swirl lines around the body while turning
function drawSpinFX(f, k) {
  const s = f.ch.scale, cx = f.x, a = k * Math.PI * 2 * f.facing;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  ctx.strokeStyle = `rgba(${f.ch.fxCol || f.ch.auraCol},${0.25 + 0.35 * k})`; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(cx, GROUND - f.y - 55 * s, 46 * s, 12 * s, 0, a, a + Math.PI * 1.3); ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(cx, GROUND - f.y - 100 * s, 36 * s, 9 * s, 0, a + 1.5, a + 1.5 + Math.PI); ctx.stroke();
  ctx.restore();
}
// swing trail or qi burst while a heavy technique is active
function drawHeavyFX(f) {
  if (f.state !== 'attack' || !f.move || !(f.move.trail || f.move.burst || f.move.fireCol || f.move.fx || f.move.cloud || f.move.psyFist || f.move.floorGlyph || f.move.groundBurst || f.move.giantFist)) return;
  const mv = f.move, t = f.mf - mv.startup, FC = f.ch.fxCol;
  if (mv.cloud && f.mf >= mv.cloud[0] && f.mf <= mv.cloud[1]) { // Cloud Somersault: a golden cloud under her feet
    const cx = f.x, cy = GROUND - f.y + 4;
    for (let k = 0; k < 5; k++) { ctx.fillStyle = `rgba(255,244,214,${0.75 - k * 0.08})`; ctx.beginPath(); ctx.ellipse(cx + (k - 2) * 16, cy + Math.sin(globalT * 0.3 + k) * 2, 18, 9, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  if (t < 1 || t > mv.active + 4) return;
  const s = f.ch.scale, prog = Math.min(1, t / mv.active), fade = t > mv.active ? 1 - (t - mv.active) / 5 : 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  if (mv.trail) {
    const tr = mv.trail, n = 14;
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const th = (tr.a0 + (tr.a1 - tr.a0) * (i / n) * prog) * RAD;
      const pt = [f.x + f.facing * (tr.cx + tr.r * Math.cos(th)) * s, GROUND - f.y - (tr.cy + tr.r * Math.sin(th)) * s];
      if (prev) {
        ctx.strokeStyle = `rgba(${tr.col},${(0.15 + 0.65 * i / n) * fade})`; ctx.lineWidth = (3 + 9 * i / n) * s;
        ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(pt[0], pt[1]); ctx.stroke();
      }
      prev = pt;
    }
  }
  if (mv.burst) {
    const x = f.x + f.facing * mv.burst[0] * s, y = GROUND - f.y - mv.burst[1] * s, r = 36 * fade + 4;
    const g = ctx.createRadialGradient(x, y, 2, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`); g.addColorStop(0.35, `rgba(${FC},${0.7 * fade})`); g.addColorStop(1, `rgba(${FC},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  if (mv.psyFist) { const [px, py, sc, ang] = mv.psyFist; drawPsyFist(f.x + f.facing * px * s, GROUND - f.y - py * s, sc, f.facing, fade * Math.min(1, t / 2), ang || 0); }
  if (mv.giantFist) { const [gx, gy, sc, ang] = mv.giantFist; drawGiantFist(f.x + f.facing * gx * s, GROUND - f.y - gy * s, sc * (0.85 + 0.15 * Math.min(1, t / 3)), f.facing, fade, ang || 0); }
  if (mv.groundBurst) { // the ground bursts open under them: a rune ring and a tall column of light with crystal shards
    const gx = f.x + f.facing * mv.groundBurst * s, gy = GROUND - 2, k = Math.min(1, t / 3), hh = 220 * k;
    ctx.strokeStyle = `rgba(${FC},${0.95 * fade})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(gx, gy, 56 * k, 13 * k, 0, 0, Math.PI * 2); ctx.stroke();
    const g = ctx.createLinearGradient(gx - 40, 0, gx + 40, 0); g.addColorStop(0, 'rgba(200,170,255,0)'); g.addColorStop(0.5, `rgba(245,235,255,${0.8 * fade})`); g.addColorStop(1, 'rgba(200,170,255,0)');
    ctx.fillStyle = g; ctx.fillRect(gx - 40, gy - hh, 80, hh);
    ctx.fillStyle = `rgba(230,215,255,${0.9 * fade})`;
    for (let i = 0; i < 5; i++) { const sx = gx + (i - 2) * 16, sy = gy - hh * (0.3 + 0.14 * i); ctx.beginPath(); ctx.moveTo(sx, sy - 12); ctx.lineTo(sx + 5, sy); ctx.lineTo(sx, sy + 12); ctx.lineTo(sx - 5, sy); ctx.closePath(); ctx.fill(); }
  }
  if (mv.floorGlyph) { // a rune circle flares on the floor under their feet, with light bursting up out of it
    const gx = f.x + f.facing * mv.floorGlyph * s, gy = GROUND - 2, k = Math.min(1, t / 3), spin = globalT * 0.08;
    ctx.strokeStyle = `rgba(${FC},${0.9 * fade})`; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.ellipse(gx, gy, 46 * k, 11 * k, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(gx, gy, 32 * k, 7.5 * k, 0, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 6; i++) { const an = spin + i * Math.PI / 3; ctx.beginPath(); ctx.moveTo(gx + Math.cos(an) * 32 * k, gy + Math.sin(an) * 7.5 * k); ctx.lineTo(gx + Math.cos(an + 2.1) * 32 * k, gy + Math.sin(an + 2.1) * 7.5 * k); ctx.stroke(); }
    const g = ctx.createLinearGradient(0, gy, 0, gy - 70); g.addColorStop(0, `rgba(230,215,255,${0.6 * fade})`); g.addColorStop(1, 'rgba(200,170,255,0)');
    ctx.fillStyle = g; ctx.fillRect(gx - 30 * k, gy - 70, 60 * k, 70);
  }
  if (mv.fx === 'barrier') { // a shimmering hexagonal barrier in front of her
    const cx = f.x + f.facing * 46 * s, cy = GROUND - f.y - 100 * s, r = 62 * s;
    ctx.strokeStyle = `rgba(255,170,240,${0.85 * fade})`; ctx.lineWidth = 3; ctx.fillStyle = `rgba(255,140,230,${0.14 * fade})`;
    ctx.beginPath(); for (let i = 0; i <= 6; i++) { const an = i * Math.PI / 3 + Math.PI / 6; const xx = cx + Math.cos(an) * r * 0.45, yy = cy + Math.sin(an) * r; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.fill(); ctx.stroke();
  }
  if (mv.fx === 'cone') { // a qi shockwave fanning out from the palms
    const cx = f.x + f.facing * 70 * s, cy = GROUND - f.y - 105 * s;
    for (let k = 0; k < 3; k++) {
      const r = (20 + t * 9 + k * 14) * s, a0 = f.facing > 0 ? -0.55 : Math.PI - 0.55;
      ctx.strokeStyle = `rgba(${FC},${(0.75 - k * 0.2) * fade})`; ctx.lineWidth = 5 - k;
      ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + 1.1); ctx.stroke();
    }
  }
  if (mv.fx === 'cyclone') { // qi rings whirling around the lariat
    for (let k = 0; k < 3; k++) {
      const yy = GROUND - f.y - (62 + k * 36) * s, ph = globalT * 0.55 * f.facing + k * 2;
      ctx.strokeStyle = `rgba(${FC},${(0.6 - k * 0.12) * fade})`; ctx.lineWidth = 3.5 - k * 0.5;
      ctx.beginPath(); ctx.ellipse(f.x, yy, (82 - k * 10) * s, (15 - k * 2) * s, 0, ph, ph + Math.PI * 1.4); ctx.stroke();
    }
  }
  if (mv.fx === 'ward') { // the parry circle held in front of his palms
    const cx = f.x + f.facing * 58 * s, cy = GROUND - f.y - 108 * s, r = 46 * s;
    ctx.strokeStyle = `rgba(${FC},${0.8 * fade})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.38, r, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([7, 9]); ctx.lineDashOffset = -globalT * 1.6; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.26, r * 0.72, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  }
  if (mv.fireCol === 'qi') { // Qi Geyser: a bright pillar of qi with two strands coiling up it
    const bx = f.x + f.facing * 58 * s, hgt = 235 * Math.min(1, t / 5), base = GROUND - f.y;
    const g = ctx.createLinearGradient(bx - 28, 0, bx + 28, 0);
    g.addColorStop(0, 'rgba(40,160,255,0)'); g.addColorStop(0.5, `rgba(210,250,255,${0.8 * fade})`); g.addColorStop(1, 'rgba(40,160,255,0)');
    ctx.fillStyle = g; ctx.fillRect(bx - 28, base - hgt, 56, hgt);
    ctx.lineWidth = 3;
    for (let k = 0; k < 2; k++) {
      ctx.strokeStyle = `rgba(${k ? '220,255,255' : '90,210,255'},${0.8 * fade})`;
      ctx.beginPath();
      for (let i = 0; i <= 26; i++) { const yy = i / 26 * hgt, xx = bx + Math.sin(yy * 0.055 + globalT * 0.45 + k * Math.PI) * 24; i ? ctx.lineTo(xx, base - yy) : ctx.moveTo(xx, base - yy); }
      ctx.stroke();
    }
    ctx.strokeStyle = `rgba(125,235,255,${0.85 * fade})`; ctx.beginPath(); ctx.ellipse(bx, base, 44, 9, 0, 0, Math.PI * 2); ctx.stroke();
  } else if (mv.fireCol) { // a column of fire rising in front of him
    const bx = f.x + f.facing * 58 * s, grow = Math.min(1, t / 6);
    for (let k = 0; k < 10; k++) {
      const yy = GROUND - f.y - (k / 9) * 215 * grow, wob = Math.sin(globalT * 0.5 + k) * 4, r = (16 + k * 1.6) * (0.85 + 0.15 * Math.sin(globalT * 0.9 + k));
      ctx.fillStyle = mv.fireCol === 'qi' ? `rgba(60,${200 + k * 4},255,${0.36 * fade})` : `rgba(255,${130 - k * 6},40,${0.38 * fade})`; ctx.beginPath(); ctx.arc(bx + wob, yy, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = mv.fireCol === 'qi' ? `rgba(220,255,255,${0.42 * fade})` : `rgba(255,230,150,${0.42 * fade})`; ctx.beginPath(); ctx.arc(bx + wob, yy, r * 0.45, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}
// Kuro sunk into a shadow during Shadow Ambush
function drawShadowForm(f) {
  const x = f.x, y = GROUND + 1;
  const g = ctx.createRadialGradient(x, y, 4, x, y, 64);
  g.addColorStop(0, 'rgba(16,8,34,.95)'); g.addColorStop(0.65, 'rgba(70,36,130,.55)'); g.addColorStop(1, 'rgba(70,36,130,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 60, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff5a6e';
  ctx.fillRect(x + f.facing * 8 - 3, y - 5, 6, 2); ctx.fillRect(x + f.facing * 18 - 3, y - 5, 6, 2);
}
const orbCount = f => 0; // (no orbs from losing health; Lyra's orbs come only from her summons)
function orbPos(f, i, n) { // a row of halo orbs floating above her head
  const s = f.ch.scale;
  return [f.x + (i - (n - 1) / 2) * 24 * s, GROUND - f.y - (182 + Math.sin(globalT * 0.08 + i * 1.3) * 4) * s, 0];
}
function drawOrbs(f) {
  if (f.sorbs && f.sorbs.length) { // summoned orbs: pink strong ones, blue long ones, on a wider orbit
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    f.sorbs.forEach((q, i) => {
      const [x, y] = sorbPos(f, i, f.sorbs.length), strong = q.kind === 'strong', r = strong ? 10 : 7, fade = Math.min(1, q.life / 40) * (q.cd > 0 ? 0.5 : 1);
      const col = strong ? '255,120,200' : '150,200,255';
      const g = ctx.createRadialGradient(x, y, 1, x, y, r * 2.6); g.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`); g.addColorStop(0.35, `rgba(${col},${0.8 * fade})`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(${col},${0.7 * fade})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r + 4 + Math.sin(globalT * 0.2 + i) * 2, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.restore();
  }
  const n = orbCount(f); if (!n) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const [x, y] = orbPos(f, i, n), ready = !(f.orbCD && f.orbCD[i] > 0), r = ready ? 7 : 4.5; // golden halo orbs, unlike the summoned ones
    const g = ctx.createRadialGradient(x, y, 1, x, y, r * 2.4); g.addColorStop(0, `rgba(255,252,235,${ready ? 0.95 : 0.5})`); g.addColorStop(0.4, `rgba(255,215,110,${ready ? 0.75 : 0.35})`); g.addColorStop(1, 'rgba(255,200,90,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(255,230,150,${ready ? 0.8 : 0.35})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(x, y, r + 5, (r + 5) * 0.35, 0, 0, Math.PI * 2); ctx.stroke(); // a little halo ring
    if (ready) { ctx.beginPath(); ctx.moveTo(x - r - 3, y); ctx.lineTo(x + r + 3, y); ctx.moveTo(x, y - r - 3); ctx.lineTo(x, y + r + 3); ctx.stroke(); }
  }
  ctx.restore();
}
// halo orbs also fire on their own: each one, every couple of seconds, takes a shot at the opponent
function haloFire(f) {
  const n = orbCount(f); if (!n || f.hp <= 0) return;
  f.orbCD = f.orbCD || [];
  const o = other(f);
  for (let i = 0; i < n; i++) {
    if (f.orbCD[i] > 0 || (game.frame + i * 41) % 140 !== 0 || Math.abs(o.x - f.x) > 620) continue;
    f.orbCD[i] = 60;
    const [x, y] = orbPos(f, i, n), tx = o.x, ty = GROUND - o.y - 90 * o.ch.scale, hu = hurtbox(o, true);
    parts.push({ type: 'ray', x, y, x1: tx, y1: ty, life: 12, max: 12, col: '255,215,110', w: 0.9 });
    sfx('zap');
    if (!hu) continue;
    const hb = { x0: tx - 10, x1: tx + 10, y0: GROUND - ty - 10, y1: GROUND - ty + 10 };
    applyHit(f, o, { dmg: 6, stun: 10, bstun: 6, push: 1, type: 'mid', chip: true, hitstop: 2, proj: true, str: 0, gdrain: 3, juggle: true, jugVy: 4, label: 'Halo Orb' }, Math.sign(o.x - f.x) || f.facing, hb, hu);
  }
}
// when Lyra is hit, every ready orb fires a ray of light at the attacker
// summoned orbs: ← ← + J makes 3 strong orbs (one fires a heavy ray with each attack, then it's spent);
// ← ← + K makes 5 long-lasting orbs (every ready one fires a lighter ray with each attack)
function summonOrbs(f, kind, n) {
  f.sorbs = [];
  for (let i = 0; i < n; i++) f.sorbs.push({ kind, life: kind === 'strong' ? 600 : 840, cd: 0 });
  puffCol(f.x, 110, kind === 'strong' ? '255,120,200' : '150,200,255'); sfx('orb');
  popText(f.x, GROUND - f.y - 195, kind === 'strong' ? '3 STRONG ORBS' : '5 LONG ORBS', kind === 'strong' ? '255,150,220' : '170,210,255');
}
function sorbPos(f, i, n) {
  const a = -globalT * 0.05 + i * Math.PI * 2 / n, s = f.ch.scale;
  return [f.x + Math.cos(a) * 70 * s, GROUND - f.y - (95 + Math.sin(a * 1.5) * 8) * s - Math.sin(a) * 24];
}
function orbAssist(f, mv) { // her attack is joined by rays from the summoned orbs
  if (!f.sorbs || !f.sorbs.length || mv.summon) return;
  const o = other(f), n = f.sorbs.length;
  const fire = (i, strong) => {
    const [x, y] = sorbPos(f, i, n), tx = o.x, ty = GROUND - o.y - 85 * o.ch.scale;
    parts.push({ type: 'ray', x, y, x1: tx, y1: ty, life: 12, max: 12, col: strong ? '255,120,200' : '150,200,255', w: strong ? 1.6 : 1 });
    const hu = hurtbox(o, true); if (!hu) return;
    const hb = { x0: tx - 10, x1: tx + 10, y0: GROUND - ty - 10, y1: GROUND - ty + 10 };
    applyHit(f, o, strong ? { dmg: 14, stun: 16, bstun: 10, push: 2, type: 'mid', chip: true, hitstop: 5, proj: true, str: 1, gdrain: 8, juggle: true, jugVy: 5, label: 'Strong Orb' }
      : { dmg: 6, stun: 12, bstun: 8, push: 1, type: 'mid', chip: true, hitstop: 3, proj: true, str: 1, gdrain: 4, juggle: true, jugVy: 4.5, label: 'Long Orb' }, Math.sign(o.x - f.x) || f.facing, hb, hu);
  };
  const si = f.sorbs.findIndex(q => q.kind === 'strong');
  if (si >= 0) { fire(si, true); f.sorbs.splice(si, 1); sfx('zap'); return; }
  let fired = 0;
  f.sorbs.forEach((q, i) => { if (q.cd <= 0 && fired < 5) { q.cd = 110; fired++; fire(i, false); } });
  if (fired) sfx('zap');
}
function psyRetaliate(d, a) {
  const n = orbCount(d); if (!n || a.ch.orbs) return;
  d.orbCD = d.orbCD || [];
  let fired = 0;
  for (let i = 0; i < n; i++) {
    if (d.orbCD[i] > 0) continue;
    d.orbCD[i] = 180; fired++;
    const [x, y] = orbPos(d, i, n), tx = a.x + rnd(-10, 10), ty = GROUND - a.y - rnd(60, 120) * a.ch.scale;
    parts.push({ type: 'ray', x, y, x1: tx, y1: ty, life: 12, max: 12, delay: i * 2 });
    a.hp = Math.max(1, a.hp - 4);
  }
  if (fired) { a.flash = 5; sparks(a.x, GROUND - a.y - 90, 'block'); popText(d.x, GROUND - d.y - 200, fired > 1 ? `${fired} RAYS` : 'RAY', '255,170,240'); sfx('zap'); }
}
// Holy Judgement: wings of light open behind Aldric
function drawWings(f) {
  const s = f.ch.scale, x = f.x - f.facing * 6, y = GROUND - f.y - 150 * s, k = Math.min(1, f.mf / 12);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const side of [-1, 1]) for (let i = 0; i < 7; i++) {
    const an = -Math.PI / 2 + side * (0.35 + i * 0.2) * k, L = (70 + i * 14) * s * k;
    ctx.strokeStyle = `rgba(${200 - i * 8},${228 - i * 4},255,${0.55 - i * 0.05})`; ctx.lineWidth = 9 - i * 0.7;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(an) * L * 0.6 - side * 10, y + Math.sin(an) * L * 0.4, x + Math.cos(an - side * 0.5) * L, y + Math.sin(an - side * 0.5) * L * 0.8); ctx.stroke();
  }
  ctx.restore();
}
function drawSanctuary(f) { // a dome of light over the planted sword
  const R = Math.min(240, (f.mf - 16) * 14), y = GROUND, fade = f.mf > 58 ? Math.max(0, 1 - (f.mf - 58) / 8) : 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(f.x, y, R * 0.2, f.x, y, R); g.addColorStop(0, `rgba(170,215,255,${0.08 * fade})`); g.addColorStop(0.85, `rgba(170,215,255,${0.2 * fade})`); g.addColorStop(1, 'rgba(170,215,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(f.x, y, R, R * 0.92, 0, Math.PI, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = `rgba(225,242,255,${0.75 * fade})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(f.x, y, R, R * 0.92, 0, Math.PI, 2 * Math.PI); ctx.stroke();
  for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.ellipse(f.x, y, R * k / 4, R * 0.92, 0, Math.PI, 2 * Math.PI); ctx.strokeStyle = `rgba(200,230,255,${0.2 * fade})`; ctx.stroke(); } // meridians
  ctx.restore();
}
function drawAegis(f) { // a sphere of light around him: it fades as it runs out (time or guard meter, whichever is closer), flickers and cracks near the end, flashes when hit
  const mv = f.move, s = f.ch.scale, cx = f.x, cy = GROUND - f.y - 95 * s, R = 108 * s, t = globalT;
  const left = Math.min(f.guard / 100, mv ? Math.max(0, 1 - (f.mf - 14) / 240) : 1); // how much is left
  const low = left < 0.3, flick = low ? (Math.floor(t / (left < 0.15 ? 2 : 4)) % 2 ? 0.35 : 1) : 1, hitF = mv && mv.aegisHitT != null ? Math.max(0, 1 - (game.frame - mv.aegisHitT) / 10) : 0;
  const k = (0.12 + 0.88 * left) * flick + hitF * 0.8;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  if (hitF > 0) { ctx.strokeStyle = `rgba(255,255,255,${hitF})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R * (1 + 0.08 * (1 - hitF)), 0, Math.PI * 2); ctx.stroke(); } // the flash of a hit tearing into it
  if (left < 0.5) { ctx.strokeStyle = `rgba(230,245,255,${0.7 * flick})`; ctx.lineWidth = 1.5; const n = Math.round((0.5 - left) * 16); // cracks spreading across it
    for (let i = 0; i < n; i++) { const an = i * 2.4 + 0.7, r0 = R * 0.95; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); ctx.lineTo(cx + Math.cos(an + 0.12) * r0 * 0.78, cy + Math.sin(an + 0.12) * r0 * 0.78); ctx.lineTo(cx + Math.cos(an - 0.05) * r0 * 0.62, cy + Math.sin(an - 0.05) * r0 * 0.62); ctx.stroke(); } }
  const g = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R); g.addColorStop(0, 'rgba(150,205,255,0)'); g.addColorStop(0.85, `rgba(150,205,255,${0.22 * k})`); g.addColorStop(1, `rgba(220,240,255,${0.5 * k})`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = `rgba(225,242,255,${0.7 * k})`; ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) { const an = t * 0.03 + i * Math.PI / 3; ctx.beginPath(); ctx.ellipse(cx, cy, R * Math.abs(Math.cos(an)), R, 0, 0, Math.PI * 2); ctx.globalAlpha = 0.35; ctx.stroke(); } // turning meridians
  ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}
function drawRage(f) { // the Rampart Charge: a red-gold fury streaming off the shield
  const s = f.ch.scale, x = f.x + f.facing * 46 * s, y = GROUND - f.y - 110 * s;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) { const yy = y + (i - 2.5) * 16 * s, L = 50 + 30 * Math.sin(globalT * 0.5 + i); ctx.strokeStyle = `rgba(255,${150 + i * 12},90,${0.45})`; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x - f.facing * L, yy + Math.sin(globalT * 0.3 + i) * 6); ctx.stroke(); }
  const g = ctx.createRadialGradient(x, y, 4, x, y, 60); g.addColorStop(0, 'rgba(255,190,120,.55)'); g.addColorStop(1, 'rgba(255,120,80,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 60, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function drawChargeGauge(f, mv) { // a gauge over the head that fills while the button is held, marked Lv1 / Lv2 / MAX
  const marks = mv.chargeMarks, full = marks[marks.length - 1][0], k = Math.min(1, f.mf / full), s = f.ch.scale;
  const w = 96, h = 9, x = f.x - w / 2, y = GROUND - f.y - 222 * s, col = f.ch.auraCol || '255,255,255';
  let lbl = L('CHARGE', '溜め'); for (const [fr, l] of marks) if (f.mf >= fr) lbl = l;
  ctx.save();
  ctx.fillStyle = 'rgba(8,8,20,.72)'; rr(x - 3, y - 3, w + 6, h + 6, 5); ctx.fill();
  const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, `rgba(${col},.55)`); g.addColorStop(1, `rgba(${col},1)`);
  ctx.fillStyle = g; rr(x, y, Math.max(2, w * k), h, 3); ctx.fill();
  if (k >= 1) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.25 * Math.sin(globalT * 0.5)})`; rr(x, y, w, h, 3); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; } // full: it flashes
  ctx.font = "700 10px 'Rajdhani', 'Segoe UI', system-ui, sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (const [fr, l] of marks) { const tx = x + w * fr / full; ctx.fillStyle = f.mf >= fr ? '#ffffff' : 'rgba(255,255,255,.45)'; ctx.fillRect(tx - 1, y - 2, 2, h + 4); ctx.strokeStyle = 'rgba(8,8,20,.85)'; ctx.lineWidth = 3; ctx.strokeText(l, Math.min(tx, x + w - 8), y + h + 4); ctx.fillText(l, Math.min(tx, x + w - 8), y + h + 4); } // a tick and a label for each level
  ctx.font = `15px ${HUD}`; ctx.textBaseline = 'bottom'; ctx.strokeStyle = 'rgba(8,8,20,.9)'; ctx.lineWidth = 4; ctx.strokeText(lbl, f.x, y - 5); ctx.fillStyle = k >= 1 ? '#ffe066' : '#ffffff'; ctx.fillText(lbl, f.x, y - 5); // the level reached so far
  ctx.restore();
}
function drawCharge(f, lvl) { // light gathering on the drawn-back sword: one cross per level above his helm
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < lvl; i++) { const x = f.x + (i - (lvl - 1) / 2) * 16, y = GROUND - f.y - 205 * f.ch.scale; ctx.fillStyle = 'rgba(200,232,255,.95)'; ctx.fillRect(x - 2, y - 9, 4, 18); ctx.fillRect(x - 7, y - 4, 14, 4); }
  ctx.restore();
}
// holy brands burned onto a fighter, one small cross each
function drawBrands(f) {
  const s = f.ch.scale, n = f.brands, y = GROUND - f.y - 112 * s, pulse = 0.6 + 0.4 * Math.sin(globalT * 0.3);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x = f.x + (i - (n - 1) / 2) * 14;
    ctx.fillStyle = `rgba(190,225,255,${0.95 * pulse})`; ctx.fillRect(x - 1.8, y - 8, 3.6, 16); ctx.fillRect(x - 6, y - 3, 12, 3.6);
  }
  ctx.restore();
}
function drawFighter(f) {
  if (f.hidden) return;
  if (f.shadow) { drawShadowForm(f); return; }
  const aura = f.state === 'charge' || (f.state === 'attack' && f.move && f.move.aura) || (game.superFlash && game.superFlash.f === f);
  const blink = (f.state === 'getup' || f.state === 'roll' || f.state === 'broll' || (f.invul > 0 && f.state === 'stand')) && globalT % 4 < 2;
  const blade = f.state === 'attack' && f.move && f.move.blade && f.mf > 2;
  const mv = f.state === 'attack' ? f.move : null;
  const sword = mv && mv.sword && (mv.iai ? f.mf > 16 && f.mf < 45 : f.mf >= 8);
  if (f.shadowRun) { // dashing as a shadow: drawn exactly like a shadow clone
    for (let k = 3; k >= 1; k--) drawBody(f.key, f.pose, f.x - f.vx * k * 1.8, GROUND - f.y, f.facing, f.hipUp, { scale: f.ch.scale, tint: SHADOW_TINT, alpha: 0.12 * (4 - k) });
    drawBody(f.key, f.pose, f.x, GROUND - f.y, f.facing, f.hipUp, { scale: f.ch.scale, tint: SHADOW_TINT, alpha: 0.85 });
    return;
  }
  if (mv && mv.ghost && f.mf > mv.startup && f.mf <= mv.startup + mv.active) // afterimages trailing the air iai
    for (let k = 3; k >= 1; k--) drawBody(f.key, f.pose, f.x - (f.x - (f.ia ? f.ia.x0 : f.x)) * 0.08 * k, GROUND - f.y + k * 6, f.facing, f.hipUp, { scale: f.ch.scale, alpha: 0.14 * (4 - k), sword: true });
  if (mv && mv.iai && f.mf > 16 && f.mf <= 24) // afterimages along the iai dash
    for (let k = 3; k >= 1; k--) drawBody(f.key, f.pose, f.x - f.vx * k * 0.5, GROUND - f.y, f.facing, f.hipUp, { scale: f.ch.scale, alpha: 0.15 * (4 - k), sword: true });
  const sp = f.state === 'attack' && f.move && f.move.spin;
  const turn = sp && f.mf >= sp[0] && f.mf <= sp[1] ? (f.mf - sp[0] + 1) / (sp[1] - sp[0] + 1) : null;
  if (turn !== null) drawSpinFX(f, turn);
  if (mv && mv.wings) drawWings(f);
  if (mv && mv.sanctuary && f.mf > 16) drawSanctuary(f);
  if (mv && mv.aegis && mv.aegisOn) drawAegis(f);
  if (mv && mv.rage && !mv.fired && f.mf > 10) drawRage(f);
  // Mei's staff: it can stretch out (Extending Staff) or spin like a windmill
  let staffExt = 0, staffSpin = null;
  if (mv && mv.staffExt) { const k = f.mf - mv.startup; staffExt = mv.staffExt * (k <= 0 ? 0 : k <= 3 ? k / 3 : k <= mv.active ? 1 : Math.max(0, 1 - (k - mv.active) / 6)); }
  if (mv && mv.spinStaff && f.mf > Math.max(1, mv.startup - 4)) staffSpin = globalT * 0.7 * f.facing;
  if (mv && mv.spinWind && f.mf <= mv.startup) staffSpin = globalT * 0.9 * f.facing; // twirls the staff to wind up
  if (f.key === 'staff' && (f.state === 'stand' || f.state === 'jump' && f.dj) && (globalT + f.side * 97) % 220 < 34) staffSpin = globalT * 0.55 * f.facing; // twirls it now and then
  let rot = f.state === 'roll' ? -(f.st / 24) * Math.PI * 2 * f.rollDir * f.facing : f.state === 'broll' ? (Math.max(0, f.st - 4) / 20) * Math.PI * 2 : 0;
  if (f.flipT > 0) rot = -(1 - f.flipT / (f.flipMax || 20)) * Math.PI * 2; // somersault
  if (mv && mv.speedFx && f.mf > mv.startup - 6 && f.mf <= mv.startup + mv.active) // afterimages on fast techniques
    for (let k = 3; k >= 1; k--) drawBody(f.key, f.pose, f.x - (f.vx || f.facing * 4) * k * 1.6, GROUND - f.y, f.facing, f.hipUp, { scale: f.ch.scale, alpha: 0.1 * (4 - k), tint: GHOST_TINT[f.key], staffExt, staffSpin, sword });
  const dance = f.state === 'stunned' && f.stunKind === 'dance' ? Math.abs(Math.sin(f.st * 0.4)) * 20 : 0; // made to dance by the gunslinger
  const gunOut = f.key !== 'gunman' || f.state === 'attack' || (f.gunOutT || 0) > 0 || f.state === 'win' || (showOn() && game.phaseT - (f.side ? 8 : 0) < 92);
  if (f.ch.possess === 'double') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r0 = 105 + Math.sin(globalT * 0.15) * 5; // the field around him: half holy light, half hellfire
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,240,190,.55)'; ctx.beginPath(); ctx.ellipse(f.x, GROUND - 6, r0, 14, 0, Math.PI, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = 'rgba(255,90,60,.6)'; ctx.beginPath(); ctx.ellipse(f.x, GROUND - 6, r0, 14, 0, 0, Math.PI); ctx.stroke(); ctx.restore(); }
  const wakeInv = f.state === 'getup' || f.wakeT > 0;
  let tailSx = 1; // tail attacks: he turns his back to them (a quick turn), swings the tail from his rear, and turns back
  if (mv && f.state === 'attack' && (mv.tail || mv.tailTurn)) { const m = f.mf, end = mv.startup + (mv.active || 4) + Math.min(mv.recovery || 10, 14);
    tailSx = m < 4 ? Math.cos(Math.PI * m / 4) : m > end ? 1 : m > end - 5 ? Math.cos(Math.PI * (1 - (m - (end - 5)) / 5)) : -1; }
  if (wakeInv) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(f.x, GROUND - f.y - 70, 10, f.x, GROUND - f.y - 70, 80); g.addColorStop(0, 'rgba(200,235,255,.35)'); g.addColorStop(1, 'rgba(200,235,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(f.x, GROUND - f.y - 70, 56, 92, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(220,240,255,${0.5 + 0.3 * Math.sin(globalT * 0.6)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(f.x, GROUND - 4, 40, 9, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); } // getting up: invincible — a pale glow and a blinking body
  if (f.state === 'win') { drawWinFX(f); const ws = winStaffSpin(f); if (ws != null) staffSpin = ws; } // victory.js
  drawBody(f.key, f.pose, f.x + (f.animDX || 0), GROUND - f.y - dance - (f.ch.hover ? hoverOf(f) : 0), f.facing, f.hipUp, { scale: f.ch.scale, praying: !!(mv && mv.pose === 'saKneelPray'), hideMini: f.state === 'attack' && f.move ? (f.move.toDouble ? 'both' : f.move.id === 'smAngel' ? 'angel' : f.move.id === 'smDevil' ? 'devil' : null) : null, gunOut, rot, sx: (turn === null ? 1 : Math.cos(2 * Math.PI * turn)) * tailSx, flash: f.flash > 3 || (wakeInv && Math.floor(globalT / 3) % 2 === 0), aura, blade, sword, speed: Math.abs(f.vx), alpha: blink ? 0.6 : 1, staffExt, staffSpin, alt: f.alt, shieldSpin: !!(mv && mv.shieldSpin), aegisRing: !!(mv && mv.aegisRing), bladeHalo: !!(mv && mv.bladeHalo), shieldOut: !!f.shieldOut, possess: f.ch.possess, plateOut: !!f.plateOut, face: f.state, edgeA: excalAura(f, mv), wrist: f.state === 'charge' ? 0 : mv ? (mv.wrist != null ? mv.wrist : 0.25) : 0.6 });
  const fx = () => { // (mirror match: the second fighter's effects in another hue — the body keeps its own palette)
  const prevOwner = FX_OWNER; FX_OWNER = f;
  if (f.brands > 0) drawBrands(f);
  drawHeavyFX(f);
  if (SHOW[f.key]) { const sh = SHOW[f.key]; if (showOn() && game.round === 1) { /* (the greeting line only before the first round) */ const t = game.phaseT - (f.side ? 8 : 0); drawSpeech(f, L(...sh.introLine), clamp((t - 14) / 8, 0, 1) * clamp((130 - t) / 10, 0, 1)); }
    }
  if (f.state === 'win') { const ln = winLine(f); if (ln) drawSpeech(f, ln, clamp((f.st - 20) / 10, 0, 1)); }
  if (mv && f.state === 'attack' && f.pre > 0 && mv.tellPre && (mv.preTotal - f.pre) < mv.tellPre) drawTellFX(f, mv, mv.preTotal - f.pre);
  if (mv && f.state === 'attack' && f.windPhase >= 0) drawWindFX(f, mv);
  if (mv && !mv.trail && f.state === 'attack') drawSmear(f, mv);
  if (mv && mv.reachFX && f.state === 'attack') drawReachFX(f, mv, other(f));
  if (mv && mv.tail && f.state === 'attack') tailArcFX(f, mv);
  if (mv && mv.drawFX) mv.drawFX(f, other(f));
  if (mv && mv.lvl != null && !mv.fired && mv.chargeMarks) drawChargeGauge(f, mv); // (on top of the charge effects)
  if (mv && f.key === 'psychic' && (mv.psyFist || mv.floorGlyph) && !mv.jug && !mv.air) lyraGroundCrystal(f, mv);
  if (f.possT > 0) drawPossessBar(f);
  if (f.ch.orbs) drawOrbs(f);
  FX_OWNER = prevOwner; };
  if (f.alt) drawInAltHue(fx); else fx();
  if (f.state === 'gbreak') {
    const cy = GROUND - f.y - 150 * f.ch.scale;
    ctx.fillStyle = '#ffe066';
    for (let i = 0; i < 3; i++) {
      const a = globalT * 0.15 + i * 2.09, sx = f.x + Math.cos(a) * 24, sy = cy + Math.sin(a) * 7;
      ctx.beginPath(); ctx.moveTo(sx, sy - 6); ctx.lineTo(sx + 2, sy - 2); ctx.lineTo(sx + 6, sy); ctx.lineTo(sx + 2, sy + 2);
      ctx.lineTo(sx, sy + 6); ctx.lineTo(sx - 2, sy + 2); ctx.lineTo(sx - 6, sy); ctx.lineTo(sx - 2, sy - 2); ctx.closePath(); ctx.fill();
    }
  }
}

