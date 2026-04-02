const board = document.getElementById("board");
  e.preventDefault();

  const index = Number(e.dataTransfer.getData("jar"));
  const jar = jarArea.children[index];

  if (jar.classList.contains("used")) return;

  jar.classList.add("used");

  const amount = levels[currentLevel].jars[index].count;
  const freeCells = [...document.querySelectorAll(".cell:not(.filled)")];

  for (let i = 0; i < amount; i++) {
    if (i < freeCells.length) {
      freeCells[i].classList.add("filled");
      freeCells[i].style.setProperty("--rot", `${Math.random() * 30 - 15}deg`);
    } else {
      errors++;
    }
  }

  errorCount.textContent = errors;

  const allUsed = [...document.querySelectorAll(".jar")].every(j => j.classList.contains("used"));

  if (allUsed) {
    const remaining = document.querySelectorAll(".cell:not(.filled)").length;

    if (remaining === 0) {
      message.textContent = "✅ Quadro completo!";
      message.style.color = "green";
    } else {
      message.textContent = `⚠️ Ainda faltam ${remaining} espaços.`;
      message.style.color = "#b57a00";
    }

    if (currentLevel < levels.length - 1) {
      nextButton.hidden = false;
    } else {
      nextButton.hidden = false;
      nextButton.textContent = `Fim do jogo! Erros totais: ${errors}`;
      nextButton.disabled = true;
    }
  }
});

nextButton.addEventListener("click", () => {
  currentLevel++;
  loadLevel();
});
