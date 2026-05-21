import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimers — TROPTIONS",
  description:
    "Plain-language legal disclaimers for TROPTIONS website visitors. No investment advice, no guaranteed returns, no live financial rails without compliance review.",
};

const DISCLAIMERS = [
  {
    id: "not-investment-advice",
    title: "Not Investment Advice",
    body: "TROPTIONS is not offering investment advice, financial guidance, or securities recommendations through this website or any content published on it. Nothing on this site should be construed as advice to buy, sell, hold, or otherwise transact in any financial instrument, asset, or digital token.",
  },
  {
    id: "no-guaranteed-returns",
    title: "No Guaranteed Returns, Funding, or Approvals",
    body: "Nothing on this website is a guarantee of funding, profit, liquidity, asset approval, transaction completion, or access to any financial institution or market. TROPTIONS does not guarantee that any described capability will result in live financial execution or institutional approval.",
  },
  {
    id: "infrastructure-planning",
    title: "Infrastructure Planning vs. Live Operations",
    body: "TROPTIONS builds digital infrastructure, documentation, and platform systems. Pages that describe RWA, tokenization, stablecoin, escrow, trade desk, Layer-1, XRPL, or Stellar capabilities are describing planning, architecture, and readiness frameworks — not live financial operations — unless specifically marked as Live with confirmed production-ready backend.",
  },
  {
    id: "rwa-tokens-escrow",
    title: "RWA, Tokens, Stablecoins, and Escrow",
    body: "Any references to real-world asset (RWA) tokenization, stablecoin issuance, escrow services, or custody require separate legal review, compliance assessment, and jurisdiction-specific approval before any live use. These services are not available to the general public on a self-service basis through this website.",
  },
  {
    id: "kyc-compliance",
    title: "KYC, KYB, and Compliance",
    body: "Depending on the use case, client onboarding with TROPTIONS may require Know Your Customer (KYC), Know Your Business (KYB), accredited investor verification, business entity verification, custody review, or third-party compliance approvals. TROPTIONS does not provide legal, compliance, or regulatory filing services.",
  },
  {
    id: "demo-pages",
    title: "Demo, Simulation, and Planning Pages",
    body: "Certain pages on this website contain demos, simulations, or planning mockups that illustrate proposed capabilities. These are not live systems unless explicitly labeled. Use the system status indicators throughout the site to identify what is operational.",
  },
  {
    id: "securities",
    title: "Securities and Broker-Dealer Services",
    body: "TROPTIONS does not offer broker-dealer services, securities underwriting, securities placement, or investment banking. Nothing on this website constitutes an offer to sell or solicitation of an offer to buy any security.",
  },
  {
    id: "jurisdiction",
    title: "Jurisdictional Availability",
    body: "Services described on this website may not be available in all jurisdictions. Certain financial infrastructure, token, or payment services may be restricted or prohibited in your location. It is your responsibility to determine what services are lawful in your jurisdiction before proceeding.",
  },
  {
    id: "data",
    title: "Data and Privacy",
    body: "Inquiries and booking requests submitted through this website are stored securely and used only to respond to your request. We do not sell or share your information with third parties for marketing purposes. You may request deletion of your data at any time by contacting us.",
  },
];

export default function DisclaimersPage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      <div className="border-b border-[#C9A84C]/20">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Disclaimers</h1>
          <p className="mt-3 text-sm text-slate-400">
            Last updated: May 2026
          </p>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Please read these disclaimers before using any TROPTIONS services, submitting
            an inquiry, or relying on information from this website.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        {DISCLAIMERS.map((item) => (
          <section key={item.id} id={item.id}>
            <h2 className="text-base font-bold text-white mb-2">{item.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{item.body}</p>
          </section>
        ))}

        <div className="pt-6 border-t border-white/10 text-center space-y-4">
          <p className="text-sm text-slate-400">
            Questions about these disclaimers?
          </p>
          <Link
            href="/troptions/contact"
            className="inline-flex items-center rounded-lg border border-[#C9A84C]/50 px-5 py-2.5 text-sm font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
