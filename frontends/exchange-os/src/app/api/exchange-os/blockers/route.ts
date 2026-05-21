import { NextResponse } from 'next/server';
import { getBlockers } from '@/data/ecosystem-status';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    blockers: getBlockers(),
  });
}
