// Solana Campaign Types — safe campaign asset architecture
// No investment claims. No custodial key handling.
// Mainnet enabled via NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true

export type CampaignAssetType =
  | 'merchant_namespace'
  | 'qr_campaign'
  | 'loyalty_reward'
  | 'nft_coupon'
  | 'vip_pass'
  | 'fan_tribute'
  | 'sponsor_offer'
  | 'local_giveaway'
  | 'event_promo';

export interface CampaignAssetInput {
  campaignType: CampaignAssetType;
  campaignName: string;
  businessName: string;
  namespaceSlug: string;
  description: string;
  cityOrEvent: string;
  offer: string;
  imageUrl?: string;
  expiration?: string;
  quantity: number;
  qrDestination?: string;
  poweredBy: 'TROPTIONS';
  builder: 'DONK AI';
  rails: 'Solana';
}

export interface CampaignAssetPreview {
  input: CampaignAssetInput;
  namespace: string;
  qrLink: string;
  metadataJson: CampaignNFTMetadata;
  network: 'devnet' | 'mainnet-beta';
  ready: boolean;
  warnings: string[];
}

export interface CampaignNFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
}

// Namespace sanitization — no spaces, no special chars except hyphen, lowercase
// Also guards against locked brand namespaces (see src/data/locked-namespaces.ts)
export function sanitizeNamespace(raw: string): string {
  const SYSTEM_RESERVED = ['admin', 'api', 'wallet', 'solana', 'support', 'fifa'];
  let slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (SYSTEM_RESERVED.includes(slug)) slug = slug + '-campaign';
  // Locked brand namespaces are appended with '-campaign' to avoid collision
  // Full protection enforced server-side via isLockedNamespace() in the save route
  const LOCKED_BRANDS = ['troptions','donk','donk-ai','unykorn','whichway','wwai','fth','fthx','apostle','apostle-chain','jefe','needai','need-ai','sovereign','troptions-wc2026','donk-wc2026','atlanta-2026','kenny','evl','usdf','atp'];
  if (LOCKED_BRANDS.includes(slug)) slug = slug + '-campaign';
  return slug;
}

export const CAMPAIGN_TYPE_LABELS: Record<CampaignAssetType, string> = {
  merchant_namespace: 'Merchant Namespace',
  qr_campaign: 'QR Campaign',
  loyalty_reward: 'Loyalty Reward',
  nft_coupon: 'NFT Coupon',
  vip_pass: 'VIP Pass',
  fan_tribute: 'Fan Tribute',
  sponsor_offer: 'Sponsor Offer',
  local_giveaway: 'Local Giveaway',
  event_promo: 'Event Promo',
};
