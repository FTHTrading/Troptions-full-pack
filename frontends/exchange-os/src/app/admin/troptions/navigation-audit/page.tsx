import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import {
  ADMIN_WALLET_ROUTES,
  CRITICAL_RUNTIME_URLS,
  MEMBER_WALLET_ROUTES,
} from "@/content/troptions/walletRouteRegistry";

const TROPTIONS_LINKS = [
  { label: "Homepage CTA: Explore Platform", path: "/portal/troptions/dashboard", status: "verified" },
  { label: "Homepage CTA: Request Access", path: "/portal/troptions/onboarding", status: "verified" },
  { label: "Homepage Nav: Legacy", path: "/troptions/legacy", status: "verified" },
  { label: "Homepage Nav: Then vs Now", path: "/troptions/then-now", status: "verified" },
  { label: "Homepage Nav: Ecosystem", path: "/troptions/ecosystem", status: "verified" },
  { label: "Homepage Nav: Future", path: "/troptions/future", status: "verified" },
  { label: "Homepage Nav: Source Map", path: "/troptions/diligence/source-map", status: "verified" },
  { label: "Wallet CTA: Dashboard actions", path: "/portal/troptions/wallet/receive", status: "fixed" },
  { label: "Wallet CTA: Dashboard actions", path: "/portal/troptions/wallet/send", status: "fixed" },
  { label: "Wallet CTA: Dashboard actions", path: "/portal/troptions/wallet/convert", status: "fixed" },
  { label: "Wallet CTA: Dashboard actions", path: "/portal/troptions/wallet/funding-request", status: "fixed" },
];

export default function NavigationAuditPage() {
  return (
    <AdminWalletShell
      activePath="/admin/troptions/navigation-audit"
      title="Navigation Audit"
      subtitle="Route coverage and CTA audit for Troptions homepage, wallet member flows, and admin wallet surfaces."
    >
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <h2 className="text-xl font-semibold text-white">Critical Runtime URLs</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {CRITICAL_RUNTIME_URLS.map((path) => (
            <div key={path} className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C9A84C]">verified</p>
              <p className="mt-2 break-all">{path}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-xl font-semibold text-white">Member Wallet Routes</h2>
          <div className="mt-4 space-y-3">
            {MEMBER_WALLET_ROUTES.map((route) => (
              <div key={route.path} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{route.label}</p>
                <p className="mt-2 text-sm text-slate-300">{route.path}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{route.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-xl font-semibold text-white">Admin Wallet Routes</h2>
          <div className="mt-4 space-y-3">
            {ADMIN_WALLET_ROUTES.map((route) => (
              <div key={route.path} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{route.label}</p>
                <p className="mt-2 text-sm text-slate-300">{route.path}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{route.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <h2 className="text-xl font-semibold text-white">Fixed Link Inventory</h2>
        <div className="mt-4 space-y-3">
          {TROPTIONS_LINKS.map((entry) => (
            <div key={`${entry.label}-${entry.path}`} className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-white">{entry.label}</p>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{entry.status}</span>
              </div>
              <p className="mt-2 break-all text-slate-400">{entry.path}</p>
            </div>
          ))}
        </div>
      </section>
    </AdminWalletShell>
  );
}