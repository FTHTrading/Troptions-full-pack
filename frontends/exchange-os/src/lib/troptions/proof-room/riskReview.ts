/**
 * TROPTIONS Proof Room — Risk Review (unsafe phrases and safer replacements)
 */

import type { TroptionsRiskReview } from "./types";

export function getMockRiskReviews(): TroptionsRiskReview[] {
  return [
    {
      id: "risk-001",
      unsafePhrase: "TROPTIONS executes live payouts",
      riskLevel: "high",
      whyRisky:
        "Implies current live payment execution without a confirmed provider adapter.",
      saferReplacement:
        "TROPTIONS PayOps manages payout workflows; live execution requires a production-ready provider.",
      exampleContext: "Website landing page, product overview",
    },
    {
      id: "risk-002",
      unsafePhrase: "Backed by $175M USDC",
      riskLevel: "critical",
      whyRisky:
        "Specific financial claim requires independent attestation and legal opinion. Without this, it is a material misrepresentation.",
      saferReplacement:
        "DO NOT USE without independent attestation and legal opinion on file.",
      exampleContext: "Investor materials, public statements",
    },
    {
      id: "risk-003",
      unsafePhrase: "SEC registered or SEC approved",
      riskLevel: "critical",
      whyRisky:
        "False registration claim would be a federal securities violation.",
      saferReplacement:
        "TROPTIONS regulatory classification is under review. Consult legal counsel for securities questions.",
      exampleContext: "Investor pitch, fundraising materials",
    },
    {
      id: "risk-004",
      unsafePhrase: "TROPTIONS is a guaranteed store of value",
      riskLevel: "high",
      whyRisky:
        "Guarantees on store of value constitute securities-like promises that require legal backing.",
      saferReplacement:
        "TROPTIONS is a utility-based digital asset. Value is not guaranteed.",
      exampleContext: "Marketing materials, token descriptions",
    },
    {
      id: "risk-005",
      unsafePhrase: "Fully production ready",
      riskLevel: "medium",
      whyRisky:
        "Platform is in build-verification phase. Not all components have live provider configuration.",
      saferReplacement:
        "TROPTIONS software platform has passed build verification. Live production requires provider configuration.",
      exampleContext: "Platform documentation, sales materials",
    },
  ];
}
