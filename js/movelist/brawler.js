'use strict';
// Move list: Tetsu, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card brawler" data-tab="brawler" data-lang="en">
      <h2>TETSU<span>Qi Brawler</span></h2>
      <p class="blurb">Slower but hits hard. Heavy fists up close, qi to cover the distance, and six ways to launch you into a juggle. Charges MP faster than Kuro. Before each technique he pulls his fists back to gather qi. While he’s attacking he shrugs off up to three weak hits (ARMOR), but anything heavier still stops him.</p>
      <p class="note"><b>Charge (hold I).</b> Qi gathers into him while you hold. Half a second: Charged Qi Palm, a rising palm full of qi lifts them — follow it with a juggle. Over a second: Mountain Qi Blast, a blast of qi from both palms sends them across the stage. A tap is the normal heavy attack.</p>
      <p class="note"><b>Theme.</b> Iron qi & mountains · cyan and bronze. A temple brawler who trained by breaking stone. Signatures: U, U, K Mountain Splitter (stomps the ground open, then twin palms); U, U, I Ascending Dragon (a qi dragon coils up around him).</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Qi Palm<small>Heavy punch. A palm strike with a qi burst that blasts the opponent back and drains more guard.</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>Axe Kick<small>Heavy kick. Steps in and drops the heel from above; knocks down, and launches if it counters or punishes.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Qi Blast<small>A big, slower projectile.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Meteor Fist<small>Leaps in and slams both fists down, bouncing them off the ground. Can be hit on the way in.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Qi Sweep<small>Lunges in low and scoops them up with both palms.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Shoulder Charge<small>A short shoulder tackle that knocks them back. Slow, and punishable if guarded.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Qi Orb<small>A slow floating orb that hits three times.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Qi Parry<small>A stance. Anything that hits him during it is parried, and a melee attack gets a launching palm back (projectiles are just absorbed).</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Earth Stomp<small>A shockwave along the floor. Hits low, even someone lying down. Projectiles and rays pass through him while he stomps.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Cyclone Lariat<small>Backsteps, then spins forward with both arms out: three hits that launch. While he spins, projectiles and rays (Lyra’s shots, fireballs, lightning) pass through him; only close-range attacks can hit him.</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>Rising Fist<small>An invincible corkscrew uppercut that launches.</small></td><td class="cmd">↓ + I</td></tr>
          <tr class="super"><td>Super: Great Qi Cannon<small>A screen-long qi beam that hits 13 times. Needs a full MP gauge.</small></td><td class="cmd">Punch + Kick</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="brawler">▶ Watch Tetsu’s sample combos</button>
      <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (twin palm lift, hammer fist, qi geyser palm, thunder palms). Jumping after them, U, U, I and U, U, K become: air palm, air elbow, hundred fists, falling mountain.</p>
      <h3>Six combos, each with one or two juggles</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. Rising Fist<small>One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, I (Rising Dragon Fist lifts them again), → → + K (Shoulder Rocket).</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. Qi Sweep<small>One juggle: → → + J, U, U, K. Two juggles: → → + J, U, → → + I (Hammer Spike bounces them again), K.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>3. Cyclone Lariat<small>One juggle: ← ← + K, U, U, K. Two juggles: ← ← + K, U, → → + U (Qi Geyser lifts them again), W, U, I, K.</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>4. Meteor Fist<small>One juggle: → → + I, U, ← ← + K (Air Cyclone), U, U, K. Two juggles: → → + I, U, ← ← + K, U, ↓ + K (Meteor Knee bounces them again), K.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>5. Counter Axe<small>The heavy kick launches when it catches an attack starting up. One juggle: K, U, U, K. Two juggles: K, U, ← ← + U (Qi Spiral), W, U, ↓ + K (Meteor Knee), K.</small></td><td class="cmd">K</td></tr>
          <tr><td>6. Qi Parry<small>Parry an attack; the palm launches them. One juggle: U, U, K. Two juggles: U, U, I (Rising Dragon Fist), Punch + Kick (Great Qi Cannon, needs a full MP gauge).</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>7. Max combo: lift, lift, bounce<small>↓ + I, U, I (Qi Geyser Palm), → → + I (Hammer Spike), U, U, K.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>8. Max combo: lift, bounce, lift<small>↓ + I, U, → → + I (Hammer Spike), U, I (Qi Geyser Palm), → → + K (Shoulder Rocket).</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <p class="note">Like Kuro, a combo can lift (L) and bounce (B) the opponent only as B L L, B L B, B B, L B L or L L B. While the opponent is launched, Tetsu’s → → + U, → → + I, → → + K, ← ← + U and ← ← + K turn into juggle versions. To watch them all (each starter with one juggle, then with two, and the two max combos), pick Tetsu combos on the title screen.</p>
      <h3>Combo techniques on their own</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Qi Geyser<small>A qi pillar right in front. Pops them up, so it starts a combo too.</small></td><td class="cmd">→ → then ↓ + U</td></tr>
          <tr><td>Hammer Spike<small>Jumps up and hammers down on them. Knocks down.</small></td><td class="cmd">→ → then ↓ + I</td></tr>
          <tr><td>Shoulder Rocket<small>A rising shoulder that sends them flying; a strong anti-air.</small></td><td class="cmd">→ → then ↓ + K</td></tr>
          <tr><td>Qi Spiral<small>Qi orbs rise up from under them.</small></td><td class="cmd">← ← then ↓ + U</td></tr>
          <tr><td>Air Cyclone<small>A lariat that spins up into the air; he can keep attacking in the air afterwards.</small></td><td class="cmd">← ← then ↓ + K</td></tr>
          <tr><td>Meteor Knee<small>A knee-first dive from any jump. Knocks down.</small></td><td class="cmd">↓ + K in the air</td></tr>
          <tr><td>Anti-air<small>Near a jumping opponent, U, I and K become Twin Palm Lift, Rising Dragon Fist and Twin Dragon Palms, and the specials above come out on their own. In the air, U, I and K start the air string against them.</small></td><td class="cmd">U, I, K</td></tr>
        </tbody>
      </table></div>
      <p class="note"><b>Combo strings.</b> U, U, U, U, K: qi straight, body blow, elbow smash, twin qi palms. I from any point: Rising Dragon launches; K ends with an axe kick. J, J, K: low kick, sweeping stomp. In a juggle: twin palm lift, hammer fist, body upper, qi explosion. In the air: palm, elbow, qi flurry, qi burst; I alone is an air hammer fist.</p>
      <h3>Frame data</h3>
