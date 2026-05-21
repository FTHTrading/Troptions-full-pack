/**
 * Exchange Readiness Dashboard
 * /troptions/exchange-readiness
 *
 * Displays exchange listing requirements, checklist status, and submission
 * links for XRPL DEX, Stellar DEX, Bitrue, Gate.io, KuCoin, Binance, Coinbase.
 */
import React from "react";
import {
  EXCHANGE_LISTING_REGISTRY,
  TROPTIONS_TOKEN_INFO,
  COMPLIANCE_CHECKLIST,
  TROPTIONS_TRADING_PAIRS,
  getListingReadinessSummary,
  type ExchangeListingRequirement,
} from "@/content/troptions/exchangeListingRegistry";

export const metadata = {
  title: "Exchange Readiness | TROPTIONS",
  description:
    "TROPTIONS exchange listing readiness dashboard — DEX auto-listing, CEX requirements, compliance checklist, and token metadata for Binance, Coinbase, XRPL DEX, Stellar DEX.",
};

const TIER_COLOR: Record<string, string> = {
  auto:      "text-emerald-400 border-emerald-700/40 bg-emerald-900/20",
  standard:  "text-blue-400   border-blue-700/40   bg-blue-900/20",
  premium:   "text-amber-400  border-amber-700/40  bg-amber-900/20",
  strategic: "text-purple-400 border-purple-700/40 bg-purple-900/20",
};

