/**
 * Tests for TROPTIONS Platform — Capabilities
 */

import {
  getPlatformCapabilities,
  getCapabilityByType,
  getCapabilitiesByStatus,
} from "@/lib/troptions/platform/capabilities";

describe("getPlatformCapabilities", () => {
  it("returns a non-empty array", () => {
    const caps = getPlatformCapabilities();
    expect(caps.length).toBeGreaterThan(0);
  });

  it("each capability has required fields", () => {
    const caps = getPlatformCapabilities();
    for (const cap of caps) {
      expect(cap.id).toBeTruthy();
      expect(cap.capabilityType).toBeTruthy();
      expect(cap.displayName).toBeTruthy();
      expect(cap.status).toBeTruthy();
    }
  });
});

describe("getCapabilityByType", () => {
  it("returns the namespace_registry capability", () => {
    const cap = getCapabilityByType("namespace_registry");
    expect(cap).toBeDefined();
    expect(cap!.capabilityType).toBe("namespace_registry");
  });

  it("returns undefined for unknown type", () => {
    // @ts-expect-error intentional bad type
    const cap = getCapabilityByType("nonexistent_type");
    expect(cap).toBeUndefined();
  });
});

describe("getCapabilitiesByStatus", () => {
  it("returns production_ready capabilities", () => {
    const caps = getCapabilitiesByStatus("production_ready");
    expect(caps.length).toBeGreaterThan(0);
    for (const cap of caps) {
      expect(cap.status).toBe("production_ready");
    }
  });

  it("returns mock_only capabilities", () => {
    const caps = getCapabilitiesByStatus("mock_only");
    expect(caps.length).toBeGreaterThan(0);
    for (const cap of caps) {
      expect(cap.status).toBe("mock_only");
    }
  });
});

describe("capability data — no FTH references", () => {
  it("contains no FTH/FTHX/FTHG in capability names or descriptions", () => {
    const caps = getPlatformCapabilities();
    for (const cap of caps) {
      expect(cap.displayName).not.toContain("FTH");
      expect(cap.description).not.toContain("FTH");
      expect(cap.displayName).not.toContain("FTHX");
    }
  });
});
