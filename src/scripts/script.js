let questions = [];
fetch("./questions.csv")
    .then(response => response.text())
    .then(data => {
        const lines = data.trim().split("\n");
        lines.forEach(line => {
            const [question, correctAnswer, incorrectAnswer] = line.split(",");
            questions.push({
                question: question,
                correctAnswer: correctAnswer,
                incorrectAnswer: incorrectAnswer
            });
        });
    })
    .catch(error => {
        console.error("Erro ao carregar o arquivo CSV:", error);
    });

// Scroll suave para as seções
document.getElementById("scroll-into-definitions").addEventListener("click", function() {
    document.getElementById("definitions").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("scroll-into-quiz").addEventListener("click", function() {
    document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
});

// Carousel
const track = document.querySelector('.carousel-track');
const cards = Array.from(track.children);

let currentIndex = 0;

function updateCarousel() {
    cards.forEach((card) => {
        card.classList.remove('active', 'prev', 'next');
        card.style.pointerEvents = 'none';
    });

cards[currentIndex].classList.add('active');
cards[currentIndex].style.pointerEvents = 'auto';

const prevIndex = (currentIndex === 0) ? cards.length - 1 : currentIndex - 1;
const nextIndex = (currentIndex === cards.length - 1) ? 0 : currentIndex + 1;

cards[prevIndex].classList.add('prev');
cards[nextIndex].classList.add('next');
}

const prevIndex = (currentIndex === 0) ? cards.length - 1 : currentIndex - 1;
const nextIndex = (currentIndex === cards.length - 1) ? 0 : currentIndex + 1;

cards[prevIndex].classList.add('prev');
cards[nextIndex].classList.add('next');

function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
}
    
function prevCard() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
}
    
document.querySelector('.next-button').addEventListener('click', nextCard);
document.querySelector('.prev-button').addEventListener('click', prevCard);
    
updateCarousel();

// Quiz

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

var questions_made = []
var points = 0;

function create_new_card(correct) {
    if (correct === 1) {
        points += 1;
        console.log("Acertou! Pontos: " + points);
    }
    // Limpa conteudo do quiz
    quiz.innerHTML = "<h2>Vamos testar seu conhecimento?</h2>";
    // Cria um novo card
    const newCard = document.createElement("div");
    newCard.className = "quiz-card";
    // Faz com que o nome da pergunta seja aleatório
    var randomIndex = 0;
    for (let i = 0; i < questions.length; i++) {
        var index = Math.floor(Math.random() * questions.length)
        if (!(index  in questions_made)) {
            randomIndex = index;
            break;
        }
    }
    const question = questions[randomIndex].question;
    const correctAnswer = questions[randomIndex].correctAnswer;
    const incorrectAnswer = questions[randomIndex].incorrectAnswer;
    newCard.innerHTML = `
        <h2>${question}</h2>
        <div class="quiz-image-container">
            <img src="./assets/${correctAnswer}.jpg" class="quiz-image" onclick="create_new_card(1)">
            <img src="./assets/${incorrectAnswer}.jpg" class="quiz-image" onclick="create_new_card(0)">
        </div>
    `

    // Adiciona o card ao quiz
    quiz.appendChild(newCard);
    return newCard;
}