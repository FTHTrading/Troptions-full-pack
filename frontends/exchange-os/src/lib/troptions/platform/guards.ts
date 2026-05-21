/**
 * TROPTIONS Platform — Guard Functions
 */

import type { ExecutionRequest } from "./types";

export function isMockAdapter(adapterCategory: string): boolean {
  return ["mock", "mock_only", "manual_proof", "simulation"].includes(
    adapterCategory.toLowerCase()
  );
}

export function isProductionReady(adapterStatus: string): boolean {
  return adapterStatus === "production_ready";
}

export function isComplianceApproved(complianceStatus: string): boolean {
  return complianceStatus === "approved" || complianceStatus === "not_required";
}

export function hasRequiredCredentials(
  credentialsRequired: string[],
  credentialsPresent: string[]
): boolean {
  return credentialsRequired.every((cred) => credentialsPresent.includes(cred));
}

export function canExecute(request: ExecutionRequest): boolean {
  if (request.isMock || request.isManualProof) return false;
  if (!request.credentialsPresent) return false;
  if (!isComplianceApproved(request.complianceStatus)) return false;
  if (request.isSandbox) return false;
  if (request.adapterStatus !== "production_ready") return false;
  return true;
}

export function assertNoFakeTxHash(hash: string | null | undefined): void {
  if (!hash) return;
  const FAKE_PATTERNS = ["0x0000", "FAKE", "MOCK", "TEST123", "PLACEHOLDER"];
  for (const pattern of FAKE_PATTERNS) {
    if (hash.toUpperCase().includes(pattern)) {
      throw new Error(`Fake transaction hash detected: ${hash}`);
    }
  }
}

export function assertNoFthReference(text: string): void {
  const FTH_TERMS = ["FTH", "FTHX", "FTHG", "Future Tech Holdings"];
  for (const term of FTH_TERMS) {
    if (text.includes(term)) {
      throw new Error(
        `FTH reference detected in TROPTIONS platform code: "${term}". ` +
          `TROPTIONS is a separate brand. Remove FTH references.`
      );
    }
  }
}
