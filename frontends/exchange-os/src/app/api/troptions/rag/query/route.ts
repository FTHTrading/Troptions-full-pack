import { NextResponse } from "next/server";
import { RAG_DOCUMENTS, RAG_CONFIG } from "@/content/troptions/ragConfig";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ ok: false, error: "Authorization required" }, { status: 401 });
  }

  let body: { query?: string; k?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.query || typeof body.query !== "string") {
    return NextResponse.json({ ok: false, error: "query field required" }, { status: 400 });
  }

  // Simulation mode — RAG index not yet built
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    query: body.query,
    config: RAG_CONFIG,
    note: "RAG query simulation — index not yet built. Configure embedding model and run index build to enable live retrieval.",
    mockResults: RAG_DOCUMENTS.filter((d) => d.embeddingReady).slice(0, body.k ?? 5).map((d) => ({
      documentId: d.id,
      title: d.title,
      score: 0.0,
      excerpt: "Index build required for actual retrieval.",
    })),
  });
}
