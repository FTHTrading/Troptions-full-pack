import { NextResponse } from 'next/server';
import { LANGUAGES, LIVE_LANGUAGES, DRAFT_LANGUAGES } from '@/data/languages';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    languages: LANGUAGES,
    count: LANGUAGES.length,
    live_count: LIVE_LANGUAGES.length,
    draft_count: DRAFT_LANGUAGES.length,
    note: 'Non-English content requires human review before institutional use.',
  });
}
