/**
 * TROPTIONS RWA Adapter Evidence Registry
 *
 * Evidence records for RWA provider adapters.
 * All records reflect honest build state — no fake contracts, credentials,
 * custody records, audit records, or legal opinions.
 *
 * No FTH / FTHX / FTHG / Future Tech Holdings references.
 */

import { RwaEvidenceRecord } from "./types";
import { RWA_PROVIDER_ADAPTERS } from "./providers";

// ─── Evidence Records ──────────────────────────────────────────────────────

/**
 * Get mock/initial evidence records showing what is missing for each adapter.
 * All statuses are "missing" by default — honest build state.
 */
export function getMockRwaEvidenceRecords(): RwaEvidenceRecord[] {
  const records: RwaEvidenceRecord[] = [];

  for (const adapter of RWA_PROVIDER_ADAPTERS) {
    if (adapter.requiredProviderContract) {
      records.push({
        id: `ev-${adapter.providerId}-contract`,
        providerId: adapter.providerId,
        evidenceType: "provider_contract",
        description: `Signed provider agreement with ${adapter.displayName}`,
        status: "missing",
        dateRecorded: null,
        notes: "Required before any integration or public partnership claim.",
      });
    }

    if (adapter.requiredLegalReview.length > 0) {
      records.push({
        id: `ev-${adapter.providerId}-legal`,
        providerId: adapter.providerId,
        evidenceType: "legal_opinion",
        description: `Legal opinion covering: ${adapter.requiredLegalReview.slice(0, 2).join(", ")}`,
        status: "missing",
        dateRecorded: null,
        notes: "Required before any public capability claim related to this provider.",
      });
    }

    if (adapter.requiredCredentials.length > 0) {
      records.push({
        id: `ev-${adapter.providerId}-credentials`,
        providerId: adapter.providerId,
        evidenceType: "credentials",
        description: `API credentials for ${adapter.displayName}: ${adapter.requiredCredentials[0]}`,
        status: "missing",
        dateRecorded: null,
        notes: "Credentials may only be obtained after provider agreement is signed.",
      });
    }

    // Reference URL is always present for non-internal adapters
    if (adapter.officialReferenceUrl) {
      records.push({
        id: `ev-${adapter.providerId}-reference`,
        providerId: adapter.providerId,
        evidenceType: "reference_link",
        description: `Official reference URL for ${adapter.displayName}`,
        status: "present",
        dateRecorded: new Date().toISOString().slice(0, 10),
        notes: adapter.officialReferenceUrl,
      });
    }
  }

  return records;
}

/**
 * Get evidence records for a specific provider.
 */
export function getEvidenceForProvider(providerId: string): RwaEvidenceRecord[] {
  return getMockRwaEvidenceRecords().filter((r) => r.providerId === providerId);
}

/**
 * Get all missing evidence records.
 */
export function getMissingRwaEvidence(): RwaEvidenceRecord[] {
  return getMockRwaEvidenceRecords().filter((r) => r.status === "missing");
}

/**
 * Get evidence gap summary.
 */
export function getRwaEvidenceGapSummary(): {
  totalRequired: number;
  present: number;
  missing: number;
  criticalGaps: string[];
} {
  const all = getMockRwaEvidenceRecords();
  const criticalTypes: RwaEvidenceRecord["evidenceType"][] = [
    "provider_contract",
    "legal_opinion",
    "compliance_approval",
  ];

  const criticalGaps = all
    .filter((r) => r.status === "missing" && criticalTypes.includes(r.evidenceType))
    .map((r) => `${r.providerId}: ${r.evidenceType.replace(/_/g, " ")}`);

  return {
    totalRequired: all.length,
    present: all.filter((r) => r.status === "present").length,
    missing: all.filter((r) => r.status === "missing").length,
    criticalGaps,
  };
}
