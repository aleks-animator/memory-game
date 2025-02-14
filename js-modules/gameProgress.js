import { getGameState } from './gameState.js';


// Function to start or reset the progress bar animation
export function startScoreProgress() {
    const progressContainer = document.getElementById('progress-container');
    const progressLine = document.getElementById('progress-line');
    const bullet = document.getElementById('bullet');

    // Get the scores for the current game mode
    const gameState = getGameState();
    const currentMode = gameState.mode;
    const scoresForMode = gameState.scores[currentMode] || [];

    // Find the lowest time in scores for the current mode or default to 60 seconds if no scores exist
    const bestTime = scoresForMode.length > 0 ? Math.min(...scoresForMode.map(score => score.score)) : 60000; // Default to 60s

    const progressBarWidth = progressLine.offsetWidth;

    // Set bullet at the start
    bullet.style.left = `0px`;

    // Calculate animation duration based on the best score
    const animationDuration = bestTime / 1000; // Convert milliseconds to seconds

    // Apply dynamic transition duration
    bullet.style.transitionDuration = `${animationDuration}s`;

    // Move the bullet smoothly to the end
    setTimeout(() => {
        bullet.style.left = `${progressBarWidth}px`;
        progressContainer.classList.add('progress-container-active'); // Add active class
    }, 100);
}

// Function to reset the progress bar
export function resetProgressBar() {
    const progressContainer = document.getElementById('progress-container');
    const bullet = document.getElementById('bullet');

    bullet.style.left = `0px`; // Reset bullet to the start
    bullet.style.transitionDuration = `0s`; // Remove transition

    // Remove active class
    progressContainer.classList.remove('progress-container-active');
}

// Function to show or hide the timer based on game state
export function toggleTimerVisibility(isVisible) {
    const counterDisplay = document.getElementById("timer");
    if (isVisible) {
        counterDisplay.classList.add("shown");
    } else {
        counterDisplay.classList.remove("shown");
    }
}
