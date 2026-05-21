import type { ReactNode } from "react";
import Link from "next/link";
import "@/styles/wallet-forensics.css";

type WalletForensicsLayoutProps = {
  readonly title: string;
  readonly intro: string;
  readonly children: ReactNode;
};

const NAV = [
  { href: "/troptions/wallet-forensics/overview", label: "Overview" },
  { href: "/troptions/wallet-forensics/xrpl", label: "XRPL" },
  { href: "/troptions/wallet-forensics/transactions", label: "Transactions" },
  { href: "/troptions/wallet-forensics/funds-flow", label: "Funds Flow" },
  { href: "/troptions/wallet-forensics/exchange-deposits", label: "Exchange Deposits" },
  { href: "/troptions/wallet-forensics/ious", label: "IOUs" },
  { href: "/troptions/wallet-forensics/trustlines", label: "Trustlines" },
  { href: "/troptions/wallet-forensics/nfts", label: "NFTs" },
  { href: "/troptions/wallet-forensics/amm", label: "AMM" },
  { href: "/troptions/wallet-forensics/signing-keys", label: "Signing Keys" },
  { href: "/troptions/wallet-forensics/recovery-checklist", label: "Recovery Checklist" },
] as const;

export function WalletForensicsLayout({ title, intro, children }: WalletForensicsLayoutProps) {
  return (
    <main className="wf-theme">
      <div className="wf-wrap">
        <header className="wf-header">
          <p className="wf-kicker">Wallet Forensics and XRPL Funds Tracking</p>
          <h1 className="wf-title">{title}</h1>
          <p className="wf-intro">{intro}</p>
          <nav className="wf-nav" aria-label="Wallet forensics navigation">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <section className="wf-content">{children}</section>
      </div>
    </main>
  );
}
