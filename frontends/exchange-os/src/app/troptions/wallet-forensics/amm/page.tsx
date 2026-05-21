import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { AmmActivityPanel } from "@/components/wallet-forensics/AmmActivityPanel";

export default function WalletForensicsAmmPage() {
  return (
    <WalletForensicsLayout title="AMM / DEX Forensics" intro="AMM and DEX-related traces linked to wallet movement analysis.">
      <AmmActivityPanel />
    </WalletForensicsLayout>
  );
}
