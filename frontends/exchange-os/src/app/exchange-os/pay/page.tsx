// TROPTIONS Exchange OS — FTH Pay Portal
// Styled after UnyKorn Genesis Wallet.
// Multi-chain balances, Send, Mint on the spot, History.

import { FthPayDashboard } from "@/components/exchange-os/FthPayDashboard";

export const metadata = { title: "FTH Pay — TROPTIONS Exchange OS" };

export default function PayPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 1.25rem" }}>
      <div className="xos-gold-line" />
      <FthPayDashboard />
    </div>
  );
}
