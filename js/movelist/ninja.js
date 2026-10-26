'use strict';
// Move list: Kuro, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card ninja" data-tab="ninja" data-lang="en">
      <h2>KURO<span>Shadow Ninja</span></h2>
      <p class="blurb">Quick on his feet and lighter on damage, and he recovers quickly from every move. Tricks you with shadows and clones, cuts in with his sword, stuns with fire and lightning, and has many ways to launch you into a long juggle.</p>
      <p class="note"><b>Hand signs.</b> Before each of his moderate and heavy techniques Kuro forms three seals, and a spirit rises behind him with the seal’s name above his head — learn them and you know what’s coming (and can jab him before it does): Dragon 龍 = Sky Drop Kick, Tiger 虎 = Lightning Volley, Phoenix 鳳 = Fire Breath, Serpent 蛇 = Shadow Charge Upper, Crane 鶴 = Iai Slash, Fox 狐 = Shadow Clone, Rat 鼠 = Vanish Slide, Raven 烏 = Vanish Drop Kick. In combos the phoenix also rises for his juggle Fire Spout, and a Bull 牛 for the last kick of U, U, K (Crescent Moon Drop). Each spirit stays where he cast it and slowly drifts away.</p>
      <p class="note"><b>Charge (hold I).</b> Qi gathers into him while you hold. Half a second: Shadow Rush Slash, he dashes in and slashes them into the air — follow it with a juggle. Over a second: Moon Tempest, a crescent of shadow flies along the floor and sends them flying. A tap is the normal heavy attack.</p>
      <p class="note"><b>Theme.</b> Shadow & moonlight · violet and silver. A silent assassin from a burned-down mountain village who fights from the shadows. Signatures: U, U, K Crescent Moon Drop (vanishes, drops a crescent heel from above); U, U, I Moonrise Kunai (a full moon of kunai).</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Kunai Slash<small>Heavy punch. Lunges in with a wide blade slash.</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>Crescent Kick<small>Heavy kick. A high arcing kick that also catches jumpers.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Shadow Charge Upper<small>Looks exactly like Shadow Clone Strike, but the shadow dashing in is the real Kuro and the one doing the hand sign is a decoy. It ends in a smooth rising uppercut that launches the opponent so you can juggle them. If the uppercut is guarded or misses, pick a follow-up instead. If he’s hit before the kick, he vanishes, reappears behind the attacker and slashes, leaving them stunned so he can launch them.</small></td><td class="cmd">→ → + U</td></tr>
          <tr class="sub"><td>Shadow Strike<small>Reappears behind the opponent and slashes. Hit from behind, they’re left stunned, so you can launch them with ↓ + I.</small></td><td class="cmd">then U</td></tr>
          <tr class="sub"><td>Shadow Leap<small>Jumps high and crashes down about a second later, bouncing the opponent into a juggle. Walking back can dodge it.</small></td><td class="cmd">then I</td></tr>
          <tr class="sub"><td>Shadow Slide<small>Low sliding kick that pops the opponent up; he slides through, ends up behind and can juggle them.</small></td><td class="cmd">then J</td></tr>
          <tr class="sub"><td>Shadow Roundhouse<small>Turns all the way around, then swings a roundhouse that sends the opponent flying. Can be interrupted during the turn.</small></td><td class="cmd">then K</td></tr>
          <tr><td>Iai Slash<small>Settles into a stance with his hand on the sword, then dashes straight through the opponent in one cut and stops behind them. The cut lands a moment later and they fall. If it’s guarded he’s left wide open behind them.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Shadow Clone Strike<small>A clone dashes in and kicks while Kuro holds the hand sign. Hitting the clone breaks it.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Sky Drop Kick<small>Teleports above the opponent and drops a kick that bounces them off the ground into a juggle, landing behind them. Juggle with any attack, or pick a follow-up:</small></td><td class="cmd">→ → + K</td></tr>
          <tr class="sub"><td>Drop Slide<small>Low slide back into the opponent.</small></td><td class="cmd">then J</td></tr>
          <tr class="sub"><td>Turnaround Kick<small>Turns around (a little quicker) into a roundhouse that sends the opponent flying. Can be interrupted during the turn.</small></td><td class="cmd">then K</td></tr>
          <tr><td>Fire Breath<small>Under half a second of hand signs, then a long stream of fire. If it hits, they’re left burning and stunned for a moment, so you can run in and combo. Getting hit during the hand signs stops it.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Lightning Volley<small>A short casting raises three lightning balls overhead, then they chase the opponent one after another. If they hit, the opponent is electrified and stunned, so you can dash in and combo. Getting hit before they launch cancels them.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Vanish Slide<small>Leaves a shadow standing on guard (it blocks up to two attacks), back-dashes as a shadow, then slides in, pops the opponent up and comes out behind them for a juggle.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Vanish Drop Kick<small>Leaves a shadow standing on guard, back-dashes as a shadow, then leaps high over long-range attacks and brings his heel down, bouncing the opponent off the ground into a juggle. It only travels about a quarter of the stage, so it can land short of a distant opponent.</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>Super: Shadow Army<small>Six clones rush in from both sides, then a seventh dives from above. Up close, the last clone bounces them back to Kuro so he can keep juggling. Needs a full MP gauge.</small></td><td class="cmd">Punch + Kick</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="ninja">▶ Watch Kuro’s sample combos</button>
      <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (rising kunai slash, twin kunai, shadow clone rise, shadow slash). Jumping after them, U, U, I and U, U, K become: air kunai slash, air reverse slash, kunai rain, shadow wheel.</p>
      <h3>Six combos, each with one or two juggles</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. Uppercut Launcher<small>One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, ← ← + U (Fire Spout lifts them again), W, U, K.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. Shadow Charge Upper<small>One juggle: → → + U, U, U, K. Two juggles: → → + U, U, I (Rising Kunai lifts them again), K as they come down.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>3. Shadow Ambush<small>When the charge uppercut is guarded, U slashes them from behind and stuns them. One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, I, W, U, K.</small></td><td class="cmd">→ → + U, then U</td></tr>
          <tr><td>4. Sky Drop Kick<small>One juggle: → → + K, U, U, K. Two juggles: → → + K, U, W, U, ↓ + K (Shadow Meteor bounces them again), K.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>5. Counter Crescent<small>The heavy kick launches when it catches an attack starting up. One juggle: K, U, U, K. Two juggles: K, U, U, I, K.</small></td><td class="cmd">K</td></tr>
          <tr><td>6. Lightning stun<small>Lightning Volley stuns them; dash in and launch. One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, Punch + Kick (Shadow Army up close bounces them again), U, K.</small></td><td class="cmd">← ← + I, then ↓ + I</td></tr>
        </tbody>
      </table></div>
      <p class="note">A combo can lift the opponent up twice: the starter counts as the first lift, and a launch, relaunch or bounce inside the combo is the second. A third lift barely raises them (“LIFT LIMIT”). A stun doesn’t count as a lift. Other starters: U then ↓ + I, Vanish Slide (← ← + J), Vanish Drop Kick (← ← + K), Fire Breath’s stun (← ← + U) and Shadow Army up close.</p>
      <p class="note">While the opponent is launched, Kuro’s ← ← + U, ← ← + I, → → + J, → → + I and ← ← + K turn into these juggle versions. In the air near them, U starts the air string, I the kunai flurry, K the Air Smash, and ↓ + K the Shadow Meteor, which bounces them off the ground so you can keep going (once per combo).</p>
      <p class="note">Press each button as the previous hit lands. To watch all twelve (each starter with one juggle, then with two) with the inputs on screen, pick Kuro combos on the title screen.</p>
      <h3>Combo techniques on their own</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Fire Spout<small>A fire column right in front. Pops them up, so it starts a combo too.</small></td><td class="cmd">← ← then ↓ + U</td></tr>
          <tr><td>Lightning Rain<small>Three lightning balls drop on them from above.</small></td><td class="cmd">← ← then ↓ + I</td></tr>
          <tr><td>Clone Relay<small>A clone appears behind them and kicks them toward you.</small></td><td class="cmd">→ → then ↓ + J</td></tr>
          <tr><td>Air Iai<small>A leaping slash through them, landing on the far side.</small></td><td class="cmd">→ → then ↓ + I</td></tr>
          <tr><td>Vanish Heel<small>Vanishes and drops a heel on them from above. Knocks down.</small></td><td class="cmd">← ← then ↓ + K</td></tr>
          <tr><td>Shadow Meteor<small>A dive kick from any jump. Knocks down.</small></td><td class="cmd">↓ + K in the air</td></tr>
          <tr><td>Anti-air<small>Near a jumping opponent, U, I and K become the rising palm, Rising Kunai and spin kick, and the specials above come out on their own. In the air, U, I and K start the air string against them.</small></td><td class="cmd">U, I, K</td></tr>
        </tbody>
      </table></div>
      <p class="note"><b>Combo strings.</b> U, U, U, U, K: kunai slash, reverse slash, shadow step, shadow crescent. I from any point: Kunai Rise launches; K ends early with a crescent kick. J, J, K: sweep slash, shadow sweep. In a juggle: rising kunai slash, twin kunai, shadow upper, moon crescent.</p>
      <h3>Frame data</h3>
