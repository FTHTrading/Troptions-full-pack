import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { CompromiseEvidencePanel } from "@/components/wallet-forensics/CompromiseEvidencePanel";

export const metadata = {
  title: "Full Forensic Investigation — All Wallets | Troptions Portal",
};

export default function PortalWalletForensicsInvestigationPage() {
  return (
    <WalletForensicsLayout
      title="Full Forensic Investigation (Portal)"
      intro="All wallets — XRPL primary compromise, related accounts, attacker signing-key chain, legacy backup wallets under investigation, and Stellar accounts. Full compromise posture active."
    >
      <CompromiseEvidencePanel />
    </WalletForensicsLayout>
  );
}
