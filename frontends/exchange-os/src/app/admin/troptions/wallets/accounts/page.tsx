import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { WALLET_ACCOUNT_REGISTRY } from "@/content/troptions/walletAccountRegistry";

export default function AdminWalletAccountsPage() {
  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets/accounts"
      title="Wallet Accounts"
      subtitle="Account-level review of chain readiness, provider status, and custody gating before any route is promoted."
    >
      <section className="grid gap-5 xl:grid-cols-2">
        {WALLET_ACCOUNT_REGISTRY.map((account) => (
          <article key={account.walletId} className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{account.accountLabel}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{account.handle}</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <p>Environment: {account.environment}</p>
              <p>Wallet Status: {account.walletStatus}</p>
              <p>Provider Status: {account.providerStatus}</p>
              <p>Custody Status: {account.custodyStatus}</p>
              <p>Daily Limit: {account.dailyLimit}</p>
              <p>Used Limit: {account.usedDailyLimit}</p>
            </div>
            <div className="mt-5 space-y-3">
              {account.chainAccounts.map((chain) => (
                <div key={`${account.walletId}-${chain.chain}`} className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-white">{chain.chain}</span>
                    <span className="font-mono text-xs uppercase text-[#C9A84C]">{chain.status}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Readiness Level: {chain.readinessLevel}%</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </AdminWalletShell>
  );
}