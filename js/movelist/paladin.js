'use strict';
// Move list: Aldric, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card paladin" data-tab="paladin" data-lang="en">
      <h2>ALDRIC<span>Holy Paladin</span></h2>
      <p class="blurb">A towering knight in full plate, wreathed in pale blue holy light. He is slow and sturdy: he walks and swings with weight, hits barely move him, and he has the biggest guard meter in the game. His game is built on four things: parrying, healing, charged attacks you hold the button for, and the Aegis that protects him from every side.</p>
      <p class="note"><b>Excalibur.</b> When he swings, the aura of Excalibur forms around his sword — a great blade of light — and fades after the strike.</p>
      <p class="note"><b>Auto guard.</b> Standing still, he guards by himself (except throws). The moment he moves, attacks, or is still recovering from an attack, he can be hit like anyone else, so wait for him to commit and punish him.</p>
      <p class="note"><b>Theme.</b> Holy steel · pale blue and silver. A knight sworn to guard others before himself. Signatures: U, U, K Bulwark Breaker (shield, then a cleave that leaves a cross of light); U, U, I Heaven’s Rise (a pillar of light lifts them).</p>
      <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (shield lift, sword lift, ascension, cross of judgement). Jumping after them, U, U, I and U, U, K become: air slash, air shield bash, blade halo flurry, plunging light.</p>
      <h3>Charge attacks (hold the button)</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Heavy Cleave<small>Hold I: one cross lights above his helm per second (three seconds for the maximum). A quick tap is a plain overhead swing. Lv1 an overhead cleave that knocks down. Lv2 smashes a big chunk out of their guard meter. Lv3, Heaven Splitter: bounces them into the air for a juggle and sends a wave of light rolling along the floor.</small></td><td class="cmd">I (hold)</td></tr>
          <tr><td>Heavy Thrust / Excalibur<small>Hold K and light gathers into a giant aura sword over his head, one level per second: let go and he swings Excalibur down. Lv1 reaches a fifth of the stage, Lv2 a third, Lv3 (three seconds) half the stage and bounces them. A quick tap is just a short pushing thrust.</small></td><td class="cmd">K (hold)</td></tr>
          <tr><td>Rampart Charge<small>Hold → → + U: he digs in, lowers the shield and builds into a raging charge, red light streaming off the shield. Front attacks and projectiles bounce off. Let go, or crash into them, for the Rampart Slam that flattens them.</small></td><td class="cmd">→ → + U (hold)</td></tr>
          <tr><td>Windmill<small>Hold → → + J: the greatsword whirls like a millstone in front of him, grinding forward and hitting again and again. Let go for the Windmill Crash, which bounces them up.</small></td><td class="cmd">→ → + J (hold)</td></tr>
        </tbody>
      </table></div>
      <h3>Heavy techniques</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Judgement Thrust<small>A slow, deliberate wind-up, then a lunging thrust across a third of the stage that lifts them for a juggle.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Crusader Leap<small>A heavy leap; he crashes down sword-first and the impact rolls out to both sides. Bounces them, and even hits them while they lie on the floor.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Rising Shield<small>Up close: heaves the shield upward and launches them.</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <h3>Parry, protect, heal</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Parry<small>A short, sharp shield guard. Parry an attack from the front and he answers with a lightning Riposte that lifts them.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Shield Parry<small>The same parry, but he bashes them senseless (stunned) instead.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Aegis<small>Hold ← ← + J: a sphere of light closes around him and stops everything, from the front, from behind and from above, where a parry only works from the front. It takes a moment to cast (hit him then for a counter hit), then he can hold it for up to seven seconds and even walk with it. Hits only do a quarter of their damage and wear down his guard meter; if it runs out his guard breaks. When he lets go, his guard meter drops to half and comes back slowly.</small></td><td class="cmd">← ← + J (hold)</td></tr>
          <tr><td>Lay on Hands<small>Hold ← ← + K: he kneels and prays, turning MP into health (light falls on him as he heals). Any hit while he prays is a counter hit.</small></td><td class="cmd">← ← + K (hold)</td></tr>
          <tr class="super"><td>Super: Sanctuary<small>He plants the sword, wings of light open, and a dome of light swells around him. Caught inside, they are held and burned again and again while his health and guard come back; then the dome bursts. Needs a full MP meter.</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="paladin">▶ Watch Aldric’s techniques</button>
      <h3>12 samples</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1–7. Combos<small>1 Judgement Thrust. 2 Windmill held, then the crash. 3 Crusader Leap. 4 Heaven Splitter (held I). 5 Parry, Riposte. 6 Shield Parry, stun. 7 Rampart Charge from far away, then the Crusader Leap on them lying down. The juggles end with sword lift, shield lift, halo cleave (U, U, K).</small></td><td class="cmd">see note</td></tr>
          <tr><td>8–12. Techniques<small>8 Excalibur. 9 Heavy Cleave Lv2 tearing through a guard. 10 Aegis stopping an attack. 11 Lay on Hands healing. 12 Sanctuary.</small></td><td class="cmd"></td></tr>
        </tbody>
      </table></div>
      <p class="note">Heavy techniques recover slowly when they miss or are guarded, but quickly when they land, so a hit leads straight into a juggle.</p>
      <p class="note"><b>Combo strings.</b> U, U, U, U, K: shield bash, rising slash, overhead cleave, holy thrust. I from any point: Ascending Shield launches; K ends with a pommel smash. J, J, K: low cut, shield sweep. In a juggle: shield lift, sword lift, rising cleave, judgement cleave.</p>
      <h3>Frame data</h3>
