import { REWARD_POLICIES } from "@/lib/exchange-os/rewards/rewardPolicy";
import { bpsToPercent } from "@/config/exchange-os/fees";
import { REWARD_DISCLAIMER } from "@/lib/exchange-os/rewards/types";
import Link from "next/link";

export const metadata = { title: "Earn Rewards — TROPTIONS Exchange OS" };

export default function EarnPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div className="xos-section-header">
        <div className="xos-gold-line" />
        <h1 className="xos-section-title">Earn from the Platform</h1>
        <p className="xos-section-subtitle">
          Creator rewards, referral earnings, liquidity fees, and sponsor campaigns — all routed on XRPL.
          Estimated rewards only. Not guaranteed income.
        </p>
      </div>

      {/* Reward cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {REWARD_POLICIES.map((policy) => (
          <div key={policy.category} className="xos-card xos-card--gold">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.75rem",
              }}
            >
              <h3 style={{ fontWeight: 700, color: "var(--xos-text)", fontSize: "0.95rem" }}>
                {policy.label}
              </h3>
              {policy.rewardBps > 0 ? (
                <span className="xos-badge xos-badge--gold">
                  {bpsToPercent(policy.rewardBps)}% eligible
                </span>
              ) : (
                <span className="xos-badge xos-badge--slate">Varies</span>
              )}
            </div>

            <p style={{ color: "var(--xos-text-muted)", fontSize: "0.82rem", lineHeight: 1.55, marginBottom: "0.875rem" }}>
              {policy.description}
            </p>

            {/* Disclaimers */}
            <ul
              style={{
                fontSize: "0.73rem",
                color: "var(--xos-text-subtle)",
                paddingLeft: "1rem",
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {policy.disclaimers.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Master disclaimer */}
      <div className="xos-risk-box" style={{ maxWidth: 700, marginBottom: "2rem" }}>
        {REWARD_DISCLAIMER}
      </div>

      {/* CTA */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Link href="/exchange-os/launch" className="xos-btn xos-btn--primary">
          ◆ Launch a Token to Start Earning
        </Link>
        <Link href="/exchange-os/signup" className="xos-btn xos-btn--outline">
          Get Creator / Referral Access
        </Link>
      </div>
    </div>
  );
}
