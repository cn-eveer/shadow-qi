'use strict';
// Move list: the Alchemist, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card alchemist" data-tab="alchemist" data-lang="en">
      <h2>ALCHEMIST<span>Golem Master</span></h2>
      <p class="blurb">A doctor in a white coat, with glowing stones on his chest and in his pockets. He doesn’t fight himself: he points, and his brown stone golem does it for him. The golem walks to the opponent by itself — even when they are between the two of them — and punches on its own whenever it’s next to them.</p>
      <p class="note"><b>Guarding.</b> Guard relative to whoever is attacking: away from the golem when the golem strikes, away from the alchemist when he does.</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Golem Punch<small>The golem throws a quick punch (it comes in first if it’s far away). Crouching (↓ + U): a low punch.</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>Golem Smash<small>A heavy, slow smash that knocks them down.</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>Stone Throw<small>The alchemist throws one of his glowing stones along the floor (low).</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>Stone Volley<small>He throws three glowing stones at once, low and medium.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Copying him<small>The golem mirrors his walking, jumping, crouching and dashing; when he gives no movement, it walks to the opponent by itself.</small></td><td class="cmd">← → ↑ ↓</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card alchemist" data-tab="alchemist" data-lang="ja">
      <h2>錬金術師<span>ゴーレム使い</span></h2>
      <p class="blurb">白衣を着た医師。胸とポケットに光る石を持つ。自分では戦わず、指さして茶色い石のゴーレムに命令する。ゴーレムは自分で相手に向かって歩き（二人の間に相手がいても）、そばにいれば勝手にパンチする。</p>
      <p class="note"><b>ガード。</b>攻撃している側を基準にガードする：ゴーレムの攻撃はゴーレムの反対側、錬金術師の攻撃は錬金術師の反対側へ。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>ゴーレムパンチ<small>素早いパンチ（遠ければ先に近づく）。しゃがみ（↓＋U）は下段パンチ。</small></td><td class="keys"><kbd>U</kbd></td></tr>
          <tr><td>ゴーレムスマッシュ<small>重くて遅い一撃。ダウンさせる。</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>石投げ<small>光る石を床すれすれに投げる（下段）。錬金術師自身が投げる。</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>石の連弾<small>光る石を3つ同時に投げる（下段と中段）。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>動きをまねる<small>ゴーレムは錬金術師の歩き・ジャンプ・しゃがみ・ダッシュをまねる。操作がないときは自分で相手に向かって歩く。</small></td><td class="cmd">← → ↑ ↓</td></tr>
        </tbody>
      </table></div>
    </article>
`);
