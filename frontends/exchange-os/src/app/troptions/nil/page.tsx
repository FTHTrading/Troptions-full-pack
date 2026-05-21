import Link from "next/link";
import { Card, Badge, SectionHeader } from "@/components/ui";
import { NarrationBar } from "@/components/NarrationBar";

export const metadata = {
  title: "TROPTIONS NIL Creator System — Institutional NIL Rights & Web3 Infrastructure",
  description:
    "A compliance-first NIL rights and campaign management framework for creators, athletes, musicians, influencers, educators, and entrepreneurs — backed by sovereign blockchain infrastructure.",
};

const PAGE_NARRATION = `
TROPTIONS NIL Creator System.
A compliance-first Name, Image, and Likeness rights framework for creators, athletes, musicians, influencers, educators, and entrepreneurs.
TROPTIONS NIL is not a marketplace. It is a governance-grade infrastructure layer.
Every creator identity is verified on-chain. Every agreement is anchored to the TSN Layer-1 ledger.
Every campaign payout is settled through x402 payment rails.
Institutions trust it because it is built like one - with NCAA compliance, FTC disclosure enforcement, guardian consent for minors, KYC, W-9 tax compliance, and a transparent on-chain NIL Ledger.
Creators trust it because it is sovereign - they own their identity, their contracts, and their rights.
`.trim();

const WHAT_NIL_DOES = [
  { icon: "ID", title: "Sovereign Creator Identity", body: "Every creator receives a TSN-ID - a persistent, verifiable on-chain identity anchored to the TROPTIONS Sovereign Network. It follows you across platforms." },
  { icon: "SC", title: "On-Chain NIL Contracts", body: "NIL agreements are executed as smart contracts on TSN Layer-1. Immutable. Auditable. No PDFs getting lost in email." },
  { icon: "NR", title: "NIL Receipts", body: "Every campaign interaction produces a cryptographic NIL Receipt - proof of deliverable completion anchored on-chain, accessible forever." },
  { icon: "402", title: "x402 Payment Rails", body: "Campaign payouts route through the x402 AI-to-AI payment protocol on Apostle Chain. Instant settlement, full audit trail, no intermediaries." },
  { icon: "L1", title: "TSN Layer-1 Integration", body: "The TROPTIONS Sovereign Network native Layer-1 hosts the NIL Registry, creator media rights ledger, and dispute resolution anchors." },
  { icon: "NFT", title: "Media Rights as Digital Assets", body: "Creator media - photos, clips, voice recordings, likenesses - is tokenized as verifiable digital assets with provenance and licensing terms encoded on-chain." },
  { icon: "KYB", title: "Brand & Sponsor Verification", body: "Brands and sponsors are KYB-verified before they can issue campaign invitations. No anonymous sponsor payments. Every payer is known." },
  { icon: "LGR", title: "NIL Transparency Ledger", body: "A public, queryable ledger of all NIL campaign activity - campaign IDs, creator types, deliverables completed, and payout references. Privacy-preserving yet auditable." },
] as const;

const CREATOR_TYPES = [
  { type: "ATHLETE", kicker: "Collegiate & Professional", description: "Student-athletes, professional athletes, fitness coaches, and personal trainers. NCAA compliance gates enforced at the contract layer - no contingency clauses, no pay-for-play.", web3Tag: "TSN Athletic Registry", examples: ["NCAA athlete", "Pro athlete", "Fitness coach", "Personal trainer"] },
  { type: "MUSICIAN", kicker: "Recording & Performance", description: "Singers, producers, DJs, and composers. Media rights tokenized as licensing NFTs. Royalty distribution anchored on TSN Layer-1.", web3Tag: "Media Rights Protocol", examples: ["Singer", "Music producer", "DJ", "Composer"] },
  { type: "INFLUENCER", kicker: "Digital & Social", description: "Content creators, streamers, and social media personalities. FTC disclosure compliance enforced at contract execution. x402 per-post micro-payments.", web3Tag: "Creator Content Rail", examples: ["YouTuber", "Streamer", "Podcaster", "Social media creator"] },
  { type: "EDUCATOR", kicker: "Academic & Instructional", description: "Teachers, coaches, professors, and instructors. Institutional-grade identity verification and verifiable credential anchoring for educational NIL contexts.", web3Tag: "Credential Anchor", examples: ["Professor", "Coach", "Online instructor", "Workshop facilitator"] },
  { type: "ENTREPRENEUR", kicker: "Founders & Builders", description: "Founders, business owners, and community leaders. NIL used for thought leadership, brand ambassador programs, and sponsored research.", web3Tag: "Founder Identity Layer", examples: ["Startup founder", "Business owner", "Community leader", "Industry expert"] },
] as const;

