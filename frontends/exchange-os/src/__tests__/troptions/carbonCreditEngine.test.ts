/**
 * Carbon Credit Engine Tests
 *
 * Verifies validation, readiness scoring, status transitions,
 * and audit-event emission for the simulation-only carbon module.
 */

import {
  calculateCarbonReadinessScore,
  clearCarbonRegistry,
  createCarbonAssetRecord,
  markCarbonCreditRetired,
  updateCarbonAssetStatus,
  validateCarbonCreditRecord,
  type CreateCarbonAssetInput,
} from "@/lib/troptions/carbonCreditEngine";
import { clearCarbonBitcoinAuditLog, listCarbonBitcoinAuditEvents } from "@/lib/troptions/carbonBitcoinAuditLog";

const baseInput = (overrides: Partial<CreateCarbonAssetInput> = {}): CreateCarbonAssetInput => ({
  carbonAssetId: "CRB-TEST-001",
  registryName: "Verra",
  projectId: "VCS-TEST-1",
  projectName: "Test Reforestation",
  projectLocation: "Brazil",
  projectType: "Reforestation",
  methodology: "VM0007",
  vintageYear: 2024,
  creditQuantity: 1000,
  unitType: "tCO2e",
  serialNumbers: ["VCS-001"],
  ownerName: "TROPTIONS Demo Holder LLC",
  ...overrides,
});

beforeEach(() => {
  clearCarbonRegistry();
  clearCarbonBitcoinAuditLog();
});

describe("validateCarbonCreditRecord", () => {
  it("accepts a fully populated record", () => {
    const r = createCarbonAssetRecord(baseInput());
    const v = validateCarbonCreditRecord(r);
    expect(v.valid).toBe(true);
    expect(v.errors).toHaveLength(0);
  });

  it("flags missing serial numbers", () => {
    const r = createCarbonAssetRecord(baseInput({ serialNumbers: [] }));
    const v = validateCarbonCreditRecord(r);
    expect([...v.errors, ...v.warnings].some((e) => /serial/i.test(e))).toBe(true);
  });

  it("flags negative or zero quantity", () => {
    const r = createCarbonAssetRecord(baseInput({ creditQuantity: 0 }));
    const v = validateCarbonCreditRecord(r);
    expect(v.valid).toBe(false);
  });
});

describe("calculateCarbonReadinessScore", () => {
  it("caps blocked records at 0", () => {
    const r = createCarbonAssetRecord(baseInput({ carbonAssetId: "CRB-TEST-BLK" }));
    updateCarbonAssetStatus({
      carbonAssetId: r.carbonAssetId,
      newStatus: "BLOCKED",
      reason: "test block",
      actor: "test",
    });
    const updated = createCarbonAssetRecord({ ...baseInput({ carbonAssetId: "CRB-TEST-BLK2" }) });
    updated.status = "BLOCKED";
    expect(calculateCarbonReadinessScore(updated)).toBe(0);
  });

  it("caps records missing serial numbers at 60", () => {
    const r = createCarbonAssetRecord(baseInput({ carbonAssetId: "CRB-TEST-NO-SERIAL", serialNumbers: [] }));
    expect(calculateCarbonReadinessScore(r)).toBeLessThanOrEqual(60);
  });

  it("caps records missing ownership at 70", () => {
    const r = createCarbonAssetRecord(baseInput({ carbonAssetId: "CRB-TEST-NO-OWN" }));
    // Direct mutation simulating an asset where owner data was later wiped.
    r.ownerName = "";
    expect(calculateCarbonReadinessScore(r)).toBeLessThanOrEqual(70);
  });
});

describe("status transitions", () => {
  it("blocks RETIRED → SOLD without overrideApprovalId", () => {
    const r = createCarbonAssetRecord(baseInput({ carbonAssetId: "CRB-TEST-RET" }));
    const retired = markCarbonCreditRetired({
      carbonAssetId: r.carbonAssetId,
      retirementCertificateUrl: "https://example.com/cert",
      actor: "test",
    });
    expect(retired.ok).toBe(true);
    const result = updateCarbonAssetStatus({
      carbonAssetId: r.carbonAssetId,
      newStatus: "SOLD",
      reason: "attempting illegal resale",
      actor: "test",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/override/i);
  });

  it("allows RETIRED → SOLD with override approval", () => {
    const r = createCarbonAssetRecord(baseInput({ carbonAssetId: "CRB-TEST-OVR" }));
    markCarbonCreditRetired({
      carbonAssetId: r.carbonAssetId,
      retirementCertificateUrl: "https://example.com/cert",
      actor: "test",
    });
    const result = updateCarbonAssetStatus({
      carbonAssetId: r.carbonAssetId,
      newStatus: "SOLD",
      reason: "override path test",
      actor: "test",
      overrideApprovalId: "APPR-001",
    });
    expect(result.ok).toBe(true);
    expect(result.record?.status).toBe("SOLD");
  });

  it("emits audit events for status changes", () => {
    const r = createCarbonAssetRecord(baseInput({ carbonAssetId: "CRB-TEST-AUDIT" }));
    updateCarbonAssetStatus({
      carbonAssetId: r.carbonAssetId,
      newStatus: "VERIFIED_ACTIVE",
      reason: "verified",
      actor: "test",
    });
    const events = listCarbonBitcoinAuditEvents({ relatedAssetId: r.carbonAssetId });
    expect(events.length).toBeGreaterThan(0);
  });
});
