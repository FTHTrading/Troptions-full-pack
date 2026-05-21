import { NextRequest, NextResponse } from 'next/server';
import { RAG_STATUS } from '@/data/cloudflareRagConfig';
import { FREE_SOURCES } from '@/data/ragSources';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: { query?: string; sourceIds?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!body.query || body.query.trim().length < 3) {
    return NextResponse.json({ ok: false, error: 'query_too_short' }, { status: 400 });
  }

  // Demo mode — Vectorize not configured
  if (!RAG_STATUS.ragSearchReady) {
    return NextResponse.json({
      ok: true,
      mode: 'rag_demo_no_vector_db',
      query: body.query,
      results: [],
      demo_note:
        'RAG search is in demo mode. Vectorize index is not configured. No real vector search is performed.',
      available_sources: FREE_SOURCES.map((s) => ({ id: s.id, name: s.name })),
      production_status: RAG_STATUS,
    });
  }

  // Production path (unreachable until bindings configured)
  return NextResponse.json({
    ok: false,
    error: 'rag_not_configured',
    message: 'Vectorize binding not found in runtime environment.',
  }, { status: 503 });
}
