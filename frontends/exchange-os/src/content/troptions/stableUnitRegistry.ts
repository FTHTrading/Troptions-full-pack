/**
 * Troptions Stable Unit Registry
 * Defines every stable unit and settlement rail used in the Troptions ecosystem.
 *
 * RULES:
 * - Internal Troptions units are closed-loop accounting units unless counsel approves otherwise.
 * - Public Troptions stablecoins cannot be marked live unless licensingStatus = "approved".
 * - Existing third-party stablecoins are settlement rails, not Troptions-issued money.
 * - No public redemption promise unless legally approved, reserved, audited, and licensed.
 */

export type StableUnitType =
  | "troptions-internal-unit"
  | "third-party-stablecoin"
  | "settlement-rail"
  | "bridge-token";

export type LaunchStatus =
  | "live-third-party"
  | "evaluation"
  | "pending-license"
  | "approved"
  | "not-launched";

export interface StableUnit {
  id: string;
  name: string;
  type: StableUnitType;
  issuer: string;
  chain: string[];
  useCase: string;
  reserveRequirement: string;
  redemptionRequirement: string;
  custodyRequirement: string;
  complianceRequirement: string;
  legalStatus: string;
  licensingStatus: string;
  launchStatus: LaunchStatus;
  riskNotes: string;
  prohibitedClaims: string[];
}

