import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { TrustlineTable } from "@/components/wallet-forensics/TrustlineTable";

export default function WalletForensicsTrustlinesPage() {
  return (
    <WalletForensicsLayout title="Trustline Forensics" intro="Trustline records and reserve-impact notes for issued-currency exposure.">
      <TrustlineTable />
    </WalletForensicsLayout>
  );
}
