import { PROOF_REGISTRY, getProofWorkflowStatus } from "@/content/troptions/proofRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge } from "@/components/troptions/StatusBadge";
import Link from "next/link";

type DiligenceSection = {
  id: string;
  title: string;
  status: "not-started" | "in-progress" | "complete" | "blocked";
  items: string[];
  notes: string;
  href?: string;
};

const DILIGENCE_SECTIONS: DiligenceSection[] = [
  {
    id: "DUE-001",
    title: "Entity Package",
    status: "not-started",
    items: [
      "Certificate of Formation / Articles of Incorporation",
      "Operating Agreement or Bylaws",
      "EIN / Tax ID Documentation",
      "Registered Agent Details",
      "Current Ownership Chart / Cap Table",
      "Board Roster and Authorization Resolutions",
    ],
    notes: "Core entity documentation package required before any institutional engagement.",
  },
  {
    id: "DUE-002",
    title: "Legal Opinions",
    status: "not-started",
    items: [
      "Securities Law Opinion (each token type)",
      "Commodity Law Opinion (Gold, Xtroptions Gold)",
      "Stablecoin Counsel Memo (stable units)",
      "Money-Transmission / MTL Opinion",
      "Barter / Utility Token Classification Memo",
      "ATS / Exchange Licensing Opinion",
      "RWA Tokenization Securities Exemption Analysis",
    ],
    notes: "Legal opinions must be obtained per token type and per program before institutional use.",
    href: "/troptions/legal",
  },
  {
    id: "DUE-003",
    title: "Token Role Memos",
    status: "not-started",
    items: [
      "Troptions Pay — utility barter token memo",
      "Troptions Gold — gold-custody commodity/security memo",
      "Troptions Unity — stable/humanitarian token memo",
      "Xtroptions — extended utility classification memo",
      "Stable Units — stablecoin / money classification memo",
      "RWA Certificates — securities exemption memo",
      "Restricted Instruments — offering documents",
    ],
    notes: "Per-token role memos define legal classification, audience, and transfer restrictions.",
    href: "/troptions/institutional/token-roles",
  },
  {
    id: "DUE-004",
    title: "Custody Package",
    status: "not-started",
    items: [
      "Qualified Custodian Agreement (per asset class)",
      "Multi-Sig Configuration and Board Approval",
      "Hot Wallet Insurance Coverage Certificate",
      "Cold Wallet Policy Documentation",
      "Reporting Cadence Agreement",
      "Physical Vault Receipts (Gold assets)",
    ],
    notes: "No asset custody is confirmed. All custody arrangements require signed agreements.",
    href: "/troptions/custody",
  },
  {
    id: "DUE-005",
    title: "Reserve Package",
    status: "not-started",
    items: [
      "Reserve Schedule (Gold — per asset)",
      "Warehouse Receipts and Assay Certificates",
      "Independent Reserve Attestation",
      "Reserve Ratio Documentation",
      "Stable Unit Reserve Proof",
      "Treasury / Bond / Reserve Asset Documentation",
    ],
    notes: "No reserve documentation exists. Required for all gold-backing and stable-value claims.",
    href: "/troptions/institutional/gold",
  },
  {
    id: "DUE-006",
    title: "Proof of Funds",
    status: "not-started",
    items: [
      "Bank Statements (90-day minimum)",
      "Funding Route Confirmations",
      "Escrow Account Documentation",
      "Treasury Balance Attestation",
    ],
    notes: "Required for funding route approvals and escrow activations.",
    href: "/troptions/funding",
  },
  {
    id: "DUE-007",
    title: "Proof of Reserves",
    status: "not-started",
    items: [
      "Custody Receipt Per Asset",
      "Reserve Hash and Blockchain Anchor",
      "Merkle Tree Reserve Proof (if applicable)",
      "Third-Party Attestation Letter",
    ],
    notes: "No proof-of-reserves package has been initiated.",
  },
  {
    id: "DUE-008",
    title: "Proof of Control",
    status: "not-started",
    items: [
      "Wallet Control Attestation",
      "Multi-Sig Key Holder Agreements",
      "On-Chain Signing Proof",
      "Cold Storage Access Controls",
    ],
    notes: "Required for institutional custody representation.",
  },
  {
    id: "DUE-009",
    title: "Merchant Network Evidence",
    status: "not-started",
    items: [
      "GivBux / Rail Provider Signed Agreement",
      "Single Verified Merchant Count (source + date)",
      "Geographic Coverage Disclosure",
      "Merchant Category Exclusion List",
      "Reconciliation Memo (480K vs 580K)",
      "MTL Status by Jurisdiction",
    ],
    notes: "All merchant claims blocked. Reconciliation memo required before any merchant count can be used.",
    href: "/troptions/institutional/merchant-network",
  },
  {
    id: "DUE-010",
    title: "Partner Confirmations",
    status: "not-started",
    items: [
      "Luxor / Alliance Group Agreement",
      "Rare Stones / Precious Metals Partner Agreement",
      "Rail Provider Confirmations",
      "Exchange / OTC Partner Letters of Intent or Agreements",
    ],
    notes: "All partner claims blocked. Signed agreements required for each named partner.",
    href: "/troptions/institutional/partners",
  },
  {
    id: "DUE-011",
    title: "Audit Reports",
    status: "not-started",
    items: [
      "Named Auditor Identity Confirmation",
      "Audit Methodology Document",
      "Full Audit Report with Exceptions",
      "Management Response to Exceptions",
      "Remediation Schedule",
    ],
    notes: "Audit claim (CLAIM-AUDIT-001) has no supporting documentation. Entire audit package is missing.",
    href: "/troptions/institutional/audit-room",
  },
  {
    id: "DUE-012",
    title: "RWA Title and Appraisal Documents",
    status: "not-started",
    items: [
      "Title or Deed per Asset",
      "Independent Appraisal per Asset",
      "Lien and Encumbrance Search per Asset",
      "Owner KYC/KYB per Asset",
      "SALP Intake Completion Certificate",
    ],
    notes: "SALP is in evaluation. No assets have passed full intake.",
    href: "/troptions/institutional/rwa",
  },
  {
    id: "DUE-013",
    title: "Bond / Treasury Documents",
    status: "not-started",
    items: [
      "Offering Documents per Instrument",
      "Securities Exemption or Registration (per instrument)",
      "Transfer Restrictions Policy",
      "Lockup Schedule",
      "Use-of-Proceeds Documentation",
      "Escrow / Bond Agent Agreement",
    ],
    notes: "No restricted instrument offering documents have been prepared.",
  },
  {
    id: "DUE-014",
    title: "Risk Disclosures",
    status: "not-started",
    items: [
      "Full Institutional Risk Disclosure Document",
      "Per-Token Risk Summary",
      "Jurisdiction Risk Map",
      "Counterparty Risk Disclosures",
    ],
    notes: "Risk matrix registered. Risk disclosure document not drafted.",
    href: "/troptions/institutional/risk",
  },
  {
    id: "DUE-015",
    title: "Open Exceptions",
    status: "not-started",
    items: [
      "Full open exception inventory from all proof packages",
      "Exception remediation timeline",
      "Board exception acknowledgment",
    ],
    notes: "All proof packages have exceptions. No exception register has been created.",
  },
  {
    id: "DUE-016",
    title: "Board Approvals",
    status: "not-started",
    items: [
      "Asset Issuance Board Resolution (per asset)",
      "Custody Provider Board Approval",
      "Funding Route Board Approval",
      "Exchange / OTC Board Approval",
      "Legal Opinion Acknowledgment",
      "Risk Disclosure Sign-off",
    ],
    notes: "No board approval documentation has been produced.",
  },
];

