interface AgentStatusCardProps {
  title: string;
  value: string | number;
  note?: string;
}

export function AgentStatusCard({ title, value, note }: AgentStatusCardProps) {
  return (
    <article className="openclaw-card">
      <p className="openclaw-card-title">{title}</p>
      <p className="openclaw-card-value">{value}</p>
      {note ? <p className="openclaw-card-note">{note}</p> : null}
    </article>
  );
}
