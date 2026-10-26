'use strict';
/* ================= drawing: projectiles, particles ================= */
function drawProj(p) {
  if (PJ.has(p.type)) { pjDraw(p); return; }
  if (p.type === 'hwave') { // a standing crescent of light
    const y = GROUND, a = Math.min(1, p.life / 12);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(p.x, y, p.x, y - 110); g.addColorStop(0, `rgba(220,240,255,${0.85 * a})`); g.addColorStop(1, 'rgba(150,205,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(p.x - 34 * p.dir, y); ctx.quadraticCurveTo(p.x + 26 * p.dir, y - 60, p.x - 6 * p.dir, y - 110); ctx.quadraticCurveTo(p.x + 6 * p.dir, y - 50, p.x - 14 * p.dir, y); ctx.closePath(); ctx.fill();
    ctx.restore(); return;
  }
  if (p.type === 'aegis') { // the thrown shield, spinning edge over edge
    const C = p.owner.alt && CHARS.paladin.altColors ? CHARS.paladin.altColors : CHARS.paladin.colors;
    ctx.save(); ctx.translate(p.x, GROUND - p.y); ctx.scale(Math.max(0.25, Math.abs(Math.cos(p.t * 0.45))), 1); ctx.rotate(p.t * 0.12 * p.dir);
    const sh = (w, a, b) => { ctx.beginPath(); ctx.moveTo(-w, -a); ctx.lineTo(w, -a); ctx.quadraticCurveTo(w, b * 0.35, 0, b); ctx.quadraticCurveTo(-w, b * 0.35, -w, -a); ctx.closePath(); };
    ctx.fillStyle = C.trim; sh(21, 32, 42); ctx.fill(); ctx.fillStyle = C.shield; sh(18, 29, 38); ctx.fill();
    ctx.fillStyle = C.trim; ctx.fillRect(-2.8, -26, 5.6, 48); ctx.fillRect(-12, -14, 24, 5.4);
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(160,210,255,.4)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(p.x, GROUND - p.y, 40, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    return;
  }
  if (p.type === 'shuriken') {
    const y = GROUND - p.y;
    ctx.save(); ctx.translate(p.x, y);
    ctx.strokeStyle = 'rgba(220,228,245,.25)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-p.vx * 2.2, -p.vy * 2.2); ctx.stroke();
    ctx.rotate(p.rot);
    ctx.fillStyle = '#d3dae9'; ctx.beginPath();
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 12); ctx.lineTo(Math.cos(a + Math.PI / 4) * 4, Math.sin(a + Math.PI / 4) * 4); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2a2f3d'; ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  } else if (p.type === 'pfist') { // a phantom fist, with a faint trail
    const ang = Math.atan2(-p.vy, Math.abs(p.vx) || 0.001) / (Math.PI / 2); // a crystal shard flying where it's headed, with a light trail
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(200,180,255,.45)'; ctx.lineWidth = 7 * p.sc; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.x, GROUND - p.y); ctx.lineTo(p.x - p.vx * 3, GROUND - p.y + p.vy * 3); ctx.stroke(); ctx.restore();
    drawPsyFist(p.x, GROUND - p.y, p.sc, Math.sign(p.vx) || p.dir, 1, ang);
  } else if (p.type === 'crush') { // a giant fist pointing down; it fades in while hanging above them
    if (p.juggle) { drawMeteor(p); return; } // in a combo it's a blazing meteor instead
    const al = Math.min(1, p.t / 8);
    if (p.t <= p.hold + 2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,140,230,${0.5 * al})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(p.x, GROUND - 2, 40, 9, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    drawPsyFist(p.x, GROUND - p.y, 1.25, p.dir, al, 1);
  } else if (p.type === 'lift') { // a glyph ring on the floor, then a column of light
    const k = p.t / p.erupt, base = GROUND - 2;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = `rgba(255,140,230,${Math.min(1, k) * 0.8})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(p.x, base, 44, 10, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([6, 6]); ctx.lineDashOffset = -globalT * 2; ctx.beginPath(); ctx.ellipse(p.x, base, 30, 7, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    if (p.t >= p.erupt) {
      const e = Math.min(1, (p.t - p.erupt) / 4), fade = Math.min(1, p.life / 8), hh = 330 * e;
      const g = ctx.createLinearGradient(p.x - 34, 0, p.x + 34, 0); g.addColorStop(0, 'rgba(255,120,230,0)'); g.addColorStop(0.5, `rgba(255,225,250,${0.75 * fade})`); g.addColorStop(1, 'rgba(255,120,230,0)');
      ctx.fillStyle = g; ctx.fillRect(p.x - 34, base - hh, 68, hh);
    }
    ctx.restore();
  } else if (p.type === 'pillar') { // a giant golden-banded staff crashing down from the sky
    const grow = Math.min(1, p.t / 6), fade = Math.min(1, p.life / 10), top = -40, bot = GROUND - 4, w = 64;
    const y0 = lerp(top - 200, top, grow), y1 = lerp(top, bot, grow);
    ctx.save(); ctx.globalAlpha = fade;
    const g = ctx.createLinearGradient(p.x - w, 0, p.x + w, 0); g.addColorStop(0, '#5e3416'); g.addColorStop(0.45, '#b06a2c'); g.addColorStop(1, '#5e3416');
    ctx.fillStyle = g; ctx.fillRect(p.x - w / 2, y0, w, y1 - y0);
    ctx.fillStyle = '#f2c14e'; for (let k = 0; k < 4; k++) ctx.fillRect(p.x - w / 2 - 3, y1 - 26 - k * 120, w + 6, 16);
    ctx.globalCompositeOperation = 'lighter';
    const gl = ctx.createRadialGradient(p.x, bot, 4, p.x, bot, 170); gl.addColorStop(0, 'rgba(255,220,140,.7)'); gl.addColorStop(1, 'rgba(255,200,90,0)');
    ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(p.x, bot, 170, 0, Math.PI * 2); ctx.fill();
    if (p.t >= 6) { const k = Math.min(1, (p.t - 6) / 10); ctx.strokeStyle = `rgba(255,215,120,${0.8 * (1 - k * 0.6) * fade})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(p.x, bot, 40 + 120 * k, 10 + 8 * k, 0, 0, Math.PI * 2); ctx.stroke(); } // shockwave ring
    ctx.restore();
  } else if (p.type === 'qi' || p.type === 'orb') {
    const y = GROUND - p.y, pulse = Math.sin(p.t * 0.5) * 3 + (p.type === 'orb' ? 10 + Math.sin(p.t * 0.25) * 4 : 0);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(p.x, y, 2, p.x, y, 38 + pulse);
    g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(0.3, 'rgba(140,240,255,.85)'); g.addColorStop(1, 'rgba(40,160,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, y, 38 + pulse, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  } else if (p.type === 'clone') {
    const tgt = other(p.owner), near = Math.abs(tgt.x - p.x) < 110, yS = GROUND - (p.yOff || 0);
    const pose = p.fall ? POSES.diveKick : near ? POSES.midKick : POSES.dash, hu = p.fall ? 55 : hipFor(pose);
    for (let k = 3; k >= 1; k--) drawBody('ninja', pose, p.x - p.vx * k * 1.8, yS + (p.fall ? -k * 14 : 0), p.dir, hu, { tint: SHADOW_TINT, alpha: 0.12 * (4 - k) });
    drawBody('ninja', pose, p.x, yS, p.dir, hu, { tint: SHADOW_TINT, alpha: 0.85 });
  } else if (p.type === 'decoy') { // looks like the real Kuro: hand sign, then back to his stance
    const pose = p.t < 33 ? POSES.seal : idlePose(1.7);
    drawShadow(p.x, 0, 1);
    drawBody('ninja', pose, p.x, GROUND, p.dir, hipFor(pose), {});
  } else if (p.type === 'guardShadow') {
    drawBody('ninja', POSES.guard, p.x, GROUND, p.dir, hipFor(POSES.guard), { tint: SHADOW_TINT, alpha: 0.7 + 0.15 * Math.sin(p.t * 0.6) });
  } else if (p.type === 'flame') {
    const f = p.owner, s = f.ch.scale, b = projBox(p), len = b.x1 - b.x0, ox = f.facing > 0 ? b.x0 : b.x1, fade = Math.min(1, p.life / 8);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let d = 0; d <= len; d += 12) {
      const k = d / 340, x = ox + f.facing * d, y = GROUND - (116 - d * 0.07) * s + Math.sin(globalT * 0.6 + d * 0.15) * 12 * k;
      const r = (8 + d * 0.085) * s * (0.85 + 0.15 * Math.sin(globalT * 0.9 + d));
      ctx.fillStyle = `rgba(255,${Math.round(120 - 60 * k)},30,${0.35 * fade})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,225,140,${0.45 * (1 - k) * fade})`; ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  } else if (p.type === 'wave') { // a ripple running along the floor
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = `rgba(125,235,255,${0.55 - k * 0.15})`; ctx.lineWidth = 4 - k;
      ctx.beginPath(); ctx.ellipse(p.x - p.vx * k * 2, GROUND - 4, 26 + k * 6, 12 + k * 3, 0, Math.PI, 2 * Math.PI); ctx.stroke();
    }
    ctx.restore();
  } else if (p.type === 'homing' || p.type === 'rain') {
    const y = GROUND - p.y, rad = (22 + Math.sin(globalT * 0.7 + p.idx) * 2) * Math.min(1, p.t / 8);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(p.x, y, 1, p.x, y, rad + 1);
    if (p.qi) { g.addColorStop(0, 'rgba(240,255,255,.95)'); g.addColorStop(0.35, 'rgba(125,235,255,.85)'); g.addColorStop(1, 'rgba(40,160,255,0)'); }
    else { g.addColorStop(0, 'rgba(255,255,255,.98)'); g.addColorStop(0.3, 'rgba(170,205,255,.85)'); g.addColorStop(0.7, 'rgba(120,90,255,.35)'); g.addColorStop(1, 'rgba(90,60,255,0)'); }
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, y, rad + 1, 0, Math.PI * 2); ctx.fill();
    if (!p.qi) { // Kuro's lightning ball: bolts crackling out of it, different every frame
      ctx.strokeStyle = 'rgba(215,235,255,.9)'; ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
      for (let k = 0; k < 4; k++) {
        let a = Math.random() * Math.PI * 2, x = p.x, yy = y;
        ctx.beginPath(); ctx.moveTo(x, yy);
        for (let j = 0; j < 3; j++) { a += vrnd(-0.8, 0.8); x += Math.cos(a) * rad * 0.55; yy += Math.sin(a) * rad * 0.55; ctx.lineTo(x, yy); }
        ctx.stroke();
      }
    }
    ctx.restore();
  } else if (p.type === 'beam') {
    const b = projBox(p), grow = Math.min(1, p.t / 6), fade = Math.min(1, p.life / 8);
    const yc = GROUND - 95, hh = (34 + Math.sin(p.t * 0.9) * 3) * grow * fade;
    const x0 = b.x0, w = b.x1 - b.x0;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(60,200,255,.35)'; ctx.fillRect(x0, yc - hh - 10, w, (hh + 10) * 2);
    ctx.fillStyle = 'rgba(140,240,255,.65)'; ctx.fillRect(x0, yc - hh, w, hh * 2);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(x0, yc - hh * 0.4, w, hh * 0.8);
    const ox = p.owner.x + p.owner.facing * 50 * p.owner.ch.scale;
    const g = ctx.createRadialGradient(ox, yc, 4, ox, yc, 60);
    g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(80,220,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ox, yc, 60, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}
function drawParts() {
  ctx.lineCap = 'round';
  for (const p of parts) {
    const a = clamp(p.life / p.max, 0, 1);
    if (p.type === 'paper') { p.vy += 0.18; p.vx *= 0.97; p.rot += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.abs(Math.sin(p.rot * 2)) * 0.8 + 0.2); ctx.globalAlpha = Math.min(1, a * 1.5); ctx.fillStyle = '#f5f5f0'; ctx.fillRect(-6, -8, 12, 16); ctx.fillStyle = '#9aa4b8'; ctx.fillRect(-4, -5, 8, 1); ctx.fillRect(-4, -2, 8, 1); ctx.fillRect(-4, 1, 6, 1); ctx.restore(); continue; } // a sheet of paper fluttering down
    if (p.type === 'crystal') { drawCrystal(p.x, p.y, p.r, Math.min(1, a * 1.4), p.rot); continue; } // a crystal falling onto them
    if (p.type === 'runecircle') { drawTriCircle(p.x, p.y, p.r * (0.55 + 0.45 * a), Math.min(1, 0.4 + a), (p.max - p.life) * 0.25 + (p.spin || 0)); continue; } // a small magic circle closing on them
    if (p.type === 'skycircle') { ctx.save(); ctx.translate(p.x, p.y); ctx.scale(1, 0.32); drawTriCircle(0, 0, p.r * (0.7 + 0.3 * Math.min(1, (p.max - p.life) / 3)), Math.min(1, a * 1.5), (p.max - p.life) * 0.15); ctx.restore(); continue; } // a magic circle in the air, seen edge-on, that the crystal drops out of
    if (p.type === 'claw') { // three claw slashes, raked through the air
      const k = Math.min(1, (p.max - p.life) / 3);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (let i = -1; i <= 1; i++) { ctx.strokeStyle = `rgba(${p.col},${a})`; ctx.lineWidth = 4.5 - Math.abs(i) * 1.2;
        ctx.beginPath(); ctx.moveTo(-p.r * 0.5 * k, i * 9 - p.r * 0.18); ctx.quadraticCurveTo(0, i * 9 + 6, p.r * 0.5 * k, i * 9 - p.r * 0.18); ctx.stroke(); }
      ctx.strokeStyle = `rgba(120,255,190,${a * 0.5})`; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-p.r * 0.5 * k, -p.r * 0.18); ctx.quadraticCurveTo(0, 6, p.r * 0.5 * k, -p.r * 0.18); ctx.stroke();
      ctx.restore(); continue;
    }
    if (p.type === 'wcol') { // a column of water (or fire) bursting up out of the floor
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const h = 260 * Math.min(1, (p.max - p.life) / 5 + 0.2), w = p.w * (0.6 + 0.4 * a), g = ctx.createLinearGradient(p.x - w, 0, p.x + w, 0);
      g.addColorStop(0, `rgba(${p.col},0)`); g.addColorStop(0.5, `rgba(${p.col},${0.85 * a})`); g.addColorStop(1, `rgba(${p.col},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(p.x - w, GROUND);
      for (let k = 0; k <= 8; k++) ctx.lineTo(p.x - w + (2 * w) * k / 8, GROUND - h - Math.sin(globalT * 0.5 + k) * 10 - (k % 2) * 12);
      ctx.lineTo(p.x + w, GROUND); ctx.closePath(); ctx.fill(); ctx.restore(); continue;
    }
    if (p.type === 'lbeam') { // a pillar of light from the sky (Aldric's Verdict)
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const w = p.w * (0.5 + 0.5 * a), g = ctx.createLinearGradient(p.x - w, 0, p.x + w, 0);
      g.addColorStop(0, 'rgba(255,220,130,0)'); g.addColorStop(0.5, `rgba(255,250,225,${0.85 * a})`); g.addColorStop(1, 'rgba(255,220,130,0)');
      ctx.fillStyle = g; ctx.fillRect(p.x - w, 0, w * 2, GROUND);
      ctx.restore(); continue;
    }
    if (p.type === 'spark') {
      ctx.strokeStyle = `rgba(${p.col},${a})`; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2); ctx.stroke();
    } else if (p.type === 'ring') {
      ctx.strokeStyle = `rgba(${p.col},${a})`; ctx.lineWidth = 3 * a + 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
    } else if (p.type === 'ering') {
      ctx.strokeStyle = `rgba(${p.col},${a})`; ctx.lineWidth = 3 * a + 1;
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r * 1.6, p.r * 0.35, 0, 0, Math.PI * 2); ctx.stroke();
    } else if (p.type === 'streak') { // the iai dash line
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(200,210,255,${0.35 * a})`; ctx.lineWidth = 16 * a;
      ctx.beginPath(); ctx.moveTo(p.x0, p.y0 != null ? p.y0 : p.y); ctx.lineTo(p.x1, p.y1 != null ? p.y1 : p.y); ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${0.9 * a})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(p.x0, p.y0 != null ? p.y0 : p.y); ctx.lineTo(p.x1, p.y1 != null ? p.y1 : p.y); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'slashmark') {
      if (p.delay > 0) continue;
      const len = 72 * Math.min(1, (1 - p.life / p.max) * 5), x0 = p.x - p.dir * 40, y0 = p.y - 46;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(255,90,110,${0.8 * a})`; ctx.lineWidth = 10 * a;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + p.dir * len * 1.1, y0 + len * 1.25); ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 3 * a;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + p.dir * len * 1.1, y0 + len * 1.25); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'ray') { // a ray of light from one of Lyra's orbs
      if (p.delay > 0) continue;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(${p.col || '255,140,230'},${0.5 * a})`; ctx.lineWidth = 9 * a * (p.w || 1); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x1, p.y1); ctx.stroke();
      ctx.strokeStyle = `rgba(255,250,255,${a})`; ctx.lineWidth = 2.4 * (p.w || 1); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x1, p.y1); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'slashx') { // Kuro's hits: a crossed slash
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      const L = p.r * (1.2 - a * 0.3);
      ctx.strokeStyle = `rgba(${p.col},${a})`; ctx.lineWidth = 5 * a + 1;
      ctx.beginPath(); ctx.moveTo(-L, -L * 0.5); ctx.lineTo(L, L * 0.5); ctx.moveTo(-L, L * 0.5); ctx.lineTo(L, -L * 0.5); ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(-L, -L * 0.5); ctx.lineTo(L, L * 0.5); ctx.moveTo(-L, L * 0.5); ctx.lineTo(L, -L * 0.5); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'star') { // Mei's hits: a golden four-point star
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = `rgba(${p.col},${a})`; ctx.beginPath();
      for (let i = 0; i < 8; i++) { const rr = i % 2 ? p.r * 0.28 : p.r, an = i * Math.PI / 4; i ? ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr) : ctx.moveTo(Math.cos(an) * rr, Math.sin(an) * rr); }
      ctx.closePath(); ctx.fill(); ctx.restore();
    } else if (p.type === 'speed') { // impact lines bursting out of a heavy hit
      ctx.strokeStyle = `rgba(${p.col},${a})`; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2.4, p.y - p.vy * 2.4); ctx.stroke();
    } else if (p.type === 'bolt') { // a tiny jagged lightning bolt
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `rgba(200,230,255,${a})`; ctx.lineWidth = 2;
      const mx = (p.x + p.x1) / 2 + vrnd(-6, 6), my = (p.y + p.y1) / 2 + vrnd(-6, 6);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.lineTo(p.x1, p.y1); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'hex') {
      ctx.strokeStyle = `rgba(${p.col},${a})`; ctx.lineWidth = 3 * a + 1;
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) { const an = p.rot + i * Math.PI / 3, xx = p.x + Math.cos(an) * p.r, yy = p.y + Math.sin(an) * p.r; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
    } else if (p.type === 'crack') {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round';
      ctx.strokeStyle = `rgba(125,235,255,${0.9 * a})`; ctx.lineWidth = 2.4;
      for (const ray of p.rays) { ctx.beginPath(); ray.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
      ctx.restore();
    } else if (p.type === 'text') {
      ctx.font = `20px ${HUD}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.lineWidth = 5; ctx.strokeStyle = `rgba(26,7,16,${a})`; ctx.strokeText(p.text, p.x, p.y);
      ctx.fillStyle = `rgba(${p.col},${a})`; ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.fillStyle = `rgba(${p.col},${a * (p.type === 'aura' ? 0.9 : 0.45)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
  }
}

/* ================= drawing: stage ================= */
const bg = document.createElement('canvas');
function paintStage() {
  const b = bg.getContext('2d');
  b.setTransform(DPR, 0, 0, DPR, 0, 0); b.imageSmoothingQuality = 'high';
  let g = b.createLinearGradient(0, 0, 0, 440);
  g.addColorStop(0, '#12142f'); g.addColorStop(0.42, '#36275a'); g.addColorStop(0.72, '#9b4569'); g.addColorStop(1, '#ee8a5c');
  b.fillStyle = g; b.fillRect(0, 0, W, H);
  let seed = 7; const sr = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 110; i++) { // round stars, the bright ones with a soft glow
    const a = 0.2 + sr() * 0.6, big = sr() < 0.1, x = sr() * W, y = sr() * 230;
    if (big) { const sg = b.createRadialGradient(x, y, 0, x, y, 5); sg.addColorStop(0, `rgba(255,255,255,${(a * 0.5).toFixed(2)})`); sg.addColorStop(1, 'rgba(255,255,255,0)'); b.fillStyle = sg; b.beginPath(); b.arc(x, y, 5, 0, Math.PI * 2); b.fill(); }
    b.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`; b.beginPath(); b.arc(x, y, big ? 1.1 : 0.7, 0, Math.PI * 2); b.fill();
  }
  const mg = b.createRadialGradient(730, 130, 20, 730, 130, 170);
  mg.addColorStop(0, 'rgba(255,232,196,.5)'); mg.addColorStop(1, 'rgba(255,232,196,0)');
  b.fillStyle = mg; b.beginPath(); b.arc(730, 130, 170, 0, Math.PI * 2); b.fill();
  b.fillStyle = '#fbe6c2'; b.beginPath(); b.arc(730, 130, 44, 0, Math.PI * 2); b.fill();
  b.fillStyle = 'rgba(214,180,150,.35)';
  [[718,118,8],[744,140,6],[728,150,4]].forEach(([x, y, r]) => { b.beginPath(); b.arc(x, y, r, 0, Math.PI * 2); b.fill(); });
  b.fillStyle = 'rgba(255,190,200,.12)';
  for (let i = 0; i < 5; i++) { b.beginPath(); b.ellipse(sr() * W, 200 + sr() * 120, 120 + sr() * 120, 6 + sr() * 6, 0, 0, Math.PI * 2); b.fill(); }
  const ridge = (base, amp, col, f1, f2, ph) => {
    b.fillStyle = col; b.beginPath(); b.moveTo(0, H);
    for (let x = 0; x <= W; x += 2) b.lineTo(x, base - amp * (0.55 + 0.45 * Math.sin(x * f1 + ph)) * (0.6 + 0.4 * Math.sin(x * f2 + ph * 2.3)));
    b.lineTo(W, H); b.closePath(); b.fill();
  };
  ridge(330, 120, '#6a3f6e', 0.007, 0.019, 1.2);
  // pagoda silhouette
  b.fillStyle = '#4d2d5a';
  const px = 190, pb = 318;
  for (let i = 0; i < 4; i++) {
    const y = pb - i * 24, w = 58 - i * 10;
    b.fillRect(px - w * 0.32, y - 18, w * 0.64, 18);
    b.beginPath(); b.moveTo(px - w / 2 - 8, y - 16); b.quadraticCurveTo(px - w * 0.3, y - 22, px, y - 30); b.quadraticCurveTo(px + w * 0.3, y - 22, px + w / 2 + 8, y - 16); b.closePath(); b.fill();
  }
  b.fillRect(px - 1.5, pb - 4 * 24 - 22, 3, 20);
  ridge(372, 95, '#4a2c58', 0.011, 0.027, 3.1);
  ridge(412, 55, '#2c1b3b', 0.016, 0.041, 5.3);
  // rooftop floor
  const fy = 432;
  g = b.createLinearGradient(0, fy, 0, H); g.addColorStop(0, '#5a3a36'); g.addColorStop(1, '#1e1418');
  b.fillStyle = g; b.fillRect(0, fy, W, H - fy);
  b.strokeStyle = 'rgba(0,0,0,.28)'; b.lineWidth = 1.5;
  for (let i = -14; i <= 14; i++) { b.beginPath(); b.moveTo(480 + i * 58, fy); b.lineTo(480 + i * 120, H); b.stroke(); }
  b.strokeStyle = 'rgba(255,210,170,.07)';
  [452,478,512].forEach(y => { b.beginPath(); b.moveTo(0, y); b.lineTo(W, y); b.stroke(); });
  b.fillStyle = 'rgba(255,190,140,.45)'; b.fillRect(0, fy, W, 2);
  // lantern posts at the walls
  [22, 938].forEach(x => {
    b.fillStyle = '#1a1016'; b.fillRect(x - 4, 300, 8, 140); b.fillRect(x - 14, 300, 28, 6);
    const lg = b.createRadialGradient(x, 330, 2, x, 330, 42);
    lg.addColorStop(0, 'rgba(255,170,90,.8)'); lg.addColorStop(1, 'rgba(255,170,90,0)');
    b.fillStyle = lg; b.beginPath(); b.arc(x, 330, 42, 0, Math.PI * 2); b.fill();
    b.fillStyle = '#e8633d'; b.beginPath(); b.ellipse(x, 330, 10, 14, 0, 0, Math.PI * 2); b.fill();
  });
  // haze where the hills meet the roof, and a soft vignette to frame the fight
  g = b.createLinearGradient(0, 380, 0, fy + 4); g.addColorStop(0, 'rgba(255,150,130,0)'); g.addColorStop(1, 'rgba(255,150,130,.16)');
  b.fillStyle = g; b.fillRect(0, 380, W, fy + 4 - 380);
  g = b.createRadialGradient(W / 2, H * 0.55, H * 0.35, W / 2, H * 0.55, W * 0.62);
  g.addColorStop(0, 'rgba(8,4,20,0)'); g.addColorStop(1, 'rgba(8,4,20,.42)');
  b.fillStyle = g; b.fillRect(0, 0, W, H);
}
function fitCanvas() { // render at the real screen resolution so edges stay crisp at any window size
  const w = canvas.getBoundingClientRect().width || W;
  const s = clamp(Math.max(2, w * (window.devicePixelRatio || 1) / W), 2, 3); // HQ: at least 2× (supersampled), so lines and effects stay smooth and clear
  if (canvas.width === Math.round(W * s) && Math.abs(s - DPR) < 0.02) return;
  DPR = s;
  canvas.width = bg.width = Math.round(W * DPR); canvas.height = bg.height = Math.round(H * DPR);
  paintStage();
}
fitCanvas();
if (window.ResizeObserver) new ResizeObserver(fitCanvas).observe(canvas);
window.addEventListener('resize', fitCanvas);

/* ================= drawing: HUD ================= */
function rr(x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function healthBar(f, x, left) {
  const y = 20, w = 380, h = 20;
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = '#2a0b12'; ctx.fillRect(x, y, w, h);
  const fill = (len, style) => { ctx.fillStyle = style; if (left) ctx.fillRect(x + w - len, y, len, h); else ctx.fillRect(x, y, len, h); };
  fill(w * f.dispHp / 1000, '#e23a4f');
  const low = f.hp < 250, g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, low ? '#ffb36b' : '#fff27a'); g.addColorStop(1, low ? '#ff5a36' : '#f5a524');
  const hw = w * f.hp / 1000;
  fill(hw, g);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  if (left) ctx.fillRect(x + w - hw, y + 3, hw, 3); else ctx.fillRect(x, y + 3, hw, 3);
  // guard meter
  const gy = y + h + 5, gh = 7, gw = w - 60, gx = left ? x + 60 : x;
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(gx - 2, gy - 2, gw + 4, gh + 4);
  ctx.fillStyle = f.state === 'gbreak' ? (globalT % 10 < 5 ? '#ff4d5e' : '#4a1420') : '#121a2a';
  ctx.fillRect(gx, gy, gw, gh);
  const gl = gw * f.guard / 100;
  ctx.fillStyle = f.guard < 34 ? (globalT % 20 < 10 ? '#ff8a6b' : '#d9534f') : '#8fd0ff';
  if (left) ctx.fillRect(gx + gw - gl, gy, gl, gh); else ctx.fillRect(gx, gy, gl, gh);
  ctx.font = `11px ${HUD}`; ctx.textBaseline = 'middle'; ctx.textAlign = left ? 'left' : 'right';
  ctx.fillStyle = 'rgba(255,255,255,.82)'; ctx.fillText(L('GUARD', 'ガード'), left ? x : x + w, gy + gh / 2 + 1);
  // MP gauge, just under the guard meter
  const my = gy + gh + 6, mh = 11;
  meterBar(f, gx, my, gw, mh, left);
  // name row
  const ny = my + mh + 7;
  ctx.textBaseline = 'top'; ctx.textAlign = left ? 'left' : 'right';
  ctx.font = `18px ${HUD}`;
  ctx.fillStyle = '#000'; ctx.fillText(nm(f.ch), (left ? x : x + w) + 1, ny + 1);
  ctx.fillStyle = '#fff'; ctx.fillText(nm(f.ch), left ? x : x + w, ny);
  const nw = ctx.measureText(nm(f.ch)).width;
  ctx.font = SMALL; ctx.fillStyle = 'rgba(255,255,255,.78)';
  ctx.fillText(game.online ? (f.netName || '') + (f.side === NET.side ? L(' (you)', '（あなた）') : '') : game.watch ? 'CPU ' + (f.side + 1) : game.demo ? (f.side === 0 ? L('DEMO', '見本') : L('DUMMY', 'ダミー')) : f.side === 0 ? L('YOU', 'あなた') : (game.training ? L('DUMMY', 'ダミー') : 'CPU'), left ? x + nw + 8 : x + w - nw - 8, ny + 4);
  for (let i = 0; i < (game.training ? 0 : 2); i++) {
    const cx = left ? x + w - 10 - i * 20 : x + 10 + i * 20;
    ctx.beginPath(); ctx.arc(cx, ny + 9, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = f.wins > i ? '#ffd23f' : 'rgba(255,255,255,.16)'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1.5; ctx.stroke();
  }
}
function meterBar(f, x, y, w, h, left) { // MP: violet with stripes running along it (a possessed Tanaka shows his form's colour); gold and pulsing when full
  const full = f.meter >= 100, m = w * Math.min(100, f.meter) / 100, fx = left ? x + w - m : x;
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  ctx.fillStyle = '#1a1030'; ctx.fillRect(x, y, w, h);
  const c = full ? ['#ffb020', '#fff3a0'] : f.ch.possess ? f.ch.meterCol : ['#9b3cff', '#ff6ad5'];
  const g = ctx.createLinearGradient(left ? x + w : x, 0, left ? x : x + w, 0); g.addColorStop(0, c[0]); g.addColorStop(1, c[1]);
  if (full) { ctx.save(); ctx.shadowColor = '#ffd23f'; ctx.shadowBlur = 8 + 6 * Math.sin(globalT * 0.2); }
  ctx.fillStyle = g; ctx.fillRect(fx, y, m, h);
  if (full) ctx.restore();
  if (m > 0) { // the stripes run toward the full end; when full, a bright sweep crosses it
    ctx.save(); ctx.beginPath(); ctx.rect(fx, y, m, h); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,.22)';
    const off = (globalT * (left ? -1 : 1) * 0.8) % 12;
    for (let sx = x - 12 + off; sx < x + w + 12; sx += 12) { ctx.beginPath(); ctx.moveTo(sx, y + h); ctx.lineTo(sx + 5, y + h); ctx.lineTo(sx + 5 + h, y); ctx.lineTo(sx + h, y); ctx.fill(); }
    if (full) { const sw = (globalT * 6) % (w + 80) - 40, sx = left ? x + w - sw : x + sw; const sg = ctx.createLinearGradient(sx - 30, 0, sx + 30, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.75)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(sx - 30, y, 60, h); }
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(fx, y + 1, m, 2);
    ctx.restore();
  }
  ctx.font = `11px ${HUD}`; ctx.textBaseline = 'middle'; ctx.textAlign = left ? 'right' : 'left';
  const lx = left ? x - 6 : x + w + 6;
  ctx.fillStyle = full ? (globalT % 20 < 12 ? '#ffe066' : '#fff') : '#e6a8ff';
  ctx.fillText(full ? 'MP MAX' : 'MP', lx, y + h / 2 + 1);
}
function drawHUD() {
  const [a, b] = fighters;
  healthBar(a, 40, true); healthBar(b, W - 420, false);
  ctx.fillStyle = 'rgba(10,10,22,.78)'; rr(446, 12, 68, 50, 10); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 1.5; ctx.stroke();
  const secs = Math.ceil(game.timer / 60);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (game.training) { ctx.font = "700 34px 'Segoe UI', system-ui, sans-serif"; ctx.fillStyle = '#fff'; ctx.fillText('∞', 480, 38); }
  else {
    ctx.font = `30px ${HUD}`;
    ctx.fillStyle = secs <= 10 && game.phase === 'fight' && globalT % 30 < 15 ? '#ff6b6b' : '#fff';
    ctx.fillText(String(secs).padStart(2, '0'), 480, 39);
  }
  if (game.online) { ctx.font = SMALL; ctx.textAlign = 'center'; ctx.fillStyle = NET.stallT > 30 ? '#ffb36b' : 'rgba(255,255,255,.7)'; ctx.fillText(NET.stallT > 30 ? L('Waiting for opponent…', '相手を待っています…') : `${Math.round(NET.rtt)} ms`, 480, 82); }
  if (game.demo) drawDemo();
  if (game.combo) {
    const c = game.combo, left = c.side === 0, x = left ? 44 : W - 44;
    ctx.textAlign = left ? 'left' : 'right'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
    ctx.font = `38px ${HUD}`; ctx.lineWidth = 6; ctx.strokeStyle = '#1a0710';
    const ht = L(`${c.n} HITS`, `${c.n} ヒット`);
    ctx.strokeText(ht, x, 150); ctx.fillStyle = '#ffd23f'; ctx.fillText(ht, x, 150);
    ctx.font = `14px ${HUD}`; ctx.fillStyle = '#fff'; ctx.fillText(L('COMBO', 'コンボ'), x, 170);
  }
  if (game.routeName && !game.demo) { // the CPU is playing one of the sample combos: show which
    const r = game.routeName, left = r.side === 0, x = left ? 44 : W - 44, al = Math.min(1, r.t / 20);
    ctx.textAlign = left ? 'left' : 'right'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
    const jd = JA_DEMO[r.demo] || {}, txt = L(r.text, r.kind === 'juggle' ? '追撃：' + (jd.tail || jd.n || '') : r.kind === 'stun' ? '気絶コンボ：' + (jd.tail || jd.n || '') : (jd.n || r.text));
    ctx.font = `15px ${HUD}`; ctx.lineWidth = 4; ctx.strokeStyle = `rgba(26,7,16,${al})`; ctx.strokeText(txt, x, 194);
    ctx.fillStyle = `rgba(190,230,255,${al})`; ctx.fillText(txt, x, 194);
  }
}
function drawAnnounce() {
  let txt = null, local = 0, big = false;
  const t = game.phaseT;
  if (game.phase === 'intro' && game.training) { txt = game.demo ? L('SAMPLE COMBOS', 'コンボ見本') : L('TRAINING', 'トレーニング'); local = t; }
  else if (game.phase === 'intro') {
    const final = fighters[0].wins === 1 && fighters[1].wins === 1;
    const c = COUNT_AT.filter(a => t >= a).length;
    if (!c) { txt = final ? L('FINAL ROUND', 'ファイナルラウンド') : L('ROUND ', 'ラウンド ') + game.round; local = t; }
    else { txt = String(4 - c); local = t - COUNT_AT[c - 1]; big = true; }
  } else if (game.phase === 'fight' && !game.training && t < 45 && game.round) { txt = L('FIGHT!', 'ファイト！'); local = t;
  } else if (game.phase === 'ko' || game.phase === 'time') {
    if (t < 100) { txt = game.phase === 'ko' ? 'K.O.' : L('TIME', 'タイムアップ'); local = t; }
    else { const w = game.roundWinner; txt = w ? L(w.ch.name + ' WINS', nm(w.ch) + 'の勝利') : L('DRAW', '引き分け'); local = t - 100; }
  }
  if (!txt) return;
  const sc = (big ? 1.6 : 1) * (1 + Math.max(0, 8 - local) * 0.07);
  const winBanner = (game.phase === 'ko' || game.phase === 'time') && t >= 100; // (raised, so the winner's speech bubble shows under it)
  ctx.save(); ctx.translate(W / 2, winBanner ? H * 0.24 : H * 0.42); ctx.scale(sc, sc);
  if (big) ctx.globalAlpha = clamp((45 - local) / 10, 0, 1); // each number fades out before the next
  ctx.font = `64px ${HUD}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = 12; ctx.strokeStyle = '#1a0710'; ctx.strokeText(txt, 0, 0);
  const g = ctx.createLinearGradient(0, -30, 0, 30);
  if (txt === 'K.O.') { g.addColorStop(0, '#ffe39a'); g.addColorStop(1, '#ff3d5a'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffc65a'); }
  ctx.fillStyle = g; ctx.fillText(txt, 0, 0);
  ctx.restore();
}
function drawSuperFX(front) {
  const sf = game.superFlash, f = sf.f, t = 45 - sf.t;
  if (!front) {
    ctx.fillStyle = 'rgba(6,4,16,.62)'; ctx.fillRect(-20, -20, W + 40, H + 40);
    const cy = GROUND - f.y - 70, g = ctx.createRadialGradient(f.x, cy, 10, f.x, cy, 260);
    g.addColorStop(0, `rgba(${f.ch.auraCol},.55)`); g.addColorStop(1, `rgba(${f.ch.auraCol},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, cy, 260, 0, Math.PI * 2); ctx.fill();
    return;
  }
  const a = Math.min(1, t / 6, sf.t / 6);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = f.ch.bannerCol;
  ctx.beginPath(); ctx.moveTo(0, 168); ctx.lineTo(W, 150); ctx.lineTo(W, 206); ctx.lineTo(0, 224); ctx.closePath(); ctx.fill();
  ctx.font = `38px ${HUD}`; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const slide = (1 - Math.min(1, t / 10)) * 220 * (f.side === 0 ? -1 : 1);
  ctx.fillText(L(sf.name, JA_SUPER[sf.name] || sf.name), W / 2 + slide, 188);
  ctx.restore();
}
function drawPreview() {
  const p2 = game.p2Char !== game.p1Char ? game.p2Char : CHAR_ORDER.find(k => k !== game.p1Char);
  [[game.p1Char, 150, 1], [p2, 810, -1]].forEach(([key, x, fc], i) => {
    const sel = i === 0;
    if (sel) {
      const g = ctx.createRadialGradient(x, GROUND, 4, x, GROUND, 110);
      g.addColorStop(0, `rgba(${CHARS[key].auraCol},.45)`); g.addColorStop(1, `rgba(${CHARS[key].auraCol},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, GROUND, 110, 26, 0, 0, Math.PI * 2); ctx.fill();
    }
    const p = idlePose(i * 1.7, key);
    drawShadow(x, 0, CHARS[key].scale);
    drawBody(key, p, x, GROUND, fc, hipFor(p), { aura: sel, alpha: sel ? 1 : 0.7 });
  });
}

