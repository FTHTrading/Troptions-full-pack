import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Funding Routes — PATE-COAL-001 | TROPTIONS RWA",
  description:
    "TROPTIONS PATE-COAL-001 funding routes — diligence bridge, private mineral lender, operator JV, offtake prepayment, royalty/streaming, XRPL permissioned receipt, and Aave status. Simulation-only.",
};

type RouteEligibility = "CONDITIONAL" | "BLOCKED" | "ELIGIBLE";

interface FundingRoute {
  id:                string;
  displayName:       string;
  eligibility:       RouteEligibility;
  eligibilityNote:   string;
  description:       string;
  blockedReasons:    string[];
  conditions:        string[];
  askRange:          string;
  timeline:          string;
  priority:          number;
}

const ROUTES: FundingRoute[] = [
  {
    id:          "DILIGENCE_BRIDGE",
    displayName: "Diligence Bridge Facility",
    eligibility: "CONDITIONAL",
    eligibilityNote: "Start here — can initiate now with uploaded evidence",
    description:
      "Smaller bridge facility ($50K–$500K) to fund title work, updated qualified-person mining report, " +
      "legal opinion, permitting review, and environmental study. This is the best first path for this asset.",
    blockedReasons: [],
    conditions: [
      "Pledge option or collateral agreement on mineral rights if legally available",
      "NDA and intake form with prospective bridge lender",
      "Entity ownership documents showing authority to pledge",
      "Repayment plan from larger facility, JV, or sale/refinance",
    ],
    askRange:  "$50,000 – $500,000",
    timeline:  "30 – 90 days from lender introduction",
    priority:  1,
  },
  {
    id:          "OPERATOR_JV",
    displayName: "Mining Operator Joint Venture",
    eligibility: "CONDITIONAL",
    eligibilityNote: "Can initiate — operator can review evidence package now",
    description:
      "Mining operator reviews reserves, funds updated study and permitting, and earns mining rights / revenue " +
      "share / JV interest. Avoids large debt before the asset is operational. Operator brings mining credibility.",
    blockedReasons: [],
    conditions: [
      "Mineral rights ownership confirmed (deed / title opinion) before JV is executed",
      "Operator performs independent technical review",
      "JV agreement drafted and reviewed by transaction counsel",
      "Revenue share and carried-interest structure defined",
      "No operator LOI on file yet — first step is operator introduction and NDA",
    ],
    askRange:  "Operator-funded (non-debt) — operator provides capital in exchange for JV interest",
    timeline:  "60 – 180 days from first operator introduction",
    priority:  2,
  },
  {
    id:          "ROYALTY_STREAMING",
    displayName: "Royalty / Streaming Financing",
    eligibility: "CONDITIONAL",
    eligibilityNote: "Conditional — mineral rights ownership must be confirmed first",
    description:
      "A funder provides capital now in exchange for a royalty per ton produced. Works for mining assets " +
      "when direct collateral lending is difficult before permits. TROPTIONS records royalty agreement and payment ledger.",
    blockedReasons: [],
    conditions: [
      "Mineral rights ownership confirmed (deed + title opinion) before royalty agreement is executed",
      "Royalty agreement drafted by transaction counsel",
      "Mine plan and production schedule estimate",
      "Per-ton royalty rate, term, and cap negotiated",
    ],
    askRange:  "Negotiated — capital advance against per-ton royalty at agreed rate",
    timeline:  "120 – 240 days from funder introduction",
    priority:  3,
  },
  {
    id:          "PRIVATE_MINERAL_LENDER",
    displayName: "Private Mineral Lender / Asset-Backed Lender",
    eligibility: "BLOCKED",
    eligibilityNote: "Blocked — missing title, legal, and updated QP report",
    description:
      "Asset-backed loan or credit facility from a private mineral lender or family office. Lender applies " +
      "haircut to engineering in-place value. Advance rate is substantially lower than $8.378B — particularly " +
      "at pre-permit, pre-operator stage. First-phase ask is diligence/bridge, not a large facility.",
    blockedReasons: [
      "DEED: current property deed not on file",
      "MINERAL_RIGHTS_DEED: mineral rights ownership not confirmed",
      "CHAIN_OF_TITLE: full chain of title not on file",
      "TITLE_OPINION: attorney title opinion not on file",
      "LEGAL_OPINION: transaction legal opinion not on file",
      "UPDATED_QP_REPORT: updated qualified-person / mining engineer report not on file — lender will not rely solely on 2020 appraisal",
    ],
    conditions: [],
    askRange:  "Private — depends on lender advance rate and haircut from in-place value",
    timeline:  "90 – 180 days after complete title/legal/QP package delivered to lender",
    priority:  4,
  },
  {
    id:          "OFFTAKE_PREPAYMENT",
    displayName: "Offtake Prepayment / Coal Buyer Advance",
    eligibility: "BLOCKED",
    eligibilityNote: "Blocked — QP report, permit path, and buyer LOI required",
    description:
      "If recoverable tonnage and coal quality are confirmed, a coal buyer may advance capital against future " +
      "delivery. Requires updated technical report, access/logistics plan, and permitting path confirmed.",
    blockedReasons: [
      "UPDATED_QP_REPORT: recoverable tonnage must be confirmed by updated qualified-person report",
      "PERMIT_STATUS: coal buyer will require confirmed permit path before offtake agreement",
      "OFFTAKE_LOI: no coal buyer LOI on file yet",
      "Mine plan and logistics (rail/truck access) not documented",
    ],
    conditions: [],
    askRange:  "Negotiated with buyer — typically advance against committed tonnage at contracted price",
    timeline:  "180 – 365 days after QP report, permits path confirmed, and buyer introduction",
    priority:  5,
  },
  {
    id:          "XRPL_PERMISSIONED_RECEIPT",
    displayName: "XRPL Permissioned RWA Receipt (PATE001 / PATECOAL)",
    eligibility: "BLOCKED",
    eligibilityNote: "Blocked — all legal and title work must be complete first",
    description:
      "A permissioned XRPL receipt can be issued to lender/escrow wallets as a digital proof-of-claim and " +
      "audit-trail record after the legal package is complete. NOT a public token sale. NOT a security by itself. " +
      "Issued only to authorized wallets after full legal clearance.",
    blockedReasons: [
      "Title clear required: DEED + MINERAL_RIGHTS_DEED + CHAIN_OF_TITLE + TITLE_OPINION",
      "Legal wrapper required: LEGAL_OPINION and SPV / pledge / lien structure",
      "FUNDING_TERM_SHEET required: lender terms must exist before XRPL receipt is issued",
      "Authorized trustline policy must be configured on XRPL issuer wallet",
      "Holder rights and redemption terms must be defined in writing",
      "Issuer policy and currency code (PATE001 / PATECOAL) must be finalized",
      "No public XRPL trading allowed until legal approval from transaction counsel",
    ],
    conditions: [
      "Use authorized trustlines only — no public XRPL trading",
      "Freeze / clawback rights enabled on TROPTIONS issuer wallet",
      "No stablecoin issuance backed by this XRPL receipt",
      "Issue only to: lender wallet, SPV wallet, escrow wallet, qualified private wallet",
    ],
    askRange:  "Receipt-only (not a direct funding source) — supports lender control record and audit trail",
    timeline:  "After all title, legal, and lender terms complete — Phase 3+",
    priority:  6,
  },
  {
    id:          "AAVE_ACCEPTED_COLLATERAL_ONLY",
    displayName: "Aave v3 — Accepted Crypto Collateral Only",
    eligibility: "BLOCKED",
    eligibilityNote: "Hard-blocked — raw coal/mineral rights are not Aave collateral",
    description:
      "Aave v3 accepts only approved crypto assets (ETH, WBTC, stablecoins) to borrow GHO/stablecoins. " +
      "Aave positions require overcollateralization and can be liquidated if health factor drops below 1. " +
      "Raw coal prospects and mineral rights cannot be deposited into Aave.",
    blockedReasons: [
      "Raw coal prospects and mineral rights are NOT in the Aave v3 collateral registry",
      "Aave requires overcollateralized accepted crypto assets — PATE-COAL-001 is not an ERC-20 token",
      "PATE-COAL-001 cannot be deposited into Aave Pool (0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2)",
      "Aave can only be used if TROPTIONS separately holds accepted crypto collateral (ETH / supported BTC wrapper / stablecoin) — not this coal asset",
    ],
    conditions: [],
    askRange:  "Not applicable — Aave can only be used with separately held accepted crypto assets",
    timeline:  "Not applicable",
    priority:  7,
  },
];

