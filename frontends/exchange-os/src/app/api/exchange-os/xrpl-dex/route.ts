import { NextResponse } from "next/server";
import {
  XRPL_DEX_REGISTRY,
  XRPL_ISSUER_PROOF_REQUIREMENTS,
  XRPL_AMM_POOL_PROOF_REQUIREMENTS,
  XRPL_COMPLIANCE_NOTES,
} from "@/data/xrplDexRegistry";


export async function GET() {
  return NextResponse.json({
    data: {
      venueRegistry: XRPL_DEX_REGISTRY,
      issuerProofRequirements: XRPL_ISSUER_PROOF_REQUIREMENTS,
      ammPoolProofRequirements: XRPL_AMM_POOL_PROOF_REQUIREMENTS,
      complianceNotes: XRPL_COMPLIANCE_NOTES,
    },
    generatedAt: new Date().toISOString(),
    truthLabel:
      "static_config_no_live_data — XRPL DEX intelligence schema, no live ledger data",
    version: "1.0",
  });
}
