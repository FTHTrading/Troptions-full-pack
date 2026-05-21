import Link from "next/link";
import type { ReactNode } from "react";
import { ADMIN_WALLET_ROUTES } from "@/content/troptions/walletRouteRegistry";

interface AdminWalletShellProps {
  readonly title: string;
  readonly subtitle: string;
  readonly activePath: string;
  readonly children: ReactNode;
}

export function AdminWalletShell({ title, subtitle, activePath, children }: AdminWalletShellProps) {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Admin Wallet Operations</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">{subtitle}</p>
          <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-500">
            Simulation and request-only environment. Live funds, live sends, live x402 settlement, live card funding,
            withdrawals, and chain signing remain disabled.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-8 flex flex-wrap gap-3" aria-label="Admin wallet navigation">
          {ADMIN_WALLET_ROUTES.map((route) => {
            const isActive = route.path === activePath;

            return (
              <Link
                key={route.path}
                href={route.path}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  isActive
                    ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#F0CF82]"
                    : "border-slate-700/60 text-slate-300 hover:border-[#C9A84C]/50 hover:text-white"
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-6">{children}</div>
      </div>
    </main>
  );
}