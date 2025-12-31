// Torna os botões do footer navegáveis usando data-link
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("button[data-link]");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const link = button.getAttribute("data-link");
            if (link) {
                window.location.href = link;
            }
        });
    });
});