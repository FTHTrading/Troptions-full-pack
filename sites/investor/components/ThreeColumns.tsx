import { Section } from "./Section";
import { THREE_COLUMNS } from "@/lib/constants";

export function ThreeColumns() {
  return (
    <Section
      id="stack"
      title="Operating company · Sovereign stack · Proof"
      subtitle="Three lenses for the same diligence conversation."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {THREE_COLUMNS.map((col) => (
          <article
            key={col.title}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6"
          >
            <h3 className="text-lg font-semibold text-[var(--color-gold-light)]">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
              {col.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[var(--color-gold)]">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
