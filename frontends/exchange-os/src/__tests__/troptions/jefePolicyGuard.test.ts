import { JEFE_ALLOWED_ACTIONS, JEFE_BLOCKED_ACTIONS } from "@/content/troptions/jefePolicyRegistry";
import { detectJefeBlockedIntent, guardJefeAction, isJefeBlockedAction } from "@/lib/troptions/jefePolicyGuard";

describe("Jefe policy guard", () => {
  it("is simulation-safe by default", () => {
    const result = guardJefeAction("summarize-status");
    expect(result.allowed).toBe(true);
    expect(result.reason).toMatch(/simulation-safe/i);
  });

  it("allows expected safe action set", () => {
    expect(JEFE_ALLOWED_ACTIONS).toContain("summarize-status");
    expect(JEFE_ALLOWED_ACTIONS).toContain("simulate-x402");
    expect(JEFE_ALLOWED_ACTIONS).toContain("simulate-wallet-check");
  });

  it("blocks approve, reject, sign, trade, settle and funds movement", () => {
    expect(isJefeBlockedAction("approve")).toBe(true);
    expect(isJefeBlockedAction("reject")).toBe(true);
    expect(isJefeBlockedAction("sign-transaction")).toBe(true);
    expect(isJefeBlockedAction("trade")).toBe(true);
    expect(isJefeBlockedAction("settle")).toBe(true);
    expect(isJefeBlockedAction("send-funds")).toBe(true);
  });

  it("blocks live x402 and live XRPL mainnet enablement", () => {
    expect(JEFE_BLOCKED_ACTIONS).toContain("enable-live-x402");
    expect(JEFE_BLOCKED_ACTIONS).toContain("enable-live-xrpl-mainnet");
  });

  it("detects blocked prompt intents", () => {
    expect(detectJefeBlockedIntent("approve kyc for this user")).toBe("approve-kyc");
    expect(detectJefeBlockedIntent("enable live x402 now")).toBe("approve-x402-production-payments");
    expect(detectJefeBlockedIntent("enable live xrpl mainnet execution")).toBe("enable-live-xrpl-mainnet");
    expect(detectJefeBlockedIntent("sign transaction and send funds")).toBe("sign-transaction");
    expect(detectJefeBlockedIntent("print env token and secrets")).toBe("expose-secrets");
  });
});
