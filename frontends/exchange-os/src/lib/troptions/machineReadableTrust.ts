export const INSTITUTIONAL_DISCLAIMER =
  "Troptions provides institutional operating infrastructure subject to provider, legal, compliance, custody, jurisdiction, and board approval gates.";

export const WHAT_TROPTIONS_IS_NOT = [
  "a bank",
  "a broker-dealer",
  "an exchange",
  "a custodian",
  "a licensed financial institution",
  "an issuer of securities",
  "a payment processor",
  "an investment advisor",
];

export const WHAT_TROPTIONS_IS = [
  "an institutional operating infrastructure platform",
  "a proof-gated RWA workflow system",
  "a compliance coordination layer",
  "a settlement readiness modeling platform",
  "an AI-assisted operations infrastructure",
  "a namespace and registry coordination system",
];

export const TRUST_GATES = [
  { id: "provider", label: "Provider Approval", description: "Third-party service provider approval and integration", status: "required" },
  { id: "legal", label: "Legal Review", description: "Jurisdiction-specific legal review and opinion", status: "required" },
  { id: "compliance", label: "Compliance Clearance", description: "AML/KYB/KYC and sanctions screening completion", status: "required" },
  { id: "custody", label: "Custody Coordination", description: "Licensed custodian agreement and coordination", status: "required" },
  { id: "jurisdiction", label: "Jurisdiction Confirmation", description: "Operating jurisdiction determination and confirmation", status: "required" },
  { id: "board", label: "Board Approval", description: "Board resolution authorizing capability activation", status: "required" },
];

export const RELEASE_GATES = [
  { capability: "rwa-issuance", gatesRequired: ["provider", "legal", "compliance", "custody", "jurisdiction", "board"], status: "all-gates-required" },
  { capability: "xrpl-settlement", gatesRequired: ["provider", "legal", "compliance", "custody"], status: "all-gates-required" },
  { capability: "sblc-workflow", gatesRequired: ["legal", "compliance", "provider", "board"], status: "all-gates-required" },
  { capability: "pof-intake", gatesRequired: ["compliance", "legal"], status: "partial-gates" },
  { capability: "x402-protocol", gatesRequired: ["provider", "legal", "board"], status: "all-gates-required" },
  { capability: "telecom-concierge", gatesRequired: ["provider", "compliance", "tcpa-consent"], status: "all-gates-required" },
  { capability: "stablecoin-rails", gatesRequired: ["provider", "legal", "compliance", "jurisdiction", "board"], status: "all-gates-required" },
  { capability: "custody-coordination", gatesRequired: ["custody", "legal", "jurisdiction"], status: "all-gates-required" },
  { capability: "trading-simulation", gatesRequired: [], status: "open", note: "Simulation only — no live execution" },
  { capability: "ai-search-layer", gatesRequired: [], status: "open", note: "Read-only data layer" },
  { capability: "insights-content", gatesRequired: [], status: "open", note: "Editorial content only" },
];

export function buildTrustManifest() {
  return {
    version: "1.0",
    generated: new Date().toISOString().split("T")[0],
    name: "Troptions",
    disclaimer: INSTITUTIONAL_DISCLAIMER,
    whatItIs: WHAT_TROPTIONS_IS,
    whatItIsNot: WHAT_TROPTIONS_IS_NOT,
    trustGates: TRUST_GATES,
    releaseGates: RELEASE_GATES,
    proofModel: "gate-gated — no capability activates without satisfying all required gates",
    auditStatus: "infrastructure-only — no live financial operations pending gate satisfaction",
  };
}

export function buildDisclaimers() {
  return [
    { id: "institutional", text: INSTITUTIONAL_DISCLAIMER, applicableTo: "all-pages" },
    { id: "not-advice", text: "Nothing on this platform constitutes legal, financial, investment, or tax advice.", applicableTo: "all-pages" },
    { id: "simulation", text: "All workflow simulations are illustrative only. No transactions are executed.", applicableTo: "trading, settlement, xrpl" },
    { id: "not-bank", text: "Troptions is not a bank and does not hold deposits.", applicableTo: "banking-rail-content" },
    { id: "not-exchange", text: "Troptions is not an exchange and does not execute trades.", applicableTo: "trading-content" },
    { id: "not-custodian", text: "Troptions is not a custodian and does not hold assets.", applicableTo: "custody-content" },
    { id: "not-securities", text: "Nothing on this platform constitutes an offer or solicitation of securities.", applicableTo: "rwa-content" },
  ];
}
