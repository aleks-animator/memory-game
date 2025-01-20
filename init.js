import { assignRandomColors, addCardAnimations } from './visual.js'; // Import visual functions

export function generateCards(board, images, revealCard) {
    board.innerHTML = ""; // Clear the board
    images.forEach(({ img, id }) => {
        const card = document.createElement("div");
        card.classList.add("card", "hidden");
        card.innerHTML = `<img src="${img}" data-id="${id}" alt="Card image" />`;
        card.addEventListener("click", () => revealCard(card));
        board.appendChild(card);
    });

    // Apply visual enhancements
    assignRandomColors(); 
    addCardAnimations();
}
