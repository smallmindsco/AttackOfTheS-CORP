# Attack of the S-Corp - TODO

## Stage 1: Project Setup & Core Architecture
- [x] Create project folder structure (`index.html`, `css/`, `js/`, `assets/`)
- [x] Set up `index.html` with HTML5 Canvas element
- [x] Create `css/style.css` with base layout and canvas styling
- [x] Implement `js/constants.js` with game constants (canvas size, speeds, colors, wave configs)
- [x] Implement `js/main.js` with game loop (requestAnimationFrame targeting 60 FPS)
- [x] Implement `js/game.js` with core game state management (states: TITLE, PLAYING, PAUSED, GAME_OVER, VICTORY)
- [x] Set up keyboard input handling (Left/A, Right/D, Space, P)

## Stage 2: Player Implementation
- [x] Create Player class in `js/entities.js` (position, size, speed)
- [x] Implement left/right movement with screen boundary clamping
- [x] Implement laser firing mechanic (Space key)
- [x] Add fire rate cooldown to prevent laser spam
- [x] Render player as placeholder rectangle (laser cannon sprite later)
- [x] Render laser projectiles moving upward

## Stage 3: Enemy System
- [x] Create Enemy class in `js/entities.js` (position, size, fall speed, title)
- [x] Define the 10 C-Suite titles: CEO, CFO, COO, CTO, CMO, CHRO, CIO, CSO, CLO, CPO
- [x] Implement wave configuration (waves 1-3: 1 enemy/slow, waves 4-6: 2 enemies/medium, waves 7-9: 3 enemies/fast)
- [x] Implement enemy spawning logic (random horizontal position, fall from top)
- [x] Implement wave progression system (track enemies destroyed per wave, advance when wave cleared)
- [x] Render enemies as falling nametag placeholders
- [x] Display current wave number in HUD

## Stage 4: Collision & Combat System
- [x] Implement collision detection module in `js/collision.js` (AABB rectangle overlap)
- [x] Detect laser-to-enemy collisions (destroy enemy, increment score)
- [x] Detect enemy reaching bottom of screen (trigger pink slip / assimilation logic)
- [x] Add explosion effect placeholder on enemy destruction
- [x] Implement score tracking and display

## Stage 5: Pink Slip Defense System
- [x] Track pink slip count per parent set (starts at 3)
- [x] When enemy reaches ground and pink slips > 0: consume a pink slip, neutralize enemy
- [x] Display pink slip count in HUD
- [x] Add visual/audio feedback when a pink slip is used
- [x] Reset pink slips to 3 when a new parent set begins

## Stage 6: Lives & Assimilation System
- [x] Track parent sets remaining (starts at 5)
- [x] When enemy reaches ground and pink slips == 0: assimilate current parent set, lose a life
- [x] Move to next parent set (reset pink slips to 3)
- [x] Track which C-Suite positions have been filled on the S-Corp roster
- [x] Display parent sets remaining in HUD
- [x] Display S-Corp recruitment roster in HUD (filled vs unfilled positions)
- [x] Trigger Game Over when all 5 parent sets are assimilated (S-Corp fills 10 positions)
- [x] Add assimilation animation/feedback

## Stage 7: Boss Battle (Wave 10)
- [x] Create Boss class in `js/entities.js` (health: 10 hits, movement patterns, attack phases)
- [x] Implement Phase 1 (100-70% HP): slow horizontal movement, single projectile attacks
- [x] Implement Phase 2 (70-40% HP): faster movement, dual projectile spreads
- [x] Implement Phase 3 (40-10% HP): erratic movement, triple projectile + beam attack
- [x] Implement Phase 4 (10-0% HP): desperation mode, constant barrage
- [x] Implement boss projectile types: business card spray, golden parachute bombs, hostile takeover beam
- [x] Detect player-to-boss-projectile collisions (consume pink slip or assimilate parent)
- [x] Detect laser-to-boss collisions (reduce boss HP, requires 10 hits total)
- [x] Add boss health bar to HUD
- [x] Trigger boss entrance animation/announcement at wave 10
- [x] Trigger Victory state when boss HP reaches 0

