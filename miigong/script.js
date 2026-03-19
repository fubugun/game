const menuEl = document.getElementById("menu");
const hudEl = document.getElementById("hud");
const gameWrapEl = document.getElementById("gameWrap");
const messageEl = document.getElementById("message");
const levelLabel = document.getElementById("levelLabel");
const stepLabel = document.getElementById("stepLabel");
const timeLabel = document.getElementById("timeLabel");
const difficultyLabel = document.getElementById("difficultyLabel");
const backBtn = document.getElementById("backBtn");
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const difficultyConfig = {
  easy: { name: "简单", size: 15 },
  medium: { name: "普通", size: 23 },
  hard: { name: "困难", size: 31 }
};

const totalLevels = 5;
let currentDifficulty = null;
let currentLevel = 1;
let grid = [];
let player = { x: 1, y: 1 };
let goal = { x: 1, y: 1 };
let steps = 0;
let startTime = 0;
let timer = null;

function updateHUD() {
  levelLabel.textContent = String(currentLevel);
  stepLabel.textContent = String(steps);
  difficultyLabel.textContent = currentDifficulty ? difficultyConfig[currentDifficulty].name : "-";
}

function startTimer() {
  clearInterval(timer);
  startTime = Date.now();
  timer = setInterval(() => {
    const sec = Math.floor((Date.now() - startTime) / 1000);
    timeLabel.textContent = String(sec);
  }, 250);
}

function stopTimer() {
  clearInterval(timer);
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

function buildMaze(size) {
  const m = Array.from({ length: size }, () => Array(size).fill(1));
  const stack = [{ x: 1, y: 1 }];
  m[1][1] = 0;
  const dirs = [
    { x: 0, y: -2 },
    { x: 0, y: 2 },
    { x: -2, y: 0 },
    { x: 2, y: 0 }
  ];

  while (stack.length) {
    const cur = stack[stack.length - 1];
    const choices = [];

    for (const d of dirs) {
      const nx = cur.x + d.x;
      const ny = cur.y + d.y;
      if (nx > 0 && ny > 0 && nx < size - 1 && ny < size - 1 && m[ny][nx] === 1) {
        choices.push({ nx, ny, wx: cur.x + d.x / 2, wy: cur.y + d.y / 2 });
      }
    }

    if (choices.length) {
      const next = choices[rand(choices.length)];
      m[next.wy][next.wx] = 0;
      m[next.ny][next.nx] = 0;
      stack.push({ x: next.nx, y: next.ny });
    } else {
      stack.pop();
    }
  }

  return m;
}

function findFarthestOpenCell(m) {
  const size = m.length;
  const q = [{ x: 1, y: 1, dist: 0 }];
  const seen = Array.from({ length: size }, () => Array(size).fill(false));
  seen[1][1] = true;
  let best = { x: 1, y: 1, dist: 0 };
  const dirs = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];

  while (q.length) {
    const cur = q.shift();
    if (cur.dist > best.dist) best = cur;
    for (const d of dirs) {
      const nx = cur.x + d.x;
      const ny = cur.y + d.y;
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
      if (seen[ny][nx] || m[ny][nx] === 1) continue;
      seen[ny][nx] = true;
      q.push({ x: nx, y: ny, dist: cur.dist + 1 });
    }
  }

  return { x: best.x, y: best.y };
}

function drawMaze() {
  const size = grid.length;
  const cell = canvas.width / size;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      ctx.fillStyle = grid[y][x] === 1 ? "#1f2a44" : "#f2f6ff";
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }

  ctx.fillStyle = "#ffd447";
  ctx.fillRect(goal.x * cell, goal.y * cell, cell, cell);

  ctx.fillStyle = "#3dc66f";
  ctx.fillRect(player.x * cell + cell * 0.12, player.y * cell + cell * 0.12, cell * 0.76, cell * 0.76);
}

function launchLevel() {
  const size = difficultyConfig[currentDifficulty].size;
  grid = buildMaze(size);
  player = { x: 1, y: 1 };
  goal = findFarthestOpenCell(grid);
  steps = 0;
  stepLabel.textContent = "0";
  timeLabel.textContent = "0";
  updateHUD();
  drawMaze();
  startTimer();
}

function showMessage(text) {
  messageEl.classList.remove("hidden");
  messageEl.textContent = text;
}

function hideMessage() {
  messageEl.classList.add("hidden");
}

function confettiBurst() {
  const colors = ["#f94144", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];
  for (let i = 0; i < 120; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[rand(colors.length)];
    piece.style.animationDuration = `${1.4 + Math.random() * 1.8}s`;
    piece.style.opacity = `${0.7 + Math.random() * 0.3}`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

function finishLevel() {
  stopTimer();
  if (currentLevel < totalLevels) {
    showMessage(`第 ${currentLevel} 关完成！准备进入下一关...`);
    currentLevel += 1;
    setTimeout(() => {
      hideMessage();
      launchLevel();
    }, 900);
  } else {
    showMessage(`难度「${difficultyConfig[currentDifficulty].name}」的 5 个关卡全部通关！`);
    confettiBurst();
    menuEl.classList.remove("hidden");
  }
}

function canMove(x, y) {
  return y >= 0 && y < grid.length && x >= 0 && x < grid.length && grid[y][x] === 0;
}

function move(dx, dy) {
  if (!currentDifficulty) return;
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (!canMove(nx, ny)) return;
  player = { x: nx, y: ny };
  steps += 1;
  stepLabel.textContent = String(steps);
  drawMaze();
  if (player.x === goal.x && player.y === goal.y) {
    finishLevel();
  }
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
    e.preventDefault();
  }
  if (key === "arrowup" || key === "w") move(0, -1);
  if (key === "arrowdown" || key === "s") move(0, 1);
  if (key === "arrowleft" || key === "a") move(-1, 0);
  if (key === "arrowright" || key === "d") move(1, 0);
});

document.querySelectorAll("[data-difficulty]").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentDifficulty = btn.dataset.difficulty;
    currentLevel = 1;
    menuEl.classList.add("hidden");
    hudEl.classList.remove("hidden");
    gameWrapEl.classList.remove("hidden");
    hideMessage();
    launchLevel();
  });
});

backBtn.addEventListener("click", () => {
  stopTimer();
  currentDifficulty = null;
  menuEl.classList.remove("hidden");
  hudEl.classList.add("hidden");
  gameWrapEl.classList.add("hidden");
  hideMessage();
});
