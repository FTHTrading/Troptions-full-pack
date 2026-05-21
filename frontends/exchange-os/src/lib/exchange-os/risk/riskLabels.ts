// TROPTIONS Exchange OS — Risk Label Engine

import { RISK_LABELS } from "@/config/exchange-os/riskLabels";
import type { RiskLabel, RiskLabelId } from "@/config/exchange-os/riskLabels";

export interface TokenRiskProfile {
  tokenId: string;
  labels: RiskLabel[];
  overallLevel: "none" | "low" | "medium" | "high" | "critical";
  plainEnglishSummary: string;
}

const LEVEL_ORDER = { none: 0, low: 1, medium: 2, high: 3, critical: 4 } as const;

/** Build a risk profile for a token from a list of label IDs */
export function buildTokenRiskProfile(
  tokenId: string,
  labelIds: RiskLabelId[]
): TokenRiskProfile {
  const labels = labelIds
    .map((id) => RISK_LABELS[id])
    .filter(Boolean) as RiskLabel[];

  // Overall level = highest individual level
  const overallLevel = labels.reduce<TokenRiskProfile["overallLevel"]>(
    (max, label) => {
      const current = LEVEL_ORDER[label.level];
      const maxLevel = LEVEL_ORDER[max];
      return current > maxLevel ? label.level : max;
    },
    "none"
  );

  const highLabels = labels.filter(
    (l) => l.level === "high" || l.level === "critical"
  );
  const plainEnglishSummary =
    highLabels.length > 0
      ? "High risk: " + highLabels.map((l) => l.plainEnglish).join(" ")
      : overallLevel === "none"
      ? "No major risk flags detected."
      : "Moderate risk: " + labels.map((l) => l.plainEnglish).join(" ");

  return { tokenId, labels, overallLevel, plainEnglishSummary };
}

/** Get color class for a risk level */
export function riskLevelColor(
  level: TokenRiskProfile["overallLevel"]
): string {
  switch (level) {
    case "critical":
    case "high":
      return "text-red-400 border-red-500";
    case "medium":
      return "text-amber-400 border-amber-500";
    case "low":
      return "text-yellow-300 border-yellow-400";
    case "none":
    default:
      return "text-emerald-400 border-emerald-500";
  }
}
