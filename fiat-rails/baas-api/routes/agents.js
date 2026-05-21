const express = require('express');
const crypto = require('crypto');

const router = express.Router();

/** In-memory agent registry — no wallet seeds persisted */
const agents = new Map();
/** @type {Map<string, Array<object>>} */
const trades = new Map();

function ensureAgent(agentId) {
  if (!agents.has(agentId)) return null;
  return agents.get(agentId);
}

function registerHandler(req, res) {
  const { agent_id, wallet, capital_troptions } = req.body || {};
  if (!agent_id || !wallet) {
    return res.status(400).json({
      error: 'agent_id and wallet required',
      label: 'PIPELINE',
    });
  }

  const record = {
    agent_id,
    wallet,
    capital_troptions: Number(capital_troptions || 0),
    status: 'registered',
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    registered_at: new Date().toISOString(),
    registration_ref: `reg_${crypto.randomBytes(6).toString('hex')}`,
    trades_count: 0,
    projected_revenue_usd: 0,
  };

  agents.set(agent_id, record);
  trades.set(agent_id, []);

  res.status(201).json({
    ...record,
    projection_note:
      'Agent capital and projected yield are PROJECTION until exchange AMM pools are live.',
    endpoints: {
      orchestrator_cycle: 'POST http://127.0.0.1:4031/run-cycle',
      report_trade: `POST http://127.0.0.1:4029/api/v1/agents/${agent_id}/trades`,
      revenue: `GET http://127.0.0.1:4029/api/v1/agents/${agent_id}/revenue`,
      arbitrage: 'POST http://127.0.0.1:4028/execute',
    },
  });
}

router.post('/', registerHandler);
router.post('/register', registerHandler);

router.get('/', (req, res) => {
  res.json({
    agents: [...agents.values()],
    count: agents.size,
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
  });
});

router.get('/:agent_id', (req, res) => {
  const row = ensureAgent(req.params.agent_id);
  if (!row) {
    return res.status(404).json({ error: 'Agent not found', label: 'PIPELINE' });
  }
  res.json(row);
});

router.post('/:agent_id/trades', (req, res) => {
  const row = ensureAgent(req.params.agent_id);
  if (!row) {
    return res.status(404).json({ error: 'Agent not found', label: 'PIPELINE' });
  }

  const trade = {
    trade_id: `tr_${crypto.randomBytes(6).toString('hex')}`,
    agent_id: req.params.agent_id,
    reported_at: new Date().toISOString(),
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    ...(req.body || {}),
  };

  const list = trades.get(req.params.agent_id) || [];
  list.push(trade);
  trades.set(req.params.agent_id, list);
  row.trades_count = list.length;

  res.status(201).json({
    ...trade,
    projection_note: 'Trade PnL is PROJECTION until live settlement.',
  });
});

router.get('/:agent_id/revenue', (req, res) => {
  const row = ensureAgent(req.params.agent_id);
  if (!row) {
    return res.status(404).json({ error: 'Agent not found', label: 'PIPELINE' });
  }

  const agentTrades = trades.get(req.params.agent_id) || [];
  const projected = agentTrades.reduce(
    (sum, t) => sum + Number(t.projected_pnl_usd || 0),
    0
  );

  res.json({
    agent_id: req.params.agent_id,
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    capital_troptions: row.capital_troptions,
    trades_count: agentTrades.length,
    projected_revenue_usd: projected,
    disclaimer:
      'NOT realized revenue. Do not cite agent totals as fact (e.g. $791K claims).',
    recent_trades: agentTrades.slice(-10),
  });
});

module.exports = router;
