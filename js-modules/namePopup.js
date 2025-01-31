import { getGameState, setGameState } from './gameState.js';

// Check if the player name is set, and show the popup if it's not
export function checkAndShowNamePopup() {
    const playerName = getPlayerName();
    if (!playerName) {
        showPopup();
    }
}

// Get the player name from localStorage
export function getPlayerName() {
    return localStorage.getItem('playerName');
}

// Show the name popup and overlay
function showPopup() {
    const popup = document.getElementById('name-popup');
    const overlay = document.getElementById('overlay');

    if (popup && overlay) {
        popup.style.display = 'block';
        overlay.style.display = 'block';

        // Pre-fill the name field if a name already exists
        const currentName = getPlayerName();
        const nameInput = document.getElementById('player-name');
        if (nameInput && currentName) {
            nameInput.value = currentName;
        }

        // Add event listener for the save button
        const saveButton = document.getElementById('save-name-btn');
        if (saveButton) {
            saveButton.addEventListener('click', saveName);
        }
    }
}

// Save the player name to localStorage and update the game state
function saveName() {
    const nameInput = document.getElementById('player-name');
    if (!nameInput) return;

    const name = nameInput.value.trim();

    if (name) {
        // Save the name to localStorage
        localStorage.setItem('playerName', name);

        // Update the game state
        setGameState({ playerName: name });

        // Update the player name in the UI
        updatePlayerName();

        // Hide the popup and overlay
        const popup = document.getElementById('name-popup');
        const overlay = document.getElementById('overlay');
        if (popup && overlay) {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }
    } else {
        alert('Please enter your name.');
    }
}

// Add functionality for the "Change Name" button
const changeNameButton = document.getElementById('change-name-btn');
if (changeNameButton) {
    changeNameButton.addEventListener('click', showPopup);
}

// Update the player name in the UI
export function updatePlayerName() {
    const { playerName } = getGameState();
    const nameElement = document.querySelector('.player-panel__name');

    if (nameElement && playerName) {
        nameElement.textContent = playerName;
    }
}