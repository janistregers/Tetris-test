/* global window */
(function () {
    const COLS = 10;
    const ROWS = 40;
    const VISIBLE_ROWS = 20;
  
    const TETROMINOES = {
      I: { color: '#0ff', blocks: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }] },
      O: { color: '#ff0', blocks: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
      T: { color: '#a0f', blocks: [{ x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }] },
      S: { color: '#0f0', blocks: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] },
      Z: { color: '#f00', blocks: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }] },
      J: { color: '#00f', blocks: [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }] },
      L: { color: '#fa0', blocks: [{ x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }] },
    };
  
    const TYPES = Object.keys(TETROMINOES);
  
    const KICKS_JLSTZ = {
      '0>1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
      '1>0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
      '1>2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
      '2>1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
      '2>3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
      '3>2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
      '3>0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
      '0>3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
    };
  
    const KICKS_I = {
      '0>1': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
      '1>0': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
      '1>2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
      '2>1': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
      '2>3': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
      '3>2': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
      '3>0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
      '0>3': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
    };
  
    function shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  
    function rotateBlocks(blocks, cw) {
      return blocks.map((b) => (cw ? { x: 3 - b.y, y: b.x } : { x: b.y, y: 3 - b.x }));
    }
  
    class TetrisLogic {
      constructor() {
        this.cols = COLS;
        this.rows = ROWS;
        this.visibleRows = VISIBLE_ROWS;
  
        this.lockDelayMs = 500;
  
        this.score = 0;
        this.running = false;
        this.paused = false;
        this.gameOver = false;
  
        this.holdType = null;
        this.holdUsed = false;
  
        this.lockStartedAt = null;
  
        this.createBoard();
        this.refillBag();
        this.initNextQueue();
  
        // No piece until Start
        this.piece = { type: null, blocks: [], color: '#fff', rotation: 0, x: 3, y: ROWS - VISIBLE_ROWS };
      }
  
      createBoard() {
        this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
      }
  
      isInside(x, y) {
        return x >= 0 && x < COLS && y >= 0 && y < ROWS;
      }
  
      isCellEmpty(x, y) {
        return this.isInside(x, y) && this.board[y][x] === null;
      }
  
      canPlace(px, py, blocks = this.piece.blocks) {
        return blocks.every((b) => this.isCellEmpty(px + b.x, py + b.y));
      }
  
      refillBag() {
        this.bag = shuffle(TYPES);
      }
  
      takeFromBag() {
        if (this.bag.length === 0) this.refillBag();
        return this.bag.pop();
      }
  
      initNextQueue() {
        this.nextQueue = [];
        while (this.nextQueue.length < 6) this.nextQueue.push(this.takeFromBag());
      }
  
      pullNextType() {
        const t = this.nextQueue.shift();
        this.nextQueue.push(this.takeFromBag());
        return t;
      }
  
      spawn(type) {
        const def = TETROMINOES[type];
        this.piece = {
          type,
          blocks: def.blocks,
          color: def.color,
          rotation: 0,
          x: 3,
          y: ROWS - VISIBLE_ROWS,
        };
  
        // “Immediately drop one space if clear”
        if (this.canPlace(this.piece.x, this.piece.y + 1)) this.piece.y += 1;
  
        this.lockStartedAt = null;
        this.holdUsed = false;
  
        // block-out
        if (!this.canPlace(this.piece.x, this.piece.y)) {
          this.gameOver = true;
          this.running = false;
        }
      }
  
      start() {
        this.createBoard();
        this.refillBag();
        this.initNextQueue();
  
        this.score = 0;
        this.holdType = null;
        this.holdUsed = false;
  
        this.running = true;
        this.paused = false;
        this.gameOver = false;
        this.lockStartedAt = null;
  
        this.spawn(this.pullNextType());
      }
  
      togglePause() {
        if (!this.running || this.gameOver) return this.paused;
        this.paused = !this.paused;
        return this.paused;
      }
  
      move(dx, dy) {
        if (!this.piece.type) return false;
        const nx = this.piece.x + dx;
        const ny = this.piece.y + dy;
  
        if (this.canPlace(nx, ny)) {
          this.piece.x = nx;
          this.piece.y = ny;
          this.lockStartedAt = null;
          return true;
        }
        return false;
      }
  
      hardDrop() {
        if (!this.piece.type) return false;
        while (this.move(0, 1)) {}
        this.lock();
        return true;
      }
  
      hold() {
        if (!this.piece.type) return false;
        if (this.holdUsed) return false;
  
        const current = this.piece.type;
        if (this.holdType === null) {
          this.holdType = current;
          this.spawn(this.pullNextType());
        } else {
          const swap = this.holdType;
          this.holdType = current;
          this.spawn(swap);
        }
  
        this.holdUsed = true;
        return true;
      }
  
      tryRotate(dir) {
        if (!this.piece.type) return false;
  
        const isCW = dir === 'CW';
        const from = this.piece.rotation;
        const to = isCW ? (from + 1) % 4 : (from + 3) % 4;
  
        const rotated = rotateBlocks(this.piece.blocks, isCW);
  
        // O piece: rotation “works” but kicks aren't needed; allow simple place check
        const table = this.piece.type === 'I' ? KICKS_I : KICKS_JLSTZ;
        const tests = this.piece.type === 'O' ? [{ x: 0, y: 0 }] : (table[`${from}>${to}`] || [{ x: 0, y: 0 }]);
  
        for (let i = 0; i < tests.length; i += 1) {
          const k = tests[i];
          const nx = this.piece.x + k.x;
          const ny = this.piece.y + k.y;
  
          if (this.canPlace(nx, ny, rotated)) {
            this.piece.x = nx;
            this.piece.y = ny;
            this.piece.blocks = rotated;
            this.piece.rotation = to;
            this.lockStartedAt = null;
            return true;
          }
        }
        return false;
      }
  
      lock() {
        // paint blocks into board
        this.piece.blocks.forEach((b) => {
          const ax = this.piece.x + b.x;
          const ay = this.piece.y + b.y;
          if (this.isInside(ax, ay)) this.board[ay][ax] = this.piece.color;
        });
  
        const cleared = this.clearLines();
        if (cleared > 0) this.score += cleared * 100;
  
        // lock-out (minimal): if piece locks above visible area
        if (this.piece.y < ROWS - VISIBLE_ROWS) {
          this.gameOver = true;
          this.running = false;
          return { cleared };
        }
  
        this.spawn(this.pullNextType());
        return { cleared };
      }
  
      clearLines() {
        let count = 0;
        this.board = this.board.filter((row) => {
          const full = row.every((c) => c !== null);
          if (full) count += 1;
          return !full;
        });
  
        while (this.board.length < ROWS) this.board.unshift(Array(COLS).fill(null));
        return count;
      }
  
      tick(now) {
        if (!this.running || this.paused || this.gameOver) return { moved: false, locked: false, cleared: 0 };
        if (!this.piece.type) return { moved: false, locked: false, cleared: 0 };
  
        if (this.move(0, 1)) return { moved: true, locked: false, cleared: 0 };
  
        if (this.lockStartedAt === null) this.lockStartedAt = now;
  
        if (now - this.lockStartedAt >= this.lockDelayMs) {
          const res = this.lock();
          return { moved: false, locked: true, cleared: res.cleared || 0 };
        }
  
        return { moved: false, locked: false, cleared: 0 };
      }
  
      snapshot() {
        return {
          cols: this.cols,
          rows: this.rows,
          visibleRows: this.visibleRows,
          board: this.board,
          piece: { ...this.piece },
          nextQueue: [...this.nextQueue],
          holdType: this.holdType,
          score: this.score,
          running: this.running,
          paused: this.paused,
          gameOver: this.gameOver,
        };
      }
    }
  
    window.TetrisLogic = { TetrisLogic };
  })();