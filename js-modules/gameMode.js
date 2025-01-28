import { updateCategory } from './images.js';

// ------------------------------
// Game Category Selection
// ------------------------------
export function setGameCategory(btn) {
    const category = btn.id.replace('-btn', '');

    // Remove active class from all category buttons
    document.querySelectorAll('.preview-images .pill-button').forEach(button => {
        button.classList.remove('pill-button--active');
    });

    btn.classList.toggle('pill-button--active');

    // Update body class with selected category layout
    document.body.className = '';
    document.body.classList.add(`${category}-layout`);

    // Remove active class from all preview images
    document.querySelectorAll('.preview-images-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to the selected preview image
    const previewItem = document.querySelector(`.preview-images-item-${category}`);
    if (previewItem) {
        previewItem.classList.add('active');
    }

    updateCategory(category);
}

// ------------------------------
// Game Mode Selection
// ------------------------------
let intervalId = null;  // Variable to store the interval ID
let previousChoice = null;  // Store previous choice to avoid repetition
const cardOuterHeight = 180 + 24;  // Card height + gap (fixed value)

function swapRows() {
    const grid = document.getElementById('game-board-front');
    const rows = Array.from(grid.children); // All cards in the grid

    // Slice the grid into 3 rows
    const row1 = rows.slice(0, 4);  // First row (first 4 items)
    const row2 = rows.slice(4, 8);  // Second row (next 4 items)
    const row3 = rows.slice(8, 12); // Third row (last 4 items)

    // Set initial position of cards
    rows.forEach((card) => {
        card.style.position = 'relative';
        card.style.top = '0px';  // Ensure initial top position is set
    });

    // Choose one of the three options randomly, ensuring it's different from the last one
    let randomChoice;
    do {
        randomChoice = Math.floor(Math.random() * 3);  // Random number between 0 and 2
    } while (randomChoice === previousChoice);  // Ensure different choice from the last one

    previousChoice = randomChoice; // Store the current choice for the next iteration

    setTimeout(() => {
        if (randomChoice === 0) {
            // Move row1 down and row2 up
            row1.forEach((card) => card.style.top = `${cardOuterHeight}px`);
            row2.forEach((card) => card.style.top = `-${cardOuterHeight}px`);
        }
        else if (randomChoice === 1) {
            // Move row2 down and row3 up
            row2.forEach((card) => card.style.top = `${cardOuterHeight}px`);
            row3.forEach((card) => card.style.top = `-${cardOuterHeight}px`);
        }
        else {
            // Move row1 down by 2 heights and row3 up by 2 heights
            row1.forEach((card) => card.style.top = `${cardOuterHeight * 2}px`);
            row3.forEach((card) => card.style.top = `-${cardOuterHeight * 2}px`);
        }
    }, 50);
}

// Function to start swapping rows at intervals
function startSwapping() {
    if (!intervalId) {
        swapRows();  // Initial execution
        intervalId = setInterval(swapRows, 3000);
    }
}

// Function to stop swapping rows
function stopSwapping() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

// ------------------------------
// Handle Game Mode Selection
// ------------------------------
export function setGameMode(btn) {
    const gameMode = btn.id;

    // Remove active class from all game mode buttons
    document.querySelectorAll('.game-modes__action .pill-button').forEach(button => {
        button.classList.remove('pill-button--active');
    });

    // Add active class to the clicked button
    btn.classList.add('pill-button--active');

    // Hide all descriptions
    document.querySelectorAll('.game-modes__description-item').forEach(item => {
        item.classList.remove('game-modes__description-item--show');
    });


    // Show the related decor item based on the rel attribute
    const relatedDesc = document.querySelector(`.game-modes__description-item[rel="${gameMode}"]`);
    if (relatedDesc) {
        relatedDesc.classList.add('game-modes__description-item--show');
    }

    // Update game board with the selected mode
    const gameBoard = document.getElementById('game-board');
    gameBoard.className = '';
    gameBoard.classList.add(gameMode);

    // Start/stop swapping rows based on the selected mode
    if (gameMode === 'switch-row-mode') {
        startSwapping();
    } else {
        stopSwapping();
    }
}