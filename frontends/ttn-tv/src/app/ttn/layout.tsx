import type { ReactNode } from "react";
import Link from "next/link";
import { TtnNav } from "@/components/ttn/TtnNav";

export const metadata = {
  title: {
    default: "Troptions Television Network",
    template: "%s — TTN",
  },
  description:
    "Troptions Television Network (TTN) — creator-first, media-first, proof-backed channels, blogs, podcasts, films, and Web3-enhanced publishing platform.",
};

export default function TtnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      <TtnNav />
      <main>{children}</main>
      <footer className="mt-24 border-t border-gray-800 bg-[#050810] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">TTN</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Troptions Television Network — creator-first, proof-backed media infrastructure.
              </p>
            </div>
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Watch</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li><Link href="/ttn/channels" className="hover:text-white transition-colors">Channels</Link></li>
                <li><Link href="/ttn/films" className="hover:text-white transition-colors">Films</Link></li>
                <li><Link href="/ttn/podcasts" className="hover:text-white transition-colors">Podcasts</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Publish</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li><Link href="/ttn/studio" className="hover:text-white transition-colors">Creator Studio</Link></li>
                <li><Link href="/ttn/creators" className="hover:text-white transition-colors">Creators</Link></li>
                <li><Link href="/ttn/news" className="hover:text-white transition-colors">Newsroom</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Proof</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li><Link href="/ttn/proof" className="hover:text-white transition-colors">Proof Registry</Link></li>
                <li><a href="/troptions/diligence/source-map" className="hover:text-white transition-colors">Source Map</a></li>
                <li><a href="/troptions" className="hover:text-white transition-colors">Troptions Platform</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-[10px] text-gray-600 leading-relaxed">
            <p>
              Troptions Television Network is a media and content publishing platform. It is not a financial institution,
              investment advisor, broker-dealer, or securities issuer. All content is informational only.
              Proof records are IPFS fingerprints — not legal copyright registration or ownership certificates.
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} FTH Trading / Troptions. All rights reserved where applicable.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
