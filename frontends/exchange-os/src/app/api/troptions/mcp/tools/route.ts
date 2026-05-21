import { NextResponse } from "next/server";
import { MCP_TOOLS, getAvailableMcpTools, getBlockedMcpTools, BLOCKED_MCP_ACTIONS } from "@/content/troptions/mcpToolRegistry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    total: MCP_TOOLS.length,
    available: getAvailableMcpTools().length,
    blocked: getBlockedMcpTools().length,
    blockedActions: BLOCKED_MCP_ACTIONS,
    tools: MCP_TOOLS.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      blocked: t.blocked,
      blockReason: t.blockReason,
      requiresAuth: t.requiresAuth,
      auditLogged: t.auditLogged,
    })),
  });
}
