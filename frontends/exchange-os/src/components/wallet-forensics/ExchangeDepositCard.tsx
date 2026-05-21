import type { WalletForensicsExchangeDepositRecord } from "@/content/troptions/walletForensicsRegistry";

type ExchangeDepositCardProps = {
  readonly record: WalletForensicsExchangeDepositRecord;
};

export function ExchangeDepositCard({ record }: ExchangeDepositCardProps) {
  return (
    <article className="wf-panel wf-warning-card">
      <h2>Exchange Deposit</h2>
      <p><strong>Exchange:</strong> {record.exchangeName}</p>
      <p><strong>To:</strong> <span className="wf-mono">{record.exchangeAccount}</span></p>
      <p><strong>Destination Tag:</strong> {record.destinationTag}</p>
      <p><strong>Amount:</strong> {record.amount} {record.currency}</p>
      <p><strong>Status:</strong> {record.status}</p>
      <p><strong>Required next action:</strong> {record.requiredNextAction}</p>
    </article>
  );
}
