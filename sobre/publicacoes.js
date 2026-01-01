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
    (p.palavras || []).join(" ").toLowerCase().includes(termo) ||
    (p.autores || []).map(a => a.nome).join(" ").toLowerCase().includes(termo)
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

  Object.keys(porAno)
    .sort((a, b) => b - a)
    .forEach(ano => {

      const details = document.createElement("details");
      const quantidade = porAno[ano].length;

      details.innerHTML = `
        <summary>
          ${ano}
          <span style="font-weight: normal; color: #666; font-size: 0.9em;">
            (${quantidade})
          </span>
        </summary>
      `;

      porAno[ano].forEach(pub => {
        const art = document.createElement("article");
        art.className = "trabalho";

        let html = `
          <h3>
            <a href="${pub.arquivo}" target="_blank">${pub.titulo}</a>
          </h3>
        `;

        /* =========================
           METADADOS POR TIPO
        ========================== */

        // 🔹 Artigo em periódico
        if (pub.tipo === "Artigo em Periódico") {
          html += `
            <div class="meta">
              <b>Periódico:</b> ${pub.periodico}<br>
              ${pub.data}
            </div>
          `;
        }

        // 🔹 Monografia acadêmica
        else if (pub.tipo === "Monografia Acadêmica") {
          html += `
            <div class="meta">
              <b>${pub.subtipo || "Monografia"}:</b>
              ${pub.programa || pub.instituicao || ""}<br>
              ${pub.data}
            </div>
          `;
        }

        // 🔹 Trabalho em evento (padrão)
        else {
          html += `
            <div class="meta">
              ${pub.evento}${pub.instituicao ? " — " + pub.instituicao : ""}<br>
              ${pub.data}
            </div>
          `;
        }

        /* =========================
           LINKS
        ========================== */

        const links = [];

        if (pub.eventoLink) {
          links.push(`<a href="${pub.eventoLink}" target="_blank">Evento</a>`);
        }

        if (pub.anaisLink) {
          links.push(`<a href="${pub.anaisLink}" target="_blank">Anais</a>`);
        }

        if (pub.periodicoLink) {
          links.push(`<a href="${pub.periodicoLink}" target="_blank">Periódico</a>`);
        }

        if (pub.publicacaoLink) {
          links.push(`<a href="${pub.publicacaoLink}" target="_blank">Publicação</a>`);
        }

        if (pub.repositorioLink) {
          links.push(`<a href="${pub.repositorioLink}" target="_blank">Repositório</a>`);
        }

        if (links.length > 0) {
          html += `<div class="links">${links.join(" ")}</div>`;
        }

        /* =========================
           PALAVRAS-CHAVE
        ========================== */

        if (pub.palavras && pub.palavras.length > 0) {
          html += `
            <div class="palavras">
              <b>Palavras-chave:</b> ${pub.palavras.join("; ")}
            </div>
          `;
        }

        /* =========================
           AUTORES
        ========================== */

        html += `
          <div class="palavras">
            <b>Autoria:</b>
            ${(pub.autores || [])
              .map(a =>
                a.lattes
                  ? `<a href="${a.lattes}" target="_blank">${a.nome}</a>`
                  : a.nome
              )
              .join("; ")}
          </div>
        `;

        art.innerHTML = html;
        details.appendChild(art);
      });

      container.appendChild(details);
    });
}