export interface XrplIouRecord {
  readonly currency: string;
  readonly issuer: string;
  readonly issuerLabel?: string;
  readonly category: "stablecoin" | "commodity" | "bond" | "custom-token" | "attestation" | "platform-token" | "rwa-receipt";
  readonly assetClass: "Stablecoin" | "Commodity" | "RWA Receipt" | "Sovereign Bond" | "Platform Token" | "Attestation Marker" | "Custom Token";
  readonly transferFeeRateBps: number;           // XRPL transfer fee in basis points (0 = no fee; 100 = 1%)
  readonly xrplTransferFeeMillionths?: number;   // raw XRPL TransferFee field value (millionths-of-a-percent × 1000)
  readonly logoPath?: string;
  readonly note: string;
  readonly rwaDescription?: string;
  readonly onChainStatus?: "issued" | "pending" | "draft";
  readonly explorerUrl?: string;
}

// ── TROPTIONS Gateway Issuer Addresses ───────────────────────────────────────
export const TROPTIONS_XRPL_ISSUER    = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";
export const TROPTIONS_XRPL_DISTRIBUTOR = "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt";
export const TROPTIONS_STELLAR_ISSUER  = "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4";

export const XRPL_IOU_REGISTRY: readonly XrplIouRecord[] = [
  // ── TROPTIONS Native Token — primary platform IOU (ISSUED on mainnet 2026-04-28) ──
  {
    currency: "TROPTIONS",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Gateway Issuer (Cold)",
    category: "platform-token",
    assetClass: "Platform Token",
    transferFeeRateBps: 25,
    xrplTransferFeeMillionths: 250000,
    logoPath: "/assets/troptions/logos/troptions-iou-logo.svg",
    note: "TROPTIONS native IOU. 100,000,000 supply issued on XRPL mainnet. Authorized trustlines required. Freeze and clawback enabled. Verified issuer.",
    rwaDescription: "Commercial trade instrument backed by documented barter agreements, real property positions, and the TROPTIONS platform asset reserve. Each unit represents a fractional claim on the TROPTIONS Gateway's verified real-world asset portfolio including real estate, equipment, solar energy, and mobile medical assets.",
    onChainStatus: "issued",
    explorerUrl: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
  },

  // ── Stablecoin IOUs — ISSUED on XRPL + Stellar Mainnet 2026-04-28 ────────────
  {
    currency: "USDC",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Gateway (Stablecoin IOU)",
    category: "stablecoin",
    assetClass: "Stablecoin",
    transferFeeRateBps: 0,
    logoPath: "/assets/troptions/logos/usdc-iou-logo.svg",
    note: "USD Coin IOU — 100,000,000 supply issued on XRPL + Stellar mainnet 2026-04-28. XRPL hex: 5553444300000000000000000000000000000000. TrustSet: 63225EF599058DA5AF3B70349DA7927F6155015E91F3C3DBD4BB2656FFA0613A · Issue: CD7271274743C20635ED58515F84B399A4113FE40E62CFC8248446A494D1E642. AAVE v3 compatible. Verify issuer, reserve, and redemption path before acceptance.",
    rwaDescription: "Gateway-issued receipt representing a claim on USD Coin (USDC) held in custody by the TROPTIONS Gateway. Each unit redeemable 1:1 for real USDC under verified gateway terms. Circle-issued underlying. AAVE-compatible structure.",
    onChainStatus: "issued",
    explorerUrl: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
  },
  {
    currency: "USDT",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Gateway (Stablecoin IOU)",
    category: "stablecoin",
    assetClass: "Stablecoin",
    transferFeeRateBps: 0,
    logoPath: "/assets/troptions/logos/usdt-iou-logo.svg",
    note: "Tether USD IOU — 100,000,000 supply issued on XRPL + Stellar mainnet 2026-04-28. XRPL hex: 5553445400000000000000000000000000000000. TrustSet: 01A93483C4CD57053D01CD7B516F9A536A69237AA58A7A614D7ED2F257014241 · Issue: 42092147E2D2BB2E944C7156378A6CEE8B8D0E78FB350266FC1990439D7F1F6F. AAVE v3 compatible. Verify issuer, liquidity, and redemption path.",
    rwaDescription: "Gateway-issued receipt representing a claim on USD Tether (USDT) held in custody by the TROPTIONS Gateway. Each unit redeemable 1:1 for real USDT under verified gateway terms. Tether Operations underlying.",
    onChainStatus: "issued",
    explorerUrl: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
  },
  {
    currency: "DAI",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Gateway (Stablecoin IOU)",
    category: "stablecoin",
    assetClass: "Stablecoin",
    transferFeeRateBps: 0,
    logoPath: "/assets/troptions/logos/dai-iou-logo.svg",
    note: "Dai Stablecoin IOU — 50,000,000 supply issued on XRPL + Stellar mainnet 2026-04-28. Standard 3-char XRPL currency code. TrustSet: B14C09D240AF67279EEC84E0CB521766DF9BCFB909E1481486E62B928A528093 · Issue: C0D75DCCF46DCA6F1776D739A4EC0F521330E170B8BC2E09C7F4D42A2361F641. AAVE v3 native asset — aDAI yield model. Verify issuer and redemption path.",
    rwaDescription: "Gateway-issued receipt representing a claim on Dai (DAI) held in custody by the TROPTIONS Gateway. Each unit redeemable 1:1 for real DAI under verified gateway terms. MakerDAO / Sky Protocol underlying. AAVE v3 listed collateral — enables aDAI yield.",
    onChainStatus: "issued",
    explorerUrl: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
  },
  {
    currency: "EURC",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Gateway (Stablecoin IOU)",
    category: "stablecoin",
    assetClass: "Stablecoin",
    transferFeeRateBps: 0,
    logoPath: "/assets/troptions/logos/eurc-iou-logo.svg",
    note: "Euro Coin IOU — 50,000,000 supply issued on XRPL + Stellar mainnet 2026-04-28. XRPL hex: 4555524300000000000000000000000000000000. TrustSet: 37D4C6F7E0C49CA8DBF8D87FD3332FA7C057583B1052A9A6703634EFC9B33E0F · Issue: FF11D7773C0EDF38833A9CEE5AE03DEB6167D87FF07180A275A1DDCABCC560D1. Circle EUR-backed. Enables EUR-denominated cross-border settlement.",
    rwaDescription: "Gateway-issued receipt representing a claim on Euro Coin (EURC) held in custody by the TROPTIONS Gateway. Each unit redeemable 1:1 for real EURC (1 EUR) under verified gateway terms. Circle-issued underlying.",
    onChainStatus: "issued",
    explorerUrl: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
  },
  {
    currency: "GOLD",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Gateway (Commodity IOU)",
    category: "commodity",
    assetClass: "Commodity",
    transferFeeRateBps: 50,
    xrplTransferFeeMillionths: 500000,
    logoPath: "/assets/troptions/logos/xaua-iou-logo.svg",
    note: "Issued-asset representation of vaulted gold. Not physical metal custody proof unless paired with assay certificate and vault agreement.",
    rwaDescription: "Gold reserve receipt. Each unit represents one troy ounce of vaulted gold with assay certificate required for redemption. Independent third-party vault statement required.",
    onChainStatus: "draft",
  },
  {
    currency: "GBP",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Gateway (Stablecoin IOU)",
    category: "stablecoin",
    assetClass: "Stablecoin",
    transferFeeRateBps: 0,
    logoPath: "/assets/troptions/logos/gbp-iou-logo.svg",
    note: "Issuer acceptance and redemption terms determine real value.",
    rwaDescription: "Sterling-denominated IOU receipt. Gateway-issued, requires reserve verification and active redemption path.",
    onChainStatus: "draft",
  },
  {
    currency: "DONK",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Gateway (Custom Token)",
    category: "custom-token",
    assetClass: "Custom Token",
    transferFeeRateBps: 100,
    xrplTransferFeeMillionths: 1000000,
    logoPath: "/assets/troptions/logos/donk-iou-logo.svg",
    note: "Custom issued token. Validate issuer controls and market depth.",
    rwaDescription: "Community custom token. Represents platform engagement and utility within the TROPTIONS ecosystem.",
    onChainStatus: "draft",
  },

  // ── Legacy asset receipts ────────────────────────────────────────────────────
  {
    currency: "LEGACY",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Legacy Token Issuer",
    category: "custom-token",
    assetClass: "RWA Receipt",
    transferFeeRateBps: 0,
    logoPath: "/assets/troptions/logos/legacy-iou-logo.svg",
    note: "Legacy project token representation; evaluate trustline and issuer risk.",
    rwaDescription: "Legacy TROPTIONS issuance receipt. Represents historical deal positions and prior platform asset claims. Subject to legacy governance terms.",
    onChainStatus: "draft",
  },
  {
    currency: "SOVBND",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Legacy Token Issuer",
    category: "bond",
    assetClass: "Sovereign Bond",
    transferFeeRateBps: 25,
    xrplTransferFeeMillionths: 250000,
    logoPath: "/assets/troptions/logos/sovbnd-iou-logo.svg",
    note: "Sovereign bond-style settlement instrument. Maps to issuer IOU model — no government guarantee.",
    rwaDescription: "Sovereign bond-style receipt. Represents a structured settlement instrument backed by documented asset positions. Not a government-issued bond — a private structured claim.",
    onChainStatus: "draft",
  },
  {
    currency: "PETRO",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Legacy Token Issuer",
    category: "commodity",
    assetClass: "Commodity",
    transferFeeRateBps: 50,
    xrplTransferFeeMillionths: 500000,
    logoPath: "/assets/troptions/logos/petro-iou-logo.svg",
    note: "Commodity-themed IOU; verify issuer and redemption ability.",
    rwaDescription: "Petroleum commodity claim receipt. Represents a documented position in petroleum or energy commodity assets held or contracted by the TROPTIONS Gateway.",
    onChainStatus: "draft",
  },
  {
    currency: "ATTEST",
    issuer: TROPTIONS_XRPL_ISSUER,
    issuerLabel: "TROPTIONS Legacy Token Issuer",
    category: "attestation",
    assetClass: "Attestation Marker",
    transferFeeRateBps: 0,
    logoPath: "/assets/troptions/logos/attest-iou-logo.svg",
    note: "Attestation-style issued asset. Serves as cryptographic evidence marker, not a value claim.",
    rwaDescription: "Cryptographic attestation evidence marker. On-chain proof-of-fact token used to anchor document hashes, deal confirmations, or compliance certifications to the XRPL ledger.",
    onChainStatus: "draft",
  },
];

export const XRPL_IOU_EXPLAINER = {
  title: "Why the big USDT/EUR/GOLD numbers may not equal real funds",
  bullets: [
    "On XRPL, issued currencies are IOUs.",
    "Currency code alone is not enough.",
    "USDT on XRPL is not automatically official Tether.",
    "USD is not automatically bank USD.",
    "Real value depends on issuer, liquidity, redemption, and acceptance.",
    "Always check currency code plus issuer address.",
    "Native XRP is different from IOUs.",
  ] as const,
} as const;
