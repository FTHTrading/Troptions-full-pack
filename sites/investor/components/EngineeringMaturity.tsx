import { Section } from "./Section";
import { BUILT_ITEMS, GAP_ITEMS } from "@/lib/constants";

export function EngineeringMaturity() {
  return (
    <Section
      id="engineering"
      title="Engineering maturity"
      subtitle="Production hardening on main — with explicit gaps, not hidden debt."
    >
      <div className="mb-10 flex flex-wrap items-center gap-4">
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 border-[var(--color-gold)] bg-[var(--color-gold)]/10">
          <span className="text-3xl font-bold text-[var(--color-gold-light)]">9.2</span>
          <span className="text-xs text-[var(--color-muted)]">/ 10</span>
        </div>
        <p className="max-w-xl text-sm text-[var(--color-muted)]">
          TLS templates, API-key writes, DAO reads L1 directly, signed governance
          RPC. Sovereign Sequencer — single-node today; BFT planned.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
            Built & confirmed
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
            {BUILT_ITEMS.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-emerald-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
            Gaps & pending
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
            {GAP_ITEMS.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-amber-500">○</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
