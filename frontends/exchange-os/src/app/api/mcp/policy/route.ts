import { NextResponse } from 'next/server';
import { MCP_TOOL_POLICY, MCP_POLICY_SUMMARY, BLOCKED_TOOLS, ALLOWED_TOOLS } from '@/data/mcpToolPolicy';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    summary: MCP_POLICY_SUMMARY,
    blocked_tools: BLOCKED_TOOLS,
    allowed_tools: ALLOWED_TOOLS,
    full_policy: MCP_TOOL_POLICY,
    note: 'MCP policy enforces read-only agents with no shell execution, wallet access, or live trading.',
  });
}