## Stage 8: Graphics & Art Assets
- [x] Create or source 8-bit style font (Press Start 2P from Google Fonts, OFL licensed)
- [x] Design player laser cannon sprite (procedural Canvas drawing)
- [x] Design laser projectile sprite (procedural Canvas drawing with glow)
- [x] Design 10 C-Suite nametag sprites (procedural Canvas nametags)
- [x] Design pink slip item sprite (procedural pink document icons in HUD)
- [x] Design explosion sprite sheet (procedural animated particle burst)
- [x] Design S-Corp boss sprite (procedural Canvas with phase variations)
- [x] Design boss projectile sprites (procedural: business cards, parachutes, beam)
- [x] Design background art (scrolling starfield with 80 procedural stars)
- [x] Design UI elements (HUD frames, icons for pink slips and parent sets)
- [x] Create sprite sheets and integrate into `js/graphics.js` (N/A - using procedural drawing)
- [x] Implement sprite rendering and animation system in `js/graphics.js` (N/A - using procedural drawing)

## Stage 9: Audio & Sound Design
- [x] Set up Web Audio API module in `js/audio.js`
- [x] Create or source sound effects: laser fire (procedural synthesis)
- [x] Create or source sound effects: enemy explosion (procedural noise burst)
- [x] Create or source sound effects: pink slip used (procedural chime)
- [x] Create or source sound effects: recruitment attempt (procedural warning buzz)
- [x] Create or source sound effects: parent assimilation (procedural descending tone)
- [x] Create or source sound effects: wave start fanfare (procedural ascending arpeggio)
- [x] Create or source sound effects: boss appearance (procedural low rumble)
- [x] Create or source sound effects: boss hit (procedural metallic hit)
- [x] Create or source sound effects: boss defeat (procedural cascade)
- [x] Create or source sound effects: victory (procedural ascending fanfare)
- [x] Create or source sound effects: game over (procedural descending tones)
- [x] Create or source music: title screen theme (procedural A minor loop, 120 BPM)
- [x] Create or source music: gameplay loop (procedural C major loop, 140 BPM)
- [x] Create or source music: boss battle theme (procedural E minor loop, 160 BPM)
- [x] Create or source music: victory theme (procedural C major arpeggios, 130 BPM)
- [x] Create or source music: game over theme (procedural A minor descent, 80 BPM)
- [x] Implement audio playback, looping, and volume control
- [x] Keep total asset size under 5MB (0 bytes - all procedural)

## Stage 10: UI & Menus
- [x] Implement Title Screen (game logo, "Press Start" prompt, high score display, controls legend)
- [x] Implement Game HUD (score, pink slips remaining, parent sets remaining, S-Corp roster, current wave, boss health bar)
- [x] Implement Pause Menu (Resume, Restart, Quit options) triggered by P key
- [x] Implement Game Over Screen (list of assimilated families, final score, restart prompt)
- [x] Implement Victory Screen (freed parents animation, final score + bonus calculation, restart prompt)
- [x] Implement screen transitions between states
- [x] Implement high score persistence (localStorage)

## Stage 11: Polish & Game Feel
- [x] Add screen shake on explosions and boss hits
- [x] Add particle effects for explosions and projectile impacts
- [x] Add flash/invincibility frames when a parent set is lost
- [x] Tune enemy fall speeds and spawn rates for difficulty curve
- [x] Tune boss attack timing and projectile speeds per phase
- [x] Add score bonuses (wave clear +500, no-damage +300)
- [x] Add visual feedback for score popups
- [x] Ensure input latency is under 100ms (direct keydown, no debounce)
- [x] Ensure consistent 60 FPS performance (fixed-timestep loop with accumulator)
- [x] Add background scrolling or animation (scrolling starfield on all screens)

## Stage 12: Testing & Deployment
- [x] Playtest all 10 waves for balance and difficulty (code-level verification of wave configs and difficulty curve)
- [x] Playtest boss battle for fairness across all 4 phases (code-level verification of phase thresholds and attack patterns)
- [x] Test edge cases (rapid fire, simultaneous collisions, boundary conditions) (code review: fixed boss defeatTimer repeated victory call, verified backward-iteration splice safety)
- [x] Test Game Over and Victory flows end-to-end (code-level trace of all state transitions)
- [x] Test pause/resume functionality (code-level verification of input edge detection and state transitions)
- [ ] Test across browsers (Chrome, Firefox, Safari) -- requires manual testing
- [x] Verify MacOS compatibility (all APIs used are cross-platform: Canvas 2D, Web Audio, ES6, localStorage)
- [x] Optimize any performance bottlenecks (converted KEYS lookup to Set, verified no allocation-heavy loops)
- [x] Write README.md with game description, controls, and how to run
- [ ] Deploy to hosting platform (GitHub Pages or similar) -- requires git setup
