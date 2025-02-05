// namePopup.js
import { getGameState, setGameState } from './gameState.js';

// Show the popup with a dynamic message and optional input field
export function showPopup(message, showInput = false, confirmCallback = null) {
    const popup = document.getElementById('name-popup');
    const overlay = document.getElementById('overlay');
    const popupMessage = document.getElementById('popup-message');
    const nameInput = document.getElementById('player-name');
    const saveButton = document.getElementById('save-name-btn');
    const confirmButton = document.getElementById('confirm-btn');

    if (popup && overlay && popupMessage && nameInput && saveButton && confirmButton) {
        // Set the message and title
        popupMessage.textContent = message;

        // Show or hide the input field
        nameInput.style.display = showInput ? 'block' : 'none';
        saveButton.style.display = showInput ? 'block' : 'none';
        confirmButton.style.display = showInput ? 'none' : 'block';

        // Show the popup and overlay
        popup.style.display = 'block';
        overlay.style.display = 'block';

        // Handle confirm button click
        confirmButton.onclick = () => {
            if (confirmCallback) confirmCallback();
            hidePopup();
        };

        // Handle save button click
        saveButton.onclick = () => {
            saveName();
            hidePopup();
        };
    }
}

// Hide the popup and overlay
function hidePopup() {
    const popup = document.getElementById('name-popup');
    const overlay = document.getElementById('overlay');

    if (popup && overlay) {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }
}

// Save the player name to localStorage and update the game state
function saveName() {
    const nameInput = document.getElementById('player-name');
    if (!nameInput) return;

    const name = nameInput.value.trim();

    if (name) {
        localStorage.setItem('playerName', name);
        setGameState({ playerName: name });
        updatePlayerName();
    } else {
        showPopup('Please enter your name.', true);
    }
}

// Update the player name in the UI
export function updatePlayerName() {
    const { playerName } = getGameState();
    const nameElement = document.querySelector('.player-panel__name');

    if (nameElement && playerName) {
        nameElement.textContent = playerName;
    }
}

// Add functionality for the "Change Name" button
const changeNameButton = document.getElementById('change-name-btn');
if (changeNameButton) {
    changeNameButton.addEventListener('click', () => showPopup('Enter your new name:', true));
}

// Check if the player name is set, and show the popup if it's not
export function checkAndShowNamePopup() {
    const playerName = getPlayerName();
    if (!playerName) {
        showPopup('Welcome! Please enter your name to start playing.', true);
    }
}

// Get the player name from localStorage
export function getPlayerName() {
    return localStorage.getItem('playerName');
}