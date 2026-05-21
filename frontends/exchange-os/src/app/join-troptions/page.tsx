import Link from "next/link";
import "@/styles/troptions-wallet.css";

export default function JoinTroptionsPage() {
  return (
    <main className="wallet-layout">
      <div className="mx-auto max-w-md">
        <div className="wallet-card">
          <div className="card-body">
            <h1 className="wallet-title">Join Troptions</h1>
            <p className="wallet-subtitle">
              Welcome to the Troptions Genesis Wallet program. To create a wallet, you&apos;ll need an invitation code from
              our team.
            </p>

            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Link
                href="/join-troptions/invite"
                className="wallet-button button-primary button-full"
                style={{ textAlign: "center", textDecoration: "none" }}
              >
                Enter Invite Code
              </Link>

              <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--wallet-muted)", margin: 0 }}>
                Don&apos;t have an invite? Contact our team at{" "}
                <a href="mailto:invites@troptions.org" style={{ color: "var(--wallet-gold)" }}>
                  invites@troptions.org
                </a>
              </p>
            </div>

            <div style={{ marginTop: "2rem", padding: "1rem", background: "var(--wallet-navy)/5%", borderRadius: "0.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--wallet-ink)", marginTop: 0 }}>
                About Genesis Wallets
              </h3>
              <ul style={{ fontSize: "0.9rem", color: "var(--wallet-ink)", lineHeight: "1.6", margin: "0.5rem 0 0 0" }}>
                <li>✓ Simulation mode (no real funds)</li>
                <li>✓ Multi-chain ready (XRPL, Stellar, Solana, more)</li>
                <li>✓ x402 payment network access</li>
                <li>✓ Provider & custody gated</li>
                <li>✓ Compliance first</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
