import { NextResponse } from "next/server";
import { getHandbook, type HandbookId } from "@/lib/troptions/pdfHandbookRegistry";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handbookId: string }> }
) {
  const { handbookId } = await params;
  const handbook = getHandbook(handbookId as HandbookId);
  if (!handbook) {
    return NextResponse.json({ ok: false, error: "Handbook not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, simulationOnly: true, handbook });
}
