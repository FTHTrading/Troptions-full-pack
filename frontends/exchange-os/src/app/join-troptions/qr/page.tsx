import { WalletQrCodeDisplay } from "@/components/troptions-wallet/WalletQrCodeDisplay";
import { getQrCodeByHandle } from "@/content/troptions/walletQrRegistry";
import "@/styles/troptions-wallet.css";

export default function QrCodePage() {
  const qr = getQrCodeByHandle("kevan.troptions"); // In production, get from user context

  if (!qr) {
    return (
      <main className="wallet-layout">
        <div className="mx-auto max-w-md">
          <div className="wallet-card">
            <div className="card-body">
              <p>QR code not found. Please try again or contact support.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wallet-layout">
      <div className="mx-auto max-w-2xl">
        <WalletQrCodeDisplay qrCode={qr} />
        
        <div style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--wallet-warning)/10%", border: "1px solid var(--wallet-border)", borderRadius: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--wallet-ink)", marginTop: 0 }}>
            Security Notice
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--wallet-ink)", lineHeight: "1.6" }}>
            Your Troptions Genesis Wallet profile is created in simulation mode. QR codes identify wallet profiles
            only and do not contain:
          </p>
          <ul style={{ fontSize: "0.9rem", color: "var(--wallet-ink)", lineHeight: "1.8", marginBottom: 0 }}>
            <li>Private keys</li>
            <li>Seed phrases</li>
            <li>Passwords</li>
            <li>Spend authority</li>
            <li>Account authentication credentials</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
