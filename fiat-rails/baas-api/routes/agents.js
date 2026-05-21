const express = require('express');
const crypto = require('crypto');

const router = express.Router();

/** In-memory agent registry — no wallet seeds persisted */
const agents = new Map();

router.post('/register', (req, res) => {
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
  };

  agents.set(agent_id, record);

  res.status(201).json({
    ...record,
    projection_note:
      'Agent capital and projected yield are PROJECTION until exchange AMM pools are live.',
    endpoints: {
      orchestrator_cycle: 'POST http://127.0.0.1:4031/run-cycle',
      arbitrage: 'POST http://127.0.0.1:4028/execute',
    },
  });
});

router.get('/', (req, res) => {
  res.json({
    agents: [...agents.values()],
    count: agents.size,
    label: 'PIPELINE',
  });
});

router.get('/:agent_id', (req, res) => {
  const row = agents.get(req.params.agent_id);
  if (!row) {
    return res.status(404).json({ error: 'Agent not found', label: 'PIPELINE' });
  }
  res.json(row);
});

module.exports = router;
