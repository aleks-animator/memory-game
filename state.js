import { updateCategory } from './images.js';

export function setGameCategory(btn) {
    const category = btn.id.replace('-btn', '');

    // Remove active class from all category buttons
    document.querySelectorAll('#game-board-back .pill-button').forEach(button => {
        button.classList.remove('pill-button--active');
    });
    btn.classList.toggle('pill-button--active');

    // Reset body class and add selected category mode
    document.body.className = '';
    document.body.classList.add(`${category}-mode`);

    // Remove active class from all preview images
    document.querySelectorAll('.preview-images-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to the matching preview image
    const previewItem = document.querySelector(`.preview-images-item-${category}`);
    if (previewItem) {
        previewItem.classList.add('active');
    }

    updateCategory(category);
}
