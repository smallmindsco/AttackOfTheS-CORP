// ============================================================
// Attack of the S-Corp - Core Game Logic & State Management
// ============================================================

const GAME_KEY_SET = new Set(Object.values(KEYS));

class Input {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        this._previousKeys = {};

        window.addEventListener('keydown', (e) => {
            // Prevent default for game keys (scrolling, etc.)
            if (GAME_KEY_SET.has(e.code)) {
                e.preventDefault();
            }
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    // Call once per frame, after processing input
    update() {
        for (const code in this.keys) {
            this.justPressed[code] =
                this.keys[code] && !this._previousKeys[code];
        }
        this._previousKeys = { ...this.keys };
    }

    isDown(code) {
        return !!this.keys[code];
    }

    isJustPressed(code) {
        return !!this.justPressed[code];
    }

    // Convenience: is move-left held?
    get left() {
        return this.isDown(KEYS.LEFT) || this.isDown(KEYS.A);
    }

    // Convenience: is move-right held?
    get right() {
        return this.isDown(KEYS.RIGHT) || this.isDown(KEYS.D);
    }

    // Convenience: is fire held?
    get fire() {
        return this.isDown(KEYS.SPACE);
    }

    // Convenience: was pause just pressed?
    get pausePressed() {
        return this.isJustPressed(KEYS.PAUSE);
    }

    // Convenience: was enter/start just pressed?
    get startPressed() {
        return this.isJustPressed(KEYS.ENTER) || this.isJustPressed(KEYS.SPACE);
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;

        this.input = new Input();
        this.state = STATE.TITLE;

        // Game data
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('scorp_highscore')) || 0;
        this.wave = 0;           // 0-indexed into WAVE_CONFIG
        this.enemiesCleared = 0; // enemies destroyed in current wave

        this.pinkSlips = RULES.PINK_SLIPS_PER_SET;
        this.parentSetsRemaining = RULES.TOTAL_PARENT_SETS;
        this.filledPositions = []; // C-Suite titles that have been filled

        // Entities
        this.player = new Player();
        this.lasers = [];
        this.enemies = [];
        this.bossProjectiles = [];
        this.boss = null;
        this.explosions = [];

        // Spawn timer for enemies
        this.spawnTimer = 0;

        // Wave transition
        this.waveTransitionTimer = 0;
        this.waveTransitionDuration = 120; // 2 seconds at 60fps

        // Screen effects
        this.screenShake = 0;
        this.screenFlashColor = null;
        this.screenFlashTimer = 0;
        this.textPopups = []; // { text, x, y, timer, color }

        // Starfield background
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                speed: 0.2 + Math.random() * 0.8,
                size: Math.random() < 0.3 ? 2 : 1,
                brightness: 0.3 + Math.random() * 0.7,
            });
        }

        // Wave clear bonus tracking
        this.waveDamageTaken = false;
    }

    reset() {
        this.score = 0;
        this.wave = 0;
        this.enemiesCleared = 0;
        this.pinkSlips = RULES.PINK_SLIPS_PER_SET;
        this.parentSetsRemaining = RULES.TOTAL_PARENT_SETS;
        this.filledPositions = [];
        this.lasers = [];
        this.enemies = [];
        this.bossProjectiles = [];
        this.boss = null;
        this.explosions = [];
        this.spawnTimer = 0;
        this.waveTransitionTimer = 0;
        this.screenShake = 0;
        this.screenFlashColor = null;
        this.screenFlashTimer = 0;
        this.textPopups = [];
        this.waveDamageTaken = false;
        this.state = STATE.PLAYING;

        // Reset player position
        this.player = new Player();
    }

    update() {
        this.input.update();

        switch (this.state) {
            case STATE.TITLE:
                this.updateTitle();
                break;
            case STATE.PLAYING:
                this.updatePlaying();
                break;
            case STATE.PAUSED:
                this.updatePaused();
                break;
            case STATE.GAME_OVER:
                this.updateGameOver();
                break;
            case STATE.VICTORY:
                this.updateVictory();
                break;
        }
    }

    draw() {
        const ctx = this.ctx;

        // Apply screen shake
        ctx.save();
        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            ctx.translate(shakeX, shakeY);
            this.screenShake *= 0.85;
            if (this.screenShake < 0.5) this.screenShake = 0;
        }

        // Clear canvas
        ctx.fillStyle = COLORS.BG;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        switch (this.state) {
            case STATE.TITLE:
                this.drawTitle();
                break;
            case STATE.PLAYING:
                this.drawPlaying();
                break;
            case STATE.PAUSED:
                this.drawPlaying(); // Draw game underneath
                this.drawPauseOverlay();
                break;
            case STATE.GAME_OVER:
                this.drawGameOver();
                break;
            case STATE.VICTORY:
                this.drawVictory();
                break;
        }

        // Screen flash overlay
        if (this.screenFlashTimer > 0) {
            const alpha = this.screenFlashTimer / 15 * 0.4;
            ctx.fillStyle = this.screenFlashColor || COLORS.WHITE;
            ctx.globalAlpha = alpha;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.globalAlpha = 1;
            this.screenFlashTimer--;
        }

        // Text popups
        for (let i = this.textPopups.length - 1; i >= 0; i--) {
            const p = this.textPopups[i];
            const alpha = Math.min(1, p.timer / 20);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.font = 'bold 10px ' + FONT;
            ctx.textAlign = 'center';
            ctx.fillText(p.text, p.x, p.y);
            ctx.globalAlpha = 1;
            p.y -= 0.5;
            p.timer--;
            if (p.timer <= 0) {
                this.textPopups.splice(i, 1);
            }
        }

        ctx.restore();
    }

    // --- State: TITLE ---
    updateTitle() {
        // Start title music once audio is initialized
        if (window.gameAudio && window.gameAudio.initialized && window.gameAudio._currentMusic !== 'title') {
            window.gameAudio.playMusic('title');
        }

        if (this.input.startPressed) {
            if (window.gameAudio) {
                window.gameAudio.init();
                window.gameAudio.playMusic('gameplay');
            }
            this.reset();
        }
    }

    drawTitle() {
        const ctx = this.ctx;

        // Scrolling starfield
        this.drawStarfield();

        // Title
        ctx.fillStyle = COLORS.PRIMARY;
        ctx.font = '20px ' + FONT;
        ctx.textAlign = 'center';
        ctx.fillText('ATTACK OF THE', CANVAS_WIDTH / 2, 180);

        ctx.fillStyle = COLORS.ACCENT;
        ctx.font = '32px ' + FONT;
        ctx.fillText('S-CORP', CANVAS_WIDTH / 2, 240);

        // Start prompt (blink)
        if (Math.floor(Date.now() / 500) % 2 === 0) {
            ctx.fillStyle = COLORS.WHITE;
            ctx.font = '8px ' + FONT;
            ctx.fillText('PRESS ENTER OR SPACE TO START', CANVAS_WIDTH / 2, 360);
        }

        // High score
        ctx.fillStyle = COLORS.SECONDARY;
        ctx.font = '10px ' + FONT;
        ctx.fillText(`HIGH SCORE: ${this.highScore}`, CANVAS_WIDTH / 2, 420);

        // Controls
        ctx.fillStyle = COLORS.TEXT;
        ctx.font = '7px ' + FONT;
        ctx.fillText('LEFT/A  RIGHT/D  SPACE:FIRE  P:PAUSE', CANVAS_WIDTH / 2, 520);
    }

    // --- State: PLAYING ---
    updatePlaying() {
        if (this.input.pausePressed) {
            this.state = STATE.PAUSED;
            return;
        }

        // Update player
        if (this.player) {
            this.player.update(this);
        }

        // Update lasers
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            this.lasers[i].update(this);
            if (this.lasers[i].y + this.lasers[i].height < 0) {
                this.lasers.splice(i, 1);
            }
        }

        // Wave transition countdown
        if (this.waveTransitionTimer > 0) {
            this.waveTransitionTimer--;
            return; // Don't spawn enemies during transition
        }

        // Boss wave
        if (this.wave >= RULES.TOTAL_WAVES) {
            this.updateBossWave();
            return;
        }

        // Spawn enemies for current wave
        this.updateEnemySpawning();

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(this);
        }

        // Check collisions
        checkCollisions(this);

        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            this.explosions[i].update();
            if (this.explosions[i].done) {
                this.explosions.splice(i, 1);
            }
        }
    }

    updateEnemySpawning() {
        const config = WAVE_CONFIG[this.wave];
        if (!config) return;

        // Check if wave is complete
        if (this.enemiesCleared >= config.enemiesToClear && this.enemies.length === 0) {
            this.advanceWave();
            return;
        }

        // Spawn new enemies if under concurrent limit and still have enemies to spawn
        const totalSpawnedOrCleared = this.enemiesCleared + this.enemies.length;
        if (this.enemies.length < config.maxConcurrent &&
            totalSpawnedOrCleared < config.enemiesToClear) {
            this.spawnTimer++;
            if (this.spawnTimer >= config.spawnInterval) {
                this.spawnTimer = 0;
                this.spawnEnemy();
            }
        }
    }

    spawnEnemy() {
        if (typeof Enemy !== 'undefined') {
            const config = WAVE_CONFIG[this.wave];
            const titleIndex = (this.enemiesCleared + this.enemies.length) % CSUITE_TITLES.length;
            const title = CSUITE_TITLES[titleIndex];
            const x = Math.random() * (CANVAS_WIDTH - ENEMY.WIDTH);
            const enemy = new Enemy(x, -ENEMY.HEIGHT, config.fallSpeed, title);
            this.enemies.push(enemy);
        }
    }

    advanceWave() {
        // Wave clear bonus
        const clearBonus = 500;
        this.score += clearBonus;
        this.textPopups.push({
            text: `WAVE CLEAR +${clearBonus}`,
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2 + 40,
            timer: 60,
            color: COLORS.SECONDARY,
        });

        // No-damage bonus
        if (!this.waveDamageTaken) {
            const noDmgBonus = 300;
            this.score += noDmgBonus;
            this.textPopups.push({
                text: `NO DAMAGE +${noDmgBonus}`,
                x: CANVAS_WIDTH / 2,
                y: CANVAS_HEIGHT / 2 + 60,
                timer: 60,
                color: COLORS.ACCENT,
            });
        }

        if (window.gameAudio) window.gameAudio.play('wavestart');

        this.wave++;
        this.enemiesCleared = 0;
        this.spawnTimer = 0;
        this.waveDamageTaken = false;
        this.waveTransitionTimer = this.waveTransitionDuration;
    }

    updateBossWave() {
        // Spawn boss if not yet created
        if (!this.boss && typeof Boss !== 'undefined') {
            this.boss = new Boss();
            if (window.gameAudio) {
                window.gameAudio.play('bossappear');
                window.gameAudio.playMusic('boss');
            }
        }

        if (this.boss) {
            this.boss.update(this);

            // Update boss projectiles
            for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
                this.bossProjectiles[i].update(this);
                const p = this.bossProjectiles[i];
                if (p.y > CANVAS_HEIGHT || p.x + p.width < 0 || p.x > CANVAS_WIDTH) {
                    this.bossProjectiles.splice(i, 1);
                }
            }

            // Check collisions (laser vs boss, boss projectiles vs player)
            checkCollisions(this);
        }

        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            this.explosions[i].update();
            if (this.explosions[i].done) {
                this.explosions.splice(i, 1);
            }
        }
    }

    enemyReachedGround(enemy) {
        // Remove the enemy
        const idx = this.enemies.indexOf(enemy);
        if (idx !== -1) this.enemies.splice(idx, 1);

        this.waveDamageTaken = true;
        if (window.gameAudio) window.gameAudio.play('recruit');

        if (this.pinkSlips > 0) {
            // Pink slip defends
            this.pinkSlips--;
            this.screenFlashColor = COLORS.PINK_SLIP;
            this.screenFlashTimer = 10;
            this.textPopups.push({
                text: 'PINK SLIP!',
                x: enemy.x + enemy.width / 2,
                y: CANVAS_HEIGHT - 60,
                timer: 45,
                color: COLORS.PINK_SLIP,
            });
            if (window.gameAudio) window.gameAudio.play('pinkslip');
        } else {
            // Parent set assimilated
            this.assimilateParent(enemy.title);
        }
    }

    assimilateParent(title) {
        // Fill a C-Suite position
        if (title && !this.filledPositions.includes(title)) {
            this.filledPositions.push(title);
        }

        this.parentSetsRemaining--;
        this.pinkSlips = RULES.PINK_SLIPS_PER_SET; // Reset pink slips for next set

        // Visual feedback
        this.screenFlashColor = COLORS.PRIMARY;
        this.screenFlashTimer = 15;
        this.screenShake = 12;
        this.textPopups.push({
            text: 'ASSIMILATED!',
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            timer: 60,
            color: COLORS.PRIMARY,
        });
        if (window.gameAudio) {
            window.gameAudio.play('assimilate');
        }

        if (this.parentSetsRemaining <= 0) {
            this.gameOver();
        }
    }

    enemyDestroyed(enemy) {
        this.score += RULES.SCORE_PER_ENEMY;
        this.enemiesCleared++;

        // Score popup
        this.textPopups.push({
            text: `+${RULES.SCORE_PER_ENEMY}`,
            x: enemy.x + enemy.width / 2,
            y: enemy.y,
            timer: 30,
            color: COLORS.ACCENT,
        });

        this.screenShake = 3;

        if (window.gameAudio) {
            window.gameAudio.play('explosion');
        }

        // Remove from array
        const idx = this.enemies.indexOf(enemy);
        if (idx !== -1) this.enemies.splice(idx, 1);
    }

    gameOver() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('scorp_highscore', this.highScore);
        }
        this.state = STATE.GAME_OVER;
        if (window.gameAudio) {
            window.gameAudio.play('gameover');
            window.gameAudio.playMusic('gameover');
        }
    }

    victory() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('scorp_highscore', this.highScore);
        }
        this.state = STATE.VICTORY;
        if (window.gameAudio) {
            window.gameAudio.play('victory');
            window.gameAudio.playMusic('victory');
        }
    }

    drawStarfield() {
        const ctx = this.ctx;
        for (const star of this.stars) {
            star.y += star.speed;
            if (star.y > CANVAS_HEIGHT) {
                star.y = 0;
                star.x = Math.random() * CANVAS_WIDTH;
            }
            ctx.globalAlpha = star.brightness;
            ctx.fillStyle = COLORS.WHITE;
            ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
        }
        ctx.globalAlpha = 1;
    }

    drawPlaying() {
        const ctx = this.ctx;

        // Scrolling starfield
        this.drawStarfield();

        // Draw explosions (behind entities)
        for (const explosion of this.explosions) {
            explosion.draw(ctx);
        }

        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw(ctx);
        }

        // Draw boss
        if (this.boss) {
            this.boss.draw(ctx);
        }

        // Draw boss projectiles
        for (const proj of this.bossProjectiles) {
            proj.draw(ctx);
        }

        // Draw lasers
        for (const laser of this.lasers) {
            laser.draw(ctx);
        }

        // Draw player
        if (this.player) {
            this.player.draw(ctx);
        }

        // Draw HUD
        this.drawHUD();

        // Wave transition overlay
        if (this.waveTransitionTimer > 0) {
            this.drawWaveTransition();
        }
    }

    drawHUD() {
        const ctx = this.ctx;

        // Top bar background
        ctx.fillStyle = COLORS.HUD_BG;
        ctx.fillRect(0, 0, CANVAS_WIDTH, 40);

        ctx.font = '8px ' + FONT;
        ctx.textAlign = 'left';

        // Score
        ctx.fillStyle = COLORS.ACCENT;
        ctx.fillText(`SCORE: ${this.score}`, 10, 26);

        // Wave
        ctx.fillStyle = COLORS.SECONDARY;
        const waveDisplay = this.wave >= RULES.TOTAL_WAVES ? 'BOSS' : `W${this.wave + 1}`;
        ctx.fillText(waveDisplay, CANVAS_WIDTH / 2 - 20, 26);

        // Pink slips (drawn as small pink document icons)
        const psStartX = CANVAS_WIDTH - 145;
        for (let i = 0; i < RULES.PINK_SLIPS_PER_SET; i++) {
            const px = psStartX + i * 18;
            const py = 12;
            if (i < this.pinkSlips) {
                // Filled pink slip icon
                ctx.fillStyle = COLORS.PINK_SLIP;
                ctx.fillRect(px, py, 12, 16);
                // Folded corner
                ctx.fillStyle = '#FF8DC7';
                ctx.beginPath();
                ctx.moveTo(px + 8, py);
                ctx.lineTo(px + 12, py + 4);
                ctx.lineTo(px + 8, py + 4);
                ctx.closePath();
                ctx.fill();
                // Lines on document
                ctx.fillStyle = COLORS.WHITE;
                ctx.fillRect(px + 2, py + 7, 8, 1);
                ctx.fillRect(px + 2, py + 10, 6, 1);
                ctx.fillRect(px + 2, py + 13, 7, 1);
            } else {
                // Empty slot
                ctx.strokeStyle = '#555';
                ctx.lineWidth = 1;
                ctx.strokeRect(px, py, 12, 16);
            }
        }

        // Parent sets
        ctx.fillStyle = COLORS.PRIMARY;
        ctx.fillText(`FAM: ${this.parentSetsRemaining}`, CANVAS_WIDTH - 65, 26);

        // S-Corp roster (bottom bar)
        if (this.filledPositions.length > 0) {
            const rosterY = CANVAS_HEIGHT - 18;
            ctx.fillStyle = COLORS.HUD_BG;
            ctx.fillRect(0, CANVAS_HEIGHT - 22, CANVAS_WIDTH, 22);

            ctx.font = '6px ' + FONT;
            ctx.textAlign = 'center';
            const slotWidth = CANVAS_WIDTH / CSUITE_TITLES.length;
            for (let i = 0; i < CSUITE_TITLES.length; i++) {
                const filled = this.filledPositions.includes(CSUITE_TITLES[i]);
                ctx.fillStyle = filled ? COLORS.PRIMARY : '#333';
                ctx.fillText(CSUITE_TITLES[i], slotWidth * i + slotWidth / 2, rosterY);
            }
        }

        // Boss health bar
        if (this.boss) {
            const barWidth = 200;
            const barHeight = 8;
            const barX = (CANVAS_WIDTH - barWidth) / 2;
            const barY = 46;
            const hpRatio = this.boss.hp / BOSS.MAX_HP;

            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = hpRatio > 0.4 ? COLORS.PRIMARY : '#FF0000';
            ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
        }
    }

    drawWaveTransition() {
        const ctx = this.ctx;
        const alpha = Math.min(1, this.waveTransitionTimer / 60);

        ctx.fillStyle = `rgba(15, 15, 35, ${alpha * 0.6})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = COLORS.ACCENT;
        ctx.font = '16px ' + FONT;
        ctx.textAlign = 'center';

        if (this.wave >= RULES.TOTAL_WAVES) {
            ctx.fillText('BOSS BATTLE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
            ctx.fillStyle = COLORS.PRIMARY;
            ctx.font = '10px ' + FONT;
            ctx.fillText('S-CORP APPROACHES!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 25);
        } else {
            ctx.fillText(`WAVE ${this.wave + 1}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        }

        ctx.globalAlpha = 1;
    }

    // --- State: PAUSED ---
    updatePaused() {
        if (this.input.pausePressed) {
            this.state = STATE.PLAYING;
        }
        // Restart: Enter returns to title
        if (this.input.isJustPressed(KEYS.ENTER)) {
            this.state = STATE.TITLE;
            if (window.gameAudio) window.gameAudio.playMusic('title');
        }
    }

    drawPauseOverlay() {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = COLORS.ACCENT;
        ctx.font = '20px ' + FONT;
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

        ctx.fillStyle = COLORS.TEXT;
        ctx.font = '8px ' + FONT;
        ctx.fillText('P - RESUME', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
        ctx.fillText('ENTER - QUIT TO TITLE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);
    }

    // --- State: GAME OVER ---
    updateGameOver() {
        if (this.input.startPressed) {
            this.state = STATE.TITLE;
            if (window.gameAudio) window.gameAudio.playMusic('title');
        }
    }

    drawGameOver() {
        const ctx = this.ctx;

        // Scrolling starfield
        this.drawStarfield();

        ctx.fillStyle = COLORS.PRIMARY;
        ctx.font = '22px ' + FONT;
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 180);

        ctx.fillStyle = COLORS.TEXT;
        ctx.font = '8px ' + FONT;
        ctx.fillText('S-Corp has won...', CANVAS_WIDTH / 2, 240);
        ctx.fillText('All parents assimilated.', CANVAS_WIDTH / 2, 265);

        // Filled positions
        ctx.fillStyle = COLORS.ACCENT;
        ctx.font = '7px ' + FONT;
        ctx.fillText('FILLED POSITIONS:', CANVAS_WIDTH / 2, 310);
        ctx.fillStyle = COLORS.SECONDARY;
        const posText = this.filledPositions.length > 0
            ? this.filledPositions.join(', ')
            : 'None';
        ctx.fillText(posText, CANVAS_WIDTH / 2, 335);

        // Score
        ctx.fillStyle = COLORS.ACCENT;
        ctx.font = '12px ' + FONT;
        ctx.fillText(`FINAL SCORE: ${this.score}`, CANVAS_WIDTH / 2, 410);

        // Restart
        if (Math.floor(Date.now() / 500) % 2 === 0) {
            ctx.fillStyle = COLORS.WHITE;
            ctx.font = '8px ' + FONT;
            ctx.fillText('PRESS ENTER OR SPACE', CANVAS_WIDTH / 2, 500);
        }
    }

    // --- State: VICTORY ---
    updateVictory() {
        if (this.input.startPressed) {
            this.state = STATE.TITLE;
            if (window.gameAudio) window.gameAudio.playMusic('title');
        }
    }

    drawVictory() {
        const ctx = this.ctx;

        // Scrolling starfield
        this.drawStarfield();

        ctx.fillStyle = COLORS.ACCENT;
        ctx.font = '22px ' + FONT;
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', CANVAS_WIDTH / 2, 160);

        ctx.fillStyle = COLORS.SECONDARY;
        ctx.font = '10px ' + FONT;
        ctx.fillText('S-Corp is BANKRUPT!', CANVAS_WIDTH / 2, 220);

        ctx.fillStyle = COLORS.TEXT;
        ctx.font = '8px ' + FONT;
        ctx.fillText('All parents have been freed!', CANVAS_WIDTH / 2, 270);

        ctx.fillStyle = COLORS.ACCENT;
        ctx.font = '12px ' + FONT;
        ctx.fillText(`FINAL SCORE: ${this.score}`, CANVAS_WIDTH / 2, 350);

        // Restart
        if (Math.floor(Date.now() / 500) % 2 === 0) {
            ctx.fillStyle = COLORS.WHITE;
            ctx.font = '8px ' + FONT;
            ctx.fillText('PRESS ENTER OR SPACE', CANVAS_WIDTH / 2, 460);
        }
    }
}
