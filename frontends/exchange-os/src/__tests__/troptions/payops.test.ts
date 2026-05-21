/**
 * TROPTIONS PayOps — Tests
 *
 * Tests for: status transitions, compliance logic, fees, adapter rules, mock data shape.
 */

import {
  isValidTransition,
  transitionPayoutStatus,
  adapterCanExecute,
  isTerminalStatus,
  isBlocked,
} from "@/lib/troptions/payops/status";
import {
  isPayeeCompliant,
  getPayeeComplianceIssues,
  complianceStatusAllowsExecution,
  getRequiredComplianceChecks,
} from "@/lib/troptions/payops/compliance";
import { calculatePayoutFee, estimateBatchFee } from "@/lib/troptions/payops/fees";
import { createAuditEvent } from "@/lib/troptions/payops/audit";
import {
  getMockPayOpsClient,
  getMockPayees,
  getMockPayoutBatches,
  getMockAuditEvents,
} from "@/lib/troptions/payops/mockData";
import { canAdapterExecutePayouts } from "@/lib/troptions/payops/adapters";
import type { TroptionsPayee, TroptionsProviderAdapter } from "@/lib/troptions/payops/types";

// ─── Status Transitions ───────────────────────────────────────────────────────

describe("PayOps status transitions", () => {
  test("draft → pending_approval is valid", () => {
    expect(isValidTransition("draft", "pending_approval")).toBe(true);
  });

  test("pending_approval → approved_not_executed is valid", () => {
    expect(isValidTransition("pending_approval", "approved_not_executed")).toBe(true);
  });

  test("approved_not_executed → execution_pending is valid", () => {
    expect(isValidTransition("approved_not_executed", "execution_pending")).toBe(true);
  });

  test("approved_not_executed → executed is NOT valid (must go through execution_pending)", () => {
    expect(isValidTransition("approved_not_executed", "executed")).toBe(false);
  });

  test("draft → executed is NOT valid (cannot skip steps)", () => {
    expect(isValidTransition("draft", "executed")).toBe(false);
  });

  test("executed → any other status is NOT valid (terminal)", () => {
    expect(isValidTransition("executed", "draft")).toBe(false);
    expect(isValidTransition("executed", "pending_approval")).toBe(false);
    expect(isValidTransition("executed", "cancelled")).toBe(false);
  });

  test("cancelled is terminal", () => {
    expect(isTerminalStatus("cancelled")).toBe(true);
  });

  test("executed is terminal", () => {
    expect(isTerminalStatus("executed")).toBe(true);
  });

  test("blocked_by_compliance is blocked", () => {
    expect(isBlocked("blocked_by_compliance")).toBe(true);
  });

  test("draft is not blocked", () => {
    expect(isBlocked("draft")).toBe(false);
  });
});

// ─── Adapter Execution Rules ──────────────────────────────────────────────────

describe("adapterCanExecute", () => {
  test("mock adapter cannot execute", () => {
    expect(adapterCanExecute("mock")).toBe(false);
  });

  test("manual_proof adapter cannot execute", () => {
    expect(adapterCanExecute("manual_proof")).toBe(false);
  });

  test("bank_partner adapter CAN execute (by category)", () => {
    expect(adapterCanExecute("bank_partner")).toBe(true);
  });

  test("payroll_partner adapter CAN execute (by category)", () => {
    expect(adapterCanExecute("payroll_partner")).toBe(true);
  });

  test("accounting_partner cannot execute", () => {
    expect(adapterCanExecute("accounting_partner")).toBe(false);
  });
});

describe("transitionPayoutStatus — mock adapter cannot reach executed", () => {
  test("mock adapter cannot transition to execution_pending", () => {
    const result = transitionPayoutStatus(
      "approved_not_executed",
      "execution_pending",
      "mock"
    );
    expect(result.ok).toBe(false);
  });

  test("bank_partner adapter CAN transition to execution_pending", () => {
    const result = transitionPayoutStatus(
      "approved_not_executed",
      "execution_pending",
      "bank_partner"
    );
    expect(result.ok).toBe(true);
  });

  test("blocked_by_compliance cannot transition to pending_approval", () => {
    const result = transitionPayoutStatus(
      "blocked_by_compliance",
      "pending_approval",
      "mock"
    );
    expect(result.ok).toBe(false);
  });
});

