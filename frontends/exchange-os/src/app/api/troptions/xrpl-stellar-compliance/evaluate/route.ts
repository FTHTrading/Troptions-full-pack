import { NextRequest, NextResponse } from "next/server";
import {
  evaluateGlobalCompliance,
  type GlobalComplianceInput,
} from "@/lib/troptions/xrpl-stellar-compliance/globalCompliancePolicyEngine";
import { persistGlobalComplianceGate } from "@/lib/troptions/xrpl-stellar-compliance/xrplStellarComplianceControlHubBridge";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = body as Partial<GlobalComplianceInput>;

  // Validate required fields
  if (!input.operationId || typeof input.operationId !== "string") {
    return NextResponse.json(
      { error: "operationId is required and must be a string" },
      { status: 400 }
    );
  }
  if (!input.operationType || typeof input.operationType !== "string") {
    return NextResponse.json(
      { error: "operationType is required and must be a string" },
      { status: 400 }
    );
  }
  if (!input.chain || !["XRPL", "Stellar", "Both", "Other"].includes(input.chain)) {
    return NextResponse.json(
      { error: "chain must be one of: XRPL, Stellar, Both, Other" },
      { status: 400 }
    );
  }

  // No seeds or keys accepted
  const bodyStr = JSON.stringify(body);
  if (
    bodyStr.toLowerCase().includes("seed") ||
    bodyStr.toLowerCase().includes("privatekey") ||
    bodyStr.toLowerCase().includes("private_key") ||
    bodyStr.toLowerCase().includes("secret")
  ) {
    return NextResponse.json(
      { error: "This endpoint does not accept seeds, private keys, or secrets." },
      { status: 400 }
    );
  }

  const safeInput: GlobalComplianceInput = {
    operationId: input.operationId,
    operationType: input.operationType,
    chain: input.chain,
    jurisdictionCode: input.jurisdictionCode,
    jurisdictionStatus: input.jurisdictionStatus,
    kycStatus: input.kycStatus,
    kybStatus: input.kybStatus,
    sanctionsStatus: input.sanctionsStatus,
    legalReviewComplete: input.legalReviewComplete,
    publicClaimText: input.publicClaimText,
    requestsLiveExecution: false, // always block live execution from API
    requestsMainnetTransaction: false, // always block mainnet from API
  };

  const result = evaluateGlobalCompliance(safeInput);

  const { taskId, auditRecordId, auditToken } = persistGlobalComplianceGate(safeInput);

  return NextResponse.json({
    decision: result.decision,
    executionMode: result.executionMode,
    liveExecutionAllowed: false,
    blockedReasons: result.blockedReasons,
    requiredEvidence: result.requiredEvidence,
    requiredApprovals: result.requiredApprovals,
    prohibitedClaimsDetected: result.prohibitedClaimsDetected,
    taskId,
    auditRecordId,
    auditToken,
    persistedStatus: "persisted_simulation_only",
    disclaimer: result.disclaimer,
    evaluatedAt: result.evaluatedAt,
  });
}
