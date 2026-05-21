export interface McpTool {
  id: string;
  name: string;
  description: string;
  category: "retrieve" | "simulate" | "summarize" | "route" | "blocked";
  inputSchema: Record<string, string>;
  outputSchema: Record<string, string>;
  blocked: boolean;
  blockReason?: string;
  requiresAuth: boolean;
  auditLogged: boolean;
}

export const BLOCKED_MCP_ACTIONS = [
  "approve",
  "reject",
  "issue",
  "trade",
  "settle",
  "transfer_funds",
  "sign_transaction",
  "create_fake_pof",
  "create_fake_sblc",
  "bypass_compliance",
  "bypass_sanctions",
  "expose_secret",
];

export const MCP_TOOLS: McpTool[] = [
  {
    id: "get-entity-info",
    name: "get_entity_info",
    description: "Retrieve structured information about a named Troptions entity.",
    category: "retrieve",
    inputSchema: { entityId: "string" },
    outputSchema: { entity: "AiEntity", disclaimer: "string" },
    blocked: false,
    requiresAuth: false,
    auditLogged: true,
  },
  {
    id: "get-knowledge-node",
    name: "get_knowledge_node",
    description: "Retrieve a knowledge graph node and its connections.",
    category: "retrieve",
    inputSchema: { nodeId: "string" },
    outputSchema: { node: "KnowledgeNode", connections: "KnowledgeNode[]" },
    blocked: false,
    requiresAuth: false,
    auditLogged: true,
  },
  {
    id: "query-capabilities",
    name: "query_capabilities",
    description: "Query Troptions capability registry with gate status.",
    category: "retrieve",
    inputSchema: { category: "string | optional" },
    outputSchema: { capabilities: "Capability[]", disclaimer: "string" },
    blocked: false,
    requiresAuth: false,
    auditLogged: true,
  },
  {
    id: "simulate-settlement",
    name: "simulate_settlement",
    description: "Run a settlement simulation (no live execution).",
    category: "simulate",
    inputSchema: { amount: "string", asset: "string", rail: "string" },
    outputSchema: { simulation: "SettlementSimulation", simulationOnly: "true" },
    blocked: false,
    requiresAuth: true,
    auditLogged: true,
  },
  {
    id: "simulate-xrpl-amm",
    name: "simulate_xrpl_amm",
    description: "Simulate XRPL AMM trade and return slippage estimate.",
    category: "simulate",
    inputSchema: { inputAmount: "string", inputAsset: "string", outputAsset: "string" },
    outputSchema: { simulation: "AmmSimulation", simulationOnly: "true" },
    blocked: false,
    requiresAuth: true,
    auditLogged: true,
  },
  {
    id: "summarize-proof-room",
    name: "summarize_proof_room",
    description: "Summarize proof room intake queue (auth required).",
    category: "summarize",
    inputSchema: { filter: "string | optional" },
    outputSchema: { summary: "ProofRoomSummary", requiresAuth: "true" },
    blocked: false,
    requiresAuth: true,
    auditLogged: true,
  },
  {
    id: "route-inquiry",
    name: "route_inquiry",
    description: "Route an institutional inquiry to the appropriate workflow.",
    category: "route",
    inputSchema: { topic: "string", message: "string" },
    outputSchema: { workflow: "string", nextStep: "string", contactRequired: "boolean" },
    blocked: false,
    requiresAuth: false,
    auditLogged: true,
  },
  {
    id: "approve-blocked",
    name: "approve",
    description: "BLOCKED: Approval actions require human operator via control plane.",
    category: "blocked",
    inputSchema: {},
    outputSchema: {},
    blocked: true,
    blockReason: "Approval requires human operator via the control plane. AI agents cannot approve.",
    requiresAuth: true,
    auditLogged: true,
  },
  {
    id: "issue-blocked",
    name: "issue",
    description: "BLOCKED: Issuance requires proof-gated human workflow.",
    category: "blocked",
    inputSchema: {},
    outputSchema: {},
    blocked: true,
    blockReason: "Issuance requires proof-gated human workflow. AI agents cannot issue.",
    requiresAuth: true,
    auditLogged: true,
  },
  {
    id: "settle-blocked",
    name: "settle",
    description: "BLOCKED: Live settlement requires all gates satisfied and human approval.",
    category: "blocked",
    inputSchema: {},
    outputSchema: {},
    blocked: true,
    blockReason: "Live settlement is blocked until all gates are satisfied and human approval is given.",
    requiresAuth: true,
    auditLogged: true,
  },
];

export function getAvailableMcpTools(): McpTool[] {
  return MCP_TOOLS.filter((t) => !t.blocked);
}

export function getBlockedMcpTools(): McpTool[] {
  return MCP_TOOLS.filter((t) => t.blocked);
}

export function getMcpToolById(id: string): McpTool | undefined {
  return MCP_TOOLS.find((t) => t.id === id);
}
