import { NextResponse } from 'next/server';
import { X402_PRODUCTS, X402_DISCLAIMER } from '@/data/x402Products';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = X402_PRODUCTS.find((p) => p.id === id || p.slug === id);
  if (!product) {
    return NextResponse.json({ ok: false, error: 'product_not_found' }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    disclaimer: X402_DISCLAIMER,
    product,
  });
}
