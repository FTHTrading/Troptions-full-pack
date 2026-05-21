/**
 * AI Entity Registry — named entities for structured AI search and knowledge graph.
 */

export interface AiEntity {
  id: string;
  name: string;
  type: string;
  description: string;
  sameAs?: string[];
  relatedEntities: string[];
  attributes: Record<string, string>;
  status: "active" | "planned" | "gated";
}

export const AI_ENTITY_REGISTRY: AiEntity[] = [
  {
    id: "troptions",
    name: "Troptions",
    type: "Organization / InstitutionalPlatform",
    description:
      "Institutional operating infrastructure for proof-gated RWA issuance, custody coordination, settlement readiness, and compliance workflows.",
    relatedEntities: ["rwa", "proof-of-funds", "sblc", "xrpl", "settlement", "control-plane"],
    attributes: {
      operatingMode: "proof-gated",
      defaultState: "simulation-first",
      complianceLayer: "multi-gate",
      notA: "bank | broker-dealer | exchange | custodian",
    },
    status: "active",
  },
  {
    id: "rwa",
    name: "Real World Asset (RWA)",
    type: "AssetClass",
    description:
      "Physical assets (gold, energy, carbon credits, oil, treasury instruments) structured for on-chain representation through compliance and custody workflows.",
    relatedEntities: ["troptions", "gold", "energy", "carbon", "proof-of-funds", "custody"],
    attributes: {
      categories: "gold | energy | carbon | oil | treasury",
      gateRequired: "proof-gate | custody-gate | legal-review | board-approval",
    },
    status: "active",
  },
  {
    id: "proof-of-funds",
    name: "Proof of Funds (POF)",
    type: "ComplianceDocument",
    description:
      "Evidence-tracking workflow for client fund verification. Not document fabrication — requires bank-issued source documents.",
    relatedEntities: ["troptions", "sblc", "compliance", "diligence"],
    attributes: {
      nature: "evidence-tracking",
      notAllowed: "fabrication | alteration | false attestation",
    },
    status: "active",
  },
  {
    id: "sblc",
    name: "Standby Letter of Credit (SBLC)",
    type: "FinancialInstrument",
    description:
      "Bank-issued instrument workflow. Troptions provides intake and readiness tracking — not issuance, guarantee, or banking services.",
    relatedEntities: ["proof-of-funds", "banking-rails", "compliance"],
    attributes: {
      workflowRole: "intake-and-readiness-tracking",
      notAllowed: "issuance | guarantee | banking-services",
    },
    status: "gated",
  },
  {
    id: "xrpl",
    name: "XRP Ledger (XRPL)",
    type: "BlockchainProtocol",
    description:
      "Distributed ledger used in simulation for AMM route planning, DEX strategy analysis, and stablecoin rail assessment.",
    relatedEntities: ["amm", "dex", "settlement", "stablecoins"],
    attributes: {
      useMode: "simulation-only | route-planning",
      notAllowed: "live-execution | transaction-signing-without-approval",
    },
    status: "active",
  },
  {
    id: "amm",
    name: "Automated Market Maker (AMM)",
    type: "TradingMechanism",
    description:
      "XRPL AMM simulation for institutional liquidity route modeling. Simulation only — no live market interaction.",
    relatedEntities: ["xrpl", "dex", "trading-simulation"],
    attributes: { mode: "simulation-only" },
    status: "active",
  },
  {
    id: "settlement",
    name: "Settlement Readiness",
    type: "OperationalReadiness",
    description:
      "Multi-rail settlement readiness system covering stablecoin, XRPL, and banking rails. Readiness gates precede any execution.",
    relatedEntities: ["xrpl", "stablecoins", "banking-rails", "troptions"],
    attributes: {
      rails: "stablecoin | XRPL | banking",
      prerequisite: "all-gates-cleared",
    },
    status: "gated",
  },
  {
    id: "control-plane",
    name: "Control Plane",
    type: "ComplianceInfrastructure",
    description:
      "Internal compliance and approval orchestration layer. Approval workflows, legal review queues, risk matrices, and audit logs.",
    relatedEntities: ["troptions", "compliance", "audit-log"],
    attributes: { access: "admin-only | role-gated | audit-logged" },
    status: "active",
  },
  {
    id: "custody",
    name: "Custody Coordination",
    type: "OperationalLayer",
    description:
      "Coordination layer for third-party custodians. Troptions does not take direct custody of assets.",
    relatedEntities: ["rwa", "settlement", "compliance"],
    attributes: {
      role: "coordination-only",
      notAllowed: "direct-custody | self-custody-of-client-assets",
    },
    status: "gated",
  },
  {
    id: "x402",
    name: "x402 Protocol",
    type: "PaymentProtocol",
    description:
      "Machine-payable API access protocol. Used for future premium AI tool access, diligence room, and report access. Dry-run by default.",
    relatedEntities: ["troptions", "ai-tools", "mcp"],
    attributes: { mode: "dry-run-by-default" },
    status: "planned",
  },
  {
    id: "mcp",
    name: "Model Context Protocol (MCP)",
    type: "AgenticProtocol",
    description:
      "Permission-guarded agent tool registry for read-only and simulation-only AI operations within Troptions infrastructure.",
    relatedEntities: ["rag", "clawd", "agent-registry"],
    attributes: {
      allowedActions: "read | simulate | summarize | draft | explain",
      blockedActions: "approve | execute | sign | transfer | issue | bypass",
    },
    status: "active",
  },
  {
    id: "rag",
    name: "Retrieval-Augmented Generation (RAG)",
    type: "AgenticCapability",
    description:
      "Source-cited knowledge retrieval over Troptions registries, compliance data, and institutional content. Requires source support — uncertainty acknowledged.",
    relatedEntities: ["mcp", "clawd", "troptions"],
    attributes: {
      sourceRequired: "true",
      uncertaintyAcknowledged: "true",
    },
    status: "active",
  },
];

export function getEntityById(id: string): AiEntity | undefined {
  return AI_ENTITY_REGISTRY.find((e) => e.id === id);
}

export function getEntitiesByType(type: string): AiEntity[] {
  return AI_ENTITY_REGISTRY.filter((e) =>
    e.type.toLowerCase().includes(type.toLowerCase())
  );
}
