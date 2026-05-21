import { Section } from "./Section";
import { PATH_TO_SKYROCKET } from "@/lib/constants";

export function PathToSkyrocket() {
  return (
    <Section
      id="skyrocket"
      title="Path to skyrocket"
      subtitle="Numbered playbook from 9.5 → 10/10 and scale."
    >
      <ol className="list-decimal space-y-3 pl-6 text-sm text-[var(--color-muted)]">
        {PATH_TO_SKYROCKET.map((step) => (
          <li key={step} className="pl-1">
            {step}
          </li>
        ))}
      </ol>
    </Section>
  );
}
