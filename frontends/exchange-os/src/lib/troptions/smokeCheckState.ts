import type { SmokeCheckResult } from "@/lib/troptions/productionSmokeChecks";

let latestSmokeCheckResult: SmokeCheckResult | null = null;

export function setLatestSmokeCheckResult(result: SmokeCheckResult): void {
  latestSmokeCheckResult = result;
}

export function getLatestSmokeCheckResult(): SmokeCheckResult | null {
  return latestSmokeCheckResult;
}
