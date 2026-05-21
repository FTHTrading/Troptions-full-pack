// TROPTIONS Exchange OS — Admin Metric Card

interface Props {
  label: string;
  value: string | number;
  icon?: string;
  accent?: "gold" | "cyan" | "green" | "slate";
  note?: string;
}

export function AdminMetricCard({ label, value, icon = "◇", accent = "slate", note }: Props) {
  const colorMap: Record<string, string> = {
    gold: "var(--xos-gold)",
    cyan: "var(--xos-cyan)",
    green: "var(--xos-green)",
    slate: "var(--xos-text-muted)",
  };
  const color = colorMap[accent];

  return (
    <div className={`xos-card xos-card--${accent === "slate" ? "" : accent}`} style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span style={{ color, fontSize: "1rem" }}>{icon}</span>
        <span style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: "var(--xos-font-mono)", fontWeight: 900, fontSize: "1.75rem", color }}>
        {value}
      </div>
      {note && (
        <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", marginTop: "0.375rem" }}>{note}</div>
      )}
    </div>
  );
}
