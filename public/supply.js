const urlParams = new URLSearchParams(window.location.search);
const serialCode = urlParams.get('code');

let supplyContent, drugCodeDisplay, backBtn;

document.addEventListener('DOMContentLoaded', function() {
    supplyContent = document.getElementById('supply-content');
    drugCodeDisplay = document.getElementById('drug-code-display');
    backBtn = document.getElementById('back-btn');

    if (serialCode) {
        if (drugCodeDisplay) {
            drugCodeDisplay.textContent = `Drug Code: ${serialCode}`;
        }
        fetchSupplyChain(serialCode);
    } else {
        if (supplyContent) {
            supplyContent.innerHTML = '<div class="status error">No drug code provided.</div>';
        }
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = `result.html?code=${encodeURIComponent(serialCode)}`;
        });
    }
});

async function fetchSupplyChain(code) {
    try {
        const response = await fetch(`/api/supply/${code}`);
        const data = await response.json();
        
        if (response.ok) {
            displaySupplyChain(data);
        } else {
            showError(data.error || 'Failed to fetch supply chain data');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Network error. Please check if the server is running.');
    }
}

function displaySupplyChain(data) {
    if (!supplyContent) return;

    if (!data.events || data.events.length === 0) {
        supplyContent.innerHTML = `
            <div class="status info">
                No supply chain events found for this drug code.
                <br><br>
                This could mean:
                <ul style="text-align: left; display: inline-block; margin-top: 10px;">
                    <li>The drug has not been registered in the blockchain</li>
                    <li>The contract has not been deployed or configured</li>
                    <li>No supply chain events have been added yet</li>
                </ul>
            </div>
        `;
        return;
    }
    
    let timelineHtml = '<div class="supply-timeline">';
    
    data.events.forEach((event, index) => {
        const date = new Date(event.timestamp * 1000);
        const dateStr = date.toLocaleString();
        
        timelineHtml += `
            <div class="timeline-item">
                <div class="timeline-location">
                    <h3>${event.fromLocation}</h3>
                    <p>From</p>
                </div>
                <div class="timeline-arrow">→</div>
                <div class="timeline-location">
                    <h3>${event.toLocation}</h3>
                    <p>To</p>
                    <p style="font-size: 0.8em; margin-top: 5px; color: #999;">${dateStr}</p>
                </div>
            </div>
        `;
    });
    
    timelineHtml += '</div>';
    
    supplyContent.innerHTML = `
        <div class="drug-card">
            <h2>Supply Chain Timeline</h2>
            <p style="margin-bottom: 20px; color: #666;">
                Total Events: <strong>${data.count}</strong>
            </p>
            ${timelineHtml}
        </div>
    `;
}

function showError(message) {
    if (supplyContent) {
        supplyContent.innerHTML = `
            <div class="status error">${message}</div>
        `;
    }
}
