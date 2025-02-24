// init.js
import { assignRandomColors, addCardAnimations } from './visual.js';
import { getGameState, setGameState, resetGameState } from './gameState.js';
import { prepareImages, gameImages } from './images.js';
import { toggleTimerVisibility } from './gameProgress.js'; // Ensure timer visibility toggle is imported
import { saveGameResult, saveGameResultToFirestore, showBestResultsUi, loadGlobalScores } from './scoreStorage.js';
import { getPlayerName, showPopup } from './namePopup.js';
import { resetProgressBar } from './gameProgress.js';
import { setGameCategory, setGameMode, handleFocusMode, checkForDefeat, resetFocusMode, resetRevealClasses } from "./gameMode";
import { flipBoard } from './flip.js'; // Import the flipBoard function
// Function to generate the cards and render them on the board
export function generateCards(board, images) {
    board.innerHTML = ""; // Clear the board

    images.forEach(({ img, id }) => {
        const card = createCard(img, id);
        board.appendChild(card);
    });

    // Apply visual enhancements
    assignRandomColors();
    addCardAnimations();
}

// Function to create a single card
function createCard(img, id) {
    const card = document.createElement("div");
    card.classList.add("card", "hidden");

    card.dataset.image = img;
    card.dataset.id = id;

    // Attach event listener to the card
    card.addEventListener("click", () => revealCard(card));

    return card;
}

// Function to preload an image
function preloadImage(imgSrc) {
    const image = new Image();
    image.src = imgSrc;
    return image;
}

export function revealCard(card) {
    const gameState = getGameState();

    if (!canRevealCard(card)) return; // Check if the card can be revealed

    card.classList.remove("hidden");
    card.classList.add("revealed");
    card.style.backgroundImage = `url("${card.dataset.image}")`;

    // Update revealedCards in the state
    const updatedRevealedCards = [...gameState.revealedCards, card];
    setGameState({ revealedCards: updatedRevealedCards });

    // Handle focus mode logic if the mode is active
    if (gameState.mode === 'focus-mode') {
        handleFocusMode(card); // Track card reveals and add CSS classes

        // If two cards are revealed, check for a mismatch involving a second-revealed card
        if (updatedRevealedCards.length === 2) {
            const [first, second] = updatedRevealedCards;

            // If there's a mismatch involving a second-revealed card, end the game
            if (checkForDefeat(first, second)) {
                setGameState({ isDefeat: true }); // Mark the game as lost
                endGame();

                resetRevealClasses(first);
                resetRevealClasses(second);

                return; // Stop further processing
            }
        }
    }

    // Handle card matching logic
    if (updatedRevealedCards.length === 2) {
        handleCardMatch();
    }
}

// Function to check if the card can be revealed
function canRevealCard(card) {
    const { revealedCards } = getGameState();
    return !(
        card.classList.contains("revealed") ||
        card.classList.contains("matched") ||
        revealedCards.length === 2
    );
}

function handleCardMatch() {
    const { revealedCards } = getGameState();
    const [first, second] = revealedCards;
    const isMatch = first.dataset.id === second.dataset.id;

    if (isMatch) {
        handleMatchedCards(first, second);
    } else {
        resetUnmatchedCards(first, second);
    }
}

function handleMatchedCards(first, second) {
    const { matchedPairs, images, mode } = getGameState();

    first.classList.add("matched");
    second.classList.add("matched");

    // Update matchedPairs and reset revealedCards
    setGameState({
        matchedPairs: matchedPairs + 1,
        revealedCards: []
    });

    // Reset reveal classes for matched cards in focus mode
    if (mode === 'focus-mode') {
        resetRevealClasses(first);
        resetRevealClasses(second);
    }

    if (matchedPairs + 1 === images.length / 2) {
        endGame();
    }
}

