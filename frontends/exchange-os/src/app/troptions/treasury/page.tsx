import { getTreasurySnapshot, type RoleSnapshot } from "@/lib/troptions/treasuryEngine";
import type {
  TreasuryChain,
  TreasuryClassification,
  TreasuryTier,
  TreasuryProvisionStatus,
} from "@/content/troptions/treasuryTopologyRegistry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Troptions Treasury | SR-Level Mainnet Topology",
  description:
    "Live treasury topology for the Troptions multi-chain system: 11 XRPL roles plus 35 Stellar roles spanning issuance, distribution, custody, settlement, market-making, anchor, and compliance hold rails.",
};

// ─── Style tokens ─────────────────────────────────────────────────────────────

const tierStyle: Record<TreasuryTier, string> = {
  cold:        "bg-blue-900/40 border-blue-700/60 text-blue-200",
  warm:        "bg-amber-900/40 border-amber-700/60 text-amber-200",
  hot:         "bg-rose-900/40 border-rose-700/60 text-rose-200",
  "read-only": "bg-slate-800 border-slate-700 text-slate-300",
};

const statusStyle: Record<TreasuryProvisionStatus, string> = {
  active:                "bg-emerald-900/50 border-emerald-700 text-emerald-200",
  configured:            "bg-cyan-900/50 border-cyan-700 text-cyan-200",
  "pending-generation":  "bg-slate-800 border-slate-700 text-slate-300",
  compromised:           "bg-red-900/60 border-red-700 text-red-200",
  deprecated:            "bg-zinc-800 border-zinc-700 text-zinc-400",
};

const chainBadge: Record<TreasuryChain, string> = {
  xrpl:    "bg-indigo-900/50 border-indigo-700 text-indigo-200",
  stellar: "bg-purple-900/50 border-purple-700 text-purple-200",
};

const liveStatusStyle: Record<RoleSnapshot["liveStatus"], string> = {
  live:         "bg-emerald-500",
  "not-funded": "bg-amber-500",
  pending:      "bg-slate-500",
  skipped:      "bg-zinc-600",
  error:        "bg-red-500",
};

