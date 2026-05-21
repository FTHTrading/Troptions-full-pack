import type { WalletForensicsTransactionRecord } from "@/content/troptions/walletForensicsRegistry";

type TransactionFlowTableProps = {
  readonly records: readonly WalletForensicsTransactionRecord[];
};

export function TransactionFlowTable({ records }: TransactionFlowTableProps) {
  return (
    <div className="wf-table-wrap">
      <table className="wf-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Tx</th>
            <th>From</th>
            <th>To</th>
            <th>Tag</th>
            <th>Amount</th>
            <th>Class</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {records.map((tx) => (
            <tr key={tx.txHash}>
              <td>{tx.date}</td>
              <td className="wf-mono">{tx.txHash}</td>
              <td className="wf-mono">{tx.from}</td>
              <td className="wf-mono">{tx.to}</td>
              <td>{tx.destinationTag ?? "-"}</td>
              <td>{tx.deliveredAmount} {tx.currency}</td>
              <td><span className="wf-badge">{tx.classification}</span></td>
              <td>{tx.plainEnglishSummary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
