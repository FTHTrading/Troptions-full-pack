import Link from "next/link";

export const metadata = { title: "Fees — TROPTIONS Live DEX" };

const FEE_ROWS = [
  { action: "View order book", fee: "Free", notes: "Read-only XRPL query" },
  { action: "Get swap quote (pathfinding)", fee: "Free", notes: "Read-only XRPL pathfinding" },
  { action: "Trade (XRPL OfferCreate)", fee: "XRPL network fee only", notes: "Typically 0.000012 XRP. Set by XRPL validators." },
  { action: "AMM swap (XRPL Payment)", fee: "XRPL network fee + AMM pool fee", notes: "AMM pool fee is typically 0.3–0.5% of swap amount, paid to LPs." },
  { action: "Launch token (issuer setup)", fee: "XRPL transaction fees only", notes: "AccountSet, TrustSet, OfferCreate. Typically < 0.001 XRP total." },
  { action: "AMM pool creation", fee: "XRPL AMMCreate fee", notes: "Requires minimum XRP deposit set by XRPL governance." },
  { action: "Proof packet generation", fee: "Free (basic)", notes: "On-chain events only. Premium audit report via x402." },
  { action: "x402 token risk report", fee: "Per request (ATP)", notes: "See /exchange-os/x402 for current pricing." },
  { action: "x402 launch readiness check", fee: "Per request (ATP)", notes: "AI-powered issuer and liquidity audit." },
  { action: "Wallet connect / signing", fee: "Free", notes: "TROPTIONS never charges for wallet operations." },
];

export default function FeesPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/exchange-os" style={{ fontSize: "0.78rem", color: "var(--xos-gold)", textDecoration: "none" }}>← DEX Home</Link>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div className="xos-gold-line" style={{ marginBottom: "0.75rem" }} />
        <h1 style={{ fontWeight: 900, fontSize: "1.8rem", color: "var(--xos-text)", marginBottom: "0.5rem" }}>Fee Structure</h1>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>
          TROPTIONS does not charge platform trading fees. You pay only XRPL network transaction fees
          and, where applicable, XRPL AMM pool fees paid directly to liquidity providers.
          Premium intelligence via x402 is priced per request.
        </p>
      </div>

      <div className="xos-card" style={{ padding: 0, overflow: "hidden", marginBottom: "2rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ background: "var(--xos-surface-1)", borderBottom: "1px solid var(--xos-border)" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: "var(--xos-text-muted)", fontWeight: 600 }}>Action</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: "var(--xos-gold)", fontWeight: 600 }}>Fee</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: "var(--xos-text-muted)", fontWeight: 600 }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {FEE_ROWS.map((row, i) => (
              <tr
                key={row.action}
                style={{ borderBottom: i < FEE_ROWS.length - 1 ? "1px solid var(--xos-border)" : "none" }}
              >
                <td style={{ padding: "0.7rem 1rem", color: "var(--xos-text)" }}>{row.action}</td>
                <td style={{ padding: "0.7rem 1rem", color: row.fee === "Free" ? "var(--xos-green)" : "var(--xos-cyan)", fontWeight: 600, whiteSpace: "nowrap" }}>{row.fee}</td>
                <td style={{ padding: "0.7rem 1rem", color: "var(--xos-text-muted)" }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="xos-card" style={{ padding: "1.1rem 1.25rem", marginBottom: "1rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--xos-gold)", marginBottom: "0.4rem" }}>XRPL Account Reserve</div>
        <p style={{ fontSize: "0.82rem", color: "var(--xos-text-muted)", lineHeight: 1.65, margin: 0 }}>
          All XRPL accounts must maintain a <strong style={{ color: "var(--xos-text)" }}>1 XRP base reserve</strong> and{" "}
          <strong style={{ color: "var(--xos-text)" }}>0.2 XRP per owned object</strong> (trustlines, offers, AMM LP tokens).
          These are XRPL network requirements, not TROPTIONS fees, and are subject to change by XRPL governance.
        </p>
      </div>

      <div className="xos-risk-box">
        All fee figures are accurate as of the current XRPL mainnet fee schedule.
        XRPL network fees may vary based on network load. Nothing here constitutes financial advice.
      </div>
    </div>
  );
}
