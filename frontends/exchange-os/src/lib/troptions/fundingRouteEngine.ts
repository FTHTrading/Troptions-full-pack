/**
 * TROPTIONS Funding Route Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY. Simulation-only — no live credit, no live lending,
 * no live Aave execution, no live AMM execution.
 *
 * Models the 7 funding routes available to TROPTIONS asset classes and
 * calculates which routes are eligible based on asset type and readiness state.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SAFETY STATEMENT:
 * No live IOU issuance, stablecoin issuance, custody, exchange, AMM
 * execution, Aave execution, token buyback, liquidity pool execution,
 * or public investment functionality is enabled by this module.
 * ──────────────────────────────────────────────────────────────────────────
 */

import type { XrplIouAssetType, IouReadinessResult } from "./xrplIouIssuanceEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FundingRoute =
  | "PRIVATE_LENDER"
  | "ASSET_BUYER"
  | "MERCHANT_CREDIT"
  | "AAVE_ACCEPTED_COLLATERAL"
  | "XRPL_IOU_RECEIPT"
  | "AMM_AFTER_CLEARANCE"
  | "SERVICE_FEE_REVENUE";

export type RouteEligibility = "ELIGIBLE" | "BLOCKED" | "CONDITIONAL" | "NOT_APPLICABLE";

export interface FundingRouteAssessment {
  route: FundingRoute;
  displayName: string;
  eligibility: RouteEligibility;
  blockedReasons: string[];
  conditions: string[];
  description: string;
  estimatedTimeline: string;
  requiresExternalProvider: boolean;
  supportedAssets: XrplIouAssetType[];
  simulationOnly: true;
}

export interface FundingReadiness {
  assetType: XrplIouAssetType;
  overallScore: number;
  scoreLabel: string;
  recommendedRoutes: FundingRouteAssessment[];
  blockedRoutes: FundingRouteAssessment[];
  conditionalRoutes: FundingRouteAssessment[];
  topBlocker: string | null;
  simulationOnly: true;
}

export interface UseOfProceedsPlan {
  assetType: XrplIouAssetType;
  estimatedProceeds: string;
  waterfall: { rank: number; category: string; percentage: string; description: string }[];
  restrictions: string[];
  simulationOnly: true;
}

export interface LenderPacketSummary {
  assetType: XrplIouAssetType;
  headline: string;
  keyStrengths: string[];
  keyRisks: string[];
  requiredDisclosures: string[];
  missingItems: string[];
  simulationOnly: true;
}

// ─── Route definitions ────────────────────────────────────────────────────────

const ROUTE_DESCRIPTIONS: Record<FundingRoute, { displayName: string; description: string; estimatedTimeline: string; requiresExternalProvider: boolean }> = {
  PRIVATE_LENDER: {
    displayName: "Private Lender / Family Office",
    description: "Asset-backed loan or credit facility from accredited private lender. Lender reviews TROPTIONS Gateway asset package, appraisal, custody proof, and legal wrapper.",
    estimatedTimeline: "45 – 120 days from complete package submission",
    requiresExternalProvider: true,
  },
  ASSET_BUYER: {
    displayName: "Asset Buyer / Strategic Partner",
    description: "Direct purchase or off-take agreement for the underlying asset. Suitable for liquid asset types (carbon credits, metals) where a willing buyer can be sourced.",
    estimatedTimeline: "30 – 90 days depending on asset and buyer network",
    requiresExternalProvider: true,
  },
  MERCHANT_CREDIT: {
    displayName: "Merchant Credit / Trade Credit",
    description: "TROPTIONS-native credit line or trade settlement using TROPTIONS token as unit of account. Suitable for closed-network merchant-to-merchant transactions.",
    estimatedTimeline: "5 – 15 days once merchant network is onboarded",
    requiresExternalProvider: false,
  },
  AAVE_ACCEPTED_COLLATERAL: {
    displayName: "Aave v3 DeFi Lending (Accepted Collateral Only)",
    description: "Deposit accepted collateral (WBTC/cbBTC, ETH, stablecoins) into Aave v3 pool to borrow against. Raw alexandrite, gemstones, and carbon credits are NOT accepted by Aave.",
    estimatedTimeline: "Immediate once collateral is wrapped and deposited",
    requiresExternalProvider: true,
  },
  XRPL_IOU_RECEIPT: {
    displayName: "XRPL IOU Receipt Distribution",
    description: "Issue XRPL trustline IOUs to qualified counterparties. IOU is a receipt and lender-readable proof — not a guarantee of funds. Requires issuer policy, authorized trustlines, and redemption terms.",
    estimatedTimeline: "30 – 60 days from complete IOU readiness package",
    requiresExternalProvider: false,
  },
  AMM_AFTER_CLEARANCE: {
    displayName: "AMM Liquidity Pool (Post-Legal Clearance)",
    description: "Add asset-backed IOUs to XRPL AMM pool after full legal, reserve, and compliance clearance. Hard-blocked until legal approval, reserve proof, and public disclosure are complete.",
    estimatedTimeline: "90 – 180 days minimum (legal clearance required first)",
    requiresExternalProvider: false,
  },
  SERVICE_FEE_REVENUE: {
    displayName: "Verification-as-a-Service / Service Fee",
    description: "Earn origination fees, package fees, and administration fees for managing the asset verification and IOU issuance process on behalf of other asset owners.",
    estimatedTimeline: "Per engagement — typically 15 – 30 days per client",
    requiresExternalProvider: false,
  },
};

