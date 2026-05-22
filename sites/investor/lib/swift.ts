import type { TruthLabel } from "@/lib/command-center";
import {
  MSB_FIAT_RAILS_URL,
  OPERATOR_SEED_PARTNER_URL,
  PARTNER_BANK_MESH_URL,
  SYSTEM_MANIFEST_URL,
  X402_GLOBAL_MESH_URL,
} from "@/lib/constants";

export type IdentifierRow = {
  code: string;
  fullName: string;
  role: string;
  example: string;
  troptionsUse: string;
  label: TruthLabel;
};

export const SWIFT_IDENTIFIER_TABLE: IdentifierRow[] = [
  {
    code: "BIC",
    fullName: "Bank Identifier Code (SWIFT)",
    role: "8 or 11 characters identifying a financial institution on SWIFT FIN",
    example: "DEUTDEFF (8) · DEUTDEFFXXX (11)",
    troptionsUse: "Beneficiary bank on MT103/202; env `SWIFT_BIC` on swift-bridge :4024",
    label: "PIPELINE",
  },
  {
    code: "IBAN",
    fullName: "International Bank Account Number",
    role: "Account-level identifier (country check + BBAN); required in many SEPA/cross-border wires",
    example: "DE89 3704 0044 0532 0130 00",
    troptionsUse: "Omnibus credit instructions at institutional partner — not stored in git",
    label: "PIPELINE",
  },
  {
    code: "LEI",
    fullName: "Legal Entity Identifier",
    role: "20-character entity ID for regulatory reporting (MiFID, EMIR, derivatives)",
    example: "5493001KJTIIGC8Y1R12",
    troptionsUse: "Counterparty diligence pack; maps to ISO 20022 party blocks when gateway wraps XRPL",
    label: "PIPELINE",
  },
  {
    code: "MIC",
    fullName: "Market Identifier Code",
    role: "4-letter exchange / trading venue ID (ISO 10383)",
    example: "XNAS · ARCX",
    troptionsUse: "Exchange OS market data labels — separate from fiat settlement rails",
    label: "PROVEN",
  },
];

export type BicConnectionRow = {
  type: string;
  definition: string;
  settlement: string;
  label: TruthLabel;
  note: string;
};

export const BIC_CONNECTION_TYPES: BicConnectionRow[] = [
  {
    type: "Connected BIC",
    definition: "Institution holds SWIFT FIN membership; can send/receive MT messages directly (subject to RMA)",
    settlement: "Direct MT103/202 via service bureau or FIN",
    label: "PIPELINE",
    note: "Target state for institutional partner omnibus — credentials in operator vault only",
  },
  {
    type: "Non-connected",
    definition: "No direct FIN; routes via correspondent bank BIC (nested beneficiary)",
    settlement: "Correspondent debits omnibus; extra fee + latency",
    label: "PIPELINE",
    note: "Common for MSBs until own BIC or sponsored sub-account is live",
  },
];

export type RailPortRow = {
  rail: string;
  port: string;
  service: string;
  path: string;
  label: TruthLabel;
  untilLive: string;
};

export const FIAT_RAIL_PORTS: RailPortRow[] = [
  {
    rail: "Payment orchestrator",
    port: ":4022",
    service: "payment-orchestrator",
    path: "fiat-rails/orchestrator/",
    label: "PIPELINE",
    untilLive: "Bank webhook + compliance pass → mint IOU 1:1",
  },
  {
    rail: "FedWire RTGS",
    port: ":4023",
    service: "fedwire-adapter",
    path: "fiat-rails/fedwire-adapter/",
    label: "PIPELINE",
    untilLive: "Partner bank FedWire participation + routing number wired",
  },
  {
    rail: "SWIFT MT103/202",
    port: ":4024",
    service: "swift-bridge",
    path: "fiat-rails/swift-bridge/",
    label: "PIPELINE",
    untilLive: "BIC + RMA + service bureau — PIPELINE until bank wired",
  },
  {
    rail: "Compliance",
    port: ":4025",
    service: "compliance-engine",
    path: "fiat-rails/compliance-engine/",
    label: "PIPELINE",
    untilLive: "OFAC/KYC provider keys in .env",
  },
  {
    rail: "IOU reserve monitor",
    port: ":4027",
    service: "iou-reserve-monitor",
    path: "fiat-rails/iou-reserve-monitor/",
    label: "PIPELINE",
    untilLive: "Omnibus statements vs on-chain supply attestation",
  },
];

export type PartnerVerificationRow = {
  question: string;
  troptionsToday: string;
  partnerMustConfirm: string;
  label: TruthLabel;
};

/** Institutional diligence — answer with bank counsel, not marketing copy. */
export const PARTNER_VERIFICATION_TABLE: PartnerVerificationRow[] = [
  {
    question: "Connected BIC?",
    troptionsToday:
      "PIPELINE — `swift-bridge` :4024 returns /health; no live FIN session in repo. Target: partner or sponsor bank with SWIFT FIN + RMA.",
    partnerMustConfirm:
      "Written confirmation: direct FIN member vs correspondent-only; BIC 8/11 on file; RMA matrix for message types (103/202).",
    label: "PIPELINE",
  },
  {
    question: "Whose BIC on message?",
    troptionsToday:
      "Ordering institution BIC = partner omnibus bank (TBD under NDA). Our stack sets beneficiary/creditor via orchestrator env — not published here.",
    partnerMustConfirm:
      "Field 52/53/57 mapping on MT103/202 samples; who appears as ordering vs intermediary; nostro account for debits.",
    label: "PIPELINE",
  },
  {
    question: "MT103 today?",
    troptionsToday:
      "PIPELINE — `POST /api/swift/send` stub in `fiat-rails/swift-bridge/`; no production MT103 UETR in operator logs yet.",
    partnerMustConfirm:
      "Service bureau or FIN connectivity live; test wire amount + UETR; settlement date (value date) and fee schedule.",
    label: "PIPELINE",
  },
  {
    question: "FedWire RTGS today?",
    troptionsToday:
      "PIPELINE — `fedwire-adapter` :4023 stub; orchestrator :4022 coordinates mint/burn when webhooks fire.",
    partnerMustConfirm:
      "ABA routing, omnibus account, cutoff times, return/wire recall policy.",
    label: "PIPELINE",
  },
  {
    question: "IOU 1:1 with omnibus?",
    troptionsToday:
      "PROVEN demand on ledger (~874M issued IOUs) — not bank reserves. Mint/burn 1:1 is PIPELINE until partner statements match supply.",
    partnerMustConfirm:
      "Daily reconciliation: omnibus balance vs on-chain IOU supply; attestation cadence and auditor access.",
    label: "PIPELINE",
  },
];

