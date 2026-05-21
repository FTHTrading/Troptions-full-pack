import { NextResponse } from "next/server";
import { verifyInviteByHandle } from "@/lib/troptions/walletInviteEngine";

export async function POST(request: Request) {
  const body = (await request.json()) as { handle?: string };
  const handle = body.handle?.trim().toLowerCase();

  if (!handle) {
    return NextResponse.json({ ok: false, error: "handle is required" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, simulationOnly: true, result: verifyInviteByHandle(handle) });
}