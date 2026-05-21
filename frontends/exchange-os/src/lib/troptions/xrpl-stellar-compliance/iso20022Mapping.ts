/**
 * ISO 20022 Message Compatibility Mapping
 *
 * Maps XRPL, Stellar, and x402 operations to their nearest ISO 20022
 * message-concept equivalents for integration gateway readiness.
 *
 * IMPORTANT DISCLAIMERS:
 * - XRPL and Stellar are NOT "ISO 20022 certified" blockchains
 * - This mapping provides READINESS language for integration gateways only
 * - Actual ISO 20022 financial institution integration requires:
 *   (a) jurisdiction-specific banking licenses
 *   (b) correspondent banking or payment institution agreements
 *   (c) legal review of message representation
 * - Do NOT claim "ISO 20022 coin", "ISO 20022 token", or "ISO 20022 certified"
 */

// ─── ISO 20022 Concept Alignment ──────────────────────────────────────────────

export type Iso20022MessageConcept =
  | "pacs.008"        // Credit Transfer (FI-to-FI customer credit transfer)
  | "pacs.009"        // Financial Institution Credit Transfer
  | "pacs.004"        // Payment Return
  | "pacs.002"        // Payment Status Report
  | "camt.052"        // Bank-to-Customer Account Report
  | "camt.053"        // Bank-to-Customer Statement
  | "camt.054"        // Bank-to-Customer Debit/Credit Notification
  | "camt.056"        // Financial Institution-to-Financial Institution Payment Cancellation Request
  | "pain.001"        // Customer Credit Transfer Initiation
  | "pain.002"        // Customer Payment Status Report
  | "pain.008"        // Customer Direct Debit Initiation
  | "seev.031"        // Debit/Credit Corporate Action (asset event)
  | "reda.001"        // Instrument Creation (for asset issuance concepts)
  | "colr.001"        // Collateral Management
  | "non_payment"     // Non-payment operation (no ISO 20022 payment equivalent)
  | "advisory_only";  // Conceptual alignment only, not a payment message

export type Iso20022ReadinessLevel =
  | "high_compatibility"      // Operation maps cleanly to ISO concept
  | "partial_compatibility"   // Operation partially maps; gap analysis required
  | "advisory_mapping"        // Conceptual similarity; not a payment equivalent
  | "no_payment_equivalent"   // Not a payment — no ISO 20022 payment mapping
  | "legal_review_required";  // Mapping requires legal/regulatory analysis

export interface Iso20022ActionMapping {
  readonly action: string;
  readonly chain: "XRPL" | "Stellar" | "x402" | "Stablecoin";
  readonly nearestIsoConcept: Iso20022MessageConcept;
  readonly readinessLevel: Iso20022ReadinessLevel;
  readonly gapNotes: string;
  readonly integrationNote: string;
  readonly prohibitedClaims: readonly string[];
}

// ─── XRPL Action Mappings ──────────────────────────────────────────────────────

