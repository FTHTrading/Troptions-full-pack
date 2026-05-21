"use client";

import type { RiskLabel } from "@/config/exchange-os/riskLabels";
import { RISK_LABELS } from "@/config/exchange-os/riskLabels";

interface RiskBadgeProps {
  labelId: string;
  showDescription?: boolean;
}

export function RiskBadge({ labelId, showDescription = false }: RiskBadgeProps) {
  const label: RiskLabel | undefined = RISK_LABELS[labelId];
  if (!label) return null;

  const colorMap: Record<string, string> = {
    green: "xos-badge--green",
    red: "xos-badge--red",
    gold: "xos-badge--gold",
    cyan: "xos-badge--cyan",
    orange: "xos-badge--orange",
    slate: "xos-badge--slate",
  };

  return (
    <span
      className={`xos-badge ${colorMap[label.color] ?? "xos-badge--slate"}`}
      title={showDescription ? label.description : label.plainEnglish}
    >
      {label.label}
    </span>
  );
}

interface RiskBadgeGroupProps {
  labelIds: string[];
  showDescription?: boolean;
  max?: number;
}

export function RiskBadgeGroup({
  labelIds,
  showDescription = false,
  max,
}: RiskBadgeGroupProps) {
  const visible = max ? labelIds.slice(0, max) : labelIds;
  const hidden = max ? labelIds.length - max : 0;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
      {visible.map((id) => (
        <RiskBadge key={id} labelId={id} showDescription={showDescription} />
      ))}
      {hidden > 0 && (
        <span className="xos-badge xos-badge--slate">+{hidden} more</span>
      )}
    </div>
  );
}
