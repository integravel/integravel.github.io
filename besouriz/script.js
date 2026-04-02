let totalCells = 0;
let filledCells = 0;
let overflowErrors = 0;
let currentPhase = 0;
let phases = [];

async function loadPhase() {
  const response = await fetch("fases.json");
  phases = await response.json();

  startPhase(0);
}

function startPhase(index) {
  currentPhase = index;
  filledCells = 0;
  overflowErrors = 0;

  const data = phases[index];

  document.getElementById("board").innerHTML = "";
  document.getElementById("jarArea").innerHTML = "";

  totalCells = data.rows * data.cols;

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
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function createJars(jars) {
  const jarArea = document.getElementById("jarArea");

  jars.forEach((amount, index) => {
    const jar = document.createElement("div");
    jar.className = "jar";
    jar.id = `jar-${index}`;
    jar.draggable = true;
    jar.dataset.amount = amount;

    jar.innerHTML = `
      <div class="jar-top">${amount}</div>
      <div class="jar-body">🐞</div>
    `;

    jar.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", jar.id);
    });

    jar.addEventListener("dragend", () => {
      document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("drop-target");
      });
    });

    jarArea.appendChild(jar);
  });

  enableBoardDrops();
}

function enableBoardDrops() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.addEventListener("dragover", (event) => {
      event.preventDefault();
      cell.classList.add("drop-target");
    });

    cell.addEventListener("dragleave", () => {
      cell.classList.remove("drop-target");
    });

    cell.addEventListener("drop", (event) => {
      event.preventDefault();
      cell.classList.remove("drop-target");

      const jarId = event.dataTransfer.getData("text/plain");
      const jar = document.getElementById(jarId);

      if (!jar || jar.classList.contains("used")) return;

      let amount = Number(jar.dataset.amount);

      const emptyCells = [...cells].filter(c => c.dataset.filled === "false");

      const toPlace = Math.min(amount, emptyCells.length);
      const extra = amount - toPlace;

      for (let i = 0; i < toPlace; i++) {
        emptyCells[i].textContent = "🐞";
        emptyCells[i].dataset.filled = "true";
        filledCells++;
      }

      if (extra > 0) {
        overflowErrors += extra;
      }

      jar.classList.add("used");

      if (filledCells === totalCells) {
        setTimeout(() => {
          if (overflowErrors === 0) {
            alert(`Fase ${currentPhase + 1} concluída sem erros!`);
          } else {
            alert(`Fase ${currentPhase + 1} concluída, mas sobraram ${overflowErrors} besouro(s).`);
          }

          if (currentPhase < phases.length - 1) {
            startPhase(currentPhase + 1);
          } else {
            alert("Você terminou todas as fases!");
          }
        }, 150);
      }
    });
  });
}

loadPhase();
```javascript
async function loadPhase() {
  const response = await fetch("fase.json");
  const data = await response.json();

  createBoard(data.rows, data.cols);
  createJars(data.jars);
}

function createBoard(rows, cols) {
  const board = document.getElementById("board");

  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  const total = rows * cols;

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.addEventListener("dragover", (event) => {
      event.preventDefault();
      cell.classList.add("drop-target");
    });

    cell.addEventListener("dragleave", () => {
      cell.classList.remove("drop-target");
    });

    cell.addEventListener("drop", (event) => {
      event.preventDefault();
      cell.classList.remove("drop-target");

      if (cell.textContent !== "") return;

      const jarId = event.dataTransfer.getData("text/plain");
      const jar = document.getElementById(jarId);

      const quantity = Number(jar.dataset.amount);

      cell.textContent = "🐞".repeat(quantity);
      jar.classList.add("used");
    });

    board.appendChild(cell);
  }
}

function createJars(jars) {
  const jarArea = document.getElementById("jarArea");

  jars.forEach((amount, index) => {
    const jar = document.createElement("div");
    jar.className = "jar";
    jar.id = `jar-${index}`;
    jar.draggable = true;
    jar.dataset.amount = amount;

    jar.innerHTML = `
      <div class="jar-top">${amount}</div>
      <div class="jar-body">🐞</div>
    `;

    jar.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", jar.id);
    });

    jarArea.appendChild(jar);
  });
}

loadPhase();
