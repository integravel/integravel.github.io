// Navegação dos botões do rodapé
document.querySelectorAll("button[data-link]").forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = btn.dataset.link;
    });
});

// Estrutura pronta para:
// - métricas de uso
// - filtros por geração
// - carregamento dinâmico
