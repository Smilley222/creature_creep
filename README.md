# Creature Creep

Mobile-friendly creature-catching RPG browser prototype.

## Play locally

Download this repository as a ZIP, extract it, and open `index.html` in a modern browser. Alternatively, run `python3 -m http.server 8000` in the project folder and visit `http://localhost:8000`.

Tap a walkable tile to move. Use the party, CreepDex, and battle buttons in the game. Progress is stored in this browser's local storage; it does not automatically sync between devices, browsers, or file locations.

## Project status

- `index.html`: V5 prototype plus the first V6 milestone: lead follower and Rootcall crossing.
- `docs/V5_README.txt`: original prototype instructions.
- `docs/CREATURE_CREEP_SPECIES_REGISTRY.md`: broader V6 design draft; only the follower and first Rootcall obstacle are implemented so far.

The existing browser-tab title and V5 header are retained; this is an incremental prototype update, not the full V6 design.

## Follower and Rootcall

Your selected party leader follows one tile behind you. Capture Thornback in tall grass, open Party, and make it the leader. Its evolutions can also use Rootcall.

Walk to the west bank of the pond (tile 14, 8), beside the visible roots. Press **Rootcall** to grow a crossing, then tap the flower glade across the pond. Discovering it grants three Creep Cores once.

The crossing and discovery are saved automatically. Existing V5 saves and control settings keep their original storage keys; older saves start with the crossing closed. The follower is visual only and does not block movement or trigger encounters.

## Regression checks

With Playwright available, serve the project locally and run:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
# In another terminal:
node tests/rootcall.cjs
```

The browser check covers desktop and 390px touch viewports: old saves, custom controls, capture and lead selection, follower movement, blocked routes, field action guards, Rootcall, tap navigation, one-time rewards, and reload persistence. Set `GAME_URL` to use another local server or `CHROME_PATH` to use an existing Chromium executable.

Manual device check: complete the same loop on a phone, try optional D-pad and keyboard movement, switch leaders, battle, then reload and verify progress.

## Development

Keep changes small and reviewable. Preserve existing saves and controls. Use branches and pull requests for future changes; request Geo's approval before merges or releases. Do not commit credentials or personal save files.

## Validation

Inline JavaScript syntax and the focused desktop/touch browser regression checks pass. Physical-device testing and a full gameplay/balance pass remain outstanding. Repository setup does not publish a hosted game or enable GitHub Pages.

