/* global window, document */
(function () {
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const statusEl = document.getElementById('status');
    const overlayEl = document.getElementById('overlay');
    const themeSong = document.getElementById('themeSong');
  
    const game = new window.TetrisLogic.TetrisLogic();
  
    let gravityMs = 250;
    let lastGravity = 0;
    let countdownActive = false;
  
    function setOverlay(text) {
      if (!overlayEl) return;
      overlayEl.textContent = text || '';
      overlayEl.classList.toggle('hidden', !text);
    }
  
    function countdown3(onDone) {
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
          return;
        }
        setOverlay(seq[i]);
      }, 700);
    }
  
    function tryPlayTheme() {
      if (!themeSong) return;
      // browsers may block autoplay; calling on user click is fine
      themeSong.volume = 0.25;
      themeSong.play().catch(() => {});
    }
  
    function render() {
      window.Renderer.render(game.snapshot());
    }
  
    function loop(ts) {
      requestAnimationFrame(loop);
  
      if (!game.running || game.paused || game.gameOver || countdownActive) {
        render();
        return;
      }
  
      if (ts - lastGravity >= gravityMs) {
        lastGravity = ts;
        const res = game.tick(ts);
  
        if (res.locked) window.AudioFx.sounds.lock();
        if (res.cleared > 0) window.AudioFx.sounds.clear();
  
        if (game.gameOver) {
          statusEl.textContent = 'Status: game over';
          window.AudioFx.sounds.gameover();
        }
      }
  
      render();
    }
  
    const api = {
      isInteractive() {
        return game.running && !game.paused && !game.gameOver && !countdownActive;
      },
      move(dx, dy) {
        if (game.move(dx, dy)) window.AudioFx.sounds.move();
      },
      softDrop() {
        if (game.move(0, 1)) window.AudioFx.sounds.move();
      },
      hardDrop() {
        if (game.hardDrop()) window.AudioFx.sounds.lock();
      },
      rotateCW() {
        if (game.tryRotate('CW')) window.AudioFx.sounds.rotate();
      },
      rotateCCW() {
        if (game.tryRotate('CCW')) window.AudioFx.sounds.rotate();
      },
      hold() {
        if (game.hold()) window.AudioFx.sounds.move();
      },
      requestPauseToggle() {
        if (!game.running || game.gameOver) return;
        const paused = game.togglePause();
        statusEl.textContent = paused ? 'Status: paused' : 'Status: resuming...';
        if (!paused) countdown3(() => { statusEl.textContent = 'Status: running'; });
      },
    };
  
    window.Controller.attach(api);
  
    startBtn.addEventListener('click', () => {
      tryPlayTheme();
      statusEl.textContent = 'Status: starting...';
      game.start();
      countdown3(() => {
        statusEl.textContent = 'Status: running';
      });
    });
  
    pauseBtn.addEventListener('click', () => {
      api.requestPauseToggle();
    });
  
    render();
    requestAnimationFrame(loop);
  })();