const XRPL_ISO_MAPPINGS: readonly Iso20022ActionMapping[] = [
  {
    action: "XRPL_Payment",
    chain: "XRPL",
    nearestIsoConcept: "pacs.008",
    readinessLevel: "partial_compatibility",
    gapNotes: "XRPL Payment transactions carry sender/receiver addresses and amount. pacs.008 requires structured originator/beneficiary info, LEI, BIC/IBAN, and instructing agent fields not present in XRPL native format.",
    integrationNote: "Integration gateway would wrap XRPL Payment data into pacs.008 envelope with KYC-sourced party information. On-chain data alone is insufficient for ISO message.",
    prohibitedClaims: ["ISO 20022 payment", "ISO 20022 certified", "fully compliant ISO transfer"],
  },
  {
    action: "XRPL_IOU_Payment",
    chain: "XRPL",
    nearestIsoConcept: "pacs.008",
    readinessLevel: "partial_compatibility",
    gapNotes: "XRPL IOU payments move issued currency between accounts. Requires issuer identity, KYC data, and currency legitimacy verification to map to pacs.008.",
    integrationNote: "Integration gateway must resolve IOU issuer identity and inject off-chain KYC data for ISO envelope.",
    prohibitedClaims: ["ISO 20022 IOU", "ISO-certified IOU transfer"],
  },
  {
    action: "XRPL_TrustSet",
    chain: "XRPL",
    nearestIsoConcept: "non_payment",
    readinessLevel: "no_payment_equivalent",
    gapNotes: "TrustSet establishes or modifies trustline limits. This is an account management operation — not a payment or credit transfer.",
    integrationNote: "TrustSet maps to onboarding/account-control category. No ISO 20022 payment message equivalent.",
    prohibitedClaims: ["ISO 20022 trustline", "ISO payment trustline"],
  },
  {
    action: "XRPL_AccountSet",
    chain: "XRPL",
    nearestIsoConcept: "non_payment",
    readinessLevel: "no_payment_equivalent",
    gapNotes: "AccountSet modifies account flags (RequireAuth, Clawback, etc.). Account management operation — not a payment.",
    integrationNote: "AccountSet maps to account lifecycle management. No ISO 20022 payment message equivalent.",
    prohibitedClaims: ["ISO 20022 account setup"],
  },
  {
    action: "XRPL_OfferCreate",
    chain: "XRPL",
    nearestIsoConcept: "non_payment",
    readinessLevel: "advisory_mapping",
    gapNotes: "XRPL OfferCreate is a DEX trade order. Conceptually similar to an FX execution instruction but no direct ISO 20022 DEX equivalent. FX/trading messages are out of scope for core ISO 20022 payment flows.",
    integrationNote: "Trade execution concept. Not a payment transfer.",
    prohibitedClaims: ["ISO 20022 DEX trade", "ISO-compliant DEX order"],
  },
  {
    action: "XRPL_AMMDeposit",
    chain: "XRPL",
    nearestIsoConcept: "non_payment",
    readinessLevel: "no_payment_equivalent",
    gapNotes: "AMM deposit is a liquidity provision operation. Not a credit transfer. No ISO 20022 payment equivalent.",
    integrationNote: "AMM operations are not payments and have no ISO 20022 payment mapping.",
    prohibitedClaims: ["ISO 20022 liquidity provision", "ISO-certified AMM"],
  },
  {
    action: "XRPL_NFTokenMint",
    chain: "XRPL",
    nearestIsoConcept: "seev.031",
    readinessLevel: "advisory_mapping",
    gapNotes: "NFT minting is conceptually an asset creation event. seev.031 covers certain corporate actions on assets. This is a very loose advisory mapping — not a payment or settlement.",
    integrationNote: "NFT minting has no direct ISO 20022 payment equivalent. Advisory mapping only for asset event documentation purposes.",
    prohibitedClaims: ["ISO 20022 NFT", "ISO-certified NFT issuance"],
  },
  {
    action: "XRPL_Clawback",
    chain: "XRPL",
    nearestIsoConcept: "pacs.004",
    readinessLevel: "advisory_mapping",
    gapNotes: "Clawback forcibly recovers issued IOU tokens from a holder. Conceptually adjacent to a payment return but initiated by issuer unilaterally. pacs.004 is a bilateral payment return. Significant legal and process gap.",
    integrationNote: "Clawback exercise requires legal counsel opinion and regulatory approval before use.",
    prohibitedClaims: ["ISO 20022 clawback payment"],
  },
  {
    action: "XRPL_EscrowCreate",
    chain: "XRPL",
    nearestIsoConcept: "colr.001",
    readinessLevel: "advisory_mapping",
    gapNotes: "XRPL Escrow locks funds with time or condition release. Conceptually adjacent to collateral management but no direct ISO 20022 escrow message.",
    integrationNote: "Escrow operations require legal documentation of conditions and release triggers.",
    prohibitedClaims: ["ISO 20022 escrow"],
  },
] as const;

// ─── Stellar Action Mappings ────────────────────────────────────────────────────

