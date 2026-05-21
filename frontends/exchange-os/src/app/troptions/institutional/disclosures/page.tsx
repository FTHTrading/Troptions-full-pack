import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";

const DISCLOSURES = [
  {
    id: "DISC-001",
    title: "Not Legal Advice",
    body: "Nothing on any Troptions platform, website, document, or communication is legal advice. Participants should consult independent legal counsel for all legal questions.",
    category: "advisory",
  },
  {
    id: "DISC-002",
    title: "Not Tax Advice",
    body: "Nothing on any Troptions platform is tax advice. Barter transactions, token transactions, and digital asset transfers may be taxable events. Participants must consult independent tax counsel.",
    category: "advisory",
  },
  {
    id: "DISC-003",
    title: "Not Investment Advice",
    body: "Nothing on any Troptions platform is investment advice, a recommendation to buy or sell any asset, or a solicitation of investment activity.",
    category: "advisory",
  },
  {
    id: "DISC-004",
    title: "Not an Offer to Sell Securities",
    body: "No Troptions communication, website, whitepaper, or marketing material constitutes an offer or solicitation to sell or buy securities. Any token sale, presale, or early-access program requires completed securities counsel review before any participant communications.",
    category: "securities",
  },
  {
    id: "DISC-005",
    title: "No Guaranteed Liquidity",
    body: "Troptions does not guarantee liquidity for any token, asset, stable unit, or instrument. Market access, venue listing, OTC availability, and trading volume are subject to independent confirmation and applicable law.",
    category: "market",
  },
  {
    id: "DISC-006",
    title: "No Guaranteed Returns",
    body: "Troptions does not guarantee investment returns, price appreciation, staking yields, rewards, or any other financial return. Digital asset values are speculative and may decline to zero.",
    category: "market",
  },
  {
    id: "DISC-007",
    title: "No Guaranteed Merchant Acceptance",
    body: "Merchant acceptance of Troptions Pay is subject to third-party rail provider terms, geographic restrictions, merchant category exclusions, counterparty acceptance, and availability. Merchant counts require independent verification with source and date.",
    category: "utility",
  },
  {
    id: "DISC-008",
    title: "No Guaranteed Redemption",
    body: "Redemption of any Troptions token, stable unit, or instrument is not guaranteed. Redemption is subject to reserve availability, custodian terms, legal classification, regulatory conditions, and applicable law.",
    category: "custody",
  },
  {
    id: "DISC-009",
    title: "Not a Bank",
    body: "Troptions is not a bank, savings institution, depository institution, or any entity providing insured deposits. Troptions assets are not FDIC-insured.",
    category: "regulatory",
  },
  {
    id: "DISC-010",
    title: "Not a Broker-Dealer",
    body: "Troptions is not a registered broker-dealer, investment adviser, or securities dealer. No securities brokerage, market making, or investment management services are provided.",
    category: "regulatory",
  },
  {
    id: "DISC-011",
    title: "Not an Exchange",
    body: "Troptions does not operate a licensed securities exchange, alternative trading system (ATS), or registered commodities exchange. Any exchange infrastructure initiative requires exchange/ATS counsel review and applicable licensing before operations.",
    category: "regulatory",
  },
  {
    id: "DISC-012",
    title: "Not a Custodian",
    body: "Troptions does not provide qualified custody services. Any custody arrangement requires a third-party qualified custodian with a signed custody agreement, regulatory status, insurance, and reporting cadence.",
    category: "regulatory",
  },
  {
    id: "DISC-013",
    title: "Subject to KYC / KYB",
    body: "All ecosystem participation, asset issuance, funding, and settlement activities require completed Know Your Customer (KYC) and Know Your Business (KYB) verification. Unverified participants cannot access restricted workflows.",
    category: "compliance",
  },
  {
    id: "DISC-014",
    title: "Subject to Sanctions Screening",
    body: "All participants and transactions are subject to OFAC and applicable sanctions screening. Troptions does not accept participation from sanctioned individuals, entities, or jurisdictions.",
    category: "compliance",
  },
  {
    id: "DISC-015",
    title: "Subject to Jurisdiction Restrictions",
    body: "Access to Troptions platforms, tokens, stable units, RWA instruments, funding routes, and custody services is restricted in certain jurisdictions. Participants are responsible for compliance with local laws.",
    category: "compliance",
  },
  {
    id: "DISC-016",
    title: "Subject to Provider Approval",
    body: "Custody providers, payment rail providers, exchange venues, and integration partners are subject to Troptions provider due diligence, agreement review, and board approval before activation.",
    category: "compliance",
  },
  {
    id: "DISC-017",
    title: "Subject to Board Approval",
    body: "Asset issuance, stable unit activation, custody activation, funding route activation, and exchange operations are subject to board approval. No operational activity commences without board sign-off.",
    category: "governance",
  },
  {
    id: "DISC-018",
    title: "Barter Transactions May Be Taxable",
    body: "Barter income, token exchanges, and non-cash settlements may constitute taxable events under applicable tax law. Participants must consult independent tax counsel before engaging in barter or token transactions.",
    category: "advisory",
  },
  {
    id: "DISC-019",
    title: "No Stable Value Guarantee",
    body: "Troptions stable units are not guaranteed to maintain stable value, price pegs, or reserve backing. Stability claims require reserve proof, redemption policy, legal classification, and regulatory analysis before use.",
    category: "market",
  },
  {
    id: "DISC-020",
    title: "No Worldwide Compliance Guarantee",
    body: "Troptions does not represent that its instruments comply with the laws of every jurisdiction. Participants are responsible for assessing local regulatory requirements.",
    category: "compliance",
  },
];

