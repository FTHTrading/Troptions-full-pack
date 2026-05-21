import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { RecoveryChecklist } from "@/components/wallet-forensics/RecoveryChecklist";

export default function WalletForensicsRecoveryChecklistPage() {
  return (
    <WalletForensicsLayout title="Recovery Checklist" intro="Operational checklist for read-only forensic verification and support escalation.">
      <RecoveryChecklist />
    </WalletForensicsLayout>
  );
}
