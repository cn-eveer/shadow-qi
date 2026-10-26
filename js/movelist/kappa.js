'use strict';
// Move list: Kappa, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card kappa" data-tab="kappa" data-lang="en">
      <h2>KAPPA<span>Mythic Kappa</span></h2>
      <p class="blurb">A small, round, very cute kappa with a turtle shell and a dish of water on his head, and a wild animal at heart: he crouches low like a beast, and almost everything he does is a claw attack that leaves three glowing slash marks. He never kicks; the kick buttons grab and throw (throws can’t be guarded, but they miss anyone in the air).</p>
      <p class="note"><b>Poison.</b> Land four separate attacks within two seconds and the river venom poisons them: they slowly lose health and move slower, until it wears off after about six seconds.</p>
      <p class="note"><b>Charge (hold I).</b> Qi gathers into him while you hold. Half a second: Ambush, a short charge: he darts in low and rakes them into the air — follow it with a juggle. Over a second: Dish Storm, a long charge: a whole stack of dishes thrown in a storm, the last one sends them flying. A tap is the normal heavy attack.</p>
      <p class="note"><b>Theme.</b> River spirit · teal and water blue. A wild little creature from a mountain stream. Signatures: U, U, K Whirlpool Rake (a spinning whirlpool of claws); U, U, I Splash Geyser (a belly-flop splash, then a geyser under them).</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Claw Swipe and Rending Claws<small>U: a downward claw swipe. I: both claws crossing in an X.</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>Sumo Toss<small>J: grabs them and swings them over his head to the floor.</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>Whirlpool Toss<small>K: grabs them and throws them high over his head for a juggle.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Upward Rake<small>Up close: rakes upward and lifts them.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>Plate Throw<small>The dish on his head flies out spinning and comes back (he’s bald until it does).</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Water Cannon<small>A jet of water from his beak: five hits that push them away.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Pounce<small>Leaps on them like a wild animal, latches on, rakes three times, then kicks off them into the air.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Claw Frenzy<small>A wild, screeching flurry of claws, seven hits.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Water Bubble<small>A lobbed bubble that bursts and leaves them dizzy and dripping (stunned).</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Geyser<small>A column of water bursts up under them, wherever they are, and throws them high.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Shell Guard<small>Pulls into his shell: everything bounces off, and if something did, he spins out of it.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Cucumber Snack<small>Munches a cucumber to heal a little. A hit while he eats is a counter hit.</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>Super: Great Flood<small>A wave rises behind him and sweeps across the stage, carrying them away.</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="kappa">▶ Watch Kappa’s combos</button>
      <p class="note">In the air, J drops a ball of water. His juggles are all claws: rake lift, double rake, frenzy finish.</p>
      <p class="note"><b>Combo strings.</b> U, U, U, U, then K: backhand claw, beak bite, double rake, and the string ends in the Whirlpool Toss, a throw that launches them. I from any point: Upward Rake launches; K early ends with a shell slam. In a juggle: rake lift, beak peck (three pecks), rising rake, shell cannonball. In the air: rake, peck, claw flurry, shell spin.</p>
          <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (rake lift, beak peck, geyser hop, shell cannonball). Jumping after them, U, U, I and U, U, K become: air rake, air peck, rain claws, waterfall dive.</p>
      <h3>Frame data</h3>
