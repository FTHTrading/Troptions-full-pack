import Link from "next/link";
import PartnerOnboardingPipeline from "@/components/exchange-os/PartnerOnboardingPipeline";
import LaunchCommitteeControlPanel from "@/components/exchange-os/LaunchCommitteeControlPanel";

export default function PartnerOnboardingPage() {
  return (
    <div style={{ padding: "0 0 4rem" }}>
      <div
        style={{
          borderBottom: "1px solid var(--xos-border)",
          background: "var(--xos-surface)",
          padding: "2rem 1.5rem 1.75rem",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <Link href="/exchange-os/control-center" style={{ fontSize: "0.75rem", color: "var(--xos-text-subtle)", textDecoration: "none" }}>
              Control Center
            </Link>
            <span style={{ color: "var(--xos-text-subtle)", fontSize: "0.75rem" }}>/</span>
            <span style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)" }}>Partner Onboarding</span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: "1.6rem", color: "var(--xos-text)", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
            Partner Onboarding Pipeline
          </h1>
          <p style={{ color: "var(--xos-text-muted)", fontSize: "0.88rem", margin: 0, lineHeight: 1.6 }}>
            All partner tokens must complete 12 onboarding stages before any public launch claim. No shortcuts — TROPTIONS does not bypass legal, KYC/AML, or committee review.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem 0" }}>
        <PartnerOnboardingPipeline />

        <div style={{ marginTop: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ width: 3, height: 16, background: "var(--xos-gold)", borderRadius: 2 }} />
            <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--xos-text)", margin: 0 }}>
              Launch Committee Controls
            </h2>
          </div>
          <LaunchCommitteeControlPanel />
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "2rem" }}>
          <Link href="/exchange-os/control-center" className="xos-btn xos-btn--outline xos-btn--sm">← Control Center</Link>
          <Link href="/exchange-os/token-proof-packet" className="xos-btn xos-btn--outline xos-btn--sm">Proof Packet</Link>
        </div>
      </div>
    </div>
  );
}
