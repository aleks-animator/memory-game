import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { getGameState, setGameState } from './gameState.js';

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
    const hideScoresButton = document.querySelector('.leaderboard-close');

    if (showScoresButton && leaderboard) {
        // Toggle leaderboard open state on show button click
        showScoresButton.addEventListener('click', () => {
            if (leaderboard.classList.contains('leaderboard-opened')) {
                leaderboard.classList.remove('leaderboard-opened');
            } else {
                leaderboard.classList.add('leaderboard-opened');
            }
        });
    }

    if (hideScoresButton && leaderboard) {
        // Close leaderboard when close button is clicked
        hideScoresButton.addEventListener('click', () => {
            leaderboard.classList.remove('leaderboard-opened');
        });
    }
}

// Firebase integration

export async function saveGameResultToFirestore(playerName, timeTaken) {
    if (!playerName) return;

    const { mode, team } = getGameState();

    const scoreData = {
        player: playerName,
        score: timeTaken,
        mode: mode,  // Include game mode
        team: team,  // Include team
        timestamp: new Date().toISOString()
    };

    try {
        const scoresRef = collection(db, "scores");
        await addDoc(scoresRef, scoreData);
        console.log("Score saved successfully:", scoreData);
    } catch (error) {
        console.error("Error saving score:", error);
    }
}

const gameModes = ["normal-mode", "focus-mode", "rotate-mode", "switch-row-mode"];

export async function fetchGlobalScores() {
    try {
        const allScores = {};

        for (const mode of gameModes) {
            const scoresQuery = query(
                collection(db, 'scores'),
                where("mode", "==", mode),  // Filter by game mode
                orderBy('score', 'asc'),    // Get lowest times first
                limit(10)                   // Limit to top 10 per mode
            );

            const querySnapshot = await getDocs(scoresQuery);
            const scores = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            allScores[mode] = scores;
        }

        // Update gameState.scores with the fetched scores
        setGameState({ scores: allScores });

        return allScores;
    } catch (error) {
        console.error('Error fetching scores:', error);
        return {};
    }
}

export async function loadGlobalScores() {
    const globalScores = await fetchGlobalScores();
    const { scores } = getGameState();
    console.log('Updated gameState.scores:', scores);

    const scoreListGlobal = document.getElementById('score-list-global');
    scoreListGlobal.innerHTML = ''; // Clear existing content

    for (const mode of gameModes) {
        const modeScores = globalScores[mode] || [];

        // Create a section for this game mode
        const modeSection = document.createElement('div');
        modeSection.innerHTML = `<h3>${mode.replace('-', ' ').toUpperCase()}</h3>`;

        const list = document.createElement('ul');

        modeScores.forEach((score, index) => {
            const formattedTime = (score.score / 1000).toLocaleString('de-DE', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
            });

            const listItem = document.createElement('li');
            listItem.innerHTML = `<span class="leaderboard-rank">${index + 1}</span> <span class="badge badge--smaller badge--${score.team}"><div class="rounded"></div></span> ${score.player}: ${formattedTime} seconds`;

            list.appendChild(listItem);
        });

        modeSection.appendChild(list);
        scoreListGlobal.appendChild(modeSection);
    }
}
