# 🏥 Drug Authenticity Verification System

A web-based drug authenticity verification system using QR code scanning, local database, and blockchain tracking.

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

### 3. Add Supply Chain Events
```bash
npm run add-events
```

### 4. Start Server
```bash
npm start
```

### 5. Open Browser
Go to: **http://localhost:3000**

## Available Commands

```bash
npm start              # Start the server
npm run init-db        # Initialize database with sample drugs
npm run add-events     # Add supply chain events
```

## Test QR Codes

Scan these codes (or type them manually):
- `DRG001` - Authentic drug
- `DRG003` - Counterfeit drug
- `DRG005` - Recalled drug
- `DRG016` - Recalled drug

## Features

- QR Code Scanning
- Drug Verification
- OpenFDA Integration
- Supply Chain Tracking
- Counterfeit Detection
- User Reporting

## Project Structure

```
DrugAuth/
├── contracts/          # Solidity smart contracts
├── public/             # Frontend files
├── routes/             # API routes
├── scripts/            # Utility scripts
├── server.js           # Main server file
├── db.js               # Database module
└── blockchain-storage.js  # Blockchain storage
```

## Environment Variables

Create a `.env` file (optional):
```
PORT=3000
OPENFDA_API_KEY=your_key_here
```

## Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel login`
3. Run: `vercel`
4. Follow prompts to deploy

## Note

This system uses blockchain storage for demonstration purposes. In production, this would integrate with a real blockchain network.
