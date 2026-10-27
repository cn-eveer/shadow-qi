'use strict';
/* ================= version, release notes (更新情報) and the update check ================= */
// RELEASES: newest first, always written in Japanese. The running version is the ?v= this script was loaded with (index.html);
// version.json on the server says which version is live. When the two differ, the player is asked to reload without the
// browser's cache, or to erase the site's saved data and reload.
const RELEASES = [ // notes: a string, or { g: 'group', items: [...] } (groups nest)
  { v: '1.3.9', date: '2026-10-27', notes: [
    { g: 'システム', items: [
      { g: '超必殺技', items: [
        'どれにもかわし方：大気功砲・水晶の嵐・天国の門・地獄の乱舞はガードのみ、ほかはジャンプかダッシュでかわせる（出るまで無敵、暗転後にヒント）',
        'ダメージはフルヒットで約220にそろえた（大洪水・聖域は別）',
      ] },
      { g: 'コンボ', items: [
        '2回目の打ち上げ・バウンドのあとも締めまで当たる（一度だけ+26のボーナス）',
        '締め技は、バウンド直後の低い相手や少し離れた相手にも届く',
        'ダメージ減衰は「ヒット数」ではなく「攻撃の数」で数える',
      ] },
      { g: '無限ループ防止', items: [
        '空中のU、Uは、最後の打ち上げ・バウンドから2.5秒で相手が落ちる',
        '同じコンボで4.5秒以上動けなくなることはない（全キャラ・全コマンドで検査済み）',
        '同じ技を繰り返すたびに気絶が短くなる（壁際ループ防止）',
      ] },
      { g: '攻防', items: [
        'ガードされると攻撃側が体勢を崩す（少し隙が増え、のけぞる）',
        '飛び道具・遠距離攻撃はすべてジャンプでかわせる（コンボで浮いた相手には当たる）',
        '全キャラに空中↓+Uの急降下攻撃。しゃがんだまま前進できる（↓＋前）',
      ] },
      '同キャラ対戦：2人目のエフェクト（大洪水の水も）は色を変えて表示。CPU戦でも同じキャラを選べる',
      'オープニングを最新の内容に更新',
      '不具合修正：打ち上げで画面外に消える、見本を続けて再生すると気絶が効かない など',
    ] },
    { g: 'キャラクター', items: [
      { g: 'クロ', items: ['影分身・軍勢がコンボで浮いた相手にも当たる'] },
      { g: 'テツ', items: ['2回打ち上げのコンボが1回より強く'] },
      { g: 'メイ', items: ['棍の後ろを握り、先端で当たる（リーチアップ）', '与ダメージ約15%減', '斉天大聖の柱は金色の印から離れればかわせる'] },
      { g: 'ライラ', items: ['杖の下を握り、光線は杖の先の水晶から', '反撃・カウンター見本を打ち上げから空中追撃まで続くように'] },
      { g: 'アルドリック', items: ['攻撃時は剣そのものが輝く（巨大な光の剣はK長押しのエクスカリバーのみ）', 'イージスはガードゲージを大きく消費（2〜4発で割れる・最大4秒）。残りが減ると薄くなり、点滅してひびが入る', '聖域はダッシュでかわせる'] },
      { g: 'カッパ', items: [
        '大洪水：直接は当たらず、10秒間ステージが水没。カッパは回復し、泳いで速く動き攻撃も速い。相手は溺れて遅くなる',
        '←←+Kは新技「引き波」：相手の背後から波で引き寄せ（ガードしていても）、当たれば地上の連続技へ',
        'ダッシュと飛びかかりにアーマー。ダッシュは飛び道具の下をくぐり、甲羅ガードは飛び道具を跳ね返す',
        '毒は3秒以内に3回で回り、8秒続く',
      ] },
      { g: 'ジェシー', items: ['真昼の決闘：画面のどこでも届き、足元を撃つ下段に（ジャンプかしゃがみガード）。演出を強化', '通常射撃は胸の高さ、下段射撃は膝の高さ'] },
      { g: '田中', items: [
        '攻撃力：天使＋悪魔 ×2.1／悪魔 ×2.0／天使 ×1.15／素 ×1.0',
        '天使は回復する（1秒に約5、祝福でも回復）。悪魔と天使＋悪魔は回復せず、体力が減り続ける（1秒に27・132。以前の5倍・10倍）',
        '新しい超必殺技（究極の土下座・天国の門・地獄の乱舞）',
        'カウントダウン中に天使か悪魔を憑依させると、そのラウンドずっと続く（残り時間の表示なし。オンライン対戦でも）。二重憑依はラウンド中のみ',
        '憑依中の←←+Jは状況に合わせて自動で変わる。技表に各姿の強み・弱み',
      ] },
    ] },
  ] },
  { v: '1.3.8', date: '2026-10-27', notes: [
    { g: 'システム', items: ['更新情報とバージョン表示（設定・タイトル画面）', '新しいバージョンが出たら、キャッシュを使わずに再読み込みするか確認'] },
    { g: 'キャラクター', items: [{ g: 'ジェシー', items: ['弾は10発。撃ち尽くすと5秒リロード（残弾は名前の横）'] }] },
  ] },
  { v: '1.3.7', date: '2026-10-27', notes: [
    { g: 'システム', items: [
      '連撃のあとはひと息つく（Uの無限連打を防止）',
      'ガードは攻撃の高さで決まる：上段・上中段・中段・中下段・下段',
      'トレーニングで当たった高さを表示（設定でオン・オフ）',
    ] },
    { g: 'キャラクター', items: [{ g: 'アルドリック', items: ['U、U、Kの2発目が外れると相手が動けなくなる不具合を修正'] }] },
  ] },
  { v: '1.3.6', date: '2026-10-27', notes: [{ g: 'システム', items: ['技表からフレームデータを削除', 'トレーニングとコンボダメージの説明を更新'] }] },
  { v: '1.3.5', date: '2026-10-27', notes: [{ g: 'システム', items: ['ヘッダーを常に1行に（ページがスクロールしない）'] }] },
  { v: '1.3.4', date: '2026-10-27', notes: [{ g: 'システム', items: ['キャッチコピーを更新', '開始前の文章を日本語に'] }] },
  { v: '1.3.3', date: '2026-10-27', notes: [{ g: 'システム', items: ['ページのタイトル・説明を日本語に、リンクのプレビューを充実', 'ホーム画面に追加したときのアプリ情報を更新'] }] },
  { v: '1.3.2', date: '2026-10-27', notes: [{ g: 'システム', items: ['オープニングがなめらかに', 'スマホで画面の大きさが変わらないように'] }] },
  { v: '1.3.1', date: '2026-10-27', notes: [
    { g: 'システム', items: [
      { g: 'コンボ', items: ['打ち上げ・バウンドは L L、L L B、L B、L B L、B B、B L だけ（＋締め）', '空中のU、Uは相手を少し止めるだけ', 'コンボが長いほど1ヒットのダメージが下がる'] },
      'スマホの操作ボタンを画面横のパネルに',
    ] },
    { g: 'キャラクター', items: ['すべてのコンボ見本を新しいルールに合わせて調整'] },
  ] },
  { v: '1.3.0', date: '2026-10-26', notes: [
    { g: 'システム', items: ['新しい音楽・アナウンサーの声・キャラごとの打撃音', '打ち上げとバウンドの回数を制限（無限コンボ防止）', 'CPUの強さを4段階に', '日本語を標準の言語に'] },
    { g: 'キャラクター', items: ['全キャラに最大コンボの見本', 'ラウンド前の登場ポーズ'] },
  ] },
  { v: '1.2.0', date: '2026-10-26', notes: [
    { g: 'システム', items: ['新しいオープニング', 'トレーニングの技カード', 'MPゲージをガードゲージの下に'] },
    { g: 'キャラクター', items: ['勝利アニメーション（残り体力で3種類、セリフつき）'] },
  ] },
  { v: '1.1.1', date: '2026-10-26', notes: [{ g: 'システム', items: ['スマホで画面いっぱいに表示', 'トレーニングに技表ボタン（L）', 'キャラ選択メニューを軽く'] }] },
  { v: '1.1.0', date: '2026-10-26', notes: [
    { g: 'システム', items: ['溜め攻撃（Iを長押し）', 'スマホ・タブレットに対応'] },
    { g: 'キャラクター', items: ['新キャラ4人：アルドリック、カッパ、ジェシー、田中', 'メイとライラのバランスを調整'] },
  ] },
  { v: '1.0.3', date: '2026-10-26', notes: [{ g: 'システム', items: ['READMEを新しく'] }] },
  { v: '1.0.2', date: '2026-10-25', notes: [
    { g: 'システム', items: ['大技よりコンボが強く（強い技は80%、空中の相手には60%）'] },
    { g: 'キャラクター', items: ['ライラの連撃に間を追加', 'メイのラッシュ技、クロの居合斬りなどを調整'] },
  ] },
  { v: '1.0.1', date: '2026-10-25', notes: [{ g: 'キャラクター', items: [{ g: 'ライラ', items: ['空中追撃を強化、2回打ち上げのコンボの続き'] }] }] },
  { v: '1.0.0', date: '2026-10-25', notes: [
    { g: 'システム', items: ['画面がくっきり', '一時停止メニュー（Esc）とカウントダウン', 'オンライン対戦の改善（同キャラは色違い、再戦の不具合を修正）', '← ← で素早いバックダッシュ'] },
    { g: 'キャラクター', items: ['バランス調整（テツのアーマー、メイとライラの押し戻し、クロの技、CPUの反応）'] },
  ] },
];
const APP_VERSION = ((document.currentScript && /[?&]v=([\d.]+)/.exec(document.currentScript.src)) || [])[1] || RELEASES[0].v;
let updLatest = null, updLast = 0, updAsked = null, updToast = null;
const updEl = document.getElementById('upd'), toastEl = document.getElementById('utoast');
document.getElementById('verD').textContent = 'v' + APP_VERSION;

