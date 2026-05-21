import Image from "next/image";
import Link from "next/link";
import { STABLECOIN_ISSUER_REGISTRY } from "@/content/troptions/stablecoinIssuerRegistry";

export const metadata = {
  title: "PAXG Gold Reference Rail | TROPTIONS Stablecoins",
  description: "PAXG institutional reference — gold-backed Paxos token evaluated for reserve comparison, custody review, and commodity classification.",
};

const record = STABLECOIN_ISSUER_REGISTRY.find((r) => r.symbol === "PAXG")!;

export default function TroptionsStablecoinsPaxgPage() {
  return (
    <main className="te-page">
      <div className="te-wrap" style={{ gap: "1.5rem" }}>

        <div style={{ background: "rgba(127,29,29,0.18)", border: "1px solid rgba(127,29,29,0.5)", borderRadius: "0.65rem", padding: "0.65rem 0.9rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠</span>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "#fca5a5", lineHeight: 1.5 }}><strong>Simulation Only.</strong> PAXG is used as a gold-linked reference for reserve and proof comparison. No live custody, redemption, or transfer function is active.</p>
        </div>

        <div className="te-panel" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
            <Image src="/assets/troptions/logos/paxg-iou-logo.svg" alt="PAXG logo" width={72} height={72} style={{ borderRadius: "50%", border: "1px solid rgba(212,175,55,0.5)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p className="te-kicker">Paxos Trust Company · Gold-Backed Token</p>
              <h1 className="te-heading">PAXG Reference Rail</h1>
              <p className="te-subheading" style={{ marginTop: "0.4rem", maxWidth: "620px" }}>PAX Gold (PAXG) represents one troy ounce of LBMA-grade gold per token, issued by Paxos Trust Company. Used by TROPTIONS for reserve comparison and gold-linked scenario modeling.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.9rem" }}>
                <span style={{ background: "#1c1003", color: "#fbbf24", border: "1px solid #92400e", borderRadius: "0.3rem", padding: "0.15rem 0.5rem", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>Commodity</span>
                <span style={{ background: "#0D0E00", color: "#D4AF37", border: "1px solid #9C7C00", borderRadius: "0.3rem", padding: "0.15rem 0.5rem", fontSize: "0.68rem", fontWeight: 700 }}>GOLD-BACKED · 1 OZ / TOKEN</span>
              </div>
            </div>
          </div>
        </div>

        <div className="te-panel" style={{ padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontFamily: "Georgia, serif", fontSize: "1.1rem", color: "#0f172a" }}>Route Details</h2>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {[
              { label: "Issuer", value: record.issuer },
              { label: "Asset Class", value: "Commodity (Gold)" },
              { label: "Backing", value: "1 troy oz LBMA gold per token" },
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
          <Link href="/troptions/stablecoins/paxos" style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 600, textDecoration: "none" }}>View Full Paxos Suite →</Link>
        </div>

      </div>
    </main>
  );
}
