// Campaign asset image generation via Cloudflare Workers AI
// Primary model: @cf/black-forest-labs/flux-1-schnell (8-step, fast, high quality)
// No external billing — uses existing CF account AI binding (free tier available)
// Falls back to stub placeholder when CF credentials are not configured
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    campaignName?: string;
    campaignType?: string;
    businessName?: string;
    offer?: string;
    style?: string;
  };

  const { campaignName = '', campaignType = '', businessName = '', offer = '', style } = body;

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_WORKERS_AI_TOKEN;

  if (!accountId || !token) {
    return NextResponse.json({
      ok: false,
      stub: true,
      placeholder: '/assets/campaign-placeholder.png',
      message: 'Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_WORKERS_AI_TOKEN to enable AI image generation',
    });
  }

  const prompt = buildCampaignImagePrompt({ campaignName, campaignType, businessName, offer, style });

  const cfRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, num_steps: 8 }),
    }
  );

  if (!cfRes.ok) {
    const errText = await cfRes.text();
    return NextResponse.json({ ok: false, error: errText }, { status: 500 });
  }

  const imageBuffer = await cfRes.arrayBuffer();
  const base64 = Buffer.from(imageBuffer).toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64}`;

  return NextResponse.json({
    ok: true,
    dataUrl,
    model: '@cf/black-forest-labs/flux-1-schnell',
    prompt,
  });
}

const STYLE_MAP: Record<string, string> = {
  merchant_namespace: 'modern business logo, clean professional, flat design, white background',
  nft_coupon: 'colorful coupon ticket, bold typography, promotional design, vibrant gradient',
  vip_pass: 'premium VIP card, gold accents, dark background, exclusive event access, luxury feel',
  fan_tribute: 'vibrant fan art, sports team colors, celebratory energy, stadium atmosphere',
  qr_campaign: 'clean marketing banner, modern retail aesthetic, geometric pattern, minimal',
  loyalty_reward: 'loyalty badge design, star motif, reward program visual, warm gold tones',
  sponsor_offer: 'sponsor banner, brand activation, event marketing, bold colors, corporate style',
  local_giveaway: 'festive giveaway poster, local community feel, friendly and approachable',
  event_promo: 'event promotional art, excitement, bold colors, dynamic composition',
};

function buildCampaignImagePrompt(params: {
  campaignName: string;
  campaignType: string;
  businessName: string;
  offer: string;
  style?: string;
}): string {
  const styleHint = params.style ?? STYLE_MAP[params.campaignType] ?? 'professional marketing design, clean layout';
  const parts = [
    `Campaign asset for "${params.campaignName}"`,
    params.businessName ? `by ${params.businessName}` : '',
    params.offer ? `featuring offer: ${params.offer}` : '',
    `Style: ${styleHint}`,
    'Suitable for Solana NFT metadata image. No text overlay. High quality, centered composition.',
  ].filter(Boolean);
  return parts.join('. ');
}
