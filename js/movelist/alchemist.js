'use strict';
// Move list: Hohen, the golem doctor, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card alchemist" data-tab="alchemist" data-lang="en">
      <h2>HOHEN<span>Golem Doctor</span></h2>
      <p class="blurb">An alchemist and doctor in a white coat, glowing stones on his chest and in his pockets, and Mortar, his stone golem. <b>U and I are the golem’s blows; J and K are Hohen’s own</b> — a stone-knuckle up close, glowing stones from further off. The golem walks out to stand between him and the opponent, and never attacks by itself.</p>
      <p class="note"><b>Duet strings.</b> Any mix of U and J, up to three presses, then a finisher: U the golem’s hammer, J his stone barrage, K his volley, I the golem’s grab, ↓ + I its uppercut. Where they stand changes the combo — golem in front of him or behind the opponent, Hohen close in or far back (see the sample combos). In a juggle: U the golem’s rising jab, J his aimed stone, I the stone pillar, → → + I the meteor, K the Stone Comet. At most lift, lift, bounce.</p>
      <p class="note"><b>The golem is solid.</b> The opponent can’t walk through it: they have to jump over it or break it (it has its own health, a third of a fighter’s; blows and shots that hit it don’t reach him). It lasts thirty seconds before it crumbles; beaten apart or worn out, it’s rebuilt five seconds later. Left on the opponent’s far side, it hops back over them. He has <b>ten stones</b>; one comes back every second and a half.</p>
      <p class="note"><b>How to fight him.</b> Hit the conductor: when Hohen is hit, the golem’s order is lost and its grab lets go. The golem’s blows can be countered too: hit it while it winds up and its blow is lost and it takes 40% more. Guard away from whoever is attacking — the golem or him. The golem’s heavy blows (hammer, uppercut, tackle) leave Hohen committed when they’re guarded or miss: punish him. Jump the grab and the Bedrock burst; throw him out of his stone skin. See the punish samples.</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Golem Jab · Hook <small>Mid. U, then U again: its other fist.</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>Golem Hammer <small>Mid + low (from above: guard standing). The third U of a string; knocks down. Guarded, Hohen is open.</small></td><td class="keys"><kbd>U</kbd> <kbd>U</kbd> <kbd>U</kbd></td></tr>
          <tr><td>Golem Low Punch <small>Low: guard crouching.</small></td><td class="cmd">↓ + U</td></tr>
          <tr><td>Golem Grab <small>Can’t be guarded (jump it, or hit Hohen). It holds them up to three seconds, facing him, and lets go after four hits or a knockdown; then it can’t grab again for two and a half seconds. Held, they take more from his blows. Also a string finisher.</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>Golem Heave <small>While it holds them: it hoists them overhead and throws them up — a launcher.</small></td><td class="keys"><kbd>I</kbd> <small>(held)</small></td></tr>
          <tr><td>Golem Uppercut <small>Mid + low. A launcher; slow, and punishable when guarded.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>Stone Knuckle / Stone Throw <small>Mid. Up close he drives a stone held in his fist (no stone spent); further off he throws one.</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>Stone Barrage <small>The third J of a string: two blows, the second knocks down.</small></td><td class="keys"><kbd>J</kbd> <kbd>J</kbd> <kbd>J</kbd></td></tr>
          <tr><td>Stone Volley <small>Mid. Three stones; the third knocks down. Hold K to charge three gauges: harder, faster stones that shove them back and wear down the guard — a full charge (MAX) breaks a full guard.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Crouching Stones <small>Thrown from a crouch at chest height: a top (stand to guard). One stone, or three.</small></td><td class="cmd">↓ + J / ↓ + K</td></tr>
          <tr><td>Stone Lob <small>Mid + low (drops from above). It stuns.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Trap Stone <small>Set on the floor ahead; bursts when they step on it, or after six seconds. Six at most.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Golem Shield Bash <small>Mid + low. A slab of stone that stops shots and bashes; safe.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Golem Tackle <small>Mid + low. It charges in from anywhere; punishable when guarded. On someone in the air: Golem Meteor, a leap that slams them into the floor (the bounce).</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Bedrock Stride <small>His skin turns to stone as he strides in (armour: blows land but don’t stop him), then it bursts all round him and knocks down. Throws and supers go through the armour; the burst runs along the floor, so jump it; punishable when guarded.</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td colspan="2"><b>In a juggle</b> (once they’re launched)</td></tr>
          <tr><td>Golem Rising Jab <small>The golem punches up and holds them in the air. U, U, U — and J in between: his stone.</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>Stone Pillar <small>The golem pounds the floor and a pillar of rock rises under them — the second lift.</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>Golem Meteor <small>The golem leaps and slams them into the floor — the bounce.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Stone Comet <small>The finisher: one big glowing stone hurled down at them.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td><b>Magnum Opus</b> <small>Super (full MP): the golem bursts into stones that fly onto them and lock them in a shell of rock; he throws six glowing stones around them, and when the circle closes it erupts and blasts them up. Guard it.</small></td><td class="keys"><kbd>U</kbd> + <kbd>J</kbd></td></tr>
          <tr><td><b>Golem Armour</b> <small>With the fusion gauge full (under his stones: it fills over thirty seconds, faster for every hit landed or taken). The golem comes apart and its pieces lock onto him one by one, boots to helmet. For twenty seconds he fights in it himself, hitting harder, taking less damage, his techniques armoured; then it crumbles and the golem rises again. In it, his commands are like Tetsu’s:</small></td><td class="cmd">← → + J + K</td></tr>
          <tr><td>· Stone fists <small>U U U U K, U U I (pillar upper, a launcher), U U K; in a juggle U U U, I, K (a burst of core light from his belly).</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>· Core Beam <small>The core in his belly fires a slow ball of light.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>· Boulder Toss <small>Rocks pack into a boulder in his hands; he hurls it over in an arc and it crashes down on them (an overhead; bounces them). In a juggle: Boulder Crash, a boulder called down out of the sky onto them.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>· Rubble Wave <small>Low: a short surge of rubble along the floor scoops them up.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>· Stone Arm <small>A giant arm of stone bursts out of the floor in front of him and smashes them away (in a juggle: under them).</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>· Rolling Boulder <small>A boulder rolled along the floor: three hits.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>· Stone Wall <small>A wall of stone springs up; whatever hits it, he bursts through it.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>· Quake Fist <small>Low: both fists into the floor; rock spikes burst along it.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>· Rock Eruption <small>Three pillars of rock erupt in a line, marching out from him; the last throws them up.</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>· Pillar Spike <small>He stays planted and a spike of rock shoots up just in front of him: it catches jumps and launches.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>· Great Core Cannon <small>Super: a great beam of gold out of his belly.</small></td><td class="keys"><kbd>U</kbd> + <kbd>J</kbd></td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card alchemist" data-tab="alchemist" data-lang="ja">
      <h2>ホーエン<span>ゴーレム博士</span></h2>
      <p class="blurb">白衣の錬金術師で医師。胸とポケットに光る石を持ち、石のゴーレム「モルタル」を連れる。<b>U・Iはゴーレムの攻撃、J・Kはホーエン自身の攻撃</b>——近くでは石を握った拳、離れると光る石を投げる。ゴーレムは博士と相手の間に立ちに行き、自分からは攻撃しない。</p>
      <p class="note"><b>二重奏の連続技。</b>UとJを好きな順で3回まで、そして締め：Uでゴーレムハンマー、Jで石の連打、Kで三連投げ、Iでゴーレムの掴み、↓+Iでアッパー。立ち位置でコンボが変わる——ゴーレムが博士の前か、相手の後ろか、博士が近いか遠いか（コンボ見本を参照）。空中コンボ：Uでゴーレムのライジングジャブ、Jで狙い石、Iで石柱、→→+Iでメテオ、Kでストーンコメット。浮かせは「浮かせ・浮かせ・バウンド」まで。</p>
      <p class="note"><b>ゴーレムは通り抜けられない。</b>相手はジャンプで越えるか、壊すしかない（自分の体力はキャラの約3分の1。ゴーレムに当たった攻撃や飛び道具は博士に届かない）。30秒で崩れ、壊されても崩れても5秒後に復活する。相手の向こう側に残ると、飛び越えて間に戻る。<b>石は10個</b>、1.5秒ごとに1個戻る。</p>
      <p class="note"><b>ホーエン対策。</b>指揮者を狙え：博士が攻撃を受けると、ゴーレムへの命令は取り消され、掴みも離れる。ゴーレムの攻撃もカウンターできる：振りかぶっている間に攻撃すると、その攻撃は潰れ、ダメージが4割増える。攻撃している側（ゴーレムか博士）の反対へガード。ゴーレムの重い攻撃（ハンマー・アッパー・タックル）は、ガードされたり外れたりすると博士が動けない——反撃を。掴みと岩肌の炸裂はジャンプでかわし、石の肌は投げで崩す。反撃見本を参照。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>ゴーレムジャブ・フック <small>中段。Uのあと、もう一度U：もう片方の拳。</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>ゴーレムハンマー <small>中下段（上から：立ちガード）。連続技の3回目のU。ダウンさせる。ガードされると博士にスキ。</small></td><td class="keys"><kbd>U</kbd> <kbd>U</kbd> <kbd>U</kbd></td></tr>
          <tr><td>ゴーレム下段パンチ <small>下段：しゃがんでガード。</small></td><td class="cmd">↓ + U</td></tr>
          <tr><td>ゴーレムの掴み <small>ガード不能（ジャンプでかわすか、博士を攻撃）。最大3秒、博士の方へ向けて押さえ、4発当たるかダウンで離す。離した後2.5秒は掴めない。捕まえている間は博士の攻撃が強くなる。連続技の締めにも。</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>ゴーレムの持ち上げ <small>掴んでいる間に：頭上に持ち上げて投げ上げる（浮かせ技）。</small></td><td class="keys"><kbd>I</kbd> <small>（掴み中）</small></td></tr>
          <tr><td>ゴーレムアッパー <small>中下段。浮かせ技。遅く、ガードされると反撃を受ける。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>石拳・石投げ <small>中段。近くでは石を握った拳（石は減らない）、離れると石を投げる。</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>石の連打 <small>連続技の3回目のJ：2発、2発目でダウン。</small></td><td class="keys"><kbd>J</kbd> <kbd>J</kbd> <kbd>J</kbd></td></tr>
          <tr><td>石の三連投げ <small>中段。石を3つ、3つ目でダウン。Kを長押しで3段階の溜め：石が強く速くなり、大きく押し飛ばし、ガードを大きく削る。最大溜め（MAX）は満タンのガードも崩す。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>しゃがみ投げの石 <small>しゃがんで胸の高さに投げる上段。立ちガードで防ぐ。1つ、または3つ。</small></td><td class="cmd">↓ + J / ↓ + K</td></tr>
          <tr><td>石の山なり投げ <small>中下段（上から落ちる）。気絶させる。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>罠の石 <small>前方の床に置く。踏むか6秒で爆発。最大6個。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>ゴーレムシールドバッシュ <small>中下段。飛び道具を止めて殴る。反撃されない。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>ゴーレムタックル <small>中下段。どこからでも突進。ガードされると反撃を受ける。空中の相手には：ゴーレムメテオ（跳んで床に叩きつける・バウンド）。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>岩肌の行進 <small>肌が石になって前進（アーマー：攻撃を受けても止まらない）、そして周囲に炸裂してダウンさせる。投げと超必殺技はアーマーを貫く。炸裂は床を走るのでジャンプでかわせる。ガードされると反撃を受ける。</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td colspan="2"><b>空中コンボ中</b>（浮かせた後）</td></tr>
          <tr><td>ゴーレムのライジングジャブ <small>上へ殴って空中に留める。U、U、U——間にJで博士の石。</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>石柱 <small>ゴーレムが床を叩き、足元から岩の柱（2回目の浮かせ）。</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>ゴーレムメテオ <small>跳び上がって床に叩きつける（バウンド）。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>ストーンコメット <small>締め：大きな光る石を叩きつける。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td><b>大いなる錬成</b> <small>超必殺技（MP満タン）：ゴーレムが石に砕けて相手に飛びつき、岩の殻で閉じ込める。周りに光る石を6つ投げ、円が閉じると錬成陣が炸裂して打ち上げる。ガード可能。</small></td><td class="keys"><kbd>U</kbd> + <kbd>J</kbd></td></tr>
          <tr><td><b>ゴーレムアーマー</b> <small>融合ゲージ満タンで（石の下のゲージ。30秒で溜まり、攻撃を当てても受けても早く溜まる）。ゴーレムが砕け、ブーツからヘルメットまで一つずつ博士に装着される。20秒間、博士自身が鎧で戦う——攻撃力が上がり、受けるダメージが減り、必殺技にアーマーが付く。その後鎧は崩れ、ゴーレムが復活する。鎧の間のコマンドはテツと同じ：</small></td><td class="cmd">← → + J + K</td></tr>
          <tr><td>・石の拳 <small>U U U U K、U U I（石柱アッパー・浮かせ）、U U K。空中コンボはU U U、I、K（腹のコアから光の炸裂）。</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>・コアビーム <small>腹のコアからゆっくり進む光の玉。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>・ボルダートス <small>岩が手に集まって大岩になり、弧を描いて投げ落とす（中下段・バウンド）。空中コンボ中は：空から大岩を呼び落とすボルダークラッシュ。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>・ラブルウェーブ <small>下段：床を走る短い瓦礫の波がすくい上げる。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>・ストーンアーム <small>目の前の床から巨大な石の腕が突き出し、殴り飛ばす（空中コンボ中は相手の真下から）。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>・ローリングボルダー <small>床を転がる大岩：3回当たる。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>・ストーンウォール <small>石の壁がせり上がり、当たった攻撃をはじいて突き破る。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>・クエイクフィスト <small>下段：両拳を床に打ち込み、岩の棘が床を走る。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>・ロックイラプション <small>岩の柱が三本、博士から順に噴き出し、最後の一本で打ち上げる。</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>・ピラースパイク <small>その場から動かず、目の前に岩の棘が突き上がる。ジャンプを落とし、浮かせる。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>・大コアキャノン <small>超必殺技：腹から金色の巨大なビーム。</small></td><td class="keys"><kbd>U</kbd> + <kbd>J</kbd></td></tr>
        </tbody>
      </table></div>
    </article>
`);
