export interface CapabilityExpansionItem {
  id: string;
  category: string;
  readiness: "active-build" | "design-phase" | "gated";
  description: string;
}

export const TROPTIONS_CAPABILITY_EXPANSION: readonly CapabilityExpansionItem[] = [
  { id: "CAP-01", category: "Public institutional website", readiness: "active-build", description: "Unified public narrative with source-tagged claims." },
  { id: "CAP-02", category: "Old-money brand system", readiness: "active-build", description: "Institutional visual system and disclosure framing." },
  { id: "CAP-03", category: "Media-rich site", readiness: "active-build", description: "Evidence-aware visual and report surfaces." },
  { id: "CAP-04", category: "Client portal", readiness: "active-build", description: "Role-based access to readiness and evidence workflows." },
  { id: "CAP-05", category: "Admin command center", readiness: "active-build", description: "Control-plane operations, approvals, and audit visibility." },
  { id: "CAP-06", category: "Claim registry", readiness: "active-build", description: "Public claims rewritten into institutional evidence records." },
  { id: "CAP-07", category: "Source registry", readiness: "active-build", description: "Source map with verification status and risk tags." },
  { id: "CAP-08", category: "Proof room", readiness: "active-build", description: "Evidence package intake and reviewer workflows." },
  { id: "CAP-09", category: "POF workflow", readiness: "active-build", description: "Proof-of-funds evidence handling with release gates." },
  { id: "CAP-10", category: "SBLC workflow", readiness: "active-build", description: "SBLC evidence readiness with audit trails." },
  { id: "CAP-11", category: "RWA intake", readiness: "active-build", description: "Asset intake packages with title/valuation controls." },
  { id: "CAP-12", category: "Gold evidence packages", readiness: "design-phase", description: "Custody and valuation-backed package templates." },
  { id: "CAP-13", category: "Energy asset evidence", readiness: "design-phase", description: "Energy program evidence standardization." },
  { id: "CAP-14", category: "Banking rail evaluation", readiness: "gated", description: "Provider and legal dependency checks." },
  { id: "CAP-15", category: "Stablecoin rail evaluation", readiness: "gated", description: "Operational, legal, and compliance gating." },
  { id: "CAP-16", category: "XRPL account/trustline/AMM/DEX simulation", readiness: "active-build", description: "Simulation-first route and liquidity analysis." },
  { id: "CAP-17", category: "Conversion simulation", readiness: "active-build", description: "Modeled conversion pathways with risk flags." },
  { id: "CAP-18", category: "Exchange routing evaluation", readiness: "active-build", description: "Route scoring and readiness controls." },
  { id: "CAP-19", category: "Algorithmic trading simulation", readiness: "active-build", description: "Non-live strategy simulation and review." },
  { id: "CAP-20", category: "Settlement readiness", readiness: "active-build", description: "Readiness checks before any production recommendations." },
  { id: "CAP-21", category: "Audit hash chain", readiness: "active-build", description: "Tamper-evident operational log lineage." },
  { id: "CAP-22", category: "Signed audit exports", readiness: "active-build", description: "Governance-friendly export workflows." },
  { id: "CAP-23", category: "Key rotation", readiness: "active-build", description: "Operator security lifecycle controls." },
  { id: "CAP-24", category: "Operator security", readiness: "active-build", description: "Role segmentation and incident control pathways." },
  { id: "CAP-25", category: "Deployment gates", readiness: "active-build", description: "Release and rollback control framework." },
  { id: "CAP-26", category: "Observability", readiness: "active-build", description: "Monitoring, logs, and structured diagnostics." },
  { id: "CAP-27", category: "Postgres cutover tooling", readiness: "design-phase", description: "Data migration and cutover runbook controls." },
  { id: "CAP-28", category: "AI search optimization", readiness: "active-build", description: "Machine-readable content and search readiness." },
  { id: "CAP-29", category: "Global insights system", readiness: "active-build", description: "Cross-domain insight publication controls." },
  { id: "CAP-30", category: "MCP/RAG/Clawd agent system", readiness: "active-build", description: "Source-aware agentic intelligence pipeline." },
  { id: "CAP-31", category: "x402 readiness", readiness: "design-phase", description: "Commercial API/report metering preparation." },
  { id: "CAP-32", category: "Telnyx telecom/AI concierge readiness", readiness: "gated", description: "Dry-run state until provider/legal approvals." },
];
