// fiat-rails/agent-orchestrator — Agent Orchestration Layer (:4031)
const express = require('express');
const runner = require('./agent-runner');
const baas = require('./baas-client');
const arbitrage = require('./arbitrage-client');
const { healthCheck: mcpHealth } = require('./mcp-client');
const { getStats, X402_V2_URL, X402_MESH_URL } = require('./x402-client');
const { AGENT_PROFILES, DEFAULT_PROFILE } = require('./config');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 4031;

app.get('/health', async (req, res) => {
  const mcp = await mcpHealth();
  let x402_stats = null;
  try {
    x402_stats = await getStats('us');
  } catch {
    x402_stats = { label: 'PIPELINE', revenue_label: 'PROJECTION' };
  }

  res.json({
    status: 'ok',
    service: 'agent-orchestrator',
    port: PORT,
    dry_run_default: runner.DRY_RUN_DEFAULT,
    label: 'PIPELINE',
    agents: Object.keys(AGENT_PROFILES),
    default_profile: DEFAULT_PROFILE,
    mcp_url: process.env.MCP_URL || process.env.MCP_XRPL_URL || 'http://127.0.0.1:4731',
    mcp_reachable: mcp.ok === true,
    mcp_mock_when_down: true,
    x402_v2: X402_V2_URL,
    x402_mesh_apostle: X402_MESH_URL,
    x402_stats_note: 'Canonical stats: GET :4030/x402/stats (alias :4030/stats). Apostle mesh :4020/x402/stats when deployed.',
    x402_stats_sample: x402_stats,
    downstream: {
      arbitrage: process.env.ARBITRAGE_URL || 'http://127.0.0.1:4028',
      compliance: process.env.COMPLIANCE_URL || 'http://127.0.0.1:4025',
      baas_api: process.env.BAAS_API_URL || 'http://127.0.0.1:4029',
      payment_orchestrator: process.env.ORCHESTRATOR_URL || 'http://127.0.0.1:4022',
      x402_us: process.env.X402_US_URL || 'http://127.0.0.1:4030',
      x402_eu: process.env.X402_EU_URL || 'http://127.0.0.1:4034',
      x402_jp: process.env.X402_JP_URL || 'http://127.0.0.1:4035',
      mcp_xrpl_reserved: 'http://127.0.0.1:4032',
    },
    projection_note: 'All agent revenue metrics are PROJECTION until live pools.',
  });
});

app.post('/agents/start', (req, res) => {
  const agentId = req.body?.agent_id;
  if (!agentId) {
    return res.status(400).json({ error: 'agent_id required', label: 'PIPELINE' });
  }
  res.json(runner.startAgent(agentId, req.body || {}));
});

app.post('/agents/stop', (req, res) => {
  const agentId = req.body?.agent_id;
  if (!agentId) {
    return res.status(400).json({ error: 'agent_id required', label: 'PIPELINE' });
  }
  res.json(runner.stopAgent(agentId));
});

app.get('/agents/status', (req, res) => {
  res.json(runner.getAgentStatus(req.query.agent_id));
});

/** Legacy alias → BaaS :4029 */
app.post('/agents/register', async (req, res) => {
  try {
    const { agent_id, wallet, capital_troptions } = req.body || {};
    if (!agent_id || !wallet) {
      return res.status(400).json({
        error: 'agent_id and wallet required',
        label: 'PIPELINE',
        baas_direct: 'POST http://127.0.0.1:4029/api/v1/agents',
      });
    }
    const result = await baas.registerAgent({ agent_id, wallet, capital_troptions });
    if (!result.ok) {
      return res.status(result.status || 502).json({
        error: 'BaaS registration failed',
        label: 'PIPELINE',
        detail: result.data,
      });
    }
    res.status(201).json({
      ...result.data,
      proxied_via: 'agent-orchestrator',
      label: 'PIPELINE',
    });
  } catch (err) {
    res.status(500).json({ error: err.message, label: 'PIPELINE' });
  }
});

app.post('/run-cycle', async (req, res) => {
  try {
    res.json(await runner.runCycle(req.body || {}));
  } catch (err) {
    res.status(500).json({ error: err.message, label: 'PIPELINE' });
  }
});

/** Multi-x402 regional arbitrage — PIPELINE */
app.post('/api/v1/arbitrage/multi', async (req, res) => {
  const body = req.body || {};
  const buy = body.buy || body.buy_location;
  const sell = body.sell || body.sell_location;
  if (!buy || !sell) {
    return res.status(400).json({
      error: 'buy and sell required (us|eu|jp) — aliases: buy_location, sell_location',
      label: 'PIPELINE',
    });
  }
  const out = await arbitrage.multiRegion({
    buy,
    sell,
    pair: body.pair,
    amount_usd: body.amount_usd,
    dry_run: body.dry_run !== undefined ? Boolean(body.dry_run) : runner.DRY_RUN_DEFAULT,
  });
  res.json(out);
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Agent orchestrator on :${PORT} DRY_RUN default=${runner.DRY_RUN_DEFAULT}`);
    console.log('  POST /agents/start | POST /agents/stop | GET /agents/status');
    console.log('  POST /run-cycle | POST /api/v1/arbitrage/multi');
    console.log(`  MCP_URL=${process.env.MCP_URL || process.env.MCP_XRPL_URL || 'http://127.0.0.1:4731'}`);
  });
}

module.exports = app;
