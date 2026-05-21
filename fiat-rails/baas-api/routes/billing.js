const express = require('express');
const { requireApiKey } = require('../lib/x402');
const { billingHistory } = require('../lib/store');

const router = express.Router();

router.get('/history', (req, res) => {
  if (!requireApiKey(req, res)) return;
  res.json({
    label: 'PROJECTION',
    disclaimer: 'Invoice history stub — PIPELINE',
    entries: billingHistory.slice(-50),
    count: billingHistory.length,
  });
});

/** Aggregate revenue for Telegram / dashboards — PROJECTION only */
router.get('/revenue', (req, res) => {
  const projectedMonthlyUsd = Number(process.env.BAAS_PROJECTED_MONTHLY_USD || 874000);
  res.json({
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    disclaimer:
      'NOT realized revenue. Marketing figures (10/10 agent score, $874K/month, revenue in seconds) are PIPELINE models until MSB + live exchange.',
    projected_monthly_usd: projectedMonthlyUsd,
    projected_daily_usd: Math.round(projectedMonthlyUsd / 30),
    realized_usd: 0,
    x402_fees_usd: 0,
    agent_fees_usd: 0,
    pool_setup_fees_usd: 0,
    billing_entries: billingHistory.length,
    as_of: new Date().toISOString(),
  });
});

module.exports = router;
