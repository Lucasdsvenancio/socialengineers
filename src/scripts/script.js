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
var questions_made = [];
var max_questions = 4;
const start_quiz_div = document.getElementById("start_quiz_div");
const quiz_container = document.getElementById("quiz_container");
var run_type = 1; // 1 = sequencial, 2 = único
var n_questions = 1;
var points = 0;

async function fetchQuestions() {
    try {
        const response = await fetch("./questions.csv")
        const data = await response.text();
        const lines = data.trim().split("\n");
        var questions = [];
        lines.forEach(line => {
            const [question, correctAnswer, incorrectAnswer] = line.split(",");
            questions.push({
                question: question,
                correctAnswer: correctAnswer,
                incorrectAnswer: incorrectAnswer
            });
        });
        const questions_made = [];
        const questions_added = new Set();

        while (questions_made.length < max_questions && questions_added.size < questions.length) {
            const index = Math.floor(Math.random() * questions.length);
            if (!questions_added.has(index)) {
                questions_added.add(index);
                questions_made.push(questions[index]);
            }
        }
        return questions_made;
    } catch (error) {
        console.error("Erro ao buscar as perguntas:", error);
        return [];
    }
}

async function start_quiz() {
    // Cria um novo card
    const questions = await fetchQuestions();
    start_quiz_div.style.display = "none";
    for (let i = 1; i <= max_questions; i++) {
        const question = questions[i - 1]
        const newCard = document.createElement("div");
        newCard.id = `question-${i}`;
        newCard.className = "quiz-card";
        newCard.innerHTML += `<h2>Pergunta ${i} - ${question.question}</h2>`;
        
        const correctAnswer = `
            <img src="./assets/${question.correctAnswer}.jpg" class="quiz-image" onclick="answer_question(1, ${i})">
        `;
        const incorrectAnswer = `
            <img src="./assets/${question.incorrectAnswer}.jpg" class="quiz-image" onclick="answer_question(0, ${i})">
        `;
        const image_container = `<div class="quiz-image-container">`;
        const randomImage = Math.floor(Math.random() * 2);
        if (randomImage === 0) {
            newCard.innerHTML += image_container + correctAnswer + incorrectAnswer + '</div>';
        } else {
            newCard.innerHTML += image_container + incorrectAnswer + correctAnswer + '</div>';
        }
        quiz.appendChild(newCard); 
    }
    create_new_card(n_questions);
}

function create_new_card(number) {
    if (number <= max_questions) {
        if (run_type === 1) {
            const questionCard = document.getElementById(`question-${number}`)
            questionCard.style.display = "block";    
        } else {
            for (let i = 1; i < number; i++) {
                const questionCard = document.getElementById(`question-${i}`);
                questionCard.style.display = "none";
            }
            const questionCard = document.getElementById(`question-${number}`);
            questionCard.style.display = "block";
        }
    } else {
        const final_question = document.getElementById(`question-${number - 1}`);
        final_question.style.display = "none";
        start_quiz_div.innerHTML = `
            <h2>Quiz terminado! Você fez ${points} pontos!</h2>
            <button onclick="start_quiz()">Reiniciar Quiz</button>
        `;
        start_quiz_div.style.display = "block";
        // start_quiz_div.style.display = "block";
        n_questions = 1;
        points = 0;
    }    
}

function answer_question(correct, question) {
    if (question === n_questions){
        if (correct === 1) {
            points += 1;
            console.log("Acertou! Pontos: " + points);
        }
        n_questions += 1;
        create_new_card(n_questions);
    }
}

function toggle_run_type(type) {
    run_type = type;
}