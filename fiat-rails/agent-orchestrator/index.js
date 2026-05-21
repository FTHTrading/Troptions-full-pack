// fiat-rails/agent-orchestrator — MCP XRPL + revenue stack coordination (:4031)
const express = require('express');
const research = require('./agents/research');
const risk = require('./agents/risk');
const execution = require('./agents/execution');
const { healthCheck: mcpHealth } = require('./mcp-client');
const { registerAgent } = require('./lib/tools');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 4031;
const DRY_RUN_DEFAULT = (process.env.DRY_RUN || 'true').toLowerCase() !== 'false';

app.get('/health', async (req, res) => {
  const mcp = await mcpHealth();
  res.json({
    status: 'ok',
    service: 'agent-orchestrator',
    port: PORT,
    dry_run_default: DRY_RUN_DEFAULT,
    label: 'PIPELINE',
    agents: ['ResearchAgent', 'RiskAgent', 'ExecutionAgent'],
    mcp_xrpl: process.env.MCP_XRPL_URL || 'http://127.0.0.1:4032',
    mcp_reachable: mcp.ok === true,
    downstream: {
      arbitrage: process.env.ARBITRAGE_URL || 'http://127.0.0.1:4028',
      compliance: process.env.COMPLIANCE_URL || 'http://127.0.0.1:4025',
      x402: process.env.X402_GATEWAY_URL || 'http://127.0.0.1:4030',
      baas_api: process.env.BAAS_API_URL || 'http://127.0.0.1:8097',
    },
    projection_note: 'All agent revenue metrics are PROJECTION until live pools.',
  });
});

/** Proxy or document BaaS agent registration */
app.post('/agents/register', async (req, res) => {
  try {
    const { agent_id, wallet, capital_troptions } = req.body || {};
    if (!agent_id || !wallet) {
      return res.status(400).json({
        error: 'agent_id and wallet required',
        label: 'PIPELINE',
        baas_direct: 'POST http://127.0.0.1:8097/api/v1/agents/register',
      });
    }
    const result = await registerAgent({ agent_id, wallet, capital_troptions });
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

/** One agentic cycle: Research → Risk → Execution */
app.post('/run-cycle', async (req, res) => {
  const dry_run =
    req.body?.dry_run !== undefined
      ? Boolean(req.body.dry_run)
      : DRY_RUN_DEFAULT;

  const ctx = {
    agent_id: req.body?.agent_id,
    wallet: req.body?.wallet,
    capital_troptions: req.body?.capital_troptions,
    pair: req.body?.pair,
    spread_bps: req.body?.spread_bps,
    amount_usd: req.body?.amount_usd,
    dry_run,
  };

  try {
    const researchOut = await research.run(ctx);
    const riskOut = await risk.run(ctx);
    ctx.risk_approved = riskOut.approved;
    const executionOut = await execution.run(ctx);

    res.json({
      cycle_id: `cycle_${Date.now()}`,
      dry_run,
      label: 'PIPELINE',
      projection_note:
        'Earning today = PIPELINE. PROVEN = health/stubs respond; Academy Stripe is separate.',
      phases: {
        research: researchOut,
        risk: riskOut,
        execution: executionOut,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message, label: 'PIPELINE' });
  }
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Agent orchestrator on :${PORT} DRY_RUN default=${DRY_RUN_DEFAULT}`);
    console.log('  POST /run-cycle');
    console.log('  POST /agents/register');
    console.log(`  MCP_XRPL_URL=${process.env.MCP_XRPL_URL || 'http://127.0.0.1:4032'}`);
  });
}

module.exports = app;
