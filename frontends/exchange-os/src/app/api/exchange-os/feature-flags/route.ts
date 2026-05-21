import { NextResponse } from 'next/server';
import {
  EXCHANGE_OS_FEATURE_FLAGS,
  FEATURE_FLAG_DESCRIPTIONS,
} from '@/data/exchangeOsFeatureFlags';

export const runtime = 'nodejs';

export async function GET() {
  const flags = Object.entries(EXCHANGE_OS_FEATURE_FLAGS).map(([key, value]) => ({
    flag: key,
    enabled: value,
    description: FEATURE_FLAG_DESCRIPTIONS[key as keyof typeof FEATURE_FLAG_DESCRIPTIONS],
  }));

  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    note: 'All mainnet/trading flags default false. Enable via Cloudflare secrets.',
    flags,
  });
}
