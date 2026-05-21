import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pate Prospect — PATE-COAL-001 | TROPTIONS RWA",
  description:
    "TROPTIONS PATE-COAL-001 — Pate Prospect coal/mineral-rights RWA diligence package. Morgan County, Tennessee. Engineering appraisal received. Title, legal, and updated technical review required. Simulation-only.",
};

// ─── Static asset data (mirrors pateCoalRwaEngine defaults) ─────────────────

const ASSET = {
  assetId:              "PATE-COAL-001",
  assetName:            "Pate Prospect Tennessee Coal Prospect",
  assetType:            "Mineral Rights / Coal Resource / RWA Collateral Prospect",
  location:             "Morgan County, Tennessee",
  reportedAcreage:      "~3,790 acres",
  reportedInPlaceValue: "$8,378,310,000",
  appraiser:            "James T. Weiss, PE, MBA, F. NSPE",
  appraisalYear:        "2020",
  updateYear:           "2024",
  rexSeamSurfaceTons:   "1,068,000",
  undergroundTons:      "139,282,500",
  coalSeams:            [
    "Rex", "Nemo", "Morgan Springs", "Sewanee", "Richland",
    "Wilder", "Lower Wilder", "Upper White Oak", "Lower White Oak",
  ],
  readinessScore:       40,
  readinessLabel:       "Evidence Received / Early Diligence",
};

const UPLOADED_EVIDENCE = [
  { label: "Engineering Appraisal (2020)", file: "2. Pate Summary 2-15-20.pdf", status: "SUBMITTED", note: "Reports in-place value of $8,378,310,000; authored by James T. Weiss, PE" },
  { label: "2024 Valuation Update Letter", file: "1. Update - Pate prospect 8-1-24.pdf", status: "SUBMITTED", note: "Conservatively maintains 2020 valuation level" },
  { label: "Appendix — Legal Description", file: "3. Pate Appraisal pgs 4-37.pdf", status: "SUBMITTED", note: "Recorded legal description of approximately 3,790 acres" },
  { label: "Estimated Coal Reserve Tables", file: "3. Pate Appraisal pgs 4-37.pdf", status: "SUBMITTED", note: "Per-seam reserve tables; Rex, underground, and combined figures" },
  { label: "Coal Analysis",                file: "3. Pate Appraisal pgs 4-37.pdf", status: "SUBMITTED", note: "Quality analysis supporting the appraisal package" },
  { label: "General Geology Appendix",     file: "3. Pate Appraisal pgs 4-37.pdf", status: "SUBMITTED", note: "Morgan County geology, seam maps, structural notes" },
];

const ACTIVE_STATUSES = [
  { code: "EVIDENCE_RECEIVED",        color: "text-amber-400",  label: "Evidence Received" },
  { code: "TITLE_PENDING",            color: "text-orange-400", label: "Title Pending" },
  { code: "TECHNICAL_REPORT_PENDING", color: "text-yellow-400", label: "Technical Report Pending" },
  { code: "PERMITTING_PENDING",       color: "text-orange-300", label: "Permitting Pending" },
  { code: "ENVIRONMENTAL_PENDING",    color: "text-orange-300", label: "Environmental Pending" },
  { code: "LEGAL_PENDING",            color: "text-red-300",    label: "Legal Pending" },
];

const SUB_PAGES = [
  {
    href:        "/troptions/rwa/pate-coal/readiness",
    label:       "Readiness Checklist",
    description: "All 22 required documents with status, score breakdown by category, and gate requirements.",
  },
  {
    href:        "/troptions/rwa/pate-coal/funding",
    label:       "Funding Routes",
    description: "7 funding routes assessed: diligence bridge, private mineral lender, operator JV, offtake, royalty, XRPL receipt, and Aave status.",
  },
  {
    href:        "/troptions/rwa/pate-coal/documents",
    label:       "Documents & Evidence",
    description: "Uploaded evidence summary, coal seam data from the appraisal, and the complete 25-item document request list.",
  },
];

