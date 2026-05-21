/**
 * AI Search Registry — structured data for AI search engine discovery.
 * Describes Troptions in machine-readable terms without licensing claims.
 */

export const AI_DISCLAIMER =
  "Troptions provides institutional operating infrastructure subject to provider, legal, compliance, custody, jurisdiction, and board approval gates. Troptions is not a bank, broker-dealer, exchange, custodian, or licensed financial institution.";

export interface AiSearchEntry {
  id: string;
  title: string;
  description: string;
  entityType: string;
  url: string;
  keywords: string[];
  status: "live" | "simulation" | "gated" | "planned";
  gateStatus: string;
}

export const AI_SEARCH_REGISTRY: AiSearchEntry[] = [
  {
    id: "troptions-overview",
    title: "Troptions — Institutional Operating Infrastructure",
    description:
      "Troptions is institutional-grade infrastructure for proof-gated RWA issuance, custody coordination, settlement readiness, SBLC workflow, POF tracking, and XRPL simulation.",
    entityType: "InstitutionalPlatform",
    url: "/troptions",
    keywords: ["RWA", "proof-gated", "institutional", "settlement readiness", "custody coordination"],
    status: "live",
    gateStatus: "proof-gated | compliance-gated | custody-gated | board-gated",
  },
  {
    id: "rwa-intake",
    title: "Real World Asset Intake — Troptions",
    description:
      "Structured intake workflow for gold, energy, carbon, oil, and treasury assets. Evidence-tracked, compliance-gated, and custody-coordinated.",
    entityType: "AssetIntakeWorkflow",
    url: "/troptions-old-money/rwa",
    keywords: ["RWA", "gold", "energy", "carbon", "oil", "treasury", "asset tokenization"],
    status: "gated",
    gateStatus: "proof-gated | legal-review | custody-gate | board-approval",
  },
  {
    id: "proof-room",
    title: "Proof Room — Evidence-Gated Documentation",
    description:
      "Proof of Funds and SBLC package tracking, diligence evidence repository, and readiness checkpoints. Not a document fabrication service.",
    entityType: "ComplianceWorkflow",
    url: "/troptions-old-money/institutional",
    keywords: ["proof of funds", "SBLC", "diligence", "evidence tracking", "compliance"],
    status: "gated",
    gateStatus: "compliance-gated | legal-review | provider-gated",
  },
  {
    id: "xrpl-simulation",
    title: "XRPL AMM / DEX Simulation — Troptions",
    description:
      "Simulation-only route planning, AMM quote modeling, and DEX strategy analysis for institutional XRPL workflows. No live execution.",
    entityType: "TradingSimulation",
    url: "/portal/troptions/trading/ai",
    keywords: ["XRPL", "AMM", "DEX", "trading simulation", "route planning"],
    status: "simulation",
    gateStatus: "simulation-only | provider-gated | legal-review | board-approval",
  },
  {
    id: "settlement-readiness",
    title: "Settlement Readiness System — Troptions",
    description:
      "Multi-rail settlement readiness tracking across stablecoin, XRPL, and banking rails. Readiness gates before any settlement execution.",
    entityType: "SettlementReadiness",
    url: "/troptions-old-money/settlement",
    keywords: ["settlement", "stablecoin", "banking rails", "XRPL", "readiness"],
    status: "gated",
    gateStatus: "provider-gated | legal-review | compliance-gated | board-gated",
  },
  {
    id: "client-portal",
    title: "Institutional Client Portal — Troptions",
    description:
      "Gated client dashboard for KYC/KYB status, SBLC readiness, POF tracking, and settlement coordination.",
    entityType: "ClientPortal",
    url: "/portal/troptions",
    keywords: ["client portal", "KYC", "KYB", "institutional access", "compliance dashboard"],
    status: "gated",
    gateStatus: "identity-gated | entity-gated | compliance-gated",
  },
  {
    id: "control-plane",
    title: "Control Plane — Troptions Admin Infrastructure",
    description:
      "Compliance control plane with approval workflows, legal review queues, risk matrices, and audit logging.",
    entityType: "ControlPlane",
    url: "/admin/troptions",
    keywords: ["control plane", "approvals", "audit log", "compliance", "risk matrix"],
    status: "live",
    gateStatus: "admin-only | role-gated | audit-logged",
  },
  {
    id: "media-library",
    title: "Institutional Media Library — Troptions",
    description:
      "Approved institutional visual assets: brand narrative, RWA evidence, gold reserve, energy namespace marks, and certificates.",
    entityType: "MediaLibrary",
    url: "/troptions-old-money/media",
    keywords: ["institutional media", "RWA evidence", "gold reserve", "certificates", "brand"],
    status: "live",
    gateStatus: "approved-assets-only",
  },
];
