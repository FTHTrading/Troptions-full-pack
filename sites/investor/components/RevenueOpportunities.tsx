import { Section } from "./Section";
import { REVENUE_OPPORTUNITIES } from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";

export function RevenueOpportunities() {
  return (
    <Section
      id="opportunities"
      title="Revenue & opportunities"
      subtitle="Live revenue vs pipeline — projections labeled separately in economics."
    >
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
              <th className="px-4 py-3 font-medium">Opportunity</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Revenue model</th>
              <th className="px-4 py-3 font-medium">TAM note</th>
              <th className="px-4 py-3 font-medium">Client type</th>
            </tr>
          </thead>
          <tbody>
            {REVENUE_OPPORTUNITIES.map((row) => (
              <tr
                key={row.opportunity}
                className="border-b border-[var(--color-border)] last:border-0"
              >
                <td className="px-4 py-3 font-medium text-white">{row.opportunity}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{row.revenueModel}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{row.tamNote}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{row.clientType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
