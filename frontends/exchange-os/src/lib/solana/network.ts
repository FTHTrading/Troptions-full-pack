// Solana network helpers — reads from env, mainnet-ready
// Set NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true to activate mainnet-beta
// Set NEXT_PUBLIC_SOLANA_RPC_URL to a high-reliability RPC (Helius recommended)
import { Connection, clusterApiUrl } from '@solana/web3.js';

export type SolanaNetwork = 'devnet' | 'mainnet-beta';

export function getNetwork(): SolanaNetwork {
  if (process.env.NEXT_PUBLIC_SOLANA_MAINNET_ENABLED === 'true') {
    return 'mainnet-beta';
  }
  return 'devnet';
}

export function getRpcUrl(): string {
  const custom = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  if (custom) return custom;
  return clusterApiUrl(getNetwork());
}

export function getConnection(): Connection {
  return new Connection(getRpcUrl(), 'confirmed');
}

export const TRUTH_LABELS = {
  DEVNET_READY: true,
  MAINNET_READY: true,
  MAINNET_ACTIVE: process.env.NEXT_PUBLIC_SOLANA_MAINNET_ENABLED === 'true',
  NON_CUSTODIAL: true,
  NO_INVESTMENT_CLAIMS: true,
  NO_PREDICTION_MARKETS: true,
  CAMPAIGN_UTILITY_ONLY: true,
} as const;
