import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { WALLET_RISK_REGISTRY } from "@/content/troptions/walletRiskRegistry";

export default function AdminWalletRiskPage() {
  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets/risk"
      title="Wallet Risk"
      subtitle="Operator-facing risk posture for wallet onboarding, funding, and x402 readiness reviews."
    >
      <section className="grid gap-5 xl:grid-cols-2">
        {WALLET_RISK_REGISTRY.map((risk) => (
          <article key={risk.riskAssessmentId} className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{risk.walletId}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Overall Risk: {risk.overallRiskLevel}</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
              <p>KYC: {risk.kycRiskLevel}</p>
              <p>Sanctions: {risk.sanctionsRiskLevel}</p>
              <p>Source of Funds: {risk.sourceOfFundsRiskLevel}</p>
              <p>Country: {risk.countryOfResidenceRiskLevel}</p>
            </div>
            <div className="mt-5">
              <p className="font-semibold text-white">Recommendations</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                {risk.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </AdminWalletShell>
  );
}