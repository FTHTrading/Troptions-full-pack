import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { ExchangeDepositCard } from "@/components/wallet-forensics/ExchangeDepositCard";
import { DestinationTagPanel } from "@/components/wallet-forensics/DestinationTagPanel";
import { XRPL_EXCHANGE_DEPOSIT_REGISTRY } from "@/content/troptions/xrplExchangeDepositRegistry";

export default function WalletForensicsExchangeDepositsPage() {
  const deposit = XRPL_EXCHANGE_DEPOSIT_REGISTRY[0];

  return (
    <WalletForensicsLayout title="Exchange Deposits" intro="Exchange-routed XRP deposits that depend on destination-tag internal mapping.">
      <ExchangeDepositCard record={deposit} />
      <DestinationTagPanel
        destinationTag={deposit.destinationTag}
        txHash={deposit.txHash}
        exchangeName={deposit.exchangeName}
      />
    </WalletForensicsLayout>
  );
}
