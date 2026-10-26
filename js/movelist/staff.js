'use strict';
// Move list: Mei, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card staff" data-tab="staff" data-lang="en">
      <h2>MEI<span>Staff Prodigy</span></h2>
      <p class="blurb">A young kung fu prodigy: a girl in a formal red kung fu jacket and side-slit tunic, with a golden-capped staff like the Monkey King’s. Long reach, the highest jump, a second jump in mid-air, and attacks that come down from above.</p>
      <p class="note"><b>Charge (hold I).</b> Qi gathers into him while you hold. Half a second: Rising Cudgel, the staff swings up and lifts them — follow it with a juggle. Over a second: Typhoon Swing, a full spinning swing that sends them flying. A tap is the normal heavy attack.</p>
      <p class="note"><b>Theme.</b> Monkey king & golden cloud · gold and red. A playful prodigy who borrowed a legend’s staff. Signatures: U, U, K Golden Cudgel Crash (pole-vaults and crashes down); U, U, I Cloud Launcher (rides a little cloud up with the swing).</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Staff jab and sweep<small>Her punches are staff strikes and reach much further than anyone’s. Heavy punch is a wide sweeping swing.</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>Thrust and Low Thrust<small>U is a straight staff thrust. J raises the staff high and drives it down into a low thrust. Crouching, J pokes along the floor and K sweeps it.</small></td><td class="keys"><kbd>U</kbd> <kbd>J</kbd></td></tr>
          <tr><td>Round Swing<small>Heavy kick button: a full spin with the staff held out, hitting in front and behind; launches if it counters or punishes.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Double jump<small>Press up again in mid-air for a second jump with a somersault.</small></td><td class="cmd">W, then W</td></tr>
          <tr><td>Falling Staff<small>Heavy punch in the air: brings the staff down on them and bounces them off the ground.</small></td><td class="cmd">I in the air</td></tr>
          <tr><td>Extending Staff<small>The staff shoots out to a third of the stage.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Pole Vault Smash<small>Plants the staff, vaults over the gap and slams it down, bouncing them.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Low Staff Dance<small>A low spinning sweep that pops them up on a hit. Guarded or not, it keeps going: U rising poke, I vaults over to their other side and strikes, J a second sweep, K a pole slam that knocks them down. Up to five parts, ending with the slam. On a hit every part combos; once it is guarded, the J sweep winds up slowly and they can hit her before it.</small></td><td class="cmd">→ → + J, then U / I / J / K</td></tr>
          <tr><td>Monkey Staff Rush<small>Opens with a pole spin kick, then keeps going whether it hits or is guarded. After each part press another button: U thrusts, J sweeps low, I hops into an overhead crash (bounces them on a hit), K ends with a spinning finish that knocks them away. Up to five parts in any order, ending with the finish; it wears down their guard fast. On a hit every part combos; once it is guarded, the J sweep winds up slowly and they can hit her before it.</small></td><td class="cmd">→ → + K, then U / I / J / K</td></tr>
          <tr><td>Staff Windmill<small>Spins the staff in front: four hits, and it swats projectiles out of the air.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Cloud Somersault<small>Somersaults up onto a cloud, hangs a moment, then dives at where they are.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Somersault Kick<small>A flipping kick that launches; she can’t be hit at the very start.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Monkey Feint<small>Flips back out of reach, then springs straight back in with a thrust.</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>Rising Staff<small>Up close: sweeps the staff upward and launches.</small></td><td class="cmd">↓ + I</td></tr>
          <tr class="super"><td>Super: Great Sage Pillar<small>A giant golden-banded staff crashes down on them with a wide shockwave, six hits. Up close the last hit bounces them back to Mei. Needs a full MP gauge.</small></td><td class="cmd">Punch + Kick</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="staff">▶ Watch Mei’s sample combos</button>
      <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (staff jab lift, staff swing lift, pinwheel rise, cloud staff smash). Jumping after them, U, U, I and U, U, K become: air staff jab, air staff swing, air staff flurry, golden pinwheel.</p>
      <h3>Six combos, each with one or two juggles</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. Rising Staff<small>One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, U, I (Pinwheel Rise lifts them again), K.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. Sweeping Staff<small>One juggle: → → + J, U, U. Two juggles: → → + J, I (Pinwheel Rise lifts them again), K.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>3. Pole Vault Smash<small>One juggle: → → + I, U, U, K. Two juggles: → → + I, U, U, → → + I (Vault Spike bounces them again), U, K.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>4. Somersault Kick<small>One juggle: ← ← + J, U, U, K. Two juggles: ← ← + J, U, ← ← + I (Cloud Chase), U, ↓ + K (Staff Meteor), K.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>5. Counter Round Swing<small>The round swing launches when it catches an attack starting up. One juggle: K, U, U, K. Two juggles: K, U, → → + I (Vault Spike bounces them again), K.</small></td><td class="cmd">K</td></tr>
          <tr><td>6. Jump-in Falling Staff<small>Jump toward them, I on the way down. One juggle: U, U, K. Two juggles: U, Punch + Kick (Great Sage Pillar up close), U, K.</small></td><td class="cmd">W ↗, I</td></tr>
          <tr><td>7. Max combo: lift, lift, bounce<small>↓ + I, U, U, I (Pinwheel Rise), → → + I (Vault Spike), U, U, K.</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <p class="note">Samples 13 and 14 show both rushes against a guard. U, U, K in a juggle is staff jab, swing and whirl. While they’re launched, → → + U, → → + I, → → + K, ← ← + U and ← ← + I turn into juggle versions: Staff Lift, Vault Spike, Pole Rocket Kick, Rising Windmill and Cloud Chase. Hold ↓ with the button to use them on their own.</p>
      <p class="note"><b>Combo strings.</b> U, U, U, U, K: twin thrust, staff twirl, pole spin kick, great sweep. I from any point: Rising Staff launches; K ends with an overhead crash. J, J, K: low staff sweep, floor sweep.</p>
    </article>
    <article class="card staff" data-tab="staff" data-lang="ja" hidden>
      <h2>メイ<span>棍の天才</span></h2>
      <p class="blurb">赤い礼装の拳法着をまとった若き天才少女。孫悟空のような金の棍を振り回す。リーチが最も長く、ジャンプが最も高く、空中で二段ジャンプができる。</p>
      <p class="note"><b>溜め技（I長押し）。</b> 押している間、気が集まる。0.5秒：昇り棍（棍を振り上げて浮かせる）、空中追撃につながる。1秒以上：台風振り（回転する大振りで吹き飛ばす）。押すだけなら通常の強攻撃。</p>
      <p class="note"><b>テーマ.</b> 猿王と金の雲・金と赤。伝説の棍を借りたお茶目な天才。決め技：U、U、K「金箍棒落とし」（棒高跳びから叩きつけ）／U、U、I「雲打ち上げ」（小さな雲に乗って振り上げる）。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>棍の突きと払い<small>パンチは棍の攻撃で誰よりも遠くまで届く。Uはまっすぐな突き、Iは大きな払い。</small></td><td class="keys"><kbd>U</kbd> <kbd>I</kbd></td></tr>
          <tr><td>下段突き<small>Jは棍を高く構えてから振り下ろす下段突き。しゃがみJは床を突き、しゃがみKは払う。</small></td><td class="keys"><kbd>J</kbd></td></tr>
          <tr><td>大回転<small>Kは棍を伸ばして一回転、前後に当たる。カウンターで打ち上げ。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>二段ジャンプ<small>空中でもう一度上を押すと宙返りしながら二段ジャンプ。</small></td><td class="cmd">W → W</td></tr>
          <tr><td>落とし棍<small>空中でI。棍を振り下ろしてバウンドさせる。</small></td><td class="cmd">空中で I</td></tr>
          <tr><td>伸縮棍<small>棍が画面の3分の1まで伸びる。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>棒高跳び叩き<small>棍で跳び越えて叩きつけ、バウンドさせる。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>棍の舞<small>低い回転払いで浮かせる。当たってもガードされても続く：U突き上げ、I反対側へ跳んで一撃、J二度目の払い、K叩きつけでダウン。最大5段。当たれば全段つながるが、ガードされるとJの払いの出が遅くなり割り込まれる。</small></td><td class="cmd">→ → + J → U/I/J/K</td></tr>
          <tr><td>猿王連棍<small>棍を軸に回し蹴りから始まり、当たってもガードされても続く：U突き、J足払い、I飛び上がって叩き（ヒットでバウンド）、K回転のとどめ。最大5段。ガードを大きく削る。当たれば全段つながるが、ガードされるとJの足払いの出が遅くなり割り込まれる。</small></td><td class="cmd">→ → + K → U/I/J/K</td></tr>
          <tr><td>風車棍<small>前で棍を回して4ヒット。飛び道具を叩き落とす。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>觔斗雲<small>宙返りで雲に乗り、少し止まってから相手の位置へ急降下。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>宙返り蹴り<small>打ち上げの宙返り蹴り。出始めは無敵。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>猿のフェイント<small>後ろに宙返りして間合いを外し、すぐ突きで飛び込む。</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>昇り棍<small>至近距離で棍を振り上げて打ち上げ。</small></td><td class="cmd">↓ + I</td></tr>
          <tr class="super"><td>超必殺技：斉天大聖の柱<small>金の帯の巨大な棍が衝撃波とともに落ちてくる。6ヒット、広い範囲。至近距離なら手前にバウンド。MP満タンが必要。</small></td><td class="cmd">パンチ + キック</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="staff">▶ メイのコンボ見本を見る</button>
      <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（突き上げ、振り上げ、風車昇り、雲の棍叩き）。ジャンプして追うと、U、U、IとU、U、Kは：空中突き、空中振り、空中連打、金の風車。</p>
      <h3>6つのコンボ（1回打ち上げ／2回打ち上げ）</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. 昇り棍<small>1回：↓+I、U、U、K。2回：↓+I、U、U、I（風車昇り）、K。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. 足払い棍<small>1回：→→+J、U、U。2回：→→+J、I（風車昇り）、K。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>3. 棒高跳び叩き<small>1回：→→+I、U、U、K。2回：→→+I、U、U、→→+I（もう一度バウンド）、U、K。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>4. 宙返り蹴り<small>1回：←←+J、U、U、K。2回：←←+J、U、←←+I（雲乗り）、U、↓+K、K。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>5. カウンター大回転<small>1回：K、U、U、K。2回：K、U、→→+I（跳び叩き）、K。</small></td><td class="cmd">K</td></tr>
          <tr><td>6. 飛び込み落とし棍<small>相手に向かってジャンプし落ち際にI。1回：U、U、K。2回：U、P+K（至近の斉天大聖の柱）、U、K。</small></td><td class="cmd">W ↗ → I</td></tr>
          <tr><td>7. 最大コンボ：打ち上げ・打ち上げ・バウンド<small>↓+I、U、U、I（風車昇り）、→→+I（棒高跳び叩き）、U、U、K。</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <p class="note">見本の13と14は、二つの連続技をガードされたときの例。空中の相手に→→+U・→→+I・→→+K・←←+U・←←+Iを使うと追撃版になる。↓を押しながら使うと単体でも出る。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：二段突き・棍回し・棍回し蹴り・大払い。途中のIで昇り棍（打ち上げ）、Kで振り下ろし。J、J、K：低い払い・床払い。</p>
    </article>
`);
