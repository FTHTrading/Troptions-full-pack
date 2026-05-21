/**
 * ExecutionAgent — arbitrage trigger (**PIPELINE** stub).
 */
const { executeArbitrage } = require('../lib/tools');

async function run(ctx) {
  if (!ctx.risk_approved) {
    return {
      agent: 'ExecutionAgent',
      label: 'PIPELINE',
      executed: false,
      reason: 'risk_not_approved',
    };
  }

  const pair = ctx.pair || 'USD-IOU/EUR-IOU';
  const result = await executeArbitrage({
    pair,
    spread_bps: ctx.spread_bps || 30,
    amount_usd: ctx.amount_usd || 5000,
    dry_run: ctx.dry_run !== false,
    path: ctx.dry_run !== false ? 'execute' : 'start',
  });

  return {
    agent: 'ExecutionAgent',
    label: 'PIPELINE',
    executed: true,
    dry_run: ctx.dry_run !== false,
    arbitrage: result,
    projection_note: 'Settlement revenue is PROJECTION until live XRPL AMM pools.',
  };
}

module.exports = { run };