// ─── Route assessment logic ───────────────────────────────────────────────────

function assessPrivateLender(assetType: XrplIouAssetType, readiness: IouReadinessResult): FundingRouteAssessment {
  const blockedReasons: string[] = [];
  const conditions: string[] = [];

  if (readiness.score < 30) blockedReasons.push("Asset package readiness too low — lender will not engage below 30% readiness score.");
  if (assetType === "AXL001" && readiness.blockedReasons.some((r) => r.includes("appraisal") || r.includes("Appraisal"))) {
    blockedReasons.push("Lender requires independent appraisal before any term sheet.");
  }
  if (readiness.blockedReasons.some((r) => r.includes("KYC"))) {
    blockedReasons.push("Lender requires KYC/KYB completion.");
  }
  if (readiness.blockedReasons.some((r) => r.includes("Legal"))) {
    conditions.push("Legal opinion must be finalized before lender can advance to term sheet.");
  }
  if (readiness.score >= 30 && readiness.score < 60) {
    conditions.push("Partial package accepted for preliminary review only — full package required for term sheet.");
  }

  const eligible: RouteEligibility = blockedReasons.length > 0 ? "BLOCKED" : conditions.length > 0 ? "CONDITIONAL" : "ELIGIBLE";

  return {
    route: "PRIVATE_LENDER",
    ...ROUTE_DESCRIPTIONS.PRIVATE_LENDER,
    eligibility: eligible,
    blockedReasons,
    conditions,
    supportedAssets: ["AXL001", "BTCREC", "GOLD", "RWA", "USD"],
    simulationOnly: true,
  };
}

function assessAssetBuyer(assetType: XrplIouAssetType, readiness: IouReadinessResult): FundingRouteAssessment {
  const blockedReasons: string[] = [];
  const conditions: string[] = [];

  const liquidAssets: XrplIouAssetType[] = ["CARBON", "GOLD", "BTCREC"];
  if (!liquidAssets.includes(assetType)) {
    blockedReasons.push(`Asset type "${assetType}" is not typically liquid enough for direct buyer route. Private lender route recommended.`);
  }
  if (assetType === "CARBON") {
    if (readiness.blockedReasons.some((r) => r.includes("retirement") || r.includes("serial"))) {
      blockedReasons.push("Carbon credits require verified registry, serials, and retirement status before buyer engagement.");
    }
  }
  if (readiness.blockedReasons.some((r) => r.includes("KYC"))) {
    blockedReasons.push("Buyer KYC / AML check required.");
  }

  const eligible: RouteEligibility = blockedReasons.length > 0 ? "BLOCKED" : conditions.length > 0 ? "CONDITIONAL" : "ELIGIBLE";

  return {
    route: "ASSET_BUYER",
    ...ROUTE_DESCRIPTIONS.ASSET_BUYER,
    eligibility: eligible,
    blockedReasons,
    conditions,
    supportedAssets: ["CARBON", "GOLD", "BTCREC"],
    simulationOnly: true,
  };
}

