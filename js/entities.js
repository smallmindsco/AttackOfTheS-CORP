// ============================================================
// Attack of the S-Corp - Entity Classes
// ============================================================

// --- Laser Projectile ---
class LaserProjectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = LASER.WIDTH;
        this.height = LASER.HEIGHT;
        this.speed = LASER.SPEED;
    }

    update(game) {
        this.y -= this.speed;
    }

    draw(ctx) {
        // Bright core
        ctx.fillStyle = LASER.COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Glow effect (slightly wider, semi-transparent)
        ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
        ctx.fillRect(this.x - 2, this.y, this.width + 4, this.height);
    }
}

// --- Player ---
class Player {
    constructor() {
        this.width = PLAYER.WIDTH;
        this.height = PLAYER.HEIGHT;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = CANVAS_HEIGHT - PLAYER.Y_OFFSET;
        this.speed = PLAYER.SPEED;
        this.fireCooldown = 0;
    }

    update(game) {
        // Movement
        if (game.input.left) {
            this.x -= this.speed;
        }
        if (game.input.right) {
            this.x += this.speed;
        }

        // Clamp to screen bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CANVAS_WIDTH) this.x = CANVAS_WIDTH - this.width;

        // Firing
        if (this.fireCooldown > 0) {
            this.fireCooldown--;
        }

        if (game.input.fire && this.fireCooldown <= 0) {
            this.fire(game);
            this.fireCooldown = PLAYER.FIRE_COOLDOWN;
        }
    }

    fire(game) {
        const laserX = this.x + this.width / 2 - LASER.WIDTH / 2;
        const laserY = this.y - LASER.HEIGHT;
        game.lasers.push(new LaserProjectile(laserX, laserY));
        if (window.gameAudio) window.gameAudio.play('laser');
    }

    draw(ctx) {
        // Cannon base (rectangle)
        ctx.fillStyle = COLORS.SECONDARY;
        ctx.fillRect(this.x, this.y + 8, this.width, this.height - 8);

        // Cannon barrel (narrower rectangle on top center)
        const barrelWidth = 8;
        const barrelHeight = 12;
        const barrelX = this.x + this.width / 2 - barrelWidth / 2;
        ctx.fillStyle = COLORS.PRIMARY;
        ctx.fillRect(barrelX, this.y, barrelWidth, barrelHeight);

        // Cannon accent lines
        ctx.fillStyle = COLORS.ACCENT;
        ctx.fillRect(this.x + 4, this.y + 12, this.width - 8, 3);
    }
}

// --- Enemy (C-Suite Nametag) ---
class Enemy {
    constructor(x, y, fallSpeed, title) {
        this.x = x;
        this.y = y;
        this.width = ENEMY.WIDTH;
        this.height = ENEMY.HEIGHT;
        this.fallSpeed = fallSpeed;
        this.title = title;
    }

    update(game) {
        this.y += this.fallSpeed;

        // Check if reached the ground (player level)
        if (this.y + this.height >= CANVAS_HEIGHT - 20) {
            game.enemyReachedGround(this);
        }
    }

    draw(ctx) {
        // Nametag background
        ctx.fillStyle = COLORS.DARK;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Nametag border
        ctx.strokeStyle = COLORS.PRIMARY;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Title text
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '8px ' + FONT;
        ctx.textAlign = 'center';
        ctx.fillText(this.title, this.x + this.width / 2, this.y + this.height / 2 + 5);
    }
}

// --- Explosion (placeholder particle burst) ---
class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.maxFrames = 20;
        this.done = false;
    }

    update() {
        this.frame++;
        if (this.frame >= this.maxFrames) {
            this.done = true;
        }
    }

    draw(ctx) {
        const progress = this.frame / this.maxFrames;
        const radius = 10 + progress * 20;
        const alpha = 1 - progress;

        ctx.globalAlpha = alpha;

        // Outer ring (red)
        ctx.fillStyle = COLORS.PRIMARY;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner core (yellow, drawn on top)
        ctx.fillStyle = COLORS.ACCENT;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}

// ============================================================
// Boss Projectile Types
// ============================================================

