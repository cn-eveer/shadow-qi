'use strict';
// Move list: Tanaka, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card salary" data-tab="salary" data-lang="en">
      <h2>TANAKA<span>Salaryman</span></h2>
      <p class="blurb">An ordinary office worker in a suit and tie, briefcase in hand, with a tiny angel and a tiny devil riding on his shoulders. On his own he’s a plain fighter; let one of them take him over and everything changes for ten seconds (a timer shows over his head), then he goes back to normal.</p>
      <p class="note"><b>Double possession.</b> Possessed by one, call the other (← ← + I for the angel, ← ← + K for the devil) and both take him at once: wings and halo, horns and tail. Light hits can’t stop him, but he can’t guard at all — so he takes only half damage and can’t be launched into a juggle; a field of holy light and hellfire burns anyone who stays close. It lasts three quarters as long as a single possession and eats his health. <b>→ → + J Rush Hour Kick:</b> a sprint into a flying kick that launches — and takes a big bite out of a guard. <b>← ← → + J (devil):</b> after ← ←, hold → and press J — the Hell Chain lures them in.</p>
      <p class="note"><b>Devil form: everything on J and K is his tail, and reaches further.</b> ← ← + J Tail Whip (waist height), ← ← ↑ + J Tail Hammer (he turns his back and brings it down from overhead — guard it <b>standing</b>), ← ← ↓ + J Tail Sweep (low), ← ← → + J Hell Chain (from his belly, waist height), → → + J Tail Lash, → → + K Tail Hook (launches), ← ← + K Soul Drain (the tail coils round them). <b>Angel form:</b> ← ← + J Heaven’s Gaze (a ray from his eyes, waist height), ← ← ↓ + J Humble Gaze (the ray at their feet), ← ← ↑ + J Ascending Gaze (soars out of reach, invincible, and fires down at them), ← ← → + J Seraph Dive (hit him while he rises — the dive itself is armored). <b>Himself:</b> ← ← + J Dogeza Spring is now a long, shining, invincible bow before he springs up. <b>Possession:</b> the little angel or devil grows into a full-size spirit, half again his height, and merges into him from behind.</p>
      <p class="note"><b>Low techniques (hold ↓ with the technique; guard them crouching).</b> Himself: → → ↓ + J Wet Floor Slide (slides in feet first, knocks down), ← ← ↓ + J Spilled Coffee (a puddle they slip on), → → ↓ + K Briefcase Skid (slides along the floor at their ankles). Devil form: → → ↓ + J Hell Crawl (claws low on all fours and launches), ← ← ↓ + J Tail Sweep (the tail lashes round at their ankles), → → ↓ + K Brimstone Trail (hellfire runs along the floor).</p>
      <p class="note"><b>Office supplies (himself only).</b> ↓ + U throws a pen straight across the stage, ↓ + J lobs the stapler in an arc, and I in the air drops his coffee mug on them. <b>Angel form:</b> he can double jump and guard in the air; his air string is longer (U, U, U, U), and W during a landed air hit jumps again on his wings to keep it going.</p>
      <p class="note"><b>Auto guard.</b> Standing still, he guards by himself in every form (except throws). Walking, attacking, or still recovering from an attack, he can be hit and punished.</p>
      <p class="note"><b>Three forms.</b> As himself his attacks only do 60% damage. Possessed by the angel he does full damage and heals slowly. Possessed by the devil his attacks do one and a half times the damage, but the devil slowly eats his health (it can’t finish him).</p>
      <p class="note"><b>As himself.</b> No strong kicks: just punches, the briefcase and running away. K is a Shove and Run, and his strings end with a shove and a dash away (hit and run).</p>
      <p class="note"><b>Theme.</b> Office overtime · slate and a red tie. An ordinary worker with an angel and a devil on his shoulders. Signatures: U, U, K Deadline Dropkick; U, U, I Promotion Uppercut (with confetti). Angel: Seraph Wing Sweep / Halo Ascension. Devil: Infernal Tail Lash / Hellgate Upper.</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>Business Card<small>Flicks a business card like a shuriken.</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>Briefcase Smash<small>A big overhead swing with the briefcase.</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>Rush Hour Tackle<small>Barrels in and pops them up.</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>Overtime Uppercut<small>A launcher, briefly untouchable.</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>Hot Coffee<small>Splashes hot coffee: they’re scalded and stunned.</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>Dogeza Spring<small>Throws himself flat in a full kneeling apology (it ducks under high attacks)… then springs up with a headbutt that lifts them.</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>Angel Possession<small>With a cut-in the angel dives into him. He stands still in prayer, a halo over his head and his fists glowing with light, and he can double jump. He fights hit and away: strike, then step back. Divine Jab (→ → + U), Halo Fist stuns them (→ → + I), Angel Glide (→ → + J), Holy Ascension (→ → + K), Blessing heals (← ← + U), Holy Ward reflects (← ← + I), Feather Step backs away untouchable (← ← + J), ← ← + K switches to the devil. His strings stun instead of knocking down. Super: Heaven’s Gate.</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>Devil Possession<small>With a cut-in the devil takes over. He drops into a low, beastly crouch, moves faster and his normal attacks and strings come out faster; he fights wild and lures them in. Beast Lunge (→ → + U), Savage Maul, a flurry of claws (→ → + I), Shadow Claw (→ → + J), Demon Uppercut (→ → + K), Beckon: “come here~”, attack him and he mauls you back (← ← + U), Hell Chain drags them in (← ← + J), Soul Drain grab heals him (← ← + K), ← ← + I switches to the angel. Super: Infernal Contract.</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>Super: Deadline Rush<small>A frantic flurry with papers flying everywhere (as himself).</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="salary">▶ Watch Tanaka’s combos</button>
      <p class="note">Possession lasts ten seconds; when it runs out he’s an ordinary salaryman again and the little angel and devil are back on his shoulders.</p>
      <p class="note"><b>Combo strings.</b> As himself, U, U, U, U, K: briefcase swing, necktie whip, shoulder bump, commuter kick (I launches with a briefcase upper). Possessed by the angel: wing slap, halo chop, feather palm, heaven kick. By the devil: hellclaw, horn butt, tail whip, brimstone kick. Each form has its own juggle and air moves too.</p>
          <p class="note"><b>In mid-air.</b> In a juggle, U, U, I relaunches and U, U, K finishes with moves different from the ground string (briefcase lift, necktie whip, elevator uppercut, paperwork storm kick). Jumping after them, U, U, I and U, U, K become: air briefcase, air tie whip, air paper storm, briefcase meteor.</p>
      <h3>Max combos</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>9. Max combo: lift, bounce, lift<small>↓ + I, U, W, U, ↓ + K (Meteor Knee), U, I (Elevator Uppercut), K.</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card salary" data-tab="salary" data-lang="ja" hidden>
      <h2>田中<span>サラリーマン</span></h2>
      <p class="blurb">スーツにネクタイ、手には書類カバン。両肩には小さな天使と小さな悪魔。素の田中は普通の戦い方だが、どちらかに憑依されると10秒間すべてが変わり（頭上に残り時間）、時間が切れると普通の人間に戻る。</p>
      <p class="note"><b>二重憑依。</b>片方に憑依されている間にもう片方を呼ぶ（天使は←←＋I、悪魔は←←＋K）と、両方が同時に宿る：翼と輪、角と尻尾。弱攻撃では止まらないが、ガードは一切できない（そのため受けるダメージは半分で、打ち上げられてコンボされることもない）。近くにいる相手は聖なる光と地獄の炎の場に焼かれる。効果時間は通常の4分の3で、体力も削られる。<b>→→＋J ラッシュアワーキック：</b>全力疾走から飛び蹴りで打ち上げる。ガードの上からも大きく削る。<b>←←→＋J（悪魔）：</b>←←のあと→を押しながらJ。地獄の鎖で引き寄せる。</p>
      <p class="note"><b>悪魔憑依：J・Kの技はすべて尻尾、リーチも長い。</b>←←＋J 尻尾ムチ（中段）、←←↑＋J 尻尾ハンマー（背を向けて頭上から振り下ろす：<b>立ちガード</b>で防ぐ）、←←↓＋J 尻尾払い（下段）、←←→＋J 地獄の鎖（腹から、中段）、→→＋J 尻尾ラッシュ、→→＋K 尻尾フック（打ち上げ）、←←＋K 魂吸い（尻尾で巻き取る）。<b>天使憑依：</b>←←＋J 天の眼差し（目からの光線、中段）、←←↓＋J 謙虚な眼差し（足元への光線）、←←↑＋J 昇天の眼差し（無敵で舞い上がり、上から撃つ）、←←→＋J セラフダイブ（上昇中なら止められる。急降下はアーマー）。<b>素の田中：</b>←←＋J 土下座スプリングは長く光り輝く無敵の土下座に。<b>憑依：</b>小さな天使・悪魔が田中の1.5倍の大きさの本物の姿になり、背後から田中に宿る。</p>
      <p class="note"><b>下段の技（技のコマンドに↓を加える。しゃがみガードで防ぐ）。</b>素の田中：→→↓＋J 濡れた床スライド（足から滑り込んでダウン）、←←↓＋J こぼれたコーヒー（滑る水たまり）、→→↓＋K カバン滑らせ（床を滑って足元に当たる）。悪魔憑依：→→↓＋J 地獄這い（四つん這いで足元を裂き、打ち上げる）、←←↓＋J 尾払い（尻尾で足元をなぎ払う）、→→↓＋K 硫黄の炎（地獄の炎が床を走る）。</p>
      <p class="note"><b>文房具投げ（素の田中のみ）。</b>↓＋Uでペンを投げ、↓＋Jでホッチキスを放物線で投げ、空中でIを押すとマグカップを落とす。<b>天使憑依：</b>二段ジャンプと空中ガードができ、空中の連撃が長い（U、U、U、U）。空中攻撃のヒット中にWで翼の二段ジャンプをしてコンボを続けられる。</p>
      <p class="note"><b>オートガード。</b> どの姿でも、静かに立っているときは自動でガードする（投げ以外）。歩いている、攻撃中、攻撃後の戻りの間は当たり、反撃される。</p>
      <p class="note"><b>3つの姿。</b> 素の田中は攻撃力60%。天使憑依では通常の攻撃力で少しずつ回復。悪魔憑依では攻撃力1.5倍だが、悪魔が少しずつ体力を奪う（それで倒れることはない）。</p>
      <p class="note"><b>素の田中。</b> 強いキックはなく、パンチとカバンと逃げ足だけ。Kは押しのけて逃げる「シーブ＆ラン」、連続技も押しのけて走って逃げる（ヒット＆ラン）。</p>
      <p class="note"><b>テーマ.</b> 残業のオフィス・灰青と赤いネクタイ。両肩に天使と悪魔を乗せた普通の会社員。決め技：U、U、K「締め切りドロップキック」／U、U、I「昇進アッパー」（紙吹雪つき）。天使：熾天使の翼払い／天使の輪の昇天。悪魔：地獄のしっぽ打ち／地獄門アッパー。</p>
      <div class="scroll"><table>
        <tbody>
          <tr><td>名刺手裏剣<small>名刺を手裏剣のように飛ばす。</small></td><td class="cmd">→ → + U</td></tr>
          <tr><td>カバン叩き<small>書類カバンを大きく振り下ろす。</small></td><td class="cmd">→ → + I</td></tr>
          <tr><td>満員電車タックル<small>突っ込んで浮かせる。</small></td><td class="cmd">→ → + J</td></tr>
          <tr><td>残業アッパー<small>打ち上げ。出始めは無敵。</small></td><td class="cmd">→ → + K</td></tr>
          <tr><td>熱いコーヒー<small>熱いコーヒーをかけて、やけどで気絶。</small></td><td class="cmd">← ← + U</td></tr>
          <tr><td>土下座スプリング<small>全力の土下座（上段攻撃をくぐる）…からの跳ね起き頭突きで浮かせる。</small></td><td class="cmd">← ← + J</td></tr>
          <tr><td>天使憑依<small>カットインとともに天使が飛び込む。祈りの姿勢で静かに構え、頭に天使の輪、拳は光に包まれ、二段ジャンプができる。ヒット＆アウェイ：打って一歩下がる。神の拳（→→+U）、光輪の拳で気絶（→→+I）、天使の滑空（→→+J）、聖なる昇天（→→+K）、祝福で回復（←←+U）、聖なる守りで反射（←←+I）、羽根の後退で無敵の後退（←←+J）、←←+Kで悪魔に交代。連続技はダウンではなく気絶。超必殺技：天国の門。</small></td><td class="cmd">← ← + I</td></tr>
          <tr><td>悪魔憑依<small>カットインとともに悪魔が乗り移る。獣のように低く構え、動きも通常技・連続技も速くなる。荒々しく戦い、相手をおびき寄せる。獣の跳びかかり（→→+U）、野蛮な引き裂き（→→+I）、影の爪（→→+J）、悪魔のアッパー（→→+K）、手招き「おいで～」：攻撃してきたら反撃で引き裂く（←←+U）、地獄の鎖で引き寄せ（←←+J）、魂吸いのつかみで回復（←←+K）、←←+Iで天使に交代。超必殺技：地獄の契約。</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>超必殺技：締め切りラッシュ<small>書類が舞い散る怒涛の連打（素の田中のとき）。</small></td><td class="cmd">U + J</td></tr>
        </tbody>
      </table></div>
      <button class="pill watch" data-watch="salary">▶ 田中のコンボを見る</button>
      <p class="note">憑依は10秒。時間が切れると普通のサラリーマンに戻り、小さな天使と悪魔が肩に戻ってくる。</p>
      <p class="note"><b>連続技。</b> 素の田中はU、U、U、U、K：カバン振り・ネクタイ鞭・肩当て・通勤キック（Iでカバンアッパー）。天使憑依：翼打ち・天使の輪チョップ・羽根掌・天国キック。悪魔憑依：地獄の爪・角の頭突き・しっぽ打ち・硫黄キック。空中追撃と空中技もそれぞれ違う。</p>
          <p class="note"><b>空中。</b> 空中追撃では、U、U、Iで再打ち上げ、U、U、Kで締める地上とは違う技（カバン上げ、ネクタイ鞭、エレベーターアッパー、書類嵐キック）。ジャンプして追うと、U、U、IとU、U、Kは：空中カバン、空中ネクタイ、空中書類嵐、カバン隕石。</p>
      <h3>最大コンボ</h3>
      <div class="scroll"><table>
        <tbody>
          <tr><td>9. 最大コンボ：打ち上げ・バウンド・打ち上げ<small>↓+I、U、W、U、↓+K（流星膝）、U、I（エレベーターアッパー）、K。</small></td><td class="cmd">↓ + I</td></tr>
        </tbody>
      </table></div>
    </article>
`);
