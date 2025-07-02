
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

document
    .getElementById("scroll-into-links")
    .addEventListener("click", function () {
        document
            .getElementById("links-section")
            .scrollIntoView({ behavior: "smooth" });
    });

document
    .getElementById("scroll-into-info-section")
    .addEventListener("click", function () {
        document
            .getElementById("info-section")
            .scrollIntoView({ behavior: "smooth" });
    });

document
    .getElementById("scroll-into-more-info-section")
    .addEventListener("click", function () {
        document
            .getElementById("more-info-section")
            .scrollIntoView({ behavior: "smooth" });
    });

window.addEventListener("keydown", function (e) {
    // Lista de teclas que causam rolagem
    const keys = [
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        "PageUp", "PageDown", "Home", "End", " "
    ];
    if (keys.includes(e.key)) {
        e.preventDefault();
    }
}, { passive: false });

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

let carouselCardNumDisplay;
carouselCardNumDisplay = document.getElementById("carousel-card-num-display");

const prevIndex = (currentIndex === 0 ? cards.length - 1 : currentIndex - 1);
const nextIndex = (currentIndex === cards.length - 1 ? 0 : currentIndex + 1);

cards[prevIndex].classList.add("prev");
cards[nextIndex].classList.add("next");

function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
    carouselCardNumDisplay.textContent = (1+currentIndex) + "/10";
}

function prevCard() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
    carouselCardNumDisplay.textContent = (1+currentIndex) + "/10";
}

document
    .querySelector(".next-button")
    .addEventListener("click", nextCard);
document
    .querySelector(".prev-button")
    .addEventListener("click", prevCard);

updateCarousel();

// Quiz
let maxQuestions = 4;
const startQuizDiv = document.getElementById("start-quiz-div");
const scoreContainer = document.getElementById("score-container");
const infoContainer = document.getElementById("info-container");
let points = 0;

async function fetchQuestions() {
    try {
        const response = await fetch("./questions.json");
        const questions = await response.json();
        const questionsMade = [];
        const questionsAdded = new Set();
        if (maxQuestions > questions.length) {
            maxQuestions = questions.length;
        }
        while (
            questionsMade.length < maxQuestions &&
            questionsAdded.size < questions.length
        ) {
            const index = Math.floor(Math.random() * questions.length);
            if (!questionsAdded.has(index)) {
                questionsAdded.add(index);
                questionsMade.push(questions[index]);
            }
        }
        return questionsMade;
    } catch (error) {
        console.error("Erro ao buscar as perguntas:", error);
        return [];
    }
}

async function startQuiz() {
    questions = await fetchQuestions();
    startQuizDiv.style.display = "none";
    createNewCard(1);
}

function resetQuiz() {
    startQuizDiv.style.display = "flex";
    startQuizDiv.style.justifyContent = "center";
    startQuizDiv.style.alignItems = "center";
    startQuizDiv.style.height = "100vh";
    startQuizDiv.style.flexDirection = "column";
    startQuizDiv.style.gap = "4rem";

    scoreContainer.style.display = "none";

    document.getElementById("info-section").style.display = "none";

    while (infoContainer.firstChild) {
        infoContainer.removeChild(infoContainer.firstChild);
    }

    document.getElementById("quiz").scrollIntoView({ behavior: "auto" });
}

