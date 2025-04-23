// Botao de foco inicial
document.getElementById("scroll-button").addEventListener("click", function() {
    // Scroll suave para o topo
    document.getElementById("instrucoes").scrollIntoView({
        behavior: "smooth"
    });
});
// Botao de foco para quiz
document.getElementById("scroll-button-2").addEventListener("click", function() {
    // Scroll suave para o topo
    document.getElementById("quiz").scrollIntoView({
        behavior: "smooth"
    });
});