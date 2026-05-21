// agents/orchestrator/server.js — AWS agent floor (:4100)
// Calls arbitrage :4028, compliance :4025, x402 US :4030, baas :8097
const express = require('express');
const downstream = require('./downstream');

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT) || 4100;
const DRY_RUN_DEFAULT = process.env.DRY_RUN !== 'false';

app.get('/health', async (req, res) => {
  const [arbitrage, compliance, x402, baas] = await Promise.all([
    downstream.pingHealth(downstream.ARBITRAGE_URL, 'arbitrage-bot'),
    downstream.pingHealth(downstream.COMPLIANCE_URL, 'compliance-engine'),
    downstream.pingHealth(downstream.X402_US_URL, 'x402-us'),
    downstream.pingHealth(downstream.BAAS_API_URL, 'baas-api'),
  ]);

  res.json({
    status: 'ok',
    service: 'agent-orchestrator',
    port: PORT,
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    dry_run_default: DRY_RUN_DEFAULT,
    projection_note:
      '10/10 agent score and $874K/month are PIPELINE/PROJECTION — not realized revenue.',
    downstream: { arbitrage, compliance, x402, baas },
    mcp_stub: process.env.MCP_URL || 'http://127.0.0.1:4101',
    legacy_fiat_orchestrator: 'http://127.0.0.1:4031 (fiat-rails/agent-orchestrator)',
  });
});

app.post('/trade', async (req, res) => {
  const body = req.body || {};
  const symbol = body.symbol || body.pair;
  if (!symbol) {
    return res.status(400).json({ error: 'symbol or pair required', label: 'PIPELINE' });
  }

  const dry_run = body.dry_run !== undefined ? Boolean(body.dry_run) : DRY_RUN_DEFAULT;

  const compliance = await downstream.screenCompliance(body);
  const arbitrage = await downstream.runArbitrage({ ...body, symbol, dry_run });
  const x402 = await downstream.x402Stats();
  let baas = null;
  if (body.agent_id) {
    try {
      const r = await fetch(
        `${downstream.BAAS_API_URL}/api/v1/agents/${encodeURIComponent(body.agent_id)}/trades`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol,
            dry_run,
            projected_pnl_usd: body.projected_pnl_usd ?? 0,
            label: 'PIPELINE',
          }),
          signal: AbortSignal.timeout(8000),
        }
      );
      baas = await r.json().catch(() => ({}));
    } catch (err) {
      baas = { label: 'PIPELINE', error: err.message };
    }
  }

  res.json({
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    dry_run,
    symbol,
    compliance,
    arbitrage,
    x402_stats: x402,
    baas_trade: baas,
    disclaimer: 'Trade cycle is stubbed until MSB + live exchange.',
  });
});

app.post('/trade/batch', async (req, res) => {
  const symbols = req.body?.symbols;
  if (!Array.isArray(symbols) || symbols.length === 0) {
    return res.status(400).json({ error: 'symbols array required', label: 'PIPELINE' });
  }

  const dry_run = req.body.dry_run !== undefined ? Boolean(req.body.dry_run) : DRY_RUN_DEFAULT;
  const results = [];

  for (const symbol of symbols) {
    const compliance = await downstream.screenCompliance({ ...req.body, symbol });
    const arbitrage = await downstream.runArbitrage({ ...req.body, symbol, dry_run });
    results.push({ symbol, label: 'PIPELINE', compliance, arbitrage });
  }

  const revenue = await downstream.baasRevenue();

  res.json({
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    dry_run,
    count: results.length,
    results,
    billing_revenue_stub: revenue,
    disclaimer: 'Batch trades are PROJECTION — not revenue in seconds.',
  });
});

app.get('/status', (req, res) => {
  res.json({
    service: 'agent-orchestrator',
    port: PORT,
    label: 'PIPELINE',
    agents: ['research', 'risk', 'execution'],
    dry_run_default: DRY_RUN_DEFAULT,
  });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Agent orchestrator :${PORT} (PIPELINE) DRY_RUN=${DRY_RUN_DEFAULT}`);
    console.log('  POST /trade  POST /trade/batch  GET /health');
  });
}

module.exports = app;
