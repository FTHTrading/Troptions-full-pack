import { NextResponse } from 'next/server';
import { RAG_SOURCES, PROHIBITED_RAG_SOURCES, FREE_SOURCES, GATED_SOURCES } from '@/data/ragSources';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    approved_sources: RAG_SOURCES.filter((s) => s.approved),
    free_sources_count: FREE_SOURCES.length,
    gated_sources_count: GATED_SOURCES.length,
    prohibited_source_categories: PROHIBITED_RAG_SOURCES,
    note: 'Prohibited sources include private keys, secrets, PII, and unreleased internal data. These are never indexed.',
  });
}
