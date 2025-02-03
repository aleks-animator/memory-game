// Importing CSS files
import './css/main.scss';

import { getGameState, setGameState } from './js-modules/gameState.js';
import { gameImages, prepareImages } from './js-modules/images.js';
import { addFlipBehavior } from './js-modules/flip.js';
import { generateCards } from './js-modules/init.js';
import { checkAndShowNamePopup, updatePlayerName } from './js-modules/namePopup.js';
import { showBestResultsUi, setupLeaderboardToggle, loadGlobalScores } from './js-modules/scoreStorage.js';
import { startScoreProgress, toggleTimerVisibility } from './js-modules/gameProgress.js';
import { initChart } from './js-modules/chart.js';
import { createRankingTooltip } from './js-modules/tooltip.js';

// Prepare images and set initial game state
setGameState({
    images: prepareImages(gameImages, 6)
});

// Set up board and timer display
setGameState({
    board: document.getElementById("game-board-front"),
    boardFrame: document.getElementById("game-board"),
    counterDisplay: document.getElementById("timer")
});

// Generate cards and flip behavior
generateCards(getGameState().board, getGameState().images);
addFlipBehavior('#flip-button', getGameState().boardFrame);

document.addEventListener("DOMContentLoaded", async () => {
    checkAndShowNamePopup();
    updatePlayerName();
    showBestResultsUi();  
    setupLeaderboardToggle();
    await loadGlobalScores(); 
    initChart(); 
    createRankingTooltip(".team-rank"); 
});

document.getElementById('flip-button').addEventListener('click', function () {
    startScoreProgress();
    const { timer } = getGameState();
    if (timer) {
        clearInterval(timer);
    }
    startCounter();
});

function startCounter() {
    const startTime = performance.now(); // Start tracking exact time
    setGameState({ startTime });

    toggleTimerVisibility(true);

    // Start the timer and store its ID in the state
    const timer = setInterval(() => {
        const { startTime, counterDisplay } = getGameState();

        if (!startTime || !counterDisplay) {
            clearInterval(timer); // Stop the timer if startTime or counterDisplay is missing
            return;
        }

        const elapsed = performance.now() - startTime; // Elapsed time in ms
        const seconds = Math.floor(elapsed / 1000); // Total seconds
        const milliseconds = Math.floor((elapsed % 1000) / 10); // Milliseconds (0-99)

        // Format seconds and milliseconds to always show 2 digits (e.g., 09:02)
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMilliseconds = String(milliseconds).padStart(2, '0');

        // Update the display with the formatted time
        counterDisplay.textContent = `${formattedSeconds}:${formattedMilliseconds}`;
    }, 100); // Update every 100ms for smoother display

    setGameState({ timer });
}