import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { ExplorerLinksPanel } from "@/components/wallet-forensics/ExplorerLinksPanel";

export default function PortalWalletForensicsXrplPage() {
  return (
    <WalletForensicsLayout title="Portal XRPL Forensics" intro="Portal view for XRPL wallet inventory and explorer references.">
      <ExplorerLinksPanel />
    </WalletForensicsLayout>
  );
}
