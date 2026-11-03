'use strict';
// Move list: Mimic, the copy robot, in English and then Japanese (shown in the ⚙ Settings drawer).
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card robot" data-tab="robot" data-lang="en">
      <h2>MIMIC<span>Copy Robot</span></h2>
      <p class="blurb">A robot of brushed steel with a visor and a glowing core. He has no techniques of his own: at the start of every round his core scans the stage and he copies one of the other fighters — chosen at random, never the same one two rounds running — and fights as them, with all of their commands, strings, specials and supers.</p>
      <p class="note"><b>Who is he now?</b> The visor, the chest core, the joints, the belt and a ring on the floor glow in the colour of the fighter he is copying (the table below), a tag over his head and his name on the health bar read MIMIC ▸ (name), and every round opens with a scan: a bar of light sweeps up his body and the name pops up.</p>
      <p class="note"><b>The copy.</b> It lasts one round, then he scans again (the first copy is rolled when the match starts). His health, guard and MP are his own, but everything else — reach, speed, guard, jumps, resources like Jesse’s bullets or Hohen’s stones and golem, Tanaka’s possessions — is the copied fighter’s, so beat him the way you would beat them. It is only a copy: <b>his blows do 92% of the damage</b> of the original’s. In an online battle both players see the same copy.</p>
      <p class="note"><b>Moves.</b> Use the copied fighter’s move list: during a fight the list opens on that fighter. In training the Mimic button (or N) steps him through the fighters so you can practise against, or as, each of them.</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Kuro<small>Copies Kuro: every command, string, special and super of Kuro.</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(170,110,255);box-shadow:0 0 6px rgb(170,110,255)"></span>violet</td></tr>
          <tr><td>Tetsu<small>Copies Tetsu: every command, string, special and super of Tetsu.</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(60,220,255);box-shadow:0 0 6px rgb(60,220,255)"></span>cyan</td></tr>
          <tr><td>Mei<small>Copies Mei: every command, string, special and super of Mei.</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(255,226,70);box-shadow:0 0 6px rgb(255,226,70)"></span>yellow</td></tr>
          <tr><td>Lyra<small>Copies Lyra: every command, string, special and super of Lyra.</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(255,110,220);box-shadow:0 0 6px rgb(255,110,220)"></span>pink</td></tr>
          <tr><td>Aldric<small>Copies Aldric: every command, string, special and super of Aldric.</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(90,150,255);box-shadow:0 0 6px rgb(90,150,255)"></span>blue</td></tr>
          <tr><td>Kappa<small>Copies Kappa: every command, string, special and super of Kappa.</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(70,230,150);box-shadow:0 0 6px rgb(70,230,150)"></span>green</td></tr>
          <tr><td>Jesse<small>Copies Jesse: every command, string, special and super of Jesse.</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(255,80,80);box-shadow:0 0 6px rgb(255,80,80)"></span>red</td></tr>
          <tr><td>Tanaka<small>Copies Tanaka: every command, string, special and super of Tanaka.</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(235,240,255);box-shadow:0 0 6px rgb(235,240,255)"></span>white</td></tr>
          <tr><td>Hohen<small>Copies Hohen: every command, string, special and super of Hohen.</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(255,140,40);box-shadow:0 0 6px rgb(255,140,40)"></span>orange</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card robot" data-tab="robot" data-lang="ja" hidden>
      <h2>ミミック<span>コピーロボ</span></h2>
      <p class="blurb">バイザーと光るコアを持つ、磨かれた鋼のロボット。自分の技は持たない：ラウンドが始まるたびにコアがステージをスキャンし、他のファイターを一人コピーする（ランダムで、2ラウンド続けて同じ相手にはならない）。そのファイターのコマンド、連続技、必殺技、超必殺技がすべて使える。</p>
      <p class="note"><b>今はだれ？</b>コピー中のファイターの色（下の表）で、バイザー・胸のコア・関節・ベルト・足元のリングが光る。頭の上のタグと体力ゲージの名前が「ミミック▸（名前）」になり、ラウンドの始まりにはスキャンの光が体を駆け上がって名前が表示される。</p>
      <p class="note"><b>コピーについて。</b>コピーは1ラウンドだけで、次のラウンドでまたスキャンする（最初のコピーは試合開始時に決まる）。体力・ガードゲージ・MPはミミック自身のものだが、リーチ・速さ・ジャンプ・ジェシーの弾やホーエンの石とゴーレム、田中の憑依など、残りはすべてコピーしたファイターと同じ。そのファイターと同じ戦い方で倒せる。あくまでコピーなので、<b>与えるダメージは本物の92%</b>。オンライン対戦では、両方のプレイヤーに同じコピーが見える。</p>
      <p class="note"><b>技について。</b>コピーしているファイターの技表を見る：対戦中は、そのファイターの技表が開く。トレーニングでは「コピー」ボタン（またはNキー）でコピーするファイターを順番に切り替えられるので、それぞれと戦ったり使ったりして練習できる。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>クロ<small>クロをコピー：クロのコマンド、連続技、必殺技、超必殺技がすべて使える。</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(170,110,255);box-shadow:0 0 6px rgb(170,110,255)"></span>紫</td></tr>
          <tr><td>テツ<small>テツをコピー：テツのコマンド、連続技、必殺技、超必殺技がすべて使える。</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(60,220,255);box-shadow:0 0 6px rgb(60,220,255)"></span>水色</td></tr>
          <tr><td>メイ<small>メイをコピー：メイのコマンド、連続技、必殺技、超必殺技がすべて使える。</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(255,226,70);box-shadow:0 0 6px rgb(255,226,70)"></span>黄</td></tr>
          <tr><td>ライラ<small>ライラをコピー：ライラのコマンド、連続技、必殺技、超必殺技がすべて使える。</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(255,110,220);box-shadow:0 0 6px rgb(255,110,220)"></span>ピンク</td></tr>
          <tr><td>アルドリック<small>アルドリックをコピー：アルドリックのコマンド、連続技、必殺技、超必殺技がすべて使える。</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(90,150,255);box-shadow:0 0 6px rgb(90,150,255)"></span>青</td></tr>
          <tr><td>カッパ<small>カッパをコピー：カッパのコマンド、連続技、必殺技、超必殺技がすべて使える。</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(70,230,150);box-shadow:0 0 6px rgb(70,230,150)"></span>緑</td></tr>
          <tr><td>ジェシー<small>ジェシーをコピー：ジェシーのコマンド、連続技、必殺技、超必殺技がすべて使える。</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(255,80,80);box-shadow:0 0 6px rgb(255,80,80)"></span>赤</td></tr>
          <tr><td>田中<small>田中をコピー：田中のコマンド、連続技、必殺技、超必殺技がすべて使える。</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(235,240,255);box-shadow:0 0 6px rgb(235,240,255)"></span>白</td></tr>
          <tr><td>ホーエン<small>ホーエンをコピー：ホーエンのコマンド、連続技、必殺技、超必殺技がすべて使える。</small></td><td class="keys"><span style="display:inline-block;width:.95em;height:.95em;border-radius:50%;vertical-align:-.12em;margin-right:.35em;background:rgb(255,140,40);box-shadow:0 0 6px rgb(255,140,40)"></span>橙</td></tr>
        </tbody>
      </table></div>
    </article>
`);
