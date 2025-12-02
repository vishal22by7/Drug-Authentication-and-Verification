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

db.initDB();
blockchain.initBlockchain().catch(() => {});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
