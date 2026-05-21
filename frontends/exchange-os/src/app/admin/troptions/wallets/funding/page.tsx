import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { getDefaultFundingBlockers, WALLET_FUNDING_REQUEST_REGISTRY } from "@/content/troptions/walletFundingRequestRegistry";

export default function AdminWalletFundingPage() {
  const blockers = getDefaultFundingBlockers();

  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets/funding"
      title="Funding Requests"
      subtitle="Funding remains blocked until provider, custody, sanctions, and admin release gates clear."
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-lg font-semibold text-white">Current Queue</h2>
          <p className="mt-3 text-sm text-slate-400">
            {WALLET_FUNDING_REQUEST_REGISTRY.length === 0
              ? "No funding requests are currently stored. The request path remains simulation and request-only."
              : `${WALLET_FUNDING_REQUEST_REGISTRY.length} funding requests in registry.`}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-lg font-semibold text-white">Default Blockers</h2>
          <div className="mt-4 space-y-3">
            {blockers.map((blocker) => (
              <div key={blocker.blockerId} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <p className="font-semibold text-white">{blocker.description}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{blocker.requiredAction}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C9A84C]">{blocker.estimatedTimeToResolve}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminWalletShell>
  );
}