const PHASE_ROADMAP = [
  {
    phase: "Phase 1",
    label: "Diligence & Evidence",
    description: "Create PATE-COAL-001 data room. Collect missing title/legal/technical docs.",
    actions: [
      "Upload deed, mineral rights deed, chain of title",
      "Order lien search and UCC search",
      "Engage TN mineral-rights attorney for title opinion",
      "Commission updated QP / mining engineer report",
      "Obtain current TDEC permit status",
      "Pursue diligence bridge lender ($50K–$500K)",
    ],
  },
  {
    phase: "Phase 2",
    label: "Technical & Legal Package",
    description: "Updated QP report, title opinion, legal opinion, environmental review.",
    actions: [
      "Receive and review updated QP report",
      "Receive title opinion from TN attorney",
      "Complete environmental / SMCRA review",
      "Draft SPV / pledge / lien legal structure",
      "Receive legal opinion from transaction counsel",
      "Introduce to mining operators and JV candidates",
    ],
  },
  {
    phase: "Phase 3",
    label: "Lender / Investor Introduction",
    description: "Approach private mineral lenders, royalty financiers, and operators.",
    actions: [
      "Package lender data room (all docs, score ≥75)",
      "Approach private mineral lenders with NDA",
      "Execute operator JV or royalty / streaming agreement",
      "Negotiate term sheet",
      "Complete XRPL permissioned receipt setup (authorized trustlines only)",
    ],
  },
  {
    phase: "Phase 4",
    label: "Facility Close & TROPTIONS Recording",
    description: "Execute facility. Record evidence, signatures, liens, and payments in TROPTIONS.",
    actions: [
      "Execute loan / JV / royalty agreement",
      "TROPTIONS records all evidence hashes, lien, and escrow",
      "XRPL receipt issued to lender / SPV wallet (authorized trustlines only)",
      "TROPTIONS monitors repayment and lien release conditions",
    ],
  },
];

