import { NextResponse } from "next/server";
import { getNamespaceX402Profile } from "@/content/troptions-cloud/namespaceX402Registry";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ namespace: string }> },
) {
  const { namespace } = await params;
  const profile = getNamespaceX402Profile(namespace);

  if (!profile) {
    return NextResponse.json(
      { ok: false, error: `Namespace '${namespace}' not found` },
      { status: 404 },
    );
  }

  // Usage events are persisted in Control Hub — return policy summary
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    namespaceId: namespace,
    usageMeteringMode: profile.usageMeteringMode,
    creditLedgerMode: profile.creditLedgerMode,
    freeActions: profile.freeActions,
    paymentRequiredActions: profile.paymentRequiredActions,
    approvalRequiredActions: profile.approvalRequiredActions,
    blockedActions: profile.blockedActions,
    recentUsageEvents: [], // populated from Control Hub DB in a future phase
  });
}
