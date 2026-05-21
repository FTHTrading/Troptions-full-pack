// TROPTIONS Exchange OS — Admin Overview Page

import { AdminMetricCard } from "@/components/exchange-os/AdminMetricCard";
import { DEMO_ADMIN_METRICS } from "@/config/exchange-os/demoData";
import { features } from "@/config/exchange-os/features";
import Link from "next/link";

export const metadata = { title: "Admin — TROPTIONS Exchange OS" };

export default function AdminPage() {
  const m = DEMO_ADMIN_METRICS;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div className="xos-gold-line" />
      <h1 className="xos-section-title">Platform Overview</h1>
      <p className="xos-section-subtitle">
        Exchange OS operational metrics. All values are demo data until production env vars are configured.
      </p>

      {m.demoMode && (
        <div style={{ background: "rgba(201,162,74,0.12)", border: "1px solid var(--xos-gold)", borderRadius: 8, padding: "0.875rem 1.25rem", marginBottom: "1.75rem", fontSize: "0.82rem", color: "var(--xos-gold)" }}>
          ⚠ <strong>Demo Mode</strong> — Set <code>XRPL_MAINNET_ENABLED=true</code> and{" "}
          <code>X402_ENABLED=true</code> to activate production metrics.
        </div>
      )}

      {/* Core metrics */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "var(--xos-text)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
          Core Activity
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.875rem" }}>
          <AdminMetricCard label="Total Swaps" value={m.totalSwaps} icon="⇄" accent="cyan" />
          <AdminMetricCard label="Token Launches" value={m.tokenLaunches} icon="◆" accent="gold" />
          <AdminMetricCard label="Active Tokens" value={m.activeTokens} icon="⬡" accent="cyan" />
          <AdminMetricCard label="AMM Pools" value={m.ammPoolsTracked} icon="◈" accent="green" />
          <AdminMetricCard label="Wallet Connects" value={m.walletConnects} icon="◇" />
          <AdminMetricCard label="Proof Packets" value={m.proofPacketsGenerated} icon="✓" accent="green" />
        </div>
      </section>

      {/* x402 metrics */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "var(--xos-text)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
          x402 Revenue Rail {!features.x402Enabled && <span className="xos-badge xos-badge--slate" style={{ marginLeft: 8 }}>Disabled</span>}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.875rem" }}>
          <AdminMetricCard label="API Calls" value={m.x402ApiCalls} icon="⚡" accent="cyan" />
          <AdminMetricCard label="Paid Unlocks" value={m.x402PaidUnlocks} icon="⚡" accent="gold" note="Completed x402 purchases" />
          <AdminMetricCard label="Sponsor Offers" value={m.sponsorOffers} icon="◈" accent="gold" />
        </div>
      </section>

      {/* Rewards metrics */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "var(--xos-text)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
          Reward Distribution
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.875rem" }}>
          <AdminMetricCard label="Creator Rewards" value={m.creatorRewards} icon="◆" accent="gold" note="Estimated eligible" />
          <AdminMetricCard label="Referral Rewards" value={m.referralRewards} icon="⟳" accent="cyan" note="Estimated eligible" />
          <AdminMetricCard label="Risk Flags" value={m.riskFlags} icon="⚠" accent="slate" note="Risk labels triggered" />
          <AdminMetricCard label="Total Creators" value={m.totalCreators} icon="★" accent="green" />
        </div>
      </section>

      {/* Feature flags */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "var(--xos-text)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
          Feature Flags
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {Object.entries(features).map(([key, value]) => (
            <span key={key} className={`xos-badge xos-badge--${value ? "green" : "slate"}`}>
              {key}: {value ? "ON" : "OFF"}
            </span>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/exchange-os/tokens" className="xos-btn xos-btn--outline">Token Registry</Link>
        <Link href="/exchange-os/x402" className="xos-btn xos-btn--outline">x402 Services</Link>
        <Link href="/exchange-os/earn" className="xos-btn xos-btn--outline">Reward Policies</Link>
        <Link href="/exchange-os/deck" className="xos-btn xos-btn--ghost">Sales Deck</Link>
      </div>
    </div>
  );
}
