/**
 * TROPTIONS XRPL IOU Issuance Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY. Simulation-only — no live signing, no live issuance,
 * no custody, no stablecoin minting.
 *
 * Models the readiness state, document requirements, and compliance gates
 * needed before a TROPTIONS Gateway IOU can be issued on XRPL.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SAFETY STATEMENT:
 * No live IOU issuance, stablecoin issuance, custody, exchange, AMM
 * execution, Aave execution, token buyback, liquidity pool execution,
 * or public investment functionality is enabled by this module.
 * ──────────────────────────────────────────────────────────────────────────
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type XrplIouAssetType =
  | "AXL001"    // Alexandrite RWA receipt
  | "BTCREC"    // BTC collateral receipt
  | "GOLD"      // Gold / precious metals receipt
  | "CARBON"    // Carbon credit receipt
  | "RWA"       // Generic RWA package
  | "USD"       // USD-stable IOU (requires full reserve/legal)
  | "TROPTIONS"; // TROPTIONS native token receipt

export type XrplIouStatus =
  | "DRAFT"
  | "EVIDENCE_PENDING"
  | "RESERVE_PENDING"
  | "LEGAL_PENDING"
  | "TRUSTLINE_READY"
  | "ISSUANCE_READY"
  | "ISSUED"
  | "REDEEMED"
  | "BLOCKED";

export type DocumentStatus = "MISSING" | "PENDING" | "SUBMITTED" | "VERIFIED";

export interface IouDocumentItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  status: DocumentStatus;
  hardBlockIfMissing: boolean;
}

export interface XrplIouPacket {
  packetId: string;
  assetType: XrplIouAssetType;
  currencyCode: string;             // e.g. "AXL001", "GOLD", "USD"
  xrplCurrencyHex?: string;         // 20-byte hex for 4+ char codes
  issuerAddress: string;
  holderAddress?: string;
  authorizedTrustlineRequired: boolean;
  reserveProofStatus: DocumentStatus;
  custodyProofStatus: DocumentStatus;
  redemptionTermsStatus: DocumentStatus;
  legalStatus: DocumentStatus;
  kycStatus: DocumentStatus;
  issuanceLimit: string;
  proposedAmount: string;
  readinessScore: number;           // 0–100
  status: XrplIouStatus;
  evidenceRefs: string[];
  riskFlags: string[];
  documents: IouDocumentItem[];
  blockedReasons: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IouReadinessResult {
  packetId: string;
  assetType: XrplIouAssetType;
  status: XrplIouStatus;
  score: number;
  scoreLabel: string;
  documents: IouDocumentItem[];
  blockedReasons: string[];
  nextSteps: string[];
  simulationOnly: true;
}

// ─── XRPL wallet addresses (public only) ────────────────────────────────────

export const XRPL_ISSUER_ADDRESS      = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";
export const XRPL_DISTRIBUTOR_ADDRESS = "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt";

// ─── Required documents per asset type ──────────────────────────────────────

function buildDocumentChecklist(assetType: XrplIouAssetType): IouDocumentItem[] {
  const base: IouDocumentItem[] = [
    {
      id: "kyc",
      label: "KYC / KYB Identity Verification",
      description: "Individual KYC or entity KYB, including authorized signer proof and sanctions screening.",
      required: true,
      status: "MISSING",
      hardBlockIfMissing: true,
    },
    {
      id: "issuer_wallet",
      label: "Issuer Wallet Policy",
      description: "Confirmed issuer wallet, DefaultRipple enabled, authorized trustline policy documented.",
      required: true,
      status: "MISSING",
      hardBlockIfMissing: true,
    },
    {
      id: "redemption_terms",
      label: "Redemption Terms Document",
      description: "Documented terms under which IOU holders can redeem for underlying asset or cash equivalent.",
      required: true,
      status: "MISSING",
      hardBlockIfMissing: true,
    },
    {
      id: "freeze_clawback_policy",
      label: "Freeze / Clawback Policy",
      description: "Issuer policy on GlobalFreeze, IndividualFreeze, and clawback rights.",
      required: true,
      status: "MISSING",
      hardBlockIfMissing: false,
    },
    {
      id: "legal_opinion",
      label: "Legal Opinion / Compliance Review",
      description: "Qualified legal review of issuance, jurisdiction, securities law, and redemption structure.",
      required: true,
      status: "MISSING",
      hardBlockIfMissing: true,
    },
    {
      id: "jurisdiction_restrictions",
      label: "Jurisdiction Restriction Notice",
      description: "List of jurisdictions excluded from holding this IOU.",
      required: true,
      status: "MISSING",
      hardBlockIfMissing: false,
    },
  ];

  const byType: Record<XrplIouAssetType, IouDocumentItem[]> = {
    AXL001: [
      { id: "appraisal", label: "Independent Gemstone Appraisal", description: "Third-party appraisal from recognized gemologist with stone description, weight, and value range.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "custody_agreement", label: "Vault / Custody Agreement", description: "Signed custody or vault agreement naming the stone and holder.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "insurance", label: "Insurance Certificate / Binder", description: "Active insurance binder covering custody period.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "ownership_proof", label: "Ownership Proof / Bill of Sale", description: "Chain-of-title documentation proving TROPTIONS Gateway holds or controls the asset.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "spv_pledge", label: "SPV / Pledge Agreement", description: "Legal wrapper — SPV structure or pledge agreement giving lender/holder legal rights.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "liquidation_plan", label: "Liquidation Plan", description: "Documented plan for how stone would be sold, by whom, at what discount, and on what timeline.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "photos_video", label: "Photos / Video with Chain-of-Custody", description: "High-resolution photos and video of the stone with chain-of-custody notes.", required: true, status: "MISSING", hardBlockIfMissing: false },
    ],
    BTCREC: [
      { id: "wallet_proof", label: "BTC Wallet Ownership Proof", description: "Signed message from controlling wallet or custodian statement confirming BTC balance.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "source_of_funds", label: "Source of Funds Statement", description: "AML-compliant source of funds documentation.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "custodian_agreement", label: "Custodian / Provider Agreement", description: "Custody provider agreement if BTC is held by third-party.", required: false, status: "MISSING", hardBlockIfMissing: false },
    ],
    GOLD: [
      { id: "assay_certificate", label: "Assay Certificate", description: "Independent assay report with weight and purity.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "vault_statement", label: "Vault / Storage Statement", description: "Vault provider statement confirming gold in custody.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "insurance_metals", label: "Insurance Certificate", description: "Active insurance covering vaulted metals.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "reserve_audit", label: "Reserve Audit Report", description: "Third-party reserve audit confirming quantity on deposit.", required: true, status: "MISSING", hardBlockIfMissing: false },
    ],
    CARBON: [
      { id: "registry_record", label: "Carbon Registry Record", description: "Registry name, project ID, vintage, and serial numbers.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "serial_numbers", label: "Serial Numbers", description: "Full serial number list for each credit.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "retirement_status", label: "Retirement Status Confirmation", description: "Confirmation that credits are unretired (retired credits cannot be resold).", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "methodology", label: "Methodology Documentation", description: "Project methodology (e.g. VERRA, Gold Standard) confirming credit quality.", required: true, status: "MISSING", hardBlockIfMissing: false },
      { id: "transfer_cert", label: "Transfer / Ownership Certificate", description: "Registry transfer record showing TROPTIONS Gateway as current owner.", required: true, status: "MISSING", hardBlockIfMissing: true },
    ],
    RWA: [
      { id: "title_deed", label: "Title / Deed / Ownership Document", description: "Title report, deed, or legal ownership proof for the asset.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "appraisal_rwa", label: "Appraisal / Valuation", description: "Independent valuation or appraisal.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "insurance_rwa", label: "Insurance", description: "Active insurance on the asset.", required: true, status: "MISSING", hardBlockIfMissing: false },
      { id: "entity_docs", label: "Entity / SPV Documents", description: "Entity formation, operating agreement, and authorized signer docs.", required: true, status: "MISSING", hardBlockIfMissing: true },
    ],
    USD: [
      { id: "bank_reserve_proof", label: "Bank / Cash Reserve Proof", description: "Bank statement or audited reserve report confirming cash/cash-equivalent backing for full issuance limit.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "custody_account", label: "Custody / Bank Account Agreement", description: "Custodian or bank account agreement specifying reserve management.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "reserve_audit_usd", label: "Reserve Audit Report", description: "Third-party reserve audit confirming 1:1 backing.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "money_transmission", label: "Money Transmission / MSB Analysis", description: "Legal analysis of money transmission / MSB requirements in applicable jurisdictions.", required: true, status: "MISSING", hardBlockIfMissing: true },
    ],
    TROPTIONS: [
      { id: "token_policy", label: "TROPTIONS Token Policy", description: "Documented token supply, governance, and issuance policy.", required: true, status: "MISSING", hardBlockIfMissing: true },
      { id: "reserve_or_collateral", label: "Reserve or Collateral Proof", description: "Proof of what backs the TROPTIONS receipt.", required: true, status: "MISSING", hardBlockIfMissing: true },
    ],
  };

  return [...byType[assetType], ...base];
}

// ─── Core functions ──────────────────────────────────────────────────────────

export function createXrplIouPacket(
  assetType: XrplIouAssetType,
  opts: {
    currencyCode: string;
    xrplCurrencyHex?: string;
    issuanceLimit: string;
    proposedAmount: string;
    holderAddress?: string;
    evidenceRefs?: string[];
  }
): XrplIouPacket {
  const now = new Date().toISOString();
  const packetId = `IOU-${assetType}-${Date.now()}`;

  return {
    packetId,
    assetType,
    currencyCode: opts.currencyCode,
    xrplCurrencyHex: opts.xrplCurrencyHex,
    issuerAddress: XRPL_ISSUER_ADDRESS,
    holderAddress: opts.holderAddress,
    authorizedTrustlineRequired: assetType !== "TROPTIONS",
    reserveProofStatus: "MISSING",
    custodyProofStatus: "MISSING",
    redemptionTermsStatus: "MISSING",
    legalStatus: "MISSING",
    kycStatus: "MISSING",
    issuanceLimit: opts.issuanceLimit,
    proposedAmount: opts.proposedAmount,
    readinessScore: 0,
    status: "DRAFT",
    evidenceRefs: opts.evidenceRefs ?? [],
    riskFlags: [],
    documents: buildDocumentChecklist(assetType),
    blockedReasons: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function validateXrplIouPacket(packet: XrplIouPacket): string[] {
  const errors: string[] = [];

  if (!packet.currencyCode || packet.currencyCode.length < 3) {
    errors.push("Currency code must be at least 3 characters.");
  }
  if (packet.currencyCode.length > 3 && !packet.xrplCurrencyHex) {
    errors.push("4+ character currency codes require xrplCurrencyHex (20-byte hex).");
  }
  if (!packet.issuerAddress) {
    errors.push("Issuer address is required.");
  }
  if (BigInt(packet.proposedAmount.replace(/,/g, "")) > BigInt(packet.issuanceLimit.replace(/,/g, ""))) {
    errors.push("Proposed amount exceeds issuance limit.");
  }

  return errors;
}

export function calculateIouReadinessScore(packet: XrplIouPacket): number {
  const docs = packet.documents;
  const required = docs.filter((d) => d.required);
  const verified = required.filter((d) => d.status === "VERIFIED");
  const pending  = required.filter((d) => d.status === "PENDING" || d.status === "SUBMITTED");

  let score = Math.floor((verified.length / Math.max(required.length, 1)) * 80);
  score += Math.floor((pending.length / Math.max(required.length, 1)) * 15);

  // Cap by critical statuses
  const coreMissing = [
    packet.kycStatus,
    packet.legalStatus,
    packet.redemptionTermsStatus,
    packet.reserveProofStatus,
  ].filter((s) => s === "MISSING").length;

  if (coreMissing >= 4) score = Math.min(score, 15);
  else if (coreMissing >= 2) score = Math.min(score, 45);
  else if (coreMissing >= 1) score = Math.min(score, 65);

  // Hard caps by asset type
  if (packet.assetType === "USD" && packet.reserveProofStatus !== "VERIFIED") {
    score = Math.min(score, 50);
  }
  if (packet.assetType === "CARBON") {
    const serials = docs.find((d) => d.id === "serial_numbers");
    const registry = docs.find((d) => d.id === "registry_record");
    const retirement = docs.find((d) => d.id === "retirement_status");
    if (!serials || serials.status !== "VERIFIED" || !registry || registry.status !== "VERIFIED" || !retirement || retirement.status !== "VERIFIED") {
      score = Math.min(score, 50);
    }
  }

  return Math.max(0, Math.min(100, score));
}

export function getRequiredIouDocuments(assetType: XrplIouAssetType): IouDocumentItem[] {
  const dummy = createXrplIouPacket(assetType, {
    currencyCode: assetType,
    issuanceLimit: "0",
    proposedAmount: "0",
  });
  return dummy.documents.filter((d) => d.required);
}

export function generateIouIssuanceChecklist(packet: XrplIouPacket): IouReadinessResult {
  const score = calculateIouReadinessScore(packet);
  const blockedReasons: string[] = [];
  const nextSteps: string[] = [];

  // Hard-block checks
  for (const doc of packet.documents) {
    if (doc.hardBlockIfMissing && doc.status === "MISSING") {
      blockedReasons.push(`BLOCKED: "${doc.label}" is required and missing.`);
    }
  }
  if (packet.kycStatus === "MISSING")             blockedReasons.push("BLOCKED: KYC / KYB not completed.");
  if (packet.legalStatus === "MISSING")            blockedReasons.push("BLOCKED: Legal opinion not completed.");
  if (packet.redemptionTermsStatus === "MISSING")  blockedReasons.push("BLOCKED: Redemption terms not documented.");
  if (packet.assetType === "USD" && packet.reserveProofStatus !== "VERIFIED") {
    blockedReasons.push("BLOCKED: USD IOU requires verified 1:1 cash reserve proof.");
  }
  if (packet.assetType === "USD" && packet.custodyProofStatus !== "VERIFIED") {
    blockedReasons.push("BLOCKED: USD IOU requires verified bank/custody account proof.");
  }

  // Next steps
  const missingDocs = packet.documents.filter((d) => d.required && d.status === "MISSING");
  for (const doc of missingDocs.slice(0, 5)) {
    nextSteps.push(`Submit: ${doc.label}`);
  }
  if (score < 60)  nextSteps.push("Complete document submissions to advance readiness.");
  if (score >= 60 && score < 80) nextSteps.push("Request legal review and compliance sign-off.");
  if (score >= 80 && blockedReasons.length === 0) nextSteps.push("Request board/admin approval gate review.");

  const status = deriveStatus(packet, blockedReasons, score);
  const scoreLabel = scoreToLabel(score);

  return {
    packetId: packet.packetId,
    assetType: packet.assetType,
    status,
    score,
    scoreLabel,
    documents: packet.documents,
    blockedReasons,
    nextSteps,
    simulationOnly: true,
  };
}

export function blockIouPacket(packet: XrplIouPacket, reason: string): XrplIouPacket {
  return {
    ...packet,
    status: "BLOCKED",
    riskFlags: [...packet.riskFlags, reason],
    updatedAt: new Date().toISOString(),
  };
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function deriveStatus(
  packet: XrplIouPacket,
  blockedReasons: string[],
  score: number
): XrplIouStatus {
  if (blockedReasons.length > 0) return "BLOCKED";
  if (score >= 95) return "ISSUANCE_READY";
  if (score >= 80) return "TRUSTLINE_READY";
  if (packet.legalStatus === "MISSING") return "LEGAL_PENDING";
  if (packet.reserveProofStatus === "MISSING" || packet.custodyProofStatus === "MISSING") return "RESERVE_PENDING";
  return "EVIDENCE_PENDING";
}

function scoreToLabel(score: number): string {
  if (score >= 96) return "Execution-Ready (approval gates remain)";
  if (score >= 81) return "Counterparty-Ready";
  if (score >= 61) return "Reviewable";
  if (score >= 31) return "Incomplete";
  return "Draft";
}

// ─── Asset config registry (public metadata only) ───────────────────────────

export interface XrplIouAssetConfig {
  assetType: XrplIouAssetType;
  displayName: string;
  xrplCurrencyCode: string;
  xrplCurrencyHex?: string;
  issuanceLimit: string;
  underlying: string;
  route: string;
  aaveCompatible: boolean;
  liveIssuanceEnabled: false;
  onChainStatus?: "issued" | "pending" | "draft";
  mainnetIssuedAt?: string;
  logoPath?: string;
}

export const XRPL_IOU_ASSET_CONFIGS: XrplIouAssetConfig[] = [
  {
    assetType: "AXL001",
    displayName: "Alexandrite RWA Receipt",
    xrplCurrencyCode: "AXL001",
    xrplCurrencyHex: "41584C303031000000000000000000000000000000",
    issuanceLimit: "1",
    underlying: "2kg rough chrysoberyl/alexandrite (AXL-001) held in custody",
    route: "PRIVATE_LENDER",
    aaveCompatible: false,
    liveIssuanceEnabled: false,
  },
  {
    assetType: "BTCREC",
    displayName: "BTC Collateral Receipt",
    xrplCurrencyCode: "BTCRC",
    xrplCurrencyHex: "4254435243000000000000000000000000000000",
    issuanceLimit: "1000",
    underlying: "BTC held by approved custodian / proof of BTC collateral",
    route: "PRIVATE_LENDER",
    aaveCompatible: true,
    liveIssuanceEnabled: false,
  },
  {
    assetType: "GOLD",
    displayName: "Gold Reserve Receipt",
    xrplCurrencyCode: "GOLD",
    xrplCurrencyHex: "474F4C4400000000000000000000000000000000",
    issuanceLimit: "100000",
    underlying: "Vaulted gold (troy oz) with assay certificate",
    route: "PRIVATE_LENDER",
    aaveCompatible: false,
    liveIssuanceEnabled: false,
  },
  {
    assetType: "CARBON",
    displayName: "Carbon Credit Receipt",
    xrplCurrencyCode: "CRBN",
    xrplCurrencyHex: "4352424E00000000000000000000000000000000",
    issuanceLimit: "1000000",
    underlying: "Verified unretired carbon credits with registry serial numbers",
    route: "ASSET_BUYER",
    aaveCompatible: false,
    liveIssuanceEnabled: false,
  },
  {
    assetType: "RWA",
    displayName: "Generic RWA Package",
    xrplCurrencyCode: "RWAPK",
    xrplCurrencyHex: "5257415041004B0000000000000000000000000000",
    issuanceLimit: "10000",
    underlying: "Real-world asset (real estate, solar, equipment, receivables)",
    route: "PRIVATE_LENDER",
    aaveCompatible: false,
    liveIssuanceEnabled: false,
  },
  {
    assetType: "USD",
    displayName: "USD Stable IOU",
    xrplCurrencyCode: "USD",
    issuanceLimit: "10000000",
    underlying: "Cash or cash equivalent held in approved bank/custody account",
    route: "PRIVATE_LENDER",
    aaveCompatible: true,
    liveIssuanceEnabled: false,
  },
  {
    assetType: "TROPTIONS",
    displayName: "TROPTIONS Native Token",
    xrplCurrencyCode: "TROPTIONS",
    issuanceLimit: "100000000",
    underlying: "Commercial trade instrument backed by documented barter agreements, real property positions, solar energy, mobile medical assets, and the TROPTIONS Gateway asset reserve. 100,000,000 issued on XRPL mainnet 2026-04-28.",
    route: "MERCHANT_CREDIT",
    aaveCompatible: false,
    liveIssuanceEnabled: false,
    onChainStatus: "issued",
    mainnetIssuedAt: "2026-04-28T08:34:43Z",
    logoPath: "/assets/troptions/logos/troptions-iou-logo.svg",
  },
];

export function getIouAssetConfig(assetType: XrplIouAssetType): XrplIouAssetConfig | undefined {
  return XRPL_IOU_ASSET_CONFIGS.find((c) => c.assetType === assetType);
}