const COMPLIANCE_RULES = [
  { title: "Real Business Purpose", description: "Every NIL deal requires legitimate promotional activity. Pay-for-play is blocked at the contract layer.", status: "REQUIRED" },
  { title: "Reasonable Compensation", description: "Deal amount is benchmarked against deliverables and market conditions via the TROPTIONS NIL Pricing Engine.", status: "REQUIRED" },
  { title: "No School Ties (NCAA)", description: "Compensation cannot be contingent on school attendance, enrollment, or athletic performance. Enforced in contract templates.", status: "REQUIRED" },
  { title: "Executed Media Release", description: "Creator signature on an approved media release is required before any content can be used in campaigns.", status: "REQUIRED" },
  { title: "FTC Disclosure", description: "All sponsored content must include #ad or equivalent disclosure. Enforced at campaign activation - non-compliant posts are flagged.", status: "REQUIRED" },
  { title: "Guardian Consent (Minors)", description: "Creators under 18 require documented parent or legal guardian consent before any campaign is activated.", status: "MINORS REQUIRED" },
  { title: "KYC / AML Verification", description: "All creators complete identity verification. All sponsors and brands complete KYB verification before entering the system.", status: "REQUIRED" },
  { title: "W-9 / Tax Compliance", description: "Tax identification (SSN or EIN) collected before any payout. 1099 issued for payouts over $600/year.", status: "REQUIRED" },
] as const;

const CAMPAIGN_TYPES = [
  { name: "Creator Interview Sponsorship", deliverables: "1 TNN episode featuring creator - scripted appearance, branded segment", compensation: "Sponsor pays creator appearance fee; delivered via x402 settlement", minorsAllowed: true, web3: "NIL Receipt minted on completion" },
  { name: "Social Media Post Package", deliverables: "4-12 sponsored social posts with FTC disclosure (#ad) required", compensation: "Per-post fee settled via x402 micro-payment rail", minorsAllowed: true, web3: "Per-post compliance verified on-chain" },
  { name: "Merchant Visit / Appearance", deliverables: "In-person visit, photography, social stories - geotagged proof required", compensation: "Appearance fee + photo usage license", minorsAllowed: true, web3: "Geotagged proof anchored to TSN" },
  { name: "Event Appearance", deliverables: "Attend event, sign autographs, photo opportunities - event credential required", compensation: "Appearance fee (18+ only, due to event logistics)", minorsAllowed: false, web3: "Event credential verified on-chain" },
  { name: "Brand Ambassador Program", deliverables: "Multi-month exclusive relationship - monthly deliverables tracked on-chain", compensation: "Monthly retainer settled via x402 recurring payment", minorsAllowed: true, web3: "Recurring x402 payment stream" },
  { name: "Instructional Clinic / Training Session", deliverables: "Lead training session or instructional content - attendee verification required", compensation: "Teaching fee + content licensing revenue", minorsAllowed: true, web3: "Content rights tokenized on TSN" },
];

const ONBOARDING_STEPS = [
  { step: 1, title: "Identity Verification", description: "Submit government-issued ID, selfie verification, and social media profile links. TROPTIONS issues a TSN-ID - your permanent sovereign creator identity.", status: "REQUIRED", web3: "TSN-ID minted on verified submission" },
  { step: 2, title: "Guardian Consent", description: "For creators under 18: upload signed parent/legal guardian consent form with proof of relationship. Cannot proceed without this.", status: "MINORS ONLY", web3: "Consent anchor stored on-chain" },
  { step: 3, title: "Media Release Execution", description: "Sign the TROPTIONS Media Release Agreement granting TROPTIONS and verified sponsors limited use of your likeness. Revocable per campaign.", status: "REQUIRED", web3: "Signature anchored to TSN Layer-1" },
  { step: 4, title: "KYC / Tax Compliance", description: "Provide tax identification (SSN or EIN), complete W-9 or equivalent, and submit address verification. Required for all payout recipients.", status: "REQUIRED", web3: "KYC status stored in encrypted creator record" },
  { step: 5, title: "Media Kit Assembly", description: "Upload photos, video clips, follower statistics, prior campaign examples. Media is tokenized as verifiable digital assets on TSN.", status: "RECOMMENDED", web3: "Media rights tokenized on TSN" },
  { step: 6, title: "Final Compliance Review", description: "TROPTIONS compliance team reviews the complete creator record. Upon approval, creator status is set to CAMPAIGN-READY on the NIL Transparency Ledger.", status: "REQUIRED", web3: "CAMPAIGN-READY status published to NIL Ledger" },
];

