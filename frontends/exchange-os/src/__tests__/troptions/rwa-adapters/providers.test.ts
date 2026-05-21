import {
  RWA_PROVIDER_ADAPTERS,
  getRwaProviderById,
  getRwaProvidersByCategory,
  getRwaProvidersByStatus,
  getReferenceOnlyProviders,
  getPublicClaimableProviders,
} from "@/lib/troptions/rwa-adapters/providers";
import { assertNoFthInAdapters } from "@/lib/troptions/rwa-adapters/claimGuards";

describe("RWA Provider Adapters", () => {
  it("should have exactly 12 provider adapters", () => {
    expect(RWA_PROVIDER_ADAPTERS).toHaveLength(12);
  });

  it("should have executionEnabled: false on ALL adapters", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      expect(adapter.executionEnabled).toBe(false);
    }
  });

  it("should have no provider contracts on any adapter", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      expect(adapter.hasProviderContract).toBe(false);
    }
  });

  it("should have no credentials on any adapter", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      expect(adapter.hasCredentials).toBe(false);
    }
  });

  it("should have no legal review completed on any adapter", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      expect(adapter.hasLegalReview).toBe(false);
    }
  });

  it("should have no compliance approval granted on any adapter", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      expect(adapter.hasComplianceApproval).toBe(false);
    }
  });

  it("should have NO adapter with status production_ready", () => {
    const productionReady = RWA_PROVIDER_ADAPTERS.filter(
      (a) => a.currentTroptionsStatus === "production_ready"
    );
    expect(productionReady).toHaveLength(0);
  });

  it("should have NO adapter with capabilityStatus execution_confirmed", () => {
    const executionConfirmed = RWA_PROVIDER_ADAPTERS.filter(
      (a) => a.capabilityStatus === "execution_confirmed"
    );
    expect(executionConfirmed).toHaveLength(0);
  });

  it("should pass FTH scan — no FTH/FTHX/FTHG references", () => {
    const result = assertNoFthInAdapters(RWA_PROVIDER_ADAPTERS);
    expect(result.clean).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("should return adapter by ID", () => {
    const adapter = getRwaProviderById("rwa-ondo");
    expect(adapter).toBeDefined();
    expect(adapter?.displayName).toBe("Ondo Finance");
  });

  it("should return undefined for unknown ID", () => {
    const adapter = getRwaProviderById("rwa-nonexistent");
    expect(adapter).toBeUndefined();
  });

  it("should return adapters by category", () => {
    const treasuryAdapters = getRwaProvidersByCategory("tokenized_treasury");
    expect(treasuryAdapters.length).toBeGreaterThanOrEqual(1);
    for (const a of treasuryAdapters) {
      expect(a.category).toBe("tokenized_treasury");
    }
  });

  it("should return reference-only adapters", () => {
    const refs = getReferenceOnlyProviders();
    expect(refs.length).toBeGreaterThanOrEqual(9);
    for (const a of refs) {
      expect(a.currentTroptionsStatus).toBe("reference_only");
    }
  });

  it("getPublicClaimableProviders should return providers with non-empty allowedPublicLanguage", () => {
    const claimable = getPublicClaimableProviders();
    for (const a of claimable) {
      expect(a.allowedPublicLanguage.trim().length).toBeGreaterThan(0);
    }
  });

  it("reference-only adapters should not be claimable as partners (no contract)", () => {
    const refs = getReferenceOnlyProviders();
    for (const adapter of refs) {
      expect(adapter.hasProviderContract).toBe(false);
    }
  });

  it("all adapters should have a non-empty providerId and displayName", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      expect(adapter.providerId.trim().length).toBeGreaterThan(0);
      expect(adapter.displayName.trim().length).toBeGreaterThan(0);
    }
  });

  it("all adapters should have a non-empty allowedPublicLanguage", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      expect(adapter.allowedPublicLanguage.trim().length).toBeGreaterThan(0);
    }
  });

  it("all adapters should have a non-empty blockedPublicLanguage list", () => {
    for (const adapter of RWA_PROVIDER_ADAPTERS) {
      expect(adapter.blockedPublicLanguage.length).toBeGreaterThan(0);
    }
  });

  it("blackrock-buidl adapter should have critical risk notes", () => {
    const buidl = getRwaProviderById("rwa-blackrock-buidl");
    expect(buidl).toBeDefined();
    expect(buidl!.riskNotes.toLowerCase()).toContain("blackrock");
  });

  it("getRwaProvidersByStatus should filter correctly", () => {
    const refs = getRwaProvidersByStatus("reference_only");
    expect(refs.length).toBeGreaterThanOrEqual(9);
    for (const a of refs) {
      expect(a.currentTroptionsStatus).toBe("reference_only");
    }
  });
});
