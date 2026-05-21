// TROPTIONS Exchange OS — Launch Readiness Report

import { xrplConfig } from "@/config/exchange-os/xrpl";
import { isValidXrplAddress } from "@/lib/exchange-os/xrpl/readWallet";
import { isVerifiedIssuer } from "@/lib/exchange-os/risk/issuerChecks";

export interface LaunchReadinessInput {
  ticker: string;
  issuerAddress: string;
  maxSupply: string;
  metadataUrl?: string;
  hasLiquidityPlan: boolean;
  rewardPoliciesEnabled: boolean;
  x402AccessEnabled: boolean;
}

export interface LaunchReadinessCheck {
  id: string;
  label: string;
  passed: boolean;
  note: string;
}

export interface LaunchReadinessReport {
  ticker: string;
  issuerAddress: string;
  score: number; // 0–100
  readinessLevel: "not-ready" | "partial" | "ready" | "production-ready";
  checks: LaunchReadinessCheck[];
  blockers: string[];
  recommendations: string[];
  demoMode: boolean;
  generatedAt: string;
}

/** Generate a launch readiness report for a new XRPL token */
export function generateLaunchReadinessReport(
  input: LaunchReadinessInput
): LaunchReadinessReport {
  const checks: LaunchReadinessCheck[] = [];

  // 1. Valid issuer address
  const validIssuer = isValidXrplAddress(input.issuerAddress);
  checks.push({
    id: "valid-issuer",
    label: "Valid XRPL issuer address",
    passed: validIssuer,
    note: validIssuer ? "Address format is valid." : "Issuer address is not a valid XRPL address.",
  });

  // 2. Ticker length
  const validTicker = input.ticker.length >= 3 && input.ticker.length <= 9;
  checks.push({
    id: "ticker-length",
    label: "Ticker length (3–9 chars)",
    passed: validTicker,
    note: validTicker
      ? `Ticker "${input.ticker}" is valid.`
      : `Ticker must be 3–9 characters (standard) or 160-bit hex.`,
  });

  // 3. Supply defined
  const validSupply = parseFloat(input.maxSupply) > 0;
  checks.push({
    id: "supply-defined",
    label: "Max supply defined",
    passed: validSupply,
    note: validSupply ? `Supply: ${input.maxSupply}` : "Max supply must be > 0.",
  });

  // 4. Metadata URL
  const hasMetadata = !!input.metadataUrl && input.metadataUrl.startsWith("http");
  checks.push({
    id: "metadata-url",
    label: "Metadata URL configured",
    passed: hasMetadata,
    note: hasMetadata
      ? "Token metadata URL is set."
      : "Recommended: set a metadata URL for token discovery.",
  });

  // 5. Verified issuer
  const verified = isVerifiedIssuer(input.issuerAddress);
  checks.push({
    id: "verified-issuer",
    label: "Issuer in TROPTIONS registry",
    passed: verified,
    note: verified
      ? "Issuer is recognized in the TROPTIONS registry."
      : "Issuer is not yet verified. Apply for verification to build trust.",
  });

  // 6. Liquidity plan
  checks.push({
    id: "liquidity-plan",
    label: "Liquidity plan (AMM/DEX)",
    passed: input.hasLiquidityPlan,
    note: input.hasLiquidityPlan
      ? "Liquidity allocation planned."
      : "No liquidity plan set — tokens may be untradeable at launch.",
  });

  // 7. Reward policies
  checks.push({
    id: "reward-policies",
    label: "Reward policies enabled",
    passed: input.rewardPoliciesEnabled,
    note: input.rewardPoliciesEnabled
      ? "Creator/referral/sponsor reward policies are active."
      : "Enable reward policies to incentivize ecosystem growth.",
  });

  // 8. x402 access
  checks.push({
    id: "x402-access",
    label: "x402 paid reports enabled",
    passed: input.x402AccessEnabled,
    note: input.x402AccessEnabled
      ? "x402 premium reports are enabled for this token."
      : "Enable x402 to offer gated risk and analytics reports.",
  });

  // 9. Mainnet enabled
  checks.push({
    id: "mainnet-enabled",
    label: "Mainnet enabled",
    passed: xrplConfig.mainnetEnabled,
    note: xrplConfig.mainnetEnabled
      ? "XRPL mainnet is active. Transactions will be real."
      : "Demo mode — set XRPL_MAINNET_ENABLED=true for production launch.",
  });

  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  const blockers = checks.filter((c) => !c.passed && ["valid-issuer", "ticker-length", "supply-defined"].includes(c.id)).map((c) => c.note);
  const recommendations = checks.filter((c) => !c.passed && !["valid-issuer", "ticker-length", "supply-defined"].includes(c.id)).map((c) => c.note);

  let readinessLevel: LaunchReadinessReport["readinessLevel"];
  if (blockers.length > 0) readinessLevel = "not-ready";
  else if (score < 60) readinessLevel = "partial";
  else if (score < 90) readinessLevel = "ready";
  else readinessLevel = "production-ready";

  return {
    ticker: input.ticker,
    issuerAddress: input.issuerAddress,
    score,
    readinessLevel,
    checks,
    blockers,
    recommendations,
    demoMode: xrplConfig.demoMode,
    generatedAt: new Date().toISOString(),
  };
}
