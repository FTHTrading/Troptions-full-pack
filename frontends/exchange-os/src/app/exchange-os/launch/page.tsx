import { LaunchWizard } from "@/components/exchange-os/LaunchWizard";

export const metadata = { title: "Launch a Token — TROPTIONS Exchange OS" };

export default function LaunchPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div className="xos-section-header">
        <div className="xos-gold-line" />
        <h1 className="xos-section-title">Launch a Token on XRPL</h1>
        <p className="xos-section-subtitle">
          The right launch: verify issuer → add liquidity → activate x402 reports → route rewards → publish proof packet.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr minmax(0, 320px)",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <LaunchWizard />

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="xos-card">
            <h3 style={{ fontWeight: 700, color: "var(--xos-gold)", marginBottom: "0.625rem", fontSize: "0.95rem" }}>
              What You Get
            </h3>
            <ul
              style={{
                color: "var(--xos-text-muted)",
                fontSize: "0.82rem",
                lineHeight: 1.8,
                paddingLeft: "1rem",
                margin: 0,
              }}
            >
              <li>Unsigned AccountSet transaction for token settings</li>
              <li>Optional AMMCreate transaction for liquidity</li>
              <li>x402 risk report and AI token page</li>
              <li>Proof packet with verifiable launch details</li>
              <li>Creator reward routing from platform fee share</li>
            </ul>
          </div>

          <div className="xos-card">
            <h3 style={{ fontWeight: 700, color: "var(--xos-text)", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              Key Concepts
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
                fontSize: "0.8rem",
                color: "var(--xos-text-muted)",
              }}
            >
              {[
                { term: "Issuer", def: "The wallet that created this token." },
                { term: "Trustline", def: "Permission for a wallet to hold this token." },
                { term: "AMM", def: "A pool that lets people swap between two assets." },
                { term: "Proof Packet", def: "A verifiable document proving your launch details." },
                { term: "x402", def: "Pay-per-use access for premium reports and AI tools." },
              ].map(({ term, def }) => (
                <div key={term}>
                  <span style={{ color: "var(--xos-cyan)", fontWeight: 600 }}>{term}:</span> {def}
                </div>
              ))}
            </div>
          </div>

          <div className="xos-risk-box">
            New token launches carry significant risk. All launch packets are unsigned — your wallet signs and submits.
            Not investment advice. TROPTIONS makes no guarantees about token value or trading volume.
          </div>
        </div>
      </div>
    </div>
  );
}
