// TROPTIONS Exchange OS — Issuer Checks

import type { XrplIssuedAsset } from "@/lib/exchange-os/xrpl/types";
import type { RiskLabelId } from "@/config/exchange-os/riskLabels";

/** Derive risk label IDs from on-chain issuer flags */
export function deriveIssuerRiskLabels(asset: XrplIssuedAsset): RiskLabelId[] {
  const labels: RiskLabelId[] = [];

  if (!asset.verifiedIssuer) labels.push("UNVERIFIED_ISSUER");
  else labels.push("VERIFIED_ISSUER");

  if (asset.freezeEnabled) labels.push("FREEZE_ENABLED");
  if (asset.clawbackEnabled) labels.push("CLAWBACK_ENABLED");

  labels.push("TRUSTLINE_REQUIRED");

  return labels;
}

/** Check if an issuer is in the TROPTIONS verified registry */
export function isVerifiedIssuer(issuer: string): boolean {
  // In production this queries the TROPTIONS issuer registry.
  // Currently returns true only for the known TROPTIONS genesis issuer.
  const VERIFIED_ISSUERS = new Set([
    "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3",
  ]);
  return VERIFIED_ISSUERS.has(issuer);
}
