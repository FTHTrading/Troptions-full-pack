// TROPTIONS Exchange OS — Earn Card (reward policy display)

import type { RewardPolicy } from "@/lib/exchange-os/rewards/types";
import { bpsToPercent } from "@/config/exchange-os/fees";
import Link from "next/link";

interface Props {
  policy: RewardPolicy;
  showCta?: boolean;
}

const ACCENT_MAP: Record<string, string> = {
  creator: "gold",
  referral: "cyan",
  sponsor: "cyan",
  liquidity: "green",
  "api-revenue": "gold",
  campaign: "gold",
};

const ICON_MAP: Record<string, string> = {
  creator: "◆",
  referral: "⟳",
  sponsor: "◈",
  liquidity: "⬡",
  "api-revenue": "⚡",
  campaign: "★",
};

export function EarnCard({ policy, showCta = true }: Props) {
  const accent = ACCENT_MAP[policy.category] ?? "cyan";
  const icon = ICON_MAP[policy.category] ?? "◇";
  const pct = bpsToPercent(policy.rewardBps);

  return (
    <div className={`xos-card xos-card--${accent}`} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ fontSize: "1.5rem", lineHeight: 1, color: `var(--xos-${accent})` }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "var(--xos-text)", fontSize: "0.95rem" }}>{policy.label}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--xos-text-muted)", marginTop: 2 }}>{policy.category}</div>
        </div>
        <div style={{ fontWeight: 900, fontFamily: "var(--xos-font-mono)", color: `var(--xos-${accent})`, fontSize: "1.1rem" }}>
          {pct}%
        </div>
      </div>

      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--xos-text-muted)", lineHeight: 1.5 }}>
        {policy.description}
      </p>

      {policy.disclaimers[0] && (
        <div style={{ fontSize: "0.75rem", color: "var(--xos-text-subtle)", background: "rgba(0,0,0,0.2)", padding: "0.5rem 0.75rem", borderRadius: 6 }}>
          {policy.disclaimers[0]}
        </div>
      )}

      {showCta && (
        <Link href="/exchange-os/signup" className="xos-btn xos-btn--outline" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem", textAlign: "center" }}>
          Apply for Access
        </Link>
      )}
    </div>
  );
}
