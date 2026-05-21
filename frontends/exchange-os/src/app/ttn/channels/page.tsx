import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "TROPTIONS TV — Channel Network",
  description:
    "8 sovereign broadcast channels: Sports, Music, Creators, Charity, Local, Business, Events, Web3. Each with independent content, monetization, and Solana proof layer.",
};

interface Channel {
  id: string;
  name: string;
  category: string;
  purpose: string;
  audience: string;
  content_types: string[];
  revenue_model: string;
  web3_utility: string;
  status: string;
}

function getChannels(): Channel[] {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "src/data/ttn/channels.json"),
    "utf-8",
  );
  return JSON.parse(raw);
}

const STATUS_LABEL: Record<string, string> = {
  active: "Live",
  "coming-soon": "Coming Soon",
};

export default function TTNChannelsPage() {
  const channels = getChannels();

  return (
    <div className="min-h-screen bg-[#071426]">
      {/* Hero */}
      <section className="relative py-28 px-6 text-center bg-[#050f1e] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c99a3c] to-transparent" />
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.3em] mb-6">
            TROPTIONS Television Network
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            8 channels.
            <br />
            One broadcast OS.
          </h1>
          <p className="text-[#8a94a6] text-xl max-w-2xl mx-auto leading-relaxed">
            Sports, Music, Creators, Charity, Local, Business, Events, Web3.
            Each channel is a sovereign broadcast unit — own content strategy, revenue model, and Solana proof layer.
          </p>
        </div>
      </section>

      {/* Channel grid */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="space-y-px bg-white/5">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className="bg-[#071426] p-10 hover:bg-[#0b1f36] transition-colors grid md:grid-cols-[1fr_2fr] gap-10"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-white font-bold text-xl">{ch.name}</p>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 ${
                      ch.status === "active"
                        ? "bg-[#c99a3c]/20 text-[#c99a3c] border border-[#c99a3c]/30"
                        : "bg-white/5 text-[#8a94a6] border border-white/10"
                    }`}
                  >
                    {STATUS_LABEL[ch.status] ?? ch.status}
                  </span>
                </div>
                <p className="text-[#8a94a6] text-sm leading-relaxed">{ch.purpose}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-wider mb-2">
                    Audience
                  </p>
                  <p className="text-[#8a94a6] text-sm">{ch.audience}</p>
                </div>
                <div>
                  <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-wider mb-2">
                    Revenue Model
                  </p>
                  <p className="text-[#8a94a6] text-sm">{ch.revenue_model}</p>
                </div>
                <div>
                  <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-wider mb-2">
                    Content
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {ch.content_types.map((ct) => (
                      <span
                        key={ct}
                        className="text-xs border border-white/10 text-[#8a94a6] px-2 py-0.5"
                      >
                        {ct}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-wider mb-2">
                    Web3 Utility
                  </p>
                  <p className="text-[#8a94a6] text-sm">{ch.web3_utility}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Launch CTA */}
      <section className="bg-[#050f1e] border-t border-white/5 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
            Own Your Channel
          </p>
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to launch your TTN channel?
          </h2>
          <p className="text-[#8a94a6] mb-10">
            Creators, businesses, events, charities, and sports brands — launch a sovereign broadcast channel on the TTN network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ttn/launch-channel"
              className="px-8 py-4 bg-[#c99a3c] text-[#071426] font-bold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
            >
              Launch a Channel
            </Link>
            <Link
              href="/ttn/infrastructure"
              className="px-8 py-4 border border-[#c99a3c]/40 text-[#c99a3c] font-bold text-sm uppercase tracking-wider hover:border-[#c99a3c] hover:text-white transition-colors"
            >
              View Infrastructure
            </Link>
          </div>
        </div>
      </section>

      {/* Footer disclaimer */}
      <section className="border-t border-white/5 py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
            Powered by TROPTIONS. Settled on Solana.
          </p>
          <p className="text-[#8a94a6] text-xs leading-relaxed">
            TROPTIONS is an independent fan-commerce and media activation network. No official FIFA, ESPN,
            Octagon, league, team, stadium, broadcaster, or rights-holder affiliation is claimed unless
            separately contracted. Official match coverage belongs to licensed rights holders.
          </p>
        </div>
      </section>
    </div>
  );
}
