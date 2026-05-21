import { NextResponse } from 'next/server';
import { AGENT_REGISTRY } from '@/data/agentRegistry';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    agents: AGENT_REGISTRY,
    count: AGENT_REGISTRY.length,
    policy: {
      defaultMode: 'read_only',
      allAgentsReadOnly: true,
      noShellExecution: true,
      noLiveTrading: true,
      noInvestmentAdvice: true,
    },
    note: 'All agents are in demo mode. Production RAG requires configured Cloudflare Vectorize bindings.',
  });
}
