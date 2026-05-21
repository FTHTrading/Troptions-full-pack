import { Section } from "./Section";
import { ON_CHAIN_PROOF_URL, PROOF_WALL, XRPL_STELLAR_VERIFICATION_URL } from "@/lib/constants";

export function ProofWall() {
  return (
    <Section
      id="proof-wall"
      title="Proof wall"
      subtitle="Polygon, XRPL, and Stellar — explorer links. Issued supply on ledger, not market cap."
    >
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <a
          href={ON_CHAIN_PROOF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-gold-light)] underline-offset-2 hover:underline"
        >
          Full on-chain registry →
        </a>
        <a
          href={XRPL_STELLAR_VERIFICATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-gold-light)] underline-offset-2 hover:underline"
        >
          XRPL & Stellar report →
        </a>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {PROOF_WALL.map((card) => (
          <article
            key={card.chain}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-white">{card.chain}</h3>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                PROVEN
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{card.summary}</p>
            <dl className="mt-4 space-y-2 text-sm">
              {card.rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <dt className="text-[var(--color-muted)]">{row.label}</dt>
                  <dd className="text-right font-mono text-xs text-white">
                    {row.href ? (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-gold-light)] hover:underline"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
      <p className="mt-6 text-xs text-[var(--color-muted)]">
        Cross-chain totals: TROPTIONS ~200M · USDC 274M · USDT 200M · EURC 100M · DAI
        100M (~874M issued). Do not cite Exchange desk $175M as on-chain fact.
      </p>
    </Section>
  );
}
