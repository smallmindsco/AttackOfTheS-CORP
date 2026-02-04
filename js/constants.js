// ============================================================
// Attack of the S-Corp - Game Constants & Configuration
// ============================================================

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

// Font (Press Start 2P from Google Fonts, falls back to monospace)
const FONT = '"Press Start 2P", monospace';

// Colors (8-bit palette)
const COLORS = {
    PRIMARY:    '#FF6B6B', // Coral Red
    SECONDARY:  '#4ECDC4', // Teal
    ACCENT:     '#FFE66D', // Yellow
    PINK_SLIP:  '#FF69B4', // Hot Pink
    DARK:       '#2C3E50', // Navy
    BG:         '#0f0f23', // Deep blue-black
    WHITE:      '#FFFFFF',
    TEXT:       '#EEEEFF',
    HUD_BG:     'rgba(44, 62, 80, 0.7)',
};

// Game states
const STATE = {
    TITLE:     'TITLE',
    PLAYING:   'PLAYING',
    PAUSED:    'PAUSED',
    GAME_OVER: 'GAME_OVER',
    VICTORY:   'VICTORY',
};

// Player constants
const PLAYER = {
    WIDTH:       48,
    HEIGHT:      32,
    SPEED:       15,
    Y_OFFSET:    60,  // Distance from bottom of canvas
    FIRE_COOLDOWN: 5, // Frames between shots (~83ms at 60fps)
};

// Laser constants
const LASER = {
    WIDTH:  4,
    HEIGHT: 14,
    SPEED:  21,
    COLOR:  '#FF6B6B',
};

// Enemy constants
const ENEMY = {
    WIDTH:  64,
    HEIGHT: 28,
};

// C-Suite titles (10 positions to fill)
const CSUITE_TITLES = [
    'CEO', 'CFO', 'COO', 'CTO', 'CMO',
    'CHRO', 'CIO', 'CSO', 'CLO', 'CPO',
];

// Wave configuration
// Each wave defines: max concurrent enemies, fall speed, enemies to clear, spawn interval (frames)
const WAVE_CONFIG = [
    // Waves 1-3: 1 enemy at a time, slow, generous spawn gaps
    { maxConcurrent: 1, fallSpeed: 3.0, enemiesToClear: 5,  spawnInterval: 30 },
    { maxConcurrent: 1, fallSpeed: 3.6, enemiesToClear: 6,  spawnInterval: 27 },
    { maxConcurrent: 1, fallSpeed: 4.5, enemiesToClear: 7,  spawnInterval: 25 },
    // Waves 4-6: 2 enemies at a time, medium, tighter spawns
    { maxConcurrent: 2, fallSpeed: 5.4, enemiesToClear: 8,  spawnInterval: 22 },
    { maxConcurrent: 2, fallSpeed: 6.3, enemiesToClear: 9,  spawnInterval: 19 },
    { maxConcurrent: 2, fallSpeed: 7.2, enemiesToClear: 10, spawnInterval: 17 },
    // Waves 7-9: 3 enemies at a time, fast, relentless spawns
    { maxConcurrent: 3, fallSpeed: 8.4,  enemiesToClear: 11, spawnInterval: 15 },
    { maxConcurrent: 3, fallSpeed: 9.6,  enemiesToClear: 12, spawnInterval: 13 },
    { maxConcurrent: 3, fallSpeed: 10.8, enemiesToClear: 13, spawnInterval: 11 },
];

// Boss constants (Wave 10)
const BOSS = {
    WIDTH:       120,
    HEIGHT:      80,
    MAX_HP:      10,
    PHASES: [
        { hpThreshold: 0.70, speed: 3.0, attackPattern: 'single',  cooldownMult: 0.33 },
        { hpThreshold: 0.40, speed: 5.4, attackPattern: 'dual',    cooldownMult: 0.25 },
        { hpThreshold: 0.10, speed: 7.5, attackPattern: 'triple',  cooldownMult: 0.18 },
        { hpThreshold: 0.00, speed: 9.0, attackPattern: 'barrage', cooldownMult: 0.10 },
    ],
};

// Game rules
const RULES = {
    PINK_SLIPS_PER_SET: 3,
    TOTAL_PARENT_SETS:  5,
    TOTAL_WAVES:        9,  // 9 regular waves + boss
    SCORE_PER_ENEMY:    100,
};

// Input key codes
const KEYS = {
    LEFT:   'ArrowLeft',
    RIGHT:  'ArrowRight',
    A:      'KeyA',
    D:      'KeyD',
    SPACE:  'Space',
    PAUSE:  'KeyP',
    ENTER:  'Enter',
};
