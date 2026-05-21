import { WalletLayout } from "@/components/troptions-wallet/WalletLayout";
import { WalletReceivePanel } from "@/components/troptions-wallet/WalletReceivePanel";
import "@/styles/troptions-wallet.css";

export default function ReceivePage() {
  return (
    <WalletLayout title="Receive Funds" subtitle="Share your address or QR code">
      <div className="mx-auto max-w-2xl">
        <WalletReceivePanel currency="TROP USD" chain="internal-ledger" />
      </div>
    </WalletLayout>
  );
}
