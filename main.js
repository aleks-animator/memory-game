// Importing CSS files
import './styles.css';
import './background.css';
import './popup.css';
import './progress.css';
import './front.css';
// Your existing JS imports and code
import { gameImages, prepareImages } from './images.js';
import { addFlipBehavior } from './flip.js';
import { generateCards } from './init.js';
import { setGameCategory } from './gameMode.js';
import { checkAndShowNamePopup, getPlayerName } from './namePopup.js';
import { saveGameResult, showBestResultsUi } from './scoreStorage.js';
import { startScoreProgress, resetProgressBar, toggleTimerVisibility  } from './gameProgress.js';
import { setupLeaderboardToggle } from './scoreStorage.js';
import { saveGameResultToFirestore, fetchGlobalScores } from './scoreStorage.js'; 


let images = prepareImages(gameImages, 6);

const board = document.getElementById("game-board-front");
const boardFrame = document.getElementById("game-board");
const counterDisplay = document.getElementById("timer");
let revealedCards = [];
let matchedPairs = 0;
let startTime;
let timer;

generateCards(board, images, revealCard);
addFlipBehavior('#flip-button', boardFrame);

document.addEventListener("DOMContentLoaded", () => {
    checkAndShowNamePopup();
    showBestResultsUi();  // Show local best results on load
    setupLeaderboardToggle();
    loadGlobalScores();  // Load Firebase global scores
});

document.getElementById('flip-button').addEventListener('click', function() {
    startScoreProgress();

    if (timer) {
        clearInterval(timer); 
    }

    startCounter(); 
});

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
    if (
        card.classList.contains("revealed") ||
        card.classList.contains("matched") ||
        revealedCards.length === 2
    ) return;

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
                const timeTaken = Math.floor(performance.now() - startTime); // Exact time in ms
                const playerName = getPlayerName();
                
                saveGameResult(playerName, timeTaken);
                saveGameResultToFirestore(playerName, timeTaken);  

                setTimeout(() => {
                    alert(`Game Over: You Win! Time: ${(timeTaken / 1000).toFixed(3)}s`);
                    showBestResultsUi();
                }, 500);

                setTimeout(() => {
                    resetGame();
                    resetProgressBar(); // Reset progress bar when the game ends
                }, 1000);
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
    startTime = performance.now(); // Start tracking exact time
    toggleTimerVisibility(true);
    timer = setInterval(() => {
        const elapsed = Math.floor(performance.now() - startTime);
        counterDisplay.textContent = `Time: ${(elapsed / 1000).toFixed(1)}s`;
    }, 100); // Update every 100ms for smoother display
}

function resetGame() {
    revealedCards = [];
    matchedPairs = 0;
    clearInterval(timer);
    timer = null;
    images = prepareImages(gameImages, 6);
    generateCards(board, images, revealCard);
    counterDisplay.textContent = `Time: 0s`;

    toggleTimerVisibility(false);
}

// Show the top 10 results from Firebase
async function loadGlobalScores() {
    const globalScores = await fetchGlobalScores();

    const scoreListGlobal = document.getElementById('score-list-global');
    scoreListGlobal.innerHTML = ''; // Clear existing content

    globalScores.forEach((score, index) => {
        const formattedTime = (score.time / 1000).toLocaleString('de-DE', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        });

        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${score.player}: ${formattedTime}s`;
        scoreListGlobal.appendChild(listItem);
    });
}
