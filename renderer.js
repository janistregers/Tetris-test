/* global window, document */
(function () {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
  
    const nextEl = document.getElementById('next');
    const holdEl = document.getElementById('hold');
    const scoreEl = document.getElementById('score');
  
    function blockSize(state) {
      return canvas.width / state.cols;
    }
  
    function drawGrid(state) {
      const bs = blockSize(state);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#333';
  
      for (let y = 0; y < state.visibleRows; y += 1) {
        for (let x = 0; x < state.cols; x += 1) {
          ctx.strokeRect(x * bs, y * bs, bs, bs);
        }
      }
    }
  
    function drawBoard(state) {
      const bs = blockSize(state);
      const startRow = state.rows - state.visibleRows;
  
      for (let y = startRow; y < state.rows; y += 1) {
        for (let x = 0; x < state.cols; x += 1) {
          const color = state.board[y][x];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * bs, (y - startRow) * bs, bs, bs);
          }
        }
      }
    }
  
    function drawPiece(state) {
      if (!state.piece || !state.piece.type) return;
  
      const bs = blockSize(state);
      const startRow = state.rows - state.visibleRows;
  
      ctx.fillStyle = state.piece.color;
  
      state.piece.blocks.forEach((b) => {
        const x = (state.piece.x + b.x) * bs;
        const y = (state.piece.y + b.y - startRow) * bs;
        ctx.fillRect(x, y, bs, bs);
      });
    }
  
    function renderNext(nextQueue) {
      if (!nextEl) return;
      nextEl.innerHTML = '';
      nextQueue.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        nextEl.appendChild(li);
      });
    }
  
    function renderHold(holdType) {
      if (!holdEl) return;
      holdEl.textContent = holdType || '-';
    }
  
    function renderScore(score) {
      if (!scoreEl) return;
      scoreEl.textContent = String(score);
    }
  
    function render(state) {
      drawGrid(state);
      drawBoard(state);
      drawPiece(state);
  
      renderNext(state.nextQueue || []);
      renderHold(state.holdType || null);
      renderScore(state.score || 0);
    }
  
    window.Renderer = { render };
  })();