export type LockInItem = {
  item: string;
  owner: string;
  label: TruthLabel;
  note: string;
};

/** Contract lock-in checklist — counsel + partner sign-off before claiming live rails. */
export const CONTRACT_LOCKIN_CHECKLIST: LockInItem[] = [
  {
    item: "MSB registration + state MTL matrix current",
    owner: "Operator / counsel",
    label: "PIPELINE",
    note: "FinCEN MSB — not stored in git; partner may require proof before omnibus.",
  },
  {
    item: "Executed partner / correspondent agreement (MSA + SLA)",
    owner: "Counsel",
    label: "PIPELINE",
    note: "Fee schedule, indemnity, data processing, termination — no names on public site.",
  },
  {
    item: "Omnibus account opened + webhook format signed off",
    owner: "Partner bank",
    label: "PIPELINE",
    note: "Credit notification → orchestrator :4022 → compliance :4025 → mint IOU.",
  },
  {
    item: "SWIFT BIC path (connected or nested correspondent) documented",
    owner: "Partner treasury",
    label: "PIPELINE",
    note: "Maps to PARTNER_VERIFICATION_TABLE rows above.",
  },
  {
    item: "BSA / AML reliance letter scope agreed",
    owner: "Compliance",
    label: "PIPELINE",
    note: "OFAC/KYC provider keys in host .env only.",
  },
  {
    item: "Exclusivity claims verified (e.g. “1 of 2200” cohort)",
    owner: "Diligence / counsel",
    label: "PIPELINE",
    note: "We do not substantiate cohort statistics on this site — independent verification required.",
  },
  {
    item: "Reserve & IOU attestation cadence (monthly minimum)",
    owner: "Operator + partner",
    label: "PIPELINE",
    note: "iou-reserve-monitor :4027 vs bank statements.",
  },
  {
    item: "No seed / API secrets in repo or Pages build",
    owner: "Operator",
    label: "PROVEN",
    note: "XRPL_SEED, TELEGRAM_BOT_TOKEN, SWIFT credentials in .env only — see OPERATOR_SEED_AND_PARTNER doc.",
  },
];

export const MSB_PARTNER_VALUE = {
  headline: "MSB + institutional partner (generic)",
  bullets: [
    "FinCEN MSB registration + state MTL where required — operator-held, not in repo",
    "US omnibus at institutional partner: FedWire/ACH in, screened mint to XRPL IOU",
    "EU correspondent slot: EUR out via SWIFT when IOU burned — multi-bank mesh",
    "BaaS white-label API (:8097) for fintech clients — fee capture A–E when rails live",
    "No partner legal name on this page — diligence under NDA with counsel",
  ],
  label: "PIPELINE" as TruthLabel,
};

export const PARTNER_MEETING_SCRIPT = [
  "Open with IOU honesty: ~874M issued on XRPL/Stellar is demand proof on ledger — not bank reserves or Circle native USDC.",
  "Show PROVEN stack: Academy Stripe, launch.unykorn.org, x402 health, Polygon/KENNY, issuer wallets — GitHub Pages proof pack.",
  "State PIPELINE clearly: fiat-rails stubs on :4022–:4027 respond /health; no production wire until omnibus + BIC + FedWire live.",
  "Ask partner for: omnibus account, FedWire routing, SWIFT BIC or correspondent path, RMA matrix, webhook format, BSA reliance letter scope.",
  "Revenue: issuance/redemption fees (0.25% modeled), float, B2B SWIFT — all PIPELINE until first settled wire hits GL.",
  "Close with diligence: verify exclusivity claims (e.g. “1 of N” cohorts) independently — we do not publish partner names here.",
];

export const SWIFT_TECH_DOCS = [
  { title: "Operator seed + partner (tonight steps)", href: OPERATOR_SEED_PARTNER_URL },
  { title: "MSB fiat rails", href: MSB_FIAT_RAILS_URL },
  { title: "Partner bank mesh", href: PARTNER_BANK_MESH_URL },
  { title: "x402 global mesh", href: X402_GLOBAL_MESH_URL },
  { title: "System manifest", href: SYSTEM_MANIFEST_URL },
];

export const SWIFT_DISCLAIMERS = [
  "Not legal, securities, or banking advice. MSB, SWIFT, and FedWire require licensed counsel and executed bank agreements.",
  "Marketing claims such as “1 of 2200” (or similar exclusivity) must be verified in diligence — we do not substantiate cohort statistics on this site.",
  "PROJECTION figures ($825/hour, $874K/month) are modeled API math — not realized bank deposits.",
];

export const SWIFT_DILIGENCE_NOTE =
  "Institutional partners should reconcile BIC connectivity, omnibus agreements, and reserve policy against their own compliance function — not against marketing copy.";
