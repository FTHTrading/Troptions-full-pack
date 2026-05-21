import { NextRequest, NextResponse } from "next/server";
import { getMockPayOpsClient } from "@/lib/troptions/payops/mockData";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace");
  if (!ns) {
    return NextResponse.json(
      { error: "namespace query param required" },
      { status: 400 }
    );
  }
  const client = getMockPayOpsClient(ns);
  return NextResponse.json({ ok: true, namespace: client });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.namespaceSlug || !body?.displayName) {
    return NextResponse.json(
      { error: "namespaceSlug and displayName are required" },
      { status: 400 }
    );
  }
  // In production: persist to DB, validate uniqueness, run KYB gate
  return NextResponse.json({
    ok: true,
    message: "Namespace registration queued. Compliance review required before activation.",
    status: "pending_compliance",
    namespaceSlug: body.namespaceSlug,
  });
}
