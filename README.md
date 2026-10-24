# Shadow ✕ Qi

A 2D browser fighting game with four fighters, CPU battles, training, sample combos and **real-time online battles** (random match or room number). English and Japanese.

## Put it online with GitHub Pages

1. Create a new **public** repository on GitHub (for example `shadow-qi`).
2. Upload `index.html`, `.nojekyll` and this `README.md` to the root of the repository (Add file → Upload files → Commit).
3. Open **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, then **Save**.
4. After a minute the game is live at `https://<your-username>.github.io/<repository-name>/`.

Share that link. Both players open it, choose **Online**, enter a username and either press **Random match** or use the same **room number**.

## How online play works

- No server of your own is needed. Players find each other through the free public PeerJS signalling server, then the match runs directly between the two browsers over WebRTC.
- Both games run the same simulation in lockstep: each player's buttons are sent a few frames ahead (the input delay is picked from the measured ping), so both screens stay identical.
- The host (the player who created the room, or who was waiting in random match) plays on the left.

## Limits

- Some strict networks (certain office, school or mobile-carrier networks) block direct browser-to-browser connections. If two players can't connect, try another network; a TURN relay server would be needed to support those networks.
- The public PeerJS server is a free shared service, so matchmaking can occasionally be slow or unavailable.
- Keyboard required.
