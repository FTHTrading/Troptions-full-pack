/**
 * Tests for TROPTIONS Platform — Guards
 */

import {
  isMockAdapter,
  isProductionReady,
  isComplianceApproved,
  hasRequiredCredentials,
  canExecute,
  assertNoFakeTxHash,
  assertNoFthReference,
} from "@/lib/troptions/platform/guards";
import type { ExecutionRequest } from "@/lib/troptions/platform/types";

function makeRequest(overrides: Partial<ExecutionRequest> = {}): ExecutionRequest {
  return {
    requestId: "req-test",
    namespaceId: "ns-test",
    adapterCategory: "payment",
    adapterStatus: "production_ready",
    complianceStatus: "approved",
    credentialsPresent: true,
    isSandbox: false,
    isMock: false,
    isManualProof: false,
    requestedBy: "test",
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe("isMockAdapter", () => {
  it("returns true for mock", () => expect(isMockAdapter("mock")).toBe(true));
  it("returns true for manual_proof", () => expect(isMockAdapter("manual_proof")).toBe(true));
  it("returns false for payment", () => expect(isMockAdapter("payment")).toBe(false));
});

describe("isProductionReady", () => {
  it("returns true for production_ready", () => {
    expect(isProductionReady("production_ready")).toBe(true);
  });
  it("returns false for sandbox_ready", () => {
    expect(isProductionReady("sandbox_ready")).toBe(false);
  });
});

describe("isComplianceApproved", () => {
  it("allows approved", () => expect(isComplianceApproved("approved")).toBe(true));
  it("allows not_required", () => expect(isComplianceApproved("not_required")).toBe(true));
  it("blocks pending", () => expect(isComplianceApproved("pending")).toBe(false));
});

describe("hasRequiredCredentials", () => {
  it("returns true when all credentials present", () => {
    expect(hasRequiredCredentials(["KEY", "SECRET"], ["KEY", "SECRET"])).toBe(true);
  });
  it("returns false when a credential is missing", () => {
    expect(hasRequiredCredentials(["KEY", "SECRET"], ["KEY"])).toBe(false);
  });
  it("returns true when no credentials required", () => {
    expect(hasRequiredCredentials([], [])).toBe(true);
  });
});

describe("canExecute", () => {
  it("returns true for a fully compliant request", () => {
    expect(canExecute(makeRequest())).toBe(true);
  });

  it("returns false for mock adapter", () => {
    expect(canExecute(makeRequest({ isMock: true }))).toBe(false);
  });

  it("returns false for manual_proof adapter", () => {
    expect(canExecute(makeRequest({ isManualProof: true }))).toBe(false);
  });

  it("returns false when credentials missing", () => {
    expect(canExecute(makeRequest({ credentialsPresent: false }))).toBe(false);
  });

  it("returns false when compliance is pending", () => {
    expect(canExecute(makeRequest({ complianceStatus: "pending" }))).toBe(false);
  });

  it("returns false for sandbox", () => {
    expect(canExecute(makeRequest({ isSandbox: true }))).toBe(false);
  });

  it("returns false for non-production_ready status", () => {
    expect(canExecute(makeRequest({ adapterStatus: "sandbox_ready" }))).toBe(false);
  });
});

describe("assertNoFakeTxHash", () => {
  it("does not throw for real-looking hash", () => {
    expect(() => assertNoFakeTxHash("abc123def456")).not.toThrow();
  });
  it("does not throw for null", () => {
    expect(() => assertNoFakeTxHash(null)).not.toThrow();
  });
  it("throws for FAKE hash", () => {
    expect(() => assertNoFakeTxHash("FAKE-HASH-001")).toThrow();
  });
  it("throws for 0x0000 hash", () => {
    expect(() => assertNoFakeTxHash("0x0000000000")).toThrow();
  });
  it("throws for MOCK hash", () => {
    expect(() => assertNoFakeTxHash("MOCK_TX_HASH")).toThrow();
  });
});

describe("assertNoFthReference", () => {
  it("does not throw for TROPTIONS-only text", () => {
    expect(() => assertNoFthReference("TROPTIONS platform")).not.toThrow();
  });
  it("throws for FTH reference", () => {
    expect(() => assertNoFthReference("FTH token")).toThrow();
  });
  it("throws for FTHX reference", () => {
    expect(() => assertNoFthReference("FTHX rewards")).toThrow();
  });
  it("throws for Future Tech Holdings", () => {
    expect(() => assertNoFthReference("Future Tech Holdings Inc")).toThrow();
  });
});
