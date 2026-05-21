import { NextRequest, NextResponse } from "next/server";
import { getMockReceipts } from "@/lib/troptions/payops/mockData";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const namespaceId = `ns-payops-${ns}`;
  const receipts = getMockReceipts(namespaceId);
  return NextResponse.json({
    ok: true,
    receipts,
    total: receipts.length,
    disclaimer:
      "Receipts in 'approved_not_executed' status confirm operator approval only — not fund transfer. A live adapter must confirm execution before a receipt reflects a completed payment.",
  });
}
