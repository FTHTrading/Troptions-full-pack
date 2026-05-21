export interface OpenClawToolRegistryItem {
  id: string;
  label: string;
  category: "site-ops" | "x402" | "wallet" | "xrpl" | "rag" | "mcp" | "admin";
  mode: "read-only" | "simulation" | "planning";
  requiresApproval: boolean;
}

export const OPENCLAW_TOOL_REGISTRY: OpenClawToolRegistryItem[] = [
  { id: "tool.site.health", label: "Site Health Check", category: "site-ops", mode: "read-only", requiresApproval: false },
  { id: "tool.site.links", label: "Broken Link Check", category: "site-ops", mode: "read-only", requiresApproval: false },
  { id: "tool.site.draft-fix", label: "Site Draft Fix Plan", category: "site-ops", mode: "planning", requiresApproval: false },
  { id: "tool.x402.readiness", label: "x402 Readiness", category: "x402", mode: "read-only", requiresApproval: false },
  { id: "tool.x402.simulate-intent", label: "x402 Payment Intent Simulator", category: "x402", mode: "simulation", requiresApproval: false },
  { id: "tool.wallet.status", label: "Wallet Status Summary", category: "wallet", mode: "read-only", requiresApproval: false },
  { id: "tool.xrpl.readiness", label: "XRPL Readiness Summary", category: "xrpl", mode: "read-only", requiresApproval: false },
  { id: "tool.rag.registry", label: "Registry Query", category: "rag", mode: "read-only", requiresApproval: false },
  { id: "tool.mcp.list", label: "MCP Tool Listing", category: "mcp", mode: "read-only", requiresApproval: false },
  { id: "tool.admin.task-plan", label: "Operator Task Plan", category: "admin", mode: "planning", requiresApproval: false },
];
