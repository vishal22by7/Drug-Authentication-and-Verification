const blockchain = require('../blockchain-storage');
const fs = require('fs');
const path = require('path');

const EVENTS_FILE = process.env.VERCEL 
    ? '/tmp/blockchain-events.json'
    : path.join(__dirname, '..', 'blockchain-events.json');

if (fs.existsSync(EVENTS_FILE)) {
    fs.unlinkSync(EVENTS_FILE);
}

blockchain.initBlockchain();

const sampleEvents = [
    { drugCode: 'DRG001', fromLocation: 'Manufacturer', toLocation: 'National Distributor' },
    { drugCode: 'DRG001', fromLocation: 'National Distributor', toLocation: 'Local Warehouse' },
    { drugCode: 'DRG001', fromLocation: 'Local Warehouse', toLocation: 'Pharmacy' },
    { drugCode: 'DRG002', fromLocation: 'Manufacturer', toLocation: 'Regional Distributor' },
    { drugCode: 'DRG002', fromLocation: 'Regional Distributor', toLocation: 'Pharmacy' },
    { drugCode: 'DRG003', fromLocation: 'Unknown Source', toLocation: 'Unlicensed Warehouse' },
    { drugCode: 'DRG003', fromLocation: 'Unlicensed Warehouse', toLocation: 'Pharmacy' },
    { drugCode: 'DRG004', fromLocation: 'Manufacturer', toLocation: 'National Distributor' },
    { drugCode: 'DRG004', fromLocation: 'National Distributor', toLocation: 'Pharmacy' },
    { drugCode: 'DRG005', fromLocation: 'Manufacturer', toLocation: 'National Distributor' },
    { drugCode: 'DRG005', fromLocation: 'National Distributor', toLocation: 'Regional Warehouse' },
    { drugCode: 'DRG005', fromLocation: 'Regional Warehouse', toLocation: 'Pharmacy' },
    { drugCode: 'DRG006', fromLocation: 'Manufacturer', toLocation: 'International Distributor' },
    { drugCode: 'DRG006', fromLocation: 'International Distributor', toLocation: 'Local Warehouse' },
    { drugCode: 'DRG006', fromLocation: 'Local Warehouse', toLocation: 'Pharmacy' },
    { drugCode: 'DRG007', fromLocation: 'Manufacturer', toLocation: 'Direct Distributor' },
    { drugCode: 'DRG007', fromLocation: 'Direct Distributor', toLocation: 'Pharmacy' },
    { drugCode: 'DRG008', fromLocation: 'Manufacturer', toLocation: 'National Distributor' },
    { drugCode: 'DRG008', fromLocation: 'National Distributor', toLocation: 'Regional Warehouse' },
    { drugCode: 'DRG008', fromLocation: 'Regional Warehouse', toLocation: 'Pharmacy' },
    { drugCode: 'DRG009', fromLocation: 'Manufacturer', toLocation: 'National Distributor' },
    { drugCode: 'DRG009', fromLocation: 'National Distributor', toLocation: 'Pharmacy' },
    { drugCode: 'DRG010', fromLocation: 'Manufacturer', toLocation: 'Primary Distributor' },
    { drugCode: 'DRG010', fromLocation: 'Primary Distributor', toLocation: 'Secondary Distributor' },
    { drugCode: 'DRG010', fromLocation: 'Secondary Distributor', toLocation: 'Pharmacy' },
    { drugCode: 'DRG011', fromLocation: 'Unverified Source', toLocation: 'Unlicensed Distributor' },
    { drugCode: 'DRG011', fromLocation: 'Unlicensed Distributor', toLocation: 'Pharmacy' },
    { drugCode: 'DRG012', fromLocation: 'Manufacturer', toLocation: 'National Distributor' },
    { drugCode: 'DRG012', fromLocation: 'National Distributor', toLocation: 'Pharmacy' },
    { drugCode: 'DRG013', fromLocation: 'Manufacturer', toLocation: 'National Distributor' },
    { drugCode: 'DRG013', fromLocation: 'National Distributor', toLocation: 'Local Warehouse' },
    { drugCode: 'DRG013', fromLocation: 'Local Warehouse', toLocation: 'Pharmacy' },
    { drugCode: 'DRG014', fromLocation: 'Manufacturer', toLocation: 'Regional Distributor' },
    { drugCode: 'DRG014', fromLocation: 'Regional Distributor', toLocation: 'Pharmacy' },
    { drugCode: 'DRG015', fromLocation: 'Manufacturer', toLocation: 'Wholesale Distributor' },
    { drugCode: 'DRG015', fromLocation: 'Wholesale Distributor', toLocation: 'Retail Pharmacy' },
    { drugCode: 'DRG016', fromLocation: 'Manufacturer', toLocation: 'National Distributor' },
    { drugCode: 'DRG016', fromLocation: 'National Distributor', toLocation: 'Regional Warehouse' },
    { drugCode: 'DRG016', fromLocation: 'Regional Warehouse', toLocation: 'Pharmacy' },
    { drugCode: 'DRG017', fromLocation: 'Manufacturer', toLocation: 'National Distributor' },
    { drugCode: 'DRG017', fromLocation: 'National Distributor', toLocation: 'Local Warehouse' },
    { drugCode: 'DRG017', fromLocation: 'Local Warehouse', toLocation: 'Pharmacy' }
];

async function addEvents() {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
    
    let success = 0;
    let eventIndex = 0;
    
    for (const event of sampleEvents) {
        try {
            const daysAgo = Math.floor((sampleEvents.length - eventIndex) / 3);
            const hoursOffset = eventIndex % 24;
            const timestamp = thirtyDaysAgo + (daysAgo * 24 * 60 * 60) + (hoursOffset * 60 * 60);
            
            const originalAdd = blockchain.addSupplyEvent;
            blockchain.addSupplyEvent = async function(drugCode, fromLocation, toLocation) {
                const fs = require('fs');
                const path = require('path');
                const EVENTS_FILE = process.env.VERCEL 
                    ? '/tmp/blockchain-events.json'
                    : path.join(__dirname, '..', 'blockchain-events.json');
                
                let events = {};
                if (fs.existsSync(EVENTS_FILE)) {
                    try {
                        events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
                    } catch (e) {
                        events = {};
                    }
                }
                
                if (!events[drugCode]) {
                    events[drugCode] = [];
                }
                
                events[drugCode].push({
                    fromLocation,
                    toLocation,
                    timestamp: timestamp
                });
                
                fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
                
                return Promise.resolve({
                    success: true,
                    txHash: '0x' + Math.random().toString(16).substr(2, 64),
                    blockNumber: events[drugCode].length
                });
            };
            
            await blockchain.addSupplyEvent(event.drugCode, event.fromLocation, event.toLocation);
            blockchain.addSupplyEvent = originalAdd;
            
            success++;
            eventIndex++;
            
            await new Promise(resolve => setTimeout(resolve, 10));
        } catch (error) {
            console.error(`Error: ${event.drugCode} - ${error.message}`);
        }
    }
    
    console.log(`Added ${success} events successfully`);
    process.exit(0);
}

addEvents();
