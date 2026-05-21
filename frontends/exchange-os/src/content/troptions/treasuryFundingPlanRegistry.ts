/**
 * Treasury Funding Plan Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-world funding manifest sized to the **available exchange balance**:
 *
 *     • 11 XRP   →  3 XRPL wallets (multi-role consolidation)
 *     • 31 XLM   →  3 Stellar wallets (multi-role consolidation)
 *
 * Each wallet is funded with enough native asset to cover:
 *   - The base account reserve  (XRPL: 1 XRP, Stellar: 1 XLM)
 *   - Per-trustline / sub-entry reserve
 *       (XRPL: 0.2 XRP per trustline, Stellar: 0.5 XLM per trustline)
 *   - A 30 % operational buffer for fees and reserve increments
 *
 * STABLECOIN TRUSTLINES included on this plan are limited to **reputable,
 * regulated, audited issuers** with public reserve attestations.
 *
 *   • USDC  — Circle (Stellar issuer GA5Z…KZVN, attested monthly)
 *   • RLUSD — Ripple USD (XRPL native stablecoin, NYDFS-regulated)
 *   • USD.b — Bitstamp USD (XRPL legacy gateway, MiCA-licensed)
 *   • USD.g — Gatehub USD (XRPL gateway, EU e-money licensed)
 *   • USDT  — Tether (only on Stellar B-rail; deferred — Tether has not yet
 *                     issued a Stellar version, kept here for routing config only)
 *
 * COMPLIANCE FLAGS APPLIED on issuer accounts:
 *   - XRPL:    asfDefaultRipple = false, asfRequireAuth = optional
 *              asfDisallowXRP = false (must accept XRP for trades)
 *   - Stellar: AUTH_REQUIRED + AUTH_REVOCABLE on issuer
 *              AUTH_CLAWBACK_ENABLED for jurisdictional unwind
 */

export type FundingChain = "xrpl" | "stellar";

export type StablecoinIssuerKey =
  | "circle-usdc-stellar"
  | "ripple-rlusd-xrpl"
  | "bitstamp-usd-xrpl"
  | "gatehub-usd-xrpl"
  | "tether-usdt-stellar-deferred";

export interface StablecoinIssuerInfo {
  readonly key: StablecoinIssuerKey;
  readonly displayName: string;
  readonly issuerName: string;
  readonly assetCode: string;
  readonly chain: FundingChain;
  /** On-chain issuer address. Empty when the chain version doesn't exist yet. */
  readonly issuerAddress: string;
  readonly regulator: string;
  readonly attestationUrl: string;
  /** Brand color for badge rendering. */
  readonly color: string;
  readonly notes: string;
}

export const STABLECOIN_ISSUERS: Record<StablecoinIssuerKey, StablecoinIssuerInfo> = {
  "circle-usdc-stellar": {
    key: "circle-usdc-stellar",
    displayName: "USDC",
    issuerName: "Circle",
    assetCode: "USDC",
    chain: "stellar",
    issuerAddress: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    regulator: "FinCEN MSB · NYDFS BitLicense · monthly Grant Thornton attestations",
    attestationUrl: "https://www.circle.com/transparency",
    color: "#2775CA",
    notes: "Native Stellar USDC issued by Circle. Default institutional route.",
  },
  "ripple-rlusd-xrpl": {
    key: "ripple-rlusd-xrpl",
    displayName: "RLUSD",
    issuerName: "Ripple Labs (Standard Custody)",
    assetCode: "524C555344000000000000000000000000000000",
    chain: "xrpl",
    issuerAddress: "rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De",
    regulator: "NYDFS (Standard Custody & Trust Company)",
    attestationUrl: "https://ripple.com/rlusd",
    color: "#0085FF",
    notes: "Ripple USD — XRPL-native stablecoin. NYDFS-regulated reserves.",
  },
  "bitstamp-usd-xrpl": {
    key: "bitstamp-usd-xrpl",
    displayName: "USD (Bitstamp)",
    issuerName: "Bitstamp",
    assetCode: "USD",
    chain: "xrpl",
    issuerAddress: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
    regulator: "MiCA-licensed CASP (Luxembourg) · NYDFS BitLicense",
    attestationUrl: "https://www.bitstamp.net/legal/",
    color: "#3F8B3D",
    notes: "Legacy XRPL USD gateway. Highly liquid against XRP and TROPTIONS.",
  },
  "gatehub-usd-xrpl": {
    key: "gatehub-usd-xrpl",
    displayName: "USD (Gatehub)",
    issuerName: "Gatehub",
    assetCode: "USD",
    chain: "xrpl",
    issuerAddress: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
    regulator: "EU e-money licensed (Slovenia)",
    attestationUrl: "https://gatehub.net/markets",
    color: "#1D5FFF",
    notes: "Original XRPL fiat gateway. Long-running USD/EUR/GBP issuer.",
  },
  "tether-usdt-stellar-deferred": {
    key: "tether-usdt-stellar-deferred",
    displayName: "USDT (deferred)",
    issuerName: "Tether",
    assetCode: "USDT",
    chain: "stellar",
    issuerAddress: "",
    regulator: "El Salvador (Stablecoin Issuer license, 2024)",
    attestationUrl: "https://tether.to/transparency",
    color: "#26A17B",
    notes:
      "Tether has not issued a native Stellar USDT. Trustline added to topology config only; do not establish until issuance is announced.",
  },
};

