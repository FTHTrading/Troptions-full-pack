import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { TransactionFlowTable } from "@/components/wallet-forensics/TransactionFlowTable";
import { XRPL_TRANSACTION_REGISTRY } from "@/content/troptions/xrplTransactionRegistry";

export default function WalletForensicsTransactionsPage() {
  return (
    <WalletForensicsLayout title="Transaction Forensics" intro="Read-only transaction ledger view with classification and plain-English context.">
      <TransactionFlowTable records={XRPL_TRANSACTION_REGISTRY} />
    </WalletForensicsLayout>
  );
}
