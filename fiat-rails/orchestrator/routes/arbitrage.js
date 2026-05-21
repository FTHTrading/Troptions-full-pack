// fiat-rails/orchestrator/routes/arbitrage.js
// Cross-bank, cross-currency arbitrage bot
const express = require('express');
const router = express.Router();
const axios = require('axios');

const EXCHANGE_OS_URL = process.env.EXCHANGE_OS_URL || 'http://localhost:8091';

// Arbitrage opportunities tracking
const opportunities = new Map();
let botRunning = false;

// GET /api/v1/arbitrage/status
router.get('/status', (req, res) => {
 res.json({
 running: botRunning,
 opportunities_found: opportunities.size,
 last_scan: new Date().toISOString()
 });
});

// POST /api/v1/arbitrage/scan
// Manually trigger arbitrage scan
router.post('/scan', async (req, res) => {
 try {
 const results = await scanArbitrageOpportunities();
 res.json({
 scanned: true,
 opportunities_found: results.length,
 opportunities: results
 });
 } catch (err) {
 res.status(500).json({ error: err.message });
 }
});

// POST /api/v1/arbitrage/start
router.post('/start', (req, res) => {
 botRunning = true;
 startArbitrageLoop();
 res.json({ status: 'started', message: 'Arbitrage bot running' });
});

// POST /api/v1/arbitrage/stop
router.post('/stop', (req, res) => {
 botRunning = false;
 res.json({ status: 'stopped', message: 'Arbitrage bot stopped' });
});

// GET /api/v1/arbitrage/opportunities
router.get('/opportunities', (req, res) => {
 const all = Array.from(opportunities.values());
 res.json({
 count: all.length,
 opportunities: all.slice(0, 50) // Limit to 50
 });
});

// POST /api/v1/arbitrage — execute or simulate trade (arbitrage-bot calls this)
router.post('/', async (req, res) => {
  const {
    pair,
    spread_bps,
    amount_usd,
    dry_run,
    orderbook_mid,
    profit_reinvest_ratio,
    mock_orderbook,
  } = req.body;

  const amount = Number(amount_usd) || 0;
  const bps = Number(spread_bps) || 0;
  const isDry =
    dry_run === true ||
    dry_run === 'true' ||
    (process.env.ARBITRAGE_DRY_RUN || 'true').toLowerCase() === 'true';

  const grossProfit = Number((amount * (bps / 10000)).toFixed(2));
  const reinvest = Number(profit_reinvest_ratio ?? process.env.PROFIT_REINVEST_RATIO ?? 0.5);
  const netProfit = Number((grossProfit * reinvest).toFixed(2));

  const arbitrageId = `arb_${Date.now()}`;

  if (isDry) {
    return res.status(200).json({
      arbitrage_id: arbitrageId,
      status: 'dry_run',
      label: 'PIPELINE',
      pair: pair || 'unknown',
      spread_bps: bps,
      amount_usd: amount,
      profit_usd: netProfit,
      gross_profit_usd: grossProfit,
      profit_reinvest_ratio: reinvest,
      orderbook_mid,
      mock_orderbook: Boolean(mock_orderbook),
      message: 'DRY_RUN — no settlement (MSB omnibus PIPELINE)',
      disclaimer: 'PROJECTION — not audited P&L',
    });
  }

  // PIPELINE stub: mock successful execution until exchange + bank rails live
  const record = {
    arbitrage_id: arbitrageId,
    status: 'executed_stub',
    label: 'PIPELINE',
    pair,
    spread_bps: bps,
    amount_usd: amount,
    profit_usd: netProfit,
    executed_at: new Date().toISOString(),
  };
  opportunities.set(arbitrageId, record);

  return res.status(201).json({
    ...record,
    message: 'PIPELINE mock execution — wire to Exchange OS when live',
  });
});

// Core arbitrage logic
async function scanArbitrageOpportunities() {
 // In production, this would:
 // 1. Query multiple partner banks for their FX rates
 // 2. Query Exchange OS for IOU pair prices
 // 3. Compare to find discrepancies
 // 4. Execute trades when spread > threshold

 const mockOpportunities = [
 {
 id: 'arb_001',
 pair: 'USD-IOU/EUR-IOU',
 bank_a: 'Partner Bank A (US)',
 bank_b: 'Partner Bank B (EU)',
 buy_price: 0.98, // EUR per USD
 sell_price: 1.00,
 spread: 0.02,
 potential_profit: '2.0%',
 action: 'Buy EUR-IOU cheap, sell at market'
 },
 {
 id: 'arb_002',
 pair: 'USD-IOU/JPY-IOU',
 bank_a: 'Partner Bank A (US)',
 bank_b: 'Partner Bank C (JP)',
 buy_price: 142.5,
 sell_price: 143.2,
 spread: 0.7,
 potential_profit: '0.49%',
 action: 'Buy JPY-IOU at Bank C, sell at Bank A'
 }
 ];

 // Store opportunities
 mockOpportunities.forEach(opp => {
 opportunities.set(opp.id, {
 ...opp,
 timestamp: new Date().toISOString()
 });
 });

 return mockOpportunities;
}

function startArbitrageLoop() {
 if (!botRunning) return;
 
 console.log('Arbitrage bot scanning...');
 scanArbitrageOpportunities().catch(err => {
 console.error('Arbitrage scan error:', err);
 });
 
 // Scan every 30 seconds
 setTimeout(startArbitrageLoop, 30000);
}

module.exports = router;
