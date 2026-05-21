import { NextRequest, NextResponse } from 'next/server';
import { findAgentsByGoal, AGENT_GOALS } from '@/data/agentRegistry';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: { goal?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!body.goal) {
    return NextResponse.json(
      { ok: false, error: 'goal_required', available_goals: AGENT_GOALS },
      { status: 400 },
    );
  }

  const agents = findAgentsByGoal(body.goal);
  if (agents.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'no_agents_for_goal', goal: body.goal, available_goals: AGENT_GOALS },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    goal: body.goal,
    recommended_agents: agents,
    count: agents.length,
    note: 'All agents are in demo mode. Read-only by default. No shell execution, wallet signing, or live trading.',
  });
}
