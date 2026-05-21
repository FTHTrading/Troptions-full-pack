import { NextResponse } from "next/server";
import {
  BITCOIN_SETTLEMENT_DISCLOSURE,
  createBitcoinSettlementRecord,
  generateBitcoinSettlementSummary,
  validateBitcoinSettlementRecord,
  type CreateBitcoinSettlementInput,
} from "@/lib/troptions/bitcoinSettlementEngine";
import { listCarbonBitcoinAuditEvents } from "@/lib/troptions/carbonBitcoinAuditLog";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Partial<CreateBitcoinSettlementInput>;
  try {
    body = (await req.json()) as Partial<CreateBitcoinSettlementInput>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const requiredKeys: (keyof CreateBitcoinSettlementInput)[] = [
    "settlementId",
    "payerName",
    "payeeName",
    "settlementType",
    "usdReferenceValue",
  ];
  const missing = requiredKeys.filter((k) => body[k] === undefined || body[k] === null);
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: "missing_required_fields", missing, simulation: true },
      { status: 400 }
    );
  }

  const record = createBitcoinSettlementRecord(body as CreateBitcoinSettlementInput);
  const validation = validateBitcoinSettlementRecord(record);
  const summary = generateBitcoinSettlementSummary(record.settlementId);
  const auditEvents = listCarbonBitcoinAuditEvents({
    relatedSettlementId: record.settlementId,
  });

  return NextResponse.json({
    ok: true,
    simulation: true,
    blocked: !validation.valid || record.settlementStatus === "BLOCKED",
    disclosure: BITCOIN_SETTLEMENT_DISCLOSURE,
    requestedAction: "create_bitcoin_settlement",
    record,
    validation,
    summary,
    approvalGatesRequired: [
      "provider_assigned",
      "kyc_approved",
      "aml_approved",
      "approval_status_approved",
      "btc_tx_hash_observed",
      `confirmations>=${record.confirmationsRequired}`,
    ],
    nextRequiredEvidence: validation.errors.length
      ? validation.errors
      : validation.warnings,
    auditEventPreview: auditEvents.slice(-1)[0] ?? null,
    notice:
      "No live Bitcoin custody, exchange, signing, or money transmission was performed. External regulated provider required for any real settlement.",
  });
}
