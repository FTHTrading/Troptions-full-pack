import { X402ServiceGrid } from "@/components/exchange-os/X402ServiceCard";

export const metadata = { title: "x402 Reports — TROPTIONS Exchange OS" };

export default function X402Page() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div className="xos-section-header">
        <div className="xos-gold-line" />
        <h1 className="xos-section-title">x402 AI Reports & Tools</h1>
        <p className="xos-section-subtitle">
          Pay-per-use access to AI-generated token analysis, risk reports, and launch tools.
          No subscription — pay only for what you use.
        </p>
      </div>

      {/* Explainer */}
      <div
        className="xos-card xos-card--cyan"
        style={{ marginBottom: "2rem", maxWidth: 600 }}
      >
        <h3 style={{ fontWeight: 700, color: "var(--xos-cyan)", marginBottom: "0.375rem" }}>
          What is x402?
        </h3>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
          x402 is an HTTP payment protocol. You pay a small fee per API call — like buying a
          single song instead of an album subscription. Payments settle on-chain. No account required.
        </p>
      </div>

      <X402ServiceGrid />

      <div className="xos-risk-box" style={{ marginTop: "2rem", maxWidth: 600 }}>
        x402 payments are in demo mode unless <code>X402_ENABLED=true</code> is set.
        Reports are AI-generated informational content — not financial, legal, or investment advice.
      </div>
    </div>
  );
}
