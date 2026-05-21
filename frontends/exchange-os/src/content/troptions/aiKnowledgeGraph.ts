/**
 * AI Knowledge Graph — entity relationships and topic clusters for AI search.
 */

export interface KnowledgeNode {
  id: string;
  label: string;
  type: string;
  description: string;
  connections: string[];
  url?: string;
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  relationship: string;
}

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: "troptions",
    label: "Troptions",
    type: "Platform",
    description: "Institutional operating infrastructure. Not a bank, broker-dealer, exchange, or custodian.",
    connections: ["rwa", "settlement", "compliance", "control-plane", "mcp", "xrpl-simulation"],
    url: "/troptions",
  },
  {
    id: "rwa",
    label: "Real World Assets",
    type: "AssetClass",
    description: "Physical assets structured for institutional on-chain workflows.",
    connections: ["gold", "energy", "carbon", "custody", "proof-of-funds"],
    url: "/troptions-old-money/rwa",
  },
  {
    id: "gold",
    label: "Gold Infrastructure",
    type: "AssetCategory",
    description: "Bullion intake, assay coordination, vault coordination, digital-twin readiness.",
    connections: ["rwa", "custody", "settlement"],
    url: "/troptions-old-money/gold",
  },
  {
    id: "energy",
    label: "Energy & Carbon",
    type: "AssetCategory",
    description: "Oil, natural gas, renewables, and carbon credit compliance workflows.",
    connections: ["rwa", "compliance", "settlement"],
    url: "/troptions-old-money/energy",
  },
  {
    id: "carbon",
    label: "Carbon Credits",
    type: "AssetSubCategory",
    description: "Carbon credit namespace and compliance registry.",
    connections: ["energy", "rwa", "compliance"],
  },
  {
    id: "proof-of-funds",
    label: "Proof of Funds",
    type: "ComplianceDocument",
    description: "Evidence-tracking for client fund verification. Not fabrication.",
    connections: ["sblc", "compliance", "diligence", "rwa"],
    url: "/troptions-old-money/institutional",
  },
  {
    id: "sblc",
    label: "SBLC Workflow",
    type: "InstrumentWorkflow",
    description: "Standby Letter of Credit intake and readiness tracking.",
    connections: ["proof-of-funds", "compliance", "banking-rails"],
  },
  {
    id: "settlement",
    label: "Settlement Readiness",
    type: "OperationalLayer",
    description: "Multi-rail readiness across stablecoin, XRPL, and banking rails.",
    connections: ["xrpl-simulation", "stablecoins", "banking-rails", "troptions"],
    url: "/troptions-old-money/settlement",
  },
  {
    id: "xrpl-simulation",
    label: "XRPL Simulation",
    type: "TradingSimulation",
    description: "AMM quote modeling, DEX route planning — simulation only.",
    connections: ["settlement", "amm", "dex", "troptions"],
    url: "/portal/troptions/trading/ai",
  },
  {
    id: "amm",
    label: "AMM Modeling",
    type: "TradingMechanism",
    description: "Automated Market Maker simulation for institutional liquidity analysis.",
    connections: ["xrpl-simulation", "dex"],
  },
  {
    id: "dex",
    label: "DEX Route Planning",
    type: "TradingMechanism",
    description: "Decentralized exchange route analysis — simulation only.",
    connections: ["xrpl-simulation", "amm"],
  },
  {
    id: "compliance",
    label: "Compliance Layer",
    type: "RegulatoryInfrastructure",
    description: "Multi-gate compliance: KYC/KYB, sanctions, legal review, audit logging.",
    connections: ["control-plane", "proof-of-funds", "sblc", "troptions"],
  },
  {
    id: "control-plane",
    label: "Control Plane",
    type: "AdminInfrastructure",
    description: "Approval workflows, legal queues, risk matrices, audit logs.",
    connections: ["compliance", "troptions", "mcp"],
    url: "/admin/troptions",
  },
  {
    id: "mcp",
    label: "MCP Agent Layer",
    type: "AgenticProtocol",
    description: "Permission-guarded tool registry for read-only and simulation AI actions.",
    connections: ["rag", "clawd", "control-plane"],
    url: "/admin/troptions/ai",
  },
  {
    id: "rag",
    label: "RAG Knowledge Retrieval",
    type: "AgenticCapability",
    description: "Source-cited retrieval over Troptions knowledge base.",
    connections: ["mcp", "clawd"],
  },
  {
    id: "clawd",
    label: "Clawd Planning Engine",
    type: "AgenticCapability",
    description: "Institutional workflow planning — simulation and draft outputs only.",
    connections: ["mcp", "rag"],
  },
  {
    id: "x402",
    label: "x402 Protocol",
    type: "PaymentProtocol",
    description: "Machine-payable API access. Dry-run until approved.",
    connections: ["troptions", "mcp"],
    url: "/troptions-ai/x402",
  },
  {
    id: "telecom",
    label: "Telnyx Telecom",
    type: "CommunicationLayer",
    description: "AI-assisted institutional communications via Telnyx. TCPA/CTIA consent-tracked.",
    connections: ["troptions", "compliance"],
    url: "/troptions-ai/telecom",
  },
  {
    id: "custody",
    label: "Custody Coordination",
    type: "OperationalLayer",
    description: "Third-party custodian coordination. Troptions does not take direct custody.",
    connections: ["rwa", "gold", "settlement"],
  },
  {
    id: "stablecoins",
    label: "Stablecoin Rails",
    type: "SettlementRail",
    description: "Stablecoin settlement readiness assessment.",
    connections: ["settlement", "banking-rails"],
  },
  {
    id: "banking-rails",
    label: "Banking Rails",
    type: "SettlementRail",
    description: "Traditional banking settlement readiness. Provider-gated.",
    connections: ["settlement", "stablecoins", "sblc"],
  },
  {
    id: "diligence",
    label: "Diligence Repository",
    type: "ComplianceWorkflow",
    description: "Evidence repository for institutional due diligence.",
    connections: ["proof-of-funds", "compliance"],
  },
];

export const KNOWLEDGE_EDGES: KnowledgeEdge[] = KNOWLEDGE_NODES.flatMap((node) =>
  node.connections.map((conn) => ({
    from: node.id,
    to: conn,
    relationship: "relatedTo",
  }))
);

export function getNodeById(id: string): KnowledgeNode | undefined {
  return KNOWLEDGE_NODES.find((n) => n.id === id);
}

export function getConnectedNodes(id: string): KnowledgeNode[] {
  const node = getNodeById(id);
  if (!node) return [];
  return node.connections
    .map((c) => getNodeById(c))
    .filter((n): n is KnowledgeNode => n !== undefined);
}
