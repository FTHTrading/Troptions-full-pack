export type ExchangeItemStatus =
  | 'live'
  | 'testnet'
  | 'devnet'
  | 'demo'
  | 'planned'
  | 'broken'
  | 'missing';

export interface ExchangeStatusItem {
  id: string;
  name: string;
  category: 'xrpl' | 'solana' | 'x402' | 'proof' | 'wallet' | 'admin' | 'infrastructure';
  status: ExchangeItemStatus;
  network?: string;
  route?: string;
  envVarsNeeded?: string[];
  proofNeeded?: string;
  nextAction: string;
  blockedBy?: string;
}

export const EXCHANGE_STATUS: ExchangeStatusItem[] = [
  // XRPL
  {
    id: 'xrpl-order-book',
    name: 'XRPL Order Book',
    category: 'xrpl',
    status: 'testnet',
    network: 'XRPL Testnet',
    route: '/exchange-os/trade',
    envVarsNeeded: ['XRPL_MAINNET_ENABLED'],
    nextAction: 'Set XRPL_MAINNET_ENABLED=true to go live',
    blockedBy: 'env var',
  },
  {
    id: 'xrpl-amm',
    name: 'XRPL AMM Pools',
    category: 'xrpl',
    status: 'testnet',
    network: 'XRPL Testnet',
    route: '/exchange-os/earn',
    envVarsNeeded: ['XRPL_MAINNET_ENABLED'],
    nextAction: 'Enable mainnet',
    blockedBy: 'env var',
  },
  {
    id: 'xrpl-token-launch',
    name: 'XRPL Token Launch',
    category: 'xrpl',
    status: 'testnet',
    route: '/exchange-os/launch',
    envVarsNeeded: ['XRPL_MAINNET_ENABLED', 'XRPL_ISSUER_WALLET'],
    nextAction: 'Enable mainnet + fund issuer wallet',
    blockedBy: 'env var + capital',
  },
  {
    id: 'xrpl-proof-packets',
    name: 'XRPL Proof Packets',
    category: 'proof',
    status: 'demo',
    route: '/exchange-os/creator',
    nextAction: 'Wire to real XRPL transactions when mainnet enabled',
  },
  {
    id: 'xrpl-issuer-verify',
    name: 'XRPL Issuer Verification',
    category: 'xrpl',
    status: 'demo',
    route: '/exchange-os/readiness',
    nextAction: 'Connect to real XRPL account data',
  },
  // Solana
  {
    id: 'solana-dex-map',
    name: 'Solana DEX Map',
    category: 'solana',
    status: 'live',
    route: '/exchange-os/solana-dex-map',
    nextAction: 'Add live pool data when LP created',
  },
  {
    id: 'solana-raydium',
    name: 'Raydium LP Integration',
    category: 'solana',
    status: 'planned',
    network: 'mainnet-beta',
    nextAction: 'Create GoatX/SOL pool on Raydium — needs 5-10 SOL capital',
    blockedBy: 'capital',
  },
  {
    id: 'solana-meteora',
    name: 'Meteora DLMM',
    category: 'solana',
    status: 'planned',
    nextAction: 'Wire after Raydium LP exists',
  },
  {
    id: 'solana-jupiter',
    name: 'Jupiter Routing',
    category: 'solana',
    status: 'planned',
    nextAction: 'Auto-available after any DEX pool is live',
  },
  {
    id: 'solana-goatx-token',
    name: 'GoatX SPL Token',
    category: 'solana',
    status: 'live',
    network: 'mainnet-beta',
    proofNeeded: '9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
    nextAction: 'Create LP pool — token is live, pool is missing',
  },
  {
    id: 'solana-campaign-mints',
    name: 'TROPTIONS Campaign Mints',
    category: 'solana',
    status: 'devnet',
    network: 'devnet',
    envVarsNeeded: [
      'NEXT_PUBLIC_SOLANA_MAINNET_ENABLED',
      'TRUST_WALLET_SECRET_KEY',
      'NEXT_PUBLIC_SOLANA_RPC_URL',
    ],
    nextAction: 'Set NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true in Vercel',
    blockedBy: 'env var',
  },
  // x402
  {
    id: 'x402-intelligence',
    name: 'x402 Intelligence Layer',
    category: 'x402',
    status: 'live',
    network: 'local',
    route: '/exchange-os/x402',
    nextAction: 'JEFE kernel running on port 8402 — connect to exchange OS display',
  },
  {
    id: 'apostle-proof',
    name: 'Apostle Chain Proof Logging',
    category: 'proof',
    status: 'testnet',
    network: 'chain-7332 (dev shim)',
    nextAction: 'Wire to real Apostle chain when mainnet available',
  },
  // Wallet
  {
    id: 'wallet-xrpl',
    name: 'XRPL Wallet Connect',
    category: 'wallet',
    status: 'demo',
    envVarsNeeded: ['XRPL_MAINNET_ENABLED'],
    nextAction: 'Enable with mainnet',
  },
  {
    id: 'wallet-solana',
    name: 'Solana Wallet Adapter',
    category: 'wallet',
    status: 'devnet',
    route: '/exchange-os',
    envVarsNeeded: ['NEXT_PUBLIC_SOLANA_MAINNET_ENABLED'],
    nextAction: 'Phantom/Solflare connect — needs mainnet flag',
  },
  // Admin
  {
    id: 'admin-exchange',
    name: 'Admin Exchange Dashboard',
    category: 'admin',
    status: 'missing',
    route: '/admin/exchange',
    nextAction: 'Create /admin/exchange page',
  },
  {
    id: 'admin-launches',
    name: 'Launch Registry',
    category: 'admin',
    status: 'missing',
    nextAction: 'Track all token launches with tx signatures',
  },
  {
    id: 'admin-proof-packets',
    name: 'Proof Packet Registry',
    category: 'proof',
    status: 'demo',
    nextAction: 'Wire to real mint/tx data',
  },
];

export const EXCHANGE_MAINNET_BLOCKERS = [
  {
    item: 'XRPL mainnet',
    action: 'Set XRPL_MAINNET_ENABLED=true in Cloudflare Worker secrets',
    type: 'env' as const,
  },
  {
    item: 'Solana mainnet minting',
    action: 'Set NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true in Vercel',
    type: 'env' as const,
  },
  {
    item: 'GoatX DEX liquidity',
    action: 'Create Raydium LP with 5-10 SOL capital',
    type: 'capital' as const,
  },
  {
    item: 'XRPL issuer wallet',
    action: 'Fund XRPL issuer wallet for token launches',
    type: 'capital' as const,
  },
  {
    item: 'Apostle chain mainnet',
    action: 'Deploy production Apostle binary (currently dev shim)',
    type: 'infra' as const,
  },
];

export const STATUS_BADGE: Record<
  ExchangeItemStatus,
  { label: string; color: string; bg: string }
> = {
  live:     { label: 'Live',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  testnet:  { label: 'Testnet',  color: '#eab308', bg: 'rgba(234,179,8,0.12)'   },
  devnet:   { label: 'Devnet',   color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
  demo:     { label: 'Demo',     color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  planned:  { label: 'Planned',  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  broken:   { label: 'Broken',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  missing:  { label: 'Missing',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
};
