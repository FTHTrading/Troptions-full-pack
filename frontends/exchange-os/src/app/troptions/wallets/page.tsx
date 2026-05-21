import Image from "next/image";
import { WALLET_INFRASTRUCTURE } from "@/content/troptions/demoWalletShowcaseRegistry";
import CopyAddressButton from "@/components/troptions-evolution/CopyAddressButton";

export const metadata = {
  title: "TROPTIONS Wallets | Live XRPL & Stellar Deployment",
  description: "Live TROPTIONS wallet infrastructure on XRPL and Stellar mainnet. Issuer, distribution, AMM, DEX traders, and Stellar bridge wallets — all confirmed funded 2026-04-28.",
};

const XRPL_WALLETS = WALLET_INFRASTRUCTURE.filter((w) => w.network === "XRPL");
const STELLAR_WALLETS = WALLET_INFRASTRUCTURE.filter((w) => w.network === "Stellar");

const walletTypeBadge: Record<string, { label: string; color: string }> = {
  issuer:       { label: "Issuer",       color: "bg-amber-50 text-amber-700 border-amber-200" },
  distribution: { label: "Distribution", color: "bg-blue-50 text-blue-700 border-blue-200" },
  trading:      { label: "Trader",       color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  treasury:     { label: "Holder",       color: "bg-purple-50 text-purple-700 border-purple-200" },
  liquidity:    { label: "Liquidity",    color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  anchor:       { label: "Anchor",       color: "bg-rose-50 text-rose-700 border-rose-200" },
  evidence:     { label: "Evidence",     color: "bg-slate-100 text-slate-600 border-slate-200" },
};

const TOKEN_STATS = [
  { label: "Price",       value: "$0.0114",     sub: "USD" },
  { label: "Supply",      value: "100,000,000", sub: "TROPTIONS" },
  { label: "Market Cap",  value: "$1.14 M",     sub: "USD" },
  { label: "AMM TVL",     value: "$7.91",       sub: "TROPTIONS / XRP" },
  { label: "24 H Volume", value: "$5.67",       sub: "USD" },
  { label: "Holders",     value: "3",           sub: "XRPL accounts" },
  { label: "Trustlines",  value: "4",           sub: "established" },
  { label: "USDC Issued", value: "175M",        sub: "XRPL mainnet" },
];

export default function TroptionsWalletPage() {
  return (
    <main className="te-page">
      <div className="te-wrap space-y-8">

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <header className="te-panel overflow-hidden">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/troptions/logos/troptions-t-logo-black.jpg"
                  alt="TROPTIONS T logo"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-xl object-contain"
                  priority
                />
                <div>
                  <p className="te-kicker">Live Deployment · XRPL &amp; Stellar Mainnet</p>
                  <h1 className="te-heading">TROPTIONS Wallets</h1>
                </div>
              </div>
              <p className="te-subheading max-w-2xl">
                All seven TROPTIONS wallets confirmed funded and operational on 2026-04-28.
                Issuer, distribution, AMM pool, DEX traders, and Stellar bridge — every address is live and verifiable on-chain.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-lg bg-(--gold) px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  View Token on XRPScan ↗
                </a>
                <a
                  href="https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  XRPL Ledger Explorer ↗
                </a>
              </div>
            </div>
            <Image
              src="/assets/troptions/logos/troptions-logo-new-official.jpg"
              alt="TROPTIONS official logo"
              width={200}
              height={200}
              className="h-auto w-40 rounded-2xl object-contain shadow-md md:w-48"
              priority
            />
          </div>
        </header>

        {/* ── Live Token Stats ───────────────────────────────────────────────── */}
        <section aria-label="Live token stats">
          <p className="te-kicker mb-3">Live Token Data · XRPL Mainnet</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {TOKEN_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 rounded-2xl border border-(--gold-light) bg-linear-to-br from-(--navy) to-(--navy-2) px-4 py-4 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--gold-light)">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-white leading-tight">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── XRPL Wallets ──────────────────────────────────────────────────── */}
        <section aria-label="XRPL wallet cards">
          <p className="te-kicker mb-4">XRPL Mainnet — {XRPL_WALLETS.length} Wallets</p>
          <div className="te-grid-2">
            {XRPL_WALLETS.map((wallet) => {
              const badge = walletTypeBadge[wallet.walletType] ?? { label: wallet.walletType, color: "bg-slate-100 text-slate-600 border-slate-200" };
              return (
                <article key={wallet.id} className="te-panel flex flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="te-kicker">{wallet.network}</p>
                      <h2 className="text-xl font-semibold text-slate-900">{wallet.label}</h2>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-sm leading-7 text-slate-700">{wallet.summary}</p>

                  {wallet.address && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Public Address</p>
                      <p className="mt-2 break-all font-mono text-sm text-slate-800">{wallet.address}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <CopyAddressButton address={wallet.address} />
                        {wallet.explorerLinks.map((link) => (
                          <a
                            key={`${wallet.id}-${link.label}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100"
                          >
                            {link.label} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {wallet.poolReferences && wallet.poolReferences.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">AMM / LP Pairs</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {wallet.poolReferences.map((pool) => (
                          <a
                            key={`${wallet.id}-${pool.pair}`}
                            href={pool.verificationUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="rounded-full border border-(--gold-light) bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                          >
                            {pool.pair} · {pool.status}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {wallet.assets.map((asset) => (
                      <span
                        key={`${wallet.id}-${asset.symbol}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                        title={asset.purpose}
                      >
                        {asset.symbol}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Stellar Wallets ───────────────────────────────────────────────── */}
        <section aria-label="Stellar wallet cards">
          <p className="te-kicker mb-4">Stellar Mainnet — {STELLAR_WALLETS.length} Wallets</p>
          <div className="te-grid-2">
            {STELLAR_WALLETS.map((wallet) => {
              const badge = walletTypeBadge[wallet.walletType] ?? { label: wallet.walletType, color: "bg-slate-100 text-slate-600 border-slate-200" };
              return (
                <article key={wallet.id} className="te-panel flex flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="te-kicker">{wallet.network}</p>
                      <h2 className="text-xl font-semibold text-slate-900">{wallet.label}</h2>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-sm leading-7 text-slate-700">{wallet.summary}</p>

                  {wallet.address && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Public Address</p>
                      <p className="mt-2 break-all font-mono text-sm text-slate-800">{wallet.address}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <CopyAddressButton address={wallet.address} />
                        {wallet.explorerLinks.map((link) => (
                          <a
                            key={`${wallet.id}-${link.label}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100"
                          >
                            {link.label} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {wallet.poolReferences && wallet.poolReferences.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">AMM / LP Pairs</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {wallet.poolReferences.map((pool) => (
                          <a
                            key={`${wallet.id}-${pool.pair}`}
                            href={pool.verificationUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="rounded-full border border-(--gold-light) bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                          >
                            {pool.pair} · {pool.status}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {wallet.assets.map((asset) => (
                      <span
                        key={`${wallet.id}-${asset.symbol}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                        title={asset.purpose}
                      >
                        {asset.symbol}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Deployment Summary ────────────────────────────────────────────── */}
        <section className="te-panel" aria-label="Deployment summary">
          <p className="te-kicker">Deployment Summary · 2026-04-28</p>
          <div className="te-grid-3 mt-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900">XRPL Chain</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">5 wallets live — issuer, distribution+AMM, 2 traders, 1 holder. TROPTIONS/XRP AMM created. 100M TROPTIONS issued.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900">Stellar Chain</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">2 wallets funded — issuer (5 XLM, ledger 62321764) and distribution (15 XLM, ledger 62321765). Cross-chain bridge ready.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900">TROPTIONS-Only Registry</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">This registry is TROPTIONS-only. All legacy, UnyKorn, USDF, and compromised wallet references have been removed.</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}