export default function PateCoalPage() {
  const pct = ASSET.readinessScore;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">

        {/* Safety Disclosure */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Important Disclosures — Read Before Proceeding</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>This page is a <strong>simulation-only RWA diligence module</strong>. No live IOU issuance, mining operation, stablecoin issuance, or public investment functionality is enabled.</li>
            <li>The reported in-place value of <strong>$8,378,310,000</strong> is an engineering estimate only. It is <strong>NOT</strong> a guaranteed market value, financing value, liquidation value, or recoverable reserve value.</li>
            <li>No financing should be presented as "ready" or "approved" based solely on the engineering appraisal. Title, legal, updated technical review, permitting, and lender acceptance are all required.</li>
            <li>TROPTIONS is not a licensed mining operator, commodity broker, registered investment adviser, or lender. No investment advice, guaranteed return, or securities offering is made.</li>
            <li>Lender advance rates against in-place value will be substantially lower — particularly at pre-permit, pre-operator stage.</li>
          </ul>
        </div>

        {/* Header */}
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            TROPTIONS — RWA Diligence Package
          </p>
          <h1 className="text-4xl font-bold">Pate Prospect</h1>
          <p className="text-slate-400 text-lg">
            PATE-COAL-001 — Coal / Mineral-Rights RWA Collateral Prospect
          </p>
        </header>

        {/* Asset Summary Card */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Asset Record
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Asset ID",           value: ASSET.assetId },
              { label: "Asset Type",         value: ASSET.assetType },
              { label: "Location",           value: ASSET.location },
              { label: "Reported Acreage",   value: ASSET.reportedAcreage },
              { label: "Appraiser",          value: ASSET.appraiser },
              { label: "Appraisal Year",     value: ASSET.appraisalYear },
              { label: "Update Year",        value: ASSET.updateYear },
              { label: "Coal Seams",         value: `${ASSET.coalSeams.length} identified seams` },
              { label: "Surface Tons (Rex)", value: `${ASSET.rexSeamSurfaceTons} (surface mineable)` },
              { label: "Underground Tons",   value: `${ASSET.undergroundTons} (underground mineable)` },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-0.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
                <p className="text-sm text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reported Value — with prominent disclaimer */}
        <section className="rounded-xl border border-amber-700/40 bg-amber-900/10 p-5 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Reported In-Place Value</p>
          <p className="text-3xl font-bold text-[#C9A84C]">{ASSET.reportedInPlaceValue}</p>
          <p className="text-sm text-amber-200/80">
            Engineering estimate of coal in-place value by James T. Weiss, PE, MBA, F. NSPE (2020),
            conservatively maintained in 2024 update letter. <strong>This is NOT a guaranteed market
            value, financing value, liquidity value, or sale price.</strong> Recoverable value, advance
            rates, and lender haircuts will differ substantially.
          </p>
        </section>

        {/* Readiness Score */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">RWA Readiness Score</p>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold">{pct}</span>
            <span className="text-xl text-slate-400">/&nbsp;100</span>
            <span className="ml-2 text-sm text-amber-300">{ASSET.readinessLabel}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            Score is based on weighted document categories (Technical 40 pts / Title 25 pts /
            Permitting 20 pts / Commercial 15 pts). Current uploaded evidence = 40 / 100.
            Remaining score unlocked as missing documents are submitted and verified.
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-4">
            {[
              { cat: "Technical",   earned: 40, max: 40 },
              { cat: "Title",       earned: 0,  max: 25 },
              { cat: "Permitting",  earned: 0,  max: 20 },
              { cat: "Commercial",  earned: 0,  max: 15 },
            ].map(({ cat, earned, max }) => (
              <div key={cat} className="space-y-1 rounded-lg border border-slate-700 bg-slate-800 p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{cat}</p>
                <p className="text-base font-semibold">
                  <span className={earned === max ? "text-green-400" : earned > 0 ? "text-amber-400" : "text-red-400"}>
                    {earned}
                  </span>
                  <span className="text-slate-500"> / {max}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Active Status Flags */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Active Status Flags</p>
          <div className="flex flex-wrap gap-2">
            {ACTIVE_STATUSES.map(({ code, color, label }) => (
              <span
                key={code}
                className={`rounded-full border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-xs ${color}`}
              >
                {label}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Multiple statuses can be active simultaneously. FINANCING_READY requires all PENDING flags resolved.
          </p>
        </section>

        {/* Uploaded Evidence */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Uploaded Evidence</p>
            <span className="rounded-full border border-green-700/50 bg-green-900/20 px-2 py-0.5 font-mono text-[10px] text-green-400">
              {UPLOADED_EVIDENCE.length} files received
            </span>
          </div>
          <div className="space-y-3">
            {UPLOADED_EVIDENCE.map((ev) => (
              <div key={ev.label} className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800 p-3">
                <span className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 bg-green-800/40 font-mono text-[10px] text-green-400">
                  {ev.status}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{ev.label}</p>
                  <p className="text-xs text-slate-400">{ev.note}</p>
                  <p className="font-mono text-[10px] text-slate-600 mt-0.5">{ev.file}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sub-page navigation */}
        <section className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Explore This Package</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {SUB_PAGES.map(({ href, label, description }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border border-slate-700 bg-slate-900 p-5 transition-colors hover:border-amber-600/50 hover:bg-slate-800 space-y-2"
              >
                <p className="font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
                  {label} →
                </p>
                <p className="text-xs text-slate-400">{description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Funding Phase */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Current Funding Phase</p>
          <p className="text-lg font-semibold text-amber-300">
            Phase 1 — Diligence Bridge / Title &amp; Technical Work
          </p>
          <p className="text-sm text-slate-400">
            The best immediate path is a <strong>smaller diligence bridge</strong> ($50K–$500K) to fund title
            work, an updated qualified-person mining report, legal opinion, and permitting review. A larger
            facility (private mineral lender, operator JV, or royalty/streaming) requires the complete package.
          </p>
          <p className="text-xs text-slate-500 italic">
            Do not present this asset as "$8.3B ready to borrow against." Present it as a mineral-rights
            prospect with an engineering appraisal that requires updated title, reserve, permitting, environmental,
            legal, and lender diligence before financing.
          </p>
        </section>

        {/* Safety Footer */}
        <footer className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Safety Statement</p>
          <p className="text-xs text-slate-500">
            No live IOU issuance, stablecoin issuance, custody, exchange, mining operation, permitting claim,
            Aave execution, token buyback, liquidity pool execution, or public investment functionality
            was enabled by this module. All readiness scores and route assessments are simulation-only.
          </p>
        </footer>

      </div>
    </main>
  );
}
