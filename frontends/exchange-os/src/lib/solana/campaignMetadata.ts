// Campaign NFT metadata builder — Metaplex-compatible schema
import { type CampaignAssetInput, type CampaignNFTMetadata, sanitizeNamespace } from './campaignTypes';

const CAMPAIGN_BASE_URL = process.env.NEXT_PUBLIC_CAMPAIGN_BASE_URL ?? 'https://launch.unykorn.org';

export function buildCampaignMetadata(input: CampaignAssetInput): CampaignNFTMetadata {
  const ns = sanitizeNamespace(input.namespaceSlug);
  return {
    name: input.campaignName,
    symbol: ns.slice(0, 10).toUpperCase().replace(/-/g, ''),
    description: `${input.description} — Campaign asset created with DONK AI powered by TROPTIONS. For loyalty, access, rewards, and promotional utility only. Not an investment.`,
    image: input.imageUrl || `${CAMPAIGN_BASE_URL}/assets/campaign-placeholder.png`,
    external_url: `${CAMPAIGN_BASE_URL}/c/${ns}`,
    attributes: [
      { trait_type: 'campaign_type', value: input.campaignType },
      { trait_type: 'namespace', value: ns },
      { trait_type: 'merchant_or_tribute', value: input.businessName },
      { trait_type: 'city', value: input.cityOrEvent },
      { trait_type: 'reward_type', value: input.offer },
      { trait_type: 'qr_destination', value: input.qrDestination ?? `${CAMPAIGN_BASE_URL}/c/${ns}` },
      { trait_type: 'supply', value: input.quantity },
      { trait_type: 'expiration', value: input.expiration ?? 'none' },
      { trait_type: 'powered_by', value: 'TROPTIONS' },
      { trait_type: 'builder', value: 'DONK AI' },
      { trait_type: 'rails', value: 'Solana / UNYKORN' },
      { trait_type: 'asset_class', value: 'campaign_utility' },
      { trait_type: 'not_investment', value: 'true' },
      { trait_type: 'not_prediction_market', value: 'true' },
    ],
  };
}
