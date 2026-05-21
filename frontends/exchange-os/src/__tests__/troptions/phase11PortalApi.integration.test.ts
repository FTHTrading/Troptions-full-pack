import { GET as clientSummaryGet } from "@/app/api/troptions/client-portal/summary/route";
import { POST as accessRequestPost } from "@/app/api/troptions/client-portal/access-request/route";
import { POST as pofSubmitPost } from "@/app/api/troptions/pof/submit-evidence/route";
import { POST as sblcSubmitPost } from "@/app/api/troptions/sblc/submit-package/route";
import { POST as rwaIntakePost } from "@/app/api/troptions/rwa/intake/route";
import { POST as xrplQuotePost } from "@/app/api/troptions/xrpl/quote/route";
import { POST as conversionSimPost } from "@/app/api/troptions/conversions/simulate/route";
import { POST as tradingSimPost } from "@/app/api/troptions/trading/simulate/route";
import { POST as settlementSimPost } from "@/app/api/troptions/settlement/simulate/route";

type HeaderMap = Record<string, string>;

function buildHeaders(role: string, includeIdempotency = true): HeaderMap {
  const headers: HeaderMap = {
    authorization: "Bearer test-control-plane-token",
    "x-troptions-actor-role": role,
    "x-troptions-actor-id": `phase11-${role}`,
    "content-type": "application/json",
  };

  if (includeIdempotency) {
    headers["idempotency-key"] = `phase11-${role}-${Math.random().toString(36).slice(2)}`;
  }

  return headers;
}

function buildRequest(url: string, method: string, headers: HeaderMap, body?: unknown) {
  return new Request(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("Phase 11 portal API guardrails", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalAllowStatic = process.env.TROPTIONS_ALLOW_STATIC_TOKEN_AUTH;
  const originalToken = process.env.TROPTIONS_CONTROL_PLANE_TOKEN;
  const originalJwtSecret = process.env.TROPTIONS_JWT_SECRET;
  const originalJwtKeys = process.env.TROPTIONS_JWT_KEYS_JSON;

  beforeAll(() => {
    Object.assign(process.env, {
      NODE_ENV: "test",
      TROPTIONS_ALLOW_STATIC_TOKEN_AUTH: "1",
      TROPTIONS_CONTROL_PLANE_TOKEN: "test-control-plane-token",
    });
    delete process.env.TROPTIONS_JWT_SECRET;
    delete process.env.TROPTIONS_JWT_KEYS_JSON;
  });

  afterAll(() => {
    Object.assign(process.env, {
      NODE_ENV: originalNodeEnv,
      TROPTIONS_ALLOW_STATIC_TOKEN_AUTH: originalAllowStatic,
      TROPTIONS_CONTROL_PLANE_TOKEN: originalToken,
      TROPTIONS_JWT_SECRET: originalJwtSecret,
      TROPTIONS_JWT_KEYS_JSON: originalJwtKeys,
    });
  });

  it("routes require auth", async () => {
    const request = new Request("http://localhost/api/troptions/client-portal/summary", { method: "GET" });
    const response = await clientSummaryGet(request);
    expect(response.status).toBe(401);
  });

  it("API POST routes require idempotency keys", async () => {
    const posts = [
      () => accessRequestPost(buildRequest("http://localhost/api/troptions/client-portal/access-request", "POST", buildHeaders("issuer-admin", false), { entityId: "ENT-100" })),
      () => pofSubmitPost(buildRequest("http://localhost/api/troptions/pof/submit-evidence", "POST", buildHeaders("issuer-admin", false), { pofId: "POF-001" })),
      () => sblcSubmitPost(buildRequest("http://localhost/api/troptions/sblc/submit-package", "POST", buildHeaders("issuer-admin", false), { sblcId: "SBLC-001" })),
      () => rwaIntakePost(buildRequest("http://localhost/api/troptions/rwa/intake", "POST", buildHeaders("issuer-admin", false), { assetId: "RWA-NEW" })),
      () => xrplQuotePost(buildRequest("http://localhost/api/troptions/xrpl/quote", "POST", buildHeaders("issuer-admin", false), { sourceAsset: "USD.rIssuer", targetAsset: "USDC", amount: 1000 })),
      () => conversionSimPost(buildRequest("http://localhost/api/troptions/conversions/simulate", "POST", buildHeaders("issuer-admin", false), { sourceAsset: "USDC", targetAsset: "USD.rIssuer", amount: 1000 })),
      () => tradingSimPost(buildRequest("http://localhost/api/troptions/trading/simulate", "POST", buildHeaders("issuer-admin", false), { strategyId: "ALG-001" })),
      () => settlementSimPost(buildRequest("http://localhost/api/troptions/settlement/simulate", "POST", buildHeaders("issuer-admin", false), { intentId: "SETTLE-001" })),
    ];

    for (const run of posts) {
      const response = await run();
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(String(body.error).toLowerCase()).toContain("idempotency");
    }
  });
});
