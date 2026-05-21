import { Section } from "./Section";
import { ECONOMICS } from "@/lib/constants";

export function Economics() {
  return (
    <Section
      id="economics"
      title="Economics"
      subtitle="Sunk engineering, ongoing ops bands, and labeled future drivers."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-gold)]">
            Engineering sunk cost
          </h3>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{ECONOMICS.sunk}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-gold)]">
            Ongoing ops (ranges)
          </h3>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{ECONOMICS.ongoing}</p>
        </div>
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Future value drivers
          </h3>
          <p className="mt-1 text-xs font-medium text-purple-200/80">PROJECTION</p>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{ECONOMICS.drivers}</p>
        </div>
      </div>
      <p className="mt-6 text-xs text-[var(--color-muted)]">
        Illustrative revenue scenarios (e.g. “if X clients”) are not audited forecasts.
        Live revenue today: Academy subscriptions, launcher fees, early x402 metering.
      </p>
    </Section>
  );
}
