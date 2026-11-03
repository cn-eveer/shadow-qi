'use strict';
/* ================= dialogue =================
   Fighters speak to each other: before the first round the left-hand fighter opens and the right-hand one answers (DLG[left][right]),
   and every win has a line for that matchup (lines.js; the match-winning round: FINAL). A fighter who copies someone speaks as that fighter —
   Mimic copying Kuro answers (or is answered by) anyone the way Kuro would. The special cases:
     · the mirror match (the same fighter on both sides): different lines for the left and the right fighter (DLG[x][x]; MIR2 and FINAL.self2 for a right-hand win);
     · a real fighter against Mimic copying them: COPYD / COPYW / FINAL.copy for them, MIRROR_ROBOT (lines.js) for Mimic. */
const DLG = { // DLG[left][right] = [left opens (en, ja), right answers (en, ja)]
  ninja: {
    brawler: [["Your fists are loud. I won’t be.", "拳は騒がしいな。俺は静かに行く。"], ["Quiet or loud, qi finds you.", "静かでも騒がしくても、気は見つける。"]],
    staff: [["Child of the clouds. Fall.", "雲の子よ。落ちてもらう。"], ["Hee! Try catching a cloud!", "ひひ！雲をつかまえてみな！"]],
    psychic: [["Show me your magic. I’ll show you mine.", "魔法を見せろ。俺の影も見せてやる。"], ["Please do. I already know.", "どうぞ。もう見えていますけれど。"]],
    paladin: [["Armor is loud. I hear you coming.", "鎧は音がする。来る前から聞こえる。"], ["Then hear this: justice does not hide.", "ならば聞け。正義は隠れぬ。"]],
    kappa: [["A river spirit. Dry up.", "川の妖か。干上がるがいい。"], ["Eek! I’ll splash you flat!", "わっ！びしょ濡れにしちゃうよ！"]],
    gunman: [["Your gun is loud. I am not.", "銃は音が大きい。俺は静かだ。"], ["Quiet types die the same, partner.", "静かな奴も、死ぬときは同じだぜ。"]],
    salary: [["You don’t belong here, clerk.", "会社員がここに何の用だ。"], ["S-sorry! I just got dragged in!", "す、すみません！巻き込まれただけで！"]],
    alchemist: [["A doctor and a stone. Interesting.", "医者と石か。興味深い。"], ["Likewise. A shadow with a pulse.", "こちらもだ。脈のある影とはな。"]],
    ninja: [["Another shadow. Only one will remain.", "影がもう一つか。残るのは一つだけだ。"], ["Then let it be me.", "ならば、それは俺だ。"]],
  },
  brawler: {
    ninja: [["Show yourself, shadow. Face my fists.", "姿を見せろ、影よ。拳で向き合おう。"], ["Fists find nothing. Shadows have no body.", "拳は空を切る。影に体はない。"]],
    staff: [["Little one, don’t be reckless.", "無茶をするな、小さいの。"], ["Who’s little? I’ll knock you flat!", "誰が小さいって？ぶっ飛ばすよ！"]],
    psychic: [["Magic or fists... let’s see which is stronger.", "魔法か拳か。どちらが強いか見せてもらおう。"], ["Strength is not only in the arm.", "強さは腕だけにあるのではありません。"]],
    paladin: [["A knight. Good. I wanted a hard fight.", "騎士か。いい、手応えのある相手を待っていた。"], ["And I a worthy monk. Come.", "我もまた、手強き修行者を待っていた。来い。"]],
    kappa: [["A small one? I won’t hold back.", "小さいのが相手か。手加減はせんぞ。"], ["Good! I’m not small on the inside!", "いいよ！ぼく、心は大きいから！"]],
    gunman: [["Guns... Let’s see if you can hit qi.", "銃か。気に当てられるかな。"], ["Reckon I can hit anything, friend.", "何にだって当ててやるさ。"]],
    salary: [["You look tired. Step back if you wish.", "疲れているな。退いてもいいぞ。"], ["I-I can’t! If I run, I’ll lose my job!", "そ、そうはいきません！逃げたらクビなんです！"]],
    alchemist: [["A scholar. Let’s test your theory.", "学者か。その理論、試してやろう。"], ["Please do. I’ve calculated your muscles.", "ぜひ。君の筋肉は計算済みだ。"]],
    brawler: [["You fight like me. Show me more.", "俺のような構えだ。もっと見せてくれ。"], ["I was about to say that.", "俺も同じことを言うところだった。"]],
  },
  staff: {
    ninja: [["Ooh, a ninja! Teach me to vanish!", "わぁ忍者！消えるやつ教えて！"], ["No. Fight.", "断る。戦え。"]],
    brawler: [["Big guy! Can you catch me?", "おっきいの！あたしをつかまえられる？"], ["I will. And I won’t miss.", "捕まえる。外しはせん。"]],
    psychic: [["Pretty magic lady! Show me tricks!", "魔法のお姉さん！芸を見せて！"], ["Gladly. Try to keep up, little one.", "よろこんで。ついてきてくださいね。"]],
    paladin: [["Shiny knight! Wanna race?", "ピカピカの騎士さん！競争する？"], ["A knight does not race. He wins.", "騎士は競わぬ。勝つのみだ。"]],
    kappa: [["A turtle with a dish! Cute!", "お皿のカメさん！かわいい！"], ["I’m a kappa! Not a turtle!", "カッパだよ！カメじゃないよ！"]],
    gunman: [["Cool hat! Can I borrow it?", "かっこいい帽子！貸して！"], ["Win it, kid.", "欲しけりゃ勝ち取りな、嬢ちゃん。"]],
    salary: [["You look sleepy! Nap after?", "ねむそうだね！終わったら昼寝する？"], ["I... I’d love to, honestly...", "で、できれば本当にそうしたいです…。"]],
    alchemist: [["Hey Doc, got any cool potions?", "ねぇ先生、すごい薬ある？"], ["Plenty. None for you, I’m afraid.", "たくさんある。君に出すものはないが。"]],
    staff: [["A second Monkey King?! Hee hee!", "もう一人の大聖？！ひひっ！"], ["There can be only one: me!", "大聖は一人だけ！あたし！"]],
  },
  psychic: {
    ninja: [["I know where you’ll stand. Come anyway.", "あなたが立つ場所は分かっています。それでもどうぞ。"], ["Then I’ll stand somewhere else.", "ならば別の場所に立つまでだ。"]],
    brawler: [["Your qi is loud. I can hear it.", "あなたの気は大きい。ここまで聞こえます。"], ["Then hear it up close.", "ならば近くで聞け。"]],
    staff: [["You move like a child at play.", "遊ぶ子どものような動きですね。"], ["It is play! Catch me!", "遊びだもん！つかまえてごらん！"]],
    paladin: [["Your light is pure. Shall we compare?", "あなたの光は純粋ですね。比べてみましょう。"], ["Let the stronger light prevail.", "より強き光が勝たんことを。"]],
    kappa: [["A little spirit. Are you frightened?", "小さな精霊さん、こわいですか？"], ["N-no! ...a little.", "こ、こわくない！…ちょっとだけ。"]],
    gunman: [["Bullets are only the future, arriving early.", "弾丸は、早く来た未来にすぎません。"], ["Ma’am, I’ll make this future quick.", "姉さん、早く終わる未来にしてやるぜ。"]],
    salary: [["You carry a great weight. Please be gentle.", "重い荷を背負っていますね。どうかお手柔らかに。"], ["Th-thank you for noticing...", "き、気づいてくださって、ありがとうございます…。"]],
    alchemist: [["Science and magic. An old quarrel.", "科学と魔法、古い喧嘩ですね。"], ["Let’s settle it with data.", "データで決着をつけよう。"]],
    psychic: [["You are me... and yet not.", "あなたは私…でも、私ではない。"], ["The reflection speaks first.", "先に話すのは、いつも鏡像のほうです。"]],
  },
  paladin: {
    ninja: [["Come out from the dark, assassin.", "闇から出て来い、刺客よ。"], ["The dark is where I live.", "闇こそ、俺の住処だ。"]],
    brawler: [["A warrior’s stance. I respect it.", "戦士の構えだ。敬意を表する。"], ["Respect later. Fight now.", "敬意は後だ。今は戦え。"]],
    staff: [["Young one, withdraw. This is no game.", "若き者よ、退け。遊びではないぞ。"], ["It’s all a game! Come on!", "全部ゲームだよ！かかってきな！"]],
    psychic: [["Sorceress, I will not yield to spells.", "魔女よ、術には屈せぬ。"], ["Not spells. Light. Same as yours.", "術ではなく、光です。あなたと同じ。"]],
    kappa: [["Child of the river, step aside.", "川の子よ、道をあけよ。"], ["No way! I’m going to win!", "いやだ！ぼくが勝つの！"]],
    gunman: [["Lay down your arms, outlaw.", "銃を置け、無法者よ。"], ["Make me, tin man.", "置かせてみな、ブリキの旦那。"]],
    salary: [["Peace, good man. I would not harm you.", "安心せよ、善良な者。害を加えるつもりはない。"], ["But you’re holding a huge sword!", "でも、すごい剣を持ってますよね！？"]],
    alchemist: [["Alchemy... a dangerous craft.", "錬金術…危うき業だ。"], ["So is swordsmanship. Let’s compare.", "剣術もだ。比べてみよう。"]],
    paladin: [["A knight of equal oath. Let us test it.", "同じ誓いを持つ騎士よ。試そうではないか。"], ["Gladly. Let the truer one stand.", "望むところ。より真なる者が立つ。"]],
  },
  kappa: {
    ninja: [["Wow, a real ninja! Do a vanish!", "わぁ本物の忍者！消えるやつやって！"], ["...Win first.", "…勝ってからだ。"]],
    brawler: [["You’re so big! Wanna be friends?", "おっきいね！友だちになる？"], ["After the fight, little one.", "勝負のあとでな、小さいの。"]],
    staff: [["You jump so high! Teach me!", "すごく跳ぶね！教えて！"], ["Hee! Catch me and I will!", "ひひ！つかまえたら教えたげる！"]],
    psychic: [["Your magic is pretty! Can I touch?", "魔法きれい！さわっていい？"], ["If you can reach it.", "届くものなら、どうぞ。"]],
    paladin: [["That sword is huge! Is it heavy?", "その剣おっきい！重くない？"], ["Heavy enough for you, small one.", "汝には十分に重いぞ、小さき者よ。"]],
    gunman: [["Cool guns! Do they squirt water?", "かっこいい銃！お水出る？"], ["Only lead, kid.", "出るのは鉛だけだぜ、ぼうず。"]],
    salary: [["You look tired. Want a cucumber?", "疲れてる？きゅうり食べる？"], ["Oh... thank you. Maybe after?", "あ…ありがとうございます。あとでいただきます。"]],
    alchemist: [["Is that a golem?! Can I ride it?", "ゴーレム？！乗せて！"], ["It is not a ride. It is an experiment.", "乗り物ではない。実験体だ。"]],
    kappa: [["Whoa, two of me! Which one’s real?", "わぁ、ぼくが二人！どっちが本物？"], ["Me! I have the cucumber!", "ぼくだよ！きゅうり持ってるもん！"]],
  },
  gunman: {
    ninja: [["Quit hiding, shadow. Draw first.", "隠れてねえで、影さんよ。先に抜きな。"], ["I never draw first.", "俺は先には抜かない。"]],
    brawler: [["Big man. How’s your aim with those fists?", "でかいの。その拳の狙いはどうだ？"], ["True. Always.", "正確だ。いつもな。"]],
    staff: [["Careful with that stick, little lady.", "その棒、気をつけな、お嬢ちゃん。"], ["Careful with your hat, cowboy!", "おじさんこそ、帽子に気をつけて！"]],
    psychic: [["Ma’am, I don’t shoot ladies. Today I might.", "姉さん、女は撃たねえ。今日は別かもな。"], ["You won’t hit me. I’ve already seen it.", "当たりませんよ。もう見えています。"]],
    paladin: [["Nice armor. Bullets go through anything.", "いい鎧だ。弾はどんなものでも通る。"], ["Then I shall test my shield.", "ならば、我が盾を試すとしよう。"]],
    kappa: [["Kid, go home. This ain’t a pond.", "ぼうず、帰んな。ここは池じゃねえ。"], ["No! I’m a fighter!", "いやだ！ぼくも戦士だもん！"]],
    salary: [["Hey, pal. Lost? The office is that way.", "おい、道に迷ったか？会社はあっちだぜ。"], ["Yes! Yes, I’d love to go there!", "は、はい！ぜひそっちに行きたいです！"]],
    alchemist: [["Doc, ever treat a bullet wound?", "先生、弾の傷は診たことあるかい？"], ["Frequently. I’m about to see another.", "よく診る。もうすぐ一つ増えるな。"]],
    gunman: [["Two of us in one town. Not for long.", "一つの町に俺が二人。長くはねえな。"], ["Draw when you’re ready, me.", "準備ができたら抜きな、俺。"]],
  },
  salary: {
    ninja: [["P-please... I only want to go home.", "お、お願いです…家に帰りたいだけで…。"], ["Then fall quickly.", "ならば早く倒れろ。"]],
    brawler: [["Um, please don’t hit too hard...", "あの、あまり強く殴らないでください…。"], ["No promises. Stand up straight.", "約束はできん。背筋を伸ばせ。"]],
    staff: [["Hello! Please go easy on me!", "こ、こんにちは！お手柔らかに！"], ["Hee! Not a chance!", "ひひ！それは無理！"]],
    psychic: [["Excuse me, miss, are you a customer?", "あの、お客様でしょうか…？"], ["Only of fate, I’m afraid.", "運命のお客様、といったところです。"]],
    paladin: [["Sir, please take my business card!", "騎士様、名刺をどうぞ！"], ["I take no such things. En garde.", "そのようなものは受け取らぬ。構えよ。"]],
    kappa: [["Hi! ...Is that a real turtle?", "こ、こんにちは！本物のカメですか？"], ["I’m a kappa!", "カッパだよ！"]],
    gunman: [["Excuse me! Is this the right meeting room?", "すみません！会議室はここでしょうか？"], ["Wrong room, partner. This is a duel.", "部屋違いだぜ、相棒。ここは決闘だ。"]],
    alchemist: [["Doctor! I haven’t been sleeping lately.", "先生！最近眠れなくて…。"], ["Noted. I prescribe a defeat.", "なるほど。敗北を処方しよう。"]],
    salary: [["Y-you... are also so tired...?", "あ、あなたも…そんなにお疲れで…？"], ["Yes... Let’s do our best, together.", "は、はい…お互い頑張りましょう。"]],
  },
  alchemist: {
    ninja: [["Hold still. I’d like to study your reflexes.", "じっとして。反射神経を調べたい。"], ["I never hold still.", "俺はじっとしない。"]],
    brawler: [["Impressive build. May I take measurements?", "見事な体格だ。測定してもいいか。"], ["Measure this.", "これでも測ってろ。"]],
    staff: [["Child, that staff is unsafe. Hand it over.", "娘さん、その棍は危険だ。預かろう。"], ["No way! It’s mine!", "やだよ！あたしのだもん！"]],
    psychic: [["Magic is merely poorly measured science.", "魔法とは、測定不足の科学にすぎない。"], ["And science is merely magic, explained.", "科学とは、説明された魔法にすぎません。"]],
    paladin: [["Sir knight, your armor is poorly designed.", "騎士殿、その鎧は設計が甘い。"], ["It has served me for many years.", "長年、我を守ってきた鎧だ。"]],
    kappa: [["A new specimen. Let me examine your shell.", "新種の標本だ。甲羅を調べさせてくれ。"], ["No way! You’ll poke me!", "いやだ！つっつくんでしょ！"]],
    gunman: [["A gunshot wound is an excellent case.", "銃創は、実に良い症例だ。"], ["Only if you’re the patient, Doc.", "患者になるのはあんただぜ、先生。"]],
    salary: [["You look worn. Overwork, I suspect.", "ひどく疲れているな。過労だろう。"], ["Y-yes! You can tell?!", "は、はい！分かりますか！？"]],
    alchemist: [["A fascinating duplicate. Let’s experiment.", "興味深い複製体だ。実験といこう。"], ["Agreed. I’ll be the control.", "同意する。私が対照群だ。"]],
  },
};
const COPYD = { // a real fighter against Mimic copying them: [they open, Mimic answers, they answer Mimic's opener (MIRROR_ROBOT.intro)]
  ninja: [["You wear my shadow. Take it off.", "俺の影をまとうな。脱げ。"], ["Shadow data: not removable.", "影データ、取り外し不可。"], ["Same blade. Not the same will.", "刃は同じでも、意志は違う。"]],
  brawler: [["You have my stance. Not my spirit.", "構えは同じ。だが魂は違う。"], ["Spirit: pending.", "魂：保留。"], ["Then compare. Fists tell the truth.", "ならば比べよう。拳は嘘をつかん。"]],
  staff: [["Hey! That’s my staff! Give it back!", "ちょっと！それあたしの棍！返して！"], ["Return: denied.", "返却：拒否。"], ["Then I’ll take it back myself!", "じゃあ力ずくで取り返す！"]],
  psychic: [["A mirror that speaks. How rude.", "話す鏡とは、無礼ですね。"], ["Politeness: copied. Rudeness: added.", "礼儀：複製済み。無礼：追加。"], ["The mirror will crack first.", "先に割れるのは、鏡のほうです。"]],
  paladin: [["My oath in a hollow shell. Blasphemy.", "空ろな器に我が誓いとは。冒涜だ。"], ["Oath: replicated. Faith: not required.", "誓い：複製。信仰：不要。"], ["Then I shall teach you its weight.", "ならば、その重みを教えよう。"]],
  kappa: [["Hey, that’s my face! Mine!", "あー！それぼくの顔！ぼくの！"], ["Face: copied. Cucumber: copied.", "顔：複製。きゅうり：複製。"], ["No! The cucumber’s mine!", "だめ！きゅうりはぼくの！"]],
  gunman: [["Nobody draws like me. Nobody.", "俺みてえに抜ける奴はいねえ。誰もだ。"], ["Draw speed: identical. Result: pending.", "早撃ち：同一。結果：保留。"], ["Then let’s settle it, partner.", "なら、白黒つけようぜ、相棒。"]],
  salary: [["T-that’s my face... and my tie...", "そ、それ私の顔…私のネクタイ…。"], ["Tie: copied. Overtime: copied.", "ネクタイ：複製。残業：複製。"], ["Please give them back!", "返してください！"]],
  alchemist: [["You mimic me. A flattering insult.", "私の真似か。光栄な侮辱だ。"], ["Flattery: not processed.", "お世辞：処理されません。"], ["Then let’s see which is the original.", "ならばどちらが原型か確かめよう。"]],
};
const FINAL = { // FINAL[winner][loser]: the match-winning round — self: the left-hand fighter wins the mirror, self2: the right-hand one, copy: against Mimic copying them
  ninja: { brawler: ["Your fists never touched me.", "拳は一度も、俺に触れなかった。"], staff: ["The cloud falls. The shadow stays.", "雲は落ち、影は残る。"], psychic: ["You saw it coming. It didn’t help.", "見えていても、防げはしなかった。"], paladin: ["Armor is no wall against the dark.", "鎧は闇の壁にならない。"], kappa: ["The river runs dry.", "川は涸れた。"], gunman: ["You drew first. I finished first.", "抜いたのは貴様、終わらせたのは俺だ。"], salary: ["Go home. It is over.", "帰れ。終わりだ。"], alchemist: ["Study the shadow all you want.", "影はいくらでも調べるがいい。"], self: ["Only one shadow remains: mine.", "残る影は一つ。俺のものだ。"], self2: ["The shadow behind you wins.", "勝つのは、お前の背後の影だ。"], copy: ["You copied the shadow. Not the dark.", "影は写せても、闇は写せぬ。"] },
  brawler: { ninja: ["No shadow can hide from qi.", "気から隠れられる影はない。"], staff: ["You fought well. Rest, little one.", "よく戦った。休め、小さいの。"], psychic: ["Strength and spirit, together.", "力と魂、ふたつ揃ってこそだ。"], paladin: ["A fine knight. A finer fight.", "見事な騎士だった。見事な戦いだった。"], kappa: ["Eat well, little one. You earned it.", "たらふく食え、小さいの。よく戦った。"], gunman: ["Qi outran your bullets.", "気は、弾よりも速かった。"], salary: ["Rest. You did well.", "休め。よくやった。"], alchemist: ["Theory broke on my fist.", "理論は、拳の前に砕けた。"], self: ["I conquered myself. That is victory.", "己に勝つ。それが勝利だ。"], self2: ["We are equal. I was simply more stubborn.", "互角だ。俺のほうが頑固だっただけだ。"], copy: ["You wore my fists. They did not fit.", "俺の拳をまとったか。似合わんな。"] },
  staff: { ninja: ["Hee! The Monkey King catches shadows!", "ひひっ！大聖は影も捕まえる！"], brawler: ["Big and strong, but slow!", "大きくて強いけど、遅いね！"], psychic: ["Pretty magic, prettier staff!", "魔法もきれい、でも棍はもっときれい！"], paladin: ["Heavy armor, light victory!", "重い鎧に、軽い勝利！"], kappa: ["Turtle soup! ...just kidding!", "カメのスープ！…うそうそ！"], gunman: ["Bang bang! The staff wins!", "バンバン！棍の勝ち！"], salary: ["Thanks for playing! Go nap!", "ありがとう！ゆっくり昼寝してね！"], alchemist: ["Your golem’s cool! My cloud’s cooler!", "ゴーレムすごい！でも雲のほうがすごい！"], self: ["Two monkeys, one throne. Mine!", "猿が二匹、玉座は一つ。あたしの！"], self2: ["Almost, other me! Better luck!", "惜しかったね、もう一人のあたし！"], copy: ["My staff is mine! Hee hee!", "あたしの棍はあたしの！ひひっ！"] },
  psychic: { ninja: ["Shadows flicker. The light remains.", "影は揺らぎ、光は残る。"], brawler: ["Strength is not the only power.", "力だけが力ではありません。"], staff: ["A lovely dance. Now rest.", "素敵な舞でした。さあ、お休みを。"], paladin: ["Two lights met. Mine was brighter.", "二つの光が出会い、私の光が勝りました。"], kappa: ["The water will welcome you back.", "水があなたを迎えてくれるでしょう。"], gunman: ["The future was already decided.", "未来は、すでに決まっていました。"], salary: ["Fate has been kind to you.", "運命は、あなたに優しかったのですよ。"], alchemist: ["Magic, explained: it wins.", "魔法とは、勝つもの。それが答えです。"], self: ["I won against myself. Well done, me.", "自分に勝ちました。よくやりました、私。"], self2: ["The reflection was closer than I thought.", "鏡像は、思ったより近くにいました。"], copy: ["A mirror cannot break its owner.", "鏡は、持ち主を割れません。"] },
  paladin: { ninja: ["Justice is not hidden by shadow.", "正義は、影には隠れぬ。"], brawler: ["You fought with honor, warrior.", "誇りある戦いであった、戦士よ。"], staff: ["Rest, child. You played valiantly.", "休め、子よ。見事な戦いぶりであった。"], psychic: ["Light stands where sorcery fades.", "術が消えるところに、光は立つ。"], kappa: ["Go home to your river, child.", "川へ帰れ、小さき者よ。"], gunman: ["Steel has decided this day.", "今日は、鋼が決めた。"], salary: ["Go in peace, good man.", "安らかに行け、善き者よ。"], alchemist: ["Faith endures where theory fails.", "理論が崩れても、信仰は残る。"], self: ["The truer oath has prevailed.", "より真なる誓いが勝った。"], self2: ["You were the better knight. Almost.", "そなたは良き騎士であった。あと一歩だけな。"], copy: ["My oath is not yours to wear.", "我が誓いは、そなたの纏うものではない。"] },
  kappa: { ninja: ["Splash! The ninja got wet!", "ばしゃっ！忍者がびしょ濡れ！"], brawler: ["Thanks for the fight! Let’s eat!", "勝負ありがと！ごはん食べよ！"], staff: ["You jump high but I swim deep!", "高く跳ぶけど、ぼくは深く泳ぐよ！"], psychic: ["Your magic was so pretty!", "魔法、とってもきれいだった！"], paladin: ["Big sword, small kappa... I won!", "大きな剣に、小さなカッパ…ぼくの勝ち！"], gunman: ["Bang! ...I’m fine, I’m a kappa!", "バン！…ぼくは平気、カッパだもん！"], salary: ["You did your best! Cucumber?", "がんばったね！きゅうり食べる？"], alchemist: ["Golem-san, good fight!", "ゴーレムさん、いい勝負だったよ！"], self: ["Two kappa, one cucumber. Mine!", "カッパ二人にきゅうり一本。ぼくの！"], self2: ["Good game, me! Let’s share!", "いい勝負だったね、ぼく！半分こしよう！"], copy: ["Cucumbers can’t be copied!", "きゅうりは、コピーできないんだよ！"] },
  gunman: { ninja: ["Shadows still fall, partner.", "影だって、倒れるときは倒れるのさ。"], brawler: ["Strong fists, slow hands.", "いい拳だが、手が遅い。"], staff: ["Nice moves, kid. Not fast enough.", "いい動きだ、嬢ちゃん。だが速さが足りねえ。"], psychic: ["Pretty magic. Prettier aim.", "きれいな魔法だったが、俺の狙いはもっときれいだ。"], paladin: ["Armor stops swords. Not lead.", "鎧は剣は止めても、鉛は止められねえ。"], kappa: ["Go on home, little fella.", "帰んな、ちびっこ。"], salary: ["Go home. Take your tie with you.", "家に帰んな。ネクタイも忘れずにな。"], alchemist: ["Patch yourself up, Doc.", "自分の傷は自分で診な、先生。"], self: ["One of us walks out. Me.", "町を出るのは一人だけ。俺だ。"], self2: ["You were fast. Not fast enough.", "速かったぜ。だが俺ほどじゃねえ。"], copy: ["My draw is mine alone.", "俺の早撃ちは、俺だけのもんだ。"] },
  salary: { ninja: ["I... I really won? Sorry!", "か、勝っちゃいました？すみません！"], brawler: ["Thank you so much! ...and sorry!", "ありがとうございました！あと、すみません！"], staff: ["You were amazing! I got lucky!", "すごかったです！私は運が良かっただけで！"], psychic: ["Thank you. I’ll treasure this.", "ありがとうございました。大切にします。"], paladin: ["Thank you for your guidance, sir!", "ご指導、ありがとうございました、騎士様！"], kappa: ["Cucumber break! My treat!", "きゅうり休憩にしましょう！おごります！"], gunman: ["Please... put that away. Coffee?", "そ、それをしまって…コーヒーでも？"], alchemist: ["Doctor... I need rest too.", "先生…私にも休息が必要です。"], self: ["Both so tired... I just lasted longer.", "どちらも疲れ切って…私が少し長持ちしただけです。"], self2: ["You did your best. We both did.", "お疲れ様でした。お互いよく頑張りました。"], copy: ["P-please return my face... later.", "私の顔は…あとで返してくださいね。"] },
  alchemist: { ninja: ["Subject observed. Discharged.", "被検体、観察終了。退院だ。"], brawler: ["Bed rest, two weeks.", "安静にしなさい、二週間。"], staff: ["Hyperactive. Needs rest.", "活発すぎる。休養が必要だ。"], psychic: ["Magic leaves no mark. Interesting.", "魔法は痕跡を残さない。興味深い。"], paladin: ["Iron and faith oxidize. Noted.", "鉄も信仰も酸化する。記録した。"], kappa: ["Specimen secured. For research.", "標本を確保した。研究に回す。"], gunman: ["The wound will heal. Rest.", "傷は治る。安静に。"], salary: ["Overwork. Take leave.", "過労だ。休職を勧める。"], self: ["The experiment succeeded. Subject: me.", "実験は成功。被験者は私自身だ。"], self2: ["A fine duplicate. Not the original.", "良い複製だった。だが原型ではない。"], copy: ["I am the original. Chart that.", "原型は私だ。記録しておけ。"] },
};
const MIR2 = { // a round won by the right-hand fighter of a mirror match: [win, narrow, very narrow]
  ninja: [["The second shadow was the true one.", "二つ目の影こそ、本物だった。"], ["The second shadow barely held.", "二つ目の影が、かろうじて残った。"], ["Both shadows nearly vanished.", "影が二つとも消えかけた。"]],
  brawler: [["Same fists. Mine had more fight in them.", "同じ拳でも、俺の拳のほうが粘った。"], ["Equal strength. I lasted one breath more.", "互角。俺が一息だけ長かった。"], ["Both on our knees. I was the last standing.", "二人とも膝をついた。最後まで立っていたのが俺だ。"]],
  staff: [["I’m the real one! Hee hee!", "あたしが本物ってこと！ひひっ！"], ["Phew, so close! Fake me almost won!", "ふぅ、危なかった！偽物のあたしが勝つとこ！"], ["Me vs me... I barely won... zzz", "あたし対あたし…ぎりぎり勝った…ぐぅ。"]],
  psychic: [["The reflection wins. How delightful.", "鏡像が勝ちました。愉快ですね。"], ["The mirror nearly cracked.", "鏡が割れる寸前でした。"], ["Which of us is real? Me, barely.", "どちらが本物か…かろうじて私。"]],
  paladin: [["The second knight proved the truer.", "二人目の騎士こそ、真であった。"], ["Equal oaths. I held a moment longer.", "誓いは互角。一瞬だけ長く持った。"], ["Two knights on their knees. I rose.", "二人の騎士が膝をつき…我が立った。"]],
  kappa: [["I’m the real one! Look at my dish!", "ぼくが本物！お皿を見て！"], ["Almost lost to a copy of me!", "ぼくのコピーに負けるとこだった！"], ["Both dishes empty... I lasted last!", "お皿二つとも空っぽ…最後まで残ったのはぼく！"]],
  gunman: [["Looks like I’m the fast one.", "どうやら、速いのは俺のほうだったな。"], ["Same draw. I blinked last.", "同じ早撃ち。瞬きが遅かったのは俺だ。"], ["Both near dead. Mine’s the last gun smoking.", "二人ともほぼ死に体。最後に煙を上げてたのは俺の銃だ。"]],
  salary: [["I won?! Sorry, other me!", "勝っちゃいました？！すみません、もう一人の私！"], ["We were both so close... sorry!", "二人ともギリギリでした…すみません！"], ["Both of us nearly... collapsed.", "二人とも…倒れる寸前でした…。"]],
  alchemist: [["The duplicate outperformed the original.", "複製が原型を上回ったか。"], ["The margin was thin. Recorded.", "差はわずか。記録した。"], ["Both specimens nearly expired.", "両方の標本が、危うく廃棄だった。"]],
};
const COPYW = { // a round won against Mimic copying them: [win, narrow, very narrow]
  ninja: [["Your shadow was a step late.", "お前の影は、一歩遅れていた。"], ["The copy nearly cast a shadow.", "写しが、影を落としかけた。"], ["Even the copy cut deep.", "写しにまで、深く斬られた。"]],
  brawler: [["My fists, but not my heart.", "拳は同じ、だが心がない。"], ["The copy nearly matched me.", "写しが、俺に並びかけた。"], ["Barely... the original stands.", "かろうじて…本物が立っている。"]],
  staff: [["Fake staff, real winner: me!", "偽の棍、本物の勝者はあたし！"], ["Whoa, the copy almost got me!", "うわ、コピーに負けるとこ！"], ["Copy-me almost won... phew...", "コピーのあたしに…負けかけた…ふぅ…。"]],
  psychic: [["A reflection never wins.", "鏡像は、勝てないのです。"], ["The mirror nearly broke me.", "鏡に、割られかけました。"], ["I am the original... barely.", "本物は私…かろうじて。"]],
  paladin: [["The oath is mine, not yours.", "誓いは我が物。そなたの物ではない。"], ["The copy nearly shook my oath.", "写しが、誓いを揺らしかけた。"], ["My oath held. Barely.", "誓いは持ちこたえた。かろうじて。"]],
  kappa: [["My face, my cucumber, my win!", "ぼくの顔、ぼくのきゅうり、ぼくの勝ち！"], ["The copy almost got my cucumber!", "コピーにきゅうりを取られるとこ！"], ["Phew... the real kappa survived...", "ふぅ…本物のカッパが生き残った…。"]],
  gunman: [["Copy the draw. Can’t copy me.", "早撃ちは写せても、俺は写せねえ。"], ["That copy nearly drew first.", "そのコピー、先に抜きかけたぜ。"], ["Close. The real one’s still standing.", "危なかった。本物がまだ立ってるぜ。"]],
  salary: [["Please don’t take my face!", "私の顔を取らないでください！"], ["The copy almost worked harder!", "コピーのほうが頑張りかけてました！"], ["The original... is barely online.", "本物は…ぎりぎり稼働中です…。"]],
  alchemist: [["A copy is never the original.", "写しは、原型にはなれない。"], ["The copy nearly corrected me.", "写しが私を修正しかけた。"], ["Original and copy... equally cracked.", "原型も写しも、同じだけ割れた。"]],
};

