
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
const quiz_container = document.getElementById("quiz_container");
const info_container = document.getElementById("info-container");
// let n_questions = 1;
let points = 0;

async function fetchQuestions() {
    try {
        const response = await fetch("./questions.json");
        const questions = await response.json();
        const questions_made = [];
        const questions_added = new Set();

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
    // for (let i = 1; i <= max_questions; i++) {
    //     const question = questions[i - 1];
    //     const newCard = document.createElement("div");
    //     const perguntaMultipla = document.getElementById("pergunta-multipla");

    //     perguntaMultipla.textContent = `Pergunta ${i} - ${question.question}`;
    //     newCard.id = `question-${i}`;
    //     newCard.className = "quiz-card";
    //     newCard.innerHTML +=
    //         `<h2>Pergunta ${i} - ${question.question}</h2>`;

    //     const correctAnswer = `
    //         <img src="./assets/${question.correctAnswer}.png"
    //             class="quiz-image"
    //             onclick="answer_question(true, ${i})">
    //     `;
    //     const incorrectAnswer = `
    //         <img src="./assets/${question.incorrectAnswer}.png"
    //             class="quiz-image"
    //             onclick="answer_question(false, ${i})">
    //     `;
    //     const image_container = `<div class="quiz-image-container">`;
    //     const randomImage = Math.floor(Math.random() * 2);
    //     if (randomImage === 0) {
    //         newCard.innerHTML +=
    //             image_container + correctAnswer +
    //             incorrectAnswer + "</div>";
    //     } else {
    //         newCard.innerHTML +=
    //             image_container + incorrectAnswer +
    //             correctAnswer + "</div>";
    //     }
    //     quiz.appendChild(newCard);

    //     info = questionsInfo
    //         .filter(info => info.question === question.question)[0];

    //     if (info != null) {
    //         const rowClass = i % 2 === 0 ? "info-row" : "info-row reverse";

    //         const rowHTML = `
    //         <div class="${rowClass}">
    //             <div class="info-card-content">
    //             <img src="./assets/${info.image}.png"
    //             class="info-card-image">
    //             </div>
    //             <div class="info-text-content">
    //             <p>${info.info}</p>
    //             </div>
    //         </div>
    //         `;

    //         info_container.insertAdjacentHTML("beforeend", rowHTML);
    //     }
    // }
    create_new_card(1);
}

function create_new_card(question_n) {
    if (question_n <= max_questions) {
        const question = questions[question_n - 1];
        if (question['Modo'] === "Multiplo") {
            const div_pergunta_multipla = document.getElementById("pergunta-multipla");
            const h2_pergunta_multipla = document.getElementById("pergunta-multipla-texto");
            const img_pergunta_multipla = document.getElementById("pergunta-multipla-imagem");
            const resposta_1_pergunta_multipla = document.getElementById("pergunta-multipla-tipo-1");
            const resposta_2_pergunta_multipla = document.getElementById("pergunta-multipla-tipo-2");
            const resposta_3_pergunta_multipla = document.getElementById("pergunta-multipla-tipo-3");
            div_pergunta_multipla.style.display = "block";
            h2_pergunta_multipla.textContent = `Pergunta ${question_n} - ${question.Pergunta}`;
            img_pergunta_multipla.src = `./assets/${question.Imagem}`;
        }
    } else {
        const final_question =
            document.getElementById(`question-${question_n - 1}`);
        final_question.style.display = "none";
        start_quiz_div.innerHTML = `
            <h2>Quiz terminado! Você fez ${points} pontos!</h2>
            <button onclick="location.reload()">Reiniciar Quiz</button>
        `;
        start_quiz_div.style.display = "block";
        n_questions = 1;
        points = 0;
    }
}

function answer_question(correct, question) {
    if (question === n_questions) {
        if (correct) {
            points += 1;
        }
        n_questions += 1;
        create_new_card(n_questions);
    }
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