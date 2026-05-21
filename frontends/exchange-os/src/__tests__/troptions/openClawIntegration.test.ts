import { getOpenClawBridgeStatus } from "@/lib/troptions/openClawBridge";
import { getOpenClawX402Readiness } from "@/lib/troptions/openClawX402Engine";
import { runOpenClawSiteCheck } from "@/lib/troptions/openClawSiteManager";

describe("OpenClaw integration", () => {
  it("returns not-connected or local simulation when runtime is missing", () => {
    const status = getOpenClawBridgeStatus();
    expect(["connected", "local-simulation", "not-connected"]).toContain(status.integrationStatus);
    if (status.integrationStatus !== "connected") {
      expect(status.supportedTools.length).toBeGreaterThan(0);
    }
  });

  it("keeps x402 simulation mode defaults", () => {
    const readiness = getOpenClawX402Readiness();
    expect(readiness.mode).toBe("simulation");
    expect(readiness.controls.defaultMode).toBe("dry-run");
    expect(readiness.controls.livePaymentCollectionEnabled).toBe(false);
  });

  it("site check does not deploy", () => {
    const check = runOpenClawSiteCheck();
    expect(check.mode).toBe("simulation");
    expect(check.didDeploy).toBe(false);
  });
});
