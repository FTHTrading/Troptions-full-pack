import { NextResponse } from "next/server";
import {
  findKycByAddress,
  generateKycSummary,
  seedKycRegistryIfEmpty,
} from "@/lib/troptions/kycOnboardingEngine";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  seedKycRegistryIfEmpty();
  const { walletAddress } = await params;
  const record = findKycByAddress(walletAddress);
  if (!record) {
    return NextResponse.json({ ok: false, error: "KYC record not found for this address" }, { status: 404 });
  }
  const summary = generateKycSummary(record.kycId);
  return NextResponse.json({ ok: true, simulationOnly: true, record, summary });
}
