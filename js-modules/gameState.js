// gameState.js
export const gameState = {
    images: [],
    revealedCards: [],
    matchedPairs: 0,
    startTime: null,
    timer: null,
    board: null,
    boardFrame: null,
    counterDisplay: null,
    currentCategory: null
};

// Function to reset game state
export function resetGameState() {
    gameState.revealedCards = [];
    gameState.matchedPairs = 0;
    clearInterval(gameState.timer);
    gameState.timer = null;
    gameState.images = [];
    gameState.currentCategory = null;
}