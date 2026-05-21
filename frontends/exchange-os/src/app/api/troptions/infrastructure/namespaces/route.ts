import { NextResponse } from "next/server";
import { getMockNamespaces } from "@/lib/troptions/infrastructure/mockData";

export function GET() {
  const namespaces = getMockNamespaces();
  return NextResponse.json({ ok: true, namespaces, count: namespaces.length });
}
