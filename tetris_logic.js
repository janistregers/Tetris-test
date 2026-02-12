/* global window */
(() => {
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
  
    const shuffle = (arr) => {
      const newArr = [...arr];
      for (let i = newArr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };
  
    const rotateBlocks = (blocks, cw = true) => blocks.map((b) => (cw ? { x: 3 - b.y, y: b.x } : { x: b.y, y: 3 - b.x }));
  
    class TetrisLogic {
      constructor() {
        this.cols = COLS;
        this.rows = ROWS;
        this.visibleRows = VISIBLE_ROWS;
        this.lockDelayMs = 500;
        this.start();
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
  
        if (this.canPlace(this.piece.x, this.piece.y + 1)) this.piece.y += 1;
  
        this.lockStartedAt = null;
        this.holdUsed = false;
  
        if (!this.canPlace(this.piece.x, this.piece.y)) {
          this.gameOver = true;
          this.running = false;
        }
      }
  
      move(dx, dy) {
        if (this.canPlace(this.piece.x + dx, this.piece.y + dy)) {
          this.piece.x += dx;
          this.piece.y += dy;
          this.lockStartedAt = null;
          return true;
        }
        return false;
      }
  
      lock() {
        this.piece.blocks.forEach((b) => {
          const ax = this.piece.x + b.x;
          const ay = this.piece.y + b.y;
          if (this.isInside(ax, ay)) this.board[ay][ax] = this.piece.color;
        });
  
        const cleared = this.clearLines();
        if (this.piece.y < ROWS - VISIBLE_ROWS) {
          this.gameOver = true;
          this.running = false;
        } else {
          this.spawn(this.nextQueue.shift());
          this.nextQueue.push(this.takeFromBag());
        }
        return cleared;
      }
  
      clearLines() {
        let count = 0;
        this.board = this.board.filter((row) => {
          const full = row.every((c) => c !== null);
          if (full) count += 1;
          return !full;
        });
        while (this.board.length < ROWS) {
          this.board.unshift(Array(COLS).fill(null));
        }
        return count;
      }
  
      tryRotate(dir) {
        const isCW = dir === 'CW';
        const to = isCW ? (this.piece.rotation + 1) % 4 : (this.piece.rotation + 3) % 4;
        const rotated = rotateBlocks(this.piece.blocks, isCW);
  
        const table = this.piece.type === 'I' ? KICKS_I : KICKS_JLSTZ;
        const tests = table[`${this.piece.rotation}>${to}`] || [{ x: 0, y: 0 }];
  
        for (const k of tests) {
          if (this.canPlace(this.piece.x + k.x, this.piece.y + k.y, rotated)) {
            this.piece.x += k.x;
            this.piece.y += k.y;
            this.piece.blocks = rotated;
            this.piece.rotation = to;
            this.lockStartedAt = null;
            return true;
          }
        }
        return false;
      }
  
      start() {
        this.createBoard();
        this.refillBag();
        this.nextQueue = Array.from({ length: 6 }, () => this.takeFromBag());
        this.holdType = null;
        this.running = true;
        this.gameOver = false;
        this.paused = false;
        this.spawn(this.nextQueue.shift());
      }
  
      tick(now) {
        if (!this.running || this.paused || this.gameOver) return { moved: false, locked: false, cleared: 0 };
        if (this.move(0, 1)) return { moved: true, locked: false, cleared: 0 };
  
        if (!this.lockStartedAt) this.lockStartedAt = now;
        if (now - this.lockStartedAt >= this.lockDelayMs) {
          return { moved: false, locked: true, cleared: this.lock() };
        }
        return { moved: false, locked: false, cleared: 0 };
      }
  
      snapshot() {
        return {
          ...this,
          piece: { ...this.piece },
          nextQueue: [...this.nextQueue],
        };
      }
    }
  
    window.TetrisLogic = { TetrisLogic };
  })();