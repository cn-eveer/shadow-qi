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
  if (IS_MOBILE) [...tbar.children, ...dbar.children].forEach(b => { b.textContent = b.textContent.replace(/ \([A-Z]\)$/, ''); }); // no keyboard on a phone
}
function trainingAction(t) {
  if (t === 'dummy') game.dummyMode = DUMMY_MODES[(DUMMY_MODES.indexOf(game.dummyMode) + 1) % DUMMY_MODES.length];
  else if (t === 'mp') game.mpFull = !game.mpFull;
  else if (t === 'reset') resetPositions();
  else if (t === 'list') game.moveList = !game.moveList;
  sfx('select'); updateTbar();
}
tbar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { initAudio(); trainingAction(b.dataset.t); b.blur(); }));
function showMenu() {
  game.mode = 'menu'; game.paused = false; game.netMenu = false; tbar.hidden = true; dbar.hidden = true;
  const c = game.p1Char;
  if (game.p2Char === c) game.p2Char = CHAR_ORDER.find(k => k !== c);
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
    </div>
    <div class="pickinfo"><span><b>${nm(CHARS[c])}</b> ${blurbs[c]}</span><button class="ghost sm" data-act="moves">${L('Move list', '技表')}</button></div>
    <div class="vsrow">${L('CPU opponent:', 'CPUの相手：')} ${CHAR_ORDER.filter(k => k !== c).map(k => `<button class="${game.p2Char === k ? 'on' : ''}" data-vs="${k}" aria-pressed="${game.p2Char === k}">${nm(CHARS[k])}</button>`).join('')}</div>
    <div class="vsrow">${L('Difficulty:', '難易度：')} ${DIFF_ORDER.map(k => `<button class="${game.diff === k ? 'on' : ''}" data-diff="${k}" aria-pressed="${game.diff === k}">${L(...DIFF_NAMES[k])}</button>`).join('')}</div>
    <div class="row"><button class="go" data-act="start">${L('FIGHT', '対戦')}</button><button class="ghost" data-act="training">${L('Training', 'トレーニング')}</button><button class="ghost" data-act="watch">${L('CPU vs CPU', 'CPU対CPU')}</button><button class="ghost" data-act="online">${L('Online', 'オンライン')}</button><button class="ghost" data-act="opening">${L('Opening', 'オープニング')}</button><button class="ghost" data-act="demo" data-who="${c}">${L(CHARS[c].name[0] + CHARS[c].name.slice(1).toLowerCase() + ' combos', nm(CHARS[c]) + 'のコンボ見本')}</button><button class="ghost" data-act="punish" data-who="${c}">${L(CHARS[c].name[0] + CHARS[c].name.slice(1).toLowerCase() + ' punishes', nm(CHARS[c]) + 'の反撃見本')}</button></div>
    <div class="hint">${L('A and D pick your fighter, W and S pick the opponent. Enter to fight, T for training, C to watch CPU vs CPU, V for your fighter’s sample combos, P for punish samples.', 'A・Dでキャラ選択、W・Sで相手を選択。Enterで対戦、Tでトレーニング、CでCPU対CPU、Vでコンボ見本、Pで反撃見本。')}</div>
  </div>`;
  bindOverlay();
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
    else if (['KeyW','KeyS','ArrowUp','ArrowDown'].includes(e.code)) { e.preventDefault(); if (game.p2Char === game.p1Char) game.p2Char = cyc(game.p1Char, 1); game.p2Char = cyc(game.p2Char, e.code === 'KeyW' || e.code === 'ArrowUp' ? -1 : 1, game.p1Char); sfx('select'); showMenu(); }
    else if (e.code === 'Enter') { e.preventDefault(); startMatch(false, false); }
    else if (e.code === 'KeyT') startMatch(true);
    else if (e.code === 'KeyC') startMatch(false, true);
    else if (e.code === 'KeyV') { game.demoSet = 'combos'; startMatch(true, false, true); }
    else if (e.code === 'KeyP') { game.demoSet = 'punish'; startMatch(true, false, true); }
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
      else if (e.code === 'Comma' && game.moveList) stepMoveList(-1);
      else if (e.code === 'Period' && game.moveList) stepMoveList(1);
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
function setDiff(k) { game.diff = k; try { localStorage.setItem('sq-diff', k); } catch (e) {} applyLang(); if (game.mode === 'menu') showMenu(); }
function applyLang() { // header, drawer, tabs and which language of the command lists shows
  if (document.documentElement) document.documentElement.lang = game.lang;
  const on = (v, en, ja) => L(en + (v ? ' on' : ' off'), ja + (v ? ' オン' : ' オフ'));
  [sndBtn, document.getElementById('sndD')].forEach(b => { b.textContent = on(sound, 'Sound', 'サウンド'); b.setAttribute('aria-pressed', String(sound)); });
  [bgmBtn, document.getElementById('bgmD')].forEach(b => { b.textContent = on(music, 'Music', 'BGM'); b.setAttribute('aria-pressed', String(music)); });
  [langBtn, document.getElementById('langD')].forEach(b => { b.textContent = game.lang === 'ja' ? 'English' : '日本語'; b.lang = game.lang === 'ja' ? 'en' : 'ja'; });
  setBtn.textContent = L('⚙ Settings', '⚙ 設定');
  document.getElementById('dTitle').textContent = drawerMode === 'settings' ? L('Settings', '設定') : L('Move list', '技表');
  drawer.querySelectorAll('[data-l]').forEach(el => { const [en, ja] = el.dataset.l.split('|'); el.textContent = L(en, ja); });
  drawer.querySelectorAll('[data-diff]').forEach(b => { b.textContent = L(...DIFF_NAMES[b.dataset.diff]); b.classList.toggle('on', b.dataset.diff === game.diff); b.setAttribute('aria-pressed', String(b.dataset.diff === game.diff)); });
  const tagEl = document.getElementById('tagline');
  tagEl.textContent = IS_MOBILE ? L('Eight fighters. Touch controls: the pad on the left, U I J K on the right.', '8人のファイター。タッチ操作：左のパッドで移動、右のU・I・J・Kで攻撃。') : L('Eight fighters. CPU battles on four difficulties, training, sample combos and online battles. Keyboard required.', '8人のファイター。4段階の難易度のCPU戦、トレーニング、コンボ見本、オンライン対戦。キーボードで操作します。');
  tagEl.title = tagEl.textContent; // (the whole line on hover, when it's shortened)
  const tabNames = { ctl: ['Controls', '操作'], ninja: ['Kuro', 'クロ'], brawler: ['Tetsu', 'テツ'], staff: ['Mei', 'メイ'], psychic: ['Lyra', 'ライラ'], paladin: ['Aldric', 'アルドリック'], kappa: ['Kappa', 'カッパ'], gunman: ['Jesse', 'ジェシー'], salary: ['Tanaka', '田中'] };
  drawer.querySelectorAll('.tabs button').forEach(b => { b.textContent = L(...tabNames[b.dataset.tab]); b.classList.toggle('on', b.dataset.tab === drawerTab); b.setAttribute('aria-selected', String(b.dataset.tab === drawerTab)); });
  drawer.querySelectorAll('article.card').forEach(a => { a.hidden = !(a.dataset.tab === drawerTab && a.dataset.lang === game.lang); });
}
function openDrawer(open, mode) {
  if (mode) drawerMode = mode; drawer.classList.toggle('settings', drawerMode === 'settings');
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
function updateTouchUI() { // shown only on a phone or tablet, during play (not in menus, pauses or the sample viewer)
  const show = IS_MOBILE && game.mode === 'fight' && !game.paused && !game.netMenu && !game.demo && !game.watch && drawer.hidden;
  if (touchUI.hidden === show) { touchUI.hidden = !show; if (!show) for (const k of ['left', 'right', 'up', 'down', 'lp', 'hp', 'lk', 'hk']) keys.delete(MAPS.p1[k]); }
  const portrait = IS_MOBILE && innerHeight > innerWidth;
  if (rotUI.hidden === portrait) { rotUI.hidden = !portrait; if (portrait && game.mode === 'fight' && !game.paused && !NET.on && !game.demo) togglePause(true); } // turned upright mid-fight: pause
  if (portrait) { const ja = game.lang === 'ja'; document.getElementById('rotTxt').textContent = ja ? 'スマホを横向きにしてください' : 'Turn your phone sideways to play'; document.getElementById('rotSub').textContent = ja ? 'Shadow ✕ Qi は横画面でプレイします' : 'Shadow ✕ Qi plays in landscape'; }
}
updateTouchUI();
// training: one move at a time, just its name and command, shown over the game (taken from the move list);
// ◀ ▶ or , . step through them
document.querySelectorAll('.card .scroll').forEach(d => { const c = d.querySelector('tbody td'); if (c && /^\d+\./.test(c.textContent.trim())) d.classList.add('combo'); });
const tlistUI = document.getElementById('tlist'); let tlistCh = '', tlistKey = '', tlistMoves = [], tlistIdx = 0;
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
function stepMoveList(d) { if (!tlistMoves.length) return; tlistIdx = (tlistIdx + d + tlistMoves.length) % tlistMoves.length; sfx('select'); updateMoveList(); }
tlistUI.addEventListener('pointerdown', e => { const b = e.target.closest('button'); if (!b) return; e.preventDefault(); e.stopPropagation(); stepMoveList(+b.dataset.m); });
function updateMoveList() {
  const show = !!game.moveList && game.mode === 'fight' && game.training && !game.demo && !game.paused && drawer.hidden;
  if (tlistUI.hidden === show) tlistUI.hidden = !show;
  if (!show) return;
  const ch = fighters[0] ? fighters[0].key : game.p1Char;
  if (ch !== tlistCh) { tlistCh = ch; tlistIdx = 0; tlistKey = ''; }
  const key = ch + game.lang + tlistIdx; if (key === tlistKey) return; tlistKey = key;
  tlistMoves = moveListOf(ch); const m = tlistMoves[tlistIdx]; if (!m) { tlistUI.innerHTML = ''; return; }
  const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  tlistUI.innerHTML = `<button data-m="-1" aria-label="${L('Previous move', '前の技')}">◀</button><div class="tm"><b>${esc(m.name)}</b><div class="tc">${esc(m.cmd)}</div></div><button data-m="1" aria-label="${L('Next move', '次の技')}">▶</button>`;
}
requestAnimationFrame(loop);
