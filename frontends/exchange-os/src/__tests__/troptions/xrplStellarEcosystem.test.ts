/**
 * XRPL & Stellar Ecosystem Tests
 *
 * Tests cover:
 * - Asset registry invariants (simulation-only flags)
 * - XRPL and Stellar policy engine evaluations
 * - Bridge simulation functions (always blocked, always persisted)
 * - Persistence record creation
 * - Safety guarantees (no guaranteed yield/profit language, no live execution)
 */

import { XRPL_ECOSYSTEM_REGISTRY } from "@/content/troptions/xrplEcosystemRegistry";
import { STELLAR_ECOSYSTEM_REGISTRY } from "@/content/troptions/stellarEcosystemRegistry";
import {
  evaluateXrplTrustlineRequest,
  evaluateXrplNftMintRequest,
  evaluateXrplAmmPoolRequest,
  createXrplReadinessReport,
  getXrplPolicyBlockedReason,
} from "@/lib/troptions/xrpl-stellar/xrplPolicyEngine";
import {
  evaluateStellarTrustlineRequest,
  evaluateStellarLiquidityPoolRequest,
  evaluateStellarPathPaymentRequest,
  createStellarReadinessReport,
  getStellarPolicyBlockedReason,
} from "@/lib/troptions/xrpl-stellar/stellarPolicyEngine";
import {
  getXrplStellarControlHubStatus,
  listXrplEcosystemAssets,
  listStellarEcosystemAssets,
  simulateXrplTrustline,
  simulateXrplNftMint,
  simulateXrplAmmPool,
  simulateStellarTrustline,
  simulateStellarLiquidityPool,
  simulateStellarPathPayment,
  generateCrossRailReadinessReport,
  persistCrossRailSimulation,
  createCrossRailGovernanceAuditEntry,
} from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

// ─── env setup ────────────────────────────────────────────────────────────────

beforeAll(() => {
  process.env.TROPTIONS_CONTROL_PLANE_TOKEN = "test-token-xrpl-stellar";
});

// ─── XRPL Registry Invariants ────────────────────────────────────────────────

describe("XRPL_ECOSYSTEM_REGISTRY", () => {
  it("has exactly 11 entries", () => {
    expect(XRPL_ECOSYSTEM_REGISTRY).toHaveLength(11);
  });

  it("all entries have liveMainnetAllowedNow: false", () => {
    for (const entry of XRPL_ECOSYSTEM_REGISTRY) {
      expect(entry.liveMainnetAllowedNow).toBe(false);
    }
  });

  it("all entries have nftMintingAllowedNow: false", () => {
    for (const entry of XRPL_ECOSYSTEM_REGISTRY) {
      expect(entry.nftMintingAllowedNow).toBe(false);
    }
  });

  it("all entries have executionMode of simulation_only or disabled", () => {
    const validModes = ["simulation_only", "disabled", "testnet_only"];
    for (const entry of XRPL_ECOSYSTEM_REGISTRY) {
      expect(validModes).toContain(entry.executionMode);
    }
  });

  it("all entries have required fields", () => {
    for (const entry of XRPL_ECOSYSTEM_REGISTRY) {
      expect(entry.id).toBeTruthy();
      expect(entry.displayName).toBeTruthy();
      expect(entry.category).toBeTruthy();
      expect(entry.xrplPrimitive).toBeTruthy();
      expect(entry.executionMode).toBeTruthy();
      expect(entry.recommendedNextAction).toBeTruthy();
    }
  });

  it("no entry claims live mainnet is allowed", () => {
    for (const entry of XRPL_ECOSYSTEM_REGISTRY) {
      expect(entry.liveMainnetAllowedNow).not.toBe(true);
    }
  });
});

// ─── Stellar Registry Invariants ─────────────────────────────────────────────