const STELLAR_ISO_MAPPINGS: readonly Iso20022ActionMapping[] = [
  {
    action: "Stellar_Payment",
    chain: "Stellar",
    nearestIsoConcept: "pacs.008",
    readinessLevel: "partial_compatibility",
    gapNotes: "Stellar Payment carries source/destination addresses and asset/amount. Like XRPL, pacs.008 requires structured KYC-sourced party information, LEI, BIC/IBAN not present in native Stellar transaction.",
    integrationNote: "Integration gateway wraps Stellar Payment data with off-chain KYC party information for ISO envelope.",
    prohibitedClaims: ["ISO 20022 Stellar payment", "ISO-certified Stellar transfer"],
  },
  {
    action: "Stellar_PathPayment",
    chain: "Stellar",
    nearestIsoConcept: "pacs.008",
    readinessLevel: "partial_compatibility",
    gapNotes: "Stellar path payment involves FX conversion across intermediate assets. pacs.008 supports single-currency transfers. FX path requires additional documentation of conversion rates and intermediate assets.",
    integrationNote: "Path payment FX conversion requires explicit disclosure of conversion rates and intermediate assets to counterparty.",
    prohibitedClaims: ["ISO 20022 path payment", "ISO-certified FX conversion"],
  },
  {
    action: "Stellar_ChangeTrust",
    chain: "Stellar",
    nearestIsoConcept: "non_payment",
    readinessLevel: "no_payment_equivalent",
    gapNotes: "ChangeTrust establishes or removes a trustline to an asset. Account management operation — not a payment.",
    integrationNote: "ChangeTrust is account lifecycle management. Templates are unsigned only.",
    prohibitedClaims: ["ISO 20022 Stellar trustline"],
  },
  {
    action: "Stellar_ManageOffer",
    chain: "Stellar",
    nearestIsoConcept: "non_payment",
    readinessLevel: "advisory_mapping",
    gapNotes: "Stellar ManageOffer is a DEX order. No direct ISO 20022 DEX equivalent in payment flows.",
    integrationNote: "Trade execution concept. Not a payment transfer.",
    prohibitedClaims: ["ISO 20022 Stellar DEX order"],
  },
  {
    action: "Stellar_CreateAccount",
    chain: "Stellar",
    nearestIsoConcept: "non_payment",
    readinessLevel: "no_payment_equivalent",
    gapNotes: "CreateAccount establishes a new Stellar account. Account management operation.",
    integrationNote: "Account creation is lifecycle management. Requires KYC before institutional use.",
    prohibitedClaims: ["ISO 20022 account creation"],
  },
  {
    action: "Stellar_LiquidityPoolDeposit",
    chain: "Stellar",
    nearestIsoConcept: "non_payment",
    readinessLevel: "no_payment_equivalent",
    gapNotes: "Liquidity pool deposit is not a payment operation.",
    integrationNote: "LP operations have no ISO 20022 payment equivalent.",
    prohibitedClaims: ["ISO 20022 liquidity pool"],
  },
] as const;

// ─── x402 / Stablecoin Mappings ────────────────────────────────────────────────

const X402_ISO_MAPPINGS: readonly Iso20022ActionMapping[] = [
  {
    action: "x402_UsageCharge",
    chain: "x402",
    nearestIsoConcept: "pain.001",
    readinessLevel: "advisory_mapping",
    gapNotes: "x402 usage charge is a machine-readable API usage payment instruction. Conceptually adjacent to Customer Credit Transfer Initiation (pain.001) for small-value automated payments. Significant gap: x402 is HTTP protocol-native, not ISO message-native.",
    integrationNote: "x402 usage charges could be wrapped in pain.001 envelope for institutional billing reconciliation. Not a native ISO 20022 payment.",
    prohibitedClaims: ["ISO 20022 x402 payment", "ISO-certified API micropayment"],
  },
  {
    action: "Stablecoin_Issuance",
    chain: "Stablecoin",
    nearestIsoConcept: "reda.001",
    readinessLevel: "advisory_mapping",
    gapNotes: "Stablecoin issuance is asset creation. Conceptually adjacent to instrument creation/reference data concepts. Not a payment operation.",
    integrationNote: "Stablecoin issuance is NOT a payment transfer. Requires full GENIUS Act / MiCA compliance framework before any live issuance.",
    prohibitedClaims: ["ISO 20022 stablecoin", "ISO-certified stablecoin issuance"],
  },
  {
    action: "Stablecoin_Redemption",
    chain: "Stablecoin",
    nearestIsoConcept: "pacs.004",
    readinessLevel: "legal_review_required",
    gapNotes: "Stablecoin redemption at par is conceptually adjacent to a payment return. Requires established redemption policy, at-par guarantee, and legal documentation of redemption obligations.",
    integrationNote: "Redemption policy must be legally documented and approved before mapping to ISO message context.",
    prohibitedClaims: ["ISO 20022 redemption", "ISO-guaranteed redemption"],
  },
] as const;

