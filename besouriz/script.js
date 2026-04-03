let totalCells = 0;
let filledCells = 0;
let overflowErrors = 0;
let currentPhase = 0;
let score = 0;

// ===== FASES FIXAS =====
const basePhases = [
  { rows: 3, cols: 3, jars: [4, 1, 2, 1, 2, 3] },
  { rows: 4, cols: 4, jars: [5, 3, 4, 2, 1, 6, 3] },
  { rows: 5, cols: 5, jars: [8, 6, 5, 4, 3, 2, 1, 7] }
];

let currentData = null;

// ===== UTIL =====
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ===== DIFICULDADE INTELIGENTE =====
function getDifficultyFactor() {
  let factor = 1;

  if (overflowErrors === 0) factor += 0.5;
  if (overflowErrors >= 3) factor -= 0.3;

  return Math.max(0.7, Math.min(2, factor));
}

function generateDynamicPhase() {
  const factor = getDifficultyFactor();

  const size = Math.floor(3 + factor * 2);
  const total = size * size;

  let jars = [];
  let sum = 0;

  while (sum < total) {
    let value = Math.floor(Math.random() * (3 + factor * 4)) + 1;
    jars.push(value);
    sum += value;
  }

  return {
    rows: size,
    cols: size,
    jars: shuffle(jars)
  };
}

// ===== LOAD =====
function loadPhase() {
  if (currentPhase < basePhases.length) {
    currentData = basePhases[currentPhase];
  } else {
    currentData = generateDynamicPhase();
  }

  totalCells = currentData.rows * currentData.cols;
  filledCells = 0;
  overflowErrors = 0;

  const board = document.getElementById("board");
  const jarArea = document.getElementById("jarArea");

  board.innerHTML = "";
  jarArea.innerHTML = "";

  createBoard(currentData.rows, currentData.cols);
  createJars(currentData.jars);
}

// ===== BOARD =====
function createBoard(r, c) {
  const board = document.getElementById("board");
  board.style.gridTemplateColumns = `repeat(${c},1fr)`;

  for (let i = 0; i < r * c; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.filled = "false";
    board.appendChild(cell);
  }

  enableDrop();
}

// ===== JAR =====
function createJars(jars) {
  const area = document.getElementById("jarArea");

  jars.forEach((amount, i) => {
    const jar = document.createElement("div");
    jar.className = "jar";
    jar.id = "jar-" + i;
    jar.draggable = true;
    jar.dataset.amount = amount;

    let bugs = "";
    for (let j = 0; j < amount; j++) {
      bugs += "<span>🐞</span>";
    }

    jar.innerHTML = `
      <div class="jar-top">${amount}</div>
      <div class="jar-body">${bugs}</div>
    `;

    jar.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text", jar.id);
    });

    area.appendChild(jar);
  });
}

// ===== DROP =====
function enableDrop() {
  const board = document.getElementById("board");

  board.ondragover = e => e.preventDefault();

  board.ondrop = e => {
    e.preventDefault();

    const jar = document.getElementById(
      e.dataTransfer.getData("text")
    );

    if (!jar || jar.classList.contains("used")) return;

    let amount = Number(jar.dataset.amount);

    let empty = [...document.querySelectorAll(".cell")]
      .filter(c => c.dataset.filled === "false");

    // 🔥 distribuição aleatória
    empty = shuffle(empty);

    const place = Math.min(amount, empty.length);
    const extra = amount - place;

    for (let i = 0; i < place; i++) {
      empty[i].textContent = "🐞";
      empty[i].dataset.filled = "true";
    }

    if (extra > 0) overflowErrors += extra;

    filledCells += place;

    jar.classList.add("used");

    checkEnd();
  };
}

// ===== FIM =====
function checkEnd() {
  if (filledCells === totalCells) {
    setTimeout(() => {
      currentPhase++;
      loadPhase();
    }, 400);
  }
}

// ===== INIT =====
loadPhase();