const WEB3_INFRASTRUCTURE = [
  { icon: "ID", title: "Sovereign Creator Identity (TSN-ID)", body: "A persistent, blockchain-native identity issued on the TROPTIONS Sovereign Network. Portable across all TROPTIONS products and verifiable by any party." },
  { icon: "SC", title: "On-Chain NIL Contracts", body: "Campaign agreements execute as smart contracts on TSN Layer-1. Terms, deliverables, compensation, and expiry are encoded at the protocol level - not in PDFs." },
  { icon: "NR", title: "NIL Receipts", body: "Every completed campaign deliverable mints a NIL Receipt - a cryptographic proof of performance anchored on-chain. Auditable by sponsors, regulators, and creators." },
  { icon: "402", title: "x402 Payment Rail", body: "Payouts settle through the x402 AI-to-AI payment protocol on Apostle Chain (chain_id 7332). Sub-second settlement, zero intermediary float, full on-chain audit trail." },
  { icon: "L1", title: "TSN Layer-1 Integration", body: "The TROPTIONS Sovereign Network native Layer-1 hosts the NIL Creator Registry, media rights ledger, and dispute resolution anchors. No third-party chain dependency." },
  { icon: "NFT", title: "Creator Media Rights as Digital Assets", body: "Photos, video clips, voice recordings, and likenesses are tokenized as digital assets with provenance, licensing terms, and expiry encoded on-chain." },
  { icon: "KYB", title: "Brand & Sponsor Verification", body: "Every sponsor and brand undergoes KYB verification before entering the NIL system. Campaign invitations from unverified parties are blocked at the protocol level." },
  { icon: "LGR", title: "NIL Transparency Ledger", body: "A public, queryable ledger of all NIL campaign activity. Campaign IDs, creator types, deliverables, and payout references are recorded. Privacy-preserving - no PII exposed." },
];

const COMPARISON = [
  { feature: "Creator Identity", traditional: "Username / email - platform-dependent", troptions: "TSN-ID - sovereign, portable, on-chain" },
  { feature: "Campaign Agreement", traditional: "PDF contract emailed back and forth", troptions: "Smart contract on TSN Layer-1 - immutable, timestamped" },
  { feature: "Proof of Performance", traditional: "Screenshot, spreadsheet, verbal confirmation", troptions: "NIL Receipt - cryptographic proof minted on-chain" },
  { feature: "Payout Settlement", traditional: "ACH / wire - 2-5 business days, float risk", troptions: "x402 payment rail - sub-second, no intermediary" },
  { feature: "Compliance Enforcement", traditional: "Manual review, best-effort", troptions: "Protocol-level - NCAA, FTC, KYC enforced at contract layer" },
  { feature: "Audit Trail", traditional: "Emails, invoices - easily lost or altered", troptions: "NIL Transparency Ledger - permanent, tamper-evident" },
  { feature: "Sponsor Verification", traditional: "Ad hoc - no standard verification", troptions: "KYB-required - no anonymous sponsor payments" },
];

