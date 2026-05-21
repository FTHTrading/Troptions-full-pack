/**
 * Troptions Glossary
 * Institutional definitions for every term used in the Troptions ecosystem.
 * Used in the Academy, Diligence Room, and Institutional Overview.
 */

export interface GlossaryEntry {
  term: string;
  category: string;
  definition: string;
  prohibitedUses: string[];
  institutionalNote: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Troptions",
    category: "Brand / Ecosystem",
    definition: "Troptions is a digital asset ecosystem encompassing payment utility tokens, RWA tokenization infrastructure, barter-settlement protocols, stable unit infrastructure, and compliance-gated issuance workflows. It is not a single token; it is a multi-asset institutional ecosystem.",
    prohibitedUses: ["described as 'the next Bitcoin'", "described as a guaranteed investment", "described as replacing the financial system"],
    institutionalNote: "Use: 'Troptions is a digital asset ecosystem' — not 'Troptions is a coin' or 'Troptions is a currency.'",
  },
  {
    term: "Troptions Pay",
    category: "Token",
    definition: "Troptions Pay is a payment utility token designed to connect to merchant payment rails via third-party providers such as GivBux. Merchant acceptance is conditional on third-party provider coverage, counterparty acceptance, geographic coverage, and category eligibility.",
    prohibitedUses: ["accepted everywhere", "universally accepted", "580,000 or 480,000 merchants (without verification)"],
    institutionalNote: "Merchant count must be sourced, dated, and verified before publication.",
  },
  {
    term: "Troptions Gold",
    category: "Token",
    definition: "Troptions Gold is a gold-representation token. Any gold-backing claim requires custody proof, vault receipt, assay certificate, reserve schedule, and legal opinion before institutional or public use.",
    prohibitedUses: ["balance sheet enhancement", "gold-backed (without proof)", "audit-verified (without audit report)"],
    institutionalNote: "All gold claims blocked until custody proof and audit complete.",
  },
  {
    term: "Troptions Unity / TUNITY",
    category: "Token",
    definition: "Troptions Unity (TUNITY) is a Solana-based utility token positioned for social-impact and ecosystem participation programs. It is not a stablecoin, money market instrument, or guaranteed-value product.",
    prohibitedUses: ["stable token", "humanitarian stablecoin", "1:1 backed (without proof)"],
    institutionalNote: "Remove 'stable' from all public copy until reserve policy, redemption terms, and legal classification are approved.",
  },
  {
    term: "Xtroptions",
    category: "Token",
    definition: "Xtroptions is a Troptions ecosystem token. Legal classification, use case, and compliance status are subject to the same proof-gated and custody-gated requirements as all Troptions assets.",
    prohibitedUses: ["guaranteed returns", "liquid by default"],
    institutionalNote: "Same diligence requirements as other Troptions tokens.",
  },
  {
    term: "SALP",
    category: "Protocol",
    definition: "Smart Asset Liquidity Protocol — Troptions' RWA intake and tokenization framework. SALP processes asset documentation, applies legal classification, enforces custody requirements, and applies transfer restrictions. Tokenized assets are not automatically liquid.",
    prohibitedUses: ["instant liquidity", "freely tradeable tokens", "liquid digital tokens"],
    institutionalNote: "Liquidity must never be assumed or implied for SALP assets.",
  },
  {
    term: "Proof of Funds (PoF)",
    category: "Compliance",
    definition: "A Troptions compliance document confirming that the source of funds for a transaction or investment has been verified, documented, and cleared through KYC/AML workflows. PoF is not a blanket guarantee but a documented workflow output.",
    prohibitedUses: ["proof of unlimited funds", "guaranteed source clearance"],
    institutionalNote: "PoF is transaction-specific. Scope and limitations are disclosed with each PoF output.",
  },
  {
    term: "Proof of Reserves (PoR)",
    category: "Compliance",
    definition: "A reserve verification workflow confirming that Troptions token supply is backed by documented, custodied assets. PoR output includes reserve schedule, custodian attestation, and reserve ratio. PoR is point-in-time and is not a guarantee of future solvency.",
    prohibitedUses: ["full reserve guarantee", "permanently solvent"],
    institutionalNote: "PoR must be published with date, scope, methodology, and reserve ratio.",
  },
  {
    term: "Proof of Control (PoC)",
    category: "Compliance",
    definition: "A control verification workflow confirming that authorized wallet key holders are documented, board-approved, and operationally validated. PoC includes wallet challenge, multi-sig documentation, board resolution, and custody authorization.",
    prohibitedUses: ["absolute control guarantee"],
    institutionalNote: "PoC is a governance document, not a security guarantee.",
  },
  {
    term: "Compliance-by-Jurisdiction",
    category: "Compliance",
    definition: "Troptions applies jurisdiction-specific compliance rules. A product or activity that is permissible in one jurisdiction may be restricted or prohibited in another. Compliance claims are always jurisdiction-scoped, never global.",
    prohibitedUses: ["worldwide compliant", "globally compliant", "all jurisdictions"],
    institutionalNote: "Always scope compliance claims to specific jurisdiction and activity type.",
  },
  {
    term: "Platform Infrastructure",
    category: "Infrastructure",
    definition: "The TROPTIONS compliance-controlled technology infrastructure is the internal operating system powering the Troptions ecosystem. It is not a public brand or standalone investment product.",
    prohibitedUses: ["marketed as a public product", "described as a standalone investment", "attributed to any third party without documented authority"],
    institutionalNote: "TROPTIONS platform infrastructure is internally controlled. No third-party brand should be credited as providing, owning, or operating TROPTIONS infrastructure in public materials.",
  },
  {
    term: "Barter Token",
    category: "Token / Utility",
    definition: "A Troptions token used in non-cash, exchange-of-value transactions between consenting parties. Barter transactions may be taxable events. 'Fueling Business Without Cash' describes this utility.",
    prohibitedUses: ["tax-free barter", "no tax obligation"],
    institutionalNote: "Always include barter tax disclaimer.",
  },
  {
    term: "Board Approval",
    category: "Governance",
    definition: "Certain Troptions actions — asset issuance, funding route activation, key custody changes, and public claims involving unverified evidence — require documented board approval. Board approval is recorded in the governance register.",
    prohibitedUses: [],
    institutionalNote: "Board approval is a hard gate for issuance and certain funding routes.",
  },
  {
    term: "QuantumXchange",
    category: "Partner / Integration",
    definition: "QuantumXchange is an announced exchange infrastructure initiative partner. As of the current registry date, no operational exchange exists, and no exchange licensing has been obtained. The initiative is in evaluation.",
    prohibitedUses: ["world's first exchange", "live exchange", "operating exchange"],
    institutionalNote: "All exchange claims are blocked until licensing is obtained.",
  },
  {
    term: "GivBux",
    category: "Partner / Integration",
    definition: "GivBux is the payment rail provider cited for Troptions Pay merchant network claims. No signed agreement has been documented as of the current registry date.",
    prohibitedUses: ["580,000 merchants (without signed agreement and verification)", "480,000 merchants (without signed agreement and verification)"],
    institutionalNote: "All merchant-count claims blocked until GivBux agreement signed and count verified.",
  },
];

export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
  return GLOSSARY.find((g) => g.term.toLowerCase() === term.toLowerCase());
}
