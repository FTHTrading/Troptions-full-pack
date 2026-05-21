import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { CompromiseEvidencePanel } from "@/components/wallet-forensics/CompromiseEvidencePanel";

export const metadata = {
  title: "Full Forensic Investigation — Admin | Troptions",
};

export default function AdminWalletForensicsInvestigationPage() {
  return (
    <WalletForensicsLayout
      title="Full Forensic Investigation (Admin)"
      intro="Admin-level full investigation across all 13 wallets. Includes all attacker infrastructure addresses and legacy backup wallets under investigation."
    >
      <CompromiseEvidencePanel />
    </WalletForensicsLayout>
  );
}