<p class="note"><b>Frame data.</b> Measured from the game itself at 60 frames a second. <b>Startup</b>: frames from pressing the button until it hits (for a string, the frames that hit takes after the previous one; for moves that travel, at the distance shown). <b>On guard / On hit</b>: who recovers first after it connects — plus means the attacker can act first, minus means the defender can. <b>After</b>: frames from the moment it hits until he can guard again (if it misses). <b>Total</b>: frames from the press until he can guard again if it misses (startup + after). <b>Damage</b>: what it does when it hits (for a string, the whole string; later hits in a combo keep 65–95% depending on how long they take). Until then he can’t guard, so a whiffed or guarded move with a big minus can be punished: a light punch (U) hits on frame 4–8 and a launcher (↓+I) on frame 13–16, and how far they reach depends on the fighter: U reaches about 80–95px for Kappa, Kuro, Tanaka and Tetsu, 160–185px for Lyra, Mei and Aldric, and further with Jesse’s shot; ↓+I reaches 85–95px for Kuro, Tanaka and Tetsu and 120–225px for the others. <b>Punish</b> combines the minus with the distance left after the pushback. Tetsu’s armor shrugs off light hits while he attacks, so punish him with a heavy attack.</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>Command</th><th>Move</th><th>Damage</th><th>Startup</th><th>After</th><th>On guard</th><th>On hit</th><th>Total</th><th>Punish</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Pommel Strike</td><td><b>44</b></td><td>9</td><td>9</td><td class="pos">+2</td><td>+5</td><td>18</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I</td><td>Heavy Cleave</td><td><b>86</b></td><td>18</td><td>29</td><td class="neg">−10</td><td>knockdown</td><td>47</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (112px)</td></tr>
          <tr><td class="cmd">J</td><td>Low Cut</td><td><b>47</b></td><td>10</td><td>11</td><td class="pos">+2</td><td>+5</td><td>21</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">K</td><td>Short Thrust</td><td><b>75</b></td><td>16</td><td>20</td><td class="neg">−10</td><td>+3</td><td>36</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (99px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>44</b></td><td>9</td><td>9</td><td class="pos">+2</td><td>+5</td><td>18</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+I</td><td>Rising Shield</td><td><b>103</b></td><td>19</td><td>21</td><td class="neg">−10</td><td>launch</td><td>40</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (112px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Crouch Sword Poke</td><td><b>47</b></td><td>10</td><td>11</td><td class="pos">+2</td><td>+5</td><td>21</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+K</td><td>Shield Trip</td><td><b>104</b></td><td>17</td><td>27</td><td class="neg">−10</td><td>knockdown</td><td>44</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (112px)</td></tr>
          <tr><td class="cmd">U U</td><td>Shield Bash</td><td><b>70</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U</td><td>Rising Slash</td><td><b>100</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U</td><td>Overhead Cleave</td><td><b>133</b></td><td>12</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Holy Thrust</td><td><b>192</b></td><td>16</td><td>—</td><td class="neg">−48</td><td>knockdown</td><td>—</td><td class="pu ok">Minus, but out of reach (221px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Bulwark Breaker</td><td><b>150</b></td><td>16</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (136px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Heaven&#x27;s Rise</td><td><b>122</b></td><td>16</td><td>—</td><td class="neg">−12</td><td>launch</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (127px)</td></tr>
          <tr><td class="cmd">J J</td><td>Low Cut 2</td><td><b>76</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">J J K</td><td>Shield Sweep</td><td><b>132</b></td><td>16</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (115px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Rampart Slam</td><td><b>83</b></td><td>15</td><td>62</td><td class="neg">−36</td><td>knockdown</td><td>77</td><td class="pu ok">Minus, but out of reach (193px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Judgement Thrust</td><td><b>60</b></td><td>39</td><td>31</td><td class="neg">−48</td><td>launch</td><td>70</td><td class="pu ok">Minus, but out of reach (219px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Windmill Crash</td><td><b>46</b></td><td>15</td><td>65</td><td class="neg">−48</td><td>launch</td><td>80</td><td class="pu ok">Minus, but out of reach (221px)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Crusader Leap</td><td><b>73</b></td><td>51</td><td>45</td><td class="neg">−32</td><td>launch</td><td>96</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">←←+U</td><td>Parry</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>43</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Shield Parry</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>43</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Aegis</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>31</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Lay on Hands</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>29</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">U+J (super)</td><td>Sanctuary</td><td><b>185</b></td><td>66</td><td>58</td><td class="pos">+5</td><td>knockdown</td><td>124</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I (held 3s, Lv3)</td><td>Heaven Splitter</td><td><b>116</b></td><td>190</td><td>29</td><td class="neg">−10</td><td>launch</td><td>219</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (112px)</td></tr>
          <tr><td class="cmd">K (held 3s, Excalibur)</td><td>Excalibur</td><td><b>117</b></td><td>190</td><td>31</td><td class="neg">−10</td><td>launch</td><td>221</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (113px)</td></tr>
          <tr><td class="cmd">K (held 1s)</td><td>Excalibur Lv1</td><td><b>87</b></td><td>75</td><td>31</td><td class="neg">−10</td><td>knockdown</td><td>106</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (113px)</td></tr>
          <tr><td class="cmd">→→+U (held)</td><td>Rampart Slam</td><td><b>83</b></td><td>15</td><td>76</td><td class="neg">−36</td><td>knockdown</td><td>91</td><td class="pu ok">Minus, but out of reach (193px)</td></tr>
          <tr><td class="cmd">→→+J (held)</td><td>Windmill Crash</td><td><b>60</b></td><td>15</td><td>93</td><td class="neg">−48</td><td>launch</td><td>108</td><td class="pu ok">Minus, but out of reach (230px)</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card paladin" data-tab="paladin" data-lang="ja" hidden>
      <h2>アルドリック<span>聖騎士</span></h2>
      <p class="blurb">淡い青の聖なる光をまとう、全身鎧の大柄な騎士。動きは重く頑丈：一歩一歩、一振り一振りに重みがあり、攻撃を受けてもほとんど下がらず、ガードゲージはゲームで一番大きい。戦い方の柱は四つ：受け流し、回復、押し続けて溜める攻撃、そしてあらゆる方向から身を守るイージス。</p>
      <p class="note"><b>エクスカリバー。</b>剣を振るうと、剣のまわりにエクスカリバーのオーラ（巨大な光の刃）が現れ、斬撃のあと消えていく。</p>
      <p class="note"><b>オートガード。</b> 静かに立っているときは自動でガードする（投げ以外）。動いた瞬間、攻撃中、攻撃後の戻りの間は普通に当たるので、動き出したところを狙って反撃しよう。</p>
      <p class="note"><b>テーマ.</b> 聖なる鋼・淡い青と銀。自らより他者を守ると誓った騎士。決め技：U、U、K「城壁崩し」（盾から光の十字を残す斬り）／U、U、I「天への昇り」（光の柱が持ち上げる）。</p>
      <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（盾持ち上げ、剣上げ、昇天、裁きの十字）。ジャンプして追うと、U、U、IとU、U、Kは：空中斬り、空中盾打ち、剣輪連撃、急降下の光。</p>
      <h3>溜め攻撃（ボタン長押し）</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>大斬り<small>Iを押し続ける：1秒ごとに兜の上に十字が灯る（最大3秒）。軽く押すだけなら普通の振り下ろし。Lv1はダウンさせる振り下ろし。Lv2はガードゲージを大きく削る。Lv3「天裂き」：相手を宙に浮かせ、床を光の波が走る。</small></td><td class="cmd">I（長押し）</td></tr>
          <tr><td>大突き／エクスカリバー<small>Kを押し続けると、1秒ごとにレベルが上がり、頭上に巨大な光の剣が育つ。離すと「エクスカリバー」を振り下ろす。Lv1は画面の5分の1、Lv2は3分の1、Lv3（3秒）は画面の半分まで届き、相手をバウンドさせる。軽く押すだけなら短い押し出しの突き。</small></td><td class="cmd">K（長押し）</td></tr>
          <tr><td>城壁突撃<small>→→+Uを押し続ける：踏ん張って盾を下げ、怒りの突進へと加速し、盾から赤い光がほとばしる。正面の攻撃と飛び道具は弾く。離すかぶつかると城壁の一撃で叩き伏せる。</small></td><td class="cmd">→ → + U（長押し）</td></tr>
          <tr><td>風車<small>→→+Jを押し続ける：大剣が石臼のように回り、前進しながら何度も斬る。離すと風車落としで相手をバウンドさせる。</small></td><td class="cmd">→ → + J（長押し）</td></tr>
        </tbody>
      </table></div>
      <h3>重い技</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>裁きの突き<small>ゆっくりと重い溜めから、画面の三分の一を突き抜ける突きで浮かせる。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>聖戦の跳躍<small>重い跳躍から剣ごと落下し、衝撃が左右に広がる。相手をバウンドさせ、倒れている相手にも当たる。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>盾上げ<small>至近距離で盾を振り上げて打ち上げる。</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <h3>受け流し・守り・回復</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>受け流し<small>短く鋭い盾の構え。正面の攻撃を受け流すと、電光のリポストで浮かせる。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>盾の受け流し<small>同じ受け流しから、盾で殴って気絶させる。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>イージス<small>←←+Jを押し続ける：光の球が体を包み、正面・背後・上からのすべての攻撃を止める（受け流しは正面のみ）。発動に少し時間がかかり（その間に攻撃されるとカウンター）、最大7秒まで張り続けられ、張ったまま歩ける。攻撃のダメージは4分の1だけ通り、ガードゲージが削られ、尽きるとガードブレイク。解除するとガードゲージは半分になり、ゆっくり回復する。</small></td><td class="cmd">← ← + J（長押し）</td></tr>
          <tr><td>癒しの手<small>←←+Kを押し続ける：ひざまずいて祈り、MPを体力に変える（回復中は光が降り注ぐ）。祈り中に受けた攻撃はすべてカウンター。</small></td><td class="cmd">← ← + K（長押し）</td></tr>
          <tr class="super"><td>超必殺技：聖域<small>剣を突き立てると光の翼が開き、光のドームが広がる。中に捕らわれた相手は何度も焼かれ、その間に体力とガードが回復し、最後にドームが弾ける。MP満タンが必要。</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="paladin">▶ アルドリックの技を見る</button>
      <h3>12の見本</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1〜7. コンボ<small>1 裁きの突き。2 風車を押し続けて叩きつけ。3 聖戦の跳躍。4 天裂き（I長押し）。5 受け流しからリポスト。6 盾の受け流しで気絶。7 遠くからの城壁突撃、倒れた相手に聖戦の跳躍。空中追撃は剣上げ・盾上げ・光輪の斬り（U、U、K）。</small></td><td class="cmd">注を参照</td></tr>
          <tr><td>8〜12. 技の見本<small>8 エクスカリバー。9 ガードを削る大斬りLv2。10 攻撃を止めるイージス。11 癒しの手で回復。12 聖域。</small></td><td class="cmd"></td></tr>
        </tbody>
      </table></div>
      <p class="note">重い技は外したりガードされると隙が大きいが、当たるとすぐ動けるので、そのまま空中追撃につながる。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：盾打ち・斬り上げ・振り下ろし・聖なる突き。途中のIで盾上げ（打ち上げ）、Kで柄打ち。J、J、K：下段斬り・盾払い。空中追撃：盾持ち上げ・剣上げ・昇り斬り・裁きの斬り。</p>
      <h3>フレームデータ</h3>
<p class="note"><b>フレームデータ。</b> ゲーム本体で計測（1秒＝60フレーム）。<b>発生</b>：ボタンを押してから当たるまで（連続技は前の攻撃からの間隔、飛ぶ技は表示の距離で計測）。<b>ガード時／ヒット時</b>：当たった後どちらが先に動けるか。＋は攻撃側、－は防御側が先に動ける。<b>ヒット後</b>：当たる瞬間から再びガードできるまで（空振り時）。<b>全体</b>：空振りした場合、押してから再びガードできるまで（発生＋ヒット後）。 <b>ダメージ</b>：当たったときのダメージ（連続技は全体の合計。コンボの後半の攻撃は、時間のかかる技ほど65〜95%が残る）。それまではガードできないので、大きく不利な技は反撃される。弱パンチ（U）は4〜8フレーム目、打ち上げ（↓+I）は13〜16フレーム目に当たり、届く距離はキャラごとに違う：Uはカッパ・クロ・田中・テツが約80〜95px、ライラ・メイ・アルドリックが160〜185px、ジェシーの射撃はさらに遠く。↓+Iはクロ・田中・テツが85〜95px、他は120〜225px。<b>反撃</b>は不利フレームと押し返し後の距離から判定。テツは攻撃中アーマーで弱攻撃を受け流すので、強攻撃で反撃すること。</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>コマンド</th><th>技</th><th>ダメージ</th><th>発生</th><th>ヒット後</th><th>ガード時</th><th>ヒット時</th><th>全体</th><th>反撃</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Pommel Strike</td><td><b>44</b></td><td>9</td><td>9</td><td class="pos">+2</td><td>+5</td><td>18</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I</td><td>Heavy Cleave</td><td><b>86</b></td><td>18</td><td>29</td><td class="neg">−10</td><td>ダウン</td><td>47</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (112px)</td></tr>
          <tr><td class="cmd">J</td><td>Low Cut</td><td><b>47</b></td><td>10</td><td>11</td><td class="pos">+2</td><td>+5</td><td>21</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">K</td><td>Short Thrust</td><td><b>75</b></td><td>16</td><td>20</td><td class="neg">−10</td><td>+3</td><td>36</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (99px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>44</b></td><td>9</td><td>9</td><td class="pos">+2</td><td>+5</td><td>18</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+I</td><td>Rising Shield</td><td><b>103</b></td><td>19</td><td>21</td><td class="neg">−10</td><td>打ち上げ</td><td>40</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (112px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Crouch Sword Poke</td><td><b>47</b></td><td>10</td><td>11</td><td class="pos">+2</td><td>+5</td><td>21</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+K</td><td>Shield Trip</td><td><b>104</b></td><td>17</td><td>27</td><td class="neg">−10</td><td>ダウン</td><td>44</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (112px)</td></tr>
          <tr><td class="cmd">U U</td><td>Shield Bash</td><td><b>70</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U</td><td>Rising Slash</td><td><b>100</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U</td><td>Overhead Cleave</td><td><b>133</b></td><td>12</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Holy Thrust</td><td><b>192</b></td><td>16</td><td>—</td><td class="neg">−48</td><td>ダウン</td><td>—</td><td class="pu ok">不利だが届かない (221px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Bulwark Breaker</td><td><b>150</b></td><td>16</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (136px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Heaven&#x27;s Rise</td><td><b>122</b></td><td>16</td><td>—</td><td class="neg">−12</td><td>打ち上げ</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (127px)</td></tr>
          <tr><td class="cmd">J J</td><td>Low Cut 2</td><td><b>76</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">J J K</td><td>Shield Sweep</td><td><b>132</b></td><td>16</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (115px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Rampart Slam</td><td><b>83</b></td><td>15</td><td>62</td><td class="neg">−36</td><td>ダウン</td><td>77</td><td class="pu ok">不利だが届かない (193px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Judgement Thrust</td><td><b>60</b></td><td>39</td><td>31</td><td class="neg">−48</td><td>打ち上げ</td><td>70</td><td class="pu ok">不利だが届かない (219px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Windmill Crash</td><td><b>46</b></td><td>15</td><td>65</td><td class="neg">−48</td><td>打ち上げ</td><td>80</td><td class="pu ok">不利だが届かない (221px)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Crusader Leap</td><td><b>73</b></td><td>51</td><td>45</td><td class="neg">−32</td><td>打ち上げ</td><td>96</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">←←+U</td><td>Parry</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>43</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+I</td><td>Shield Parry</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>43</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+J</td><td>Aegis</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>31</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+K</td><td>Lay on Hands</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>29</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">U+J （超必殺）</td><td>Sanctuary</td><td><b>185</b></td><td>66</td><td>58</td><td class="pos">+5</td><td>ダウン</td><td>124</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I（3秒長押し、Lv3）</td><td>Heaven Splitter</td><td><b>116</b></td><td>190</td><td>29</td><td class="neg">−10</td><td>打ち上げ</td><td>219</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (112px)</td></tr>
          <tr><td class="cmd">K（3秒長押し、エクスカリバー）</td><td>Excalibur</td><td><b>117</b></td><td>190</td><td>31</td><td class="neg">−10</td><td>打ち上げ</td><td>221</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (113px)</td></tr>
          <tr><td class="cmd">K（1秒長押し）</td><td>Excalibur Lv1</td><td><b>87</b></td><td>75</td><td>31</td><td class="neg">−10</td><td>ダウン</td><td>106</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (113px)</td></tr>
          <tr><td class="cmd">→→+U （長押し）</td><td>Rampart Slam</td><td><b>83</b></td><td>15</td><td>76</td><td class="neg">−36</td><td>ダウン</td><td>91</td><td class="pu ok">不利だが届かない (193px)</td></tr>
          <tr><td class="cmd">→→+J （長押し）</td><td>Windmill Crash</td><td><b>60</b></td><td>15</td><td>93</td><td class="neg">−48</td><td>打ち上げ</td><td>108</td><td class="pu ok">不利だが届かない (230px)</td></tr>
        </tbody>
      </table></div>
    </article>
`);
