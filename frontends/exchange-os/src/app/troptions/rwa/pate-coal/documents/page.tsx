import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documents & Evidence — PATE-COAL-001 | TROPTIONS RWA",
  description:
    "TROPTIONS PATE-COAL-001 uploaded evidence — Pate Prospect engineering appraisal summary, coal seam data, 25-item document request list.",
};

const UPLOADED_DOCS = [
  {
    label:   "1. Update — Pate Prospect 8-1-24",
    file:    "1. Update - Pate prospect 8-1-24.pdf",
    type:    "UPDATE_VALUATION_LETTER",
    summary:
      "2024 update letter from appraiser James T. Weiss, PE, MBA, F. NSPE. Conservatively maintains the " +
      "Pate Prospect valuation at the 2020 level of $8,378,310,000, noting that coal prices may have " +
      "increased since 2020 but holding the estimate conservative.",
    keyData: [
      "2024 update — valuation held at $8,378,310,000",
      "Authored by James T. Weiss, PE, MBA, F. NSPE",
      "Conservative: does not adjust upward despite potential coal price increases",
    ],
  },
  {
    label:   "2. Pate Summary 2-15-20",
    file:    "2. Pate Summary 2-15-20 pgs 1-3.pdf",
    type:    "ENGINEERING_APPRAISAL",
    summary:
      "2020 engineering appraisal summary for the Pate Prospect in Morgan County, Tennessee. Reports " +
      "approximately 3,790 acres, nine identified coal seams, and combined in-place value of $8,378,310,000. " +
      "Authored by James T. Weiss, PE, MBA, F. NSPE.",
    keyData: [
      "Location: Morgan County, Tennessee",
      "Reported acreage: approximately 3,790 acres",
      "Rex seam: 1,068,000 surface mineable tons",
      "Underground mineable: 139,282,500 tons",
      "Combined in-place value: $8,378,310,000",
      "Appraiser: James T. Weiss, PE, MBA, F. NSPE",
    ],
  },
  {
    label:   "3. Pate Appraisal — Full Appendix (pgs 4–37)",
    file:    "3. Pate Appraisal pgs 4 - 37.pdf",
    type:    "APPENDIX_LEGAL_DESCRIPTION / COAL_RESERVE_TABLES / COAL_ANALYSIS / GEOLOGY_REPORT",
    summary:
      "34-page appendix packet including: legal description of the prospect; estimated coal reserve tables " +
      "per seam; coal analysis supporting the appraisal; and general geology appendix covering Morgan " +
      "County stratigraphy, seam maps, and structural notes.",
    keyData: [
      "Legal description of ~3,790-acre prospect",
      "Per-seam reserve tables: Rex, Nemo, Morgan Springs, Sewanee, Richland, Wilder, Lower Wilder, Upper White Oak, Lower White Oak",
      "Coal quality / analysis data",
      "Geology appendix — Morgan County stratigraphy and structure",
    ],
  },
];

const COAL_SEAMS = [
  { name: "Rex",             type: "Surface",     note: "1,068,000 surface mineable tons" },
  { name: "Nemo",            type: "Underground", note: "Reserve data in appendix" },
  { name: "Morgan Springs",  type: "Underground", note: "Reserve data in appendix" },
  { name: "Sewanee",         type: "Underground", note: "Reserve data in appendix" },
  { name: "Richland",        type: "Underground", note: "Reserve data in appendix" },
  { name: "Wilder",          type: "Underground", note: "Reserve data in appendix" },
  { name: "Lower Wilder",    type: "Underground", note: "Reserve data in appendix" },
  { name: "Upper White Oak", type: "Underground", note: "Reserve data in appendix" },
  { name: "Lower White Oak", type: "Underground", note: "Reserve data in appendix" },
];