const jaDate = d => { const [y, m, dd] = d.split('-').map(Number); return `${y}年${m}月${dd}日`; };
const relList = items => `<ul>${items.map(n => typeof n === 'string' ? `<li>${n}</li>` : `<li class="relgi"><b class="relg">${n.g}</b>${relList(n.items)}</li>`).join('')}</ul>`; // (nested bullets: groups, then their changes)
function renderNews() { // the drawer's release notes
  const el = document.getElementById('news'), newer = updLatest && updLatest !== APP_VERSION;
  el.innerHTML = `<div class="nowver">${L('This page', 'このページ')}：<b>v${APP_VERSION}</b>${newer ? ` · ${L('live', '公開中')}：<b>v${updLatest}</b> <button class="pill" data-u="reload">${L('Reload', '再読み込み')}</button>` : ''}</div>`
    + RELEASES.map(r => `<div class="rel"><div class="relh"><b>v${r.v}</b><span>${jaDate(r.date)}</span></div>${relList(r.notes)}</div>`).join('');
  bindUpd(el);
}
function freshReload() { // load the page again around the browser's cache: a new address each time (tidied away once it's loaded)
  const u = new URL(location.href); u.searchParams.set('r', Date.now().toString(36)); location.replace(u.href);
}
async function eraseSiteData() { // everything this site keeps in the browser: settings, caches, service workers
  try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
  try { if (window.caches) for (const k of await caches.keys()) await caches.delete(k); } catch (e) {}
  try { if (navigator.serviceWorker) for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister(); } catch (e) {}
  freshReload();
}
async function checkUpdate() {
  if (location.protocol === 'file:' || Date.now() - updLast < 60000) return; // (opened from a file: nothing to compare)
  updLast = Date.now();
  try {
    const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
    const v = r.ok && String((await r.json()).version || '');
    if (v) updLatest = v;
  } catch (e) {} // (offline)
}
function showUpdatePrompt() {
  updEl.innerHTML = `<div class="updc">
    <div class="updt" id="updTitle">${L('A new version is available', '新しいバージョンがあります')}</div>
    <p>${L(`Version ${updLatest} is out (this page is ${APP_VERSION}). Reload without the browser's cache to get it. If it still doesn't update, erase this site's data and reload: your settings go back to their defaults.`,
      `v${updLatest} が公開されています（このページは v${APP_VERSION}）。キャッシュを使わずに再読み込みして、最新版にしてください。それでも更新されないときは、サイトのデータを消去して再読み込みしてください（言語などの設定は初期状態に戻ります）。`)}</p>
    <div class="updb"><button class="go" data-u="reload">${L('Reload', '再読み込み')}</button><button class="ghost" data-u="erase">${L('Erase data and reload', 'データを消去して再読み込み')}</button><button class="ghost" data-u="later">${L('Later', 'あとで')}</button></div>
  </div>`;
  updEl.hidden = false; bindUpd(updEl); updEl.querySelector('[data-u=reload]').focus();
}
function showToast(v) { // just updated: a note pointing to what's new
  toastEl.innerHTML = `<span>${L(`Updated to v${v}`, `v${v} に更新しました`)}</span><button class="pill" data-u="news">${L('What’s new', '更新情報')}</button><button class="pill" data-u="close" aria-label="${L('Close', '閉じる')}">✕</button>`;
  toastEl.hidden = false; bindUpd(toastEl); setTimeout(() => { toastEl.hidden = true; }, 12000);
}
function bindUpd(root) {
  root.querySelectorAll('[data-u]').forEach(b => b.addEventListener('click', () => {
    const u = b.dataset.u;
    if (u === 'reload') { try { if (updLatest) sessionStorage.setItem('sq-upd-tried', updLatest); } catch (e) {} freshReload(); } // (if that still isn't it, it isn't asked again this visit)
    else if (u === 'erase') eraseSiteData();
    else if (u === 'later') { try { sessionStorage.setItem('sq-upd-later', updLatest); } catch (e) {} updEl.hidden = true; }
    else if (u === 'news') { toastEl.hidden = true; openDrawer(true, 'news'); }
    else if (u === 'close') toastEl.hidden = true;
  }));
}
function updTick() { // never in the middle of a fight: asked once it's over or paused
  const busy = game.mode === 'fight' && !game.paused;
  if (updToast && !busy && game.mode !== 'opening') { showToast(updToast); updToast = null; }
  if (!updLatest || updLatest === APP_VERSION || updAsked === updLatest || busy) return;
  try { if (sessionStorage.getItem('sq-upd-later') === updLatest || sessionStorage.getItem('sq-upd-tried') === updLatest) return; } catch (e) {}
  updAsked = updLatest; showUpdatePrompt();
}
(() => {
  const u = new URL(location.href); // tidy the address after a reload around the cache
  if (u.searchParams.has('r')) { u.searchParams.delete('r'); history.replaceState(null, '', u.pathname + u.search + u.hash); }
  let seen = null; try { seen = localStorage.getItem('sq-version'); localStorage.setItem('sq-version', APP_VERSION); } catch (e) {}
  if (seen && seen !== APP_VERSION) updToast = APP_VERSION;
})();
addEventListener('keydown', e => { // the prompt is open: keys go to its buttons, not the game (Esc: later)
  if (updEl.hidden) return;
  if (e.key === 'Escape') { const b = updEl.querySelector('[data-u=later]'); if (b) b.click(); }
  e.stopImmediatePropagation();
}, true);
setTimeout(checkUpdate, 2500); setInterval(checkUpdate, 10 * 60 * 1000); setInterval(updTick, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkUpdate(); });
