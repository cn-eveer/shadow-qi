'use strict';
/* ================= victory animations ================= */
// Every fighter has three ways to win a round, picked by the health they have left (70% or more: showing off;
// 30% or more: composed; less: worn out and relieved), and one bigger celebration for winning the match.
// Each is a list of key poses ([pose, until frame]) blended into each other, effects, and a line in a speech bubble.

Object.assign(POSES, {
  vTired: P(52, -18,-28, -28,-36, 48,-8, -16,-34),      // bent over, hands on the knees, catching his breath
  vKneel: P(10, 58,100, -12,4, 90,0, 4,-90),             // down on one knee, a hand resting on it
  vSalute: P(0, 34,172, -8,12, 22,3, -22,-8),            // the blade held upright before the face
  vHandChest: P(2, 22,150, 8,18, 14,2, -14,-6),          // a hand laid on the chest
  vFlex: P(-4, 96,178, -96,180, 34,2, -34,-10),          // both arms bent up, showing off
  vFistBow: P(26, 22,112, 40,140, 18,2, -18,-6),         // fist pressed into the palm, bowing
  vCrossArms: P(-4, 16,86, 6,98, 24,2, -24,-8),          // arms folded
  vStaffShoulder: P(2, 150,62, 128,48, 28,3, -26,-8),    // the staff across the shoulders, wrists draped over it
  vLean: P(20, 72,58, -8,6, 30,2, -30,-12),              // leaning on the planted staff
  vTipHat: P(4, 142,-112, 30,60, 30,4, -32,-12),         // a finger to the hat brim
  vBlow: P(6, 56,166, 40,60, 30,4, -32,-12),             // the revolver raised to the lips
  vThumbsUp: P(-2, 76,166, 10,20, 24,2, -24,-8),
  vSlump: P(24, 6,0, -6,0, 24,4, -24,-8),                // shoulders sagging
  vLotus: P(0, 40,96, 30,86, 86,-80, 74,-96),            // sitting cross-legged in the air
  vPoint: P(-6, 82,86, -36,60, 26,3, -26,-8),            // pointing at the one he beat, a fist on the hip
});