// --- Business Card (small, fast, straight down) ---
class BusinessCard {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx || 0;
        this.vy = vy || 9;
        this.width = 12;
        this.height = 8;
    }

    update(game) {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.fillStyle = COLORS.WHITE;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLORS.DARK;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// --- Golden Parachute (larger, slower, drifts side to side) ---
class GoldenParachute {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.vy = 6;
        this.driftPhase = Math.random() * Math.PI * 2;
        this.driftSpeed = 0.15;
        this.driftAmplitude = 4.5;
    }

    update(game) {
        this.driftPhase += this.driftSpeed;
        this.x += Math.sin(this.driftPhase) * this.driftAmplitude;
        this.y += this.vy;
    }

    draw(ctx) {
        // Parachute canopy
        ctx.fillStyle = COLORS.ACCENT;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 6, 10, Math.PI, 0);
        ctx.fill();

        // Package below
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(this.x + 6, this.y + 10, 8, 8);

        // Strings
        ctx.strokeStyle = COLORS.TEXT;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + 3, this.y + 6);
        ctx.lineTo(this.x + 10, this.y + 14);
        ctx.moveTo(this.x + 17, this.y + 6);
        ctx.lineTo(this.x + 10, this.y + 14);
        ctx.stroke();
    }
}

// --- Hostile Takeover Beam (wide, travels fast) ---
class TakeoverBeam {
    constructor(x, y, targetX) {
        this.width = 8;
        this.height = 30;
        this.x = x - this.width / 2;
        this.y = y;
        this.vy = 15;
        // Aim toward player's x position
        const dx = targetX - x;
        this.vx = dx * 0.06;
    }

