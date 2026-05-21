const express = require('express');
const { requireApiKey } = require('../lib/x402');
const { tokens } = require('../lib/store');

const router = express.Router();

// GET /api/v1/dashboard/:token_id/revenue — PROJECTION only
router.get('/:token_id/revenue', (req, res) => {
  if (!requireApiKey(req, res)) return;

  const token = tokens.get(req.params.token_id);
  const baseVol = token ? 1_000_000 : 500_000;

  res.json({
    token_id: req.params.token_id,
    symbol: token?.symbol,
    label: 'PROJECTION',
    disclaimer:
      'Illustrative PROJECTION only — not forecasts, not audited financials. PIPELINE until MSB omnibus live.',
    period: 'monthly',
    alexandrite_template: {
      tier: 'standard',
      platform_fee_usd: 10000,
      txn_fee_bps: 25,
      illustrative_volume_usd: baseVol,
    },
    revenue_projection: {
      interchange_usd: Math.round(baseVol * 0.0015),
      platform_fees_usd: 10000,
      arbitrage_share_usd: Math.round(baseVol * 0.0002),
      total_projection_usd: Math.round(baseVol * 0.0015 + 10000 + baseVol * 0.0002),
    },
    status: 'pipeline',
  });
});

module.exports = router;
