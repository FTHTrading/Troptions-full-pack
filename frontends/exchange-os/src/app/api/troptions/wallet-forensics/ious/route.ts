import { NextRequest, NextResponse } from "next/server";
import { XRPL_IOU_REGISTRY } from "@/content/troptions/xrplIouRegistry";
import { requireAuth } from "@/lib/troptions/walletForensicsApiGuards";

export function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;
  return NextResponse.json({ ok: true, data: XRPL_IOU_REGISTRY });
}
