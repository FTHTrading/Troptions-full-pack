import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Readiness Checklist — PATE-COAL-001 | TROPTIONS RWA",
  description:
    "TROPTIONS PATE-COAL-001 readiness checklist — 22 required documents, score by category, and financing gate requirements for the Pate Prospect coal RWA package.",
};

type DocStatus = "SUBMITTED" | "MISSING" | "PENDING" | "VERIFIED";
type DocCategory = "TECHNICAL" | "TITLE" | "PERMITTING" | "COMMERCIAL";

interface DocRow {
  type:                string;
  label:               string;
  description:         string;
  status:              DocStatus;
  required:            boolean;
  hardBlocksFinancing: boolean;
  scoreWeight:         number;
  category:            DocCategory;
}

const DOCS: DocRow[] = [
  // ── Technical / Engineering (40 pts) ──
  { type: "ENGINEERING_APPRAISAL",       label: "Engineering Appraisal (2020)",           description: "James T. Weiss, PE appraisal — $8,378,310,000 in-place value",             status: "SUBMITTED", required: true,  hardBlocksFinancing: false, scoreWeight: 12, category: "TECHNICAL" },
  { type: "UPDATE_VALUATION_LETTER",     label: "2024 Valuation Update Letter",            description: "Conservatively maintains 2020 valuation",                                   status: "SUBMITTED", required: true,  hardBlocksFinancing: false, scoreWeight: 5,  category: "TECHNICAL" },
  { type: "APPENDIX_LEGAL_DESCRIPTION",  label: "Appendix — Legal Description",           description: "~3,790-acre prospect legal description",                                     status: "SUBMITTED", required: true,  hardBlocksFinancing: false, scoreWeight: 4,  category: "TECHNICAL" },
  { type: "COAL_RESERVE_TABLES",         label: "Estimated Coal Reserve Tables",           description: "Rex seam, underground, and per-seam reserve figures",                        status: "SUBMITTED", required: true,  hardBlocksFinancing: false, scoreWeight: 9,  category: "TECHNICAL" },
  { type: "COAL_ANALYSIS",               label: "Coal Analysis",                           description: "Coal quality analysis supporting the appraisal",                             status: "SUBMITTED", required: true,  hardBlocksFinancing: false, scoreWeight: 6,  category: "TECHNICAL" },
  { type: "GEOLOGY_REPORT",              label: "General Geology Appendix",                description: "Morgan County geology, seam maps, structural notes",                         status: "SUBMITTED", required: true,  hardBlocksFinancing: false, scoreWeight: 4,  category: "TECHNICAL" },
  // ── Title / Legal (25 pts) ──
  { type: "DEED",                        label: "Current Deed",                            description: "Current recorded deed for surface / mineral rights",                         status: "MISSING",   required: true,  hardBlocksFinancing: true,  scoreWeight: 5,  category: "TITLE" },
  { type: "MINERAL_RIGHTS_DEED",         label: "Mineral Rights Deed",                    description: "Severance document confirming coal/mineral ownership",                       status: "MISSING",   required: true,  hardBlocksFinancing: true,  scoreWeight: 7,  category: "TITLE" },
  { type: "CHAIN_OF_TITLE",              label: "Chain of Title",                          description: "Full chain from original grant to current holder",                           status: "MISSING",   required: true,  hardBlocksFinancing: true,  scoreWeight: 5,  category: "TITLE" },
  { type: "TAX_PARCEL_RECORDS",          label: "Tax Parcel Records",                      description: "Morgan County parcel IDs and current tax status",                            status: "MISSING",   required: true,  hardBlocksFinancing: false, scoreWeight: 2,  category: "TITLE" },
  { type: "LIEN_SEARCH",                 label: "Lien / Mortgage Search",                 description: "Confirms no prior liens or encumbrances on mineral rights",                  status: "MISSING",   required: true,  hardBlocksFinancing: true,  scoreWeight: 3,  category: "TITLE" },
  { type: "UCC_SEARCH",                  label: "UCC Search",                              description: "Confirms no prior security interests against mineral rights",                 status: "MISSING",   required: true,  hardBlocksFinancing: false, scoreWeight: 2,  category: "TITLE" },
  { type: "TITLE_OPINION",               label: "Attorney Title Opinion",                  description: "TN / mineral-rights attorney opinion on clear marketable title",             status: "MISSING",   required: true,  hardBlocksFinancing: true,  scoreWeight: 1,  category: "TITLE" },
  // ── Permitting / Environmental (20 pts) ──
  { type: "PERMIT_STATUS",               label: "Current Permit Status Report",            description: "TDEC surface/underground mining permit status and required path",            status: "MISSING",   required: true,  hardBlocksFinancing: true,  scoreWeight: 7,  category: "PERMITTING" },
  { type: "ENVIRONMENTAL_REPORT",        label: "Environmental Review",                    description: "SMCRA, water impact, wetlands, streams, violations review",                  status: "MISSING",   required: true,  hardBlocksFinancing: false, scoreWeight: 7,  category: "PERMITTING" },
  { type: "RECLAMATION_BOND_ESTIMATE",   label: "Reclamation Bond Estimate",              description: "Tennessee reclamation/bonding requirement estimate",                          status: "MISSING",   required: true,  hardBlocksFinancing: false, scoreWeight: 3,  category: "PERMITTING" },
  { type: "INSURANCE_ESTIMATE",          label: "Insurance / Liability Estimate",          description: "Public liability and surety bond estimate for TN mining permits",            status: "MISSING",   required: true,  hardBlocksFinancing: false, scoreWeight: 3,  category: "PERMITTING" },
  // ── Commercial / Lender (15 pts) ──
  { type: "LEGAL_OPINION",               label: "Legal Opinion — Structure",               description: "Transaction counsel opinion on pledge, SPV, and compliance",                 status: "MISSING",   required: true,  hardBlocksFinancing: true,  scoreWeight: 4,  category: "COMMERCIAL" },
  { type: "UPDATED_QP_REPORT",           label: "Updated Qualified-Person Mining Report",  description: "Updated QP/engineer report — recoverable tonnage, mine plan, CAPEX/OPEX",   status: "MISSING",   required: true,  hardBlocksFinancing: true,  scoreWeight: 5,  category: "COMMERCIAL" },
  { type: "OPERATOR_LOI",                label: "Mining Operator LOI",                     description: "LOI from operator interested in reviewing / operating the prospect",         status: "MISSING",   required: false, hardBlocksFinancing: false, scoreWeight: 2,  category: "COMMERCIAL" },
  { type: "OFFTAKE_LOI",                 label: "Coal Buyer / Offtake LOI",                description: "LOI from coal buyer or offtake broker for future production",                status: "MISSING",   required: false, hardBlocksFinancing: false, scoreWeight: 2,  category: "COMMERCIAL" },
  { type: "FUNDING_TERM_SHEET",          label: "Lender / Investor Term Sheet",            description: "Executed or draft term sheet from lender, JV, or streaming financier",       status: "MISSING",   required: false, hardBlocksFinancing: false, scoreWeight: 2,  category: "COMMERCIAL" },
];

