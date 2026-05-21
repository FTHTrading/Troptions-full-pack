// TROPTIONS Exchange OS — Demo Data
// Used when mainnet/production is not configured.
// All values are illustrative only — not real market data.

export const DEMO_TOKENS = [
  {
    id: "troptions",
    name: "TROPTIONS",
    ticker: "TROPTIONS",
    issuer: "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3",
    description: "The TROPTIONS verified asset token on XRPL.",
    logoUrl: "/troptions/troptions-logo-2.jpg",
    verificationStatus: "verified" as const,
    riskLabels: ["VERIFIED_ISSUER", "TRUSTLINE_REQUIRED", "MAINNET_DISABLED"],
    price: 400.0,
    change24h: 0.0,
    volume24h: 125000,
    marketCap: 4000000,
    holders: 312,
    freezeEnabled: false,
    clawbackEnabled: false,
    launchSource: "Genesis",
    demoOnly: true,
  },
  {
    id: "legacy-iou",
    name: "LEGACY-TOKEN",
    ticker: "LEGACY",
    issuer: "rLEGACYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    description: "Demo legacy IOU token on XRPL DEX.",
    logoUrl: "/troptions/troptions-logo-2.jpg",
    verificationStatus: "unverified" as const,
    riskLabels: ["UNVERIFIED_ISSUER", "TRUSTLINE_REQUIRED", "NEW_LAUNCH", "FREEZE_ENABLED"],
    price: 0.842,
    change24h: 2.1,
    volume24h: 8500,
    marketCap: 84200,
    holders: 47,
    freezeEnabled: true,
    clawbackEnabled: false,
    launchSource: "Demo",
    demoOnly: true,
  },
  {
    id: "sovbnd",
    name: "SOVBND",
    ticker: "SOVBND",
    issuer: "rSOVBNDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    description: "Demo sovereign bond IOU.",
    logoUrl: "/troptions/troptions-logo-2.jpg",
    verificationStatus: "unverified" as const,
    riskLabels: ["UNVERIFIED_ISSUER", "TRUSTLINE_REQUIRED"],
    price: 0.116,
    change24h: -0.4,
    volume24h: 2200,
    marketCap: 11600,
    holders: 18,
    freezeEnabled: false,
    clawbackEnabled: false,
    launchSource: "Demo",
    demoOnly: true,
  },
];

export const DEMO_AMM_POOLS = [
  {
    id: "amm-troptions-xrp",
    asset1: { currency: "XRP", issuer: null },
    asset2: { currency: "TROPTIONS", issuer: "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3" },
    asset1Balance: "10000",
    asset2Balance: "25",
    tradingFee: "0.3%",
    lpTokenBalance: "Demo",
    priceImpact: "Demo",
    demoOnly: true,
  },
] as const;

export const DEMO_MARKET_DATA = [
  { pair: "XRP / TROPTIONS", venue: "XRPL DEX", price: "0.0025", change: "+0.0%", volume: "Demo", risk: "low" as const },
  { pair: "TROPTIONS / XRP", venue: "XRPL AMM", price: "400.00", change: "+0.0%", volume: "Demo", risk: "low" as const },
  { pair: "XRP / LEGACY", venue: "XRPL DEX", price: "0.842", change: "+2.1%", volume: "Demo", risk: "medium" as const },
  { pair: "USDF / XRP", venue: "Pathfinding", price: "1.000", change: "+0.0%", volume: "Demo", risk: "low" as const },
] as const;

export const DEMO_ADMIN_METRICS = {
  totalSwaps: 0,
  tokenLaunches: 0,
  ammPoolsTracked: 1,
  x402Requests: 0,
  x402PaidUnlocks: 0,
  x402ApiCalls: 0,
  creatorRewards: "$0.00",
  referralRewards: "$0.00",
  sponsorOffers: 0,
  walletConnects: 0,
  riskFlags: 0,
  proofPacketsGenerated: 0,
  totalVolumeUsd: 0,
  activeTokens: 3,
  totalCreators: 0,
  demoMode: true,
  productionMode: false,
} as const;

export const DEMO_WALLET = {
  address: "rDEMO...NotReal",
  xrpBalance: "0.00",
  trustLines: [] as string[],
  demoMode: true,
} as const;

export const demoDisclaimer =
  "All data shown is simulated for demonstration purposes only. " +
  "Configure production env vars (XRPL_MAINNET_ENABLED, X402_ENABLED) to connect to real data.";
