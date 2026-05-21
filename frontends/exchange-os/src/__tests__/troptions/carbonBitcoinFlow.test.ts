/**
 * Carbon-Bitcoin cross-module flow tests — simulation only.
 */

import {
  clearCarbonRegistry,
  createCarbonAssetRecord,
  markCarbonCreditRetired,
  updateCarbonAssetStatus,
} from "@/lib/troptions/carbonCreditEngine";
import { clearBitcoinSettlementRegistry } from "@/lib/troptions/bitcoinSettlementEngine";
import { clearCarbonBitcoinAuditLog } from "@/lib/troptions/carbonBitcoinAuditLog";
import { createCarbonCreditBitcoinSettlementFlow } from "@/lib/troptions/carbonBitcoinFlowEngine";

beforeEach(() => {
  clearCarbonRegistry();
  clearBitcoinSettlementRegistry();
  clearCarbonBitcoinAuditLog();
});

const seedAsset = (overrides: Record<string, unknown> = {}) => {
  const r = createCarbonAssetRecord({
    carbonAssetId: "CRB-FLOW-001",
    registryName: "Verra (demo)",
    projectId: "VCS-FLOW-1",
    projectName: "Flow Test",
    projectLocation: "Brazil",
    projectType: "Reforestation",
    methodology: "VM0007",
    vintageYear: 2024,
    creditQuantity: 1000,
    serialNumbers: ["FLOW-1"],
    ownerName: "TROPTIONS Demo Holder LLC",
    ...overrides,
  });
  return r;
};

const verify = (id: string) => {
  updateCarbonAssetStatus({
    carbonAssetId: id,
    newStatus: "PENDING_VERIFICATION",
    actor: "test",
    reason: "test",
  });
  updateCarbonAssetStatus({
    carbonAssetId: id,
    newStatus: "VERIFIED_ACTIVE",
    actor: "test",
    reason: "test",
  });
};

describe("carbon → BTC flow", () => {
  it("returns simulated:true and never executes real payment", () => {
    seedAsset();
    const out = createCarbonCreditBitcoinSettlementFlow({
      carbonAssetId: "CRB-FLOW-001",
      settlementId: "BTC-FLOW-001",
      payerName: "P",
      payeeName: "Q",
      usdReferenceValue: 1000,
      providerName: "Demo Provider",
      actor: "test",
    });
    expect(out.simulated).toBe(true);
    expect(out.bitcoinSettlement?.btcTxHash).toBeNull();
    expect(out.bitcoinSettlement?.settlementStatus).not.toBe("SETTLED");
  });

  it("blocks when carbon asset does not exist", () => {
    const out = createCarbonCreditBitcoinSettlementFlow({
      carbonAssetId: "NOPE",
      settlementId: "BTC-FLOW-002",
      payerName: "P",
      payeeName: "Q",
      usdReferenceValue: 100,
      providerName: "Demo Provider",
      actor: "test",
    });
    expect(out.blocked).toBe(true);
    expect(out.blockingReasons.some((r) => /not found/i.test(r))).toBe(true);
  });

  it("blocks when provider missing", () => {
    seedAsset();
    verify("CRB-FLOW-001");
    const out = createCarbonCreditBitcoinSettlementFlow({
      carbonAssetId: "CRB-FLOW-001",
      settlementId: "BTC-FLOW-003",
      payerName: "P",
      payeeName: "Q",
      usdReferenceValue: 100,
      actor: "test",
    });
    expect(out.blocked).toBe(true);
    expect(out.blockingReasons.some((r) => /provider/i.test(r))).toBe(true);
  });

  it("blocks when carbon credit already RETIRED", () => {
    seedAsset({ carbonAssetId: "CRB-FLOW-RET" });
    verify("CRB-FLOW-RET");
    markCarbonCreditRetired({
      carbonAssetId: "CRB-FLOW-RET",
      retirementCertificateUrl: "https://example.com/cert",
      actor: "test",
    });
    const out = createCarbonCreditBitcoinSettlementFlow({
      carbonAssetId: "CRB-FLOW-RET",
      settlementId: "BTC-FLOW-RET",
      payerName: "P",
      payeeName: "Q",
      usdReferenceValue: 100,
      providerName: "Demo Provider",
      actor: "test",
    });
    expect(out.blocked).toBe(true);
    expect(out.blockingReasons.some((r) => /retired/i.test(r))).toBe(true);
  });

  it("includes both disclosures and approval gates", () => {
    seedAsset();
    verify("CRB-FLOW-001");
    const out = createCarbonCreditBitcoinSettlementFlow({
      carbonAssetId: "CRB-FLOW-001",
      settlementId: "BTC-FLOW-OK",
      payerName: "P",
      payeeName: "Q",
      usdReferenceValue: 100,
      providerName: "Demo Provider",
      actor: "test",
    });
    expect(out.disclosures.carbon).toMatch(/carbon/i);
    expect(out.disclosures.bitcoin).toMatch(/bitcoin/i);
    expect(out.approvalGatesRequired).toContain("kyc-approval");
    expect(out.approvalGatesRequired).toContain("aml-approval");
  });
});
