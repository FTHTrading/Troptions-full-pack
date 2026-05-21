import { NextRequest, NextResponse } from 'next/server';
import { buildCampaignMetadata } from '@/lib/solana/campaignMetadata';
import { prepareCampaignMint } from '@/lib/solana/mintCampaignAsset';
import { getNetwork } from '@/lib/solana/network';
import type { CampaignAssetInput } from '@/lib/solana/campaignTypes';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { input: CampaignAssetInput; payerAddress: string };
    if (!body.input || !body.payerAddress) {
      return NextResponse.json({ error: 'input and payerAddress required' }, { status: 400 });
    }
    const network = getNetwork();
    const metadata = buildCampaignMetadata(body.input);
    const prep = await prepareCampaignMint({ metadata, payerAddress: body.payerAddress, network });
    return NextResponse.json({ ok: true, network, metadata, ...prep });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
