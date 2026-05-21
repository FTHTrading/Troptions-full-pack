/**
 * Troptions Institutional Operating System
 * Top-level ecosystem registry — all subsystems, modules, and identity anchors.
 *
 * Compliance notice: This registry is informational infrastructure only.
 * All assets, modules, and workflows are subject to legal review,
 * licensing review, KYC/KYB, AML, sanctions screening, custody approval,
 * board approval, and applicable jurisdictional restrictions.
 */

export type SystemMode =
  | "TROPTIONS_INFRA"
  | "TROPTIONS_MEMBER"
  | "TROPTIONS_ISSUER"
  | "TROPTIONS_INVESTOR"
  | "TROPTIONS_SETTLEMENT"
  | "TROPTIONS_VENUE"
  | "TROPTIONS_TREASURY"
  | "TROPTIONS_CUSTODY"
  | "TROPTIONS_COMPLIANCE"
  | "TROPTIONS_PROOF"
  | "TROPTIONS_ADMIN"
  | "TROPTIONS_AI";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type OperationalStatus =
  | "live"
  | "dry-run"
  | "evaluation"
  | "planned"
  | "suspended"
  | "pending-legal"
  | "pending-custody"
  | "pending-board";

export interface TroptionsModule {
  id: string;
  name: string;
  description: string;
  category: string;
  allowedModes: SystemMode[];
  prohibitedActions: string[];
  allowedChains: string[];
  allowedJurisdictions: string[];
  allowedAssets: string[];
  requiredApprovals: string[];
  requiredEvidence: string[];
  riskLevel: RiskLevel;
  status: OperationalStatus;
  owner: string;
  dependencies: string[];
  nextAction: string;
}

export const TROPTIONS_SYSTEM_IDENTITY = {
  name: "Troptions Institutional Operating System",
  tagline:
    "A proof-gated digital value and real-world asset infrastructure for barter, settlement, custody coordination, token-role governance, and evidence-backed participation.",
  version: "1.0.0",
  internalEngine: "TROPTIONS — Operating, Proof, Treasury, KYC/KYB, Asset, Settlement System",
  complianceModel: "compliance-by-jurisdiction",
  issuanceModel: "proof-gated",
  settlementModel: "custody-gated",
  releaseModel: "board-approved",
  eligibilityModel: "investor-eligibility-required",
} as const;

export const TROPTIONS_ECOSYSTEM_PILLARS = [
  "Troptions Pay",
  "Troptions Gold",
  "Troptions Unity",
  "Troptions RWA",
  "Troptions Vault",
  "Troptions Treasury",
  "Troptions Stable Units",
  "Troptions Bonds",
  "Troptions Certificates",
  "Troptions Proof of Funds",
  "Troptions Proof of Reserves",
  "Troptions Proof of Control",
  "Troptions Academy",
  "Troptions Portal",
  "Troptions Admin Command",
  "Troptions AI Concierge",
  "Troptions Telecom Support",
  "Troptions Funding Routes",
  "Troptions Custody Routes",
  "Troptions Institutional Manual",
] as const;

export type EcosystemPillar = (typeof TROPTIONS_ECOSYSTEM_PILLARS)[number];

export const COMPLIANCE_DISCLAIMER =
  "Troptions is built as compliance-by-jurisdiction infrastructure. Every asset, issuance, investor, custody route, funding route, stable unit, treasury product, bond, certificate, and transaction is subject to legal review, licensing review, sanctions screening, KYC/KYB, custody approval, board approval, and applicable jurisdictional restrictions.";

export const FULL_DISCLAIMER =
  "Troptions is informational and operational infrastructure only. Nothing on this page is legal advice, tax advice, investment advice, broker-dealer activity, exchange activity, banking activity, custody service, money transmission, or an offer to sell securities. All Troptions asset, stable unit, RWA, custody, funding, bond, treasury, and investor workflows are subject to counsel review, licensing review, KYC/KYB, AML, sanctions screening, custody approval, jurisdiction restrictions, provider approval, and board approval.";

/** Runtime guard — throws if a module attempts to operate outside its allowedModes */
export function assertModeAllowed(
  module: TroptionsModule,
  currentMode: SystemMode,
): void {
  if (!module.allowedModes.includes(currentMode)) {
    throw new Error(
      `[SystemModeGuard] Module "${module.id}" is not permitted in mode "${currentMode}". ` +
        `Allowed modes: ${module.allowedModes.join(", ")}`,
    );
  }
}

/** Runtime guard — throws if a module attempts a prohibited action */
export function assertActionAllowed(
  module: TroptionsModule,
  action: string,
): void {
  if (module.prohibitedActions.includes(action)) {
    throw new Error(
      `[SystemModeGuard] Module "${module.id}" is prohibited from performing action "${action}".`,
    );
  }
}
