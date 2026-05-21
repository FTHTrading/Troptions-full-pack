/**
 * Agent profiles — orchestrator (:4031). Revenue figures are PROJECTION.
 */
const AGENT_PROFILES = {
  'agent-demo': {
    wallet: 'rAgentDemo0000000000000000000000',
    capital_troptions: 100_000,
    pair: 'USD-IOU/EUR-IOU',
    spread_bps: 30,
    amount_usd: 5000,
    regions: ['us', 'eu'],
  },
  'agent-conservative': {
    wallet: 'rAgentConservative00000000000000',
    capital_troptions: 50_000,
    pair: 'USD-IOU/EUR-IOU',
    spread_bps: 15,
    amount_usd: 2500,
    regions: ['us'],
  },
  'agent-aggressive': {
    wallet: 'rAgentAggressive000000000000000',
    capital_troptions: 250_000,
    pair: 'ALEX/USD-IOU',
    spread_bps: 45,
    amount_usd: 10_000,
    regions: ['us', 'eu', 'jp'],
  },
};

const DEFAULT_PROFILE = 'agent-demo';

function getProfile(agentId) {
  return AGENT_PROFILES[agentId] || null;
}

function mergeContext(agentId, overrides = {}) {
  const base = getProfile(agentId) || {};
  return {
    agent_id: agentId,
    wallet: overrides.wallet || base.wallet,
    capital_troptions: overrides.capital_troptions ?? base.capital_troptions ?? 0,
    pair: overrides.pair || base.pair,
    spread_bps: overrides.spread_bps ?? base.spread_bps,
    amount_usd: overrides.amount_usd ?? base.amount_usd,
    regions: overrides.regions || base.regions || ['us'],
    dry_run: overrides.dry_run,
    ...overrides,
  };
}

module.exports = {
  AGENT_PROFILES,
  DEFAULT_PROFILE,
  getProfile,
  mergeContext,
};
