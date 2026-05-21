import { validateTroptionsEnvironment } from "@/lib/troptions/envValidation";

describe("environment validation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("passes when required key-based configuration is present", () => {
    Object.assign(process.env, {
      NODE_ENV: "production",
      TROPTIONS_DEPLOYMENT_ID: "deploy-1",
      TROPTIONS_RELEASE_CHANNEL: "prod",
      TROPTIONS_CONTROL_PLANE_WRITES_ENABLED: "1",
      TROPTIONS_JWT_KEYS_JSON: JSON.stringify({
        activeKid: "jwt-k1",
        keys: [{ kid: "jwt-k1", secret: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", enabled: true }],
      }),
      TROPTIONS_AUDIT_EXPORT_KEYS_JSON: JSON.stringify({
        activeKid: "audit-k1",
        keys: [{ kid: "audit-k1", secret: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", enabled: true }],
      }),
    });

    const result = validateTroptionsEnvironment();
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("fails when production deployment fields are missing", () => {
    Object.assign(process.env, {
      NODE_ENV: "production",
      TROPTIONS_JWT_SECRET: "cccccccccccccccccccccccccccccccc",
      TROPTIONS_AUDIT_EXPORT_SECRET: "dddddddddddddddddddddddddddddddd",
      TROPTIONS_AUDIT_EXPORT_KEY_ID: "audit-k1",
    });
    delete process.env.TROPTIONS_DEPLOYMENT_ID;
    delete process.env.TROPTIONS_RELEASE_CHANNEL;
    delete process.env.TROPTIONS_CONTROL_PLANE_WRITES_ENABLED;

    const result = validateTroptionsEnvironment();
    expect(result.ok).toBe(false);
    expect(result.errors.some((item) => item.includes("TROPTIONS_DEPLOYMENT_ID"))).toBe(true);
    expect(result.errors.some((item) => item.includes("TROPTIONS_RELEASE_CHANNEL"))).toBe(true);
  });
});
