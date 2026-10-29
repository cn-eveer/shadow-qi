'use strict';
/* ================= menus & keyboard ================= */
function bindOverlay() {
  ov.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    initAudio();
    const d = btn.dataset;
    if (d.diff) { setDiff(d.diff); sfx('select'); return; }
    if (d.char) { game.p1Char = d.char; sfx('select'); showMenu(); }
    if (d.vs) { game.p2Char = d.vs; sfx('select'); showMenu(); }
    else if (d.act === 'start') startMatch(false, false);
    else if (d.act === 'online') showOnline();
    else if (d.act === 'opening') startOpening();
    else if (d.act === 'moves') { drawerTab = game.p1Char; openDrawer(true, 'moves'); } // the selected fighter's full move list
    else if (d.act === 'skipop') { initAudio(); try { localStorage.setItem('sq-opening', '1'); } catch (x) {} showMenu(); }
    else if (d.act === 'rematch') startMatch(false, game.watch);
    else if (d.act === 'watch') startMatch(false, true);
    else if (d.act === 'demo') { if (d.who) game.p1Char = d.who; game.demoSet = 'combos'; startMatch(true, false, true); }
    else if (d.act === 'punish') { if (d.who) game.p1Char = d.who; game.demoSet = 'punish'; startMatch(true, false, true); }
    else if (d.act === 'training') startMatch(true);
    else if (d.act === 'menu') showMenu();
    else if (d.act === 'resume') togglePause(false);
    else if (d.act === 'restart') startMatch(game.training && !game.demo, game.watch, game.demo);
    else if (d.act === 'moves') { drawerTab = game.demo ? game.p1Char : (fighters[0] ? fighters[0].key : 'ctl'); openDrawer(true, 'moves'); }
    else if (d.act === 'sound') { toggleSound(); refreshPause(); }
    else if (d.act === 'music') { toggleMusic(); refreshPause(); }
    else if (d.act === 'lang') setLang(game.lang === 'ja' ? 'en' : 'ja'); // (redraws the menu or pause screen in the new language)
    else if (d.act === 'settings') openDrawer(true, 'settings');
    else if (d.act === 'news') openDrawer(true, 'news');
    else if (d.act === 'netLeave') { netSend({ t: 'bye' }); netEnd(); showMenu(); }
    else if (d.act === 'netBack') netMenu(false);
  }));
}
const tbar = document.getElementById('tbar');
const dbar = document.getElementById('dbar');
dbar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { initAudio(); demoAction(b.dataset.d); b.blur(); }));
// "Watch sample combos" buttons on the fighter cards: start that fighter's sample combos and bring the game into view
document.querySelectorAll('[data-watch]').forEach(b => b.addEventListener('click', () => {
  initAudio(); openDrawer(false); game.p1Char = b.dataset.watch; startMatch(true, false, true); b.blur();
  const st = document.querySelector('.stage'); if (st) st.scrollIntoView({ behavior: 'smooth', block: 'center' });
}));
function updateTbar() {
  dbar.hidden = !(game.mode === 'fight' && game.demo);
  tbar.hidden = !(game.mode === 'fight' && game.training && !game.demo);
  tbar.querySelector('[data-t="dummy"]').textContent = L(`Dummy: ${DUMMY_LABEL[game.dummyMode]} (T)`, `ダミー：${DUMMY_LABEL[game.dummyMode]} (T)`);
  tbar.querySelector('[data-t="mp"]').textContent = L(`MP refill: ${game.mpFull ? 'on' : 'off'} (M)`, `MP回復：${game.mpFull ? 'オン' : 'オフ'} (M)`);
  tbar.querySelector('[data-t="reset"]').textContent = L('Reset to start position (R)', '初期位置に戻す (R)');
  const lb = tbar.querySelector('[data-t="list"]'); lb.textContent = L(`Moves: ${game.moveList ? 'on' : 'off'} (L)`, `技表：${game.moveList ? 'オン' : 'オフ'} (L)`); lb.setAttribute('aria-pressed', String(!!game.moveList));
  const dl = game.demoSet === 'punish' ? { prev: ['Previous punish (A)', '前の反撃 (A)'], replay: ['Replay (R)', 'もう一度 (R)'], next: ['Next punish (D)', '次の反撃 (D)'], switch: ['Switch fighter (F)', 'キャラ切替 (F)'] }
    : { prev: ['Previous combo (A)', '前のコンボ (A)'], replay: ['Replay (R)', 'もう一度 (R)'], next: ['Next combo (D)', '次のコンボ (D)'], switch: ['Switch fighter (F)', 'キャラ切替 (F)'] };
  dbar.querySelectorAll('button').forEach(b => { const t = dl[b.dataset.d]; if (t) b.textContent = L(t[0], t[1]); });
  if (IS_MOBILE) [...tbar.children, ...dbar.children].forEach(b => { if (b.tagName === 'BUTTON') b.textContent = b.textContent.replace(/ \([A-Z]\)$/, ''); }); // no keyboard on a phone
}
function trainingAction(t) {
  if (t === 'dummy') game.dummyMode = DUMMY_MODES[(DUMMY_MODES.indexOf(game.dummyMode) + 1) % DUMMY_MODES.length];
  else if (t === 'mp') game.mpFull = !game.mpFull;
  else if (t === 'reset') resetPositions();
  else if (t === 'list') game.moveList = !game.moveList;
  sfx('select'); updateTbar();
}
tbar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { initAudio(); trainingAction(b.dataset.t); b.blur(); }));
// punish training, in the 技表's 相手 tab: ▶ beside one of the dummy's own commands and it does it again and again, every 1–4 s (■ stops it)
// (the list: the basic attacks and strings, then every command in its move list that can be done on the ground)
const REP_EVERY = [1, 1.5, 2, 3, 4], REP_BTN = { U: 'lp', I: 'hp', J: 'lk', K: 'hk' };
const REP_BASICS = ['U', 'I', 'J', 'K', '↓ + U', '↓ + I', '↓ + J', '↓ + K', 'U, U', 'U, U, I', 'U, U, K', 'U, U, U, U, K', 'J, J, K', 'J, K'];
let repCh = '', repId = 0, repMoves = [];
function repInput(tok) { // one command → its input (null: not one this can do)
  const m = tok.replace(/ \/ .*$/, '').trim().match(/^(→ → \+ |← ← \+ |↓ \+ |→ → then ↓ \+ |← ← then ↓ \+ )?([UIJK])$/); if (!m) return null;
  const p = m[1] || '', inp = { btn: REP_BTN[m[2]] }; if (p.startsWith('→ →')) inp.ff = true; if (p.startsWith('← ←')) inp.bb = true; if (p.includes('↓')) inp.down = true;
  return inp;
}
function repSteps(cmd) { // a command → the presses that do it (as the sample combos play them)
  cmd = cmd.replace(/（長押し）/, ' (hold)').replace(/\s+/g, ' ').trim();
  if (/^(U \+ J|Punch \+ Kick)$/.test(cmd)) return { steps: [S(cmd, 'start', { btn: 'lp', sup: true })], sup: true };
  const hold = /\(hold\)/.test(cmd); cmd = cmd.replace(/ ?\(hold\)/, '');
  const [first, then] = cmd.split(/, then /);
  if (then) { const a = repInput(first), b = repInput(then); return a && b ? { steps: [S(first, 'start', a), S(then, 'follow', b)] } : null; }
  const one = repInput(cmd); if (one) { if (hold) one.holdFor = 60; return { steps: [S(cmd, 'start', one)] }; }
  const keys = cmd.split(/,? /); if (keys.length > 1 && keys.every(k => REP_BTN[k])) return { steps: keys.map((k, i) => S(k, i ? 'chain' : 'start', { btn: REP_BTN[k] })) };
  return null;
}
function repList(ch) {
  const rows = lang => [...document.querySelectorAll(`article.card[data-tab="${ch}"][data-lang="${lang}"] .scroll:not(.combo) tbody tr`)];
  const en = rows('en'), loc = rows(game.lang), same = en.length === loc.length, out = [];
  const nameOf = td => [...td.childNodes].filter(n => !(n.nodeType === 1 && n.tagName === 'SMALL')).map(n => n.textContent).join('').trim();
  for (const c of REP_BASICS) { const r = repSteps(c); if (r) out.push({ label: c, ...r }); }
  let parent = null, juggle = false;
  en.forEach((tr, i) => {
    const td = tr.querySelectorAll('td'); if (td.length < 2) { juggle = /juggle/i.test(tr.textContent); return; } // (a heading row: Hohen's juggle-only moves follow)
    if (td[0].querySelector('b')) juggle = false;
    const last = td[td.length - 1], kb = [...last.querySelectorAll('kbd')].map(k => k.textContent.trim()), name = nameOf((same ? loc[i] : tr).querySelector('td'));
    let cmd = last.textContent.replace(/\s+/g, ' ').trim();
    if (kb.length > 1 && kb.every(k => k === kb[0])) cmd = kb.join(', '); else if (kb.length === 2 && cmd.includes('+')) cmd = 'U + J';
    if (/^then /.test(cmd) && parent) cmd = parent + ', ' + cmd; else parent = cmd; // (a follow-up: the move it comes out of, then its button)
    if (juggle || name.startsWith('·')) return; // (juggle-only, or only in Hohen's armour)
    const alt = cmd.match(/^(.*, then )([UIJK](?: \/ [UIJK])+)$/); // (a choice of follow-ups: one entry each)
    const cmds = alt ? alt[2].split(' / ').map(k => alt[1] + k) : kb.length > 1 && !kb.every(k => k === kb[0]) && !cmd.includes('+') ? kb : [cmd]; // (one row, two buttons: two moves)
    for (const c of cmds) { const r = repSteps(c); if (!r) continue; const had = out.find(m => m.label === c); if (had) had.name = had.name || name; else out.push({ label: c, name, ...r }); }
  });
  return out;
}
function repMovesFor(ch) { // (built once per fighter and language; keeps the chosen command when it can)
  if (ch + game.lang !== repCh) { repCh = ch + game.lang; const was = game.repeat && game.repeat.label; repMoves = repList(ch); game.repIdx = Math.max(0, repMoves.findIndex(m => m.label === was)); if (game.repeatOn) setRepeat(); }
  return repMoves;
}
function setRepeat() {
  const m = repMoves[game.repIdx || 0]; game.repEvery = game.repEvery || 1.5;
  game.repeat = game.repeatOn && m ? { id: ++repId, label: m.label, steps: m.steps, sup: !!m.sup, every: Math.round(game.repEvery * 60), reach: 120 } : null;
}
function toggleRepeat() { game.repeatOn = !game.repeatOn; setRepeat(); sfx('select'); updateMoveList(); }
function stepEvery(d) { const i = REP_EVERY.indexOf(game.repEvery || 1.5); game.repEvery = REP_EVERY[clamp(i + d, 0, REP_EVERY.length - 1)]; setRepeat(); sfx('select'); updateMoveList(); }
function showMenu() {
  game.mode = 'menu'; game.paused = false; game.netMenu = false; tbar.hidden = true; dbar.hidden = true;
  const c = game.p1Char;
  // (the CPU can be the same fighter: a mirror match, the CPU in the second palette and its effects in another hue)
  const blurbs = {}; // each fighter's explanation, shown in full for the one you've picked
  const pick = (k, blurb, ja) => { blurbs[k] = L(blurb, ja); return `<button class="pick ${k} ${c === k ? 'on' : ''}" data-char="${k}" aria-pressed="${c === k}"><b>${nm(CHARS[k])}</b><small>${L(CHARS[k].title, CHARS[k].titleJa)}</small></button>`; };
  ov.hidden = false;
  ov.innerHTML = `${IS_MOBILE ? `<div class="mtop"><button class="ghost sm" data-act="lang" lang="${game.lang === 'ja' ? 'en' : 'ja'}">${game.lang === 'ja' ? 'English' : '日本語'}</button><button class="ghost sm" data-act="settings">${L('⚙ Settings', '⚙ 設定')}</button></div>` : ''}<div class="panel menu">
    <div class="logo">SHADOW <span class="x">✕</span> QI</div>
    <div class="lbl">${L('Pick your fighter.', 'キャラクターを選んでください')}</div>
    <div class="picks">
      ${pick('ninja', 'Shadow Ninja. Clones, a sword, fire and lightning.', '影の忍者。分身、刀、炎と雷。')}
      ${pick('brawler', 'Qi Brawler. Heavy fists and qi blasts.', '気の拳士。重い拳と気功弾。')}
      ${pick('staff', 'Staff Prodigy. Long staff, high jumps, air attacks.', '棍の天才。長い棍、高いジャンプ、空中からの攻撃。')}
      ${pick('psychic', 'Psychic Sage. Rune circles, crystals of light, and orbs that fight beside her.', '超能力の賢者。魔法陣、光の水晶、ともに戦うオーブ。')}
      ${pick('paladin', 'Holy Paladin. Slow and sturdy: parries, healing, charged strikes and the Aegis.', '聖騎士。重く頑丈：受け流し、回復、溜め攻撃、イージス。')}
      ${pick('kappa', 'Mythic Kappa. Cute, with a dish on his head: claws, water, plate throws and sumo throws.', '幻獣カッパ。頭に皿の可愛いカッパ：爪、水、皿投げ、相撲の投げ。')}
      ${pick('gunman', 'Gunslinger. Two revolvers and a long coat: mid-range shots, jump shots, no kicks.', 'ガンマン。二丁拳銃とロングコート：中距離の射撃、ジャンプショット、足技なし。')}
      ${pick('salary', 'Salaryman. An angel and a devil ride his shoulders, and either can take him over.', 'サラリーマン。両肩の天使と悪魔、どちらかに憑依されて戦う。')}
      ${pick('alchemist', 'Golem Doctor. U and I: his stone golem’s blows. J and K: his own stone-knuckle and glowing stones. Strung together, they fight as one.', 'ゴーレム博士。U・Iは石のゴーレムの攻撃、J・Kは博士自身の石拳と光る石。つなげて二人で一つの戦い方。')}
    </div>
    <div class="pickinfo"><span><b>${nm(CHARS[c])}</b> ${blurbs[c]}</span><button class="ghost sm" data-act="moves">${L('Move list', '技表')}</button></div>
    <div class="vsrow">${L('CPU opponent:', 'CPUの相手：')} ${CHAR_ORDER.map(k => `<button class="${game.p2Char === k ? 'on' : ''}" data-vs="${k}" aria-pressed="${game.p2Char === k}">${nm(CHARS[k])}</button>`).join('')}</div>
    <div class="vsrow">${L('Difficulty:', '難易度：')} ${DIFF_ORDER.map(k => `<button class="${game.diff === k ? 'on' : ''}" data-diff="${k}" aria-pressed="${game.diff === k}">${L(...DIFF_NAMES[k])}</button>`).join('')}</div>
    <div class="row"><button class="go" data-act="start">${L('FIGHT', '対戦')}</button><button class="ghost" data-act="training">${L('Training', 'トレーニング')}</button><button class="ghost" data-act="watch">${L('CPU vs CPU', 'CPU対CPU')}</button><button class="ghost" data-act="opening">${L('Opening', 'オープニング')}</button>${COMBO_SET[c] && COMBO_SET[c].length ? `<button class="ghost" data-act="demo" data-who="${c}">${L(CHARS[c].name[0] + CHARS[c].name.slice(1).toLowerCase() + ' combos', nm(CHARS[c]) + 'のコンボ見本')}</button>` : ''}${PUNISH_SET[c] && PUNISH_SET[c].length ? `<button class="ghost" data-act="punish" data-who="${c}">${L(CHARS[c].name[0] + CHARS[c].name.slice(1).toLowerCase() + ' punishes', nm(CHARS[c]) + 'の反撃見本')}</button>` : ''}</div>
    <div class="row onrow"><button class="ghost" data-act="online">${L('Online battle', 'オンライン対戦')}</button><span class="oncount" data-oncount></span></div>
    <div class="hint">${L('A and D pick your fighter, W and S pick the opponent. Enter to fight, T for training, C to watch CPU vs CPU, V for your fighter’s sample combos, P for punish samples.', 'A・Dでキャラ選択、W・Sで相手を選択。Enterで対戦、Tでトレーニング、CでCPU対CPU、Vでコンボ見本、Pで反撃見本。')}</div>
    <div class="ver"><button class="vlink" data-act="news">v${APP_VERSION} · ${L('What’s new', '更新情報')}</button></div>
  </div>`;
  bindOverlay(); netShowCount(); netCountSoon();
}
function showResult(w) {
  game.lastWinner = w;
  const who = w ? (game.watch ? 'CPU ' + (w.side + 1) + ' takes' : w.side === 0 ? 'You take' : 'The CPU takes') : '';
  const whoJa = w ? (game.watch ? 'CPU ' + (w.side + 1) : w.side === 0 ? 'あなた' : 'CPU') : '';
  if (NET.on || game.online) { // online: show both names; rematch when both players ask for it
    const mine = NET.rematch[NET.side], theirs = NET.rematch[1 - NET.side];
    ov.hidden = false;
    ov.innerHTML = `<div class="panel">
      <div class="logo sm">${w ? (w.netName || nm(w.ch)) + L(' WINS', 'の勝利') : L('DRAW GAME', '引き分け')}</div>
      <p class="sub">${w ? (w.side === NET.side ? L('You win!', 'あなたの勝ち！') : L('You lose.', 'あなたの負け。')) : ''} ${theirs ? L('Your opponent wants a rematch.', '相手が再戦を希望しています。') : ''}</p>
      <div class="row"><button class="go" data-act="netRematch" ${mine ? 'disabled' : ''}>${mine ? L('Waiting…', '待機中…') : L('REMATCH', '再戦')}</button><button class="ghost" data-act="netLeave">${L('Leave', '退出')}</button></div>
    </div>`;
    ov.querySelector('[data-act=netRematch]').addEventListener('click', netAskRematch);
    ov.querySelector('[data-act=netLeave]').addEventListener('click', () => { netSend({ t: 'bye' }); netEnd(); showMenu(); });
    return;
  }
  ov.hidden = false;
  ov.innerHTML = `<div class="panel">
    <div class="logo sm">${w ? L(w.ch.name + ' WINS', nm(w.ch) + 'の勝利') : L('DRAW GAME', '引き分け')}</div>
    <p class="sub">${w ? L(`${who} the match as the ${w.ch.title}.`, `${whoJa}（${w.ch.titleJa}）の勝ち。`) : L('Nobody takes the match.', '勝者なし。')}</p>
    <div class="row"><button class="go" data-act="rematch">${L('REMATCH', '再戦')}</button><button class="ghost" data-act="menu">${L('Change fighters', 'キャラ変更')}</button></div>
    <div class="hint">${L('Enter for a rematch, Esc for the menu.', 'Enterで再戦、Escでメニュー。')}</div>
  </div>`;
  bindOverlay();
}
function pauseMenuHTML() {
  const on = (v, en, ja) => L(en + (v ? ': on' : ': off'), ja + (v ? '：オン' : '：オフ'));
  return `<div class="panel">
      <div class="logo sm">${L('PAUSED', '一時停止')}</div>
      <div class="pmenu">
        <button class="go" data-act="resume">${L('RESUME', '再開')}</button>
        <button class="ghost" data-act="restart">${game.demo ? (game.demoSet === 'punish' ? L('Restart punishes', '反撃見本を最初から') : L('Restart combos', 'コンボを最初から')) : game.training ? L('Restart training', 'トレーニングをやり直す') : L('Restart match', '試合をやり直す')}</button>
        <button class="ghost" data-act="moves">${L('Move list', '技表')}</button>
        <div class="pmrow"><button class="ghost" data-act="sound">${on(sound, 'Sound', 'サウンド')}</button><button class="ghost" data-act="music">${on(music, 'Music', 'BGM')}</button><button class="ghost" data-act="lang" lang="${game.lang === 'ja' ? 'en' : 'ja'}">${game.lang === 'ja' ? 'English' : '日本語'}</button></div>
        <button class="ghost" data-act="menu">${L('Quit to menu', 'メニューへ')}</button>
      </div>
      <div class="hint">${game.training ? L('T changes the dummy, M turns MP refill on or off, R resets positions. ', 'Tでダミー切替、MでMP回復のオン・オフ、Rで位置リセット。') : ''}${L('↑ ↓ to choose, Enter to select, Esc to resume.', '↑↓で選択、Enterで決定、Escで再開。')}</div>
    </div>`;
}
function refreshPause() { // redraw the pause menu (after a language or sound change) keeping the focused button
  if (!game.paused) return;
  const act = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.act : 'resume';
  ov.innerHTML = pauseMenuHTML(); bindOverlay();
  const b = ov.querySelector(`[data-act="${act}"]`) || ov.querySelector('[data-act=resume]'); if (b) b.focus();
}
function togglePause(v) {
  if (game.mode !== 'fight') return;
  game.paused = v === undefined ? !game.paused : v;
  keys.clear();
  if (game.paused) {
    ov.hidden = false; ov.innerHTML = pauseMenuHTML(); bindOverlay();
    ov.querySelector('[data-act=resume]').focus();
    sfx('select');
  } else { ov.hidden = true; ov.innerHTML = ''; game.netMenu = false; }
}
function netMenu(open) { // online: the match can't stop (both games run in lockstep), so this menu shows over it
  game.netMenu = open;
  if (!open) { ov.hidden = true; ov.innerHTML = ''; return; }
  ov.hidden = false;
  ov.innerHTML = `<div class="panel">
      <div class="logo sm">${L('MENU', 'メニュー')}</div>
      <p class="sub">${L('Online matches keep running while this is open.', 'オンライン対戦は停止しません。')}</p>
      <div class="pmenu">
        <button class="go" data-act="netBack">${L('BACK TO FIGHT', '対戦に戻る')}</button>
        <button class="ghost" data-act="netLeave">${L('Leave the match', '対戦を退出')}</button>
      </div>
      <div class="hint">${L('Esc to go back.', 'Escで戻る。')}</div>
    </div>`;
  bindOverlay();
  ov.querySelector('[data-act=netBack]').focus();
}
function menuMove(d) { // arrow keys step through the buttons of an open menu
  const bs = [...ov.querySelectorAll('button:not([disabled])')];
  if (!bs.length) return;
  const i = bs.indexOf(document.activeElement);
  bs[i < 0 ? 0 : (i + d + bs.length) % bs.length].focus();
}
window.addEventListener('keydown', e => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return; // typing a name or room number
  if (game.mode === 'fight' && !game.paused && GAME_KEYS.has(e.code)) e.preventDefault();
  keys.add(e.code);
  if (e.repeat) return;
  pressed.add(e.code); pressT[e.code] = globalT;
  if (game.mode === 'opening') { e.preventDefault(); if (OP.soundAsked) { OP.soundAsked = false; initAudio(); return; } skipOpening(); return; } // (the first press only turns the sound on)
  if (game.mode === 'splash') { e.preventDefault(); startOpening(); return; }
  if (e.code === 'Escape' && !drawer.hidden && game.mode !== 'fight') { openDrawer(false); return; }
  if (game.mode === 'menu') {
    const cyc = (k, d, skip) => { const L = CHAR_ORDER.filter(x => x !== skip); return L[(L.indexOf(k) + d + L.length) % L.length]; };
    if (['KeyA','KeyD','ArrowLeft','ArrowRight'].includes(e.code)) { game.p1Char = cyc(game.p1Char, e.code === 'KeyA' || e.code === 'ArrowLeft' ? -1 : 1); sfx('select'); showMenu(); }
    else if (['KeyW','KeyS','ArrowUp','ArrowDown'].includes(e.code)) { e.preventDefault(); game.p2Char = cyc(game.p2Char, e.code === 'KeyW' || e.code === 'ArrowUp' ? -1 : 1); sfx('select'); showMenu(); }
    else if (e.code === 'Enter') { e.preventDefault(); startMatch(false, false); }
    else if (e.code === 'KeyT') startMatch(true);
    else if (e.code === 'KeyC') startMatch(false, true);
    else if (e.code === 'KeyV' && COMBO_SET[game.p1Char].length) { game.demoSet = 'combos'; startMatch(true, false, true); }
    else if (e.code === 'KeyP' && PUNISH_SET[game.p1Char].length) { game.demoSet = 'punish'; startMatch(true, false, true); }
  } else if (game.mode === 'result') {
    if (game.online) { // online: Enter asks for a rematch, Esc leaves
      if (e.code === 'Enter') { e.preventDefault(); netAskRematch(); }
      else if (e.code === 'Escape') { netSend({ t: 'bye' }); netEnd(); showMenu(); }
    }
    else if (e.code === 'Enter') { e.preventDefault(); startMatch(false, game.watch); }
    else if (e.code === 'Escape') showMenu();
  } else if (game.mode === 'fight') {
    const menuOpen = game.paused || game.netMenu;
    if (e.code === 'Escape') { e.preventDefault(); if (!drawer.hidden) openDrawer(false); else if (NET.on) netMenu(!game.netMenu); else togglePause(); }
    else if (menuOpen && ['ArrowUp', 'ArrowDown', 'KeyW', 'KeyS', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) { e.preventDefault(); menuMove(e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'ArrowLeft' || (e.code === 'Tab' && e.shiftKey) ? -1 : 1); }
    else if (e.code === 'Enter') { e.preventDefault(); if (menuOpen) { const b = ov.contains(document.activeElement) && document.activeElement.tagName === 'BUTTON' ? document.activeElement : ov.querySelector('.go'); if (b) b.click(); } else if (!NET.on) togglePause(); }
    else if (game.demo && !game.paused) {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') demoAction('prev');
      else if (e.code === 'KeyD' || e.code === 'ArrowRight') demoAction('next');
      else if (e.code === 'KeyR') demoAction('replay');
      else if (e.code === 'KeyF') demoAction('switch');
    }
    else if (game.training && !game.paused) {
      if (e.code === 'KeyT') trainingAction('dummy');
      else if (e.code === 'KeyM') trainingAction('mp');
      else if (e.code === 'KeyR') trainingAction('reset');
      else if (e.code === 'KeyL') trainingAction('list');
      else if (e.code === 'KeyC' && game.moveList) stepTab(); // (the 技表's tabs)
      else if (e.code === 'Comma' && game.moveList) stepMoveList(-1);
      else if (e.code === 'Period' && game.moveList) stepMoveList(1);
      else if (e.code === 'KeyB' && game.moveList && game.listTab === 'opp') toggleRepeat(); // punish training: the dummy does it again and again…
      else if ((e.code === 'Minus' || e.code === 'Equal') && game.moveList && game.listTab === 'opp') stepEvery(e.code === 'Minus' ? -1 : 1); // …this often
    }
  }
});
window.addEventListener('keyup', e => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());
const sndBtn = document.getElementById('snd'), bgmBtn = document.getElementById('bgm'), langBtn = document.getElementById('lang'), setBtn = document.getElementById('setBtn');
const drawer = document.getElementById('drawer');
let drawerTab = 'ctl', drawerMode = 'settings'; // the drawer shows either the settings or the move list
function toggleSound() { sound = !sound; initAudio(); if (!sound) musicStop(); else if (music) musicStart(); applyLang(); }
function toggleMusic() { music = !music; initAudio(); if (music && sound) musicStart(); else musicStop(); applyLang(); }
function setLang(l) { game.lang = l; try { localStorage.setItem('sq-lang', l); } catch (e) {} applyLang(); if (game.mode === 'menu') showMenu(); else if (game.mode === 'result') showResult(game.lastWinner); else if (game.paused) refreshPause(); else if (game.netMenu) netMenu(true); updateTbar(); }
function toggleHeights() { game.heights = !game.heights; try { localStorage.setItem('sq-heights', game.heights ? '1' : '0'); } catch (e) {} if (!game.heights) parts.forEach(q => { if (q.type === 'htag') q.life = 0; }); applyLang(); }
function toggleAutoGuard() { game.autoGuard = !game.autoGuard; try { localStorage.setItem('sq-autoguard', game.autoGuard ? '1' : '0'); } catch (e) {} applyLang(); }
function setDiff(k) { game.diff = k; try { localStorage.setItem('sq-diff', k); } catch (e) {} applyLang(); if (game.mode === 'menu') showMenu(); }
function applyLang() { // header, drawer, tabs and which language of the command lists shows
  if (document.documentElement) document.documentElement.lang = game.lang;
  const on = (v, en, ja) => L(en + (v ? ' on' : ' off'), ja + (v ? ' オン' : ' オフ'));
  [sndBtn, document.getElementById('sndD')].forEach(b => { b.textContent = on(sound, 'Sound', 'サウンド'); b.setAttribute('aria-pressed', String(sound)); });
  [bgmBtn, document.getElementById('bgmD')].forEach(b => { b.textContent = on(music, 'Music', 'BGM'); b.setAttribute('aria-pressed', String(music)); });
  [langBtn, document.getElementById('langD')].forEach(b => { b.textContent = game.lang === 'ja' ? 'English' : '日本語'; b.lang = game.lang === 'ja' ? 'en' : 'ja'; });
  const hgt = document.getElementById('hgtD'); hgt.textContent = L(game.heights ? 'On' : 'Off', game.heights ? 'オン' : 'オフ'); hgt.setAttribute('aria-pressed', String(game.heights));
  const ag = document.getElementById('agD'); ag.textContent = L(game.autoGuard ? 'On' : 'Off', game.autoGuard ? 'オン' : 'オフ'); ag.setAttribute('aria-pressed', String(game.autoGuard));
  setBtn.textContent = L('⚙ Settings', '⚙ 設定');
  document.getElementById('dTitle').textContent = drawerMode === 'settings' ? L('Settings', '設定') : drawerMode === 'news' ? L('What’s new', '更新情報') : L('Move list', '技表');
  if (drawerMode === 'news' && !drawer.hidden) renderNews();
  drawer.querySelectorAll('[data-l]').forEach(el => { const [en, ja] = el.dataset.l.split('|'); el.textContent = L(en, ja); });
  drawer.querySelectorAll('[data-diff]').forEach(b => { b.textContent = L(...DIFF_NAMES[b.dataset.diff]); b.classList.toggle('on', b.dataset.diff === game.diff); b.setAttribute('aria-pressed', String(b.dataset.diff === game.diff)); });
  const tagEl = document.getElementById('tagline');
  tagEl.textContent = IS_MOBILE ? L('Nine fighters. Touch controls: the pad on the left, U I J K on the right.', '9人のファイター。タッチ操作：左のパッドで移動、右のU・I・J・Kで攻撃。') : L('Nine fighters. CPU battles on four difficulties, training, sample combos and online battles. Keyboard required.', '9人のファイター。4段階の難易度のCPU戦、トレーニング、コンボ見本、オンライン対戦。キーボードで操作します。');
  tagEl.title = tagEl.textContent; // (the whole line on hover, when it's shortened)
  const tabNames = { ctl: ['Controls', '操作'], ninja: ['Kuro', 'クロ'], brawler: ['Tetsu', 'テツ'], staff: ['Mei', 'メイ'], psychic: ['Lyra', 'ライラ'], paladin: ['Aldric', 'アルドリック'], kappa: ['Kappa', 'カッパ'], alchemist: ['Hohen', 'ホーエン'], gunman: ['Jesse', 'ジェシー'], salary: ['Tanaka', '田中'] };
  drawer.querySelectorAll('.tabs button').forEach(b => { b.textContent = L(...tabNames[b.dataset.tab]); b.classList.toggle('on', b.dataset.tab === drawerTab); b.setAttribute('aria-selected', String(b.dataset.tab === drawerTab)); });
  drawer.querySelectorAll('article.card').forEach(a => { a.hidden = !(a.dataset.tab === drawerTab && a.dataset.lang === game.lang); });
}
function openDrawer(open, mode) {
  if (mode) drawerMode = mode; drawer.classList.toggle('settings', drawerMode === 'settings'); drawer.classList.toggle('news', drawerMode === 'news');
  if (open && drawerMode === 'news') renderNews(); // (release notes, newest first)
  drawer.hidden = !open; setBtn.setAttribute('aria-expanded', String(open));
  if (open && game.mode === 'fight' && !game.paused && !NET.on) togglePause(); // look things up without the fight running on
  if (open) applyLang();
  else if (game.paused) refreshPause();
}
sndBtn.addEventListener('click', toggleSound); document.getElementById('sndD').addEventListener('click', toggleSound);
bgmBtn.addEventListener('click', toggleMusic); document.getElementById('bgmD').addEventListener('click', toggleMusic);
langBtn.addEventListener('click', () => setLang(game.lang === 'ja' ? 'en' : 'ja')); document.getElementById('langD').addEventListener('click', () => setLang(game.lang === 'ja' ? 'en' : 'ja'));
setBtn.addEventListener('click', () => openDrawer(drawer.hidden || drawerMode !== 'settings', 'settings'));
document.getElementById('movesD').addEventListener('click', () => { drawerTab = fighters[0] && game.mode === 'fight' ? fighters[0].key : game.p1Char; openDrawer(true, 'moves'); });
document.getElementById('hgtD').addEventListener('click', () => { initAudio(); toggleHeights(); sfx('select'); });
document.getElementById('fdD').addEventListener('click', e => { const h = document.getElementById('fdHelp'); h.hidden = !h.hidden; e.currentTarget.setAttribute('aria-expanded', String(!h.hidden)); sfx('select'); }); // what 発生, 持続, 硬直 and 硬直差 mean
document.getElementById('agD').addEventListener('click', () => { initAudio(); toggleAutoGuard(); sfx('select'); });
document.getElementById('newsD').addEventListener('click', () => openDrawer(true, 'news'));
document.getElementById('reloadD').addEventListener('click', freshReload);
document.getElementById('eraseD').addEventListener('click', () => { if (confirm(L('Erase everything this site has saved (settings included) and reload?', 'このサイトに保存されたデータ（設定を含む）をすべて消去して、再読み込みしますか？'))) eraseSiteData(); });
document.getElementById('dClose').addEventListener('click', () => openDrawer(false));
drawer.querySelectorAll('[data-diff]').forEach(b => b.addEventListener('click', () => { initAudio(); setDiff(b.dataset.diff); sfx('select'); }));
drawer.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { drawerTab = b.dataset.tab; applyLang(); }));
applyLang();

