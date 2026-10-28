'use strict';
// Move list: Jesse, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card gunman" data-tab="gunman" data-lang="en">
      <h2>JESSE<span>Gunslinger</span></h2>
      <p class="blurb">A gunslinger in a wide-brimmed hat and a long duster coat, a revolver in each hand. Every attack is a gunshot: no punches, no kicks. He even keeps opponents in the air by shooting them. His shots reach about a third of the stage (mid range), and he likes to jump and shoot.</p>
      <p class="note"><b>v1.3.9: shot heights.</b> Every ordinary shot flies at upper-body height: it hits anyone standing (even the small kappa), and a crouching fighter ducks under it. Aimed upward (Sky Shot, the air shots) they go higher still. Low shots (J, ↓ + J, ↓ + K): he drops into a crouch and fires at knee height — guard them crouching.</p>
      <p class="note"><b>High Noon (v1.3.9).</b> It now reaches across the whole stage and every shot strikes at their feet — a low: they have to guard it crouching, or jump over it — with bright tracers from his guns to the floor, sparks where it hits and one huge last shot.</p>
      <p class="note"><b>Holstered.</b> At rest his hands sit on his guns in their holsters; they come out in a flash only when he attacks, and go back a moment after. Every shot now has a bigger muzzle flash.</p>
      <p class="note"><b>Guns.</b> His bullets are fast with long tracers and big muzzle flashes; charged shots are huge, shake the screen and kick him back with the recoil.</p>
      <p class="note"><b>Fifteen bullets.</b> His guns hold 15 bullets, shown next to his name. Every shooting attack uses one, however many shots it fires. When the last one is gone he reloads for 4 seconds: he can still move, jump and guard, but a shot only clicks on an empty chamber until the bullets turn gold again. Dynamite, Showdown and High Noon don’t need bullets.</p>
      <p class="note"><b>Theme.</b> Desert sundown · amber and dust. A drifter who never draws second. Signatures: U, U, K Hammer Fan Finale (a gun twirl, then three fanned shots); U, U, I Ricochet Launcher (a shot off the floor lifts them).</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Hip Shot<small>U: a quick shot from the hip; it reaches about a third of the stage.</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>Twin Shot / charge<small>I: both guns at once. Hold I to charge: at 0.4 seconds the Charged Twin Shot (two big bullets), at 0.9 seconds the Thunder Shot, one huge bullet that pierces right through and knocks them down.</small></td><td class="keys"><kbd>I</kbd> (hold)</td></tr>
          <tr><td>Low Shot<small>J: a shot at their feet (hits low).</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>Heavy Shot / charge<small>K: a big shot that knocks them down. Hold K to charge: at 0.4 seconds the Charged Heavy Shot, at 0.9 seconds the Buffalo Blast, a huge blast of pellets that launches them for a juggle.</small></td><td class="keys"><kbd>K</kbd> (hold)</td></tr>
          <tr><td>Sky Shot<small>Fires upward at an angle and lifts them.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>Air shots<small>J and K in the air shoot down at an angle.</small></td><td class="cmd">in the air</td></tr>
          <tr><td>Fan the Hammer<small>Six fast shots.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Quick Draw / Dead-Eye<small>Tap: one lightning-fast shot that staggers them. Hold: a crosshair locks on, then the Dead-Eye Shot pierces right across the stage.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Roll Shot<small>Rolls forward (untouchable while rolling) and fires both guns.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Jump Shot<small>Leaps forward and fires three shots down on them.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Dynamite<small>A lit stick lobbed at them; it blows them into the air.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Make ’em Dance<small>Shots at their feet; the last one leaves them dancing on the spot (stunned).</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Backflip Shot<small>Flips away (untouchable at first) and shoots on the way.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Showdown<small>Waits with his hand on the holster. Attack him from the front and he draws first, lifting them into a juggle.</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>Super: High Noon<small>Everything stops: six shots from the hip, then one that knocks them flat.</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="gunman">▶ Watch Jesse’s combos</button>
      <p class="note">His juggles are aimed shots: juggle shot, twin juggle shot, finishing blast.</p>
      <p class="note"><b>Combo strings.</b> U, U, U, U, K: second shot, cross draw, spin shot, point-blank blast. I from any point: Sky Shot launches; K ends with a heavy shot. J, J, K: low shot, ground shot. In a juggle: juggle shot, twin juggle shot, finishing blast.</p>
          <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (juggle shot, twin juggle shot, coin shot, six-shooter finale). Jumping after them, U, U, I and U, U, K become: air shot, air twin shot, air fan, diving volley.</p>
      <h3>Max combos</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>9. Max combo: lift, lift<small>↓ + I, U, I (Coin Shot), K.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>10. Max combo: lift, bounce, lift<small>↓ + I, U, W, U, ↓ + K (Dive Shot), U, I (Coin Shot), K.</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card gunman" data-tab="gunman" data-lang="ja" hidden>
      <h2>ジェシー<span>ガンマン</span></h2>
      <p class="blurb">つば広の帽子にロングコート、両手にリボルバー。攻撃はすべて射撃：パンチもキックもなし。空中の相手も撃ち続けて落とさない。弾は画面の約3分の1（中距離）まで届き、跳びながら撃つのが得意。</p>
      <p class="note"><b>v1.3.9：弾の高さ。</b>通常の射撃は胸の高さ（中上段）：立っている相手には当たり（小さなカッパにも）、しゃがめばくぐってかわせる。スカイショットや空中射撃はさらに上を狙う。下段の射撃（J・↓+J・↓+K）は、しゃがんで膝の高さで撃つ（しゃがみガードで防ぐ）。</p>
      <p class="note"><b>真昼の決闘（v1.3.9）。</b>画面のどこにいても届き、すべての弾が足元を撃つ下段に。しゃがみガードかジャンプでしか防げない。銃から床まで光る弾道、着弾の火花、最後の一発は特大。</p>
      <p class="note"><b>ホルスター。</b>構えでは手をホルスターの銃に添えている。攻撃するときだけ一瞬で抜き、少しすると戻す。発砲の閃光も大きくなった。</p>
      <p class="note"><b>銃。</b> 弾は速く、長い光跡と大きな銃口の閃光。溜め撃ちは巨大で画面が揺れ、反動で後ろに下がる。</p>
      <p class="note"><b>弾は15発。</b>残りの弾は名前の横に表示。射撃する攻撃は1回につき1発を使う（何発撃つ技でも1発）。撃ち尽くすと4秒間のリロード：移動・ジャンプ・ガードはできるが、弾が金色に戻るまでは撃っても「カチッ」と空撃ちになる。ダイナマイト、決闘、真昼の決闘は弾を使わない。</p>
      <p class="note"><b>テーマ.</b> 砂漠の夕日・琥珀と砂ぼこり。決して後れを取らない流れ者。決め技：U、U、K「ファニング・フィナーレ」（銃を回して3連射）／U、U、I「跳弾打ち上げ」（床で跳ねた弾が浮かせる）。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>腰だめ撃ち<small>U：腰だめの素早い一発。画面の約3分の1まで届く。</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>二丁撃ち／溜め撃ち<small>I：両方の銃で同時に撃つ。押し続けると溜め撃ち：0.4秒で「チャージ二丁撃ち」（大きな弾2発）、0.9秒で貫通する巨大な一発「サンダーショット」。</small></td><td class="keys"><kbd>I</kbd>（長押し）</td></tr>
          <tr><td>ロウショット<small>J：足元を撃つ（下段）。</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>ヘビーショット／溜め撃ち<small>K：ダウンを奪う大きな一発。押し続けると溜め撃ち：0.4秒で「チャージヘビーショット」、0.9秒で巨大な散弾「バッファローブラスト」で打ち上げ。</small></td><td class="keys"><kbd>K</kbd>（長押し）</td></tr>
          <tr><td>スカイショット<small>斜め上へ撃って浮かせる。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>空中射撃<small>空中のJとKは斜め下へ撃つ。</small></td><td class="cmd">空中で</td></tr>
          <tr><td>ファニング<small>6連射。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>早撃ち／デッドアイ<small>押すだけ：電光石火の一発でよろめかせる。押し続ける：照準が合い、画面を貫く「デッドアイショット」。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>ロールショット<small>前転して（転がる間は無敵）両手で撃つ。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>ジャンプショット<small>前へ跳び、上から3発撃ち込む。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>ダイナマイト<small>火のついたダイナマイトを投げ、爆発で宙へ。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>踊らせ撃ち<small>足元を撃ちまくり、最後の一発でその場で踊らせる（気絶）。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>バク転ショット<small>バク転で下がり（出始めは無敵）、空中で撃つ。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>決闘<small>ホルスターに手をかけて待つ。正面から攻撃されると先に抜き、空中追撃へ。</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>超必殺技：真昼の決闘<small>時が止まり、腰だめの6連射、最後の一発でダウン。</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="gunman">▶ ジェシーのコンボを見る</button>
      <p class="note">空中追撃は狙い撃ち：追い撃ち・二丁追い撃ち・とどめの一発。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：二発目・クロスドロー・回転撃ち・至近距離の一撃。途中のIでスカイショット（打ち上げ）、Kでヘビーショット。J、J、K：ロウショット・グラウンドショット。空中追撃：追い撃ち・二丁追い撃ち・とどめの一発。</p>
          <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（追い撃ち、二丁追い撃ち、コイン撃ち、六連発フィナーレ）。ジャンプして追うと、U、U、IとU、U、Kは：空中射撃、空中二丁撃ち、空中ファニング、急降下連射。</p>
      <h3>最大コンボ</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>9. 最大コンボ：打ち上げ・打ち上げ<small>↓+I、U、I（コインショット）、K。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>10. 最大コンボ：打ち上げ・バウンド・打ち上げ<small>↓+I、U、W、U、↓+K（ダイブショット）、U、I（コインショット）、K。</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
    </article>
`);
