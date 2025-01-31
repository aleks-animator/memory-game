import { resetProgressBar, toggleTimerVisibility } from './gameProgress.js';
import { resetGame } from './init.js';

export function addFlipBehavior(buttonSelector, boardElement) {
    const button = document.querySelector(buttonSelector);
    const frontBoard = document.getElementById("game-board-front");
    const backBoard = document.getElementById("game-board-back");

    if (!button || !boardElement || !frontBoard || !backBoard) return;

    button.addEventListener('click', () => {
        flipBoard(boardElement, frontBoard, backBoard, button);
    });
}

export function flipBoard(boardElement, frontBoard, backBoard, button) {
    boardElement.classList.toggle('flip'); // Add/remove flip class

    // Delay the visibility change by 0.4 seconds (half of the transition time)
    setTimeout(() => {
        const isFlipped = boardElement.classList.contains('flip');
        frontBoard.style.display = isFlipped ? 'grid' : 'none';
        backBoard.style.display = isFlipped ? 'none' : 'flex';

        // Toggle button text based on the flip state
        button.textContent = isFlipped ? "Quit game" : "Start game";

        // Trigger resetProgressBar when flipping back to front
        if (!isFlipped) {
            resetProgressBar();
            toggleTimerVisibility(false);
            resetGame();
        }
    }, 400);
}