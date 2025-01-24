import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

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

export function setupLeaderboardToggle() {
    const leaderboard = document.getElementById('leaderboard');
    const showScoresButton = document.querySelector('.pill-button--show-scores');

    if (showScoresButton && leaderboard) {
        showScoresButton.addEventListener('click', () => {
            // Toggle leaderboard visibility
            if (leaderboard.style.display === 'none' || leaderboard.style.display === '') {
                leaderboard.style.display = 'block';
            } else {
                leaderboard.style.display = 'none';
            }
        });
    }
}

// Firebase integration

export async function saveGameResultToFirestore(playerName, time) {
    try {
        await addDoc(collection(db, 'gameScores'), {
            player: playerName,
            time: time
        });
        console.log('Score saved to Firestore');
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

export async function fetchGlobalScores() {
    try {
        const scoresQuery = query(
            collection(db, 'gameScores'),
            orderBy('time', 'asc'),
            limit(10)
        );
        const querySnapshot = await getDocs(scoresQuery);

        const scores = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return scores;
    } catch (error) {
        console.error('Error fetching scores:', error);
        return [];
    }
}