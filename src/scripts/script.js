
// Scroll suave para as seções
document
    .getElementById("scroll-into-definitions")
    .addEventListener("click", function () {
        document
            .getElementById("definitions")
            .scrollIntoView({ behavior: "smooth" });
    });

document
    .getElementById("scroll-into-quiz")
    .addEventListener("click", function () {
        document
            .getElementById("quiz")
            .scrollIntoView({ behavior: "smooth" });
    });

// Carousel
const track = document.querySelector(".carousel-track");
const cards = Array.from(track.children);

let currentIndex = 0;

function updateCarousel() {
    cards.forEach(function (card) {
        card.classList.remove("active", "prev", "next");
        card.style.pointerEvents = "none";
    });

    cards[currentIndex].classList.add("active");
    cards[currentIndex].style.pointerEvents = "auto";

    const prevIndex =
        (currentIndex === 0
            ? cards.length - 1
            : currentIndex - 1
        );
    const nextIndex =
        (currentIndex === cards.length - 1
            ? 0
            : currentIndex + 1
        );

    cards[prevIndex].classList.add("prev");
    cards[nextIndex].classList.add("next");
}

const prevIndex = (currentIndex === 0 ? cards.length - 1 : currentIndex - 1);
const nextIndex = (currentIndex === cards.length - 1 ? 0 : currentIndex + 1);

cards[prevIndex].classList.add("prev");
cards[nextIndex].classList.add("next");

function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
}

function prevCard() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
}

document
    .querySelector(".next-button")
    .addEventListener("click", nextCard);
document
    .querySelector(".prev-button")
    .addEventListener("click", prevCard);

updateCarousel();

// Quiz
let questions = [];
let max_questions = 4;
const start_quiz_div = document.getElementById("start_quiz_div");
const score_container = document.getElementById("score_container");
const quiz_container = document.getElementById("quiz_container");
const info_container = document.getElementById("info-container");
let n_questions = 1;
let points = 0;

async function fetchQuestions() {
    try {
        const response = await fetch("./questions.json");
        const questions = await response.json();
        const questions_made = [];
        const questions_added = new Set();
        if (max_questions > questions.length) {
            max_questions = questions.length;
        }
        while (
            questions_made.length < max_questions &&
            questions_added.size < questions.length
        ) {
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
    questions = await fetchQuestions();
    start_quiz_div.style.display = "none";
    create_new_card(1);
}

function reset_quiz() {
    start_quiz_div.style.display = "block";
    score_container.style.display = "none";
}

function random_order(N) {
    const arr = Array.from({ length: N }, (_, i) => i); // cria [0, 1, 2, ..., N-1]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // índice aleatório
        [arr[i], arr[j]] = [arr[j], arr[i]]; // troca os elementos
    }
    return arr;
}

function create_new_card(question_n) {
    const div_pergunta_multipla = document.getElementById("pergunta-multipla");
    div_pergunta_multipla.style.display = "none";
    const div_pergunta_verdadeiro_falso = document.getElementById("pergunta-verdadeiro-falso");
    div_pergunta_verdadeiro_falso.style.display = "none";
    if (question_n <= max_questions) {
        const question = questions[question_n - 1];
        if (question['Modo'] === "Multipla Escolha") {
            const h2_pergunta_multipla = document.getElementById("pergunta-multipla-texto");
            const img_pergunta_multipla = document.getElementById("pergunta-multipla-imagem");
            div_pergunta_multipla.style.display = "block";
            h2_pergunta_multipla.textContent = `Pergunta ${question_n} - ${question.Pergunta}`;
            img_pergunta_multipla.src = `./assets/${question.Imagem}.png`;
            const random_order_answers = random_order(3);
            for (let i = 1; i <= 3; i++) {
                const answer = document.getElementById(`pergunta-multipla-tipo-${i}`);
                const answer_from_db = question.Alternativas[random_order_answers[i - 1]];
                answer.textContent = answer_from_db;
                answer.onclick = function () {
                    answer_question(question_n, answer_from_db);
                };
            }

        } else if (question['Modo'] === "Verdadeiro ou Falso") {
            const h2_pergunta_verdadeiro_falso = document.getElementById("pergunta-verdadeiro-falso-texto");
            div_pergunta_verdadeiro_falso.style.display = "block";
            h2_pergunta_verdadeiro_falso.textContent = `Pergunta ${question_n} - ${question.Pergunta}`;
            const random_order_answers = random_order(2);
            for (let i = 1; i <= 2; i++) {
                const answer = document.getElementById(`pergunta-verdadeiro-falso-imagem-${i}`);
                const answer_from_db = question.Alternativas[random_order_answers[i - 1]];
                answer.src = `./assets/${answer_from_db}.png`;
                answer.onclick = function () {
                    answer_question(question_n, answer_from_db);
                };
            }

        }
    } else {
        score_container.style.display = "block";
        const quiz_result = document.getElementById("quiz_result");
        quiz_result.textContent = `Você acertou ${points} de ${max_questions} perguntas!`;
        points = 0;
    }
}

function answer_question(question_n, answer) {
    const question = questions[question_n - 1];
    if (question.Resposta === answer) {
        points += 1;
    }
    create_new_card(question_n + 1);
}

// botao back to top
document.addEventListener("DOMContentLoaded", function () {

    const backToTopBtn = document.getElementById("back-to-top-btn");


    if (!backToTopBtn) return;


    window.onscroll = function () {

        let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;


        if (scrollPosition > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    };


    backToTopBtn.onclick = function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
});