let totalCells = 0;
let filledCells = 0;
let overflowErrors = 0;

async function loadPhase() {
  const response = await fetch("fase.json");
  const data = await response.json();

  totalCells = data.rows * data.cols;

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
            alert("Fase concluída sem erros!");
          } else {
            alert(`Fase concluída, mas sobraram ${overflowErrors} besouro(s).`);
          }
        }, 150);
      }
    });
  });
}

loadPhase();
