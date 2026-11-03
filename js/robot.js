'use strict';
/* ================= Mimic, the copy robot =================
   Mimic has no techniques of his own: at the start of every round his core scans the stage and he copies one of the other
   fighters — a random one, never the same two rounds running. For the round he fights as that fighter: every command, string,
   special and super is theirs, and his body takes their shape in steel plate. Which fighter he is can always be told:
     · the visor, the chest core, the joints and a ring on the floor glow in that fighter's own colour (see MIMIC_COL; the second Mimic of a mirror match
       glows in MIMIC_ALT, in warm steel, so two copies of the same fighter can be told apart);
     · his name on the health bar reads MIMIC ▸ (name);
     · the round opens with a scan, and the name pops up.
   He is a copy: his blows do ROBOT_DMG of the original's damage.
   Under the hood nothing about him is special: he is a fighter whose key (f.key) and character (f.ch) are the copied fighter's,
   and f.robot marks him. The roll uses the seeded random stream, so online both players see the same copy. */
const ROBOT_DMG = 0.92;
const MIMIC_COL = { ninja: '170,110,255', brawler: '60,220,255', staff: '255,226,70', psychic: '255,110,220', paladin: '90,150,255', kappa: '70,230,150', gunman: '255,80,80', salary: '235,240,255', alchemist: '255,140,40' };
const MIMIC_ALT = { ninja: '170,255,70', brawler: '255,110,200', staff: '90,170,255', psychic: '110,255,190', paladin: '255,180,60', kappa: '255,110,110', gunman: '190,130,255', salary: '255,200,120', alchemist: '90,230,255' }; // the second Mimic of a mirror match (Mimic vs Mimic): a different colour for each copy, and warm steel
const mimicCol = (k, alt) => (alt ? MIMIC_ALT[k] : MIMIC_COL[k]) || '150,220,255';
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
  for (const f of fighters) if (f.robot) { f.mimicAt = game.frame; popText(f.x, GROUND - 255, L('MIMIC ▸ ', 'コピー ▸ ') + nm(f.ch), mimicCol(f.key, f.alt)); sfx('select'); }
  if (typeof updateTbar === 'function') updateTbar(); // (the training bar names the copy)
}; }
{ const hit = applyHit; applyHit = function (a, d, h, side, hb, hu) { // a copy hits a little softer
  if (a && a.robot && h && h.dmg) { h = { ...h, dmg: Math.max(1, Math.round(h.dmg * ROBOT_DMG)) }; arguments[2] = h; }
  return hit.apply(this, arguments); }; }
