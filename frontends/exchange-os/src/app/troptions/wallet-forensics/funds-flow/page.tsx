import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { FundsFlowGraph } from "@/components/wallet-forensics/FundsFlowGraph";
import { getFundsFlowEdges } from "@/lib/troptions/xrplFundsFlowAnalyzer";

export default function WalletForensicsFundsFlowPage() {
  return (
    <WalletForensicsLayout title="Funds Flow" intro="Directional fund movement graph with destination-tag and exchange-routing context.">
      <FundsFlowGraph edges={getFundsFlowEdges()} />
    </WalletForensicsLayout>
  );
}
