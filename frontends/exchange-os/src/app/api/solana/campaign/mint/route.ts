import { NextRequest, NextResponse } from 'next/server';
import { getNetwork } from '@/lib/solana/network';

// TODO: Build and return a partially-signed Solana transaction for the client to complete.
// Client (wallet adapter) signs and submits — no private keys on server.
export async function POST(req: NextRequest) {
  const network = getNetwork();
  const body = await req.json().catch(() => ({}));
  if (!body.metadataUri || !body.payerAddress) {
    return NextResponse.json({ error: 'metadataUri and payerAddress required' }, { status: 400 });
  }
  // Stub: full Metaplex/Token Metadata wiring pending
  return NextResponse.json({
    ok: false,
    stub: true,
    network,
    message: 'Mint transaction construction pending. Full Metaplex integration required.',
    safetyRules: [
      'No private keys handled on server',
      'Non-custodial: client wallet signs only',
      'Devnet only until NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true',
      'Campaign assets are not investments or securities',
    ],
  });
}
