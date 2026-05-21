import Link from "next/link";
import XrplDexIntelligencePanel from "@/components/exchange-os/XrplDexIntelligencePanel";

export default function XrplDexIntelligencePage() {
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
            <span style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)" }}>XRPL DEX Intelligence</span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: "1.6rem", color: "var(--xos-text)", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
            XRPL DEX Intelligence
          </h1>
          <p style={{ color: "var(--xos-text-muted)", fontSize: "0.88rem", margin: 0, lineHeight: 1.6 }}>
            Native DEX, AMM, trustline model, issuer proof requirements, and compliance notes. Read-only intelligence — TROPTIONS does not operate an exchange or custody assets on XRPL.
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem 0" }}>
        <XrplDexIntelligencePanel />
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "2rem" }}>
          <Link href="/exchange-os/control-center" className="xos-btn xos-btn--outline xos-btn--sm">← Control Center</Link>
          <Link href="/exchange-os/solana-dex-map" className="xos-btn xos-btn--outline xos-btn--sm">Solana DEX Map</Link>
        </div>
      </div>
    </div>
  );
}
