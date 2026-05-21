/**
 * Treasury Topology Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * SR-level wallet topology for the TROPTIONS treasury system.
 *
 *   • 11 XRPL roles  — covering issuance, distribution, custody, settlement,
 *                      DEX market-making, AMM liquidity, NFT/MPT issuance,
 *                      and operational reserves.
 *   • 35 Stellar roles — covering issuance per asset, distribution per asset,
 *                        anchor/SEP services, LP positions, treasury reserve
 *                        rails, and per-jurisdiction segregation.
 *
 * SECURITY:
 *   - This registry stores ONLY public addresses and role metadata.
 *   - Seeds and secrets are loaded from env vars at runtime, never persisted.
 *   - Roles in `pending-generation` state require fresh hardware-wallet generation
 *     and board authorization before being activated on mainnet.
 *
 * SEGREGATION CLASSES:
 *   - cold      — air-gapped, multi-sig, never online except for sealed signing
 *   - warm      — multi-sig signing, scheduled rotation
 *   - hot       — single-sig operational, daily caps, rotated quarterly
 *   - read-only — observation-only addresses (no signing key on file)
 */

export type TreasuryChain = "xrpl" | "stellar";

export type TreasuryClassification =
  | "issuance"
  | "distribution"
  | "treasury-reserve"
  | "custody"
  | "settlement"
  | "market-making"
  | "liquidity-pool"
  | "anchor"
  | "nft-issuance"
  | "mpt-issuance"
  | "compliance-hold"
  | "ops-fee"
  | "exchange-coordination";

export type TreasuryTier = "cold" | "warm" | "hot" | "read-only";

export type TreasuryProvisionStatus =
  | "active"               // address known, on-chain, ready for live ops
  | "configured"           // address known, env seed required for signing
  | "pending-generation"   // role defined, fresh wallet must be created
  | "compromised"          // do not use
  | "deprecated";

export interface TreasuryWalletRole {
  readonly roleId: string;
  readonly chain: TreasuryChain;
  readonly displayName: string;
  readonly classification: TreasuryClassification;
  readonly tier: TreasuryTier;
  readonly status: TreasuryProvisionStatus;
  /** Public address. Empty string when status is `pending-generation`. */
  readonly address: string;
  /** Env var that holds the private seed/secret (never logged). */
  readonly seedEnvVar?: string;
  /** Asset codes this wallet is responsible for (e.g. "TROPTIONS", "SOVBND"). */
  readonly assets: readonly string[];
  /** Daily operational cap in base units of the primary asset. */
  readonly dailyCap?: string;
  /** Multi-sig signers required (1 = single-sig). */
  readonly signersRequired: number;
  readonly description: string;
  readonly requiresBoardAuth: boolean;
  readonly requiresLegalReview: boolean;
}

// ─── XRPL Treasury Topology (11 roles) ────────────────────────────────────────

