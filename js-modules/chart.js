import { getGameState } from './gameState.js';

// Function to calculate team rankings and points
function calculateTeamRankings(scores) {
    const teams = {};

    // Iterate through each mode
    Object.keys(scores).forEach(mode => {
        // Sort teams in this mode by score (descending)
        const sortedTeams = scores[mode].sort((a, b) => b.score - a.score);

        // Assign points based on rank (10 for 1st, 9 for 2nd, etc.)
        sortedTeams.forEach((entry, index) => {
            if (!teams[entry.team]) {
                teams[entry.team] = 0; // Initialize team points if not already present
            }
            teams[entry.team] += 10 - index; // Add points based on rank
        });
    });

    // Convert teams object to an array of { team, totalPoints }
    const teamArray = Object.keys(teams).map(team => ({
        team,
        totalPoints: teams[team] // Total points for the team
    }));

    // Sort teams by totalPoints in descending order
    teamArray.sort((a, b) => b.totalPoints - a.totalPoints);

    return teamArray;
}

// Function to render the chart
function renderChart(teamRankings) {
    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) {
        console.error("Chart container not found!");
        return;
    }
    chartContainer.innerHTML = ''; // Clear previous content

    if (teamRankings.length === 0) {
        chartContainer.innerHTML = '<p>No data available.</p>'; // Fallback message
        return;
    }

    // Find the maximum total points to scale the bars
    const maxPoints = Math.max(...teamRankings.map(team => team.totalPoints));

    // Render bars for each team
    teamRankings.forEach(team => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(team.totalPoints / maxPoints) * 100}%`; // Scale height as a percentage
        bar.innerHTML = `<span>${team.team}<br>${team.totalPoints}</span>`;
        chartContainer.appendChild(bar);
    });
}

// Main function to initialize the chart
export function initChart() {
    const gameState = getGameState();
    console.log("Game State:", gameState); // Debugging: Log gameState
    const teamRankings = calculateTeamRankings(gameState.scores);
    console.log("Team Rankings:", teamRankings); // Debugging: Log team rankings
    renderChart(teamRankings);
}