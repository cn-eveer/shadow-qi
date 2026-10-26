'use strict';
// Move list: Lyra, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card psychic" data-tab="psychic" data-lang="en">
      <h2>LYRA<span>Psychic Sage</span></h2>
      <p class="blurb">A calm sage in a long robe who floats just above the ground. She never throws a punch: her power takes the shape of turning rune circles, crystals of light and orbs that fight beside her. She carries a tall staff topped with a glowing crystal and casts every spell through it.</p>
      <p class="note"><b>Slow magic, quick feet.</b> Her attacks are the slowest in the game to come out — every magic circle holds for a moment before its crystal falls — but she walks, backs off and jumps faster than anyone.</p>
      <p class="note"><b>Crystals.</b> On the ground, a rune circle flares right where they stand, then a crystal falls into it out of a second magic circle that opens above them (or spears up out of a floor rune). Her U, U, K uses magic circles only. In a juggle she never moves: crystals form above them, wherever they are up to half the stage away, and fall on them, several at a time (U: a rune bursts on them, U: a chain of runes, I: a magic circle opens above them and the crystal meteor falls out of it and lifts them again, K: a triangular magic circle closes around them and explodes).</p>
      <p class="note"><b>Charge (hold I).</b> Qi gathers into him while you hold. Half a second: Rising Glyph, a rune under their feet lifts them, wherever they are — follow it with a juggle. Over a second: Nova Glyph, a giant starburst rune blasts them away. A tap is the normal heavy attack.</p>
      <p class="note"><b>Theme.</b> Astral crystal · lilac and crystal blue. A calm sage who reads the stars. Signatures: U, U, K Constellation Burst (three runes join into a constellation and burst); U, U, I Crystal Ascension (crystal spires grow under them).</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Strong Orbs<small>Summons 3 strong pink orbs. Each of her next attacks also fires one heavy ray at them, then that orb is spent.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Long Orbs<small>Summons 5 blue orbs that last much longer. Every ready one fires a lighter ray whenever she attacks.</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>Ripple and Glyph Burst<small>Light and heavy punch: a rune circle flares right where they stand, out to about 400px (the furthest normal attacks in the game).</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>Floor Glyph<small>Light kick button: no kick. A rune circle flares on the floor at their feet, wherever they are (out to about 450px), and light bursts up. Hits low.</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>Gravity Well<small>Heavy kick. A gravity glyph crushes down in front of her; launches if it counters or punishes.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Crystal Shard<small>Sends a crystal of light flying across the stage.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Falling Star<small>A giant fist of light forms above them and falls, bouncing them back toward her. In a combo it becomes a blazing star meteor out of a magic circle that slams them into the floor, and they bounce up again.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Psychic Lift<small>A glowing ring under their feet, then a column of light that lifts them and draws them toward her. Works from across the stage, but they can see it coming.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Spirit Fist<small>A giant fist of light punches out in front of her, three hits that push them far away.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Orb Burst<small>Every health orb fires a ray at them (with none, one ray from her hand).</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Triple Ray<small>Three rays at once from her hands, reaching almost half the stage; the third leaves them stunned.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Ground Burst<small>Up close: she barely moves, only raises her hand, and the ground bursts open under them in a column of light that launches.</small></td><td class="cmd">↓ + I</td></tr>
          <tr class="super"><td>Super: Crystal Storm<small>Crystal shards rain in from every side, then one giant crystal. Up close it bounces them back to her. Needs a full MP gauge.</small></td><td class="cmd">Punch + Kick</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="psychic">▶ Watch Lyra’s sample combos</button>
      <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (lifting rune, crystal rain, star pillar, trinity burst). Jumping after them, U, U, I and U, U, K become: air rune, air crystal, shard barrage, orbit burst.</p>
      <h3>Six combos, each with one or two juggles</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. Ground Burst<small>One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, → → + J (Levitate lifts them again), K.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. Psychic Lift<small>From afar. One juggle: → → + J, U, U, K. Two juggles: → → + J, U, I (Crystal Meteor lifts them again), K.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>3. Falling Star<small>One juggle: → → + I, U, U, K. Two juggles: → → + I, U, → → + I (a second star bounces them again), U, U, K.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>4. Triple Ray<small>A stun, not a lift. One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, U, I (Crystal Meteor), K.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>5. Counter Gravity Well<small>The heavy kick launches when it catches an attack starting up. One juggle: K, U, U, K. Two juggles: K, U, U, I (Crystal Meteor lifts them again), K.</small></td><td class="cmd">K</td></tr>
          <tr><td>6. Orb summons<small>One juggle: ← ← + J (strong orbs), → → + J, U, U, K. Two juggles: ← ← + K (long orbs), → → + J, U, I, K. The orbs add rays to every hit.</small></td><td class="cmd">← ← + J / K</td></tr>
          <tr><td>7. Max combo: lift, lift, bounce<small>→ → + J (Psychic Lift), U, I (Crystal Meteor), → → + I (Falling Star), K.</small></td><td class="cmd">→ → + J</td></tr>
        </tbody>
      </table></div>
      <p class="note">U, U, K in a juggle is lifting glyph, spirit glyph and force push. While they’re launched, → → + U, → → + I, → → + J and → → + K turn into juggle versions: Shard Flurry, Falling Star, Levitate and Spirit Fist Burst. Hold ↓ with the button to use them on their own.</p>
      <p class="note"><b>Combo strings.</b> Every hit comes from her staff. U, U, U, U, K: glyph spark, crystal needle, floor rune, starburst. I from any point: a Levitation Rune lifts them; K ends with Repulse. J, J, K: floor glyph, glyph trip. In a juggle: lifting rune, crystal rain, spirit rune, gravity slam. In the air: rune, crystal, crystal storm, starburst.</p>
      <h3>Frame data</h3>
