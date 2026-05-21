import Link from "next/link";
import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { WalletSummaryCard } from "@/components/wallet-forensics/WalletSummaryCard";
import { getWalletForensicsSummary } from "@/lib/troptions/walletForensicsEngine";

export default function AdminWalletForensicsPage() {
  const summary = getWalletForensicsSummary();

  return (
    <WalletForensicsLayout title="Admin Wallet Forensics" intro="Administrative forensic command surface for funds tracking and risk review.">
      <section className="wf-grid-2">
        <WalletSummaryCard label="Tracked wallets" value={String(summary.trackedWalletCount)} />
        <WalletSummaryCard label="Tracked transactions" value={String(summary.trackedTransactionCount)} />
        <WalletSummaryCard label="Exchange deposits" value={String(summary.exchangeDepositCount)} tone="warning" />
        <WalletSummaryCard label="Known IOU codes" value={String(summary.iouCodeCount)} />
      </section>
      <section className="wf-panel">
        <h2>Admin navigation</h2>
        <div className="wf-inline-links">
          <Link href="/admin/troptions/wallet-forensics/wallets">Wallets</Link>
          <Link href="/admin/troptions/wallet-forensics/transactions">Transactions</Link>
          <Link href="/admin/troptions/wallet-forensics/funds-flow">Funds Flow</Link>
          <Link href="/admin/troptions/wallet-forensics/exchange-deposits">Exchange Deposits</Link>
          <Link href="/admin/troptions/wallet-forensics/risk">Risk</Link>
          <Link href="/admin/troptions/wallet-forensics/reports">Reports</Link>
          <Link href="/admin/troptions/wallet-forensics/investigation">🔍 Full Investigation</Link>
        </div>
      </section>
    </WalletForensicsLayout>
  );
}
