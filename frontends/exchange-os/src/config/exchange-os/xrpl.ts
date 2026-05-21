// TROPTIONS Exchange OS — XRPL Configuration
// Read-only mainnet ops (pathfinding, book_offers, account_info) are always on.
// XRPL_MAINNET_ENABLED only gates TX submission (write operations).

export const xrplConfig = {
  network: "mainnet" as "testnet" | "mainnet",
  /** Used for read-only mainnet queries (pathfinding, order book, account info) */
  mainnetWsUrl:
    process.env.XRPL_MAINNET_WS_URL || "wss://xrplcluster.com",
  /** Testnet WS — only used when explicitly requested */
  websocketUrl:
    process.env.XRPL_WEBSOCKET_URL || "wss://s.altnet.rippletest.net:51233",
  /** Gate for WRITE operations (tx submission) only — reads are always mainnet */
  mainnetEnabled: process.env.XRPL_MAINNET_ENABLED === "true",
  /** demoMode now only applies to tx signing/submission — NOT to read queries */
  demoMode: false,
  explorerBase: "https://livenet.xrpl.org",
  /** TROPTIONS token — non-standard 9-char ticker encoded as 20-byte hex */
  troptionsHex: "54524F5054494F4E530000000000000000000000",
  troptionsIssuer:
    process.env.TROPTIONS_XRPL_ISSUER || "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
  feeWallet:
    process.env.TROPTIONS_XRPL_FEE_WALLET || "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
  reserveBase: 1,    // XRP base reserve (mainnet, subject to XRPL governance)
  reserveOwner: 0.2, // XRP per owned object (trustlines, offers, etc.)
  /** Unsigned transaction timeout in seconds — user must sign within this window */
  unsignedTxTtlSecs: 300,
} as const;

export type XrplNetwork = typeof xrplConfig.network;
