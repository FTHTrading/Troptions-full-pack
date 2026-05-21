import Link from "next/link";
import { SolanaWizardLoader } from "@/components/exchange-os/SolanaWizardLoader";

export const metadata = { title: "Solana Token Launch — TROPTIONS Exchange OS" };

export default function SolanaPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="xos-gold-line" />
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #9945FF, #14F195)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            ◎
          </div>
          <h1 className="xos-section-title" style={{ margin: 0 }}>
            Solana Token Launcher
          </h1>
        </div>
        <p className="xos-section-subtitle">
          Deploy a custom SPL token on Solana in minutes — no code required.
          Supports Phantom, Solflare, and Backpack wallets.
        </p>
      </div>

      {/* Feature pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        {[
          "⚡ Instant Deployment",
          "◎ SPL Token Standard",
          "🔒 Revoke Authorities",
          "🌐 Mainnet & Devnet",
          "🎨 Custom Metadata",
          "0 Code Required",
        ].map((f) => (
          <span
            key={f}
            style={{
              padding: "0.25rem 0.75rem",
              background: "var(--xos-surface-2)",
              border: "1px solid var(--xos-border-1)",
              borderRadius: 999,
              fontSize: "0.72rem",
              color: "var(--xos-text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Wizard */}
      <SolanaWizardLoader />

      {/* Info boxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "2.5rem",
        }}
      >
        {[
          {
            icon: "◎",
            title: "SPL Token Standard",
            body: "All tokens are Solana Program Library (SPL) tokens, compatible with every Solana DEX and wallet.",
          },
          {
            icon: "🔒",
            title: "Client-Side Security",
            body: "Your private keys never leave your browser. All transactions are signed locally in your wallet extension.",
          },
          {
            icon: "⚡",
            title: "Also on XRPL",
            body: "Prefer the XRP Ledger? Use our XRPL token launchpad to create tokens with on-ledger AMM liquidity.",
            link: "/exchange-os/launch",
            linkLabel: "XRPL Launch →",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="xos-card"
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div style={{ fontSize: "1.5rem" }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--xos-text)" }}>
              {item.title}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)", lineHeight: 1.5 }}>
              {item.body}
            </div>
            {item.link && (
              <Link
                href={item.link}
                style={{
                  fontSize: "0.72rem",
                  color: "var(--xos-gold)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                {item.linkLabel}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="xos-risk-box" style={{ marginTop: "2rem", fontSize: "0.75rem" }}>
        Blockchain transactions are irreversible. Test on Devnet first. TROPTIONS Exchange OS
        is not responsible for tokens deployed through this wizard. Always verify smart contract
        behavior before revoking authorities.
      </div>
    </div>
  );
}
