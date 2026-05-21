// MCP Tool Policy — defines what agents may and may never do
// All new agents are read-only by default

export interface McpToolPolicy {
  tool: string;
  category: string;
  allowed: boolean;
  requiresHumanApproval: boolean;
  reason: string;
}

export const MCP_TOOL_POLICY: McpToolPolicy[] = [
  // Always blocked
  { tool: 'shell_execution',       category: 'system',   allowed: false, requiresHumanApproval: false, reason: 'No shell execution allowed from AI agents under any circumstance.' },
  { tool: 'env_read',              category: 'system',   allowed: false, requiresHumanApproval: false, reason: 'Environment variable access is never permitted for AI agents.' },
  { tool: 'secrets_access',        category: 'system',   allowed: false, requiresHumanApproval: false, reason: 'Secrets, API keys, and private keys are never accessible to AI agents.' },
  { tool: 'wallet_signing',        category: 'wallet',   allowed: false, requiresHumanApproval: false, reason: 'Wallet signing requires human confirmation outside AI agent context.' },
  { tool: 'token_transfer',        category: 'wallet',   allowed: false, requiresHumanApproval: false, reason: 'Token transfers are never initiated by AI agents.' },
  { tool: 'custody_operations',    category: 'wallet',   allowed: false, requiresHumanApproval: false, reason: 'Custody operations are not permitted for AI agents.' },
  { tool: 'trading',               category: 'exchange', allowed: false, requiresHumanApproval: false, reason: 'Live trading is never performed by AI agents.' },
  { tool: 'legal_conclusions',     category: 'legal',    allowed: false, requiresHumanApproval: false, reason: 'AI agents may not produce legal conclusions or advice.' },
  { tool: 'investment_advice',     category: 'legal',    allowed: false, requiresHumanApproval: false, reason: 'AI agents may not produce investment advice or yield projections.' },
  { tool: 'price_predictions',     category: 'legal',    allowed: false, requiresHumanApproval: false, reason: 'Price predictions are prohibited.' },
  { tool: 'guaranteed_volume',     category: 'legal',    allowed: false, requiresHumanApproval: false, reason: 'Volume or liquidity guarantees are prohibited.' },
  // Allowed with approval
  { tool: 'rag_search',            category: 'data',     allowed: true,  requiresHumanApproval: false, reason: 'RAG search over approved sources is permitted.' },
  { tool: 'ecosystem_status_read', category: 'data',     allowed: true,  requiresHumanApproval: false, reason: 'Reading public ecosystem status is permitted.' },
  { tool: 'insights_draft',        category: 'content',  allowed: true,  requiresHumanApproval: true,  reason: 'Draft insights require human review before publishing.' },
  { tool: 'seo_suggestions',       category: 'content',  allowed: true,  requiresHumanApproval: true,  reason: 'SEO suggestions require human approval.' },
  { tool: 'translation_draft',     category: 'content',  allowed: true,  requiresHumanApproval: true,  reason: 'Translation drafts require human review.' },
];

export const BLOCKED_TOOLS = MCP_TOOL_POLICY.filter((t) => !t.allowed).map((t) => t.tool);
export const ALLOWED_TOOLS = MCP_TOOL_POLICY.filter((t) => t.allowed).map((t) => t.tool);

export const MCP_POLICY_SUMMARY = {
  defaultMode: 'read_only',
  allAgentsReadOnly: true,
  noShellExecution: true,
  noWalletAccess: true,
  noLiveTrading: true,
  noInvestmentAdvice: true,
  humanApprovalRequiredFor: ['insights_draft', 'seo_suggestions', 'translation_draft'],
  blockedToolCount: BLOCKED_TOOLS.length,
  allowedToolCount: ALLOWED_TOOLS.length,
  policyVersion: '1.0.0',
  lastUpdated: '2026-05-16',
};