const CATEGORY_META = {
  TECHNICAL:  { label: "Technical / Engineering", max: 40, color: "text-sky-400",    borderColor: "border-sky-800/40"   },
  TITLE:      { label: "Title / Legal",            max: 25, color: "text-amber-400",  borderColor: "border-amber-800/40" },
  PERMITTING: { label: "Permitting / Environmental", max: 20, color: "text-orange-400", borderColor: "border-orange-800/40" },
  COMMERCIAL: { label: "Commercial / Lender",      max: 15, color: "text-purple-400", borderColor: "border-purple-800/40" },
};

const STATUS_STYLE: Record<DocStatus, string> = {
  SUBMITTED: "bg-green-800/40 text-green-400 border-green-700/50",
  VERIFIED:  "bg-emerald-800/40 text-emerald-400 border-emerald-700/50",
  PENDING:   "bg-amber-800/40 text-amber-400 border-amber-700/50",
  MISSING:   "bg-red-900/30 text-red-400 border-red-700/50",
};

const FINANCING_GATE: string[] = [
  "DEED", "MINERAL_RIGHTS_DEED", "CHAIN_OF_TITLE",
  "LIEN_SEARCH", "TITLE_OPINION", "PERMIT_STATUS",
  "LEGAL_OPINION", "UPDATED_QP_REPORT",
];