// ─── Combined Registry ──────────────────────────────────────────────────────────

export const ISO_20022_ACTION_MAPPINGS: readonly Iso20022ActionMapping[] = [
  ...XRPL_ISO_MAPPINGS,
  ...STELLAR_ISO_MAPPINGS,
  ...X402_ISO_MAPPINGS,
] as const;

// ─── Readiness Report ──────────────────────────────────────────────────────────

export interface Iso20022ReadinessReport {
  readonly reportType: "iso_20022_message_compatibility_readiness";
  readonly generatedAt: string;
  readonly disclaimer: string;
  readonly prohibitedClaims: readonly string[];
  readonly highCompatibilityCount: number;
  readonly partialCompatibilityCount: number;
  readonly advisoryMappingCount: number;
  readonly noPaymentEquivalentCount: number;
  readonly legalReviewRequiredCount: number;
  readonly mappings: readonly Iso20022ActionMapping[];
}

export function createIso20022ReadinessReport(): Iso20022ReadinessReport {
  const mappings = ISO_20022_ACTION_MAPPINGS;

  return {
    reportType: "iso_20022_message_compatibility_readiness",
    generatedAt: new Date().toISOString(),
    disclaimer:
      "This report evaluates ISO 20022 message compatibility readiness only. " +
      "XRPL and Stellar are NOT ISO 20022 certified blockchains. " +
      "Actual ISO 20022 financial institution integration requires jurisdiction-specific licensing, " +
      "correspondent banking agreements, and legal review of message representations. " +
      "No operation described herein constitutes a live ISO 20022 message transmission. " +
      "Legal review is required before any live institutional integration.",
    prohibitedClaims: [
      "ISO 20022 certified",
      "ISO 20022 compliant token",
      "ISO 20022 stablecoin",
      "ISO 20022 coin",
      "ISO-certified XRPL",
      "ISO-certified Stellar",
      "ISO 20022 guaranteed payment",
      "fully ISO 20022 compliant",
    ],
    highCompatibilityCount: mappings.filter((m) => m.readinessLevel === "high_compatibility").length,
    partialCompatibilityCount: mappings.filter((m) => m.readinessLevel === "partial_compatibility").length,
    advisoryMappingCount: mappings.filter((m) => m.readinessLevel === "advisory_mapping").length,
    noPaymentEquivalentCount: mappings.filter((m) => m.readinessLevel === "no_payment_equivalent").length,
    legalReviewRequiredCount: mappings.filter((m) => m.readinessLevel === "legal_review_required").length,
    mappings,
  };
}

// ─── Accessors ─────────────────────────────────────────────────────────────────

export function mapXrplActionToIso20022Concept(action: string): Iso20022ActionMapping | undefined {
  return XRPL_ISO_MAPPINGS.find((m) => m.action === action);
}

export function mapStellarActionToIso20022Concept(action: string): Iso20022ActionMapping | undefined {
  return STELLAR_ISO_MAPPINGS.find((m) => m.action === action);
}

export function mapX402ActionToIso20022Concept(action: string): Iso20022ActionMapping | undefined {
  return X402_ISO_MAPPINGS.find((m) => m.action === action);
}