const MISSING_DOC_REQUEST_LIST = [
  { n: 1,  label: "Current deed (surface and/or mineral rights)",                   priority: "CRITICAL" },
  { n: 2,  label: "Mineral rights deed or severance document",                       priority: "CRITICAL" },
  { n: 3,  label: "Chain of title from original grant to current holder",            priority: "CRITICAL" },
  { n: 4,  label: "Tax parcel IDs — Morgan County, Tennessee",                       priority: "HIGH" },
  { n: 5,  label: "Property tax status and current tax certificate",                 priority: "HIGH" },
  { n: 6,  label: "Lien / mortgage search report",                                   priority: "CRITICAL" },
  { n: 7,  label: "UCC search — Morgan County and Tennessee Secretary of State",     priority: "HIGH" },
  { n: 8,  label: "Entity ownership / control documents (who can pledge / sell)",    priority: "CRITICAL" },
  { n: 9,  label: "Authority documents — who has right to pledge or convey mineral rights", priority: "CRITICAL" },
  { n: 10, label: "Full 1976 Michael Pitts report referenced in the appraisal",      priority: "HIGH" },
  { n: 11, label: "All drill-hole data and core logs",                               priority: "HIGH" },
  { n: 12, label: "Coal lab reports (proximate/ultimate analysis per seam)",         priority: "HIGH" },
  { n: 13, label: "Mine maps in higher resolution",                                  priority: "HIGH" },
  { n: 14, label: "Current permit status — TDEC Division of Water Resources",        priority: "CRITICAL" },
  { n: 15, label: "Any historical mining permits or permit applications",            priority: "MEDIUM" },
  { n: 16, label: "Environmental reports or environmental assessments",              priority: "HIGH" },
  { n: 17, label: "Reclamation / bond estimates for TN mining operations",           priority: "MEDIUM" },
  { n: 18, label: "Access road / haul road rights and easements",                    priority: "MEDIUM" },
  { n: 19, label: "Rail / truck logistics plan and freight costs to market",         priority: "MEDIUM" },
  { n: 20, label: "Any coal buyer / offtake LOIs or prior offers",                  priority: "MEDIUM" },
  { n: 21, label: "Any mining operator LOIs or discussions",                         priority: "MEDIUM" },
  { n: 22, label: "Any prior financing documents, liens, or existing pledges",       priority: "CRITICAL" },
  { n: 23, label: "Any lawsuits, disputes, or title claims on the property",         priority: "CRITICAL" },
  { n: 24, label: "Updated independent reserve / resource report from qualified PE", priority: "CRITICAL" },
  { n: 25, label: "Attorney title opinion from TN / mineral-rights attorney",        priority: "CRITICAL" },
];

const PRIORITY_STYLE: Record<string, string> = {
  CRITICAL: "bg-red-900/40 text-red-400 border-red-700/50",
  HIGH:     "bg-amber-900/30 text-amber-400 border-amber-700/50",
  MEDIUM:   "bg-slate-700 text-slate-300 border-slate-600",
};

