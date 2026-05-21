/**
 * Bitcoin Settlement Engine Tests — simulation only.
 */

import {
  blockBitcoinSettlement,
  clearBitcoinSettlementRegistry,
  createBitcoinSettlementRecord,
  markBitcoinSettlementSettled,
  recordBitcoinTxHash,
  requestBitcoinSettlementApproval,
  updateBitcoinConfirmations,
} from "@/lib/troptions/bitcoinSettlementEngine";
import { clearCarbonBitcoinAuditLog } from "@/lib/troptions/carbonBitcoinAuditLog";

beforeEach(() => {
  clearBitcoinSettlementRegistry();
  clearCarbonBitcoinAuditLog();
});

const make = (overrides: Record<string, unknown> = {}) =>
  createBitcoinSettlementRecord({
    settlementId: "BTC-T-001",
    payerName: "P",
    payeeName: "Q",
    settlementType: "BUYER_PAYS_BTC",
    usdReferenceValue: 1000,
    providerName: "Demo Provider",
    actor: "test",
    ...overrides,
  });

describe("createBitcoinSettlementRecord", () => {
  it("auto-pins to PROVIDER_REQUIRED when no provider given", () => {
    const r = createBitcoinSettlementRecord({
      settlementId: "BTC-T-NOPROV",
      payerName: "P",
      payeeName: "Q",
      settlementType: "RECORD_ONLY",
      usdReferenceValue: 1,
    });
    expect(r.settlementStatus).toBe("PROVIDER_REQUIRED");
    expect(r.riskFlags).toContain("missing-provider");
  });

  it("starts at QUOTE_REQUESTED with provider", () => {
    const r = make();
    expect(r.settlementStatus).toBe("QUOTE_REQUESTED");
  });

  it("defaults confirmations required to 3", () => {
    const r = make();
    expect(r.confirmationsRequired).toBe(3);
  });
});

describe("approval gate", () => {
  it("rejects approval if KYC not approved", () => {
    const r = make({ settlementId: "BTC-T-KYC" });
    const out = requestBitcoinSettlementApproval({
      settlementId: r.settlementId,
      kycStatus: "in-review",
      amlStatus: "approved",
      actor: "test",
    });
    expect(out.ok).toBe(false);
    expect(out.record?.settlementStatus).toBe("COMPLIANCE_REVIEW");
  });

  it("approves only with KYC + AML approved", () => {
    const r = make({ settlementId: "BTC-T-OK" });
    const out = requestBitcoinSettlementApproval({
      settlementId: r.settlementId,
      kycStatus: "approved",
      amlStatus: "approved",
      actor: "test",
    });
    expect(out.ok).toBe(true);
    expect(out.record?.settlementStatus).toBe("APPROVED_FOR_EXTERNAL_PROVIDER");
  });
});

describe("tx hash recording", () => {
  it("rejects tx hash from QUOTE_REQUESTED state", () => {
    const r = make({ settlementId: "BTC-T-TX1" });
    const out = recordBitcoinTxHash({
      settlementId: r.settlementId,
      btcTxHash: "a".repeat(64),
      actor: "test",
    });
    expect(out.ok).toBe(false);
  });

  it("rejects short tx hashes", () => {
    const r = make({ settlementId: "BTC-T-TX2" });
    requestBitcoinSettlementApproval({
      settlementId: r.settlementId,
      kycStatus: "approved",
      amlStatus: "approved",
      actor: "test",
    });
    const out = recordBitcoinTxHash({
      settlementId: r.settlementId,
      btcTxHash: "abc",
      actor: "test",
    });
    expect(out.ok).toBe(false);
  });

  it("accepts tx hash after approval", () => {
    const r = make({ settlementId: "BTC-T-TX3" });
    requestBitcoinSettlementApproval({
      settlementId: r.settlementId,
      kycStatus: "approved",
      amlStatus: "approved",
      actor: "test",
    });
    const out = recordBitcoinTxHash({
      settlementId: r.settlementId,
      btcTxHash: "a".repeat(64),
      actor: "test",
    });
    expect(out.ok).toBe(true);
    expect(out.record?.settlementStatus).toBe("TX_OBSERVED");
  });
});

describe("settlement finalization", () => {
  it("blocks settle without confirmations", () => {
    const r = make({ settlementId: "BTC-T-FIN1" });
    requestBitcoinSettlementApproval({
      settlementId: r.settlementId,
      kycStatus: "approved",
      amlStatus: "approved",
      actor: "test",
    });
    recordBitcoinTxHash({ settlementId: r.settlementId, btcTxHash: "a".repeat(64), actor: "test" });
    const out = markBitcoinSettlementSettled({ settlementId: r.settlementId, actor: "test" });
    expect(out.ok).toBe(false);
  });

  it("settles only after confirmations >= required", () => {
    const r = make({ settlementId: "BTC-T-FIN2" });
    requestBitcoinSettlementApproval({
      settlementId: r.settlementId,
      kycStatus: "approved",
      amlStatus: "approved",
      actor: "test",
    });
    recordBitcoinTxHash({ settlementId: r.settlementId, btcTxHash: "a".repeat(64), actor: "test" });
    updateBitcoinConfirmations({ settlementId: r.settlementId, confirmationsObserved: 3, actor: "test" });
    const out = markBitcoinSettlementSettled({ settlementId: r.settlementId, actor: "test" });
    expect(out.ok).toBe(true);
    expect(out.record?.settlementStatus).toBe("SETTLED");
  });
});

describe("blocked settlements", () => {
  it("cannot proceed after block", () => {
    const r = make({ settlementId: "BTC-T-BLK" });
    blockBitcoinSettlement(r.settlementId, "test block", "test");
    const out = recordBitcoinTxHash({
      settlementId: r.settlementId,
      btcTxHash: "a".repeat(64),
      actor: "test",
    });
    expect(out.ok).toBe(false);
  });
});
