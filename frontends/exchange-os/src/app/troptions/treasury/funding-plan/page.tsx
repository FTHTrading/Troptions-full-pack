import {
  TREASURY_FUNDING_PLAN,
  STABLECOIN_ISSUERS,
  summariseFundingPlan,
  type FundingWalletPlan,
  type StablecoinIssuerKey,
  type FundingChain,
  type TrustlineSpec,
} from "@/content/troptions/treasuryFundingPlanRegistry";
import {
  getXrplAccountLive,
  getXrplTrustlinesLive,
} from "@/lib/troptions/xrplLedgerEngine";
import { getStellarAccountLive } from "@/lib/troptions/stellarLedgerEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Troptions Treasury · Funding Plan | 11 XRP + 35 XLM Live Activation",
  description:
    "Real-world funding manifest for the Troptions multi-chain treasury — 3 XRPL wallets and 3 Stellar wallets sized to fit 11 XRP and 35 XLM, with stablecoin trustlines to USDC, RLUSD, Bitstamp USD, and Gatehub USD.",
};

// ─── Live status ─────────────────────────────────────────────────────────────

type LiveStatus = "live" | "not-funded" | "error";

interface LiveResult {
  readonly walletId: string;
  readonly status: LiveStatus;
  readonly nativeBalance?: string;
  readonly trustlineCount?: number;
  readonly error?: string;
}

async function probeXrpl(plan: FundingWalletPlan): Promise<LiveResult> {
  try {
    const acc = await getXrplAccountLive(plan.address);
    if (acc.error) {
      const notFunded = /actNotFound|Account not found/i.test(acc.error);
      return { walletId: plan.walletId, status: notFunded ? "not-funded" : "error", error: acc.error };
    }
    let count = 0;
    try {
      const tls = await getXrplTrustlinesLive(plan.address);
      count = tls.length;
    } catch {
      /* optional */
    }
    return { walletId: plan.walletId, status: "live", nativeBalance: acc.xrpBalance, trustlineCount: count };
  } catch (err) {
    return { walletId: plan.walletId, status: "error", error: err instanceof Error ? err.message : String(err) };
  }
}

async function probeStellar(plan: FundingWalletPlan): Promise<LiveResult> {
  try {
    const acc = await getStellarAccountLive(plan.address);
    if (acc.error) {
      const notFunded = /not_found|404/i.test(acc.error);
      return { walletId: plan.walletId, status: notFunded ? "not-funded" : "error", error: acc.error };
    }
    const tls = acc.balances.filter((b) => b.assetType !== "native").length;
    return { walletId: plan.walletId, status: "live", nativeBalance: acc.xlmBalance, trustlineCount: tls };
  } catch (err) {
    return { walletId: plan.walletId, status: "error", error: err instanceof Error ? err.message : String(err) };
  }
}

async function probeAll(): Promise<readonly LiveResult[]> {
  return Promise.all(
    TREASURY_FUNDING_PLAN.map((p) => (p.chain === "xrpl" ? probeXrpl(p) : probeStellar(p))),
  );
}

// ─── UI helpers ──────────────────────────────────────────────────────────────

function explorerUrl(chain: FundingChain, address: string): string {
  return chain === "xrpl"
    ? `https://xrpscan.com/account/${address}`
    : `https://stellar.expert/explorer/public/account/${address}`;
}

function shortAddr(a: string): string {
  if (!a || a.length <= 14) return a;
  return `${a.slice(0, 6)}…${a.slice(-6)}`;
}

const statusBadge: Record<LiveStatus, string> = {
  live: "bg-emerald-600 text-white",
  "not-funded": "bg-amber-600 text-white",
  error: "bg-red-600 text-white",
};

const chainPill: Record<FundingChain, string> = {
  xrpl: "bg-indigo-900/50 border-indigo-700 text-indigo-200",
  stellar: "bg-purple-900/50 border-purple-700 text-purple-200",
};

function StablecoinBadge({ issuerKey }: { issuerKey: StablecoinIssuerKey }) {
  const info = STABLECOIN_ISSUERS[issuerKey];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
      style={{
        borderColor: info.color,
        color: info.color,
        backgroundColor: `${info.color}1A`,
      }}
      title={`${info.issuerName} · ${info.regulator}`}
    >
      <span
        aria-hidden
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: info.color }}
      />
      {info.displayName}
      <span className="text-[10px] font-normal opacity-70">· {info.issuerName}</span>
    </span>
  );
}

