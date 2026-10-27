'use strict';
// Move list: the Alchemist, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card alchemist" data-tab="alchemist" data-lang="en">
      <h2>ALCHEMIST<span>Golem Master</span></h2>
      <p class="blurb">A doctor in a white coat, with glowing stones on his chest and in his pockets. His brown stone golem fights beside him: it always moves toward the opponent — even when they are between the two of them: it walks in while he walks in, dashes in when he backs away, and jumps and crouches when he does. It never attacks on its own, only on his orders. The alchemist throws his glowing stones himself.</p>
      <p class="note"><b>Six stones.</b> Every stone he throws or sets as a trap uses one of the six in his pockets (shown beside his name); one comes back every second and a half. With none left, a throw only clicks.</p>
      <p class="note"><b>The golem has health.</b> Opponents can hit it. At zero it can’t move: it crumbles into a heap and is rebuilt, at full health, after ten seconds (a bar shows the time).</p>
      <p class="note"><b>Guarding.</b> Guard relative to whoever is attacking: away from the golem when the golem strikes, away from the alchemist when he does.</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Golem Punch<small>The golem throws a quick punch (it comes in first if it’s far away). Crouching (↓ + U): he and the golem both crouch for a low punch.</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>Golem Grab<small>The golem seizes them (it can’t be guarded), swaps places with them so they’re shown to the alchemist, and holds them from behind for three seconds. While they’re held his stones can’t miss and hit harder: J, J, K — the last stone knocks them loose. Also as a string: U, U, I.</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>Sand Toss<small>Punch, punch, then K: the golem flings sand and stones high into the air, and they rain down on the opponent.</small></td><td class="keys"><kbd>U</kbd> <kbd>U</kbd> <kbd>K</kbd></td></tr>
          <tr><td>Stone Throw<small>One glowing stone at chest height. In the air, thrown at the opponent.</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>Low Stone Throw<small>One stone along the floor (low). It hits a downed opponent too.</small></td><td class="cmd">↓ + J</td></tr>
          <tr><td>Stone Lob<small>He lobs a stone up and over: it drops on them and stuns.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Stone Volley<small>Three stones in a row. Hold K to charge: three gauges (Lv1, Lv2, MAX), each one makes the stones hit harder and fly faster.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Trap Stone<small>He sets a glowing stone on the floor ahead. It bursts when the opponent steps on it, or by itself after six seconds. Up to six at a time (a seventh pushes out the oldest).</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Core Blaster<small>The golem’s chest core swells and fires a beam straight out. It knocks them down.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>Golem Tackle<small>The golem charges in from anywhere on the stage and knocks them down.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Golem Shield Bash<small>The golem holds out a slab of stone: it stops shots, and bashes (a big drain on the guard).</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Low Stone Volley<small>Three stones along the floor.</small></td><td class="cmd">↓ + K</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card alchemist" data-tab="alchemist" data-lang="ja">
      <h2>錬金術師<span>ゴーレム使い</span></h2>
      <p class="blurb">白衣を着た医師。胸とポケットに光る石を持つ。茶色い石のゴーレムが隣で戦う：常に相手に向かって動く（二人の間に相手がいても）。錬金術師が歩けば歩いて近づき、後ろに下がればダッシュで詰め、ジャンプ・しゃがみもまねる。勝手に攻撃はせず、命令された技だけを出す。光る石は錬金術師自身が投げる。</p>
      <p class="note"><b>石は6個。</b>投げた石も、罠として置いた石も、ポケットの6個から1個ずつ使う（名前の横に表示）。1.5秒ごとに1個戻る。なくなると、投げても「カチッ」と鳴るだけ。</p>
      <p class="note"><b>ゴーレムには体力がある。</b>相手の攻撃を受けるとダメージ。体力が0になると動けなくなり、バラバラに崩れ、10秒後に全回復して復活する（残り時間のバー付き）。</p>
      <p class="note"><b>ガード。</b>攻撃している側を基準にガードする：ゴーレムの攻撃はゴーレムの反対側、錬金術師の攻撃は錬金術師の反対側へ。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>ゴーレムパンチ<small>素早いパンチ（遠ければ先に近づく）。しゃがみ（↓＋U）は二人ともしゃがんで下段パンチ。</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>ゴーレムの掴み<small>ゴーレムが相手を掴み（ガード不能）、位置を入れ替えて錬金術師の目の前に差し出し、後ろから3秒間押さえつける。捕まっている間は石が必ず当たり、威力も上がる：J、J、K——最後の石で振りほどく。U、U、Iの連続技にも。</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>砂石投げ<small>パンチ、パンチ、そしてK：砂と石を高く投げ上げ、相手の上に降らせる。</small></td><td class="keys"><kbd>U</kbd> <kbd>U</kbd> <kbd>K</kbd></td></tr>
          <tr><td>石投げ<small>光る石を胸の高さに1個投げる。空中では相手に向けて投げる。</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>下段石投げ<small>石を床すれすれに1個投げる（下段）。ダウン中の相手にも当たる。</small></td><td class="cmd">↓ + J</td></tr>
          <tr><td>石の山なり投げ<small>石を高く投げ上げ、相手の上に落とす。当たると気絶する。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>石の三連投げ<small>石を3つ続けて投げる。Kを長押しで溜め：ゲージは3段階（Lv1・Lv2・MAX）。段階が上がるほど威力と速さが増す。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>罠の石<small>光る石を前方の床に置く。相手が踏むか、6秒たつと爆発する。同時に6個まで（7個目は一番古いものが消える）。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>コアブラスター<small>ゴーレムの胸のコアが膨らみ、ビームを真っすぐ撃つ。ダウンさせる。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>ゴーレムタックル<small>ステージのどこからでも突進して、ダウンさせる。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>ゴーレムシールドバッシュ<small>石の盾を構える：飛び道具を止め、殴りつける（ガードゲージを大きく削る）。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>下段石の三連投げ<small>石を床すれすれに3つ。</small></td><td class="cmd">↓ + K</td></tr>
        </tbody>
      </table></div>
    </article>
`);
