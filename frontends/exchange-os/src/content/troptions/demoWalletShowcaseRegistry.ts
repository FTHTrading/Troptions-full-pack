export interface DemoWalletAsset {
  readonly symbol: string;
  readonly assetType: "stablecoin" | "iou" | "regulated-asset" | "lp" | "nft" | "token";
  readonly purpose: string;
}

export interface DemoWalletLink {
  readonly label: string;
  readonly url: string;
}

export interface DemoWalletPoolReference {
  readonly pair: string;
  readonly network: "XRPL" | "Stellar";
  readonly status: "Live";
  readonly verificationUrl: string;
}

export interface DemoWalletShowcaseItem {
  readonly id: string;
  readonly label: string;
  readonly network: "XRPL" | "Stellar" | "XRPL + Stellar";
  readonly address?: string;
  readonly source: string;
  readonly walletType: "treasury" | "issuer" | "anchor" | "distribution" | "liquidity" | "evidence" | "trading";
  readonly summary: string;
  readonly assets: readonly DemoWalletAsset[];
  readonly explorerLinks: readonly DemoWalletLink[];
  readonly poolReferences?: readonly DemoWalletPoolReference[];
}

export const WALLET_INFRASTRUCTURE: readonly DemoWalletShowcaseItem[] = [
  // ── TROPTIONS XRPL Wallets ──────────────────────────────────────────────────
  {
    id: "troptions-xrpl-issuer",
    label: "TROPTIONS XRPL Issuer",
    network: "XRPL",
    address: "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
    source: "TROPTIONS mainnet deployment — 2026-04-28",
    walletType: "issuer",
    summary: "The master TROPTIONS token issuer on XRPL mainnet. Issued all 100,000,000 TROPTIONS IOU tokens. Price $0.0114 · Market Cap $1.1M · 3 holders · AMM TVL $7.91.",
    assets: [
      { symbol: "TROPTIONS", assetType: "iou", purpose: "Issuing authority for all 100M TROPTIONS on XRPL" },
      { symbol: "XRP", assetType: "token", purpose: "Base reserve and transaction fees" },
    ],
    explorerLinks: [
      { label: "XRPL Ledger", url: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
      { label: "XRPScan", url: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
      { label: "Token Info", url: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
    ],
  },
  {
    id: "troptions-xrpl-distribution-amm",
    label: "TROPTIONS XRPL Distribution + AMM",
    network: "XRPL",
    address: "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
    source: "TROPTIONS mainnet deployment — 2026-04-28",
    walletType: "distribution",
    summary: "TROPTIONS distribution wallet and AMM pool operator on XRPL. Received 100M TROPTIONS from issuer. Also received USDC (100M + 75M additional = 175M total), USDT (100M), DAI (50M), and EURC (50M) from the TROPTIONS gateway issuer. All balances verified on XRPL mainnet.",
    assets: [
      { symbol: "TROPTIONS", assetType: "iou", purpose: "Primary distribution and AMM liquidity" },
      { symbol: "XRP", assetType: "lp", purpose: "TROPTIONS/XRP AMM pair — pool seed liquidity" },
    ],
    explorerLinks: [
      { label: "XRPL Ledger", url: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
      { label: "XRPScan", url: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
    ],
    poolReferences: [
      { pair: "TROPTIONS / XRP", network: "XRPL", status: "Live", verificationUrl: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
    ],
  },
  // NOTE: Independent third-party DEX traders and trustline holders that
  // appear on chain (e.g. rsRy4Yic..., rMbHoVjLF2z3bS6Pg4NJcqoMsjyExn5LVu,
  // r49zYHBsv1WJU6yXV4s2jm5YJDLGT1JFT5) are deliberately NOT listed here.
  // This registry shows only Troptions-controlled wallets.

  // ── TROPTIONS Stellar Wallets ─────────────────────────────────────────────
  {
    id: "troptions-stellar-issuer",
    label: "TROPTIONS Stellar Issuer",
    network: "Stellar",
    address: "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    source: "TROPTIONS mainnet deployment — 2026-04-28. Funded 5 XLM (ledger 62321764)",
    walletType: "issuer",
    summary: "TROPTIONS token issuer on Stellar mainnet. Funded with 5 XLM on 2026-04-28 (ledger 62321764). Master authority for issuing TROPTIONS on the Stellar network.",
    assets: [
      { symbol: "TROPTIONS", assetType: "iou", purpose: "Stellar-side TROPTIONS issuance authority" },
      { symbol: "XLM", assetType: "token", purpose: "Base reserve and transaction fees" },
    ],
    explorerLinks: [
      { label: "Stellar Expert", url: "https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4" },
      { label: "Stellarchain", url: "https://stellarchain.io/accounts/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4" },
    ],
  },
  {
    id: "troptions-stellar-distribution",
    label: "TROPTIONS Stellar Distribution",
    network: "Stellar",
    address: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
    source: "TROPTIONS mainnet deployment — 2026-04-28. Funded 15 XLM (ledger 62321765)",
    walletType: "distribution",
    summary: "TROPTIONS distribution and AMM liquidity wallet on Stellar mainnet. Funded with 15 XLM on 2026-04-28 (ledger 62321765). Holds issued TROPTIONS for controlled release.",
    assets: [
      { symbol: "TROPTIONS", assetType: "iou", purpose: "Stellar TROPTIONS distribution and AMM liquidity" },
      { symbol: "XLM", assetType: "lp", purpose: "TROPTIONS/XLM AMM pool and trustline reserves" },
    ],
    explorerLinks: [
      { label: "Stellar Expert", url: "https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC" },
      { label: "Stellarchain", url: "https://stellarchain.io/accounts/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC" },
    ],
    poolReferences: [
      { pair: "TROPTIONS / XLM", network: "Stellar", status: "Live", verificationUrl: "https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC" },
    ],
  },
];
