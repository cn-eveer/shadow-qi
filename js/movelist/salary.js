'use strict';
// Move list: Tanaka, in English and then Japanese (shown in the ⚙ Settings drawer and used for the training move card).
// Loaded before the game scripts; it fills the empty <section id="info"> in index.html.
document.getElementById('info').insertAdjacentHTML('beforeend', `
    <article class="card salary" data-tab="salary" data-lang="en">
      <h2>TANAKA<span>Salaryman</span></h2>
      <p class="blurb">An ordinary office worker in a suit and tie, briefcase in hand, with a tiny angel and a tiny devil riding on his shoulders. On his own he’s a plain fighter; let one of them take him over and everything changes for fifteen seconds (a timer shows over his head), then he goes back to normal.</p>
      <p class="note"><b>His four modes</b> (v1.3.9).</p>
      <table class="moves"><tbody>
        <tr><td>Normal Tanaka<small><b>Strong:</b> guards on his own when he isn’t attacking; office supplies (pen, stapler, mug) from range; can call either spirit at any time. <b>Weak:</b> slow (walk 3.0), short reach, lowest damage (×1.0)..</small></td><td class="cmd">start</td></tr>
        <tr><td>Angel (← ← + I)<small><b>Strong:</b> heals about 5 HP a second; Blessing heals him and restores his guard; double jump; eye rays that pick the right height by themselves; invincible Ascending Gaze, armored Seraph Dive. <b>Weak:</b> the lowest damage of the three spirits (×1.15)..</small></td><td class="cmd">15 s</td></tr>
        <tr><td>Devil (← ← + K)<small><b>Strong:</b> heavy damage (×2.0); fast attacks; quick on his feet (walk 3.9); the tail reaches far. <b>Weak:</b> burns 27 HP of his own a second; nothing heals him; takes full damage..</small></td><td class="cmd">15 s</td></tr>
        <tr><td>Angel + Devil (call the other while possessed)<small><b>Strong:</b> the most damage (×2.1); armor against everything but supers and throws; takes half damage and can’t be launched; burns anyone close (10 every 0.4 s). <b>Weak:</b> can’t guard at all; far bigger, so easy to hit; burns 132 HP of his own a second (never below 1) and nothing heals him; lasts only 11 s..</small></td><td class="cmd">11 s</td></tr>
      </tbody></table>
      <p class="note"><b>Possess before the round.</b> During the countdown, ← ← + I (angel) or ← ← + K (devil) — online battles too — and he stays in that form <b>for the whole round</b>, with no timer (it drains about a third as much health). The double can’t be called before the round: call the other spirit during the fight, and when the double wears off he’s back in the form he chose. Double possession: he grows far bigger and has armor — nothing short of a super or a throw stops him. <b>Supers:</b> as himself, <b>Ultimate Dogeza</b> (flat on the floor in the deepest apology, sliding at them: low hits — jump it, or guard crouching); angel, <b>Heaven’s Gate</b> (down on one knee, palms pressed together, he prays — and holy rays pour down on them); devil, <b>Hellish Frenzy</b> (a frenzy of tail strikes swinging high, mid and low — every one can be guarded, standing or crouching). Every super lands about the same damage.</p>
      <p class="note"><b>v1.3.9.</b> As himself his attacks now do full damage, and every form’s juggles hit harder. The devil (×2.0) burns his own health five times as fast as before, and the double (×2.1) ten times as fast. A possession lasts fifteen seconds. <b>Easier commands:</b> possessed, ← ← + J picks the right version by itself — the angel’s ray goes up after someone in the air and down at someone crouching, and the devil’s tail comes down from overhead on someone crouching (the ↑ and ↓ versions still work).</p>
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
          <tr><td>Devil Possession<small>With a cut-in the devil takes over. He drops into a low, beastly crouch, moves faster and his normal attacks and strings come out faster; he fights wild and lures them in. Beast Lunge (→ → + U), Savage Maul, a flurry of claws (→ → + I), Shadow Claw (→ → + J), Demon Uppercut (→ → + K), Beckon: “come here~”, attack him and he mauls you back (← ← + U), Hell Chain drags them in (← ← + J), Soul Drain grab heals him (← ← + K), ← ← + I switches to the angel. Super: Hellish Frenzy.</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>Super: Ultimate Dogeza<small>Flat on the floor in the deepest apology ever made, he slides at them — low hits, again and again. Jump it, or guard crouching.</small></td><td class="cmd">U + J</td></tr>
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
      <p class="blurb">スーツにネクタイ、手には書類カバン。両肩には小さな天使と小さな悪魔。素の田中は普通の戦い方だが、どちらかに憑依されると15秒間すべてが変わり（頭上に残り時間）、時間が切れると普通の人間に戻る。</p>
      <p class="note"><b>4つの姿</b>（v1.3.9）。</p>
      <table class="moves"><tbody>
        <tr><td>素の田中<small><b>強み：</b>攻撃していない時は自動でガード。文房具（ペン・ホッチキス・マグカップ）で遠距離攻撃。いつでも天使・悪魔を呼べる。<b>弱み：</b>動きが遅い（歩き3.0）、リーチが短い、攻撃力が最も低い（×1.0）。</small></td><td class="cmd">開始時</td></tr>
        <tr><td>天使（←←+I）<small><b>強み：</b>1秒に約5回復。祝福で体力とガードゲージが回復。二段ジャンプ。高さを自動で合わせる目の光線。無敵の昇天の眼差し、アーマー付きのセラフダイブ。<b>弱み：</b>3つの憑依の中で攻撃力が最も低い（×1.15）。</small></td><td class="cmd">15秒</td></tr>
        <tr><td>悪魔（←←+K）<small><b>強み：</b>攻撃力が高い（×2.0）。攻撃が速い。足が速い（歩き3.9）。尻尾のリーチが長い。<b>弱み：</b>自分の体力が1秒に27減る。回復手段はない。受けるダメージは普通。</small></td><td class="cmd">15秒</td></tr>
        <tr><td>天使＋悪魔（憑依中にもう一方を呼ぶ）<small><b>強み：</b>攻撃力が最も高い（×2.1）。超必殺技と投げ以外では止まらない（アーマー）。受けるダメージ半分、打ち上げられない。近くの相手を焼く（0.4秒ごとに10）。<b>弱み：</b>ガードが一切できない。体が大きく当たりやすい。自分の体力が1秒に132減り（1未満にはならない）、回復手段はない。11秒しか続かない。</small></td><td class="cmd">11秒</td></tr>
      </tbody></table>
      <p class="note"><b>ラウンド前の憑依。</b>カウントダウン中に←←+I（天使）か←←+K（悪魔）（オンライン対戦でも）。そうすると<b>そのラウンドの間ずっと</b>その姿で戦う（残り時間の表示なし。体力の消耗は約3分の1）。二重憑依はラウンド前にはできない：対戦中にもう一方を呼ぶと二重憑依になり、終わるとラウンド前に選んだ姿に戻る。二重憑依ではずっと大きくなり、アーマーがつく（超必殺技と投げ以外では止まらない）。<b>超必殺技：</b>素の田中は<b>究極の土下座</b>（床に伏して全力で謝りながら滑り込む：下段。ジャンプかしゃがみガード）。天使は<b>天国の門</b>（片膝をつき手を合わせて神に祈ると、聖なる光が相手に降り注ぐ）。悪魔は<b>地獄の乱舞</b>（尻尾を上・中・下へ振り回す乱れ打ち。立ち・しゃがみどちらのガードでも防げる）。どの超必殺技もほぼ同じダメージ。</p>
      <p class="note"><b>v1.3.9。</b>素の田中の攻撃は100%のダメージに、どの姿でも空中追撃が強く。悪魔（×2.0）が削る自分の体力は以前の5倍、二重憑依（×2.1）は10倍に。憑依は15秒続く。<b>コマンドを簡単に：</b>憑依中の←←+Jは状況に合わせて自動で変わる。天使の光線は空中の相手には上へ、しゃがんだ相手には足元へ。悪魔の尻尾はしゃがんだ相手には頭上から振り下ろす（↑・↓のコマンドもそのまま使える）。</p>
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
          <tr><td>悪魔憑依<small>カットインとともに悪魔が乗り移る。獣のように低く構え、動きも通常技・連続技も速くなる。荒々しく戦い、相手をおびき寄せる。獣の跳びかかり（→→+U）、野蛮な引き裂き（→→+I）、影の爪（→→+J）、悪魔のアッパー（→→+K）、手招き「おいで～」：攻撃してきたら反撃で引き裂く（←←+U）、地獄の鎖で引き寄せ（←←+J）、魂吸いのつかみで回復（←←+K）、←←+Iで天使に交代。超必殺技：地獄の乱舞。</small></td><td class="cmd">← ← + K</td></tr>
          <tr class="super"><td>超必殺技：究極の土下座<small>床に伏して全力で謝りながら滑り込み、下段を連続で当てる。ジャンプかしゃがみガードで。</small></td><td class="cmd">U + J</td></tr>
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
