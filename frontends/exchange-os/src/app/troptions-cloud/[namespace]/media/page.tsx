import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Media Studio — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const MEDIA_TOOLS = [
  { id: "ttn-creator", label: "TTN Creator Suite", description: "Create and schedule Troptions Television Network content." },
  { id: "video-producer", label: "Video Producer", description: "Produce and organize video assets for Troptions media channels." },
  { id: "podcast-studio", label: "Podcast Studio", description: "Record, edit, and publish podcast episodes." },
  { id: "press-release", label: "Press Release Builder", description: "Draft and distribute official Troptions press releases." },
  { id: "news-feed", label: "News Feed Manager", description: "Curate and schedule Troptions news content." },
  { id: "brand-assets", label: "Brand Asset Library", description: "Manage official Troptions brand assets and media kits." },
];

export default async function MediaStudioPage({ params }: Props) {
  const { namespace } = await params;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Media Studio</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Troptions Media Studio</h1>
          <p className="mt-2 text-sm text-gray-400">
            Content creation and media production tools for Troptions Television Network and media channels.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            All Media Studio tools are non-functional in this phase.
          </p>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {MEDIA_TOOLS.map((tool) => (
            <div key={tool.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 flex flex-col">
              <h2 className="text-sm font-semibold text-white mb-2">{tool.label}</h2>
              <p className="text-xs text-gray-400 flex-1 mb-4">{tool.description}</p>
              <button
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-3 py-2 text-xs font-semibold text-gray-600"
              >
                Open — Simulation Only
              </button>
            </div>
          ))}
        </div>

        {/* TTN Info */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400 mb-2">Troptions Television Network</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            TTN (Troptions Television Network) is a media channel for Troptions community content,
            news, educational programming, and creator productions. All content requires editorial review.
          </p>
        </div>
      </div>
    </div>
  );
}
