const tetris = document.getElementById("tetris");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over");
const width = 10;
const height = 20;  // Adjusted to match larger screen size
let board = Array.from({ length: height }, () => Array(width).fill(0));

let currentTetromino;
let currentPosition = 4;
let currentRotation = 0;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

const tetrominoes = [
  { shape: [[1, 1, 1], [0, 1, 0]], color: 'red' }, // T shape
  { shape: [[1, 1], [1, 1]], color: 'blue' }, // O shape
  { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' }, // S shape
  { shape: [[1, 1, 0], [0, 1, 1]], color: 'purple' }, // Z shape
  { shape: [[1, 1, 1, 1]], color: 'cyan' }, // I shape
  { shape: [[1, 1, 1], [1, 0, 0]], color: 'orange' }, // L shape
  { shape: [[1, 1, 1], [0, 0, 1]], color: 'yellow' }, // J shape
];

function drawBoard() {
  tetris.innerHTML = '';
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const block = document.createElement("div");
      block.classList.add("block");
      if (board[row][col]) {
        block.classList.add("tetromino");
        block.style.backgroundColor = board[row][col];
      }
      tetris.appendChild(block);
    }
  }
}

function drawTetromino() {
  currentTetromino.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const index = (currentPosition + x) + (y * width);
        const div = tetris.children[index];
        div.classList.add("tetromino");
        div.style.backgroundColor = currentTetromino.color;
      }
    });
  });
}

function moveTetrominoDown() {
  if (!gameOver) {
    currentPosition += width;
    if (hasCollision()) {
      currentPosition -= width;
      placeTetromino();
      newTetromino();
      if (hasCollision()) {
        gameOver = true;
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore', highScore);
        }
        gameOverScreen.classList.remove("hidden");
        scoreDisplay.textContent = `Game Over! Final Score: ${score}`;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
        return;
      }
    }
    drawBoard();
    drawTetromino();
  }
}

function hasCollision() {
  return currentTetromino.shape.some((row, y) => {
    return row.some((cell, x) => {
      if (cell) {
        const newX = (currentPosition + x) % width;
        const newY = Math.floor((currentPosition + x) / width) + y;
        return (
          newY >= height || 
          newX < 0 || 
          newX >= width || 
          board[newY] && board[newY][newX]
        );
      }
      return false;
    });
  });
}

function placeTetromino() {
  currentTetromino.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const index = (currentPosition + x) + (y * width);
        board[Math.floor(index / width)][index % width] = currentTetromino.color;
      }
    });
  });
  clearFullLines();
}

function clearFullLines() {
  for (let row = height - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== 0)) {
      board.splice(row, 1);
      board.unshift(Array(width).fill(0));
      score += 100;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  }
}

function newTetromino() {
  const random = Math.floor(Math.random() * tetrominoes.length);
  currentTetromino = tetrominoes[random];
  currentPosition = 4;
}

function rotateTetromino() {
  const rotated = currentTetromino.shape[0].map((_, index) => currentTetromino.shape.map(row => row[index])).reverse();
  currentTetromino.shape = rotated;
  if (hasCollision()) {
    currentTetromino.shape = tetrominoes[(Math.random() * tetrominoes.length) | 0].shape;
  }
  drawBoard();
  drawTetromino();
}

function moveTetrominoLeft() {
  currentPosition--;
  if (hasCollision()) {
    currentPosition++;
  }
  drawBoard();
  drawTetromino();
}

function moveTetrominoRight() {
  currentPosition++;
  if (hasCollision()) {
    currentPosition--;
  }
  drawBoard();
  drawTetromino();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    moveTetrominoLeft();
  } else if (e.key === "ArrowRight") {
    moveTetrominoRight();
  } else if (e.key === "ArrowDown") {
    moveTetrominoDown();
  } else if (e.key === "Enter") {
    rotateTetromino();
  }
});

newTetromino();
setInterval(moveTetrominoDown, 500);
