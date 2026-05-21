import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { NftActivityTable } from "@/components/wallet-forensics/NftActivityTable";

export default function WalletForensicsNftsPage() {
  return (
    <WalletForensicsLayout title="NFT Forensics" intro="NFT mint/burn/transfer forensic surface for wallet investigations.">
      <NftActivityTable />
    </WalletForensicsLayout>
  );
}
