// gameState.js
let gameState = {
    images: [],
    revealedCards: [],
    matchedPairs: 0,
    startTime: null,
    timer: null,
    board: null,
    boardFrame: null,
    mode: "normal-mode",
    counterDisplay: null,
    currentCategory: 'cats',
    isDefeat: false,
    isFlipped: false,
    team: 'cats',
    scores: {
        "normal-mode": [],
        "focus-mode": [],
        "rotate-mode": [],
        "switch-row-mode": []
    },
    playerName: localStorage.getItem('playerName') || null
};

export function getGameState() {
    return gameState;
}

export function setGameState(newState) {
    gameState = { ...gameState, ...newState }; 
}

export function resetGameState() {
    gameState = {
        ...gameState, 
        revealedCards: [],
        matchedPairs: 0,
        startTime: null,
        timer: null,
        images: [],
        currentCategory: null,
        isDefeat: false,
        isFlipped: false
    };
}
