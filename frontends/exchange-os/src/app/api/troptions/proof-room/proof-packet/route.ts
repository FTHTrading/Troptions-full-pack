import { NextResponse } from "next/server";
import { getMockProofRoomData, generateProofPacket } from "@/lib/troptions/proof-room/mockData";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const namespaceId = searchParams.get("namespaceId") ?? null;
  const data = getMockProofRoomData();
  const packet = generateProofPacket(namespaceId);
  return NextResponse.json({ ok: true, packet, summary: { claimsCount: data.claims.length, evidenceCount: data.evidence.length } });
}