export const XRPL_TREASURY_TOPOLOGY: readonly TreasuryWalletRole[] = [
  {
    roleId: "xrpl-troptions-issuer",
    chain: "xrpl",
    displayName: "TROPTIONS Issuer (XRPL)",
    classification: "issuance",
    tier: "cold",
    status: "configured",
    address: "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
    seedEnvVar: "XRPL_ISSUER_SEED",
    assets: ["TROPTIONS"],
    signersRequired: 1,
    description:
      "Mainnet TROPTIONS IOU issuer (currency hex 54524F5054494F4E530000000000000000000000). Cold-storage issuer used only for issuance and account configuration.",
    requiresBoardAuth: true,
    requiresLegalReview: true,
  },
  {
    roleId: "xrpl-troptions-distributor",
    chain: "xrpl",
    displayName: "TROPTIONS Distributor (XRPL)",
    classification: "distribution",
    tier: "warm",
    status: "configured",
    address: "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
    seedEnvVar: "XRPL_DISTRIBUTOR_SEED",
    assets: ["TROPTIONS"],
    dailyCap: "10000000",
    signersRequired: 2,
    description:
      "Primary distribution wallet for TROPTIONS. Holds the issued supply and serves as the public receive address for partners, exchanges, and onboarded holders.",
    requiresBoardAuth: false,
    requiresLegalReview: false,
  },
  {
    roleId: "xrpl-legacy-issuer",
    chain: "xrpl",
    displayName: "Legacy Token Issuer (XRPL)",
    classification: "issuance",
    tier: "cold",
    status: "active",
    address: "rpraqLjKmDB9a43F9fURWA2bVaywkyJua3",
    assets: ["LEGACY-TOKEN"],
    signersRequired: 1,
    description:
      "Legacy IOU issuer wallet generated 2026-02-07. Issues legacy-branded tokens under legal review. Requires board authorization and legal sign-off before any new issuance.",
    requiresBoardAuth: true,
    requiresLegalReview: true,
  },
  {
    roleId: "xrpl-legacy-treasury",
    chain: "xrpl",
    displayName: "Legacy Treasury (XRPL)",
    classification: "treasury-reserve",
    tier: "warm",
    status: "active",
    address: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
    assets: ["LEGACY-TOKEN", "SOVBND"],
    signersRequired: 2,
    description:
      "Legacy Genesis treasury wallet. Trustlines for legacy token and SOVBND established. Operational reserve under multi-sig.",
    requiresBoardAuth: false,
    requiresLegalReview: false,
  },
  {
    roleId: "xrpl-troptions-treasury",
    chain: "xrpl",
    displayName: "TROPTIONS Treasury (XRPL)",
    classification: "treasury-reserve",
    tier: "cold",
    status: "configured",
    address: "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3",
    seedEnvVar: "XRPL_TREASURY_SEED",
    assets: ["TROPTIONS", "LEGACY-TOKEN", "XRP"],
    signersRequired: 3,
    description:
      "Cold-storage treasury reserve for TROPTIONS-family assets. 3-of-N multi-sig. Drawdowns only via board-authorized release.",
    requiresBoardAuth: true,
    requiresLegalReview: false,
  },
  {
    roleId: "xrpl-dex-maker",
    chain: "xrpl",
    displayName: "TROPTIONS DEX Market-Maker (XRPL)",
    classification: "market-making",
    tier: "hot",
    status: "configured",
    address: "rQJfA7q52wdqHaUGXbahetZPtJmT9noT5S",
    seedEnvVar: "XRPL_DEX_MAKER_SEED",
    assets: ["TROPTIONS", "XRP"],
    dailyCap: "1000000",
    signersRequired: 1,
    description:
      "Hot wallet for placing OfferCreate / OfferCancel transactions on the XRPL DEX. Daily cap enforced; rotated quarterly.",
    requiresBoardAuth: false,
    requiresLegalReview: false,
  },
  {
    roleId: "xrpl-amm-lp",
    chain: "xrpl",
    displayName: "TROPTIONS AMM LP (XRPL)",
    classification: "liquidity-pool",
    tier: "warm",
    status: "configured",
    address: "rh6JBZzKsLCJqNeh3pCMjv4VrQyMLJzDxY",
    seedEnvVar: "XRPL_AMM_LP_SEED",
    assets: ["TROPTIONS", "XRP"],
    signersRequired: 2,
    description:
      "Liquidity provider for TROPTIONS/XRP AMM pool (XLS-30). Signs AMMCreate, AMMDeposit, AMMWithdraw.",
    requiresBoardAuth: false,
    requiresLegalReview: false,
  },
  {
    roleId: "xrpl-nft-issuer",
    chain: "xrpl",
    displayName: "TROPTIONS NFT Issuer (XLS-20)",
    classification: "nft-issuance",
    tier: "warm",
    status: "configured",
    address: "r3s1hNgbRv4hmxf3qxuw4ygBa89N4QFzGh",
    seedEnvVar: "XRPL_NFT_ISSUER_SEED",
    assets: ["TROPTIONS-NFT"],
    signersRequired: 1,
    description:
      "Issues XLS-20 NFTs for university credentials, evidence registry, and media access tokens.",
    requiresBoardAuth: false,
    requiresLegalReview: false,
  },
  {
    roleId: "xrpl-mpt-issuer",
    chain: "xrpl",
    displayName: "TROPTIONS Unity Token (XLS-33 MPT)",
    classification: "mpt-issuance",
    tier: "cold",
    status: "configured",
    address: "rsqW2LeYYD7Z9jsSfWxW9kBaXLuK9xwnMm",
    seedEnvVar: "XRPL_MPT_ISSUER_SEED",
    assets: ["TUT"],
    signersRequired: 1,
    description:
      "XLS-33 Multi-Purpose Token issuer for Troptions Unity Token. Requires fresh hardware-wallet generation, securities counsel review, and board authorization before MPTIssuanceCreate.",
    requiresBoardAuth: true,
    requiresLegalReview: true,
  },
  {
    roleId: "xrpl-exchange-coordination",
    chain: "xrpl",
    displayName: "TROPTIONSXCHANGE Coordination Wallet",
    classification: "exchange-coordination",
    tier: "warm",
    status: "pending-generation",
    address: "",
    assets: ["TROPTIONS"],
    signersRequired: 2,
    description:
      "Settlement and coordination wallet for TROPTIONSXCHANGE.IO ATS. Requires exchange/ATS licensing review before activation.",
    requiresBoardAuth: true,
    requiresLegalReview: true,
  },
  {
    roleId: "xrpl-ops-fee",
    chain: "xrpl",
    displayName: "TROPTIONS Operations & Fee Wallet",
    classification: "ops-fee",
    tier: "hot",
    status: "configured",
    address: "",
    assets: ["XRP"],
    dailyCap: "10000",
    signersRequired: 1,
    description:
      "Pays XRPL transaction fees and reserve increments. Topped-up monthly. Hot wallet — single-sig, low balance only.",
    requiresBoardAuth: false,
    requiresLegalReview: false,
  },
];

