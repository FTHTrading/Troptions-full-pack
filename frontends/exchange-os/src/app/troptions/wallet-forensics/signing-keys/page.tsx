import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { SigningKeyPanel } from "@/components/wallet-forensics/SigningKeyPanel";

export default function WalletForensicsSigningKeysPage() {
  return (
    <WalletForensicsLayout title="Signing Key Forensics" intro="Master-key, regular-key, and signing-authorization risk visibility.">
      <SigningKeyPanel />
    </WalletForensicsLayout>
  );
}