export default function TroptionsNilPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#071426] to-[#0a1a2e]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-14">
          <p className="te-kicker mb-3">TROPTIONS NIL Creator System</p>
          <h1 className="text-5xl font-bold text-white mb-5 leading-tight">
            Institutional-Grade NIL Rights
            <span className="block text-[#f0cf82]">Backed by Sovereign Infrastructure</span>
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-3xl">
            A compliance-first Name, Image, and Likeness rights management framework for creators, athletes, musicians,
            influencers, educators, and entrepreneurs - built on the TROPTIONS Sovereign Network.
          </p>
          <p className="text-base text-slate-400 mb-8 max-w-3xl">
            TROPTIONS NIL is not a marketplace. It is a governance layer. Every creator identity is verified on-chain. Every
            agreement executes as a smart contract. Every campaign payout settles through x402 payment rails. Compliance is
            enforced at the protocol level - not as policy documents.
          </p>
          <NarrationBar text={PAGE_NARRATION} label="Narrate this page" className="mb-8 max-w-xl" />
          <div className="flex gap-4 flex-wrap">
            <button className="inline-flex items-center rounded-lg bg-[#c99a3c] px-6 py-3 font-bold text-[#111827] cursor-not-allowed opacity-50">
              Creator Enrollment (Coming Soon)
            </button>
            <Link href="/troptions/layer1" className="inline-flex items-center rounded-lg border border-[#C9A84C] px-6 py-3 font-bold text-[#f0cf82] hover:bg-[#C9A84C]/10 transition-colors">
              View TSN Layer-1 -&gt;
            </Link>
            <Link href="/troptions/media" className="inline-flex items-center rounded-lg border border-white/20 px-6 py-3 font-semibold text-slate-300 hover:border-white/40 transition-colors">
              TNN Shows
            </Link>
          </div>
        </div>

        <div className="mb-16">
          <SectionHeader eyebrow="Platform Capabilities" heading="What TROPTIONS NIL Does" body="Eight foundational capabilities that make TROPTIONS NIL a governance-grade infrastructure layer" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {WHAT_NIL_DOES.map((item) => (
              <Card key={item.title} className="h-full hover:border-[#C9A84C]/80 hover:bg-white/3 transition-all">
                <div className="p-6 space-y-3 h-full flex flex-col">
                  <span className="text-sm font-mono font-bold text-[#f0cf82]">{item.icon}</span>
                  <h3 className="text-base font-semibold text-[#f0cf82]">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <SectionHeader eyebrow="Creator Verticals" heading="Who TROPTIONS NIL Serves" body="Five creator verticals with tailored compliance templates and Web3 identity anchoring" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {CREATOR_TYPES.map((ct) => (
              <Card key={ct.type} className="h-full hover:border-[#C9A84C]/80 hover:bg-white/3 transition-all">
                <div className="p-6 space-y-3 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="te-kicker text-[#C9A84C] text-xs mb-1">{ct.kicker}</p>
                      <h3 className="text-lg font-semibold text-white">{ct.type}</h3>
                    </div>
                    <Badge variant="mono">{ct.web3Tag}</Badge>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{ct.description}</p>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-slate-500 mb-1 font-bold uppercase">Examples</p>
                    <div className="flex flex-wrap gap-1">
                      {ct.examples.map((ex) => (
                        <span key={ex} className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-400">{ex}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <SectionHeader eyebrow="Regulatory Compliance" heading="Compliance Framework" body="NCAA, FTC, KYC, AML, and tax compliance enforced at the protocol layer - not as policy documents" />
          <div className="grid gap-3 mt-8">
            {COMPLIANCE_RULES.map((rule) => (
              <Card key={rule.title} className="hover:border-[#C9A84C]/80 hover:bg-white/3 transition-all">
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-1">{rule.title}</h3>
                    <p className="text-sm text-slate-400">{rule.description}</p>
                  </div>
                  <Badge variant={rule.status === "REQUIRED" ? "red" : rule.status === "MINORS REQUIRED" ? "amber" : "blue"}>{rule.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <SectionHeader eyebrow="Deal Structures" heading="Campaign Types" body="Six approved NIL deal structures with on-chain deliverable tracking and x402 settlement" />
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            {CAMPAIGN_TYPES.map((ct) => (
              <Card key={ct.name} className="h-full hover:border-[#C9A84C]/80 hover:bg-white/3 transition-all">
                <div className="p-6 space-y-4 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-white flex-1">{ct.name}</h3>
                    <Badge variant={ct.minorsAllowed ? "green" : "amber"}>{ct.minorsAllowed ? "All Ages" : "18+"}</Badge>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Deliverables</p>
                      <p className="text-sm text-slate-300">{ct.deliverables}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Compensation</p>
                      <p className="text-sm text-slate-300">{ct.compensation}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-[#C9A84C]/70 font-mono">{ct.web3}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <SectionHeader eyebrow="Creator Onboarding" heading="Six-Step Enrollment Process" body="A rigorous, governance-grade onboarding flow - each step anchors verifiable state to the blockchain" />
          <div className="space-y-4 mt-8">
            {ONBOARDING_STEPS.map((step) => (
              <Card key={step.step} className="hover:border-[#C9A84C]/80 hover:bg-white/3 transition-all">
                <div className="p-6 flex items-start gap-6">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[#c99a3c] text-[#111827] flex items-center justify-center font-bold text-lg">{step.step}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                      <h4 className="text-base font-semibold text-white">{step.title}</h4>
                      <Badge variant={step.status === "REQUIRED" ? "red" : step.status === "MINORS ONLY" ? "amber" : "blue"}>{step.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{step.description}</p>
                    <p className="text-xs text-[#C9A84C]/70 font-mono">{step.web3}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="rounded-xl border border-[#C9A84C]/20 bg-linear-to-br from-[#C9A84C]/5 to-transparent p-8 mb-8">
            <p className="te-kicker mb-2">Sovereign Blockchain Infrastructure</p>
            <h2 className="text-3xl font-bold text-white mb-4">Web3 NIL Infrastructure</h2>
            <p className="text-slate-300 max-w-2xl">TROPTIONS NIL is built on the TROPTIONS Sovereign Network - a purpose-built Layer-1 blockchain for rights management, creator identity, and institutional campaign governance. Every component below operates on-chain with no reliance on centralized platforms.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WEB3_INFRASTRUCTURE.map((item) => (
              <Card key={item.title} className="h-full hover:border-[#C9A84C]/80 hover:bg-white/3 transition-all">
                <div className="p-6 space-y-3 h-full flex flex-col">
                  <span className="text-sm font-mono font-bold text-[#f0cf82]">{item.icon}</span>
                  <h3 className="text-base font-semibold text-[#f0cf82]">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{item.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <SectionHeader eyebrow="Differentiation" heading="TROPTIONS NIL vs. Traditional NIL" body="Why governance infrastructure outperforms platform-dependent NIL marketplaces" />
          <div className="mt-8 rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-6 py-4 text-slate-400 font-semibold w-1/4">Feature</th>
                  <th className="text-left px-6 py-4 text-slate-400 font-semibold">Traditional NIL</th>
                  <th className="text-left px-6 py-4 text-[#f0cf82] font-semibold">TROPTIONS NIL</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, index) => (
                  <tr key={row.feature} className={`border-b border-white/5 ${index % 2 === 0 ? "" : "bg-white/3"}`}>
                    <td className="px-6 py-4 font-medium text-white">{row.feature}</td>
                    <td className="px-6 py-4 text-slate-400">{row.traditional}</td>
                    <td className="px-6 py-4 text-slate-200">{row.troptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-[#C9A84C]/30 bg-linear-to-r from-[#C9A84C]/5 to-transparent p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Important Information</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#f0cf82] mb-3">Tax & Reporting</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>NIL income is generally taxable as self-employment income</li>
                <li>Track all expenses (agency fees, media production, travel)</li>
                <li>Report on Schedule C if self-employed</li>
                <li>TROPTIONS issues 1099 for payouts over $600/year</li>
                <li>Keep all campaign contracts and payment records</li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#f0cf82] mb-3">Guardian Consent</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>Required for all creators under 18</li>
                <li>Must be signed by parent or legal guardian</li>
                <li>Must include proof of guardianship relationship</li>
                <li>Campaign activation blocked without consent on file</li>
                <li>Guardian may revoke consent at any time</li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#f0cf82] mb-3">NCAA Compliance</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>No compensation contingent on enrollment or performance</li>
                <li>No school marks or branding without institutional license</li>
                <li>Athlete must report NIL activity per school policy</li>
                <li>TROPTIONS enforces these rules at the contract layer</li>
                <li>Consult your school compliance office before enrolling</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Disclaimers</p>
            <div className="space-y-1.5 text-xs text-slate-500">
              <p>TROPTIONS NIL does not guarantee sponsorships, follower growth, fame, or income. No deal is guaranteed until fully executed on-chain.</p>
              <p>All creators must comply with applicable NCAA, FTC, state, and federal laws. TROPTIONS compliance tooling assists but does not constitute legal advice.</p>
              <p>Tax reporting is the creator&apos;s responsibility. TROPTIONS provides 1099s but is not a tax advisor.</p>
              <p>Payouts are simulation-only pending governance gate clearance. Live payment settlement via x402 will be enabled upon platform launch.</p>
              <p>x402 payment rail and on-chain NIL receipts require TSN Layer-1 mainnet activation. See the Layer-1 roadmap for status.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <div>
            <p className="text-white font-semibold">Ready to explore the infrastructure?</p>
            <p className="text-slate-400 text-sm">Review the TSN Layer-1 architecture or view TROPTIONS on-chain proof.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/troptions/layer1" className="inline-flex items-center rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-bold text-[#071426] hover:bg-[#f0cf82] transition-colors">TSN Layer-1</Link>
            <Link href="/troptions/proof" className="inline-flex items-center rounded-lg border border-[#C9A84C] px-5 py-2.5 text-sm font-bold text-[#f0cf82] hover:bg-[#C9A84C]/10 transition-colors">Proof of Issuance</Link>
            <Link href="/troptions" className="inline-flex items-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:border-white/40 transition-colors">&lt;- TROPTIONS Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
