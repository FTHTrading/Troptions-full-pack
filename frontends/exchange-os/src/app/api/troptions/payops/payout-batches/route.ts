import { NextRequest, NextResponse } from "next/server";
import { getMockPayoutBatches } from "@/lib/troptions/payops/mockData";
import { isValidTransition } from "@/lib/troptions/payops/status";
import { isBatchCompliant } from "@/lib/troptions/payops/compliance";
import { createAuditEvent } from "@/lib/troptions/payops/audit";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const statusFilter = req.nextUrl.searchParams.get("status");
  const namespaceId = `ns-payops-${ns}`;
  let batches = getMockPayoutBatches(namespaceId);
  if (statusFilter) {
    batches = batches.filter((b) => b.status === statusFilter);
  }
  return NextResponse.json({
    ok: true,
    batches,
    total: batches.length,
    summary: {
      draft: batches.filter((b) => b.status === "draft").length,
      pendingApproval: batches.filter((b) => b.status === "pending_approval").length,
      approvedNotExecuted: batches.filter((b) => b.status === "approved_not_executed").length,
      blockedByCompliance: batches.filter((b) => b.status === "blocked_by_compliance").length,
      executed: 0, // Always 0 — mock adapter cannot execute
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (
    !body?.namespaceId ||
    !body?.name ||
    !body?.payoutType ||
    !Array.isArray(body?.payeeIds) ||
    !body?.totalAmount
  ) {
    return NextResponse.json(
      {
        error:
          "namespaceId, name, payoutType, payeeIds, and totalAmount are required",
      },
      { status: 400 }
    );
  }

  const batchId = `batch-${Date.now()}`;
  const _audit = createAuditEvent({
    namespaceId: body.namespaceId,
    action: "payout_batch.created",
    actorId: body.actorId ?? "anonymous",
    actorType: "user",
    resourceType: "payout_batch",
    resourceId: batchId,
    outcome: "success",
    metadata: { batchName: body.name },
  });

  return NextResponse.json({
    ok: true,
    batchId,
    status: "draft",
    message:
      "Payout batch created as draft. Submit for approval before scheduling execution. Execution requires a configured live adapter.",
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.batchId || !body?.status) {
    return NextResponse.json(
      { error: "batchId and status are required" },
      { status: 400 }
    );
  }

  const valid = isValidTransition(body.fromStatus ?? "draft", body.status);
  if (!valid) {
    return NextResponse.json(
      {
        error: `Status transition from '${body.fromStatus}' to '${body.status}' is not permitted.`,
      },
      { status: 422 }
    );
  }

  return NextResponse.json({
    ok: true,
    batchId: body.batchId,
    newStatus: body.status,
    message: "Batch status updated.",
    executionNote:
      body.status === "approved_not_executed"
        ? "Batch approved. A configured live adapter is required before execution. Contact TROPTIONS to configure your execution adapter."
        : undefined,
  });
}