function TrustlineRow({ tl }: { tl: TrustlineSpec }) {
  if (tl.issuer === "troptions-self") {
    return (
      <li className="flex items-center justify-between gap-3 rounded border border-slate-800 bg-slate-900/40 p-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700 bg-amber-900/30 px-2.5 py-0.5 text-xs font-semibold text-amber-200">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          TROPTIONS · self-issued
        </span>
        <span className="text-slate-300">{tl.purpose}</span>
        <span className="font-mono text-xs text-slate-400">limit {tl.limit}</span>
      </li>
    );
  }
  return (
    <li className="flex items-center justify-between gap-3 rounded border border-slate-800 bg-slate-900/40 p-2 text-sm">
      <StablecoinBadge issuerKey={tl.issuer} />
      <span className="text-slate-300">{tl.purpose}</span>
      <span className="font-mono text-xs text-slate-400">limit {tl.limit}</span>
    </li>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function FundingPlanPage() {
  const summary = summariseFundingPlan();
  const liveResults = await probeAll();
  const liveByWallet = new Map(liveResults.map((r) => [r.walletId, r]));

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-slate-950 px-6 py-12 text-slate-100">
      {/* Header */}
      <header className="mb-10 border-b border-slate-800 pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Treasury · Funding Plan · Live
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Activate the Troptions Treasury on Mainnet
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-300">
          Real wallet generation is complete. This page shows the consolidated 3-XRPL + 3-Stellar
          plan sized to fit your current exchange budget of <strong>11 XRP</strong> and{" "}
          <strong>35 XLM</strong>, with trustlines to <strong>USDC (Circle)</strong>,{" "}
          <strong>RLUSD (Ripple)</strong>, <strong>USD (Bitstamp)</strong>, and{" "}
          <strong>USD (Gatehub)</strong>.
        </p>

        {/* Summary tiles */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <SummaryTile label="XRPL wallets" value={String(summary.xrplWalletCount)} />
          <SummaryTile label="Stellar wallets" value={String(summary.stellarWalletCount)} />
          <SummaryTile label="XRP required" value={`${summary.totalXrpRequired} XRP`} />
          <SummaryTile label="XLM required" value={`${summary.totalXlmRequired} XLM`} />
          <SummaryTile label="Trustlines total" value={String(summary.totalTrustlines)} />
        </div>
      </header>

      {/* Stablecoins offered */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-slate-200">
          Stablecoin trustlines on this plan
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(STABLECOIN_ISSUERS).map((iss) => (
            <a
              key={iss.key}
              href={iss.attestationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-slate-900/40 p-3 transition hover:bg-slate-900"
              style={{ borderColor: `${iss.color}55` }}
              title={iss.notes}
            >
              <div className="mb-1 flex items-center gap-2">
                <span aria-hidden className="h-3 w-3 rounded-full" style={{ backgroundColor: iss.color }} />
                <span className="font-semibold" style={{ color: iss.color }}>
                  {iss.displayName}
                </span>
                <span className="text-xs text-slate-400">· {iss.issuerName}</span>
              </div>
              <p className="text-xs text-slate-400">{iss.regulator}</p>
            </a>
          ))}
        </div>
      </section>

      {/* XRPL Plan */}
      <PlanSection
        chain="xrpl"
        title="XRPL Treasury — 3 wallets · 11 XRP total"
        plans={TREASURY_FUNDING_PLAN.filter((w) => w.chain === "xrpl")}
        liveByWallet={liveByWallet}
      />

      {/* Stellar Plan */}
      <PlanSection
        chain="stellar"
        title="Stellar Treasury — 3 wallets · 35 XLM total"
        plans={TREASURY_FUNDING_PLAN.filter((w) => w.chain === "stellar")}
        liveByWallet={liveByWallet}
      />

      {/* Activation steps */}
      <section className="mt-10 rounded-xl border border-emerald-800 bg-emerald-950/30 p-6">
        <h2 className="mb-3 text-lg font-semibold text-emerald-300">
          Activation procedure
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>
            From your exchange, send the listed XRP / XLM amount to each address above (one
            transaction per wallet). Verify recipient address character-by-character.
          </li>
          <li>
            Refresh this page — the live-status pill flips from <em>not-funded</em> to{" "}
            <em>live</em> once the network confirms (XRPL ≈ 4 s, Stellar ≈ 5 s).
          </li>
          <li>
            Run <code className="rounded bg-slate-800 px-1">configureIssuerAccount()</code> on
            XRPL Wallet A and <code className="rounded bg-slate-800 px-1">
              configureStellarIssuer()
            </code>{" "}
            on Stellar Wallet A to apply the compliance flags shown for each wallet.
          </li>
          <li>
            Establish trustlines on Wallet B and Wallet C (XRPL) and Wallet B and Wallet C
            (Stellar) using the listed issuers.
          </li>
          <li>
            Authorize the distributor wallets via{" "}
            <code className="rounded bg-slate-800 px-1">AllowTrust</code> (Stellar) or simply by
            sending an issuance Payment (XRPL).
          </li>
          <li>
            Mint the operational TROPTIONS supply from the issuer to the distributor on each
            chain.
          </li>
        </ol>
      </section>

      <p className="mt-8 text-xs text-slate-500">
        Generated server-side · live-queried at request time · no seeds shown · all addresses
        public-side only.
      </p>
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-100">{value}</p>
    </div>
  );
}

function PlanSection({
  chain,
  title,
  plans,
  liveByWallet,
}: {
  chain: FundingChain;
  title: string;
  plans: readonly FundingWalletPlan[];
  liveByWallet: Map<string, LiveResult>;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
        <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wider ${chainPill[chain]}`}>
          {chain.toUpperCase()}
        </span>
        {title}
      </h2>
      <div className="space-y-6">
        {plans.map((p) => {
          const live = liveByWallet.get(p.walletId);
          return (
            <article
              key={p.walletId}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-100">{p.displayName}</h3>
                <div className="flex items-center gap-2">
                  {live && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[live.status]}`}
                    >
                      {live.status === "live"
                        ? `LIVE · ${Number(live.nativeBalance).toFixed(2)} ${chain === "xrpl" ? "XRP" : "XLM"} · ${live.trustlineCount ?? 0} trustlines`
                        : live.status === "not-funded"
                          ? "NOT FUNDED — send native asset to activate"
                          : `ERROR — ${live.error}`}
                    </span>
                  )}
                  <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-amber-300">
                    Fund {p.nativeFundingAmount} {chain === "xrpl" ? "XRP" : "XLM"}
                  </span>
                </div>
              </div>

              {/* Address line */}
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-slate-800 bg-slate-950 p-2.5 font-mono text-sm">
                <span className="text-slate-500">addr</span>
                <span className="text-emerald-300">{p.address}</span>
                <a
                  href={explorerUrl(chain, p.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-cyan-400 underline-offset-2 hover:underline"
                >
                  view on explorer ({shortAddr(p.address)})
                </a>
              </div>

              {/* Roles */}
              <div className="mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Combined roles
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {p.roleTags.map((rt) => (
                    <span
                      key={rt}
                      className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                    >
                      {rt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reserve breakdown */}
              <p className="mb-3 text-xs text-slate-400">{p.reserveBreakdown}</p>

              {/* Trustlines */}
              {p.trustlines.length > 0 && (
                <div className="mb-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Trustlines to establish ({p.trustlines.length})
                  </p>
                  <ul className="space-y-1.5">
                    {p.trustlines.map((tl, i) => (
                      <TrustlineRow key={i} tl={tl} />
                    ))}
                  </ul>
                </div>
              )}

              {/* Compliance flags */}
              {p.complianceFlags.length > 0 && (
                <div className="mb-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Compliance flags
                  </p>
                  <ul className="space-y-1">
                    {p.complianceFlags.map((c) => (
                      <li key={c.key} className="flex items-start gap-2 text-xs">
                        <span
                          className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                            c.required ? "bg-rose-900/40 text-rose-300" : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {c.required ? "REQ" : "opt"}
                        </span>
                        <span className="text-slate-300">
                          <strong>{c.displayLabel}</strong> — <span className="text-slate-400">{c.note}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              <p className="text-xs italic text-slate-500">{p.notes}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