describe("canAdapterExecutePayouts (full adapter object)", () => {
  const mockAdapter: TroptionsProviderAdapter = {
    id: "adapter-001",
    namespaceId: "ns-test",
    name: "Mock",
    category: "mock",
    status: "approved",
    environment: "mock",
    isConfigured: true,
    supportsExecution: false,
    supportedActions: [],
    requiredCredentials: [],
    complianceNotes: "",
    description: "",
  };

  const bankAdapter: TroptionsProviderAdapter = {
    id: "adapter-002",
    namespaceId: "ns-test",
    name: "Bank",
    category: "bank_partner",
    status: "approved",
    environment: "production",
    isConfigured: true,
    supportsExecution: true,
    supportedActions: [],
    requiredCredentials: [],
    complianceNotes: "",
    description: "",
  };

  test("mock adapter object cannot execute payouts", () => {
    expect(canAdapterExecutePayouts(mockAdapter)).toBe(false);
  });

  test("configured bank_partner in production CAN execute payouts", () => {
    expect(canAdapterExecutePayouts(bankAdapter)).toBe(true);
  });

  test("bank_partner not yet in production cannot execute", () => {
    expect(canAdapterExecutePayouts({ ...bankAdapter, environment: "sandbox" })).toBe(false);
  });

  test("bank_partner not configured cannot execute", () => {
    expect(canAdapterExecutePayouts({ ...bankAdapter, isConfigured: false })).toBe(false);
  });
});

// ─── Compliance Guards ────────────────────────────────────────────────────────

describe("isPayeeCompliant", () => {
  const goodPayee: TroptionsPayee = {
    id: "p-001",
    namespaceId: "ns-test",
    name: "Test Payee",
    email: "test@example.com",
    payeeType: "contractor",
    payoutPreference: "bank_transfer",
    complianceStatus: "approved",
    kycStatus: "approved",
    w9w8Status: "approved",
    sanctionsScreeningStatus: "approved",
    isActive: true,
    totalPaidAmount: 0,
    currency: "USD",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };

  const blockedPayee: TroptionsPayee = {
    ...goodPayee,
    id: "p-002",
    complianceStatus: "blocked",
    sanctionsScreeningStatus: "blocked",
  };

  test("payee with all approved statuses is compliant", () => {
    expect(isPayeeCompliant(goodPayee)).toBe(true);
  });

  test("payee with blocked compliance is not compliant", () => {
    expect(isPayeeCompliant(blockedPayee)).toBe(false);
  });

  test("payee with rejected kyc is not compliant", () => {
    expect(isPayeeCompliant({ ...goodPayee, kycStatus: "rejected" })).toBe(false);
  });

  test("blocked payee has compliance issues", () => {
    const issues = getPayeeComplianceIssues(blockedPayee);
    expect(issues.length).toBeGreaterThan(0);
  });

  test("approved payee has no compliance issues", () => {
    const issues = getPayeeComplianceIssues(goodPayee);
    expect(issues.length).toBe(0);
  });
});

describe("complianceStatusAllowsExecution", () => {
  test("approved allows execution", () => {
    expect(complianceStatusAllowsExecution("approved")).toBe(true);
  });

  test("pending does NOT allow execution", () => {
    expect(complianceStatusAllowsExecution("pending")).toBe(false);
  });

  test("blocked does NOT allow execution", () => {
    expect(complianceStatusAllowsExecution("blocked")).toBe(false);
  });
});

describe("getRequiredComplianceChecks", () => {
  test("contractor_payout requires w9_w8", () => {
    const checks = getRequiredComplianceChecks("contractor_payout");
    expect(checks).toContain("w9_w8");
  });

  test("vendor_payment requires kyb", () => {
    const checks = getRequiredComplianceChecks("vendor_payment");
    expect(checks).toContain("kyb");
  });

  test("sales_commission does not require w9_w8", () => {
    const checks = getRequiredComplianceChecks("sales_commission");
    expect(checks).not.toContain("w9_w8");
  });

  test("all payout types require kyc and sanctions", () => {
    const types = [
      "contractor_payout",
      "vendor_payment",
      "sales_commission",
      "member_reward",
    ];
    for (const t of types) {
      const checks = getRequiredComplianceChecks(t);
      expect(checks).toContain("kyc");
      expect(checks).toContain("sanctions_screening");
    }
  });
});

