import { Section } from "./Section";
import {
  COMPETITIVE_PILLARS,
  REPLACEMENT_COST,
  ROCKET_FUEL_WEEKS,
  VALUATION_PROJECTIONS,
  VALUATION_URL,
} from "@/lib/constants";

export function ComparativeAnalysis() {
  return (
    <>
      <Section
        id="valuation"
        title="Valuation & replacement cost"
        subtitle="PROVEN cash lines vs PIPELINE vs illustrative PROJECTION bands — not market cap from ledger supply."
      >
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 border-[var(--color-gold)] bg-[var(--color-gold)]/10">
            <span className="text-2xl font-bold text-[var(--color-gold-light)]">
              9.8
            </span>
            <span className="text-xs text-[var(--color-muted)]">/ 10</span>
          </div>
          <p className="max-w-2xl text-sm text-[var(--color-muted)]">
            DAO + cross-chain proof on main. Gap to 10: public TLS on
            troptions.org hostnames and XRPL reserve top-up only.
          </p>
          <a
            href={VALUATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--color-gold-light)] hover:underline"
          >
            Full VALUATION_AND_COMPARABLES.md →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {REPLACEMENT_COST.map((row) => (
            <article
              key={row.band}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"
            >
              <h3 className="font-semibold text-[var(--color-gold-light)]">
                {row.band}
              </h3>
              <p className="mt-2 text-2xl font-bold text-white">{row.range}</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {row.note}
              </p>
              <span className="mt-3 inline-block text-xs uppercase tracking-wide text-emerald-400">
                {row.label}
              </span>
            </article>
          ))}
        </div>

        <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-purple-300">
          12–24 month scenarios (PROJECTION)
        </h3>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
                <th className="px-4 py-3 font-medium">Scenario</th>
                <th className="px-4 py-3 font-medium">Illustrative band</th>
                <th className="px-4 py-3 font-medium">Assumptions</th>
              </tr>
            </thead>
            <tbody>
              {VALUATION_PROJECTIONS.map((row) => (
                <tr
                  key={row.scenario}
                  className="border-b border-[var(--color-border)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {row.scenario}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-gold-light)]">
                    {row.band}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {row.assumptions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-amber-300">
          30-day rocket fuel
        </h3>
        <ol className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
          {ROCKET_FUEL_WEEKS.map((w) => (
            <li key={w.week} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3">
              <span className="font-semibold text-white">Week {w.week}:</span>{" "}
              {w.focus} — <span className="text-[var(--color-gold-light)]">{w.outcome}</span>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-xs text-[var(--color-muted)]">
          <strong className="text-purple-300">Projections disclaimer:</strong>{" "}
          Valuation bands and “if X clients” revenue are illustrative only — not
          audited financials, forecasts, or investment advice. ~874M issued on
          ledger is not market capitalization.
        </p>
      </Section>

      <Section
        id="competitive"
        title="Competitive landscape"
        subtitle="Four pillars — honest differentiation, not fabricated competitor revenue."
      >
        <div className="space-y-10">
          {COMPETITIVE_PILLARS.map((pillar) => (
            <div key={pillar.id}>
              <h3 className="text-lg font-semibold text-[var(--color-gold-light)]">
                {pillar.title}
              </h3>
              <p className="mt-2 max-w-3xl text-sm text-[var(--color-muted)]">
                {pillar.honestTake}
              </p>
              <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-border)]">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
                      {pillar.columns.map((col) => (
                        <th key={col} className="px-3 py-2 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pillar.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--color-border)] last:border-0"
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`px-3 py-2 align-top ${
                              j === row.length - 1
                                ? "font-medium text-[var(--color-gold-light)]"
                                : "text-[var(--color-muted)]"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5 p-6">
          <h3 className="text-base font-semibold text-white">
            Full stack triad (in this monorepo)
          </h3>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            <strong className="text-white">Identity</strong> — SNP with 955
            post-quantum roots. <strong className="text-white">Commerce</strong>{" "}
            — x402 health LIVE on x402.unykorn.org (twin demo still pending).{" "}
            <strong className="text-white">Governance</strong> — DAO service with
            L1 reads and council multisig. This is the most complete integrated
            sovereign stack in Troptions-full-pack — not a claim that no other
            vendor offers pieces globally.
          </p>
        </div>
      </Section>
    </>
  );
}