canvas.addEventListener('pointerdown', () => { if (game.mode === 'opening') { if (OP.soundAsked) { OP.soundAsked = false; initAudio(); return; } skipOpening(); } else if (game.mode === 'splash') startOpening(); });
startOpening(); OP.soundAsked = !(AC && AC.state === 'running'); // the opening plays every time the site opens
// ---- phones and tablets: on-screen controls ----
const touchUI = document.getElementById('touch'), rotUI = document.getElementById('rotate');
if (IS_MOBILE) document.body.classList.add('mobile');
function vKey(code, down) { window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code, bubbles: true })); } // the touch controls press and release the player's own keys
(() => {
  const pad = document.getElementById('tpad'), knob = document.getElementById('tknob'), M = MAPS.p1, held = { left: false, right: false, up: false, down: false };
  let pid = null;
  const setDir = (d, on) => { if (held[d] !== on) { held[d] = on; vKey(M[d], on); } };
  const move = e => { const r = pad.getBoundingClientRect(), R = r.width / 2, dx = e.clientX - (r.left + R), dy = e.clientY - (r.top + R), d = Math.hypot(dx, dy), k = Math.min(1, d / R), dz = 0.32;
    knob.style.transform = `translate(${(d ? dx / d : 0) * k * R * 0.62}px,${(d ? dy / d : 0) * k * R * 0.62}px)`;
    const nx = d ? dx / d : 0, ny = d ? dy / d : 0, on = k > dz;
    setDir('left', on && nx < -0.38); setDir('right', on && nx > 0.38); setDir('up', on && ny < -0.45); setDir('down', on && ny > 0.45); }; // 8 directions, with a dead zone in the middle
  const end = () => { pid = null; knob.style.transform = ''; for (const d in held) setDir(d, false); };
  pad.addEventListener('pointerdown', e => { e.preventDefault(); pid = e.pointerId; pad.setPointerCapture(pid); move(e); });
  pad.addEventListener('pointermove', e => { if (e.pointerId === pid) move(e); });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) pad.addEventListener(ev, e => { if (e.pointerId === pid) end(); });
  for (const b of document.querySelectorAll('#tbtns button')) { // U I / J K: hold works too (charges, guard-break holds); two at once (U + J) is the super
    const code = () => MAPS.p1[b.dataset.k];
    b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); b.classList.add('on'); vKey(code(), true); if (navigator.vibrate) navigator.vibrate(8); });
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) b.addEventListener(ev, () => { if (b.classList.contains('on')) { b.classList.remove('on'); vKey(code(), false); } });
    b.addEventListener('contextmenu', e => e.preventDefault()); }
  document.getElementById('tpause').addEventListener('pointerdown', e => { e.preventDefault(); vKey('Escape', true); vKey('Escape', false); });
  touchUI.addEventListener('touchstart', e => e.preventDefault(), { passive: false }); // no scrolling or zooming while playing
})();
// phones held sideways: the pad and the buttons sit in panels beside the game (not over it), big, in the lower middle of
// each panel; the game is narrowed a little to make room — always the same size, in menus and in play. Squarer screens
// (tablets) keep them over the game, but bigger.
const stageEl = document.querySelector('.stage');
let safeProbe = null;
function safeInsets() { // the notch and rounded corners (env(safe-area-inset-*)), read through a hidden probe
  if (!safeProbe) { safeProbe = document.createElement('div'); safeProbe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px)'; document.body.appendChild(safeProbe); }
  const cs = getComputedStyle(safeProbe); return { l: parseFloat(cs.paddingLeft) || 0, r: parseFloat(cs.paddingRight) || 0 };
}
function layoutTouch() {
  if (!IS_MOBILE) return;
  if (touchUI.parentNode !== document.body) document.body.appendChild(touchUI); // (out of the game panel, so it can sit beside it)
  const vw = innerWidth, vh = innerHeight, ins = safeInsets(), usable = vw - ins.l - ins.r;
  const side = usable / vh >= 1.9 ? Math.min(usable * 0.21, Math.max((usable - vh * 16 / 9) / 2, usable * 0.17)) : 0; // width of each side panel: only on phones wider than the game (most are ~19.5:9); a 16:9 screen keeps the controls over the game
  stageEl.style.width = (side ? usable - side * 2 : Math.min(usable, vh * 16 / 9)) + 'px';
  const pad = document.getElementById('tpad'), btns = document.getElementById('tbtns'), pause = document.getElementById('tpause');
  let size, padL, btnL, top;
  if (side) { size = Math.min(side - 14, vh * 0.42); padL = ins.l + (side - size) / 2; btnL = vw - ins.r - side + (side - size) / 2; top = vh * 0.62 - size / 2; }
  else { const r = stageEl.getBoundingClientRect(); size = Math.min(r.width * 0.19, r.height * 0.36); padL = r.left + r.width * 0.025; btnL = r.right - r.width * 0.025 - size; top = r.bottom - r.height * 0.05 - size; }
  for (const [el, l] of [[pad, padL], [btns, btnL]]) Object.assign(el.style, { left: l + 'px', top: top + 'px', width: size + 'px', height: size + 'px', right: 'auto', bottom: 'auto' });
  btns.querySelectorAll('button').forEach(b => { b.style.fontSize = Math.round(size * 0.19) + 'px'; });
  pad.querySelectorAll('.ar').forEach(a => { a.style.fontSize = Math.round(size * 0.12) + 'px'; });
  const ps = Math.max(36, Math.min(48, size * 0.36));
  Object.assign(pause.style, side ? { left: (vw - ins.r - side / 2 - ps / 2) + 'px', top: '14px', width: ps + 'px', height: ps + 'px', right: 'auto', fontSize: Math.round(ps * 0.38) + 'px' }
    : (() => { const r = stageEl.getBoundingClientRect(); return { left: (r.right - ps - 10) + 'px', top: (r.top + r.height * 0.2) + 'px', width: ps + 'px', height: ps + 'px', right: 'auto', fontSize: Math.round(ps * 0.38) + 'px' }; })());
  fitCanvas();
}
if (IS_MOBILE) { layoutTouch(); addEventListener('resize', layoutTouch); addEventListener('orientationchange', () => setTimeout(layoutTouch, 200)); }
// a menu taller (or wider) than the game screen is scaled down to fit, so nothing is ever cut off
function fitOverlay() {
  const panel = ov.querySelector(':scope > .panel'); if (!panel || ov.hidden) return;
  panel.style.zoom = ''; panel.style.transform = '';
  const cs = getComputedStyle(ov), availH = ov.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom), availW = ov.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const k = Math.min(1, availH / panel.scrollHeight, availW / panel.scrollWidth); if (k >= 0.999) return;
  if ('zoom' in panel.style) panel.style.zoom = k.toFixed(3); else { panel.style.transformOrigin = 'top center'; panel.style.transform = `scale(${k.toFixed(3)})`; }
}
new MutationObserver(() => requestAnimationFrame(fitOverlay)).observe(ov, { childList: true });
addEventListener('resize', () => requestAnimationFrame(fitOverlay));
function updateTouchUI() { // shown only on a phone or tablet, during play (not in menus or pauses); watching samples or CPU vs CPU, only the pause button (the way back to the menu)
  const show = IS_MOBILE && game.mode === 'fight' && !game.paused && !game.netMenu && drawer.hidden, viewOnly = !!(game.demo || game.watch);
  if (touchUI.classList.contains('viewonly') !== viewOnly) { touchUI.classList.toggle('viewonly', viewOnly); if (viewOnly) for (const k of ['left', 'right', 'up', 'down', 'lp', 'hp', 'lk', 'hk']) keys.delete(MAPS.p1[k]); }
  if (touchUI.hidden === show) { touchUI.hidden = !show; if (!show) for (const k of ['left', 'right', 'up', 'down', 'lp', 'hp', 'lk', 'hk']) keys.delete(MAPS.p1[k]); }
  const portrait = IS_MOBILE && innerHeight > innerWidth;
  if (rotUI.hidden === portrait) { rotUI.hidden = !portrait; if (portrait && game.mode === 'fight' && !game.paused && !NET.on && !game.demo) togglePause(true); } // turned upright mid-fight: pause
  if (portrait) { const ja = game.lang === 'ja'; document.getElementById('rotTxt').textContent = ja ? 'スマホを横向きにしてください' : 'Turn your phone sideways to play'; document.getElementById('rotSub').textContent = ja ? 'Shadow ✕ Qi は横画面でプレイします' : 'Shadow ✕ Qi plays in landscape'; }
}
updateTouchUI();
// training: the 技表 over the game (L), three tabs (C, or tap them): 技 — your moves one at a time, name and command (from the move list);
// コンボ — your sample combos, their keys in order; 相手 — the dummy's commands, with ▶ to have it do one again and again (punish training).
// ◀ ▶ or , . step through the tab; B plays or stops the dummy's command, − = change how often
document.querySelectorAll('.card .scroll').forEach(d => { const c = d.querySelector('tbody td'); if (c && /^\d+\./.test(c.textContent.trim())) d.classList.add('combo'); });
const tlistUI = document.getElementById('tlist'); let tlistCh = '', tlistKey = '', tlistMoves = [], tlistIdx = 0, tcomboIdx = 0;
const TL_TABS = ['moves', 'combos', 'opp'];
function moveListOf(ch) {
  const card = document.querySelector(`article.card[data-tab="${ch}"][data-lang="${game.lang}"]`); if (!card) return [];
  const out = []; let parent = null;
  card.querySelectorAll('.scroll:not(.combo) table tbody tr').forEach(tr => {
    const td = tr.querySelectorAll('td'); if (td.length < 2) return;
    const name = [...td[0].childNodes].filter(n => !(n.nodeType === 1 && n.tagName === 'SMALL')).map(n => n.textContent).join('').trim();
    const cmd = td[td.length - 1].textContent.trim();
    if (tr.classList.contains('sub') && parent) out.push({ name, cmd: `${parent.cmd}, ${cmd}` }); // a follow-up: the move it follows, then its button
    else { parent = { name, cmd }; out.push(parent); }
  });
  return out;
}
const comboListOf = ch => (COMBO_SET[ch] || []).map(d => ({ name: L(d.name, (JA_DEMO[d.name] || {}).n || d.name), keys: d.steps.map(s => s.key) })); // (the same combos as the sample combos)
function stepMoveList(d) {
  const tab = game.listTab || 'moves', n = tab === 'combos' ? comboListOf(fighters[0].key).length : tab === 'opp' ? repMoves.length : tlistMoves.length; if (!n) return;
  if (tab === 'combos') tcomboIdx = (tcomboIdx + d + n) % n; else if (tab === 'opp') { game.repIdx = ((game.repIdx || 0) + d + n) % n; setRepeat(); } else tlistIdx = (tlistIdx + d + n) % n;
  sfx('select'); updateMoveList();
}
function stepTab(t) { game.listTab = t || TL_TABS[(TL_TABS.indexOf(game.listTab || 'moves') + 1) % TL_TABS.length]; sfx('select'); updateMoveList(); }
tlistUI.addEventListener('pointerdown', e => { const b = e.target.closest('button'); if (!b) return; e.preventDefault(); e.stopPropagation();
  if (b.dataset.tab) stepTab(b.dataset.tab); else if (b.dataset.play) toggleRepeat(); else if (b.dataset.e) stepEvery(+b.dataset.e); else stepMoveList(+b.dataset.m); });
