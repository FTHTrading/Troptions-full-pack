/**
 * Troptions Integration Registry
 * All external partner and protocol integrations — current status, agreement status,
 * technical integration status, and any claims associated with each integration.
 *
 * RULES:
 * - No integration may be described as "live" unless integrationStatus = "active"
 * - No merchant-acceptance claim may reference GivBux without a signed GivBux agreement
 * - No QuantumXchange exchange claim may be published without licensing memo
 * - All integrations require legal review of the associated claims before public use
 */

export type IntegrationStatus =
  | "active"
  | "evaluation"
  | "announced-unverified"
  | "pending-agreement"
  | "development"
  | "suspended"
  | "terminated";

export interface TroptionsIntegration {
  integrationId: string;
  partnerName: string;
  category: string;
  description: string;
  agreementStatus: string;
  integrationStatus: IntegrationStatus;
  associatedClaims: string[];
  claimsBlockedUntil: string[];
  technicalStatus: string;
  legalStatus: string;
  riskNotes: string;
  nextAction: string;
}

export const INTEGRATION_REGISTRY: TroptionsIntegration[] = [
  {
    integrationId: "INT-GIVBUX-001",
    partnerName: "GivBux",
    category: "Merchant Payment Rail",
    description: "GivBux is the payment rail partner cited for Troptions Pay merchant network claims. GivBux provides access to merchant acceptance infrastructure.",
    agreementStatus: "unverified — no signed agreement documented",
    integrationStatus: "announced-unverified",
    associatedClaims: ["CLAIM-MERCHANT-001", "CLAIM-MERCHANT-002"],
    claimsBlockedUntil: [
      "Signed GivBux agreement",
      "Verified, dated merchant count with methodology",
      "Geographic coverage documentation",
      "Excluded merchant categories list",
      "Acceptance conditions documentation",
    ],
    technicalStatus: "Not integrated. No API or SDK integration documented.",
    legalStatus: "No signed agreement. No technical integration.",
    riskNotes: "All merchant-acceptance claims are blocked until GivBux agreement is signed and merchant count is independently verified.",
    nextAction: "Obtain signed GivBux agreement. Verify merchant count with GivBux. Document acceptance conditions and geographic coverage.",
  },
  {
    integrationId: "INT-QXCHANGE-001",
    partnerName: "QuantumXchange",
    category: "Exchange Infrastructure",
    description: "QuantumXchange announced as exchange infrastructure partner for Troptions. No operational exchange exists as of registry date.",
    agreementStatus: "unverified — no signed agreement documented",
    integrationStatus: "announced-unverified",
    associatedClaims: ["CLAIM-EXCHANGE-001"],
    claimsBlockedUntil: [
      "Signed partnership or development agreement",
      "Exchange licensing analysis from counsel",
      "Exchange architecture documentation",
      "Custody model documentation",
      "Compliance and AML policy",
      "Jurisdiction analysis",
    ],
    technicalStatus: "No technical integration documented.",
    legalStatus: "No signed agreement. No licensing analysis. No operational exchange.",
    riskNotes: "CRITICAL: 'World's first full-service crypto exchange' claim is blocked. Operating an exchange requires licensing.",
    nextAction: "Obtain signed agreement. Engage exchange/ATS counsel. Determine licensing pathway.",
  },
  {
    integrationId: "INT-LUXOR-001",
    partnerName: "Luxor Holdings",
    category: "RWA / Real Estate",
    description: "Luxor Holdings cited as a real estate and commercial asset partner in Troptions RWA documentation.",
    agreementStatus: "evaluation",
    integrationStatus: "evaluation",
    associatedClaims: [],
    claimsBlockedUntil: [
      "Signed partnership agreement",
      "Asset list with title documentation",
      "Appraisal documentation",
      "Legal classification of asset-backed tokens",
    ],
    technicalStatus: "Not integrated.",
    legalStatus: "Evaluation only.",
    riskNotes: "RWA claims require asset title, appraisal, custody, and legal classification before any token issuance.",
    nextAction: "Execute partnership agreement. Build asset documentation package.",
  },
  {
    integrationId: "INT-CROWN-001",
    partnerName: "Crown Industrial Loan",
    category: "Credit / Lending",
    description: "Crown Industrial Loan cited as a credit partner in Troptions commercial lending documentation.",
    agreementStatus: "evaluation",
    integrationStatus: "evaluation",
    associatedClaims: [],
    claimsBlockedUntil: [
      "Signed lending or referral agreement",
      "Lending terms documentation",
      "Legal and regulatory analysis of lending activities",
    ],
    technicalStatus: "Not integrated.",
    legalStatus: "Evaluation only.",
    riskNotes: "Lending activities may trigger licensing requirements. Legal analysis required.",
    nextAction: "Execute agreement. Complete regulatory analysis of lending activities.",
  },
  {
    integrationId: "INT-LIVEOAKS-001",
    partnerName: "Live Oaks Strategies",
    category: "Advisory / Strategy",
    description: "Live Oaks Strategies cited as a strategy and advisory partner in Troptions materials.",
    agreementStatus: "evaluation",
    integrationStatus: "evaluation",
    associatedClaims: [],
    claimsBlockedUntil: [
      "Signed advisory or engagement agreement",
    ],
    technicalStatus: "Not integrated.",
    legalStatus: "Evaluation only.",
    riskNotes: "Advisory relationship must be formally documented before any public reference.",
    nextAction: "Execute advisory agreement. Define scope and disclosure requirements.",
  },
  {
    integrationId: "INT-CENTRIFUGE-001",
    partnerName: "Centrifuge",
    category: "RWA / DeFi Lending",
    description: "Centrifuge evaluated as a potential RWA pool platform for Troptions assets.",
    agreementStatus: "evaluation",
    integrationStatus: "evaluation",
    associatedClaims: [],
    claimsBlockedUntil: [
      "Legal approval (legalStatus = approved)",
      "Integration approval (integrationStatus = active)",
      "Board approval",
      "Asset documentation package",
    ],
    technicalStatus: "Not integrated. Centrifuge pool setup not started.",
    legalStatus: "Evaluation only. Cannot activate without legal approval.",
    riskNotes: "See FUND-CENT-001 in fundingRouteRegistry. DeFi protocol risk.",
    nextAction: "Complete legal review. Engage Centrifuge team. Build asset documentation package.",
  },
  {
    integrationId: "INT-MAPLE-001",
    partnerName: "Maple Finance",
    category: "Institutional Credit",
    description: "Maple Finance evaluated as a potential institutional credit facility for Troptions.",
    agreementStatus: "evaluation",
    integrationStatus: "evaluation",
    associatedClaims: [],
    claimsBlockedUntil: [
      "Legal approval (legalStatus = approved)",
      "Integration approval (integrationStatus = active)",
      "Board approval",
      "Borrower credit profile and collateral package",
    ],
    technicalStatus: "Not integrated.",
    legalStatus: "Evaluation only. Cannot activate without legal approval.",
    riskNotes: "See FUND-MAPLE-001 in fundingRouteRegistry.",
    nextAction: "Complete legal review. Prepare borrower profile. Engage Maple.",
  },
];

export function assertIntegrationActive(integration: TroptionsIntegration): void {
  if (integration.integrationStatus !== "active") {
    throw new Error(
      `[IntegrationGuard] "${integration.partnerName}" integration is not active. Status: "${integration.integrationStatus}". Blocked until: ${integration.claimsBlockedUntil.join(", ")}.`,
    );
  }
}

export function getIntegrationsByStatus(status: IntegrationStatus): TroptionsIntegration[] {
  return INTEGRATION_REGISTRY.filter((i) => i.integrationStatus === status);
}
