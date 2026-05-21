/**
 * TROPTIONS RWA Adapter Compliance Registry
 *
 * Compliance records for each RWA provider adapter.
 * These are research-level records reflecting publicly known regulatory context.
 * These are NOT legal advice and NOT official compliance determinations.
 *
 * TROPTIONS is not a registered investment adviser, broker-dealer, bank,
 * transfer agent, or money transmitter.
 *
 * No FTH / FTHX / FTHG / Future Tech Holdings references.
 */

import { RwaComplianceRecord } from "./types";

export const RWA_COMPLIANCE_RECORDS: RwaComplianceRecord[] = [
  {
    providerId: "rwa-ondo",
    jurisdiction: "United States",
    regulatoryStatus:
      "Ondo products (OUSG, OMMF) are tokenized products. Their regulatory status depends on structure and distribution method. Some may qualify as securities under U.S. law.",
    licenseRequired: true,
    licenseStatus: "not_applicable",
    kycRequired: true,
    amlRequired: true,
    accreditedInvestorRequired: true,
    securitiesLawApplies: true,
    notes:
      "Institutional/accredited investor restrictions apply. Legal opinion required before TROPTIONS references Ondo in any client-facing capability claim.",
  },
  {
    providerId: "rwa-maple",
    jurisdiction: "United States",
    regulatoryStatus:
      "Maple Finance facilitates institutional lending via smart contracts. Activities may trigger lending, securities, or money transmission regulations depending on jurisdiction and pool structure.",
    licenseRequired: true,
    licenseStatus: "not_applicable",
    kycRequired: true,
    amlRequired: true,
    accreditedInvestorRequired: true,
    securitiesLawApplies: true,
    notes:
      "Pool participation typically restricted to institutional and accredited investors. TROPTIONS cannot facilitate Maple lending without full regulatory review.",
  },
  {
    providerId: "rwa-centrifuge",
    jurisdiction: "United States / International",
    regulatoryStatus:
      "Centrifuge pools may be structured as securities or debt instruments. Regulatory classification depends on pool structure. Cross-border compliance issues apply.",
    licenseRequired: true,
    licenseStatus: "not_applicable",
    kycRequired: true,
    amlRequired: true,
    accreditedInvestorRequired: true,
    securitiesLawApplies: true,
    notes:
      "Asset originator agreements and legal opinions are required. TROPTIONS cannot claim access to Centrifuge pools without provider agreement and legal clearance.",
  },
  {
    providerId: "rwa-securitize",
    jurisdiction: "United States",
    regulatoryStatus:
      "Securitize is a registered transfer agent with the SEC. Using Securitize requires SEC registration or a valid exemption. Strict investor eligibility and transfer restriction rules apply.",
    licenseRequired: true,
    licenseStatus: "not_obtained",
    kycRequired: true,
    amlRequired: true,
    accreditedInvestorRequired: true,
    securitiesLawApplies: true,
    notes:
      "CRITICAL: Securitize-based products are registered securities. TROPTIONS must not claim any ability to issue, transfer, or provide access to Securitize-managed securities without full SEC compliance.",
  },
  {
    providerId: "rwa-blackrock-buidl",
    jurisdiction: "United States",
    regulatoryStatus:
      "BlackRock BUIDL is a registered fund. Exclusively available through Securitize. Requires Qualified Purchaser status. Strict 1940 Act compliance applies.",
    licenseRequired: true,
    licenseStatus: "not_applicable",
    kycRequired: true,
    amlRequired: true,
    accreditedInvestorRequired: true,
    securitiesLawApplies: true,
    notes:
      "CRITICAL: Any claim of relationship with BlackRock or access to BUIDL without Qualified Purchaser status and Securitize agreement is false. Do not make any implied claims.",
  },
  {
    providerId: "rwa-franklin-benji",
    jurisdiction: "United States",
    regulatoryStatus:
      "FOBXX is a 1940 Act registered money market fund. Distribution requires fund eligibility and broker-dealer or distribution agreement.",
    licenseRequired: true,
    licenseStatus: "not_applicable",
    kycRequired: true,
    amlRequired: true,
    accreditedInvestorRequired: false,
    securitiesLawApplies: true,
    notes:
      "FOBXX is a registered mutual fund. Distribution requires Franklin Templeton agreement. TROPTIONS cannot distribute or provide access to FOBXX without approved distribution arrangement.",
  },
  {
    providerId: "rwa-figure",
    jurisdiction: "United States",
    regulatoryStatus:
      "Figure Markets products including YLDS may be classified as securities. Tokenized real estate and credit pools have varying regulatory classifications.",
    licenseRequired: true,
    licenseStatus: "not_applicable",
    kycRequired: true,
    amlRequired: true,
    accreditedInvestorRequired: true,
    securitiesLawApplies: true,
    notes:
      "Legal opinion required for each Figure Markets product before any TROPTIONS public claim. Investor eligibility restrictions likely apply.",
  },
  {
    providerId: "rwa-provenance",
    jurisdiction: "International",
    regulatoryStatus:
      "Provenance Blockchain is a public blockchain. Regulatory classification of assets tokenized on Provenance depends on the specific asset and its legal structure.",
    licenseRequired: false,
    licenseStatus: "not_applicable",
    kycRequired: false,
    amlRequired: false,
    accreditedInvestorRequired: false,
    securitiesLawApplies: false,
    notes:
      "Blockchain infrastructure itself has no license requirement. However, tokenizing assets on Provenance may trigger securities laws depending on the asset.",
  },
  {
    providerId: "rwa-rwa-xyz",
    jurisdiction: "International",
    regulatoryStatus:
      "Data/analytics reference. No securities law applicability to data usage. Must comply with RWA.xyz terms of service.",
    licenseRequired: false,
    licenseStatus: "not_applicable",
    kycRequired: false,
    amlRequired: false,
    accreditedInvestorRequired: false,
    securitiesLawApplies: false,
    notes: "Reference data only. No financial activity.",
  },
  {
    providerId: "rwa-chainlink",
    jurisdiction: "International",
    regulatoryStatus:
      "Oracle/data infrastructure. No direct securities law applicability to oracle usage. Use of oracle data for financial disclosures may trigger reporting requirements.",
    licenseRequired: false,
    licenseStatus: "not_applicable",
    kycRequired: false,
    amlRequired: false,
    accreditedInvestorRequired: false,
    securitiesLawApplies: false,
    notes: "Oracle services are infrastructure-level. Regulatory requirements depend on how oracle data is used in TROPTIONS context.",
  },
  {
    providerId: "rwa-manual-evidence",
    jurisdiction: "N/A",
    regulatoryStatus: "Internal document management. No external regulatory body.",
    licenseRequired: false,
    licenseStatus: "not_applicable",
    kycRequired: false,
    amlRequired: false,
    accreditedInvestorRequired: false,
    securitiesLawApplies: false,
    notes: "Internal only. No external regulatory compliance requirement.",
  },
  {
    providerId: "rwa-internal-reference",
    jurisdiction: "N/A",
    regulatoryStatus: "Internal reference. No external regulatory body.",
    licenseRequired: false,
    licenseStatus: "not_applicable",
    kycRequired: false,
    amlRequired: false,
    accreditedInvestorRequired: false,
    securitiesLawApplies: false,
    notes: "Internal only.",
  },
];

export function getComplianceRecord(providerId: string): RwaComplianceRecord | undefined {
  return RWA_COMPLIANCE_RECORDS.find((r) => r.providerId === providerId);
}

export function getHighRegulatoryRiskProviders(): RwaComplianceRecord[] {
  return RWA_COMPLIANCE_RECORDS.filter((r) => r.securitiesLawApplies);
}

export function getProvidersRequiringAccreditedInvestor(): RwaComplianceRecord[] {
  return RWA_COMPLIANCE_RECORDS.filter((r) => r.accreditedInvestorRequired);
}