// ─── Stellar Treasury Topology (35 roles) ─────────────────────────────────────

/** Helper: build a Stellar role with sane defaults. */
function stellarRole(
  roleId: string,
  displayName: string,
  classification: TreasuryClassification,
  tier: TreasuryTier,
  status: TreasuryProvisionStatus,
  address: string,
  assets: readonly string[],
  description: string,
  opts: {
    seedEnvVar?: string;
    signersRequired?: number;
    dailyCap?: string;
    requiresBoardAuth?: boolean;
    requiresLegalReview?: boolean;
  } = {},
): TreasuryWalletRole {
  return {
    roleId,
    chain: "stellar",
    displayName,
    classification,
    tier,
    status,
    address,
    assets,
    description,
    seedEnvVar: opts.seedEnvVar,
    signersRequired: opts.signersRequired ?? (tier === "cold" ? 3 : tier === "warm" ? 2 : 1),
    dailyCap: opts.dailyCap,
    requiresBoardAuth: opts.requiresBoardAuth ?? (tier === "cold"),
    requiresLegalReview: opts.requiresLegalReview ?? false,
  };
}

export const STELLAR_TREASURY_TOPOLOGY: readonly TreasuryWalletRole[] = [
  // ── TROPTIONS asset family (5) ──────────────────────────────────────────────
  stellarRole(
    "stellar-troptions-issuer", "TROPTIONS Issuer (Stellar)",
    "issuance", "cold", "configured",
    "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    ["TROPTIONS"],
    "Stellar issuer for the TROPTIONS asset on the Stellar public network. Cold-storage; signs SetOptions for AUTH_REQUIRED / AUTH_REVOCABLE configuration.",
    { seedEnvVar: "STELLAR_ISSUER_SECRET", requiresBoardAuth: true, requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-troptions-distributor", "TROPTIONS Distributor (Stellar)",
    "distribution", "warm", "configured",
    "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
    ["TROPTIONS"],
    "Primary Stellar distribution wallet for TROPTIONS. Holds issued supply, serves as public receive address.",
    { seedEnvVar: "STELLAR_DISTRIBUTOR_SECRET", dailyCap: "10000000" },
  ),
  stellarRole(
    "stellar-troptions-lp", "TROPTIONS LP Manager (Stellar)",
    "liquidity-pool", "warm", "configured",
    "GBKZO7SNVZHTWRSL7X6ZFH7LH5DRDS4AWFPJT64XXJMJW7KUGRHDHKRW",
    ["TROPTIONS", "XLM", "USDC"],
    "Manages TROPTIONS/XLM and TROPTIONS/USDC liquidity pools on Stellar AMM.",
    { seedEnvVar: "STELLAR_LP_SECRET" },
  ),
  stellarRole(
    "stellar-troptions-anchor", "TROPTIONS Anchor (Stellar)",
    "anchor", "warm", "configured",
    "GCLMJRB7MPHPURUSNOUO376WJMAQMOJLRZJUZ5AMA3QSRTP7FLWE4AB4",
    ["TROPTIONS"],
    "SEP-6 / SEP-24 anchor service wallet. Handles deposits and withdrawals between fiat rails and the TROPTIONS asset.",
    { seedEnvVar: "STELLAR_ANCHOR_SECRET", requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-troptions-treasury", "TROPTIONS Treasury Reserve (Stellar)",
    "treasury-reserve", "cold", "configured",
    "GCOTXN75SHALV4NIV2V4EBACXRMLAMU5J2MYLOGUJOLIA5HOO4DEYCLK",
    ["TROPTIONS", "XLM", "USDC"],
    "Cold-storage treasury reserve. Drawdowns only via board authorization. Currently single-sig (STELLAR_TREASURY_SECRET); convert to multi-sig before scaling.",
    { seedEnvVar: "STELLAR_TREASURY_SECRET" },
  ),

  // ── Legacy token asset family (5) ───────────────────────────────────────────
  stellarRole(
    "stellar-legacy-issuer", "Legacy Token Issuer (Stellar)",
    "issuance", "cold", "active",
    "GBJIMHMBGTPN5RS42OGBUY5NC2ATZLPT3B3EWV32SM2GQLS46TRJWG4I",
    ["LEGACY-TOKEN"],
    "Legacy token issuer wallet generated 2026-02-07. Issues legacy-backed tokens on Stellar mainnet. Under legal review; requires board authorization before new issuance.",
    { requiresBoardAuth: true, requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-legacy-distribution", "Legacy Token Distribution (Stellar)",
    "distribution", "warm", "active",
    "GAKCD7OKDM4HLZDBEE7KXTRFAYIE755UHL3JFQEOOHDPIMM5GEFY3RPF",
    ["LEGACY-TOKEN"],
    "Legacy token distribution wallet — holds issued supply for controlled release.",
  ),
  stellarRole(
    "stellar-legacy-anchor", "Legacy Token Anchor (Stellar)",
    "anchor", "warm", "active",
    "GC6O6Q7FG5FZGHE5D5BHGA6ZTLRAU7UWFJKKWNOJ36G3PKVVKVYLQGA6",
    ["LEGACY-TOKEN"],
    "Legacy escrow/anchor wallet. Handles SEP-6/SEP-24 flows under compliance review.",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-legacy-lp", "Legacy Token LP Manager (Stellar)",
    "liquidity-pool", "warm", "pending-generation", "",
    ["LEGACY-TOKEN", "XLM"],
    "Manages legacy token/XLM liquidity pool on Stellar AMM. Pending legal structure review.",
  ),
  stellarRole(
    "stellar-legacy-treasury", "Legacy Token Treasury Reserve (Stellar)",
    "treasury-reserve", "cold", "pending-generation", "",
    ["LEGACY-TOKEN"],
    "Cold-storage treasury reserve for legacy token holdings. Multi-sig only.",
  ),

  // ── SOVBND sovereign bond rails (4) ─────────────────────────────────────────
  stellarRole(
    "stellar-sovbnd-issuer", "SOVBND Issuer (Stellar)",
    "issuance", "cold", "pending-generation", "",
    ["SOVBND"],
    "Sovereign Bond issuer. Requires securities counsel review and authorized issuer documentation before mainnet activation.",
    { requiresBoardAuth: true, requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-sovbnd-distributor", "SOVBND Distributor (Stellar)",
    "distribution", "warm", "pending-generation", "",
    ["SOVBND"],
    "Sovereign Bond distribution wallet. Holds issued bond units for primary placement.",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-sovbnd-custody", "SOVBND Custody (Stellar)",
    "custody", "cold", "pending-generation", "",
    ["SOVBND"],
    "Cold custody for sovereign bond reserves. 3-of-N multi-sig.",
    { requiresBoardAuth: true, requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-sovbnd-settlement", "SOVBND Settlement (Stellar)",
    "settlement", "warm", "pending-generation", "",
    ["SOVBND", "USDC"],
    "Settlement wallet for SOVBND coupon and redemption flows.",
    { requiresLegalReview: true },
  ),

  // ── USDF stablecoin rails (4) ───────────────────────────────────────────────
  stellarRole(
    "stellar-usdf-issuer", "USDF Issuer (Stellar)",
    "issuance", "cold", "pending-generation", "",
    ["USDF"],
    "USDF stablecoin issuer on Stellar. Requires regulated issuer entity and reserve attestations.",
    { requiresBoardAuth: true, requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-usdf-distributor", "USDF Distributor (Stellar)",
    "distribution", "warm", "pending-generation", "",
    ["USDF"],
    "USDF distribution wallet — primary mint/redeem operational rail.",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-usdf-reserve", "USDF Reserve Custody (Stellar)",
    "treasury-reserve", "cold", "pending-generation", "",
    ["USDF"],
    "Cold reserve backing USDF in circulation. Mirrors fiat reserve held in regulated bank account.",
    { requiresBoardAuth: true, requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-usdf-anchor", "USDF Anchor (Stellar)",
    "anchor", "warm", "pending-generation", "",
    ["USDF"],
    "SEP-24 USDF anchor wallet for fiat-rail deposit and withdrawal.",
    { requiresLegalReview: true },
  ),

  // ── Real-Estate / RWA rails (3) ─────────────────────────────────────────────
  stellarRole(
    "stellar-rwa-realestate-issuer", "Real-Estate RWA Issuer (Stellar)",
    "issuance", "cold", "pending-generation", "",
    ["RECNX"],
    "Issues tokenised real-estate receipts for TheRealEstateConnections.com. Requires brokerage and securities review.",
    { requiresBoardAuth: true, requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-rwa-realestate-distributor", "Real-Estate RWA Distributor (Stellar)",
    "distribution", "warm", "pending-generation", "",
    ["RECNX"],
    "Distribution wallet for tokenised real-estate receipts.",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-rwa-realestate-settlement", "Real-Estate RWA Settlement (Stellar)",
    "settlement", "warm", "pending-generation", "",
    ["RECNX", "USDC"],
    "Settles primary purchases, secondary trades, and rental distributions for tokenised real estate.",
    { requiresLegalReview: true },
  ),

  // ── Solar / energy RWA rails (2) ────────────────────────────────────────────
  stellarRole(
    "stellar-rwa-solar-issuer", "Solar RWA Issuer (Stellar)",
    "issuance", "cold", "pending-generation", "",
    ["TSOLAR"],
    "Issues tokenised solar-asset receipts (revenue share). Requires utility/securities review.",
    { requiresBoardAuth: true, requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-rwa-solar-distributor", "Solar RWA Distributor (Stellar)",
    "distribution", "warm", "pending-generation", "",
    ["TSOLAR"],
    "Distribution wallet for tokenised solar-asset receipts.",
    { requiresLegalReview: true },
  ),

  // ── DEX market-making and AMM (3) ───────────────────────────────────────────
  stellarRole(
    "stellar-dex-maker", "Stellar DEX Market-Maker",
    "market-making", "hot", "pending-generation", "",
    ["TROPTIONS", "LEGACY-TOKEN", "XLM", "USDC"],
    "Hot wallet placing manageBuyOffer/manageSellOffer transactions on the Stellar DEX. Daily cap enforced.",
    { dailyCap: "1000000" },
  ),
  stellarRole(
    "stellar-amm-troptions-xlm", "TROPTIONS/XLM AMM LP",
    "liquidity-pool", "warm", "pending-generation", "",
    ["TROPTIONS", "XLM"],
    "Liquidity provider position in the TROPTIONS/XLM Stellar liquidity pool.",
  ),
  stellarRole(
    "stellar-amm-troptions-usdc", "TROPTIONS/USDC AMM LP",
    "liquidity-pool", "warm", "pending-generation", "",
    ["TROPTIONS", "USDC"],
    "Liquidity provider position in the TROPTIONS/USDC Stellar liquidity pool.",
  ),

  // ── Compliance and operational rails (4) ────────────────────────────────────
  stellarRole(
    "stellar-compliance-hold", "Compliance Hold Wallet (Stellar)",
    "compliance-hold", "warm", "pending-generation", "",
    ["TROPTIONS", "LEGACY-TOKEN", "USDF"],
    "Holds frozen assets pending compliance review (sanctions match, suspicious-activity hold, KYC dispute). Auth-revocable on issuer side.",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-ops-fee", "Stellar Operations & Fee Wallet",
    "ops-fee", "hot", "pending-generation", "",
    ["XLM"],
    "Pays Stellar base fees and reserve increments. Topped up monthly. Hot wallet, single-sig.",
    { dailyCap: "10000" },
  ),
  stellarRole(
    "stellar-exchange-coordination", "Stellar Exchange Coordination",
    "exchange-coordination", "warm", "pending-generation", "",
    ["TROPTIONS", "LEGACY-TOKEN"],
    "Coordinates listings and deposits with centralised exchanges (Coinbase, Bitstamp, etc.).",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-treasury-master", "Stellar Treasury Master Reserve",
    "treasury-reserve", "cold", "pending-generation", "",
    ["XLM", "USDC", "TROPTIONS", "LEGACY-TOKEN"],
    "Master cold-storage treasury reserve aggregating all Stellar-side assets. 4-of-N multi-sig.",
    { signersRequired: 4, requiresBoardAuth: true, requiresLegalReview: true },
  ),

  // ── Per-jurisdiction segregation (5) ────────────────────────────────────────
  stellarRole(
    "stellar-jurisdiction-us", "US Jurisdiction Wallet (Stellar)",
    "compliance-hold", "warm", "pending-generation", "",
    ["TROPTIONS", "USDF"],
    "Segregated wallet for US-resident holders. Subject to FinCEN reporting and OFAC screening.",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-jurisdiction-eu", "EU Jurisdiction Wallet (Stellar)",
    "compliance-hold", "warm", "pending-generation", "",
    ["TROPTIONS"],
    "Segregated wallet for EU-resident holders under MiCA framework.",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-jurisdiction-uk", "UK Jurisdiction Wallet (Stellar)",
    "compliance-hold", "warm", "pending-generation", "",
    ["TROPTIONS"],
    "Segregated wallet for UK-resident holders under FCA Cryptoasset framework.",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-jurisdiction-apac", "APAC Jurisdiction Wallet (Stellar)",
    "compliance-hold", "warm", "pending-generation", "",
    ["TROPTIONS"],
    "Segregated wallet for APAC region holders. Per-country review required.",
    { requiresLegalReview: true },
  ),
  stellarRole(
    "stellar-jurisdiction-rest-of-world", "Rest-of-World Wallet (Stellar)",
    "compliance-hold", "warm", "pending-generation", "",
    ["TROPTIONS"],
    "Segregated wallet for holders outside US/EU/UK/APAC, subject to enhanced due diligence.",
    { requiresLegalReview: true },
  ),
];

// ─── Aggregated topology ──────────────────────────────────────────────────────

export const TREASURY_TOPOLOGY: readonly TreasuryWalletRole[] = [
  ...XRPL_TREASURY_TOPOLOGY,
  ...STELLAR_TREASURY_TOPOLOGY,
];

// ─── Selectors ────────────────────────────────────────────────────────────────

export function getTopologyByChain(chain: TreasuryChain): readonly TreasuryWalletRole[] {
  return TREASURY_TOPOLOGY.filter((r) => r.chain === chain);
}

export function getTopologyByClassification(
  classification: TreasuryClassification,
): readonly TreasuryWalletRole[] {
  return TREASURY_TOPOLOGY.filter((r) => r.classification === classification);
}

export function getTopologyByTier(tier: TreasuryTier): readonly TreasuryWalletRole[] {
  return TREASURY_TOPOLOGY.filter((r) => r.tier === tier);
}

export function getActiveRoles(): readonly TreasuryWalletRole[] {
  return TREASURY_TOPOLOGY.filter(
    (r) => r.status === "active" || r.status === "configured",
  );
}

export function getPendingRoles(): readonly TreasuryWalletRole[] {
  return TREASURY_TOPOLOGY.filter((r) => r.status === "pending-generation");
}

export function getRoleById(roleId: string): TreasuryWalletRole | undefined {
  return TREASURY_TOPOLOGY.find((r) => r.roleId === roleId);
}

export function summariseTopology(): {
  totalRoles: number;
  byChain: Record<TreasuryChain, number>;
  byStatus: Record<TreasuryProvisionStatus, number>;
  byTier: Record<TreasuryTier, number>;
  byClassification: Partial<Record<TreasuryClassification, number>>;
} {
  const byChain: Record<TreasuryChain, number> = { xrpl: 0, stellar: 0 };
  const byStatus: Record<TreasuryProvisionStatus, number> = {
    "active": 0,
    "configured": 0,
    "pending-generation": 0,
    "compromised": 0,
    "deprecated": 0,
  };
  const byTier: Record<TreasuryTier, number> = { cold: 0, warm: 0, hot: 0, "read-only": 0 };
  const byClassification: Partial<Record<TreasuryClassification, number>> = {};

  for (const r of TREASURY_TOPOLOGY) {
    byChain[r.chain]++;
    byStatus[r.status]++;
    byTier[r.tier]++;
    byClassification[r.classification] = (byClassification[r.classification] ?? 0) + 1;
  }

  return {
    totalRoles: TREASURY_TOPOLOGY.length,
    byChain,
    byStatus,
    byTier,
    byClassification,
  };
}
