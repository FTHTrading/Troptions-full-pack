/**
 * Tests for xrplIouIssuanceEngine.ts
 *
 * Validates IOU blocking rules, readiness scoring, and simulation-only
 * safety properties.
 */

import {
  createXrplIouPacket,
  generateIouIssuanceChecklist,
  getIouAssetConfig,
  XRPL_ISSUER_ADDRESS,
  XRPL_DISTRIBUTOR_ADDRESS,
  type XrplIouAssetType,
} from "../../lib/troptions/xrplIouIssuanceEngine";

beforeAll(() => {
  process.env.TROPTIONS_CONTROL_PLANE_TOKEN = "test-token";
});

// ─── Helper ──────────────────────────────────────────────────────────────────

function buildEmptyChecklist(assetType: XrplIouAssetType) {
  const packet = createXrplIouPacket(assetType, {
    currencyCode: assetType,
    issuanceLimit: "0",
    proposedAmount: "0",
  });
  return { packet, checklist: generateIouIssuanceChecklist(packet) };
}

// ─── Asset config ────────────────────────────────────────────────────────────

describe("getIouAssetConfig", () => {
  it("returns config for every defined asset type", () => {
    const types: XrplIouAssetType[] = ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"];
    for (const t of types) {
      const cfg = getIouAssetConfig(t);
      expect(cfg).not.toBeNull();
      expect(cfg?.assetType).toBe(t);
    }
  });
});

// ─── XRPL addresses ──────────────────────────────────────────────────────────

describe("XRPL gateway addresses", () => {
  it("issuer address starts with r (XRPL classic address)", () => {
    expect(XRPL_ISSUER_ADDRESS.startsWith("r")).toBe(true);
  });

  it("distributor address starts with r (XRPL classic address)", () => {
    expect(XRPL_DISTRIBUTOR_ADDRESS.startsWith("r")).toBe(true);
  });
});

// ─── USD blocking rules ──────────────────────────────────────────────────────

describe("USD IOU blocking rules", () => {
  it("USD packet starts with BLOCKED status when reserve/legal/redemption are MISSING", () => {
    const { checklist } = buildEmptyChecklist("USD");
    expect(checklist.status).toBe("BLOCKED");
  });

  it("USD packet blocked reasons mention reserve requirement", () => {
    const { checklist } = buildEmptyChecklist("USD");
    const hasReserve = checklist.blockedReasons.some(
      (r) => r.toLowerCase().includes("reserve") || r.toLowerCase().includes("usd")
    );
    expect(hasReserve).toBe(true);
  });

  it("USD packet score is 0 for draft with no documents submitted", () => {
    const { checklist } = buildEmptyChecklist("USD");
    expect(checklist.score).toBe(0);
  });
});

// ─── AXL001 (Alexandrite) blocking rules ────────────────────────────────────

describe("AXL001 (Alexandrite) blocking rules", () => {
  it("AXL001 packet starts as BLOCKED without appraisal/custody/insurance/legal", () => {
    const { checklist } = buildEmptyChecklist("AXL001");
    expect(checklist.status).toBe("BLOCKED");
  });

  it("AXL001 blocked reasons mention appraisal", () => {
    const { checklist } = buildEmptyChecklist("AXL001");
    const hasAppraisal = checklist.blockedReasons.some(
      (r) => r.toLowerCase().includes("appraisal") || r.toLowerCase().includes("axl")
    );
    expect(hasAppraisal).toBe(true);
  });

  it("AXL001 score starts at 0 for draft packet", () => {
    const { checklist } = buildEmptyChecklist("AXL001");
    expect(checklist.score).toBe(0);
  });

  it("AXL001 nextSteps is non-empty (guidance provided)", () => {
    const { checklist } = buildEmptyChecklist("AXL001");
    expect(checklist.nextSteps.length).toBeGreaterThan(0);
  });
});

// ─── BTCREC blocking rules ───────────────────────────────────────────────────

describe("BTCREC blocking rules", () => {
  it("BTCREC packet is BLOCKED when no documents are submitted", () => {
    const { checklist } = buildEmptyChecklist("BTCREC");
    expect(checklist.status).toBe("BLOCKED");
  });

  it("BTCREC blocked reasons mention wallet or custody proof", () => {
    const { checklist } = buildEmptyChecklist("BTCREC");
    const hasCustody = checklist.blockedReasons.some(
      (r) => r.toLowerCase().includes("wallet") || r.toLowerCase().includes("custody") || r.toLowerCase().includes("btc")
    );
    expect(hasCustody).toBe(true);
  });
});

// ─── CARBON blocking rules ───────────────────────────────────────────────────

describe("CARBON blocking rules", () => {
  it("CARBON packet is BLOCKED when no documents are submitted", () => {
    const { checklist } = buildEmptyChecklist("CARBON");
    expect(checklist.status).toBe("BLOCKED");
  });

  it("CARBON blocked reasons mention serial numbers or registry", () => {
    const { checklist } = buildEmptyChecklist("CARBON");
    const hasSerialOrRegistry = checklist.blockedReasons.some(
      (r) =>
        r.toLowerCase().includes("serial") ||
        r.toLowerCase().includes("registry") ||
        r.toLowerCase().includes("carbon")
    );
    expect(hasSerialOrRegistry).toBe(true);
  });
});

// ─── simulationOnly safety ───────────────────────────────────────────────────

describe("simulationOnly safety property", () => {
  const types: XrplIouAssetType[] = ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"];

  it.each(types)("generateIouIssuanceChecklist returns simulationOnly:true for %s", (assetType) => {
    const { checklist } = buildEmptyChecklist(assetType);
    expect(checklist.simulationOnly).toBe(true);
  });
});

// ─── Document checklist structure ────────────────────────────────────────────

describe("document checklist structure", () => {
  it("returns at least 3 required documents for every asset type", () => {
    const types: XrplIouAssetType[] = ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"];
    for (const t of types) {
      const { checklist } = buildEmptyChecklist(t);
      const required = checklist.documents.filter((d) => d.required);
      expect(required.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("all documents have valid status values", () => {
    const { checklist } = buildEmptyChecklist("AXL001");
    const validStatuses = ["MISSING", "PENDING", "SUBMITTED", "VERIFIED"];
    for (const doc of checklist.documents) {
      expect(validStatuses).toContain(doc.status);
    }
  });
});
