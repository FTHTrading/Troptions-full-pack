// agents/orchestrator/server.js
// REST API for the Agent Orchestrator

const express = require('express');
const { AgentOrchestrator } = require('./agent-orchestrator');

const app = express();
app.use(express.json());

let orchestrator = null;

// Initialize orchestrator
async function init() {
 orchestrator = new AgentOrchestrator({
 xrplNode: process.env.XRPL_NODE || 'wss://xrplcluster.com',
 issuerSeed: process.env.ISSUER_SEED,
 complianceUrl: process.env.COMPLIANCE_URL || 'http://localhost:4025',
 arbitrageBotUrl: process.env.ARBITRAGE_BOT_URL || 'http://localhost:4028',
 x402Gateway: process.env.X402_GATEWAY || 'http://localhost:4030',
 maxPositionUsd: parseFloat(process.env.MAX_POSITION_USD) || 10000,
 maxDailyLoss: parseFloat(process.env.MAX_DAILY_LOSS) || 1000
 });
 
 await orchestrator.initialize();
}

// Health check
app.get('/health', (req, res) => {
 res.json({
 status: 'ok',
 service: 'agent-orchestrator',
 port: 4100,
 agents: orchestrator ? Array.from(orchestrator.agents.keys()) : [],
 uptime: process.uptime()
 });
});

// POST /trade — Execute a single trade cycle
app.post('/trade', async (req, res) => {
 const { symbol, strategy } = req.body;
 
 if (!symbol) {
 return res.status(400).json({ error: 'symbol is required' });
 }
 
 try {
 const result = await orchestrator.executeTradeCycle(symbol);
 res.json(result);
 } catch (err) {
 res.status(500).json({ error: err.message });
 }
});

// POST /trade/batch — Execute trades for multiple symbols
app.post('/trade/batch', async (req, res) => {
 const { symbols } = req.body;
 
 if (!Array.isArray(symbols)) {
 return res.status(400).json({ error: 'symbols must be an array' });
 }
 
 const results = [];
 for (const symbol of symbols) {
 try {
 const result = await orchestrator.executeTradeCycle(symbol);
 results.push({ symbol, ...result });
 } catch (err) {
 results.push({ symbol, error: err.message });
 }
 }
 
 res.json({ results });
});

// GET /status — Orchestrator status
app.get('/status', (req, res) => {
 if (!orchestrator) {
 return res.status(503).json({ error: 'Orchestrator not initialized' });
 }
 res.json(orchestrator.getStatus());
});

// GET /positions — Current positions
app.get('/positions', (req, res) => {
 if (!orchestrator) {
 return res.status(503).json({ error: 'Orchestrator not initialized' });
 }
 res.json({
 positions: Object.fromEntries(orchestrator.positions),
 tradeHistory: orchestrator.tradeHistory.slice(-50)
 });
});

// POST /config — Update agent configuration
app.post('/config', (req, res) => {
 const { maxPositionUsd, maxDailyLoss } = req.body;
 
 if (orchestrator) {
 if (maxPositionUsd) orchestrator.config.maxPositionUsd = maxPositionUsd;
 if (maxDailyLoss) orchestrator.config.maxDailyLoss = maxDailyLoss;
 }
 
 res.json({ updated: true, config: orchestrator?.config });
});

// Error handler
app.use((err, req, res, next) => {
 console.error('Agent Orchestrator error:', err);
 res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
 console.log(`Agent Orchestrator running on port ${PORT}`);
 console.log('Endpoints:');
 console.log('  POST /trade         - Execute single trade');
 console.log('  POST /trade/batch   - Execute multiple trades');
 console.log('  GET  /status        - Orchestrator status');
 console.log('  GET  /positions     - Current positions');
 console.log('  POST /config        - Update configuration');
 
 // Initialize
 init().catch(err => {
 console.error('Failed to initialize:', err);
 process.exit(1);
 });
});