// ─── Fee Calculation ──────────────────────────────────────────────────────────

describe("calculatePayoutFee", () => {
  test("starter tier: 1.5% of $1000 = $15", () => {
    expect(calculatePayoutFee(1000, "starter")).toBeCloseTo(15, 1);
  });

  test("fee is floored at minimum", () => {
    expect(calculatePayoutFee(10, "starter")).toBeGreaterThanOrEqual(2.5);
  });

  test("fee is capped at maximum", () => {
    expect(calculatePayoutFee(1_000_000, "starter")).toBeLessThanOrEqual(250);
  });

  test("growth tier has lower rate than starter", () => {
    const starter = calculatePayoutFee(10000, "starter");
    const growth = calculatePayoutFee(10000, "growth");
    expect(growth).toBeLessThan(starter);
  });

  test("estimateBatchFee returns structured result", () => {
    const result = estimateBatchFee(5000, 5, "growth", true, true);
    expect(result).toHaveProperty("payoutFee");
    expect(result).toHaveProperty("compliancePacketFee");
    expect(result).toHaveProperty("exportFee");
    expect(result.totalEstimatedFee).toBeGreaterThan(0);
  });
});

// ─── Audit Event Factory ──────────────────────────────────────────────────────

describe("createAuditEvent", () => {
  test("returns event with required fields", () => {
    const event = createAuditEvent({
      namespaceId: "ns-test",
      action: "payout_batch.created",
      actorId: "user-001",
      actorType: "user",
      resourceType: "payout_batch",
      resourceId: "batch-001",
      outcome: "success",
    });
    expect(event.id).toMatch(/^audit-/);
    expect(event.namespaceId).toBe("ns-test");
    expect(event.action).toBe("payout_batch.created");
    expect(event.timestamp).toBeTruthy();
    expect(event.outcome).toBe("success");
  });

  test("blocked outcome is preserved", () => {
    const event = createAuditEvent({
      namespaceId: "ns-test",
      action: "payout_batch.blocked_by_compliance",
      actorId: "system",
      actorType: "system",
      resourceType: "payout_batch",
      resourceId: "batch-002",
      outcome: "blocked",
      metadata: { reason: "KYC not done" },
    });
    expect(event.outcome).toBe("blocked");
    expect(event.metadata?.reason).toBe("KYC not done");
  });
});

// ─── Mock Data Shape ──────────────────────────────────────────────────────────

describe("getMockPayOpsClient", () => {
  test("returns a valid TroptionsPayOpsClient structure", () => {
    const client = getMockPayOpsClient("troptions-nil");
    expect(client.namespaceSlug).toBe("troptions-nil");
    expect(typeof client.totalPayees).toBe("number");
    expect(typeof client.executedPayouts).toBe("number");
    // RULE: executed payouts must always be 0 in mock (no live adapter)
    expect(client.executedPayouts).toBe(0);
  });
});

describe("getMockPayees", () => {
  test("returns payees with expected fields", () => {
    const payees = getMockPayees("ns-payops-test");
    expect(payees.length).toBeGreaterThan(0);
    const payee = payees[0];
    expect(payee).toHaveProperty("id");
    expect(payee).toHaveProperty("name");
    expect(payee).toHaveProperty("complianceStatus");
  });

  test("at least one payee is blocked in mock data", () => {
    const payees = getMockPayees("ns-payops-test");
    const blocked = payees.filter((p) => !isPayeeCompliant(p));
    expect(blocked.length).toBeGreaterThan(0);
  });
});

describe("getMockPayoutBatches", () => {
  test("returns batches with expected statuses", () => {
    const batches = getMockPayoutBatches("ns-payops-test");
    expect(batches.length).toBeGreaterThan(0);
    const statuses = batches.map((b) => b.status);
    expect(statuses).toContain("approved_not_executed");
  });

  test("no batch has executed status in mock data", () => {
    const batches = getMockPayoutBatches("ns-payops-test");
    const executed = batches.filter((b) => b.status === "executed");
    // RULE: Mock adapter cannot produce executed status
    expect(executed.length).toBe(0);
  });
});
