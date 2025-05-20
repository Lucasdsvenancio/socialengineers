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
document.getElementById("scroll-button").addEventListener("click", function() {
    document.getElementById("definicoes").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("scroll-button-2").addEventListener("click", function() {
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