function assessMerchantCredit(assetType: XrplIouAssetType, _readiness: IouReadinessResult): FundingRouteAssessment {
  const blockedReasons: string[] = [];
  const conditions: string[] = [];

  if (assetType !== "TROPTIONS") {
    conditions.push("Merchant credit route is optimized for TROPTIONS native token. Other asset types may be eligible only via structured barter arrangement.");
  }

  return {
    route: "MERCHANT_CREDIT",
    ...ROUTE_DESCRIPTIONS.MERCHANT_CREDIT,
    eligibility: conditions.length > 0 ? "CONDITIONAL" : "ELIGIBLE",
    blockedReasons,
    conditions,
    supportedAssets: ["TROPTIONS"],
    simulationOnly: true,
  };
}

function assessAave(assetType: XrplIouAssetType, readiness: IouReadinessResult): FundingRouteAssessment {
  const blockedReasons: string[] = [];
  const conditions: string[] = [];

  // Aave v3 pool only accepts specific collateral — hard rule
  const aaveAccepted: XrplIouAssetType[] = ["BTCREC", "USD"];
  if (!aaveAccepted.includes(assetType)) {
    blockedReasons.push(
      `Aave v3 does not accept "${assetType}" as collateral. Only wrapped BTC (WBTC/cbBTC), ETH, and approved stablecoins are in the Aave collateral registry. Raw alexandrite, gemstones, RWA packages, and carbon credits are NOT accepted.`
    );
  }
  if (assetType === "BTCREC") {
    blockedReasons.push("BTCREC is a TROPTIONS Gateway receipt — Aave requires native WBTC or cbBTC on Ethereum, not an XRPL IOU receipt. Wrapping strategy and bridge required.");
  }
  if (assetType === "USD") {
    conditions.push("USD IOU on XRPL is not directly depositable in Aave v3. Must be converted to USDC/USDT on Ethereum first. Bridge and swap required.");
  }
  if (readiness.blockedReasons.some((r) => r.includes("KYC"))) {
    conditions.push("Aave is permissionless on-chain, but KYC is required for TROPTIONS Gateway participation.");
  }

  const eligible: RouteEligibility = blockedReasons.length > 0 ? "BLOCKED" : conditions.length > 0 ? "CONDITIONAL" : "ELIGIBLE";

  return {
    route: "AAVE_ACCEPTED_COLLATERAL",
    ...ROUTE_DESCRIPTIONS.AAVE_ACCEPTED_COLLATERAL,
    eligibility: eligible,
    blockedReasons,
    conditions,
    supportedAssets: ["BTCREC", "USD"],
    simulationOnly: true,
  };
}

function assessXrplIouReceipt(_assetType: XrplIouAssetType, readiness: IouReadinessResult): FundingRouteAssessment {
  const blockedReasons: string[] = [];
  const conditions: string[] = [];

  if (readiness.blockedReasons.some((r) => r.includes("KYC"))) {
    blockedReasons.push("Issuer KYC/KYB must be completed before IOU issuance.");
  }
  if (readiness.blockedReasons.some((r) => r.includes("Legal"))) {
    blockedReasons.push("Legal opinion must be completed before IOU issuance.");
  }
  if (readiness.blockedReasons.some((r) => r.includes("Redemption"))) {
    blockedReasons.push("Redemption terms must be documented before IOU issuance.");
  }
  if (readiness.blockedReasons.some((r) => r.includes("Issuer Wallet"))) {
    blockedReasons.push("Issuer wallet policy (DefaultRipple, authorized trustline) must be documented.");
  }
  if (readiness.score < 50) {
    blockedReasons.push("IOU packet readiness score below 50% — complete package before advancing.");
  }
  if (readiness.score >= 50 && readiness.score < 80) {
    conditions.push("Preliminary IOU design may be shared with counterparties for review. Issuance gates remain.");
  }

  const eligible: RouteEligibility = blockedReasons.length > 0 ? "BLOCKED" : conditions.length > 0 ? "CONDITIONAL" : "ELIGIBLE";

  return {
    route: "XRPL_IOU_RECEIPT",
    ...ROUTE_DESCRIPTIONS.XRPL_IOU_RECEIPT,
    eligibility: eligible,
    blockedReasons,
    conditions,
    supportedAssets: ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"],
    simulationOnly: true,
  };
}

