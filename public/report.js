const urlParams = new URLSearchParams(window.location.search);
const serialCode = urlParams.get('code');

let reportForm, drugCodeDisplay, reportStatus, cancelBtn;

document.addEventListener('DOMContentLoaded', function() {
    reportForm = document.getElementById('report-form');
    drugCodeDisplay = document.getElementById('drug-code-display');
    reportStatus = document.getElementById('report-status');
    cancelBtn = document.getElementById('cancel-btn');

    if (serialCode && drugCodeDisplay) {
        drugCodeDisplay.textContent = `Drug Code: ${serialCode}`;
    } else {
        if (reportStatus) {
            reportStatus.innerHTML = '<div class="status error">No drug code provided.</div>';
        }
        if (reportForm) {
            reportForm.style.display = 'none';
        }
    }

    if (reportForm) {
        reportForm.addEventListener('submit', handleSubmit);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (serialCode) {
                window.location.href = `result.html?code=${encodeURIComponent(serialCode)}`;
            } else {
                window.location.href = 'index.html';
            }
        });
    }
});

async function handleSubmit(e) {
    e.preventDefault();
    
    const reasonInput = document.getElementById('reason');
    if (!reasonInput) return;
    
    const reason = reasonInput.value.trim();
    
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
            if (reportForm) reportForm.reset();
            
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
}

function showStatus(message, type) {
    if (reportStatus) {
        reportStatus.textContent = message;
        reportStatus.className = `status ${type}`;
        reportStatus.style.display = 'block';
    }
}
