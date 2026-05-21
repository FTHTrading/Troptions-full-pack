import { NextRequest, NextResponse } from 'next/server';

// AI chat route — provider-agnostic stub
// Set AI_ASSISTANT_ENABLED=true + AI_GATEWAY_URL or OPENAI_API_KEY to connect
const AI_ENABLED = process.env.AI_ASSISTANT_ENABLED === 'true';
const AI_PROVIDER = process.env.AI_PROVIDER ?? 'stub';
const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL ?? '';

const STUB_RESPONSES = [
  "I can help you build a merchant campaign, fan tribute, or QR offer. What type of campaign are you creating?",
  "Choose a campaign type: Merchant Namespace, QR Campaign, Loyalty Reward, NFT Coupon, VIP Pass, Fan Tribute, Sponsor Offer, Local Giveaway, or Event Promo.",
  "Your namespace is your campaign identity. Use your business name, lowercase, hyphenated. Example: my-shop or event-2026.",
  "All campaigns are devnet by default. Safe, non-custodial, no investment claims.",
  "DONK AI builds the campaign. TROPTIONS powers the operating layer. UNYKORN gives your campaign a namespace.",
];
let stubIndex = 0;

export async function POST(req: NextRequest) {
  const { message, mode } = await req.json().catch(() => ({ message: '', mode: 'launch-guide' }));
  if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 });

  if (!AI_ENABLED || AI_PROVIDER === 'stub' || !AI_GATEWAY_URL) {
    const reply = STUB_RESPONSES[stubIndex % STUB_RESPONSES.length];
    stubIndex++;
    return NextResponse.json({
      reply,
      provider: 'stub',
      aiEnabled: false,
      notice: 'AI runtime not connected. Set AI_ASSISTANT_ENABLED=true and AI_GATEWAY_URL to connect.',
    });
  }

  // Live provider — forward to gateway
  try {
    const res = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}` },
      body: JSON.stringify({ message, mode }),
    });
    const data = await res.json();
    return NextResponse.json({ reply: data.reply ?? data.content ?? '', provider: AI_PROVIDER, aiEnabled: true });
  } catch (err) {
    return NextResponse.json({ reply: STUB_RESPONSES[0], provider: 'stub', aiEnabled: false, error: String(err) });
  }
}
