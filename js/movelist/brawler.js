'use strict';
// Move list: Tetsu, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card brawler" data-tab="brawler" data-lang="en">
      <h2>TETSU<span>Qi Brawler</span></h2>
      <p class="blurb">Slower but hits hard. Heavy fists up close, qi to cover the distance, and six ways to launch you into a juggle. Charges MP faster than Kuro. Before each technique he pulls his fists back to gather qi. While he’s attacking he shrugs off up to three weak hits (ARMOR), but anything heavier still stops him.</p>
      <p class="note"><b>v1.3.9: long juggles pay.</b> For every fighter, adding a second lift or bounce to a combo earns a one-time +26 bonus on top of the extra hits, so two juggles always beat one. The limits on lifts and bounces are unchanged.</p>
      <p class="note"><b>Theme.</b> Iron qi & mountains · cyan and bronze. A temple brawler who trained by breaking stone. Signatures: U, U, K Mountain Splitter (stomps the ground open, then twin palms); U, U, I Ascending Dragon (a qi dragon coils up around him).</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Qi Palm<small>Heavy punch. A palm strike with a qi burst that blasts the opponent back and drains more guard. A counter hit launches them.</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>Axe Kick<small>Heavy kick. Steps in and drops the heel from above; knocks down, and launches if it counters or punishes.</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>Meteor Fist<small>Leaps in and slams both fists down (a mid). Guarded, it shoves them far back and tears at the guard. A counter hit launches them.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Crouching Upper<small>Ducks in low and drives an uppercut up through them. A counter hit launches them.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Qi Blast<small>A qi projectile, out quickly and safe when guarded.</small></td><td class="cmd">← → + U</td></tr>
          <tr><td>Triple Qi Blast<small>Three qi blasts at once, each a little faster than the last: they arrive one after another. Safe when guarded.</small></td><td class="cmd">← → + I</td></tr>
          <tr><td>Qi Sweep<small>Lunges in low and scoops them up with both palms.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Shoulder Charge<small>A shoulder tackle that charges in from about a third of the screen and knocks them back. Shrugs off light hits on the way in; punishable if guarded.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Qi Orb<small>A slow floating orb that hits three times.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Qi Parry<small>A stance. Anything that hits him during it is parried, and a melee attack gets a launching palm back (projectiles are just absorbed).</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Earth Stomp<small>A shockwave along the floor. Hits low, even someone lying down. Projectiles and rays pass through him while he stomps. Safe when guarded.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Cyclone Lariat<small>Backsteps, then spins forward with both arms out: three hits that launch. While he spins, projectiles and rays (Lyra’s shots, fireballs, lightning) pass through him; only close-range attacks can hit him.</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>Rising Fist<small>An invincible corkscrew uppercut that launches.</small></td><td class="cmd">↓ + I</td></tr>
          <tr class="super"><td>Super: Great Qi Cannon<small>A screen-long qi beam that hits 13 times. Needs a full MP gauge.</small></td><td class="cmd">Punch + Kick</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="brawler">▶ Watch Tetsu’s sample combos</button>
      <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (twin palm lift, hammer fist, qi geyser palm, thunder palms). Jumping after them, U, U, I and U, U, K become: air palm, air elbow, hundred fists, falling mountain.</p>
      <h3>Six combos, each with one or two juggles</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. Rising Fist<small>One juggle: ↓ + I, U, U, K. Two juggles: ↓ + I, U, I (Rising Dragon Fist lifts them again), → → + K (Shoulder Rocket).</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. Qi Sweep<small>One juggle: → → + J, U, U, K. Two juggles: → → + J, U, → → + U (Hammer Spike bounces them again), K.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>3. Cyclone Lariat<small>One juggle: ← ← + K, U, U, K. Two juggles: ← ← + K, U, → → + I (Qi Geyser lifts them again), K.</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>4. Meteor Fist<small>A counter hit launches. One juggle: → → + U, U, ← ← + K (Air Cyclone), U, U, K. Two juggles: → → + U, U, ← ← + K, U, ↓ + K (Meteor Knee bounces them again), K.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>5. Counter Axe<small>The heavy kick launches when it catches an attack starting up. One juggle: K, U, U, K. Two juggles: K, U, ← ← + U (Qi Spiral), W, U, ↓ + K (Meteor Knee), K.</small></td><td class="cmd">K</td></tr>
          <tr><td>6. Qi Parry<small>Parry an attack; the palm launches them. One juggle: U, U, K. Two juggles: U, U, I (Rising Dragon Fist), Punch + Kick (Great Qi Cannon, needs a full MP gauge).</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>7. Max combo: lift, lift, bounce<small>↓ + I, U, I (Qi Geyser Palm), → → + U (Hammer Spike), U, U, K.</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>8. Max combo: lift, bounce, lift<small>↓ + I, U, → → + U (Hammer Spike), U, I (Qi Geyser Palm), → → + K (Shoulder Rocket).</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <p class="note">Like Kuro, a combo can lift (L) and bounce (B) the opponent only as L L, L L B, L B, L B L, B B or B L, each followed by a finisher. While the opponent is launched, Tetsu’s → → + U, → → + I, → → + K, ← ← + U and ← ← + K turn into juggle versions. To watch them all (each starter with one juggle, then with two, and the two max combos), pick Tetsu combos on the title screen.</p>
      <h3>Combo techniques on their own</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Qi Geyser<small>A qi pillar right in front. Pops them up, so it starts a combo too.</small></td><td class="cmd">→ → then ↓ + I</td></tr>
          <tr><td>Hammer Spike<small>Jumps up and hammers down on them. Knocks down.</small></td><td class="cmd">→ → then ↓ + U</td></tr>
          <tr><td>Shoulder Rocket<small>A rising shoulder that sends them flying; a strong anti-air.</small></td><td class="cmd">→ → then ↓ + K</td></tr>
          <tr><td>Qi Spiral<small>Qi orbs rise up from under them.</small></td><td class="cmd">← ← then ↓ + U</td></tr>
          <tr><td>Air Cyclone<small>A lariat that spins up into the air; he can keep attacking in the air afterwards.</small></td><td class="cmd">← ← then ↓ + K</td></tr>
          <tr><td>Meteor Knee<small>A knee-first dive from any jump. Knocks down.</small></td><td class="cmd">↓ + K in the air</td></tr>
          <tr><td>Anti-air<small>Near a jumping opponent, U, I and K become Twin Palm Lift, Rising Dragon Fist and Twin Dragon Palms, and the specials above come out on their own. In the air, U, I and K start the air string against them.</small></td><td class="cmd">U, I, K</td></tr>
        </tbody>
      </table></div>
      <p class="note"><b>Combo strings.</b> U, U, U, U, K: qi straight, body blow, elbow smash, twin qi palms. U, U, U, U, ↓ + K ends with a low Dragon Sweep instead (a counter hit launches). I from any point: Rising Dragon launches; K ends with an axe kick. J, J, K (or J, K): low kick, then a high kick to the head (crouch under it). J, J, ↓ + K: a heavy front kick to the body instead. In a juggle: twin palm lift, hammer fist, body upper, qi explosion. In the air: palm, elbow, qi flurry, qi burst; I alone is an air hammer fist.</p>
    </article>
    <article class="card brawler" data-tab="brawler" data-lang="ja" hidden>
      <h2>テツ<span>気の拳士</span></h2>
      <p class="blurb">動きは遅いが一撃が重い。技の前に拳を引いて気を溜める（その間に攻撃されると中断）。攻撃中は弱い攻撃を3回まで耐える（アーマー）。</p>
      <p class="note"><b>v1.3.9：長い空中コンボほど強い。</b>全キャラ共通で、コンボに2回目の打ち上げ・バウンドを入れると、追加の攻撃に加えて一度だけ+26のボーナス。2回打ち上げは必ず1回より強い。回数制限はそのまま。</p>
      <p class="note"><b>テーマ.</b> 鉄の気と山・水色と青銅。岩を砕いて修行した寺の拳士。決め技：U、U、K「山割り」（地面を踏み割り、双掌）／U、U、I「昇龍」（気の龍が体に巻きつき昇る）。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>気功掌<small>強パンチ。気の爆発で吹き飛ばし、ガードを大きく削る。</small></td><td class="keys"><kbd>I</kbd></td></tr>
          <tr><td>踵落とし<small>強キック。上から踵を落としてダウン。カウンターや確定反撃で打ち上げ。</small></td><td class="keys"><kbd>K</kbd></td></tr>
          <tr><td>流星拳<small>跳び込んで両拳を叩きつける（中段）。ガードされても大きく押し返し、ガードゲージを削る。カウンターで打ち上げる。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>潜り昇拳<small>低く潜り込んでアッパーで突き上げる。カウンターで打ち上げる。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>気功弾<small>出の速い気の飛び道具。ガードされても安全。</small></td><td class="cmd">← → + U</td></tr>
          <tr><td>三連気功弾<small>3発の気功弾を同時に放つ。少しずつ速さが違い、順番に届く。ガードされても安全。</small></td><td class="cmd">← → + I</td></tr>
          <tr><td>気の掬い<small>低く踏み込み、両掌で掬い上げる。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>肩当て<small>画面の約3分の1から突進する体当たりで押し返す。突進中は弱い攻撃を耐える。ガードされると反撃される。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>気の玉<small>ゆっくり進む玉が3回当たる。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>気の受け流し<small>構え中の攻撃を受け流し、近接攻撃には打ち上げの掌底で返す。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>大地踏み<small>地を這う衝撃波。下段で、倒れた相手にも当たる。踏み込み中は飛び道具がすり抜ける。ガードされても安全。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>旋風ラリアット<small>下がってから両腕を広げて回転、3段で打ち上げ。回転中は飛び道具や光線がすり抜ける（近接攻撃だけ当たる）。</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>昇龍拳<small>無敵の螺旋アッパーで打ち上げ。</small></td><td class="cmd">↓ + I</td></tr>
          <tr class="super"><td>超必殺技：大気功砲<small>画面を貫く気のビームで13ヒット。MP満タンが必要。</small></td><td class="cmd">パンチ + キック</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="brawler">▶ テツのコンボ見本を見る</button>
      <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（双掌上げ、鉄槌、気の間欠泉掌、雷掌）。ジャンプして追うと、U、U、IとU、U、Kは：空中掌、空中肘、百裂拳、落山。</p>
      <h3>6つのコンボ（1回打ち上げ／2回打ち上げ）</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>1. 昇龍拳<small>1回：↓+I、U、U、K。2回：↓+I、U、I（昇り龍拳）、→→+K（肩ロケット）。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>2. 気の掬い<small>1回：→→+J、U、U、K。2回：→→+J、U、→→+U（鉄槌落とし）、K。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>3. 旋風ラリアット<small>1回：←←+K、U、U、K。2回：←←+K、U、→→+I（気柱）、K。</small></td><td class="cmd">← ← + K</td></tr>
          <tr><td>4. 流星拳<small>カウンターで打ち上げ。1回：→→+U、U、←←+K（空中旋風）、U、U、K。2回：→→+U、U、←←+K、U、↓+K（流星膝）、K。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>5. カウンター踵落とし<small>1回：K、U、U、K。2回：K、U、←←+U（気の螺旋）、W、U、↓+K、K。</small></td><td class="cmd">K</td></tr>
          <tr><td>6. 気の受け流し<small>1回：U、U、K。2回：U、U、I、P+K（大気功砲、MP満タン）。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>7. 最大コンボ：打ち上げ・打ち上げ・バウンド<small>↓+I、U、I（気柱掌）、→→+U（鉄槌落とし）、U、U、K。</small></td><td class="cmd">↓ + I</td></tr>
          <tr><td>8. 最大コンボ：打ち上げ・バウンド・打ち上げ<small>↓+I、U、→→+U（鉄槌落とし）、U、I（気柱掌）、→→+K（肩ロケット）。</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
      <p class="note">空中の相手に→→+U・→→+I・→→+K・←←+U・←←+Kを使うと追撃版（鉄槌落とし・気柱・肩ロケット・気の螺旋・空中旋風）になる。↓を押しながら使うと単体でも出る。</p>
      <p class="note"><b>連続技。</b> U、U、U、U、K：気のストレート・ボディブロー・肘打ち・双気掌。U、U、U、U、↓+Kは下段の龍の足払いで締める（カウンターで打ち上げ）。途中のIで昇龍（打ち上げ）、Kで踵落とし。J、J、K（またはJ、K）：ローキックから上段の蹴り（しゃがみでかわせる）。J、J、↓+K：代わりに胴への重い前蹴り。空中追撃：双掌上げ・鉄槌・ボディアッパー・気の爆発。空中ではIで空中鉄槌。</p>
    </article>
`);
