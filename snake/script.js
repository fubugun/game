const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const cellSize = 28;
const cells = canvas.width / cellSize;
const baseSpeed = 140;

let snake = [];
let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let best = Number(localStorage.getItem("snake_best") || 0);
let running = false;
let timer = null;

bestEl.textContent = String(best);

function randomCell() {
  return {
    x: Math.floor(Math.random() * cells),
    y: Math.floor(Math.random() * cells)
  };
}

function spawnFood() {
  let p = randomCell();
  while (snake.some((s) => s.x === p.x && s.y === p.y)) {
    p = randomCell();
  }
  food = p;
}

function resetGame() {
  snake = [
    { x: 6, y: 10 },
    { x: 5, y: 10 },
    { x: 4, y: 10 }
  ];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = "0";
  spawnFood();
}

function drawGrid() {
  ctx.fillStyle = "#0f1712";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  for (let i = 0; i <= cells; i += 1) {
    const p = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(canvas.width, p);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((seg, idx) => {
    ctx.fillStyle = idx === 0 ? "#a8ff8f" : "#53d65a";
    ctx.fillRect(seg.x * cellSize + 2, seg.y * cellSize + 2, cellSize - 4, cellSize - 4);
  });
}

function drawFood() {
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(food.x * cellSize + 4, food.y * cellSize + 4, cellSize - 8, cellSize - 8);
}

function render() {
  drawGrid();
  drawFood();
  drawSnake();
}

function gameOver() {
  running = false;
  clearInterval(timer);
  statusEl.textContent = `游戏结束！得分 ${score}，点击“开始 / 重新开始”再来一局。`;
}

function step() {
  if (!running) return;
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.y < 0 || head.x >= cells || head.y >= cells) {
    gameOver();
    return;
  }
  if (snake.some((s) => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreEl.textContent = String(score);
    if (score > best) {
      best = score;
      localStorage.setItem("snake_best", String(best));
      bestEl.textContent = String(best);
    }
    spawnFood();
  } else {
    snake.pop();
  }

  render();
}

function setDirection(newDir) {
  if (!running) return;
  if (newDir.x === -dir.x && newDir.y === -dir.y) return;
  nextDir = newDir;
}

function startGame() {
  resetGame();
  running = true;
  clearInterval(timer);
  timer = setInterval(step, baseSpeed);
  statusEl.textContent = "游戏进行中...";
  render();
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
    e.preventDefault();
  }
  if (key === "arrowup" || key === "w") setDirection({ x: 0, y: -1 });
  if (key === "arrowdown" || key === "s") setDirection({ x: 0, y: 1 });
  if (key === "arrowleft" || key === "a") setDirection({ x: -1, y: 0 });
  if (key === "arrowright" || key === "d") setDirection({ x: 1, y: 0 });
});

document.querySelectorAll("[data-dir]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const d = btn.dataset.dir;
    if (d === "up") setDirection({ x: 0, y: -1 });
    if (d === "down") setDirection({ x: 0, y: 1 });
    if (d === "left") setDirection({ x: -1, y: 0 });
    if (d === "right") setDirection({ x: 1, y: 0 });
  });
});

startBtn.addEventListener("click", startGame);
render();
