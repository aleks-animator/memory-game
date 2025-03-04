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
    const gameSettings = document.querySelector('.game-settings');

    if (popup && overlay && popupMessage && nameInput && saveButton && confirmButton) {
        popupMessage.innerHTML = message;

        nameInput.style.display = showInput ? 'block' : 'none';
        saveButton.style.display = showInput ? 'block' : 'none';
        confirmButton.style.display = hideConfirmButton ? 'none' : (showInput ? 'none' : 'block');

        // Hide the game-settings block by default
        if (gameSettings) {
            gameSettings.style.display = 'none';
        }

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

// Show the game settings popup
export function showSettingsPopup() {
    const popup = document.getElementById('name-popup');
    const overlay = document.getElementById('overlay');
    const gameSettings = document.querySelector('.game-settings');

    if (popup && overlay && gameSettings) {
        // Hide the default popup content
        const popupMessage = document.getElementById('popup-message');
        const nameInput = document.getElementById('player-name');
        const saveButton = document.getElementById('save-name-btn');
        const confirmButton = document.getElementById('confirm-btn');

        if (popupMessage && nameInput && saveButton && confirmButton) {
            popupMessage.style.display = 'none';
            nameInput.style.display = 'none';
            saveButton.style.display = 'none';
            confirmButton.style.display = 'none';
        }

        // Show the game-settings block
        gameSettings.style.display = 'block';

        // Show the popup and overlay
        popup.style.display = 'block';
        overlay.style.display = 'block';

        // Add event listener for the close button inside game-settings
        const closeButton = document.getElementById('close-popup');
        if (closeButton) {
            closeButton.addEventListener('click', hidePopup);
        }

        // Add event listeners for the settings buttons
        const removeBackgroundButton = document.getElementById('remove-background');
        const rngColorBlockButton = document.getElementById('rng-color-block');

        if (removeBackgroundButton) {
            removeBackgroundButton.addEventListener('click', toggleBackground);
        }

        if (rngColorBlockButton) {
            rngColorBlockButton.addEventListener('click', toggleColorGrid);
        }
    }
}

// Toggle background theme
function toggleBackground() {
    const body = document.body;
    const removeBackgroundButton = document.getElementById('remove-background');

    if (body && removeBackgroundButton) {
        // Toggle the "no-background" class on the body
        body.classList.toggle('no-background');

        // Save the state in localStorage
        const isBackgroundDisabled = body.classList.contains('no-background');
        localStorage.setItem('no-background', isBackgroundDisabled);

        // Toggle the button text
        if (isBackgroundDisabled) {
            removeBackgroundButton.textContent = 'Activate Theme Background';
        } else {
            removeBackgroundButton.textContent = 'Deactivate Theme Background';
        }

        // Toggle the "active" class on the button
        removeBackgroundButton.classList.toggle('pill-button--active');
    }
}

// Toggle multi-color game grid
function toggleColorGrid() {
    const body = document.body;
    const rngColorBlockButton = document.getElementById('rng-color-block');

    if (body && rngColorBlockButton) {
        // Toggle the "no-card-bg" class on the body
        body.classList.toggle('no-card-bg');

        // Save the state in localStorage
        const isCardBgDisabled = body.classList.contains('no-card-bg');
        localStorage.setItem('no-card-bg', isCardBgDisabled);

        // Toggle the button text
        if (isCardBgDisabled) {
            rngColorBlockButton.textContent = 'Activate Multi-Color Game Grid';
        } else {
            rngColorBlockButton.textContent = 'Deactivate Multi-Color Game Grid';
        }

        // Toggle the "active" class on the button
        rngColorBlockButton.classList.toggle('pill-button--active');
    }
}

// Initialize button and body class states based on localStorage
export function initializeSettings() {
    const body = document.body;
    const removeBackgroundButton = document.getElementById('remove-background');
    const rngColorBlockButton = document.getElementById('rng-color-block');

    // Initialize "no-background" state
    const isBackgroundDisabled = localStorage.getItem('no-background') === 'true';
    if (isBackgroundDisabled) {
        body.classList.add('no-background');
        removeBackgroundButton.textContent = 'Activate Theme Background';
        removeBackgroundButton.classList.add('pill-button--active');
    } else {
        body.classList.remove('no-background');
        removeBackgroundButton.textContent = 'Deactivate Theme Background';
        removeBackgroundButton.classList.remove('pill-button--active');
    }

    // Initialize "no-card-bg" state
    const isCardBgDisabled = localStorage.getItem('no-card-bg') === 'true';
    if (isCardBgDisabled) {
        body.classList.add('no-card-bg');
        rngColorBlockButton.textContent = 'Activate Multi-Color Game Grid';
        rngColorBlockButton.classList.add('pill-button--active');
    } else {
        body.classList.remove('no-card-bg');
        rngColorBlockButton.textContent = 'Deactivate Multi-Color Game Grid';
        rngColorBlockButton.classList.remove('pill-button--active');
    }
}

// Attach event listener for the settings button
export function setOptions() {
    const optionButton = document.getElementById('option-btn');
    if (optionButton) {
        optionButton.addEventListener('click', showSettingsPopup);
    }
}