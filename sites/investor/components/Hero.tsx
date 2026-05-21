import { MATURITY_GAP_NOTE, MATURITY_SCORE, PROOF_URL, REPO_URL } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-14">
          <div className="flex-1">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-gold)]">
              Investor showcase
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              TROPTIONS – 22 Years. {MATURITY_SCORE}/10 Maturity. Sovereign by
              Default.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
              Operating company plus open monorepo: Rust L1, DAO, Academy, TTN,
              Exchange OS, and multi-chain contracts — with honest labels for
              what is live, pipeline, or gated. {MATURITY_GAP_NOTE}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={PROOF_URL}
                className="inline-flex items-center justify-center rounded-lg bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[var(--color-gold-light)]"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Proof
              </a>
              <a
                href={REPO_URL}
                className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--color-gold)]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Clone Repo
              </a>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start md:items-end md:text-right">
            <p className="serif-heading text-4xl font-semibold tracking-tight text-[var(--color-accent-gold)] md:text-5xl">
              TROPTIONS
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
              FTH Trading
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
