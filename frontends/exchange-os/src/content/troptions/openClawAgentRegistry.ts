export interface OpenClawAgentRegistryItem {
  id: string;
  label: string;
  role: string;
  status: "online" | "simulated" | "offline";
  tier: "fast" | "deep" | "specialist";
  capabilities: string[];
}

export const OPENCLAW_AGENT_REGISTRY: OpenClawAgentRegistryItem[] = [
  {
    id: "jefe",
    label: "Jefe",
    role: "Fast dashboard co-pilot and dispatcher",
    status: "online",
    tier: "fast",
    capabilities: ["status", "routing", "task-planning", "blocker-summary"],
  },
  {
    id: "clawd",
    label: "Clawd",
    role: "Deep reasoning and governance context",
    status: "online",
    tier: "deep",
    capabilities: ["board-package-draft", "audit-summary", "policy-explanation"],
  },
  {
    id: "rag-agent",
    label: "RAG Agent",
    role: "Document retrieval and source-grounded summarization",
    status: "simulated",
    tier: "specialist",
    capabilities: ["registry-query", "snippet-retrieval", "source-summary"],
  },
  {
    id: "x402-agent",
    label: "x402 Agent",
    role: "x402 readiness and payment-intent simulation",
    status: "simulated",
    tier: "specialist",
    capabilities: ["x402-readiness", "x402-blockers", "x402-plan-draft"],
  },
  {
    id: "xrpl-agent",
    label: "XRPL Agent",
    role: "XRPL AMM/DEX readiness and market summary",
    status: "simulated",
    tier: "specialist",
    capabilities: ["xrpl-readiness", "amm-dex-summary", "gate-summary"],
  },
  {
    id: "wallet-agent",
    label: "Wallet Agent",
    role: "Wallet support routing and blocker checks",
    status: "simulated",
    tier: "specialist",
    capabilities: ["wallet-status", "invite-qr-check", "funding-blockers"],
  },
  {
    id: "site-ops-agent",
    label: "Site Ops Agent",
    role: "Site health checks and remediation drafts",
    status: "simulated",
    tier: "specialist",
    capabilities: ["link-check", "route-check", "metadata-check", "draft-fix-plan"],
  },
  {
    id: "compliance-agent",
    label: "Compliance Agent",
    role: "Checklist drafting and release-gate summaries",
    status: "simulated",
    tier: "specialist",
    capabilities: ["blocked-reason-summary", "checklist-draft", "approval-request-draft"],
  },
  {
    id: "trading-sim-agent",
    label: "Trading Simulation Agent",
    role: "Simulation-only route and settlement analyzer",
    status: "simulated",
    tier: "specialist",
    capabilities: ["route-simulation", "settlement-simulation", "risk-summary"],
  },
];
