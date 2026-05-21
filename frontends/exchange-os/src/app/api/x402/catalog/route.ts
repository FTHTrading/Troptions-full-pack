import { NextResponse } from 'next/server';
import { X402_PRODUCTS, X402_DISCLAIMER } from '@/data/x402Products';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    disclaimer: X402_DISCLAIMER,
    infrastructure_note:
      'TROPTIONS provides intelligence infrastructure only. No brokerage, custody, or exchange operation.',
    products: X402_PRODUCTS,
    count: X402_PRODUCTS.length,
    payment_note:
      'Payment integration is gated. x402 settlement requires configured Cloudflare bindings and wallet infrastructure.',
  });
}
