// Keyword strategy for TROPTIONS / UNYKORN SEO
// Institutional voice only — no investment/yield/guaranteed language

export interface KeywordCluster {
  id: string;
  name: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  targetPages: string[];
  audience: string;
  searchIntent: 'informational' | 'navigational' | 'commercial';
  priority: 'high' | 'medium' | 'low';
}

export const KEYWORD_CLUSTERS: KeywordCluster[] = [
  {
    id: 'exchange-os',
    name: 'Exchange OS Infrastructure',
    primaryKeyword: 'institutional exchange infrastructure',
    supportingKeywords: [
      'exchange OS',
      'non-custodial exchange',
      'compliant token launch',
      'DEX infrastructure',
      'launch committee',
      'proof-based exchange',
      'token launch protocol',
    ],
    targetPages: ['/exchange-os', '/exchange-os/readiness', '/exchange-os/control-center'],
    audience: 'Institutions, token issuers, compliance teams',
    searchIntent: 'informational',
    priority: 'high',
  },
  {
    id: 'troptions-token',
    name: 'TROPTIONS Token Infrastructure',
    primaryKeyword: 'TROPTIONS trade currency',
    supportingKeywords: [
      'TROPTIONS',
      'UNYKORN',
      'trade currency infrastructure',
      'RWA token',
      'real world asset tokenization',
      'institutional token',
      'TROPTIONS gold',
    ],
    targetPages: ['/troptions', '/mints', '/system/truth'],
    audience: 'Partners, institutions, token holders',
    searchIntent: 'navigational',
    priority: 'high',
  },
  {
    id: 'solana-dex',
    name: 'Solana DEX Readiness',
    primaryKeyword: 'Solana DEX integration',
    supportingKeywords: [
      'Raydium listing',
      'Jupiter aggregator',
      'Meteora liquidity',
      'Orca pool',
      'Birdeye analytics',
      'DexScreener listing',
      'Solana token launch',
      'SPL token',
    ],
    targetPages: ['/exchange-os/solana-dex-map', '/exchange-os/readiness'],
    audience: 'Token issuers, liquidity teams, DEX traders',
    searchIntent: 'commercial',
    priority: 'high',
  },
  {
    id: 'x402-intelligence',
    name: 'x402 Payment-Gated Intelligence',
    primaryKeyword: 'x402 payment protocol intelligence',
    supportingKeywords: [
      'x402 protocol',
      'payment gated API',
      'on-chain access control',
      'intelligence report',
      'partner readiness report',
      'token proof packet',
    ],
    targetPages: ['/x402', '/x402/catalog'],
    audience: 'Partners, developers, institutions',
    searchIntent: 'informational',
    priority: 'medium',
  },
  {
    id: 'ai-agents',
    name: 'AI Agent Infrastructure',
    primaryKeyword: 'institutional AI agent',
    supportingKeywords: [
      'exchange OS analyst',
      'token proof AI',
      'compliance AI agent',
      'RAG intelligence',
      'Cloudflare Workers AI',
      'AI ecosystem analysis',
    ],
    targetPages: ['/agents', '/agents/finder'],
    audience: 'Developers, institutions, partners',
    searchIntent: 'informational',
    priority: 'medium',
  },
  {
    id: 'compliance-proof',
    name: 'Compliance & Proof Infrastructure',
    primaryKeyword: 'token compliance infrastructure',
    supportingKeywords: [
      'proof packet',
      'token proof',
      'launch committee approval',
      'compliance checklist',
      'issuer verification',
      'XRPL issuer',
      'non-custodial compliance',
    ],
    targetPages: ['/exchange-os/proof-room', '/exchange-os/readiness'],
    audience: 'Auditors, institutions, compliance teams',
    searchIntent: 'commercial',
    priority: 'medium',
  },
];

// Phrases that must never appear in public-facing content
export const BANNED_KEYWORD_PHRASES: string[] = [
  'guaranteed returns',
  'guaranteed liquidity',
  'guaranteed volume',
  'passive income',
  'risk-free',
  'investment opportunity',
  'financial advice',
  'investment advice',
  'price prediction',
  'price will rise',
  'price will increase',
  'buy now',
  'get rich',
  'wealth generation',
  'yield farming',
  'staking rewards',  // only banned in investment-advice context
  'ROI',
  'APY',
  'APR',
  'earn money',
  'profit',
  'returns',
  'dividends',
  'market maker guarantee',
];

export const ALL_APPROVED_KEYWORDS = KEYWORD_CLUSTERS.flatMap((c) => [
  c.primaryKeyword,
  ...c.supportingKeywords,
]);
