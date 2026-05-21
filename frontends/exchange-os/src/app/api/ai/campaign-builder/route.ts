import { NextRequest, NextResponse } from 'next/server';
import type { CampaignAssetType } from '@/lib/solana/campaignTypes';

// Campaign builder suggestions — helps user fill the wizard form
// No AI key required: rule-based suggestions by campaign type
const SUGGESTIONS: Record<CampaignAssetType, { description: string; offer: string; disclaimer: string }> = {
  merchant_namespace: {
    description: 'Branded campaign identity for your local business on the TROPTIONS operating layer.',
    offer: 'Welcome customers with your branded namespace and QR campaign.',
    disclaimer: 'Merchant namespaces are for campaign identity and promotional engagement only. Not an investment.',
  },
  qr_campaign: {
    description: 'QR campaign that drives customers to your offer, coupon, or reward.',
    offer: '10% off your next visit — scan QR at the door to claim.',
    disclaimer: 'QR campaigns deliver promotional offers and loyalty rewards. Not a gambling product or investment.',
  },
  loyalty_reward: {
    description: 'Loyalty reward for repeat customers — earn points or claim a collectible.',
    offer: 'Earn 1 reward stamp per visit. Collect 5 for a free item.',
    disclaimer: 'Loyalty rewards are promotional utilities. Not investments or securities.',
  },
  nft_coupon: {
    description: 'Collectible digital coupon — a discount, event access, or local promo on Solana.',
    offer: '$5 off your next purchase — claimable once per holder.',
    disclaimer: 'NFT coupons are promotional collectibles. Not investments or financial instruments.',
  },
  vip_pass: {
    description: 'VIP access pass — event entry, loyalty tier recognition, or exclusive offer.',
    offer: 'VIP access to opening night — early entry and exclusive welcome gift.',
    disclaimer: 'VIP passes are access and recognition utilities. Not securities or investments.',
  },
  fan_tribute: {
    description: 'Commemorative fan tribute — celebrate a team, city, moment, or community.',
    offer: 'Scan to claim your fan collectible and access the tribute page.',
    disclaimer: 'Fan tributes are commemorative and community engagement assets. Not gambling or investment.',
  },
  sponsor_offer: {
    description: 'Sponsor activation — brand offer placed inside fan tributes and QR campaigns.',
    offer: 'Sponsored by [Your Brand] — claim a coupon or VIP offer inside.',
    disclaimer: 'Sponsor activations are promotional and advertising utilities. Not investments.',
  },
  local_giveaway: {
    description: 'Local community giveaway — scan QR to enter and claim your prize.',
    offer: 'Free item for the first 50 scans — scan to enter now.',
    disclaimer: 'Local giveaways are promotional campaigns. No purchase necessary. Not gambling.',
  },
  event_promo: {
    description: 'Event promotion — exclusive offer or access tied to a specific event.',
    offer: 'Event night special — 20% off for ticket holders. Scan to claim.',
    disclaimer: 'Event promos are promotional utilities for event attendees. Not investments.',
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') as CampaignAssetType | null;
  if (!type || !(type in SUGGESTIONS)) {
    return NextResponse.json({ error: 'valid campaign type required' }, { status: 400 });
  }
  return NextResponse.json({ ok: true, type, suggestion: SUGGESTIONS[type] });
}
