import Link from "next/link";
import MarketMonitoringPanel from "@/components/exchange-os/MarketMonitoringPanel";
import NonCustodialRouteArchitecture from "@/components/exchange-os/NonCustodialRouteArchitecture";

export default function MarketMonitoringPage() {
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
            <span style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)" }}>Market Monitoring</span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: "1.6rem", color: "var(--xos-text)", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
            Market Monitoring & Alerting
          </h1>
          <p style={{ color: "var(--xos-text-muted)", fontSize: "0.88rem", margin: 0, lineHeight: 1.6 }}>
            Read-only monitoring for LP activity, authority changes, whale transfers, wash-like patterns, and oracle deviation. TROPTIONS cannot freeze or pause on-chain state — monitoring is investigative only.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem 0" }}>
        <MarketMonitoringPanel />

        <div style={{ marginTop: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ width: 3, height: 16, background: "var(--xos-green)", borderRadius: 2 }} />
            <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--xos-text)", margin: 0 }}>
              Non-Custodial Route Architecture
            </h2>
          </div>
          <NonCustodialRouteArchitecture />
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "2rem" }}>
          <Link href="/exchange-os/control-center" className="xos-btn xos-btn--outline xos-btn--sm">← Control Center</Link>
          <Link href="/exchange-os/readiness" className="xos-btn xos-btn--outline xos-btn--sm">Readiness Check</Link>
        </div>
      </div>
    </div>
  );
}
