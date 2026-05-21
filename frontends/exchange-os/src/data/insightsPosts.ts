// Insights posts for TROPTIONS / UNYKORN
// All posts are draft — require human review before publishing
// No investment advice, price predictions, or yield language

export interface InsightsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
  audience: string;
  status: 'draft' | 'published' | 'archived';
  institutionalLanguage: boolean;
  disclaimer: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  body?: string;
}

const STANDARD_DISCLAIMER =
  'This content is for informational purposes only. It does not constitute investment advice, legal counsel, brokerage, exchange operation, or custody. No financial outcomes are guaranteed. TROPTIONS provides intelligence infrastructure only.';

export const INSIGHTS_POSTS: InsightsPost[] = [
  {
    id: 'exchange-os-architecture',
    slug: 'exchange-os-architecture',
    title: 'Exchange OS: Non-Custodial Institutional Exchange Infrastructure',
    excerpt:
      'An overview of the Exchange OS architecture: non-custodial routing, proof-based onboarding, launch committee gates, and compliance layers.',
    keywords: ['Exchange OS', 'non-custodial', 'institutional exchange', 'DEX infrastructure', 'compliance'],
    audience: 'Institutions, developers, token issuers',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-15',
    readingTime: '6 min',
    category: 'infrastructure',
    tags: ['exchange-os', 'architecture', 'institutional', 'non-custodial'],
  },
  {
    id: 'x402-payment-gated-intelligence',
    slug: 'x402-payment-gated-intelligence',
    title: 'x402: Payment-Gated Intelligence for Institutional Partners',
    excerpt:
      'How the x402 protocol enables payment-gated access to intelligence reports without exposing private data. Receipt-based verification model explained.',
    keywords: ['x402', 'payment gated', 'intelligence reports', 'on-chain access'],
    audience: 'Partners, developers, institutions',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-15',
    readingTime: '5 min',
    category: 'infrastructure',
    tags: ['x402', 'payments', 'access-control', 'receipts'],
  },
  {
    id: 'solana-dex-readiness-checklist',
    slug: 'solana-dex-readiness-checklist',
    title: 'Solana DEX Readiness: What Every Token Issuer Needs to Know',
    excerpt:
      'Raydium, Jupiter, Meteora, Orca, Birdeye, and DexScreener each have distinct readiness requirements. This post documents the checklist.',
    keywords: ['Solana DEX', 'Raydium', 'Jupiter', 'token readiness', 'DEX checklist'],
    audience: 'Token issuers, liquidity teams',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-14',
    readingTime: '7 min',
    category: 'infrastructure',
    tags: ['solana', 'dex', 'raydium', 'jupiter', 'liquidity'],
  },
  {
    id: 'token-proof-packet-explained',
    slug: 'token-proof-packet-explained',
    title: 'Token Proof Packet: What It Is and Why It Matters',
    excerpt:
      'The token proof packet is the institutional-grade documentation set required before a token can enter the Exchange OS launch process.',
    keywords: ['token proof', 'proof packet', 'issuer verification', 'launch committee'],
    audience: 'Token issuers, institutions, auditors',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-13',
    readingTime: '5 min',
    category: 'compliance',
    tags: ['proof', 'token-issuers', 'compliance', 'launch'],
  },
  {
    id: 'rwa-infrastructure-overview',
    slug: 'rwa-infrastructure-overview',
    title: 'RWA Infrastructure: Real World Asset Tokenization with TROPTIONS',
    excerpt:
      'An overview of how TROPTIONS infrastructure supports real world asset (RWA) tokenization: custody architecture, proof requirements, and exchange routing.',
    keywords: ['RWA', 'real world asset', 'tokenization', 'institutional', 'TROPTIONS'],
    audience: 'Institutions, asset managers, compliance teams',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-12',
    readingTime: '8 min',
    category: 'asset-classes',
    tags: ['RWA', 'tokenization', 'infrastructure', 'compliance'],
  },
  {
    id: 'launch-committee-process',
    slug: 'launch-committee-process',
    title: 'Launch Committee: How GO/NO-GO Decisions Are Made',
    excerpt:
      'The TROPTIONS Launch Committee enforces structured GO/NO-GO decisions before any token proceeds to live infrastructure. This post explains the process.',
    keywords: ['launch committee', 'GO/NO-GO', 'compliance gate', 'token approval'],
    audience: 'Token issuers, institutions, compliance teams',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-11',
    readingTime: '5 min',
    category: 'compliance',
    tags: ['launch-committee', 'compliance', 'governance'],
  },
  {
    id: 'xrpl-issuer-architecture',
    slug: 'xrpl-issuer-architecture',
    title: 'XRPL Token Issuance: Trustlines, AMM, and Orderbook Architecture',
    excerpt:
      'A technical overview of XRPL token issuance requirements: trustline configuration, AMM setup, orderbook readiness, and Exchange OS integration.',
    keywords: ['XRPL', 'trustline', 'AMM', 'orderbook', 'token issuance'],
    audience: 'XRPL token issuers, developers',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-10',
    readingTime: '7 min',
    category: 'infrastructure',
    tags: ['xrpl', 'trustline', 'amm', 'token'],
  },
  {
    id: 'ai-agents-in-institutional-workflows',
    slug: 'ai-agents-in-institutional-workflows',
    title: 'AI Agents in Institutional Workflows: Policy, Scope, and Limits',
    excerpt:
      'How TROPTIONS deploys AI agents in institutional workflows — what they can do, what they cannot do, and why read-only defaults matter.',
    keywords: ['AI agents', 'institutional AI', 'read-only agents', 'MCP policy', 'compliance AI'],
    audience: 'Institutions, developers, compliance teams',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-09',
    readingTime: '6 min',
    category: 'ai-agentic',
    tags: ['ai', 'agents', 'policy', 'compliance', 'read-only'],
  },
  {
    id: 'cloudflare-rag-for-institutional-data',
    slug: 'cloudflare-rag-for-institutional-data',
    title: 'Cloudflare RAG: Secure Vector Search for Institutional Intelligence',
    excerpt:
      'How TROPTIONS uses Cloudflare Vectorize and Workers AI to build a secure RAG layer for institutional intelligence. Bindings, sources, and policy.',
    keywords: ['Cloudflare RAG', 'Vectorize', 'Workers AI', 'institutional intelligence', 'vector search'],
    audience: 'Developers, institutions, technical partners',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-08',
    readingTime: '7 min',
    category: 'ai-agentic',
    tags: ['cloudflare', 'rag', 'vectorize', 'workers-ai'],
  },
  {
    id: 'multilingual-institutional-access',
    slug: 'multilingual-institutional-access',
    title: 'Multilingual Institutional Access: TROPTIONS in 11 Languages',
    excerpt:
      'TROPTIONS is building multilingual infrastructure to serve institutional partners across Africa, Asia, Europe, and Latin America. Status and roadmap.',
    keywords: ['multilingual', 'institutional access', 'global partners', 'TROPTIONS languages'],
    audience: 'International partners, institutions',
    status: 'draft',
    institutionalLanguage: true,
    disclaimer: STANDARD_DISCLAIMER,
    date: '2026-05-07',
    readingTime: '4 min',
    category: 'infrastructure',
    tags: ['multilingual', 'i18n', 'international', 'access'],
  },
];

export function getInsightsPost(slug: string): InsightsPost | undefined {
  return INSIGHTS_POSTS.find((p) => p.slug === slug);
}

export function getPublishedPosts(): InsightsPost[] {
  return INSIGHTS_POSTS.filter((p) => p.status === 'published');
}

export function getAllPosts(): InsightsPost[] {
  return INSIGHTS_POSTS;
}