<p class="note"><b>Frame data.</b> Measured from the game itself at 60 frames a second. <b>Startup</b>: frames from pressing the button until it hits (for a string, the frames that hit takes after the previous one; for moves that travel, at the distance shown). <b>On guard / On hit</b>: who recovers first after it connects — plus means the attacker can act first, minus means the defender can. <b>After</b>: frames from the moment it hits until he can guard again (if it misses). <b>Total</b>: frames from the press until he can guard again if it misses (startup + after). <b>Damage</b>: what it does when it hits (for a string, the whole string; later hits in a combo keep 65–95% depending on how long they take). Until then he can’t guard, so a whiffed or guarded move with a big minus can be punished: a light punch (U) hits on frame 4–8 and a launcher (↓+I) on frame 13–16, and how far they reach depends on the fighter: U reaches about 80–95px for Kappa, Kuro, Tanaka and Tetsu, 160–185px for Lyra, Mei and Aldric, and further with Jesse’s shot; ↓+I reaches 85–95px for Kuro, Tanaka and Tetsu and 120–225px for the others. <b>Punish</b> combines the minus with the distance left after the pushback. Tetsu’s armor shrugs off light hits while he attacks, so punish him with a heavy attack.</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>Command</th><th>Move</th><th>Damage</th><th>Startup</th><th>After</th><th>On guard</th><th>On hit</th><th>Total</th><th>Punish</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Light Punch</td><td><b>45</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I</td><td>Qi Palm</td><td><b>84</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>+3</td><td>39</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy) (112px)</td></tr>
          <tr><td class="cmd">J</td><td>Light Kick</td><td><b>43</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">K</td><td>Axe Kick</td><td><b>77</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>knockdown</td><td>39</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy) (83px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>45</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+I</td><td>Rising Fist</td><td><b>68</b></td><td>4</td><td>44</td><td class="neg">−32</td><td>launch</td><td>48</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Low Kick</td><td><b>43</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+K</td><td>Sweep</td><td><b>96</b></td><td>17</td><td>24</td><td class="neg">−10</td><td>knockdown</td><td>41</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy) (112px)</td></tr>
          <tr><td class="cmd">U U</td><td>Qi Straight</td><td><b>71</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U</td><td>Body Blow</td><td><b>96</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U</td><td>Elbow Smash</td><td><b>128</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Twin Qi Palms</td><td><b>197</b></td><td>15</td><td>—</td><td class="neg">−32</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy) (171px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Mountain Splitter</td><td><b>149</b></td><td>18</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy) (118px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Ascending Dragon</td><td><b>122</b></td><td>14</td><td>—</td><td class="neg">−15</td><td>launch</td><td>—</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy)</td></tr>
          <tr><td class="cmd">J J</td><td>Low Kick</td><td><b>69</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">J J K</td><td>Sweeping Stomp</td><td><b>118</b></td><td>15</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy) (114px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Qi Blast</td><td><b>60</b></td><td>27</td><td>24</td><td class="neg">−20</td><td>−4</td><td>51</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Meteor Fist</td><td><b>50</b></td><td>43</td><td>27</td><td class="neg">−32</td><td>launch</td><td>70</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Qi Sweep</td><td><b>38</b></td><td>29</td><td>29</td><td class="neg">−32</td><td>launch</td><td>58</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Shoulder Charge</td><td><b>56</b></td><td>27</td><td>29</td><td class="neg">−20</td><td>knockdown</td><td>56</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Qi Orb</td><td><b>57</b></td><td>26</td><td>20</td><td class="pos">+6</td><td>knockdown</td><td>46</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">←←+I</td><td>Qi Parry</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>49</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Earth Stomp</td><td><b>32</b></td><td>32</td><td>20</td><td class="neg">−32</td><td>knockdown</td><td>52</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy) (155px)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Cyclone Lariat</td><td><b>56</b></td><td>33</td><td>32</td><td class="neg">−32</td><td>launch</td><td>65</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse (light hits bounce off his armor: use a heavy)</td></tr>
          <tr><td class="cmd">U+J (super)</td><td>Qi Cannon</td><td><b>274</b></td><td>71</td><td>123</td><td class="pos">+1</td><td>knockdown</td><td>194</td><td class="pu ok">Safe</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card brawler" data-tab="brawler" data-lang="ja" hidden>
      <h2>テツ<span>気の拳士</span></h2>
      <p class="blurb">動きは遅いが一撃が重い。技の前に拳を引いて気を溜める（その間に攻撃されると中断）。攻撃中は弱い攻撃を3回まで耐える（アーマー）。</p>
      <p class="note"><b>溜め技（I長押し）。</b> 押している間、気が集まる。0.5秒：溜め気掌（気を込めた掌で浮かせる）、空中追撃につながる。1秒以上：山の気功砲（両掌から気の奔流、画面の端まで吹き飛ばす）。押すだけなら通常の強攻撃。</p>
      <p class="note"><b>テーマ.</b> 鉄の気と山・水色と青銅。岩を砕いて修行した寺の拳士。決め技：U、U、K「山割り」（地面を踏み割り、双掌）／U、U、I「昇龍」（気の龍が体に巻きつき昇る）。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>気功掌<small>強パンチ。気の爆発で吹き飛ばし、ガードを大きく削る。</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>踵落とし<small>強キック。上から踵を落としてダウン。カウンターや確定反撃で打ち上げ。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>気功弾<small>大きくて遅い飛び道具。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>流星拳<small>跳び込んで両拳を叩きつけ、バウンドさせる。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>気の掬い<small>低く踏み込み、両掌で掬い上げる。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>肩当て<small>短い体当たりで押し返す。ガードされると反撃される。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>気の玉<small>ゆっくり進む玉が3回当たる。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>気の受け流し<small>構え中の攻撃を受け流し、近接攻撃には打ち上げの掌底で返す。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>大地踏み<small>地を這う衝撃波。下段で、倒れた相手にも当たる。踏み込み中は飛び道具がすり抜ける。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>旋風ラリアット<small>下がってから両腕を広げて回転、3段で打ち上げ。回転中は飛び道具や光線がすり抜ける（近接攻撃だけ当たる）。</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>昇龍拳<small>無敵の螺旋アッパーで打ち上げ。</small></td><td class="cmd">↓ + I</td></tr>
          <tr class="super"><td>超必殺技：大気功砲<small>画面を貫く気のビームで13ヒット。MP満タンが必要。</small></td><td class="cmd">パンチ + キック</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="brawler">▶ テツのコンボ見本を見る</button>
      <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（双掌上げ、鉄槌、気の間欠泉掌、雷掌）。ジャンプして追うと、U、U、IとU、U、Kは：空中掌、空中肘、百裂拳、落山。</p>
      <h3>6つのコンボ（1回打ち上げ／2回打ち上げ）</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. 昇龍拳<small>1回：↓+I、U、U、K。2回：↓+I、U、I（昇り龍拳）、→→+K（肩ロケット）。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. 気の掬い<small>1回：→→+J、U、U、K。2回：→→+J、U、→→+I（鉄槌落とし）、K。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>3. 旋風ラリアット<small>1回：←←+K、U、U、K。2回：←←+K、U、→→+U（気柱）、W、U、I、K。</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>4. 流星拳<small>1回：→→+I、U、←←+K（空中旋風）、U、U、K。2回：→→+I、U、←←+K、U、↓+K（流星膝）、K。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>5. カウンター踵落とし<small>1回：K、U、U、K。2回：K、U、←←+U（気の螺旋）、W、U、↓+K、K。</small></td><td class="cmd">K</td></tr>
          <tr><td>6. 気の受け流し<small>1回：U、U、K。2回：U、U、I、P+K（大気功砲、MP満タン）。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>7. 最大コンボ：打ち上げ・打ち上げ・バウンド<small>↓+I、U、I（気柱掌）、→→+I（鉄槌落とし）、U、U、K。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>8. 最大コンボ：打ち上げ・バウンド・打ち上げ<small>↓+I、U、→→+I（鉄槌落とし）、U、I（気柱掌）、→→+K（肩ロケット）。</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <p class="note">空中の相手に→→+U・→→+I・→→+K・←←+U・←←+Kを使うと追撃版（気柱・鉄槌落とし・肩ロケット・気の螺旋・空中旋風）になる。↓を押しながら使うと単体でも出る。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：気のストレート・ボディブロー・肘打ち・双気掌。途中のIで昇龍（打ち上げ）、Kで踵落とし。J、J、K：ローキック・踏みつけ払い。空中追撃：双掌上げ・鉄槌・ボディアッパー・気の爆発。空中ではIで空中鉄槌。</p>
      <h3>フレームデータ</h3>
