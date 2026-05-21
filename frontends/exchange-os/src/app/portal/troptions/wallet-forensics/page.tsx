import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { PlainEnglishBreakdown } from "@/components/wallet-forensics/PlainEnglishBreakdown";

export default function PortalWalletForensicsPage() {
  return (
    <WalletForensicsLayout title="Portal Wallet Forensics" intro="Client-facing forensic summary in read-only mode.">
      <PlainEnglishBreakdown />
    </WalletForensicsLayout>
  );
}
