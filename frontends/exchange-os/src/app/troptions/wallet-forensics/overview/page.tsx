import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { PlainEnglishBreakdown } from "@/components/wallet-forensics/PlainEnglishBreakdown";

export default function WalletForensicsOverviewPage() {
  return (
    <WalletForensicsLayout title="Wallet Forensics Overview" intro="Plain-English summary of key wallets, key transactions, and required support actions.">
      <PlainEnglishBreakdown />
    </WalletForensicsLayout>
  );
}
