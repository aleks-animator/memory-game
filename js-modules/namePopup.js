import { getGameState, setGameState } from './gameState.js';
import { badWords, badWordPatterns } from './badWords.js';

// Show the popup with a dynamic message and optional input field
export function showPopup(message, showInput = false, confirmCallback = null, hideConfirmButton = false) {
    const popup = document.getElementById('name-popup');
    const overlay = document.getElementById('overlay');
    const popupMessage = document.getElementById('popup-message');
    const nameInput = document.getElementById('player-name');
    const saveButton = document.getElementById('save-name-btn');
    const confirmButton = document.getElementById('confirm-btn');

    if (popup && overlay && popupMessage && nameInput && saveButton && confirmButton) {
        popupMessage.innerHTML = message;

        nameInput.style.display = showInput ? 'block' : 'none';
        saveButton.style.display = showInput ? 'block' : 'none';
        confirmButton.style.display = hideConfirmButton ? 'none' : (showInput ? 'none' : 'block');

        popup.style.display = 'block';
        overlay.style.display = 'block';

        if (!hideConfirmButton) {
            confirmButton.onclick = () => {
                if (confirmCallback) confirmCallback();
                hidePopup();
            };
        }

        saveButton.onclick = () => {
            saveName();
        };
    }
}


// Hide the popup
export function hidePopup() {
    const popup = document.getElementById('name-popup');
    const overlay = document.getElementById('overlay');

    if (popup && overlay) {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }
}

// Validate username
function isUsernameAllowed(username) {
    if (username.length > 20) return false; // Enforce max length

    const lowerUsername = username.toLowerCase();

    // Check exact words
    if (badWords.some(word => lowerUsername.includes(word))) return false;

    // Check modified words (like f**k, a$$, f.u.c.k)
    for (const pattern of badWordPatterns) {
        const regex = new RegExp(pattern, "gi");
        if (regex.test(lowerUsername)) return false;
    }

    return true;
}

// Save the player name with validation
function saveName() {
    const nameInput = document.getElementById('player-name');
    if (!nameInput) return;

    const name = nameInput.value.trim();

    if (!name) {
        showPopup('Please enter your name.', true);
        return;
    }

    if (name.length > 20) {
        showPopup('Name is too long. Maximum 20 characters allowed.', true);
        return;
    }

    if (!isUsernameAllowed(name)) {
        showPopup('Invalid name. Please choose another.', true);
        return;
    }

    localStorage.setItem('playerName', name);
    setGameState({ playerName: name });
    updatePlayerName();
    hidePopup();
}

// Update player name in UI
export function updatePlayerName() {
    const { playerName } = getGameState();
    const nameElement = document.querySelector('.player-panel__name');

    if (nameElement && playerName) {
        nameElement.textContent = playerName;
    }
}

// Change name button
const changeNameButton = document.getElementById('change-name-btn');
if (changeNameButton) {
    changeNameButton.addEventListener('click', () => showPopup('Enter your name:', true));
}

// Check if name exists, otherwise ask
export function checkAndShowNamePopup() {
    const playerName = getPlayerName();
    if (!playerName) {
        showPopup('Welcome! Please enter your name to start playing.', true);
    }
}

// Get player name from localStorage
export function getPlayerName() {
    return localStorage.getItem('playerName');
}
