import { GET as getSecurityDependencies } from "@/app/api/troptions/xrpl-platform/security/dependencies/route";
import { POST as postReadinessCheck } from "@/app/api/troptions/xrpl-platform/mainnet/readiness-check/route";
import { POST as postQuoteSimulation } from "@/app/api/troptions/xrpl-platform/quote/simulate/route";
import { POST as postUnsignedOffer } from "@/app/api/troptions/xrpl-platform/testnet/unsigned-offer/route";

const originalEnv = { ...process.env };

describe("XRPL platform API", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.TROPTIONS_CONTROL_PLANE_TOKEN = "test-token";
    delete process.env.TROPTIONS_JWT_KEYS_JSON;
    delete process.env.TROPTIONS_JWT_SECRET;
    delete process.env.TROPTIONS_ENFORCE_OPERATOR_SECURITY;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("requires auth for POST routes", async () => {
    const response = await postQuoteSimulation(new Request("http://localhost/api/troptions/xrpl-platform/quote/simulate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fromAsset: "XRP", toAsset: "TROPTIONS", amount: 1000 }),
    }));

    expect(response.status).toBe(401);
  });

  it("requires idempotency for authenticated POST routes", async () => {
    const response = await postUnsignedOffer(new Request("http://localhost/api/troptions/xrpl-platform/testnet/unsigned-offer", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "super-admin",
        "x-troptions-actor-id": "spec-user",
        "content-type": "application/json",
      },
      body: JSON.stringify({ account: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" }),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: expect.stringContaining("idempotency-key") });
  });

  it("blocks sensitive signing fields before mainnet readiness logic is used", async () => {
    await expect(postReadinessCheck(new Request("http://localhost/api/troptions/xrpl-platform/mainnet/readiness-check", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "super-admin",
        "x-troptions-actor-id": "spec-user",
        "idempotency-key": "idem-1",
        "content-type": "application/json",
      },
      body: JSON.stringify({ privateKey: "forbidden" }),
    }))).rejects.toThrow("Sensitive XRPL signing input");
  });

  it("returns read-only dependency security data on GET", async () => {
    const response = await getSecurityDependencies(new Request("http://localhost/api/troptions/xrpl-platform/security/dependencies", {
      method: "GET",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "viewer",
        "x-troptions-actor-id": "viewer-user",
      },
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true, mode: "dependency-security", isLiveMainnetExecutionEnabled: false });
  });
});