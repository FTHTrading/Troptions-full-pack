/**
 * Troptions RWA Registry
 * Real world asset programs, intake requirements, and status.
 */

export type RWACategory =
  | "commercial-real-estate"
  | "residential-real-estate"
  | "equipment"
  | "receivables"
  | "precious-metals"
  | "commodities"
  | "intellectual-property"
  | "private-credit"
  | "infrastructure";

export type RWAStatus =
  | "evaluation"
  | "intake-pending"
  | "documentation-review"
  | "custody-verification"
  | "legal-classification"
  | "approved-for-tokenization"
  | "tokenized"
  | "suspended";

export interface RWAProgram {
  programId: string;
  name: string;
  category: RWACategory;
  description: string;
  intakeRequirements: string[];
  custodyRequirements: string[];
  legalRequirements: string[];
  tokenizationRequirements: string[];
  transferRestrictions: string[];
  status: RWAStatus;
  chain: string;
  estimatedAssetCount: number | null;
  estimatedAssetValue: string | null;
  riskNotes: string;
  nextAction: string;
}

export const RWA_REGISTRY: RWAProgram[] = [
  {
    programId: "RWA-SALP-001",
    name: "SALP — Smart Asset Liquidity Protocol",
    category: "commercial-real-estate",
    description: "Troptions SALP RWA intake framework for commercial and mixed-use real estate assets. Assets are represented as digital tokens after passing full intake, custody, legal, and tokenization gates.",
    intakeRequirements: [
      "Asset description and address",
      "Title or deed documents",
      "Independent appraisal",
      "Lien and encumbrance search",
      "Ownership structure documentation",
      "Owner identity and KYC/KYB",
    ],
    custodyRequirements: [
      "Title held at qualified custodian or trustee",
      "Chain-of-custody documentation",
      "Custody agreement signed",
    ],
    legalRequirements: [
      "Legal classification memo (utility, security, commodity)",
      "Securities counsel review if investment-type token",
      "Transfer restriction documentation",
      "Investor eligibility requirements documented",
    ],
    tokenizationRequirements: [
      "Token supply schedule matching asset value",
      "On-chain transfer restrictions enforced",
      "Token-to-asset registry link",
      "Reporting cadence defined",
    ],
    transferRestrictions: [
      "Transfer restricted to eligible investors",
      "No public secondary market without exchange licensing or ATS registration",
      "Transfer gated by compliance check",
    ],
    status: "evaluation",
    chain: "XRPL",
    estimatedAssetCount: null,
    estimatedAssetValue: null,
    riskNotes: "SALP cannot tokenize 'liquid digital tokens' without custody proof, legal classification, and transfer restrictions. Liquidity is not assumed.",
    nextAction: "Define intake process. Engage asset providers. Engage securities counsel.",
  },
  {
    programId: "RWA-GOLD-001",
    name: "Troptions Gold Reserve Program",
    category: "precious-metals",
    description: "Physical gold reserve program supporting Troptions.Gold token. Gold held at qualified vault custodian. Token supply must match vault receipt before any token issuance.",
    intakeRequirements: [
      "Physical gold assay certificate",
      "Vault receipt",
      "Chain of custody documentation",
      "Insurance certificate",
      "Source documentation",
    ],
    custodyRequirements: [
      "Physical gold at Brink's, Loomis, or equivalent qualified vault",
      "Vault agreement signed",
      "Dual-control physical access policy",
      "Monthly count attestation",
    ],
    legalRequirements: [
      "CFTC commodity analysis",
      "Securities analysis for investment-type tokens",
      "Warehouse receipt analysis if applicable",
      "Legal opinion on token structure",
    ],
    tokenizationRequirements: [
      "Token supply must not exceed vault receipt weight × spot price",
      "On-chain token supply verifiable against vault receipt",
      "Redemption policy defined and disclosed",
    ],
    transferRestrictions: [
      "Transfer restricted to KYC-cleared participants",
      "Redemption requires custody withdrawal procedure",
    ],
    status: "evaluation",
    chain: "XRPL",
    estimatedAssetCount: null,
    estimatedAssetValue: null,
    riskNotes: "All gold-backed claims are blocked until vault receipt, assay, custody agreement, and legal opinion are complete.",
    nextAction: "Source physical gold. Execute vault agreement. Obtain assay certificate. Engage counsel.",
  },
  {
    programId: "RWA-EQUIP-001",
    name: "Equipment and Machinery Asset Program",
    category: "equipment",
    description: "Commercial equipment and machinery tokenization for financing and lease-back structures.",
    intakeRequirements: [
      "Equipment description, make, model, serial number",
      "Ownership documentation",
      "Current market appraisal",
      "Lien search",
      "Insurance certificate",
    ],
    custodyRequirements: [
      "Equipment held with qualified custodian or secured by first-lien",
      "Custody agreement or security interest documentation",
    ],
    legalRequirements: [
      "UCC filing for security interests",
      "Legal classification memo",
      "Financing documents reviewed by counsel",
    ],
    tokenizationRequirements: [
      "Token supply matched to appraised value",
      "Depreciation schedule disclosed",
    ],
    transferRestrictions: [
      "Transfer restricted to eligible investors",
      "Secondary market requires compliance check",
    ],
    status: "evaluation",
    chain: "XRPL",
    estimatedAssetCount: null,
    estimatedAssetValue: null,
    riskNotes: "Equipment value depreciates. Token supply must reflect current appraised value.",
    nextAction: "Define intake process. Identify initial equipment assets.",
  },
];

export function assertRWAReadyForTokenization(program: RWAProgram): void {
  if (program.status !== "approved-for-tokenization" && program.status !== "tokenized") {
    throw new Error(
      `[RWAGuard] "${program.name}" is not approved for tokenization. Current status: "${program.status}". Complete all intake, custody, and legal requirements first.`,
    );
  }
}
