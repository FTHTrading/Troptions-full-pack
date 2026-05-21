/**
 * Tests for fundingRouteEngine.ts
 *
 * Validates funding route eligibility rules, Aave hard-blocks,
 * AMM hard-blocks, and simulation-only safety properties.
 */

import {
  recommendFundingRoutes,
  calculateFundingReadiness,
  generateLenderPacketSummary,
  generateUseOfProceedsPlan,
  type FundingRoute,
} from "../../lib/troptions/fundingRouteEngine";
import {
  createXrplIouPacket,
  generateIouIssuanceChecklist,
  type XrplIouAssetType,
} from "../../lib/troptions/xrplIouIssuanceEngine";

beforeAll(() => {
  process.env.TROPTIONS_CONTROL_PLANE_TOKEN = "test-token";
});

// ─── Helper ──────────────────────────────────────────────────────────────────

function getReadiness(assetType: XrplIouAssetType) {
  const packet = createXrplIouPacket(assetType, {
    currencyCode: assetType,
    issuanceLimit: "0",
    proposedAmount: "0",
  });
  return generateIouIssuanceChecklist(packet);
}

function getRoute(assetType: XrplIouAssetType, route: FundingRoute) {
  const readiness = getReadiness(assetType);
  const routes = recommendFundingRoutes(assetType, readiness);
  return routes.find((r) => r.route === route)!;
}

// ─── Aave hard-block rules ────────────────────────────────────────────────────

describe("Aave v3 collateral hard-block rules", () => {
  const nonAaveTypes: XrplIouAssetType[] = ["AXL001", "GOLD", "CARBON", "RWA", "TROPTIONS"];

  it.each(nonAaveTypes)(
    "Aave route is BLOCKED for %s (not in Aave collateral registry)",
    (assetType) => {
      const result = getRoute(assetType, "AAVE_ACCEPTED_COLLATERAL");
      expect(result.eligibility).toBe("BLOCKED");
    }
  );

  it("Aave route is BLOCKED for AXL001 (alexandrite) specifically", () => {
    const result = getRoute("AXL001", "AAVE_ACCEPTED_COLLATERAL");
    expect(result.eligibility).toBe("BLOCKED");
    const reason = result.blockedReasons.some(
      (r) => r.toLowerCase().includes("aave") || r.toLowerCase().includes("axl001")
    );
    expect(reason).toBe(true);
  });

  it("Aave route is BLOCKED for CARBON specifically", () => {
    const result = getRoute("CARBON", "AAVE_ACCEPTED_COLLATERAL");
    expect(result.eligibility).toBe("BLOCKED");
    const reason = result.blockedReasons.some(
      (r) => r.toLowerCase().includes("aave") || r.toLowerCase().includes("carbon")
    );
    expect(reason).toBe(true);
  });

  it("Aave route is BLOCKED for BTCREC (receipt, not native WBTC)", () => {
    const result = getRoute("BTCREC", "AAVE_ACCEPTED_COLLATERAL");
    // BTCREC is blocked because it's an XRPL receipt, not native Ethereum WBTC
    expect(result.eligibility).toBe("BLOCKED");
  });
});

// ─── AMM hard-block rules ─────────────────────────────────────────────────────

describe("AMM hard-block rules", () => {
  const allTypes: XrplIouAssetType[] = ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"];

  it.each(allTypes)(
    "AMM_AFTER_CLEARANCE is BLOCKED for all asset types (%s)",
    (assetType) => {
      const result = getRoute(assetType, "AMM_AFTER_CLEARANCE");
      expect(result.eligibility).toBe("BLOCKED");
    }
  );

  it("AMM blocked reason mentions legal clearance requirement", () => {
    const result = getRoute("USD", "AMM_AFTER_CLEARANCE");
    const hasLegal = result.blockedReasons.some(
      (r) => r.toLowerCase().includes("legal") || r.toLowerCase().includes("clearance")
    );
    expect(hasLegal).toBe(true);
  });
});

// ─── SERVICE_FEE always eligible ─────────────────────────────────────────────

