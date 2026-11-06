# Creature Creep

Mobile-friendly creature-catching RPG browser prototype.

## Play locally

Download this repository as a ZIP, extract it, and open `index.html` in a modern browser. Alternatively, run `python3 -m http.server 8000` in the project folder and visit `http://localhost:8000`.

Tap a walkable tile to move. Use the party, CreepDex, and battle buttons in the game. Progress is stored in this browser's local storage; it does not automatically sync between devices, browsers, or file locations.

## Project status

- `index.html`: original V5 Tap-to-Move prototype, imported without gameplay changes.
- `docs/V5_README.txt`: original prototype instructions.
- `docs/CREATURE_CREEP_SPECIES_REGISTRY.md`: V6 design draft, not a claim of implemented features.

The imported HTML still has a V4 browser-tab title while its visible game header says V5. This is an existing cosmetic inconsistency preserved during import.

## Development

Keep changes small and reviewable. Preserve existing saves and controls. Use branches and pull requests for future changes; request Geo's approval before merges or releases. Do not commit credentials or personal save files.

## Validation

The imported inline JavaScript passes `node --check`. Gameplay and device testing remain required. Repository setup does not publish a hosted game or enable GitHub Pages.
