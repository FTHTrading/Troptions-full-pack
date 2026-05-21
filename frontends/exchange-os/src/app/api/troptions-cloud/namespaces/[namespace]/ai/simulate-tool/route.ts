import { NextResponse } from "next/server";
import { evaluateNamespaceToolAccess } from "@/lib/troptions-cloud/namespaceAiAccessPolicyEngine";
import { persistNamespaceToolAccessSimulation } from "@/lib/troptions-cloud/namespaceAiX402ControlHubBridge";
import { getNamespaceAiProfile } from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";

export const dynamic = "force-dynamic";

interface SimulateToolBody {
  memberId?: string;
  requestedTool?: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ namespace: string }> },
) {
  try {
    const { namespace } = await params;

    if (!getNamespaceAiProfile(namespace)) {
      return NextResponse.json(
        { ok: false, error: `Namespace '${namespace}' not found` },
        { status: 404 },
      );
    }

    const body = (await request.json()) as SimulateToolBody;
    const { memberId, requestedTool } = body;

    if (!memberId || !requestedTool) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: memberId, requestedTool" },
        { status: 400 },
      );
    }

    const decision = evaluateNamespaceToolAccess({
      namespaceId: namespace,
      memberId,
      requestedTool,
    });

    const { taskId, auditId } = persistNamespaceToolAccessSimulation(
      namespace,
      requestedTool,
      decision,
    );

    return NextResponse.json({
      ok: true,
      simulationOnly: true,
      data: decision,
      taskId,
      auditRecordId: auditId,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 400 },
    );
  }
}
