const { callTool, healthCheck } = require('../mcp-client');
const { payAndFetch } = require('../x402-client');

async function run(ctx) {
  const steps = [];
  const mcp = await healthCheck();
  steps.push({ step: 'mcp_health', mcp });

  const tools = await callTool('xrpl_account_info', {
    account: ctx.wallet || process.env.XRPL_ISSUER || 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ',
  });
  steps.push({ step: 'xrpl_account_info', tools });

  const region = (ctx.regions && ctx.regions[0]) || 'us';
  const orderbook = await payAndFetch('/x402/market-data/orderbook', { pair: ctx.pair || 'USD-IOU/EUR-IOU' }, region);
  steps.push({ step: 'orderbook_snapshot', orderbook });

  return {
    agent: 'ResearchAgent',
    label: 'PIPELINE',
    dry_run: ctx.dry_run,
    steps,
    projection_note: 'Agent revenue figures are PROJECTION until exchange pools are live.',
  };
}

module.exports = { run };
