import {
  requestApproval,
  approveApproval,
} from "@/lib/troptions/approvalEngine";
import { transitionWorkflow } from "@/lib/troptions/workflowEngine";
import { verifyAuditChain } from "@/lib/troptions/auditLogEngine";
import { resolveException } from "@/lib/troptions/exceptionEngine";
import {
  evaluateClaimPublicationGate,
  evaluateAssetIssuanceGate,
  evaluateStableUnitLaunchGate,
  evaluateSettlementReleaseGate,
  evaluateInvestorAccessGate,
  evaluatePublicContentReleaseGate,
} from "@/lib/troptions/releaseGateEngine";
import { assertHardGateBypassForbidden } from "@/lib/troptions/authorizationEngine";
import { AUDIT_LOG_REGISTRY } from "@/content/troptions/auditLogRegistry";
import { APPROVAL_REGISTRY } from "@/content/troptions/approvalRegistry";

describe("Phase 4 - Troptions Operational Control Plane", () => {
  it("1. AI concierge cannot approve anything", () => {
    const record = requestApproval({
      subjectId: "ASSET-TPAY-001",
      subjectType: "asset",
      approvalType: "legal-approval",
      requestedBy: "issuer-admin-1",
      assignedTo: "legal-reviewer-1",
      actorRole: "issuer-admin",
      evidenceIds: ["claim-legal-memo"],
      notes: "test approval",
    });

    expect(() =>
      approveApproval({
        approvalId: record.approvalId,
        actorId: "ai-agent",
        actorRole: "ai-concierge",
        decisionReason: "cannot",
      }),
    ).toThrow();
  });

  it("2. Viewer cannot transition workflows", () => {
    expect(() =>
      transitionWorkflow({
        subjectId: "WF-INTAKE-001",
        subjectType: "workflow",
        fromStatus: "not-started",
        toStatus: "in-progress",
        actorRole: "viewer",
        reason: "viewer attempt",
        evidenceIds: ["intake-record"],
        approvalIds: [],
      }),
    ).toThrow();
  });

  it("3. Legal reviewer can approve legal review only", () => {
    const legal = requestApproval({
      subjectId: "ASSET-XTROP-001",
      subjectType: "asset",
      approvalType: "legal-approval",
      requestedBy: "issuer-admin-1",
      assignedTo: "legal-reviewer-1",
      actorRole: "issuer-admin",
      evidenceIds: ["claim-legal-memo"],
      notes: "legal approval test",
    });

    expect(
      approveApproval({
        approvalId: legal.approvalId,
        actorId: "legal-reviewer-1",
        actorRole: "legal-reviewer",
        decisionReason: "approved legal",
      }).status,
    ).toBe("approved");

    const custody = requestApproval({
      subjectId: "ASSET-XTROP-001",
      subjectType: "asset",
      approvalType: "custody-approval",
      requestedBy: "issuer-admin-1",
      assignedTo: "custody-officer-1",
      actorRole: "issuer-admin",
      evidenceIds: ["vault-receipt-draft"],
      notes: "custody approval test",
    });

    expect(() =>
      approveApproval({
        approvalId: custody.approvalId,
        actorId: "legal-reviewer-1",
        actorRole: "legal-reviewer",
        decisionReason: "should fail",
      }),
    ).toThrow();
  });

  it("4. Custody officer can approve custody review only", () => {
    const custody = requestApproval({
      subjectId: "ASSET-XTROPAUS-001",
      subjectType: "asset",
      approvalType: "custody-approval",
      requestedBy: "issuer-admin-1",
      assignedTo: "custody-officer-1",
      actorRole: "issuer-admin",
      evidenceIds: ["vault-receipt-draft"],
      notes: "custody role test",
    });

    expect(
      approveApproval({
        approvalId: custody.approvalId,
        actorId: "custody-officer-1",
        actorRole: "custody-officer",
        decisionReason: "approved custody",
      }).status,
    ).toBe("approved");

    const legal = requestApproval({
      subjectId: "ASSET-XTROPAUS-001",
      subjectType: "asset",
      approvalType: "legal-approval",
      requestedBy: "issuer-admin-1",
      assignedTo: "legal-reviewer-1",
      actorRole: "issuer-admin",
      evidenceIds: ["claim-legal-memo"],
      notes: "legal role mismatch",
    });

    expect(() =>
      approveApproval({
        approvalId: legal.approvalId,
        actorId: "custody-officer-1",
        actorRole: "custody-officer",
        decisionReason: "should fail",
      }),
    ).toThrow();
  });

  it("5. Board member can approve board package only", () => {
    const board = requestApproval({
      subjectId: "WF-BOARD-001",
      subjectType: "workflow",
      approvalType: "board-approval",
      requestedBy: "compliance-officer-1",
      assignedTo: "board-member-1",
      actorRole: "compliance-officer",
      evidenceIds: ["board-pack-v1"],
      notes: "board package",
    });

    expect(
      approveApproval({
        approvalId: board.approvalId,
        actorId: "board-member-1",
        actorRole: "board-member",
        decisionReason: "board approved",
      }).status,
    ).toBe("approved");

    const legal = requestApproval({
      subjectId: "WF-LEGAL-001",
      subjectType: "workflow",
      approvalType: "legal-approval",
      requestedBy: "issuer-admin-1",
      assignedTo: "legal-reviewer-1",
      actorRole: "issuer-admin",
      evidenceIds: ["claim-legal-memo"],
      notes: "legal package",
    });

    expect(() =>
      approveApproval({
        approvalId: legal.approvalId,
        actorId: "board-member-1",
        actorRole: "board-member",
        decisionReason: "should fail",
      }),
    ).toThrow();
  });

  it("6. Super admin cannot bypass sanctions/prohibited jurisdiction", () => {
    expect(() => assertHardGateBypassForbidden("super-admin", "sanctions")).toThrow();
    expect(() => assertHardGateBypassForbidden("super-admin", "prohibited-jurisdiction")).toThrow();
  });

  it("7. Transition fails with open critical exception", () => {
    const legal = requestApproval({
      subjectId: "ASSET-TGOLD-001",
      subjectType: "asset",
      approvalType: "legal-approval",
      requestedBy: "issuer-admin-1",
      assignedTo: "legal-reviewer-1",
      actorRole: "issuer-admin",
      evidenceIds: ["claim-evidence-pack"],
      notes: "transition setup",
    });
    const custody = requestApproval({
      subjectId: "ASSET-TGOLD-001",
      subjectType: "asset",
      approvalType: "custody-approval",
      requestedBy: "issuer-admin-1",
      assignedTo: "custody-officer-1",
      actorRole: "issuer-admin",
      evidenceIds: ["claim-evidence-pack"],
      notes: "transition setup",
    });
    const compliance = requestApproval({
      subjectId: "ASSET-TGOLD-001",
      subjectType: "asset",
      approvalType: "compliance-approval",
      requestedBy: "issuer-admin-1",
      assignedTo: "compliance-officer-1",
      actorRole: "issuer-admin",
      evidenceIds: ["claim-evidence-pack"],
      notes: "transition setup",
    });

    approveApproval({
      approvalId: legal.approvalId,
      actorId: "legal-reviewer-1",
      actorRole: "legal-reviewer",
      decisionReason: "approved",
    });
    approveApproval({
      approvalId: custody.approvalId,
      actorId: "custody-officer-1",
      actorRole: "custody-officer",
      decisionReason: "approved",
    });
    approveApproval({
      approvalId: compliance.approvalId,
      actorId: "compliance-officer-1",
      actorRole: "compliance-officer",
      decisionReason: "approved",
    });

    const result = transitionWorkflow({
      subjectId: "ASSET-TGOLD-001",
      subjectType: "workflow",
      fromStatus: "in-progress",
      toStatus: "ready",
      actorRole: "compliance-officer",
      reason: "try transition with exception",
      evidenceIds: ["evidence-checklist"],
      approvalIds: [legal.approvalId, custody.approvalId, compliance.approvalId],
    });

    expect(result.success).toBe(false);
    expect(result.blocker).toBe("open-exception-present");
  });

  it("8. Transition fails without required evidence", () => {
    const result = transitionWorkflow({
      subjectId: "WF-LEGAL-001",
      subjectType: "workflow",
      fromStatus: "in-progress",
      toStatus: "blocked",
      actorRole: "legal-reviewer",
      reason: "missing evidence",
      evidenceIds: [],
      approvalIds: [],
    });

    expect(result.success).toBe(false);
    expect(result.blocker).toBe("required-evidence-missing");
  });

  it("9. Transition fails without required approval", () => {
    const result = transitionWorkflow({
      subjectId: "WF-ISSUE-001",
      subjectType: "workflow",
      fromStatus: "in-progress",
      toStatus: "ready",
      actorRole: "compliance-officer",
      reason: "missing approvals",
      evidenceIds: ["evidence-checklist"],
      approvalIds: [],
    });

    expect(result.success).toBe(false);
    expect(result.blocker).toBe("required-approvals-missing");
  });

  it("10. Audit log appends event on valid transition", () => {
    const before = AUDIT_LOG_REGISTRY.length;
    const result = transitionWorkflow({
      subjectId: "WF-SETTLE-001",
      subjectType: "workflow",
      fromStatus: "in-progress",
      toStatus: "blocked",
      actorRole: "compliance-officer",
      reason: "valid blocked transition",
      evidenceIds: ["blocker-report"],
      approvalIds: [],
    });

    expect(result.success).toBe(true);
    expect(AUDIT_LOG_REGISTRY.length).toBe(before + 1);
  });

  it("11. Audit hash chain verifies", () => {
    const verification = verifyAuditChain();
    expect(verification.valid).toBe(true);
  });

  it("12. Audit hash chain fails if event is tampered", () => {
    const target = AUDIT_LOG_REGISTRY[AUDIT_LOG_REGISTRY.length - 1];
    const original = target.reason;
    target.reason = "tampered-event";

    const verification = verifyAuditChain();
    expect(verification.valid).toBe(false);

    target.reason = original;
    expect(verifyAuditChain().valid).toBe(true);
  });

  it("13. Exception resolution requires correct role", () => {
    expect(() =>
      resolveException({
        exceptionId: "EXC-003",
        actorId: "viewer-1",
        actorRole: "viewer",
        resolutionNote: "viewer cannot resolve",
      }),
    ).toThrow();
  });

  it("14. Claim publication gate blocks unsupported claims", () => {
    const result = evaluateClaimPublicationGate("CLAIM-UNITY-001");
    expect(result.status).toBe("fail");
    expect(result.failingRules).toContain("claim-blocked");
  });

  it("15. Asset issuance gate blocks low readiness scores", () => {
    const result = evaluateAssetIssuanceGate("ASSET-TPAY-001");
    expect(result.status).toBe("fail");
  });

  it("16. Stable-unit launch gate blocks missing licensing approval", () => {
    const result = evaluateStableUnitLaunchGate("SU-TROP-USD-001");
    expect(result.status).toBe("fail");
    expect(result.failingRules).toContain("licensing-approval-missing");
  });

  it("17. Settlement release gate blocks missing custody/proof/legal approval", () => {
    const result = evaluateSettlementReleaseGate("ASSET-TPAY-001");
    expect(result.status).toBe("fail");
    expect(result.failingRules).toContain("legal-gate-fail");
    expect(result.failingRules).toContain("custody-gate-fail");
    expect(result.failingRules).toContain("proof-gate-fail");
  });

  it("18. Investor access gate blocks missing KYC/sanctions/accreditation/docs/wallet allowlist", () => {
    const result = evaluateInvestorAccessGate("INV-002");
    expect(result.status).toBe("fail");
    expect(result.failingRules).toContain("sanctions-missing");
    expect(result.failingRules).toContain("documents-missing");
    expect(result.failingRules).toContain("wallet-allowlist-missing");
  });

  it("19. Public content release gate blocks banned financial hype language", () => {
    const result = evaluatePublicContentReleaseGate("This product has guaranteed returns and is risk-free.");
    expect(result.status).toBe("fail");
    expect(result.failingRules.some((item) => item.includes("banned-term"))).toBe(true);
  });

  it("20. Emergency override cannot bypass hard legal/custody/sanctions gates", () => {
    const emergencyApproval = {
      approvalId: "APR-EMERGENCY-TEST",
      subjectId: "WF-SETTLE-001",
      subjectType: "workflow" as const,
      approvalType: "emergency-override-approval" as const,
      requestedBy: "super-admin-1",
      assignedTo: "super-admin-1",
      requiredRole: "super-admin" as const,
      status: "requested" as const,
      evidenceIds: ["incident-report"],
      notes: "Emergency override test",
      createdAt: new Date().toISOString(),
      decidedAt: null,
      decisionReason: null,
    };
    APPROVAL_REGISTRY.push(emergencyApproval);

    expect(() =>
      approveApproval({
        approvalId: emergencyApproval.approvalId,
        actorId: "super-admin-1",
        actorRole: "super-admin",
        decisionReason: "bypass attempt",
      }),
    ).toThrow();
  });
});
