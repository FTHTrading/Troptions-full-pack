// agents/mcp-server/server.js — MCP tools list stub (:4101)
const express = require('express');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 4101;

const TOOLS = [
  { name: 'amm_create', description: 'Create XRPL AMM pool (PIPELINE stub)', label: 'PIPELINE' },
  { name: 'amm_deposit', description: 'Deposit to AMM (PIPELINE stub)', label: 'PIPELINE' },
  { name: 'amm_withdraw', description: 'Withdraw from AMM (PIPELINE stub)', label: 'PIPELINE' },
  { name: 'amm_swap', description: 'Swap via AMM (PIPELINE stub)', label: 'PIPELINE' },
  { name: 'get_orderbook', description: 'DEX orderbook via x402 :4030', label: 'PIPELINE' },
  { name: 'get_amm_info', description: 'AMM pool info (PIPELINE stub)', label: 'PIPELINE' },
  { name: 'screen_transaction', description: 'Compliance screen :4025', label: 'PIPELINE' },
  { name: 'execute_arbitrage', description: 'Arbitrage bot :4028', label: 'PIPELINE' },
  { name: 'get_token_balance', description: 'Account line balance (PIPELINE stub)', label: 'PIPELINE' },
];

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'mcp-server-stub',
    port: PORT,
    label: 'PIPELINE',
    tools_count: TOOLS.length,
    vendor_mcp_note: 'Production XRPL MCP vendor typically :4731 — this stub is for AWS mesh wiring only.',
  });
});

app.get('/tools', (req, res) => {
  res.json({ tools: TOOLS, label: 'PIPELINE' });
});

app.post('/tools/call', (req, res) => {
  const { name, arguments: args } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'name required', label: 'PIPELINE' });
  }
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) {
    return res.status(404).json({ error: `Unknown tool: ${name}`, label: 'PIPELINE' });
  }
  res.json({
    tool: name,
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    result: {
      stub: true,
      message: `${name} not executed — MSB + live XRPL required`,
      arguments_received: args || {},
    },
  });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MCP stub :${PORT} — GET /tools POST /tools/call`);
  });
}

module.exports = app;