export type FundingRoleTag =
  | "iou-issuer"
  | "nft-issuer"
  | "mpt-issuer"
  | "distributor"
  | "dex-maker"
  | "amm-lp"
  | "treasury-reserve"
  | "anchor"
  | "ops-fee";

export interface TrustlineSpec {
  readonly issuer: StablecoinIssuerKey | "troptions-self";
  readonly limit: string;
  readonly purpose: string;
}

export interface ComplianceFlag {
  readonly key: string;
  readonly displayLabel: string;
  readonly required: boolean;
  readonly note: string;
}

export interface FundingWalletPlan {
  readonly walletId: string;
  readonly chain: FundingChain;
  readonly displayName: string;
  readonly address: string;
  readonly seedEnvVar: string;
  readonly roleTags: readonly FundingRoleTag[];
  /** Combined topology roleIds this wallet covers. */
  readonly coversTopologyRoles: readonly string[];
  /** Native funding amount in whole units (XRP or XLM). */
  readonly nativeFundingAmount: string;
  /** Reserve breakdown explanation. */
  readonly reserveBreakdown: string;
  readonly trustlines: readonly TrustlineSpec[];
  readonly complianceFlags: readonly ComplianceFlag[];
  readonly notes: string;
}

// ─── XRPL Plan — total 11 XRP across 3 wallets ────────────────────────────────

const XRPL_PLAN: readonly FundingWalletPlan[] = [
  {
    walletId: "xrpl-a-issuer-nft-mpt",
    chain: "xrpl",
    displayName: "XRPL Wallet A — Issuer + NFT + MPT (combined cold)",
    address: "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
    seedEnvVar: "XRPL_ISSUER_SEED",
    roleTags: ["iou-issuer", "nft-issuer", "mpt-issuer"],
    coversTopologyRoles: [
      "xrpl-troptions-issuer",
      "xrpl-nft-issuer",
      "xrpl-mpt-issuer",
    ],
    nativeFundingAmount: "3",
    reserveBreakdown:
      "1 XRP base reserve + 0 trustlines (issuers do not hold trustlines to themselves) + 2 XRP buffer for NFTokenMint and MPTokenIssuanceCreate reserve increments and fees.",
    trustlines: [], // issuers do not hold trustlines
    complianceFlags: [
      { key: "asfDefaultRipple", displayLabel: "DefaultRipple = ON", required: true, note: "Required so TROPTIONS holders can transfer between each other." },
      { key: "asfRequireAuth", displayLabel: "RequireAuth (optional)", required: false, note: "Enable if KYC-gating trustlines is desired." },
      { key: "asfDisallowXRP", displayLabel: "DisallowXRP = OFF", required: true, note: "Must remain off so issuer can pay reserves." },
      { key: "asfDepositAuth", displayLabel: "DepositAuth (optional)", required: false, note: "Enable to require pre-auth before receiving incoming payments." },
    ],
    notes:
      "Single cold wallet plays three issuer roles. After funding, run setIssuerAccount() to apply the AccountSet flags above, then NFTokenMint and MPTIssuanceCreate as needed.",
  },
  {
    walletId: "xrpl-b-distributor-dex-amm",
    chain: "xrpl",
    displayName: "XRPL Wallet B — Distributor + DEX Maker + AMM LP (warm)",
    address: "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
    seedEnvVar: "XRPL_DISTRIBUTOR_SEED",
    roleTags: ["distributor", "dex-maker", "amm-lp"],
    coversTopologyRoles: [
      "xrpl-troptions-distributor",
      "xrpl-dex-maker",
      "xrpl-amm-lp",
    ],
    nativeFundingAmount: "5",
    reserveBreakdown:
      "1 XRP base + 4 trustlines × 0.2 XRP = 0.8 XRP reserves + 3.2 XRP buffer for AMM deposits, OfferCreate fees, and DEX margin.",
    trustlines: [
      { issuer: "troptions-self", limit: "1000000000", purpose: "Hold issued TROPTIONS supply for distribution" },
      { issuer: "ripple-rlusd-xrpl", limit: "10000000", purpose: "Settle TROPTIONS/RLUSD pairs and route fiat in/out" },
      { issuer: "bitstamp-usd-xrpl", limit: "10000000", purpose: "Bitstamp gateway USD for legacy XRPL liquidity" },
      { issuer: "gatehub-usd-xrpl", limit: "5000000", purpose: "Gatehub USD as secondary fiat rail" },
    ],
    complianceFlags: [
      { key: "asfDisallowXRP", displayLabel: "DisallowXRP = OFF", required: true, note: "Must accept XRP for DEX matches." },
      { key: "asfRequireDest", displayLabel: "RequireDestTag (optional)", required: false, note: "Enable if exchange-style deposit memos are required." },
    ],
    notes:
      "Operational wallet — holds the issued TROPTIONS supply, places DEX offers, and provides AMM liquidity. Quarterly key rotation recommended.",
  },
  {
    walletId: "xrpl-c-treasury",
    chain: "xrpl",
    displayName: "XRPL Wallet C — Cold Treasury Reserve",
    address: "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3",
    seedEnvVar: "XRPL_TREASURY_SEED",
    roleTags: ["treasury-reserve"],
    coversTopologyRoles: ["xrpl-troptions-treasury"],
    nativeFundingAmount: "2.99",
    reserveBreakdown:
      "Source wallet — currently holds 10.99999 XRP. After sending 3 XRP to Wallet A and 5 XRP to Wallet B (plus minimal tx fees), retains ~2.99 XRP: 1 XRP base reserve + 0.4 XRP for 2 trustlines + ~1.59 XRP buffer.",
    trustlines: [
      { issuer: "troptions-self", limit: "100000000", purpose: "Hold long-term TROPTIONS reserve" },
      { issuer: "ripple-rlusd-xrpl", limit: "1000000", purpose: "Cold-store regulated dollar reserve" },
    ],
    complianceFlags: [
      { key: "asfDepositAuth", displayLabel: "DepositAuth = ON", required: true, note: "Cold treasury accepts only pre-authorized deposits." },
      { key: "asfDisableMaster", displayLabel: "DisableMaster (after multisig setup)", required: false, note: "Disable master key only after SignerListSet is applied for multisig." },
    ],
    notes:
      "Pre-existing treasury wallet. Verify on-chain status with getXrplAccountLive before sending any funds to avoid duplicate activation. Long-term goal: convert to 3-of-N multisig.",
  },
];

