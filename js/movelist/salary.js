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
      <p class="note"><b>Office supplies (himself only).</b> ↓ + U throws a pen straight across the stage, ↓ + J lobs the stapler in an arc, and I in the air drops his coffee mug on them. <b>Angel form:</b> he can double jump and guard in the air; his air string is longer (U, U, U, U), and W during a landed air hit jumps again on his wings to keep it going. He can also lift them three times in one juggle (two relaunches).</p>
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
      <h3>Frame data</h3>
<p class="note"><b>Frame data.</b> Measured from the game itself at 60 frames a second. <b>Startup</b>: frames from pressing the button until it hits (for a string, the frames that hit takes after the previous one; for moves that travel, at the distance shown). <b>On guard / On hit</b>: who recovers first after it connects — plus means the attacker can act first, minus means the defender can. <b>After</b>: frames from the moment it hits until he can guard again (if it misses). <b>Total</b>: frames from the press until he can guard again if it misses (startup + after). <b>Damage</b>: what it does when it hits (for a string, the whole string; later hits in a combo keep 65–95% depending on how long they take). Until then he can’t guard, so a whiffed or guarded move with a big minus can be punished: a light punch (U) hits on frame 4–8 and a launcher (↓+I) on frame 13–16, and how far they reach depends on the fighter: U reaches about 80–95px for Kappa, Kuro, Tanaka and Tetsu, 160–185px for Lyra, Mei and Aldric, and further with Jesse’s shot; ↓+I reaches 85–95px for Kuro, Tanaka and Tetsu and 120–225px for the others. <b>Punish</b> combines the minus with the distance left after the pushback. Tetsu’s armor shrugs off light hits while he attacks, so punish him with a heavy attack.</p>
      <h3>Tanaka (himself)</h3>
      <div class="scroll"><table class="fd">
        <thead><tr><th>Command</th><th>Move</th><th>Damage</th><th>Startup</th><th>After</th><th>On guard</th><th>On hit</th><th>Total</th><th>Punish</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Light Punch</td><td><b>23</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I</td><td>Briefcase Swing</td><td><b>42</b></td><td>17</td><td>23</td><td class="neg">−10</td><td>knockdown</td><td>40</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (86px)</td></tr>
          <tr><td class="cmd">J</td><td>Light Kick</td><td><b>26</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">K</td><td>Shove and Run</td><td><b>24</b></td><td>17</td><td>23</td><td class="neg">−10</td><td>+3</td><td>40</td><td class="pu ok">Minus, but out of reach (216px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>23</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+I</td><td>Uppercut Launcher</td><td><b>53</b></td><td>18</td><td>19</td><td class="neg">−10</td><td>launch</td><td>37</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (111px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Low Kick</td><td><b>26</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">↓+K</td><td>Briefcase Trip</td><td><b>57</b></td><td>17</td><td>24</td><td class="neg">−10</td><td>knockdown</td><td>41</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (112px)</td></tr>
          <tr><td class="cmd">U U</td><td>Briefcase Swing</td><td><b>39</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U</td><td>Necktie Whip</td><td><b>52</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U</td><td>Shoulder Bump</td><td><b>66</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Panic Shove</td><td><b>97</b></td><td>15</td><td>—</td><td class="neg">−32</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (170px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Deadline Dash</td><td><b>68</b></td><td>15</td><td>—</td><td class="neg">−10</td><td>knockdown</td><td>—</td><td class="pu ok">Minus, but out of reach (207px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Promotion Uppercut</td><td><b>65</b></td><td>15</td><td>—</td><td class="neg">−15</td><td>launch</td><td>—</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">J J</td><td>Shin Kick</td><td><b>42</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">J J K</td><td>Briefcase Sweep</td><td><b>70</b></td><td>15</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (107px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Business Card</td><td><b>14</b></td><td>10</td><td>18</td><td class="neg">−8</td><td>±0</td><td>28</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (106px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Briefcase Smash</td><td><b>38</b></td><td>41</td><td>27</td><td class="neg">−48</td><td>knockdown</td><td>68</td><td class="pu ok">Minus, but out of reach (223px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Rush Hour Tackle</td><td><b>28</b></td><td>35</td><td>31</td><td class="neg">−32</td><td>launch</td><td>66</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">→→+K</td><td>Overtime Uppercut</td><td><b>31</b></td><td>34</td><td>27</td><td class="neg">−48</td><td>launch</td><td>61</td><td class="pu ok">Minus, but out of reach (218px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Hot Coffee</td><td><b>14</b></td><td>29</td><td>25</td><td class="neg">−36</td><td>stun</td><td>54</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (181px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Angel Possession</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>105</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Dogeza Spring</td><td><b>26</b></td><td>39</td><td>21</td><td class="neg">−20</td><td>launch</td><td>60</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">←←+K</td><td>Devil Possession</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>105</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">U+J (super)</td><td>Deadline Rush</td><td><b>72</b></td><td>57</td><td>59</td><td class="pos">+5</td><td>knockdown</td><td>116</td><td class="pu ok">Safe</td></tr>
        </tbody>
      </table></div>
      <h3>Angel possession</h3>
      <div class="scroll"><table class="fd">
        <thead><tr><th>Command</th><th>Move</th><th>Damage</th><th>Startup</th><th>After</th><th>On guard</th><th>On hit</th><th>Total</th><th>Punish</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Light Jab</td><td><b>44</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I</td><td>Holy Palm</td><td><b>83</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>+3</td><td>39</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (86px)</td></tr>
          <tr><td class="cmd">K</td><td>Wing Kick</td><td><b>88</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>+3</td><td>39</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (87px)</td></tr>
          <tr><td class="cmd">U U</td><td>Wing Slap</td><td><b>70</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U</td><td>Halo Chop</td><td><b>95</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U</td><td>Feather Palm</td><td><b>121</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Judgement Fist</td><td><b>181</b></td><td>15</td><td>—</td><td class="neg">−32</td><td>stun</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (170px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Seraph Wing Sweep</td><td><b>134</b></td><td>15</td><td>—</td><td class="neg">−12</td><td>—</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (133px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Halo Ascension</td><td><b>101</b></td><td>14</td><td>—</td><td class="neg">−11</td><td>launch</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (117px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Divine Jab</td><td><b>30</b></td><td>9</td><td>16</td><td class="neg">−4</td><td>+4</td><td>25</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">→→+I</td><td>Halo Fist</td><td><b>46</b></td><td>30</td><td>23</td><td class="neg">−36</td><td>stun</td><td>53</td><td class="pu ok">Minus, but out of reach (307px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Angel Glide</td><td><b>36</b></td><td>27</td><td>33</td><td class="neg">−21</td><td>knockdown</td><td>60</td><td class="pu ok">Minus, but out of reach (290px)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Holy Ascension</td><td><b>52</b></td><td>33</td><td>29</td><td class="neg">−48</td><td>launch</td><td>62</td><td class="pu ok">Minus, but out of reach (218px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Blessing</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>65</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Holy Ward</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>45</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Feather Step</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>24</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Devil Possession</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>105</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">U+J (super)</td><td>Heaven&#x27;s Gate</td><td><b>170</b></td><td>62</td><td>72</td><td class="pos">+3</td><td>launch</td><td>134</td><td class="pu ok">Safe</td></tr>
        </tbody>
      </table></div>
      <h3>Devil possession</h3>
      <div class="scroll"><table class="fd">
        <thead><tr><th>Command</th><th>Move</th><th>Damage</th><th>Startup</th><th>After</th><th>On guard</th><th>On hit</th><th>Total</th><th>Punish</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Devil Swipe</td><td><b>56</b></td><td>8</td><td>7</td><td class="pos">+2</td><td>+5</td><td>15</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">I</td><td>Hellclaw</td><td><b>106</b></td><td>15</td><td>19</td><td class="neg">−10</td><td>knockdown</td><td>34</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (86px)</td></tr>
          <tr><td class="cmd">K</td><td>Demon Kick</td><td><b>114</b></td><td>15</td><td>18</td><td class="neg">−10</td><td>+3</td><td>33</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (86px)</td></tr>
          <tr><td class="cmd">U U</td><td>Hellclaw</td><td><b>88</b></td><td>8</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U</td><td>Horn Butt</td><td><b>123</b></td><td>8</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U</td><td>Tail Whip</td><td><b>156</b></td><td>8</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">Safe</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Brimstone Kick</td><td><b>230</b></td><td>13</td><td>—</td><td class="neg">−32</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (167px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Infernal Tail Lash</td><td><b>178</b></td><td>13</td><td>—</td><td class="neg">−12</td><td>knockdown</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (133px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Hellgate Upper</td><td><b>157</b></td><td>13</td><td>—</td><td class="neg">−12</td><td>launch</td><td>—</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (126px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Beast Lunge</td><td><b>59</b></td><td>27</td><td>35</td><td class="neg">−20</td><td>+2</td><td>62</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">→→+I</td><td>Savage Maul</td><td><b>71</b></td><td>27</td><td>37</td><td class="neg">−20</td><td>knockdown</td><td>64</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">→→+J</td><td>Shadow Claw</td><td><b>87</b></td><td>28</td><td>33</td><td class="neg">−20</td><td>launch</td><td>61</td><td class="pu bad">Launcher punish: Lyra, Aldric, Jesse, Kappa · U punish: Mei, Lyra, Aldric, Jesse</td></tr>
          <tr><td class="cmd">→→+K</td><td>Demon Uppercut</td><td><b>87</b></td><td>33</td><td>29</td><td class="neg">−48</td><td>launch</td><td>62</td><td class="pu ok">Minus, but out of reach (218px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Beckon</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>53</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Angel Possession</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>105</td><td class="pu nx">No attack (stance / buff)</td></tr>
          <tr><td class="cmd">←←+J</td><td>Hell Chain</td><td><b>36</b></td><td>30</td><td>23</td><td class="neg">−36</td><td>+19</td><td>53</td><td class="pu mid">Only long-reach U punishes: Mei, Lyra, Aldric, Jesse (181px)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Soul Drain</td><td><b>90</b></td><td>33</td><td>28</td><td class="">throw</td><td>knockdown</td><td>61</td><td class="pu tw">Can't be guarded (throw)</td></tr>
          <tr><td class="cmd">U+J (super)</td><td>Infernal Contract</td><td><b>41</b></td><td>62</td><td>60</td><td class="neg">−31</td><td>−37</td><td>122</td><td class="pu bad">Launcher (↓+I) punish, full combo (everyone)</td></tr>
        </tbody>
      </table></div>
    </article>
    <article class="card salary" data-tab="salary" data-lang="ja" hidden>
      <h2>田中<span>サラリーマン</span></h2>
      <p class="blurb">スーツにネクタイ、手には書類カバン。両肩には小さな天使と小さな悪魔。素の田中は普通の戦い方だが、どちらかに憑依されると10秒間すべてが変わり（頭上に残り時間）、時間が切れると普通の人間に戻る。</p>
      <p class="note"><b>二重憑依。</b>片方に憑依されている間にもう片方を呼ぶ（天使は←←＋I、悪魔は←←＋K）と、両方が同時に宿る：翼と輪、角と尻尾。弱攻撃では止まらないが、ガードは一切できない（そのため受けるダメージは半分で、打ち上げられてコンボされることもない）。近くにいる相手は聖なる光と地獄の炎の場に焼かれる。効果時間は通常の4分の3で、体力も削られる。<b>→→＋J ラッシュアワーキック：</b>全力疾走から飛び蹴りで打ち上げる。ガードの上からも大きく削る。<b>←←→＋J（悪魔）：</b>←←のあと→を押しながらJ。地獄の鎖で引き寄せる。</p>
      <p class="note"><b>悪魔憑依：J・Kの技はすべて尻尾、リーチも長い。</b>←←＋J 尻尾ムチ（中段）、←←↑＋J 尻尾ハンマー（背を向けて頭上から振り下ろす：<b>立ちガード</b>で防ぐ）、←←↓＋J 尻尾払い（下段）、←←→＋J 地獄の鎖（腹から、中段）、→→＋J 尻尾ラッシュ、→→＋K 尻尾フック（打ち上げ）、←←＋K 魂吸い（尻尾で巻き取る）。<b>天使憑依：</b>←←＋J 天の眼差し（目からの光線、中段）、←←↓＋J 謙虚な眼差し（足元への光線）、←←↑＋J 昇天の眼差し（無敵で舞い上がり、上から撃つ）、←←→＋J セラフダイブ（上昇中なら止められる。急降下はアーマー）。<b>素の田中：</b>←←＋J 土下座スプリングは長く光り輝く無敵の土下座に。<b>憑依：</b>小さな天使・悪魔が田中の1.5倍の大きさの本物の姿になり、背後から田中に宿る。</p>
      <p class="note"><b>下段の技（技のコマンドに↓を加える。しゃがみガードで防ぐ）。</b>素の田中：→→↓＋J 濡れた床スライド（足から滑り込んでダウン）、←←↓＋J こぼれたコーヒー（滑る水たまり）、→→↓＋K カバン滑らせ（床を滑って足元に当たる）。悪魔憑依：→→↓＋J 地獄這い（四つん這いで足元を裂き、打ち上げる）、←←↓＋J 尾払い（尻尾で足元をなぎ払う）、→→↓＋K 硫黄の炎（地獄の炎が床を走る）。</p>
      <p class="note"><b>文房具投げ（素の田中のみ）。</b>↓＋Uでペンを投げ、↓＋Jでホッチキスを放物線で投げ、空中でIを押すとマグカップを落とす。<b>天使憑依：</b>二段ジャンプと空中ガードができ、空中の連撃が長い（U、U、U、U）。空中攻撃のヒット中にWで翼の二段ジャンプをしてコンボを続けられる。1回のコンボで3回浮かせられる（再打ち上げ2回）。</p>
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
      <h3>フレームデータ</h3>
<p class="note"><b>フレームデータ。</b> ゲーム本体で計測（1秒＝60フレーム）。<b>発生</b>：ボタンを押してから当たるまで（連続技は前の攻撃からの間隔、飛ぶ技は表示の距離で計測）。<b>ガード時／ヒット時</b>：当たった後どちらが先に動けるか。＋は攻撃側、－は防御側が先に動ける。<b>ヒット後</b>：当たる瞬間から再びガードできるまで（空振り時）。<b>全体</b>：空振りした場合、押してから再びガードできるまで（発生＋ヒット後）。 <b>ダメージ</b>：当たったときのダメージ（連続技は全体の合計。コンボの後半の攻撃は、時間のかかる技ほど65〜95%が残る）。それまではガードできないので、大きく不利な技は反撃される。弱パンチ（U）は4〜8フレーム目、打ち上げ（↓+I）は13〜16フレーム目に当たり、届く距離はキャラごとに違う：Uはカッパ・クロ・田中・テツが約80〜95px、ライラ・メイ・アルドリックが160〜185px、ジェシーの射撃はさらに遠く。↓+Iはクロ・田中・テツが85〜95px、他は120〜225px。<b>反撃</b>は不利フレームと押し返し後の距離から判定。テツは攻撃中アーマーで弱攻撃を受け流すので、強攻撃で反撃すること。</p>
      <h3>素の田中</h3>
      <div class="scroll"><table class="fd">
        <thead><tr><th>コマンド</th><th>技</th><th>ダメージ</th><th>発生</th><th>ヒット後</th><th>ガード時</th><th>ヒット時</th><th>全体</th><th>反撃</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Light Punch</td><td><b>23</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I</td><td>Briefcase Swing</td><td><b>42</b></td><td>17</td><td>23</td><td class="neg">−10</td><td>ダウン</td><td>40</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (86px)</td></tr>
          <tr><td class="cmd">J</td><td>Light Kick</td><td><b>26</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">K</td><td>Shove and Run</td><td><b>24</b></td><td>17</td><td>23</td><td class="neg">−10</td><td>+3</td><td>40</td><td class="pu ok">不利だが届かない (216px)</td></tr>
          <tr><td class="cmd">↓+U</td><td>Low Punch</td><td><b>23</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+I</td><td>Uppercut Launcher</td><td><b>53</b></td><td>18</td><td>19</td><td class="neg">−10</td><td>打ち上げ</td><td>37</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (111px)</td></tr>
          <tr><td class="cmd">↓+J</td><td>Low Kick</td><td><b>26</b></td><td>9</td><td>10</td><td class="pos">+2</td><td>+5</td><td>19</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">↓+K</td><td>Briefcase Trip</td><td><b>57</b></td><td>17</td><td>24</td><td class="neg">−10</td><td>ダウン</td><td>41</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (112px)</td></tr>
          <tr><td class="cmd">U U</td><td>Briefcase Swing</td><td><b>39</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U</td><td>Necktie Whip</td><td><b>52</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U</td><td>Shoulder Bump</td><td><b>66</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Panic Shove</td><td><b>97</b></td><td>15</td><td>—</td><td class="neg">−32</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (170px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Deadline Dash</td><td><b>68</b></td><td>15</td><td>—</td><td class="neg">−10</td><td>ダウン</td><td>—</td><td class="pu ok">不利だが届かない (207px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Promotion Uppercut</td><td><b>65</b></td><td>15</td><td>—</td><td class="neg">−15</td><td>打ち上げ</td><td>—</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">J J</td><td>Shin Kick</td><td><b>42</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">J J K</td><td>Briefcase Sweep</td><td><b>70</b></td><td>15</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (107px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Business Card</td><td><b>14</b></td><td>10</td><td>18</td><td class="neg">−8</td><td>±0</td><td>28</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (106px)</td></tr>
          <tr><td class="cmd">→→+I</td><td>Briefcase Smash</td><td><b>38</b></td><td>41</td><td>27</td><td class="neg">−48</td><td>ダウン</td><td>68</td><td class="pu ok">不利だが届かない (223px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Rush Hour Tackle</td><td><b>28</b></td><td>35</td><td>31</td><td class="neg">−32</td><td>打ち上げ</td><td>66</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">→→+K</td><td>Overtime Uppercut</td><td><b>31</b></td><td>34</td><td>27</td><td class="neg">−48</td><td>打ち上げ</td><td>61</td><td class="pu ok">不利だが届かない (218px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Hot Coffee</td><td><b>14</b></td><td>29</td><td>25</td><td class="neg">−36</td><td>気絶</td><td>54</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (181px)</td></tr>
          <tr><td class="cmd">←←+I</td><td>Angel Possession</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>105</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+J</td><td>Dogeza Spring</td><td><b>26</b></td><td>39</td><td>21</td><td class="neg">−20</td><td>打ち上げ</td><td>60</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">←←+K</td><td>Devil Possession</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>105</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">U+J （超必殺）</td><td>Deadline Rush</td><td><b>72</b></td><td>57</td><td>59</td><td class="pos">+5</td><td>ダウン</td><td>116</td><td class="pu ok">安全</td></tr>
        </tbody>
      </table></div>
      <h3>天使憑依</h3>
      <div class="scroll"><table class="fd">
        <thead><tr><th>コマンド</th><th>技</th><th>ダメージ</th><th>発生</th><th>ヒット後</th><th>ガード時</th><th>ヒット時</th><th>全体</th><th>反撃</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Light Jab</td><td><b>44</b></td><td>9</td><td>8</td><td class="pos">+2</td><td>+5</td><td>17</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I</td><td>Holy Palm</td><td><b>83</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>+3</td><td>39</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (86px)</td></tr>
          <tr><td class="cmd">K</td><td>Wing Kick</td><td><b>88</b></td><td>17</td><td>22</td><td class="neg">−10</td><td>+3</td><td>39</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (87px)</td></tr>
          <tr><td class="cmd">U U</td><td>Wing Slap</td><td><b>70</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U</td><td>Halo Chop</td><td><b>95</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U</td><td>Feather Palm</td><td><b>121</b></td><td>10</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Judgement Fist</td><td><b>181</b></td><td>15</td><td>—</td><td class="neg">−32</td><td>気絶</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (170px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Seraph Wing Sweep</td><td><b>134</b></td><td>15</td><td>—</td><td class="neg">−12</td><td>—</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (133px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Halo Ascension</td><td><b>101</b></td><td>14</td><td>—</td><td class="neg">−11</td><td>打ち上げ</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (117px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Divine Jab</td><td><b>30</b></td><td>9</td><td>16</td><td class="neg">−4</td><td>+4</td><td>25</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">→→+I</td><td>Halo Fist</td><td><b>46</b></td><td>30</td><td>23</td><td class="neg">−36</td><td>気絶</td><td>53</td><td class="pu ok">不利だが届かない (307px)</td></tr>
          <tr><td class="cmd">→→+J</td><td>Angel Glide</td><td><b>36</b></td><td>27</td><td>33</td><td class="neg">−21</td><td>ダウン</td><td>60</td><td class="pu ok">不利だが届かない (290px)</td></tr>
          <tr><td class="cmd">→→+K</td><td>Holy Ascension</td><td><b>52</b></td><td>33</td><td>29</td><td class="neg">−48</td><td>打ち上げ</td><td>62</td><td class="pu ok">不利だが届かない (218px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Blessing</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>65</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+I</td><td>Holy Ward</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>45</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+J</td><td>Feather Step</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>24</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+K</td><td>Devil Possession</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>105</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">U+J （超必殺）</td><td>Heaven&#x27;s Gate</td><td><b>170</b></td><td>62</td><td>72</td><td class="pos">+3</td><td>打ち上げ</td><td>134</td><td class="pu ok">安全</td></tr>
        </tbody>
      </table></div>
      <h3>悪魔憑依</h3>
      <div class="scroll"><table class="fd">
        <thead><tr><th>コマンド</th><th>技</th><th>ダメージ</th><th>発生</th><th>ヒット後</th><th>ガード時</th><th>ヒット時</th><th>全体</th><th>反撃</th></tr></thead>
        <tbody>
          <tr><td class="cmd">U</td><td>Devil Swipe</td><td><b>56</b></td><td>8</td><td>7</td><td class="pos">+2</td><td>+5</td><td>15</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">I</td><td>Hellclaw</td><td><b>106</b></td><td>15</td><td>19</td><td class="neg">−10</td><td>ダウン</td><td>34</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (86px)</td></tr>
          <tr><td class="cmd">K</td><td>Demon Kick</td><td><b>114</b></td><td>15</td><td>18</td><td class="neg">−10</td><td>+3</td><td>33</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (86px)</td></tr>
          <tr><td class="cmd">U U</td><td>Hellclaw</td><td><b>88</b></td><td>8</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U</td><td>Horn Butt</td><td><b>123</b></td><td>8</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U</td><td>Tail Whip</td><td><b>156</b></td><td>8</td><td>—</td><td class="pos">±0</td><td>+8</td><td>—</td><td class="pu ok">安全</td></tr>
          <tr><td class="cmd">U U U U K</td><td>Brimstone Kick</td><td><b>230</b></td><td>13</td><td>—</td><td class="neg">−32</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (167px)</td></tr>
          <tr><td class="cmd">U U K</td><td>Infernal Tail Lash</td><td><b>178</b></td><td>13</td><td>—</td><td class="neg">−12</td><td>ダウン</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (133px)</td></tr>
          <tr><td class="cmd">U U I</td><td>Hellgate Upper</td><td><b>157</b></td><td>13</td><td>—</td><td class="neg">−12</td><td>打ち上げ</td><td>—</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (126px)</td></tr>
          <tr><td class="cmd">→→+U</td><td>Beast Lunge</td><td><b>59</b></td><td>27</td><td>35</td><td class="neg">−20</td><td>+2</td><td>62</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">→→+I</td><td>Savage Maul</td><td><b>71</b></td><td>27</td><td>37</td><td class="neg">−20</td><td>ダウン</td><td>64</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">→→+J</td><td>Shadow Claw</td><td><b>87</b></td><td>28</td><td>33</td><td class="neg">−20</td><td>打ち上げ</td><td>61</td><td class="pu bad">打ち上げで確定：ライラ・アルドリック・ジェシー・カッパ／Uで確定：メイ・ライラ・アルドリック・ジェシー</td></tr>
          <tr><td class="cmd">→→+K</td><td>Demon Uppercut</td><td><b>87</b></td><td>33</td><td>29</td><td class="neg">−48</td><td>打ち上げ</td><td>62</td><td class="pu ok">不利だが届かない (218px)</td></tr>
          <tr><td class="cmd">←←+U</td><td>Beckon</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>53</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+I</td><td>Angel Possession</td><td><b>—</b></td><td>—</td><td>—</td><td class="">—</td><td>—</td><td>105</td><td class="pu nx">攻撃なし（構え・強化）</td></tr>
          <tr><td class="cmd">←←+J</td><td>Hell Chain</td><td><b>36</b></td><td>30</td><td>23</td><td class="neg">−36</td><td>+19</td><td>53</td><td class="pu mid">リーチの長いUのみ確定：メイ・ライラ・アルドリック・ジェシー (181px)</td></tr>
          <tr><td class="cmd">←←+K</td><td>Soul Drain</td><td><b>90</b></td><td>33</td><td>28</td><td class="">投げ</td><td>ダウン</td><td>61</td><td class="pu tw">ガード不能（投げ）</td></tr>
          <tr><td class="cmd">U+J （超必殺）</td><td>Infernal Contract</td><td><b>41</b></td><td>62</td><td>60</td><td class="neg">−31</td><td>−37</td><td>122</td><td class="pu bad">打ち上げ（↓+I）で確定、フルコンボ（全員）</td></tr>
        </tbody>
      </table></div>
    </article>
`);
