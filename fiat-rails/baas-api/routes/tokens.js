const express = require('express');
const { gatePayment, requireApiKey } = require('../lib/x402');
const { tokenSetupFeeUsd } = require('../lib/fees');
const { tokens, createToken, arbitrageConfigs, recordBilling } = require('../lib/store');
const { notifyDownstream } = require('../lib/pipeline');

const router = express.Router();

router.post('/', (req, res) => {
  if (!requireApiKey(req, res)) return;

  const { symbol, name, issuer, chain, collateral_type, initial_supply } = req.body;
  if (!symbol || !issuer) {
    return res.status(400).json({ error: 'symbol and issuer are required', label: 'PIPELINE' });
  }

  const fee = tokenSetupFeeUsd();
  if (!gatePayment(req, res, {
    service: 'baas/token-setup',
    amount_usd: fee,
    description: `BaaS token onboarding: ${symbol}`,
  })) {
    return;
  }

  const token = createToken({
    symbol,
    name,
    issuer,
    chain,
    collateral_type,
    initial_supply,
    setup_fee_paid_usd: fee,
  });

  recordBilling({
    id: `bill_${Date.now()}`,
    kind: 'token-setup',
    token_id: token.token_id,
    amount_usd: fee,
    paid_at: new Date().toISOString(),
    label: 'PIPELINE',
  });
  notifyDownstream('token-setup', { token_id: token.token_id, symbol }).catch(console.error);

  console.log(`[baas-api] token onboarded ${symbol} (${token.token_id})`);
  res.status(201).json({
    ...token,
    x402_receipt: req.x402.receipt_id,
    message: 'Token registered — pool creation is separate POST /api/v1/pools',
    label: 'PIPELINE',
  });
});

router.get('/', (req, res) => {
  if (!requireApiKey(req, res)) return;
  const list = Array.from(tokens.values());
  res.json({ tokens: list, count: list.length, label: 'PIPELINE' });
});

router.get('/:id', (req, res) => {
  if (!requireApiKey(req, res)) return;
  const token = tokens.get(req.params.id);
  if (!token) return res.status(404).json({ error: 'Token not found' });
  res.json(token);
});

// POST /api/v1/tokens/:token_id/arbitrage — per-token arb config
router.post('/:token_id/arbitrage', (req, res) => {
  if (!requireApiKey(req, res)) return;
  const cfg = {
    token_id: req.params.token_id,
    enabled: req.body?.enabled !== false,
    min_spread_bps: Number(req.body?.min_spread_bps || 25),
    max_position_usd: Number(req.body?.max_position_usd || 50000),
    watch_pairs: req.body?.watch_pairs || ['USD-IOU/EUR-IOU'],
    label: 'PIPELINE',
    updated_at: new Date().toISOString(),
  };
  arbitrageConfigs.set(req.params.token_id, cfg);
  res.json({ ok: true, config: cfg });
});

/** POST /api/v1/tokens/:token_id/price — PIPELINE stub for Telegram /setprice */
router.post('/:token_id/price', (req, res) => {
  const price = Number(req.body?.price_usd ?? req.body?.price);
  if (!Number.isFinite(price) || price <= 0) {
    return res.status(400).json({ error: 'price_usd required', label: 'PIPELINE' });
  }
  const token = tokens.get(req.params.token_id);
  res.json({
    token_id: req.params.token_id,
    price_usd: price,
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    token_found: Boolean(token),
    disclaimer: 'Price set is a PIPELINE stub — not live exchange listing.',
    updated_at: new Date().toISOString(),
  });
});

module.exports = router;
