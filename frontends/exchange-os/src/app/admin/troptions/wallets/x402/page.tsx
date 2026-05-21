import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { WALLET_X402_REGISTRY } from "@/content/troptions/walletX402Registry";

export default function AdminWalletX402Page() {
  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets/x402"
      title="Wallet x402"
      subtitle="Dry-run x402 readiness overview. No ATP settlement or live payment execution is enabled from this surface."
    >
      <section className="grid gap-5 xl:grid-cols-2">
        {WALLET_X402_REGISTRY.map((entry) => (
          <article key={entry.x402AccessId} className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{entry.walletId}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Status: {entry.x402Status}</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
              <p>Role: {entry.operatorRole}</p>
              <p>Intent Limit: {entry.paymentIntentLimit}</p>
              <p>Monthly Usage: {entry.monthlyPaymentIntentUsage}</p>
              <p>Monthly Cap: {entry.monthlyPaymentIntentLimit}</p>
            </div>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              {entry.disclaimers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </AdminWalletShell>
  );
}