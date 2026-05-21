import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { TransactionFlowTable } from "@/components/wallet-forensics/TransactionFlowTable";
import { XRPL_TRANSACTION_REGISTRY } from "@/content/troptions/xrplTransactionRegistry";

export default function AdminWalletForensicsTransactionsPage() {
  return (
    <WalletForensicsLayout title="Admin Transaction Forensics" intro="Full administrative transaction classification table.">
      <TransactionFlowTable records={XRPL_TRANSACTION_REGISTRY} />
    </WalletForensicsLayout>
  );
}
