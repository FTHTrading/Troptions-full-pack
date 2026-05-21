import { NextResponse } from 'next/server';
import { AGENT_REGISTRY } from '@/data/agentRegistry';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const agent = AGENT_REGISTRY.find((a) => a.id === id);
  if (!agent) {
    return NextResponse.json({ ok: false, error: 'agent_not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, agent });
}
