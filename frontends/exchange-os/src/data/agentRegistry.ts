export interface AgentDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  allowedSources: string[];
  prohibitedActions: string[];
  canUseRag: boolean;
  canWrite: boolean;
  requiresHumanApproval: boolean;
  status: 'active' | 'demo' | 'coming_soon' | 'disabled';
  x402Required: boolean;
}

export const AGENT_REGISTRY: AgentDefinition[] = [
  {
    id: 'exchange-os-analyst',
    name: 'Exchange OS Analyst',
    category: 'exchange',
    description: 'Answers questions about Exchange OS status, blockers, routes, and APIs.',
    allowedSources: ['ecosystem-status', 'exchange-os-status', 'blockers', 'feature-flags', 'public-docs'],
    prohibitedActions: ['shell_execution', 'wallet_signing', 'token_transfer', 'env_read', 'secrets_access', 'trading'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: false,
    status: 'demo',
    x402Required: false,
  },
  {
    id: 'token-proof-analyst',
    name: 'Token Proof Analyst',
    category: 'proof',
    description: 'Explains proof packet requirements and token readiness.',
    allowedSources: ['proof-packet-requirements', 'claim-rules', 'ecosystem-status'],
    prohibitedActions: ['shell_execution', 'wallet_signing', 'token_transfer', 'legal_conclusions'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: false,
    status: 'demo',
    x402Required: false,
  },
  {
    id: 'solana-dex-analyst',
    name: 'Solana DEX Analyst',
    category: 'solana',
    description: 'Explains Raydium, Jupiter, Meteora, Orca, Birdeye, DexScreener readiness.',
    allowedSources: ['solana-dex-registry', 'ecosystem-status', 'mainnet-readiness'],
    prohibitedActions: ['shell_execution', 'trading', 'wallet_signing', 'guaranteed_volume_claims'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: false,
    status: 'demo',
    x402Required: false,
  },
  {
    id: 'xrpl-issuer-analyst',
    name: 'XRPL Issuer Analyst',
    category: 'xrpl',
    description: 'Explains XRPL issuer, trustline, AMM, and orderbook readiness.',
    allowedSources: ['xrpl-dex-registry', 'ecosystem-status'],
    prohibitedActions: ['shell_execution', 'trading', 'wallet_signing'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: false,
    status: 'demo',
    x402Required: false,
  },
  {
    id: 'x402-commerce-analyst',
    name: 'x402 Commerce Analyst',
    category: 'payments',
    description: 'Explains payment-gated intelligence and x402 receipts.',
    allowedSources: ['x402-products', 'x402-receipts-public', 'ecosystem-status'],
    prohibitedActions: ['shell_execution', 'wallet_signing', 'custody_operations'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: false,
    status: 'demo',
    x402Required: false,
  },
  {
    id: 'launch-committee-assistant',
    name: 'Launch Committee Assistant',
    category: 'compliance',
    description: 'Summarizes GO/NO-GO blockers.',
    allowedSources: ['launch-committee-controls', 'blockers', 'mainnet-readiness'],
    prohibitedActions: ['shell_execution', 'trading', 'legal_conclusions', 'guaranteed_approval_claims'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: true,
    status: 'demo',
    x402Required: false,
  },
  {
    id: 'partner-onboarding-assistant',
    name: 'Partner Onboarding Assistant',
    category: 'onboarding',
    description: 'Guides clients through intake stages.',
    allowedSources: ['enterprise-client-onboarding', 'partner-onboarding', 'proof-packet-requirements'],
    prohibitedActions: ['shell_execution', 'trading', 'legal_conclusions', 'custody_operations'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: true,
    status: 'demo',
    x402Required: false,
  },
  {
    id: 'seo-content-strategist',
    name: 'SEO Content Strategist',
    category: 'content',
    description: 'Suggests approved keywords, titles, descriptions, and blog topics.',
    allowedSources: ['keyword-strategy', 'seo-pages', 'insights-posts', 'approved-docs'],
    prohibitedActions: ['shell_execution', 'legal_conclusions', 'investment_advice'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: true,
    status: 'demo',
    x402Required: false,
  },
  {
    id: 'multilingual-support-agent',
    name: 'Multilingual Support Agent',
    category: 'language',
    description: 'Explains pages, languages, and approved translations.',
    allowedSources: ['languages', 'translations', 'approved-docs'],
    prohibitedActions: ['shell_execution', 'legal_conclusions', 'investment_advice'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: true,
    status: 'demo',
    x402Required: false,
  },
  {
    id: 'blog-insights-writer',
    name: 'Blog / Insights Writer',
    category: 'content',
    description: 'Drafts compliant, non-hype insights from approved data.',
    allowedSources: ['insights-posts', 'keyword-strategy', 'ecosystem-status', 'approved-docs'],
    prohibitedActions: ['shell_execution', 'investment_advice', 'legal_conclusions', 'price_predictions', 'guaranteed_volume'],
    canUseRag: true,
    canWrite: false,
    requiresHumanApproval: true,
    status: 'demo',
    x402Required: false,
  },
];

const GOAL_MAP: Record<string, string[]> = {
  launch_token: ['launch-committee-assistant', 'token-proof-analyst', 'solana-dex-analyst'],
  verify_token: ['token-proof-analyst', 'exchange-os-analyst'],
  understand_x402: ['x402-commerce-analyst', 'exchange-os-analyst'],
  solana_liquidity: ['solana-dex-analyst', 'launch-committee-assistant'],
  exchange_os: ['exchange-os-analyst'],
  proof_packet: ['token-proof-analyst', 'launch-committee-assistant'],
  partner_onboarding: ['partner-onboarding-assistant', 'launch-committee-assistant'],
  seo_content: ['seo-content-strategist', 'blog-insights-writer'],
  translate: ['multilingual-support-agent'],
  understand_blockers: ['exchange-os-analyst', 'launch-committee-assistant'],
  security_readiness: ['exchange-os-analyst'],
};

export const AGENT_GOALS = Object.keys(GOAL_MAP);

export function findAgentsByGoal(goal: string): AgentDefinition[] {
  const ids = GOAL_MAP[goal] ?? [];
  return AGENT_REGISTRY.filter((a) => ids.includes(a.id));
}