<p class="note"><b>Frame data.</b> Measured from the game itself at 60 frames a second. <b>Startup</b>: frames from pressing the button until it hits (for a string, the frames that hit takes after the previous one; for moves that travel, at the distance shown). <b>On guard / On hit</b>: who recovers first after it connects — plus means the attacker can act first, minus means the defender can. <b>After</b>: frames from the moment it hits until he can guard again (if it misses). <b>Total</b>: frames from the press until he can guard again if it misses (startup + after). <b>Damage</b>: what it does when it hits (for a string, the whole string; later hits in a combo keep 65–95% depending on how long they take). Until then he can’t guard, so a whiffed or guarded move with a big minus can be punished: a light punch (U) hits on frame 4–8 and a launcher (↓+I) on frame 13–16, and how far they reach depends on the fighter: U reaches about 80–95px for Kappa, Kuro, Tanaka and Tetsu, 160–185px for Lyra, Mei and Aldric, and further with Jesse’s shot; ↓+I reaches 85–95px for Kuro, Tanaka and Tetsu and 120–225px for the others. <b>Punish</b> combines the minus with the distance left after the pushback. Tetsu’s armor shrugs off light hits while he attacks, so punish him with a heavy attack.</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>Command</th><th>Move</th><th>Damage</th><th>Startup</th><th>After</th><th>On guard</th><th>On hit</th><th>Total</th><th>Punish</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Ripple</td><td><b>33</b></td><td>12</td><td>19</td><td class="pos">+2</td><td>+5</td><td>31</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I</td><td>Glyph Burst</td><td><b>62</b></td><td>24</td><td>24</td><td class="neg">−10</td><td>+3</td><td>48</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (117px)</td></tr>
          <tr><td class="cmd">J</td><td>Floor Glyph</td><td><b>37</b></td><td>13</td><td>21</td><td class="pos">+2</td><td>+5</td><td>34</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">K</td><td>Gravity Well</td><td><b>66</b></td><td>21</td><td>24</td><td class="neg">−10</td><td>knockdown</td><td>45</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (107px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>33</b></td><td>12</td><td>19</td><td class="pos">+2</td><td>+5</td><td>31</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+I</td><td>Ground Burst</td><td><b>78</b></td><td>20</td><td>21</td><td class="neg">−10</td><td>launch</td><td>41</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (116px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Crouch Floor Glyph</td><td><b>37</b></td><td>13</td><td>21</td><td class="pos">+2</td><td>+5</td><td>34</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+K</td><td>Glyph Trip</td><td><b>83</b></td><td>17</td><td>26</td><td class="neg">−10</td><td>knockdown</td><td>43</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (117px)</td></tr>
          <tr><td class="cmd">U U</td><td>Glyph Spark</td><td><b>55</b></td><td>16</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U</td><td>Crystal Needle</td><td><b>76</b></td><td>16</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U</td><td>Floor Rune</td><td><b>100</b></td><td>16</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Starburst</td><td><b>149</b></td><td>21</td><td>—</td><td class="neg">−48</td><td>knockdown</td><td>—</td><td class="pu ok">Minus, but out of reach (287px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Constellation Burst</td><td><b>98</b></td><td>26</td><td>—</td><td class="neg">−18</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (179px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Crystal Ascension</td><td><b>86</b></td><td>22</td><td>—</td><td class="neg">−20</td><td>launch</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (167px)</td></tr>
          <tr><td class="cmd">J J</td><td>Floor Glyph 2</td><td><b>64</b></td><td>16</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">J J K</td><td>Glyph Trip</td><td><b>106</b></td><td>21</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (157px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Crystal Shard</td><td><b>37</b></td><td>25</td><td>29</td><td class="neg">−8</td><td>−11</td><td>54</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (134px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Falling Star</td><td><b>46</b></td><td>48</td><td>13</td><td class="neg">−48</td><td>launch</td><td>61</td><td class="pu ok">Minus, but out of reach (223px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Psychic Lift</td><td><b>42</b></td><td>39</td><td>21</td><td class="neg">−48</td><td>launch</td><td>60</td><td class="pu ok">Minus, but out of reach (216px)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Spirit Fist</td><td><b>54</b></td><td>25</td><td>28</td><td class="neg">−36</td><td>knockdown</td><td>53</td><td class="pu ok">Minus, but out of reach (262px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Orb Burst</td><td><b>18</b></td><td>26</td><td>36</td><td class="neg">−37</td><td>−17</td><td>62</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (165px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Triple Ray</td><td><b>56</b></td><td>28</td><td>26</td><td class="neg">−37</td><td>stun</td><td>54</td><td class="pu ok">Minus, but out of reach (185px)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Strong Orbs</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>44</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Long Orbs</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>46</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">U+J (super)</td><td>Crystal Storm</td><td><b>171</b></td><td>63</td><td>117</td><td class="pos">+6</td><td>launch</td><td>180</td><td class="pu ok">Safe</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card psychic" data-tab="psychic" data-lang="ja" hidden>
      <h2>ライラ<span>超能力の賢者</span></h2>
      <p class="blurb">長いローブをまとい、地面から少し浮いた静かな賢者。拳は振るわず、回る魔法陣と光の水晶、そばで戦うオーブで戦う。どの攻撃も一瞬力を溜めてから放つ。光る水晶のついた長い杖を持ち、すべての術を杖から放つ。</p>
      <p class="note"><b>遅い魔法、速い足。</b>攻撃の発生は全キャラで一番遅い（魔法陣が少し留まってから水晶が落ちる）が、歩き・後退・ジャンプは誰よりも速い。</p>
      <p class="note"><b>水晶。</b> 地上では相手の立っている場所に魔法陣が光り、頭上に開いたもう一つの魔法陣から水晶が落ちる（床の紋からは水晶が突き上がる）。U、U、Kは魔法陣だけで戦う。空中追撃ではライラは動かない：画面の半分まで、相手がどこにいてもその上に水晶が現れて次々と降り注ぐ（U：魔法陣の炸裂、U：魔法陣の連鎖、I：頭上高くに大きな魔法陣が開き、巨大な水晶の流星が落ちて再び浮かせる、K：三角の爆発）。</p>
      <p class="note"><b>溜め技（I長押し）。</b> 押している間、気が集まる。0.5秒：昇る紋（どこにいても足元の紋で浮かせる）、空中追撃につながる。1秒以上：新星の紋（巨大な星の紋で吹き飛ばす）。押すだけなら通常の強攻撃。</p>
      <p class="note"><b>テーマ.</b> 星と水晶・薄紫と水晶色。星を読む静かな賢者。決め技：U、U、K「星座の爆発」（3つの紋が星座を結び炸裂）／U、U、I「水晶の昇天」（足元から水晶の柱）。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>強オーブ<small>強いピンクのオーブを3つ召喚。次の攻撃ごとに1つが強い光線を放って消える。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>長オーブ<small>長持ちする青いオーブを5つ召喚。攻撃するたびに準備のできたオーブが光線を放つ。</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>波紋と紋章爆発<small>弱・強パンチ：相手の立っている場所に魔法陣が光る。約400pxまで届く（通常技ではゲーム最長）。</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>床の紋<small>キックではなく、相手がどこにいても（約450pxまで）足元の床に魔法陣が現れて光が噴き上がる。下段。</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>重力井戸<small>強キック。重力の紋で押し潰す。カウンターで打ち上げ。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>水晶の欠片<small>光の水晶を飛ばす。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>落ちる星<small>相手の上に巨大な光の拳ができて落下、手前にバウンドさせる。空中コンボ中は魔法陣から燃える星の流星が降り、床に叩きつけてバウンドさせる。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>念動浮上<small>足元に光の輪、そして光の柱で持ち上げて引き寄せる。遠くからでも届くが見切られやすい。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>霊気の拳<small>巨大な光の拳が3回殴り、遠くへ押し出す。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>オーブ破裂<small>手から光線を放つ。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>三連光線<small>両手から3本の光線を同時に放つ。3本目で気絶。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>大地噴出<small>至近距離で手を上げるだけで、相手の足元から光の柱が噴き上がって打ち上げる。</small></td><td class="cmd">↓ + I</td></tr>
          <tr class="super"><td>超必殺技：水晶の嵐<small>四方から水晶の欠片が降り注ぎ、最後に巨大な水晶。至近距離なら手前にバウンド。MP満タンが必要。</small></td><td class="cmd">パンチ + キック</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="psychic">▶ ライラのコンボ見本を見る</button>
      <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（持ち上げの紋、水晶の雨、星の柱、三角の爆発）。ジャンプして追うと、U、U、IとU、U、Kは：空中の紋、空中水晶、破片の連射、軌道の爆発。</p>
      <h3>6つのコンボ（1回打ち上げ／2回打ち上げ）</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. 大地噴出<small>1回：↓+I、U、U、K。2回：↓+I、U、→→+J（浮揚）、K。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. 念動浮上<small>遠くから。1回：→→+J、U、U、K。2回：→→+J、U、I（水晶流星）、K。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>3. 落ちる星<small>1回：→→+I、U、U、K。2回：→→+I、U、→→+I（二つ目の星）、U、U、K。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>4. 三連光線<small>気絶は打ち上げに数えない。1回：↓+I、U、U、K。2回：↓+I、U、U、I（水晶流星）、K。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>5. カウンター重力井戸<small>1回：K、U、U、K。2回：K、U、U、I（水晶流星）、K。</small></td><td class="cmd">K</td></tr>
          <tr><td>6. オーブ召喚<small>1回：←←+J（強オーブ）、→→+J、U、U、K。2回：←←+K（長オーブ）、→→+J、U、I、K。オーブがすべての攻撃に光線を加える。</small></td><td class="cmd">← ← + J / K</td></tr>
          <tr><td>7. 最大コンボ：打ち上げ・打ち上げ・バウンド<small>→→+J（念動浮上）、U、I（水晶流星）、→→+I（落ちる星）、K。</small></td><td class="cmd">→ → + J</td></tr>
        </tbody>
      </table></div>
      <p class="note">空中の相手に→→+U・→→+I・→→+J・→→+Kを使うと追撃版（欠片の連打・落ちる星・浮揚・霊気の拳の噴出）になる。↓を押しながら使うと単体でも出る。</p>
      <p class="note"><b>連続技。</b> すべて杖から放つ。U、U、U、U、K：紋の火花・水晶の針・床の紋・星の爆発。途中のIで浮遊の紋（打ち上げ）、Kで反発。J、J、K：床の紋・紋の足払い。空中追撃：持ち上げの紋・水晶の雨・霊の紋・重力落とし。</p>
      <h3>フレームデータ</h3>
<p class="note"><b>フレームデータ。</b> ゲーム本体で計測（1秒＝60フレーム）。<b>発生</b>：ボタンを押してから当たるまで（連続技は前の攻撃からの間隔、飛ぶ技は表示の距離で計測）。<b>ガード時／ヒット時</b>：当たった後どちらが先に動けるか。＋は攻撃側、－は防御側が先に動ける。<b>ヒット後</b>：当たる瞬間から再びガードできるまで（空振り時）。<b>全体</b>：空振りした場合、押してから再びガードできるまで（発生＋ヒット後）。 <b>ダメージ</b>：当たったときのダメージ（連続技は全体の合計。コンボの後半の攻撃は、時間のかかる技ほど65〜95%が残る）。それまではガードできないので、大きく不利な技は反撃される。弱パンチ（U）は4〜8フレーム目、打ち上げ（↓+I）は13〜16フレーム目に当たり、届く距離はキャラごとに違う：Uはカッパ・クロ・田中・テツが約80〜95px、ライラ・メイ・アルドリックが160〜185px、ジェシーの射撃はさらに遠く。↓+Iはクロ・田中・テツが85〜95px、他は120〜225px。<b>反撃</b>は不利フレームと押し返し後の距離から判定。テツは攻撃中アーマーで弱攻撃を受け流すので、強攻撃で反撃すること。</p>
      <div class="scroll"><table class="fd">
        <thead><tr><th>コマンド</th><th>技</th><th>ダメージ</th><th>発生</th><th>ヒット後</th><th>ガード時</th><th>ヒット時</th><th>全体</th><th>反撃</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Ripple</td><td><b>33</b></td><td>12</td><td>19</td><td class="pos">+2</td><td>+5</td><td>31</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I</td><td>Glyph Burst</td><td><b>62</b></td><td>24</td><td>24</td><td class="neg">−10</td><td>+3</td><td>48</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (117px)</td></tr>
          <tr><td class="cmd">J</td><td>Floor Glyph</td><td><b>37</b></td><td>13</td><td>21</td><td class="pos">+2</td><td>+5</td><td>34</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">K</td><td>Gravity Well</td><td><b>66</b></td><td>21</td><td>24</td><td class="neg">−10</td><td>ダウン</td><td>45</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (107px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>33</b></td><td>12</td><td>19</td><td class="pos">+2</td><td>+5</td><td>31</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+I</td><td>Ground Burst</td><td><b>78</b></td><td>20</td><td>21</td><td class="neg">−10</td><td>打ち上げ</td><td>41</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (116px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Crouch Floor Glyph</td><td><b>37</b></td><td>13</td><td>21</td><td class="pos">+2</td><td>+5</td><td>34</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+K</td><td>Glyph Trip</td><td><b>83</b></td><td>17</td><td>26</td><td class="neg">−10</td><td>ダウン</td><td>43</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (117px)</td></tr>
          <tr><td class="cmd">U U</td><td>Glyph Spark</td><td><b>55</b></td><td>16</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U</td><td>Crystal Needle</td><td><b>76</b></td><td>16</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U</td><td>Floor Rune</td><td><b>100</b></td><td>16</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Starburst</td><td><b>149</b></td><td>21</td><td>—</td><td class="neg">−48</td><td>ダウン</td><td>—</td><td class="pu ok">不利だが届かない (287px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Constellation Burst</td><td><b>98</b></td><td>26</td><td>—</td><td class="neg">−18</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (179px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Crystal Ascension</td><td><b>86</b></td><td>22</td><td>—</td><td class="neg">−20</td><td>打ち上げ</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (167px)</td></tr>
          <tr><td class="cmd">J J</td><td>Floor Glyph 2</td><td><b>64</b></td><td>16</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">J J K</td><td>Glyph Trip</td><td><b>106</b></td><td>21</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (157px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Crystal Shard</td><td><b>37</b></td><td>25</td><td>29</td><td class="neg">−8</td><td>−11</td><td>54</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (134px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Falling Star</td><td><b>46</b></td><td>48</td><td>13</td><td class="neg">−48</td><td>打ち上げ</td><td>61</td><td class="pu ok">不利だが届かない (223px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Psychic Lift</td><td><b>42</b></td><td>39</td><td>21</td><td class="neg">−48</td><td>打ち上げ</td><td>60</td><td class="pu ok">不利だが届かない (216px)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Spirit Fist</td><td><b>54</b></td><td>25</td><td>28</td><td class="neg">−36</td><td>ダウン</td><td>53</td><td class="pu ok">不利だが届かない (262px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Orb Burst</td><td><b>18</b></td><td>26</td><td>36</td><td class="neg">−37</td><td>−17</td><td>62</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (165px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Triple Ray</td><td><b>56</b></td><td>28</td><td>26</td><td class="neg">−37</td><td>気絶</td><td>54</td><td class="pu ok">不利だが届かない (185px)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Strong Orbs</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>44</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+K</td><td>Long Orbs</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>46</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">U+J （超必殺）</td><td>Crystal Storm</td><td><b>171</b></td><td>63</td><td>117</td><td class="pos">+6</td><td>打ち上げ</td><td>180</td><td class="pu ok">安全</td></tr>
        </tbody>
      </table></div>
    </article>
`);
