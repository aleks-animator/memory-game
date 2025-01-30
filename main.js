// Importing CSS files
import './css/styles.css';
import './css/background.css';
import './css/popup.css';
import './css/progress.css';
import './css/front.css';
import './css/gameBoard.css';
import './css/typo.css';

import { gameState } from './js-modules/gameState.js';
import { gameImages, prepareImages } from './js-modules/images.js';
import { addFlipBehavior } from './js-modules/flip.js';
import { generateCards} from './js-modules/init.js';
import { checkAndShowNamePopup } from './js-modules/namePopup.js';
import { showBestResultsUi, setupLeaderboardToggle, loadGlobalScores} from './js-modules/scoreStorage.js'; 
import { startScoreProgress, toggleTimerVisibility } from './js-modules/gameProgress.js';

// Prepare images and set initial game state
gameState.images = prepareImages(gameImages, 6);

// Set up board and timer display
gameState.board = document.getElementById("game-board-front");
gameState.boardFrame = document.getElementById("game-board");
gameState.counterDisplay = document.getElementById("timer");

// Generate cards and flip behavior
generateCards(gameState.board, gameState.images);
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

function startCounter() {
    gameState.startTime = performance.now(); // Start tracking exact time
    toggleTimerVisibility(true);
    gameState.timer = setInterval(() => {
        const elapsed = performance.now() - gameState.startTime; // Elapsed time in ms
        const seconds = Math.floor(elapsed / 1000); // Total seconds
        const milliseconds = Math.floor((elapsed % 1000) / 10); // Milliseconds (0-99)

        // Format seconds and milliseconds to always show 2 digits (e.g., 09:02)
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMilliseconds = String(milliseconds).padStart(2, '0');

        // Update the display with the formatted time
        gameState.counterDisplay.textContent = `${formattedSeconds}:${formattedMilliseconds}`;
    }, 100); // Update every 100ms for smoother display
}
