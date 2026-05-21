import { NextRequest, NextResponse } from "next/server";
import { getMockPayoutItems } from "@/lib/troptions/payops/mockData";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const batchId = req.nextUrl.searchParams.get("batchId");
  const namespaceId = `ns-payops-${ns}`;
  let items = getMockPayoutItems(namespaceId);
  if (batchId) {
    items = items.filter((i) => i.batchId === batchId);
  }
  return NextResponse.json({
    ok: true,
    payoutItems: items,
    total: items.length,
  });
}
