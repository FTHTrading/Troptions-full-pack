// TROPTIONS Exchange OS — Brand Configuration
// Safe defaults. No profit guarantees. Demo mode until production env is set.

export const brand = {
  name: "TROPTIONS",
  product: "TROPTIONS Live DEX",
  tagline: "Trade, launch, and verify XRPL assets.",
  poweredBy: "Powered by TROPTIONS Exchange OS",
  platformLine: "Professional XRPL Decentralized Exchange",
  url: "https://troptions.unykorn.org",
  support: "support@troptions.com",
  description:
    "Trade, launch, and verify XRPL assets in one professional decentralized exchange. Live order books, AMM liquidity, issuer verification, launch proof packets, and x402 intelligence rails.",
} as const;

// Brand color tokens — mirrors the existing Troptions CSS var system
export const colors = {
  background: "#071426",   // Deep Navy
  surface: "#0B0B0D",      // Ink Black
  gold: "#C9A24A",         // Institutional Gold
  goldMuted: "#A8873D",    // Muted Gold
  cyan: "#00D4FF",         // Electric Cyan (AI/exchange actions)
  green: "#22C55E",        // Verified/settled
  red: "#EF4444",          // Risk/error only
  ivory: "#F7F2E8",        // Light backgrounds
  slate: "#233044",        // Borders/subtext
  text: "#F7F2E8",
  textMuted: "#94A3B8",
} as const;

// Demo vs production label text
export const truthLabels = {
  demoMode: "Demo Mode — No real transactions. Configure production env vars to enable live trading.",
  mainnetLocked: "Mainnet is locked. Set XRPL_MAINNET_ENABLED=true and configure a wallet signer to enable.",
  x402Demo: "x402 payments are in demo mode. Set X402_ENABLED=true and X402_FACILITATOR_URL to enable.",
  walletRequired: "Connect a wallet to sign transactions. TROPTIONS never holds your keys.",
  riskWarning: "Trading, liquidity provision, and new asset launches carry risk. Nothing here is financial advice.",
} as const;
