/**
 * Troptions Risk Language Rules
 * Banned promotional terms and approved institutional replacements.
 * Used at runtime to scan all public copy, claims, and marketing materials.
 */

export interface RiskLanguageRule {
  ruleId: string;
  bannedTerm: string;
  reason: string;
  riskLevel: "HIGH" | "CRITICAL";
  approvedReplacement: string;
  appliesTo: string[];
}

export const RISK_LANGUAGE_RULES: RiskLanguageRule[] = [
  // ─── Investment-Return Phrases ─────────────────────────────────────────────
  {
    ruleId: "RLANG-001",
    bannedTerm: "guaranteed returns",
    reason: "No financial product can guarantee returns. Creates liability and potential securities fraud.",
    riskLevel: "CRITICAL",
    approvedReplacement: "projected outcomes are subject to market conditions, counterparty risk, and other factors described in the risk disclosure",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },
  {
    ruleId: "RLANG-002",
    bannedTerm: "guaranteed yield",
    reason: "No yield is guaranteed. Creates liability.",
    riskLevel: "CRITICAL",
    approvedReplacement: "anticipated yield, subject to risk factors and disclosed limitations",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },
  {
    ruleId: "RLANG-003",
    bannedTerm: "risk-free",
    reason: "All financial products carry risk. Risk-free claims are false.",
    riskLevel: "CRITICAL",
    approvedReplacement: "risk factors are disclosed in the accompanying documentation",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website", "admin"],
  },
  {
    ruleId: "RLANG-004",
    bannedTerm: "risk free",
    reason: "See RLANG-003.",
    riskLevel: "CRITICAL",
    approvedReplacement: "risk factors are disclosed in the accompanying documentation",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website", "admin"],
  },

  // ─── Market / Liquidity Phrases ────────────────────────────────────────────
  {
    ruleId: "RLANG-005",
    bannedTerm: "instant liquidity",
    reason: "Liquidity is not instant or guaranteed. Misleading to investors.",
    riskLevel: "CRITICAL",
    approvedReplacement: "liquidity depends on market conditions, venue availability, and counterparty acceptance, and is not guaranteed",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },
  {
    ruleId: "RLANG-006",
    bannedTerm: "deep liquidity",
    reason: "Liquidity depth is not verified. Misleading.",
    riskLevel: "HIGH",
    approvedReplacement: "market depth information is available from verified venue data",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },
  {
    ruleId: "RLANG-007",
    bannedTerm: "publicly traded",
    reason: "Cannot imply public market without verified venue listing.",
    riskLevel: "HIGH",
    approvedReplacement: "trading venue and exchange listing status is disclosed separately",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },

  // ─── Accounting / Balance Sheet Phrases ────────────────────────────────────
  {
    ruleId: "RLANG-008",
    bannedTerm: "balance sheet enhancement",
    reason: "Accounting treatment requires independent CPA analysis. This phrase is deceptive without that analysis.",
    riskLevel: "CRITICAL",
    approvedReplacement: "accounting treatment is subject to independent CPA or auditor review and applicable reporting standards",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website", "partner-materials"],
  },
  {
    ruleId: "RLANG-009",
    bannedTerm: "enhances corporate balance sheets",
    reason: "See RLANG-008.",
    riskLevel: "CRITICAL",
    approvedReplacement: "potential accounting treatment requires independent professional review",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website", "partner-materials"],
  },

  // ─── 'World's First' and Superlative Phrases ──────────────────────────────
  {
    ruleId: "RLANG-010",
    bannedTerm: "world's first",
    reason: "Unverifiable superlative. Creates liability if false.",
    riskLevel: "HIGH",
    approvedReplacement: "one of the early [describe specifically what it is]",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },
  {
    ruleId: "RLANG-011",
    bannedTerm: "first ever",
    reason: "Unverifiable superlative.",
    riskLevel: "HIGH",
    approvedReplacement: "one of the first [describe specifically]",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },
  {
    ruleId: "RLANG-012",
    bannedTerm: "game changer",
    reason: "Vague promotional phrase with no evidentiary basis.",
    riskLevel: "HIGH",
    approvedReplacement: "describe the specific capability or differentiator with evidence",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },

  // ─── Humanitarian / Social Impact Phrases ─────────────────────────────────
  {
    ruleId: "RLANG-013",
    bannedTerm: "humanitarian token",
    reason: "Classification of token as 'humanitarian' requires legal analysis, charity registration, and governance controls.",
    riskLevel: "HIGH",
    approvedReplacement: "social-impact program token subject to governance controls and legal classification",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },

  // ─── Asset-Backed / Stablecoin Phrases ────────────────────────────────────
  {
    ruleId: "RLANG-014",
    bannedTerm: "stable token",
    reason: "Stablecoin claims require reserve proof, redemption policy, legal classification, and licensing.",
    riskLevel: "CRITICAL",
    approvedReplacement: "token subject to reserve documentation, legal classification, and licensing review",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },
  {
    ruleId: "RLANG-015",
    bannedTerm: "asset-backed token",
    reason: "Requires custody proof, reserve schedule, and legal classification before use.",
    riskLevel: "CRITICAL",
    approvedReplacement: "token with disclosed reserve policy, subject to custody proof and legal classification",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },
  {
    ruleId: "RLANG-016",
    bannedTerm: "1:1 backed",
    reason: "Requires independent reserve attestation before use.",
    riskLevel: "CRITICAL",
    approvedReplacement: "reserve ratio is disclosed in the reserve schedule and subject to independent attestation",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },

  // ─── Compliance / Regulatory Phrases ──────────────────────────────────────
  {
    ruleId: "RLANG-017",
    bannedTerm: "worldwide compliance",
    reason: "Compliance is jurisdiction-specific and cannot be claimed globally.",
    riskLevel: "CRITICAL",
    approvedReplacement: "jurisdiction-specific compliance status is disclosed separately",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website", "admin"],
  },
  {
    ruleId: "RLANG-018",
    bannedTerm: "fully compliant",
    reason: "Compliance is jurisdiction and activity-specific. 'Fully compliant' is an overstatement.",
    riskLevel: "HIGH",
    approvedReplacement: "compliance program is designed for [specific jurisdiction] and covers [specific activities], subject to ongoing legal review",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },

  // ─── Exchange / Market Access Phrases ─────────────────────────────────────
  {
    ruleId: "RLANG-019",
    bannedTerm: "full-service crypto exchange",
    reason: "Operating a crypto exchange requires licensing. Cannot imply exchange services without licensing analysis.",
    riskLevel: "CRITICAL",
    approvedReplacement: "exchange infrastructure initiative subject to licensing analysis and regulatory approval",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },
  {
    ruleId: "RLANG-020",
    bannedTerm: "global financial system",
    reason: "Hyperbolic and vague. No evidence Troptions participates in or replaces the global financial system.",
    riskLevel: "HIGH",
    approvedReplacement: "cross-border digital asset infrastructure connecting [specific use cases]",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper", "website"],
  },

  // ─── Hype / Promotional Phrases ────────────────────────────────────────────
  {
    ruleId: "RLANG-021",
    bannedTerm: "revolutionary",
    reason: "Vague superlative with no evidence.",
    riskLevel: "HIGH",
    approvedReplacement: "describe the specific technical or operational capability",
    appliesTo: ["public-marketing", "website"],
  },
  {
    ruleId: "RLANG-022",
    bannedTerm: "explosive growth",
    reason: "Forward-looking statement without basis.",
    riskLevel: "HIGH",
    approvedReplacement: "growth assumptions are documented in the financial model and subject to risk factors",
    appliesTo: ["public-marketing", "investor-materials", "whitepaper"],
  },
];

/** Check copy text for banned terms — returns matching rules */
export function scanForBannedTerms(text: string): RiskLanguageRule[] {
  const lowerText = text.toLowerCase();
  return RISK_LANGUAGE_RULES.filter((rule) =>
    lowerText.includes(rule.bannedTerm.toLowerCase()),
  );
}

/** Runtime assertion — throws if CRITICAL banned terms found */
export function assertNoCriticalBannedTerms(text: string): void {
  const violations = scanForBannedTerms(text).filter((r) => r.riskLevel === "CRITICAL");
  if (violations.length > 0) {
    const terms = violations.map((v) => `"${v.bannedTerm}"`).join(", ");
    throw new Error(
      `[RiskLanguageGuard] CRITICAL banned terms found in copy: ${terms}. Review RISK_LANGUAGE_RULES for approved replacements.`,
    );
  }
}
