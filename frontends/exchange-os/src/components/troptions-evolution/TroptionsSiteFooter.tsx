import Link from "next/link";

const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      { href: "/troptions", label: "Overview" },
      { href: "/troptions/xrpl-platform", label: "XRPL Platform" },
      { href: "/troptions/layer1", label: "Layer 1 (TSN)" },
      { href: "/troptions/wallets", label: "Live Wallets" },
      { href: "/troptions/transactions", label: "Transactions" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { href: "/troptions/ecosystem", label: "Brand Entities" },
      { href: "/troptions/kyc", label: "KYC / Onboarding" },
      { href: "/troptions/rwa/axl-001", label: "RWA Series 001" },
      { href: "/troptions/chains", label: "Chain Status" },
      { href: "/troptions/migration", label: "Legacy Domains" },
    ],
  },
  {
    title: "Compliance",
    links: [
      { href: "/troptions/compliance/handbooks", label: "Handbooks" },
      { href: "/troptions/xrpl-stellar-compliance", label: "AML / ISO 20022" },
      { href: "/troptions/legal", label: "Legal Notices" },
      { href: "/troptions/diligence/source-map", label: "Source Map" },
      { href: "/portal/troptions/onboarding", label: "Request Access" },
    ],
  },
] as const;

export function TroptionsSiteFooter() {
  return (
    <footer className="border-t border-[#C9A84C]/15 bg-[#040e1c] text-slate-400">
      {/* Main grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 md:px-10">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1">
          <p className="mb-2 text-[13px] font-bold tracking-[0.22em] text-[#f0cf82]">TROPTIONS</p>
          <p className="text-[12px] leading-relaxed text-slate-500">
            A live digital asset on XRPL&nbsp;Mainnet with a sovereign Rust Layer&nbsp;1, 8 registered brand entities,
            and a Web3 stack verifiable on-chain right now.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-green-400">
              Live on XRPL Mainnet
            </span>
          </div>
        </div>

        {/* Nav columns */}
        {FOOTER_LINKS.map((group) => (
          <div key={group.title}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {group.title}
            </p>
            <ul className="flex flex-col gap-2">
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-slate-400 transition-colors hover:text-slate-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-white/5 px-6 py-5 md:px-10">
        <p className="mx-auto max-w-5xl text-[11px] leading-relaxed text-slate-600">
          <strong className="text-slate-500">Disclaimer:</strong> TROPTIONS is an institutional operating infrastructure platform providing trade currency, RWA, and settlement services. All on-chain data links to public blockchain explorers and can be independently verified. XRPL and Stellar issuances are live on mainnet. USDC, USDT, DAI, and EURC IOUs are issued and verifiable on-chain. AMM, supply, and trustline figures are current as of XRPL mainnet. Certain advanced workflows (custody, settlement, exchange) are subject to jurisdiction-specific legal, compliance, and licensing review before activation.
        </p>
        <p className="mt-3 text-center text-[11px] text-slate-700">
          © {new Date().getFullYear()} TROPTIONS / FTH Trading. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
