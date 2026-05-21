import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { WALLET_QR_REGISTRY } from "@/content/troptions/walletQrRegistry";

export default function AdminWalletQrPage() {
  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets/qr"
      title="QR Profiles"
      subtitle="Audit wallet-profile QR payloads and the non-custodial disclaimers attached to them."
    >
      <section className="grid gap-5 xl:grid-cols-2">
        {WALLET_QR_REGISTRY.map((qr) => (
          <article key={qr.qrCodeId} className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{qr.handle}</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{qr.qrPayloadUri}</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-300">
              <p>Status: {qr.status}</p>
              <p>Display Format: {qr.displayFormat}</p>
              <p>Scans: {qr.scansCount}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{qr.disclaimer}</p>
          </article>
        ))}
      </section>
    </AdminWalletShell>
  );
}