const urlParams = new URLSearchParams(window.location.search);
const serialCode = urlParams.get('code');

let resultContent, viewSupplyBtn, reportBtn, scanAgainBtn;

document.addEventListener('DOMContentLoaded', function() {
    resultContent = document.getElementById('result-content');
    viewSupplyBtn = document.getElementById('view-supply-btn');
    reportBtn = document.getElementById('report-btn');
    scanAgainBtn = document.getElementById('scan-again-btn');

    if (!serialCode) {
        if (resultContent) {
            resultContent.innerHTML = '<div class="status error">No drug code provided. Please scan a QR code.</div>';
        }
    } else {
        fetchDrugInfo(serialCode);
    }

    if (viewSupplyBtn) {
        viewSupplyBtn.addEventListener('click', () => {
            window.location.href = `supply.html?code=${encodeURIComponent(serialCode)}`;
        });
    }

    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            window.location.href = `report.html?code=${encodeURIComponent(serialCode)}`;
        });
    }

    if (scanAgainBtn) {
        scanAgainBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

async function fetchDrugInfo(code) {
    try {
        const response = await fetch(`/api/drug/${code}`);
        const data = await response.json();
        
        if (response.ok) {
            displayResult(data);
        } else {
            showError(data.error || 'Failed to fetch drug information');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Network error. Please check if the server is running.');
    }
}

function displayResult(data) {
    if (!resultContent) return;

    const statusClass = data.status || 'unknown';
    const statusText = data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'Unknown';
    
    let drugInfoHtml = `
        <div class="drug-card">
            <h2>Drug Verification Result</h2>
            <div class="drug-info">
                <div class="info-row">
                    <span class="info-label">Serial Code:</span>
                    <span class="info-value"><strong>${data.serial_code}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </span>
                </div>
    `;
    
    if (data.drug_info) {
        const drug = data.drug_info;
        drugInfoHtml += `
                <div class="info-row">
                    <span class="info-label">Product Name:</span>
                    <span class="info-value">${drug.proprietary_name || drug.non_proprietary_name || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Generic Name:</span>
                    <span class="info-value">${drug.non_proprietary_name || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Dosage Form:</span>
                    <span class="info-value">${drug.dosage_form || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Route:</span>
                    <span class="info-value">${drug.route || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Manufacturer:</span>
                    <span class="info-value">${drug.labeler_name || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">NDC Code:</span>
                    <span class="info-value">${drug.product_ndc || data.ndc_code || 'N/A'}</span>
                </div>
        `;
    } else {
        drugInfoHtml += `
                <div class="info-row">
                    <span class="info-label">Drug Information:</span>
                    <span class="info-value">Not available from OpenFDA</span>
                </div>
        `;
    }
    
    drugInfoHtml += `
            </div>
        </div>
    `;
    
    resultContent.innerHTML = drugInfoHtml;
    
    if (viewSupplyBtn) viewSupplyBtn.style.display = 'inline-block';
    if (reportBtn) reportBtn.style.display = 'inline-block';
    
    if (data.status === 'counterfeit' || data.status === 'recalled') {
        resultContent.innerHTML += `
            <div class="status error">
                ⚠️ WARNING: This drug has been flagged as ${data.status.toUpperCase()}!
            </div>
        `;
    }
}

function showError(message) {
    if (resultContent) {
        resultContent.innerHTML = `
            <div class="status error">${message}</div>
        `;
    }
}
