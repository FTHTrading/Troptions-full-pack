import Link from "next/link";
import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { WalletSummaryCard } from "@/components/wallet-forensics/WalletSummaryCard";
import { PlainEnglishBreakdown } from "@/components/wallet-forensics/PlainEnglishBreakdown";
import { ExplorerLinksPanel } from "@/components/wallet-forensics/ExplorerLinksPanel";
import { getWalletForensicsSummary } from "@/lib/troptions/walletForensicsEngine";

export default function WalletForensicsHomePage() {
  const summary = getWalletForensicsSummary();

  return (
    <WalletForensicsLayout
      title="XRPL Wallet Intelligence, Forensics, and Funds Tracking"
      intro="Read-only forensic layer that separates native XRP, IOUs, trustlines, NFT references, AMM/DEX context, exchange deposits, destination tags, and signing-key risk notes."
    >
      <section className="wf-grid-2">
        <WalletSummaryCard label="Tracked wallets" value={String(summary.trackedWalletCount)} />
        <WalletSummaryCard label="Tracked transactions" value={String(summary.trackedTransactionCount)} />
        <WalletSummaryCard label="Exchange deposits" value={String(summary.exchangeDepositCount)} tone="warning" />
        <WalletSummaryCard label="Known IOU codes" value={String(summary.iouCodeCount)} />
      </section>

      <PlainEnglishBreakdown />
      <ExplorerLinksPanel />

      <section className="wf-panel">
        <h2>Quick actions</h2>
        <div className="wf-inline-links">
          <Link href="/troptions/wallet-forensics/funds-flow">Track XRP Flow</Link>
          <Link href="/troptions/wallet-forensics/exchange-deposits">Exchange Deposit Report</Link>
          <Link href="/admin/troptions/wallet-forensics/reports">Admin Reports</Link>
        </div>
      </section>
    </WalletForensicsLayout>
  );
}
