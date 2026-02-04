# Attack of the S-Corp
## Development Plan

---

## 🎮 Game Overview

**Genre:** Arcade Shooter (Space Invaders meets Breakout)  
**Style:** 8-bit Retro  
**Platform:** Web Browser (HTML5 Canvas + JavaScript)  
**Target:** MacOS compatible via any modern browser

### Story Synopsis
Parents across the world are being targeted by the nefarious S-Corp, whose C-Suite executives rain down from the sky attempting to recruit unwitting citizens into corporate servitude. Armed with a laser cannon and three magical pink slips, players must blast the falling executive nametags before they reach the ground. Should S-Corp fill all 10 of its C-Suite positions by assimilating 5 sets of parents, the world is DOOMED. But if one brave set of parents can destroy all the executives and bankrupt S-Corp in a final showdown, the world—and all the trapped parents—will be SAVED!

---

## 📋 Development Stages

### **STAGE 1: Project Setup & Core Architecture**
**Duration:** 1 day

#### Tasks:
- [ ] Create project folder structure
- [ ] Set up HTML5 canvas boilerplate
- [ ] Implement game loop (60 FPS target)
- [ ] Create basic state machine (Menu → Playing → GameOver → Victory)
- [ ] Set up input handling (keyboard controls)

#### File Structure:
```
attack-of-the-scorp/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js           # Entry point & game loop
│   ├── game.js           # Core game logic
│   ├── entities.js       # Player, enemies, projectiles
│   ├── collision.js      # Collision detection
│   ├── graphics.js       # Rendering & sprite handling
│   ├── audio.js          # Sound effects & music
│   └── constants.js      # Game constants & config
├── assets/
│   ├── sprites/          # PNG sprite sheets
│   ├── sounds/           # WAV/MP3 sound effects
│   └── fonts/            # 8-bit style fonts
└── README.md
```

#### Deliverables:
- Blank canvas rendering at 800x600
- Game loop running at consistent framerate
- Console logging state transitions

---

### **STAGE 2: Player Implementation**
**Duration:** 1 day

#### Tasks:
- [ ] Create Player class
- [ ] Implement horizontal movement (arrow keys / A-D)
- [ ] Add movement boundaries (screen edges)
- [ ] Implement shooting mechanic (spacebar)
- [ ] Add shot cooldown (prevent spam)
- [ ] Create projectile class with upward movement

#### Game Mechanics:
| Control | Action |
|---------|--------|
| ← / A | Move left |
| → / D | Move right |
| Space | Fire laser |
| P | Pause game |

#### Deliverables:
- Player ship moves smoothly left/right
- Projectiles fire upward and despawn off-screen
- Basic placeholder graphics (colored rectangles)

---

### **STAGE 3: Enemy System (C-Suite Nametags)**
**Duration:** 2 days

#### Tasks:
- [ ] Create Enemy class (falling nametags)
- [ ] Implement C-Suite title pool:
  - CEO (Chief Executive Officer)
  - CFO (Chief Financial Officer)
  - COO (Chief Operating Officer)
  - CTO (Chief Technology Officer)
  - CMO (Chief Marketing Officer)
  - CHRO (Chief Human Resources Officer)
  - CIO (Chief Information Officer)
  - CSO (Chief Security Officer)
  - CLO (Chief Legal Officer)
  - CPO (Chief Product Officer)
- [ ] Random name generator for nametags
- [ ] Spawn system with increasing difficulty
- [ ] Variable fall speeds based on difficulty/wave
- [ ] Enemy reaches ground detection

#### Spawn Logic:
```
Wave 1-3:   1 enemy at a time, slow fall speed
Wave 4-6:   2 enemies at a time, medium fall speed
Wave 7-9:   3 enemies at a time, fast fall speed
Wave 10:    Boss wave (S-Corp itself)
```

#### Deliverables:
- Nametags spawn and fall from random X positions
- Each nametag displays title + random name
- Enemies despawn when reaching ground (trigger recruitment)

---

### **STAGE 4: Collision & Combat System**
**Duration:** 1 day

#### Tasks:
- [ ] Implement AABB collision detection
- [ ] Projectile ↔ Enemy collision (destroy both)
- [ ] Enemy ↔ Ground collision (recruitment trigger)
- [ ] Add score system (+100 per executive destroyed)
- [ ] Combo multiplier for rapid kills
- [ ] Visual feedback (flash/explosion on hit)

#### Collision Responses:
| Collision | Result |
|-----------|--------|
| Laser → Nametag | Destroy nametag, +100 points, explosion effect |
| Nametag → Ground | Recruitment attempt, use pink slip or assimilate |
| Nametag → Player | Instant recruitment attempt |

#### Deliverables:
- Accurate hit detection
- Score tracking and display
- Basic particle effects for destruction

---

### **STAGE 5: Pink Slip Defense System**
**Duration:** 1 day

#### Tasks:
- [ ] Implement pink slip inventory (starts at 3)
- [ ] Create recruitment popup/animation when enemy lands
- [ ] Auto-use pink slip if available
- [ ] Pink slip depleted warning
- [ ] Assimilation sequence when no pink slips remain
- [ ] UI display for remaining pink slips

