'use strict';
// Move list: Aldric, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card paladin" data-tab="paladin" data-lang="en">
      <h2>ALDRIC<span>Holy Paladin</span></h2>
      <p class="blurb">A towering knight in full plate, wreathed in pale blue holy light. He is slow and sturdy: he walks and swings with weight, hits barely move him, and he has the biggest guard meter in the game. His game is built on three things: parrying, techniques you hold the button for, and the Aegis that protects him from every side.</p>
      <p class="note"><b>v1.3.9.</b> The Aegis now really feeds on his guard meter: about ten a second while it’s up, and every hit tears a huge piece out of it (two to four hits break it; it no longer refills while the Aegis is up), and it lasts four seconds at most. The sphere fades as it runs out, then flickers and cracks near the end, so the opponent can see when it will give out. Sanctuary’s dome now swells more slowly: dash out before it reaches you.</p>
      <p class="note"><b>Shining blade.</b> When he strikes, the steel shines — a bright edge along the blade and a glint running to its point.</p>
      <p class="note"><b>Auto guard.</b> Standing still, he guards by himself (except throws). The moment he moves, attacks, or is still recovering from an attack, he can be hit like anyone else, so wait for him to commit and punish him.</p>
      <p class="note"><b>Theme.</b> Holy steel · pale blue and silver. A knight sworn to guard others before himself. Signatures: U, U, K Bulwark Breaker (shield, then a cleave that leaves a cross of light); U, U, I Heaven’s Rise (a pillar of light lifts them).</p>
      <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (shield lift, sword lift, ascension, cross of judgement). Jumping after them, U, U, I and U, U, K become: air slash, air shield bash, blade halo flurry, plunging light.</p>
      <h3>Held techniques (hold the button)</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Rampart Charge<small>Hold → → + U: he digs in, lowers the shield and builds into a raging charge, red light streaming off the shield. Front attacks and projectiles bounce off. It runs four tenths of the stage at most; let go, or crash into them, for the Rampart Slam that flattens them.</small></td><td class="cmd">→ → + U (hold)</td></tr>
        </tbody>
      </table></div>
      <h3>Heavy techniques</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Heavy Cleave<small>An overhead cleave that knocks them down.</small></td><td class="cmd">I</td></tr>
          <tr><td>Heavy Thrust<small>He steps in with a thrust that pushes them away.</small></td><td class="cmd">K</td></tr>
          <tr><td>Judgement Thrust<small>A slow, deliberate wind-up, then a lunging thrust across a third of the stage that lifts them for a juggle.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Crouching Slash<small>He drops low and rushes up to four tenths of the stage, slashing down at their legs. A bounce: it hits the body as well as the legs.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Crusader Leap<small>A heavy, slow leap of four tenths of the stage at most; he crashes down sword-first and the impact rolls out to both sides. Bounces them, and even hits them while they lie on the floor.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Rising Shield<small>Up close: heaves the shield upward and launches them.</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <h3>Parry and protect</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Push Parry<small>A short, sharp shield guard that works from the 5th frame. Parry an attack from the front and he shoves them far away, unhurt. Short window, slow to recover. Projectiles are not parried (they hit him), and neither is Lyra’s magic.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Riposte Parry<small>The same quick parry, but he answers with a sword riposte that hurts them and knocks them away. A little slower to recover.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Aegis<small>A sphere of light closes around him and stops everything, from the front, from behind and from above, where a parry only works from the front. It takes a moment to cast (hit him then for a counter hit), then it stays up for four seconds — no holding — and he moves, jumps and attacks freely inside it. Hits only do a quarter of their damage but take a big bite out of his guard meter, which also drains while it’s up; if it runs out his guard breaks. When it ends, his guard meter drops to half and comes back slowly.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Rising Parry<small>A slower parry that works from the 8th frame. Parry an attack from the front and he strikes up under them: it launches, and the combo begins.</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>Super: Sanctuary<small>He plants the sword, wings of light open, and a dome of light swells around him. Caught inside, they are held and burned again and again while his health and guard come back; then the dome bursts. He is invincible while it opens. Needs a full MP meter.</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="paladin">▶ Watch Aldric’s techniques</button>
      <h3>9 samples</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1–6. Combos<small>1 Judgement Thrust. 2 Crouching Slash. 3 Crusader Leap. 4 Rising Parry. 5 Riposte Parry (knocks them away). 6 Rampart Charge from far away, then the Crusader Leap on them lying down. The juggles end with sword lift, shield lift, halo cleave (U, U, K).</small></td><td class="cmd">see note</td></tr>
          <tr><td>7–9. Techniques<small>7 Aegis stopping an attack. 8 Sanctuary. 9 Push Parry.</small></td><td class="cmd"></td></tr>
        </tbody>
      </table></div>
      <p class="note">Heavy techniques recover slowly when they miss or are guarded, but quickly when they land, so a hit leads straight into a juggle.</p>
      <p class="note"><b>Combo strings.</b> U, U, U, U, K: shield bash, rising slash, overhead cleave, holy thrust. I from any point: Ascending Shield launches; K ends with a pommel smash. U, ↓ + I: low cleave (lifts them); U, ↓ + K: shield trip. Both low. J, J, K: low cut, shield sweep. In a juggle: shield lift, sword lift, rising cleave, judgement cleave.</p>
      <h3>Max combos</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>10. Max combo: lift, lift, bounce<small>↓ + I, U, U, I (Ascension), → → + J (Crouching Slash), K.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>11. Max combo: bounce, bounce<small>→ → + K (Crusader Leap), U, U, → → + J (Crouching Slash), U, K.</small></td><td class="cmd">→ → + K</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card paladin" data-tab="paladin" data-lang="ja" hidden>
      <h2>アルドリック<span>聖騎士</span></h2>
      <p class="blurb">淡い青の聖なる光をまとう、全身鎧の大柄な騎士。動きは重く頑丈：一歩一歩、一振り一振りに重みがあり、攻撃を受けてもほとんど下がらず、ガードゲージはゲームで一番大きい。戦い方の柱は三つ：受け流し、押し続ける技、そしてあらゆる方向から身を守るイージス。</p>
      <p class="note"><b>v1.3.9。</b>イージスは本当にガードゲージを消費するように：張っている間は1秒に約10、攻撃を受けるたびに大きく削られる（2〜4発で割れる。張っている間は回復しない）。最大4秒。光の球は残りが減るほど薄くなり、終わり際には点滅してひびが入るので、相手にも切れる時がわかる。聖域のドームはゆっくり広がるように：届く前にダッシュで逃げよう。</p>
      <p class="note"><b>輝く剣。</b>斬りつけると剣そのものが輝く：刃に沿った光と、切っ先へ走るきらめき。</p>
      <p class="note"><b>オートガード。</b> 静かに立っているときは自動でガードする（投げ以外）。動いた瞬間、攻撃中、攻撃後の戻りの間は普通に当たるので、動き出したところを狙って反撃しよう。</p>
      <p class="note"><b>テーマ.</b> 聖なる鋼・淡い青と銀。自らより他者を守ると誓った騎士。決め技：U、U、K「城壁崩し」（盾から光の十字を残す斬り）／U、U、I「天への昇り」（光の柱が持ち上げる）。</p>
      <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（盾持ち上げ、剣上げ、昇天、裁きの十字）。ジャンプして追うと、U、U、IとU、U、Kは：空中斬り、空中盾打ち、剣輪連撃、急降下の光。</p>
      <h3>押し続ける技（ボタン長押し）</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>城壁突撃<small>→→+Uを押し続ける：踏ん張って盾を下げ、怒りの突進へと加速し、盾から赤い光がほとばしる。正面の攻撃と飛び道具は弾く。最長で画面の4/10まで進み、離すかぶつかると城壁の一撃で叩き伏せる。</small></td><td class="cmd">→ → + U（長押し）</td></tr>
        </tbody>
      </table></div>
      <h3>重い技</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>大斬り<small>ダウンさせる振り下ろし。</small></td><td class="cmd">I</td></tr>
          <tr><td>大突き<small>踏み込んで突き、相手を押し出す。</small></td><td class="cmd">K</td></tr>
          <tr><td>裁きの突き<small>ゆっくりと重い溜めから、画面の三分の一を突き抜ける突きで浮かせる。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>しゃがみ斬り<small>低く構えて画面の4/10まで突進し、足元へ斬り下ろす。バウンド技：脚だけでなく胴にも当たる。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>聖戦の跳躍<small>画面の4/10までの重くゆっくりした跳躍。剣ごと落下し、衝撃が左右に広がる。相手をバウンドさせ、倒れている相手にも当たる。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>盾上げ<small>至近距離で盾を振り上げて打ち上げる。</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <h3>受け流し・守り</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>押し返し<small>5フレ目から効く、短く鋭い盾の構え。正面の攻撃を受け流すと、盾で遠くへ突き放す（ダメージなし）。持続は短く、戻りは遅い。飛び道具とライラの魔法は受け流せず、そのまま当たる。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>リポスト受け流し<small>同じ素早い受け流しから、剣のリポストでダメージを与えて吹き飛ばす。戻りはやや遅い。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>イージス<small>光の球が体を包み、正面・背後・上からのすべての攻撃を止める（受け流しは正面のみ）。発動に少し時間がかかり（その間に攻撃されるとカウンター）、そのあと4秒間、押し続けなくても張り続けられ、張ったまま自由に動き、ジャンプし、攻撃もできる。攻撃のダメージは4分の1だけ通り、ガードゲージが削られ、尽きるとガードブレイク。終わるとガードゲージは半分になり、ゆっくり回復する。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>突き上げ受け流し<small>8フレ目から効く、やや遅い受け流し。正面の攻撃を受け流すと、下から突き上げて浮かせ、そのまま連続技へ。</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>超必殺技：聖域<small>剣を突き立てると光の翼が開き、光のドームが広がる。中に捕らわれた相手は何度も焼かれ、その間に体力とガードが回復し、最後にドームが弾ける。ドームが開くまでは無敵。MP満タンが必要。</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="paladin">▶ アルドリックの技を見る</button>
      <h3>9の見本</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1〜6. コンボ<small>1 裁きの突き。2 しゃがみ斬り。3 聖戦の跳躍。4 受け流しから突き上げ。5 受け流しからリポスト（吹き飛ばす）。6 遠くからの城壁突撃、倒れた相手に聖戦の跳躍。空中追撃は剣上げ・盾上げ・光輪の斬り（U、U、K）。</small></td><td class="cmd">注を参照</td></tr>
          <tr><td>7〜9. 技の見本<small>7 攻撃を止めるイージス。8 聖域。9 盾の押し返し。</small></td><td class="cmd"></td></tr>
        </tbody>
      </table></div>
      <p class="note">重い技は外したりガードされると隙が大きいが、当たるとすぐ動けるので、そのまま空中追撃につながる。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：盾打ち・斬り上げ・振り下ろし・聖なる突き。途中のIで盾上げ（打ち上げ）、Kで柄打ち。U、↓+I：下段の斬り上げ（浮かせる）／U、↓+K：下段の盾払い。J、J、K：下段斬り・盾払い。空中追撃：盾持ち上げ・剣上げ・昇り斬り・裁きの斬り。</p>
      <h3>最大コンボ</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>10. 最大コンボ：打ち上げ・打ち上げ・バウンド<small>↓+I、U、U、I（昇天）、→→+J（しゃがみ斬り）、K。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>11. 最大コンボ：バウンド・バウンド<small>→→+K（聖戦の跳躍）、U、U、→→+J（しゃがみ斬り）、U、K。</small></td><td class="cmd">→ → + K</td></tr>
        </tbody>
      </table></div>
    </article>
`);