function randomOrder(N) {
    const arr = Array.from({ length: N }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function createNewCard(questionN) {
    const divPerguntaMultipla = document.getElementById("pergunta-multipla");
    divPerguntaMultipla.style.display = "none";
    const divPerguntaVerdadeiroFalso = document.getElementById("pergunta-verdadeiro-falso");
    divPerguntaVerdadeiroFalso.style.display = "none";
    if (questionN <= maxQuestions) {
        const question = questions[questionN - 1];
        if (question["Modo"] === "Multipla Escolha") {
            const h2PerguntaMultipla = document.getElementById("pergunta-multipla-texto");
            const imgPerguntaMultipla = document.getElementById("pergunta-multipla-imagem");
            divPerguntaMultipla.style.display = "block";
            h2PerguntaMultipla.textContent = `Pergunta ${questionN} - ${question.Pergunta}`;
            imgPerguntaMultipla.src = `./assets/${question.Imagem}.png`;
            const randomOrderAnswers = randomOrder(3);
            for (let i = 1; i <= 3; i++) {
                const answer = document.getElementById(`pergunta-multipla-tipo-${i}`);
                const answerFromDb = question.Alternativas[randomOrderAnswers[i - 1]];
                answer.textContent = answerFromDb;
                answer.onclick = function () {
                    answerQuestion(questionN, answerFromDb);
                };
            }

        } else if (question["Modo"] === "Verdadeiro ou Falso") {
            const h2PerguntaVerdadeiroFalso = document.getElementById("pergunta-verdadeiro-falso-texto");
            divPerguntaVerdadeiroFalso.style.display = "block";
            h2PerguntaVerdadeiroFalso.textContent = `Pergunta ${questionN} - ${question.Pergunta}`;
            const randomOrderAnswers = randomOrder(2);
            for (let i = 1; i <= 2; i++) {
                const answer = document.getElementById(`pergunta-verdadeiro-falso-imagem-${i}`);
                const answerFromDb = question.Alternativas[randomOrderAnswers[i - 1]];
                answer.src = `./assets/${answerFromDb}.png`;
                answer.onclick = function () {
                    answerQuestion(questionN, answerFromDb);
                };
            }

        }
    } else {
        scoreContainer.style.display = "block";
        const quizResult = document.getElementById("quiz-result");
        quizResult.textContent = `Você acertou ${points} de ${maxQuestions} perguntas!`;

        const quizProgressBar = document.getElementById("progressbar");
        const quizProgressBarDiv = quizProgressBar.querySelector("div");
        let pointsString = 100*(points/questions.length) + "%";
        quizProgressBarDiv.style.width = pointsString;
        points = 0;
    }
}

function createNewInfoCard(questionN, isCorrect) {
    const infoSection = document.getElementById("info-section");
    infoSection.style.display = "block";

    const question = questions[questionN - 1];

    const infoDiv = document.createElement("div");
    infoDiv.className = "info-card";

    const isEven = questionN % 2 === 0;

    const imgDiv = document.createElement("div");
    imgDiv.className = "info-card-img";

    const textDiv = document.createElement("div");
    textDiv.className = "info-card-text";

    const feedbackText = document.createElement("h3");
    feedbackText.style.textAlign = "center";
    feedbackText.style.marginBottom = "10px";
    feedbackText.style.fontSize = "1.5rem";
    feedbackText.style.fontWeight = "bold";

    if (isCorrect) {
        feedbackText.textContent = "Você Acertou!";
        feedbackText.style.color = "green";
    } else {
        feedbackText.textContent = "Você Errou!";
        feedbackText.style.color = "red";
    }
    textDiv.appendChild(feedbackText);

    let img = document.createElement("img");
    img.className = "info-card-image";
    if (question.Modo === "Multipla Escolha") {
        img.src = `./assets/${question.Imagem}.png`;
        img.alt = "Imagem da questão";
    } else if (question.Modo === "Verdadeiro ou Falso") {
        img.src = `./assets/${question.Resposta}.png`;
        img.alt = "Resposta correta";
    }
    imgDiv.appendChild(img);

    const explicacao = document.createElement("p");
    explicacao.className = "info-card-explicacao";
    explicacao.textContent = question.Explicacao || "Sem explicação disponível.";
    textDiv.appendChild(explicacao);

    if (isEven) {
        infoDiv.appendChild(textDiv);
        infoDiv.appendChild(imgDiv);

        const infoCardImgIdString = "info-card-img" + questionN;
        imgDiv.setAttribute("id", infoCardImgIdString);
    } else {
        infoDiv.appendChild(imgDiv);
        infoDiv.appendChild(textDiv);
    }

    infoContainer.appendChild(infoDiv);
}

function answerQuestion(questionN, answer) {
    const question = questions[questionN - 1];

    const isCorrect = question.Resposta === answer;

    if (isCorrect) {
        points += 1;
    }
    createNewInfoCard(questionN, isCorrect);
    console.log("Criado card informativo para a pergunta " + questionN);
    createNewCard(questionN + 1);
}

//Navegação por botões
let sections = [];
let currentSectionIndex = 0;

function getVisibleSections() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    let selectors;
    if(w > 768){
        selectors = "header, section[id], footer";
    }else{
        selectors = "header, section[id], footer, div#info-card-img2";
    }

    return Array.from(document.querySelectorAll(selectors)).filter(section => {
        const isVisible = section.offsetParent !== null;
        return isVisible;
    });
}

function updateCurrentSectionIndex() {
    let closestIndex = 0;
    let closestDistance = Infinity;

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    currentSectionIndex = closestIndex;
}

let updateButtonsVisibility;

window.addEventListener("scroll", () => {
    sections = getVisibleSections();
    updateCurrentSectionIndex();
    if (typeof updateButtonsVisibility === "function") {
        updateButtonsVisibility();
    }
});

window.addEventListener("resize", () => {
    sections = getVisibleSections();
    updateCurrentSectionIndex();
});

// botões back to top, go down e go up
document.addEventListener("DOMContentLoaded", () => {
    const backToTopBtn = document.getElementById("back-to-top-btn");
    const goDownBtn = document.getElementById("go-down-btn");
    const goUpBtn = document.getElementById("go-up-btn");

    sections = getVisibleSections();
    currentSectionIndex = 0;

    const observerOptions = {
        root: null,
        threshold: 0.6
    };

    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sections = getVisibleSections();
                currentSectionIndex = sections.indexOf(entry.target);
                updateButtonsVisibility();
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    function updateButtonsVisibility() {
        // goUpBtn e bactToTopBtn só visíveis a partir do quiz
        if (currentSectionIndex > 0) {
            goUpBtn.classList.add("show");
            backToTopBtn.classList.add("show");
        } else {
            goUpBtn.classList.remove("show");
            backToTopBtn.classList.remove("show");
        }

        // esconde goDownBtn na última tela e no header
        if (currentSectionIndex > 0 && currentSectionIndex < sections.length - 1) {
            goDownBtn.classList.add("show");
            goUpBtn.classList.remove("opaque");
            backToTopBtn.classList.remove("opaque");

        } else {
            goDownBtn.classList.remove("show");
            goUpBtn.classList.add("opaque");
            backToTopBtn.classList.add("opaque");
        }
    }

    goDownBtn.addEventListener("click", () => {
        sections = getVisibleSections();
        updateCurrentSectionIndex();

        const nextIndex = currentSectionIndex + 1;
        if (nextIndex < sections.length) {
            sections[nextIndex].scrollIntoView({ behavior: "smooth" });
        }
    });

    goUpBtn.addEventListener("click", () => {
        sections = getVisibleSections();
        updateCurrentSectionIndex();

        const prevIndex = currentSectionIndex - 1;
        if (prevIndex >= 0) {
            sections[prevIndex].scrollIntoView({ behavior: "smooth" });
        }
    });

    backToTopBtn.addEventListener("click", () => {
        sections = getVisibleSections();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
