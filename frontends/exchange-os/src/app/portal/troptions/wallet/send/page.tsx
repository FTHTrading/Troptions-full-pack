import { WalletLayout } from "@/components/troptions-wallet/WalletLayout";
import { WalletSendForm } from "@/components/troptions-wallet/WalletSendForm";
import "@/styles/troptions-wallet.css";

export default function SendPage() {
  return (
    <WalletLayout title="Send Funds" subtitle="Simulation mode - no real transactions">
      <div className="mx-auto max-w-2xl">
        <WalletSendForm />
      </div>
    </WalletLayout>
  );
}
