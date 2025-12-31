let todas = [];

// Carrega o JSON
fetch("publicacoes.json")
  .then(r => r.json())
  .then(dados => {
    todas = dados;
    renderizar(dados);
  });

// Busca em tempo real
document.getElementById("busca").addEventListener("input", e => {
  const termo = e.target.value.toLowerCase();

  const filtradas = todas.filter(p =>
    p.titulo.toLowerCase().includes(termo) ||
    p.palavras.join(" ").toLowerCase().includes(termo) ||
    p.autores.map(a => a.nome).join(" ").toLowerCase().includes(termo)
  );

  renderizar(filtradas);
});

function renderizar(lista) {
  const container = document.getElementById("publicacoes");
  container.innerHTML = "";

  // Agrupa por ano
  const porAno = {};
  lista.forEach(p => {
    porAno[p.ano] = porAno[p.ano] || [];
    porAno[p.ano].push(p);
  });

  // Ordena anos (decrescente)
  Object.keys(porAno)
    .sort((a, b) => b - a)
    .forEach(ano => {

      const quantidade = porAno[ano].length;

      const details = document.createElement("details");

      // 👉 ANO + CONTADOR AUTOMÁTICO
      details.innerHTML = `
        <summary>
          ${ano}
          <span style="font-weight: normal; color: #666; font-size: 0.9em;">
            (${quantidade} ${quantidade === 1 ? "trabalho" : "trabalhos"})
          </span>
        </summary>
      `;

      porAno[ano].forEach(pub => {
        const art = document.createElement("article");
        art.className = "trabalho";

        art.innerHTML = `
          <h3>
            <a href="${pub.arquivo}" target="_blank">${pub.titulo}</a>
          </h3>

          <div class="meta">
            ${pub.evento} — ${pub.local}<br>
            ${pub.data}
          </div>

          <div class="links">
            <a href="${pub.eventoLink}" target="_blank">Evento</a>
            <a href="${pub.anaisLink}" target="_blank">Anais</a>
          </div>

          <div class="palavras">
            <b>Palavras-chave:</b> ${pub.palavras.join("; ")}
          </div>

          <div class="palavras">
            <b>Autoria:</b>
            ${pub.autores
              .map(a => `<a href="${a.lattes}" target="_blank">${a.nome}</a>`)
              .join("; ")}
          </div>
        `;

        details.appendChild(art);
      });

      container.appendChild(details);
    });
}