const classificationLabel: Record<TreasuryClassification, string> = {
  issuance:               "Issuance",
  distribution:           "Distribution",
  "treasury-reserve":     "Treasury Reserve",
  custody:                "Custody",
  settlement:             "Settlement",
  "market-making":        "Market Making",
  "liquidity-pool":       "Liquidity Pool",
  anchor:                 "Anchor / SEP",
  "nft-issuance":         "NFT Issuance",
  "mpt-issuance":         "MPT Issuance",
  "compliance-hold":      "Compliance Hold",
  "ops-fee":              "Operations / Fees",
  "exchange-coordination":"Exchange Coordination",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function explorerUrl(chain: TreasuryChain, address: string): string | null {
  if (!address) return null;
  if (chain === "xrpl") return `https://xrpscan.com/account/${address}`;
  return `https://stellar.expert/explorer/public/account/${address}`;
}

function shortAddr(address: string): string {
  if (!address) return "—";
  if (address.length <= 14) return address;
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}

function fmtNum(n: string | undefined): string {
  if (!n) return "—";
  const v = Number(n);
  if (!Number.isFinite(v)) return n;
  return v.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TreasuryPage() {
  const snap = await getTreasurySnapshot();

  const xrplRoles    = snap.roles.filter((r) => r.chain === "xrpl");
  const stellarRoles = snap.roles.filter((r) => r.chain === "stellar");

  return (
    <main className="min-h-screen bg-[#070709] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C9A84C]">
            Troptions — Treasury Topology
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Multi-Chain Treasury &amp; Held Tokens
          </h1>
          <p className="max-w-3xl text-base text-slate-400 leading-7">
            Senior-level wallet topology covering issuance, distribution, custody,
            settlement, market-making, liquidity pools, anchor services, and
            compliance-hold rails across XRPL and Stellar mainnet.
          </p>
          <p className="text-xs text-slate-500 font-mono">
            Generated {snap.generatedAt} · Read-only · No signing performed
          </p>
        </header>

        {/* ── KPI strip ──────────────────────────────────────────────────── */}
        <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Kpi label="Total Roles"          value={String(snap.topology.totalRoles)} sub={`${snap.topology.byChain.xrpl} XRPL · ${snap.topology.byChain.stellar} Stellar`} />
          <Kpi label="Live On-Chain"        value={String(snap.aggregates.totalRolesLive)} sub={`${snap.aggregates.totalRolesPending} pending · ${snap.aggregates.totalRolesError} error`} />
          <Kpi label="XRP Balance (sum)"    value={fmtNum(snap.aggregates.xrpTotal)} sub="across all live XRPL roles" />
          <Kpi label="XLM Balance (sum)"    value={fmtNum(snap.aggregates.xlmTotal)} sub="across all live Stellar roles" />
        </section>

        <section className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Kpi label="TROPTIONS held (XRPL trustlines)"    value={fmtNum(snap.aggregates.troptionsXrplTotal)} sub="sum of TROPTIONS balances on configured XRPL trustlines" />
          <Kpi label="TROPTIONS held (Stellar balances)"   value={fmtNum(snap.aggregates.troptionsStellarTotal)} sub="sum of TROPTIONS balances on configured Stellar trustlines" />
        </section>

        {/* ── Alerts ─────────────────────────────────────────────────────── */}
        {snap.alerts.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Treasury Alerts
            </h2>
            <ul className="space-y-2">
              {snap.alerts.map((a, i) => (
                <li
                  key={`${a.roleId ?? "global"}-${i}`}
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    a.severity === "critical"
                      ? "border-red-700 bg-red-950/40 text-red-200"
                      : a.severity === "warn"
                      ? "border-amber-700 bg-amber-950/40 text-amber-200"
                      : "border-slate-700 bg-slate-900/40 text-slate-300"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase opacity-70 mr-2">{a.severity}</span>
                  {a.message}
                  {a.roleId && <span className="ml-2 font-mono text-[10px] opacity-60">({a.roleId})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Topology breakdown ─────────────────────────────────────────── */}
        <section className="grid gap-4 md:grid-cols-3">
          <BreakdownCard
            title="By Tier"
            entries={Object.entries(snap.topology.byTier).map(([k, v]) => ({ key: k, value: v }))}
          />
          <BreakdownCard
            title="By Status"
            entries={Object.entries(snap.topology.byStatus).map(([k, v]) => ({ key: k, value: v }))}
          />
          <BreakdownCard
            title="By Classification"
            entries={Object.entries(snap.topology.byClassification).map(([k, v]) => ({ key: k, value: v as number }))}
          />
        </section>

        {/* ── XRPL Section ───────────────────────────────────────────────── */}
        <section className="space-y-4">
          <header className="flex items-baseline justify-between border-b border-slate-800 pb-3">
            <h2 className="text-2xl font-semibold">XRPL Treasury Roles</h2>
            <span className="text-sm text-slate-500">{xrplRoles.length} roles</span>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {xrplRoles.map((r) => <RoleCard key={r.role.roleId} snapshot={r} />)}
          </div>
        </section>

        {/* ── Stellar Section ────────────────────────────────────────────── */}
        <section className="space-y-4">
          <header className="flex items-baseline justify-between border-b border-slate-800 pb-3">
            <h2 className="text-2xl font-semibold">Stellar Treasury Roles</h2>
            <span className="text-sm text-slate-500">{stellarRoles.length} roles</span>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {stellarRoles.map((r) => <RoleCard key={r.role.roleId} snapshot={r} />)}
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="border-t border-slate-800 pt-6 text-xs text-slate-500 space-y-2">
          <p>
            Read-only treasury view. All on-chain reads via{" "}
            <code className="text-slate-400">xrplcluster.com</code> and{" "}
            <code className="text-slate-400">horizon.stellar.org</code>. No private keys
            are ever loaded by this page; signing is performed only by gated server-side
            workflows requiring board authorization and legal sign-off.
          </p>
          <p>
            Pending-generation roles must be created via fresh hardware-wallet generation
            before activation. Compromised wallets are flagged in red and excluded from
            operational totals.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function BreakdownCard({
  title,
  entries,
}: {
  title: string;
  entries: { key: string; value: number }[];
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">{title}</p>
      <ul className="space-y-1.5 text-sm">
        {entries.map(({ key, value }) => (
          <li key={key} className="flex items-baseline justify-between gap-3">
            <span className="text-slate-300 font-mono text-xs">{key}</span>
            <span className="text-white tabular-nums">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoleCard({ snapshot }: { snapshot: RoleSnapshot }) {
  const { role, liveStatus } = snapshot;
  const url = explorerUrl(role.chain, role.address);

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-white text-base leading-tight">{role.displayName}</p>
            <p className="font-mono text-[10px] text-slate-500 mt-0.5">{role.roleId}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`inline-block h-2 w-2 rounded-full ${liveStatusStyle[liveStatus]}`} title={liveStatus} />
            <span className="text-[10px] font-mono uppercase text-slate-400">{liveStatus}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge cls={chainBadge[role.chain]}>{role.chain}</Badge>
          <Badge cls={tierStyle[role.tier]}>{role.tier}</Badge>
          <Badge cls={statusStyle[role.status]}>{role.status}</Badge>
          <Badge cls="bg-slate-800 border-slate-700 text-slate-300">
            {classificationLabel[role.classification]}
          </Badge>
          {role.signersRequired > 1 && (
            <Badge cls="bg-violet-900/40 border-violet-700 text-violet-200">
              {role.signersRequired}-of-N
            </Badge>
          )}
          {role.requiresBoardAuth && (
            <Badge cls="bg-orange-900/40 border-orange-700 text-orange-200">
              board-auth
            </Badge>
          )}
          {role.requiresLegalReview && (
            <Badge cls="bg-yellow-900/40 border-yellow-700 text-yellow-200">
              legal-review
            </Badge>
          )}
        </div>
      </header>

      <p className="text-sm text-slate-400 leading-6">{role.description}</p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <dt className="text-slate-500">Address</dt>
        <dd className="font-mono text-slate-300">
          {url ? (
            <a href={url} target="_blank" rel="noreferrer" className="hover:text-amber-300 underline-offset-2 hover:underline">
              {shortAddr(role.address)}
            </a>
          ) : (
            <span className="text-slate-500 italic">pending generation</span>
          )}
        </dd>

        <dt className="text-slate-500">Assets</dt>
        <dd className="text-slate-300">{role.assets.join(", ")}</dd>

        {snapshot.liveStatus === "live" && snapshot.nativeBalance && (
          <>
            <dt className="text-slate-500">Native balance</dt>
            <dd className="text-white tabular-nums font-mono">
              {fmtNum(snapshot.nativeBalance)} {role.chain === "xrpl" ? "XRP" : "XLM"}
            </dd>
          </>
        )}

        {snapshot.liveStatus === "live" && typeof snapshot.trustlineCount === "number" && (
          <>
            <dt className="text-slate-500">
              {role.chain === "xrpl" ? "Trustlines" : "Non-native balances"}
            </dt>
            <dd className="text-white tabular-nums">{snapshot.trustlineCount}</dd>
          </>
        )}

        {role.dailyCap && (
          <>
            <dt className="text-slate-500">Daily cap</dt>
            <dd className="text-slate-300 tabular-nums">{fmtNum(role.dailyCap)}</dd>
          </>
        )}

        {snapshot.error && (
          <>
            <dt className="text-slate-500">Note</dt>
            <dd className="text-amber-300/90 text-[11px] leading-5">{snapshot.error}</dd>
          </>
        )}
      </dl>

      {/* TROPTIONS holdings */}
      {snapshot.chain === "stellar" && snapshot.balances && (() => {
        const tBal = snapshot.balances.find((b) => b.assetCode === "TROPTIONS");
        if (!tBal) return null;
        return (
          <div className="border-t border-slate-800 pt-3 space-y-1 text-xs">
            {tBal && <Holding label="TROPTIONS" value={tBal.balance} />}
          </div>
        );
      })()}

      {snapshot.chain === "xrpl" && snapshot.trustlines && snapshot.trustlines.length > 0 && (
        <div className="border-t border-slate-800 pt-3 space-y-1 text-xs">
          {snapshot.trustlines.slice(0, 3).map((tl, i) => (
            <Holding
              key={`${tl.counterparty}-${tl.currency}-${i}`}
              label={tl.currency.length === 40 ? `${tl.currency.slice(0, 8)}…` : tl.currency}
              value={tl.balance}
            />
          ))}
          {snapshot.trustlines.length > 3 && (
            <p className="text-[10px] text-slate-500">
              +{snapshot.trustlines.length - 3} more trustline(s)
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function Badge({ children, cls }: { children: React.ReactNode; cls: string }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${cls}`}>
      {children}
    </span>
  );
}

function Holding({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-slate-500 font-mono">{label}</span>
      <span className="text-white tabular-nums font-mono">{fmtNum(value)}</span>
    </div>
  );
}
