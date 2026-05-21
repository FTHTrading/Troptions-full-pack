"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TruthLabel = "LIVE" | "CONFIGURED" | "PENDING" | "LOCAL_ONLY" | "NOT_CONNECTED";

interface StatusItem {
  name: string;
  status: TruthLabel;
  detail: string;
  url?: string;
}

const LABEL_STYLES: Record<TruthLabel, string> = {
  LIVE: "text-green-400 border-green-400/40",
  CONFIGURED: "text-[#c99a3c] border-[#c99a3c]/40",
  PENDING: "text-blue-400 border-blue-400/30",
  LOCAL_ONLY: "text-purple-400 border-purple-400/30",
  NOT_CONNECTED: "text-[#8a94a6] border-white/10",
};

export default function DonkDexPage() {
  const [items, setItems] = useState<StatusItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ts, setTs] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/donk/dex/status")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) { setItems(d.items); setTs(d.generated_at); }
        else setError("Could not load status.");
      })
      .catch(() => setError("Network error."));
  }, []);

  return (
    <div className="min-h-screen bg-[#071426] px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
          DONK DEX
        </p>
        <h1 className="text-4xl font-bold text-white mb-5">Network Status</h1>
        <p className="text-[#8a94a6] mb-10 leading-relaxed max-w-2xl">
          Live truth labels for DONK&apos;s market infrastructure. Each connection is labeled exactly as it is — no fake green lights.
        </p>

        {/* Truth label legend */}
        <div className="flex flex-wrap gap-3 mb-10">
          {(Object.keys(LABEL_STYLES) as TruthLabel[]).map((k) => (
            <span key={k} className={`border text-xs font-semibold uppercase px-3 py-1 ${LABEL_STYLES[k]}`}>
              {k}
            </span>
          ))}
        </div>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        {items === null && !error && (
          <p className="text-[#8a94a6] text-sm">Loading status...</p>
        )}

        {items && (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.name}
                className="border border-white/5 bg-[#0b1f36] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="text-white font-semibold text-base mb-1">{item.name}</p>
                  <p className="text-[#8a94a6] text-sm">{item.detail}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c99a3c] text-xs font-mono hover:underline mt-1 inline-block"
                    >
                      {item.url}
                    </a>
                  )}
                </div>
                <span className={`border text-xs font-semibold uppercase px-3 py-1 shrink-0 ${LABEL_STYLES[item.status]}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {ts && (
          <p className="text-[#8a94a6] text-xs mt-6">
            Generated: {new Date(ts).toLocaleString()}
          </p>
        )}

        <div className="mt-10 flex gap-4">
          <Link
            href="/donk"
            className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors"
          >
            DONK Home
          </Link>
          <Link
            href="/donk/numbers"
            className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors"
          >
            DONK Numbers
          </Link>
        </div>
      </div>
    </div>
  );
}
