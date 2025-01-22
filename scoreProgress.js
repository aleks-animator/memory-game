export function startScoreProgress() {
    const progressLine = document.getElementById('progress-line');
    const bullet = document.getElementById('bullet');

    // Get the game scores from localStorage
    const scores = JSON.parse(localStorage.getItem('gameScores')) || [];

    // Find the lowest time in scores or default to 60 seconds if no scores exist
    const bestTime = scores.length > 0 ? Math.min(...scores.map(score => score.time)) : 60000; // Default to 60s

    const progressBarWidth = progressLine.offsetWidth;

    // Set bullet at the start
    bullet.style.left = `0px`;

    // Calculate animation duration based on the best score
    const animationDuration = bestTime / 1000; // Convert milliseconds to seconds

    // Apply dynamic transition duration
    bullet.style.transitionDuration = `${animationDuration}s`;

    // Move the bullet smoothly to the end
    setTimeout(() => {
        bullet.style.left = `${progressBarWidth}px`;
    }, 100);
}
