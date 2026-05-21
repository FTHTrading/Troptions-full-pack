import { NextResponse } from 'next/server';
import { EXCHANGE_OS_PUBLIC_CLAIM_RULES } from '@/data/claimRules';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    warning:
      'These rules are enforced across all public-facing copy. Never claim tradable/liquid/verified without meeting conditions.',
    rules: EXCHANGE_OS_PUBLIC_CLAIM_RULES,
  });
}
