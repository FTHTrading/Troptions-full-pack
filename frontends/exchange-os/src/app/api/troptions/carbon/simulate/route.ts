import { NextResponse } from "next/server";
import {
  CARBON_CREDIT_DISCLOSURE,
  calculateCarbonReadinessScore,
  createCarbonAssetRecord,
  generateCarbonProofSummary,
  validateCarbonCreditRecord,
  type CreateCarbonAssetInput,
} from "@/lib/troptions/carbonCreditEngine";
import { listCarbonBitcoinAuditEvents } from "@/lib/troptions/carbonBitcoinAuditLog";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Partial<CreateCarbonAssetInput>;
  try {
    body = (await req.json()) as Partial<CreateCarbonAssetInput>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const requiredKeys: (keyof CreateCarbonAssetInput)[] = [
    "carbonAssetId",
    "registryName",
    "projectName",
    "projectLocation",
    "projectType",
    "methodology",
    "vintageYear",
    "creditQuantity",
  ];
  const missing = requiredKeys.filter((k) => body[k] === undefined || body[k] === null);
  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing_required_fields",
        missing,
        simulation: true,
      },
      { status: 400 }
    );
  }

  // Build a draft record without persisting (we use validate-only path).
  const preview = createCarbonAssetRecord(body as CreateCarbonAssetInput);
  const validation = validateCarbonCreditRecord(preview);
  const readiness = calculateCarbonReadinessScore(preview);
  const proof = generateCarbonProofSummary(preview.carbonAssetId);
  const auditEvents = listCarbonBitcoinAuditEvents({ relatedAssetId: preview.carbonAssetId });

  return NextResponse.json({
    ok: true,
    simulation: true,
    blocked: !validation.valid,
    disclosure: CARBON_CREDIT_DISCLOSURE,
    requestedAction: "create_carbon_asset",
    record: preview,
    validation,
    readinessScore: readiness,
    proofSummary: proof,
    approvalGatesRequired: [
      "verification_status_verified",
      "ownership_documented",
      "evidence_hash_or_ipfs_attached",
      "approval_status_approved",
    ],
    nextRequiredEvidence: validation.errors.length
      ? validation.errors
      : validation.warnings,
    auditEventPreview: auditEvents.slice(-1)[0] ?? null,
    notice:
      "No live carbon offset trading, registry transfer, or money transmission was performed.",
  });
}
