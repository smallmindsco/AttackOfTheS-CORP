// ============================================================
// Attack of the S-Corp - Collision Detection
// ============================================================

function aabbOverlap(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function checkCollisions(game) {
    checkLaserEnemyCollisions(game);
    checkLaserBossCollisions(game);
    checkBossProjectilePlayerCollisions(game);
}

function checkLaserEnemyCollisions(game) {
    for (let li = game.lasers.length - 1; li >= 0; li--) {
        const laser = game.lasers[li];

        for (let ei = game.enemies.length - 1; ei >= 0; ei--) {
            const enemy = game.enemies[ei];

            if (aabbOverlap(laser, enemy)) {
                // Remove laser
                game.lasers.splice(li, 1);

                // Spawn explosion at enemy center
                game.explosions.push(
                    new Explosion(
                        enemy.x + enemy.width / 2,
                        enemy.y + enemy.height / 2
                    )
                );

                // Notify game of kill
                game.enemyDestroyed(enemy);

                // This laser is consumed — break inner loop
                break;
            }
        }
    }
}

function checkLaserBossCollisions(game) {
    if (!game.boss) return;

    for (let li = game.lasers.length - 1; li >= 0; li--) {
        const laser = game.lasers[li];

        if (aabbOverlap(laser, game.boss)) {
            game.lasers.splice(li, 1);
            game.boss.takeDamage(game);
        }
    }
}

function checkBossProjectilePlayerCollisions(game) {
    if (!game.player) return;

    for (let pi = game.bossProjectiles.length - 1; pi >= 0; pi--) {
        const proj = game.bossProjectiles[pi];

        if (aabbOverlap(proj, game.player)) {
            game.bossProjectiles.splice(pi, 1);

            game.waveDamageTaken = true;
            if (window.gameAudio) window.gameAudio.play('recruit');

            if (game.pinkSlips > 0) {
                game.pinkSlips--;
                game.screenFlashColor = COLORS.PINK_SLIP;
                game.screenFlashTimer = 10;
                game.textPopups.push({
                    text: 'PINK SLIP!',
                    x: game.player.x + game.player.width / 2,
                    y: game.player.y - 20,
                    timer: 45,
                    color: COLORS.PINK_SLIP,
                });
                if (window.gameAudio) window.gameAudio.play('pinkslip');
            } else {
                game.assimilateParent(null);
            }

            break; // Only one hit per frame
        }
    }
}
