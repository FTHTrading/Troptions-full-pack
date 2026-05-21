import type { Metadata } from "next";
import Link from "next/link";
import { TTN_FILMS } from "@/content/ttn/filmRegistry";

export const metadata: Metadata = {
  title: "Films",
  description: "Short films, documentaries, and TTN Originals.",
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  published: { label: "Published", cls: "text-green-400 border-green-800 bg-green-900/20" },
  "in-production": { label: "In Production", cls: "text-blue-400 border-blue-800 bg-blue-900/20" },
  "post-production": { label: "Post-Production", cls: "text-purple-400 border-purple-800 bg-purple-900/20" },
  "pending-review": { label: "Pending Review", cls: "text-yellow-400 border-yellow-800 bg-yellow-900/20" },
  draft: { label: "Draft", cls: "text-gray-400 border-gray-700 bg-gray-800/20" },
  archived: { label: "Archived", cls: "text-gray-500 border-gray-700 bg-gray-800/20" },
};

export default function FilmsPage() {
  const published = TTN_FILMS.filter((f) => f.status === "published");
  const inProduction = TTN_FILMS.filter((f) => f.status !== "published" && f.status !== "archived");
  const archived = TTN_FILMS.filter((f) => f.status === "archived");

  const FilmRow = ({ film }: { film: (typeof TTN_FILMS)[number] }) => {
    const badge = STATUS_BADGE[film.status] ?? STATUS_BADGE.draft;
    return (
      <Link
        href={`/ttn/films/${film.slug}`}
        className="group rounded-xl border border-gray-800 bg-[#0F1923] p-5 transition-all hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className={`rounded border px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] ${badge.cls}`}>
            {badge.label}
          </span>
          <span className="text-[10px] text-gray-500">{film.runtime}</span>
        </div>
        <h3 className="mb-1 text-sm font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
          {film.title}
        </h3>
        <p className="mb-3 text-xs italic text-[#C9A84C]/70">{film.tagline}</p>
        <p className="mb-4 text-xs text-gray-400 line-clamp-2 leading-relaxed">{film.synopsis}</p>
        <div className="flex flex-wrap gap-1.5">
          {film.genre.map((g) => (
            <span key={g} className="rounded bg-gray-800/80 px-2 py-0.5 text-[10px] text-gray-400 capitalize">
              {g}
            </span>
          ))}
        </div>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">TTN Films</p>
        <h1 className="text-3xl font-bold text-white">Films & Documentaries</h1>
        <p className="mt-3 max-w-xl text-sm text-gray-400">
          Short films, documentaries, student productions, and TTN Originals.
        </p>
      </div>

      {published.length > 0 && (
        <div className="mb-12">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-green-400">Now Available</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((f) => <FilmRow key={f.id} film={f} />)}
          </div>
        </div>
      )}

      {inProduction.length > 0 && (
        <div className="mb-12">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-400">In Development</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {inProduction.map((f) => <FilmRow key={f.id} film={f} />)}
          </div>
        </div>
      )}

      {archived.length > 0 && (
        <div>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">Archive</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {archived.map((f) => <FilmRow key={f.id} film={f} />)}
          </div>
        </div>
      )}

      {TTN_FILMS.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-700 p-16 text-center text-sm text-gray-500">
          No films yet. Check back soon.
        </div>
      )}
    </div>
  );
}
