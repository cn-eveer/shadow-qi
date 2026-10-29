'use strict';
/* ================= setup ================= */
const W = 960, H = 540, GROUND = 470, WALL_L = 42, WALL_R = 918, G = 0.75, JUMP_V = 17, JUMP_HIGH = Math.sqrt(1.25) /* (every jump 25% higher) */, RAD = Math.PI / 180;
const HUD = "'Bungee', Impact, 'Arial Black', sans-serif";
const SMALL = "700 13px 'Rajdhani', 'Segoe UI', system-ui, sans-serif";
const canvas = document.getElementById('game');
let ctx = canvas.getContext('2d'); // (swapped for a moment while the second fighter's effects are drawn in another hue: see drawInAltHue)
let DPR = 1; // backing pixels per game unit; fitCanvas() keeps it matched to the canvas's real on-screen size
const ov = document.getElementById('overlay');
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
let rngState = 12345;
function R() { rngState = (Math.imul(rngState, 1664525) + 1013904223) >>> 0; return rngState / 4294967296; } // seeded: game logic only
const rnd = (a, b) => a + R() * (b - a);
const vrnd = (a, b) => a + Math.random() * (b - a); // drawing only: never touches the seeded stream
let globalT = 0, serial = 0;

/* ================= skeleton & poses ================= */
// Angles in degrees. Limbs: 0 = straight down, 90 = forward, 180 = up, -90 = back. Torso t: lean forward from vertical.
const SEG = { T: 48, UA: 25, LA: 24, TH: 30, SH: 31, NECK: 7, HEAD: 11 };
const PK = ['t','a1u','a1l','a2u','a2l','l1u','l1l','l2u','l2l'];
const P = (...v) => { const o = {}; PK.forEach((k, i) => { o[k] = v[i]; }); return o; };
const CL = [85, -15, 20, -90]; // crouch legs
const POSES = {
  idle: P(8, 40,125, 15,115, 25,5, -25,-10),
  guard: P(-4, 65,165, 45,155, 22,4, -28,-12),
  crouch: P(40, 60,140, 40,130, ...CL),
  cguard: P(25, 65,165, 45,155, ...CL),
  jump: P(10, 60,140, 30,120, 100,15, 60,-35),
  land: P(25, 55,135, 35,125, 60,-10, 10,-50),
  hit: P(-22, -25,15, -45,0, 22,6, -30,-12),
  chit: P(10, -20,30, -40,10, ...CL),
  knock: P(-60, -110,-80, -140,-120, 60,30, 30,10),
  down: P(-88, -95,-100, -80,-110, 82,95, 78,92),
  win: P(0, 170,178, -20,15, 12,0, -12,-4),
  dizzy: P(-10, -15,10, -35,-5, 20,4, -25,-10),
  jabW: P(6, 30,130, 15,115, 25,5, -25,-10),
  jab: P(14, 88,90, 10,120, 28,6, -28,-12),
  straight: P(22, 90,90, -5,125, 32,8, -30,-14),
  hookW: P(-6, 40,125, -40,80, 25,5, -28,-12),
  hook: P(28, 15,120, 88,90, 35,10, -35,-15),
  kickW: P(-5, 40,125, 15,115, 75,-30, -8,-4),
  lowKick: P(-8, 45,125, 15,115, 60,55, -8,-4),
  midKick: P(-15, 40,120, 10,110, 92,90, -8,-4),
  highKick: P(-25, 35,110, -10,100, 130,125, -12,-6),
  cPunchW: P(35, 20,120, 40,130, ...CL),
  cPunch: P(45, 88,88, 40,130, ...CL),
  cUpper: P(15, 150,170, 30,120, ...CL),
  cKick: P(30, 60,140, 40,130, 60,95, 20,-90),
  sweep: P(45, 20,10, 40,20, 65,92, 0,-90),
  jPunch: P(15, 55,55, 30,130, 100,15, 60,-35),
  jKick: P(0, 70,150, 30,130, 65,55, 100,10),
  throwW: P(-8, 160,-140, 15,110, 25,5, -28,-12),
  throw: P(18, 95,85, -15,100, 30,8, -30,-14),
  airThrow: P(25, 60,55, 20,110, 100,15, 60,-35),
  seal: P(2, 30,150, 30,150, 20,3, -20,-8),
  dash: P(35, -60,-40, -70,-50, 80,10, -40,-70),
  blastW: P(-8, -40,60, -45,55, 28,6, -30,-12),
  blast: P(14, 88,90, 84,88, 35,8, -35,-18),
  uppercutW: P(30, -20,40, 10,120, 60,-20, 20,-40),
  uppercut: P(-5, 170,178, -30,20, 30,0, -10,-40),
  rushA: P(25, 92,90, -20,100, 40,8, -35,-16),
  rushB: P(25, 10,110, 90,90, 40,8, -35,-16),
  charge: P(-2, 20,30, -20,-30, 30,8, -30,-8),
  // character heavy techniques
  slashW: P(-5, 150,-160, 30,120, 30,5, -30,-12),
  slash: P(30, 70,60, -40,30, 55,5, -45,-50),
  crescentW: P(15, 60,120, -60,-30, 70,-40, -10,-5),
  crescent: P(-35, -50,0, 40,100, 118,108, -15,-6),
  palmW: P(-10, -45,40, -50,35, 25,5, -30,-12),
  palm: P(18, 98,96, -60,-20, 45,5, -45,-30),
  axeW: P(-15, 50,150, 20,130, 165,172, -8,-4),
  axe: P(25, 30,110, -30,40, 75,50, -20,-10),
  jPunchH: P(25, 100,40, 95,35, 100,15, 60,-35),
  jKickH: P(-15, 40,130, -20,60, 88,88, 40,-40),
  // Kuro's shadow techniques
  stomp: P(5, 155,170, 140,165, 10,2, -12,-6),
  diveKick: P(-15, 120,160, 60,140, 45,35, 105,15),
  slideKick: P(-60, -30,-10, -40,-20, 75,92, 70,-100),
  seal2: P(2, 50,120, 15,165, 20,3, -20,-8),
  seal3: P(4, 72,172, 62,176, 22,4, -22,-8),   // both hands raised before the face, fingers up
  seal4: P(0, 22,112, 40,140, 18,2, -18,-6),   // a fist pressed into the other palm, low at the chest
  seal5: P(3, 88,182, 12,98, 20,3, -20,-8),    // two fingers pointed to the sky, the other hand at the hip
  tuck: P(80, 100,170, 90,160, 140,-20, 130,-30),
  swordReach: P(-5, 165,210, 20,110, 25,5, -25,-10), // 210° = forearm up and back, so the draw swings up instead of through the floor
  swordDraw: P(5, 120,150, 20,110, 28,5, -28,-12),
  swordReady: P(22, -40,-110, 40,120, 45,5, -40,-25),
  swordSlash: P(30, 85,70, -40,30, 55,5, -45,-50),
  staggered: P(28, -30,10, -50,-10, 18,-8, -22,-18),
  shoulder: P(40, 30,140, -20,100, 50,5, -45,-40),
  iaiStance: P(32, -40,40, 25,70, 62,0, -50,-45),
  iaiDash: P(45, 92,92, -70,-50, 75,30, -65,-85),
  iaiEnd: P(8, 100,108, -25,35, 32,6, -32,-16),
  palmUp: P(10, 140,170, -20,60, 30,6, -30,-12),
  elbowUp: P(18, 155,25, -30,60, 32,6, -30,-14),
  kunaiRise: P(-6, 175,178, -30,30, 35,0, -15,-35),
  roundhouse: P(-32, -45,10, 65,100, 106,96, -16,-6),
  spinW: P(10, 30,120, -30,60, 30,10, -35,-20),
  spinTurn: P(0, 20,150, -20,150, 80,-40, -10,-5),
  roundW: P(-20, -30,20, 50,110, 100,40, -14,-6),
  breath: P(12, 60,160, -20,60, 30,6, -30,-12),
  // Tetsu's own stances: wide, open-hand kung fu with fists and palms instead of kicks and blades
  idleT: P(6, 70,105, -25,75, 34,2, -34,-10),
  twinW: P(14, -35,30, -40,25, 45,-5, -45,-15),
  twinUp: P(2, 150,165, 138,158, 45,-5, -45,-15),
  kneeW: P(10, 50,130, 20,115, 45,-25, -20,-10),
  knee: P(-14, 75,145, 30,125, 128,-30, -12,-6),
  dragonFist: P(-12, 172,178, -55,-15, 42,12, -28,-48),
  twinPalm: P(20, 97,93, 87,89, 52,5, -52,-32),
  airHook: P(25, 20,125, 90,92, 100,15, 60,-35),
  airKnee: P(-6, 60,135, 25,115, 122,-28, 45,-40),
  airJabA: P(18, 93,90, -15,95, 100,15, 60,-35),
  airJabB: P(18, -15,95, 93,90, 100,15, 60,-35),
  airTwin: P(15, 97,93, 87,89, 100,15, 60,-35),
  hammerW: P(-14, 176,172, 170,166, 100,15, 60,-35),
  airHammer: P(40, 110,96, 102,90, 95,20, 55,-40),
  diveKnee: P(18, 150,170, 125,160, 62,-38, 12,-62),
  scoopW: P(55, -55,-30, -62,-40, 72,2, -68,-95),
  scoop: P(42, 62,115, 52,105, 72,2, -68,-95),
  lariatW: P(4, 60,90, -60,-90, 32,6, -32,-12),
  lariat: P(0, 92,94, -92,-94, 70,-15, 25,-50),
  meteorW: P(-12, 172,-165, 40,120, 100,15, 60,-35),
  meteorPunch: P(45, 58,54, -45,15, 95,25, 30,-50),
  stompW: P(2, 62,130, 30,120, 128,-12, -8,-4),
  stompDown: P(16, 45,118, 20,105, 38,8, -38,-12),
  parryStance: P(6, 96,150, 58,145, 40,0, -40,-10),
  // Mei: both hands on the staff; the staff runs from the back hand through the front hand
  idleB: P(16, 50,74, 10,64, 46,6, -22,-40), // a bo guard: both hands on the staff at the waist, the tip angled toward the opponent, knees bent
  // Aldric, the paladin: sword in the front hand, shield on the back arm
  // Kappa: little claws up, cute and ready
  kIdle: P(36, 62,96, 52,86, 72,-48, -2,-84),               // crouched low like an animal, claws held low and ready
  kClawUp: P(8, 172,176, 60,100, 40,0, -30,-24),
  kClawDown: P(42, 62,22, 82,120, 56,-12, -20,-52),
  kClawX: P(32, 72,40, 112,150, 52,-12, -20,-50),
  kPounce: P(62, 104,112, 98,108, -36,-58, -66,-78),
  kPeckUp: P(-16, 40,90, 30,80, 30,-6, -30,-18),          // head thrown up, pecking at someone above him
  kClaw: P(24, 112,64, 40,90, 50,6, -44,-26),
  kGrab: P(18, 88,92, 84,90, 40,6, -40,-18),
  kToss: P(-14, 170,176, 166,172, 30,4, -30,-10),
  kThrow: P(16, 104,100, -30,10, 42,4, -42,-14),
  kBlast: P(14, 90,90, 86,88, 40,6, -40,-18),
  kBelly: P(80, 95,95, 90,90, -80,-80, -90,-90),
  kCurl: P(50, 30,160, 20,150, ...CL),
  kEat: P(6, 150,40, 120,30, 32,2, -32,-10),
  kLowClaw: P(40, 80,40, 60,90, ...CL),
  kAirClaw: P(10, 110,60, 60,80, 100,15, 60,-35),
  kWin: P(0, 176,178, 172,176, 22,3, -22,-8),
  // the gunslinger: two revolvers, no kicks
  gIdle: P(4, 52,70, 40,62, 30,4, -32,-12),
  gHolster: P(5, 12,20, 4,14, 30,4, -32,-12),   // hands resting on the guns in their holsters
  gAim: P(8, 92,92, 34,62, 34,4, -34,-12),
  gTwin: P(10, 90,90, 88,88, 36,4, -36,-14),
  gAimLow: P(14, 70,66, 40,60, 40,4, -40,-14),
  gLow: P(32, 72,70, 68,66, ...CL),
  gUp: P(-8, 150,150, 140,140, 30,2, -30,-10),
  gAirDown: P(10, 55,40, 50,36, 100,15, 60,-35),
  gWin: P(0, 176,178, 40,60, 22,3, -22,-8),
  gRecoil: P(4, 120,128, 36,62, 34,4, -34,-12),
  // the salaryman
  sIdle: P(4, 30,60, 10,20, 26,2, -26,-8),
  sBow: P(70, 20,10, 15,5, 10,4, -10,-6),
  sDogeza: P(88, 160,170, 160,170, 95,-85, 95,-85),             // full kneeling bow, forehead to the floor
  sArch: P(-28, 150,172, 150,172, 22,-26, -22,-40),            // arched back as something takes him over
  saIdle: P(-4, 120,150, 120,150, 18,-6, -18,-16),             // the angel floats, arms open
  sdIdle: P(44, 58,96, 46,82, 76,-54, 0,-90),                // the devil crouches low like a beast, claws hanging low
  saPray: P(0, 36,150, 36,150, 20,3, -20,-8),                  // the angel stands still, hands together in prayer
  saKneelPray: P(10, 22,172, 18,176, 88,-4, -8,-100),           // Heaven's Gate: down on one knee, palms pressed together before his face, praying
  sdBeckon: P(18, 96,150, 40,90, 50,-30, -10,-50),             // a low crouch, one hand curling: come here...
  sSpring: P(-10, 160,170, 120,140, 10,0, -30,-60),
  sCase: P(20, 104,70, 40,70, 50,6, -44,-26),
  // poses for each fighter's own combo strings
  kReverse: P(14, 60,140, 110,90, 40,4, -40,-14),
  kStepSlash: P(40, 100,70, 50,30, 70,-20, -30,-70),
  tBody: P(24, 80,120, 30,70, 48,6, -44,-24),
  tElbow: P(20, 95,-80, 40,70, 46,6, -44,-24),
  tHammer: P(36, 70,20, 66,16, 52,6, -46,-28),
  kBite: P(55, 20,-20, 10,-30, 60,-10, -30,-50),
  lStaffThrust: P(10, 90,92, 40,70, 32,4, -32,-12),
  lStaffSweep: P(30, 60,40, 30,50, 85,-15, 20,-90),
  lStaffUp: P(-6, 160,170, 60,90, 30,2, -30,-12),
  lStaffBack: P(-4, 30,-40, 70,100, 30,4, -30,-12),
  sTie: P(10, 150,120, 40,60, 34,4, -34,-12),
  sShove: P(30, 40,80, 90,95, 52,6, -45,-30),
  idleP: P(8, 40,112, 70,100, 34,2, -18,-36), // a knight's guard: the greatsword angled forward over the shield, knees bent, weight forward
  chargeP: P(14, 28,-10, 40,70, ...CL),                    // kneeling in prayer over the planted sword
  pPlant: P(26, 40,-20, 50,80, 60,-10, -30,-50),
  pQuake: P(36, 20,30, 50,-10, 80,-20, -20,-70),
  pShieldUp: P(-6, 30,60, 160,175, 32,0, -10,-40),
  pThrowS: P(18, 30,60, 120,100, 52,6, -45,-30),
  pHalo: P(0, 150,175, 70,96, 32,4, -32,-12),
  winP: P(0, 176,178, 70,96, 22,3, -22,-8),
  pSlashW: P(-8, 150,172, 64,92, 30,6, -30,-12),
  pSlash: P(20, 98,78, 44,70, 52,6, -44,-26),
  pCleaveW: P(-12, 172,180, 56,86, 30,6, -30,-12),
  pCleave: P(32, 72,28, 52,66, 58,8, -45,-40),
  pThrustW: P(0, 40,70, 60,90, 30,6, -30,-12),
  pThrust: P(22, 90,92, 58,84, 62,10, -52,-72),
  pBashW: P(-10, 40,82, 18,46, 30,6, -30,-12),
  pBash: P(24, 30,64, 96,96, 56,6, -45,-30),
  pRiseW: P(34, 30,10, 70,92, 70,-25, 20,-60),
  pRise: P(-6, 168,176, 64,92, 32,0, -10,-40),
  pLowCut: P(42, 78,40, 62,92, 85,-15, 20,-90),
  pDash: P(30, 18,62, 94,94, 52,5, -45,-40),
  pCounter: P(4, 36,76, 92,124, 36,0, -40,-10),
  pSpin: P(2, 92,94, -88,-90, 42,8, -40,-14),
  pAir: P(10, 104,82, 62,84, 100,15, 60,-35),
  pAirDown: P(16, 70,26, 60,80, 90,30, 50,-40),
  crouchP: P(30, 52,100, 70,92, ...CL),
  chargeB: P(4, -28,40, -18,52, 30,6, -30,-12),
  winB: P(0, 176,178, 150,172, 22,3, -22,-8),
  staffJabW: P(4, 45,70, 10,60, 34,4, -30,-14),
  staffJab: P(16, 96,94, 62,90, 40,6, -36,-18),
  staffSwingW: P(-6, -40,60, -62,30, 30,6, -30,-12),
  staffSwing: P(24, 104,72, 74,60, 50,6, -44,-26),
  slamW: P(-10, 170,176, 158,170, 30,6, -30,-12),
  staffSlam: P(30, 80,50, 62,40, 55,8, -45,-40),
  thrustW: P(0, 30,60, 0,50, 30,6, -30,-12),
  thrust: P(24, 92,92, 74,88, 62,10, -52,-72),
  thrustUp: P(4, 140,150, 112,140, 45,4, -40,-20),
  vault: P(-6, 160,170, 148,166, 100,15, 60,-35),
  staffSlamAir: P(34, 82,52, 64,42, 90,20, 40,-40),
  staffSweep: P(46, 82,74, 62,70, 85,-15, 20,-90),
  flipKick: P(-20, -40,20, -60,10, 150,165, 20,-40),
  poleKick: P(-10, 120,160, 100,150, 112,104, -14,-6),
  cloudSit: P(20, 150,170, 130,160, 120,-20, 110,-30),
  staffUp: P(4, 132,142, 104,132, 38,2, -34,-14),
  staffSwingUp: P(-4, 150,120, 120,100, 40,4, -36,-16),
  staffRise: P(-8, 170,176, 142,170, 42,10, -28,-44),
  staffWhirl: P(4, 92,92, -92,-92, 40,8, -40,-14),
  airStaff: P(16, 100,92, 72,82, 100,15, 60,-35),
  airStaffSwing: P(24, 120,70, 90,60, 100,15, 60,-35),
  airStaffWhirl: P(8, 92,92, -92,-92, 100,15, 60,-35),
  airStaffDown: P(40, 54,32, 34,22, 70,-15, 25,-50),
  slamWAir: P(-12, 170,176, 158,170, 100,15, 60,-35),
  staffLowW: P(10, 40,60, 10,50, 34,4, -30,-14),
  psyLowCast: P(14, 52,40, -20,30, 22,4, -20,-10),
  crouchL: P(8, 60,120, 24,128, 30,-12, -26,-20), // Lyra barely crouches; she floats
  staffHighW: P(0, 150,160, 125,150, 30,4, -28,-12),
  staffLowThrust: P(26, 80,66, 60,112, 52,6, -45,-28), // back hand high, front hand low: the staff drives down and forward
  staffLow: P(30, 70,45, 46,35, 50,4, -45,-30),
  staffLowCrouch: P(45, 75,50, 52,40, 85,-15, 20,-90),
  // Lyra: upright and calm; her hands do the work
  idleL: P(2, 22,172, 34,96, 12,2, -12,-6), // a mage's stance: the staff held upright beside her, the other hand open toward the opponent
  chargeL: P(-4, 140,160, 120,150, 12,2, -12,-4),
  winL: P(0, 40,140, 38,142, 10,2, -10,-4),
  psyW: P(-4, -20,60, 30,110, 18,2, -18,-6),
  psyPush: P(10, 92,90, -24,30, 24,4, -22,-10),
  psyRaise: P(-6, 172,176, 30,110, 18,2, -18,-6),
  psyDown: P(14, 60,40, -20,30, 24,4, -22,-10),
  psyUp: P(-6, 160,170, -10,50, 22,4, -20,-10),
  psyBoth: P(10, 92,90, 86,88, 26,4, -24,-10),
  psyCast: P(0, 150,-140, 140,-150, 14,2, -14,-6),
  airPsy: P(10, 100,95, 20,110, 60,-10, 20,-40),
  airPsyBoth: P(10, 92,90, 86,88, 60,-10, 20,-40),
  airPsyDown: P(30, 60,40, 20,90, 50,-20, 10,-50),
};
const wrap180 = d => ((d % 360) + 540) % 360 - 180;
const LIMB = [['a1u', 'a1l'], ['a2u', 'a2l'], ['l1u', 'l1l'], ['l2u', 'l2l']];
// Blending two poses: the torso, upper arms and thighs move straight from one angle to the other (so a big swing keeps its arc);
// forearms and shins blend by how far the elbow or knee is bent, so they follow the limb instead of spinning round the long way
function lerpPose(a, b, t) {
  if (t <= 0) return { ...a }; if (t >= 1) return { ...b };
  const o = { t: a.t + (b.t - a.t) * t };
  for (const [u, l] of LIMB) { o[u] = a[u] + (b[u] - a[u]) * t; const ba = wrap180(a[l] - a[u]), bb = wrap180(b[l] - b[u]); o[l] = o[u] + ba + wrap180(bb - ba) * t; }
  return o;
}
function solve(p) {
  const dv = a => [Math.sin(a * RAD), -Math.cos(a * RAD)];
  const td = [Math.sin(p.t * RAD), Math.cos(p.t * RAD)];
  const hip = [0, 0], sh = [td[0] * SEG.T, td[1] * SEG.T];
  const head = [sh[0] + td[0] * (SEG.NECK + SEG.HEAD), sh[1] + td[1] * (SEG.NECK + SEG.HEAD)];
  const limb = (o, a, b, L1, L2) => { const u = dv(a), v = dv(b); const m = [o[0] + u[0] * L1, o[1] + u[1] * L1]; return [m, [m[0] + v[0] * L2, m[1] + v[1] * L2]]; };
  const [e1, h1] = limb(sh, p.a1u, p.a1l, SEG.UA, SEG.LA);
  const [e2, h2] = limb(sh, p.a2u, p.a2l, SEG.UA, SEG.LA);
  const [k1, f1] = limb(hip, p.l1u, p.l1l, SEG.TH, SEG.SH);
  const [k2, f2] = limb(hip, p.l2u, p.l2l, SEG.TH, SEG.SH);
  return { td, hip, sh, head, e1, h1, e2, h2, k1, f1, k2, f2 };
}
function hipFor(p) {
  const J = solve(p);
  return -Math.min(J.hip[1], J.k1[1], J.f1[1], J.k2[1], J.f2[1], J.h1[1], J.h2[1], J.e1[1], J.e2[1], J.head[1] - SEG.HEAD) + 4;
}

