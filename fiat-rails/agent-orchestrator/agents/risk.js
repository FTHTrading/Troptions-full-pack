const { screen } = require('../compliance-client');

async function run(ctx) {
  const amountUsd = Number(ctx.capital_troptions || 0) * 0.01 || 1000;
  const compliance = await screen({
    payment_id: `agent_${ctx.agent_id || 'anon'}_${Date.now()}`,
    sender: { name: ctx.agent_id || 'agent', country: 'US' },
    amount: amountUsd,
    currency: 'USD',
    wire_ref: `AGENT-RISK-${ctx.agent_id || 'unknown'}`,
  });

  const maxPosition = Number(process.env.MAX_POSITION_USD || 10000);
  const approved = compliance.approved !== false && amountUsd <= maxPosition;

  return {
    agent: 'RiskAgent',
    label: 'PIPELINE',
    dry_run: ctx.dry_run,
    approved,
    max_position_usd: maxPosition,
    screened_amount_usd: amountUsd,
    compliance,
  };
}

module.exports = { run };
