import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { WALLET_BALANCE_REGISTRY } from "@/content/troptions/walletBalanceRegistry";

export default function AdminWalletBalancesPage() {
  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets/balances"
      title="Wallet Balances"
      subtitle="Inspect demo and pending balances by rail. Production settlement remains gated and disabled here."
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {WALLET_BALANCE_REGISTRY.map((balance) => (
          <article key={balance.balanceId} className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{balance.chain}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{balance.amount} {balance.currency}</h2>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Status: {balance.status}</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">{balance.disclaimer}</p>
          </article>
        ))}
      </section>
    </AdminWalletShell>
  );
}