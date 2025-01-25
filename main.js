// Importing CSS files
import './styles.css';
import './background.css';
import './popup.css';
import './progress.css';
import './front.css';


import { gameState } from './gameState.js';
import { gameImages, prepareImages } from './images.js';
import { addFlipBehavior } from './flip.js';
import { generateCards, resetGame, revealCard } from './init.js';
import { setGameCategory } from './gameMode.js';
import { checkAndShowNamePopup } from './namePopup.js';
import { showBestResultsUi, setupLeaderboardToggle, loadGlobalScores} from './scoreStorage.js';  // Consolidated imports
import { startScoreProgress, toggleTimerVisibility } from './gameProgress.js';

// Prepare images and set initial game state
gameState.images = prepareImages(gameImages, 6);

// Set up board and timer display
gameState.board = document.getElementById("game-board-front");
gameState.boardFrame = document.getElementById("game-board");
gameState.counterDisplay = document.getElementById("timer");

// Generate cards and flip behavior
generateCards(gameState.board, gameState.images, revealCard);
addFlipBehavior('#flip-button', gameState.boardFrame);

document.addEventListener("DOMContentLoaded", () => {
    checkAndShowNamePopup();
    showBestResultsUi();  // Show local best results on load
    setupLeaderboardToggle();
    loadGlobalScores();  // Load Firebase global scores
});

document.getElementById('flip-button').addEventListener('click', function() {
    startScoreProgress();

    if (gameState.timer) {
        clearInterval(gameState.timer);
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

function startCounter() {
    gameState.startTime = performance.now(); // Start tracking exact time
    toggleTimerVisibility(true);
    gameState.timer = setInterval(() => {
        const elapsed = Math.floor(performance.now() - gameState.startTime);
        gameState.counterDisplay.textContent = `Time: ${(elapsed / 1000).toFixed(1)}s`;
    }, 100); // Update every 100ms for smoother display
}

