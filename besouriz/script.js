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
