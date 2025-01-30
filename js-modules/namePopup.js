import { gameState } from './gameState.js';

export function checkAndShowNamePopup() {
    const playerName = getPlayerName();

    if (!playerName) {
        showPopup();
    }
}

export function getPlayerName() {
    return localStorage.getItem('playerName');
}

function showPopup() {
    const popup = document.getElementById('name-popup');
    const overlay = document.getElementById('overlay');

    popup.style.display = 'block';
    overlay.style.display = 'block';

    document.getElementById('save-name-btn').addEventListener('click', saveName);
}

function saveName() {
    const nameInput = document.getElementById('player-name').value.trim();

    if (nameInput) {
        localStorage.setItem('playerName', nameInput);
        gameState.playerName = nameInput; // Aktualisiere gameState
        updatePlayerName(); // Name in der UI aktualisieren

        document.getElementById('name-popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    } else {
        alert('Please enter your name.');
    }
}

// Add functionality for "Change Name" button
document.getElementById('change-name-btn')?.addEventListener('click', function() {
    showPopup();
    const currentName = getPlayerName();
    if (currentName) {
        document.getElementById('player-name').value = currentName; // Pre-fill the name field
    }
});

export function updatePlayerName() {
    const playerName = gameState?.playerName || getPlayerName();
    const nameElement = document.querySelector('.player-panel__name');

    if (nameElement && playerName) {
        nameElement.textContent = playerName;
    }
}