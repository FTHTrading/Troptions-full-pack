import Link from "next/link";
import "@/styles/troptions-wallet.css";

export default function SuccessPage() {
  return (
    <main className="wallet-layout">
      <div className="mx-auto max-w-md">
        <div className="wallet-card success-card">
          <div className="card-body">
            <h1 className="wallet-title" style={{ color: "var(--wallet-success)" }}>
              ✓ Wallet Created
            </h1>
            <p className="wallet-subtitle">Your Troptions Genesis Wallet is now ready in simulation mode.</p>

            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "1rem", background: "var(--wallet-info)/10%", borderLeft: "3px solid var(--wallet-info)", borderRadius: "0.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--wallet-ink)", marginTop: 0 }}>
                  Next Steps
                </h3>
                <ol style={{ fontSize: "0.9rem", color: "var(--wallet-ink)", lineHeight: "1.8", margin: 0, paddingLeft: "1.5rem" }}>
                  <li>View your QR profile code</li>
                  <li>Complete KYC verification</li>
                  <li>Pass sanctions screening</li>
                  <li>Request funding approval</li>
                  <li>Enable chain integrations</li>
                </ol>
              </div>

              <Link
                href="/join-troptions/qr"
                className="wallet-button button-primary button-full"
                style={{ textAlign: "center", textDecoration: "none" }}
              >
                View Your QR Code
              </Link>

              <Link
                href="/portal/troptions/wallet/dashboard"
                className="wallet-button button-secondary button-full"
                style={{ textAlign: "center", textDecoration: "none" }}
              >
                Go to Dashboard
              </Link>
            </div>

            <div style={{ marginTop: "2rem", padding: "1rem", background: "var(--wallet-navy)/5%", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--wallet-ink)", lineHeight: "1.6" }}>
              <p style={{ marginTop: 0 }}>
                <strong>Important:</strong> This wallet is in simulation mode. No real funds exist. Live funding,
                transactions, and settlement require provider approval, compliance review, and custody verification.
              </p>
              <p style={{ marginBottom: 0 }}>All activity is logged and audited per regulatory requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