<p class="note"><b>Frame data.</b> Measured from the game itself at 60 frames a second. <b>Startup</b>: frames from pressing the button until it hits (for a string, the frames that hit takes after the previous one; for moves that travel, at the distance shown). <b>On guard / On hit</b>: who recovers first after it connects — plus means the attacker can act first, minus means the defender can. <b>After</b>: frames from the moment it hits until he can guard again (if it misses). <b>Total</b>: frames from the press until he can guard again if it misses (startup + after). <b>Damage</b>: what it does when it hits (for a string, the whole string; later hits in a combo keep 65–95% depending on how long they take). Until then he can’t guard, so a whiffed or guarded move with a big minus can be punished: a light punch (U) hits on frame 4–8 and a launcher (↓+I) on frame 13–16, and how far they reach depends on the fighter: U reaches about 80–95px for Kappa, Kuro, Tanaka and Tetsu, 160–185px for Lyra, Mei and Aldric, and further with Jesse’s shot; ↓+I reaches 85–95px for Kuro, Tanaka and Tetsu and 120–225px for the others. <b>Punish</b> combines the minus with the distance left after the pushback. Tetsu’s armor shrugs off light hits while he attacks, so punish him with a heavy attack.</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>Command</th><th>Move</th><th>Damage</th><th>Startup</th><th>After</th><th>On guard</th><th>On hit</th><th>Total</th><th>Punish</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Light Punch</td><td><b>29</b></td><td>9</td><td>7</td><td class="pos">+2</td><td>+5</td><td>16</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I</td><td>Kunai Slash</td><td><b>54</b></td><td>17</td><td>18</td><td class="neg">−10</td><td>+3</td><td>35</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (106px)</td></tr>
          <tr><td class="cmd">J</td><td>Light Kick</td><td><b>33</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">K</td><td>Crescent Kick</td><td><b>59</b></td><td>17</td><td>18</td><td class="neg">−10</td><td>+3</td><td>35</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (81px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>29</b></td><td>9</td><td>7</td><td class="pos">+2</td><td>+5</td><td>16</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+I</td><td>Uppercut Launcher</td><td><b>68</b></td><td>18</td><td>15</td><td class="neg">−10</td><td>launch</td><td>33</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (105px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Low Kick</td><td><b>33</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+K</td><td>Sweep</td><td><b>74</b></td><td>17</td><td>19</td><td class="neg">−10</td><td>knockdown</td><td>36</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (107px)</td></tr>
          <tr><td class="cmd">U U</td><td>Kunai Slash</td><td><b>45</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U</td><td>Reverse Slash</td><td><b>60</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U</td><td>Shadow Step</td><td><b>75</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Shadow Crescent</td><td><b>113</b></td><td>15</td><td>—</td><td class="neg">−32</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (154px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Crescent Moon Drop</td><td><b>100</b></td><td>18</td><td>—</td><td class="neg">−12</td><td>launch</td><td>—</td><td class="pu mid">Light attack (U) punish (everyone)</td></tr>
          <tr><td class="cmd">U U I</td><td>Moonrise Kunai</td><td><b>76</b></td><td>15</td><td>—</td><td class="neg">−15</td><td>launch</td><td>—</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">J J</td><td>Sweep Slash</td><td><b>53</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">J J K</td><td>Shadow Sweep</td><td><b>96</b></td><td>15</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (98px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Shadow Charge Upper</td><td><b>36</b></td><td>67</td><td>24</td><td class="neg">−32</td><td>launch</td><td>91</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (150px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Iai Slash</td><td><b>64</b></td><td>37</td><td>31</td><td class="neg">−32</td><td>knockdown</td><td>68</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (158px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Shadow Clone</td><td><b>53</b></td><td>28</td><td>15</td><td class="neg">−20</td><td>+11</td><td>43</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (145px)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Sky Drop Kick</td><td><b>46</b></td><td>36</td><td>31</td><td class="neg">−20</td><td>launch</td><td>67</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">←←+U</td><td>Fire Breath</td><td><b>55</b></td><td>39</td><td>59</td><td class="neg">−36</td><td>stun</td><td>98</td><td class="pu ok">Minus, but out of reach (205px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Lightning Volley</td><td><b>73</b></td><td>64</td><td>12</td><td class="neg">−36</td><td>stun</td><td>76</td><td class="pu ok">Minus, but out of reach (186px)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Vanish Slide</td><td><b>42</b></td><td>52</td><td>33</td><td class="neg">−48</td><td>launch</td><td>85</td><td class="pu ok">Minus, but out of reach (202px)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Vanish Drop Kick</td><td><b>48</b></td><td>56</td><td>18</td><td class="neg">−20</td><td>launch</td><td>74</td><td class="pu bad">Launcher (↓+I) punish, full combo (everyone)</td></tr>
          <tr><td class="cmd">U+J (super)</td><td>Shadow Army</td><td><b>238</b></td><td>56</td><td>130</td><td class="pos">+9</td><td>launch</td><td>186</td><td class="pu ok">Safe</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card ninja" data-tab="ninja" data-lang="ja" hidden>
      <h2>クロ<span>影の忍者</span></h2>
      <p class="blurb">身軽で一撃は軽めだが、どの技も隙が少ない。影と分身で惑わせ、刀で斬り込み、炎と雷で気絶させ、長いコンボにつなぐ。</p>
      <p class="note"><b>印を結ぶ。</b> クロは中技・重い技の前に三つの印を結び、背後に霊獣が現れ、頭上に印の名が出る。覚えれば何が来るか分かる（その間にジャブで止められる）：龍＝スカイドロップキック、虎＝雷撃連弾、鳳＝火遁の息、蛇＝影走り昇拳、鶴＝居合斬り、狐＝影分身、鼠＝消影滑り、烏＝消影落とし蹴り。コンボ中も空中の火柱（ファイアスパウト）では鳳凰が、U、U、Kの最後の蹴り（三日月落とし）では牛が現れる。霊獣は印を結んだ場所に残り、ゆっくり消えていく。</p>
      <p class="note"><b>溜め技（I長押し）。</b> 押している間、気が集まる。0.5秒：影走り斬り（駆け込んで斬り上げる）、空中追撃につながる。1秒以上：月の嵐（影の三日月が床を走り、吹き飛ばす）。押すだけなら通常の強攻撃。</p>
      <p class="note"><b>テーマ.</b> 影と月光・紫と銀。焼け落ちた山里出身、影から戦う無言の刺客。決め技：U、U、K「三日月落とし」（消えて頭上から三日月のかかと）／U、U、I「月昇りクナイ」（クナイが満月を描く）。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>クナイ斬り<small>強パンチ。大きく踏み込んで斬りつける。</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>三日月蹴り<small>強キック。弧を描く高い蹴り。カウンターや確定反撃で当てると打ち上げる。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>影突進アッパー<small>分身の術に見せかけて、本物のクロが影となって突進し、なめらかなアッパーで打ち上げる。ガードされたら追加入力（下記）。突進前に攻撃されると消えて背後に現れ、斬って気絶させる。</small></td><td class="cmd">→ → + U</td></tr>
          <tr class="sub"><td>影斬り<small>背後に現れて斬る。背後から当たると相手は気絶。</small></td><td class="cmd">続けて U</td></tr>
          <tr class="sub"><td>影跳び<small>高く跳んで約1秒後に落下、バウンドさせる。</small></td><td class="cmd">続けて I</td></tr>
          <tr class="sub"><td>影滑り<small>下段スライディングで浮かせ、背後に抜ける。</small></td><td class="cmd">続けて J</td></tr>
          <tr class="sub"><td>影回し蹴り<small>一回転してから回し蹴りで吹き飛ばす。回転中は潰される。</small></td><td class="cmd">続けて K</td></tr>
          <tr><td>居合斬り<small>構えてから一瞬で相手を斬り抜ける。少し遅れて斬撃が入る。ガードされると背後で大きな隙。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>分身の術<small>分身が突進して蹴る。分身は攻撃で壊せる。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>天落蹴り<small>相手の上にワープして落下蹴り、バウンドさせる。追加でJ（滑り込み）かK（振り向き蹴り）。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>火遁<small>印を結んでから炎を吐く。当たると燃えて気絶。印の途中で攻撃されると止まる。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>雷球<small>雷の球を3つ浮かべ、順番に追尾させる。当たると感電して気絶。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>消身滑り<small>ガードする影を残して下がり、滑り込んで浮かせる。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>消身踵落とし<small>影を残して下がり、高く跳んで踵落とし。バウンドさせる。</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>超必殺技：影分身・軍勢<small>6体の分身が両側から突進し、7体目が上から急降下。至近距離なら相手が手前にバウンドして追撃できる。MP満タンが必要。</small></td><td class="cmd">パンチ + キック</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="ninja">▶ クロのコンボ見本を見る</button>
      <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（昇りクナイ斬り、双クナイ、影分身昇り、影斬り）。ジャンプして追うと、U、U、IとU、U、Kは：空中クナイ斬り、空中逆斬り、クナイの雨、影車。</p>
      <h3>6つのコンボ（1回打ち上げ／2回打ち上げ）</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. アッパー打ち上げ<small>1回：↓+I、U、U、K。2回：↓+I、U、←←+U（火柱）、W、U、K。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. 影突進アッパー<small>1回：→→+U、U、U、K。2回：→→+U、U、I（昇りクナイ）、落ちてきたらK。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>3. 影の奇襲<small>突進アッパーをガードされたらUで背後から斬って気絶。1回：↓+I、U、U、K。2回：↓+I、U、I、W、U、K。</small></td><td class="cmd">→ → + U → U</td></tr>
          <tr><td>4. 天落蹴り<small>1回：→→+K、U、U、K。2回：→→+K、U、W、U、↓+K（影流星）、K。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>5. カウンター三日月蹴り<small>出がかりの攻撃を潰すと打ち上げ。1回：K、U、U、K。2回：K、U、U、I、K。</small></td><td class="cmd">K</td></tr>
          <tr><td>6. 雷で気絶<small>雷球で気絶させてダッシュ。1回：↓+I、U、U、K。2回：↓+I、U、P+K（至近の影分身）、U、K。</small></td><td class="cmd">← ← + I → ↓ + I</td></tr>
        </tbody>
      </table></div>
      <p class="note">空中の相手に←←+U・←←+I・→→+J・→→+I・←←+Kを使うと追撃版（火柱・雷の雨・分身中継・空中居合・消身踵）になる。ボタンと一緒に↓を押すと単体でも使える。空中で↓+Kは影流星（急降下蹴り）。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：クナイ斬り・逆斬り・影踏み・影の三日月。途中のIでクナイ昇り（打ち上げ）、Kで三日月蹴り。J、J、K：払い斬り・影の足払い。空中追撃：昇りクナイ斬り・双クナイ・影アッパー・月の三日月。</p>
      <h3>フレームデータ</h3>
<p class="note"><b>フレームデータ。</b> ゲーム本体で計測（1秒＝60フレーム）。<b>発生</b>：ボタンを押してから当たるまで（連続技は前の攻撃からの間隔、飛ぶ技は表示の距離で計測）。<b>ガード時／ヒット時</b>：当たった後どちらが先に動けるか。＋は攻撃側、－は防御側が先に動ける。<b>ヒット後</b>：当たる瞬間から再びガードできるまで（空振り時）。<b>全体</b>：空振りした場合、押してから再びガードできるまで（発生＋ヒット後）。 <b>ダメージ</b>：当たったときのダメージ（連続技は全体の合計。コンボの後半の攻撃は、時間のかかる技ほど65〜95%が残る）。それまではガードできないので、大きく不利な技は反撃される。弱パンチ（U）は4〜8フレーム目、打ち上げ（↓+I）は13〜16フレーム目に当たり、届く距離はキャラごとに違う：Uはカッパ・クロ・田中・テツが約80〜95px、ライラ・メイ・アルドリックが160〜185px、ジェシーの射撃はさらに遠く。↓+Iはクロ・田中・テツが85〜95px、他は120〜225px。<b>反撃</b>は不利フレームと押し返し後の距離から判定。テツは攻撃中アーマーで弱攻撃を受け流すので、強攻撃で反撃すること。</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>コマンド</th><th>技</th><th>ダメージ</th><th>発生</th><th>ヒット後</th><th>ガード時</th><th>ヒット時</th><th>全体</th><th>反撃</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Light Punch</td><td><b>29</b></td><td>9</td><td>7</td><td class="pos">+2</td><td>+5</td><td>16</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I</td><td>Kunai Slash</td><td><b>54</b></td><td>17</td><td>18</td><td class="neg">−10</td><td>+3</td><td>35</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (106px)</td></tr>
          <tr><td class="cmd">J</td><td>Light Kick</td><td><b>33</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">K</td><td>Crescent Kick</td><td><b>59</b></td><td>17</td><td>18</td><td class="neg">−10</td><td>+3</td><td>35</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (81px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>29</b></td><td>9</td><td>7</td><td class="pos">+2</td><td>+5</td><td>16</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+I</td><td>Uppercut Launcher</td><td><b>68</b></td><td>18</td><td>15</td><td class="neg">−10</td><td>打ち上げ</td><td>33</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (105px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Low Kick</td><td><b>33</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+K</td><td>Sweep</td><td><b>74</b></td><td>17</td><td>19</td><td class="neg">−10</td><td>ダウン</td><td>36</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (107px)</td></tr>
          <tr><td class="cmd">U U</td><td>Kunai Slash</td><td><b>45</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U</td><td>Reverse Slash</td><td><b>60</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U</td><td>Shadow Step</td><td><b>75</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Shadow Crescent</td><td><b>113</b></td><td>15</td><td>—</td><td class="neg">−32</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (154px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Crescent Moon Drop</td><td><b>100</b></td><td>18</td><td>—</td><td class="neg">−12</td><td>打ち上げ</td><td>—</td><td class="pu mid">弱攻撃（U）で確定（全員）</td></tr>
          <tr><td class="cmd">U U I</td><td>Moonrise Kunai</td><td><b>76</b></td><td>15</td><td>—</td><td class="neg">−15</td><td>打ち上げ</td><td>—</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">J J</td><td>Sweep Slash</td><td><b>53</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">J J K</td><td>Shadow Sweep</td><td><b>96</b></td><td>15</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (98px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Shadow Charge Upper</td><td><b>36</b></td><td>67</td><td>24</td><td class="neg">−32</td><td>打ち上げ</td><td>91</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (150px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Iai Slash</td><td><b>64</b></td><td>37</td><td>31</td><td class="neg">−32</td><td>ダウン</td><td>68</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (158px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Shadow Clone</td><td><b>53</b></td><td>28</td><td>15</td><td class="neg">−20</td><td>+11</td><td>43</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (145px)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Sky Drop Kick</td><td><b>46</b></td><td>36</td><td>31</td><td class="neg">−20</td><td>打ち上げ</td><td>67</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">←←+U</td><td>Fire Breath</td><td><b>55</b></td><td>39</td><td>59</td><td class="neg">−36</td><td>気絶</td><td>98</td><td class="pu ok">不利だが届かない (205px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Lightning Volley</td><td><b>73</b></td><td>64</td><td>12</td><td class="neg">−36</td><td>気絶</td><td>76</td><td class="pu ok">不利だが届かない (186px)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Vanish Slide</td><td><b>42</b></td><td>52</td><td>33</td><td class="neg">−48</td><td>打ち上げ</td><td>85</td><td class="pu ok">不利だが届かない (202px)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Vanish Drop Kick</td><td><b>48</b></td><td>56</td><td>18</td><td class="neg">−20</td><td>打ち上げ</td><td>74</td><td class="pu bad">打ち上げ（↓+I）で確定、フルコンボ（全員）</td></tr>
          <tr><td class="cmd">U+J （超必殺）</td><td>Shadow Army</td><td><b>238</b></td><td>56</td><td>130</td><td class="pos">+9</td><td>打ち上げ</td><td>186</td><td class="pu ok">安全</td></tr>
        </tbody>
      </table></div>
    </article>
`);
