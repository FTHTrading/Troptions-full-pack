import { NextResponse } from "next/server";
import { createWorkflowRecord } from "@/lib/troptions/transactionWorkflowEngine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, initiatorAddress, counterpartyAddress, assetReference, amountUsdCents } = body;
    if (!category || !initiatorAddress) {
      return NextResponse.json({ ok: false, error: "category and initiatorAddress are required" }, { status: 400 });
    }
    const record = createWorkflowRecord({
      category,
      initiatorAddress,
      counterpartyAddress,
      assetReference,
      amountUsdCents,
    });
    return NextResponse.json({
      ok: true,
      simulationOnly: true,
      record,
      disclosure:
        "This transaction workflow is simulation-only. No live execution, custody, settlement, or contract deployment has occurred.",
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
