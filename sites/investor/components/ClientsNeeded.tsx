import { Section } from "./Section";
import { CLIENTS_NEEDED } from "@/lib/constants";

export function ClientsNeeded() {
  return (
    <Section
      id="clients"
      title="Clients needed"
      subtitle="Who to close next to move pipeline → booked revenue."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {CLIENTS_NEEDED.map((item) => (
          <li
            key={item}
            className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-sm text-[var(--color-muted)]"
          >
            <span className="text-[var(--color-gold)]">→</span>
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}
