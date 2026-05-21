/**
 * TROPTIONS Television Network (TNN) Show Registry
 *
 * Defines official TNN shows and their purposes:
 * - TROPTIONS Founder Files
 * - Creator/NIL Spotlight
 * - Merchant Spotlight
 * - Charity Impact
 * - Web3 Made Simple
 */

export type TnnShowId =
  | 'troptions-founder-files'
  | 'creator-nil-spotlight'
  | 'merchant-spotlight'
  | 'charity-impact'
  | 'web3-made-simple';

export type TnnShowStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export interface TnnShowRecord {
  showId: TnnShowId;
  displayName: string;
  description: string;
  purpose: string;
  status: TnnShowStatus;
  targetAudience: string[];
  episodeFrequency: string;
  hostName?: string;
  bannerImageUrl?: string;
  targetEpisodeCount?: number;
  launchDate?: string;
}

/**
 * Official TNN shows
 */
export const TNN_SHOWS: Record<TnnShowId, TnnShowRecord> = {
  'troptions-founder-files': {
    showId: 'troptions-founder-files',
    displayName: 'TROPTIONS Founder Files',
    description: 'Documentary-style interviews exploring the TROPTIONS story, legacy tokens, and the new system',
    purpose:
      'Document the old TROPTIONS story, Bryan, Garland legacy, legacy tokens, old claims, and where the system is going',
    status: 'PLANNING',
    targetAudience: ['founders', 'holders', 'community'],
    episodeFrequency: 'bi-weekly',
    targetEpisodeCount: 6,
    launchDate: '2026-05-15',
  },
  'creator-nil-spotlight': {
    showId: 'creator-nil-spotlight',
    displayName: 'Creator/NIL Spotlight',
    description: 'Profiles, interviews, and campaigns with athletes, musicians, influencers, and entrepreneurs',
    purpose: 'Onboard and spotlight creators; build NIL campaign pipeline',
    status: 'PLANNING',
    targetAudience: ['creators', 'athletes', 'sponsors'],
    episodeFrequency: 'weekly',
    targetEpisodeCount: 52,
    launchDate: '2026-05-22',
  },
  'merchant-spotlight': {
    showId: 'merchant-spotlight',
    displayName: 'Merchant Spotlight',
    description: 'Local business interviews, merchant offers, charity tie-ins, and community impact stories',
    purpose: 'Help merchants get exposure; create GivBux/TROPTIONS Pay evidence pipeline',
    status: 'PLANNING',
    targetAudience: ['merchants', 'charities', 'community'],
    episodeFrequency: 'bi-weekly',
    targetEpisodeCount: 26,
    launchDate: '2026-06-01',
  },
  'charity-impact': {
    showId: 'charity-impact',
    displayName: 'Charity Impact',
    description: 'Nonprofit interviews, campaign stories, impact reports, and community fundraiser recaps',
    purpose: 'Document charity campaigns professionally; create verified impact proof',
    status: 'PLANNING',
    targetAudience: ['charities', 'donors', 'sponsors'],
    episodeFrequency: 'bi-weekly',
    targetEpisodeCount: 26,
    launchDate: '2026-06-01',
  },
  'web3-made-simple': {
    showId: 'web3-made-simple',
    displayName: 'Web3 Made Simple',
    description: 'Educational series explaining wallets, tokenization, NIL, RWA, legacy holder resolution',
    purpose: 'Educate audiences without hype; position TROPTIONS as credible and educational',
    status: 'PLANNING',
    targetAudience: ['general-audience', 'learners', 'families'],
    episodeFrequency: 'weekly',
    targetEpisodeCount: 52,
    launchDate: '2026-05-15',
  },
};

/**
 * Get show record by ID
 */
export function getTnnShow(showId: TnnShowId): TnnShowRecord | undefined {
  return TNN_SHOWS[showId];
}

/**
 * List all active shows
 */
export function getActiveTnnShows(): TnnShowRecord[] {
  return Object.values(TNN_SHOWS).filter((show) => show.status === 'ACTIVE' || show.status === 'PLANNING');
}

/**
 * Generate show description packet
 */
export function generateShowPacket(showId: TnnShowId): Record<string, unknown> | null {
  const show = getTnnShow(showId);
  if (!show) return null;

  return {
    showId: show.showId,
    displayName: show.displayName,
    description: show.description,
    purpose: show.purpose,
    status: show.status,
    targetAudience: show.targetAudience,
    episodeFrequency: show.episodeFrequency,
    hostName: show.hostName,
    targetEpisodeCount: show.targetEpisodeCount,
    launchDate: show.launchDate,
    disclaimer: TNN_DISCLAIMER,
  };
}

/**
 * Safety disclaimer for all TNN shows
 */
export const TNN_DISCLAIMER = `
TROPTIONS Television Network (TNN) operates as a content and media documentation platform.

IMPORTANT:
- No guaranteed sponsorships, income, views, or campaign outcomes
- All episodes require verified guest releases before publishing
- All sponsored content requires signed sponsor agreements before broadcasting
- Creator content does not guarantee fame, followers, or monetization
- Merchant spotlights do not guarantee customer acquisition
- Charity campaigns do not guarantee fundraising outcomes
- Educational content is for informational purposes only

All TNN operations remain simulation-only until platform approval.
Signatures, releases, and agreements are collected and simulated for planning purposes.
No live streaming, video delivery, sponsorship payments, or NFT minting is enabled.
`;
