import type { Metadata } from "next";
import { TTN_CREATORS } from "@/content/ttn/creatorRegistry";
import { CreatorCard } from "@/components/ttn/CreatorCard";

export const metadata: Metadata = {
  title: "Creators",
  description: "Meet the creators publishing on Troptions Television Network.",
};

export default function CreatorsPage() {
  const active = TTN_CREATORS.filter((c) => c.status === "active");
  const draft = TTN_CREATORS.filter((c) => c.status === "draft" || c.status === "pending");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">TTN Publishing</p>
        <h1 className="text-3xl font-bold text-white">Creators</h1>
        <p className="mt-3 max-w-xl text-sm text-gray-400">
          The individuals and teams producing channels, news, podcasts, and films on TTN CreatorOS.
        </p>
      </div>

      {active.length > 0 && (
        <div className="mb-12">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-green-400">Active Creators</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((c) => (
              <CreatorCard key={c.id} creator={c} />
            ))}
          </div>
        </div>
      )}

      {draft.length > 0 && (
        <div>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">Onboarding</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {draft.map((c) => (
              <CreatorCard key={c.id} creator={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