const WIN = {
  ninja: {
    a: { seq: [['seal3', 30], ['seal5', 75], ['vCrossArms', 999]], line: ['Too easy.', 'たやすい。'] },
    b: { seq: [['swordDraw', 25], ['iaiEnd', 60], ['seal', 999]], line: ['It is done.', 'これで終わりだ。'] },
    c: { seq: [['vKneel', 70], ['seal4', 999]], line: ['...That was close.', '…危なかった。'] },
    final: { seq: [['seal3', 35], ['seal5', 85], ['vCrossArms', 999]], line: ['You never even saw me.', '見えなかっただろう。'] },
  },
  brawler: {
    a: { seq: [['chargeB', 30], ['twinPalm', 60], ['vFlex', 999]], line: ['Is that all you’ve got?', 'それで全部か？'] },
    b: { seq: [['seal4', 40], ['vFistBow', 90], ['idleT', 999]], line: ['A good fight.', 'いい勝負だった。'] },
    c: { seq: [['vTired', 85], ['seal4', 999]], line: ['Hah... hah... you were tough.', 'はぁ…はぁ…強かったぞ。'] },
    final: { seq: [['chargeB', 45], ['twinPalm', 80], ['vFlex', 999]], line: ['Train harder. Come back stronger.', 'もっと鍛えて出直してこい。'] },
  },
  staff: {
    a: { seq: [['staffWhirl', 40], ['staffUp', 70], ['cloudSit', 999]], spin: 40, line: ['Too slow~!', 'おっそーい！'] },
    b: { seq: [['staffWhirl', 35], ['vStaffShoulder', 999]], spin: 35, line: ['Hehe, not bad!', 'へへっ、なかなかやるね！'] },
    c: { seq: [['vLean', 75], ['idleB', 999]], line: ['Phew... I made it!', 'ふぅ…なんとか勝った！'] },
    final: { seq: [['staffWhirl', 50], ['staffRise', 85], ['cloudSit', 999]], spin: 50, line: ['Too slow~! Catch me if you can!', 'おっそーい！捕まえてごらん！'] },
  },
  psychic: {
    a: { seq: [['psyRaise', 45], ['winL', 999]], line: ['Just as foretold.', '予言どおりね。'] },
    b: { seq: [['psyCast', 40], ['idleL', 999]], line: ['The stars favor me.', '星は私の味方。'] },
    c: { seq: [['vHandChest', 999]], line: ['The vision was... blurry.', '未来が…霞んで見えたわ。'] },
    final: { seq: [['psyRaise', 40], ['psyCast', 90], ['vLotus', 999]], line: ['The stars had already decided.', '星はもう答えを出していたの。'] },
  },
  paladin: {
    a: { seq: [['pHalo', 60], ['idleP', 999]], line: ['The light prevails!', '光は負けぬ！'] },
    b: { seq: [['vSalute', 999]], line: ['An honorable bout.', '見事な一戦であった。'] },
    c: { seq: [['pPlant', 70], ['chargeP', 999]], line: ['...My thanks, O light.', '…光よ、感謝する。'] },
    final: { seq: [['pPlant', 70], ['pHalo', 125], ['vSalute', 999]], line: ['Rise, and fight with honor.', '立て。誇りを持って戦え。'] },
  },
  kappa: {
    a: { seq: [['kEat', 50], ['kPeckUp', 80], ['kWin', 999]], line: ['Kappa kappa~!', 'カッパッパ～！'] },
    b: { seq: [['kIdle', 30], ['kPeckUp', 999]], line: ['Nice try!', 'おしかったね！'] },
    c: { seq: [['kCurl', 60], ['kIdle', 999]], line: ['My dish almost spilled!', 'お皿がこぼれるとこだった！'] },
    final: { seq: [['kEat', 60], ['kToss', 100], ['kWin', 999]], line: ['Victory tastes like cucumber!', '勝利はきゅうりの味！'] },
  },
  gunman: {
    a: { seq: [['gUp', 30], ['gTwin', 55], ['gHolster', 999]], line: ['Too slow on the draw.', '抜くのが遅かったな。'] },
    b: { seq: [['gAim', 40], ['vBlow', 85], ['gHolster', 999]], line: ['Nothin’ personal.', '恨みっこなしだぜ。'] },
    c: { seq: [['vTipHat', 70], ['gIdle', 999]], line: ['Whew... close one, partner.', 'ふぅ…危なかったぜ、相棒。'] },
    final: { seq: [['gUp', 30], ['gTwin', 75], ['vTipHat', 115], ['gHolster', 999]], line: ['This town ain’t big enough for two.', 'この町に二人はいらねえ。'] },
  },
  salary: {
    a: { seq: [['sTie', 40], ['sSpring', 70], ['vThumbsUp', 999]], line: ['No overtime tonight!', '今日は定時で帰れる！'] },
    b: { seq: [['sBow', 60], ['sIdle', 999]], line: ['Thank you for your hard work.', 'お疲れ様でした。'] },
    c: { seq: [['vSlump', 60], ['sBow', 999]], line: ['I-I still have my job...', 'ク、クビは免れた…'] },
    final: { seq: [['sBow', 50], ['sTie', 90], ['vThumbsUp', 999]], line: ['Promotion, here I come!', '昇進、いただきます！'] },
  },
};

function winTierOf(f) { const k = f.hp / 1000; return k >= 0.7 ? 'a' : k >= 0.3 ? 'b' : 'c'; }
function winSet(f) { const w = WIN[f.key]; if (!w) return null; return game.finalWin === f ? w.final : w[f.winTier || 'b']; }
function winPose(f) { // walk through the key poses, blending into each, with a little life in the held pose
  const set = winSet(f); if (!set) return POSES[f.ch.winPose || 'win'];
  const t = f.st; let prev = POSES[f.ch.idle || 'idle'] || POSES.idle, from = 0, p = null;
  for (const [name, end] of set.seq) { const P0 = POSES[name] || prev; if (t < end) { p = lerpPose(prev, P0, easeOutQ(clamp((t - from) / 12, 0, 1))); break; } prev = P0; from = end; }
  if (!p) p = { ...prev };
  const tired = (f.winTier === 'c' && game.finalWin !== f), br = Math.sin(t * (tired ? 0.22 : 0.07));
  p.t += br * (tired ? 3 : 1); p.a1u += br * (tired ? 2 : 1.2); p.a2u -= br * (tired ? 2 : 1.2); // breathing (panting when worn out)
  return p;
}
function winLine(f) { const set = winSet(f); return set ? L(...set.line) : null; }
function winStaffSpin(f) { const set = winSet(f); return set && set.spin && f.st < set.spin ? globalT * 0.7 * f.facing : null; }

