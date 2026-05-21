import { NextRequest, NextResponse } from 'next/server';
import { X402_DEMO_DISCLAIMER, X402_RECEIPT_VERIFICATION_NOTE } from '@/data/x402ReceiptModel';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: { receiptId?: string; productId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!body.receiptId) {
    return NextResponse.json({ ok: false, error: 'receipt_id_required' }, { status: 400 });
  }

  // All receipts in demo mode — real verification requires on-chain settlement infrastructure
  return NextResponse.json({
    ok: true,
    verified: false,
    status: 'x402_demo',
    receiptId: body.receiptId,
    productId: body.productId ?? null,
    isDemoReceipt: true,
    demo_note:
      'This is a demo verification endpoint. Real receipt verification requires configured Cloudflare Workers KV, on-chain tx confirmation, and wallet settlement infrastructure.',
    disclaimer: X402_DEMO_DISCLAIMER,
    verificationNote: X402_RECEIPT_VERIFICATION_NOTE,
  });
}
