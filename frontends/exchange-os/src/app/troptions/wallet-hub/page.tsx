import Image from "next/image";
import Link from "next/link";
import CopyAddressButton from "@/components/troptions-evolution/CopyAddressButton";
import {
  getRecentWalletActivity,
  getTroptionsWalletHubSnapshot,
  TROPTIONS_WALLET_HUB_SAFETY_STATEMENT,
} from "@/lib/troptions/troptionsWalletHubEngine";

export const metadata = {
  title: "TROPTIONS Wallet Hub",
  description:
    "Institutional wallet dashboard for TROPTIONS XRPL, Stellar mirror, x402 rails, internal ledger, and approval-gated transfer simulation.",
};

const SECTION_LABELS: Array<{
  key: string;
  title: string;
  includeNetworks?: string[];
  includeRoles?: string[];
}> = [
  { key: "treasury", title: "Treasury", includeRoles: ["TREASURY", "DISTRIBUTION", "AMM_POOL"] },
  { key: "wallets", title: "Wallets", includeNetworks: ["XRPL", "STELLAR", "INTERNAL"] },
  { key: "card", title: "Card", includeNetworks: ["CARD"] },
  { key: "x402", title: "x402", includeNetworks: ["X402"] },
  { key: "mesh", title: "Mesh", includeNetworks: ["MESH"] },
  { key: "pay", title: "Pay", includeNetworks: ["X402", "INTERNAL"] },
  { key: "sign", title: "Sign" },
];

function filterWallets(
  wallets: ReturnType<typeof getTroptionsWalletHubSnapshot>["wallets"],
  cfg: { includeNetworks?: string[]; includeRoles?: string[] },
) {
  return wallets.filter((w) => {
    const netOk = !cfg.includeNetworks || cfg.includeNetworks.includes(w.network);
    const roleOk = !cfg.includeRoles || cfg.includeRoles.includes(w.role);
    return netOk && roleOk;
  });
}

