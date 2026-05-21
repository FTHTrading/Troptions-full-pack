export interface ProofCard {
  id: string;
  title: string;
  description: string;
  proofType: 'on-chain' | 'architectural' | 'operational' | 'governance';
  verified: boolean;
  evidence?: string;
  evidenceLink?: string;
}

export interface PublicClaimRule {
  id: string;
  category: string;
  allowed: boolean;
  claimText: string;
  condition?: string;
}

export const PROOF_CARDS: ProofCard[] = [
  {
    id: 'mint-proof',
    title: 'SPL Mint Proof',
    description: 'Token mint address is publicly verifiable on Solscan. Supply is fixed and visible to anyone.',
    proofType: 'on-chain',
    verified: true,
    evidence: 'GoatX mint: 9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
    evidenceLink: 'https://solscan.io/token/9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
  },
  {
    id: 'wallet-authority',
    title: 'Wallet Authority Verification',
    description: 'Mint and freeze authorities are permanently revoked on-chain. No party can alter the supply or freeze wallets.',
    proofType: 'on-chain',
    verified: true,
    evidence: 'Mint authority: null. Freeze authority: null. Permanently revoked.',
    evidenceLink: 'https://solscan.io/token/9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
  },
  {
    id: 'liquidity-readiness',
    title: 'Liquidity Readiness Mapping',
    description: 'TROPTIONS maps the DEX venues and liquidity readiness for each token. It does not create or guarantee liquidity.',
    proofType: 'operational',
    verified: true,
    evidence: 'Raydium LP: not yet created (requires treasury capital decision)',
  },
  {
    id: 'launch-committee',
    title: 'Launch Committee Gate',
    description: 'No mainnet trading claims are authorized without written launch committee GO. This gate is enforced in the codebase.',
    proofType: 'governance',
    verified: true,
    evidence: 'Feature flag NEXT_PUBLIC_SOLANA_MAINNET_ENABLED defaults to FALSE. Committee GO required to enable.',
  },
  {
    id: 'market-monitoring',
    title: 'Market Monitoring Infrastructure',
    description: 'Exchange OS tracks DEX venues, indexer status, and pool depth. Monitoring is observational — not trade execution.',
    proofType: 'operational',
    verified: true,
    evidence: 'Solana DEX map live at /exchange-os/solana-dex-map',
  },
  {
    id: 'non-custodial',
    title: 'Non-Custodial Architecture',
    description: 'TROPTIONS never holds, controls, or manages client funds, tokens, or wallet keys. This is an architectural constraint, not a marketing claim.',
    proofType: 'architectural',
    verified: true,
    evidence: 'Non-custodial route model enforced via feature flags and API route guards',
  },
];

export const GOATX_PROOF = {
  name: 'GoatX',
  mintAddress: '9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
  solscanLink: 'https://solscan.io/token/9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
  network: 'Solana Mainnet',
  mintAuthorityRevoked: true,
  freezeAuthorityRevoked: true,
  metaplexMetadataSubmitted: false,
  raydiumLpCreated: false,
  lpLocked: false,
  notes: 'First TROPTIONS-verified Solana mainnet SPL token. No DEX pool yet — requires treasury capital for Raydium LP.',
} as const;

export const PUBLIC_CLAIM_RULES: PublicClaimRule[] = [
  {
    id: 'demo-ready',
    category: 'Platform Status',
    allowed: true,
    claimText: 'TROPTIONS Exchange OS is live and partner-demo ready.',
    condition: 'Always allowed. All demo routes return 200.',
  },
  {
    id: 'goatx-mainnet',
    category: 'Token Proof',
    allowed: true,
    claimText: 'GoatX is a confirmed Solana mainnet SPL token with revoked authorities.',
    condition: 'Always allowed. On-chain proof is publicly verifiable.',
  },
  {
    id: 'non-custodial',
    category: 'Architecture',
    allowed: true,
    claimText: 'TROPTIONS is non-custodial and never holds client tokens or funds.',
    condition: 'Always allowed. Architectural fact.',
  },
  {
    id: 'institutional-tooling',
    category: 'Platform Description',
    allowed: true,
    claimText: 'TROPTIONS provides institutional tooling for tokenized market readiness.',
    condition: 'Always allowed.',
  },
  {
    id: 'partner-intake',
    category: 'Business',
    allowed: true,
    claimText: 'TROPTIONS is currently accepting partner intake applications.',
    condition: 'Allowed while intake pipeline is active.',
  },
  {
    id: 'live-trading',
    category: 'Trading',
    allowed: false,
    claimText: 'Live trading is available.',
    condition: 'GATED. Requires LP creation, flag activation, and committee GO.',
  },
  {
    id: 'guaranteed-liquidity',
    category: 'Liquidity',
    allowed: false,
    claimText: 'Guaranteed liquidity.',
    condition: 'NEVER ALLOWED. Liquidity cannot be guaranteed.',
  },
  {
    id: 'guaranteed-volume',
    category: 'Trading',
    allowed: false,
    claimText: 'Guaranteed trading volume.',
    condition: 'NEVER ALLOWED.',
  },
  {
    id: 'investment-opportunity',
    category: 'Investment',
    allowed: false,
    claimText: 'Investment opportunity.',
    condition: 'NEVER ALLOWED. TROPTIONS is not an investment adviser.',
  },
  {
    id: 'exchange-operator',
    category: 'Business',
    allowed: false,
    claimText: 'We are an exchange.',
    condition: 'NEVER ALLOWED. Factually false.',
  },
  {
    id: 'custody-claim',
    category: 'Architecture',
    allowed: false,
    claimText: 'We manage your assets.',
    condition: 'NEVER ALLOWED. Factually false.',
  },
  {
    id: 'yield-generation',
    category: 'Finance',
    allowed: false,
    claimText: 'Yield generation.',
    condition: 'NEVER ALLOWED without specific legal and product review.',
  },
];

export const TOKEN_PROOF_PACKET_REQUIREMENTS = [
  { id: 'mint-address', label: 'Token mint address (Solscan link)', required: true },
  { id: 'supply-snapshot', label: 'Total supply snapshot', required: true },
  { id: 'mint-authority', label: 'Mint authority revocation proof (tx signature)', required: true },
  { id: 'freeze-authority', label: 'Freeze authority revocation proof (tx signature)', required: true },
  { id: 'metaplex-metadata', label: 'Metaplex metadata submitted (name, logo, website)', required: true },
  { id: 'wallet-audit', label: 'Treasury wallet addresses (public only) with multisig plan', required: true },
  { id: 'distribution-plan', label: 'Token distribution plan', required: true },
  { id: 'legal-memo', label: 'Legal classification memo', required: true },
  { id: 'collection-nft', label: 'Metaplex collection NFT (for campaign NFTs)', required: false },
  { id: 'lp-plan', label: 'Raydium LP creation plan with capital source', required: false },
];

export const PROOF_ROOM_TRUTH_BANNER =
  'TROPTIONS proves what exists on-chain. It does not guarantee trading, liquidity, price, or returns.';
