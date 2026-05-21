import Image from "next/image";
import { assetPath } from "@/lib/base-path";
import { PROOF_URL, REPO_URL } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(184,134,11,0.12)_0%,_transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-14">
          <div className="flex-1">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-gold)]">
              Investor showcase
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              TROPTIONS – 22 Years. 9.5/10 Maturity. Sovereign by Default.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
              Operating company plus open monorepo: Rust L1, DAO, Academy, TTN,
              Exchange OS, and multi-chain contracts — with honest labels for
              what is live, pipeline, or gated.
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
          <div className="flex shrink-0 justify-center md:justify-end">
            <Image
              src={assetPath("/logo.png")}
              alt="TROPTIONS logo"
              width={200}
              height={200}
              className="rounded-2xl shadow-2xl ring-1 ring-[var(--color-border)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
