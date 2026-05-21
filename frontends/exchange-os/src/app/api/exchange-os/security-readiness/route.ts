import { NextResponse } from 'next/server';
import { SECURITY_CONTROLS, SECURITY_SUMMARY } from '@/data/securityReadiness';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    truthLabel: 'Security controls are operational facts, not marketing claims. Required items must be implemented before mainnet operations.',
    summary: SECURITY_SUMMARY,
    controls: SECURITY_CONTROLS,
    clientVisibleControls: SECURITY_CONTROLS.filter(c => c.clientVisible),
  });
}
