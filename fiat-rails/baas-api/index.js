// fiat-rails/baas-api — Banking-as-a-Service liquidity API (:8097)
const express = require('express');
const morgan = require('morgan');
const tokenRoutes = require('./routes/tokens');
const poolRoutes = require('./routes/pools');
const agentRoutes = require('./routes/agents');
const dashboardRoutes = require('./routes/dashboard');
const billingRoutes = require('./routes/billing');
const { GATEWAY } = require('./lib/x402');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

const PORT = Number(process.env.PORT) || 8097;

app.get('/health', async (req, res) => {
  let x402_ok = false;
  try {
    const r = await fetch(`${GATEWAY}/health`, { signal: AbortSignal.timeout(2000) });
    x402_ok = r.ok;
  } catch {
    x402_ok = false;
  }

  res.json({
    status: 'ok',
    service: 'baas-api',
    port: PORT,
    label: 'PIPELINE',
    api_key_required: Boolean(process.env.BAAS_API_KEY),
    x402_gateway: GATEWAY,
    x402_gateway_reachable: x402_ok,
    orchestrator_url: process.env.ORCHESTRATOR_URL || 'http://127.0.0.1:4022',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1', (req, res) => {
  res.json({
    service: 'baas-api',
    label: 'PIPELINE',
    endpoints: {
      tokens: 'POST /api/v1/tokens (402 pay)',
      pools: 'POST /api/v1/pools (402 pay)',
      pools_batch: 'POST /api/v1/pools/batch (402 pay, summed fee)',
      pool_jobs: 'GET /api/v1/pools/jobs',
      dashboard_revenue: 'GET /api/v1/dashboard/:token_id/revenue (PROJECTION)',
      billing: 'GET /api/v1/billing/history',
      token_arbitrage: 'POST /api/v1/tokens/:token_id/arbitrage',
      agents_register: 'POST /api/v1/agents/register',
      agents_list: 'GET /api/v1/agents',
    },
    port_note: 'Liquidity API :8097. BaaS dashboard UI :4029 (separate PM2 app).',
  });
});

app.use('/api/v1/tokens', tokenRoutes);
app.use('/api/v1/pools', poolRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  console.error('[baas-api]', err);
  res.status(500).json({ error: err.message || 'Internal error', label: 'PIPELINE' });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BaaS API listening on http://127.0.0.1:${PORT}`);
    console.log('  POST /api/v1/tokens');
    console.log('  POST /api/v1/pools');
    console.log('  POST /api/v1/pools/batch');
    console.log('  POST /api/v1/agents/register');
  });
}

module.exports = app;
