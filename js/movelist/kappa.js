'use strict';
// Move list: Kappa, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card kappa" data-tab="kappa" data-lang="en">
      <h2>KAPPA<span>Mythic Kappa</span></h2>
      <p class="blurb">A small, round, very cute kappa with a turtle shell and a dish of water on his head, and a wild animal at heart: he crouches low like a beast, and almost everything he does is a claw attack that leaves three glowing slash marks. He never kicks; the kick buttons grab and throw (throws can’t be guarded, but they miss anyone in the air).</p>
      <p class="note"><b>v1.3.9.</b> Poison now takes only three separate attacks within three seconds, lasts eight seconds and drains twice as fast. His dash is quicker and dives under projectiles (DIVE), and Shell Guard (← ← + J) sends projectiles straight back at whoever fired them. Great Flood now floods the stage (see below). His dash and his Pounce have armor: hits land, but don’t stop him. New on ← ← + K (in place of the Cucumber Snack): <b>Riptide</b>, the answer to anyone who keeps their distance.</p>
      <p class="note"><b>Poison.</b> Land four separate attacks within two seconds and the river venom poisons them: they slowly lose health and move slower, until it wears off after about six seconds.</p>
      <p class="note"><b>Theme.</b> River spirit · teal and water blue. A wild little creature from a mountain stream. Signatures: U, U, K Whirlpool Rake (a spinning whirlpool of claws); U, U, I Splash Geyser (a belly-flop splash, then a geyser under them).</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Claw Swipe and Rending Claws<small>U: a downward claw swipe. I: both claws crossing in an X.</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>Sumo Toss<small>J: grabs them (18F) and swings them over his head to the floor. They are held for ten frames: press I + U together in that time and the throw is broken.</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>Whirlpool Toss<small>K: grabs them (18F) and throws them high over his head for a juggle. They are held for ten frames: press J + K together in that time and the throw is broken (the string-ending throw too).</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Upward Rake<small>Up close: rakes upward and lifts them. (U, ↓ + I is the low version: a low launcher.)</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>Plate Throw<small>The dish on his head flies out spinning and comes back (he’s bald until it does).</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Water Cannon<small>A long jet of water from his beak, reaching about two thirds of the stage: eleven hits that push them away, and it stays out a long time.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Pounce<small>Leaps on them like a wild animal (four tenths of the stage at most), latches on, rakes five times, then kicks off them into the air. Armor: hits don’t stop him.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Claw Frenzy<small>A wild, screeching flurry of claws, twelve hits, reaching further and lasting longer. Armor: hits don’t stop him.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Water Bubble<small>A lobbed bubble that bursts and leaves them dizzy and dripping (stunned).</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Geyser<small>A column of water bursts up under them, wherever they are, and throws them high.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Shell Guard<small>Pulls into his shell: everything bounces off, and if something did, he spins out of it.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Riptide<small>A low wave: the water always rises up behind them, wherever they are, and rolls in toward him, carrying them toward him — half the stage at most, so from end to end they stop at half range — even if they guard. On a hit they arrive stunned: start his ground string. Jump the wave to escape.</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>Super: Great Flood<small>No direct hit: a great wave rolls in and the stage floods for ten seconds, the water a little above head height (a gauge under the timer shows the time left). The kappa swims — faster, ↑ strokes up (a little above a normal jump), ↓ dives — his attacks come out a fifth faster, <b>reach them anywhere on the stage</b> (the water carries every blow), and the water heals him (about 70 health). They wade: three-quarter speed, jumps a quarter slower, attacks a fifth slower to come out — recovery is untouched, so they can still get away and punish — and they slowly drown (about 90 health).</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="kappa">▶ Watch Kappa’s combos</button>
      <p class="note">In the air, J drops a ball of water. His juggles are all claws: rake lift, double rake, frenzy finish.</p>
      <p class="note"><b>Combo strings.</b> U, U, U, U, then K: backhand claw (14F), ankle bite (a low, 17F), tail sweep (a low, 21F), and the string ends in the Whirlpool Toss, a throw that launches them. Press U + I + J together as one of the U hits comes and it is broken. U, ↓ + I: Surfacing Rake, a low launcher; U, ↓ + K: Shell Sweep, a low that trips them. I from any point: Upward Rake launches; K early ends with a shell slam. In a juggle: rake lift, beak peck (three pecks), rising rake, shell cannonball. In the air: rake, peck, claw flurry, shell spin.</p>
          <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (rake lift, beak peck, geyser hop, shell cannonball). Jumping after them, U, U, I and U, U, K become: air rake, air peck, rain claws, waterfall dive.</p>
      <h3>Max combos</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>9. Max combo: lift, lift<small>↓ + I, U, U, I (Geyser Hop), K.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>10. Max combo: lift, bounce, lift<small>↓ + I, U, W, U, ↓ + K (Belly Flop), U, I (Geyser Hop), K.</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card kappa" data-tab="kappa" data-lang="ja" hidden>
      <h2>カッパ<span>幻獣カッパ</span></h2>
      <p class="blurb">甲羅と頭の皿の、小さくて丸くてとても可愛いカッパ。でも中身は野生の獣：獣のように低く構え、ほとんどの攻撃が光る三本の爪痕を残す爪攻撃。蹴りは使わず、キックボタンはつかみ投げ（ガード不能、空中の相手には当たらない）。</p>
      <p class="note"><b>v1.3.9。</b>毒は3秒以内に3回当てるだけで回り、8秒続き、減りも2倍に。ダッシュは速くなり、飛び道具の下をくぐる（DIVE）。甲羅ガード（←←+J）は飛び道具を撃った相手に跳ね返す。大洪水はステージを水没させる技に（下の表）。ダッシュと飛びかかりにはアーマー：攻撃を受けても止まらない。←←+K は、きゅうりおやつに代わって新技<b>引き波</b>に（距離を取る相手への切り札）。</p>
      <p class="note"><b>毒。</b> 2秒以内に4回攻撃を当てると川の毒が回り、相手は少しずつ体力を失い動きが遅くなる（約6秒で治る）。</p>
      <p class="note"><b>テーマ.</b> 川の精・青緑と水色。山の渓流に住む野生の小さな生き物。決め技：U、U、K「渦巻き引っかき」（爪の渦巻き）／U、U、I「水しぶき間欠泉」（腹打ちの水しぶきから足元に間欠泉）。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>爪払いと引き裂き爪<small>U：振り下ろす爪。I：両手の爪をX字に交差させる。</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>相撲投げ<small>J：つかんで（18F）頭越しに床へ投げる。つかまれた相手は10フレーム動けず、その間にI＋Uを同時押しすると投げを外せる。</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>渦巻き投げ<small>K：つかんで（18F）頭越しに高く投げ上げ、空中追撃へ。つかまれた相手は10フレーム動けず、その間にJ＋Kを同時押しすると投げを外せる（連携の締めの投げも同じ）。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>爪かき上げ<small>至近距離で上へかき上げて浮かせる。（U、↓+Iは下段版：下段の打ち上げ。）</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>皿投げ<small>頭の皿が回転して飛び、戻ってくる（戻るまで頭はつるつる）。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>水鉄砲<small>くちばしから長く水を噴射。画面の約3分の2まで届く。11ヒットで押し出し、出ている時間も長い。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>飛びかかり<small>野生の獣のように飛びかかって（最大で画面の4/10）しがみつき、5回引っかいてから蹴り上げる。アーマー：攻撃を受けても止まらない。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>狂乱の爪<small>奇声とともに爪を振り乱す12連撃。リーチも持続も長くなった。アーマー：攻撃を受けても止まらない。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>水玉<small>山なりの水玉。はじけると相手はずぶ濡れで目を回す（気絶）。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>間欠泉<small>相手の足元から水柱が噴き上がり、高く打ち上げる。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>甲羅ガード<small>甲羅にこもる：すべて弾き、何かを弾いたら回転して飛び出す。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>引き波<small>下段の波：相手がどこにいても背後から水がせり上がり、カッパの方へ押し寄せて引き寄せる（最大で画面の半分。端から端なら半分の距離で止まる。ガードしていても引き寄せる）。当たれば気絶したまま来るので、地上の連続技を始められる。波をジャンプすればかわせる。</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>超必殺技：大洪水<small>直接は当たらない：大波が押し寄せ、10秒間ステージが水没する（水面は頭の少し上。タイマーの下のゲージで残り時間がわかる）。カッパは泳いで速く動き（↑で上へ・普通のジャンプより少し高くまで、↓で潜る）、攻撃の出も5分の1速く、<b>攻撃はステージのどこにいても届く</b>（水が一撃を運ぶ）。水で体力も回復する（約70）。相手は水の中を歩くので、移動は4分の3、ジャンプは4分の1ゆっくり、攻撃の出も5分の1遅い（硬直は変わらないので回避も反撃もできる）。さらに溺れて体力が少しずつ減る（約90）。</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="kappa">▶ カッパのコンボを見る</button>
      <p class="note">空中のJは水玉を落とす。空中追撃もすべて爪：かき上げ追撃・二連かき・狂乱の締め。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：裏爪（14F）・足噛み（下段17F）・尾払い（下段21F）、締めは2つ目の投げ「渦巻き投げ」で打ち上げ。U＋I＋Jを同時押しすると、Uの攻撃を外せる。U、↓+I：下段の打ち上げ「浮上かき」／U、↓+K：下段で転ばせる「甲羅払い」。途中のIで爪かき上げ、早めのKで甲羅叩き。空中追撃：かき上げ・くちばし3連突き・昇りかき・甲羅砲弾。</p>
          <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（かき上げ、くちばし突き、間欠泉ジャンプ、甲羅砲弾）。ジャンプして追うと、U、U、IとU、U、Kは：空中かき、空中つつき、雨の爪、滝下り。</p>
      <h3>最大コンボ</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>9. 最大コンボ：打ち上げ・打ち上げ<small>↓+I、U、U、I（間欠泉ホップ）、K。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>10. 最大コンボ：打ち上げ・バウンド・打ち上げ<small>↓+I、U、W、U、↓+K（腹打ち）、U、I（間欠泉ホップ）、K。</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
    </article>
`);
