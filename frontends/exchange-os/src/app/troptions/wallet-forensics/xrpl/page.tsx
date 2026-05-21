import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { ExplorerLinksPanel } from "@/components/wallet-forensics/ExplorerLinksPanel";

export default function WalletForensicsXrplPage() {
  return (
    <WalletForensicsLayout title="XRPL Wallet Inventory" intro="Tracked XRPL wallets, explorer links, and investigation context.">
      <ExplorerLinksPanel />
    </WalletForensicsLayout>
  );
}
