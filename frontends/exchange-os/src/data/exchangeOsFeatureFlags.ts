import type { EcosystemStatusItem } from './ecosystem-status';
import { ECOSYSTEM_STATUS } from './ecosystem-status';

// TROPTIONS Exchange OS Feature Flags
// All mainnet, trading, and launch flags default to FALSE.
// Enable via environment variables in Cloudflare secrets — never in code.

export const EXCHANGE_OS_FEATURE_FLAGS = {
  XRPL_MAINNET_ENABLED: false,
  SOLANA_MAINNET_ENABLED: false,
  TOKEN_LAUNCH_ENABLED: false,
  LIVE_TRADING_ENABLED: false,
  PROOF_PACKET_GENERATION_ENABLED: false,
  PARTNER_INTAKE_ENABLED: true,
  READINESS_PAGES_ENABLED: true,
  API_STATIC_READINESS_ENABLED: true,
  // Confirmed live — do not set to false
  IMAGE_GENERATION_ENABLED: true,
  GOATX_MAINNET_PROOF_ENABLED: true,
} as const;

export type FeatureFlag = keyof typeof EXCHANGE_OS_FEATURE_FLAGS;

export function isEnabled(flag: FeatureFlag): boolean {
  const envOverride = process.env[`EXCHANGE_OS_${flag}`];
  if (envOverride !== undefined) return envOverride === 'true';
  return EXCHANGE_OS_FEATURE_FLAGS[flag];
}

export const FEATURE_FLAG_DESCRIPTIONS: Record<FeatureFlag, string> = {
  XRPL_MAINNET_ENABLED:
    'Enables live XRPL mainnet queries and unsigned transaction preparation. Requires XRPL RPC configured.',
  SOLANA_MAINNET_ENABLED:
    'Enables live Solana mainnet queries and unsigned transaction preparation. Requires Helius RPC configured.',
  TOKEN_LAUNCH_ENABLED:
    'Enables guided token launch flow. Requires proof packet complete and committee GO.',
  LIVE_TRADING_ENABLED:
    'Enables non-custodial trading interface. Requires mainnet enabled and monitoring active.',
  PROOF_PACKET_GENERATION_ENABLED:
    'Enables proof packet generation endpoint. Requires all required fields populated.',
  PARTNER_INTAKE_ENABLED:
    'Enables partner onboarding intake form and pipeline display.',
  READINESS_PAGES_ENABLED:
    'Enables institutional readiness and compliance pages.',
  API_STATIC_READINESS_ENABLED:
    'Enables static readiness and config API routes.',
  IMAGE_GENERATION_ENABLED:
    'Enables AI image generation via CF Workers AI / flux-1-schnell. Confirmed live.',
  GOATX_MAINNET_PROOF_ENABLED:
    'Enables GoatX mainnet proof display. Token confirmed on Solana mainnet with revoked authorities.',
};

// Claim types that require specific on-chain evidence before being shown publicly
type ClaimType =
  | 'tradable'
  | 'liquid'
  | 'verified'
  | 'indexed_on_jupiter'
  | 'chart_available'
  | 'goatx_mainnet'
  | 'image_generation_live'
  | 'exchange_os_pilot_ready';

interface ClaimEvidence {
  raydiumPoolAddress?: string;
  jupiterRouteConfirmed?: boolean;
  poolDepthUsd?: number;
  proofPacketComplete?: boolean;
  birdeyePageLive?: boolean;
  dexScreenerPageLive?: boolean;
}

/**
 * Determines whether a public claim can be shown based on on-chain evidence.
 * Never call this speculatively — only call with confirmed evidence.
 */
export function canShowPublicClaim(
  claimType: ClaimType,
  evidence: ClaimEvidence = {}
): { allowed: boolean; reason: string } {
  switch (claimType) {
    case 'tradable':
      if (!evidence.raydiumPoolAddress) {
        return { allowed: false, reason: 'No Raydium pool address — token is not tradable' };
      }
      if (!evidence.jupiterRouteConfirmed) {
        return { allowed: false, reason: 'Jupiter route not confirmed' };
      }
      return { allowed: true, reason: 'Raydium pool + Jupiter route confirmed' };

    case 'liquid':
      if (!evidence.raydiumPoolAddress) {
        return { allowed: false, reason: 'No DEX pool exists' };
      }
      if (!evidence.poolDepthUsd || evidence.poolDepthUsd < 1000) {
        return { allowed: false, reason: 'Pool depth below minimum threshold' };
      }
      return { allowed: true, reason: `Pool depth $${evidence.poolDepthUsd} confirmed` };

    case 'verified':
      if (!evidence.proofPacketComplete) {
        return { allowed: false, reason: 'Proof packet not complete' };
      }
      return { allowed: true, reason: 'Proof packet complete' };

    case 'indexed_on_jupiter':
      if (!evidence.jupiterRouteConfirmed) {
        return { allowed: false, reason: 'Jupiter route not confirmed — check after Raydium LP creation' };
      }
      return { allowed: true, reason: 'Jupiter route confirmed' };

    case 'chart_available':
      if (!evidence.birdeyePageLive && !evidence.dexScreenerPageLive) {
        return { allowed: false, reason: 'No DEX pool — no chart' };
      }
      return { allowed: true, reason: 'DEX chart page live' };

    case 'goatx_mainnet': {
      const item = ECOSYSTEM_STATUS.find((s: EcosystemStatusItem) => s.id === 'goatx-token');
      if (item?.status === 'mainnet_live') {
        return { allowed: true, reason: 'GoatX confirmed on Solana mainnet — authorities revoked' };
      }
      return { allowed: false, reason: 'GoatX mainnet status not confirmed in registry' };
    }

    case 'image_generation_live':
      return isEnabled('IMAGE_GENERATION_ENABLED')
        ? { allowed: true, reason: 'Image generation confirmed live (flux-1-schnell)' }
        : { allowed: false, reason: 'IMAGE_GENERATION_ENABLED is false' };

    case 'exchange_os_pilot_ready':
      return { allowed: true, reason: 'Exchange OS control layer live — all routes HTTP 200' };

    default:
      return { allowed: false, reason: 'Unknown claim type' };
  }
}
