const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const blockchain = require('../blockchain-storage');

function getDemoDrugInfo(serialCode, ndcCode) {
    const demoData = {
        'DRG001': { product_ndc: ndcCode, proprietary_name: 'Aspirin', non_proprietary_name: 'Aspirin', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Bayer HealthCare LLC', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG002': { product_ndc: ndcCode, proprietary_name: 'Aspirin', non_proprietary_name: 'Aspirin', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Bayer HealthCare LLC', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG003': { product_ndc: ndcCode, proprietary_name: 'Claritin', non_proprietary_name: 'Loratadine', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Bayer HealthCare LLC', product_type: 'HUMAN OTC DRUG' },
        'DRG004': { product_ndc: ndcCode, proprietary_name: 'Aspirin', non_proprietary_name: 'Aspirin', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Bayer HealthCare LLC', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG005': { product_ndc: ndcCode, proprietary_name: 'Aspirin', non_proprietary_name: 'Aspirin', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Bayer HealthCare LLC', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG006': { product_ndc: ndcCode, proprietary_name: 'Ibuprofen', non_proprietary_name: 'Ibuprofen', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Pfizer Inc.', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG007': { product_ndc: ndcCode, proprietary_name: 'Acetaminophen', non_proprietary_name: 'Acetaminophen', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Johnson & Johnson', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG008': { product_ndc: ndcCode, proprietary_name: 'Generic Tablet', non_proprietary_name: 'Generic Drug', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Exelan Pharmaceuticals Inc.', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG009': { product_ndc: ndcCode, proprietary_name: 'Generic Tablet', non_proprietary_name: 'Generic Drug', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Asclemed USA, Inc.', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG010': { product_ndc: ndcCode, proprietary_name: 'Generic Tablet', non_proprietary_name: 'Generic Drug', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Actavis Pharma, Inc.', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG011': { product_ndc: ndcCode, proprietary_name: 'Generic Tablet', non_proprietary_name: 'Generic Drug', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Actavis Pharma, Inc.', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG012': { product_ndc: ndcCode, proprietary_name: 'Generic Tablet', non_proprietary_name: 'Generic Drug', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Pharmasource Meds, LLC', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG013': { product_ndc: ndcCode, proprietary_name: 'Generic Tablet', non_proprietary_name: 'Generic Drug', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'QUALLENT PHARMACEUTICALS HEALTH LLC', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG014': { product_ndc: ndcCode, proprietary_name: 'Generic Tablet', non_proprietary_name: 'Generic Drug', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Medcore LLC', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG015': { product_ndc: ndcCode, proprietary_name: 'Generic Tablet', non_proprietary_name: 'Generic Drug', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'CHAIN DRUG MARKETING ASSOCIATION, INC.', product_type: 'HUMAN OTC DRUG' },
        'DRG016': { product_ndc: ndcCode, proprietary_name: 'Generic Tablet', non_proprietary_name: 'Generic Drug', dosage_form: 'TABLET', route: 'ORAL', labeler_name: 'Upsher-Smith laboratories, LLC', product_type: 'HUMAN PRESCRIPTION DRUG' },
        'DRG017': { product_ndc: ndcCode, proprietary_name: 'Generic Capsule', non_proprietary_name: 'Generic Drug', dosage_form: 'CAPSULE', route: 'ORAL', labeler_name: 'Asclemed USA, Inc.', product_type: 'HUMAN PRESCRIPTION DRUG' }
    };
    
    return demoData[serialCode] || {
        product_ndc: ndcCode || 'N/A',
        proprietary_name: 'Unknown',
        non_proprietary_name: 'Unknown',
        dosage_form: 'N/A',
        route: 'N/A',
        labeler_name: 'Unknown Manufacturer',
        product_type: 'UNKNOWN'
    };
}

router.get('/:serialCode', async (req, res) => {
    try {
        const { serialCode } = req.params;
        const drugs = await db.query('SELECT * FROM drugs WHERE serial_code = ?', [serialCode]);
        
        let status = 'unknown';
        let ndcCode = null;
        
        if (drugs.length > 0) {
            status = drugs[0].status;
            ndcCode = drugs[0].ndc_code;
        }
        
        let drugInfo = null;
        if (ndcCode) {
            try {
                const apiKey = process.env.OPENFDA_API_KEY;
                const apiUrl = apiKey 
                    ? `https://api.fda.gov/drug/ndc.json?api_key=${apiKey}&search=product_ndc:${ndcCode}&limit=1`
                    : `https://api.fda.gov/drug/ndc.json?search=product_ndc:${ndcCode}&limit=1`;
                
                const fdaResponse = await axios.get(apiUrl, { timeout: 5000 });
                
                if (fdaResponse.data && fdaResponse.data.results && fdaResponse.data.results.length > 0) {
                    const fdaData = fdaResponse.data.results[0];
                    drugInfo = {
                        product_ndc: fdaData.product_ndc,
                        product_type: fdaData.product_type,
                        proprietary_name: fdaData.brand_name || fdaData.proprietary_name || 'N/A',
                        non_proprietary_name: fdaData.generic_name || fdaData.non_proprietary_name || 'N/A',
                        dosage_form: fdaData.dosage_form || 'N/A',
                        route: fdaData.route ? (Array.isArray(fdaData.route) ? fdaData.route.join(', ') : fdaData.route) : 'N/A',
                        active_ingredient: fdaData.active_ingredients || fdaData.active_ingredient || [],
                        labeler_name: fdaData.labeler_name || 'N/A'
                    };
                }
            } catch (fdaError) {
                drugInfo = getDemoDrugInfo(serialCode, ndcCode);
            }
            
            if (!drugInfo) {
                drugInfo = getDemoDrugInfo(serialCode, ndcCode);
            }
        }
        
        let blockchainEventCount = 0;
        try {
            blockchainEventCount = await blockchain.getEventCount(serialCode);
        } catch (blockchainError) {}
        
        res.json({
            serial_code: serialCode,
            status: status,
            drug_info: drugInfo,
            blockchain_events: blockchainEventCount,
            ndc_code: ndcCode
        });
        
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

module.exports = router;