describe("SERVICE_FEE_REVENUE always eligible", () => {
  const allTypes: XrplIouAssetType[] = ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"];

  it.each(allTypes)(
    "SERVICE_FEE_REVENUE is ELIGIBLE for all asset types (%s)",
    (assetType) => {
      const result = getRoute(assetType, "SERVICE_FEE_REVENUE");
      expect(result.eligibility).toBe("ELIGIBLE");
    }
  );
});

// ─── simulationOnly safety ────────────────────────────────────────────────────

describe("simulationOnly safety property", () => {
  const allTypes: XrplIouAssetType[] = ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"];

  it.each(allTypes)("all routes return simulationOnly:true for %s", (assetType) => {
    const readiness = getReadiness(assetType);
    const routes = recommendFundingRoutes(assetType, readiness);
    for (const r of routes) {
      expect(r.simulationOnly).toBe(true);
    }
  });

  it("calculateFundingReadiness returns simulationOnly:true", () => {
    const readiness = getReadiness("AXL001");
    const result = calculateFundingReadiness("AXL001", readiness);
    expect(result.simulationOnly).toBe(true);
  });

  it("generateLenderPacketSummary returns simulationOnly:true", () => {
    const readiness = getReadiness("AXL001");
    const result = generateLenderPacketSummary("AXL001", readiness);
    expect(result.simulationOnly).toBe(true);
  });

  it("generateUseOfProceedsPlan returns simulationOnly:true", () => {
    const result = generateUseOfProceedsPlan("AXL001", "TBD");
    expect(result.simulationOnly).toBe(true);
  });
});

// ─── calculateFundingReadiness structure ─────────────────────────────────────

describe("calculateFundingReadiness", () => {
  it("returns all 3 buckets: recommended, conditional, blocked", () => {
    const readiness = getReadiness("AXL001");
    const result = calculateFundingReadiness("AXL001", readiness);
    expect(Array.isArray(result.recommendedRoutes)).toBe(true);
    expect(Array.isArray(result.conditionalRoutes)).toBe(true);
    expect(Array.isArray(result.blockedRoutes)).toBe(true);
  });

  it("blocked routes include at least AMM and Aave for AXL001", () => {
    const readiness = getReadiness("AXL001");
    const result = calculateFundingReadiness("AXL001", readiness);
    const blockedIds = result.blockedRoutes.map((r) => r.route);
    expect(blockedIds).toContain("AMM_AFTER_CLEARANCE");
    expect(blockedIds).toContain("AAVE_ACCEPTED_COLLATERAL");
  });

  it("recommended routes always include SERVICE_FEE_REVENUE", () => {
    const readiness = getReadiness("TROPTIONS");
    const result = calculateFundingReadiness("TROPTIONS", readiness);
    const recommendedIds = result.recommendedRoutes.map((r) => r.route);
    expect(recommendedIds).toContain("SERVICE_FEE_REVENUE");
  });

  it("overallScore is a number between 0 and 100", () => {
    const readiness = getReadiness("CARBON");
    const result = calculateFundingReadiness("CARBON", readiness);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });
});

// ─── generateLenderPacketSummary structure ────────────────────────────────────

describe("generateLenderPacketSummary", () => {
  it("returns headline, keyStrengths, keyRisks, and missingItems", () => {
    const readiness = getReadiness("AXL001");
    const result = generateLenderPacketSummary("AXL001", readiness);
    expect(result.headline).toBeTruthy();
    expect(Array.isArray(result.keyStrengths)).toBe(true);
    expect(Array.isArray(result.keyRisks)).toBe(true);
    expect(Array.isArray(result.missingItems)).toBe(true);
  });
});

// ─── generateUseOfProceedsPlan structure ─────────────────────────────────────

describe("generateUseOfProceedsPlan", () => {
  it("returns a waterfall with at least 5 ranked entries", () => {
    const result = generateUseOfProceedsPlan("AXL001", "$500,000");
    expect(result.waterfall.length).toBeGreaterThanOrEqual(5);
    expect(result.waterfall[0].rank).toBe(1);
  });

  it("includes restrictions array", () => {
    const result = generateUseOfProceedsPlan("USD", "TBD");
    expect(Array.isArray(result.restrictions)).toBe(true);
    expect(result.restrictions.length).toBeGreaterThan(0);
  });
});
