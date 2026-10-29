'use strict';
// Move list: Kuro, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card ninja" data-tab="ninja" data-lang="en">
      <h2>KURO<span>Shadow Ninja</span></h2>
      <p class="blurb">Quick on his feet and lighter on damage, and he recovers quickly from every move. Tricks you with shadows and clones, cuts in with his sword, stuns with fire and lightning, and has many ways to launch you into a long juggle.</p>
      <p class="note"><b>Hand signs.</b> Before each of his moderate and heavy techniques Kuro forms three seals, and a spirit rises behind him with the seal’s name above his head — learn them and you know what’s coming (and can jab him before it does): Dragon 龍 = Sky Drop Kick, Tiger 虎 = Lightning Volley, Phoenix 鳳 = Fire Breath, Serpent 蛇 = Shadow Charge Upper, Crane 鶴 = Iai Slash, Fox 狐 = Shadow Clone, Rat 鼠 = Vanish Slide, Raven 烏 = Vanish Drop Kick. In combos the phoenix also rises for his juggle Fire Spout, and a Bull 牛 for the last kick of U, U, K (Crescent Moon Drop). Each spirit stays where he cast it and slowly drifts away.</p>
      <p class="note"><b>Charge (hold I).</b> Qi gathers into him while you hold. Half a second: Shadow Rush Slash, he dashes in and slashes them into the air — follow it with a juggle. Over a second: Moon Tempest, a crescent of shadow flies along the floor and sends them flying. A tap is the normal heavy attack.</p>
      <p class="note"><b>Theme.</b> Shadow & moonlight · violet and silver. A silent assassin from a burned-down mountain village who fights from the shadows. Signatures: U, U, K Crescent Moon Drop (vanishes, drops a crescent heel from above); U, U, I Moonrise Kunai (a full moon of kunai).</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Kunai Slash<small>Heavy punch. Lunges in with a wide blade slash.</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>Crescent Kick<small>Heavy kick. A high arcing kick that also catches jumpers.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Sweep<small>Low, with a long reach. Knocks down; like the Crescent Kick, on a counter hit or a punish it launches them instead: juggle with U, U, K.</small></td><td class="cmd">↓ + K</td></tr>
          <tr><td>Shadow Charge Upper<small>Looks exactly like Shadow Clone Strike, but the shadow dashing in is the real Kuro and the one doing the hand sign is a decoy. It ends in a smooth rising uppercut that launches the opponent so you can juggle them. If the uppercut is guarded or misses, pick a follow-up instead. If he’s hit before the kick, he vanishes, reappears behind the attacker and slashes, leaving them stunned so he can launch them.</small></td><td class="cmd">→ → + U</td></tr>
          <tr class="sub"><td>Shadow Strike<small>Reappears behind the opponent and slashes. Hit from behind, they’re left stunned, so you can launch them with ↓ + I.</small></td><td class="cmd">then U</td></tr>
          <tr class="sub"><td>Shadow Leap<small>Jumps high and crashes down about a second later, bouncing the opponent into a juggle. Walking back can dodge it.</small></td><td class="cmd">then I</td></tr>
          <tr class="sub"><td>Shadow Slide<small>Low sliding kick that pops the opponent up; he slides through, ends up behind and can juggle them.</small></td><td class="cmd">then J</td></tr>
          <tr class="sub"><td>Shadow Roundhouse<small>Turns all the way around, then swings a roundhouse that sends the opponent flying. Can be interrupted during the turn.</small></td><td class="cmd">then K</td></tr>
          <tr><td>Iai Slash<small>Settles into a stance with his hand on the sword, then dashes straight through the opponent in one cut and stops behind them. The cut lands a moment later and they fall; on a counter hit or a punish it launches them instead. Guarded, he’s open behind them (−18).</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Shadow Clone Strike<small>A clone dashes in and kicks while Kuro holds the hand sign. Hitting the clone breaks it.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Sky Drop Kick<small>Teleports above the opponent and drops a kick that bounces them off the ground into a juggle, landing behind them. Juggle with any attack, or pick a follow-up:</small></td><td class="cmd">→ → + K</td></tr>
          <tr class="sub"><td>Drop Slide<small>Low slide back into the opponent.</small></td><td class="cmd">then J</td></tr>
          <tr class="sub"><td>Turnaround Kick<small>Turns around (a little quicker) into a roundhouse that sends the opponent flying. Can be interrupted during the turn.</small></td><td class="cmd">then K</td></tr>
          <tr><td>Fire Breath<small>Under half a second of hand signs, then a long stream of fire. If it hits Kuro recovers well first (+10); guarded it’s −14. Getting hit during the hand signs stops it.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Lightning Volley<small>A short casting raises three lightning balls overhead, then they chase the opponent one after another. If they hit, the opponent is electrified and stunned, so you can dash in and combo. Kuro is free as soon as the last ball flies, so it’s safe guarded. Getting hit before they launch cancels them.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Vanish Slide<small>Leaves a shadow standing on guard (it blocks up to two attacks), back-dashes as a shadow, then slides in and knocks the opponent down, coming out behind them; on a counter hit or a punish it pops them up for a juggle. Guarded, he stops where he is (−16).</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Vanish Drop Kick<small>Leaves a shadow standing on guard, back-dashes as a shadow, then leaps high over long-range attacks and brings his heel down, bouncing the opponent off the ground into a juggle. It only travels about a quarter of the stage, so it can land short of a distant opponent.</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>Super: Shadow Army<small>Six clones rush in from both sides, then a seventh dives from above. Up close, the last clone bounces them back to Kuro so he can keep juggling. Needs a full MP gauge.</small></td><td class="cmd">Punch + Kick</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="ninja">▶ Watch Kuro’s sample combos</button>
      <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (rising kunai slash, twin kunai, shadow clone rise, shadow slash). Jumping after them, U, U, I and U, U, K become: air kunai slash, air reverse slash, kunai rain, shadow wheel.</p>
      <h3>Six combos, each with one or two juggles</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. Uppercut Launcher<small>One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, ← ← + U (Fire Spout lifts them again), K.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. Shadow Charge Upper<small>One juggle: → → + U, U, U, K. Two juggles: → → + U, U, I (Shadow Clone Rise lifts them again), K.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>3. Shadow Ambush<small>When the charge uppercut is guarded, U slashes them from behind and stuns them. One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, I, K.</small></td><td class="cmd">→ → + U, then U</td></tr>
          <tr><td>4. Sky Drop Kick<small>One juggle: → → + K, U, U, K. Two juggles: → → + K, U, W, U, ↓ + K (Shadow Meteor bounces them again), K.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>5. Counter Crescent<small>The heavy kick launches when it catches an attack starting up. One juggle: K, U, U, K. Two juggles: K, U, U, I, K.</small></td><td class="cmd">K</td></tr>
          <tr><td>6. Lightning stun<small>Lightning Volley stuns them; dash in and launch. One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, Punch + Kick (Shadow Army up close bounces them again), U, K.</small></td><td class="cmd">← ← + I, then ↓ + I</td></tr>
          <tr><td>7. Max combo: lift, lift, bounce<small>→ → + U, U, I (Shadow Clone Rise), → → + K (Sky Drop Kick), K.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>8. Max combo: bounce, lift<small>→ → + K (Sky Drop Kick), U, ← ← + U (Fire Spout), U, U, U, K.</small></td><td class="cmd">→ → + K</td></tr>
        </tbody>
      </table></div>
      <p class="note">A combo can lift (L) and bounce (B) the opponent only in these orders: L L, L L B, L B, L B L, B B or B L — each followed by a finisher. U, U, I in a juggle counts as a lift. One more lift or bounce than that and they drop out of the combo (“LIFT LIMIT” / “BOUNCE LIMIT”) and can’t be hit again until they land. A stun doesn’t count. Other starters: U then ↓ + I, Vanish Slide (← ← + J), Vanish Drop Kick (← ← + K), Fire Breath’s stun (← ← + U) and Shadow Army up close.</p>
      <p class="note">While the opponent is launched, Kuro’s ← ← + U, ← ← + I, → → + J, → → + I and ← ← + K turn into these juggle versions. In the air near them, U starts the air string, I the kunai flurry, K the Air Smash, and ↓ + K the Shadow Meteor, which bounces them off the ground so you can keep going (once per combo).</p>
      <p class="note">Press each button as the previous hit lands. To watch them all (each starter with one juggle, then with two, and the two max combos) with the inputs on screen, pick Kuro combos on the title screen.</p>
      <h3>Combo techniques on their own</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Fire Spout<small>A fire column right in front. Pops them up, so it starts a combo too.</small></td><td class="cmd">← ← then ↓ + U</td></tr>
          <tr><td>Lightning Rain<small>Three lightning balls drop on them from above.</small></td><td class="cmd">← ← then ↓ + I</td></tr>
          <tr><td>Clone Relay<small>A clone appears behind them and kicks them toward you.</small></td><td class="cmd">→ → then ↓ + J</td></tr>
          <tr><td>Air Iai<small>A leaping slash through them, landing on the far side.</small></td><td class="cmd">→ → then ↓ + I</td></tr>
          <tr><td>Vanish Heel<small>Vanishes and drops a heel on them from above. Knocks down.</small></td><td class="cmd">← ← then ↓ + K</td></tr>
          <tr><td>Shadow Meteor<small>A dive kick from any jump. Knocks down.</small></td><td class="cmd">↓ + K in the air</td></tr>
          <tr><td>Anti-air<small>Near a jumping opponent, U, I and K become the rising palm, Rising Kunai and spin kick, and the specials above come out on their own. In the air, U, I and K start the air string against them.</small></td><td class="cmd">U, I, K</td></tr>
        </tbody>
      </table></div>
      <p class="note"><b>Combo strings.</b> U, U, U, U, K: kunai slash (fast, high), kunai slash (fast, mid), reverse slash (medium, mid — they can start guarding here), shadow step (fast, low: it trips them), shadow crescent (the final blow, a high: crouch to duck it). I from any point: Kunai Rise launches; K ends early with a crescent kick. J, J, K (or J, K): sweep slash (low), sweep slash (low), shadow snap kick (a mid — guard the lows crouching and it hits). U, U, ↓ + K ends low instead: shadow reaper, a sweep that knocks down (U, U, K drops from above: guess which). In a juggle: rising kunai slash, twin kunai, shadow upper, moon crescent.</p>
    </article>
    <article class="card ninja" data-tab="ninja" data-lang="ja" hidden>
      <h2>クロ<span>影の忍者</span></h2>
      <p class="blurb">身軽で一撃は軽めだが、どの技も隙が少ない。影と分身で惑わせ、刀で斬り込み、炎と雷で気絶させ、長いコンボにつなぐ。</p>
      <p class="note"><b>印を結ぶ。</b> クロは中技・重い技の前に三つの印を結び、背後に霊獣が現れ、頭上に印の名が出る。覚えれば何が来るか分かる（その間にジャブで止められる）：龍＝スカイドロップキック、虎＝雷撃連弾、鳳＝火遁の息、蛇＝影走り昇拳、鶴＝居合斬り、狐＝影分身、鼠＝消影滑り、烏＝消影落とし蹴り。コンボ中も空中の火柱（ファイアスパウト）では鳳凰が、U、U、Kの最後の蹴り（三日月落とし）では牛が現れる。霊獣は印を結んだ場所に残り、ゆっくり消えていく。</p>
      <p class="note"><b>溜め技（I長押し）。</b> 押している間、気が集まる。0.5秒：影走り斬り（駆け込んで斬り上げる）、空中追撃につながる。1秒以上：月の嵐（影の三日月が床を走り、吹き飛ばす）。押すだけなら通常の強攻撃。</p>
      <p class="note"><b>テーマ.</b> 影と月光・紫と銀。焼け落ちた山里出身、影から戦う無言の刺客。決め技：U、U、K「三日月落とし」（消えて頭上から三日月のかかと）／U、U、I「月昇りクナイ」（クナイが満月を描く）。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>クナイ斬り<small>強パンチ。大きく踏み込んで斬りつける。</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>三日月蹴り<small>強キック。弧を描く高い蹴り。カウンターや確定反撃で当てると打ち上げる。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>足払い<small>下段でリーチが長い。ダウンを奪う。三日月蹴りと同じく、カウンターや確定反撃で当てると打ち上げ、U、U、Kで追撃できる。</small></td><td class="cmd">↓ + K</td></tr>
          <tr><td>影突進アッパー<small>分身の術に見せかけて、本物のクロが影となって突進し、なめらかなアッパーで打ち上げる。ガードされたら追加入力（下記）。突進前に攻撃されると消えて背後に現れ、斬って気絶させる。</small></td><td class="cmd">→ → + U</td></tr>
          <tr class="sub"><td>影斬り<small>背後に現れて斬る。背後から当たると相手は気絶。</small></td><td class="cmd">続けて U</td></tr>
          <tr class="sub"><td>影跳び<small>高く跳んで約1秒後に落下、バウンドさせる。</small></td><td class="cmd">続けて I</td></tr>
          <tr class="sub"><td>影滑り<small>下段スライディングで浮かせ、背後に抜ける。</small></td><td class="cmd">続けて J</td></tr>
          <tr class="sub"><td>影回し蹴り<small>一回転してから回し蹴りで吹き飛ばす。回転中は潰される。</small></td><td class="cmd">続けて K</td></tr>
          <tr><td>居合斬り<small>構えてから一瞬で相手を斬り抜ける。少し遅れて斬撃が入る。カウンターや確定反撃で当てると打ち上げる。ガードされると背後で隙（−18）。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>分身の術<small>分身が突進して蹴る。分身は攻撃で壊せる。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>天落蹴り<small>相手の上にワープして落下蹴り、バウンドさせる。追加でJ（滑り込み）かK（振り向き蹴り）。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>火遁<small>印を結んでから炎を吐く。当たればクロが先に動ける（+10）、ガードされると−14。印の途中で攻撃されると止まる。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>雷球<small>雷の球を3つ浮かべ、順番に追尾させる。当たると感電して気絶。最後の球が飛んだらクロはすぐ動けるので、ガードされても安全。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>消身滑り<small>ガードする影を残して下がり、滑り込んでダウンを奪う。カウンターや確定反撃なら浮かせて追撃できる。ガードされるとその場で止まる（−16）。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>消身踵落とし<small>影を残して下がり、高く跳んで踵落とし。バウンドさせる。</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>超必殺技：影分身・軍勢<small>6体の分身が両側から突進し、7体目が上から急降下。至近距離なら相手が手前にバウンドして追撃できる。MP満タンが必要。</small></td><td class="cmd">パンチ + キック</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="ninja">▶ クロのコンボ見本を見る</button>
      <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（昇りクナイ斬り、双クナイ、影分身昇り、影斬り）。ジャンプして追うと、U、U、IとU、U、Kは：空中クナイ斬り、空中逆斬り、クナイの雨、影車。</p>
      <h3>6つのコンボ（1回打ち上げ／2回打ち上げ）</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. アッパー打ち上げ<small>1回：↓+I、U、U、K。2回：↓+I、U、←←+U（火柱）、K。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. 影突進アッパー<small>1回：→→+U、U、U、K。2回：→→+U、U、I（影分身昇り）、K。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>3. 影の奇襲<small>突進アッパーをガードされたらUで背後から斬って気絶。1回：↓+I、U、U、K。2回：↓+I、U、I、K。</small></td><td class="cmd">→ → + U → U</td></tr>
          <tr><td>4. 天落蹴り<small>1回：→→+K、U、U、K。2回：→→+K、U、W、U、↓+K（影流星）、K。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>5. カウンター三日月蹴り<small>出がかりの攻撃を潰すと打ち上げ。1回：K、U、U、K。2回：K、U、U、I、K。</small></td><td class="cmd">K</td></tr>
          <tr><td>6. 雷で気絶<small>雷球で気絶させてダッシュ。1回：↓+I、U、U、K。2回：↓+I、U、P+K（至近の影分身）、U、K。</small></td><td class="cmd">← ← + I → ↓ + I</td></tr>
          <tr><td>7. 最大コンボ：打ち上げ・打ち上げ・バウンド<small>→→+U、U、I（影分身昇り）、→→+K（天落蹴り）、K。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>8. 最大コンボ：バウンド・打ち上げ<small>→→+K（天落蹴り）、U、←←+U（火柱）、U、U、U、K。</small></td><td class="cmd">→ → + K</td></tr>
        </tbody>
      </table></div>
      <p class="note">空中の相手に←←+U・←←+I・→→+J・→→+I・←←+Kを使うと追撃版（火柱・雷の雨・分身中継・空中居合・消身踵）になる。ボタンと一緒に↓を押すと単体でも使える。空中で↓+Kは影流星（急降下蹴り）。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：クナイ斬り（速い・上段）・クナイ斬り（速い・中段）・逆斬り（中くらい・中段：ここからガードできる）・影踏み（速い・下段：転ばせる）・影の三日月（締めの一撃・上段：しゃがめばかわせる）。途中のIでクナイ昇り（打ち上げ）、Kで三日月蹴り。J、J、K（またはJ、K）：払い斬り（下段）・払い斬り（下段）・影の中段蹴り（中段：しゃがんで下段を防いでいると当たる）。U、U、↓＋Kは下段で終わる：影の大鎌（ダウンを奪う足払い。U、U、Kは上から落ちるので読み合い）。空中追撃：昇りクナイ斬り・双クナイ・影アッパー・月の三日月。</p>
    </article>
`);