export default function PateCoalDocumentsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">

        {/* Safety Disclosure */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Evidence Package Disclosures</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>Documents in this package are provided for <strong>diligence purposes only</strong>. No securities offering, investment advice, or guarantee is made.</li>
            <li>The engineering appraisal reports an in-place value, which is <strong>not</strong> a guaranteed market value, financing value, or recoverable reserve value.</li>
            <li>Lenders and investors must conduct their own independent due diligence.</li>
            <li>Document hashes and IPFS anchoring are pending — this package has not yet been cryptographically sealed.</li>
          </ul>
        </div>

        {/* Breadcrumb + Header */}
        <div className="flex items-center gap-3">
          <Link href="/troptions/rwa/pate-coal" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Pate-Coal-001
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-slate-300">Documents &amp; Evidence</span>
        </div>

        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            PATE-COAL-001 — Evidence Package
          </p>
          <h1 className="text-3xl font-bold">Documents &amp; Evidence</h1>
          <p className="text-slate-400 text-base">
            3 PDF files received — 6 document types covered. 16 additional documents needed.
          </p>
        </header>

        {/* Uploaded Document Details */}
        <section className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Uploaded Evidence</p>
          {UPLOADED_DOCS.map((doc) => (
            <div key={doc.type} className="rounded-xl border border-green-700/30 bg-slate-900 p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="rounded border border-green-700/50 bg-green-800/40 px-1.5 py-0.5 font-mono text-[10px] text-green-400 shrink-0 mt-0.5">
                  SUBMITTED
                </span>
                <div>
                  <p className="font-semibold text-white">{doc.label}</p>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5">{doc.file}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300">{doc.summary}</p>
              <ul className="space-y-1">
                {doc.keyData.map((kd, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {kd}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5">
                  <p className="font-mono text-[10px] uppercase text-slate-500">Document Hash</p>
                  <p className="font-mono text-xs text-amber-400">Pending — SHA-256 seal required</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5">
                  <p className="font-mono text-[10px] uppercase text-slate-500">IPFS CID</p>
                  <p className="font-mono text-xs text-amber-400">Pending publication</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Asset Description from Appraisal */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Asset Description — From Appraisal</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Location</p>
                <p className="text-sm text-white">Morgan County, Tennessee</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Reported Acreage</p>
                <p className="text-sm text-white">approximately 3,790 acres</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Rex Seam Surface Mineable</p>
                <p className="text-sm text-white">1,068,000 tons</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Underground Mineable</p>
                <p className="text-sm text-white">139,282,500 tons</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Reported In-Place Value</p>
                <p className="text-lg font-bold text-[#C9A84C]">$8,378,310,000</p>
                <p className="text-[10px] text-red-400 mt-0.5">Engineering estimate only — not guaranteed market value</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Appraiser</p>
                <p className="text-sm text-white">James T. Weiss, PE, MBA, F. NSPE</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Appraisal Year / Update</p>
                <p className="text-sm text-white">2020 / Updated 2024</p>
              </div>
            </div>
          </div>
        </section>

        {/* Coal Seam Table */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Identified Coal Seams — {COAL_SEAMS.length} Seams
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-2 pr-4 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500">Seam</th>
                  <th className="py-2 pr-4 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500">Mining Type</th>
                  <th className="py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500">Notes</th>
                </tr>
              </thead>
              <tbody>
                {COAL_SEAMS.map((seam) => (
                  <tr key={seam.name} className="border-b border-slate-800">
                    <td className="py-2 pr-4 text-white font-medium">{seam.name}</td>
                    <td className="py-2 pr-4">
                      <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                        seam.type === "Surface"
                          ? "bg-amber-900/40 text-amber-400"
                          : "bg-sky-900/30 text-sky-400"
                      }`}>
                        {seam.type}
                      </span>
                    </td>
                    <td className="py-2 text-slate-400">{seam.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">
            Reserve data from the 2020 engineering appraisal. Updated recoverable reserve tonnage requires
            a new qualified-person / mining engineer report.
          </p>
        </section>

        {/* Document Request List */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
              Document Request List — 25 Items
            </p>
            <div className="flex gap-2">
              <span className="rounded border border-red-700/50 bg-red-900/30 px-2 py-0.5 font-mono text-[10px] text-red-400">CRITICAL</span>
              <span className="rounded border border-amber-700/50 bg-amber-900/30 px-2 py-0.5 font-mono text-[10px] text-amber-400">HIGH</span>
              <span className="rounded border border-slate-600 bg-slate-700 px-2 py-0.5 font-mono text-[10px] text-slate-300">MEDIUM</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Request these from the asset owner. CRITICAL items are required before any lender will engage
            with a substantive facility review.
          </p>
          <div className="space-y-2">
            {MISSING_DOC_REQUEST_LIST.map((item) => (
              <div
                key={item.n}
                className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800 p-3"
              >
                <span className="shrink-0 font-mono text-xs text-slate-500 w-5 text-right">{item.n}.</span>
                <p className="flex-1 text-sm text-slate-300">{item.label}</p>
                <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] ${PRIORITY_STYLE[item.priority]}`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Valuation Warning */}
        <section className="rounded-xl border border-amber-700/30 bg-amber-900/10 p-5 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-400">Valuation Warning</p>
          <p className="text-sm text-amber-200/80">
            The reported in-place value of <strong>$8,378,310,000</strong> was determined by an independent
            engineer in 2020 and conservatively maintained in a 2024 update letter. This is an estimate of
            coal in-place value only. Recoverable value, market value, financing value, and liquidation
            value will all be substantially different and can only be determined through updated technical
            review, market analysis, permitting review, and arm's-length lender/buyer acceptance.
          </p>
          <p className="text-xs text-slate-500 italic">
            Do not present this asset as "$8.3B ready to borrow against." Present it as a mineral-rights
            prospect with engineering appraisal materials requiring further diligence before financing.
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
          <Link href="/troptions/rwa/pate-coal/funding" className="text-amber-400 hover:text-amber-300 transition-colors">
            Funding Routes →
          </Link>
        </div>

        {/* Safety Footer */}
        <footer className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2">Safety Statement</p>
          <p className="text-xs text-slate-500">
            No live IOU issuance, stablecoin issuance, custody, exchange, mining operation, permitting claim,
            Aave execution, token buyback, liquidity pool execution, or public investment functionality
            was enabled by this module. All evidence summaries and document statuses are simulation-only.
          </p>
        </footer>

      </div>
    </main>
  );
}