const statusColors: Record<string, string> = {
  "not-started": "border-slate-700 bg-slate-900",
  "in-progress": "border-yellow-700 bg-yellow-950/20",
  complete: "border-green-700 bg-green-950/20",
  blocked: "border-red-700 bg-red-950/20",
};

export default function DiligenceRoomPage() {
  const notStarted = DILIGENCE_SECTIONS.filter((s) => s.status === "not-started").length;
  const allProofBlocked = PROOF_REGISTRY.filter((p) => p.exceptions.length > 0).length;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Institutional — Diligence Room
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Troptions Institutional Diligence Room</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            Complete institutional diligence package tracker. {notStarted} of {DILIGENCE_SECTIONS.length} sections
            not started. This room defines every document required for full institutional readiness.
          </p>
          <div className="mt-6 flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{notStarted}</div>
              <div className="text-slate-500 text-xs mt-1">Sections Not Started</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{allProofBlocked}</div>
              <div className="text-slate-500 text-xs mt-1">Proof Packages with Exceptions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{DILIGENCE_SECTIONS.length}</div>
              <div className="text-slate-500 text-xs mt-1">Total Sections</div>
            </div>
          </div>
        </section>

        {/* Proof Package Status */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Proof Package Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROOF_REGISTRY.map((proof) => {
              const wf = getProofWorkflowStatus(proof);
              return (
                <div key={proof.proofId} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white text-sm font-semibold">{proof.label}</p>
                    <StatusBadge status={proof.currentStage} size="sm" />
                  </div>
                  <p className="text-slate-500 text-xs">{wf.currentStage} → {wf.nextStage}</p>
                  {wf.blockers.length > 0 && (
                    <p className="text-red-400 text-xs mt-1">{wf.blockers.length} blocker(s)</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Diligence Sections */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Diligence Sections ({DILIGENCE_SECTIONS.length})</h2>
          <div className="space-y-4">
            {DILIGENCE_SECTIONS.map((section) => (
              <div key={section.id} className={`border rounded-xl p-5 ${statusColors[section.status]}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[#C9A84C] font-mono text-xs">{section.id}</span>
                      <span className="text-slate-500 text-xs uppercase">{section.status}</span>
                    </div>
                    <h3 className="text-white font-bold">{section.title}</h3>
                    <p className="text-slate-400 text-xs mt-1">{section.notes}</p>
                  </div>
                  {section.href && (
                    <Link href={section.href} className="text-[#C9A84C] text-xs hover:underline whitespace-nowrap">
                      View →
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-3">
                  {section.items.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-red-400 mt-0.5">○</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
