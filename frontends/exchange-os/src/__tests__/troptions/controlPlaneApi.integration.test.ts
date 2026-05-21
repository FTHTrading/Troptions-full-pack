import { POST as requestApprovalPost } from "@/app/api/troptions/approvals/request/route";
import { POST as approveApprovalPost } from "@/app/api/troptions/approvals/approve/route";
import { POST as transitionWorkflowPost } from "@/app/api/troptions/workflows/transition/route";
import { GET as readinessSummaryGet } from "@/app/api/troptions/readiness/summary/route";
import { GET as releaseGateStatusGet } from "@/app/api/troptions/release-gates/status/route";
import { GET as auditExportGet } from "@/app/api/troptions/audit-log/export/route";

type HeaderMap = Record<string, string>;

function buildHeaders(role: string, token = "test-control-plane-token", actorId = "test-actor"): HeaderMap {
  return {
    authorization: `Bearer ${token}`,
    "x-troptions-actor-role": role,
    "x-troptions-actor-id": actorId,
    "idempotency-key": `test-${role}-${actorId}-idempotency`,
    "content-type": "application/json",
  };
}

function buildRequest(url: string, method: string, headers: HeaderMap, body?: unknown): Request {
  return new Request(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("Control plane API integration", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalAllowStatic = process.env.TROPTIONS_ALLOW_STATIC_TOKEN_AUTH;
  const originalToken = process.env.TROPTIONS_CONTROL_PLANE_TOKEN;
  const originalSecret = process.env.TROPTIONS_AUDIT_EXPORT_SECRET;
  const originalKeyId = process.env.TROPTIONS_AUDIT_EXPORT_KEY_ID;
  const originalJwtSecret = process.env.TROPTIONS_JWT_SECRET;
  const originalJwtKeys = process.env.TROPTIONS_JWT_KEYS_JSON;

  beforeAll(() => {
    Object.assign(process.env, {
      NODE_ENV: "test",
      TROPTIONS_ALLOW_STATIC_TOKEN_AUTH: "1",
      TROPTIONS_CONTROL_PLANE_TOKEN: "test-control-plane-token",
      TROPTIONS_AUDIT_EXPORT_SECRET: "test-audit-export-secret-0123456789",
      TROPTIONS_AUDIT_EXPORT_KEY_ID: "test-audit-key-id",
    });
    delete process.env.TROPTIONS_JWT_SECRET;
    delete process.env.TROPTIONS_JWT_KEYS_JSON;
  });

  afterAll(() => {
    Object.assign(process.env, {
      NODE_ENV: originalNodeEnv,
      TROPTIONS_ALLOW_STATIC_TOKEN_AUTH: originalAllowStatic,
      TROPTIONS_CONTROL_PLANE_TOKEN: originalToken,
      TROPTIONS_AUDIT_EXPORT_SECRET: originalSecret,
      TROPTIONS_AUDIT_EXPORT_KEY_ID: originalKeyId,
      TROPTIONS_JWT_SECRET: originalJwtSecret,
      TROPTIONS_JWT_KEYS_JSON: originalJwtKeys,
    });
  });

  it("rejects missing token on mutating route", async () => {
    const request = buildRequest(
      "http://localhost/api/troptions/approvals/request",
      "POST",
      {
        "x-troptions-actor-role": "issuer-admin",
        "x-troptions-actor-id": "issuer-admin-1",
        "idempotency-key": "missing-token-test-key",
        "content-type": "application/json",
      },
      {
        subjectId: "ASSET-TPAY-001",
        subjectType: "asset",
        approvalType: "legal-approval",
        assignedTo: "legal-reviewer-1",
        evidenceIds: ["claim-legal-memo"],
      },
    );

    const response = await requestApprovalPost(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.ok).toBe(false);
  });

  it("creates approval with authenticated issuer-admin context", async () => {
    const request = buildRequest(
      "http://localhost/api/troptions/approvals/request",
      "POST",
      buildHeaders("issuer-admin", "test-control-plane-token", "issuer-admin-integration"),
      {
        subjectId: "ASSET-TPAY-001",
        subjectType: "asset",
        approvalType: "legal-approval",
        assignedTo: "legal-reviewer-1",
        evidenceIds: ["claim-legal-memo"],
      },
    );

    const response = await requestApprovalPost(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.approval.requestedBy).toBe("issuer-admin-integration");
    expect(data.approval.requiredRole).toBe("legal-reviewer");
  });

  it("approves approval with authenticated legal-reviewer context", async () => {
    const createRequest = buildRequest(
      "http://localhost/api/troptions/approvals/request",
      "POST",
      buildHeaders("issuer-admin", "test-control-plane-token", "issuer-admin-approve-flow"),
      {
        subjectId: "ASSET-TPAY-001",
        subjectType: "asset",
        approvalType: "legal-approval",
        assignedTo: "legal-reviewer-1",
        evidenceIds: ["claim-legal-memo"],
      },
    );

    const createResponse = await requestApprovalPost(createRequest);
    const created = await createResponse.json();

    const approveRequest = buildRequest(
      "http://localhost/api/troptions/approvals/approve",
      "POST",
      buildHeaders("legal-reviewer", "test-control-plane-token", "legal-reviewer-1"),
      {
        approvalId: created.approval.approvalId,
        decisionReason: "approved by integration test",
      },
    );

    const approveResponse = await approveApprovalPost(approveRequest);
    const approved = await approveResponse.json();

    expect(approveResponse.status).toBe(200);
    expect(approved.ok).toBe(true);
    expect(approved.approval.status).toBe("approved");
    expect(approved.approval.decisionReason).toContain("integration test");
  });

  it("blocks workflow transition for role without transition permission", async () => {
    const request = buildRequest(
      "http://localhost/api/troptions/workflows/transition",
      "POST",
      buildHeaders("viewer", "test-control-plane-token", "viewer-1"),
      {
        subjectId: "WF-INTAKE-001",
        subjectType: "workflow",
        fromStatus: "not-started",
        toStatus: "in-progress",
        reason: "viewer should fail",
        evidenceIds: ["intake-record"],
        approvalIds: [],
      },
    );

    const response = await transitionWorkflowPost(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.ok).toBe(false);
  });

  it("returns readiness summary for authenticated read-status role", async () => {
    const request = buildRequest(
      "http://localhost/api/troptions/readiness/summary",
      "GET",
      buildHeaders("auditor"),
    );

    const response = await readinessSummaryGet(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(typeof data.summary).toBe("object");
  });

  it("returns release gate status for authenticated read-status role", async () => {
    const request = buildRequest(
      "http://localhost/api/troptions/release-gates/status",
      "GET",
      buildHeaders("auditor"),
    );

    const response = await releaseGateStatusGet(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(typeof data.status.failing).toBe("number");
  });

  it("returns signed audit export with payload and HMAC signature", async () => {
    const request = buildRequest(
      "http://localhost/api/troptions/audit-log/export",
      "GET",
      buildHeaders("auditor"),
    );

    const response = await auditExportGet(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.algorithm).toBe("HMAC-SHA256");
    expect(typeof data.signature).toBe("string");
    expect(data.signature.length).toBeGreaterThan(10);
    expect(data.payload.chainVerification).toBeDefined();
    expect(Array.isArray(data.payload.events)).toBe(true);
  });
});
