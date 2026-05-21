import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { RecoveryChecklist } from "@/components/wallet-forensics/RecoveryChecklist";

export default function PortalWalletForensicsRecoveryChecklistPage() {
  return (
    <WalletForensicsLayout title="Portal Recovery Checklist" intro="Operational checklist for support escalation and control verification.">
      <RecoveryChecklist />
    </WalletForensicsLayout>
  );
}
