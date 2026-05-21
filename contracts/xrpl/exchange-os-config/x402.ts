// TROPTIONS Exchange OS — x402 Configuration
// x402 = HTTP 402 pay-per-use rail for premium services.
// Locked in demo mode until env vars are configured.

export const x402Config = {
  enabled: process.env.X402_ENABLED === "true",
  facilitatorUrl: process.env.X402_FACILITATOR_URL || "",
  receivingAddress: process.env.X402_RECEIVING_ADDRESS || "",
  defaultNetwork: (process.env.X402_NETWORK || "base") as
    | "base"
    | "ethereum"
    | "polygon"
    | "solana",
  defaultAsset: (process.env.X402_ASSET || "USDC") as "USDC" | "ETH" | "XRP",
  demoMode: process.env.X402_ENABLED !== "true",
  /** Protocol version this implementation targets */
  protocolVersion: "0.3.0",
  /** Maximum payment amount accepted (USD cents) — prevents over-charges */
  maxPaymentCents: 5000,
} as const;

export type X402Network = typeof x402Config.defaultNetwork;
export type X402Asset = typeof x402Config.defaultAsset;
