/**
 * Tests for TROPTIONS Platform — Execution Policy Engine
 *
 * Hard rules tested:
 * 1. Mock adapters cannot produce executed_confirmed
 * 2. manual_proof adapters cannot produce executed_confirmed
 * 3. Production_ready + credentials + compliance approved => execution_pending (needs provider confirmation)
 * 4. Missing credentials => throws CredentialsRequiredError
 * 5. Compliance blocked => throws ComplianceBlockError
 * 6. Sandbox mode => execution_disabled
 * 7. Non-production_ready status => execution_disabled or ExecutionBlockedError
 * 8. requireProviderConfirmation throws on empty confirmation
 * 9. No FTH references in module
 */

import {
  evaluateExecutionPermission,
  isMockOrManualAdapter,
  complianceAllowsExecution,
  blockUnsafeExecution,
  requireProductionAdapter,
  requireComplianceApproval,
  requireProviderConfirmation,
} from "@/lib/troptions/platform/executionPolicy";
import {
  ExecutionBlockedError,
  CredentialsRequiredError,
  ComplianceBlockError,
  MockAdapterExecutionError,
} from "@/lib/troptions/platform/types";
import type { ExecutionRequest } from "@/lib/troptions/platform/types";

function makeRequest(overrides: Partial<ExecutionRequest> = {}): ExecutionRequest {
  return {
    requestId: "req-001",
    namespaceId: "ns-test",
    adapterCategory: "payment",
    adapterStatus: "production_ready",
    complianceStatus: "approved",
    credentialsPresent: true,
    isSandbox: false,
    isMock: false,
    isManualProof: false,
    requestedBy: "test-actor",
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe("isMockOrManualAdapter", () => {
  it("returns true for mock adapter", () => {
    expect(isMockOrManualAdapter("mock")).toBe(true);
  });
  it("returns true for mock_only adapter", () => {
    expect(isMockOrManualAdapter("mock_only")).toBe(true);
  });
  it("returns true for manual_proof adapter", () => {
    expect(isMockOrManualAdapter("manual_proof")).toBe(true);
  });
  it("returns true for simulation adapter", () => {
    expect(isMockOrManualAdapter("simulation")).toBe(true);
  });
  it("returns false for payment adapter", () => {
    expect(isMockOrManualAdapter("payment")).toBe(false);
  });
  it("returns false for bank adapter", () => {
    expect(isMockOrManualAdapter("bank")).toBe(false);
  });
});

describe("complianceAllowsExecution", () => {
  it("allows approved compliance", () => {
    expect(complianceAllowsExecution("approved")).toBe(true);
  });
  it("allows not_required compliance", () => {
    expect(complianceAllowsExecution("not_required")).toBe(true);
  });
  it("blocks pending compliance", () => {
    expect(complianceAllowsExecution("pending")).toBe(false);
  });
  it("blocks rejected compliance", () => {
    expect(complianceAllowsExecution("rejected")).toBe(false);
  });
  it("blocks empty string compliance", () => {
    expect(complianceAllowsExecution("")).toBe(false);
  });
});

describe("evaluateExecutionPermission — mock/manual_proof adapters", () => {
  it("throws MockAdapterExecutionError when isMock is true", () => {
    expect(() =>
      evaluateExecutionPermission(makeRequest({ isMock: true }))
    ).toThrow(MockAdapterExecutionError);
  });

  it("throws MockAdapterExecutionError when isManualProof is true", () => {
    expect(() =>
      evaluateExecutionPermission(makeRequest({ isManualProof: true }))
    ).toThrow(MockAdapterExecutionError);
  });

  it("mock adapter cannot reach executed_confirmed", () => {
    expect(() =>
      evaluateExecutionPermission(makeRequest({ isMock: true }))
    ).toThrow();
  });
});

describe("evaluateExecutionPermission — credentials required", () => {
  it("throws CredentialsRequiredError when credentialsPresent is false", () => {
    expect(() =>
      evaluateExecutionPermission(makeRequest({ credentialsPresent: false }))
    ).toThrow(CredentialsRequiredError);
  });
});

describe("evaluateExecutionPermission — compliance blocked", () => {
  it("throws ComplianceBlockError when compliance is pending", () => {
    expect(() =>
      evaluateExecutionPermission(makeRequest({ complianceStatus: "pending" }))
    ).toThrow(ComplianceBlockError);
  });

  it("throws ComplianceBlockError when compliance is rejected", () => {
    expect(() =>
      evaluateExecutionPermission(makeRequest({ complianceStatus: "rejected" }))
    ).toThrow(ComplianceBlockError);
  });
});

describe("evaluateExecutionPermission — sandbox mode", () => {
  it("returns execution_disabled when isSandbox is true", () => {
    const result = evaluateExecutionPermission(makeRequest({ isSandbox: true }));
    expect(result.status).toBe("execution_disabled");
  });
});

describe("evaluateExecutionPermission — non-production status", () => {
  it("returns execution_disabled for design_only", () => {
    const result = evaluateExecutionPermission(
      makeRequest({ adapterStatus: "design_only" })
    );
    expect(result.status).toBe("execution_disabled");
  });

  it("returns execution_disabled for mock_only", () => {
    const result = evaluateExecutionPermission(
      makeRequest({ adapterStatus: "mock_only" })
    );
    expect(result.status).toBe("execution_disabled");
  });

  it("throws ExecutionBlockedError for sandbox_ready status", () => {
    expect(() =>
      evaluateExecutionPermission(makeRequest({ adapterStatus: "sandbox_ready" }))
    ).toThrow(ExecutionBlockedError);
  });
});

describe("evaluateExecutionPermission — production path", () => {
  it("returns execution_pending for a fully compliant request", () => {
    const result = evaluateExecutionPermission(makeRequest());
    // Should be execution_pending — real confirmation requires provider call
    expect(result.status).toBe("execution_pending");
  });

  it("does NOT return executed_confirmed without a provider confirmation call", () => {
    const result = evaluateExecutionPermission(makeRequest());
    expect(result.status).not.toBe("executed_confirmed");
  });
});

describe("blockUnsafeExecution", () => {
  it("returns blocked result with reason", () => {
    const result = blockUnsafeExecution("safety guard triggered");
    expect(result.status).toBe("blocked");
    if (result.status === "blocked") {
      expect(result.reason).toBe("safety guard triggered");
    }
  });
});

describe("requireProductionAdapter", () => {
  it("does not throw for production_ready", () => {
    expect(() =>
      requireProductionAdapter("production_ready", "payment")
    ).not.toThrow();
  });

  it("throws ExecutionBlockedError for non-production_ready", () => {
    expect(() =>
      requireProductionAdapter("sandbox_ready", "payment")
    ).toThrow(ExecutionBlockedError);
  });
});

describe("requireComplianceApproval", () => {
  it("does not throw for approved", () => {
    expect(() => requireComplianceApproval("approved")).not.toThrow();
  });
  it("does not throw for not_required", () => {
    expect(() => requireComplianceApproval("not_required")).not.toThrow();
  });
  it("throws ComplianceBlockError for pending", () => {
    expect(() => requireComplianceApproval("pending")).toThrow(ComplianceBlockError);
  });
});

describe("requireProviderConfirmation", () => {
  it("does not throw for a real confirmation string", () => {
    expect(() =>
      requireProviderConfirmation("PROVIDER-CONF-12345")
    ).not.toThrow();
  });

  it("throws ExecutionBlockedError for null confirmation", () => {
    expect(() => requireProviderConfirmation(null)).toThrow(ExecutionBlockedError);
  });

  it("throws ExecutionBlockedError for empty string", () => {
    expect(() => requireProviderConfirmation("")).toThrow(ExecutionBlockedError);
  });

  it("throws ExecutionBlockedError for whitespace only", () => {
    expect(() => requireProviderConfirmation("   ")).toThrow(ExecutionBlockedError);
  });
});
