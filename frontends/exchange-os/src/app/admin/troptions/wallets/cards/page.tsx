import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { WALLET_CARD_REGISTRY } from "@/content/troptions/walletCardRegistry";

export default function AdminWalletCardsPage() {
  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets/cards"
      title="Wallet Cards"
      subtitle="Review card status and funding posture. Card funding remains request-only with no live card settlement enabled."
    >
      <section className="grid gap-5 xl:grid-cols-2">
        {WALLET_CARD_REGISTRY.map((card) => (
          <article key={card.cardId} className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{card.cardBrand}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{card.cardLabel}</h2>
            <p className="mt-1 text-sm text-slate-400">{card.maskedNumber}</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <p>Status: {card.status}</p>
              <p>Funding: {card.fundingStatus}</p>
              <p>Daily Limit: {card.dailyLimit}</p>
              <p>Monthly Limit: {card.monthlyLimit}</p>
              <p>Funding Source: {card.fundingSource}</p>
              <p>Cardholder: {card.cardholderName}</p>
            </div>
          </article>
        ))}
      </section>
    </AdminWalletShell>
  );
}