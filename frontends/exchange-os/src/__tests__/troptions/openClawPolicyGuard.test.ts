import { OPENCLAW_AGENT_REGISTRY } from "@/content/troptions/openClawAgentRegistry";
import { OPENCLAW_REGISTRY } from "@/content/troptions/openClawRegistry";
import { guardOpenClawAction } from "@/lib/troptions/openClawPolicyGuard";

describe("OpenClaw policy guard", () => {
  it("has core specialist agents", () => {
    const ids = OPENCLAW_AGENT_REGISTRY.map((agent) => agent.id);
    expect(ids).toEqual(expect.arrayContaining([
      "site-ops-agent",
      "x402-agent",
      "rag-agent",
      "wallet-agent",
      "compliance-agent",
      "trading-sim-agent",
    ]));
  });

  it("blocks prohibited execution actions", () => {
    expect(guardOpenClawAction("approve").allowed).toBe(false);
    expect(guardOpenClawAction("sign").allowed).toBe(false);
    expect(guardOpenClawAction("trade").allowed).toBe(false);
    expect(guardOpenClawAction("settle").allowed).toBe(false);
    expect(guardOpenClawAction("transfer-funds").allowed).toBe(false);
  });

  it("keeps registry in simulation-first mode", () => {
    expect(OPENCLAW_REGISTRY.mode).toBe("simulation-first");
    expect(OPENCLAW_REGISTRY.humanReviewRequired).toBe(true);
  });
});
