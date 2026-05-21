import { NextRequest, NextResponse } from 'next/server';
import { getCampaignByNamespace } from '@/lib/campaigns/store';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ namespace: string }> },
) {
  const { namespace } = await params;
  if (!namespace) {
    return NextResponse.json({ error: 'namespace required' }, { status: 400 });
  }

  const campaign = await getCampaignByNamespace(namespace);
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found', namespace }, { status: 404 });
  }

  return NextResponse.json({ ok: true, campaign });
}
