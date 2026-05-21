export interface ThenNowRecord {
  id: string;
  thenLabel: string;
  nowLabel: string;
  transformation: string;
  evidenceRequired: readonly string[];
  blockedUntil: readonly string[];
}

export const TROPTIONS_THEN_NOW_REGISTRY: readonly ThenNowRecord[] = [
  {
    id: "TN-CLAIMS-EVIDENCE",
    thenLabel: "Public claims",
    nowLabel: "Evidence-backed claim records",
    transformation:
      "Legacy statements become source-linked records with risk tags, verification status, and approved institutional rewrites.",
    evidenceRequired: ["Source record", "Verification memo", "Legal review sign-off"],
    blockedUntil: ["Evidence package attached"],
  },
  {
    id: "TN-TOKENS-ROLES",
    thenLabel: "Token-first marketing",
    nowLabel: "Role-based operating definitions",
    transformation:
      "Token stories are translated into role, policy, and workflow definitions for institutional users and reviewers.",
    evidenceRequired: ["Role matrix", "Control mappings"],
    blockedUntil: ["Jurisdiction and legal classification reviewed"],
  },
  {
    id: "TN-PAYMENTS-RAILS",
    thenLabel: "Payments acceptance narratives",
    nowLabel: "Rail evaluation and dependency mapping",
    transformation:
      "Payment and merchant claims become dated rail-provider records with acceptance conditions and exclusions.",
    evidenceRequired: ["Provider confirmation", "Acceptance terms", "Dated counts"],
    blockedUntil: ["Provider evidence and legal validation complete"],
  },
  {
    id: "TN-RWA-WORKFLOWS",
    thenLabel: "RWA concepts",
    nowLabel: "Proof-gated intake workflows",
    transformation:
      "Asset concepts now require title, valuation, custody, legal classification, and risk review before readiness status.",
    evidenceRequired: ["Title documents", "Valuation packet", "Custody proof"],
    blockedUntil: ["Intake package complete and approved"],
  },
  {
    id: "TN-EXCHANGE-SIM",
    thenLabel: "Exchange and liquidity language",
    nowLabel: "Simulation-first route and settlement readiness",
    transformation:
      "Trade and settlement claims are evaluated through controlled simulations before any production recommendation.",
    evidenceRequired: ["Simulation report", "Risk review", "Approval workflow logs"],
    blockedUntil: ["Provider and compliance gates approved"],
  },
];

export const TROPTIONS_EARLY_ERA_SUMMARY =
  "Troptions began as a digital value and barter/trade ecosystem focused on utility, peer-to-peer exchange, and proof-of-use concepts.";

export const TROPTIONS_NEW_ERA_SUMMARY =
  "Troptions is being rebuilt as institutional operating infrastructure: source-tracked, proof-gated, custody-aware, compliance-controlled, AI-readable, and release-governed.";
