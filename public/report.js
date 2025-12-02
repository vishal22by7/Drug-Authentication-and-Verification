const urlParams = new URLSearchParams(window.location.search);
const serialCode = urlParams.get('code');

const reportForm = document.getElementById('report-form');
const drugCodeDisplay = document.getElementById('drug-code-display');
const reportStatus = document.getElementById('report-status');
const cancelBtn = document.getElementById('cancel-btn');

if (serialCode) {
    drugCodeDisplay.textContent = `Drug Code: ${serialCode}`;
} else {
    reportStatus.innerHTML = '<div class="status error">No drug code provided.</div>';
    reportForm.style.display = 'none';
}

reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reason = document.getElementById('reason').value.trim();
    
    if (!reason) {
        showStatus('Please provide a reason for the report.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                serial_code: serialCode,
                reason: reason
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showStatus('✅ Report submitted successfully! Thank you for helping keep drugs safe.', 'success');
            reportForm.reset();
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            showStatus(`Error: ${data.error || 'Failed to submit report'}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('Network error. Please check if the server is running.', 'error');
    }
});

cancelBtn.addEventListener('click', () => {
    if (serialCode) {
        window.location.href = `result.html?code=${encodeURIComponent(serialCode)}`;
    } else {
        window.location.href = 'index.html';
    }
});

function showStatus(message, type) {
    reportStatus.textContent = message;
    reportStatus.className = `status ${type}`;
    reportStatus.style.display = 'block';
}

