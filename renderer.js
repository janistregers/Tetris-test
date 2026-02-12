/* global window, document */
(() => {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const nextEl = document.getElementById('next');
    const holdEl = document.getElementById('hold');
  
    const BLOCK_SIZE = 36;
  
    const drawGrid = (cols, visibleRows) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#333';
      for (let y = 0; y < visibleRows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    };
  
    const drawBoard = (board, rows, visibleRows, cols) => {
      const startRow = rows - visibleRows;
      for (let y = startRow; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const color = board[y][x];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * BLOCK_SIZE, (y - startRow) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    };
  
    const drawBlocks = (blocks, rows, visibleRows, color) => {
      const startRow = rows - visibleRows;
      ctx.fillStyle = color;
      blocks.forEach((b) => {
        ctx.fillRect(b.x * BLOCK_SIZE, (b.y - startRow) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      });
    };
  
    const renderNext = (nextQueue) => {
      if (!nextEl) return;
      nextEl.innerHTML = '';
      nextQueue.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        nextEl.appendChild(li);
      });
    };
  
    const renderHold = (holdType) => {
      if (holdEl) holdEl.textContent = holdType || '-';
    };
  
    const render = (state) => {
      drawGrid(state.cols, state.visibleRows);
      drawBoard(state.board, state.rows, state.visibleRows, state.cols);
  
      // Current piece drawing
      const curBlocks = state.piece.blocks.map((b) => ({
        x: state.piece.x + b.x,
        y: state.piece.y + b.y,
      }));
      drawBlocks(curBlocks, state.rows, state.visibleRows, state.piece.color);
  
      renderNext(state.nextQueue);
      renderHold(state.holdType);
    };
  
    window.Renderer = { render };
  })();