const ROBOT_LINE = f => copiesOpponent(f) ? L(...MIRROR_ROBOT[f.key].intro) : L('Copy complete.', 'コピー完了'); // (what Mimic says at the start of the match; his win lines are in lines.js)
const fname = f => f.robot ? L('MIMIC ▸ ', 'ミミック▸') + nm(f.ch) : nm(f.ch); // (the health bar: who he is, and who he is copying)
const golemSteel = {};
function robotGolemPal(f) { // Hohen's golem when Mimic copies him: a robotic giant — steel plate, a core and eyes in the copy's colour
  const k = f.alt ? 1 : 0; if (golemSteel[k]) return golemSteel[k];
  const c = mimicCol('alchemist', f.alt), warm = !!f.alt;
  return golemSteel[k] = { body: warm ? '#b5a98f' : '#9aa6b8', dark: warm ? '#8a7f68' : '#6f7a8c', light: warm ? '#cfc3a8' : '#b9c4d4', head: warm ? '#c2b79c' : '#aab5c6', line: '#262c3a', crack: '#4b5469', core: c, hot: '255,255,255', eye: c, spark: c, glow: c };
}
function robotCycle(d = 1) { // training: step each robot through the fighters he can copy (N)
  for (const f of fighters) if (f.robot) { const pool = mimicPool(), i = pool.indexOf(f.mimic); setMimic(f, pool[(i + d + pool.length) % pool.length]); }
  resetPositions();
  for (const f of fighters) if (f.robot) popText(f.x, GROUND - 255, L('MIMIC ▸ ', 'コピー ▸ ') + nm(f.ch), mimicCol(f.key, f.alt));
}
/* ---------- looks ---------- */
const steelCache = new Map();
function steelOf(hex, warm) { // a colour turned to brushed steel: the light and dark of the original, a little of its hue
  if (typeof hex !== 'string' || !/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex)) return hex;
  const ck = warm ? hex + 'w' : hex; if (steelCache.has(ck)) return steelCache.get(ck);
  let h = hex.slice(1); if (h.length === 3) h = h.replace(/./g, c => c + c);
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16), l = 0.3 * r + 0.59 * g + 0.11 * b, base = 52 + l * 0.66;
  const k = v => Math.max(0, Math.min(255, Math.round(v))), out = '#' + [k(r * 0.34 + (base + (warm ? 16 : -6)) * 0.66), k(g * 0.34 + (base + (warm ? 4 : 0)) * 0.66), k(b * 0.34 + (base + (warm ? -16 : 12)) * 0.66)].map(v => v.toString(16).padStart(2, '0')).join('');
  steelCache.set(ck, out); return out;
}
const palCache = new WeakMap(), palWarm = new WeakMap();
function robotPal(C, warm) { // a fighter's palette in steel (cached); the second Mimic of a mirror match in warm steel
  const cache = warm ? palWarm : palCache; let p = cache.get(C); if (p) return p; p = {};
  for (const k in C) p[k] = steelOf(C[k], warm);
  cache.set(C, p); return p;
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
function drawRobotParts(J, key, alt) { // the steel plate over a copy: visor, antenna, core, joints
  const td = J.td, n = [td[1], -td[0]], col = mimicCol(key, alt), pulse = 0.5 + 0.5 * Math.sin(globalT * 0.16);
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
function drawRobotFX(f) { // the ring on the floor and the scan when a round begins
  const col = mimicCol(f.key, f.alt), s = f.ch.scale, age = game.frame - (f.mimicAt || 0), x = f.x, gy = GROUND - Math.min(f.y, 0), pulse = 0.5 + 0.5 * Math.sin(globalT * 0.12);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 2.4; ctx.strokeStyle = `rgba(${col},${0.32 + 0.2 * pulse})`;
  ctx.beginPath(); ctx.ellipse(x, GROUND + 2, 42 * s, 9, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  if (age >= 0 && age < 80) { // the scan: a bar of light sweeps up the body, and a ring spreads from the floor
    const k = age / 80, y = GROUND - f.y - (k * 190 * s), a = Math.sin(Math.PI * k);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, y - 16, 0, y + 16); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(0.5, `rgba(${col},${0.85 * a})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - 54 * s, y - 16, 108 * s, 32);
    ctx.strokeStyle = `rgba(${col},${0.7 * (1 - k)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, GROUND + 2, (20 + k * 80) * s, 4 + k * 12, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
}
function drawRobotPreview(i, x, fc, sel, mirror) { // the picking screen: just his robot form (its core slowly takes on each fighter's colour in turn)
  const pool = mimicPool(), n = Math.floor((globalT + i * 57) / 170) % pool.length, p = idlePose(i * 1.7, 'robot');
  drawShadow(x, 0, 1.04);
  drawBody('robot', p, x, GROUND, fc, hipFor(p), { aura: sel, alpha: sel ? 1 : 0.7, alt: mirror && i === 1, core: mimicCol(pool[n], mirror && i === 1) });
  return true;
}
/* ---------- Mimic copying Tanaka: the angel and the devil as machines ---------- */
function robotWings(J, n, t) { // steel blades for wings, glowing at the edge (drawing space of the body)
  const b = [J.sh[0] - n[0] * 8, J.sh[1] - n[1] * 8 - 4];
  for (const k of [0, 1, 2]) { const L = 54 - k * 9, ang = 0.55 + k * 0.28 + Math.sin(t * 0.12 + k) * 0.03, p1 = [b[0] - Math.cos(ang) * L, b[1] + Math.sin(ang) * L * 0.8], p2 = [b[0] - Math.cos(ang + 0.2) * L * 0.55, b[1] + Math.sin(ang + 0.2) * L * 0.55 + 6];
    ctx.fillStyle = k % 2 ? '#8e99ad' : '#b9c3d4'; ctx.strokeStyle = '#39415a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; seg(b, p1, 1.8, `rgba(255,225,120,${0.55 + 0.25 * Math.sin(t * 0.2 + k)})`); ctx.restore(); }
}
function robotTail(J, n, t) { // a cable with a glowing plug at the end
  const a = [J.hip[0] - n[0] * 8, J.hip[1]], c = [J.hip[0] - 34, J.hip[1] - 20 + Math.sin(t * 0.2) * 5], e = [J.hip[0] - 40, J.hip[1] + 6];
  ctx.strokeStyle = '#2a303f'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,70,50,${0.6 + 0.3 * Math.sin(t * 0.3)})`; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]); ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#59627a'; ctx.beginPath(); ctx.moveTo(e[0] - 7, e[1] - 2); ctx.lineTo(e[0], e[1] + 7); ctx.lineTo(e[0] + 4, e[1] - 4); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([e[0] - 1, e[1] + 1], 2.4, 'rgba(255,80,60,.95)'); ctx.restore();
}
function robotHorns(t) { // (head space) two steel prongs with red lights, where the devil's horns were
  for (const sx of [-1, 1]) { seg([sx * 4.5, 9], [sx * 8.5, 21], 2.4, '#59627a'); dot([sx * 8.5, 21.5], 2.2, '#2a303f'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([sx * 8.5, 21.5], 1.7 + 0.5 * Math.sin(t * 0.3), 'rgba(255,70,50,.95)'); ctx.restore(); }
}
function robotHalo(t) { // (head space) a ring of light in segments, turning
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,225,120,${0.85 + 0.15 * Math.sin(t * 0.2)})`; ctx.lineWidth = 2.6; ctx.setLineDash([4, 3]); ctx.lineDashOffset = -t * 0.4; ctx.beginPath(); ctx.ellipse(0, 18 + Math.sin(t * 0.1) * 1.5, 10, 3, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}
function robotMini(kind) { // the tiny angel and devil on his shoulders, as little robots (mini space: y down, about 24 high)
  const ang = kind === 'angel', col = ang ? '255,225,110' : '255,70,50';
  ctx.fillStyle = '#aeb8c8'; ctx.strokeStyle = '#39415a'; ctx.lineWidth = 0.8; rrect(-4.5, 2, 9, 10, 2); ctx.fill(); ctx.stroke();
  if (ang) for (const sx of [-1, 1]) { ctx.fillStyle = '#8e99ad'; ctx.beginPath(); ctx.moveTo(sx * 4, 3); ctx.lineTo(sx * 15, -3); ctx.lineTo(sx * 11, 8); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  else { ctx.strokeStyle = '#2a303f'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(4, 10); ctx.quadraticCurveTo(12, 12, 11, 5); ctx.stroke(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([11, 5], 1.5, 'rgba(255,70,50,.95)'); ctx.restore(); }
  ctx.fillStyle = '#c3ccda'; ctx.strokeStyle = '#39415a'; ctx.lineWidth = 0.8; rrect(-5.5, -9, 11, 10, 2.5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#10131c'; ctx.fillRect(-4.2, -5.6, 8.6, 3.2); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${col},.95)`; ctx.fillRect(-3.2, -4.7, 6.6, 1.2); ctx.restore();
  if (ang) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${col},.95)`; ctx.lineWidth = 1.2; ctx.setLineDash([2, 1.5]); ctx.beginPath(); ctx.ellipse(0, -13, 5, 1.6, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  else for (const sx of [-1, 1]) { seg([sx * 3, -9], [sx * 5, -15], 1.3, '#59627a'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([sx * 5, -15.5], 1.2, 'rgba(255,70,50,.95)'); ctx.restore(); }
}
/* ---------- Mimic copying Hohen: the golem as a robotic giant ---------- */
function robotGiantBody(pal, bob) { // (the golem's drawing space) panel seams, rivets, a housing round the core, vents and shoulder plates instead of cracks
  ctx.strokeStyle = pal.crack; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-36, -76 - bob); ctx.lineTo(36, -76 - bob); ctx.moveTo(-34, -48 - bob); ctx.lineTo(34, -48 - bob); ctx.moveTo(0, -90 - bob); ctx.lineTo(0, -78 - bob); ctx.stroke();
  for (const x of [-30, -20, 20, 30]) dot([x, -84 - bob], 1.8, pal.line);
  ctx.strokeStyle = pal.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -62 - bob, 15, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 3; i++) seg([-14, -44 - i * 0 - bob - 0], [-14, -44 - bob], 0.1, pal.line), seg([-13 + i * 10, -43 - bob], [-13 + i * 10, -36 - bob], 2, pal.line); // belly vents
  for (const x of [-50, 30]) { ctx.fillStyle = pal.light; ctx.strokeStyle = pal.line; ctx.lineWidth = 2.5; rrect(x, -100 - bob, 20, 17, 4); ctx.fill(); ctx.stroke(); dot([x + 10, -91.5 - bob], 2, pal.line); } // shoulder plates
}
function robotGiantHead(pal, bob) { // a visor, an antenna and an ear
  ctx.fillStyle = '#10131c'; rrect(-14, -116 - bob, 30, 12, 4); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${pal.eye},.95)`; rrect(-10, -112.5 - bob, 24, 4.5, 2); ctx.fill(); ctx.restore();
  seg([0, -122 - bob], [-6, -142 - bob], 3, pal.line); dot([-6, -143 - bob], 4, pal.dark);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([-6, -143 - bob], 2.8 + 0.8 * Math.sin(globalT * 0.2), `rgba(${pal.eye},.95)`); ctx.restore();
  ctx.fillStyle = pal.dark; ctx.strokeStyle = pal.line; ctx.lineWidth = 2; rrect(-20, -114 - bob, 6, 14, 2); ctx.fill(); ctx.stroke();
}
function robotGiantJoint(sx, sy, fx, fy, pal) { // a joint at the elbow and a glowing band at the wrist
  const mx = (sx + fx) / 2, my = (sy + fy) / 2; dot([mx, my], 8.5, pal.line); dot([mx, my], 5.5, pal.dark);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([mx, my], 2.6, `rgba(${pal.eye},.95)`); ctx.strokeStyle = `rgba(${pal.eye},.7)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx, fy, 13.5, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}
function robotGiantLegs(pal) { for (const x of [-15, 15]) { dot([x, -22], 7, pal.line); dot([x, -22], 4.2, pal.dark); ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([x, -22], 2, `rgba(${pal.eye},.9)`); ctx.restore(); } } // knee joints
function robotArmourHelmet(pal, t) { // Hohen's armour on Mimic: a boxy steel head, a glowing visor strip, an antenna (the head's own frame: faces +x, up is +y)
  ctx.fillStyle = pal.body; ctx.strokeStyle = pal.line; ctx.lineWidth = 2.5; rrect(-12, -11, 26, 24, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = pal.dark; rrect(-12, 6, 26, 7, 3); ctx.fill(); // the brow
  ctx.fillStyle = '#10131c'; rrect(0, -2, 15, 9, 3); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pu = 0.75 + 0.25 * Math.sin(t * 0.2); ctx.fillStyle = `rgba(${pal.eye},${pu})`; rrect(2, 0.8, 11.5, 3.6, 1.8); ctx.fill();
  const g = ctx.createLinearGradient(15, 2, 28, 2); g.addColorStop(0, `rgba(${pal.eye},${0.5 * pu})`); g.addColorStop(1, `rgba(${pal.eye},0)`); ctx.fillStyle = g; ctx.fillRect(14, -0.5, 14, 6); ctx.restore();
  ctx.fillStyle = pal.dark; rrect(-15, -5, 6, 12, 2); ctx.fill(); ctx.stroke();
  seg([-4, 13], [-8, 27], 2.6, pal.line); dot([-8, 28], 3.6, pal.dark); ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([-8, 28], 2.6 + 0.7 * Math.sin(t * 0.2), `rgba(${pal.eye},.95)`); ctx.restore();
  for (let i = 0; i < 3; i++) seg([-6, -6 + i * 3], [-1, -6 + i * 3], 1, pal.line);
}
function robotBigSpirit(kind, x, y, sc, a, t, face) { // the full-size angel and devil of the possession scenes, as steel machines — plain vector shapes (no canvas filter: it made these scenes lag)
  if (a <= 0) return;
  const ang = kind === 'angel', col = ang ? '255,225,120' : '255,70,50', pulse = 0.6 + 0.4 * Math.sin(t * 0.2), S = '#aeb8c8', SD = '#7d8799', E = '#39415a';
  ctx.save(); ctx.translate(x, y); ctx.scale(sc * face, sc); ctx.globalAlpha = a; ctx.lineJoin = 'round';
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, -170, 10, 0, -170, 210); g.addColorStop(0, `rgba(${col},.32)`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -170, 210, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  for (const sd of [-1, 1]) for (let i = 0; i < (ang ? 6 : 4); i++) { // wings: rigid blades fanning out, glowing along the edge
    const th = (ang ? 0.35 + i * 0.24 : 0.7 + i * 0.32) + Math.sin(t * 0.1) * 0.04, L = (ang ? 150 : 175) - i * (ang ? 14 : 24), bx = sd * 16, by = -225, tx = bx + sd * Math.sin(th) * L, ty = by - Math.cos(th) * L * (ang ? 1 : 0.7);
    ctx.fillStyle = i % 2 ? SD : S; ctx.strokeStyle = E; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, by - 8); ctx.lineTo(tx, ty); ctx.lineTo(bx, by + 12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; seg([bx, by - 8], [tx, ty], 2.4, `rgba(${col},${0.5 + 0.3 * pulse})`); ctx.restore(); }
  ctx.fillStyle = SD; ctx.strokeStyle = E; ctx.lineWidth = 2.5; rrect(-26, -64, 22, 64, 5); ctx.fill(); ctx.stroke(); rrect(4, -64, 22, 64, 5); ctx.fill(); ctx.stroke(); // legs
  ctx.fillStyle = S; rrect(-34, -240, 68, 170, 10); ctx.fill(); ctx.stroke(); rrect(-30, -96, 60, 28, 6); ctx.fillStyle = SD; ctx.fill(); ctx.stroke(); // torso and hips
  ctx.strokeStyle = E; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-30, -150); ctx.lineTo(30, -150); ctx.moveTo(-30, -118); ctx.lineTo(30, -118); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cg = ctx.createRadialGradient(0, -196, 2, 0, -196, 26); cg.addColorStop(0, `rgba(${col},1)`); cg.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = cg; ctx.globalAlpha = a * (0.7 + 0.3 * pulse); ctx.beginPath(); ctx.arc(0, -196, 26, 0, Math.PI * 2); ctx.fill(); ctx.restore(); // the core
  for (const sd of [-1, 1]) { ctx.fillStyle = SD; rrect(sd * 34 - 14, -246, 28, 22, 5); ctx.fill(); ctx.stroke(); } // shoulder plates
  ctx.lineCap = 'round';
  if (ang) { seg([-36, -228], [-8, -190], 15, E); seg([-36, -228], [-8, -190], 11, S); seg([36, -228], [8, -190], 15, E); seg([36, -228], [8, -190], 11, S); dot([0, -188], 11, SD); } // hands together in prayer
  else for (const sd of [-1, 1]) { const e = [sd * 70, -150], h = [sd * 62, -96]; seg([sd * 40, -226], e, 17, E); seg([sd * 40, -226], e, 13, S); seg(e, h, 17, E); seg(e, h, 13, SD); dot(e, 9, E); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = -1; i <= 1; i++) seg([h[0] + i * 6, h[1]], [h[0] + i * 8, h[1] + 16], 3, `rgba(${col},.9)`); ctx.restore(); } // arms ending in glowing claws
  ctx.fillStyle = S; ctx.strokeStyle = E; ctx.lineWidth = 2.5; rrect(-26, -296, 52, 50, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#10131c'; rrect(-4, -282, 32, 14, 5); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${col},${0.75 + 0.25 * pulse})`; rrect(0, -278, 25, 6, 3); ctx.fill(); ctx.restore(); // the visor
  for (const sx of (ang ? [-1] : [-1, 1])) { seg([sx * 15, -296], [sx * 26, -332], 4, SD); ctx.save(); ctx.globalCompositeOperation = 'lighter'; dot([sx * 26, -334], 5 + 2 * pulse, `rgba(${col},.95)`); ctx.restore(); } // antenna(e)
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${col},${0.55 + 0.3 * pulse})`; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t;
  if (ang) { ctx.beginPath(); ctx.ellipse(0, -318, 30, 8, 0, 0, Math.PI * 2); ctx.stroke(); } // a halo of segments
  else { ctx.beginPath(); ctx.moveTo(-20, -40); ctx.quadraticCurveTo(-120, -20, -110, -90); ctx.stroke(); } // a live cable for a tail
  ctx.restore(); ctx.restore();
}
COMBO_SET.robot = []; PUNISH_SET.robot = []; DEMOS.robot = [];