const ELIGIBILITY_STYLE: Record<RouteEligibility, { border: string; bg: string; text: string; badge: string }> = {
  ELIGIBLE:    { border: "border-green-700/40",  bg: "bg-green-900/10",  text: "text-green-300",  badge: "bg-green-800/40 text-green-400 border-green-700/50"  },
  CONDITIONAL: { border: "border-amber-700/40",  bg: "bg-amber-900/10",  text: "text-amber-300",  badge: "bg-amber-800/40 text-amber-400 border-amber-700/50"  },
  BLOCKED:     { border: "border-red-700/40",    bg: "bg-red-900/10",    text: "text-red-300",    badge: "bg-red-900/30 text-red-400 border-red-700/50"        },
};

export default function PateCoalFundingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">

        {/* Safety Disclosure */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Funding Route Disclaimers</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>All funding route assessments are <strong>simulation-only</strong>. No live credit, lending, Aave execution, or XRPL issuance is enabled.</li>
            <li>Do <strong>not</strong> present this asset as "$8.3B ready to borrow against." The first monetization path is a diligence bridge, operator JV, or royalty/streaming — not a large collateral loan.</li>
            <li>Lender advance rates against in-place value will be substantially lower — particularly at pre-permit, pre-operator stage.</li>
            <li>All financing requires independent lender diligence, executed legal documents, and arm's-length negotiation.</li>
          </ul>
        </div>

        {/* Breadcrumb + Header */}
        <div className="flex items-center gap-3">
          <Link href="/troptions/rwa/pate-coal" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Pate-Coal-001
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-slate-300">Funding Routes</span>
        </div>

        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            PATE-COAL-001 — Funding Routes Assessment
          </p>
          <h1 className="text-3xl font-bold">Funding Routes</h1>
          <p className="text-slate-400 text-base">
            7 routes assessed. 3 conditional (can initiate now). 4 blocked (require missing documents).
          </p>
        </header>

        {/* Route Summary Grid */}
        <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ROUTES.map((r) => {
            const style = ELIGIBILITY_STYLE[r.eligibility];
            return (
              <div key={r.id} className={`rounded-lg border ${style.border} ${style.bg} p-3 space-y-1`}>
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${style.badge}`}>
                  {r.eligibility}
                </span>
                <p className={`text-xs font-semibold ${style.text}`}>{r.displayName}</p>
                <p className="text-[10px] text-slate-500">{r.eligibilityNote}</p>
              </div>
            );
          })}
        </section>

        {/* Route Detail Cards */}
        {ROUTES.map((r) => {
          const style = ELIGIBILITY_STYLE[r.eligibility];
          return (
            <section key={r.id} className={`rounded-xl border ${style.border} bg-slate-900 p-5 space-y-4`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded border px-2 py-0.5 font-mono text-xs ${style.badge}`}>
                  {r.eligibility}
                </span>
                <h2 className="text-lg font-semibold text-white">{r.displayName}</h2>
              </div>

              <p className="text-sm text-slate-300">{r.description}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-0.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Ask Range</p>
                  <p className="text-sm text-white">{r.askRange}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Timeline</p>
                  <p className="text-sm text-white">{r.timeline}</p>
                </div>
              </div>

              {r.blockedReasons.length > 0 && (
                <div className="space-y-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-red-400">Blocked Because</p>
                  <ul className="space-y-1">
                    {r.blockedReasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                        <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-red-500" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {r.conditions.length > 0 && (
                <div className="space-y-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Conditions / Requirements</p>
                  <ul className="space-y-1">
                    {r.conditions.map((cond, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-200/80">
                        <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {cond}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}

        {/* Roadmap */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Phase-by-Phase Funding Roadmap
          </p>
          <div className="space-y-6">
            {PHASE_ROADMAP.map((ph, i) => (
              <div key={ph.phase} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-600 bg-amber-900/30 font-bold text-amber-400 text-sm">
                    {i + 1}
                  </div>
                  {i < PHASE_ROADMAP.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-slate-700" />
                  )}
                </div>
                <div className="pb-6 space-y-2">
                  <p className="font-semibold text-white">{ph.phase} — {ph.label}</p>
                  <p className="text-sm text-slate-400">{ph.description}</p>
                  <ul className="space-y-1">
                    {ph.actions.map((action, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-slate-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Aave Explanation Panel */}
        <section className="rounded-xl border border-red-700/30 bg-red-900/10 p-5 space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-red-400">
            Why Aave v3 Does Not Apply to This Asset
          </p>
          <p className="text-sm text-slate-300">
            Aave v3 is a DeFi lending protocol on Ethereum. It accepts only pre-approved crypto collateral assets
            (ETH, WBTC, stablecoins, etc.) deposited into the Aave Pool contract. When you deposit accepted
            collateral, you can borrow GHO or other stablecoins against it, subject to overcollateralization.
          </p>
          <p className="text-sm text-slate-300">
            Raw coal/mineral rights are <strong>not ERC-20 tokens</strong>, are <strong>not in the Aave v3
            collateral registry</strong>, and cannot be deposited into Aave Pool
            (0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2). No TROPTIONS XRPL IOU receipt for PATE-COAL-001
            will ever be accepted as Aave collateral.
          </p>
          <p className="text-sm text-amber-200/80">
            <strong>The only way Aave can support this operation:</strong> If TROPTIONS separately holds
            accepted crypto assets (ETH, supported BTC wrappers, stablecoins), those assets can be deposited
            into Aave to borrow GHO/stablecoins, and the proceeds could fund Pate diligence costs or purchase
            expenses. This is a separate operation from the coal asset itself.
          </p>
        </section>

        {/* Nav Footer */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/troptions/rwa/pate-coal" className="text-slate-400 hover:text-white transition-colors">
            ← Asset Overview
          </Link>
          <Link href="/troptions/rwa/pate-coal/readiness" className="text-amber-400 hover:text-amber-300 transition-colors">
            Readiness Checklist →
          </Link>
          <Link href="/troptions/rwa/pate-coal/documents" className="text-amber-400 hover:text-amber-300 transition-colors">
            Documents & Evidence →
          </Link>
        </div>

        {/* Safety Footer */}
        <footer className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2">Safety Statement</p>
          <p className="text-xs text-slate-500">
            No live IOU issuance, stablecoin issuance, custody, exchange, mining operation, permitting claim,
            Aave execution, token buyback, liquidity pool execution, or public investment functionality
            was enabled by this module. All funding route assessments are simulation-only.
          </p>
        </footer>

      </div>
    </main>
  );
}
