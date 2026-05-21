import { WalletLayout } from "@/components/troptions-wallet/WalletLayout";
import { WalletHistoryTable } from "@/components/troptions-wallet/WalletHistoryTable";
import "@/styles/troptions-wallet.css";

export default function HistoryPage() {
  return (
    <WalletLayout title="Transaction History" subtitle="Your wallet activity">
      <div className="mx-auto max-w-4xl">
        <WalletHistoryTable transactions={[]} />
      </div>
    </WalletLayout>
  );
}
