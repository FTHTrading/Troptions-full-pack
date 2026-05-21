// TROPTIONS Exchange OS — Creator Dashboard Page

import { EarnCard } from "@/components/exchange-os/EarnCard";
import { ProofPacketPanel } from "@/components/exchange-os/ProofPacketPanel";
import { REWARD_POLICIES } from "@/lib/exchange-os/rewards/rewardPolicy";
import { REWARD_DISCLAIMER } from "@/lib/exchange-os/rewards/types";
import Link from "next/link";

export const metadata = { title: "Creator Dashboard — TROPTIONS Exchange OS" };

const CREATOR_POLICIES = REWARD_POLICIES.filter((p) =>
  ["creator", "referral", "liquidity"].includes(p.category)
);

export default function CreatorPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div className="xos-gold-line" />
      <h1 className="xos-section-title">Creator Dashboard</h1>
      <p className="xos-section-subtitle">
        Track eligible rewards, generate proof packets, and manage your token launch resources.
      </p>

      {/* Reward policy cards */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ color: "var(--xos-text)", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>
          Your Reward Policies
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {CREATOR_POLICIES.map((policy) => (
            <EarnCard key={policy.category} policy={policy} showCta={false} />
          ))}
        </div>
        <div className="xos-risk-box" style={{ marginTop: "1rem" }}>
          {REWARD_DISCLAIMER}
        </div>
      </section>

      {/* Proof packet generator */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ color: "var(--xos-text)", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>
          Generate Proof Packet
        </h2>
        <ProofPacketPanel />
      </section>

      {/* Quick links */}
      <section>
        <h2 style={{ color: "var(--xos-text)", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>
          Creator Resources
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.875rem" }}>
          {[
            { label: "Launch a Token", href: "/exchange-os/launch", icon: "◆", accent: "gold" },
            { label: "View Token Registry", href: "/exchange-os/tokens", icon: "⬡", accent: "cyan" },
            { label: "x402 Premium Reports", href: "/exchange-os/x402", icon: "⚡", accent: "cyan" },
            { label: "Earn Overview", href: "/exchange-os/earn", icon: "★", accent: "green" },
            { label: "Partner Packages", href: "/exchange-os/signup", icon: "◈", accent: "gold" },
            { label: "Trade / Swap", href: "/exchange-os/trade", icon: "⇄", accent: "cyan" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`xos-card xos-card--${link.accent}`}
              style={{ padding: "1rem", display: "flex", gap: "0.75rem", alignItems: "center", textDecoration: "none", fontWeight: 700, color: "var(--xos-text)", fontSize: "0.875rem" }}
            >
              <span style={{ color: `var(--xos-${link.accent})`, fontSize: "1.2rem" }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
