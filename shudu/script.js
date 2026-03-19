const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const newPuzzleBtn = document.getElementById("newPuzzleBtn");

let solution = [];
let puzzle = [];

function shuffle(arr) {
  const copied = [...arr];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function pattern(r, c) {
  return (r * 3 + Math.floor(r / 3) + c) % 9;
}

function makeSolvedBoard() {
  const base = [0, 1, 2];
  const rows = shuffle(base).flatMap((g) => shuffle(base).map((r) => g * 3 + r));
  const cols = shuffle(base).flatMap((g) => shuffle(base).map((c) => g * 3 + c));
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  return rows.map((r) => cols.map((c) => nums[pattern(r, c)]));
}

function makePuzzleFromSolution(solved, emptyCount = 45) {
  const p = solved.map((row) => [...row]);
  const indices = shuffle(Array.from({ length: 81 }, (_, i) => i));
  for (let i = 0; i < emptyCount; i += 1) {
    const index = indices[i];
    const r = Math.floor(index / 9);
    const c = index % 9;
    p[r][c] = 0;
  }
  return p;
}

function createCell(r, c, value) {
  const input = document.createElement("input");
  input.className = "cell";
  input.maxLength = 1;
  input.inputMode = "numeric";
  input.dataset.row = String(r);
  input.dataset.col = String(c);

  if (c === 2 || c === 5) input.classList.add("thick-right");
  if (r === 2 || r === 5) input.classList.add("thick-bottom");

  if (value !== 0) {
    input.value = String(value);
    input.disabled = true;
    input.classList.add("given");
  }

  input.addEventListener("input", () => {
    const n = input.value.replace(/[^1-9]/g, "");
    input.value = n;
    validateBoard();
  });

  return input;
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      boardEl.appendChild(createCell(r, c, puzzle[r][c]));
    }
  }
}

function getCurrentBoard() {
  const current = Array.from({ length: 9 }, () => Array(9).fill(0));
  boardEl.querySelectorAll(".cell").forEach((cell) => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    current[r][c] = Number(cell.value || 0);
  });
  return current;
}

function allFilled(board) {
  return board.every((row) => row.every((n) => n >= 1 && n <= 9));
}

function launchConfetti() {
  const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
  for (let i = 0; i < 110; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${1.4 + Math.random() * 1.6}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}

function validateBoard() {
  const current = getCurrentBoard();
  let hasError = false;

  boardEl.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("error");
  });

  boardEl.querySelectorAll(".cell:not(.given)").forEach((cell) => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    const val = Number(cell.value || 0);
    if (val === 0) return;
    if (solution[r][c] !== val) {
      cell.classList.add("error");
      hasError = true;
    }
  });

  if (!allFilled(current)) {
    statusEl.textContent = hasError ? "有数字不正确，请继续调整。" : "继续填写，完成后自动判定。";
    return;
  }

  if (hasError) {
    statusEl.textContent = "还有错误，检查红色格子。";
    return;
  }

  statusEl.textContent = "恭喜完成！正在撒花并刷新下一题...";
  launchConfetti();
  setTimeout(newPuzzle, 1300);
}

function newPuzzle() {
  solution = makeSolvedBoard();
  puzzle = makePuzzleFromSolution(solution, 45);
  renderBoard();
  statusEl.textContent = "新题已生成，开始挑战吧。";
}

newPuzzleBtn.addEventListener("click", newPuzzle);
newPuzzle();
