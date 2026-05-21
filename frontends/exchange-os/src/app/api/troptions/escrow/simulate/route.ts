import { NextResponse } from "next/server";
import { createEscrowRecord } from "@/lib/troptions/escrowStateEngine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      buyerAddress,
      sellerAddress,
      assetToken,
      paymentToken,
      transactionId,
      conditionSet,
    } = body;
    if (!buyerAddress || !sellerAddress || !assetToken || !paymentToken) {
      return NextResponse.json(
        { ok: false, error: "buyerAddress, sellerAddress, assetToken, and paymentToken are required" },
        { status: 400 }
      );
    }
    const record = createEscrowRecord({
      buyerAddress,
      sellerAddress,
      assetToken,
      paymentToken,
      transactionId,
      conditionSet,
    });
    return NextResponse.json({
      ok: true,
      simulationOnly: true,
      record,
      disclosure: record.disclosureStatement,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
