import { NextRequest, NextResponse } from "next/server";
import { getMockFeeLedger } from "@/lib/troptions/payops/mockData";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const namespaceId = `ns-payops-${ns}`;
  const entries = getMockFeeLedger(namespaceId);
  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const paid = entries
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);
  const pending = entries
    .filter((e) => e.status !== "paid" && e.status !== "waived")
    .reduce((sum, e) => sum + e.amount, 0);
  return NextResponse.json({
    ok: true,
    entries,
    summary: { total, paid, pending },
  });
}
