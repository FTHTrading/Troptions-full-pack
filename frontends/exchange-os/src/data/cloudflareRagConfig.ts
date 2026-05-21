// Cloudflare RAG / Vectorize configuration skeleton
// Production RAG requires these Cloudflare bindings to be configured in wrangler.toml

export interface CloudflareRagBinding {
  name: string;
  type: 'vectorize' | 'ai' | 'kv' | 'd1' | 'r2';
  bindingKey: string;
  required: boolean;
  status: 'configured' | 'not_configured' | 'pending';
  description: string;
}

export interface CloudflareRagConfig {
  embeddingModel: string;
  embeddingDimensions: number;
  vectorizeIndexName: string;
  ragMode: 'demo' | 'production';
  bindings: CloudflareRagBinding[];
}

export const CLOUDFLARE_RAG_CONFIG: CloudflareRagConfig = {
  // Cloudflare Workers AI embedding model
  embeddingModel: '@cf/baai/bge-base-en-v1.5',
  embeddingDimensions: 768,
  vectorizeIndexName: 'troptions-rag-index',
  ragMode: 'demo', // Switch to 'production' when bindings are configured

  bindings: [
    {
      name: 'Vectorize Index',
      type: 'vectorize',
      bindingKey: 'VECTORIZE',
      required: true,
      status: 'not_configured',
      description: 'Cloudflare Vectorize index for RAG document search. Must be created via wrangler CLI.',
    },
    {
      name: 'Workers AI',
      type: 'ai',
      bindingKey: 'AI',
      required: true,
      status: 'not_configured',
      description: 'Cloudflare Workers AI binding for embedding generation and inference.',
    },
    {
      name: 'RAG Document Store (KV)',
      type: 'kv',
      bindingKey: 'RAG_DOCS_KV',
      required: false,
      status: 'not_configured',
      description: 'KV namespace for caching RAG source documents and metadata.',
    },
    {
      name: 'Receipt Store (KV)',
      type: 'kv',
      bindingKey: 'X402_RECEIPTS_KV',
      required: false,
      status: 'not_configured',
      description: 'KV namespace for x402 receipt verification records.',
    },
    {
      name: 'Insights Database (D1)',
      type: 'd1',
      bindingKey: 'INSIGHTS_DB',
      required: false,
      status: 'not_configured',
      description: 'D1 SQLite database for insights posts and analytics.',
    },
  ],
};

export const RAG_STATUS = {
  vectorizeConfigured: false,
  aiBindingConfigured: false,
  embeddingModelReady: false,
  indexDocumentCount: 0,
  ragSearchReady: false,
  mode: 'demo' as const,
  demoNote:
    'RAG search is in demo mode. Returns stub responses until Vectorize bindings are configured.',
  productionRequirements: [
    'Create Vectorize index: wrangler vectorize create troptions-rag-index --dimensions=768 --metric=cosine',
    'Enable AI binding in wrangler.toml',
    'Index source documents using wrangler vectorize insert',
    'Deploy with Workers AI access enabled',
  ],
};
