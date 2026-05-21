// fiat-rails/baas-api — PM2 baas-api :8097 (PIPELINE / PROJECTION)
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const { requireApiKey } = require('./middleware/hmac');
const { x402Middleware } = require('./middleware/x402');

const app = express();
app.use(express.json());

const TTN_LAUNCHER = process.env.TTN_LAUNCHER_URL || 'http://127.0.0.1:8092';
const EXCHANGE_URL = process.env.EXCHANGE_OS_URL || 'http://127.0.0.1:8091';

const tokens = new Map();
const pools = new Map();
const billing = [];
const arbitrageConfigs = new Map();

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'baas-api',
    port: Number(process.env.PORT) || 8097,
    label: 'PROJECTION',
    disclaimer: 'Revenue figures are PROJECTION only — PIPELINE until MSB live',
  });
});

// POST /api/v1/tokens — $10K setup fee via x402
app.post(
  '/api/v1/tokens',
  requireApiKey,
  x402Middleware({
    service: 'baas/token-setup',
    amount_usd: 10000,
    description: 'BaaS white-label token setup (PROJECTION)',
  }),
  (req, res) => {
    const { name, symbol, chain } = req.body;
    if (!name || !symbol) {
      return res.status(400).json({ error: 'name and symbol required' });
    }
    const tokenId = crypto.randomUUID();
    tokens.set(tokenId, {
      token_id: tokenId,
      name,
      symbol,
      chain: chain || 'xrpl',
      status: 'pipeline',
      label: 'PIPELINE',
      created_at: new Date().toISOString(),
      x402_paid: Boolean(req.x402Payment),
    });

    if (req.x402Payment) {
      pipelineOnPaid('token-setup', { token_id: tokenId, name, symbol }).catch(console.error);
    }

    res.status(201).json({
      token_id: tokenId,
      status: 'pipeline',
      label: 'PIPELINE',
      message: 'Token onboarding stub — ttn-launcher/exchange logged only',
    });
  }
);

// POST /api/v1/pools — 0.25% fee via x402
app.post(
  '/api/v1/pools',
  requireApiKey,
  x402Middleware({
    service: 'baas/pool-create',
    amount_usd: 2500,
    fee_bps: 25,
    description: 'Liquidity pool creation — 0.25% platform fee (PROJECTION)',
  }),
  (req, res) => {
    const { token_id, pair, initial_liquidity_usd } = req.body;
    if (!token_id) return res.status(400).json({ error: 'token_id required' });

    const poolId = crypto.randomUUID();
    pools.set(poolId, {
      pool_id: poolId,
      token_id,
      pair: pair || 'USD-IOU',
      initial_liquidity_usd: initial_liquidity_usd || 0,
      fee_bps: 25,
      label: 'PIPELINE',
      created_at: new Date().toISOString(),
    });

    if (req.x402Payment) {
      pipelineOnPaid('pool-create', { pool_id: poolId, token_id }).catch(console.error);
    }

    res.status(201).json({
      pool_id: poolId,
      fee_bps: 25,
      label: 'PIPELINE',
      disclaimer: 'PROJECTION — not live liquidity',
    });
  }
);

// GET /api/v1/dashboard/:token_id/revenue — mock PROJECTION
app.get('/api/v1/dashboard/:token_id/revenue', requireApiKey, (req, res) => {
  const token = tokens.get(req.params.token_id);
  const baseVol = token ? 1_000_000 : 500_000;
  res.json({
    token_id: req.params.token_id,
    label: 'PROJECTION',
    disclaimer:
      'All figures are illustrative PROJECTION only — not forecasts, not audited, PIPELINE until MSB live',
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

// POST /api/v1/tokens/:token_id/arbitrage — config
app.post('/api/v1/tokens/:token_id/arbitrage', requireApiKey, (req, res) => {
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

// GET /api/v1/billing/history
app.get('/api/v1/billing/history', requireApiKey, (req, res) => {
  res.json({
    label: 'PROJECTION',
    disclaimer: 'Invoice history stub — PIPELINE',
    entries: billing.slice(-50),
    count: billing.length,
  });
});

async function pipelineOnPaid(kind, meta) {
  const entry = {
    id: crypto.randomUUID(),
    kind,
    meta,
    paid_at: new Date().toISOString(),
    label: 'PIPELINE',
  };
  billing.push(entry);

  console.log(`[baas-api] PIPELINE paid stub: ${kind}`, meta);

  try {
    await axios.post(
      `${TTN_LAUNCHER}/api/internal/baas-stub`,
      { kind, ...meta },
      { timeout: 3000, validateStatus: () => true }
    );
  } catch {
    console.log('[baas-api] ttn-launcher stub log only (8092 may be down)');
  }

  try {
    await axios.post(
      `${EXCHANGE_URL}/api/internal/baas-stub`,
      { kind, ...meta },
      { timeout: 3000, validateStatus: () => true }
    );
  } catch {
    console.log('[baas-api] exchange stub log only');
  }
}

const PORT = Number(process.env.PORT) || 8097;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BaaS API listening on :${PORT} (PROJECTION / PIPELINE)`);
  });
}

module.exports = app;
