let totalCells = 0;
let filledCells = 0;
let overflowErrors = 0;
let currentPhase = 0;

// DUAS FASES
const phases = [
  {
    rows: 3,
    cols: 3,
    jars: [4, 1, 2, 1, 2, 3]
  },
  {
    rows: 4,
    cols: 4,
    jars: [5, 3, 4, 2, 1, 6, 3]
  }
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadPhase() {
  const data = phases[currentPhase];

  totalCells = data.rows * data.cols;
  filledCells = 0;
  overflowErrors = 0;

  document.getElementById("board").innerHTML = "";
  document.getElementById("jarArea").innerHTML = "";

  createBoard(data.rows, data.cols);
  createJars(shuffle([...data.jars]));
}

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

function createJars(jars) {
  const jarArea = document.getElementById("jarArea");

  jars.forEach((amount, index) => {
    const jar = document.createElement("div");
    jar.className = "jar";
    jar.id = `jar-${index}`;
    jar.draggable = true;
    jar.dataset.amount = amount;

    // cria besouros visuais
    let bugs = "";
    for (let i = 0; i < amount; i++) {
      bugs += "<span>🐞</span>";
    }

    jar.innerHTML = `
      <div class="jar-top">${amount}</div>
      <div class="jar-body">${bugs}</div>
    `;

    jar.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", jar.id);

      setTimeout(() => {
        jar.classList.add("dragging");
      }, 0);
    });

    jar.addEventListener("dragend", () => {
      jar.classList.remove("dragging");
    });

    jarArea.appendChild(jar);
  });
}

function enableBoardDrops() {
  const board = document.getElementById("board");

  board.addEventListener("dragover", (event) => {
    event.preventDefault();
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
    }

    if (extra > 0) {
      overflowErrors += extra;
    }

    jar.classList.add("used");

    checkEnd();
  });
}

function checkEnd() {
  if (filledCells === totalCells) {
    setTimeout(() => {
      if (overflowErrors === 0) {
        alert("Perfeito! Avançando para a próxima fase...");
      } else {
        alert(`Sobraram ${overflowErrors} besouros.`);
      }

      nextPhase();
    }, 400);
  }
}

function nextPhase() {
  currentPhase++;

  if (currentPhase >= phases.length) {
    alert("Você completou todas as fases! 🎉");
    currentPhase = 0;
  }

  loadPhase();
}

loadPhase();