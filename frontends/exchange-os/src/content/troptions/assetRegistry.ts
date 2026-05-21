/**
 * Troptions Asset Registry
 * Every asset in the Troptions ecosystem must be registered here
 * with full legal, custody, compliance, and proof status before
 * any issuance, settlement, or participant interaction.
 *
 * Assets cannot be issued without:
 *   - legal counsel approval
 *   - custody proof
 *   - reserve proof (where applicable)
 *   - board approval
 */

export type AssetType =
  | "digital-utility"
  | "barter-asset"
  | "gold-backed"
  | "silver-backed"
  | "commodity-backed"
  | "real-estate"
  | "receivable"
  | "invoice"
  | "revenue-right"
  | "bond"
  | "note"
  | "treasury-product"
  | "certificate"
  | "stable-unit"
  | "internal-accounting-unit"
  | "member-unit"
  | "rwa-pool"
  | "private-credit"
  | "other";

export type ApprovalStatus =
  | "approved"
  | "pending"
  | "not-started"
  | "rejected"
  | "evaluation";

export type TransferRestriction =
  | "none"
  | "kyc-required"
  | "accreditation-required"
  | "board-approved-only"
  | "non-transferable"
  | "restricted-securities"
  | "evaluation";

export interface TroptionsAsset {
  assetId: string;
  assetName: string;
  assetType: AssetType;
  assetClass: string;
  owner: string;
  issuer: string;
  chain: string;
  jurisdiction: string;
  custodyStatus: ApprovalStatus;
  valuationStatus: ApprovalStatus;
  legalStatus: ApprovalStatus;
  complianceStatus: ApprovalStatus;
  reserveStatus: ApprovalStatus;
  proofStatus: ApprovalStatus;
  fundingStatus: ApprovalStatus;
  issuanceStatus: ApprovalStatus;
  transferRestrictionStatus: TransferRestriction;
  riskScore: number; // 1-10
  documentsRequired: string[];
  boardApprovalStatus: ApprovalStatus;
  notes: string;
  nextAction: string;
}

