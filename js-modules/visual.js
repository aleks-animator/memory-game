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

            // Detect if the game board is flipped
            const isFlipped = document.querySelector("#game-board").classList.contains("flip");

            // Tilt factor for the "pressing down" effect
            const tiltFactor = 10; // Increase for a stronger tilt effect

            // Calculate distance from the center (normalized to -1 to 1)
            const deltaX = (x - centerX) / centerX; // Range: -1 to 1
            const deltaY = (y - centerY) / centerY; // Range: -1 to 1

            // Apply a non-linear scaling to exaggerate the edge effect
            const edgeFactor = 2; // Increase to make edges tilt more
            const scaledDeltaX = Math.pow(Math.abs(deltaX), edgeFactor) * Math.sign(deltaX);
            const scaledDeltaY = Math.pow(Math.abs(deltaY), edgeFactor) * Math.sign(deltaY);

            // Calculate rotation based on the scaled deltas
            // Reverse the tilt effect on both axes
            const rotateX = isFlipped
                ? -scaledDeltaY * tiltFactor // Reverse X rotation when flipped
                : scaledDeltaY * tiltFactor; // Normal X rotation (reversed)

            const rotateY = isFlipped
                ? scaledDeltaX * tiltFactor // Reverse Y rotation when flipped
                : -scaledDeltaX * tiltFactor; // Normal Y rotation (reversed)

            // Apply transform with perspective for depth effect
            card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;

            // Only apply lighting if the mouse is near the edges
            const edgeThreshold = 0.9; // Focus on edges only (0 to 1)
            const isNearEdge = Math.abs(deltaX) > edgeThreshold || Math.abs(deltaY) > edgeThreshold;

            // Only apply lighting if the mouse is on the opposite (pushed) side
            const isOppositeSide = (deltaX * rotateY > 0 || deltaY * rotateX > 0);

            if (isNearEdge && isOppositeSide) {
                // Calculate lighting intensity based on tilt (reduced by 20%)
                const lightX = -scaledDeltaX * 8; // Reduced by 20% (from 10 to 8)
                const lightY = -scaledDeltaY * 8; // Reduced by 20% (from 10 to 8)

                // Apply subtle shadow and lighting effects (reduced by 20%)
                card.style.boxShadow = `${lightX}px ${lightY}px 8px rgba(0, 0, 0, 0.32)`; // Reduced shadow blur and opacity
                card.style.filter = `brightness(1.08) drop-shadow(${lightX}px ${lightY}px 4px rgba(255, 255, 255, 0.24))`; // Reduced brightness and drop-shadow
            } else {
                // Default shadow and lighting when not near the edge or not on the opposite side
                card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                card.style.filter = 'brightness(1)';
            }
        });

        // Reset transform, shadow, and glow on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
            card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; // Default shadow
            card.style.filter = 'brightness(1)'; // Default light density
        });
    });
}