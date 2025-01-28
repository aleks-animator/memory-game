import { assignRandomColors, addCardAnimations } from './visual.js';
import { gameState, resetGameState } from './gameState.js';
import { prepareImages, gameImages } from './images.js';
import { toggleTimerVisibility } from './gameProgress.js'; // Ensure timer visibility toggle is imported
import { saveGameResult, saveGameResultToFirestore, showBestResultsUi } from './scoreStorage.js';
import { getPlayerName } from './namePopup.js';
import { resetProgressBar } from './gameProgress.js';
import { setGameCategory, setGameMode} from "./gameMode";

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
    const image = preloadImage(img); // Preload the image
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

// Function to reveal a card
export function revealCard(card) {
    if (!canRevealCard(card)) return; // Check if the card can be revealed
        card.classList.remove("hidden");
        card.classList.add("revealed");
        card.style.backgroundImage = `url("${card.dataset.image}")`;
        gameState.revealedCards.push(card);
        if (gameState.revealedCards.length === 2) {
            handleCardMatch();
        }
}

// Function to check if the card can be revealed
function canRevealCard(card) {
    return !(
        card.classList.contains("revealed") ||
        card.classList.contains("matched") ||
        gameState.revealedCards.length === 2
    );
}

// Function to handle the case where two cards are revealed
function handleCardMatch() {
    const [first, second] = gameState.revealedCards;
    const isMatch = first.dataset.id === second.dataset.id;

    if (isMatch) {
        handleMatchedCards(first, second);
    } else {
        resetUnmatchedCards(first, second);
    }
}

// Function to handle matched cards
function handleMatchedCards(first, second) {
    first.classList.add("matched");
    second.classList.add("matched");
    gameState.matchedPairs++;
    gameState.revealedCards = [];

    if (gameState.matchedPairs === gameState.images.length / 2) {
        endGame();
    }
}

// Function to reset unmatched cards
function resetUnmatchedCards(first, second) {
    setTimeout(() => {
        first.classList.remove("revealed");
        second.classList.remove("revealed");
        first.classList.add("hidden");
        second.classList.add("hidden");
        first.style.backgroundImage = ''; // Reset background (using CSS placeholder)
        second.style.backgroundImage = ''; // Reset background (using CSS placeholder)
        gameState.revealedCards = [];
    }, 1000);
}

// Function to handle the end of the game
function endGame() {
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

export function resetGame() {
    resetGameState();
    gameState.images = prepareImages(gameImages, 6);
    generateCards(gameState.board, gameState.images);
    gameState.counterDisplay.textContent = `00:00`;

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
setupCategoryListeners(['cats', 'dogs', 'birds']);
setupModeListeners(['normal', 'rotate', 'switch-row']);