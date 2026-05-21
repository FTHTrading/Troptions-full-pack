import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { ExchangeDepositCard } from "@/components/wallet-forensics/ExchangeDepositCard";
import { XRPL_EXCHANGE_DEPOSIT_REGISTRY } from "@/content/troptions/xrplExchangeDepositRegistry";

export default function AdminWalletForensicsExchangeDepositsPage() {
  return (
    <WalletForensicsLayout title="Admin Exchange Deposits" intro="Administrative exchange deposit and destination-tag escalation records.">
      <ExchangeDepositCard record={XRPL_EXCHANGE_DEPOSIT_REGISTRY[0]} />
    </WalletForensicsLayout>
  );
}