    update(game) {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        // Beam glow
        ctx.fillStyle = 'rgba(255, 0, 100, 0.3)';
        ctx.fillRect(this.x - 4, this.y, this.width + 8, this.height);

        // Beam core
        ctx.fillStyle = '#FF0064';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// ============================================================
// Boss (S-Corp)
// ============================================================

class Boss {
    constructor() {
        this.width = BOSS.WIDTH;
        this.height = BOSS.HEIGHT;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = -this.height; // Start off-screen for entrance
        this.targetY = 60;     // Final resting y position

        this.hp = BOSS.MAX_HP;
        this.maxHp = BOSS.MAX_HP;

        this.direction = 1;  // 1 = right, -1 = left
        this.attackTimer = 0;
        this.attackCooldown = 90; // Frames between attacks (~1.5s)

        this.entering = true;
        this.defeated = false;
        this.defeatTimer = 0;

        this.flashTimer = 0; // Hit flash effect
    }

    getPhase() {
        const hpRatio = this.hp / this.maxHp;
        for (let i = 0; i < BOSS.PHASES.length; i++) {
            if (hpRatio > BOSS.PHASES[i].hpThreshold) {
                return BOSS.PHASES[i];
            }
        }
        return BOSS.PHASES[BOSS.PHASES.length - 1];
    }

    update(game) {
        if (this.defeated) {
            this.defeatTimer++;
            if (this.defeatTimer === 120) { // 2 second defeat animation
                game.victory();
            }
            return;
        }

        // Entrance animation: slide down to targetY
        if (this.entering) {
            this.y += 3;
            if (this.y >= this.targetY) {
                this.y = this.targetY;
                this.entering = false;
            }
            return;
        }

        const phase = this.getPhase();

        // Horizontal movement
        this.x += phase.speed * this.direction;
        if (this.x + this.width >= CANVAS_WIDTH - 10) {
            this.direction = -1;
        } else if (this.x <= 10) {
            this.direction = 1;
        }

        // Erratic movement for phase 3+
        if (phase.attackPattern === 'triple' || phase.attackPattern === 'barrage') {
            this.y = this.targetY + Math.sin(Date.now() * 0.005) * 20;
        }

        // Flash timer countdown
        if (this.flashTimer > 0) {
            this.flashTimer--;
        }

        // Attack
        this.attackTimer++;
        const cooldown = this.attackCooldown * phase.cooldownMult;

        if (this.attackTimer >= cooldown) {
            this.attackTimer = 0;
            this.attack(game, phase);
        }
    }

    attack(game, phase) {
        const cx = this.x + this.width / 2;
        const bottom = this.y + this.height;
        const playerX = game.player
            ? game.player.x + game.player.width / 2
            : CANVAS_WIDTH / 2;

        switch (phase.attackPattern) {
            case 'single':
                // Single business card aimed at player
                game.bossProjectiles.push(
                    new BusinessCard(cx - 6, bottom, (playerX - cx) * 0.03, 9)
                );
                break;

            case 'dual':
                // Two business cards in a spread
                game.bossProjectiles.push(
                    new BusinessCard(cx - 20, bottom, -3.0, 9)
                );
                game.bossProjectiles.push(
                    new BusinessCard(cx + 8, bottom, 3.0, 9)
                );
                break;

            case 'triple':
                // Three business cards + a golden parachute
                game.bossProjectiles.push(
                    new BusinessCard(cx - 6, bottom, -4.5, 9)
                );
                game.bossProjectiles.push(
                    new BusinessCard(cx - 6, bottom, 0, 10.5)
                );
                game.bossProjectiles.push(
                    new BusinessCard(cx - 6, bottom, 4.5, 9)
                );
                // Hostile takeover beam aimed at player
                game.bossProjectiles.push(
                    new TakeoverBeam(cx, bottom, playerX)
                );
                break;

            case 'barrage':
                // Rapid fire: random spread of business cards + parachutes
                const spreadX = (Math.random() - 0.5) * 12;
                game.bossProjectiles.push(
                    new BusinessCard(cx - 6, bottom, spreadX, 9 + Math.random() * 6)
                );
                // Every other attack also drops a golden parachute
                if (this.attackTimer === 0 && Math.random() > 0.5) {
                    game.bossProjectiles.push(
                        new GoldenParachute(cx - 10, bottom)
                    );
                }
                // Occasional beam
                if (Math.random() > 0.7) {
                    game.bossProjectiles.push(
                        new TakeoverBeam(cx, bottom, playerX)
                    );
                }
                break;
        }
    }

    takeDamage(game) {
        if (this.defeated || this.entering) return;

        this.hp--;
        this.flashTimer = 8;
        game.screenShake = 6;

        // Explosion at hit point
        game.explosions.push(
            new Explosion(
                this.x + Math.random() * this.width,
                this.y + Math.random() * this.height
            )
        );

        game.score += RULES.SCORE_PER_ENEMY;
        if (window.gameAudio) window.gameAudio.play('bosshit');

        if (this.hp <= 0) {
            this.defeated = true;
            this.defeatTimer = 0;
            game.screenShake = 20;
            if (window.gameAudio) window.gameAudio.play('bossdefeat');
            // Big explosion burst
            for (let i = 0; i < 5; i++) {
                game.explosions.push(
                    new Explosion(
                        this.x + Math.random() * this.width,
                        this.y + Math.random() * this.height
                    )
                );
            }
        }
    }

    draw(ctx) {
        if (this.defeated) {
            // Flicker during defeat animation
            if (Math.floor(this.defeatTimer / 4) % 2 === 0) return;
        }

        // Hit flash
        const flashing = this.flashTimer > 0 && Math.floor(this.flashTimer / 2) % 2 === 0;

        // Main body
        ctx.fillStyle = flashing ? COLORS.WHITE : COLORS.DARK;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Border
        ctx.strokeStyle = COLORS.PRIMARY;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Inner accent
        ctx.strokeStyle = COLORS.ACCENT;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x + 6, this.y + 6, this.width - 12, this.height - 12);

        // S-CORP text
        ctx.fillStyle = flashing ? COLORS.DARK : COLORS.PRIMARY;
        ctx.font = '14px ' + FONT;
        ctx.textAlign = 'center';
        ctx.fillText('S-CORP', this.x + this.width / 2, this.y + this.height / 2 - 6);

        // Phase indicator
        const phase = this.getPhase();
        ctx.fillStyle = COLORS.TEXT;
        ctx.font = '6px ' + FONT;
        ctx.fillText(phase.attackPattern.toUpperCase(), this.x + this.width / 2, this.y + this.height / 2 + 14);

        // HP pips along the bottom
        const pipWidth = (this.width - 20) / this.maxHp;
        for (let i = 0; i < this.maxHp; i++) {
            ctx.fillStyle = i < this.hp ? COLORS.PRIMARY : '#222';
            ctx.fillRect(this.x + 10 + i * pipWidth, this.y + this.height - 10, pipWidth - 2, 6);
        }
    }
}
