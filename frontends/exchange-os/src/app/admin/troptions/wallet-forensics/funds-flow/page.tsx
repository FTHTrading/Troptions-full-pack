import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { FundsFlowGraph } from "@/components/wallet-forensics/FundsFlowGraph";
import { getFundsFlowEdges } from "@/lib/troptions/xrplFundsFlowAnalyzer";

export default function AdminWalletForensicsFundsFlowPage() {
  return (
    <WalletForensicsLayout title="Admin Funds Flow" intro="Administrative funds movement graph and routing notes.">
      <FundsFlowGraph edges={getFundsFlowEdges()} />
    </WalletForensicsLayout>
  );
}
