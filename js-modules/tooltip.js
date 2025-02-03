export function createRankingTooltip(targetSelector) {
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
        console.error(`Tooltip target element "${targetSelector}" not found!`);
        return;
    }

    const tooltipContainer = document.createElement("div");
    tooltipContainer.className = "tooltip-container";

    tooltipContainer.innerHTML = `
        <div class="tooltip">
            <span class="tooltip-text">ℹ️</span>
            <div class="tooltip-content">
                <p><strong>Rank 1</strong> in each mode - <strong>10 points</strong></p>
                <p><strong>Rank 2</strong> - <strong>9 points</strong></p>
                <p><strong>Rank 3</strong> - <strong>8 points</strong></p>
                <p>...</p>
                <p><strong>Rank 10</strong> - <strong>1 point</strong></p>
            </div>
        </div>
    `;

    targetElement.appendChild(tooltipContainer);
}