// particles, once a frame while the winner celebrates (drawing only: vrnd, never the seeded stream)
function winFX(f, t) {
  const x = f.x, y = GROUND - f.y, s = f.ch.scale, d = f.facing, fin = game.finalWin === f, tier = fin ? 'final' : f.winTier, k = f.key;
  const P = o => parts.push(o);
  const smoke = (n, r, col) => { for (let i = 0; i < n; i++) P({ type: 'smoke', x: x + vrnd(-36, 36), y: y - vrnd(10, 160) * s, vx: vrnd(-1.6, 1.6), vy: -vrnd(0.3, 1.1), r, vr: 0.6, life: 36, max: 36, col }); };
  const sweat = () => P({ type: 'aura', x: x + d * 14, y: y - 168 * s, vx: d * vrnd(0.3, 0.9), vy: 0.8, life: 18, max: 18, r: 3, col: '150,200,255' });
  const sparkle = (col, r = 80) => { const an = vrnd(0, Math.PI * 2), q = vrnd(20, r); P({ type: 'spark', x: x + Math.cos(an) * q, y: y - 100 * s + Math.sin(an) * q, vx: vrnd(-1, 1), vy: -vrnd(0.5, 2), life: 14, max: 14, col }); };
  const ring = (col, r, n = 1) => { for (let i = 0; i < n; i++) P({ type: 'ering', x, y: y - 4, r: r + i * 14, vr: 2.4, life: 26, max: 26, col }); };
  const rise = (col, n = 1) => { for (let i = 0; i < n; i++) P({ type: 'aura', x: x + vrnd(-40, 40), y: y - vrnd(0, 40), vx: 0, vy: -vrnd(1, 2.5), life: 30, max: 30, r: vrnd(2, 4), col }); };
  const fall = (col, w = 60) => P({ type: 'aura', x: x + vrnd(-w, w), y: y - vrnd(180, 260), vx: 0, vy: vrnd(1, 2), life: 40, max: 40, r: 3, col });
  if (k === 'ninja') {
    if (tier === 'a' && t === 30) smoke(14, 12, '120,90,170');
    if (tier === 'b' && t === 40) for (let i = 0; i < 8; i++) P({ type: 'spark', x: x + d * 40, y: y - 120 * s, vx: d * vrnd(1, 5), vy: vrnd(-3, 3), life: 12, max: 12, col: '230,230,255' }); // the blade glints as it's sheathed
    if (tier === 'c' && t % 18 === 4) sweat();
    if (fin) { if (t === 2 || t === 85) smoke(18, 14, '120,90,170'); if (t > 85 && t % 3 === 0) fall('200,170,255', 120); if (t === 86) ring('170,130,255', 40, 3); }
  }
  if (k === 'brawler') {
    if ((tier === 'a' || fin) && t < (fin ? 45 : 30) && t % 3 === 0) qiGather(f, t, Math.min(1, t / 30));
    if (tier === 'a' && t === 31) ring('125,235,255', 36, 2);
    if (tier === 'c' && t % 14 === 3) sweat();
    if (fin) { if (t === 46) { P({ type: 'wcol', x, w: 40, life: 40, max: 40, col: '125,235,255' }); ring('125,235,255', 40, 3); } if (t > 80 && t % 2 === 0) rise('125,235,255', 1); }
  }
  if (k === 'staff') {
    if ((tier === 'a' || tier === 'b' || fin) && t < 50 && t % 3 === 0) sparkle('255,210,110', 70);
    if (tier === 'a' && t > 70 && t % 6 === 0) rise('255,240,200');
    if (tier === 'c' && t % 16 === 6) sweat();
    if (fin) { if (t > 85 && t % 4 === 0) rise('255,235,190', 2); if (t === 50 || t === 70 || t === 90) for (let i = 0; i < 14; i++) { const an = i / 14 * Math.PI * 2; P({ type: 'spark', x: x + vrnd(-160, 160), y: y - vrnd(200, 300), vx: Math.cos(an) * 4, vy: Math.sin(an) * 4, life: 22, max: 22, col: ['255,210,110', '255,140,200', '140,220,255'][i % 3] }); } } // fireworks
  }
  if (k === 'psychic') {
    if ((tier === 'a' || fin) && t > 20 && t % 5 === 0) P({ type: 'crystal', x: x + vrnd(-120, 120), y: y - vrnd(220, 300), vx: 0, vy: 3, r: 8, life: 40, max: 40, rot: vrnd(-0.3, 0.3) });
    if (tier === 'b' && t % 5 === 0) for (let i = 0; i < 3; i++) { const an = t * 0.08 + i * 2.1; P({ type: 'crystal', x: x + Math.cos(an) * 60, y: y - 110 * s + Math.sin(an) * 22, vx: 0, vy: 0, r: 7, life: 6, max: 6, rot: 0 }); }
    if (tier === 'c' && t % 10 === 0) sparkle('255,170,230', 50);
    if (fin && t === 45) P({ type: 'skycircle', x, y: y - 6, r: 120, life: 200, max: 200 });
    if (fin && t > 90 && t % 4 === 0) sparkle('210,190,255', 140);
  }
  if (k === 'paladin') {
    if (tier === 'a' && t === 20) P({ type: 'lbeam', x, w: 46, life: 50, max: 50 });
    if ((tier === 'a' || fin) && t > 10 && t % 3 === 0) fall('255,245,200');
    if (tier === 'b' && t === 12) for (let i = 0; i < 6; i++) P({ type: 'spark', x: x + d * 20, y: y - 170 * s - i * 8, vx: vrnd(-1, 1), vy: -1, life: 14, max: 14, col: '255,250,220' }); // a glint runs up the blade
    if (tier === 'c' && t > 70 && t % 8 === 0) rise('255,240,200');
    if (fin && t === 70) { P({ type: 'lbeam', x, w: 60, life: 90, max: 90 }); ring('255,240,190', 40, 3); }
  }
  if (k === 'kappa') {
    if ((tier === 'a' || fin) && t > 40 && t < 100 && t % 5 === 0) P({ type: 'aura', x: x + vrnd(-10, 10), y: y - 150 * s, vx: vrnd(-2, 2), vy: -2.5, life: 18, max: 18, r: 3, col: '150,215,255' });
    if (tier === 'c' && t % 9 === 0) P({ type: 'aura', x: x + vrnd(-14, 14), y: y - 120 * s, vx: 0, vy: 1.5, life: 20, max: 20, r: 2.5, col: '150,215,255' }); // the dish drips
    if (fin && t === 100) { P({ type: 'wcol', x: x - 90, w: 30, life: 36, max: 36, col: '150,215,255' }); P({ type: 'wcol', x: x + 90, w: 30, life: 36, max: 36, col: '150,215,255' }); }
    if (fin && t > 100 && t % 6 === 0) P({ type: 'ring', x: x + vrnd(-120, 120), y: y - vrnd(40, 200), r: vrnd(4, 9), vr: 0.15, life: 30, max: 30, col: '190,235,255' }); // bubbles
  }
  if (k === 'gunman') {
    if ((tier === 'a' || fin) && t > 30 && t < (fin ? 75 : 55) && t % 6 === 0) { for (let i = 0; i < 5; i++) P({ type: 'spark', x: x + d * 30, y: y - 220 * s, vx: vrnd(-3, 3), vy: -vrnd(2, 6), life: 12, max: 12, col: '255,230,150' }); sfx('shot'); } // shots into the sky
    if (tier === 'b' && t > 50 && t < 90 && t % 5 === 0) P({ type: 'smoke', x: x + d * 22, y: y - 165 * s, vx: 0, vy: -0.8, r: 4, vr: 0.3, life: 24, max: 24, col: '210,205,195' });
    if (tier === 'c' && t % 18 === 4) sweat();
    if (fin && t > 115 && t % 7 === 0) P({ type: 'smoke', x: x + vrnd(-200, 200), y: y - 6, vx: vrnd(-1.5, 1.5), vy: -0.3, r: 10, vr: 0.3, life: 40, max: 40, col: '200,170,130' }); // dust blowing across
  }
  if (k === 'alchemist') { // his stones: they glint, circle him, and for the match a transmutation circle opens under him
    const gem = i => ['110,255,220', '255,190,80', '150,170,255'][i % 3];
    if (tier === 'a' && t > 20 && t < 60 && t % 4 === 0) sparkle(gem(t / 4), 60);
    if (tier === 'b' && t === 40) for (let i = 0; i < 6; i++) P({ type: 'spark', x: x + d * 12, y: y - 150 * s, vx: vrnd(-2, 2), vy: -vrnd(1, 3), life: 14, max: 14, col: '235,245,255' }); // a glint off his spectacles
    if (tier === 'c' && t % 16 === 6) sweat();
    if (fin) { if (t === 40) ring('255,200,110', 50, 3); if (t > 40 && t < 140 && t % 5 === 0) { const an = t * 0.12, q = 70; P({ type: 'spark', x: x + Math.cos(an) * q, y: y - 100 * s + Math.sin(an) * q * 0.4, vx: 0, vy: -0.6, life: 16, max: 16, col: gem(t / 5) }); } if (t > 90 && t % 4 === 0) rise('255,220,150'); }
  }
  if (k === 'salary') {
    if (tier === 'a' && t === 55) for (let i = 0; i < 10; i++) P({ type: 'paper', x, y: y - 160 * s, vx: vrnd(-4, 4), vy: -vrnd(3, 7), rot: vrnd(0, 6), vr: vrnd(-0.3, 0.3), life: 60, max: 60 });
    if (tier === 'c' && t % 12 === 2) sweat();
    if (fin && (t === 50 || t === 95)) for (let i = 0; i < 18; i++) P({ type: 'paper', x: x + vrnd(-30, 30), y: y - 170 * s, vx: vrnd(-5, 5), vy: -vrnd(3, 8), rot: vrnd(0, 6), vr: vrnd(-0.3, 0.3), life: 70, max: 70 });
  }
}

