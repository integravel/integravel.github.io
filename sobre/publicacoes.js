let todas = [];

fetch("publicacoes.json")
  .then(r => r.json())
  .then(dados => {
    todas = dados;
    renderizar(dados);
  });

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

  const porAno = {};
  lista.forEach(p => {
    porAno[p.ano] = porAno[p.ano] || [];
    porAno[p.ano].push(p);
  });

  Object.keys(porAno).sort((a,b)=>b-a).forEach(ano => {
    const details = document.createElement("details");
    details.innerHTML = `<summary>${ano}</summary>`;

    porAno[ano].forEach(pub => {
      const art = document.createElement("article");
      art.className = "trabalho";

      art.innerHTML = `
        <h3><a href="${pub.arquivo}" target="_blank">${pub.titulo}</a></h3>
        <div class="meta">${pub.evento} — ${pub.local}<br>${pub.data}</div>
        <div class="links">
          <a href="${pub.eventoLink}" target="_blank">Evento</a>
          <a href="${pub.anaisLink}" target="_blank">Anais</a>
        </div>
        <div class="palavras"><b>Palavras-chave:</b> ${pub.palavras.join("; ")}</div>
        <div class="palavras"><b>Autoria:</b>
          ${pub.autores.map(a => `<a href="${a.lattes}" target="_blank">${a.nome}</a>`).join("; ")}
        </div>
      `;

      details.appendChild(art);
    });

    container.appendChild(details);
  });
}