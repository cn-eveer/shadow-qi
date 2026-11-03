'use strict';
/* ================= Mimic, the copy robot =================
   Mimic has no techniques of his own: at the start of every round his core scans the stage and he copies one of the other
   fighters — a random one, never the same two rounds running. For the round he fights as that fighter: every command, string,
   special and super is theirs, and his body takes their shape in steel plate. Which fighter he is can always be told:
     · the visor, the chest core, the joints and a ring on the floor glow in that fighter's own colour (see MIMIC_COL);
     · a tag over his head and his name on the health bar read MIMIC ▸ (name);
     · the round opens with a scan, and the name pops up.
   He is a copy: his blows do ROBOT_DMG of the original's damage.
   Under the hood nothing about him is special: he is a fighter whose key (f.key) and character (f.ch) are the copied fighter's,
   and f.robot marks him. The roll uses the seeded random stream, so online both players see the same copy. */
const ROBOT_DMG = 0.92;
const MIMIC_COL = { ninja: '170,110,255', brawler: '60,220,255', staff: '255,226,70', psychic: '255,110,220', paladin: '90,150,255', kappa: '70,230,150', gunman: '255,80,80', salary: '235,240,255', alchemist: '255,140,40' };
const mimicCol = k => MIMIC_COL[k] || '150,220,255';
CHARS.robot = { ...CHARS.brawler, name: 'MIMIC', title: 'Copy Robot', nameJa: 'ミミック', titleJa: 'コピーロボ', scale: 1.04, auraCol: '150,215,255', fxCol: '150,215,255',
  colors: { steel: '#b4bece', steelB: '#808a9d', dark: '#2a303f', joint: '#4b5469', glass: '#0d1019', core: '#7fe6ff' },
  meterCol: ['#5a7fa8', '#d7ecff'], bannerCol: 'rgba(70,100,140,.9)', idle: 'idle', chargePose: 'charge', winPose: 'win' };
CHARS.robot.altColors = { ...CHARS.robot.colors, steel: '#d0b88e', steelB: '#9c855c', joint: '#695736' };
CHARS.robot.key = 'robot';
Object.assign(DIVE_STRIKE, { robot: 'Dive Strike' }); DEMO_VS.robot = 'ninja'; GHOST_TINT.robot = new Proxy({}, { get: () => '#dbe9ff' });
CHAR_ORDER.push('robot');
const mimicPool = () => CHAR_ORDER.filter(k => k !== 'robot');
function setMimic(f, k) { // he becomes that fighter for the round (his character, his key, none of the last copy's leftovers)
  f.key = k; f.ch = CHARS[k]; f.mimic = k; f.mimicLast = k; f.mimicAt = game.frame;
  f.sorbs = []; f.spirit = null; f.fuse = null; f.fuseT = 0; f.opus = null; f.pillars = []; f.possT = 0; f.aegisT = 0;
}
function robotRoll(f) { const pool = mimicPool().filter(k => k !== f.mimicLast); setMimic(f, pool[Math.floor(R() * pool.length)]); } // (seeded: both players of an online battle get the same copy)
{ const mk = makeFighter; makeFighter = function (key, side, ctrl) { const f = mk(key, side, ctrl); if (key === 'robot') { f.robot = true; robotRoll(f); } return f; }; } // (a first copy at once: the first round's roll comes right after)
{ const sr = startRound; startRound = function (n) { // every round: a new copy, announced once the stage is set
  for (const f of fighters) if (f.robot) robotRoll(f);
  sr.apply(this, arguments);
  for (const f of fighters) if (f.robot) { f.mimicAt = game.frame; popText(f.x, GROUND - 255, L('MIMIC ▸ ', 'コピー ▸ ') + nm(f.ch), mimicCol(f.key)); sfx('select'); }
  if (typeof updateTbar === 'function') updateTbar(); // (the training bar names the copy)
}; }
{ const hit = applyHit; applyHit = function (a, d, h, side, hb, hu) { // a copy hits a little softer
  if (a && a.robot && h && h.dmg) { h = { ...h, dmg: Math.max(1, Math.round(h.dmg * ROBOT_DMG)) }; arguments[2] = h; }
  return hit.apply(this, arguments); }; }
