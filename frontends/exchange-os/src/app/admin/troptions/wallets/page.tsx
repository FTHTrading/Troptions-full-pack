import Link from "next/link";
import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { WALLET_USER_REGISTRY } from "@/content/troptions/walletUserRegistry";
import { WALLET_ACCOUNT_REGISTRY } from "@/content/troptions/walletAccountRegistry";
import { WALLET_BALANCE_REGISTRY } from "@/content/troptions/walletBalanceRegistry";
import { WALLET_CARD_REGISTRY } from "@/content/troptions/walletCardRegistry";
import { WALLET_X402_REGISTRY } from "@/content/troptions/walletX402Registry";
import { WALLET_RISK_REGISTRY } from "@/content/troptions/walletRiskRegistry";
import { ADMIN_WALLET_ROUTES } from "@/content/troptions/walletRouteRegistry";

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-xs leading-6 text-slate-400">{note}</p>
    </article>
  );
}

export default function AdminWalletOverviewPage() {
  const readinessCount = WALLET_X402_REGISTRY.filter((entry) => entry.x402Status === "readiness").length;
  const lowRiskCount = WALLET_RISK_REGISTRY.filter((risk) => risk.overallRiskLevel === "low").length;

  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets"
      title="Wallet Control Tower"
      subtitle="Operational oversight for Genesis Wallet onboarding, balances, approval blockers, and x402 readiness."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Wallet Users" value={String(WALLET_USER_REGISTRY.length)} note="Simulation identities currently onboarded." />
        <StatCard label="Accounts" value={String(WALLET_ACCOUNT_REGISTRY.length)} note="Wallet accounts tracked in the registry." />
        <StatCard label="Balances" value={String(WALLET_BALANCE_REGISTRY.length)} note="Demo and pending balances only." />
        <StatCard label="Cards" value={String(WALLET_CARD_REGISTRY.length)} note="Virtual card previews. Funding remains request-only." />
        <StatCard label="x402 Ready" value={String(readinessCount)} note="Dry-run x402 access. No live ATP settlement enabled." />
        <StatCard label="Low Risk" value={String(lowRiskCount)} note="Current wallet risk posture from the simulation registry." />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <h2 className="text-xl font-semibold text-white">Wallet Operations Map</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {ADMIN_WALLET_ROUTES.filter((route) => route.path !== "/admin/troptions/wallets").map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-[#C9A84C]/50"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{route.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{route.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </AdminWalletShell>
  );
}