import Image from "next/image";
import Link from "next/link";
import { STABLECOIN_ISSUER_REGISTRY } from "@/content/troptions/stablecoinIssuerRegistry";

export const metadata = {
  title: "Paxos Regulated Suite | TROPTIONS Stablecoins",
  description: "Paxos Trust Company regulated stablecoin and commodity suite — PYUSD, USDP, and PAXG evaluated for TROPTIONS institutional rail readiness.",
};

const paxosTokens = [
  { symbol: "PYUSD", logo: "/assets/troptions/logos/pyusd-iou-logo.svg", subPage: "/troptions/stablecoins/pyusd", tagColor: "#0062CC", tagLabel: "PayPal-Linked Dollar" },
  { symbol: "USDP",  logo: "/assets/troptions/logos/usdp-iou-logo.svg",  subPage: "/troptions/stablecoins/usdp",  tagColor: "#007D6C", tagLabel: "Regulated Dollar" },
  { symbol: "PAXG",  logo: "/assets/troptions/logos/paxg-iou-logo.svg",  subPage: "/troptions/stablecoins/paxg",  tagColor: "#9C7C00", tagLabel: "Gold-Backed · 1 oz" },
];

export default function TroptionsStablecoinsPaxosPage() {
  return (
    <main className="te-page">
      <div className="te-wrap" style={{ gap: "1.5rem" }}>

        <div style={{ background: "rgba(127,29,29,0.18)", border: "1px solid rgba(127,29,29,0.5)", borderRadius: "0.65rem", padding: "0.65rem 0.9rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠</span>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "#fca5a5", lineHeight: 1.5 }}><strong>Simulation Only.</strong> All Paxos rails are evaluated under monitoring and readiness controls. No live custody or transfer is active without full issuer and jurisdiction clearance.</p>
        </div>

        {/* Hero */}
        <div className="te-panel" style={{ padding: "1.75rem" }}>
          <p className="te-kicker">Paxos Trust Company · NYDFS-Regulated</p>
          <h1 className="te-heading">Paxos Regulated Suite</h1>
          <p className="te-subheading" style={{ marginTop: "0.4rem", maxWidth: "650px" }}>Paxos Trust Company issues three regulated digital assets — PYUSD (PayPal USD), USDP (Paxos Dollar), and PAXG (PAX Gold) — under NYDFS oversight. TROPTIONS monitors all three for institutional rail readiness, reserve alignment, and settlement feasibility.</p>
        </div>

        {/* Token cards */}
        <div className="te-grid-3">
          {paxosTokens.map(({ symbol, logo, subPage, tagColor, tagLabel }) => {
            const r = STABLECOIN_ISSUER_REGISTRY.find((x) => x.symbol === symbol)!;
            return (
              <div key={symbol} className="te-panel" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <Image src={logo} alt={`${symbol} logo`} width={52} height={52} style={{ borderRadius: "50%", border: `1px solid ${tagColor}50`, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#0f172a" }}>{symbol}</p>
                    <span style={{ background: tagColor, color: "#fff", borderRadius: "0.25rem", padding: "0.1rem 0.4rem", fontSize: "0.62rem", fontWeight: 700 }}>{tagLabel}</span>
                  </div>
                </div>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.76rem", color: "#374151" }}>Issuer: {r.issuer}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.65rem" }}>
                  {r.chainSupport.map((c) => <span key={c} style={{ background: "#1e293b", color: "#cbd5e1", borderRadius: "99px", padding: "0.1rem 0.45rem", fontSize: "0.65rem", fontWeight: 600 }}>{c}</span>)}
                </div>
                <Link href={subPage} style={{ display: "inline-block", fontSize: "0.78rem", color: "#92400e", fontWeight: 700, textDecoration: "none", background: "rgba(201,154,60,0.1)", border: "1px solid rgba(201,154,60,0.3)", borderRadius: "0.35rem", padding: "0.25rem 0.65rem", marginTop: "0.2rem" }}>Full Profile →</Link>
              </div>
            );
          })}
        </div>

        {/* Paxos overview table */}
        <div className="te-panel" style={{ padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontFamily: "Georgia, serif", fontSize: "1.1rem", color: "#0f172a" }}>Paxos Suite Comparison</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ background: "rgba(11,31,54,0.95)", color: "#f0cf82" }}>
                  {["Token", "Category", "Backing", "Chains", "Default Route"].map((h) => (
                    <th key={h} style={{ padding: "0.55rem 0.75rem", textAlign: "left", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { token: "PYUSD", cat: "Stablecoin", backing: "1:1 USD", chains: "Ethereum, Solana", route: "No" },
                  { token: "USDP",  cat: "Stablecoin", backing: "1:1 USD", chains: "Ethereum",         route: "No" },
                  { token: "PAXG",  cat: "Commodity",  backing: "1 oz LBMA Gold", chains: "Ethereum",  route: "No" },
                ].map((row, i) => (
                  <tr key={row.token} style={{ background: i % 2 === 0 ? "rgba(248,245,240,0.8)" : "rgba(255,255,255,0.95)", borderBottom: "1px solid rgba(15,23,42,0.09)" }}>
                    <td style={{ padding: "0.55rem 0.75rem", fontWeight: 700, color: "#0f172a" }}>{row.token}</td>
                    <td style={{ padding: "0.55rem 0.75rem", color: "#374151" }}>{row.cat}</td>
                    <td style={{ padding: "0.55rem 0.75rem", color: "#374151" }}>{row.backing}</td>
                    <td style={{ padding: "0.55rem 0.75rem", color: "#374151" }}>{row.chains}</td>
                    <td style={{ padding: "0.55rem 0.75rem", color: row.route === "Yes" ? "#166534" : "#374151", fontWeight: row.route === "Yes" ? 700 : 400 }}>{row.route}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/troptions/stablecoins" style={{ fontSize: "0.82rem", color: "#c9a84c", fontWeight: 600, textDecoration: "none" }}>← Back to Stablecoin Rail Intelligence</Link>
        </div>

      </div>
    </main>
  );
}
