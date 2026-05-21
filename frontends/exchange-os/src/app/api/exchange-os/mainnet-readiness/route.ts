import { NextResponse } from 'next/server';
import { MAINNET_READINESS_CHECKLIST, MAINNET_READINESS_SUMMARY, canEnableMainnetTrading } from '@/data/mainnetReadiness';

export const runtime = 'nodejs';

export async function GET() {
  const readinessCheck = canEnableMainnetTrading(MAINNET_READINESS_CHECKLIST);

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    truthLabel: 'Mainnet trading is currently GATED. This status reflects real checklist state, not aspirational claims.',
    mainnetTradingAllowed: readinessCheck.allowed,
    blockers: readinessCheck.blockers,
    governanceNote: 'NEXT_PUBLIC_SOLANA_MAINNET_ENABLED defaults to false and may only be enabled after written launch committee GO and all critical checklist items confirmed complete.',
    summary: MAINNET_READINESS_SUMMARY,
    checklist: MAINNET_READINESS_CHECKLIST,
  });
}
