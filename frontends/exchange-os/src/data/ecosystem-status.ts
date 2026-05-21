// TROPTIONS / UNYKORN Ecosystem Status Registry
// TRUTH: Do not mark anything live without on-chain proof. Do not mark anything tradable without a confirmed DEX pool.

export type EcosystemItemStatus =
  | 'mainnet_live'
  | 'live'
  | 'live_local'
  | 'testnet'
  | 'devnet'
  | 'preview'
  | 'gated'
  | 'blocked'
  | 'pending_indexing'
  | 'required'
  | 'pilot_ready';

export interface EcosystemStatusItem {
  id: string;
  name: string;
  status: EcosystemItemStatus;
  truthLabel: string;
  chain?: string;
  domain?: string;
  routes?: string[];
  blockers?: string[];
  proofLinks?: string[];
  lastVerifiedAt: string;
  publicClaimAllowed: boolean;
  notes: string;
}

export const ECOSYSTEM_STATUS: EcosystemStatusItem[] = [
  {
    id: 'goatx-token',
    name: 'GoatX ($GOATX) SPL Token',
    status: 'mainnet_live',
    truthLabel: 'Mainnet · Confirmed · Authorities Revoked',
    chain: 'solana',
    domain: 'goat.unykorn.org',
    proofLinks: [
      'https://solscan.io/token/9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
      'https://explorer.solana.com/address/9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
    ],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: true,
    notes:
      '1B fixed supply. Mint and freeze authorities permanently revoked. Zero DEX pools until Raydium LP is created.',
  },
  {
    id: 'mint-registry',
    name: 'Mint Registry',
    status: 'live',
    truthLabel: 'Live · API confirmed',
    domain: 'launch.unykorn.org',
    routes: ['/mints', '/api/mints', '/api/mints/[id]', '/api/mints/verify'],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: true,
    notes:
      'GoatX seeded. Campaign mints stored on creation with status=preview until real tx.',
  },
  {
    id: 'fan-certificates',
    name: 'Fan Certificates / Campaign NFTs',
    status: 'preview',
    truthLabel: 'Preview Only · No tx yet',
    chain: 'solana',
    domain: 'launch.unykorn.org',
    blockers: [
      'NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true',
      'TRUST_WALLET_SECRET_KEY configured',
      'Launch committee GO',
    ],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes:
      'Preview/devnet unless real txSignature + mintAddress exists. Builder is live, minting is gated.',
  },
  {
    id: 'raydium-lp',
    name: 'Raydium LP (GoatX/SOL)',
    status: 'blocked',
    truthLabel: 'Not Created · Needs Treasury Capital',
    chain: 'solana',
    blockers: [
      '5-10 SOL capital (treasury decision)',
      'LP creation manual step',
    ],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes:
      'GoatX has zero DEX pools. Everything auto-follows after one Raydium pool is created.',
  },
  {
    id: 'jupiter-routing',
    name: 'Jupiter Routing',
    status: 'pending_indexing',
    truthLabel: 'Not Indexed · Depends on Raydium LP',
    chain: 'solana',
    blockers: ['Raydium LP must be created first'],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes: 'Auto-indexes within 24h of any DEX pool creation.',
  },
  {
    id: 'xrpl-order-books',
    name: 'XRPL Order Books',
    status: 'testnet',
    truthLabel: 'Testnet · XRPL_MAINNET_ENABLED=false',
    chain: 'xrpl',
    domain: 'troptionsexchange.unykorn.org',
    blockers: [
      'XRPL_MAINNET_ENABLED=true (Cloudflare secret)',
      'XRPL issuer wallet funding',
    ],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes:
      'All XRPL features currently testnet/demo. Enable with env var after issuer wallet is funded.',
  },
  {
    id: 'solana-mainnet-builder',
    name: 'Solana Mainnet Minting',
    status: 'gated',
    truthLabel: 'Gated · Mainnet disabled by default',
    chain: 'solana',
    domain: 'launch.unykorn.org',
    blockers: [
      'NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true (Vercel)',
      'TRUST_WALLET_SECRET_KEY (Vercel)',
      'Launch committee GO',
    ],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes:
      'Builder is live. Minting is devnet by default. One env var flip enables mainnet.',
  },
  {
    id: 'metaplex-collection',
    name: 'Metaplex Collection NFT',
    status: 'required',
    truthLabel: 'Not Created · Required for collectionVerified=true',
    chain: 'solana',
    blockers: [
      'Mint Metaplex collection NFT for TROPTIONS Fan Memories',
      'Add collectionAddress to approved-collections.ts',
    ],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes:
      'Required before NFTs can show collectionVerified=true. Low cost (~0.01 SOL).',
  },
  {
    id: 'helius-rpc',
    name: 'Helius Mainnet RPC',
    status: 'required',
    truthLabel: 'Required · Add to Vercel env',
    blockers: [
      'Add NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=KEY to Vercel',
    ],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes:
      'Enables Helius DAS for full NFT verification. Current RPC works but DAS provides richer data.',
  },
  {
    id: 'polygon-agents',
    name: 'Polygon TGOAT Agents',
    status: 'blocked',
    truthLabel: 'Blocked · Low MATIC',
    chain: 'polygon',
    domain: 'goat.unykorn.org',
    blockers: ['Fund Polygon gas wallet with MATIC'],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes:
      'Scalper, Herd Leader, Volume Engine all reporting Low MATIC — skipping trade.',
  },
  {
    id: 'image-generation',
    name: 'AI Image Generation',
    status: 'live',
    truthLabel: 'Live · flux-1-schnell confirmed',
    domain: 'launch.unykorn.org',
    routes: [
      '/api/image/generate',
      '/api/solana/campaign/generate-image',
    ],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: true,
    notes:
      'CF Workers AI / flux-1-schnell confirmed working. 518KB image returned in test.',
  },
  {
    id: 'exchange-os',
    name: 'TROPTIONS Exchange OS',
    status: 'pilot_ready',
    truthLabel: 'Pilot Ready · Partner Demo Safe',
    domain: 'troptionsexchange.unykorn.org',
    routes: [
      '/exchange-os',
      '/exchange-os/status',
      '/exchange-os/compare',
      '/exchange-os/control-center',
      '/exchange-os/readiness',
      '/exchange-os/solana-dex-map',
      '/exchange-os/partner-demo',
      '/admin/exchange',
    ],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: true,
    notes:
      'All routes live. XRPL correctly labeled testnet. GoatX shown as mainnet-live. Control layer only — not exchange operator.',
  },
  {
    id: 'x402-jefe',
    name: 'x402 / JEFE Gateway',
    status: 'live_local',
    truthLabel: 'Live · Local port 8402',
    domain: 'local',
    routes: ['http://127.0.0.1:8402/health'],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes: 'Local only. Not on public blockchain. JEFE kernel running.',
  },
  {
    id: 'apostle-chain',
    name: 'Apostle Chain',
    status: 'devnet',
    truthLabel: 'Dev Shim · chain-7332 local',
    domain: 'local',
    routes: ['http://127.0.0.1:7332/health'],
    lastVerifiedAt: '2026-05-15',
    publicClaimAllowed: false,
    notes:
      'Dev shim running on port 7332. Production Apostle binary not deployed.',
  },
];

export const LAST_ECOSYSTEM_AUDIT = '2026-05-15T22:00:00.000Z';

export function getStatusByChain(chain: string): EcosystemStatusItem[] {
  return ECOSYSTEM_STATUS.filter((s) => s.chain === chain);
}

export function getBlockers(): Array<{
  id: string;
  name: string;
  status: EcosystemItemStatus;
  blockers: string[] | undefined;
}> {
  return ECOSYSTEM_STATUS.filter(
    (s) => s.blockers && s.blockers.length > 0
  ).map((s) => ({
    id: s.id,
    name: s.name,
    status: s.status,
    blockers: s.blockers,
  }));
}

export function getPublicClaimAllowed(): EcosystemStatusItem[] {
  return ECOSYSTEM_STATUS.filter((s) => s.publicClaimAllowed);
}
