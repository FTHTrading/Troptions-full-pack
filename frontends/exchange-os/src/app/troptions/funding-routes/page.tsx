import type { Metadata } from "next";
import { XRPL_IOU_ASSET_CONFIGS } from "@/lib/troptions/xrplIouIssuanceEngine";

export const metadata: Metadata = {
  title: "Funding Routes | TROPTIONS",
  description:
    "TROPTIONS funding route comparison — private lender, asset buyer, merchant credit, Aave, XRPL IOU, AMM, and service fee revenue. Simulation-only readiness module.",
};

type RouteInfo = {
  id: string;
  displayName: string;
  description: string;
  status: "AVAILABLE" | "CONDITIONAL" | "BLOCKED";
  statusNote: string;
  eligibleAssets: string[];
  blockedAssets: string[];
  requirements: string[];
  timeline: string;
  aavePool?: string;
};

const ROUTES: RouteInfo[] = [
  {
    id: "PRIVATE_LENDER",
    displayName: "Private Lender / Family Office",
    description:
      "Asset-backed loan or credit facility from an accredited private lender or family office. Lender reviews TROPTIONS Gateway asset package, appraisal, custody proof, and legal wrapper before issuing a term sheet.",
    status: "CONDITIONAL",
    statusNote: "Conditional on complete asset package. Minimum 30% readiness score to begin dialogue.",
    eligibleAssets: ["AXL001", "BTCREC", "GOLD", "RWA", "USD"],
    blockedAssets: ["CARBON", "TROPTIONS"],
    requirements: [
      "KYC / KYB completed",
      "Independent appraisal or valuation",
      "Custody / vault agreement",
      "Insurance certificate",
      "SPV or pledge legal wrapper",
      "Legal opinion on issuance structure",
      "Redemption terms documented",
      "Lender NDA and intake form",
    ],
    timeline: "45 – 120 days from complete package",
  },
  {
    id: "ASSET_BUYER",
    displayName: "Asset Buyer / Strategic Partner",
    description:
      "Direct purchase or off-take agreement for the underlying asset. Most effective for liquid assets (carbon credits, precious metals, BTC) where a ready buyer can be sourced through commodity networks.",
    status: "CONDITIONAL",
    statusNote: "Conditional on asset liquidity and registry/ownership verification.",
    eligibleAssets: ["CARBON", "GOLD", "BTCREC"],
    blockedAssets: ["AXL001", "RWA", "USD", "TROPTIONS"],
    requirements: [
      "Asset registry record or assay certificate",
      "Serial numbers or custody statement",
      "AML / source-of-funds statement",
      "Ownership proof / transfer documentation",
      "KYC on all parties",
    ],
    timeline: "30 – 90 days depending on asset and buyer network",
  },
  {
    id: "MERCHANT_CREDIT",
    displayName: "Merchant Credit / Trade Settlement",
    description:
      "TROPTIONS-native credit line or trade settlement using TROPTIONS token as unit of account in closed-network merchant-to-merchant transactions. Requires merchant onboarding agreement.",
    status: "AVAILABLE",
    statusNote: "Available now for TROPTIONS native receipts within the merchant network.",
    eligibleAssets: ["TROPTIONS"],
    blockedAssets: ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD"],
    requirements: [
      "Merchant onboarding agreement",
      "KYC on merchant entity",
      "Acceptance of TROPTIONS settlement terms",
    ],
    timeline: "5 – 15 days once merchant network onboarding is complete",
  },
  {
    id: "AAVE_ACCEPTED_COLLATERAL",
    displayName: "Aave v3 DeFi Lending (Accepted Collateral Only)",
    description:
      "Deposit accepted collateral (WBTC, cbBTC, ETH, USDC, USDT, DAI) into Aave v3 lending pool to borrow against. Note: XRPL IOUs are not directly depositable in Aave — wrapping and bridging to Ethereum is required. Raw alexandrite, carbon credits, and RWA packages are NOT accepted by Aave.",
    status: "BLOCKED",
    statusNote: "Hard-blocked for all current TROPTIONS native IOUs — wrapping and Ethereum bridge required for BTCREC/USD.",
    eligibleAssets: [],
    blockedAssets: ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"],
    requirements: [
      "Asset must be wrapped to Ethereum-compatible token (WBTC, cbBTC, or stablecoin)",
      "XRPL → Ethereum bridge strategy defined and audited",
      "Aave v3 pool: 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
      "No raw gemstone, RWA package, or carbon credit is in the Aave registry",
      "Legal analysis of collateral posting across jurisdictions",
    ],
    timeline: "Immediate on Aave once collateral is bridged — bridge strategy is the blocker",
    aavePool: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
  },
  {
    id: "XRPL_IOU_RECEIPT",
    displayName: "XRPL IOU Receipt — Lender Proof",
    description:
      "Issue XRPL trustline IOUs to qualified, authorized counterparties as lender-readable proof of an asset position. IOU is not a guarantee of funds — it is a receipt that becomes meaningful when backed by custody documentation, legal wrapper, and redemption terms.",
    status: "CONDITIONAL",
    statusNote: "Conditional on IOU packet readiness ≥50%, KYC, legal opinion, and redemption terms.",
    eligibleAssets: ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"],
    blockedAssets: [],
    requirements: [
      "IOU packet readiness ≥50%",
      "Issuer wallet configured with RequireAuth",
      "Redemption terms documented",
      "Legal opinion completed",
      "KYC / KYB on issuer",
      "Authorized trustline set for each holder",
      "No live signing without board approval",
    ],
    timeline: "30 – 60 days from complete IOU readiness package",
  },
  {
    id: "AMM_AFTER_CLEARANCE",
    displayName: "XRPL AMM Liquidity Pool (Post-Legal Clearance)",
    description:
      "Add asset-backed IOUs to an XRPL AMM pool to provide secondary market liquidity. Hard-blocked until full legal, reserve proof, and public disclosure are complete. Not a current operational route.",
    status: "BLOCKED",
    statusNote: "Hard-blocked. Legal approval + reserve proof + public disclosure all required before any AMM execution.",
    eligibleAssets: [],
    blockedAssets: ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"],
    requirements: [
      "Legal opinion specifically approving public AMM participation",
      "Verified reserve proof on file",
      "Public disclosure document published",
      "Board / admin approval gate cleared",
      "IOU readiness score ≥80%",
      "Securities analysis completed if AMM tokens may be securities",
    ],
    timeline: "90 – 180 days minimum (legal clearance is the long pole)",
  },
  {
    id: "SERVICE_FEE_REVENUE",
    displayName: "Verification-as-a-Service / Admin Fee",
    description:
      "Earn origination fees, package preparation fees, and monthly administration fees for managing asset verification and IOU issuance on behalf of other asset owners. Revenue from service fees does not depend on any IOU being live.",
    status: "AVAILABLE",
    statusNote: "Available now. Revenue does not require live IOU issuance.",
    eligibleAssets: ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"],
    blockedAssets: [],
    requirements: [
      "Engagement letter signed with client",
      "KYC on client entity",
      "Scope of services defined in writing",
    ],
    timeline: "Per engagement — typically 15 – 30 days per client",
  },
];