export default function TroptionsWalletHubPage() {
  const snapshot = getTroptionsWalletHubSnapshot();
  const recent = getRecentWalletActivity();

  const primaryBalances = [
    { asset: "TROPTIONS", rail: "XRPL Mainnet", amount: "99,999,000", note: "Primary issuance rail" },
    { asset: "USDT", rail: "XRPL IOU", amount: "100,000,000", note: "Stable-value gateway rail" },
    { asset: "USDC", rail: "XRPL IOU + Stellar Mirror", amount: "175,000,000", note: "100M (Apr 28) + 75M (May 1) — mainnet verified" },
    { asset: "DAI", rail: "Stellar Mirror", amount: "50,000,000", note: "Mirror settlement rail" },
    { asset: "EURC", rail: "Stellar Mirror", amount: "50,000,000", note: "EUR settlement mirror rail" },
    { asset: "FTH USD", rail: "Internal Ledger", amount: "Reported", note: "Internal accounting sample" },
    { asset: "x402 Credit", rail: "x402 Payment Rail", amount: "Active", note: "Approval-gated" },
    { asset: "LP Shares", rail: "AMM / Stellar LP", amount: "31,622.78 + 100", note: "XRPL + Stellar LP records" },
  ];

  return (
    <main className="te-page">
      <div className="te-wrap space-y-8">
        <header className="te-panel">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="te-kicker">TROPTIONS · Institutional Operations</p>
              <h1 className="te-heading">Wallet Hub</h1>
              <p className="te-subheading max-w-3xl">
                Genesis / Treasury / x402 / Mesh / Pay control surface for TROPTIONS XRPL and Stellar rails.
                All transfers default to approval-gated workflows and remain subject to jurisdiction-specific legal, compliance, operator,
                and runtime controls.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {[
                  "Genesis Wallet",
                  "XRPL Mainnet",
                  "Stellar Mirror Rail",
                  "x402 Payment Rail",
                  "Treasury Wallets",
                  "Card / Mesh / Pay",
                ].map((chip) => (
                  <span key={chip} className="rounded-full border border-[#C9A84C]/35 bg-[#071426] px-3 py-1 text-[11px] font-semibold text-[#f0cf82]">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-[#C9A84C]/25 bg-[#0a1a2e] p-4">
              <Image
                src="/assets/troptions/logos/wallet-hub.svg"
                alt="TROPTIONS Wallet Hub"
                width={78}
                height={78}
                className="h-[78px] w-[78px] rounded-xl border border-[#C9A84C]/30"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Genesis Control</p>
                <p className="text-sm font-semibold text-white">Chain IDs 7331 / 7332</p>
                <p className="text-xs text-slate-400">Read-only by default</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "TROPTIONS Genesis Wallet", value: "Active", sub: "Operator-visible" },
            { label: "XRPL Mainnet", value: "Healthy", sub: "Issuer / distribution" },
            { label: "Stellar Mirror Rail", value: "Reported", sub: "Verifier pending" },
            { label: "x402 Payment Rail", value: "Simulation", sub: "Approval-gated" },
            { label: "Treasury Wallets", value: `${snapshot.wallets.length}`, sub: "Registered records" },
            { label: "Card / Mesh / Pay", value: "Gated", sub: "No auto-send" },
          ].map((card) => (
            <article key={card.label} className="rounded-2xl border border-[#C9A84C]/20 bg-[#091a2f] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-[#f0cf82]">{card.value}</p>
              <p className="text-xs text-slate-400">{card.sub}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0a1628] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="te-kicker">Operator Profile</p>
              <h2 className="text-2xl font-semibold text-white">Kevan Burns</h2>
              <p className="text-sm text-slate-300">Chairman · Principal Operator</p>
              <p className="text-sm text-slate-400">kevan@unykorn.org</p>
            </div>
            <span className="rounded-full border border-amber-500/45 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
              Role: Operator · Status: Read-only / Approval-gated
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b1526] p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {SECTION_LABELS.map((s) => (
              <span key={s.key} className="rounded-md border border-slate-600 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-200">
                {s.title}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-400">
            Wallet Hub separates XRPL issued assets, Stellar mirror rails, x402 rails, internal ledger balances, and pending/simulated transfers.
          </p>
        </section>

        <section className="rounded-2xl border border-[#C9A84C]/20 bg-[#091a2f] p-5">
          <p className="te-kicker">Genesis Balances</p>
          <h2 className="mb-4 text-xl font-semibold text-white">Main Balances</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {primaryBalances.map((b) => (
              <article key={`${b.asset}-${b.rail}`} className="rounded-xl border border-white/10 bg-[#0b1526] p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{b.rail}</p>
                <p className="mt-1 text-lg font-bold text-[#f0cf82]">{b.asset}</p>
                <p className="text-sm text-white">{b.amount}</p>
                <p className="text-xs text-slate-400">{b.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {snapshot.chainHealth.map((h) => (
            <article key={h.rail} className="rounded-xl border border-white/10 bg-[#0a1628] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Chain Health</p>
              <p className="mt-1 text-base font-semibold text-white">{h.rail}</p>
              <p className="text-xs text-[#f0cf82]">{h.status}</p>
              <p className="mt-2 text-xs text-slate-400">{h.note}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b1526] p-5">
          <p className="te-kicker">Recent Ledger Activity</p>
          <h2 className="text-xl font-semibold text-white">Imported Internal Ledger Activity</h2>
          <p className="mb-4 text-sm text-amber-300">
            Imported internal ledger activity / demonstration until live TROPTIONS transfer records are connected.
          </p>
          <div className="space-y-2">
            {recent.map((activity) => (
              <div key={activity.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-100">{activity.note}</p>
                  <p className="text-xs text-slate-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
                <span className="rounded-full border border-slate-600 px-2 py-1 text-xs text-slate-300">{activity.category}</span>
              </div>
            ))}
          </div>
        </section>

        {SECTION_LABELS.filter((s) => s.key !== "sign").map((section) => {
          const wallets = filterWallets(snapshot.wallets, section);
          if (wallets.length === 0) return null;
          return (
            <section key={section.key} className="rounded-2xl border border-white/10 bg-[#0a1628] p-5">
              <p className="te-kicker">{section.title}</p>
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                {wallets.map((wallet) => (
                  <article key={wallet.id} className="rounded-xl border border-white/10 bg-[#0d1b30] p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-white">{wallet.displayName}</h3>
                        <p className="text-xs text-slate-400">{wallet.role} · {wallet.network}</p>
                      </div>
                      <span className="rounded-full border border-slate-600 px-2 py-1 text-[11px] text-slate-300">{wallet.status}</span>
                    </div>
                    {wallet.address ? (
                      <div className="mb-3 rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                        <p className="text-[11px] uppercase tracking-[0.1em] text-slate-500">Address</p>
                        <p className="mt-1 break-all font-mono text-xs text-slate-200">{wallet.address}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <CopyAddressButton address={wallet.address} />
                          {wallet.explorerLinks?.xrpscan ? (
                            <a className="text-xs text-[#f0cf82] hover:underline" href={wallet.explorerLinks.xrpscan} target="_blank" rel="noreferrer noopener">XRPScan ↗</a>
                          ) : null}
                          {wallet.explorerLinks?.bithomp ? (
                            <a className="text-xs text-[#f0cf82] hover:underline" href={wallet.explorerLinks.bithomp} target="_blank" rel="noreferrer noopener">Bithomp ↗</a>
                          ) : null}
                          {wallet.explorerLinks?.stellarExpert ? (
                            <a className="text-xs text-[#7dd3fc] hover:underline" href={wallet.explorerLinks.stellarExpert} target="_blank" rel="noreferrer noopener">Stellar Expert ↗</a>
                          ) : null}
                          {wallet.explorerLinks?.stellarChain ? (
                            <a className="text-xs text-[#7dd3fc] hover:underline" href={wallet.explorerLinks.stellarChain} target="_blank" rel="noreferrer noopener">StellarChain ↗</a>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                    <p className="mb-2 text-xs text-slate-400">{wallet.publicDescription}</p>
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {wallet.assetBalances.map((bal) => (
                        <span key={`${wallet.id}-${bal.assetCode}-${bal.displayName}`} className="rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-[11px] text-slate-200">
                          {bal.assetCode}: {bal.amount}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-2xl border border-[#C9A84C]/30 bg-[#0a1a2e] p-5">
          <p className="te-kicker">Transfer Panel</p>
          <h2 className="text-xl font-semibold text-white">Controlled Transfer Intent</h2>
          <p className="mt-1 text-sm text-slate-400">
            Build a transfer intent, simulate impact, and request approvals. Live signing remains disabled until all gates pass.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              From Wallet
              <select className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100">
                {snapshot.wallets.map((w) => (
                  <option key={`from-${w.id}`} value={w.id}>{w.displayName}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-300">
              To Wallet
              <select className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100">
                {snapshot.wallets.map((w) => (
                  <option key={`to-${w.id}`} value={w.id}>{w.displayName}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-300">
              Asset
              <input className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100" defaultValue="TROPTIONS" />
            </label>
            <label className="text-sm text-slate-300">
              Amount
              <input className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100" defaultValue="100" />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Memo
              <input className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100" placeholder="Deal reference / settlement memo" />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Route Type
              <select className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100">
                {[
                  "XRPL_IOU_PAYMENT",
                  "STELLAR_ASSET_PAYMENT",
                  "X402_CREDIT_TRANSFER",
                  "INTERNAL_LEDGER_TRANSFER",
                  "CARD_PAYMENT",
                  "MESH_PAYMENT",
                ].map((route) => (
                  <option key={route} value={route}>{route}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-lg bg-[#c99a3c] px-4 py-2 text-sm font-semibold text-slate-900">Simulate Transfer</button>
            <button className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200">Generate Receipt</button>
            <button className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200">Request Approval</button>
            <button disabled className="cursor-not-allowed rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-500">
              Sign / Submit (Disabled)
            </button>
          </div>

          <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Live signing requires operator approval, secure signer, legal/compliance gate, and runtime env flags.
          </p>
          <p className="mt-2 text-xs text-slate-500">{TROPTIONS_WALLET_HUB_SAFETY_STATEMENT}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b1526] p-4">
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/troptions/wallets" className="text-[#f0cf82] hover:underline">Legacy Wallet Surface</Link>
            <Link href="/troptions/stablecoins" className="text-[#f0cf82] hover:underline">Stablecoin Rails</Link>
            <Link href="/troptions/verification" className="text-[#f0cf82] hover:underline">Proof of Issuance</Link>
            <a href="/api/troptions/wallet-hub" className="text-[#f0cf82] hover:underline">Wallet Hub API</a>
          </div>
        </section>
      </div>
    </main>
  );
}
