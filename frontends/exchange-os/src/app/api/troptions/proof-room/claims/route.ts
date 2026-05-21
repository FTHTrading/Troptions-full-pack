import { NextResponse } from "next/server";
import { getMockPublicClaims, getApprovedClaims } from "@/lib/troptions/proof-room/claims";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const approvedOnly = searchParams.get("approvedOnly") !== "false";
  const all = getMockPublicClaims();
  const claims = approvedOnly ? getApprovedClaims(all) : all;
  return NextResponse.json({ ok: true, claims, count: claims.length });
}
