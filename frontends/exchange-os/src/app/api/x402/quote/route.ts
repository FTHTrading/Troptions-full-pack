import { NextRequest, NextResponse } from 'next/server';
import { X402_PRODUCTS, X402_DISCLAIMER } from '@/data/x402Products';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: { productId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const product = X402_PRODUCTS.find((p) => p.id === body.productId);
  if (!product) {
    return NextResponse.json({ ok: false, error: 'product_not_found' }, { status: 404 });
  }
  if (!product.requiresPayment) {
    return NextResponse.json({
      ok: true,
      quote: { productId: product.id, amountUsd: 0, currency: 'free', network: 'none' },
      disclaimer: X402_DISCLAIMER,
    });
  }

  return NextResponse.json({
    ok: true,
    quote: {
      productId: product.id,
      title: product.title,
      amountUsd: product.priceUsd,
      currency: product.currency,
      network: product.network,
      status: 'stub',
      stub_note:
        'Quote generation is a stub. Real x402 payment settlement requires configured wallet infrastructure and Cloudflare bindings.',
      proofRequired: product.proofRequired,
    },
    disclaimer: X402_DISCLAIMER,
  });
}