const STATUS_STYLES: Record<RouteInfo["status"], { badge: string; border: string }> = {
  AVAILABLE:   { badge: "bg-green-900/40 text-green-300",  border: "border-green-700/40" },
  CONDITIONAL: { badge: "bg-amber-900/40 text-amber-300",  border: "border-amber-700/40" },
  BLOCKED:     { badge: "bg-red-900/40 text-red-300",      border: "border-red-700/40" },
};

export default function FundingRoutesPage() {
  const totalAssets = XRPL_IOU_ASSET_CONFIGS.length;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">

        {/* Safety Disclosure */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Important Disclosures</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>All funding routes on this page are in <strong>simulation-only</strong> / readiness mode. No live credit, lending, AMM, or DeFi execution is enabled.</li>
            <li>Route eligibility is determined by asset type and document readiness — not by any guarantee of actual funding.</li>
            <li>Aave v3 does not accept raw alexandrite, carbon credits, or RWA packages as collateral. Only Ethereum-native approved assets are accepted.</li>
            <li>TROPTIONS does not provide investment advice, guaranteed financing, guaranteed liquidity, or money transmission.</li>
            <li>All execution requires legal, compliance, provider, custody, signer, and board approvals.</li>
          </ul>
        </div>

        {/* Header */}
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            TROPTIONS — Funding Readiness
          </p>
          <h1 className="text-4xl font-bold">Funding Route Comparison</h1>
          <p className="max-w-2xl text-base text-slate-400 leading-7">
            TROPTIONS Gateway supports 7 funding routes depending on asset type, custody
            readiness, legal structure, and counterparty network. This page shows which
            routes are currently available, which are conditional on document completion,
            and which are hard-blocked by policy gates.
          </p>
          <p className="text-sm text-slate-500">
            Asset types in scope: {totalAssets} defined IOU types.
            All asset issuance is currently disabled — funding route analysis is simulation-only.
          </p>
        </header>

        {/* Route Grid */}
        <section className="space-y-6">
          {ROUTES.map((route) => {
            const styles = STATUS_STYLES[route.status];
            return (
              <div
                key={route.id}
                className={`rounded-xl border ${styles.border} bg-slate-900 p-6 space-y-4`}
              >
                {/* Route header */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] mb-1">
                      {route.id}
                    </p>
                    <h2 className="text-xl font-bold">{route.displayName}</h2>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold shrink-0 ${styles.badge}`}>
                    {route.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-6">{route.description}</p>

                {/* Status note */}
                <div className="rounded-lg bg-slate-800/60 px-4 py-2">
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Status: </span>
                    {route.statusNote}
                  </p>
                </div>

                {/* Asset eligibility */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {route.eligibleAssets.length > 0 && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-green-400 mb-1.5">Eligible Assets</p>
                      <div className="flex flex-wrap gap-1.5">
                        {route.eligibleAssets.map((a) => (
                          <span key={a} className="rounded-full bg-green-900/30 border border-green-700/40 px-2.5 py-0.5 text-xs text-green-300">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {route.blockedAssets.length > 0 && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-red-400 mb-1.5">Blocked / Not Applicable</p>
                      <div className="flex flex-wrap gap-1.5">
                        {route.blockedAssets.map((a) => (
                          <span key={a} className="rounded-full bg-red-900/20 border border-red-700/40 px-2.5 py-0.5 text-xs text-red-400">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {route.eligibleAssets.length === 0 && route.blockedAssets.length === 0 && (
                    <p className="text-xs text-slate-600 italic">No asset eligibility data.</p>
                  )}
                </div>

                {/* Requirements */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] mb-1.5">Requirements</p>
                    <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                      {route.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] mb-1.5">Timeline</p>
                    <p className="text-sm text-slate-400">{route.timeline}</p>
                    {route.aavePool && (
                      <div className="mt-2">
                        <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] mb-1">Aave v3 Pool</p>
                        <code className="text-xs text-slate-400 break-all">{route.aavePool}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Use of Proceeds Summary */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-xl font-semibold">Use of Proceeds — Standard Waterfall</h2>
          <p className="text-sm text-slate-500">
            All proceeds from any funded route are distributed in the following priority order.
            Holder distributions are conditional on counsel-approved structure only.
          </p>
          <div className="space-y-2">
            {[
              { rank: 1, label: "Taxes & statutory withholdings",          note: "Mandatory" },
              { rank: 2, label: "Third-party hard costs (assay, legal)",   note: "Mandatory" },
              { rank: 3, label: "Custody & vault fees",                    note: "Operational" },
              { rank: 4, label: "Insurance premiums",                      note: "Operational" },
              { rank: 5, label: "Reserve account funding",                 note: "Operational" },
              { rank: 6, label: "Lender interest & principal",             note: "Senior" },
              { rank: 7, label: "Operator / sponsor fee",                  note: "Operator" },
              { rank: 8, label: "Holder / participant distribution",       note: "Conditional — counsel-approved only" },
            ].map((item) => (
              <div key={item.rank} className="flex items-center gap-3 text-sm">
                <span className="font-mono text-xs text-[#C9A84C] w-5 shrink-0">{item.rank}.</span>
                <span className="text-slate-300 flex-1">{item.label}</span>
                <span className="text-xs text-slate-500 shrink-0">{item.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Footer */}
        <section className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5 space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Safety Statement</p>
          <p className="text-sm text-slate-500 leading-6">
            TROPTIONS does not provide custody, exchange services, money transmission, investment advice,
            guaranteed financing, guaranteed liquidity, carbon offset guarantees, public token buybacks,
            or public LP execution. All execution requires legal, compliance, provider, custody, signer,
            and board approvals. This page is simulation-only.
          </p>
        </section>

      </div>
    </main>
  );
}
