const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    try {
        const { serial_code, reason } = req.body;
        
        if (!serial_code || !reason) {
            return res.status(400).json({ 
                error: 'Missing required fields: serial_code and reason' 
            });
        }
        
        const timestamp = Math.floor(Date.now() / 1000);
        
        await db.run(
            'INSERT INTO reports (serial_code, reason, timestamp) VALUES (?, ?, ?)',
            [serial_code, reason, timestamp]
        );
        
        res.json({
            success: true,
            message: 'Report submitted successfully'
        });
        
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const reports = await db.query('SELECT * FROM reports ORDER BY timestamp DESC');
        res.json({ reports });
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

module.exports = router;
