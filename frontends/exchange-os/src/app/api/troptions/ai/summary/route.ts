import { NextResponse } from "next/server";
import { AI_SEARCH_REGISTRY, AI_DISCLAIMER } from "@/content/troptions/aiSearchRegistry";
import { AI_ENTITY_REGISTRY } from "@/content/troptions/aiEntityRegistry";
import { KNOWLEDGE_NODES } from "@/content/troptions/aiKnowledgeGraph";
import { AI_CITATION_REGISTRY } from "@/content/troptions/aiCitationRegistry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "1.0",
    generated: new Date().toISOString().split("T")[0],
    disclaimer: AI_DISCLAIMER,
    summary: {
      name: "Troptions",
      type: "InstitutionalPlatform",
      description:
        "Institutional operating infrastructure for proof-gated RWA issuance, custody coordination, settlement readiness, and compliance workflows.",
      notA: ["bank", "broker-dealer", "exchange", "custodian", "licensed-financial-institution"],
      searchEntries: AI_SEARCH_REGISTRY.length,
      entities: AI_ENTITY_REGISTRY.length,
      knowledgeNodes: KNOWLEDGE_NODES.length,
      citations: AI_CITATION_REGISTRY.length,
    },
    capabilities: AI_SEARCH_REGISTRY.map((e) => ({
      id: e.id,
      title: e.title,
      url: e.url,
      status: e.status,
      gateStatus: e.gateStatus,
    })),
  });
}
