import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    mcp_status: {
      mode: 'demo',
      live_mcp_tools: false,
      cloudflare_ai_gateway: 'not_configured',
      vectorize_binding: 'not_configured',
      rag_search: 'demo_stub',
      agent_execution: 'demo_only',
      shell_execution: 'blocked',
      wallet_access: 'blocked',
      live_trading: 'blocked',
    },
    production_requirements: [
      'Cloudflare AI Gateway binding',
      'Vectorize index configured',
      'RAG source documents indexed',
      'x402 payment settlement infrastructure',
    ],
    updated: new Date().toISOString(),
  });
}
