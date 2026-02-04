// ============================================================
// Attack of the S-Corp - Entry Point & Game Loop
// ============================================================

(function () {
    'use strict';

    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);

    // --- Fixed-timestep game loop targeting 60 FPS ---
    const TARGET_FPS = 60;
    const FRAME_DURATION = 1000 / TARGET_FPS;
    let lastTime = 0;
    let accumulator = 0;

    function gameLoop(timestamp) {
        if (lastTime === 0) {
            lastTime = timestamp;
        }

        const delta = timestamp - lastTime;
        lastTime = timestamp;

        // Cap delta to prevent spiral of death after tab switch
        accumulator += Math.min(delta, 200);

        while (accumulator >= FRAME_DURATION) {
            game.update();
            accumulator -= FRAME_DURATION;
        }

        game.draw();
        requestAnimationFrame(gameLoop);
    }

    // --- Splash screen: show for 8 seconds, fade out over 1s, then start game loop ---
    const splash = document.getElementById('splash');
    const SPLASH_DURATION = 8000; // 8 seconds
    const FADE_DURATION = 1000;   // 1 second (matches CSS transition)

    setTimeout(function () {
        splash.classList.add('fade-out');
        setTimeout(function () {
            splash.remove();
            requestAnimationFrame(gameLoop);
        }, FADE_DURATION);
    }, SPLASH_DURATION);
})();