describe("STELLAR_ECOSYSTEM_REGISTRY", () => {
  it("has exactly 12 entries", () => {
    expect(STELLAR_ECOSYSTEM_REGISTRY).toHaveLength(12);
  });

  it("all entries have publicNetworkAllowedNow: false", () => {
    for (const entry of STELLAR_ECOSYSTEM_REGISTRY) {
      expect(entry.publicNetworkAllowedNow).toBe(false);
    }
  });

  it("all entries have executionMode of simulation_only or disabled", () => {
    const validModes = ["simulation_only", "disabled", "testnet_only"];
    for (const entry of STELLAR_ECOSYSTEM_REGISTRY) {
      expect(validModes).toContain(entry.executionMode);
    }
  });

  it("all entries have required fields", () => {
    for (const entry of STELLAR_ECOSYSTEM_REGISTRY) {
      expect(entry.id).toBeTruthy();
      expect(entry.displayName).toBeTruthy();
      expect(entry.stellarPrimitive).toBeTruthy();
      expect(entry.executionMode).toBeTruthy();
    }
  });

  it("no entry claims public network is allowed", () => {
    for (const entry of STELLAR_ECOSYSTEM_REGISTRY) {
      expect(entry.publicNetworkAllowedNow).not.toBe(true);
    }
  });
});

// ─── XRPL Policy Engine ───────────────────────────────────────────────────────

describe("XRPL Policy Engine — blocked by default", () => {
  it("trustline evaluation returns simulationOnly: true", () => {
    const result = evaluateXrplTrustlineRequest({
      assetId: "TSU",
      holderKycStatus: "verified",
      issuerStatus: "live",
    });
    expect(result.simulationOnly).toBe(true);
    expect(result.liveMainnetAllowedNow).toBe(false);
    expect(result.allowed).toBe(false);
  });

  it("trustline blocks when KYC not verified", () => {
    const result = evaluateXrplTrustlineRequest({
      assetId: "TSU",
      holderKycStatus: "pending",
    });
    expect(result.allowed).toBe(false);
    expect(result.blockedReasons.length).toBeGreaterThan(0);
  });

  it("NFT mint evaluation is always blocked", () => {
    const result = evaluateXrplNftMintRequest({
      assetId: "TUNI",
      kybStatus: "verified",
      metadataDefined: true,
      legalReviewComplete: true,
    });
    expect(result.simulationOnly).toBe(true);
    expect(result.nftMintingAllowedNow).toBe(false);
    expect(result.allowed).toBe(false);
  });

  it("AMM pool evaluation is always blocked", () => {
    const result = evaluateXrplAmmPoolRequest({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: true,
    });
    expect(result.simulationOnly).toBe(true);
    expect(result.allowed).toBe(false);
  });

  it("AMM blocks with no guaranteed yield message when risk disclosure missing", () => {
    const result = evaluateXrplAmmPoolRequest({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: false,
    });
    const hasYieldBlock = result.blockedReasons.some(
      (r) => r.toLowerCase().includes("yield") || r.toLowerCase().includes("return"),
    );
    expect(hasYieldBlock).toBe(true);
  });

  it("getXrplPolicyBlockedReason returns a non-empty string", () => {
    expect(getXrplPolicyBlockedReason()).toBeTruthy();
  });

  it("createXrplReadinessReport has correct field shape", () => {
    const report = createXrplReadinessReport();
    expect(typeof report.xrplAssetsTotal).toBe("number");
    expect(typeof report.xrplAssetsBlocked).toBe("number");
    expect(typeof report.xrplAssetsSimulationOnly).toBe("number");
    expect(typeof report.xrplAssetsTestnetReady).toBe("number");
    expect(report.isLiveMainnetExecutionEnabled).toBe(false);
  });
});

// ─── Stellar Policy Engine ────────────────────────────────────────────────────

