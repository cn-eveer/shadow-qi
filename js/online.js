'use strict';
/* ================= online play (WebRTC through PeerJS; lockstep with input delay) ================= */
// Both players run the same deterministic game. Each frame, every player sends their buttons for a frame a few
// frames ahead (the input delay); a frame is simulated only once both players' buttons for it have arrived.
const NETV = 2, NET_PREFIX = 'shadowqi-v' + NETV + '-', RAND_SLOTS = 6;
const NBIT = { left: 1, right: 2, up: 4, down: 8, lp: 16, hp: 32, lk: 64, hk: 128, brk: 256 };
const NET = { on: false, peer: null, conn: null, host: false, side: 0, delay: 4, tick: 0, cur: 0, local: {}, remote: {}, sentUpTo: -1,
  name: '', oppName: '', names: ['', ''], rtt: 0, stallT: 0, status: '', mode: null, busy: false, ck: {}, rematch: [false, false], joinTimer: null };
function netLocalMask() { // this player's buttons right now
  let m = 0; const k = c => keys.has(MAPS.p1[c]) || (ALT[c] && keys.has(ALT[c]));
  for (const c in NBIT) if (k(c)) m |= NBIT[c];
  return m;
}
class NetHuman { // turns a player's button history into the same inputs the keyboard controller produces
  constructor(side) { this.side = side; this.reset(); }
  reset() { this.held = null; this.lastP = -99; this.lastK = -199; this.tapDir = 0; this.tapT = -99; this.ffDir = 0; this.ffT = -99; this.lastTick = -1; this.lastTap = null; this.bfT = -99; this.lastJ = -99; this.lastKk = -199; }
  consume() { this.held = null; }
  consumeIf(t) { if (this.held && this.held.t === t) this.held = null; }
  read(f, frame, o) {
    const mask = t => (this.side === NET.side ? NET.local : NET.remote)[t] || 0;
    const cur = NET.cur, from = this.lastTick < 0 || cur - this.lastTick > 20 ? cur : this.lastTick + 1;
    let press = 0; for (let t = from; t <= cur; t++) press |= mask(t) & ~mask(t - 1); // presses since the last read, even during a hit pause
    this.lastTick = cur;
    const m = mask(cur), has = b => !!(m & b), pr = b => !!(press & b);
    const h = (has(NBIT.right) ? 1 : 0) - (has(NBIT.left) ? 1 : 0), toward0 = Math.sign(o.x - f.x) || f.facing;
    for (const [bit, dir] of [[NBIT.left, -1], [NBIT.right, 1]]) {
      if (!pr(bit)) continue;
      if (dir === toward0 && this.lastTap && this.lastTap.dir === -toward0 && frame - this.lastTap.t <= 16) this.bfT = frame; // ← then →
      if (this.tapDir === dir && frame - this.tapT <= 14) { this.ffDir = dir; this.ffT = frame; this.tapT = -99; } else { this.tapDir = dir; this.tapT = frame; }
      this.lastTap = { dir, t: frame };
    }
    const toward = Math.sign(o.x - f.x) || f.facing;
    const tap = this.lastTap && frame - this.lastTap.t <= 6 ? this.lastTap.dir : 0;
    const ff = this.ffDir === toward && frame - this.ffT <= 12, bb = this.ffDir === -toward && frame - this.ffT <= 18; // (← ← then → + button: a little longer to fit the → in)
    let btn = null; for (const b of BTN_ORDER) if (pr(NBIT[b])) { btn = b; break; }
    if (btn) {
      if (pr(NBIT.lp) || pr(NBIT.hp)) this.lastP = frame;
      if (pr(NBIT.lk) || pr(NBIT.hk)) this.lastK = frame;
      if (pr(NBIT.lk)) this.lastJ = frame; if (pr(NBIT.hk)) this.lastKk = frame;
      this.held = { btn, sup: Math.abs(this.lastP - this.lastK) <= 4, fuse: Math.abs(this.lastJ - this.lastKk) <= 4 && frame - this.bfT <= 20, ff, bb, t: frame };
    }
    if (pr(NBIT.brk)) this.brkT = frame;
    const hb = this.held && frame - this.held.t <= 5 ? this.held : null;
    return { held: { lp: has(NBIT.lp), hp: has(NBIT.hp), lk: has(NBIT.lk), hk: has(NBIT.hk) }, h, down: has(NBIT.down), up: has(NBIT.up), upPress: pr(NBIT.up), btn: hb ? hb.btn : null, sup: hb ? hb.sup : false, fuse: hb ? !!hb.fuse : false, ff: hb ? hb.ff : false, bb: hb ? hb.bb : false, bt: hb ? hb.t : -1,
      ffNow: this.ffDir === toward && frame - this.ffT <= 2, bbNow: this.ffDir === -toward && frame - this.ffT <= 2, tap, brk: frame - (this.brkT ?? -99) <= 6,
      dashTap: this.ffT === frame ? (this.ffDir === toward ? 1 : -1) : 0 };
  }
}
function netSend(msg) { try { if (NET.conn && NET.conn.open) NET.conn.send(msg); } catch (e) { /* the connection may be closing */ } }
function netSendInputs() { // send the last few frames again each time, in case a packet is late
  const hi = NET.tick + NET.delay, lo = Math.max(0, hi - 8), m = [];
  for (let t = lo; t <= hi; t++) m.push(NET.local[t] || 0);
  netSend({ t: 'in', mid: NET.mid, f: lo, m });
}
function netHash() { // a quick fingerprint of the game state, to notice if the two games ever drift apart
  let h = 0; for (const f of fighters) for (const v of [f.x, f.y, f.hp, f.meter, f.guard]) h = (Math.imul(h, 31) + Math.round(v * 10)) | 0;
  return h;
}
function netStep() { // one frame of an online match; false = still waiting for the opponent's buttons
  const tf = NET.tick + NET.delay;
  if (NET.local[tf] == null) { NET.local[tf] = netLocalMask(); netSendInputs(); }
  if (NET.remote[NET.tick] == null) { NET.stallT++; if (NET.stallT % 20 === 0) netSendInputs(); if (NET.stallT > 60 * 20) netEnd(L('The connection timed out.', '接続がタイムアウトしました。')); return false; }
  NET.stallT = 0; NET.cur = NET.tick;
  tick();
  if (NET.tick % 120 === 0 && game.mode === 'fight') { const h = netHash(); NET.ck[NET.tick] = h; netSend({ t: 'ck', mid: NET.mid, tick: NET.tick, h }); if (NET.host) netSend({ t: 'fix', mid: NET.mid, tick: NET.tick, s: netState() }); }
  delete NET.local[NET.tick - 30]; delete NET.remote[NET.tick - 30];
  NET.tick++;
  return true;
}
function netState() { return fighters.map(f => [f.x, f.y, f.vx, f.vy, f.hp, f.meter, f.guard, f.facing]); }
function netReceive(msg) {
  if (!msg || typeof msg !== 'object') return;
  if ((msg.t === 'in' || msg.t === 'ck' || msg.t === 'fix') && msg.mid !== NET.mid) return; // left over from the previous match
  switch (msg.t) {
    case 'hello': NET.oppName = String(msg.name || '?').slice(0, 12); NET.oppChar = CHARS[msg.char] ? msg.char : 'ninja';
      if (NET.host && !NET.on) netStartAsHost(); break;
    case 'busy': netStatus(L('That player is already in a match.', 'その相手はすでに対戦中です。')); break;
    case 'start': netBegin(msg); break;
    case 'in': for (let i = 0; i < msg.m.length; i++) if (NET.remote[msg.f + i] == null && msg.f + i >= NET.tick - 30) NET.remote[msg.f + i] = msg.m[i]; break;
    case 'ping': netSend({ t: 'pong', at: msg.at }); break;
    case 'pong': NET.rtt = performance.now() - msg.at; break;
    case 'fix': // the host's numbers win if the two games ever drift apart
      if (!NET.host && NET.ck[msg.tick] != null && NET.fixWanted) { msg.s.forEach((v, i) => { const f = fighters[i]; if (f) [f.x, f.y, f.vx, f.vy, f.hp, f.meter, f.guard, f.facing] = v; }); NET.fixWanted = false; }
      break;
    case 'ck': if (NET.ck[msg.tick] != null && NET.ck[msg.tick] !== msg.h) NET.fixWanted = true; break;
    case 'rematch': NET.rematch[1 - NET.side] = true; netTryRematch(); if (game.mode === 'result') showResult(game.lastWinner); break;
    case 'bye': netEnd(L('Your opponent left.', '相手が退出しました。')); break;
  }
}
function netStartAsHost() { // the host decides the seed and the input delay, then both games start together
  const rtt = NET.rtt || 120, delay = clamp(Math.round(rtt / 2 / STEP) + 2, 3, 10);
  const cfg = { t: 'start', mid: (NET.mid || 0) + 1, seed: (Math.random() * 4294967296) >>> 0, chars: [game.p1Char, NET.oppChar], names: [NET.name, NET.oppName], delay };
  netSend(cfg); netBegin(cfg);
}
function netBegin(cfg) {
  initAudio();
  NET.on = true; NET.side = NET.host ? 0 : 1; NET.delay = cfg.delay; NET.names = cfg.names; NET.mid = cfg.mid;
  NET.oppChar = cfg.chars[1 - NET.side]; NET.oppName = cfg.names[1 - NET.side]; game.p1Char = cfg.chars[NET.side]; NET.name = cfg.names[NET.side]; NET.tick = 0; NET.cur = 0; NET.local = {}; NET.remote = {}; NET.ck = {}; NET.stallT = 0; NET.rematch = [false, false];
  for (let t = 0; t < NET.delay; t++) { NET.local[t] = 0; NET.remote[t] = 0; }
  if (NET.peer && !NET.peer.disconnected) try { NET.peer.disconnect(); } catch (e) {} // free the room or random slot; the match connection stays open
  rngState = cfg.seed >>> 0; globalT = 0; serial = 0;
  game.demo = false; game.training = false; game.watch = false; game.online = true;
  fighters = [makeFighter(cfg.chars[0], 0, new NetHuman(0)), makeFighter(cfg.chars[1], 1, new NetHuman(1))];
  fighters.forEach((f, i) => { f.netName = cfg.names[i]; });
  if (cfg.chars[0] === cfg.chars[1]) fighters[1].alt = true; // mirror match: the right-hand player wears the second palette
  game.mode = 'fight'; game.paused = false; game.netMenu = false; game.frame = 0;
  updateTbar(); ov.hidden = true; ov.innerHTML = '';
  startRound(1);
  clearInterval(NET.pingT); NET.pingT = setInterval(() => netSend({ t: 'ping', at: performance.now() }), 2000);
}
function netAskRematch() { // this player wants a rematch; the match starts once both do
  if (game.mode !== 'result' || NET.rematch[NET.side]) return;
  NET.rematch[NET.side] = true; netSend({ t: 'rematch' }); netTryRematch();
  if (game.mode === 'result') showResult(game.lastWinner); // still waiting for the other player (if it started, the result panel is gone)
}
function netTryRematch() { if (NET.host && NET.rematch[0] && NET.rematch[1]) { NET.on = false; netStartAsHost(); } }
function netEnd(msg) { // leave online play and go back to the title screen
  const wasOn = NET.on || NET.conn;
  NET.on = false; game.online = false; clearInterval(NET.pingT); clearTimeout(NET.joinTimer);
  try { if (NET.conn) NET.conn.close(); } catch (e) {}
  try { if (NET.peer) NET.peer.destroy(); } catch (e) {}
  NET.conn = null; NET.peer = null; NET.mode = null;
  if (wasOn && msg) { showMenu(); showOnline(msg); } else if (msg) netStatus(msg);
}
function netStatus(t) { NET.status = t; const el = document.getElementById('netStatus'); if (el) el.textContent = t; }
function loadPeer() { // PeerJS (WebRTC helper) is loaded only when online play is opened
  return new Promise((res, rej) => {
    if (window.Peer) return res();
    const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js';
    sc.onload = () => res(); sc.onerror = () => rej(new Error('peerjs')); document.head.appendChild(sc);
  });
}
const PEER_OPTS = { config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478' }] } };
function netWire(conn) { // a connected opponent: say hello, listen for messages
  NET.conn = conn;
  conn.on('data', netReceive);
  conn.on('close', () => { if (NET.conn === conn) netEnd(L('The connection was closed.', '接続が切れました。')); });
  const hello = () => { netSend({ t: 'hello', name: NET.name, char: game.p1Char, v: NETV }); netSend({ t: 'ping', at: performance.now() }); };
  if (conn.open) hello(); else conn.on('open', hello);
}
function hostAs(id) { // try to take this id and wait for someone to connect; resolves false if the id is taken
  return new Promise(res => {
    const peer = new Peer(id, PEER_OPTS);
    let done = false;
    peer.on('open', () => { if (done) return; done = true; NET.peer = peer; NET.host = true; res(true); });
    peer.on('error', e => { if (!done) { done = true; try { peer.destroy(); } catch (x) {} res(false); } else if (e.type !== 'peer-unavailable') netStatus(L('Connection problem: ', '接続エラー：') + e.type); });
    peer.on('connection', c => {
      if (NET.conn) { c.on('open', () => { c.send({ t: 'busy' }); setTimeout(() => c.close(), 300); }); return; }
      clearTimeout(NET.joinTimer); netStatus(L('Opponent found! Starting…', '相手が見つかりました！開始します…')); netWire(c);
    });
  });
}
function joinId(id, guestPeer) { // try to connect to a host; resolves true once connected
  return new Promise(res => {
    let done = false;
    const fin = v => { if (!done) { done = true; guestPeer.off && guestPeer.off('error', onErr); res(v); } };
    const onErr = e => { if (e.type === 'peer-unavailable') fin(false); };
    guestPeer.on('error', onErr);
    const c = guestPeer.connect(id, { reliable: true });
    c.on('open', () => { NET.host = false; netWire(c); fin(true); });
    c.on('data', d => { if (d && d.t === 'busy') { try { c.close(); } catch (e) {} if (NET.conn === c) NET.conn = null; } });
    setTimeout(() => fin(false), 5000);
  });
}
function newGuestPeer() { return new Promise((res, rej) => { const p = new Peer(PEER_OPTS); p.on('open', () => res(p)); p.on('error', e => rej(e)); }); }
async function netRandom() { // random match: join someone waiting, or wait in a free slot yourself
  NET.mode = 'random'; netStatus(L('Looking for an opponent…', '対戦相手を探しています…'));
  try {
    await loadPeer();
    const guest = await newGuestPeer(); NET.peer = guest;
    for (let k = 0; k < RAND_SLOTS && NET.mode === 'random'; k++) if (await joinId(NET_PREFIX + 'rand-' + k, guest)) return netStatus(L('Opponent found! Starting…', '相手が見つかりました！開始します…'));
    if (NET.mode !== 'random') return;
    guest.destroy(); NET.peer = null;
    for (let k = 0; k < RAND_SLOTS && NET.mode === 'random'; k++) {
      if (await hostAs(NET_PREFIX + 'rand-' + k)) {
        netStatus(L('Waiting for an opponent… (share the page with a friend!)', '対戦相手を待っています…（友だちにページを共有しよう！）'));
        const myK = k, retry = async () => { // meanwhile, check now and then whether someone is waiting in an earlier slot
          if (NET.conn || NET.mode !== 'random' || myK === 0) return;
          try { const g2 = await newGuestPeer(); for (let j = 0; j < myK && !NET.conn; j++) if (await joinId(NET_PREFIX + 'rand-' + j, g2)) { const old = NET.peer; NET.peer = g2; try { old.destroy(); } catch (e) {} return; } g2.destroy(); } catch (e) {}
          NET.joinTimer = setTimeout(retry, 5000 + Math.random() * 3000);
        };
        NET.joinTimer = setTimeout(retry, 4000 + Math.random() * 3000);
        return;
      }
    }
    netStatus(L('All match slots are busy. Try again in a moment.', '空きがありません。少し待ってからもう一度。'));
  } catch (e) { netStatus(L('Could not reach the matchmaking server.', 'マッチングサーバーに接続できませんでした。')); }
}
async function netCreateRoom(code) {
  NET.mode = 'room'; netStatus(L('Creating room ' + code + '…', 'ルーム ' + code + ' を作成中…'));
  try {
    await loadPeer();
    if (await hostAs(NET_PREFIX + 'room-' + code)) netStatus(L('Room ' + code + ' is open. Waiting for your opponent to join…', 'ルーム ' + code + ' を作成しました。相手の参加を待っています…'));
    else netStatus(L('Room ' + code + ' is already in use. Pick another number.', 'ルーム ' + code + ' は使用中です。別の番号にしてください。'));
  } catch (e) { netStatus(L('Could not reach the matchmaking server.', 'マッチングサーバーに接続できませんでした。')); }
}
async function netJoinRoom(code) {
  NET.mode = 'room'; netStatus(L('Joining room ' + code + '…', 'ルーム ' + code + ' に参加中…'));
  try {
    await loadPeer();
    const guest = await newGuestPeer(); NET.peer = guest;
    if (!(await joinId(NET_PREFIX + 'room-' + code, guest))) netStatus(L('Room ' + code + ' was not found.', 'ルーム ' + code + ' が見つかりません。'));
    else netStatus(L('Connected! Starting…', '接続しました！開始します…'));
  } catch (e) { netStatus(L('Could not reach the matchmaking server.', 'マッチングサーバーに接続できませんでした。')); }
}
function showOnline(msg) { // the online lobby: username first, then random match or a room number
  game.mode = 'online'; ov.hidden = false;
  const saved = (() => { try { return localStorage.getItem('sq-name') || ''; } catch (e) { return ''; } })();
  const c = game.p1Char;
  ov.innerHTML = `<div class="panel">
    <div class="logo sm">${L('ONLINE BATTLE', 'オンライン対戦')}</div>
    <div class="lbl">${L('Username (required)', 'ユーザー名（必須）')}</div>
    <input id="netName" class="netin" maxlength="12" autocomplete="nickname" placeholder="${L('Your name', 'あなたの名前')}" value="${saved.replace(/"/g, '')}">
    <div class="vsrow">${L('Your fighter:', '使用キャラ：')} ${CHAR_ORDER.map(k => `<button class="${k === c ? 'on' : ''}" data-netchar="${k}" aria-pressed="${k === c}">${nm(CHARS[k])}</button>`).join('')}</div>
    <div class="row"><button class="go" data-net="random">${L('Random match', 'ランダムマッチ')}</button></div>
    <div class="row"><input id="netRoom" class="netin room" inputmode="numeric" maxlength="6" placeholder="${L('Room no.', 'ルーム番号')}"><button class="ghost" data-net="create">${L('Create room', 'ルーム作成')}</button><button class="ghost" data-net="join">${L('Join room', 'ルームに参加')}</button></div>
    <div class="hint" id="netStatus" role="status">${msg || L('Enter a username, then find a random opponent or use a room number to play a friend.', 'ユーザー名を入力して、ランダムマッチか、ルーム番号で友だちと対戦。')}</div>
    <div class="row"><button class="ghost" data-net="back">${L('Back', '戻る')}</button></div>
  </div>`;
  const nameOk = () => { const v = document.getElementById('netName').value.trim(); if (!v) { netStatus(L('Please enter your username first.', '先にユーザー名を入力してください。')); document.getElementById('netName').focus(); return false; }
    NET.name = v.slice(0, 12); try { localStorage.setItem('sq-name', NET.name); } catch (e) {} return true; };
  ov.querySelectorAll('[data-netchar]').forEach(b => b.addEventListener('click', () => { game.p1Char = b.dataset.netchar; const v = document.getElementById('netName').value; showOnline(NET.status); document.getElementById('netName').value = v; }));
  ov.querySelectorAll('[data-net]').forEach(b => b.addEventListener('click', () => {
    initAudio(); const a = b.dataset.net;
    if (a === 'back') { netEnd(); showMenu(); return; }
    if (!nameOk()) return;
    if (NET.mode) { netEnd(); }
    const code = (document.getElementById('netRoom').value || '').replace(/\D/g, '').slice(0, 6);
    if (a === 'random') netRandom();
    else if (a === 'create') { const cc = code || String(1000 + Math.floor(Math.random() * 9000)); document.getElementById('netRoom').value = cc; netCreateRoom(cc); }
    else if (a === 'join') { if (!code) return netStatus(L('Enter the room number to join.', '参加するルーム番号を入力してください。')); netJoinRoom(code); }
  }));
}

