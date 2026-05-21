import { NextResponse } from "next/server";
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES } from "@/content/troptions/aiKnowledgeGraph";
import { AI_DISCLAIMER } from "@/content/troptions/aiSearchRegistry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    disclaimer: AI_DISCLAIMER,
    nodes: KNOWLEDGE_NODES.length,
    edges: KNOWLEDGE_EDGES.length,
    graph: {
      nodes: KNOWLEDGE_NODES,
      edges: KNOWLEDGE_EDGES,
    },
  });
}
