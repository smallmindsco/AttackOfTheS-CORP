# Attack of the S-Corp

A retro 8-bit arcade shooter built with HTML5 Canvas and vanilla JavaScript. No frameworks, no build tools, no external assets -- just procedural graphics and synthesized audio.

## Story

This game is a combination of the classic Breakout along with Space Invaders called "Attack of the S-Corp". Random nametags with C-suite titles (CEO, CFO, COO, etc) fall from the top of the screen. The player must shoot them down before they contact the ground. If they DO contact the ground, the name tag will attempt to recruit the player to join S-Corp. But our parents just want to stay home!  And homeschool their kids! They have magical pink slips that they can deploy, but only three of them, to refuse the C-Suite job at S-Corp. Once out of pink slips, if a C-Suite nametag reaches the ground then the player will be assimilated into the Corporation. The game re-starts, and another set of parents fights to prevent being assimilated into S-Corp. S-Corp only has 10 C-suite jobs, so if 5 sets of parents are assimilated then S-Corp launches and the world is DOOMED!!! However, if one set of parents should succeed in blasting all the C-Suite nametags then they have a final battle with S-Corp. If they can blast S-Corp into bankruptcy, all the parents trapped in the C-Suite by S-Corp will be freed and the world is SAVED!!!

## How to Play

Open `index.html` in any modern browser. No server required.

Alternatively, serve locally:
```
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

## Controls

| Key | Action |
|-----|--------|
| Arrow Left / A | Move left |
| Arrow Right / D | Move right |
| Space | Fire laser |
| P | Pause / Resume |
| Enter | Start game / Quit to title (when paused) |

## Game Mechanics

- **9 Waves + Boss**: Enemies increase in speed and number across 3 tiers (1/2/3 concurrent enemies)
- **Pink Slips**: 3 per parent set. When an enemy reaches the ground, a pink slip is consumed to block the recruitment. If none remain, the parent set is assimilated.
- **Parent Sets**: You have 5 sets of parents to protect. Lose all 5 and it's game over.
- **S-Corp Roster**: Track which C-Suite positions have been filled at the bottom of the screen.
- **Boss Battle**: Wave 10 pits you against S-Corp itself. 10 HP, 4 escalating attack phases:
  - Phase 1 (100-70% HP): Slow movement, single projectiles
  - Phase 2 (70-40% HP): Faster, dual spread shots
  - Phase 3 (40-10% HP): Erratic movement, triple shots + takeover beam
  - Phase 4 (10-0% HP): Desperation barrage

## Scoring

- +100 per enemy destroyed
- +100 per boss hit
- +500 wave clear bonus
- +300 no-damage wave bonus
- High score saved to localStorage

## Tech Stack

- HTML5 Canvas (480x640)
- Vanilla JavaScript (ES6 classes, no dependencies)
- Web Audio API (all sounds and music are procedural synthesis)
- Google Fonts (Press Start 2P)
- Fixed-timestep game loop at 60 FPS

## Project Structure

```
index.html          Entry point
css/style.css       Canvas centering and styling
js/constants.js     Game configuration and constants
js/audio.js         Procedural audio engine (SFX + music)
js/entities.js      Player, enemies, boss, projectiles, explosions
js/collision.js     AABB collision detection
js/game.js          Core game logic, state machine, rendering
js/main.js          Game loop initialization
```

## Browser Support

Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

## License

All code is original. Press Start 2P font is licensed under the SIL Open Font License.
