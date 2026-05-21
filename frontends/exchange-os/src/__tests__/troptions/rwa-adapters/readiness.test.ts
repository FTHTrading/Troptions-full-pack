import {
  evaluateRwaAdapterReadiness,
  evaluateExecutionReadiness,
  evaluateLegalReadiness,
  evaluateEvidenceReadiness,
  generateRwaRegistryReport,
  getAllRwaReadinessScores,
} from "@/lib/troptions/rwa-adapters/readiness";
import { getRwaProviderById, RWA_PROVIDER_ADAPTERS } from "@/lib/troptions/rwa-adapters/providers";

const ondoAdapter = getRwaProviderById("rwa-ondo")!;
const chainlinkAdapter = getRwaProviderById("rwa-chainlink")!;

describe("RWA Adapter Readiness", () => {
  // ─── evaluateExecutionReadiness ───────────────────────────────────────────

  it("evaluateExecutionReadiness should return score 0 for any adapter", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      const result = evaluateExecutionReadiness(adapter);
      expect(result.score).toBe(0);
    }
  });

  it("evaluateExecutionReadiness should always have blockers", () => {
    const result = evaluateExecutionReadiness(ondoAdapter);
    expect(result.blockers.length).toBeGreaterThan(0);
  });

  // ─── evaluateLegalReadiness ───────────────────────────────────────────────

  it("evaluateLegalReadiness should return score 0 when no legal review and no compliance approval", () => {
    const result = evaluateLegalReadiness(ondoAdapter);
    expect(result.score).toBe(0);
  });

  it("evaluateLegalReadiness should have blockers listing missing requirements", () => {
    const result = evaluateLegalReadiness(ondoAdapter);
    expect(result.blockers.length).toBeGreaterThan(0);
  });

  // ─── evaluateEvidenceReadiness ────────────────────────────────────────────

  it("evaluateEvidenceReadiness should return score 0 for reference-only adapter with no contract/credentials", () => {
    const result = evaluateEvidenceReadiness(ondoAdapter);
    expect(result.score).toBe(0);
  });

  it("evaluateEvidenceReadiness should have blockers for missing contract and credentials", () => {
    const result = evaluateEvidenceReadiness(ondoAdapter);
    const text = result.blockers.join(" ").toLowerCase();
    expect(text).toMatch(/contract|credential|evidence/);
  });

  // ─── evaluateRwaAdapterReadiness (full) ──────────────────────────────────

  it("evaluateRwaAdapterReadiness should return executionScore 0 for all adapters", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      const score = evaluateRwaAdapterReadiness(adapter);
      expect(score.executionScore).toBe(0);
    }
  });

  it("evaluateRwaAdapterReadiness canClaimPartnership should be false for all adapters", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      const score = evaluateRwaAdapterReadiness(adapter);
      expect(score.canClaimPartnership).toBe(false);
    }
  });

  it("evaluateRwaAdapterReadiness canClaimPublicly should be true for adapters with allowedPublicLanguage", () => {
    const score = evaluateRwaAdapterReadiness(ondoAdapter);
    expect(score.canClaimPublicly).toBe(true);
  });

  it("evaluateRwaAdapterReadiness overall score should be in range 0-100", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      const score = evaluateRwaAdapterReadiness(adapter);
      expect(score.overallScore).toBeGreaterThanOrEqual(0);
      expect(score.overallScore).toBeLessThanOrEqual(100);
    }
  });

  it("evaluateRwaAdapterReadiness should have blockers for all adapters", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      const score = evaluateRwaAdapterReadiness(adapter);
      expect(score.blockers.length).toBeGreaterThan(0);
    }
  });

  it("evaluateRwaAdapterReadiness should include providerId", () => {
    const score = evaluateRwaAdapterReadiness(ondoAdapter);
    expect(score.providerId).toBe("rwa-ondo");
  });

  // ─── generateRwaRegistryReport ────────────────────────────────────────────

  it("generateRwaRegistryReport should return totalAdapters = 12", () => {
    const report = generateRwaRegistryReport();
    expect(report.totalAdapters).toBe(12);
  });

  it("generateRwaRegistryReport should return productionReadyCount = 0", () => {
    const report = generateRwaRegistryReport();
    expect(report.productionReadyCount).toBe(0);
  });

  it("generateRwaRegistryReport should return blockedCount = 0", () => {
    const report = generateRwaRegistryReport();
    expect(report.blockedCount).toBe(0);
  });

  it("generateRwaRegistryReport should have non-zero referenceOnlyCount", () => {
    const report = generateRwaRegistryReport();
    expect(report.referenceOnlyCount).toBeGreaterThan(0);
  });

  it("generateRwaRegistryReport should include adapters array", () => {
    const report = generateRwaRegistryReport();
    expect(report.adapters).toHaveLength(12);
  });

  // ─── getAllRwaReadinessScores ──────────────────────────────────────────────

  it("getAllRwaReadinessScores should return 12 scores", () => {
    const scores = getAllRwaReadinessScores();
    expect(scores).toHaveLength(12);
  });

  it("getAllRwaReadinessScores should all have executionScore 0", () => {
    const scores = getAllRwaReadinessScores();
    for (const score of scores) {
      expect(score.executionScore).toBe(0);
    }
  });

  it("getAllRwaReadinessScores should all have canClaimPartnership false", () => {
    const scores = getAllRwaReadinessScores();
    for (const score of scores) {
      expect(score.canClaimPartnership).toBe(false);
    }
  });
});
