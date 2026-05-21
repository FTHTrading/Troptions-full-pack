import { NextRequest, NextResponse } from 'next/server';
import { saveCampaign, getCampaignByNamespace } from '@/lib/campaigns/store';
import { buildCampaignQrUrl } from '@/lib/solana/qr';
import { sanitizeNamespace } from '@/lib/solana/campaignTypes';
import type { CampaignAssetInput } from '@/lib/solana/campaignTypes';

export const dynamic = 'force-dynamic';

interface SaveRequestBody {
  input: CampaignAssetInput;
  payerAddress?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SaveRequestBody;
    const { input } = body;

    if (!input?.campaignName || !input?.businessName || !input?.namespaceSlug) {
      return NextResponse.json(
        { error: 'campaignName, businessName, and namespaceSlug are required' },
        { status: 400 },
      );
    }

    const namespace = sanitizeNamespace(input.namespaceSlug);
    if (!namespace) {
      return NextResponse.json({ error: 'Invalid namespace slug' }, { status: 400 });
    }

    // Check namespace uniqueness
    const existing = await getCampaignByNamespace(namespace);
    if (existing) {
      return NextResponse.json(
        { error: 'Namespace already taken', namespace, existingId: existing.id },
        { status: 409 },
      );
    }

    // Determine network (devnet by default — mainnet requires explicit opt-in)
    const mainnetEnabled = process.env.NEXT_PUBLIC_SOLANA_MAINNET_ENABLED === 'true';
    const network = mainnetEnabled ? 'mainnet-beta' : 'devnet';

    const qrUrl = buildCampaignQrUrl(namespace);

    const record = await saveCampaign({
      namespace,
      campaignName: input.campaignName,
      businessName: input.businessName,
      campaignType: input.campaignType,
      description: input.description ?? '',
      cityOrEvent: input.cityOrEvent ?? '',
      offer: input.offer ?? '',
      imageUrl: input.imageUrl,
      expiration: input.expiration,
      quantity: input.quantity ?? 1,
      qrDestination: input.qrDestination,
      qrUrl,
      network,
    });

    return NextResponse.json({ ok: true, campaign: record });
  } catch (err) {
    console.error('[campaign/save] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