// drawn behind the winner each frame
function drawWinFX(f) {
  const fin = game.finalWin === f, t = f.st, x = f.x, y = GROUND - f.y, s = f.ch.scale;
  if (fin) { // a glow on the floor in the fighter's colour for the match winner
    const col = f.ch.fxCol || '255,220,160', a = clamp(t / 30, 0, 1) * (0.5 + 0.15 * Math.sin(globalT * 0.1));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 4, x, y, 150);
    g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 150, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  if (f.key === 'ninja' && fin && t > 85) { const a = clamp((t - 85) / 20, 0, 0.45); // shadow clones kneel on both sides
    for (const dx of [-90, 90]) drawBody('ninja', POSES.vKneel, x + dx, y, dx < 0 ? 1 : -1, hipFor(POSES.vKneel), { tint: SHADOW_TINT, alpha: a }); }
  if (f.key === 'paladin' && ((fin && t > 70) || (f.winTier === 'a' && !fin && t > 10 && t < 90))) drawWingsAt(x - f.facing * 6, y - 160 * s, clamp((t - (fin ? 70 : 10)) / 20, 0, 1));
  if (f.key === 'brawler' && fin && t > 80) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = 70 + 6 * Math.sin(globalT * 0.2); ctx.strokeStyle = `rgba(125,235,255,${0.35 + 0.15 * Math.sin(globalT * 0.3)})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(x, y - 100 * s, r, r * 1.5, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  if (f.key === 'staff' && ((fin && t > 85) || (f.winTier === 'a' && !fin && t > 70))) { // her cloud
    ctx.save(); ctx.globalAlpha = 0.9; for (let i = 0; i < 6; i++) { const cx = x - 50 + i * 20, cy = y - 60 * s + Math.sin(globalT * 0.08 + i) * 3; ctx.fillStyle = i % 2 ? '#fff6e6' : '#ffe9c4'; ctx.beginPath(); ctx.arc(cx, cy, 18 - Math.abs(i - 2.5) * 2, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
}
