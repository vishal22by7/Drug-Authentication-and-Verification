const fs = require('fs');
const path = require('path');

const EVENTS_FILE = process.env.VERCEL 
    ? '/tmp/blockchain-events.json'
    : path.join(__dirname, 'blockchain-events.json');

function loadEvents() {
    if (process.env.VERCEL && !fs.existsSync('/tmp')) {
        fs.mkdirSync('/tmp', { recursive: true });
    }
    
    if (fs.existsSync(EVENTS_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
        } catch (e) {
            return {};
        }
    }
    return {};
}

let events = loadEvents();

function saveEvents() {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

function initBlockchain() {
    return Promise.resolve();
}

function getSupplyEvents(drugCode) {
    events = loadEvents();
    return Promise.resolve(events[drugCode] || []);
}

function addSupplyEvent(drugCode, fromLocation, toLocation) {
    if (!events[drugCode]) {
        events[drugCode] = [];
    }
    
    events[drugCode].push({
        fromLocation,
        toLocation,
        timestamp: Math.floor(Date.now() / 1000)
    });
    
    saveEvents();
    
    return Promise.resolve({
        success: true,
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: events[drugCode].length
    });
}

function getEventCount(drugCode) {
    events = loadEvents();
    return Promise.resolve((events[drugCode] || []).length);
}

function setContractAddress(address) {}

module.exports = {
    initBlockchain,
    getSupplyEvents,
    addSupplyEvent,
    getEventCount,
    setContractAddress
};