function assessAmm(_assetType: XrplIouAssetType, readiness: IouReadinessResult): FundingRouteAssessment {
  // AMM is always hard-blocked without full clearance
  const blockedReasons: string[] = [
    "AMM liquidity pool execution is hard-blocked until: (1) legal opinion approves public liquidity pool participation, (2) reserve proof is verified, (3) public disclosure document is published, and (4) board/admin approval is granted.",
  ];
  const conditions: string[] = [];

  if (readiness.score < 80) {
    blockedReasons.push("AMM requires ≥80% readiness score. Current score is insufficient.");
  }

  return {
    route: "AMM_AFTER_CLEARANCE",
    ...ROUTE_DESCRIPTIONS.AMM_AFTER_CLEARANCE,
    eligibility: "BLOCKED",
    blockedReasons,
    conditions,
    supportedAssets: ["BTCREC", "GOLD", "USD", "TROPTIONS"],
    simulationOnly: true,
  };
}

function assessServiceFee(_assetType: XrplIouAssetType, _readiness: IouReadinessResult): FundingRouteAssessment {
  return {
    route: "SERVICE_FEE_REVENUE",
    ...ROUTE_DESCRIPTIONS.SERVICE_FEE_REVENUE,
    eligibility: "ELIGIBLE",
    blockedReasons: [],
    conditions: [
      "Service fee agreements require individual engagement letters.",
      "Revenue from service fees does not depend on asset issuance or IOU readiness.",
    ],
    supportedAssets: ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"],
    simulationOnly: true,
  };
}

// ─── Core exported functions ──────────────────────────────────────────────────

export function recommendFundingRoutes(
  assetType: XrplIouAssetType,
  readiness: IouReadinessResult
): FundingRouteAssessment[] {
  return [
    assessPrivateLender(assetType, readiness),
    assessAssetBuyer(assetType, readiness),
    assessMerchantCredit(assetType, readiness),
    assessAave(assetType, readiness),
    assessXrplIouReceipt(assetType, readiness),
    assessAmm(assetType, readiness),
    assessServiceFee(assetType, readiness),
  ];
}

export function calculateFundingReadiness(
  assetType: XrplIouAssetType,
  readiness: IouReadinessResult
): FundingReadiness {
  const allRoutes = recommendFundingRoutes(assetType, readiness);
  const recommended = allRoutes.filter((r) => r.eligibility === "ELIGIBLE");
  const conditional = allRoutes.filter((r) => r.eligibility === "CONDITIONAL");
  const blocked     = allRoutes.filter((r) => r.eligibility === "BLOCKED");

  // Overall score = IOU score plus route bonus
  const routeBonus = recommended.length * 5 + conditional.length * 2;
  const overallScore = Math.min(100, readiness.score + routeBonus);
  const scoreLabel = overallScore >= 80 ? "Lender-Ready" : overallScore >= 50 ? "Reviewable" : overallScore >= 25 ? "Incomplete" : "Draft";

  const topBlocker = readiness.blockedReasons.length > 0 ? readiness.blockedReasons[0] : null;

  return {
    assetType,
    overallScore,
    scoreLabel,
    recommendedRoutes: recommended,
    blockedRoutes: blocked,
    conditionalRoutes: conditional,
    topBlocker,
    simulationOnly: true,
  };
}

