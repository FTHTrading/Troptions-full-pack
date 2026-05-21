import { Section } from "./Section";
import { MATURITY_SCORE, PATH_TO_SKYROCKET, type SkyrocketLabel } from "@/lib/constants";

const LABEL_STYLES: Record<SkyrocketLabel, string> = {
  Engineering: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  Ops: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  Sales: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
};

export function PathToSkyrocket() {
  return (
    <Section
      id="skyrocket"
      title="Path to skyrocket"
      subtitle={`Path to 10/10 and scale (${MATURITY_SCORE} → 10.0) — numbered playbook.`}
    >
      <ol className="list-decimal space-y-5 pl-6 text-sm text-[var(--color-muted)]">
        {PATH_TO_SKYROCKET.map((step) => (
          <li key={step.title} className="pl-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-white">{step.title}</span>
              <span
                className={`rounded border px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${LABEL_STYLES[step.label]}`}
              >
                {step.label}
              </span>
            </div>
            <p className="mt-1">{step.detail}</p>
            {step.bullets ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {step.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-xs text-[var(--color-muted)]">
        <strong className="text-white">Honest:</strong> Items 1–5 do not
        auto-complete from a docs-only commit — Cloudflare origin fixes and
        reserve top-ups require operator/infra action (document + probe scripts
        here; live fixes are out of band).
      </p>
    </Section>
  );
}
