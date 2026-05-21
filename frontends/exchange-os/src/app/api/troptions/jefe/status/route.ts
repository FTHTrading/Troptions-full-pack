import { NextResponse } from "next/server";
import { getFastStatus } from "@/lib/troptions/jefeEngine";
import { JEFE_BLOCKED_ACTIONS, JEFE_REQUIRED_APPROVALS } from "@/content/troptions/jefePolicyRegistry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    status: "online",
    mode: "simulation",
    agentId: "jefe",
    taskId: "jefe-status",
    blockedActions: JEFE_BLOCKED_ACTIONS,
    requiredApprovals: JEFE_REQUIRED_APPROVALS,
    auditHint: "Read-only Jefe status.",
    nextSteps: ["Use quick commands for routing and planning"],
    data: getFastStatus(),
  });
}
