// images.js
let currentCategory = 'cats'; // Default category is 'cats'

export function updateCategory(category) {
    currentCategory = category; // Update the category
    gameImages = Array.from({ length: 21 }, (_, i) => `images/${currentCategory}/${i + 1}.jpg`); // Update the image path
}

export let gameImages = Array.from({ length: 21 }, (_, i) => `images/${currentCategory}/${i + 1}.jpg`);

export function prepareImages(shapes, count = 6) {
    return shuffleImageArray([...shapes]) // Shuffle the array
        .slice(0, count) // Select the first `count` shapes
        .map((img, id) => ({ img, id })) // Assign an ID to each shape
        .flatMap(pair => [pair, pair]) // Duplicate each shape
        .sort(() => Math.random() - 0.5); // Shuffle the pairs
}

export function shuffleImageArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}
