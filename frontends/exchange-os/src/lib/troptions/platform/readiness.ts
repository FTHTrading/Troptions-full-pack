/**
 * TROPTIONS Platform — Readiness Engine
 */

import type { PlatformReadinessReport, PlatformCapabilityRecord } from "./types";
import { getPlatformCapabilities } from "./capabilities";

export function generatePlatformReadinessReport(): PlatformReadinessReport {
  const capabilities = getPlatformCapabilities();
  const now = new Date().toISOString();

  const blocked = capabilities
    .filter((c) => c.status === "blocked")
    .map((c) => c.displayName);

  const credentialsRequired = capabilities
    .filter((c) => c.status === "credentials_required")
    .map((c) => c.displayName);

  const legalRequired: string[] = [];

  const productionReady = capabilities.filter(
    (c) => c.status === "production_ready"
  );

  const score = Math.round((productionReady.length / capabilities.length) * 100);

  const recommendations: string[] = [];
  if (credentialsRequired.length > 0) {
    recommendations.push(
      `Configure credentials for: ${credentialsRequired.join(", ")}.`
    );
  }
  if (blocked.length > 0) {
    recommendations.push(`Review blocked capabilities: ${blocked.join(", ")}.`);
  }
  recommendations.push(
    "Migrate mock-only capabilities to production by connecting approved provider adapters."
  );

  return {
    generatedAt: now,
    overallScore: score,
    capabilities,
    blockedCapabilities: blocked,
    credentialsRequired,
    legalReviewRequired: legalRequired,
    recommendations,
  };
}

export function scoreCapabilityReadiness(
  capabilities: PlatformCapabilityRecord[]
): number {
  if (capabilities.length === 0) return 0;
  const productionCount = capabilities.filter(
    (c) => c.status === "production_ready"
  ).length;
  return Math.round((productionCount / capabilities.length) * 100);
}
