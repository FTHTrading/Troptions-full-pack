import { NextResponse } from "next/server";
import { JEFE_COMMAND_REGISTRY } from "@/content/troptions/jefeCommandRegistry";
import { JEFE_BLOCKED_ACTIONS, JEFE_REQUIRED_APPROVALS } from "@/content/troptions/jefePolicyRegistry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    status: "ok",
    mode: "simulation",
    agentId: "jefe",
    taskId: "jefe-commands",
    blockedActions: JEFE_BLOCKED_ACTIONS,
    requiredApprovals: JEFE_REQUIRED_APPROVALS,
    auditHint: "Read-only command list.",
    nextSteps: ["Run command via POST /api/troptions/jefe/command"],
    commands: JEFE_COMMAND_REGISTRY,
  });
}
