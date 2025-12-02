const express = require('express');
const router = express.Router();
const blockchain = require('../blockchain-storage');

router.get('/:serialCode', async (req, res) => {
    try {
        const { serialCode } = req.params;
        const events = await blockchain.getSupplyEvents(serialCode);
        
        res.json({
            serial_code: serialCode,
            events: events,
            count: events.length
        });
        
    } catch (error) {
        res.json({
            serial_code: req.params.serialCode,
            events: [],
            count: 0
        });
    }
});

module.exports = router;
