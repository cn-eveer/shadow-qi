'use strict';
/* ================= version, release notes (更新情報) and the update check ================= */
// RELEASES: newest first, always written in Japanese. The running version is the ?v= this script was loaded with (index.html);
// version.json on the server says which version is live. When the two differ, the player is asked to reload without the
// browser's cache, or to erase the site's saved data and reload.
const RELEASES = [
  { v: '1.3.8', date: '2026-10-27', notes: [
    'ジェシーの弾は10発に。射撃する攻撃は1回につき1発を使う（何発撃つ技でも1発）',
    '撃ち尽くすと5秒間のリロード。移動・ジャンプ・ガードはできるが、撃っても「カチッ」と空撃ちになる。ダイナマイト、決闘、真昼の決闘は弾を使わない',
    '残りの弾は名前の横に表示。リロード中は灰色で埋まっていき、完了すると金色に戻る。CPUのジェシーはリロード中、距離を取ってガードする',
    'アプリ内に「更新情報」とバージョン表示を追加（設定とタイトル画面）',
    '新しいバージョンが公開されると、キャッシュを使わずに再読み込みするか、サイトのデータを消去して再読み込みするかを確認するように',
  ] },
  { v: '1.3.7', date: '2026-10-27', notes: [
    'Uの連撃を無限につなげられないように：連撃（U、U、U、U、Kやそれより短いもの、J、J、K）が終わると、ひと息ついて、相手が少し動けるようになるまで攻撃できない。単発のUやJも、当たるかガードされると少し間があく',
    '攻撃の高さでガードが決まるように：上段はしゃがむとかわせる。上中段と中段はどちらのガードでも防げる。中下段（床から伸び上がる打ち上げ・バウンド・落下技・足元まで届く大振り）はしゃがみガードに当たる（「中下段！」）。下段（足払い・スライディング。打ち上げるものも含む）はしゃがみガードで防ぐ',
    'トレーニングで、攻撃が当たった高さ（上段・上中段・中段・中下段・下段、空振り）を表示。設定でオン・オフ',
    'アルドリックのU、U、Kの2発目が外れると、相手が動けなくなることがある不具合を修正',
  ] },
  { v: '1.3.6', date: '2026-10-27', notes: [
    '技表からフレームデータを削除',
    'トレーニングとコンボダメージの説明を現在の内容に更新',
  ] },
  { v: '1.3.5', date: '2026-10-27', notes: [
    'ヘッダーを常に1行に。キャッチコピーは「…」で省略し、ページがスクロールしないように',
  ] },
  { v: '1.3.4', date: '2026-10-27', notes: [
    'ロゴの下のキャッチコピーを現在のゲーム内容に更新',
    'ゲームが始まる前に表示される文章を日本語に',
  ] },
  { v: '1.3.3', date: '2026-10-27', notes: [
    'ページのタイトルと説明を日本語に。リンクのプレビュー（画像・サイト名など）を充実',
    'ホーム画面に追加したときのアプリ情報を更新',
  ] },
  { v: '1.3.2', date: '2026-10-27', notes: [
    'オープニングがなめらかに（高リフレッシュレートの画面でも）。ハイライトが始まるときの引っかかりを解消',
    'スマホで、メニュー・対戦・一時停止の間で画面の大きさが変わらないように。メニューは画面に収まるよう縮小',
  ] },
  { v: '1.3.1', date: '2026-10-27', notes: [
    'コンボの打ち上げ（L）とバウンド（B）は L L、L L B、L B、L B L、B B、B L だけ（それぞれ締めの一撃つき）。それ以外はコンボから外れる（LIFT LIMIT / BOUNCE LIMIT）',
    '空中のU、Uは相手を少し止めるだけ。2回目の打ち上げの後は相手を落とす',
    'コンボが長いほど1ヒットのダメージが下がる（2ヒット目は90%、以降1ヒットごとに8%減。2回目の打ち上げ・バウンドの後はさらに60%）',
    'すべてのコンボ見本を新しいルールに合わせて調整',
    'スマホの操作ボタンを画面の横のパネルに。更新のたびに新しいゲームファイルを読み込むように',
  ] },
  { v: '1.3.0', date: '2026-10-26', notes: [
    '新しい音楽（対戦が盛り上がるほど楽器が増えていくピアノ曲）、アナウンサーの声、キャラごとの打撃音',
    '無限コンボを防止（打ち上げとバウンドの回数を制限）。バウンドの威力アップ',
    '全キャラに最大コンボの見本を追加',
    'CPUの強さを4段階に（かんたん・ふつう・むずかしい・地獄）',
    '日本語を標準の言語に。ラウンド前の登場ポーズ',
  ] },
  { v: '1.2.0', date: '2026-10-26', notes: [
    '新しいオープニング（星空と魔法陣のプロローグ、ハイライト、全員が登場するフィナーレ）',
    '勝利アニメーション：残り体力に応じて3種類、試合に勝つとさらに大きく喜ぶ（セリフつき）',
    'トレーニングの技カード（技名とコマンドを1つずつ表示）',
    'MPゲージをガードゲージの下に',
  ] },
  { v: '1.1.1', date: '2026-10-26', notes: [
    'スマホで画面いっぱいに表示。タッチ操作のボタンを小さく',
    'トレーニングに技表ボタン（L）を追加',
    'キャラ選択のメニューを細く軽く',
  ] },
  { v: '1.1.0', date: '2026-10-26', notes: [
    '新キャラ4人：アルドリック（聖騎士）、カッパ（幻獣カッパ）、ジェシー（ガンマン）、田中（サラリーマン）',
    '溜め攻撃（Iを長押し）',
    'スマホ・タブレットに対応（タッチ操作、ホーム画面に追加）',
    'メイとライラのバランスを調整',
  ] },
  { v: '1.0.3', date: '2026-10-26', notes: [
    'READMEを新しく（オープニングの画像、キャラ紹介、操作方法など）',
  ] },
  { v: '1.0.2', date: '2026-10-25', notes: [
    'ダメージのバランス：大技よりコンボが強く（強い技は80%、空中の相手には60%）',
    'ライラの連撃に間を追加。メイのラッシュ技を調整',
    'クロの居合斬りなどのダメージを調整',
  ] },
  { v: '1.0.1', date: '2026-10-25', notes: [
    'ライラのコンボを強化（空中追撃のダメージアップ、2回打ち上げるコンボの続き）',
  ] },
  { v: '1.0.0', date: '2026-10-25', notes: [
    '画面がよりくっきり。一時停止メニュー（Esc）とラウンド開始のカウントダウン',
    'オンライン対戦の改善（同じキャラは色違いに、再戦の不具合を修正）',
    'バランス調整（CPUの反応、テツのアーマー、メイとライラの押し戻し、クロの技）',
    '← ← で素早いバックダッシュ',
  ] },
];
const APP_VERSION = ((document.currentScript && /[?&]v=([\d.]+)/.exec(document.currentScript.src)) || [])[1] || RELEASES[0].v;
let updLatest = null, updLast = 0, updAsked = null, updToast = null;
const updEl = document.getElementById('upd'), toastEl = document.getElementById('utoast');
document.getElementById('verD').textContent = 'v' + APP_VERSION;

const jaDate = d => { const [y, m, dd] = d.split('-').map(Number); return `${y}年${m}月${dd}日`; };
function renderNews() { // the drawer's release notes
  const el = document.getElementById('news'), newer = updLatest && updLatest !== APP_VERSION;
  el.innerHTML = `<div class="nowver">${L('This page', 'このページ')}：<b>v${APP_VERSION}</b>${newer ? ` · ${L('live', '公開中')}：<b>v${updLatest}</b> <button class="pill" data-u="reload">${L('Reload', '再読み込み')}</button>` : ''}</div>`
    + RELEASES.map(r => `<div class="rel"><div class="relh"><b>v${r.v}</b><span>${jaDate(r.date)}</span></div><ul>${r.notes.map(n => `<li>${n}</li>`).join('')}</ul></div>`).join('');
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