<p class="note"><b>Frame data.</b> Measured from the game itself at 60 frames a second. <b>Startup</b>: frames from pressing the button until it hits (for a string, the frames that hit takes after the previous one; for moves that travel, at the distance shown). <b>On guard / On hit</b>: who recovers first after it connects — plus means the attacker can act first, minus means the defender can. <b>After</b>: frames from the moment it hits until he can guard again (if it misses). <b>Total</b>: frames from the press until he can guard again if it misses (startup + after). <b>Damage</b>: what it does when it hits (for a string, the whole string; later hits in a combo keep 65–95% depending on how long they take). Until then he can’t guard, so a whiffed or guarded move with a big minus can be punished: a light punch (U) hits on frame 4–8 and a launcher (↓+I) on frame 13–16, and how far they reach depends on the fighter: U reaches about 80–95px for Kappa, Kuro, Tanaka and Tetsu, 160–185px for Lyra, Mei and Aldric, and further with Jesse’s shot; ↓+I reaches 85–95px for Kuro, Tanaka and Tetsu and 120–225px for the others. <b>Punish</b> combines the minus with the distance left after the pushback. Tetsu’s armor shrugs off light hits while he attacks, so punish him with a heavy attack.</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>Command</th><th>Move</th><th>Damage</th><th>Startup</th><th>After</th><th>On guard</th><th>On hit</th><th>Total</th><th>Punish</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Claw Swipe</td><td><b>42</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I</td><td>Rending Claws</td><td><b>78</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>+3</td><td>39</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (112px)</td></tr>
          <tr><td class="cmd">J</td><td>Sumo Toss</td><td><b>60</b></td><td>9</td><td>24</td><td class="">throw</td><td>knockdown</td><td>33</td><td class="pu tw">Can't be guarded (throw)</td></tr>
          <tr><td class="cmd">K</td><td>Whirlpool Toss</td><td><b>75</b></td><td>16</td><td>28</td><td class="">throw</td><td>launch</td><td>44</td><td class="pu tw">Can't be guarded (throw)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>42</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+I</td><td>Upward Rake</td><td><b>98</b></td><td>18</td><td>19</td><td class="neg">−10</td><td>launch</td><td>37</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (111px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Low Claw</td><td><b>47</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+K</td><td>Ankle Rake</td><td><b>104</b></td><td>17</td><td>24</td><td class="neg">−10</td><td>knockdown</td><td>41</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (112px)</td></tr>
          <tr><td class="cmd">U U</td><td>Backhand Claw</td><td><b>66</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U</td><td>Beak Bite</td><td><b>89</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U</td><td>Double Rake</td><td><b>116</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Whirlpool Toss</td><td><b>180</b></td><td>15</td><td>—</td><td class="">throw</td><td>launch</td><td>—</td><td class="pu tw">Can't be guarded (throw)</td></tr>
          <tr><td class="cmd">U U K</td><td>Whirlpool Rake</td><td><b>126</b></td><td>14</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (142px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Splash Geyser</td><td><b>101</b></td><td>16</td><td>—</td><td class="neg">−11</td><td>launch</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (117px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Plate Throw</td><td><b>39</b></td><td>12</td><td>20</td><td class="neg">−8</td><td>±0</td><td>32</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (106px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Water Cannon</td><td><b>52</b></td><td>31</td><td>41</td><td class="neg">−36</td><td>knockdown</td><td>72</td><td class="pu ok">Minus, but out of reach (220px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Pounce</td><td><b>65</b></td><td>34</td><td>97</td><td class="neg">−32</td><td>launch</td><td>131</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">→→+K</td><td>Claw Frenzy</td><td><b>48</b></td><td>28</td><td>45</td><td class="neg">−20</td><td>knockdown</td><td>73</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (141px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Water Bubble</td><td><b>34</b></td><td>31</td><td>21</td><td class="neg">−36</td><td>stun</td><td>52</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (181px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Geyser</td><td><b>48</b></td><td>38</td><td>24</td><td class="neg">−49</td><td>launch</td><td>62</td><td class="pu ok">Minus, but out of reach (215px)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Shell Guard</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>47</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Cucumber Snack</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>75</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">U+J (super)</td><td>Great Flood</td><td><b>181</b></td><td>68</td><td>80</td><td class="pos">+3</td><td>launch</td><td>148</td><td class="pu ok">Safe</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card kappa" data-tab="kappa" data-lang="ja" hidden>
      <h2>カッパ<span>幻獣カッパ</span></h2>
      <p class="blurb">甲羅と頭の皿の、小さくて丸くてとても可愛いカッパ。でも中身は野生の獣：獣のように低く構え、ほとんどの攻撃が光る三本の爪痕を残す爪攻撃。蹴りは使わず、キックボタンはつかみ投げ（ガード不能、空中の相手には当たらない）。</p>
      <p class="note"><b>毒。</b> 2秒以内に4回攻撃を当てると川の毒が回り、相手は少しずつ体力を失い動きが遅くなる（約6秒で治る）。</p>
      <p class="note"><b>溜め技（I長押し）。</b> 押している間、気が集まる。0.5秒：奇襲（短い溜め：低く飛び込んで爪で浮かせる）、空中追撃につながる。1秒以上：皿の嵐（長い溜め：皿を次々と投げ、最後の一枚で吹き飛ばす）。押すだけなら通常の強攻撃。</p>
      <p class="note"><b>テーマ.</b> 川の精・青緑と水色。山の渓流に住む野生の小さな生き物。決め技：U、U、K「渦巻き引っかき」（爪の渦巻き）／U、U、I「水しぶき間欠泉」（腹打ちの水しぶきから足元に間欠泉）。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>爪払いと引き裂き爪<small>U：振り下ろす爪。I：両手の爪をX字に交差させる。</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>相撲投げ<small>J：つかんで頭越しに床へ投げる。</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>渦巻き投げ<small>K：つかんで頭越しに高く投げ上げ、空中追撃へ。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>爪かき上げ<small>至近距離で上へかき上げて浮かせる。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>皿投げ<small>頭の皿が回転して飛び、戻ってくる（戻るまで頭はつるつる）。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>水鉄砲<small>くちばしから水の噴射。5ヒットで押し出す。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>飛びかかり<small>野生の獣のように飛びかかってしがみつき、3回引っかいてから蹴り上げる。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>狂乱の爪<small>奇声とともに爪を振り乱す7連撃。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>水玉<small>山なりの水玉。はじけると相手はずぶ濡れで目を回す（気絶）。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>間欠泉<small>相手の足元から水柱が噴き上がり、高く打ち上げる。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>甲羅ガード<small>甲羅にこもる：すべて弾き、何かを弾いたら回転して飛び出す。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>きゅうりおやつ<small>きゅうりをかじって少し回復。食べている間に受けた攻撃はカウンター。</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>超必殺技：大洪水<small>背後から大波が立ち上がり、画面を押し流して相手をさらう。</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="kappa">▶ カッパのコンボを見る</button>
      <p class="note">空中のJは水玉を落とす。空中追撃もすべて爪：かき上げ追撃・二連かき・狂乱の締め。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：裏爪・くちばし噛み・二連かき、締めは2つ目の投げ「渦巻き投げ」で打ち上げ。途中のIで爪かき上げ、早めのKで甲羅叩き。空中追撃：かき上げ・くちばし3連突き・昇りかき・甲羅砲弾。</p>
          <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（かき上げ、くちばし突き、間欠泉ジャンプ、甲羅砲弾）。ジャンプして追うと、U、U、IとU、U、Kは：空中かき、空中つつき、雨の爪、滝下り。</p>
      <h3>フレームデータ</h3>
<p class="note"><b>フレームデータ。</b> ゲーム本体で計測（1秒＝60フレーム）。<b>発生</b>：ボタンを押してから当たるまで（連続技は前の攻撃からの間隔、飛ぶ技は表示の距離で計測）。<b>ガード時／ヒット時</b>：当たった後どちらが先に動けるか。＋は攻撃側、－は防御側が先に動ける。<b>ヒット後</b>：当たる瞬間から再びガードできるまで（空振り時）。<b>全体</b>：空振りした場合、押してから再びガードできるまで（発生＋ヒット後）。 <b>ダメージ</b>：当たったときのダメージ（連続技は全体の合計。コンボの後半の攻撃は、時間のかかる技ほど65〜95%が残る）。それまではガードできないので、大きく不利な技は反撃される。弱パンチ（U）は4〜8フレーム目、打ち上げ（↓+I）は13〜16フレーム目に当たり、届く距離はキャラごとに違う：Uはカッパ・クロ・田中・テツが約80〜95px、ライラ・メイ・アルドリックが160〜185px、ジェシーの射撃はさらに遠く。↓+Iはクロ・田中・テツが85〜95px、他は120〜225px。<b>反撃</b>は不利フレームと押し返し後の距離から判定。テツは攻撃中アーマーで弱攻撃を受け流すので、強攻撃で反撃すること。</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>コマンド</th><th>技</th><th>ダメージ</th><th>発生</th><th>ヒット後</th><th>ガード時</th><th>ヒット時</th><th>全体</th><th>反撃</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Claw Swipe</td><td><b>42</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I</td><td>Rending Claws</td><td><b>78</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>+3</td><td>39</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (112px)</td></tr>
          <tr><td class="cmd">J</td><td>Sumo Toss</td><td><b>60</b></td><td>9</td><td>24</td><td class="">投げ</td><td>ダウン</td><td>33</td><td class="pu tw">ガード不能（投げ）</td></tr>
          <tr><td class="cmd">K</td><td>Whirlpool Toss</td><td><b>75</b></td><td>16</td><td>28</td><td class="">投げ</td><td>打ち上げ</td><td>44</td><td class="pu tw">ガード不能（投げ）</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>42</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+I</td><td>Upward Rake</td><td><b>98</b></td><td>18</td><td>19</td><td class="neg">−10</td><td>打ち上げ</td><td>37</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (111px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Low Claw</td><td><b>47</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+K</td><td>Ankle Rake</td><td><b>104</b></td><td>17</td><td>24</td><td class="neg">−10</td><td>ダウン</td><td>41</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (112px)</td></tr>
          <tr><td class="cmd">U U</td><td>Backhand Claw</td><td><b>66</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U</td><td>Beak Bite</td><td><b>89</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U</td><td>Double Rake</td><td><b>116</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Whirlpool Toss</td><td><b>180</b></td><td>15</td><td>—</td><td class="">投げ</td><td>打ち上げ</td><td>—</td><td class="pu tw">ガード不能（投げ）</td></tr>
          <tr><td class="cmd">U U K</td><td>Whirlpool Rake</td><td><b>126</b></td><td>14</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (142px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Splash Geyser</td><td><b>101</b></td><td>16</td><td>—</td><td class="neg">−11</td><td>打ち上げ</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (117px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Plate Throw</td><td><b>39</b></td><td>12</td><td>20</td><td class="neg">−8</td><td>±0</td><td>32</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (106px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Water Cannon</td><td><b>52</b></td><td>31</td><td>41</td><td class="neg">−36</td><td>ダウン</td><td>72</td><td class="pu ok">不利だが届かない (220px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Pounce</td><td><b>65</b></td><td>34</td><td>97</td><td class="neg">−32</td><td>打ち上げ</td><td>131</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">→→+K</td><td>Claw Frenzy</td><td><b>48</b></td><td>28</td><td>45</td><td class="neg">−20</td><td>ダウン</td><td>73</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (141px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Water Bubble</td><td><b>34</b></td><td>31</td><td>21</td><td class="neg">−36</td><td>気絶</td><td>52</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (181px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Geyser</td><td><b>48</b></td><td>38</td><td>24</td><td class="neg">−49</td><td>打ち上げ</td><td>62</td><td class="pu ok">不利だが届かない (215px)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Shell Guard</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>47</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+K</td><td>Cucumber Snack</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>75</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">U+J （超必殺）</td><td>Great Flood</td><td><b>181</b></td><td>68</td><td>80</td><td class="pos">+3</td><td>打ち上げ</td><td>148</td><td class="pu ok">安全</td></tr>
        </tbody>
      </table></div>
    </article>
`);
