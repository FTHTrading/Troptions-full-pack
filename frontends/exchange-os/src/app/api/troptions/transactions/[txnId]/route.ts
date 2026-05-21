import { NextResponse } from "next/server";
import {
  getWorkflowRecord,
  getTransactionTypeDef,
  seedWorkflowRegistryIfEmpty,
} from "@/lib/troptions/transactionWorkflowEngine";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ txnId: string }> }
) {
  seedWorkflowRegistryIfEmpty();
  const { txnId } = await params;
  const record = getWorkflowRecord(txnId);
  if (!record) {
    return NextResponse.json({ ok: false, error: "Transaction workflow record not found" }, { status: 404 });
  }
  const typeDef = getTransactionTypeDef(record.category);
  return NextResponse.json({ ok: true, simulationOnly: true, record, typeDef });
}
