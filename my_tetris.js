/* global window, document */
(() => {
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const statusEl = document.getElementById('status');
    const overlayEl = document.getElementById('overlay');
    const noticeEl = document.getElementById('notice');
  
    const NOTICE_TEXT = "Tetris © 1985~2026 Tetris Holding. All Rights Reserved.";
    const game = new window.TetrisLogic.TetrisLogic();
  
    let gravityMs = 250;
    let lastGravity = 0;
    let countdownActive = false;
  
    const setOverlay = (text) => {
      overlayEl.textContent = text;
      overlayEl.classList.toggle('hidden', !text);
    };
  
    const countdown3 = (onDone) => {
      countdownActive = true;
      const seq = ['3', '2', '1', 'GO'];
      let i = 0;
      setOverlay(seq[i]);
  
      const id = setInterval(() => {
        i += 1;
        if (i >= seq.length) {
          clearInterval(id);
          setOverlay('');
          countdownActive = false;
          onDone();
        } else {
          setOverlay(seq[i]);
        }
      }, 700);
    };
  
    const loop = (ts) => {
      if (game.running && !game.paused && !game.gameOver && !countdownActive) {
        if (ts - lastGravity >= gravityMs) {
          lastGravity = ts;
          const res = game.tick(ts);
          if (res.locked) {
            window.AudioFx.sounds.lock();
            if (res.cleared > 0) window.AudioFx.sounds.clear();
          }
          if (game.gameOver) {
            statusEl.textContent = 'Status: game over';
            window.AudioFx.sounds.gameover();
          }
        }
      }
      window.Renderer.render(game.snapshot());
      requestAnimationFrame(loop);
    };
  
    const api = {
      isInteractive: () => game.running && !game.paused && !game.gameOver && !countdownActive,
      move: (dx, dy) => game.move(dx, dy) && window.AudioFx.sounds.move(),
      rotateCW: () => game.tryRotate('CW') && window.AudioFx.sounds.rotate(),
      rotateCCW: () => game.tryRotate('CCW') && window.AudioFx.sounds.rotate(),
      hardDrop: () => game.hardDrop() && window.AudioFx.sounds.land(),
      hold: () => game.hold() && window.AudioFx.sounds.move(),
      requestPauseToggle: () => {
        if (!game.running || game.gameOver) return;
        const isPaused = game.togglePause();
        statusEl.textContent = isPaused ? 'Status: paused' : 'Status: running';
        if (!isPaused) countdown3(() => {});
      },
    };
  
    window.Controller.attach(api);
  
    startBtn.addEventListener('click', () => {
      noticeEl.textContent = NOTICE_TEXT;
      noticeEl.classList.remove('hidden');
      game.start();
      countdown3(() => { statusEl.textContent = 'Status: running'; });
    });
  
    pauseBtn.addEventListener('click', api.requestPauseToggle);
  
    requestAnimationFrame(loop);
  })();