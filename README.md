<p align="center">
  <img src="assets/opening.webp" alt="Shadow ✕ Qi — opening highlights" width="960">
</p>

<h1 align="center">Shadow ✕ Qi</h1>

<p align="center"><b>A 2D fighting game that runs in your browser.</b><br>
Eight fighters · combos & supers · CPU battles · training · real-time online battles · English / 日本語</p>

<p align="center"><a href="https://cn-eveer.github.io/shadow-qi/"><b>▶ Play now</b></a></p>

---

## The fighters

| | Fighter | Style |
|---|---|---|
| 🥷 | **Kuro** — Shadow Ninja | hand signs and spirit beasts, vanishing attacks, kunai juggles |
| 👊 | **Tetsu** — Qi Brawler | qi palms and beams; armor on his heavy techniques |
| 🥢 | **Mei** — Staff Prodigy | long reach with the bo staff, cloud jumps, double jump |
| 🔮 | **Lyra** — Psychic Sage | magic circles and falling crystals from across the screen |
| 🛡️ | **Aldric** — Holy Paladin | Excalibur's aura, shield guard, Rampart Charge with armor |
| 🐸 | **Kappa** — Mythic Kappa | dish water, shell tricks, poison |
| 🤠 | **Jesse** — Gunslinger | quick draw from the holster, charge shots, aimed juggles |
| 💼 | **Tanaka** — Salaryman | office supplies — and angel, devil, or **double** possession |

<p align="center">
  <img src="assets/shot-super.jpg" width="32%"> <img src="assets/shot-double.jpg" width="32%"> <img src="assets/shot-sanctuary.jpg" width="32%">
</p>

## Features

- **Combos and supers** — strings, launchers, juggles, charge attacks and a super for every fighter
- **Readable fights** — technique tells, armor, counters, punish windows, high / low / overhead guarding, visible wake-up invincibility
- **Sample combos and punishes** for every fighter, played out for you to copy
- **CPU battles, training mode** with frame data, and **online battles** (random match or room number)
- An **opening movie** drawn live in the game engine, and entrance / victory poses
- Sharp at any size: the game renders at 2× (or your screen's full resolution)
- **Plays on phones and tablets** — on-screen pad and U I J K buttons (hold the phone sideways); add it to your home screen to play full screen

## Controls (default)

| Move | Keys |
|---|---|
| Walk / jump / crouch | A D / W / S — or the arrow keys (hold back to guard; back + down to guard lows) |
| Light / heavy punch | U / I |
| Light / heavy kick | J / K |
| Techniques | tap forward twice (→ →) or back twice (← ←) + a button; some also have ↑, ↓ or → versions |
| Super | U + J together (when the MP bar is full) |

On a phone: the pad at the bottom left moves you, the 2×2 buttons on the right are U I / J K, and ❚❚ pauses.

All keys can be changed in ⚙ Settings, where each fighter's full move list and frame data are also shown.

## Put it online with GitHub Pages

1. Create a new **public** repository (for example `shadow-qi`).
2. Upload **everything in this folder** — `index.html`, `manifest.webmanifest`, `.nojekyll`, `README.md` and the `css`, `js` and `assets` folders — to the root of the repository (*Add file → Upload files → Commit*).
   Tip: `.nojekyll` starts with a dot, so your computer may hide it; it is fine to skip it if you can't see it.
3. Open **Settings → Pages**, set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, and **Save**.
4. After a minute the game is live at `https://<your-name>.github.io/<repository>/`.

To update later, upload the changed files over the old ones.

## Where things are

| File | What's in it |
|---|---|
| `index.html` | the page itself: header, game screen, training buttons and the settings drawer |
| `js/movelist/*.js` | each fighter's move list, English and Japanese (one file per fighter, plus `controls.js`) |
| `css/style.css` | all styles, including the phone layout and touch controls |
| `js/setup.js` | constants, the skeleton and every pose |
| `js/charge-attacks.js` | held (charged) heavy attacks |
| `js/characters.js` | the eight fighters: stats, colours, move sets |
| `js/moves.js` | every move's timing, hitboxes and effects |
| `js/input-cpu.js` | keyboard input and the CPU opponent |
| `js/demos.js` | sample combos and punishes |
| `js/state.js` | game state and the fighter update |
| `js/hits.js` | hit detection, guarding, damage |
| `js/projectiles.js` | projectiles and special-move helpers |
| `js/strings.js` | each fighter's combo strings |
| `js/particles-rounds.js` | particles and the round flow |
| `js/pose-select.js` | which pose a fighter shows each frame |
| `js/victory.js` | round-win animations (three per fighter, by health left) and match-win celebrations |
| `js/draw-fighters.js` | drawing the fighters |
| `js/draw-effects-hud.js` | drawing effects, the stage and the HUD |
| `js/opening.js` | the render loop and the opening movie (prologue, highlight reel, finale) |
| `js/online.js` | online play (PeerJS / WebRTC) |
| `js/audio.js` | sound effects and music |
| `js/menus.js` | menus, keyboard, settings, touch controls, training move card |

The scripts are plain `<script>` files loaded in this order and share one scope, so there's no build step: open `index.html` and play.

> If your address isn't `cn-eveer.github.io/shadow-qi`, change the two `og:` addresses near the top of `index.html` so link previews show the cover image.

---

<p align="center"><img src="assets/cover.png" width="720" alt="Shadow ✕ Qi — the cast"></p>
