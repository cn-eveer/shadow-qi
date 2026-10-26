'use strict';
// Move list: Jesse, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card gunman" data-tab="gunman" data-lang="en">
      <h2>JESSE<span>Gunslinger</span></h2>
      <p class="blurb">A gunslinger in a wide-brimmed hat and a long duster coat, a revolver in each hand. Every attack is a gunshot: no punches, no kicks. He even keeps opponents in the air by shooting them. His shots reach about a third of the stage (mid range), and he likes to jump and shoot.</p>
      <p class="note"><b>Holstered.</b> At rest his hands sit on his guns in their holsters; they come out in a flash only when he attacks, and go back a moment after. Every shot now has a bigger muzzle flash.</p>
      <p class="note"><b>Guns.</b> His bullets are fast with long tracers and big muzzle flashes; charged shots are huge, shake the screen and kick him back with the recoil.</p>
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
      <h3>Frame data</h3>
<p class="note"><b>Frame data.</b> Measured from the game itself at 60 frames a second. <b>Startup</b>: frames from pressing the button until it hits (for a string, the frames that hit takes after the previous one; for moves that travel, at the distance shown). <b>On guard / On hit</b>: who recovers first after it connects — plus means the attacker can act first, minus means the defender can. <b>After</b>: frames from the moment it hits until he can guard again (if it misses). <b>Total</b>: frames from the press until he can guard again if it misses (startup + after). <b>Damage</b>: what it does when it hits (for a string, the whole string; later hits in a combo keep 65–95% depending on how long they take). Until then he can’t guard, so a whiffed or guarded move with a big minus can be punished: a light punch (U) hits on frame 4–8 and a launcher (↓+I) on frame 13–16, and how far they reach depends on the fighter: U reaches about 80–95px for Kappa, Kuro, Tanaka and Tetsu, 160–185px for Lyra, Mei and Aldric, and further with Jesse’s shot; ↓+I reaches 85–95px for Kuro, Tanaka and Tetsu and 120–225px for the others. <b>Punish</b> combines the minus with the distance left after the pushback. Tetsu’s armor shrugs off light hits while he attacks, so punish him with a heavy attack.</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>Command</th><th>Move</th><th>Damage</th><th>Startup</th><th>After</th><th>On guard</th><th>On hit</th><th>Total</th><th>Punish</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Hip Shot</td><td><b>30</b></td><td>8</td><td>9</td><td class="pos">+1</td><td>+9</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I</td><td>Twin Shot</td><td><b>59</b></td><td>16</td><td>20</td><td class="neg">−10</td><td>−2</td><td>36</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (110px)</td></tr>
          <tr><td class="cmd">J</td><td>Low Shot</td><td><b>30</b></td><td>8</td><td>11</td><td class="neg">−1</td><td>+7</td><td>19</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">K</td><td>Heavy Shot</td><td><b>68</b></td><td>17</td><td>20</td><td class="neg">−10</td><td>knockdown</td><td>37</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (134px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>41</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+I</td><td>Sky Shot</td><td><b>46</b></td><td>14</td><td>20</td><td class="neg">−10</td><td>launch</td><td>34</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (110px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Crouch Shot</td><td><b>27</b></td><td>8</td><td>11</td><td class="neg">−1</td><td>+7</td><td>19</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+K</td><td>Ground Shot</td><td><b>49</b></td><td>15</td><td>25</td><td class="neg">−15</td><td>knockdown</td><td>40</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (146px)</td></tr>
          <tr><td class="cmd">U U</td><td>Second Shot</td><td><b>52</b></td><td>9</td><td>—</td><td class="neg">−4</td><td>+4</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U</td><td>Cross Draw</td><td><b>77</b></td><td>9</td><td>—</td><td class="neg">−4</td><td>+4</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U</td><td>Spin Shot</td><td><b>99</b></td><td>10</td><td>—</td><td class="neg">−4</td><td>+4</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Point-Blank Blast</td><td><b>156</b></td><td>14</td><td>—</td><td class="neg">−48</td><td>knockdown</td><td>—</td><td class="pu ok">Minus, but out of reach (227px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Hammer Fan Finale</td><td><b>122</b></td><td>14</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (150px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Ricochet Launcher</td><td><b>90</b></td><td>13</td><td>—</td><td class="neg">−10</td><td>launch</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (110px)</td></tr>
          <tr><td class="cmd">J J</td><td>Low Shot 2</td><td><b>52</b></td><td>9</td><td>—</td><td class="neg">−4</td><td>+4</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">J J K</td><td>Ground Shot</td><td><b>95</b></td><td>14</td><td>—</td><td class="neg">−14</td><td>knockdown</td><td>—</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">→→+U</td><td>Fan the Hammer</td><td><b>71</b></td><td>28</td><td>38</td><td class="neg">−36</td><td>knockdown</td><td>66</td><td class="pu ok">Minus, but out of reach (188px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Quick Draw</td><td><b>57</b></td><td>5</td><td>18</td><td class="neg">−8</td><td>+12</td><td>23</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (109px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Roll Shot</td><td><b>62</b></td><td>18</td><td>20</td><td class="neg">−8</td><td>−2</td><td>38</td><td class="pu mid">Light attack (U) punish (everyone)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Jump Shot</td><td><b>77</b></td><td>34 <small>(150px)</small></td><td>—</td><td class="neg">−25</td><td>−2</td><td>65</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">←←+U</td><td>Dynamite</td><td><b>61</b></td><td>73</td><td>-15</td><td class="neg">−48</td><td>launch</td><td>58</td><td class="pu ok">Minus, but out of reach (241px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Make &#x27;em Dance</td><td><b>68</b></td><td>28</td><td>42</td><td class="neg">−36</td><td>stun</td><td>70</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (180px)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Backflip Shot</td><td><b>35</b></td><td>22</td><td>16</td><td class="neg">−6</td><td>+2</td><td>38</td><td class="pu ok">Minus, but out of reach (228px)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Showdown</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>48</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">U+J (super)</td><td>High Noon</td><td><b>192</b></td><td>64</td><td>58</td><td class="pos">+1</td><td>knockdown</td><td>122</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I (held, Thunder Shot)</td><td>Thunder Shot</td><td><b>108</b></td><td>64</td><td>35</td><td class="neg">−20</td><td>launch</td><td>99</td><td class="pu ok">Minus, but out of reach (196px)</td></tr>
          <tr><td class="cmd">K (held, Buffalo Blast)</td><td>Buffalo Blast</td><td><b>97</b></td><td>64</td><td>30</td><td class="neg">−20</td><td>launch</td><td>94</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (178px)</td></tr>
          <tr><td class="cmd">→→+I (held, Dead-Eye)</td><td>Dead-Eye Shot</td><td><b>115</b></td><td>53</td><td>31</td><td class="neg">−8</td><td>launch</td><td>84</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (112px)</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card gunman" data-tab="gunman" data-lang="ja" hidden>
      <h2>ジェシー<span>ガンマン</span></h2>
      <p class="blurb">つば広の帽子にロングコート、両手にリボルバー。攻撃はすべて射撃：パンチもキックもなし。空中の相手も撃ち続けて落とさない。弾は画面の約3分の1（中距離）まで届き、跳びながら撃つのが得意。</p>
      <p class="note"><b>ホルスター。</b>構えでは手をホルスターの銃に添えている。攻撃するときだけ一瞬で抜き、少しすると戻す。発砲の閃光も大きくなった。</p>
      <p class="note"><b>銃。</b> 弾は速く、長い光跡と大きな銃口の閃光。溜め撃ちは巨大で画面が揺れ、反動で後ろに下がる。</p>
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
      <h3>フレームデータ</h3>
<p class="note"><b>フレームデータ。</b> ゲーム本体で計測（1秒＝60フレーム）。<b>発生</b>：ボタンを押してから当たるまで（連続技は前の攻撃からの間隔、飛ぶ技は表示の距離で計測）。<b>ガード時／ヒット時</b>：当たった後どちらが先に動けるか。＋は攻撃側、－は防御側が先に動ける。<b>ヒット後</b>：当たる瞬間から再びガードできるまで（空振り時）。<b>全体</b>：空振りした場合、押してから再びガードできるまで（発生＋ヒット後）。 <b>ダメージ</b>：当たったときのダメージ（連続技は全体の合計。コンボの後半の攻撃は、時間のかかる技ほど65〜95%が残る）。それまではガードできないので、大きく不利な技は反撃される。弱パンチ（U）は4〜8フレーム目、打ち上げ（↓+I）は13〜16フレーム目に当たり、届く距離はキャラごとに違う：Uはカッパ・クロ・田中・テツが約80〜95px、ライラ・メイ・アルドリックが160〜185px、ジェシーの射撃はさらに遠く。↓+Iはクロ・田中・テツが85〜95px、他は120〜225px。<b>反撃</b>は不利フレームと押し返し後の距離から判定。テツは攻撃中アーマーで弱攻撃を受け流すので、強攻撃で反撃すること。</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>コマンド</th><th>技</th><th>ダメージ</th><th>発生</th><th>ヒット後</th><th>ガード時</th><th>ヒット時</th><th>全体</th><th>反撃</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Hip Shot</td><td><b>30</b></td><td>8</td><td>9</td><td class="pos">+1</td><td>+9</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I</td><td>Twin Shot</td><td><b>59</b></td><td>16</td><td>20</td><td class="neg">−10</td><td>−2</td><td>36</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (110px)</td></tr>
          <tr><td class="cmd">J</td><td>Low Shot</td><td><b>30</b></td><td>8</td><td>11</td><td class="neg">−1</td><td>+7</td><td>19</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">K</td><td>Heavy Shot</td><td><b>68</b></td><td>17</td><td>20</td><td class="neg">−10</td><td>ダウン</td><td>37</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (134px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>41</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+I</td><td>Sky Shot</td><td><b>46</b></td><td>14</td><td>20</td><td class="neg">−10</td><td>打ち上げ</td><td>34</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (110px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Crouch Shot</td><td><b>27</b></td><td>8</td><td>11</td><td class="neg">−1</td><td>+7</td><td>19</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+K</td><td>Ground Shot</td><td><b>49</b></td><td>15</td><td>25</td><td class="neg">−15</td><td>ダウン</td><td>40</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (146px)</td></tr>
          <tr><td class="cmd">U U</td><td>Second Shot</td><td><b>52</b></td><td>9</td><td>—</td><td class="neg">−4</td><td>+4</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U</td><td>Cross Draw</td><td><b>77</b></td><td>9</td><td>—</td><td class="neg">−4</td><td>+4</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U</td><td>Spin Shot</td><td><b>99</b></td><td>10</td><td>—</td><td class="neg">−4</td><td>+4</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Point-Blank Blast</td><td><b>156</b></td><td>14</td><td>—</td><td class="neg">−48</td><td>ダウン</td><td>—</td><td class="pu ok">不利だが届かない (227px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Hammer Fan Finale</td><td><b>122</b></td><td>14</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (150px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Ricochet Launcher</td><td><b>90</b></td><td>13</td><td>—</td><td class="neg">−10</td><td>打ち上げ</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (110px)</td></tr>
          <tr><td class="cmd">J J</td><td>Low Shot 2</td><td><b>52</b></td><td>9</td><td>—</td><td class="neg">−4</td><td>+4</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">J J K</td><td>Ground Shot</td><td><b>95</b></td><td>14</td><td>—</td><td class="neg">−14</td><td>ダウン</td><td>—</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">→→+U</td><td>Fan the Hammer</td><td><b>71</b></td><td>28</td><td>38</td><td class="neg">−36</td><td>ダウン</td><td>66</td><td class="pu ok">不利だが届かない (188px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Quick Draw</td><td><b>57</b></td><td>5</td><td>18</td><td class="neg">−8</td><td>+12</td><td>23</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (109px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Roll Shot</td><td><b>62</b></td><td>18</td><td>20</td><td class="neg">−8</td><td>−2</td><td>38</td><td class="pu mid">弱攻撃（U）で確定（全員）</td></tr>
          <tr><td class="cmd">→→+K</td><td>Jump Shot</td><td><b>77</b></td><td>34 <small>(150px)</small></td><td>—</td><td class="neg">−25</td><td>−2</td><td>65</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">←←+U</td><td>Dynamite</td><td><b>61</b></td><td>73</td><td>-15</td><td class="neg">−48</td><td>打ち上げ</td><td>58</td><td class="pu ok">不利だが届かない (241px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Make &#x27;em Dance</td><td><b>68</b></td><td>28</td><td>42</td><td class="neg">−36</td><td>気絶</td><td>70</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (180px)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Backflip Shot</td><td><b>35</b></td><td>22</td><td>16</td><td class="neg">−6</td><td>+2</td><td>38</td><td class="pu ok">不利だが届かない (228px)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Showdown</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>48</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">U+J （超必殺）</td><td>High Noon</td><td><b>192</b></td><td>64</td><td>58</td><td class="pos">+1</td><td>ダウン</td><td>122</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I（長押し、サンダーショット）</td><td>Thunder Shot</td><td><b>108</b></td><td>64</td><td>35</td><td class="neg">−20</td><td>打ち上げ</td><td>99</td><td class="pu ok">不利だが届かない (196px)</td></tr>
          <tr><td class="cmd">K（長押し、バッファローブラスト）</td><td>Buffalo Blast</td><td><b>97</b></td><td>64</td><td>30</td><td class="neg">−20</td><td>打ち上げ</td><td>94</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (178px)</td></tr>
          <tr><td class="cmd">→→+I（長押し、デッドアイ）</td><td>Dead-Eye Shot</td><td><b>115</b></td><td>53</td><td>31</td><td class="neg">−8</td><td>打ち上げ</td><td>84</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (112px)</td></tr>
        </tbody>
      </table></div>
    </article>
`);
