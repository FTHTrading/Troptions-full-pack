// TROPTIONS Exchange OS — Sponsor Hub Page

import { SponsorCampaignBuilder } from "@/components/exchange-os/SponsorCampaignBuilder";
import { REWARD_POLICIES } from "@/lib/exchange-os/rewards/rewardPolicy";
import { bpsToPercent } from "@/config/exchange-os/fees";
import Link from "next/link";

export const metadata = { title: "Sponsor Hub — TROPTIONS Exchange OS" };

const sponsorPolicy = REWARD_POLICIES.find((p) => p.category === "sponsor");

export default function SponsorPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div className="xos-gold-line" />
      <h1 className="xos-section-title">Sponsor Hub</h1>
      <p className="xos-section-subtitle">
        Create offers for token holders, event attendees, and the TROPTIONS community.
        Earn up to {sponsorPolicy ? bpsToPercent(sponsorPolicy.rewardBps) : 15}% in sponsor reward sharing.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "flex-start" }}>
        <SponsorCampaignBuilder />

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Sponsor reward policy */}
          {sponsorPolicy && (
            <div className="xos-card xos-card--gold" style={{ padding: "1.25rem" }}>
              <div style={{ fontWeight: 700, color: "var(--xos-gold)", marginBottom: "0.5rem" }}>◈ Sponsor Reward Policy</div>
              <div style={{ fontFamily: "var(--xos-font-mono)", fontWeight: 900, fontSize: "1.75rem", color: "var(--xos-gold)", marginBottom: "0.5rem" }}>
                {bpsToPercent(sponsorPolicy.rewardBps)}%
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--xos-text-muted)", margin: 0, lineHeight: 1.5 }}>
                {sponsorPolicy.description}
              </p>
              {sponsorPolicy.disclaimers[0] && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "var(--xos-text-subtle)", background: "rgba(0,0,0,0.2)", padding: "0.5rem 0.75rem", borderRadius: 6 }}>
                  {sponsorPolicy.disclaimers[0]}
                </div>
              )}
            </div>
          )}

          {/* Campaign types */}
          <div className="xos-card" style={{ padding: "1.25rem" }}>
            <div style={{ fontWeight: 700, color: "var(--xos-text)", marginBottom: "0.75rem" }}>Campaign Types</div>
            <ul style={{ margin: 0, padding: "0 0 0 1.25rem", color: "var(--xos-text-muted)", fontSize: "0.82rem", lineHeight: 1.8 }}>
              <li>Discount offers for TROPTIONS holders</li>
              <li>Event sponsor perks and attendance rewards</li>
              <li>Merchant rebates settled on XRPL</li>
              <li>API partner access campaigns</li>
              <li>Community reward programs</li>
            </ul>
          </div>

          <div className="xos-risk-box">
            Sponsor campaigns are subject to TROPTIONS platform review.
            Estimated rewards are not guaranteed — actual payouts depend on verified campaign performance.
          </div>

          <Link href="/exchange-os/signup" className="xos-btn xos-btn--primary" style={{ textAlign: "center" }}>
            View Partner Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
