questions = [];
fetch("./questions.csv")
    .then(response => response.text())
    .then(data => {
        const lines = data.split("\n");
        lines.forEach(line => {
            const [question, correctAnswer, incorrectAnswer] = line.split(",");
            questions.push({
                question: question,
                correctAnswer: correctAnswer,
                incorrectAnswer: incorrectAnswer
            });
            console.log(questions);
        })
    })
    .catch(error => {
        console.error("Erro ao carregar o arquivo CSV:", error);
    }
);  
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

// Função para adicionar novos cards para o quiz

quiz = document.getElementById("quiz")

// Espera a função fetch executar antes de criar o card
function waitForFetch() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (questions.length > 0) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}
waitForFetch().then(() => {
    // Cria o card
    create_new_card();
});

function create_new_card() {
    // Limpa conteudo do quiz
    quiz.innerHTML = "<h2>Vamos testar seu conhecimento?</h2>";
    // Cria um novo card
    const newCard = document.createElement("div");
    newCard.className = "quiz-card";
    // Faz com que o nome da pergunta seja aleatório
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex].question;
    const correctAnswer = questions[randomIndex].correctAnswer;
    const incorrectAnswer = questions[randomIndex].incorrectAnswer;
    newCard.innerHTML = `
        <h2>${question}</h2>
        <div class="card-image">
            <img src="./assets/${correctAnswer}.jpg" class="card-image">
            <img src="./assets/${incorrectAnswer}.jpg" class="card-image">
        </div>
        <button class="card-button" onclick="create_new_card()" id="card-button">Trocar pergunta</button>
    `

    // Adiciona o card ao quiz
    quiz.appendChild(newCard);
    return newCard;
}