const fname = f => f.robot ? L('MIMIC ▸ ', 'ミミック▸') + nm(f.ch) : nm(f.ch); // (the health bar: who he is, and who he is copying)
function robotCycle(d = 1) { // training: step each robot through the fighters he can copy (N)
  for (const f of fighters) if (f.robot) { const pool = mimicPool(), i = pool.indexOf(f.mimic); setMimic(f, pool[(i + d + pool.length) % pool.length]); }
  resetPositions();
  for (const f of fighters) if (f.robot) popText(f.x, GROUND - 255, L('MIMIC ▸ ', 'コピー ▸ ') + nm(f.ch), mimicCol(f.key));
}
/* ---------- looks ---------- */
const steelCache = new Map();
function steelOf(hex) { // a colour turned to brushed steel: the light and dark of the original, a little of its hue
  if (typeof hex !== 'string' || !/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex)) return hex;
  if (steelCache.has(hex)) return steelCache.get(hex);
  let h = hex.slice(1); if (h.length === 3) h = h.replace(/./g, c => c + c);
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16), l = 0.3 * r + 0.59 * g + 0.11 * b, base = 52 + l * 0.66;
  const k = v => Math.max(0, Math.min(255, Math.round(v))), out = '#' + [k(r * 0.34 + (base - 6) * 0.66), k(g * 0.34 + base * 0.66), k(b * 0.34 + (base + 12) * 0.66)].map(v => v.toString(16).padStart(2, '0')).join('');
  steelCache.set(hex, out); return out;
}
const palCache = new WeakMap();
function robotPal(C) { // a fighter's palette in steel (cached)
  let p = palCache.get(C); if (p) return p; p = {};
  for (const k in C) p[k] = steelOf(C[k]);
  palCache.set(C, p); return p;
}
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function robotHead(col, pulse) { // (drawing space: the head's centre at 0, 0, facing +x, up is +y) the visor and the antenna
  ctx.fillStyle = 'rgba(12,16,26,.94)'; rrect(-2.5, -0.6, 15.5, 7.4, 3); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${col},${0.7 + 0.3 * pulse})`; rrect(0.5, 1.7, 11.5, 2.4, 1.2); ctx.fill(); ctx.restore();
  seg([-4, 10], [-6.5, 20], 2, '#59627a'); dot([-6.5, 20.5], 2.8, '#2a303f');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([-6.5, 20.5], 2.2 + pulse, `rgba(${col},${0.7 + 0.3 * pulse})`); ctx.restore();
  dot([-1.5, -0.5], 4.6, '#59627a'); dot([-1.5, -0.5], 2.4, `rgba(${col},.9)`); // an ear plate with a light in it
}
function robotCore(p, col, pulse, r) { // a glowing core (drawing space)
  dot(p, r + 2.2, '#2a303f');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(p[0], p[1], 0.5, p[0], p[1], r * 2.4); g.addColorStop(0, `rgba(${col},${0.95})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.globalAlpha = 0.7 + 0.3 * pulse; ctx.beginPath(); ctx.arc(p[0], p[1], r * 2.4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  dot(p, r * 0.7, `rgba(${col},1)`);
}
function drawRobotParts(J, key) { // the steel plate over a copy: visor, antenna, core, joints
  const td = J.td, n = [td[1], -td[0]], col = mimicCol(key), pulse = 0.5 + 0.5 * Math.sin(globalT * 0.16);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1])); robotHead(col, pulse); ctx.restore();
  const cp = mid(J.hip, J.sh, 0.62); robotCore([cp[0] + n[0] * 5, cp[1] + n[1] * 5], col, pulse, 3.2);
  for (const j of [J.e1, J.e2, J.k1, J.k2]) { dot(j, 3.4, '#39415a'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot(j, 1.6, `rgba(${col},.9)`); ctx.restore(); }
  const bp = [J.hip[0] + td[0] * 4, J.hip[1] + td[1] * 4]; // a belt of light
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; seg([bp[0] - n[0] * 11, bp[1] - n[1] * 11], [bp[0] + n[0] * 11, bp[1] + n[1] * 11], 2, `rgba(${col},${0.55 + 0.25 * pulse})`); ctx.restore();
}
function drawRobot(J, C, o = {}) { // his own plain body: the one he stands in before he copies anyone (the picking screen)
  const td = J.td, n = [td[1], -td[0]], col = o.core || '127,230,255', pulse = 0.5 + 0.5 * Math.sin(globalT * 0.16);
  seg(J.hip, J.k2, 13, C.steelB); seg(J.k2, J.f2, 11, C.steelB); dot(J.k2, 6.4, C.joint); foot(J.k2, J.f2, 10, 9, C.dark);
  seg(J.sh, J.e2, 10, C.steelB); seg(J.e2, J.h2, 9, C.steelB); dot(J.e2, 5.4, C.joint); dot(J.h2, 6.6, C.dark);
  seg(J.hip, J.sh, 26, C.steel); seg(mid(J.hip, J.sh, 0.02), mid(J.hip, J.sh, 0.26), 27, C.steelB); // a boxy torso, a heavier pelvis
  seg([J.sh[0] - n[0] * 11 - td[0] * 3, J.sh[1] - n[1] * 11 - td[1] * 3], [J.sh[0] + n[0] * 11 - td[0] * 3, J.sh[1] + n[1] * 11 - td[1] * 3], 5, C.joint);
  const cp = mid(J.hip, J.sh, 0.62); robotCore([cp[0] + n[0] * 5, cp[1] + n[1] * 5], col, pulse, 3.6);
  seg(mid(J.hip, J.sh, 0.28), mid(J.hip, J.sh, 0.36), 22, C.joint);
  seg(J.hip, J.k1, 13, C.steel); seg(J.k1, J.f1, 11, C.steel); dot(J.k1, 6.4, C.joint); foot(J.k1, J.f1, 10, 9, C.dark);
  seg(J.sh, J.head, 8, C.joint);
  ctx.save(); ctx.translate(J.head[0], J.head[1]); ctx.rotate(-Math.atan2(td[0], td[1]));
  ctx.fillStyle = C.steel; ctx.strokeStyle = C.dark; ctx.lineWidth = 2.4; rrect(-11.5, -10.5, 23, 22, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.steelB; rrect(-11.5, 6, 23, 5.5, 3); ctx.fill();
  robotHead(col, pulse); ctx.restore();
  seg(J.sh, J.e1, 10, C.steel); seg(J.e1, J.h1, 9, C.steel); dot(J.e1, 5.4, C.joint); seg(mid(J.e1, J.h1, 0.5), J.h1, 9.6, C.steelB); dot(J.h1, 7, C.dark); // the front arm and fist
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot(J.h1, 2.6, `rgba(${col},${0.5 + 0.4 * pulse})`); ctx.restore();
}
DRAWERS.robot = drawRobot;
{ const hf = drawHeavyFX; drawHeavyFX = function (f) { hf(f); if (f.robot && !f.hidden) drawRobotFX(f); }; }
function drawRobotFX(f) { // the ring on the floor, the tag over his head, and the scan when a round begins
  const col = mimicCol(f.key), s = f.ch.scale, age = game.frame - (f.mimicAt || 0), x = f.x, gy = GROUND - Math.min(f.y, 0), pulse = 0.5 + 0.5 * Math.sin(globalT * 0.12);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 2.4; ctx.strokeStyle = `rgba(${col},${0.32 + 0.2 * pulse})`;
  ctx.beginPath(); ctx.ellipse(x, GROUND + 2, 42 * s, 9, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  if (age >= 0 && age < 80) { // the scan: a bar of light sweeps up the body, and a ring spreads from the floor
    const k = age / 80, y = GROUND - f.y - (k * 190 * s), a = Math.sin(Math.PI * k);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, y - 16, 0, y + 16); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(0.5, `rgba(${col},${0.85 * a})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - 54 * s, y - 16, 108 * s, 32);
    ctx.strokeStyle = `rgba(${col},${0.7 * (1 - k)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, GROUND + 2, (20 + k * 80) * s, 4 + k * 12, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  const fade = age < 120 ? 1 : 0.75, y = GROUND - f.y - 212 * s; // the tag: MIMIC ▸ name
  const txt = '▸ ' + nm(f.ch).toUpperCase();
  ctx.save(); ctx.font = `700 ${age < 120 ? 15 : 12}px 'Rajdhani', 'Segoe UI', system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(txt).width + 16; ctx.globalAlpha = fade; ctx.fillStyle = 'rgba(10,12,22,.72)'; rrect(x - w / 2, y - 10, w, 20, 10); ctx.fill();
  ctx.strokeStyle = `rgba(${col},.95)`; ctx.lineWidth = 1.6; ctx.stroke(); ctx.fillStyle = `rgb(${col})`; ctx.fillText(txt, x, y + 0.5); ctx.restore();
}
function drawRobotPreview(i, x, fc, sel, mirror) { // the picking screen: his plain body, then a scan, then a copy, round and round through the fighters
  const pool = mimicPool(), T = 170, t = globalT + i * 57, n = Math.floor(t / T), ph = t % T, k = pool[n % pool.length], nx = pool[(n + 1) % pool.length], col = mimicCol(k);
  const p = idlePose(i * 1.7, k);
  drawShadow(x, 0, 1.04);
  if (ph < 44) { drawBody('robot', idlePose(i * 1.7, 'robot'), x, GROUND, fc, hipFor(p), { aura: sel, alpha: sel ? 1 : 0.7, alt: mirror && i === 1, core: mimicCol(nx) }); }
  else drawBody(k, p, x, GROUND, fc, hipFor(p), { aura: false, alpha: sel ? 1 : 0.7, robot: true, alt: false });
  if (ph >= 44) { const txt = '▸ ' + nm(CHARS[k]).toUpperCase(); ctx.save(); ctx.font = `700 15px 'Rajdhani', 'Segoe UI', system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(txt).width + 16, y = GROUND - 205;
    ctx.fillStyle = 'rgba(10,12,22,.72)'; rrect(x - w / 2, y - 10, w, 20, 10); ctx.fill(); ctx.strokeStyle = `rgba(${col},.95)`; ctx.lineWidth = 1.6; ctx.stroke(); ctx.fillStyle = `rgb(${col})`; ctx.fillText(txt, x, y + 0.5); ctx.restore(); }
  const sc = ph < 44 ? ph / 44 : ph < 62 ? (ph - 44) / 18 : -1; // a scan bar on the change
  if (sc >= 0) { const y = GROUND - sc * 190; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, y - 14, 0, y + 14); g.addColorStop(0, `rgba(${ph < 44 ? mimicCol(nx) : col},0)`); g.addColorStop(0.5, `rgba(${ph < 44 ? mimicCol(nx) : col},.8)`); g.addColorStop(1, `rgba(${ph < 44 ? mimicCol(nx) : col},0)`); ctx.fillStyle = g; ctx.fillRect(x - 50, y - 14, 100, 28); ctx.restore(); }
  return true;
}
COMBO_SET.robot = []; PUNISH_SET.robot = []; DEMOS.robot = [];