export function generateUseOfProceedsPlan(
  assetType: XrplIouAssetType,
  estimatedProceeds: string
): UseOfProceedsPlan {
  const waterfall = [
    { rank: 1, category: "Taxes & statutory withholdings",          percentage: "5–10%",  description: "Mandatory government withholdings at applicable rate." },
    { rank: 2, category: "Third-party hard costs",                  percentage: "2–8%",   description: "Assay, appraisal, legal, and compliance fees." },
    { rank: 3, category: "Custody & vault fees",                    percentage: "1–3%",   description: "Ongoing and setup vault / custodian fees." },
    { rank: 4, category: "Insurance premiums",                      percentage: "0.5–2%", description: "Coverage for custody period and delivery." },
    { rank: 5, category: "Reserve account funding",                 percentage: "5–10%",  description: "Minimum reserve held by issuer/trustee." },
    { rank: 6, category: "Lender interest & principal repayment",   percentage: "varies", description: "Per term sheet." },
    { rank: 7, category: "Operator / sponsor administration fee",   percentage: "1–5%",   description: "TROPTIONS Gateway administration fee, per agreement." },
    { rank: 8, category: "Holder / participant distribution",       percentage: "remainder", description: "Conditional on counsel-approved distribution structure only." },
  ];

  const restrictions = [
    "No distribution to holders without legal / compliance sign-off.",
    "No proceeds used for non-disclosed purposes.",
    "Reserve account may not be released without lender consent.",
    "All distributions subject to jurisdiction-specific withholding.",
    "TROPTIONS does not guarantee any return, yield, or profit.",
  ];

  return {
    assetType,
    estimatedProceeds,
    waterfall,
    restrictions,
    simulationOnly: true,
  };
}

export function generateLenderPacketSummary(
  assetType: XrplIouAssetType,
  readiness: IouReadinessResult
): LenderPacketSummary {
  const headlines: Record<XrplIouAssetType, string> = {
    AXL001:    "2kg Alexandrite RWA — collateral-backed private lending opportunity",
    BTCREC:    "BTC Collateral Receipt — crypto-backed facility",
    GOLD:      "Gold Reserve Receipt — precious metals-backed facility",
    CARBON:    "Carbon Credit Portfolio — verified registry credits available for sale or credit facility",
    RWA:       "Real World Asset Package — structured collateral facility",
    USD:       "USD Stable IOU — reserve-backed cash equivalent facility",
    TROPTIONS: "TROPTIONS Native Receipt — platform-level merchant and trade credit",
  };

  const keyStrengths: string[] = [];
  const keyRisks: string[] = [];
  const missingItems: string[] = readiness.blockedReasons;

  if (readiness.score >= 60) keyStrengths.push("Package readiness score above 60% — preliminary lender review is viable.");
  if (assetType === "AXL001") {
    keyStrengths.push("Unique, scarce gemstone asset with third-party appraisal.");
    keyRisks.push("Limited secondary market liquidity for alexandrite.");
    keyRisks.push("Lender acceptance requires specialized gemstone expertise.");
  }
  if (assetType === "BTCREC") {
    keyStrengths.push("BTC has established DeFi and private lending market.");
    keyRisks.push("Receipt-based IOU requires wrapping strategy to access DeFi pools.");
  }
  if (assetType === "CARBON") {
    keyStrengths.push("Growing demand for verified carbon credits.");
    keyRisks.push("Market price volatility; registry/methodology risk.");
  }
  if (assetType === "USD") {
    keyRisks.push("USD IOU requires full 1:1 reserve proof and money transmission analysis.");
  }

  keyRisks.push("No live issuance, funding, or settlement is currently active.");
  keyRisks.push("All amounts and timelines are estimates only and subject to change.");

  const requiredDisclosures = [
    "TROPTIONS does not provide custody, exchange services, money transmission, investment advice, guaranteed financing, guaranteed liquidity, carbon offset guarantees, public token buybacks, or public LP execution.",
    "All execution requires legal, compliance, provider, custody, signer, and board approvals.",
    "This is a simulation-only readiness report. No live funding has occurred.",
    "Past performance of any underlying asset does not guarantee future results.",
  ];

  return {
    assetType,
    headline: headlines[assetType],
    keyStrengths,
    keyRisks,
    requiredDisclosures,
    missingItems,
    simulationOnly: true,
  };
}
