// Botões do footer sem JS inline
document.querySelectorAll("button[data-link]").forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = btn.dataset.link;
    });
});

// Espaço preparado para futuras melhorias:
// - filtros
// - ordenação
// - carregamento dinâmico
