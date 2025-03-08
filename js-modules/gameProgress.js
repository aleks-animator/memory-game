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

    let bestTime = 60000;
    let bestPlayer = "Unknown";

    if (scoresForMode.length > 0) {
        const bestScoreEntry = scoresForMode.reduce((best, current) =>
            current.score < best.score ? current : best
        );

        bestTime = bestScoreEntry.score;
        bestPlayer = bestScoreEntry.player;
    }

    const progressBarWidth = progressLine.offsetWidth;

    // Set bullet at the start
    bullet.style.left = `0px`;

    // Calculate animation duration based on the best score
    const animationDuration = bestTime / 1000; // Convert milliseconds to seconds

    // Apply dynamic transition duration
    bullet.style.transitionDuration = `${animationDuration}s`;

    // Write Best score to highlight element
    const scoreText = document.querySelector('.score-to-beat__text');

    if (scoreText) {
        const seconds = Math.floor(bestTime / 1000); // Get full seconds
        const milliseconds = (bestTime % 1000).toString().padStart(3, '0').slice(0, 2);
        scoreText.textContent = `${bestPlayer} ${seconds}:${milliseconds}`;

        // Start floating animation
        animateScoreHighlight();
    }

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

    // Reset floating animation
    resetScoreHighlight();
}

// Function to animate the floating score display
function animateScoreHighlight() {
    const scoreText = document.querySelector('.score-to-beat__text');
    const scoreHolder = document.querySelector('.score-to-beat');

    if (!scoreHolder || !scoreText) return;

    // Delay 0.5s before moving into view
    setTimeout(() => {
        scoreHolder.style.right = '0';

        // After 1s, expand height and set opacity
        setTimeout(() => {
            scoreHolder.style.height = '40px';
            scoreText.style.opacity = '1';
        }, 2000);
    }, 1000);
}

// Function to reset the animation
function resetScoreHighlight() {
    const scoreText = document.querySelector('.score-to-beat__text');
    const scoreHolder = document.querySelector('.score-to-beat');

    if (!scoreHolder || !scoreText) return;

    scoreHolder.style.right = '-200px';
    scoreHolder.style.height = '18px';
    scoreText.style.opacity = '0';
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