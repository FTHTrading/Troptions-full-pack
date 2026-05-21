import { Section } from "./Section";
import { COMPARABLES } from "@/lib/constants";

export function Comparables() {
  return (
    <Section
      id="comparables"
      title="Comparables"
      subtitle="Build-scope comparison only — no fabricated competitor revenue claims."
    >
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
              <th className="px-4 py-3 font-medium">Build path</th>
              <th className="px-4 py-3 font-medium">Typical cost / time</th>
              <th className="px-4 py-3 font-medium">TROPTIONS advantage</th>
            </tr>
          </thead>
          <tbody>
            {COMPARABLES.map((row) => (
              <tr
                key={row.path}
                className="border-b border-[var(--color-border)] last:border-0"
              >
                <td className="px-4 py-3 font-medium text-white">{row.path}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{row.costTime}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{row.advantage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
