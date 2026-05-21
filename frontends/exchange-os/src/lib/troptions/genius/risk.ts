import type { PartnerRecord } from "@/lib/troptions/genius/types";

export function evaluateRwaPrivateMarketLanguage(input: string) {
  const normalized = input.toLowerCase();
  const blockedPatterns = ["guaranteed yield", "guaranteed return", "guaranteed redemption", "risk free", "stablecoin yield"];
  const matches = blockedPatterns.filter((pattern) => normalized.includes(pattern));

  return {
    blocked: matches.length > 0,
    reasons: matches.length > 0 ? matches.map((item) => `Blocked phrase detected: ${item}`) : ["No prohibited guarantee or yield language detected."],
    requiredReview: matches.length > 0 ? "legal_and_securities_review" : "standard_guardrail_review",
    saferLanguage:
      "Describe Troptions as a compliance-first settlement and readiness layer. Do not promise yield, guaranteed returns, or guaranteed redemption.",
  };
}

export function normalizePartnerRecord(input: Partial<PartnerRecord>): PartnerRecord {
  return {
    id: input.id ?? "partner-missing",
    category: input.category ?? "legal_counsel",
    name: input.name ?? "Unassigned partner candidate",
    readiness: input.readiness ?? "missing",
    summary: input.summary ?? "Partner diligence record is incomplete and requires follow-up.",
    allowedForResearch: true,
    allowedForSandbox: true,
    allowedForLive: false,
  };
}