describe("Stellar Policy Engine — blocked by default", () => {
  it("trustline evaluation returns simulationOnly: true", () => {
    const result = evaluateStellarTrustlineRequest({
      assetId: "TSU",
      holderKycStatus: "verified",
      issuerStatus: "live",
    });
    expect(result.simulationOnly).toBe(true);
    expect(result.publicNetworkAllowedNow).toBe(false);
    expect(result.allowed).toBe(false);
  });

  it("trustline blocks when KYC not verified", () => {
    const result = evaluateStellarTrustlineRequest({
      assetId: "TSU",
      holderKycStatus: "pending",
    });
    expect(result.allowed).toBe(false);
    expect(result.blockedReasons.length).toBeGreaterThan(0);
  });

  it("LP evaluation is always blocked (public network gate)", () => {
    const result = evaluateStellarLiquidityPoolRequest({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: true,
    });
    expect(result.simulationOnly).toBe(true);
    expect(result.allowed).toBe(false);
    expect(result.blockedReasons.length).toBeGreaterThan(0);
  });

  it("LP blocks with yield disclaimer when risk disclosure not acknowledged", () => {
    const result = evaluateStellarLiquidityPoolRequest({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: false,
    });
    const hasYieldBlock = result.blockedReasons.some(
      (r) => r.toLowerCase().includes("yield") || r.toLowerCase().includes("return"),
    );
    expect(hasYieldBlock).toBe(true);
  });

  it("path payment blocks when anchor involved", () => {
    const result = evaluateStellarPathPaymentRequest({
      assetId: "TSU",
      senderKycStatus: "verified",
      receiverKycStatus: "verified",
      anchorInvolved: true,
    });
    expect(result.allowed).toBe(false);
    const hasAnchorBlock = result.blockedReasons.some(
      (r) => r.toLowerCase().includes("anchor") || r.toLowerCase().includes("sep"),
    );
    expect(hasAnchorBlock).toBe(true);
  });

  it("path payment without anchor is still blocked by public network gate", () => {
    const result = evaluateStellarPathPaymentRequest({
      assetId: "TSU",
      senderKycStatus: "verified",
      receiverKycStatus: "verified",
      anchorInvolved: false,
    });
    expect(result.allowed).toBe(false);
    expect(result.publicNetworkAllowedNow).toBe(false);
  });

  it("getStellarPolicyBlockedReason returns a non-empty string", () => {
    expect(getStellarPolicyBlockedReason()).toBeTruthy();
  });

  it("createStellarReadinessReport has correct field shape", () => {
    const report = createStellarReadinessReport();
    expect(typeof report.stellarAssetsTotal).toBe("number");
    expect(typeof report.stellarAssetsBlocked).toBe("number");
    expect(typeof report.stellarAssetsSimulationOnly).toBe("number");
    expect(typeof report.stellarAssetsTestnetReady).toBe("number");
    expect(report.isLivePublicNetworkEnabled).toBe(false);
  });
});

// ─── Bridge — Status & Asset Listing ─────────────────────────────────────────

describe("XrplStellarControlHubBridge — status", () => {
  it("getXrplStellarControlHubStatus returns expected shape", () => {
    const status = getXrplStellarControlHubStatus();
    expect(status.isLiveMainnetExecutionEnabled).toBe(false);
    expect(status.isLivePublicNetworkEnabled).toBe(false);
    expect(status.executionMode).toBe("simulation_only");
    expect(typeof status.xrplAssetsCount).toBe("number");
    expect(typeof status.stellarAssetsCount).toBe("number");
  });

  it("listXrplEcosystemAssets returns 11 display-safe items", () => {
    const assets = listXrplEcosystemAssets();
    expect(assets).toHaveLength(11);
    for (const asset of assets) {
      expect(asset.liveMainnetAllowedNow).toBe(false);
      expect(asset.nftMintingAllowedNow).toBe(false);
      expect(asset.id).toBeTruthy();
    }
  });

  it("listStellarEcosystemAssets returns 12 display-safe items", () => {
    const assets = listStellarEcosystemAssets();
    expect(assets).toHaveLength(12);
    for (const asset of assets) {
      expect(asset.publicNetworkAllowedNow).toBe(false);
      expect(asset.id).toBeTruthy();
    }
  });
});

// ─── Bridge — XRPL Simulations ────────────────────────────────────────────────

describe("Bridge — XRPL trustline simulation", () => {
  it("returns CrossRailGovernanceDecision with simulationOnly: true", () => {
    const decision = simulateXrplTrustline({
      assetId: "TSU",
      holderKycStatus: "verified",
      issuerStatus: "live",
    });
    expect(decision.simulationOnly).toBe(true);
    expect(decision.allowed).toBe(false);
  });

  it("creates Control Hub records — taskId is non-null", () => {
    const decision = simulateXrplTrustline({
      assetId: "TSU",
      holderKycStatus: "verified",
      issuerStatus: "live",
    });
    expect(decision.taskId).toBeTruthy();
    expect(decision.persisted).toBe(true);
  });

  it("auditRecordId is set after simulation", () => {
    const decision = simulateXrplTrustline({
      assetId: "TSU",
      holderKycStatus: "pending",
    });
    expect(decision.auditRecordId).toBeTruthy();
  });
});

