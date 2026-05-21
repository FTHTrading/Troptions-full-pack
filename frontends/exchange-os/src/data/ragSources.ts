// RAG Source Registry — defines approved and prohibited data sources for AI agents

export interface RagSource {
  id: string;
  name: string;
  category: string;
  description?: string;
  approved: boolean;
  requiresPayment: boolean;
  updateFrequency: string;
  status: 'active' | 'draft' | 'pending' | 'disabled';
}

export const RAG_SOURCES: RagSource[] = [
  // Approved public sources
  { id: 'ecosystem-status',         name: 'Ecosystem Status Registry',        category: 'infrastructure', approved: true,  requiresPayment: false, updateFrequency: 'daily',   status: 'active' },
  { id: 'exchange-os-status',       name: 'Exchange OS Status',               category: 'exchange',       approved: true,  requiresPayment: false, updateFrequency: 'daily',   status: 'active' },
  { id: 'blockers',                 name: 'Mainnet Blockers List',            category: 'launch',         approved: true,  requiresPayment: false, updateFrequency: 'daily',   status: 'active' },
  { id: 'feature-flags',            name: 'Exchange OS Feature Flags',        category: 'exchange',       approved: true,  requiresPayment: false, updateFrequency: 'weekly',  status: 'active' },
  { id: 'proof-packet-requirements',name: 'Token Proof Packet Requirements',  category: 'proof',          approved: true,  requiresPayment: false, updateFrequency: 'monthly', status: 'active' },
  { id: 'claim-rules',              name: 'Claim Rules',                      category: 'proof',          approved: true,  requiresPayment: false, updateFrequency: 'monthly', status: 'active' },
  { id: 'solana-dex-registry',      name: 'Solana DEX Registry',             category: 'solana',         approved: true,  requiresPayment: false, updateFrequency: 'weekly',  status: 'active' },
  { id: 'xrpl-dex-registry',        name: 'XRPL DEX Registry',               category: 'xrpl',           approved: true,  requiresPayment: false, updateFrequency: 'weekly',  status: 'active' },
  { id: 'launch-committee-controls',name: 'Launch Committee Controls',        category: 'compliance',     approved: true,  requiresPayment: false, updateFrequency: 'monthly', status: 'active' },
  { id: 'enterprise-client-onboarding', name: 'Enterprise Client Onboarding', category: 'onboarding',   approved: true,  requiresPayment: false, updateFrequency: 'monthly', status: 'active' },
  { id: 'partner-onboarding',       name: 'Partner Onboarding Data',         category: 'onboarding',     approved: true,  requiresPayment: false, updateFrequency: 'monthly', status: 'active' },
  { id: 'x402-products',            name: 'x402 Product Catalog',            category: 'payments',       approved: true,  requiresPayment: false, updateFrequency: 'weekly',  status: 'active' },
  { id: 'keyword-strategy',         name: 'Keyword Strategy Registry',        category: 'seo',            approved: true,  requiresPayment: false, updateFrequency: 'monthly', status: 'active' },
  { id: 'insights-posts',           name: 'Published Insights Posts',        category: 'content',        approved: true,  requiresPayment: false, updateFrequency: 'weekly',  status: 'active' },
  { id: 'approved-docs',            name: 'Approved Public Documentation',   category: 'docs',           approved: true,  requiresPayment: false, updateFrequency: 'monthly', status: 'active' },
  { id: 'languages',                name: 'Supported Languages Registry',    category: 'i18n',           approved: true,  requiresPayment: false, updateFrequency: 'monthly', status: 'active' },
  { id: 'mainnet-readiness',        name: 'Mainnet Readiness Checklist',     category: 'launch',         approved: true,  requiresPayment: false, updateFrequency: 'daily',   status: 'active' },
  // x402-gated sources
  { id: 'x402-receipts-public',     name: 'x402 Receipt Public Index',       category: 'payments',       approved: true,  requiresPayment: true,  updateFrequency: 'realtime', status: 'pending' },
  { id: 'enterprise-reports',       name: 'Enterprise Intelligence Reports', category: 'intelligence',   approved: true,  requiresPayment: true,  updateFrequency: 'on-demand', status: 'pending' },
];

// Sources that are never permitted for RAG, regardless of payment
export const PROHIBITED_RAG_SOURCES: string[] = [
  'private-keys',
  'wallet-seeds',
  'env-variables',
  'api-secrets',
  'user-pii',
  'legal-strategy-docs',
  'unreleased-tokenomics',
  'internal-employee-data',
];

export const APPROVED_SOURCES = RAG_SOURCES.filter((s) => s.approved && s.status === 'active');
export const FREE_SOURCES = APPROVED_SOURCES.filter((s) => !s.requiresPayment);
export const GATED_SOURCES = APPROVED_SOURCES.filter((s) => s.requiresPayment);