export default function PateCoalReadinessPage() {
  const categories = ["TECHNICAL", "TITLE", "PERMITTING", "COMMERCIAL"] as const;
  const totalScore = DOCS.reduce(
    (sum, d) =>
      d.status === "SUBMITTED" || d.status === "VERIFIED" ? sum + d.scoreWeight : sum,
    0
  );

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">

        {/* Safety Disclosure */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Readiness Score Disclaimer</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>A readiness score of 100 / 100 does <strong>not</strong> mean financing is guaranteed. It means all required documents have been submitted for lender review.</li>
            <li>Actual financing requires independent lender / investor diligence, executed legal documents, and arm's-length negotiation.</li>
            <li>Score values are weighted estimates — not a regulatory or legal certification.</li>
          </ul>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/troptions/rwa/pate-coal" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Pate-Coal-001
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-slate-300">Readiness Checklist</span>
        </div>

        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            PATE-COAL-001 — Document Readiness
          </p>
          <h1 className="text-3xl font-bold">Readiness Checklist</h1>
          <p className="text-slate-400 text-base">
            22 required documents across 4 categories. 6 submitted from uploaded PDF evidence. 16 pending.
          </p>
        </header>

        {/* Score Summary */}
        <section className="grid gap-4 sm:grid-cols-5">
          <div className="sm:col-span-1 flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
            <span className="text-5xl font-bold text-amber-400">{totalScore}</span>
            <span className="text-sm text-slate-400">/ 100</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 text-center">
              Current Score
            </span>
          </div>
          <div className="sm:col-span-4 rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Score by Category</p>
            {categories.map((cat) => {
              const meta  = CATEGORY_META[cat];
              const earned = DOCS.filter(
                (d) => d.category === cat && (d.status === "SUBMITTED" || d.status === "VERIFIED")
              ).reduce((s, d) => s + d.scoreWeight, 0);
              const pct = Math.round((earned / meta.max) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-mono ${meta.color}`}>{meta.label}</span>
                    <span className="text-slate-400">{earned} / {meta.max} pts</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Financing Gate */}
        <section className="rounded-xl border border-red-700/30 bg-red-900/10 p-5 space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-red-400">
            Financing-Ready Gate — 8 Hard-Block Documents
          </p>
          <p className="text-sm text-slate-400">
            The following documents <strong>must</strong> be submitted and verified before this asset
            can be marked FINANCING_READY. Any missing item hard-blocks all major financing routes.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {FINANCING_GATE.map((t) => {
              const doc = DOCS.find((d) => d.type === t);
              const submitted = doc?.status === "SUBMITTED" || doc?.status === "VERIFIED";
              return (
                <div
                  key={t}
                  className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm ${
                    submitted
                      ? "border-green-700/40 bg-green-900/10 text-green-300"
                      : "border-red-700/40 bg-red-900/10 text-red-300"
                  }`}
                >
                  <span className="text-base">{submitted ? "✓" : "✗"}</span>
                  <span>{doc?.label ?? t}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-red-300/70">
            Currently: 0 / 8 gate documents satisfied. Status: NOT FINANCING-READY.
          </p>
        </section>

        {/* Per-Category Document Checklists */}
        {categories.map((cat) => {
          const meta     = CATEGORY_META[cat];
          const catDocs  = DOCS.filter((d) => d.category === cat);
          const submitted = catDocs.filter((d) => d.status === "SUBMITTED" || d.status === "VERIFIED").length;
          return (
            <section key={cat} className={`rounded-xl border ${meta.borderColor} bg-slate-900 p-5 space-y-4`}>
              <div className="flex items-center justify-between">
                <p className={`font-mono text-xs uppercase tracking-widest ${meta.color}`}>
                  {meta.label}
                </p>
                <span className="text-xs text-slate-500">{submitted} / {catDocs.length} submitted</span>
              </div>
              <div className="space-y-2">
                {catDocs.map((doc) => (
                  <div
                    key={doc.type}
                    className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800 p-3"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] ${STATUS_STYLE[doc.status]}`}
                    >
                      {doc.status}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-white">{doc.label}</p>
                        {doc.hardBlocksFinancing && (
                          <span className="rounded px-1 py-0.5 bg-red-900/40 font-mono text-[9px] text-red-400">
                            hard-block
                          </span>
                        )}
                        {!doc.required && (
                          <span className="rounded px-1 py-0.5 bg-slate-700 font-mono text-[9px] text-slate-400">
                            optional
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{doc.description}</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-slate-500">+{doc.scoreWeight} pts</span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Nav Footer */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/troptions/rwa/pate-coal" className="text-slate-400 hover:text-white transition-colors">
            ← Asset Overview
          </Link>
          <Link href="/troptions/rwa/pate-coal/funding" className="text-amber-400 hover:text-amber-300 transition-colors">
            Funding Routes →
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
            was enabled by this module. All readiness scores are simulation-only.
          </p>
        </footer>

      </div>
    </main>
  );
}
