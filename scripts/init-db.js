const db = require('../db');

async function initDatabase() {
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
            console.error(`Error: ${drug.serial_code} - ${error.message}`);
        }
    }
    
    console.log(`Database initialized with ${sampleDrugs.length} drugs`);
    process.exit(0);
}

initDatabase();