const sameKind = (f, o) => !!f.robot === !!o.robot;
function introPair(f) { // the line this fighter says before the first round: [en, ja], or null
  const o = other(f); if (!o) return null;
  const a = f.key, b = o.key;
  if (a === b && !sameKind(f, o)) { // one of them is Mimic copying the other
    if (f.robot) return f.side === 0 ? (MIRROR_ROBOT[a] && MIRROR_ROBOT[a].intro) : (COPYD[a] && COPYD[a][1]);
    return COPYD[a] ? (f.side === 0 ? COPYD[a][0] : COPYD[a][2]) : null;
  }
  const left = f.side === 0 ? a : b, right = f.side === 0 ? b : a, d = DLG[left] && DLG[left][right];
  return d ? (f.side === 0 ? d[0] : d[1]) : null;
}
function introSpeechOf(f) { const l = introPair(f); return l ? L(...l) : (f.robot ? L('Copy complete.', 'コピー完了') : L(...SHOW[f.key].introLine)); }
function introSpeechAlpha(f) { const p = game.phaseT, a0 = f.side ? 84 : 14, a1 = f.side ? 180 : 96; return clamp((p - a0) / 8, 0, 1) * clamp((a1 - p) / 10, 0, 1); } // (the left one speaks first, the right one answers)
function winPick(f) { // the line for this win: [en, ja], or null
  const o = other(f); if (!o) return null;
  const a = f.key, b = o.key, fin = game.finalWin === f, tier = fin ? 'final' : f.hp < 100 ? 'd' : f.winTier === 'c' ? 'c' : 'ab', i = tier === 'ab' ? 0 : tier === 'c' ? 1 : 2;
  const T = tier === 'c' ? WIN_VS_C : tier === 'd' ? WIN_VS_D : WIN_VS;
  if (a === b && !sameKind(f, o)) { // against Mimic copying them (or Mimic, against the one he copies)
    if (f.robot) return MIRROR_ROBOT[a] && MIRROR_ROBOT[a][fin ? 'final' : i === 0 ? 'win' : i === 1 ? 'c' : 'd'];
    return fin ? FINAL[a].copy : COPYW[a][i];
  }
  if (a === b && f.side === 1) return fin ? FINAL[a].self2 : MIR2[a][i]; // the mirror, won by the right-hand fighter
  if (fin) return FINAL[a] && FINAL[a][a === b ? 'self' : b];
  return T[a] && T[a][b];
}
{ const wl = winLine; winLine = function (f) { const l = winPick(f); return l ? L(...l) : wl(f); }; }

