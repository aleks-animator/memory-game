import { getGameState } from './gameState.js';

let currentCategory = 'cats'; // Standardkategorie

export function updateCategory(category) {
    currentCategory = category; // Kategorie aktualisieren
}

// Funktion, um Bilder immer basierend auf der aktuellen Kategorie zu bekommen
export function getGameImages() {
    return Array.from({ length: 21 }, (_, i) => `../images/${currentCategory}/${i + 1}.jpg`);
}

export function prepareImages(count = 6) {
    const category = getGameState().currentCategory || 'cats'; // Use gameState for category
    const images = Array.from({ length: 21 }, (_, i) => `../images/${category}/${i + 1}.jpg`);

    return shuffleImageArray(images) // Shuffle the array
        .slice(0, count) // Select the first `count` shapes
        .map((img, id) => ({ img, id })) // Assign an ID to each shape
        .flatMap(pair => [pair, pair]) // Duplicate each shape
        .sort(() => Math.random() - 0.5); // Shuffle the pairs
}

export function shuffleImageArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Elemente tauschen
    }
    return array;
}