const categoryColors: Record<string, string> = {
  advisory: "bg-blue-950 border-blue-800",
  securities: "bg-red-950 border-red-800",
  market: "bg-yellow-950 border-yellow-800",
  utility: "bg-slate-900 border-slate-700",
  custody: "bg-purple-950 border-purple-800",
  regulatory: "bg-orange-950 border-orange-800",
  compliance: "bg-teal-950 border-teal-800",
  governance: "bg-indigo-950 border-indigo-800",
};

export default function InstitutionalDisclosuresPage() {
  const categories = Array.from(new Set(DISCLOSURES.map((d) => d.category)));

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="full-public" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Institutional — Full Disclosures
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Troptions Institutional Disclosures</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            All {DISCLOSURES.length} institutional disclosures applicable to Troptions platforms, tokens, instruments,
            and services. These disclosures govern all institutional use.
          </p>
        </section>

        {categories.map((cat) => {
          const items = DISCLOSURES.filter((d) => d.category === cat);
          return (
            <section key={cat}>
              <h2 className="text-lg font-bold text-[#C9A84C] uppercase tracking-widest mb-4">{cat}</h2>
              <div className="space-y-3">
                {items.map((disc) => (
                  <div key={disc.id}
                    className={`border rounded-xl p-5 ${categoryColors[disc.category] ?? "bg-slate-900 border-slate-700"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white font-semibold text-sm">{disc.title}</p>
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed">{disc.body}</p>
                      </div>
                      <span className="text-[#C9A84C] font-mono text-xs whitespace-nowrap">{disc.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <section className="border border-[#C9A84C]/30 rounded-xl p-6 bg-[#C9A84C]/5">
          <p className="text-[#C9A84C] font-semibold text-sm mb-2">Master Disclaimer</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            These disclosures apply to all Troptions platforms, websites, communications, whitepapers, token materials,
            stable unit materials, RWA materials, and all ecosystem activities. Nothing herein is legal, tax, investment,
            or accounting advice. Participants must obtain independent professional counsel before any activity.
          </p>
        </section>
      </div>
    </main>
  );
}
