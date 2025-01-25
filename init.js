import { assignRandomColors, addCardAnimations } from './visual.js';
import { gameState, resetGameState } from './gameState.js';
import { prepareImages, gameImages } from './images.js';
import { toggleTimerVisibility } from './gameProgress.js'; // Ensure timer visibility toggle is imported
import { saveGameResult, saveGameResultToFirestore, showBestResultsUi } from './scoreStorage.js';
import { getPlayerName } from './namePopup.js';
import { resetProgressBar } from './gameProgress.js';

export function generateCards(board, images) {
    board.innerHTML = ""; // Clear the board
    images.forEach(({ img, id }) => {
        const card = document.createElement("div");
        card.classList.add("card", "hidden");
        card.innerHTML = `<img src="${img}" data-id="${id}" alt="Card image" />`;
        card.addEventListener("click", () => revealCard(card));
        board.appendChild(card);
    });

    // Apply visual enhancements
    assignRandomColors(); 
    addCardAnimations();
}

export function revealCard(card) {
    if (
        card.classList.contains("revealed") ||
        card.classList.contains("matched") ||
        gameState.revealedCards.length === 2
    ) return;

    card.classList.remove("hidden");
    card.classList.add("revealed");
    gameState.revealedCards.push(card);

    if (gameState.revealedCards.length === 2) {
        const [first, second] = gameState.revealedCards;

        const isMatch =
            first.querySelector("img").dataset.id ===
            second.querySelector("img").dataset.id;

        if (isMatch) {
            first.classList.add("matched");
            second.classList.add("matched");
            gameState.matchedPairs++;
            gameState.revealedCards = [];
            if (gameState.matchedPairs === gameState.images.length / 2) {
                clearInterval(gameState.timer);
                const timeTaken = Math.floor(performance.now() - gameState.startTime); // Exact time in ms
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
                gameState.revealedCards = [];
            }, 1000);
        }
    }
}

export function resetGame() {
    resetGameState();
    gameState.images = prepareImages(gameImages, 6);
    generateCards(gameState.board, gameState.images);
    gameState.counterDisplay.textContent = `Time: 0s`;

    toggleTimerVisibility(false);
}