let totalCells = 0;
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

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("drop-target");

  const jarId = event.dataTransfer.getData("text/plain");
  const jar = document.getElementById(jarId);

  if (!jar || jar.classList.contains("used")) {
    return;
  }

  const amount = Number(jar.dataset.amount);

  const emptyCells = [...document.querySelectorAll(".cell")].filter(
    (cell) => cell.dataset.filled === "false"
  );

  const placed = Math.min(amount, emptyCells.length);
  const leftover = amount - placed;

  for (let i = 0; i < placed; i++) {
    emptyCells[i].textContent = "🐞";
    emptyCells[i].dataset.filled = "true";
    filledCells++;
  }

  overflowErrors += leftover;

  jar.classList.add("used");

  if (filledCells === totalCells) {
    setTimeout(() => {
      if (overflowErrors === 0) {
        alert(`Fase ${currentPhase + 1} concluída sem erros!`);
      } else {
        alert(
          `Fase ${currentPhase + 1} concluída com ${overflowErrors} besouro(s) sobrando.`
        );
      }

      if (currentPhase < phases.length - 1) {
        startPhase(currentPhase + 1);
      } else {
        alert("Você terminou todas as fases!");
      }
    }, 150);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

loadPhases();