function updateMoveList() {
  const show = !!game.moveList && game.mode === 'fight' && game.training && !game.demo && !game.paused && drawer.hidden;
  if (tlistUI.hidden === show) tlistUI.hidden = !show;
  if (!show) return;
  const ch = fighters[0] ? fighters[0].key : game.p1Char, dch = fighters[1] ? fighters[1].key : game.p2Char, tab = game.listTab || 'moves';
  if (ch + '/' + dch !== tlistCh) { tlistCh = ch + '/' + dch; tlistIdx = 0; tcomboIdx = 0; tlistKey = ''; }
  const opp = repMovesFor(dch);
  const key = [ch, dch, game.lang, tab, tlistIdx, tcomboIdx, game.repIdx, game.repeatOn, game.repEvery].join('|'); if (key === tlistKey) return; tlistKey = key;
  const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]), chips = ks => `<div class="tk">${ks.map(k => `<span>${esc(k)}</span>`).join('<i>›</i>')}</div>`;
  const TAB = { moves: L('Moves', '技'), combos: L('Combos', 'コンボ'), opp: L('Opponent', '相手') };
  const tabs = `<div class="ttabs">${TL_TABS.map(t => `<button data-tab="${t}"${t === tab ? ' class="on"' : ''}>${TAB[t]}</button>`).join('')}${IS_MOBILE ? '' : '<small>C</small>'}</div>`;
  let body = '';
  if (tab === 'combos') { const list = comboListOf(ch), c = list[tcomboIdx]; body = c ? `<b>${esc(c.name)}</b> <small>${tcomboIdx + 1}/${list.length}</small>${chips(c.keys)}` : ''; }
  else if (tab === 'opp') {
    const m = opp[game.repIdx || 0], shown = c => L(c, c.replace(', then ', '、続けて ').replace(' then ', ' から ').replace(' (hold)', '（長押し）'));
    body = m ? `<small>${esc(nm(CHARS[dch]))} ${(game.repIdx || 0) + 1}/${opp.length}${IS_MOBILE ? '' : ` · ${L('B play / stop, − = how often', 'B 再生・停止、− = 間隔')}`}</small>${m.name ? `<b>${esc(m.name)}</b>` : ''}`
      + `<div class="trow">${chips(shown(m.label).split(/、続けて | から |, then | then |, /))}<button class="tplay${game.repeatOn ? ' on' : ''}" data-play="1" aria-label="${game.repeatOn ? L('Stop', '停止') : L('Play: the dummy repeats it', '再生：ダミーが繰り返す')}">${game.repeatOn ? '■' : '▶'}</button>`
      + `<span class="tev"><button data-e="-1" aria-label="${L('Shorter interval', '間隔を短く')}">−</button>${L(`every ${game.repEvery || 1.5} s`, `${game.repEvery || 1.5}秒ごと`)}<button data-e="1" aria-label="${L('Longer interval', '間隔を長く')}">+</button></span></div>` : '';
  } else { tlistMoves = moveListOf(ch); const m = tlistMoves[tlistIdx]; body = m ? `<b>${esc(m.name)}</b><div class="tc">${esc(m.cmd)}</div>` : ''; }
  tlistUI.innerHTML = `<button data-m="-1" aria-label="${L('Previous', '前へ')}">◀</button><div class="tm">${tabs}${body}</div><button data-m="1" aria-label="${L('Next', '次へ')}">▶</button>`;
}
requestAnimationFrame(loop);