#### Recruitment Flow:
```
Enemy reaches ground
    ↓
[Pink slips > 0?]
    ├── YES → Use pink slip, display "RECRUITMENT REFUSED!", continue
    └── NO  → Assimilation! Next parents or Game Over
```

#### Deliverables:
- Pink slip counter visible on HUD
- Dramatic "recruitment attempt" animation
- Clear feedback when pink slip is used

---

### **STAGE 6: Lives & Assimilation System**
**Duration:** 1 day

#### Tasks:
- [ ] Implement parent counter (5 sets total)
- [ ] Assimilation animation sequence
- [ ] S-Corp roster display (shows assimilated parents)
- [ ] Reset player state for new parents
- [ ] Maintain wave progress across lives
- [ ] Game Over trigger when 5 parents assimilated

#### Parent Names (Random Selection):
```
The Johnsons, The Smiths, The Garcias, The Williamses,
The Browns, The Joneses, The Millers, The Davises,
The Rodriguezes, The Martinezes, The Hernandezes, The Lopezes,
The Gonzalezes, The Wilsons, The Andersons, The Thomases
```

#### Deliverables:
- Smooth transition between parent sets
- S-Corp recruitment counter (X/5 positions filled)
- Appropriate game over screen

---

### **STAGE 7: Boss Battle (S-Corp Showdown)**
**Duration:** 2 days

#### Tasks:
- [ ] Create S-Corp boss entity
- [ ] Design boss attack patterns:
  - Pattern 1: Spray of business cards
  - Pattern 2: Golden parachute bombs
  - Pattern 3: Hostile takeover beam
- [ ] Implement boss health bar (10 hits to destroy)
- [ ] Phase transitions at health thresholds
- [ ] Victory sequence when boss defeated
- [ ] "World Saved" ending with freed parents

#### Boss Phases:
| Health | Behavior |
|--------|----------|
| 100-70% | Slow movement, single projectile attacks |
| 70-40% | Faster, dual projectile spreads |
| 40-10% | Erratic, triple projectile + beam attack |
| 10-0% | Desperation mode, constant barrage |

#### Deliverables:
- Epic boss fight with distinct phases
- Challenging but fair difficulty
- Satisfying victory celebration

---

### **STAGE 8: Graphics & Art Assets**
**Duration:** 2-3 days

#### Sprite List:

**Player Assets:**
- [ ] Parent defender ship (32x32 px) - 2 frame idle animation
- [ ] Laser projectile (8x16 px)
- [ ] Pink slip item (16x16 px)
- [ ] Ship explosion (32x32 px) - 4 frame animation

**Enemy Assets:**
- [ ] Nametag base (64x24 px) - multiple color variants
- [ ] Nametag destruction (64x24 px) - 4 frame animation
- [ ] S-Corp logo (for UI)

**Boss Assets:**
- [ ] S-Corp building/logo (128x128 px)
- [ ] Business card projectile (16x8 px)
- [ ] Golden parachute bomb (24x24 px)
- [ ] Hostile takeover beam (16x variable height)
- [ ] Boss damage states (3 variants)
- [ ] Boss explosion (128x128 px) - 8 frame animation

**UI Assets:**
- [ ] HUD frame/background
- [ ] Pink slip icon
- [ ] Parent/life icon
- [ ] Score display frame
- [ ] 8-bit font (or use existing like "Press Start 2P")

**Backgrounds:**
- [ ] Starfield/suburban sky background (parallax layers)
- [ ] Ground/neighborhood silhouette
- [ ] Boss arena background

#### Color Palette (8-bit compliant):
```
Primary:    #FF6B6B (Coral Red)
Secondary:  #4ECDC4 (Teal)
Accent:     #FFE66D (Yellow)
Dark:       #2C3E50 (Navy)
Light:      #F7F7F7 (Off-white)
Corporate:  #95A5A6 (Grey)
Evil:       #8E44AD (Purple)
Pink Slip:  #FF69B4 (Hot Pink)
```

---

### **STAGE 9: Audio & Sound Design**
**Duration:** 1-2 days

#### Sound Effects:
- [ ] Laser fire (pew pew!)
- [ ] Enemy destroyed (explosion)
- [ ] Pink slip used (paper swoosh + stamp)
- [ ] Recruitment attempt (ominous chord)
- [ ] Assimilation (sad trombone + corporate jingle)
- [ ] New wave start (alert sound)
- [ ] Boss appearance (dramatic sting)
- [ ] Boss hit (metallic clang)
- [ ] Boss defeated (massive explosion + cheers)
- [ ] Victory fanfare
- [ ] Game over dirge

#### Music:
- [ ] Title screen theme (upbeat 8-bit)
- [ ] Gameplay loop (tense, driving rhythm)
- [ ] Boss battle theme (intense, faster tempo)
- [ ] Victory theme (triumphant)
- [ ] Game over theme (somber)

