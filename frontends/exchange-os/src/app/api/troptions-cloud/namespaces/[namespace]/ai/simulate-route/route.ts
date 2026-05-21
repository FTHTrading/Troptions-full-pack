import { NextResponse } from "next/server";
import { evaluateNamespaceModelRoute } from "@/lib/troptions-cloud/namespaceAiAccessPolicyEngine";
import { persistNamespaceModelRouteSimulation } from "@/lib/troptions-cloud/namespaceAiX402ControlHubBridge";
import { getNamespaceAiProfile } from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";

export const dynamic = "force-dynamic";

interface SimulateRouteBody {
  memberId?: string;
  requestedModel?: string;
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

    const body = (await request.json()) as SimulateRouteBody;
    const { memberId, requestedModel } = body;

    if (!memberId || !requestedModel) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: memberId, requestedModel" },
        { status: 400 },
      );
    }

    const decision = evaluateNamespaceModelRoute({
      namespaceId: namespace,
      memberId,
      requestedModel,
    });

    const { taskId, auditId } = persistNamespaceModelRouteSimulation(
      namespace,
      requestedModel,
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
