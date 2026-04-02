let levels = [];
  }

  jarElement.classList.add("used");

  const emptyCells = [...document.querySelectorAll(".cell:not(.filled)")];

  let placed = 0;

  for (let i = 0; i < jarData.count; i++) {
    if (placed < emptyCells.length) {
      const cell = emptyCells[placed];
      cell.classList.add("filled");
      cell.textContent = "🪲";
      placed++;
    } else {
      totalErrors++;
    }
  }

  errorCount.textContent = totalErrors;

  checkLevelEnd();
});

function checkLevelEnd() {
  const level = levels[currentLevel];
  const usedJars = [...document.querySelectorAll(".jar.used")].length;

  if (usedJars < level.jars.length) {
    return;
  }

  const remaining = document.querySelectorAll(".cell:not(.filled)").length;

  if (remaining === 0) {
    message.textContent = "Perfeito! O quadro ficou completo.";
    message.style.color = "green";
  } else {
    message.textContent = `Ainda sobraram ${remaining} espaços vazios.`;
    message.style.color = "#aa7700";
  }

  if (currentLevel === levels.length - 1) {
    nextButton.hidden = false;
    nextButton.textContent = `Fim do jogo - Total de erros: ${totalErrors}`;
    nextButton.disabled = true;
  } else {
    nextButton.hidden = false;
    nextButton.textContent = "Próximo nível";
    nextButton.disabled = false;
  }
}

nextButton.addEventListener("click", () => {
  if (currentLevel < levels.length - 1) {
    currentLevel++;
    loadLevel();
  }
});
