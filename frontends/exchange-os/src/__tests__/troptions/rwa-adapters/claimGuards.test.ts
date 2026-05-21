import {
  blockUnsafeRwaClaim,
  suggestSafeRwaClaim,
  canClaimProductionReady,
  assertNoFakeRwaExecution,
  evaluateClaimBatch,
  getBlockedLanguageForAdapter,
  assertNoFthInAdapters,
} from "@/lib/troptions/rwa-adapters/claimGuards";
import { getRwaProviderById, RWA_PROVIDER_ADAPTERS } from "@/lib/troptions/rwa-adapters/providers";

const referenceOnlyAdapter = getRwaProviderById("rwa-ondo")!;

describe("RWA Claim Guards", () => {
  // ─── blockUnsafeRwaClaim ─────────────────────────────────────────────────

  it("should block partnership claim as 'blocked'", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS is partnered with Ondo");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("blocked");
  });

  it("should block 'integrated with' as 'blocked'", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS is integrated with Maple Finance");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("blocked");
  });

  it("should block 'official partner' as 'blocked'", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS official partner of Centrifuge");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("blocked");
  });

  it("should block asset backing claim as 'critical'", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS asset-backed by Centrifuge pools");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("critical");
  });

  it("should block custody claim as 'critical'", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS custody of tokenized treasury");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("critical");
  });

  it("should block live execution claim as 'blocked'", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS live execution with Chainlink");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("blocked");
  });

  it("should block SEC registered claim as 'critical'", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS SEC registered with Securitize");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("critical");
  });

  it("should block FTH reference as 'critical'", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS FTH integration with Ondo");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("critical");
  });

  it("should block FTHX reference as 'critical'", () => {
    const result = blockUnsafeRwaClaim("FTHX-powered RWA adapter");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("critical");
  });

  it("should block 'future tech holdings' reference as 'critical'", () => {
    const result = blockUnsafeRwaClaim("Future Tech Holdings RWA");
    expect(result.isSafe).toBe(false);
    expect(result.riskLevel).toBe("critical");
  });

  it("should approve safe provider-neutral language as 'safe'", () => {
    const result = blockUnsafeRwaClaim(
      "TROPTIONS is designed with provider-neutral adapter readiness for tokenized treasury infrastructure"
    );
    expect(result.isSafe).toBe(true);
    expect(result.riskLevel).toBe("safe");
  });

  it("should approve general RWA readiness language as 'safe'", () => {
    const result = blockUnsafeRwaClaim(
      "TROPTIONS is building readiness for real-world asset and onchain credit infrastructure"
    );
    expect(result.isSafe).toBe(true);
    expect(result.riskLevel).toBe("safe");
  });

  it("should include saferAlternative for blocked claims", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS partnered with Ondo Finance");
    expect(result.saferAlternative).not.toBeNull();
    expect(typeof result.saferAlternative).toBe("string");
  });

  it("should have null saferAlternative for safe claims", () => {
    const result = blockUnsafeRwaClaim("TROPTIONS is building provider-neutral readiness");
    expect(result.saferAlternative).toBeNull();
  });

  // ─── suggestSafeRwaClaim ─────────────────────────────────────────────────

  it("suggestSafeRwaClaim should return allowedPublicLanguage", () => {
    const suggestion = suggestSafeRwaClaim(referenceOnlyAdapter);
    expect(suggestion).toBe(referenceOnlyAdapter.allowedPublicLanguage);
    expect(suggestion.trim().length).toBeGreaterThan(0);
  });

  // ─── canClaimProductionReady ─────────────────────────────────────────────

  it("canClaimProductionReady should return false for reference-only adapter", () => {
    const result = canClaimProductionReady(referenceOnlyAdapter);
    expect(result.allowed).toBe(false);
    expect(result.blockers.length).toBeGreaterThan(0);
  });

  it("canClaimProductionReady should list blockers when contract missing", () => {
    const adapter = getRwaProviderById("rwa-ondo")!;
    const result = canClaimProductionReady(adapter);
    const blockerText = result.blockers.join(" ");
    expect(blockerText.toLowerCase()).toMatch(/contract|legal|compliance|credentials/);
  });

  it("canClaimProductionReady should return false for ALL current adapters", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      const result = canClaimProductionReady(adapter);
      expect(result.allowed).toBe(false);
    }
  });

  // ─── assertNoFakeRwaExecution ─────────────────────────────────────────────

  it("assertNoFakeRwaExecution should NOT throw for reference_only adapter", () => {
    expect(() => assertNoFakeRwaExecution(referenceOnlyAdapter)).not.toThrow();
  });

  // ─── evaluateClaimBatch ───────────────────────────────────────────────────

  it("evaluateClaimBatch should return correct results for mixed claims", () => {
    const results = evaluateClaimBatch([
      "TROPTIONS partnered with Ondo",
      "TROPTIONS is building provider-neutral readiness",
      "TROPTIONS FTH powered",
    ]);
    expect(results[0].isSafe).toBe(false);
    expect(results[1].isSafe).toBe(true);
    expect(results[2].isSafe).toBe(false);
  });

  it("evaluateClaimBatch should return array of same length as input", () => {
    const claims = ["safe claim one", "safe claim two", "partnered with X"];
    const results = evaluateClaimBatch(claims);
    expect(results).toHaveLength(3);
  });

  // ─── getBlockedLanguageForAdapter ─────────────────────────────────────────

  it("getBlockedLanguageForAdapter should return non-empty array", () => {
    const blocked = getBlockedLanguageForAdapter(referenceOnlyAdapter);
    expect(blocked.length).toBeGreaterThan(0);
  });

  // ─── assertNoFthInAdapters ────────────────────────────────────────────────

  it("assertNoFthInAdapters should return clean:true for all production adapters", () => {
    const result = assertNoFthInAdapters(RWA_PROVIDER_ADAPTERS);
    expect(result.clean).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("assertNoFthInAdapters should detect FTH violation in mock adapter", () => {
    const mockAdapter = { ...referenceOnlyAdapter, riskNotes: "FTH partnership pending" };
    const result = assertNoFthInAdapters([mockAdapter]);
    expect(result.clean).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });
});
