/**
 * x402 proxied routes (JS mirror of routes/x402_proxied.py for Node deployments).
 * Production PM2 uses Python main.py — keep paths aligned.
 */
const express = require('express');
const axios = require('axios');
const { createInvoice, verifyPayment } = require('../payments');

const router = express.Router();
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://127.0.0.1:4022';
const NEOBANK_URL = process.env.NEOBANK_URL || 'http://127.0.0.1:4026';
const BAAS_URL = process.env.BAAS_API_URL || 'http://127.0.0.1:8097';

function requirePayment(req, res, next) {
  const receipt = req.headers['x-402-payment'] || req.headers['x-402-receipt'];
  if (receipt && verifyPayment(receipt).ok) {
    req.x402Receipt = receipt;
    return next();
  }
  return res.status(402).json({
    error: 'payment_required',
    invoice: createInvoice(req.x402Service || 'unknown', '1'),
  });
}

router.get('/market-data/orderbook', requirePayment, (req, res) => {
  const pair = req.query.pair || 'USD-IOU/EUR-IOU';
  const mid = 0.915;
  res.json({
    pair,
    bids: [{ price: (mid - 0.001).toFixed(6), size: '25000' }],
    asks: [{ price: (mid + 0.001).toFixed(6), size: '25000' }],
    mid: mid.toFixed(6),
    source: 'mock',
    label: 'PIPELINE',
  });
});

router.post('/exchange/place-order', requirePayment, (req, res) => {
  res.json({
    ok: true,
    order_id: `ord_stub_${req.body?.pair || 'unknown'}`,
    status: 'pipeline',
    label: 'PIPELINE',
  });
});

router.post('/fiat/deposit', requirePayment, async (req, res) => {
  try {
    const r = await axios.post(`${ORCHESTRATOR_URL}/api/v1/payments/wire`, req.body, {
      validateStatus: () => true,
    });
    res.json({ proxied: true, orchestrator_status: r.status, body: r.data });
  } catch (err) {
    res.json({ proxied: false, label: 'PIPELINE', error: err.message, stub: req.body });
  }
});

router.post('/cards/auth', requirePayment, async (req, res) => {
  try {
    const r = await axios.post(`${NEOBANK_URL}/cards/authorize`, req.body, {
      validateStatus: () => true,
    });
    res.json({ proxied: true, neobank_status: r.status, body: r.data });
  } catch {
    res.json({ authorized: true, stub: true, label: 'PROJECTION', payload_keys: Object.keys(req.body || {}) });
  }
});

router.post('/baas/onboard', requirePayment, async (req, res) => {
  try {
    const r = await axios.post(`${BAAS_URL}/api/v1/tokens`, req.body, {
      headers: { 'X-402-Payment': req.x402Receipt },
      validateStatus: () => true,
    });
    res.json({ proxied: true, baas_status: r.status, body: r.data });
  } catch (err) {
    res.json({ proxied: false, error: err.message, label: 'PIPELINE' });
  }
});

module.exports = router;
