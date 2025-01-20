// visual.js

// Function to assign random colors to cards
export function assignRandomColors() {
    const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFD133",
        "#33FFF1", "#C833FF", "#A1FF33", "#FF8C00", "#00FF8C",
        "#8C00FF", "#FF00C8", "#33A1FF", "#FFD700", "#FF4500",
        "#00FF00", "#FF1493", "#7FFF00", "#00BFFF", "#8A2BE2",
        "#FF6347", "#ADFF2F", "#20B2AA", "#FF4500", "#32CD32",
        "#FFD700", "#FF00FF", "#00CED1", "#FF8C00", "#90EE90"
    ];

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        card.style.backgroundColor = randomColor;
    });
}

// Function to add animations and transitions to cards
export function addCardAnimations() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        // Add hover animations for cards
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X relative to the card
            const y = e.clientY - rect.top;  // Mouse Y relative to the card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation angles
            const rotateX = ((y - centerY) / centerY) * 10; // Adjust 10 for more/less tilt
            const rotateY = ((centerX - x) / centerX) * 10;

            // Calculate dynamic shadow position
            const shadowX = (x - centerX) / 10; // Adjust divisor for shadow intensity
            const shadowY = (y - centerY) / 10;

            // Apply transform and shadow
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            card.style.boxShadow = `${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.4), 
                                    0 0 20px rgba(255, 255, 255, 0.2)`;
        });

        // Reset transform, shadow, and glow on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
            card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; // Default shadow
        });
    });
}
