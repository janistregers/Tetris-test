/* global window, document */
(function () {
    function attach(api) {
      document.addEventListener('keydown', (e) => {
        if (!api) return;
  
        // Pause even if not interactive
        if (e.key === 'Escape' || e.key === 'F1') {
          e.preventDefault();
          api.requestPauseToggle();
          return;
        }
  
        if (!api.isInteractive()) return;
  
        if (e.key === 'ArrowLeft') api.move(-1, 0);
        else if (e.key === 'ArrowRight') api.move(1, 0);
        else if (e.key === 'ArrowDown') api.softDrop();
        else if (e.key === ' ') {
          e.preventDefault();
          api.hardDrop();
        } else if (e.key === 'ArrowUp' || e.key === 'x' || e.key === 'X') api.rotateCW();
        else if (e.key === 'z' || e.key === 'Z' || (e.ctrlKey && (e.key === 'z' || e.key === 'Z'))) api.rotateCCW();
        else if (e.key === 'Shift' || e.key === 'c' || e.key === 'C') api.hold();
      });
    }
  
    window.Controller = { attach };
  })();