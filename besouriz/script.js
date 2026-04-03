let totalCells = 0;
let filledCells = 0;
let overflowErrors = 0;
let currentPhase = 0;
let score = 0;

// fases
const phases = [
  { rows: 3, cols: 3, jars: [4, 1, 2, 1, 2, 3] },
  { rows: 4, cols: 4, jars: [5, 3, 4, 2, 1, 6, 3] },
  { rows: 5, cols: 5, jars: [8, 6, 5, 4, 3, 2, 1, 7] }
];

// carregar progresso salvo
function loadSave() {
  const save = JSON.parse(localStorage.getItem("besouriz_save"));
  if (save) {
    currentPhase = save.phase || 0;
    score = save.score || 0;
  }
}

// salvar progresso
function saveGame() {
  localStorage.setItem("besouriz_save", JSON.stringify({
    phase: currentPhase,
    score: score
  }));
}

// embaralhar
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// HUD
function createHUD() {
  const app = document.querySelector(".app");

  const hud = document.createElement("div");
  hud.id = "hud";

  hud.innerHTML = `
    <div>
      <div id="levelInfo"></div>
      <div id="progressBar"><div id="progressFill"></div></div>
    </div>
    <div id="stars"></div>
    <div id="score"></div>
    <div id="overflowInfo"></div>
  `;

  app.prepend(hud);
}

function updateHUD() {
  document.getElementById("levelInfo").textContent =
    `Fase ${currentPhase + 1} / ${phases.length}`;

  document.getElementById("overflowInfo").textContent =
    overflowErrors > 0
      ? `Sobras: ${overflowErrors}`
      : "Perfeito";

  document.getElementById("score").textContent =
    `Pontuação: ${score}`;

  // progresso
  const progress = (filledCells / totalCells) * 100;
  document.getElementById("progressFill").style.width = progress + "%";
}

// estrelas
function calculateStars() {
  if (overflowErrors === 0) return 3;
  if (overflowErrors <= 2) return 2;
  return 1;
}

function renderStars(qtd) {
  const starsDiv = document.getElementById("stars");
  starsDiv.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    starsDiv.innerHTML += i < qtd ? "⭐" : "☆";
  }
}

// carregar fase
function loadPhase() {
  const data = phases[currentPhase];

  totalCells = data.rows * data.cols;
  filledCells = 0;
  overflowErrors = 0;

  const board = document.getElementById("board");
  const jarArea = document.getElementById("jarArea");

  board.style.opacity = 0;
  jarArea.style.opacity = 0;

  setTimeout(() => {
    board.innerHTML = "";
    jarArea.innerHTML = "";

    createBoard(data.rows, data.cols);
    createJars(shuffle([...data.jars]));

    updateHUD();

    board.style.opacity = 1;
    jarArea.style.opacity = 1;
  }, 300);
}

// tabuleiro
function createBoard(rows, cols) {
  const board = document.getElementById("board");
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.filled = "false";
    board.appendChild(cell);
  }

  enableBoardDrops();
}

// jarros
function createJars(jars) {
  const jarArea = document.getElementById("jarArea");

  jars.forEach((amount, index) => {
    const jar = document.createElement("div");
    jar.className = "jar";
    jar.id = `jar-${index}`;
    jar.draggable = true;
    jar.dataset.amount = amount;

    const size = amount >= 7 ? 11 : amount >= 5 ? 12 : amount >= 3 ? 13 : 15;

    let bugs = "";
    for (let i = 0; i < amount; i++) {
      bugs += `<span style="font-size:${size}px">🐞</span>`;
    }

    jar.innerHTML = `
      <div class="jar-top">${amount}</div>
      <div class="jar-body">${bugs}</div>
    `;

    jar.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", jar.id);
      setTimeout(() => jar.classList.add("dragging"), 0);
    });

    jar.addEventListener("dragend", () => {
      jar.classList.remove("dragging");
    });

    jarArea.appendChild(jar);
  });
}

// drop
function enableBoardDrops() {
  const board = document.getElementById("board");

  board.addEventListener("dragover", (e) => {
    e.preventDefault();
    board.classList.add("drop-target");
  });

  board.addEventListener("dragleave", () => {
    board.classList.remove("drop-target");
  });

  board.addEventListener("drop", (event) => {
    event.preventDefault();
    board.classList.remove("drop-target");

    const jarId = event.dataTransfer.getData("text/plain");
    const jar = document.getElementById(jarId);

    if (!jar || jar.classList.contains("used")) return;

    let amount = Number(jar.dataset.amount);

    const cells = document.querySelectorAll(".cell");
    const emptyCells = [...cells].filter(c => c.dataset.filled === "false");

    const toPlace = Math.min(amount, emptyCells.length);
    const extra = amount - toPlace;

    for (let i = 0; i < toPlace; i++) {
      const cell = emptyCells[i];

      setTimeout(() => {
        cell.textContent = "🐞";
        cell.dataset.filled = "true";

        cell.style.transform = "scale(1.3)";
        setTimeout(() => {
          cell.style.transform = "scale(1)";
        }, 150);

      }, i * 80);

      filledCells++;
      updateHUD();
    }

    if (extra > 0) overflowErrors += extra;

    jar.classList.add("used");

    updateHUD();
    checkEnd();
  });
}

// fim
function checkEnd() {
  if (filledCells === totalCells) {
    setTimeout(() => {
      const stars = calculateStars();
      renderStars(stars);

      score += stars * 10;

      nextPhase();
    }, 600);
  }
}

function nextPhase() {
  currentPhase++;

  if (currentPhase >= phases.length) {
    currentPhase = 0;
  }

  saveGame();
  loadPhase();
}

// init
loadSave();
createHUD();
loadPhase();