const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadTetrisLogic() {
  const source = fs.readFileSync(path.join(__dirname, 'tetris_logic.js'), 'utf8');
  const context = {
    window: {},
    Math,
    Array,
    Object,
  };

  vm.runInNewContext(source, context, { filename: 'tetris_logic.js' });
  return context.window.TetrisLogic.TetrisLogic;
}

function createGame() {
  const TetrisLogic = loadTetrisLogic();
  return new TetrisLogic();
}

test('start initializes running game state with active piece and queue', () => {
  const game = createGame();

  game.start();

  assert.equal(game.running, true);
  assert.equal(game.paused, false);
  assert.equal(game.gameOver, false);
  assert.ok(game.piece.type);
  assert.equal(game.nextQueue.length, 6);
  assert.equal(game.board.length, game.rows);
  assert.equal(game.board[0].length, game.cols);
});

test('piece cannot move beyond left wall', () => {
  const game = createGame();
  game.start();

  for (let i = 0; i < 20; i += 1) {
    game.move(-1, 0);
  }

  const movedFurtherLeft = game.move(-1, 0);
  assert.equal(movedFurtherLeft, false);
});

test('hold can only be used once before piece locks', () => {
  const game = createGame();
  game.start();

  const firstHold = game.hold();
  const secondHold = game.hold();

  assert.equal(firstHold, true);
  assert.equal(secondHold, false);
});

test('clearLines removes full rows and keeps board dimensions', () => {
  const game = createGame();

  game.board[game.rows - 1] = Array(game.cols).fill('#f00');
  game.board[game.rows - 2] = Array(game.cols).fill('#0f0');

  const cleared = game.clearLines();

  assert.equal(cleared, 2);
  assert.equal(game.board.length, game.rows);
  assert.ok(game.board[0].every((cell) => cell === null));
  assert.ok(game.board[1].every((cell) => cell === null));
});

test('tick respects lock delay before locking grounded piece', () => {
  const game = createGame();
  game.start();

  game.spawn('O');
  game.piece.x = 4;
  game.piece.y = game.rows - 2;

  const firstTick = game.tick(1000);
  assert.equal(firstTick.locked, false);
  assert.equal(game.lockStartedAt, 1000);

  const secondTick = game.tick(1000 + game.lockDelayMs);
  assert.equal(secondTick.locked, true);
  assert.notEqual(game.piece.type, null);
});
