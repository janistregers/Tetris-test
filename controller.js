/* global window, document */
(function () {
    function attach(game) {
      document.addEventListener('keydown', (e) => {
        if (!game) return;
  
        // Pause
        if (e.key === 'Escape' || e.key === 'F1') {
          e.preventDefault();
          game.requestPauseToggle();
          return;
        }
  
        if (!game.isInteractive()) return;
  
        if (e.key === 'ArrowLeft') {
          game.move(-1, 0);
        } else if (e.key === 'ArrowRight') {
          game.move(1, 0);
        } else if (e.key === 'ArrowDown') {
          game.softDrop();
        } else if (e.key === ' ') {
          e.preventDefault();
          game.hardDrop();
        } else if (e.key === 'ArrowUp' || e.key === 'x' || e.key === 'X') {
          game.rotateCW();
        } else if (e.key === 'z' || e.key === 'Z' || (e.ctrlKey && (e.key === 'z' || e.key === 'Z'))) {
          game.rotateCCW();
        } else if (e.key === 'Shift' || e.key === 'c' || e.key === 'C') {
          game.hold();
        }
      });
    }
  
    window.Controller = { attach };
  })();