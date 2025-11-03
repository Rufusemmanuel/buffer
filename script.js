const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const restartButton = document.getElementById("restart");
const overlay = document.getElementById("overlay");
const finalScoreElement = document.getElementById("final-score");
const playAgainButton = document.getElementById("play-again");

const tileCount = 20;
const tileSize = canvas.width / tileCount;
const startLength = 4;
const startingSpeed = 140; // lower is faster (ms)
const minimumSpeed = 60;

let snake = [];
let velocity = { x: 1, y: 0 };
let queuedDirection = { x: 1, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let highScore = Number(localStorage.getItem("snake-high-score")) || 0;
let speed = startingSpeed;
let lastFrameTime = 0;
let isRunning = false;

function init() {
  highScoreElement.textContent = highScore;
  attachControls();
  resetGame();
  requestAnimationFrame(loop);
}

function resetGame() {
  snake = [];
  for (let i = startLength - 1; i >= 0; i -= 1) {
    snake.push({ x: i + 5, y: 10 });
  }
  velocity = { x: 1, y: 0 };
  queuedDirection = { ...velocity };
  score = 0;
  speed = startingSpeed;
  scoreElement.textContent = score;
  food = randomFoodPosition();
  isRunning = true;
  overlay.hidden = true;
}

function loop(timestamp) {
  if (!lastFrameTime) {
    lastFrameTime = timestamp;
  }

  const delta = timestamp - lastFrameTime;
  if (delta >= speed) {
    update();
    draw();
    lastFrameTime = timestamp;
  }

  requestAnimationFrame(loop);
}

function update() {
  if (!isRunning) {
    return;
  }

  velocity = queuedDirection;
  const nextHead = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y,
  };

  if (isOutsideBoard(nextHead) || hitsSelf(nextHead)) {
    return endGame();
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 1;
    scoreElement.textContent = score;
    updateHighScore();
    food = randomFoodPosition();
    speed = Math.max(minimumSpeed, speed - 3);
  } else {
    snake.pop();
  }
}

function draw() {
  context.fillStyle = "#0d1117";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawSnake();
  drawFood();
}

function drawGrid() {
  context.strokeStyle = "rgba(240, 246, 252, 0.05)";
  context.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += tileSize) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }

  for (let y = 0; y <= canvas.height; y += tileSize) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#2ea043");
    gradient.addColorStop(1, "#56d364");
    context.fillStyle = index === 0 ? "#56d364" : gradient;
    context.fillRect(
      segment.x * tileSize + 1,
      segment.y * tileSize + 1,
      tileSize - 2,
      tileSize - 2
    );
  });
}

function drawFood() {
  context.fillStyle = "#f85149";
  context.beginPath();
  context.roundRect(
    food.x * tileSize + tileSize * 0.1,
    food.y * tileSize + tileSize * 0.1,
    tileSize * 0.8,
    tileSize * 0.8,
    6
  );
  context.fill();
}

function randomFoodPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((segment) => segment.x === position.x && segment.y === position.y));
  return position;
}

function isOutsideBoard({ x, y }) {
  return x < 0 || x >= tileCount || y < 0 || y >= tileCount;
}

function hitsSelf(nextHead) {
  return snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);
}

function endGame() {
  isRunning = false;
  overlay.hidden = false;
  finalScoreElement.textContent = score;
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = highScore;
    localStorage.setItem("snake-high-score", String(highScore));
  }
}

function changeDirection(x, y) {
  if (!isRunning) {
    return;
  }

  const isOpposite = x === -velocity.x && y === -velocity.y;
  if (isOpposite) {
    return;
  }

  queuedDirection = { x, y };
}

function onKeyDown(event) {
  const key = event.key.toLowerCase();
  if (["arrowup", "w"].includes(key)) {
    changeDirection(0, -1);
  } else if (["arrowdown", "s"].includes(key)) {
    changeDirection(0, 1);
  } else if (["arrowleft", "a"].includes(key)) {
    changeDirection(-1, 0);
  } else if (["arrowright", "d"].includes(key)) {
    changeDirection(1, 0);
  } else if (key === "r") {
    resetGame();
  }
}

function attachControls() {
  document.addEventListener("keydown", onKeyDown);
  restartButton.addEventListener("click", resetGame);
  playAgainButton.addEventListener("click", resetGame);
  setupSwipeControls();
}

function setupSwipeControls() {
  let touchStartX = 0;
  let touchStartY = 0;

  canvas.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  canvas.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 10) {
          changeDirection(1, 0);
        } else if (deltaX < -10) {
          changeDirection(-1, 0);
        }
      } else {
        if (deltaY > 10) {
          changeDirection(0, 1);
        } else if (deltaY < -10) {
          changeDirection(0, -1);
        }
      }
    },
    { passive: true }
  );
}

init();
