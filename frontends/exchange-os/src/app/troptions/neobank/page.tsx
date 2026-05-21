import Link from "next/link";
import { Card, SectionHeader } from "@/components/ui";

export const metadata = {
  title: "TROPTIONS Neo-Bank — Revenue Lending, Tax Optimization, Multi-Generational Monetization",
  description:
    "Borrow against future earnings. Structure large contracts. Lock in tax optimization. Pass wealth through generations. All on the same ledger TROPTIONS writes.",
};

export default function NeoBankPage() {
  const features = [
    {
      title: "Borrow Against Future Earnings",
      desc: "Revenue-based financing on proven income streams. Athlete with $500K annual NIL? Borrow up to 80% of next year's guaranteed deals. No equity dilution, no personal guarantee—just predictable math on the TROPTIONS ledger.",
      icon: "💰",
      cta: "Calculate Your Borrowing Power",
    },
    {
      title: "Tax Optimization Through Ledger Control",
      desc: "Structure deals across TROPTIONS IOUs (USDC, USDT, DAI, EURC), timing tranches to minimize tax liability. Large payments? Spread them across fiscal periods with on-chain proof of intent. Audit-ready in seconds.",
      icon: "📊",
      cta: "Build Tax Strategy",
    },
    {
      title: "Multi-Generational Contracts",
      desc: "Lock lifetime earnings for an athlete. On death, contract automatically transfers 60% to designated heirs, 20% to charity, 20% to estate. Smart contracts on TROPTIONS ensure wealth continuation without probate delays.",
      icon: "👨‍👩‍👧‍👦",
      cta: "Set Up Heir Contracts",
    },
    {
      title: "Large Contract Structuring",
      desc: "Brands & agencies structure 7-figure deals through TROPTIONS. Milestone-based releases (50% on signing, 30% on first deliverable, 20% on completion). All verified on-chain with no intermediary risk.",
      icon: "🤝",
      cta: "Start Large Deal Flow",
    },
  ];

  const useCases = [
    {
      actor: "College Athlete (Marcus)",
      situation: "Receives $85K NIL deal. Already committed to $40K in living expenses next semester.",
      troptions: "Borrows $30K via revenue-based financing against next year's expected $120K NIL portfolio. Pays back 8% of NIL revenue for 3 years ($9,600/year). Zero interest, fully structured on TROPTIONS ledger.",
      outcome: "Covers tuition now. Builds credit history. Keeps 92% of future earnings. Audit trail for NCAA compliance.",
    },
    {
      actor: "Professional Athlete (Elite)",
      situation: "Signs $5M endorsement deal. Tax advisor says 30% federal + state tax due in Q1.",
      troptions: "TROPTIONS ledger structures deal: $2M in Q1 (cover immediate tax), $1.5M in Q2 (when sponsorship content ships), $1.5M in Q4 (year-end adjustment). Tax liability spreads across periods. Board sees compliance proof.",
      outcome: "Tax liability reduced from 30% to ~24% through timing. Sponsor verified deal completion on-chain. Zero ambiguity.",
    },
    {
      actor: "University Licensing (Admin)",
      situation: "Revenue-sharing agreement with athlete: school gets 15% of all NIL earnings. Hard to track as deals happen.",
      troptions: "Every athlete NIL deal on TROPTIONS generates automatic 15% royalty to school treasury wallet. Settled monthly on-chain. Zero reconciliation needed.",
      outcome: "School receives $150K/year from 10 athletes. Transparent, verifiable, automated.",
    },
    {
      actor: "Collection Agency (RWA Focus)",
      situation: "Wants to acquire Marcus's $48K–$62K valuation range from nil33, but needs proof he'll earn it.",
      troptions: "Buys $50K in fractional NIL rights on TROPTIONS marketplace. Gets 3% of every NIL deal Marcus completes for 5 years. Ledger auto-settles monthly.",
      outcome: "Agency diversifies portfolio across 100 athletes. Predictable income stream. TROPTIONS writes settlement proof.",
    },
  ];

  const taxOptimizationMath = [
    {
      scenario: "Old Way (Lump Sum)",
      flow: "$5M deal signed Dec 15 → Full payment received Dec 20 → Tax liability 30% = $1.5M due Jan 15",
      problem: "Lumpy cash flow, max tax hit in Q1",
    },
    {
      scenario: "TROPTIONS Way (Structured)",
      flow: "$5M deal → $2M (Dec, tax planning), $1.5M (Mar, content shipped), $1.5M (Oct, wrap-up)",
      problem: "Tax spread: $600K (Q1) + $450K (Q2) + $450K (Q4). Effective rate ~24% vs 30%.",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-6 bg-gradient-to-br from-[#071426] via-[#0c1e35] to-[#071426]">
      <div className="mx-auto max-w-6xl space-y-20">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">
            Neo-Bank for the <span className="text-[#f0cf82]">Creator Economy</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Borrow against guaranteed future earnings. Structure large contracts for tax optimization. 
            Lock multi-generational wealth. All on the TROPTIONS ledger we write.
          </p>
        </section>

        {/* 4 Core Features */}
        <section className="grid md:grid-cols-2 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="bg-[#1a1a1a] border border-[#C9A84C]/30 rounded-xl p-8 space-y-6 hover:border-[#C9A84C]/60 transition">
              <div className="text-5xl">{f.icon}</div>
              <div>
                <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
              <Link href="#" className="btn-primary inline-block text-sm">
                {f.cta} →
              </Link>
            </div>
          ))}
        </section>

        {/* Real-World Use Cases */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold">How TROPTIONS Neo-Bank Works in Practice</h2>
          <div className="space-y-6">
            {useCases.map((uc, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#f0cf82]">{uc.actor}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Scenario {idx + 1}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2">Situation</p>
                    <p className="text-gray-300">{uc.situation}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2">TROPTIONS Solution</p>
                    <p className="text-gray-300">{uc.troptions}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2">Outcome</p>
                    <p className="text-green-400 font-semibold">{uc.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tax Math */}
        <section className="bg-[#0a0a0a] -mx-6 px-6 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-4xl font-bold">Tax Optimization by Example</h2>
              <p className="text-gray-400">$5M Professional Athlete Endorsement Deal</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {taxOptimizationMath.map((item, idx) => (
                <div key={idx} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 space-y-4">
                  <h3 className="text-xl font-bold">{item.scenario}</h3>
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-gray-300 break-words">
                    {item.flow}
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="font-bold text-yellow-500">Result:</span> {item.problem}
                  </div>
                  {idx === 0 && (
                    <div className="text-2xl font-bold text-red-500">30% Tax Liability</div>
                  )}
                  {idx === 1 && (
                    <div className="text-2xl font-bold text-green-400">~24% Tax Liability (-6%)</div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center text-gray-400 text-sm">
              <p>Estimated savings on a $5M deal: <strong className="text-[#f0cf82]">$300,000</strong></p>
              <p className="mt-2 text-xs">All structured on TROPTIONS ledger with full audit compliance.</p>
            </div>
          </div>
        </section>

        {/* Revenue-Based Financing Calculator */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold text-center">Revenue-Based Financing Calculator</h2>
          
          <div className="bg-[#1a1a1a] border border-[#C9A84C]/30 rounded-xl p-8 space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">Annual Proven NIL Income</label>
              <div className="flex gap-2">
                <input type="text" placeholder="$150,000" className="flex-1 bg-black px-4 py-3 rounded-lg border border-white/10 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">Amount Needed Now</label>
              <div className="flex gap-2">
                <input type="text" placeholder="$50,000" className="flex-1 bg-black px-4 py-3 rounded-lg border border-white/10 text-white" />
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Max Borrowing (80% of annual):</span>
                <span className="font-bold text-[#f0cf82]">$120,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Requested Amount:</span>
                <span className="font-bold">$50,000</span>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payback Term (Monthly from NIL Revenue):</span>
                <span className="font-bold text-[#f0cf82]">36 months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue Share:</span>
                <span className="font-bold text-green-400">8% of NIL earnings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Monthly Payback:</span>
                <span className="font-bold text-green-400">~$1,000 (variable)</span>
              </div>
            </div>

            <button className="w-full btn-primary">
              Get Pre-Qualified
            </button>
          </div>
        </section>

        {/* Multi-Generational Contracts */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold">Multi-Generational Wealth Contracts</h2>
          <p className="text-xl text-gray-400 max-w-3xl">
            Retire knowing your NIL rights, brand partnerships, and future earnings will continue supporting your family.
            TROPTIONS smart contracts auto-execute beneficiary transfers without probate.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 space-y-4">
              <div className="text-4xl">👤</div>
              <h3 className="font-bold text-lg">Original Earner (60%)</h3>
              <p className="text-sm text-gray-400">
                Receives 60% of all NIL royalties during lifetime. Contract auto-updates on account anniversary.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 space-y-4">
              <div className="text-4xl">👨‍👩‍👧</div>
              <h3 className="font-bold text-lg">Designated Heirs (20%)</h3>
              <p className="text-sm text-gray-400">
                On death, 20% of all NIL payments route to designated beneficiaries—parents, spouse, or children—automatically.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 space-y-4">
              <div className="text-4xl">🤲</div>
              <h3 className="font-bold text-lg">Charity (20%)</h3>
              <p className="text-sm text-gray-400">
                Remaining 20% funds your chosen charity or scholarship fund in perpetuity. Built-in legacy.
              </p>
            </div>
          </div>

          <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-6 space-y-3">
            <p className="text-sm text-blue-300 font-semibold">💡 How It Works</p>
            <p className="text-gray-300">
              Set up once on TROPTIONS. No probate. No delays. On your death, the smart contract auto-releases 
              payments to heirs and charity forever. All verified on-chain. Your legacy continues uninterrupted.
            </p>
          </div>
        </section>

        {/* Integration with NIL33 & TROPTIONS */}
        <section className="bg-[#1a1a1a] border border-[#C9A84C]/30 rounded-xl p-12 space-y-8">
          <h2 className="text-3xl font-bold">Integrated Ecosystem</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-5xl">🎯</div>
              <h3 className="font-bold">nil33 Scores</h3>
              <p className="text-sm text-gray-400">Deal valuation + compliance. 33 factors, 50-state rules.</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl">➜</div>
              <h3 className="font-bold">TROPTIONS Ledger</h3>
              <p className="text-sm text-gray-400">Campaign creation + revenue-based lending + multi-gen contracts.</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl">🌟</div>
              <h3 className="font-bold">TROPTIONS.GOLD</h3>
              <p className="text-sm text-gray-400">Settlement IOUs on Apostle Chain. Redeemable 1:1.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Build Multi-Generational Wealth?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/portal/troptions/onboarding" className="btn-primary">
              Get Started
            </Link>
            <Link href="/troptions/neobank#calculator" className="btn-secondary">
              Calculate Your Benefits
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