// ─── Stellar Plan — total 31 XLM across 3 wallets ─────────────────────────────

const STELLAR_PLAN: readonly FundingWalletPlan[] = [
  {
    walletId: "stellar-a-issuer",
    chain: "stellar",
    displayName: "Stellar Wallet A — TROPTIONS Issuer (cold)",
    address: "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    seedEnvVar: "STELLAR_ISSUER_SECRET",
    roleTags: ["iou-issuer"],
    coversTopologyRoles: ["stellar-troptions-issuer"],
    nativeFundingAmount: "5",
    reserveBreakdown:
      "1 XLM base reserve + 1 XLM for SetOptions (home_domain + signer config) + 3 XLM buffer.",
    trustlines: [], // issuers do not hold trustlines to themselves
    complianceFlags: [
      { key: "AUTH_REQUIRED", displayLabel: "AUTH_REQUIRED", required: true, note: "Holders must be explicitly authorized by the issuer (KYC gate)." },
      { key: "AUTH_REVOCABLE", displayLabel: "AUTH_REVOCABLE", required: true, note: "Issuer can revoke authorization for sanctioned addresses." },
      { key: "AUTH_CLAWBACK_ENABLED", displayLabel: "AUTH_CLAWBACK_ENABLED", required: true, note: "Allows ClawbackOp for compliance reversals; per CAP-35." },
      { key: "home_domain", displayLabel: "home_domain = troptions.unykorn.org", required: true, note: "Required for stellar.toml asset metadata discovery." },
    ],
    notes:
      "Cold-storage issuer. Apply flags via configureStellarIssuer() once funded, then payment_op to mint TROPTIONS into the distributor.",
  },
  {
    walletId: "stellar-b-distributor-lp",
    chain: "stellar",
    displayName: "Stellar Wallet B — Distributor + LP Manager (warm)",
    address: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
    seedEnvVar: "STELLAR_DISTRIBUTOR_SECRET",
    roleTags: ["distributor", "amm-lp"],
    coversTopologyRoles: [
      "stellar-troptions-distributor",
      "stellar-troptions-lp",
    ],
    nativeFundingAmount: "15",
    reserveBreakdown:
      "1 XLM base + 4 trustlines × 0.5 XLM = 2 XLM reserves + 2 LP positions × 0.5 XLM = 1 XLM + 11 XLM operational buffer for ManageBuyOffer / ManageSellOffer / LiquidityPoolDeposit fees.",
    trustlines: [
      { issuer: "troptions-self", limit: "1000000000", purpose: "Hold issued TROPTIONS supply for distribution" },
      { issuer: "circle-usdc-stellar", limit: "10000000", purpose: "Native USDC for TROPTIONS/USDC pair and primary fiat rail" },
      // pool-share trustlines for AMM positions
      { issuer: "troptions-self", limit: "0", purpose: "AMM pool-share trustline for TROPTIONS/XLM pool" },
      { issuer: "circle-usdc-stellar", limit: "0", purpose: "AMM pool-share trustline for TROPTIONS/USDC pool" },
    ],
    complianceFlags: [
      { key: "auth-from-issuer", displayLabel: "AllowTrustOp authorized", required: true, note: "Issuer must allow_trust this wallet before tokens can be received." },
    ],
    notes:
      "Warm operational wallet — holds the TROPTIONS supply, places offers on the Stellar DEX, and provides liquidity to TROPTIONS/XLM and TROPTIONS/USDC pools.",
  },
  {
    walletId: "stellar-c-anchor-ops",
    chain: "stellar",
    displayName: "Stellar Wallet C — Anchor + Ops/Fees (warm)",
    address: "GCLMJRB7MPHPURUSNOUO376WJMAQMOJLRZJUZ5AMA3QSRTP7FLWE4AB4",
    seedEnvVar: "STELLAR_ANCHOR_SECRET",
    roleTags: ["anchor", "ops-fee"],
    coversTopologyRoles: ["stellar-troptions-anchor"],
    nativeFundingAmount: "10.99",
    reserveBreakdown:
      "1 XLM base + 2 trustlines × 0.5 XLM = 1 XLM reserves + ~9 XLM buffer for SEP-24 deposit/withdraw operations and ongoing transaction fees. (Existing balance, no transfer needed.)",
    trustlines: [
      { issuer: "troptions-self", limit: "10000000", purpose: "Hold inbound TROPTIONS for SEP-24 fiat-out flows" },
      { issuer: "circle-usdc-stellar", limit: "10000000", purpose: "Settle SEP-24 USDC deposits and withdrawals" },
    ],
    complianceFlags: [
      { key: "stellar-toml-published", displayLabel: "stellar.toml published with SEP-24 endpoints", required: true, note: "Required for wallets to discover the anchor service." },
      { key: "kyc-server", displayLabel: "SEP-12 KYC server live", required: true, note: "Required before processing any fiat-rail flow." },
    ],
    notes:
      "Anchor wallet. Once funded, publish stellar.toml at https://troptions.unykorn.org/.well-known/stellar.toml exposing this address as the SEP-24 transfer-server signing key.",
  },
];