export const ASSET_REGISTRY: TroptionsAsset[] = [
  {
    assetId: "ASSET-TPAY-001",
    assetName: "Troptions Pay",
    assetType: "barter-asset",
    assetClass: "digital utility",
    owner: "Troptions",
    issuer: "Troptions",
    chain: "Multiple — requires chain confirmation",
    jurisdiction: "US — subject to jurisdictional review",
    custodyStatus: "evaluation",
    valuationStatus: "evaluation",
    legalStatus: "evaluation",
    complianceStatus: "evaluation",
    reserveStatus: "not-started",
    proofStatus: "not-started",
    fundingStatus: "not-started",
    issuanceStatus: "not-started",
    transferRestrictionStatus: "evaluation",
    riskScore: 7,
    documentsRequired: [
      "legal-classification-memo",
      "chain-of-title",
      "merchant-network-agreement",
      "merchant-count-verification",
      "tax-treatment-memo",
      "transfer-restriction-policy",
    ],
    boardApprovalStatus: "not-started",
    notes:
      "Merchant acceptance claims (480K–580K locations) require source, date, rail provider, acceptance conditions, and independent verification before any institutional use.",
    nextAction:
      "Engage counsel for classification. Verify merchant network count with GivBux agreement documentation.",
  },
  {
    assetId: "ASSET-TGOLD-001",
    assetName: "Troptions Gold",
    assetType: "gold-backed",
    assetClass: "gold-backed asset",
    owner: "Troptions",
    issuer: "Troptions",
    chain: "XRPL / evaluation",
    jurisdiction: "US — subject to commodities and securities review",
    custodyStatus: "evaluation",
    valuationStatus: "evaluation",
    legalStatus: "evaluation",
    complianceStatus: "evaluation",
    reserveStatus: "evaluation",
    proofStatus: "evaluation",
    fundingStatus: "not-started",
    issuanceStatus: "not-started",
    transferRestrictionStatus: "evaluation",
    riskScore: 8,
    documentsRequired: [
      "physical-gold-custody-proof",
      "vault-receipt",
      "assay-certificate",
      "reserve-schedule",
      "audit-report-with-scope-date-methodology",
      "legal-classification-memo",
      "balance-sheet-accounting-memo",
      "transfer-restriction-policy",
      "custodian-attestation",
    ],
    boardApprovalStatus: "not-started",
    notes:
      "SALP claims ('tokenizes real assets into liquid digital tokens') require full RWA intake: title, appraisal, lien search, custody, legal opinion, transfer restrictions, investor eligibility. Balance-sheet-enhancement claims require independent CPA review before institutional use.",
    nextAction:
      "Obtain audit report with full scope, reviewer identity, date, methodology, exceptions. Engage custodian for vault receipt.",
  },
  {
    assetId: "ASSET-TUNITY-001",
    assetName: "Troptions Unity (TUNITY)",
    assetType: "digital-utility",
    assetClass: "member unit",
    owner: "Troptions",
    issuer: "Troptions",
    chain: "Solana",
    jurisdiction: "US — subject to securities, charity, and tax review",
    custodyStatus: "evaluation",
    valuationStatus: "evaluation",
    legalStatus: "evaluation",
    complianceStatus: "evaluation",
    reserveStatus: "evaluation",
    proofStatus: "not-started",
    fundingStatus: "not-started",
    issuanceStatus: "not-started",
    transferRestrictionStatus: "evaluation",
    riskScore: 8,
    documentsRequired: [
      "legal-classification-memo",
      "reserve-schedule",
      "backing-asset-list",
      "redemption-policy",
      "use-of-proceeds-policy",
      "charity-governance-policy",
      "treasury-controls-memo",
      "solana-token-data",
      "reporting-cadence-policy",
    ],
    boardApprovalStatus: "not-started",
    notes:
      "Whitepaper describes as 'stable, asset-backed humanitarian token' with 400M starting supply on Solana. Use of 'stable' or 'asset-backed' requires reserve policy, backing evidence, redemption terms, legal classification, governance controls, and reporting cadence before institutional or public use.",
    nextAction:
      "Engage securities counsel and nonprofit/charity counsel for classification. Remove 'stable' and 'asset-backed' from public copy pending legal review.",
  },
  {
    assetId: "ASSET-XTROP-001",
    assetName: "Xtroptions",
    assetType: "digital-utility",
    assetClass: "digital utility",
    owner: "Troptions",
    issuer: "Troptions",
    chain: "Evaluation",
    jurisdiction: "US — subject to review",
    custodyStatus: "evaluation",
    valuationStatus: "evaluation",
    legalStatus: "evaluation",
    complianceStatus: "evaluation",
    reserveStatus: "not-started",
    proofStatus: "not-started",
    fundingStatus: "not-started",
    issuanceStatus: "not-started",
    transferRestrictionStatus: "evaluation",
    riskScore: 7,
    documentsRequired: [
      "legal-classification-memo",
      "chain-of-title",
      "transfer-restriction-policy",
    ],
    boardApprovalStatus: "not-started",
    notes: "Variant of Troptions ecosystem token. Classification and chain pending legal review.",
    nextAction: "Confirm chain, supply schedule, and legal classification.",
  },
  {
    assetId: "ASSET-XTROPGOLD-001",
    assetName: "Xtroptions Gold",
    assetType: "gold-backed",
    assetClass: "gold-backed asset",
    owner: "Troptions",
    issuer: "Troptions",
    chain: "Evaluation",
    jurisdiction: "US — subject to commodities and securities review",
    custodyStatus: "evaluation",
    valuationStatus: "evaluation",
    legalStatus: "evaluation",
    complianceStatus: "evaluation",
    reserveStatus: "evaluation",
    proofStatus: "not-started",
    fundingStatus: "not-started",
    issuanceStatus: "not-started",
    transferRestrictionStatus: "evaluation",
    riskScore: 8,
    documentsRequired: [
      "physical-gold-custody-proof",
      "vault-receipt",
      "assay-certificate",
      "reserve-schedule",
      "legal-classification-memo",
    ],
    boardApprovalStatus: "not-started",
    notes: "Gold-backed variant. Requires same custody and proof stack as Troptions Gold.",
    nextAction: "Define relationship to Troptions Gold reserve schedule. Confirm chain.",
  },
  {
    assetId: "ASSET-XTROPAUS-001",
    assetName: "Xtroptions AUS",
    assetType: "commodity-backed",
    assetClass: "commodity-backed asset",
    owner: "Troptions",
    issuer: "Troptions",
    chain: "Evaluation",
    jurisdiction: "US / International — subject to review",
    custodyStatus: "evaluation",
    valuationStatus: "evaluation",
    legalStatus: "evaluation",
    complianceStatus: "evaluation",
    reserveStatus: "evaluation",
    proofStatus: "not-started",
    fundingStatus: "not-started",
    issuanceStatus: "not-started",
    transferRestrictionStatus: "evaluation",
    riskScore: 8,
    documentsRequired: [
      "commodity-backing-proof",
      "custody-receipt",
      "legal-classification-memo",
      "reserve-schedule",
    ],
    boardApprovalStatus: "not-started",
    notes: "AUS commodity variant under SALP framework. Full RWA intake required.",
    nextAction: "Identify underlying commodity, custodian, and legal structure.",
  },
];

export function getAsset(id: string): TroptionsAsset | undefined {
  return ASSET_REGISTRY.find((a) => a.assetId === id);
}

export function getAssetsRequiringAction(): TroptionsAsset[] {
  return ASSET_REGISTRY.filter(
    (a) =>
      a.issuanceStatus === "not-started" ||
      a.legalStatus === "evaluation" ||
      a.boardApprovalStatus === "not-started",
  );
}

/** Runtime issuance guard — throws if asset is not approved for issuance */
export function assertIssuanceReady(asset: TroptionsAsset): void {
  const blockers: string[] = [];
  if (asset.legalStatus !== "approved") blockers.push("legalStatus not approved");
  if (asset.custodyStatus !== "approved") blockers.push("custodyStatus not approved");
  if (asset.boardApprovalStatus !== "approved") blockers.push("boardApprovalStatus not approved");
  if (asset.complianceStatus !== "approved") blockers.push("complianceStatus not approved");
  if (blockers.length > 0) {
    throw new Error(
      `[IssuanceGuard] Asset "${asset.assetName}" cannot be issued. Blockers: ${blockers.join("; ")}`,
    );
  }
}
