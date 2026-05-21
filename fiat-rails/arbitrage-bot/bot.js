// fiat-rails/arbitrage-bot/bot.js
const express = require('express');
const app = express();
app.use(express.json());

let running = false;
let scanCount = 0;
const trades = [];

// Health check
app.get('/health', (req, res) => {
 res.json({ status: 'ok', service: 'arbitrage-bot', port: 4028 });
});

// GET /status
app.get('/status', (req, res) => {
 res.json({
 running,
 scan_count: scanCount,
 trades_executed: trades.length,
 profit_today: trades.reduce((sum, t) => sum + (t.profit || 0), 0)
 });
});

// POST /start
app.post('/start', (req, res) => {
 running = true;
 startScanning();
 res.json({ status: 'started' });
});

// POST /stop
app.post('/stop', (req, res) => {
 running = false;
 res.json({ status: 'stopped' });
});

// GET /trades
app.get('/trades', (req, res) => {
 res.json({ trades: trades.slice(-20) });
});

async function scanMarkets() {
 if (!running) return;
 
 scanCount++;
 console.log(`[Arbitrage] Scan #${scanCount}`);
 
 // In production:
 // 1. Query all partner bank FX rates
 // 2. Query Exchange OS for IOU pair prices
 // 3. Find discrepancies > threshold
 // 4. Execute trades
 
 // Mock trade for demonstration
 if (Math.random() > 0.7) {
 const trade = {
 id: `arb_${Date.now()}`,
 pair: 'USD-EUR',
 buy_bank: 'Bank A',
 sell_bank: 'Bank B',
 amount: 10000,
 profit: 45.50,
 executed_at: new Date().toISOString()
 };
 trades.push(trade);
 console.log(`[Arbitrage] Trade executed: +${trade.profit} USD`);
 }
}

function startScanning() {
 if (!running) return;
 scanMarkets().catch(err => console.error('Scan error:', err));
 setTimeout(startScanning, 15000); // Every 15 seconds
}

const PORT = process.env.PORT || 4028;
app.listen(PORT, () => {
 console.log(`Arbitrage Bot running on port ${PORT}`);
});
