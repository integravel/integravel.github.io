let totalCells = 0;
let filledCells = 0;
let overflowErrors = 0;

async function loadPhase() {
  const response = await fetch("fase.json");
  const data = await response.json();

  // reset estado
  totalCells = data.rows * data.cols;
  filledCells = 0;
  overflowErrors = 0;

  // limpar tela
  document.getElementById("board").innerHTML = "";
  document.getElementById("jarArea").innerHTML = "";

  createBoard(data.rows, data.cols);
  createJars(data.jars);
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

    // distribuir besouros
    for (let i = 0; i < toPlace; i++) {
      emptyCells[i].textContent = "🐞";
      emptyCells[i].dataset.filled = "true";
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
        alert("✔️ Perfeito! Nenhum besouro sobrou.");
      } else {
        alert(`⚠️ Sobraram ${overflowErrors} besouro(s).`);
      }
    }, 150);
  }
}

loadPhase();
