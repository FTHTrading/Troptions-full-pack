import { NextResponse } from "next/server";
import { simulateX402UsageCharge } from "@/lib/troptions-cloud/namespaceX402PolicyEngine";
import { persistX402UsageSimulation } from "@/lib/troptions-cloud/namespaceAiX402ControlHubBridge";
import { getNamespaceX402Profile } from "@/content/troptions-cloud/namespaceX402Registry";

export const dynamic = "force-dynamic";

interface SimulateChargeBody {
  actionId?: string;
  memberId?: string;
  membershipPlan?: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ namespace: string }> },
) {
  try {
    const { namespace } = await params;

    if (!getNamespaceX402Profile(namespace)) {
      return NextResponse.json(
        { ok: false, error: `Namespace '${namespace}' not found` },
        { status: 404 },
      );
    }

    const body = (await request.json()) as SimulateChargeBody;
    const { actionId, memberId, membershipPlan } = body;

    if (!actionId || !memberId || !membershipPlan) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: actionId, memberId, membershipPlan" },
        { status: 400 },
      );
    }

    const event = simulateX402UsageCharge({
      namespaceId: namespace,
      actionId,
      memberId,
      membershipPlan,
    });

    const { taskId, auditId } = persistX402UsageSimulation(event);

    return NextResponse.json({
      ok: true,
      simulationOnly: true,
      data: event,
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
