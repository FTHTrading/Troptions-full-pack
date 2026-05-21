import { NextRequest, NextResponse } from 'next/server';
import { buildCampaignQrUrl, generateQrDataUrl } from '@/lib/solana/qr';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ns = searchParams.get('ns');
  if (!ns) {
    return NextResponse.json({ error: 'ns (namespace slug) required' }, { status: 400 });
  }
  const url = buildCampaignQrUrl(ns);
  const dataUrl = await generateQrDataUrl(url).catch(() => null);
  return NextResponse.json({ ok: true, namespace: ns, url, dataUrl });
}
