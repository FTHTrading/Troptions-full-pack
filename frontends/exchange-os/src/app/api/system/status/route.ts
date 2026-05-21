import { NextResponse } from 'next/server';
import { ECOSYSTEM_STATUS, LAST_ECOSYSTEM_AUDIT } from '@/data/ecosystem-status';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    lastAudit: LAST_ECOSYSTEM_AUDIT,
    truthLabel: 'static_config_verified_2026-05-15',
    total: ECOSYSTEM_STATUS.length,
    mainnet_live: ECOSYSTEM_STATUS.filter((s) => s.status === 'mainnet_live').length,
    live: ECOSYSTEM_STATUS.filter((s) => ['live', 'live_local'].includes(s.status)).length,
    blocked: ECOSYSTEM_STATUS.filter((s) => s.status === 'blocked').length,
    items: ECOSYSTEM_STATUS,
  });
}
