import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { ExplorerLinksPanel } from "@/components/wallet-forensics/ExplorerLinksPanel";

export default function AdminWalletForensicsWalletsPage() {
  return (
    <WalletForensicsLayout title="Admin Wallet Inventory" intro="Administrative wallet inventory and explorer references.">
      <ExplorerLinksPanel />
    </WalletForensicsLayout>
  );
}
