// TROPTIONS Exchange OS — Create Wallet Page

import { WalletCreateWizard } from "@/components/exchange-os/WalletCreateWizard";

export const metadata = {
  title: "Create Wallet — TROPTIONS Exchange OS",
  description: "Create a free XRP, Stellar, or Solana wallet in under 2 minutes. No app download, no technical knowledge required.",
};

export default function CreateWalletPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div className="xos-gold-line" />

      <div style={{ marginBottom: "2rem" }}>
        <h1 className="xos-section-title">Create a Free Wallet</h1>
        <p className="xos-section-subtitle">
          Generate a secure XRP Ledger, Stellar, or Solana wallet right here — no app download or
          technical knowledge needed. Your keys are created in your browser and encrypted with your
          own password.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
            margin: "1.25rem 0",
          }}
        >
          {[
            { icon: "🔒", text: "Keys never leave your browser" },
            { icon: "⚡", text: "Ready in 2 minutes" },
            { icon: "🆓", text: "Completely free" },
          ].map((item) => (
            <div
              key={item.text}
              className="xos-card"
              style={{
                padding: "0.75rem",
                textAlign: "center",
                fontSize: "0.78rem",
                color: "var(--xos-text-muted)",
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontSize: "1.25rem", marginBottom: "0.3rem" }}>{item.icon}</div>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <WalletCreateWizard />
    </div>
  );
}
