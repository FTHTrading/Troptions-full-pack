import Image from "next/image";
import Link from "next/link";
import { STABLECOIN_ISSUER_REGISTRY } from "@/content/troptions/stablecoinIssuerRegistry";

export const metadata = {
  title: "USDT Route Profile | TROPTIONS Stablecoins",
  description: "USDT route profile for TROPTIONS — live-issued gateway IOU, liquidity route management, and reserve risk controls.",
};

const record = STABLECOIN_ISSUER_REGISTRY.find((r) => r.symbol === "USDT")!;

export default function TroptionsStablecoinsUsdtPage() {
  return (
    <main className="te-page">
      <div className="te-wrap" style={{ gap: "1.5rem" }}>

        <div style={{ background: "rgba(5,46,22,0.2)", border: "1px solid rgba(22,101,52,0.45)", borderRadius: "0.65rem", padding: "0.65rem 0.9rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>✅</span>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "#86efac", lineHeight: 1.5 }}><strong>Live mainnet issuance confirmed.</strong> USDT gateway IOU is issued on XRPL + Stellar mainnet as of 2026-04-28. Heightened reserve transparency, freeze, and sanctions controls remain in force.</p>
        </div>

        <div className="te-panel" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
            <Image src="/assets/troptions/logos/usdt-iou-logo.svg" alt="USDT logo" width={72} height={72} style={{ borderRadius: "50%", border: "1px solid rgba(38,161,123,0.4)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p className="te-kicker">Tether · Multi-Chain Stablecoin</p>
              <h1 className="te-heading">USDT Route Profile</h1>
              <p className="te-subheading" style={{ marginTop: "0.4rem", maxWidth: "620px" }}>Tether USD — the world's highest-volume stablecoin — is a live-issued gateway route for liquidity-heavy settlement workflows under strict reserve and sanctions controls.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.9rem" }}>
                <span style={{ background: "#052e16", color: "#4ade80", border: "1px solid #166534", borderRadius: "0.3rem", padding: "0.15rem 0.5rem", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>Stablecoin</span>
                <span style={{ background: "#1c0a00", color: "#fb923c", border: "1px solid #7c2d12", borderRadius: "0.3rem", padding: "0.15rem 0.5rem", fontSize: "0.68rem", fontWeight: 700 }}>ELEVATED RISK MONITORING</span>
              </div>
            </div>
          </div>
        </div>

        <div className="te-panel" style={{ padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontFamily: "Georgia, serif", fontSize: "1.1rem", color: "#0f172a" }}>Route Details</h2>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {[
              { label: "Issuer", value: record.issuer },
              { label: "Asset Class", value: "Stablecoin" },
              { label: "Default Route", value: "No — secondary evaluation only" },
              { label: "Chain Support", value: record.chainSupport.join(" · ") },
              { label: "Chain Note", value: record.chainSupportNote },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", borderBottom: "1px solid rgba(15,23,42,0.08)", paddingBottom: "0.45rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                <span style={{ fontSize: "0.82rem", color: "#1e293b" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="te-grid-2">
          <div className="te-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ margin: "0 0 0.75rem", fontFamily: "Georgia, serif", fontSize: "1rem", color: "#0f172a" }}>Use Cases</h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {record.useCases.map((uc) => <li key={uc} style={{ fontSize: "0.8rem", color: "#1e293b", lineHeight: 1.45 }}>{uc}</li>)}
            </ul>
          </div>
          <div className="te-panel" style={{ padding: "1.25rem" }}>
            <h3 style={{ margin: "0 0 0.75rem", fontFamily: "Georgia, serif", fontSize: "1rem", color: "#7f1d1d" }}>Risk Controls</h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {record.riskControls.map((rc) => <li key={rc} style={{ fontSize: "0.8rem", color: "#374151", lineHeight: 1.45 }}>{rc}</li>)}
            </ul>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/troptions/stablecoins" style={{ fontSize: "0.82rem", color: "#c9a84c", fontWeight: 600, textDecoration: "none" }}>← Back to Stablecoin Rail Intelligence</Link>
        </div>

      </div>
    </main>
  );
}
