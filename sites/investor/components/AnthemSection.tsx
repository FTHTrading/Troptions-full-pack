import Link from "next/link";
import { Section } from "./Section";
import {
  ANTHEM_IPFS_MANIFEST_CID,
  ANTHEM_TRACKS,
  TANTHEM_NFT_COLLECTION_URL,
} from "@/lib/constants";
import { ipfsUrl } from "@/lib/ipfs";

export function AnthemSection() {
  const featured = ANTHEM_TRACKS.filter((t) => t.featured);
  const catalog = ANTHEM_TRACKS.filter((t) => !t.featured);

  return (
    <Section
      id="anthem"
      title="TROPTIONS Anthem"
      subtitle="Mainframe Explode — six tracks on IPFS; ElevenLabs Charlie featured. XRPL TANTHEM mint prepared, not live until signed locally."
    >
      <div className="mb-8 space-y-3 text-sm text-[var(--color-muted)]">
        <p>
          Audio permanence: <strong className="text-white">PROVEN</strong> on
          IPFS (six files + manifest, ~16.3 MB). NFT collection{" "}
          <strong className="text-white">TANTHEM</strong> — 703 tokens, issuer{" "}
          <code className="text-xs text-white/80">rJLMST…N3FQ</code>, 2.5%
          transfer fee — mint batch{" "}
          <strong className="text-amber-200">PREPARED</strong> (unsigned; not on
          ledger yet).
        </p>
        <p>
          <a
            href={ipfsUrl(ANTHEM_IPFS_MANIFEST_CID)}
            className="text-[var(--color-gold-light)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            IPFS manifest
          </a>
          {" · "}
          <a
            href={TANTHEM_NFT_COLLECTION_URL}
            className="text-[var(--color-gold-light)] hover:underline"
          >
            TANTHEM rarity & mint status
          </a>
          {" · "}
          <Link
            href="/anthem/"
            className="text-[var(--color-gold-light)] hover:underline"
          >
            Lyrics & honesty notes
          </Link>
        </p>
        <p className="text-xs text-amber-200/90">
          Mint: operator runs{" "}
          <code className="text-white/80">scripts/xrpl_mint_ready.py</code>{" "}
          locally with issuer seed — never commit seeds to git.
        </p>
      </div>

      <div className="space-y-6">
        {featured.map((track) => (
          <TrackCard key={track.file} track={track} highlight />
        ))}
        {catalog.map((track) => (
          <TrackCard key={track.file} track={track} />
        ))}
      </div>
    </Section>
  );
}

function TrackCard({
  track,
  highlight = false,
}: {
  track: (typeof ANTHEM_TRACKS)[number];
  highlight?: boolean;
}) {
  const src = ipfsUrl(track.cid);

  return (
    <article
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5"
          : "border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {highlight ? (
            <span className="mb-2 inline-block rounded bg-[var(--color-gold)]/20 px-2 py-0.5 text-xs font-medium text-[var(--color-gold-light)]">
              Featured · IPFS PROVEN
            </span>
          ) : null}
          <h3 className="font-semibold text-white">{track.title}</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {track.meaning}
            {track.sizeNote ? ` (${track.sizeNote})` : null}
          </p>
          <p className="mt-2 font-mono text-xs text-white/50">
            CID: {track.cid}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a
              href={src}
              className="text-[var(--color-gold-light)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on IPFS
            </a>
            <a
              href={src}
              download={track.file}
              className="text-[var(--color-gold-light)] hover:underline"
            >
              Download MP3
            </a>
          </div>
        </div>
      </div>
      <audio
        controls
        preload="metadata"
        className="mt-4 w-full"
        src={src}
      >
        <a href={src}>Play {track.title}</a>
      </audio>
    </article>
  );
}
