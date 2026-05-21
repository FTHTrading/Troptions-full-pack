import { NextResponse } from "next/server";
import { getMockAdapters } from "@/lib/troptions/infrastructure/mockData";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const namespaceId = searchParams.get("namespaceId") ?? "ns-troptions-main";
  const adapters = getMockAdapters(namespaceId);
  return NextResponse.json({ ok: true, adapters, count: adapters.length });
}
