import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { SigningKeyPanel } from "@/components/wallet-forensics/SigningKeyPanel";
import { IouVsXrpExplainer } from "@/components/wallet-forensics/IouVsXrpExplainer";

export default function AdminWalletForensicsRiskPage() {
  return (
    <WalletForensicsLayout title="Admin Forensics Risk" intro="Risk-focused view for signing-key posture and IOU misclassification hazards.">
      <SigningKeyPanel />
      <IouVsXrpExplainer />
    </WalletForensicsLayout>
  );
}
