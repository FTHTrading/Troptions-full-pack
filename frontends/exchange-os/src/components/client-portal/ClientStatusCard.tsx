type ClientStatusCardProps = {
  label: string;
  status: string;
  detail?: string;
};

export function ClientStatusCard({ label, status, detail }: ClientStatusCardProps) {
  return (
    <article className="cp-card">
      <h3>{label}</h3>
      <span className="cp-badge">{status}</span>
      {detail ? <p>{detail}</p> : null}
    </article>
  );
}