function resetUnmatchedCards(first, second) {
    setTimeout(() => {
        first.classList.remove("revealed");
        second.classList.remove("revealed");
        first.classList.add("hidden");
        second.classList.add("hidden");
        first.style.backgroundImage = ''; // Reset background (using CSS placeholder)
        second.style.backgroundImage = ''; // Reset background (using CSS placeholder)

        // Reset revealedCards in the state
        setGameState({ revealedCards: [] });
    }, 1000);
}

function endGame() {
    const { isDefeat, startTime, timer, mode, scores } = getGameState();
    clearInterval(timer);
    const timeTaken = Math.floor(performance.now() - startTime); // Exact time in ms

    // Only save the score if the game was not lost
    if (!isDefeat) {
        const playerName = getPlayerName();
        saveGameResult(playerName, timeTaken);
        saveGameResultToFirestore(playerName, timeTaken);
        loadGlobalScores();
    }

    // Get the best time for the current mode
    const scoresForMode = scores[mode] || [];
    const bestTime = scoresForMode.length > 0 ? Math.min(...scoresForMode.map(score => score.score)) : null;

    // Calculate the difference between the player's time and the best time
    const timeDifference = bestTime ? timeTaken - bestTime : null;

    // Prepare the message for the highlight span
    let highlightMessage;
    if (timeDifference !== null && timeDifference <= 0) {
        highlightMessage = `>New best time! Congratulations!`;
    } else if (timeDifference !== null) {
        if (timeDifference <= 3000) { // If within 3 seconds
            highlightMessage = `You were just <strong>${(timeDifference / 1000).toFixed(3)} seconds away</strong> from setting a new best score!`;
        } else {
            highlightMessage = `Your time is <strong>${(timeDifference / 1000).toFixed(3)} seconds</strong> behind the best score.`;
        }
    } else {
        highlightMessage = `No best time recorded yet. Be the first to set a record!`;
    }
    // Show appropriate message
    setTimeout(() => {
        if (isDefeat) {
            showPopup('Game Over: You lost.', false, () => {
                resetGame();
                resetProgressBar();
            });
        } else {
            showPopup(
                `Your Time: <strong>${(timeTaken / 1000).toFixed(3)}s</strong>.<br><br>${highlightMessage}`,
                false,
                () => {
                    resetGame();
                    resetProgressBar();
                    showBestResultsUi();
                }
            );
        }
    }, 500);
}

export function resetGame() {
    const { mode, board } = getGameState(); // Destructure only what you need
    const boardElement = document.getElementById("game-board");
    const frontBoard = document.getElementById("game-board-front");
    const backBoard = document.getElementById("game-board-back");
    const button = document.querySelector("#flip-button");

    // Flip the board back to the front if it's flipped
    if (boardElement.classList.contains('flip')) {
        flipBoard(boardElement, frontBoard, backBoard, button);
    }

    resetGameState(); // Reset all game state values

    // Prepare new images and update the state
    const preparedImages = prepareImages(gameImages, 6);
    setGameState({ images: preparedImages }); // Update the state synchronously

    // Use the updated images from the state
    generateCards(board, getGameState().images);

    // Reset focus mode state
    if (mode === 'focus-mode') {
        resetFocusMode();
    }

    // Reset the timer display
    const counterDisplay = document.getElementById("timer");
    if (counterDisplay) {
        counterDisplay.textContent = "00:00"; // Properly reset the timer UI
    }
    toggleTimerVisibility(false);
}


// Function to set event listeners for game categories
function setupCategoryListeners(categories) {
    categories.forEach(category => {
        document.getElementById(`${category}-btn`).addEventListener('click', function() {
            setGameCategory(this);
            resetGame();
        });
    });
}

// Function to set event listeners for game modes
function setupModeListeners(modes) {
    modes.forEach(mode => {
        document.getElementById(`${mode}-mode`).addEventListener('click', function() {
            setGameMode(this);
            resetGame();
        });
    });
}

// Call functions with respective category and mode arrays
setupCategoryListeners(['cats', 'dogs', 'birds', 'seaanimals']);
setupModeListeners(['normal','focus','rotate','switch-row']);