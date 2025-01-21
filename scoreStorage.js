export function saveGameResult(playerName, time) {
    let scores = JSON.parse(localStorage.getItem('gameScores')) || [];

    scores.push({ name: playerName, time: time });

    scores.sort((a, b) => a.time - b.time);

    // Keep only the top 10 results
    if (scores.length > 10) {
        scores = scores.slice(0, 10);
    }

    localStorage.setItem('gameScores', JSON.stringify(scores));
}

export function getBestResults() {
    return JSON.parse(localStorage.getItem('gameScores')) || [];
}

export function showBestResultsUi() {
    const scoreList = document.getElementById('score-list');
    const bestResults = getBestResults();
    
    const fragment = document.createDocumentFragment(); // Create a fragment to improve performance

    if (bestResults.length === 0) {
        const noScoresItem = document.createElement('li');
        noScoresItem.textContent = 'No scores yet';
        fragment.appendChild(noScoresItem);
    } else {
        bestResults.forEach((result, index) => {
            const formattedTime = (result.time / 1000).toLocaleString('de-DE', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
            });

            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${result.name}: ${formattedTime}s`;
            fragment.appendChild(listItem);
        });
    }

    scoreList.innerHTML = '';  // Clear previous entries
    scoreList.appendChild(fragment);  // Append all items at once
}

