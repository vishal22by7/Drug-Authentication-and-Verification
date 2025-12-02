let html5QrcodeScanner = null;
let isScanning = false;

let startBtn, stopBtn, qrReader, qrResults, statusDiv;

document.addEventListener('DOMContentLoaded', function() {
    startBtn = document.getElementById('start-btn');
    stopBtn = document.getElementById('stop-btn');
    qrReader = document.getElementById('qr-reader');
    qrResults = document.getElementById('qr-reader-results');
    statusDiv = document.getElementById('status');

    if (!startBtn || !stopBtn) {
        console.error('Buttons not found!');
        return;
    }

    startBtn.addEventListener('click', startScanning);
    stopBtn.addEventListener('click', stopScanning);
});

function startScanning() {
    if (isScanning) return;
    
    if (typeof Html5Qrcode === 'undefined') {
        showStatus('Error: QR Scanner library not loaded. Please refresh the page.', 'error');
        return;
    }
    
    html5QrcodeScanner = new Html5Qrcode("qr-reader");
    
    html5QrcodeScanner.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanError
    )
    .then(() => {
        isScanning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        if (qrResults) qrResults.textContent = 'Scanning...';
        showStatus('Camera started. Point at QR code.', 'info');
    })
    .catch(err => {
        console.error('Error starting scanner:', err);
        showStatus('Error: Could not access camera. Please check permissions.', 'error');
    });
}

function stopScanning() {
    if (!isScanning || !html5QrcodeScanner) return;
    
    html5QrcodeScanner.stop()
        .then(() => {
            html5QrcodeScanner.clear();
            isScanning = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            if (qrResults) qrResults.textContent = '';
            showStatus('Scanning stopped', 'info');
        })
        .catch(err => {
            console.error('Error stopping scanner:', err);
        });
}

function onScanSuccess(decodedText, decodedResult) {
    if (qrResults) qrResults.textContent = `Scanned: ${decodedText}`;
    showStatus('QR code detected! Redirecting...', 'success');
    
    stopScanning();
    
    setTimeout(() => {
        window.location.href = `result.html?code=${encodeURIComponent(decodedText)}`;
    }, 1000);
}

function onScanError(errorMessage) {
    // Ignore frequent error messages during scanning
}

function showStatus(message, type) {
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
    }
}
