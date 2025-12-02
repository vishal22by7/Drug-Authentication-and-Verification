require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const blockchain = require('./blockchain-storage');
const drugRoutes = require('./routes/drug');
const supplyRoutes = require('./routes/supply');
const reportRoutes = require('./routes/report');

const app = express();
const PORT = process.env.PORT || 3000;

let isInitialized = false;

async function initializeDatabase() {
    if (isInitialized) return;
    
    try {
        db.initDB();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sampleDrugs = [
            { serial_code: 'DRG001', ndc_code: '50419-542', status: 'authentic' },
            { serial_code: 'DRG002', ndc_code: '11523-7158', status: 'authentic' },
            { serial_code: 'DRG003', ndc_code: '11523-7160', status: 'counterfeit' },
            { serial_code: 'DRG004', ndc_code: '0280-8252', status: 'authentic' },
            { serial_code: 'DRG005', ndc_code: '11523-7162', status: 'recalled' },
            { serial_code: 'DRG006', ndc_code: '79950-004', status: 'authentic' },
            { serial_code: 'DRG007', ndc_code: '80425-0091', status: 'authentic' },
            { serial_code: 'DRG008', ndc_code: '76282-208', status: 'authentic' },
            { serial_code: 'DRG009', ndc_code: '76420-542', status: 'authentic' },
            { serial_code: 'DRG010', ndc_code: '0591-2729', status: 'authentic' },
            { serial_code: 'DRG011', ndc_code: '0591-3670', status: 'counterfeit' },
            { serial_code: 'DRG012', ndc_code: '82982-070', status: 'authentic' },
            { serial_code: 'DRG013', ndc_code: '82009-103', status: 'authentic' },
            { serial_code: 'DRG014', ndc_code: '82461-712', status: 'authentic' },
            { serial_code: 'DRG015', ndc_code: '83324-100', status: 'authentic' },
            { serial_code: 'DRG016', ndc_code: '0832-0356', status: 'recalled' },
            { serial_code: 'DRG017', ndc_code: '76420-842', status: 'authentic' }
        ];
        
        for (const drug of sampleDrugs) {
            try {
                await db.run(
                    'INSERT OR IGNORE INTO drugs (serial_code, ndc_code, status) VALUES (?, ?, ?)',
                    [drug.serial_code, drug.ndc_code, drug.status]
                );
            } catch (error) {
                // Silent fail
            }
        }
        
        await blockchain.initBlockchain();
        
        const fs = require('fs');
        const eventsPath = process.env.VERCEL 
            ? '/tmp/blockchain-events.json'
            : path.join(__dirname, 'blockchain-events.json');
        
        if (!fs.existsSync(eventsPath)) {
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
            
            const now = Math.floor(Date.now() / 1000);
            const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
            let eventIndex = 0;
            
            const events = {};
            for (const event of sampleEvents) {
                const daysAgo = Math.floor((sampleEvents.length - eventIndex) / 3);
                const hoursOffset = eventIndex % 24;
                const timestamp = thirtyDaysAgo + (daysAgo * 24 * 60 * 60) + (hoursOffset * 60 * 60);
                
                if (!events[event.drugCode]) {
                    events[event.drugCode] = [];
                }
                
                events[event.drugCode].push({
                    fromLocation: event.fromLocation,
                    toLocation: event.toLocation,
                    timestamp: timestamp
                });
                
                eventIndex++;
            }
            
            fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));
        }
        
        isInitialized = true;
    } catch (error) {
        // Silent fail - will retry on next request
    }
}

app.use(cors());
app.use(express.json());

app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

app.use(async (req, res, next) => {
    if (!isInitialized && req.path !== '/api/init-db' && req.path !== '/api/add-events' && !req.path.startsWith('/api/')) {
        await initializeDatabase();
    }
    next();
});

app.use('/api/drug', drugRoutes);
app.use('/api/supply', supplyRoutes);
app.use('/api/report', reportRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