describe("Bridge — XRPL NFT mint simulation", () => {
  it("is always blocked", () => {
    const decision = simulateXrplNftMint({
      assetId: "TUNI",
      kybStatus: "verified",
      metadataDefined: true,
      legalReviewComplete: true,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.simulationOnly).toBe(true);
  });

  it("blockedActions contains at least one entry", () => {
    const decision = simulateXrplNftMint({
      assetId: "TUNI",
      kybStatus: "verified",
      metadataDefined: true,
      legalReviewComplete: true,
    });
    expect(decision.blockedActions.length).toBeGreaterThan(0);
  });
});

describe("Bridge — XRPL AMM pool simulation", () => {
  it("is always blocked", () => {
    const decision = simulateXrplAmmPool({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: true,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.simulationOnly).toBe(true);
  });

  it("blocked actions include no-guaranteed-yield or return message when disclosure missing", () => {
    const decision = simulateXrplAmmPool({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: false,
    });
    const hasYieldBlock = decision.blockedActions.some(
      (a) => a.toLowerCase().includes("yield") || a.toLowerCase().includes("return"),
    );
    expect(hasYieldBlock).toBe(true);
  });
});

// ─── Bridge — Stellar Simulations ────────────────────────────────────────────

describe("Bridge — Stellar trustline simulation", () => {
  it("returns CrossRailGovernanceDecision with simulationOnly: true", () => {
    const decision = simulateStellarTrustline({
      assetId: "TSU",
      holderKycStatus: "verified",
      issuerStatus: "live",
    });
    expect(decision.simulationOnly).toBe(true);
    expect(decision.allowed).toBe(false);
  });

  it("creates Control Hub records", () => {
    const decision = simulateStellarTrustline({
      assetId: "TSU",
      holderKycStatus: "verified",
      issuerStatus: "live",
    });
    expect(decision.taskId).toBeTruthy();
    expect(decision.persisted).toBe(true);
  });
});

describe("Bridge — Stellar LP simulation", () => {
  it("is always blocked (public network gate)", () => {
    const decision = simulateStellarLiquidityPool({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: true,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.simulationOnly).toBe(true);
  });

  it("blocked actions include yield/return message when risk disclosure missing", () => {
    const decision = simulateStellarLiquidityPool({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: false,
    });
    const hasYieldBlock = decision.blockedActions.some(
      (a) => a.toLowerCase().includes("yield") || a.toLowerCase().includes("return"),
    );
    expect(hasYieldBlock).toBe(true);
  });
});

describe("Bridge — Stellar path payment simulation", () => {
  it("is blocked by public network gate", () => {
    const decision = simulateStellarPathPayment({
      assetId: "TSU",
      senderKycStatus: "verified",
      receiverKycStatus: "verified",
      anchorInvolved: false,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.simulationOnly).toBe(true);
  });

  it("anchor involvement adds additional block", () => {
    const withAnchor = simulateStellarPathPayment({
      assetId: "TSU",
      senderKycStatus: "verified",
      receiverKycStatus: "verified",
      anchorInvolved: true,
    });
    const withoutAnchor = simulateStellarPathPayment({
      assetId: "TSU",
      senderKycStatus: "verified",
      receiverKycStatus: "verified",
      anchorInvolved: false,
    });
    expect(withAnchor.blockedActions.length).toBeGreaterThanOrEqual(
      withoutAnchor.blockedActions.length,
    );
    const hasAnchorBlock = withAnchor.blockedActions.some(
      (a) => a.toLowerCase().includes("anchor") || a.toLowerCase().includes("sep"),
    );
    expect(hasAnchorBlock).toBe(true);
  });
});

// ─── Cross-Rail Readiness Report ─────────────────────────────────────────────

describe("generateCrossRailReadinessReport", () => {
  it("returns all required fields", () => {
    const report = generateCrossRailReadinessReport();
    expect(typeof report.generatedAt).toBe("string");
    expect(typeof report.xrplAssetsTotal).toBe("number");
    expect(typeof report.xrplAssetsSimulationOnly).toBe("number");
    expect(typeof report.xrplAssetsBlocked).toBe("number");
    expect(typeof report.xrplAssetsTestnetReady).toBe("number");
    expect(typeof report.stellarAssetsTotal).toBe("number");
    expect(typeof report.stellarAssetsSimulationOnly).toBe("number");
    expect(typeof report.stellarAssetsBlocked).toBe("number");
    expect(typeof report.stellarAssetsTestnetReady).toBe("number");
    expect(report.isLiveMainnetExecutionEnabled).toBe(false);
    expect(report.isLivePublicNetworkEnabled).toBe(false);
    expect(typeof report.complianceGapsCount).toBe("number");
    expect(typeof report.blockedActionsCount).toBe("number");
    expect(Array.isArray(report.recommendedNextActions)).toBe(true);
  });

  it("governanceDecision has simulationOnly: true", () => {
    const report = generateCrossRailReadinessReport();
    expect(report.governanceDecision.simulationOnly).toBe(true);
    expect(report.governanceDecision.allowed).toBe(false);
  });

  it("xrplAssetsTotal matches XRPL registry length", () => {
    const report = generateCrossRailReadinessReport();
    expect(report.xrplAssetsTotal).toBe(XRPL_ECOSYSTEM_REGISTRY.length);
  });

  it("stellarAssetsTotal matches Stellar registry length", () => {
    const report = generateCrossRailReadinessReport();
    expect(report.stellarAssetsTotal).toBe(STELLAR_ECOSYSTEM_REGISTRY.length);
  });

  it("generatedAt is a valid ISO date string", () => {
    const report = generateCrossRailReadinessReport();
    expect(() => new Date(report.generatedAt)).not.toThrow();
    expect(new Date(report.generatedAt).toISOString()).toBeTruthy();
  });
});

// ─── Persistence — persistCrossRailSimulation ─────────────────────────────────

describe("persistCrossRailSimulation", () => {
  it("returns taskId and auditRecordId (both non-null)", () => {
    const result = persistCrossRailSimulation(
      "xrpl_trustline",
      "TSU",
      { holderKycStatus: "verified" },
      { allowed: false, simulationOnly: true },
    );
    expect(result.taskId).toBeTruthy();
    expect(result.auditRecordId).toBeTruthy();
  });

  it("can persist multiple simulations without errors", () => {
    const r1 = persistCrossRailSimulation("xrpl_nft", "TUNI", {}, { allowed: false });
    const r2 = persistCrossRailSimulation("stellar_trustline", "TSU", {}, { allowed: false });
    expect(r1.taskId).toBeTruthy();
    expect(r2.taskId).toBeTruthy();
    expect(r1.taskId).not.toBe(r2.taskId);
  });
});

// ─── Persistence — createCrossRailGovernanceAuditEntry ────────────────────────

describe("createCrossRailGovernanceAuditEntry", () => {
  it("returns auditRecordId (non-null)", () => {
    const result = createCrossRailGovernanceAuditEntry(
      "xrpl_simulation_requested",
      "Test audit entry",
      { test: true },
    );
    expect(result.auditRecordId).toBeTruthy();
  });
});

// ─── Safety — No Public Claim of Guaranteed Liquidity/Yield/Profit ───────────

describe("Safety — no guaranteed liquidity/yield/profit passes through", () => {
  it("XRPL AMM simulation is always blocked — auditHint present", () => {
    const decision = simulateXrplAmmPool({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: true,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.auditHint).toBeTruthy();
  });

  it("Stellar LP auditHint always mentions no guaranteed yield or return", () => {
    const decision = simulateStellarLiquidityPool({
      assetId: "HOTRCW",
      lpProviderKycStatus: "verified",
      riskDisclosureAcknowledged: true,
    });
    expect(decision.allowed).toBe(false);
    const hintMentionsYield =
      decision.auditHint.toLowerCase().includes("yield") ||
      decision.auditHint.toLowerCase().includes("return");
    expect(hintMentionsYield).toBe(true);
  });

  it("cross-rail readiness report never claims live execution is enabled", () => {
    const report = generateCrossRailReadinessReport();
    expect(report.isLiveMainnetExecutionEnabled).toBe(false);
    expect(report.isLivePublicNetworkEnabled).toBe(false);
  });

  it("status endpoint never claims live execution is enabled", () => {
    const status = getXrplStellarControlHubStatus();
    expect(status.isLiveMainnetExecutionEnabled).toBe(false);
    expect(status.isLivePublicNetworkEnabled).toBe(false);
  });
});
