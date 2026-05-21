import { NextResponse } from "next/server";
import { evaluateNamespaceAiAccess } from "@/lib/troptions-cloud/namespaceAiAccessPolicyEngine";
import { persistNamespaceAiAccessSimulation } from "@/lib/troptions-cloud/namespaceAiX402ControlHubBridge";
import { getNamespaceAiProfile } from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";

export const dynamic = "force-dynamic";

interface SimulateAccessBody {
  memberId?: string;
  membershipPlan?: string;
  requestedModule?: string;
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

    const body = (await request.json()) as SimulateAccessBody;
    const { memberId, membershipPlan, requestedModule } = body;

    if (!memberId || !membershipPlan || !requestedModule) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: memberId, membershipPlan, requestedModule" },
        { status: 400 },
      );
    }

    const decision = evaluateNamespaceAiAccess({
      namespaceId: namespace,
      memberId,
      membershipPlan,
      requestedModule,
    });

    const { taskId, auditId } = persistNamespaceAiAccessSimulation(decision);

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
