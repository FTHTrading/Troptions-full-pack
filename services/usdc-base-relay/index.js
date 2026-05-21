// services/usdc-base-relay/index.js — Base USDC mint/transfer stub (:4040)
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 4040;
const CHAIN = process.env.BASE_CHAIN_ID || '8453';

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'usdc-base-relay',
    port: PORT,
    chain: 'base',
    chain_id: CHAIN,
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    disclaimer: 'Mint/transfer are stubs until MSB + Circle/Base treasury wired.',
  });
});

app.post('/mint', (req, res) => {
  const { amount_usdc, recipient } = req.body || {};
  res.json({
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    action: 'mint',
    amount_usdc: amount_usdc || '0',
    recipient: recipient || null,
    tx_ref: `base_stub_${crypto.randomBytes(8).toString('hex')}`,
    status: 'queued_stub',
    note: 'Not on-chain — PIPELINE until live Base USDC rail',
  });
});

app.post('/deposit', (req, res) => {
  res.json({
    label: 'PIPELINE',
    action: 'deposit',
    ...(req.body || {}),
    tx_ref: `dep_${crypto.randomBytes(6).toString('hex')}`,
    status: 'stub',
  });
});

app.post('/withdraw', (req, res) => {
  res.json({
    label: 'PIPELINE',
    action: 'withdraw',
    ...(req.body || {}),
    tx_ref: `wdr_${crypto.randomBytes(6).toString('hex')}`,
    status: 'stub',
  });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`USDC Base relay :${PORT} (PIPELINE)`);
  });
}

module.exports = app;
