import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TTN_FILMS, getFilm } from "@/content/ttn/filmRegistry";
import { TTN_CREATORS } from "@/content/ttn/creatorRegistry";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TTN_FILMS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const film = getFilm(slug);
  if (!film) return { title: "Film Not Found" };
  return { title: film.title, description: film.synopsis };
}

export default async function FilmDetailPage({ params }: Props) {
  const { slug } = await params;
  const film = getFilm(slug);
  if (!film) notFound();

  const creator = TTN_CREATORS.find((c) => c.id === film.creatorId);

  const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
    published: { label: "Published", cls: "text-green-400 border-green-800 bg-green-900/20" },
    "in-production": { label: "In Production", cls: "text-blue-400 border-blue-800 bg-blue-900/20" },
    "post-production": { label: "Post-Production", cls: "text-purple-400 border-purple-800 bg-purple-900/20" },
    "pending-review": { label: "Pending Review", cls: "text-yellow-400 border-yellow-800 bg-yellow-900/20" },
    draft: { label: "Draft", cls: "text-gray-400 border-gray-700 bg-gray-800/20" },
  };
  const badge = STATUS_BADGE[film.status] ?? STATUS_BADGE.draft;

  const RIGHTS_LABELS: Record<string, string> = {
    "all-rights-reserved": "All Rights Reserved",
    "creative-commons": "Creative Commons",
    "pending-clearance": "Pending Clearance",
    licensed: "Licensed",
    "under-review": "Under Review",
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/films" className="hover:text-white transition-colors">Films</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{film.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`rounded border px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] ${badge.cls}`}>
              {badge.label}
            </span>
            <span className="text-[10px] text-gray-500">⏱ {film.runtime}</span>
            <span className="text-[10px] text-gray-500">{film.productionYear}</span>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">{film.title}</h1>
          <p className="mb-6 text-sm italic text-[#C9A84C]/80">{film.tagline}</p>
          <p className="mb-8 text-sm text-gray-300 leading-relaxed">{film.synopsis}</p>

          {/* Genre */}
          <div className="mb-8 flex flex-wrap gap-2">
            {film.genre.map((g) => (
              <span key={g} className="rounded bg-gray-800 px-3 py-1 text-xs text-gray-300 capitalize">
                {g}
              </span>
            ))}
          </div>

          {/* Watch / trailer */}
          {film.trailerEmbedUrl && (
            <div className="mb-8 rounded-xl border border-gray-800 bg-[#0D1520] p-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Trailer</p>
              <p className="text-xs text-gray-500 break-all">{film.trailerEmbedUrl}</p>
            </div>
          )}

          {film.status === "published" && !film.trailerEmbedUrl && (
            <div className="mb-8 flex items-center justify-center rounded-xl border border-dashed border-gray-700 bg-[#0D1520] py-12 text-sm text-gray-500">
              Video player coming soon
            </div>
          )}

          {/* Credits */}
          {film.credits.length > 0 && (
            <div className="mb-8">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Credits</p>
              <div className="space-y-2">
                {film.credits.map((credit, i) => (
                  <div key={i} className="flex items-baseline gap-3 text-sm">
                    <span className="w-36 shrink-0 text-[10px] uppercase tracking-[0.1em] text-gray-500">{credit.role}</span>
                    <span className="text-gray-200">{credit.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Creator */}
          {creator && (
            <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Creator</p>
              <Link href={`/ttn/creators/${creator.slug}`} className="group flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800 font-bold text-white text-sm">
                  {creator.name.charAt(0)}
                </div>
                <p className="text-sm text-white group-hover:text-[#C9A84C] transition-colors">
                  {creator.name}
                </p>
              </Link>
            </div>
          )}

          {/* Rights */}
          <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Rights</p>
            <p className="text-xs text-gray-300">{RIGHTS_LABELS[film.rightsStatus] ?? film.rightsStatus}</p>
            <p className="mt-2 text-[10px] text-gray-600">Informational only. See creator agreement.</p>
          </div>

          {/* Festival */}
          {film.festivalStatus !== "not-submitted" && (
            <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Festival</p>
              <p className="text-xs capitalize text-gray-300">{film.festivalStatus.replace(/-/g, " ")}</p>
              {film.festivalDetails && (
                <p className="mt-1 text-[10px] text-gray-500">{film.festivalDetails}</p>
              )}
            </div>
          )}

          {/* Proof */}
          {film.proofCid && (
            <div className="rounded-xl border border-[#C9A84C]/20 bg-[#0D1520] p-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Proof</p>
              <Link href={`/ttn/proof/${film.proofCid}`} className="block">
                <p className="font-mono text-[10px] text-gray-400 break-all hover:text-white transition-colors">
                  {film.proofCid}
                </p>
              </Link>
              <p className="mt-2 text-[10px] text-gray-600">Simulation only</p>
            </div>
          )}

          {/* Tags */}
          {film.tags.length > 0 && (
            <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {film.tags.map((t) => (
                  <span key={t} className="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
