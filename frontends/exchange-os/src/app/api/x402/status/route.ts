import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    x402_infrastructure: {
      catalog: 'ready',
      quote_engine: 'stub',
      receipt_verification: 'demo',
      payment_settlement: 'gated — requires configured wallet infrastructure',
      cloudflare_bindings: 'not_configured',
      on_chain_confirmation: 'not_configured',
      kv_receipt_store: 'not_configured',
    },
    modes: {
      demo: true,
      live_payments: false,
    },
    disclaimer:
      'TROPTIONS provides intelligence infrastructure only. This is not a payment processor, exchange, custodian, or broker/dealer. No financial outcomes are guaranteed.',
    updated: new Date().toISOString(),
  });
}
