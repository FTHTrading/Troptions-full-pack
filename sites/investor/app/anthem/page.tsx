import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PROOF_URL, REPO_URL } from "@/lib/constants";

export const metadata = {
  title: "TROPTIONS Anthem — Lyrics",
  description: "Mainframe Explode lyrics with honesty footnotes.",
};

export default function AnthemPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm text-[var(--color-gold-light)] hover:underline"
        >
          ← Back to showcase
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-white">
          TROPTIONS Anthem — Mainframe Explode
        </h1>
        <p className="mt-4 text-[var(--color-muted)]">
          Proprietary FTH Trading. Internal and brand use only.
        </p>

        <article className="prose-invert mt-10 space-y-8 text-[var(--color-muted)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-gold-light)]">
              Intro — Hype Beat Drop
            </h2>
            <p className="mt-2 whitespace-pre-line text-white/90">
              {`Yeah! (ATL!)\nTROPTIONS! (Macon!)\nLet's get it! (Uh!)`}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-gold-light)]">
              Verse 1
            </h2>
            <p className="mt-2 whitespace-pre-line">
              {`Back in '03, world was sleepin', analog dreams, yeah,
Macon, Georgia birthed it, we crushed those old schemes.
Digital ledger, that's what we brought to the game, still,
Knocked on Washington's door, shoutin' out our name.
SEC came next, tried to hold back our light,
They challenged our vision, but we held on tight, that's right.`}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-gold-light)]">
              Chorus
            </h2>
            <p className="mt-2 whitespace-pre-line">
              {`Look at us now, yeah, we runnin' this game, homie,
TROPTIONS on top, shout out loud our name!
From Rust L1 to the chain, we broke all the rules, son,
They tried to stop us, but we built all the tools! (Yeah!)
Look at us now! (C'mon!)`}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-gold-light)]">
              Bridge — Breakdown
            </h2>
            <p className="mt-2 whitespace-pre-line">
              {`Twenty-two years deep, put in blood, sweat, and tears, no lie,
AI agents rollin', no more baseless fears. (None!)
NEEDAI, CLAWD, Popeye, makin' moves every day, word,
Hunnid seventy-five mil, no one standing in our way!`}
            </p>
          </section>
        </article>

        <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm">
          <h2 className="font-semibold text-amber-200">Honesty notes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--color-muted)]">
            <li>
              <strong className="text-white">“Hunnid seventy-five mil…”</strong> —
              Brand narrative / operator attestation only. Verify via{" "}
              <a
                href={PROOF_URL}
                className="text-[var(--color-gold-light)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                proof docs
              </a>{" "}
              before external citation.
            </li>
            <li>
              <strong className="text-white">NEEDAI, CLAWD, Popeye</strong> —
              Optional integration branches; not all merged to main. See{" "}
              <a
                href={REPO_URL}
                className="text-[var(--color-gold-light)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                repository README
              </a>
              .
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
