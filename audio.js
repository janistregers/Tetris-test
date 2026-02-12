/* global window */
(function () {
    let audioCtx = null;
    let enabled = true;
  
    function ctx() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      return audioCtx;
    }
  
    function beep(freq, durMs) {
      if (!enabled) return;
      const c = ctx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.frequency.value = freq;
      o.type = 'square';
      g.gain.value = 0.03;
      o.connect(g);
      g.connect(c.destination);
      o.start();
      setTimeout(() => o.stop(), durMs);
    }
  
    const sounds = {
      move: () => beep(220, 30),
      rotate: () => beep(440, 40),
      lock: () => beep(120, 80),
      clear: () => beep(600, 80),
      gameover: () => beep(80, 200),
    };
  
    window.AudioFx = {
      sounds,
      setEnabled: (v) => {
        enabled = v;
      },
    };
  })();