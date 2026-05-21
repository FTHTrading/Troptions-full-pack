/**
 * ResearchAgent — market / ledger context (**PIPELINE** stub).
 */
const { callTool, healthCheck } = require('../mcp-client');
const { x402PayAndFetch } = require('../lib/tools');

async function run(ctx) {
  const steps = [];
  const mcp = await healthCheck();
  steps.push({ step: 'mcp_health', mcp });

  if (mcp.ok) {
    try {
      const tools = await callTool('xrpl_account_info', {
        account: ctx.wallet || process.env.XRPL_ISSUER || 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ',
      });
      steps.push({ step: 'xrpl_account_info', tools });
    } catch (err) {
      steps.push({ step: 'xrpl_account_info', skipped: true, reason: err.message });
    }
  }

  const orderbook = await x402PayAndFetch('/x402/market-data/orderbook', { pair: 'USD-IOU/EUR-IOU' });
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
