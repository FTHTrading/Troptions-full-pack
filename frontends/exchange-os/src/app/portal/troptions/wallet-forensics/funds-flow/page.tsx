import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { FundsFlowGraph } from "@/components/wallet-forensics/FundsFlowGraph";
import { getFundsFlowEdges } from "@/lib/troptions/xrplFundsFlowAnalyzer";

export default function PortalWalletForensicsFundsFlowPage() {
  return (
    <WalletForensicsLayout title="Portal Funds Flow" intro="Portal-level funds flow visibility with plain-language movement mapping.">
      <FundsFlowGraph edges={getFundsFlowEdges()} />
    </WalletForensicsLayout>
  );
}
