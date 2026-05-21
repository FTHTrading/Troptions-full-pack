import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `AI Studio — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const AI_TOOLS = [
  { id: "ai-writer", label: "AI Writer", description: "Draft documents, memos, and articles with AI assistance." },
  { id: "blog-generator", label: "Blog Generator", description: "Generate full blog posts from a topic and outline." },
  { id: "ad-generator", label: "Ad Copy Generator", description: "Create ad copy variants for Troptions campaigns." },
  { id: "seo-builder", label: "SEO Page Builder", description: "Build SEO-optimized page content from keywords." },
  { id: "email-writer", label: "Email Writer", description: "Draft professional emails and outreach sequences." },
  { id: "proposal-writer", label: "Proposal Writer", description: "Write business and partnership proposals." },
  { id: "podcast-script", label: "Podcast Script Writer", description: "Generate podcast episode scripts and outlines." },
  { id: "film-script", label: "Short Film Script Writer", description: "Draft short film scripts for Troptions Studios." },
  { id: "news-article", label: "News Article Writer", description: "Draft Troptions news articles from bullet points." },
  { id: "voiceover-script", label: "Voiceover Script Writer", description: "Write voiceover scripts for video and media." },
  { id: "social-post", label: "Social Post Generator", description: "Generate social media posts across platforms." },
  { id: "image-prompt", label: "Image Prompt Builder", description: "Build AI image generation prompts from descriptions." },
  { id: "transcript-cleaner", label: "Transcript Cleaner", description: "Clean and format raw transcripts for publication." },
  { id: "content-repurposer", label: "Content Repurposer", description: "Repurpose long-form content into short formats." },
  { id: "sponsor-pitch", label: "Sponsor Pitch Generator", description: "Generate sponsorship pitch decks and letters." },
  { id: "policy-doc", label: "Policy Document Helper", description: "Draft policy documents and compliance templates." },
  { id: "ai-system-planner", label: "AI System Planner", description: "Plan and outline AI agent systems for Troptions Cloud." },
];

export default async function AiStudioPage({ params }: Props) {
  const { namespace } = await params;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">AI Studio</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Troptions AI Studio</h1>
          <p className="mt-2 text-sm text-gray-400">AI writing, content creation, and document tools for Troptions members.</p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            All AI Studio tools are non-functional in this phase. No AI inference will occur.
            These are scaffolded tool cards for the production implementation.
          </p>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {AI_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 flex flex-col"
            >
              <h2 className="text-sm font-semibold text-white mb-2">{tool.label}</h2>
              <p className="text-xs text-gray-400 flex-1 mb-4">{tool.description}</p>
              <button
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-3 py-2 text-xs font-semibold text-gray-600"
              >
                Open Tool — Simulation Only
              </button>
            </div>
          ))}
        </div>

        {/* Link to AI Systems */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400 mb-2">Need a custom agent?</p>
          <p className="text-xs text-gray-400 mb-3">
            Use the AI System Builder to configure AI agent systems for your namespace.
            All systems require Control Hub approval.
          </p>
          <Link
            href={`/troptions-cloud/${namespace}/ai/systems`}
            className="inline-block rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
          >
            Go to AI System Builder →
          </Link>
        </div>
      </div>
    </div>
  );
}
