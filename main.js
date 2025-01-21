import { gameImages, prepareImages, updateCategory } from './images.js';
import { addFlipBehavior } from './flip.js';
import { generateCards } from './init.js';
import { setGameCategory } from './state.js';

let images = prepareImages(gameImages, 6);

const board = document.getElementById("game-board-front");
const boardFrame = document.getElementById("game-board");
let revealedCards = [];
let matchedPairs = 0;
let counter = 0;
let timer;

generateCards(board, images, revealCard);

addFlipBehavior('#flip-button', boardFrame);

document.getElementById('cats-btn').addEventListener('click', function() {
    setGameCategory(this);
    resetGame();
});

document.getElementById('dogs-btn').addEventListener('click', function() {
    setGameCategory(this);
    resetGame();
});

document.getElementById('birds-btn').addEventListener('click', function() {
    setGameCategory(this);
    resetGame();
});


function revealCard(card) {
    if (!timer) {
        startCounter();
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
            revealedCards = [];
            if (matchedPairs === images.length / 2) {
                clearInterval(timer);
                setTimeout(() => alert(`Game Over: You Win! Time: ${counter} seconds`), 500);
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

function startCounter() {
    const counterDisplay = document.getElementById("timer");
    counterDisplay.classList.add("shown");
    timer = setInterval(() => {
        counter++;
        counterDisplay.textContent = `Time: ${counter}s`;
    }, 1000);
}

function resetGame() {
    const counterDisplay = document.getElementById("timer");
    revealedCards = [];
    matchedPairs = 0;
    counter = 0;
    clearInterval(timer);
    timer = null;
    counterDisplay.classList.remove("shown");

    images = prepareImages(gameImages, 6);

    generateCards(board, images, revealCard);
    counterDisplay.textContent = `Time: ${counter}s`;
}
