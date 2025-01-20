import { gameImages, prepareImages, updateCategory } from './images.js';
import { addFlipBehavior } from './flip.js';
import { generateCards } from './init.js';

let images = prepareImages(gameImages, 6);

const board = document.getElementById("game-board-front");
const boardFrame = document.getElementById("game-board");
let revealedCards = [];
let matchedPairs = 0;
let timerStarted = false;
let timer;
let timeLeft = 30;

generateCards(board, images, revealCard);

addFlipBehavior('#flip-button', boardFrame);

// Event listeners for the pill buttons
document.getElementById('cats-btn').addEventListener('click', () => {
    if (!document.getElementById('cats-btn').classList.contains('pill-button--active')) {
        document.getElementById('cats-btn').classList.add('pill-button--active');
        document.getElementById('dogs-btn').classList.remove('pill-button--active');
        document.body.classList.remove('dog-mode');
        document.body.classList.add('cat-mode');  // Add "cat-mode" to body
        updateCategory('cats');  // Switch to cats folder
        resetGame();  // Reset game with new images
    }
});

document.getElementById('dogs-btn').addEventListener('click', () => {
    if (!document.getElementById('dogs-btn').classList.contains('pill-button--active')) {
        document.getElementById('dogs-btn').classList.add('pill-button--active');
        document.getElementById('cats-btn').classList.remove('pill-button--active');
        document.body.classList.remove('cat-mode');
        document.body.classList.add('dog-mode');  // Add "dog-mode" to body
        updateCategory('dogs');  // Switch to dogs folder
        resetGame();  // Reset game with new images
    }
});

function revealCard(card) {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    if (
        card.classList.contains("revealed") ||
        card.classList.contains("matched") ||
        revealedCards.length === 2
    )
        return;

    card.classList.remove("hidden");
    card.classList.add("revealed");
    revealedCards.push(card);

    if (revealedCards.length === 2) {
        const [first, second] = revealedCards;

        const isMatch =
            first.querySelector("img").dataset.id ===
            second.querySelector("img").dataset.id;

        if (isMatch) {
            first.classList.add("matched");
            second.classList.add("matched");
            matchedPairs++;
            revealedCards = []; // Clear revealed cards
            if (matchedPairs === images.length / 2) {
                clearTimeout(timer);
                setTimeout(() => alert("Game Over: You Win!"), 500);
                setTimeout(() => resetGame(), 1000);
            }
        } else {
            setTimeout(() => {
                first.classList.remove("revealed");
                second.classList.remove("revealed");
                first.classList.add("hidden");
                second.classList.add("hidden");
                revealedCards = [];
            }, 1000);
        }
    }
}

function startTimer() {
    const timerDisplay = document.getElementById("timer");
    timerDisplay.classList.add("shown");
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Game Over: You Lose!");
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    const timerDisplay = document.getElementById("timer");
    revealedCards = [];
    matchedPairs = 0;
    timerStarted = false;
    timeLeft = 30;
    timerDisplay.classList.remove("shown");

    images = prepareImages(gameImages, 6);

    generateCards(board, images, revealCard); // Regenerate the cards with the new images
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
}
