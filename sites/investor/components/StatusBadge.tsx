export type Status =
  | "live"
  | "pipeline"
  | "gated"
  | "projection"
  | "confirmed"
  | "pending"
  | "pages"
  | "vercel"
  | "private"
  | "local";

const styles: Record<Status, string> = {
  live: "bg-[color-mix(in_srgb,var(--color-accent-blue)_18%,transparent)] text-[#9ec5e0] ring-[color-mix(in_srgb,var(--color-accent-blue)_35%,transparent)]",
  pipeline:
    "bg-[color-mix(in_srgb,var(--color-accent-gold)_15%,transparent)] text-[var(--color-gold-light)] ring-[color-mix(in_srgb,var(--color-accent-gold)_35%,transparent)]",
  projection:
    "bg-[color-mix(in_srgb,var(--color-muted)_12%,transparent)] text-[var(--color-muted)] ring-[var(--color-border)]",
  gated:
    "bg-[color-mix(in_srgb,var(--color-accent-blue)_10%,transparent)] text-[var(--color-muted)] ring-[var(--color-border)]",
  confirmed:
    "bg-[color-mix(in_srgb,var(--color-accent-blue)_18%,transparent)] text-[#9ec5e0] ring-[color-mix(in_srgb,var(--color-accent-blue)_35%,transparent)]",
  pending:
    "bg-[color-mix(in_srgb,var(--color-accent-gold)_10%,transparent)] text-[var(--color-muted)] ring-[var(--color-border)]",
  pages:
    "bg-[color-mix(in_srgb,var(--color-muted)_12%,transparent)] text-[var(--color-muted)] ring-[var(--color-border)]",
  vercel:
    "bg-[color-mix(in_srgb,var(--color-muted)_12%,transparent)] text-[var(--color-muted)] ring-[var(--color-border)]",
  private:
    "bg-[color-mix(in_srgb,var(--color-muted)_12%,transparent)] text-[var(--color-muted)] ring-[var(--color-border)]",
  local:
    "bg-[color-mix(in_srgb,var(--color-muted)_12%,transparent)] text-[var(--color-muted)] ring-[var(--color-border)]",
};

const labels: Record<Status, string> = {
  live: "Live",
  pipeline: "Pipeline",
  gated: "Gated",
  projection: "Projection",
  confirmed: "Confirmed",
  pending: "Pending",
  pages: "GitHub Pages",
  vercel: "Vercel",
  private: "Private repo",
  local: "Local / sandbox",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
