import { NextResponse } from "next/server";
import { listWorkflowRecords, seedWorkflowRegistryIfEmpty, listTransactionCategories } from "@/lib/troptions/transactionWorkflowEngine";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  seedWorkflowRegistryIfEmpty();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const records = listWorkflowRecords(category as Parameters<typeof listWorkflowRecords>[0]);
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    categories: listTransactionCategories(),
    records,
    disclosure:
      "All transaction workflows are simulation-only. No live execution has occurred. All approvals must be satisfied before any live transaction can proceed.",
  });
}