export const TREASURY_FUNDING_PLAN: readonly FundingWalletPlan[] = [
  ...XRPL_PLAN,
  ...STELLAR_PLAN,
];

// ─── Selectors ────────────────────────────────────────────────────────────────

export function getFundingPlanByChain(chain: FundingChain): readonly FundingWalletPlan[] {
  return TREASURY_FUNDING_PLAN.filter((w) => w.chain === chain);
}

export function getFundingPlanByWalletId(walletId: string): FundingWalletPlan | undefined {
  return TREASURY_FUNDING_PLAN.find((w) => w.walletId === walletId);
}

export function summariseFundingPlan(): {
  readonly xrplWalletCount: number;
  readonly stellarWalletCount: number;
  readonly totalXrpRequired: string;
  readonly totalXlmRequired: string;
  readonly totalTrustlines: number;
  readonly stablecoinsCovered: readonly string[];
} {
  const xrplWallets = getFundingPlanByChain("xrpl");
  const stellarWallets = getFundingPlanByChain("stellar");
  const totalXrp = xrplWallets.reduce((s, w) => s + Number(w.nativeFundingAmount), 0);
  const totalXlm = stellarWallets.reduce((s, w) => s + Number(w.nativeFundingAmount), 0);
  const totalTrustlines = TREASURY_FUNDING_PLAN.reduce((s, w) => s + w.trustlines.length, 0);
  const stablecoins = new Set<string>();
  for (const w of TREASURY_FUNDING_PLAN) {
    for (const t of w.trustlines) {
      if (t.issuer !== "troptions-self") {
        stablecoins.add(STABLECOIN_ISSUERS[t.issuer].displayName);
      }
    }
  }
  return {
    xrplWalletCount: xrplWallets.length,
    stellarWalletCount: stellarWallets.length,
    totalXrpRequired: totalXrp.toFixed(2),
    totalXlmRequired: totalXlm.toFixed(2),
    totalTrustlines,
    stablecoinsCovered: Array.from(stablecoins).sort(),
  };
}

export function getStablecoinIssuer(key: StablecoinIssuerKey): StablecoinIssuerInfo {
  return STABLECOIN_ISSUERS[key];
}
