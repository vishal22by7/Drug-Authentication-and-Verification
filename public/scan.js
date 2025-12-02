let html5QrcodeScanner = null;
let isScanning = false;

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const qrReader = document.getElementById('qr-reader');
const qrResults = document.getElementById('qr-reader-results');
const statusDiv = document.getElementById('status');

startBtn.addEventListener('click', startScanning);
stopBtn.addEventListener('click', stopScanning);

function startScanning() {
    if (isScanning) return;
    
    html5QrcodeScanner = new Html5Qrcode("qr-reader");
    
    html5QrcodeScanner.start(
        { facingMode: "environment" }, // Use back camera
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
        qrResults.textContent = 'Scanning...';
        statusDiv.textContent = '';
        statusDiv.className = 'status';
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
            qrResults.textContent = '';
            showStatus('Scanning stopped', 'info');
        })
        .catch(err => {
            console.error('Error stopping scanner:', err);
        });
}

function onScanSuccess(decodedText, decodedResult) {
    qrResults.textContent = `Scanned: ${decodedText}`;
    showStatus('QR code detected! Redirecting...', 'success');
    
    // Stop scanning
    stopScanning();
    
    // Redirect to result page with serial code
    setTimeout(() => {
        window.location.href = `result.html?code=${encodeURIComponent(decodedText)}`;
    }, 1000);
}

function onScanError(errorMessage) {
    // Ignore frequent error messages during scanning
    // Only show if it's a significant error
}

function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}

