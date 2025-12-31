// Navegação dos botões do footer (evita JS inline)
document.querySelectorAll("button[data-link]").forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = btn.dataset.link;
    });
});

// Preparado para futuras melhorias:
// - analytics
// - animações progressivas
// - carregamento dinâmico de cards