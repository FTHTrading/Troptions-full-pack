import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { ExchangeDepositCard } from "@/components/wallet-forensics/ExchangeDepositCard";
import { XRPL_EXCHANGE_DEPOSIT_REGISTRY } from "@/content/troptions/xrplExchangeDepositRegistry";

export default function PortalWalletForensicsExchangeDepositsPage() {
  return (
    <WalletForensicsLayout title="Portal Exchange Deposits" intro="Destination-tagged exchange deposit records for support and recovery workflows.">
      <ExchangeDepositCard record={XRPL_EXCHANGE_DEPOSIT_REGISTRY[0]} />
    </WalletForensicsLayout>
  );
}
