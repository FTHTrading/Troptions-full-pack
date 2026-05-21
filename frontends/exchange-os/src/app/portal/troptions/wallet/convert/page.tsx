import { WalletLayout } from "@/components/troptions-wallet/WalletLayout";
import { WalletConversionPanel } from "@/components/troptions-wallet/WalletConversionPanel";
import "@/styles/troptions-wallet.css";

export default function ConvertPage() {
  return (
    <WalletLayout title="Convert Stablecoins" subtitle="Simulation mode - no real conversions">
      <div className="mx-auto max-w-2xl">
        <WalletConversionPanel />
      </div>
    </WalletLayout>
  );
}
