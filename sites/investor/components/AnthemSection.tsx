import Link from "next/link";
import { Section } from "./Section";
import { assetPath } from "@/lib/base-path";
import { ANTHEM_TRACKS } from "@/lib/constants";

export function AnthemSection() {
  return (
    <Section
      id="anthem"
      title="TROPTIONS Anthem"
      subtitle="Five Mainframe Explode tracks — proprietary FTH Trading. Play, download, and read meaning."
    >
      <p className="mb-8 text-sm text-[var(--color-muted)]">
        Bridge lyrics reference operator attestation figures and optional agent
        branches — see{" "}
        <Link href="/anthem/" className="text-[var(--color-gold-light)] hover:underline">
          full lyrics & honesty notes
        </Link>
        .
      </p>
      <div className="space-y-6">
        {ANTHEM_TRACKS.map((track) => {
          const src = assetPath(`/audio/${track.file}`);
          return (
            <article
              key={track.file}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-white">{track.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {track.meaning}
                  </p>
                  <a
                    href={src}
                    download
                    className="mt-3 inline-block text-sm text-[var(--color-gold-light)] hover:underline"
                  >
                    Download MP3
                  </a>
                </div>
              </div>
              <audio
                controls
                preload="metadata"
                className="mt-4 w-full"
                src={src}
              >
                <a href={src}>Download {track.title}</a>
              </audio>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
