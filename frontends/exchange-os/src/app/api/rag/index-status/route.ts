import { NextResponse } from 'next/server';
import { CLOUDFLARE_RAG_CONFIG, RAG_STATUS } from '@/data/cloudflareRagConfig';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    rag_status: RAG_STATUS,
    config: {
      embeddingModel: CLOUDFLARE_RAG_CONFIG.embeddingModel,
      embeddingDimensions: CLOUDFLARE_RAG_CONFIG.embeddingDimensions,
      vectorizeIndexName: CLOUDFLARE_RAG_CONFIG.vectorizeIndexName,
      ragMode: CLOUDFLARE_RAG_CONFIG.ragMode,
    },
    bindings: CLOUDFLARE_RAG_CONFIG.bindings.map((b) => ({
      name: b.name,
      type: b.type,
      required: b.required,
      status: b.status,
    })),
    updated: new Date().toISOString(),
  });
}
