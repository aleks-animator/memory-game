import { updateCategory } from './images.js';

export function setGameCategory(btn) {
    const category = btn.id.replace('-btn', '');
    document.querySelectorAll('#game-board-back .pill-button').forEach(button => {
        button.classList.remove('pill-button--active');
    });
    btn.classList.toggle('pill-button--active');
    document.body.className = '';
    document.body.classList.add(`${category}-mode`);
    updateCategory(category);
}