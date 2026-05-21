// TROPTIONS Exchange OS — x402 Service Catalog

import type { X402Service } from "./types";

/** Full catalog of x402-gated premium services */
export const X402_SERVICES: X402Service[] = [
  {
    id: "token-risk-report",
    name: "Token Risk Report",
    description:
      "Full risk analysis of an XRPL token: issuer flags, freeze/clawback, liquidity depth, trustline requirements, and TROPTIONS verification status.",
    priceCents: 50,
    priceDisplay: "$0.50",
    network: "base",
    asset: "USDC",
    category: "report",
    available: true,
    demoAvailable: true,
    estimatedMs: 3000,
  },
  {
    id: "launch-readiness-report",
    name: "Launch Readiness Report",
    description:
      "Comprehensive token launch checklist: issuer controls, AMM setup, liquidity plan, reward policy, risk label coverage, and launch readiness score.",
    priceCents: 200,
    priceDisplay: "$2.00",
    network: "base",
    asset: "USDC",
    category: "report",
    available: true,
    demoAvailable: true,
    estimatedMs: 5000,
  },
  {
    id: "wallet-analytics-report",
    name: "Wallet Analytics Report",
    description:
      "Detailed XRPL wallet analysis: holdings, trustlines, transaction history, token concentration, AMM positions, and risk exposure.",
    priceCents: 100,
    priceDisplay: "$1.00",
    network: "base",
    asset: "USDC",
    category: "analytics",
    available: true,
    demoAvailable: true,
    estimatedMs: 4000,
  },
  {
    id: "holder-distribution-report",
    name: "Holder Distribution Report",
    description:
      "Token holder distribution analysis: top holders, concentration risk, whale wallets, and trustline growth over time.",
    priceCents: 150,
    priceDisplay: "$1.50",
    network: "base",
    asset: "USDC",
    category: "analytics",
    available: true,
    demoAvailable: true,
    estimatedMs: 5000,
  },
  {
    id: "liquidity-quality-report",
    name: "Liquidity Quality Report",
    description:
      "AMM and DEX liquidity depth analysis: pool balance, trading fees, price impact curves, and best-route recommendation.",
    priceCents: 150,
    priceDisplay: "$1.50",
    network: "base",
    asset: "USDC",
    category: "report",
    available: true,
    demoAvailable: true,
    estimatedMs: 4000,
  },
  {
    id: "sponsor-campaign-report",
    name: "Sponsor Campaign Report",
    description:
      "Full sponsor campaign analytics: reach, redemption rate, reward distribution, QR scan data, and ROI estimate.",
    priceCents: 500,
    priceDisplay: "$5.00",
    network: "base",
    asset: "USDC",
    category: "report",
    available: true,
    demoAvailable: true,
    estimatedMs: 6000,
  },
  {
    id: "ai-token-page-generator",
    name: "AI Token Page Generator",
    description:
      "Generate a professional TROPTIONS token page with AI-written description, issuer profile, risk summary, and reward policy.",
    priceCents: 300,
    priceDisplay: "$3.00",
    network: "base",
    asset: "USDC",
    category: "ai",
    available: true,
    demoAvailable: true,
    estimatedMs: 8000,
  },
  {
    id: "ai-launch-packet-builder",
    name: "AI Launch Packet Builder",
    description:
      "AI-assisted full launch packet: token configuration, issuer checklist, AMM plan, reward policy, risk labels, and proof packet.",
    priceCents: 1000,
    priceDisplay: "$10.00",
    network: "base",
    asset: "USDC",
    category: "ai",
    available: true,
    demoAvailable: true,
    estimatedMs: 15000,
  },
  {
    id: "premium-route-quote",
    name: "Premium Route Quote",
    description:
      "Real-time best-route swap quote with full path breakdown, slippage analysis, and fee estimation.",
    priceCents: 10,
    priceDisplay: "$0.10",
    network: "base",
    asset: "USDC",
    category: "api",
    available: true,
    demoAvailable: true,
    estimatedMs: 1000,
  },
  {
    id: "developer-api-call",
    name: "Developer API Call",
    description:
      "Pay-per-call access to Exchange OS APIs: token data, wallet analytics, AMM pools, risk labels, and proof packets.",
    priceCents: 1,
    priceDisplay: "$0.01",
    network: "base",
    asset: "USDC",
    category: "api",
    available: true,
    demoAvailable: true,
    estimatedMs: 500,
  },
];

export function getServiceById(id: string): X402Service | undefined {
  return X402_SERVICES.find((s) => s.id === id);
}

export function getServicesByCategory(
  category: X402Service["category"]
): X402Service[] {
  return X402_SERVICES.filter((s) => s.category === category);
}