#### Tools for 8-bit Audio:
- **Bfxr** - Retro sound effect generator
- **Bosca Ceoil** - 8-bit music composer
- **FamiTracker** - NES-style music tracker

---

### **STAGE 10: UI & Menus**
**Duration:** 1 day

#### Screens:
- [ ] **Title Screen**
  - Game logo
  - "Press SPACE to Start"
  - High score display
  - Controls help

- [ ] **Game HUD**
  - Score (top left)
  - Pink slips remaining (top center, with icons)
  - Parents remaining (top right)
  - S-Corp roster (bottom, shows filled positions)
  - Wave indicator
  - Boss health bar (when applicable)

- [ ] **Pause Menu**
  - "PAUSED"
  - Resume / Restart / Quit options

- [ ] **Game Over Screen**
  - "S-CORP WINS - THE WORLD IS DOOMED!"
  - List of assimilated parent families
  - Final score
  - "Press SPACE to Try Again"

- [ ] **Victory Screen**
  - "S-CORP BANKRUPT - THE WORLD IS SAVED!"
  - Freed parents animation
  - Final score + bonus points
  - "Press SPACE to Play Again"

---

### **STAGE 11: Polish & Game Feel**
**Duration:** 2 days

#### Tasks:
- [ ] Screen shake on explosions
- [ ] Particle effects (sparks, confetti)
- [ ] Smooth camera/viewport handling
- [ ] Difficulty balancing pass
- [ ] Input buffering for responsive controls
- [ ] Pause functionality
- [ ] Mute/volume controls
- [ ] Fullscreen toggle
- [ ] Mobile touch controls (bonus)

#### Juice Elements:
- Flash white on enemy hit
- Squash/stretch on player movement
- Trailing particles on projectiles
- Pulsing UI elements
- Screen transitions (fade/wipe)

---

### **STAGE 12: Testing & Deployment**
**Duration:** 1-2 days

#### Testing Checklist:
- [ ] All collision detection accurate
- [ ] No memory leaks (entity cleanup)
- [ ] Consistent framerate
- [ ] All game states reachable
- [ ] Win condition achievable
- [ ] Lose condition triggers properly
- [ ] Audio plays correctly
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] MacOS Safari compatibility verified

#### Deployment:
- [ ] Minify JavaScript
- [ ] Optimize assets (compress images/audio)
- [ ] Create itch.io page (optional)
- [ ] Host on GitHub Pages (free)
- [ ] Write README with instructions

---

## 📅 Timeline Summary

| Stage | Description | Duration |
|-------|-------------|----------|
| 1 | Project Setup | 1 day |
| 2 | Player Implementation | 1 day |
| 3 | Enemy System | 2 days |
| 4 | Collision & Combat | 1 day |
| 5 | Pink Slip System | 1 day |
| 6 | Lives & Assimilation | 1 day |
| 7 | Boss Battle | 2 days |
| 8 | Graphics & Art | 2-3 days |
| 9 | Audio & Sound | 1-2 days |
| 10 | UI & Menus | 1 day |
| 11 | Polish | 2 days |
| 12 | Testing & Deploy | 1-2 days |

**Total Estimated Time: 16-20 days**

---

## 🛠 Technical Specifications

### Technology Stack:
- **Language:** JavaScript (ES6+)
- **Rendering:** HTML5 Canvas 2D Context
- **Audio:** Web Audio API
- **Build:** Vanilla (no framework required)
- **Optional:** Webpack for bundling

### Performance Targets:
- 60 FPS on modern browsers
- < 5MB total asset size
- < 100ms input latency
- Works offline (after initial load)

### Browser Support:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## 🎯 Minimum Viable Product (MVP)

For a quick playable prototype, prioritize:

1. ✅ Player movement and shooting
2. ✅ Falling nametag enemies
3. ✅ Basic collision detection
4. ✅ Pink slip counter
5. ✅ Parent lives system
6. ✅ Win/lose conditions
7. ✅ Placeholder graphics (colored shapes)
8. ✅ Basic sound effects

**MVP Timeline: 5-7 days**

---

## 💡 Future Enhancements (Post-Launch)

- Power-ups (rapid fire, shield, bonus pink slips)
- Multiple weapon types
- Local high score leaderboard
- Online leaderboard integration
- Additional enemy types (middle management?)
- Endless mode
- Two-player co-op
- Mobile app version (Capacitor/Cordova)
- Steam release with achievements

---

## 📚 Resources

### Tutorials:
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Game Loop Patterns](https://gameprogrammingpatterns.com/game-loop.html)

### Assets:
- [OpenGameArt](https://opengameart.org/) - Free game assets
- [Kenney Assets](https://kenney.nl/) - Free game assets
- [Google Fonts - Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)

### Tools:
- [Aseprite](https://www.aseprite.org/) - Pixel art editor
- [Piskel](https://www.piskelapp.com/) - Free online pixel editor
- [Bfxr](https://www.bfxr.net/) - Retro sound effects

---

*"The only thing necessary for the triumph of S-Corp is for good parents to do nothing."*

**Now go save those families! 🎮**
