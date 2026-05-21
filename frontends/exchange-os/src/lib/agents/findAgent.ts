// Client-safe agent finder wrapper — no server-only imports
import type { AgentDefinition } from '@/data/agentRegistry';

export type { AgentDefinition };

export const AGENT_GOAL_LABELS: Record<string, string> = {
  launch_token: 'Launch a token on Exchange OS',
  verify_token: 'Verify token proof status',
  understand_x402: 'Understand x402 payment intelligence',
  solana_liquidity: 'Solana DEX and liquidity readiness',
  exchange_os: 'Exchange OS status and architecture',
  proof_packet: 'Token proof packet requirements',
  partner_onboarding: 'Partner onboarding process',
  seo_content: 'SEO and content strategy',
  translate: 'Multilingual content support',
  understand_blockers: 'Understand mainnet blockers',
  security_readiness: 'Security and compliance readiness',
};

export const AGENT_GOAL_KEYS = Object.keys(AGENT_GOAL_LABELS);
