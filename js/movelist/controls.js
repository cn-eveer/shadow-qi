'use strict';
// Move list: Controls, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card ctl" data-tab="ctl" data-lang="en">
      <h2>Controls</h2>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Walk left, right</td><td class="keys"><kbd>A</kbd> <kbd>D</kbd> or <kbd>←</kbd> <kbd>→</kbd></td></tr>
          <tr><td>Jump</td><td class="keys"><kbd>W</kbd> or <kbd>↑</kbd></td></tr>
          <tr><td>Crouch</td><td class="keys"><kbd>S</kbd> or <kbd>↓</kbd></td></tr>
          <tr><td>Punch: light, heavy<small>Punches hit high, so a crouching opponent ducks under them.</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>Kick: light, heavy<small>J is always a low kick. K hits the middle.</small></td><td class="keys"><kbd>J</kbd> <kbd>K</kbd></td></tr>
          <tr><td>Guard<small>Hold away from your opponent. It guards every attack, standing or crouching.</small></td><td class="keys">hold ←</td></tr>
          <tr><td>Dash<small>Tap toward the opponent twice. Attacks come straight out of the dash.</small></td><td class="keys">→ →</td></tr>
          <tr><td>Back dash<small>Tap away twice: a quick hop back. You can still be hit during it. Tap twice again to keep backing off.</small></td><td class="keys">← ←</td></tr>
          <tr><td>Pause</td><td class="keys"><kbd>Esc</kbd> or <kbd>Enter</kbd></td></tr>
        </tbody>
      </table></div>
      <h3>Moves every fighter has</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Crouching attacks<small>↓ + J is a low kick and ↓ + K a sweep that knocks down. ↓ + U is a low punch and ↓ + I an uppercut that launches (Tetsu’s ↓ + I is Rising Fist).</small></td><td class="cmd">↓ + attack</td></tr>
          <tr><td>Jump attacks<small>The heavy ones, Hammer Fist and Flying Kick, reach further.</small></td><td class="cmd">attack in air</td></tr>
          <tr><td>Super<small>Press both together. Needs a full MP gauge.</small></td><td class="cmd">Punch + Kick</td></tr>
          <tr><td>Special cancel<small>Right after a normal attack connects, enter a special to chain into it.</small></td><td class="cmd">hit, then special</td></tr>
        </tbody>
      </table></div>
      <h3>Recovering</h3>
      <p class="note">After you get hit you need a moment to shake it off before you can attack again (you can still guard). After a heavy attack there’s also a short wait before your next attack.</p>
      <h3>Strings</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Jab, jab, leaping strike<small>Kuro hops in with a kunai slash, Tetsu with a double-fist hammer. Knocks down.</small></td><td class="cmd">U U I</td></tr>
          <tr><td>Jab, jab, slide<small>Ends with a low slide that trips the opponent.</small></td><td class="cmd">U U J</td></tr>
          <tr><td>One-Two<small>Jab, then a quick straight.</small></td><td class="cmd">U I</td></tr>
          <tr><td>One-Two, Rising Kick<small>Ends with a rising kick that knocks them away.</small></td><td class="cmd">U I K</td></tr>
          <tr><td>One-Two, slide<small>Ends with a low slide that trips.</small></td><td class="cmd">U I J</td></tr>
          <tr><td>Jab, kick<small>A jab into a mid kick that pushes them back.</small></td><td class="cmd">U K</td></tr>
          <tr><td>Three kicks<small>Two quick low kicks and a snap kick that pushes them back.</small></td><td class="cmd">J J J</td></tr>
          <tr><td>Two kicks and a roundhouse<small>Two quick low kicks, then a turning roundhouse that knocks down.</small></td><td class="cmd">J J K</td></tr>
          <tr><td>Low, mid<small>A low kick into a mid kick.</small></td><td class="cmd">J K</td></tr>
        </tbody>
      </table></div>
      <p class="note">Press the next button while the previous hit is still going. Pressed later, it’s just a single attack. On top of these strings, any light attack (U or J) that hits or is guarded can go straight into another attack, so you can build your own combos, for example J then I. Crouching ducks the jabs, and kicking low between hits interrupts a combo.</p>
      <h3>Launchers and juggles</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Uppercut launcher<small>Kuro’s crouching heavy punch. Pops the opponent into the air. Slow, and punishable if guarded.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>Rising Fist<small>Tetsu’s launcher, invincible as it starts.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>Juggle<small>While a launched opponent is in the air, U, I and K turn into juggle attacks with their own moves: Rising Palm, Elbow Lift and Uppercut on U, a rising strike on I that lifts them high again, and a Spin Kick on K to finish. A combo can lift (L) and bounce (B) the opponent only in these orders: L L, L L B, L B, L B L, B B or B L — each followed by a finisher. U, U, I in a juggle counts as a lift. One more lift or bounce than that and they drop out of the combo (“LIFT LIMIT” / “BOUNCE LIMIT”) and can’t be hit again until they land. Jump near them for air attacks: U, U, K is an air string, and K on its own smashes them down. Try ↓ + I, then U, U, K.</small></td><td class="cmd">hit them in the air</td></tr>
        </tbody>
      </table></div>
      <h3>Knockdowns</h3>
      <p class="note">Big hits that aren’t guarded knock the opponent down: roundhouses, the Sky Drop Kick, slide kicks, the Vanish Drop Kick, sweeps and more. A low kick can still hit someone lying down, once. Getting up takes a moment and you can’t be hit while rising. Tap <kbd>←</kbd> or <kbd>→</kbd> while down to roll that way instead, or press an attack while rising to strike as soon as you’re up.</p>
      <h3>Light, heavy and guarding</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Light attacks<small>Fast and safe when guarded. You recover first, so you can guard again in time.</small></td><td class="keys"><kbd>U</kbd> <kbd>J</kbd></td></tr>
          <tr><td>Heavy attacks<small>Each fighter has their own heavy punch and heavy kick with longer reach. They hit harder and drain the guard meter, but recover slowly when guarded, so a light attack can punish them up close.</small></td><td class="keys"><kbd>I</kbd> <kbd>K</kbd></td></tr>
          <tr><td>Guard meter<small>The thin bar under your health. Guarding drains it, heavy attacks and specials most of all. At zero your guard breaks and you’re left dizzy. It refills slowly while you aren’t guarding.</small></td><td></td></tr>
          <tr><td>MP gauge<small>One gauge at the bottom of the screen. It fills as you fight: when you hit, when you’re hit, when you guard and when you use techniques. (It can’t be charged.)</small></td><td></td></tr>
        </tbody>
      </table></div>
      <h3>Online battle</h3>
      <p class="note">Pick Online on the title screen, enter your username (required) and choose your fighter. Random match pairs you with whoever else is waiting; to play a friend, one of you creates a room with a number and the other joins with the same number. The host plays on the left. Esc leaves the match. Online play needs the page hosted on the web (for example GitHub Pages).</p>
      <h3>CPU vs CPU</h3>
      <p class="note">Pick CPU vs CPU on the title screen (or press <kbd>C</kbd> there) to watch the two CPUs fight a full match. The fighter you pick plays on the left and the CPU opponent you pick on the right. They play the sample combos: hit-confirming jabs into launchers, punishing with counters, chasing launched or stunned opponents, and the name of each combo shows under the hit counter. Press <kbd>Esc</kbd> to pause or quit.</p>
      <h3>Training mode</h3>
      <p class="note">Pick Training on the title screen. Nobody gets knocked out and health refills by itself. The panel at the top shows the frame advantage of the last attack that connected; a plus number means the attacker recovers first. The dummy starts out guarding automatically. Use the buttons above the game or the keys: <kbd>R</kbd> resets both fighters to their start positions with full health, <kbd>T</kbd> switches the dummy between standing still, guarding, crouching, jumping and fighting back, and <kbd>M</kbd> turns the MP refill on or off.</p>
      <p class="note">→ → means tap toward your opponent twice, then press the button; ← ← means tap away from them twice. → means toward your opponent and ← means away, so they flip when you switch sides. Punch is <kbd>U</kbd> (light) or <kbd>I</kbd> (heavy) and Kick is <kbd>J</kbd> (light) or <kbd>K</kbd> (heavy); each one gives a different special. Holding ↓ when you press the button gives the rising version of that special (see each fighter).</p>
      <p class="note"><b>Combo damage.</b> The attack that starts a combo does its full damage (including all of its own hits). Every attack after it in the same combo keeps 65–95% of its damage, depending on how long it takes: a quick jab keeps about 72%, a heavy blow about 93%, a big technique 95%. Slow, committed attacks are worth more in a combo; the frame data in each fighter’s move list shows the damage of every command.</p>
      <p class="note"><b>Jumping and air guard.</b> Someone who simply jumps is not in a combo: hold back (away from the attacker) in the air to guard. Only an opponent who has been launched (knocked into the air by a launcher) can be juggled, and they can’t guard until they land.</p>
      <p class="note"><b>Techniques: fast, moderate, heavy.</b> Every → → / ← ← technique has a tier. <b>Fast</b> ones are quick and safe when guarded — only a faster attack beats them. <b>Moderate</b> ones start with a tell (hand signs, a staff twirl, a tug of the tie…): a quick jab during the tell counters them, and when guarded they can be punished by quick attacks (U, U). <b>Heavy</b> ones have a longer tell and are punished hard when guarded (a launcher and a juggle). Inside a combo the tell is skipped. Supers are always safe. <b>Five-hit strings:</b> if the last hit of U, U, U, U, K is guarded, its user is left wide open (a launcher punishes it) — and a string that ends in a throw can’t grab someone who is guarding. <b>Armor:</b> Tetsu’s moderate and heavy techniques and Aldric’s Rampart Charge take the hits but don’t stop — they can only be punished afterwards. The “punishes” button shows every technique countered, punished, or safe.</p>
      <p class="note"><b>Low attacks.</b> Sweeps, slides, low strings and shots aimed at the feet must be guarded <b>crouching</b> (hold back and down) — a standing guard won’t stop them (Aldric’s and Tanaka’s auto guard won’t either). <b>Getting up:</b> for a moment after standing up a fighter can’t be hit — they glow pale and blink — and a ring closes in on them the instant they can be hit again.</p>
      <p class="note"><b>On a phone or tablet.</b> Hold it sideways. The pad at the bottom left moves you (push it toward the opponent to walk, up to jump, down to crouch, away to guard; tap it twice quickly for → → or ← ←). The four buttons on the right are U I / J K — press U and J together for a super, and hold a button to charge. ❚❚ pauses. You can add the game to your home screen to play it full screen.</p>
    </article>
    <article class="card ctl" data-tab="ctl" data-lang="ja" hidden>
      <h2>操作<span></span></h2>
      <div class="scroll"><table>
        <tbody>
          <tr><td>左右に歩く<small></small></td><td class="cmd">A D / ← →</td></tr>
          <tr><td>ジャンプ<small>相手を飛び越えられる高さ。</small></td><td class="cmd">W / ↑</td></tr>
          <tr><td>しゃがむ<small></small></td><td class="cmd">S / ↓</td></tr>
          <tr><td>パンチ（弱・強）<small>パンチは上段。しゃがんだ相手には当たらない。</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>キック（弱・強）<small>Jは下段蹴り、Kは中段。</small></td><td class="keys"><kbd>J</kbd> <kbd>K</kbd></td></tr>
          <tr><td>ガード<small>相手と反対方向を押し続ける。立ちでもしゃがみでもすべての攻撃をガード。</small></td><td class="cmd">← 押しっぱなし</td></tr>
          <tr><td>MPチャージ<small>押し続けるとMPゲージがたまる。チャージ中はガードできない。</small></td><td class="cmd">P 押しっぱなし</td></tr>
          <tr><td>ダッシュ<small>相手の方向に2回。ダッシュからそのまま攻撃できる。</small></td><td class="cmd">→ →</td></tr>
          <tr><td>バックダッシュ<small>反対方向に2回。素早く後ろへ下がる。攻撃は当たる。続けて2回押すとさらに下がる。</small></td><td class="cmd">← ←</td></tr>
          <tr><td>一時停止<small></small></td><td class="cmd">Esc / Enter</td></tr>
        </tbody>
      </table></div>
      <h3>全員共通の技</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>しゃがみ攻撃<small>↓+Jは下段蹴り、↓+Kはダウンを奪う足払い。↓+Iは打ち上げ（キャラごとに形が違う）。</small></td><td class="cmd">↓ + 攻撃</td></tr>
          <tr><td>ジャンプ攻撃<small>強攻撃はリーチが長い。</small></td><td class="cmd">空中で攻撃</td></tr>
          <tr><td>超必殺技<small>同時押し。MPゲージ満タンが必要。</small></td><td class="cmd">パンチ + キック</td></tr>
          <tr><td>必殺技キャンセル<small>通常技が当たった直後に必殺技を入力するとつながる。</small></td><td class="cmd">ヒット → 必殺技</td></tr>
        </tbody>
      </table></div>
      <h3>打ち上げと追撃</h3>
      <p class="note">打ち上げた相手が空中にいる間、U・I・Kは追撃技になる。近くでジャンプすると空中連続技。1回のコンボで打ち上げ（L）とバウンド（B）ができる順番は、L・L、L・L・B、L・B、L・B・L、B・B、B・L のみ（そのあと締めの一撃）。空中追撃のU、U、Iも打ち上げに数える。それを超えると相手はコンボから外れ（「打ち上げ上限」／「バウンド上限」）、着地するまで当たらない。気絶は数えない。</p>
      <h3>ダウンと起き上がり</h3>
      <p class="note">大きな攻撃を受けるとダウンする。倒れた相手には下段蹴りが一度だけ当たる。起き上がりは無敵。倒れている間に←か→で転がって移動、起き上がり中に攻撃を押すとすぐ反撃。</p>
      <h3>弱・強とガード</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>弱攻撃<small>速く、ガードされても安全。</small></td><td class="keys"><kbd>U</kbd> <kbd>J</kbd></td></tr>
          <tr><td>強攻撃<small>リーチが長く威力も高いが、ガードされると弱攻撃で反撃される。</small></td><td class="keys"><kbd>I</kbd> <kbd>K</kbd></td></tr>
          <tr><td>ガードゲージ<small>体力の下の細いバー。ガードすると減り、0になるとガードブレイクで気絶。</small></td><td class="cmd"></td></tr>
          <tr><td>MPゲージ<small>画面下。戦うとたまる：攻撃を当てる・受ける・ガードする・技を使う。（チャージはできない）</small></td><td class="cmd"></td></tr>
        </tbody>
      </table></div>
      <h3>ノックバック</h3>
      <p class="note">攻撃を受けると後ろに押し出される。壁際で相手が下がれないときは、その分だけ攻撃側が押し戻される。空中でも弱攻撃より強攻撃のほうが大きく飛ぶ。</p>
      <h3>オンライン対戦</h3>
      <p class="note">タイトル画面でオンラインを選び、ユーザー名（必須）を入力してキャラを選ぶ。ランダムマッチは待っている相手と自動で対戦。友だちと遊ぶときは、片方が番号を決めてルームを作り、もう片方が同じ番号で参加する。ルームを作った側が左。Escで退出。オンライン対戦はWeb上（GitHub Pagesなど）に置いたページで動作します。</p>
      <h3>CPU対CPUとトレーニング</h3>
      <p class="note">タイトル画面でCPU対CPUを選ぶ（またはC）と、選んだ2人のCPUが対戦する。コンボ見本のルートを使い、コンボ名がヒット数の下に表示される。トレーニングではKOされず、体力は自動で回復。上の表示で最後の攻撃の有利フレームが見られる。ダミーは最初から自動でガードする。Rで位置リセット、Tでダミーの動き切替、MでMP回復のオン・オフ。</p>
      <p class="note">→→は相手の方向に2回、←←は反対方向に2回押してからボタン。→は相手の方向、←はその反対なので、左右が入れ替わると逆になる。ボタンと一緒に↓を押すと、その必殺技の「上昇版」が出る。</p>
      <p class="note"><b>コンボのダメージ。</b> コンボの最初の攻撃は全ダメージ（その技自身の連続ヒットも含む）。続く攻撃は、その技にかかる時間に応じて65〜95%のダメージ：速いジャブは約72%、重い一撃は約93%、大技は95%。時間のかかる技ほどコンボで重くなる。各キャラの技表のフレームデータに全コマンドのダメージを記載。</p>
      <p class="note"><b>ジャンプと空中ガード。</b> ただジャンプしているだけならコンボ中ではない：空中で後ろ（相手と反対側）を押すとガードできる。空中追撃ができるのは打ち上げ技で浮かされた相手だけで、着地するまでガードできない。</p>
      <p class="note"><b>技の種類：速い・中・重い。</b> →→・←←の技にはそれぞれ種類がある。<b>速い技</b>はガードされても安全で、より速い攻撃でしか止められない。<b>中技</b>は予備動作（印を結ぶ、棍を回す、ネクタイを直す…）から始まり、その間に素早いジャブでカウンターできる。ガードすれば素早い攻撃（U、U）で反撃できる。<b>重い技</b>は予備動作が長く、ガードすると大きく反撃される（打ち上げから空中追撃）。コンボ中は予備動作なし。超必殺技は常に安全。<b>5連撃：</b>U、U、U、U、Kの最後の一撃をガードされると大きな隙ができる（打ち上げで反撃できる）。投げで終わる連撃はガード中の相手をつかめない。<b>アーマー：</b>テツの中技・重い技とアルドリックのランパートチャージは攻撃を受けても止まらない（後から反撃するしかない）。「反撃見本」で全ての技のカウンター・反撃・安全を確認できる。</p>
      <p class="note"><b>下段攻撃。</b>足払い・スライディング・下段の連撃・足元への射撃は<b>しゃがみガード</b>（後ろ＋下）でしか防げない。立ちガードでは止められない（アルドリックと田中のオートガードも同じ）。<b>起き上がり：</b>立ち上がった直後は少しの間無敵（白く光って点滅する）。無敵が切れた瞬間、輪が縮んで知らせる。</p>
      <p class="note"><b>スマホ・タブレットで遊ぶ場合。</b>横向きにして持ちます。左下のパッドで移動（相手の方へ倒すと前進、上でジャンプ、下でしゃがみ、後ろでガード。2回素早く倒すと→→や←←）。右の4つのボタンが U I / J K。U と J の同時押しで超必殺技、長押しでチャージ。❚❚ で一時停止。ホーム画面に追加すると全画面で遊べます。</p>
    </article>
`);