const STATUS_COLOR: Record<string, string> = {
  ready:       "text-emerald-400",
  "in-progress": "text-amber-400",
  pending:     "text-slate-400",
};

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    "not-started": "bg-slate-700/60  text-slate-300",
    "in-progress": "bg-amber-700/60  text-amber-300",
    submitted:     "bg-blue-700/60   text-blue-300",
    listed:        "bg-emerald-700/60 text-emerald-300",
    rejected:      "bg-red-700/60    text-red-300",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono ${colorMap[status] ?? "bg-slate-800 text-slate-400"}`}>
      {status}
    </span>
  );
}

function ExchangeCard({ entry }: { entry: ExchangeListingRequirement }) {
  const tierClass = TIER_COLOR[entry.tier] ?? "text-slate-400 border-slate-700/40 bg-slate-900/20";
  const readyCount = entry.requirements.filter(r => r.status === "ready").length;
  const pct = Math.round((readyCount / entry.requirements.length) * 100);

  return (
    <article className="rounded-xl border border-slate-800 bg-[#0F1923] p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            {entry.type === "dex" ? "DEX" : "CEX"} · {entry.network}
          </p>
          <h3 className="text-lg font-bold mt-0.5">{entry.venue}</h3>
        </div>
        <StatusBadge status={entry.status} />
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className={`px-2 py-0.5 rounded border text-xs ${tierClass}`}>
          {entry.tier}
        </span>
        <span className="px-2 py-0.5 rounded border border-slate-700/40 bg-slate-800/40 text-slate-400">
          {entry.estimatedCost}
        </span>
        <span className="px-2 py-0.5 rounded border border-slate-700/40 bg-slate-800/40 text-slate-400">
          {entry.timelineEstimate}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Checklist progress</span>
          <span>{readyCount} / {entry.requirements.length} ready ({pct}%)</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#C9A84C] w-(--progress-w)"
            style={{ '--progress-w': `${pct}%` } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Requirements */}
      <ul className="space-y-1">
        {entry.requirements.map((req, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={`mt-0.5 shrink-0 ${STATUS_COLOR[req.status] ?? "text-slate-400"}`}>
              {req.status === "ready" ? "✓" : req.status === "in-progress" ? "◈" : "○"}
            </span>
            <span className="text-slate-300">{req.item}</span>
            {req.notes && (
              <span className="text-slate-500 text-xs ml-1">— {req.notes}</span>
            )}
          </li>
        ))}
      </ul>

      {/* Integration notes */}
      {entry.integrationNotes.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300 select-none">
            Integration notes ({entry.integrationNotes.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {entry.integrationNotes.map((note, i) => (
              <li key={i} className="text-xs text-slate-400 pl-3 border-l border-slate-700">
                {note}
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Submission link */}
      <div className="pt-1">
        <a
          href={entry.submissionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#C9A84C] hover:underline font-mono"
        >
          {entry.submissionUrl}
        </a>
      </div>

      {entry.notes && (
        <p className="text-xs text-slate-500 italic">{entry.notes}</p>
      )}
    </article>
  );
}

export default function ExchangeReadinessPage() {
  const summary = getListingReadinessSummary();
  const dexEntries = EXCHANGE_LISTING_REGISTRY.filter(e => e.type === "dex");
  const cexEntries = EXCHANGE_LISTING_REGISTRY.filter(e => e.type === "cex");
  const xrplPairs  = TROPTIONS_TRADING_PAIRS.filter(p => p.network === "XRPL");
  const stellarPairs = TROPTIONS_TRADING_PAIRS.filter(p => p.network === "Stellar");
  const cexPairs   = TROPTIONS_TRADING_PAIRS.filter(p => p.network === "CEX");

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-14">

        {/* Header */}
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            TROPTIONS · Exchange Readiness
          </p>
          <h1 className="text-4xl font-bold">Exchange Listing Readiness</h1>
          <p className="max-w-3xl text-base text-slate-400 leading-7">
            Real-time checklist of requirements for listing TROPTIONS ({TROPTIONS_TOKEN_INFO.ticker}) on
            XRPL DEX, Stellar DEX, Bitrue, Gate.io, KuCoin, Binance, and Coinbase.
            Max supply: {TROPTIONS_TOKEN_INFO.maxSupply} · Asset: {TROPTIONS_TOKEN_INFO.tokenType}.
          </p>
        </header>

        {/* Summary Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Venues",     value: summary.total        },
            { label: "Auto-Listed (DEX)",  value: summary.autoListings  },
            { label: "CEX Targets",       value: summary.cexListings   },
            { label: "Listed",           value: summary.listed        },
          ].map(stat => (
            <article key={stat.label} className="rounded-xl border border-slate-800 bg-[#0F1923] p-4 text-center">
              <p className="text-3xl font-bold text-[#C9A84C]">{stat.value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </article>
          ))}
        </section>

        {/* Token Identity */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">Token Identity</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Name",          value: TROPTIONS_TOKEN_INFO.name          },
              { label: "Exchange Ticker", value: TROPTIONS_TOKEN_INFO.ticker      },
              { label: "Max Supply",    value: TROPTIONS_TOKEN_INFO.maxSupply     },
              { label: "Circulating",   value: TROPTIONS_TOKEN_INFO.circulatingSupply },
              { label: "XRPL Currency", value: `${TROPTIONS_TOKEN_INFO.xrplCurrencyCode} (${TROPTIONS_TOKEN_INFO.xrplCurrencyHex.slice(0,8)}…)` },
              { label: "Stellar Asset", value: `${TROPTIONS_TOKEN_INFO.stellarAssetCode} @ ${TROPTIONS_TOKEN_INFO.stellarHomeDomain}` },
            ].map(item => (
              <div key={item.label} className="rounded-lg bg-[#0F1923] border border-slate-800 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-500">{item.label}</p>
                <p className="text-sm font-mono text-white mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trading Pairs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            Target Trading Pairs ({TROPTIONS_TRADING_PAIRS.length})
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] mb-2">XRPL DEX</p>
              <ul className="space-y-1">
                {xrplPairs.map((p, i) => (
                  <li key={i} className="text-sm font-mono text-slate-300">
                    {p.base}/{p.quote} · {p.venue}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] mb-2">Stellar DEX</p>
              <ul className="space-y-1">
                {stellarPairs.map((p, i) => (
                  <li key={i} className="text-sm font-mono text-slate-300">
                    {p.base}/{p.quote} · {p.venue}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] mb-2">CEX Targets</p>
              <ul className="space-y-1">
                {cexPairs.map((p, i) => (
                  <li key={i} className="text-sm font-mono text-slate-300">
                    {p.base}/{p.quote} · {p.venue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* DEX Auto-Listings */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            DEX &amp; Tracking Listings ({dexEntries.length})
          </h2>
          <p className="text-sm text-slate-500">
            DEX listings are automatic once trustlines and offers exist on-chain. Tracking sites (CoinGecko, CMC) require a form submission.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {dexEntries.map(e => <ExchangeCard key={e.id} entry={e} />)}
          </div>
        </section>

        {/* CEX Listings */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            CEX Listings ({cexEntries.length})
          </h2>
          <p className="text-sm text-slate-500">
            Recommended order: Bitrue → Gate.io → KuCoin → CoinGecko/CMC tracking → Binance → Coinbase.
            Build XRPL DEX volume first — most CEXs require demonstrated trading history.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {cexEntries.map(e => <ExchangeCard key={e.id} entry={e} />)}
          </div>
        </section>

        {/* Compliance Checklist */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            Compliance &amp; Legal Checklist
          </h2>
          <div className="rounded-xl border border-slate-800 bg-[#0F1923] p-5 space-y-3">
            {COMPLIANCE_CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 shrink-0 ${STATUS_COLOR[item.status] ?? "text-slate-400"}`}>
                  {(item.status as string) === "ready" ? "✓" : item.status === "in-progress" ? "◈" : "○"}
                </span>
                <div>
                  <span className="text-slate-200">{item.item}</span>
                  {"notes" in item && item.notes && (
                    <span className="text-slate-500 text-xs ml-2">— {item.notes}</span>
                  )}
                </div>
                <span className="ml-auto shrink-0">
                  <span className={`text-xs ${STATUS_COLOR[item.status] ?? "text-slate-500"}`}>
                    {item.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3">
          <a href="/troptions/xrpl-platform/genesis" className="px-4 py-2 rounded-lg border border-[#C9A84C]/40 text-[#C9A84C] text-sm hover:bg-[#C9A84C]/10">
            XRPL Genesis
          </a>
          <a href="/troptions/stellar" className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">
            Stellar Ecosystem
          </a>
          <a href="/troptions/xrpl-platform" className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">
            XRPL Platform
          </a>
          <a href="/troptions/wallet-forensics" className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">
            Wallet Forensics
          </a>
        </div>

      </div>
    </main>
  );
}
