// TROPTIONS Exchange OS — Wallet Page

import { MyWallets } from "@/components/exchange-os/MyWallets";
import { WalletAnalyticsPanel } from "@/components/exchange-os/WalletAnalyticsPanel";
import { TrustlineWarning } from "@/components/exchange-os/TrustlineWarning";
import { xrplConfig } from "@/config/exchange-os/xrpl";

export const metadata = { title: "Wallet — TROPTIONS Exchange OS" };

export default function WalletPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "3rem" }}>

      {/* ── My Wallets (vault) ── */}
      <section>
        <div className="xos-gold-line" />
        <MyWallets />
      </section>

      {/* ── XRPL Lookup ── */}
      <section>
        <div style={{ borderTop: "1px solid var(--xos-border)", paddingTop: "2rem" }}>
          <h2 className="xos-section-title" style={{ fontSize: "1.2rem" }}>XRPL Wallet Lookup</h2>
          <p className="xos-section-subtitle">
            Look up any XRPL wallet — read-only. View XRP balance, trustlines, and TROPTIONS holdings.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <WalletAnalyticsPanel />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="xos-card" style={{ padding: "1.25rem" }}>
                <div style={{ fontWeight: 700, color: "var(--xos-gold)", marginBottom: "0.75rem" }}>◆ How Wallet Lookup Works</div>
                <ul style={{ margin: 0, padding: "0 0 0 1.25rem", color: "var(--xos-text-muted)", fontSize: "0.82rem", lineHeight: 1.7 }}>
                  <li>No wallet connection required</li>
                  <li>All reads use the XRPL public WebSocket API</li>
                  <li>Only public on-chain data is shown</li>
                  <li>TROPTIONS never stores your address</li>
                  <li>Trustlines show which tokens your wallet can hold</li>
                </ul>
              </div>

              <TrustlineWarning
                currency="TROPTIONS"
                issuer={xrplConfig.troptionsIssuer}
              />

              <div className="xos-card" style={{ padding: "1.25rem" }}>
                <div style={{ fontWeight: 700, color: "var(--xos-cyan)", marginBottom: "0.5rem" }}>XRPL Account Reserve</div>
                <p style={{ fontSize: "0.8rem", color: "var(--xos-text-muted)", margin: 0, lineHeight: 1.5 }}>
                  XRPL accounts require a minimum of {xrplConfig.reserveBase} XRP base reserve,
                  plus {xrplConfig.reserveOwner} XRP per owned object (trustlines, offers, etc.).
                </p>
              </div>

              <div className="xos-risk-box">
                Wallet data is read-only and sourced from the XRPL ledger.
                TROPTIONS never requests or stores private keys.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
