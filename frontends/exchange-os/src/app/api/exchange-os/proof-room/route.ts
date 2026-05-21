import { NextResponse } from 'next/server';
import { PROOF_CARDS, GOATX_PROOF, PUBLIC_CLAIM_RULES, TOKEN_PROOF_PACKET_REQUIREMENTS, PROOF_ROOM_TRUTH_BANNER } from '@/data/clientProofRoom';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    truthBanner: PROOF_ROOM_TRUTH_BANNER,
    truthLabel: 'TROPTIONS proves on-chain facts. No trading, liquidity, or return guarantees are made or implied.',
    noCustodyDisclaimer: 'TROPTIONS is not an exchange, broker-dealer, custodian, or investment adviser.',
    proofCards: PROOF_CARDS,
    goatxProof: GOATX_PROOF,
    publicClaimRules: PUBLIC_CLAIM_RULES,
    tokenProofPacketRequirements: TOKEN_PROOF_PACKET_REQUIREMENTS,
    allowedClaims: PUBLIC_CLAIM_RULES.filter(r => r.allowed),
    prohibitedClaims: PUBLIC_CLAIM_RULES.filter(r => !r.allowed),
  });
}
