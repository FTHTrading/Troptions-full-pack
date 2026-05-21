export interface RagDocument {
  id: string;
  title: string;
  source: string;
  category: string;
  embeddingReady: boolean;
  chunkCount: number;
  lastIndexed: string | null;
}

export const RAG_DOCUMENTS: RagDocument[] = [
  { id: "knowledge-base", title: "Troptions Knowledge Base", source: "internal", category: "platform", embeddingReady: false, chunkCount: 0, lastIndexed: null },
  { id: "compliance-framework", title: "Compliance Framework Documentation", source: "internal", category: "compliance", embeddingReady: false, chunkCount: 0, lastIndexed: null },
  { id: "rwa-workflow-guide", title: "RWA Workflow Guide", source: "internal", category: "rwa", embeddingReady: false, chunkCount: 0, lastIndexed: null },
  { id: "settlement-runbook", title: "Settlement Runbook", source: "internal", category: "settlement", embeddingReady: false, chunkCount: 0, lastIndexed: null },
  { id: "ai-entity-registry", title: "AI Entity Registry", source: "content/troptions/aiEntityRegistry.ts", category: "ai", embeddingReady: true, chunkCount: 12, lastIndexed: "2025-01-15" },
  { id: "insights-corpus", title: "Institutional Insights Corpus", source: "content/troptions/insightsRegistry.ts", category: "insights", embeddingReady: true, chunkCount: 20, lastIndexed: "2025-03-18" },
];

export const RAG_CONFIG = {
  embeddingModel: "nomic-embed-text",
  chunkSize: 1500,
  chunkOverlap: 200,
  topK: 5,
  similarityThreshold: 0.7,
  storePath: "data/rag/troptions-index.db",
  status: "configuration-ready",
  note: "RAG index build requires embedding model deployment and document corpus finalization.",
};
