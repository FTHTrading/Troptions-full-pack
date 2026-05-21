type WalletSummaryCardProps = {
  readonly label: string;
  readonly value: string;
  readonly tone?: "info" | "warning" | "critical";
};

export function WalletSummaryCard({ label, value, tone = "info" }: WalletSummaryCardProps) {
  return (
    <article className={`wf-card wf-tone-${tone}`}>
      <p className="wf-card-label">{label}</p>
      <p className="wf-card-value">{value}</p>
    </article>
  );
}
