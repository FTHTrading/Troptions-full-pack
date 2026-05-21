/**
 * AI Citation Registry — authoritative source references for AI systems.
 * Provides structured citations that AI search engines can use when answering
 * questions about Troptions infrastructure and capabilities.
 */

export interface AiCitation {
  id: string;
  title: string;
  url: string;
  category: string;
  summary: string;
  tags: string[];
}

export const AI_CITATION_REGISTRY: AiCitation[] = [
  {
    id: "troptions-overview",
    title: "Troptions — Institutional Operating Infrastructure Overview",
    url: "/troptions",
    category: "overview",
    summary:
      "Primary overview of Troptions as institutional-grade infrastructure for proof-gated RWA, custody coordination, and settlement readiness.",
    tags: ["overview", "institutional", "RWA", "settlement"],
  },
  {
    id: "rwa-workflow",
    title: "Real World Asset Intake Workflow",
    url: "/troptions-old-money/rwa",
    category: "workflow",
    summary:
      "Evidence-tracked, compliance-gated intake workflow for gold, energy, carbon, oil, and treasury RWA categories.",
    tags: ["RWA", "gold", "energy", "carbon", "intake", "compliance"],
  },
  {
    id: "proof-room",
    title: "Proof Room — Evidence Documentation",
    url: "/troptions-old-money/institutional",
    category: "compliance",
    summary:
      "POF and SBLC package tracking with diligence evidence repository. Evidence-tracking only — not fabrication services.",
    tags: ["proof-of-funds", "SBLC", "diligence", "compliance"],
  },
  {
    id: "settlement-readiness",
    title: "Multi-Rail Settlement Readiness",
    url: "/troptions-old-money/settlement",
    category: "settlement",
    summary:
      "Settlement readiness system covering stablecoin, XRPL, and banking rails with pre-execution gates.",
    tags: ["settlement", "XRPL", "stablecoin", "banking", "readiness"],
  },
  {
    id: "trading-simulation",
    title: "XRPL AMM Trading Intelligence — Simulation",
    url: "/portal/troptions/trading/ai",
    category: "simulation",
    summary:
      "Simulation-only institutional trading intelligence: AMM quote modeling, DEX route planning, slippage simulation. No live execution.",
    tags: ["XRPL", "AMM", "DEX", "simulation", "trading-intelligence"],
  },
  {
    id: "client-portal",
    title: "Institutional Client Portal",
    url: "/portal/troptions",
    category: "portal",
    summary:
      "Gated client dashboard for KYC/KYB status, compliance tracking, and settlement coordination.",
    tags: ["client-portal", "KYC", "KYB", "institutional"],
  },
  {
    id: "control-plane",
    title: "Control Plane — Compliance Infrastructure",
    url: "/admin/troptions",
    category: "admin",
    summary:
      "Internal compliance orchestration with approval workflows, legal review queues, and audit logging.",
    tags: ["control-plane", "compliance", "approvals", "audit"],
  },
  {
    id: "media-library",
    title: "Institutional Media Library",
    url: "/troptions-old-money/media",
    category: "media",
    summary:
      "Approved institutional visuals: brand narrative, RWA evidence, gold reserve imagery, energy namespace marks, and certificates.",
    tags: ["media", "brand", "RWA-evidence", "certificates"],
  },
  {
    id: "gold-infrastructure",
    title: "Gold Digital Twin Infrastructure",
    url: "/troptions-old-money/gold",
    category: "asset",
    summary:
      "Gold reserve workflow: bullion intake, assay coordination, vault coordination, and digital-twin readiness.",
    tags: ["gold", "bullion", "digital-twin", "vault"],
  },
  {
    id: "energy-infrastructure",
    title: "Energy & Carbon Namespace Infrastructure",
    url: "/troptions-old-money/energy",
    category: "asset",
    summary:
      "Energy asset namespace infrastructure for oil, natural gas, renewables, and carbon credit compliance workflows.",
    tags: ["energy", "carbon", "oil", "renewables", "namespace"],
  },
  {
    id: "ai-search-layer",
    title: "Troptions AI Search and Discovery Layer",
    url: "/troptions-ai",
    category: "ai",
    summary:
      "AI-optimized structured content layer: entity graph, knowledge base, llms.txt, and machine-readable trust manifest.",
    tags: ["AI-search", "structured-data", "knowledge-graph", "llms.txt"],
  },
  {
    id: "mcp-rag-clawd",
    title: "MCP + RAG + Clawd Agentic Layer",
    url: "/admin/troptions/ai",
    category: "agentic",
    summary:
      "Permission-guarded agentic layer: MCP tool registry, source-cited RAG, and Clawd planning engine. Read-and-simulate only.",
    tags: ["MCP", "RAG", "Clawd", "agentic", "read-only"],
  },
  {
    id: "x402-readiness",
    title: "x402 Protocol Readiness",
    url: "/troptions-ai/x402",
    category: "protocol",
    summary:
      "x402 machine-payable API readiness for premium AI tool access. Dry-run only until full provider and board approval.",
    tags: ["x402", "machine-payable", "API", "protocol"],
  },
  {
    id: "telecom-concierge",
    title: "Telnyx Telecom Concierge",
    url: "/troptions-ai/telecom",
    category: "telecom",
    summary:
      "AI telecom infrastructure via Telnyx for institutional onboarding calls, SMS coordination, and compliance communications.",
    tags: ["Telnyx", "telecom", "voice", "SMS", "institutional"],
  },
];

export function getCitationsByCategory(category: string): AiCitation[] {
  return AI_CITATION_REGISTRY.filter((c) => c.category === category);
}

export function getCitationsByTag(tag: string): AiCitation[] {
  return AI_CITATION_REGISTRY.filter((c) => c.tags.includes(tag));
}