export const STABLE_UNIT_REGISTRY: StableUnit[] = [
  // ─── Internal Troptions Units ──────────────────────────────────────────────
  {
    id: "SU-TROP-USD-001",
    name: "Troptions USD Internal Unit",
    type: "troptions-internal-unit",
    issuer: "Troptions (internal)",
    chain: ["internal-ledger"],
    useCase: "Closed-loop accounting unit for internal transaction settlement and value tracking within the Troptions platform.",
    reserveRequirement: "1:1 USD reserve required before any external representation. Reserve must be verified, audited, and custodied with a qualified custodian.",
    redemptionRequirement: "Redemption policy requires legal counsel approval, reserve verification, and licensing review before any public redemption promise.",
    custodyRequirement: "USD reserves must be held at a qualified custodian or FDIC-insured bank account. Custody agreement required.",
    complianceRequirement: "KYC/AML, sanctions screening, and jurisdiction review required for all participants.",
    legalStatus: "evaluation — requires money-transmission, stablecoin, and licensing analysis",
    licensingStatus: "not-approved",
    launchStatus: "evaluation",
    riskNotes: "Cannot be represented publicly as a stablecoin, currency, or money substitute until licensed. Internal use only as an accounting unit until legal review is complete.",
    prohibitedClaims: [
      "redeemable for USD",
      "1:1 backed",
      "stablecoin",
      "guaranteed value",
      "risk-free",
    ],
  },
  {
    id: "SU-TROP-GOLD-001",
    name: "Troptions Gold Internal Unit",
    type: "troptions-internal-unit",
    issuer: "Troptions (internal)",
    chain: ["internal-ledger"],
    useCase: "Closed-loop accounting unit representing gold-value positions within the Troptions platform. Not a gold certificate or warehouse receipt unless legally structured as such.",
    reserveRequirement: "Physical gold reserve required. Reserve must be held at a qualified custodian (Brink's, Citadel, or equivalent). Vault receipt and assay certificate required.",
    redemptionRequirement: "Physical gold redemption requires custody agreement, logistics policy, legal opinion, and board approval. No public redemption promise without these.",
    custodyRequirement: "Physical gold at qualified vault custodian. Chain of custody documented.",
    complianceRequirement: "KYC/AML, CFTC review for commodity aspects, securities review for investment aspects.",
    legalStatus: "evaluation — commodity, securities, and warehouse-receipt analysis required",
    licensingStatus: "not-approved",
    launchStatus: "evaluation",
    riskNotes: "Gold-backed claims require custody proof, reserve schedule, assay certificates, and legal opinion before institutional use.",
    prohibitedClaims: [
      "liquid gold token",
      "redeemable for physical gold without legal structure",
      "balance sheet enhancement",
      "guaranteed gold value",
    ],
  },
  {
    id: "SU-TROP-TREASURY-001",
    name: "Troptions Treasury Internal Unit",
    type: "troptions-internal-unit",
    issuer: "Troptions Treasury",
    chain: ["internal-ledger"],
    useCase: "Internal unit representing participation in Troptions treasury operations. Not a money market fund, T-bill, or guaranteed-yield instrument.",
    reserveRequirement: "Treasury asset backing (T-bills, money market) required. Custody and advisor approval required.",
    redemptionRequirement: "No public redemption promise. Redemption policy subject to legal, advisory, and board approval.",
    custodyRequirement: "Treasury assets at qualified custodian or registered advisor-managed account.",
    complianceRequirement: "Investment adviser review, SEC/CFTC analysis depending on structure.",
    legalStatus: "evaluation — investment adviser and securities analysis required",
    licensingStatus: "not-approved",
    launchStatus: "evaluation",
    riskNotes: "Cannot be represented as a yield product, money market, or guaranteed return without licensed investment adviser and legal structure.",
    prohibitedClaims: [
      "guaranteed yield",
      "risk-free treasury",
      "money market equivalent",
    ],
  },
  {
    id: "SU-TROP-SETTLE-001",
    name: "Troptions Settlement Unit",
    type: "troptions-internal-unit",
    issuer: "Troptions Settlement",
    chain: ["internal-ledger", "Stellar", "XRPL"],
    useCase: "Internal settlement unit for delivery-versus-payment workflows. Not a publicly issued stablecoin.",
    reserveRequirement: "Backed by escrowed USDC or bank wire receipts at settlement.",
    redemptionRequirement: "Redeemed only upon successful settlement confirmation. No open redemption window.",
    custodyRequirement: "Escrow at qualified custodian or bank. Settlement receipt required.",
    complianceRequirement: "KYC/AML, sanctions screening for all settlement parties.",
    legalStatus: "evaluation",
    licensingStatus: "not-approved",
    launchStatus: "evaluation",
    riskNotes: "Settlement unit is closed-loop. Cannot be publicly traded or represented as money.",
    prohibitedClaims: ["publicly tradeable", "redeemable by anyone", "stablecoin"],
  },

  // ─── Third-Party Settlement Rails ─────────────────────────────────────────
  {
    id: "SU-USDC-001",
    name: "USD Coin (USDC)",
    type: "third-party-stablecoin",
    issuer: "Circle Internet Financial",
    chain: ["Ethereum", "Solana", "Base", "Arbitrum", "XRPL"],
    useCase: "Primary settlement rail for Troptions platform. USDC is a Circle-issued stablecoin — Troptions uses it as a settlement rail, not as a Troptions-issued product.",
    reserveRequirement: "Managed by Circle. Reserve attestations published by Circle monthly.",
    redemptionRequirement: "Redemption is Circle's obligation, not Troptions'.",
    custodyRequirement: "USDC held in qualified custody via Fireblocks, Anchorage, or bank escrow.",
    complianceRequirement: "Circle's compliance program applies. Troptions adds KYC/AML layer.",
    legalStatus: "Circle-regulated product. Troptions is a user, not issuer.",
    licensingStatus: "live-third-party",
    launchStatus: "live-third-party",
    riskNotes: "Troptions does not issue, back, or guarantee USDC. Circle's regulatory risk applies.",
    prohibitedClaims: ["Troptions-issued USDC", "Troptions backs USDC"],
  },
  {
    id: "SU-EURC-001",
    name: "EUR Coin (EURC)",
    type: "third-party-stablecoin",
    issuer: "Circle Internet Financial",
    chain: ["Ethereum", "Solana"],
    useCase: "Euro-denominated settlement rail for Troptions European operations.",
    reserveRequirement: "Managed by Circle.",
    redemptionRequirement: "Circle's obligation.",
    custodyRequirement: "Qualified custody.",
    complianceRequirement: "Circle compliance + Troptions KYC/AML.",
    legalStatus: "Circle-regulated. Troptions is user.",
    licensingStatus: "live-third-party",
    launchStatus: "live-third-party",
    riskNotes: "EURC availability subject to MiCA and EU regulatory requirements.",
    prohibitedClaims: ["Troptions-issued EURC"],
  },
  {
    id: "SU-PYUSD-001",
    name: "PayPal USD (PYUSD)",
    type: "third-party-stablecoin",
    issuer: "PayPal / Paxos",
    chain: ["Ethereum", "Solana"],
    useCase: "Consumer-friendly settlement rail option within Troptions workflows.",
    reserveRequirement: "Managed by Paxos.",
    redemptionRequirement: "Paxos/PayPal obligation.",
    custodyRequirement: "Qualified custody.",
    complianceRequirement: "Paxos compliance + Troptions KYC/AML.",
    legalStatus: "Paxos-regulated. Troptions is user.",
    licensingStatus: "live-third-party",
    launchStatus: "live-third-party",
    riskNotes: "PYUSD is subject to Paxos/NYDFS regulatory framework.",
    prohibitedClaims: ["Troptions-issued PYUSD"],
  },
  {
    id: "SU-RLUSD-001",
    name: "Ripple USD (RLUSD)",
    type: "third-party-stablecoin",
    issuer: "Ripple Labs",
    chain: ["XRPL", "Ethereum"],
    useCase: "XRPL-native settlement rail for Troptions XRPL operations.",
    reserveRequirement: "Managed by Ripple.",
    redemptionRequirement: "Ripple obligation.",
    custodyRequirement: "Qualified custody.",
    complianceRequirement: "Ripple compliance + Troptions KYC/AML.",
    legalStatus: "Ripple-regulated. Subject to ongoing regulatory landscape.",
    licensingStatus: "live-third-party",
    launchStatus: "live-third-party",
    riskNotes: "RLUSD subject to Ripple's regulatory status and XRPL ecosystem risks.",
    prohibitedClaims: ["Troptions-issued RLUSD"],
  },
  {
    id: "SU-USDT-001",
    name: "Tether (USDT)",
    type: "third-party-stablecoin",
    issuer: "Tether Limited",
    chain: ["Ethereum", "Tron", "Solana"],
    useCase: "Settlement rail option. Use subject to Troptions compliance review of Tether's reserve attestations.",
    reserveRequirement: "Tether-managed. Troptions compliance team should review reserve attestations.",
    redemptionRequirement: "Tether obligation.",
    custodyRequirement: "Qualified custody.",
    complianceRequirement: "Tether compliance + Troptions KYC/AML.",
    legalStatus: "Tether-managed. Regulatory status varies by jurisdiction.",
    licensingStatus: "live-third-party",
    launchStatus: "live-third-party",
    riskNotes: "Tether reserve transparency has been subject to regulatory scrutiny. Compliance team should assess before institutional use.",
    prohibitedClaims: ["Troptions-issued USDT", "Troptions guarantees USDT reserves"],
  },
  {
    id: "SU-DAI-001",
    name: "Dai (DAI)",
    type: "third-party-stablecoin",
    issuer: "MakerDAO",
    chain: ["Ethereum", "Arbitrum", "Optimism", "Polygon"],
    useCase: "Decentralized stablecoin settlement rail option.",
    reserveRequirement: "Overcollateralized by MakerDAO protocol.",
    redemptionRequirement: "MakerDAO protocol obligation.",
    custodyRequirement: "Qualified custody or smart contract escrow.",
    complianceRequirement: "Troptions KYC/AML. DeFi protocol risk assessment required.",
    legalStatus: "Decentralized. Regulatory classification evolving.",
    licensingStatus: "live-third-party",
    launchStatus: "live-third-party",
    riskNotes: "DeFi protocol risk. Smart contract risk. Regulatory classification pending clarity.",
    prohibitedClaims: ["Troptions-issued DAI", "Troptions guarantees DAI"],
  },
];

/** Runtime issuance guard for Troptions-issued stable units */
export function assertStableUnitCanLaunch(unit: StableUnit): void {
  if (unit.type === "troptions-internal-unit" && unit.licensingStatus !== "approved") {
    throw new Error(
      `[StableUnitGuard] "${unit.name}" cannot be launched publicly. licensingStatus must be "approved". Current: "${unit.licensingStatus}".`,
    );
  }
}

export function getStableUnitsByType(type: StableUnitType): StableUnit[] {
  return STABLE_UNIT_REGISTRY.filter((u) => u.type === type);
}