<p class="note"><b>フレームデータ。</b> ゲーム本体で計測（1秒＝60フレーム）。<b>発生</b>：ボタンを押してから当たるまで（連続技は前の攻撃からの間隔、飛ぶ技は表示の距離で計測）。<b>ガード時／ヒット時</b>：当たった後どちらが先に動けるか。＋は攻撃側、－は防御側が先に動ける。<b>ヒット後</b>：当たる瞬間から再びガードできるまで（空振り時）。<b>全体</b>：空振りした場合、押してから再びガードできるまで（発生＋ヒット後）。 <b>ダメージ</b>：当たったときのダメージ（連続技は全体の合計。コンボの後半の攻撃は、時間のかかる技ほど65〜95%が残る）。それまではガードできないので、大きく不利な技は反撃される。弱パンチ（U）は4〜8フレーム目、打ち上げ（↓+I）は13〜16フレーム目に当たり、届く距離はキャラごとに違う：Uはカッパ・クロ・田中・テツが約80〜95px、ライラ・メイ・アルドリックが160〜185px、ジェシーの射撃はさらに遠く。↓+Iはクロ・田中・テツが85〜95px、他は120〜225px。<b>反撃</b>は不利フレームと押し返し後の距離から判定。テツは攻撃中アーマーで弱攻撃を受け流すので、強攻撃で反撃すること。</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>コマンド</th><th>技</th><th>ダメージ</th><th>発生</th><th>ヒット後</th><th>ガード時</th><th>ヒット時</th><th>全体</th><th>反撃</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Light Punch</td><td><b>45</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I</td><td>Qi Palm</td><td><b>84</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>+3</td><td>39</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で） (112px)</td></tr>
          <tr><td class="cmd">J</td><td>Light Kick</td><td><b>43</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">K</td><td>Axe Kick</td><td><b>77</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>ダウン</td><td>39</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で） (83px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>45</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+I</td><td>Rising Fist</td><td><b>68</b></td><td>4</td><td>44</td><td class="neg">−32</td><td>打ち上げ</td><td>48</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で）</td></tr>
          <tr><td class="cmd">↓+J</td><td>Low Kick</td><td><b>43</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+K</td><td>Sweep</td><td><b>96</b></td><td>17</td><td>24</td><td class="neg">−10</td><td>ダウン</td><td>41</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で） (112px)</td></tr>
          <tr><td class="cmd">U U</td><td>Qi Straight</td><td><b>71</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U</td><td>Body Blow</td><td><b>96</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U</td><td>Elbow Smash</td><td><b>128</b></td><td>11</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Twin Qi Palms</td><td><b>197</b></td><td>15</td><td>—</td><td class="neg">−32</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で） (171px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Mountain Splitter</td><td><b>149</b></td><td>18</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で） (118px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Ascending Dragon</td><td><b>122</b></td><td>14</td><td>—</td><td class="neg">−15</td><td>打ち上げ</td><td>—</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で）</td></tr>
          <tr><td class="cmd">J J</td><td>Low Kick</td><td><b>69</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">J J K</td><td>Sweeping Stomp</td><td><b>118</b></td><td>15</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で） (114px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Qi Blast</td><td><b>60</b></td><td>27</td><td>24</td><td class="neg">−20</td><td>−4</td><td>51</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で）</td></tr>
          <tr><td class="cmd">→→+I</td><td>Meteor Fist</td><td><b>50</b></td><td>43</td><td>27</td><td class="neg">−32</td><td>打ち上げ</td><td>70</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で）</td></tr>
          <tr><td class="cmd">→→+J</td><td>Qi Sweep</td><td><b>38</b></td><td>29</td><td>29</td><td class="neg">−32</td><td>打ち上げ</td><td>58</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で）</td></tr>
          <tr><td class="cmd">→→+K</td><td>Shoulder Charge</td><td><b>56</b></td><td>27</td><td>29</td><td class="neg">−20</td><td>ダウン</td><td>56</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で）</td></tr>
          <tr><td class="cmd">←←+U</td><td>Qi Orb</td><td><b>57</b></td><td>26</td><td>20</td><td class="pos">+6</td><td>ダウン</td><td>46</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">←←+I</td><td>Qi Parry</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>49</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+J</td><td>Earth Stomp</td><td><b>32</b></td><td>32</td><td>20</td><td class="neg">−32</td><td>ダウン</td><td>52</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で） (155px)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Cyclone Lariat</td><td><b>56</b></td><td>33</td><td>32</td><td class="neg">−32</td><td>打ち上げ</td><td>65</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー（アーマーで弱攻撃は効かない：強攻撃で）</td></tr>
          <tr><td class="cmd">U+J （超必殺）</td><td>Qi Cannon</td><td><b>274</b></td><td>71</td><td>123</td><td class="pos">+1</td><td>ダウン</td><td>194</td><td class="pu ok">安全</td></tr>
        </tbody>
      </table></div>
    </article>
`);
