
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
let n_questions = 1;
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

        const correctAnswer = `
            <img src="./assets/${question.correctAnswer}.png"
                class="quiz-image"
                onclick="answer_question(true, ${i})">
        `;
        const incorrectAnswer = `
            <img src="./assets/${question.incorrectAnswer}.png"
                class="quiz-image"
                onclick="answer_question(false, ${i})">
        `;
        const image_container = `<div class="quiz-image-container">`;
        const randomImage = Math.floor(Math.random() * 2);
        if (randomImage === 0) {
            newCard.innerHTML +=
                image_container + 
                `<div style="margin: 1vw 1.5vw 0;">${correctAnswer}</div>` +
                `<div style="margin: 1vw 1.5vw 0;">${incorrectAnswer}</div>` + 
                "</div>";
        } else {
            newCard.innerHTML +=
                image_container + 
                `<div style="margin: 1vw 1.5vw 0;">${incorrectAnswer}</div>` +
                `<div style="margin: 1vw 1.5vw 0;">${correctAnswer}</div>` + 
                "</div>";
        }
        quiz.appendChild(newCard);

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
                            <h2 style="text-align: center; margin-top: 20vh;">Quiz terminado!</h2>
                            <h3 style="text-align: center;">Você fez <b>${points}</b> pontos!</h3>
                            <div style="display: flex; justify-content: center; margin: 20px 0;">
                                <div style="width: 75%; height: 12vh; background-color: #f3f3f3; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <div style="width: ${(points / 5) * 100}%; height: 1000%; background: linear-gradient(90deg,rgb(104, 175, 76), #81c784); transition: width 0.5s ease;"></div>
                                </div>
                            </div>
                            <div style="text-align: center; margin-top: 5vh;">
                                <button id = "restart_quiz" onclick="location.reload()" style="padding: 10px 20px; font-size: 16px; background-color: #1976D2; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
                                    Reiniciar Quiz
                                </button>
                            </div>
                        `;
        const scrollIntoQuizButton = document.getElementById("restart_quiz");
        scrollIntoQuizButton.style.display = "flex";
        scrollIntoQuizButton.style.margin = "0 auto 10vh auto";
        scrollIntoQuizButton.style.justifyContent = "center";
        scrollIntoQuizButton.style.width = "35vw";
        scrollIntoQuizButton.style.backgroundColor = "#3b82f6";
        scrollIntoQuizButton.style.color = "white";
        scrollIntoQuizButton.style.border = "none";
        scrollIntoQuizButton.style.padding = "18px 36px";
        scrollIntoQuizButton.style.borderRadius = "16px";
        scrollIntoQuizButton.style.cursor = "pointer";
        scrollIntoQuizButton.style.fontSize = "1.2rem";
        scrollIntoQuizButton.style.boxShadow = "0 5px 0 #1d4ed8";
        scrollIntoQuizButton.style.transition = "all 0.1s ease-in-out";

        scrollIntoQuizButton.addEventListener("mouseover", () => {
            scrollIntoQuizButton.style.transform = "translateY(-2px)";
            scrollIntoQuizButton.style.boxShadow = "0 7px 0 #1d4ed8";
        });

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