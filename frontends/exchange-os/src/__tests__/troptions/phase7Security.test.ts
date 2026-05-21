import { getActiveAuditSigningKey, getJwtVerificationKeys } from "@/lib/troptions/keyManagement";
import { enforceDeploymentGate, DeploymentGateError } from "@/lib/troptions/deploymentGates";
import { enforceOperatorSecurity, OperatorSecurityError } from "@/lib/troptions/operatorSecurity";

describe("Phase 7 security hardening", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("selects active audit signing key from keyset config", () => {
    process.env.TROPTIONS_AUDIT_EXPORT_KEYS_JSON = JSON.stringify({
      activeKid: "k2",
      keys: [
        { kid: "k1", secret: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", enabled: true },
        { kid: "k2", secret: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", enabled: true },
      ],
    });

    const key = getActiveAuditSigningKey();
    expect(key).not.toBeNull();
    expect(key?.kid).toBe("k2");
  });

  it("returns jwt key candidates with active key first", () => {
    process.env.TROPTIONS_JWT_KEYS_JSON = JSON.stringify({
      activeKid: "kid-active",
      keys: [
        { kid: "kid-old", secret: "cccccccccccccccccccccccccccccccc", enabled: true },
        { kid: "kid-active", secret: "dddddddddddddddddddddddddddddddd", enabled: true },
      ],
    });

    const keys = getJwtVerificationKeys();
    expect(keys[0].kid).toBe("kid-active");
    expect(keys.length).toBe(2);
  });

  it("blocks prod writes when release channel policy is not met", () => {
    Object.assign(process.env, {
      NODE_ENV: "production",
      TROPTIONS_DEPLOYMENT_ID: "deploy-123",
      TROPTIONS_RELEASE_CHANNEL: "staging",
      TROPTIONS_CONTROL_PLANE_WRITES_ENABLED: "1",
      TROPTIONS_ALLOW_NON_PROD_CHANNEL_WRITES: "0",
    });

    expect(() => enforceDeploymentGate(true)).toThrow(DeploymentGateError);
  });

  it("requires MFA for sensitive operator action when enforcement is enabled", () => {
    process.env.TROPTIONS_ENFORCE_OPERATOR_SECURITY = "1";

    const request = new Request("http://localhost/api/troptions/approvals/request", {
      method: "POST",
      headers: {
        authorization: "Bearer token",
      },
    });

    expect(() =>
      enforceOperatorSecurity(
        request,
        {
          actorId: "op-1",
          actorRole: "issuer-admin",
          authProvider: "token",
          mfaVerified: false,
        },
        "request-approval",
      ),
    ).toThrow(OperatorSecurityError);
  });
});
