import { NextResponse } from 'next/server';
import { KEYWORD_CLUSTERS, BANNED_KEYWORD_PHRASES, ALL_APPROVED_KEYWORDS } from '@/data/keywordStrategy';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    clusters: KEYWORD_CLUSTERS,
    approved_keywords_count: ALL_APPROVED_KEYWORDS.length,
    banned_phrases: BANNED_KEYWORD_PHRASES,
    banned_phrases_count: BANNED_KEYWORD_PHRASES.length,
    note: 'Banned phrases must never appear in public-facing content. Institutional voice only.',
  });
}
