export type X402ProductStatus = 'public' | 'x402_gated' | 'disabled' | 'coming_soon';

export interface X402Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  audience: string;
  priceUsd: number;
  currency: 'USDC' | 'SOL' | 'free';
  network: 'solana' | 'xrpl' | 'polygon' | 'any' | 'none';
  status: X402ProductStatus;
  requiresPayment: boolean;
  noInvestmentAdviceDisclaimer: string;
  noBrokerDisclaimer: string;
  proofRequired: string;
}

export const X402_DISCLAIMER =
  'TROPTIONS provides intelligence infrastructure only. This is not investment advice, legal counsel, exchange operation, brokerage, custody, or market making. No financial outcomes are guaranteed.';

export const X402_PRODUCTS: X402Product[] = [
  {
    id: 'public-status',
    title: 'Public Ecosystem Status',
    slug: 'public-status',
    description: 'Truth-labeled status of all TROPTIONS ecosystem components. Free and open.',
    audience: 'Public',
    priceUsd: 0,
    currency: 'free',
    network: 'none',
    status: 'public',
    requiresPayment: false,
    noInvestmentAdviceDisclaimer: X402_DISCLAIMER,
    noBrokerDisclaimer: X402_DISCLAIMER,
    proofRequired: 'None — publicly accessible',
  },
  {
    id: 'partner-demo-report',
    title: 'Partner Demo Intelligence Report',
    slug: 'partner-demo-report',
    description:
      'Full partner readiness summary: blockers, claim rules, onboarding stages, proof surfaces.',
    audience: 'Partners, token projects, sponsors',
    priceUsd: 99,
    currency: 'USDC',
    network: 'solana',
    status: 'x402_gated',
    requiresPayment: true,
    noInvestmentAdviceDisclaimer: X402_DISCLAIMER,
    noBrokerDisclaimer: X402_DISCLAIMER,
    proofRequired: 'x402 payment receipt',
  },
  {
    id: 'token-proof-packet',
    title: 'Token Proof Packet Report',
    slug: 'token-proof-packet',
    description:
      'Full token proof checklist: wallet authority, tokenomics, legal status, liquidity plan, launch committee gates.',
    audience: 'Token issuers, investors, institutions',
    priceUsd: 249,
    currency: 'USDC',
    network: 'solana',
    status: 'x402_gated',
    requiresPayment: true,
    noInvestmentAdviceDisclaimer: X402_DISCLAIMER,
    noBrokerDisclaimer: X402_DISCLAIMER,
    proofRequired: 'x402 payment receipt + issuer identity',
  },
  {
    id: 'solana-dex-readiness',
    title: 'Solana DEX Readiness Report',
    slug: 'solana-dex-readiness',
    description:
      'Raydium, Jupiter, Meteora, Orca, Birdeye, DexScreener readiness for a specific token.',
    audience: 'Token issuers, liquidity teams',
    priceUsd: 199,
    currency: 'USDC',
    network: 'solana',
    status: 'x402_gated',
    requiresPayment: true,
    noInvestmentAdviceDisclaimer: X402_DISCLAIMER,
    noBrokerDisclaimer: X402_DISCLAIMER,
    proofRequired: 'x402 payment receipt + mint address',
  },
  {
    id: 'xrpl-issuer-readiness',
    title: 'XRPL Issuer Readiness Report',
    slug: 'xrpl-issuer-readiness',
    description: 'XRPL issuer trustline, flags, AMM, orderbook readiness analysis.',
    audience: 'XRPL token issuers',
    priceUsd: 199,
    currency: 'USDC',
    network: 'xrpl',
    status: 'x402_gated',
    requiresPayment: true,
    noInvestmentAdviceDisclaimer: X402_DISCLAIMER,
    noBrokerDisclaimer: X402_DISCLAIMER,
    proofRequired: 'x402 payment receipt + issuer address',
  },
  {
    id: 'enterprise-onboarding-review',
    title: 'Enterprise Onboarding Review',
    slug: 'enterprise-onboarding-review',
    description:
      'Client readiness review, MOU checklist, security readiness, launch committee gates.',
    audience: 'Large partners, institutions',
    priceUsd: 999,
    currency: 'USDC',
    network: 'solana',
    status: 'x402_gated',
    requiresPayment: true,
    noInvestmentAdviceDisclaimer: X402_DISCLAIMER,
    noBrokerDisclaimer: X402_DISCLAIMER,
    proofRequired: 'x402 payment receipt + NDA signed',
  },
  {
    id: 'ai-ecosystem-insight',
    title: 'AI Ecosystem Insight Report',
    slug: 'ai-ecosystem-insight',
    description:
      'RAG-generated insights from approved ecosystem status registries and public docs.',
    audience: 'Partners, builders, institutions',
    priceUsd: 49,
    currency: 'USDC',
    network: 'solana',
    status: 'coming_soon',
    requiresPayment: true,
    noInvestmentAdviceDisclaimer: X402_DISCLAIMER,
    noBrokerDisclaimer: X402_DISCLAIMER,
    proofRequired: 'x402 payment receipt',
  },
];
