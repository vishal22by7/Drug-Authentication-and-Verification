const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.VERCEL 
    ? '/tmp/drugs.db'
    : path.join(__dirname, 'drugs.db');

function getDB() {
    if (process.env.VERCEL && !fs.existsSync('/tmp')) {
        fs.mkdirSync('/tmp', { recursive: true });
    }
    return new sqlite3.Database(DB_PATH);
}

function initDB() {
    const db = getDB();
    
    db.run(`
        CREATE TABLE IF NOT EXISTS drugs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            serial_code TEXT UNIQUE NOT NULL,
            ndc_code TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('authentic', 'counterfeit', 'recalled', 'unknown'))
        )
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            serial_code TEXT NOT NULL,
            reason TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )
    `);
    
    db.close();
}

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = getDB();
        db.all(sql, params, (err, rows) => {
            db.close();
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = getDB();
        db.run(sql, params, function(err) {
            db.close();
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

module.exports = {
    getDB,
    initDB,
    query,
    run
};
