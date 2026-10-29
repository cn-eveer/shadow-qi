'use strict';
// Move list: Lyra, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card psychic" data-tab="psychic" data-lang="en">
      <h2>LYRA<span>Psychic Sage</span></h2>
      <p class="blurb">A calm sage in a long robe who floats just above the ground. She never throws a punch: her power takes the shape of turning rune circles, crystals of light and orbs that fight beside her. She carries a tall staff topped with a glowing crystal and casts every spell through it.</p>
      <p class="note"><b>v1.3.9: her staff.</b> She holds it low down — a short end below her hand, the long end with the crystal out in front — and her rays and Crystal Shard come out of the crystal at its tip.</p>
      <p class="note"><b>Slow magic, quick feet.</b> Her attacks are the slowest in the game to come out — every magic circle holds for a moment before its crystal falls — but she walks, backs off and jumps faster than anyone.</p>
      <p class="note"><b>Crystals.</b> On the ground, a rune circle flares right where they stand, then a crystal falls into it out of a second magic circle that opens above them (or spears up out of a floor rune). Her U, U, K uses magic circles only. In a juggle she never moves: crystals form above them, wherever they are up to half the stage away, and fall on them, several at a time (U: a rune bursts on them, U: a chain of runes, I: a magic circle opens above them and the crystal meteor falls out of it and lifts them again, K: a triangular magic circle closes around them and explodes).</p>
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
          <tr class="super"><td>Super: Crystal Storm<small>Crystal shards rain in from every side, then one giant crystal. Up close it bounces them back to her. Not invincible: until the crystals come, light hits from up close don't stop it (she still takes their full damage — enough of it finishes her), but heavy attacks, techniques and anything from further away do. Needs a full MP gauge.</small></td><td class="cmd">Punch + Kick</td></tr>
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
    </article>
    <article class="card psychic" data-tab="psychic" data-lang="ja" hidden>
      <h2>ライラ<span>超能力の賢者</span></h2>
      <p class="blurb">長いローブをまとい、地面から少し浮いた静かな賢者。拳は振るわず、回る魔法陣と光の水晶、そばで戦うオーブで戦う。どの攻撃も一瞬力を溜めてから放つ。光る水晶のついた長い杖を持ち、すべての術を杖から放つ。</p>
      <p class="note"><b>v1.3.9：杖。</b>杖の下の方を握るように（手の下は短く、水晶のついた長い方が前に）。光線と水晶の欠片は、杖の先の水晶から放たれる。</p>
      <p class="note"><b>遅い魔法、速い足。</b>攻撃の発生は全キャラで一番遅い（魔法陣が少し留まってから水晶が落ちる）が、歩き・後退・ジャンプは誰よりも速い。</p>
      <p class="note"><b>水晶。</b> 地上では相手の立っている場所に魔法陣が光り、頭上に開いたもう一つの魔法陣から水晶が落ちる（床の紋からは水晶が突き上がる）。U、U、Kは魔法陣だけで戦う。空中追撃ではライラは動かない：画面の半分まで、相手がどこにいてもその上に水晶が現れて次々と降り注ぐ（U：魔法陣の炸裂、U：魔法陣の連鎖、I：頭上高くに大きな魔法陣が開き、巨大な水晶の流星が落ちて再び浮かせる、K：三角の爆発）。</p>
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
          <tr class="super"><td>超必殺技：水晶の嵐<small>四方から水晶の欠片が降り注ぎ、最後に巨大な水晶。至近距離なら手前にバウンド。無敵ではない：水晶が来るまで、近くからの弱い攻撃では止まらない（ダメージはそのまま受け、体力が尽きればKO）が、強い攻撃・必殺技・離れた位置からの攻撃では止まる。MP満タンが必要。</small></td><td class="cmd">パンチ + キック</td></tr>
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
    </article>
`);
