import { NextRequest, NextResponse } from 'next/server';

// Returns on-chain-compatible metadata JSON for a campaign asset
// Used as the external_url or as a stub URI during devnet testing
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') ?? 'Campaign Asset';
  // Minimal stub metadata — real campaigns served from IPFS/Arweave after full mint flow
  return NextResponse.json({
    name,
    description: 'Campaign asset created with DONK AI powered by TROPTIONS. For loyalty, access, rewards, and promotional utility only. Not an investment.',
    attributes: [
      { trait_type: 'powered_by', value: 'TROPTIONS' },
      { trait_type: 'builder', value: 'DONK AI' },
      { trait_type: 'asset_class', value: 'campaign_utility' },
      { trait_type: 'not_investment', value: 'true' },
    ],
  });
}
