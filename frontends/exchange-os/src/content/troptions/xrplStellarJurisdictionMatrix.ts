/**
 * XRPL / Stellar Jurisdiction Matrix
 *
 * Per-jurisdiction production activation gates for XRPL/Stellar operations,
 * stablecoin issuance, and virtual asset services.
 *
 * SAFETY RULES:
 * - allowedWithoutLegalReview: false — all jurisdictions
 * - productionActivationStatus: "disabled" — all jurisdictions
 * - legalReviewRequired: true — all jurisdictions
 * - No jurisdiction is marked "fully compliant" — compliance-by-design only
 * - Global availability claims are blocked
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type JurisdictionRisk = "low" | "medium" | "high" | "very_high" | "prohibited";
export type JurisdictionProductionStatus =
  | "disabled"
  | "pending_legal_review"
  | "blocked";

export interface JurisdictionComplianceProfile {
  readonly id: string;
  readonly displayName: string;
  readonly region: string;

  // Regulatory risk dimensions
  readonly stablecoinIssuerRequirement: string;
  readonly virtualAssetServiceRequirement: string;
  readonly moneyTransmissionRisk: JurisdictionRisk;
  readonly securitiesRisk: JurisdictionRisk;
  readonly paymentsRisk: JurisdictionRisk;
  readonly AMLRequirement: string;
  readonly sanctionsRequirement: string;
  readonly TravelRuleRequirement: string;
  readonly consumerDisclosureRequirement: string;
  readonly dataPrivacyRequirement: string;

  // Production gate
  readonly allowedWithoutLegalReview: false;
  readonly productionActivationStatus: JurisdictionProductionStatus;
  readonly legalReviewRequired: true;
  readonly complianceNotes: string;
}

// ─── Jurisdiction Matrix ───────────────────────────────────────────────────────

export const XRPL_STELLAR_JURISDICTION_MATRIX: readonly JurisdictionComplianceProfile[] = [
  {
    id: "US",
    displayName: "United States",
    region: "North America",
    stablecoinIssuerRequirement: "GENIUS Act: Federal or state charter required for permitted payment stablecoin issuers. AML/BSA program, 1:1 reserve, at-par redemption, and monthly attestation required. Legal review required.",
    virtualAssetServiceRequirement: "FinCEN MSB registration required for money transmitters. State money transmission licenses may be required in each operating state. BitLicense required in New York.",
    moneyTransmissionRisk: "very_high",
    securitiesRisk: "high",
    paymentsRisk: "high",
    AMLRequirement: "Bank Secrecy Act (BSA) compliance required. AML program, SAR filing, CTR filing, and recordkeeping required. FinCEN registration required for MSBs.",
    sanctionsRequirement: "OFAC SDN list screening required. OFAC jurisdiction-specific sanctions programs apply. Penalties for violation are severe.",
    TravelRuleRequirement: "FinCEN Travel Rule applies to transmittals of funds of $3,000 or more. FATF Virtual Asset Travel Rule alignment recommended.",
    consumerDisclosureRequirement: "FTC, CFPB, and state consumer protection laws apply. No misleading financial product representations.",
    dataPrivacyRequirement: "State privacy laws vary (CCPA in California, etc.). No federal comprehensive privacy law yet.",
    allowedWithoutLegalReview: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
    complianceNotes: "US is the highest regulatory complexity jurisdiction. GENIUS Act framework for payment stablecoins is significant. Requires dedicated US counsel and likely multiple state licenses plus FinCEN registration before any production operations.",
  },
  {
    id: "EU",
    displayName: "European Union",
    region: "Europe",
    stablecoinIssuerRequirement: "MiCA (Markets in Crypto-Assets Regulation): E-Money Token (EMT) and Asset-Referenced Token (ART) issuers require authorization from EU national competent authority. Significant reserve and redemption requirements. MiCA in effect 2024.",
    virtualAssetServiceRequirement: "MiCA CASP (Crypto-Asset Service Provider) authorization required. Passporting available across EU member states once authorized in one.",
    moneyTransmissionRisk: "high",
    securitiesRisk: "high",
    paymentsRisk: "high",
    AMLRequirement: "EU AMLD (Anti-Money Laundering Directive) compliance required. AML/CFT program, suspicious transaction reporting, and ongoing monitoring required.",
    sanctionsRequirement: "EU consolidated sanctions list screening required. Member state-specific additional sanctions may apply.",
    TravelRuleRequirement: "EU Transfer of Funds Regulation (TFR) extends Travel Rule to all crypto-asset transfers regardless of amount. VASP registration required.",
    consumerDisclosureRequirement: "MiCA whitepaper and disclosure requirements. GDPR consumer rights apply. No misleading representations.",
    dataPrivacyRequirement: "GDPR compliance required. Data Protection Impact Assessment (DPIA) may be required for high-risk processing.",
    allowedWithoutLegalReview: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
    complianceNotes: "MiCA provides harmonized EU framework but requires formal authorization. Travel Rule extends to all amounts under TFR. GDPR applies to all EU residents. Requires EU counsel and MiCA authorization process.",
  },
  {
    id: "UK",
    displayName: "United Kingdom",
    region: "Europe",
    stablecoinIssuerRequirement: "FCA regulation of fiat-backed stablecoins under Payment Services Regulations. Proposed stablecoin regime under UK Financial Services and Markets Act. FCA authorization likely required.",
    virtualAssetServiceRequirement: "FCA registration required for crypto-asset businesses under MLR 2017. Significant ongoing regulatory development.",
    moneyTransmissionRisk: "high",
    securitiesRisk: "high",
    paymentsRisk: "high",
    AMLRequirement: "UK Proceeds of Crime Act (POCA) and Terrorism Act compliance. FCA supervised AML requirements for registered firms.",
    sanctionsRequirement: "UK OFSI sanctions list screening required. Post-Brexit UK maintains independent sanctions regime.",
    TravelRuleRequirement: "JMLSG guidance on Travel Rule for UK VASPs. Threshold-based requirements apply.",
    consumerDisclosureRequirement: "FCA consumer duty applies. Financial promotions regulation applies to crypto-asset promotions.",
    dataPrivacyRequirement: "UK GDPR (post-Brexit adaptation of EU GDPR) applies.",
    allowedWithoutLegalReview: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
    complianceNotes: "UK is in active regulatory evolution post-MiCA/post-Brexit. FCA registration is required. Crypto-asset financial promotions are tightly regulated.",
  },
  {
    id: "SG",
    displayName: "Singapore",
    region: "Asia-Pacific",
    stablecoinIssuerRequirement: "MAS Single-Currency Stablecoin (SCS) framework: MAS approval required for SCS issuers. Reserve, redemption, and audit requirements. MAS Payment Services Act licensing required.",
    virtualAssetServiceRequirement: "MAS Digital Payment Token (DPT) service license required under Payment Services Act. Significant AML/CFT requirements.",
    moneyTransmissionRisk: "medium",
    securitiesRisk: "medium",
    paymentsRisk: "high",
    AMLRequirement: "MAS Notice PSN02 AML/CFT requirements for DPT service providers. Enhanced due diligence for high-risk customers.",
    sanctionsRequirement: "MAS Sanctions Requirements — screening against UN, EU, OFAC, MAS lists required.",
    TravelRuleRequirement: "MAS Notice PSN02 requires Travel Rule compliance for DPT transfers above SGD 1,500.",
    consumerDisclosureRequirement: "MAS requires disclosure of risks in DPT services. No misleading representations.",
    dataPrivacyRequirement: "PDPA (Personal Data Protection Act) compliance required.",
    allowedWithoutLegalReview: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
    complianceNotes: "Singapore has clear, crypto-friendly but strict licensing regime. MAS DPT license and SCS approval required. Excellent regulatory clarity but requires formal licensing.",
  },
  {
    id: "HK",
    displayName: "Hong Kong",
    region: "Asia-Pacific",
    stablecoinIssuerRequirement: "HKMA stablecoin regulatory sandbox and forthcoming licensing regime. Stablecoin Bill expected to require licensing. Legal review of current status required.",
    virtualAssetServiceRequirement: "SFC VASP licensing required under AMLO for centralized exchanges. OTC and DeFi regulatory status evolving.",
    moneyTransmissionRisk: "medium",
    securitiesRisk: "high",
    paymentsRisk: "medium",
    AMLRequirement: "AMLO (Anti-Money Laundering and Counter-Terrorist Financing Ordinance) compliance required for VASPs.",
    sanctionsRequirement: "HKMA and SFC sanctions guidance. US sanctions may have extraterritorial reach.",
    TravelRuleRequirement: "FATF Travel Rule implementation expected for VASPs. Specific threshold TBD.",
    consumerDisclosureRequirement: "SFC requires risk disclosures for retail investors. HKMA consumer protection requirements.",
    dataPrivacyRequirement: "PDPO (Personal Data (Privacy) Ordinance) compliance required.",
    allowedWithoutLegalReview: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
    complianceNotes: "Hong Kong regulatory framework for crypto is actively evolving. SFC VASP licensing active. HKMA stablecoin licensing forthcoming. Requires local HK counsel.",
  },
  {
    id: "UAE",
    displayName: "United Arab Emirates",
    region: "Middle East",
    stablecoinIssuerRequirement: "VARA (Virtual Assets Regulatory Authority in Dubai) and ADGM/FSRA licensing frameworks. AED-backed stablecoin requires CBUAE approval. Legal review required for specific emirate.",
    virtualAssetServiceRequirement: "VARA license (Dubai) or FSRA authorization (Abu Dhabi ADGM) required depending on emirate. Federal and emirate-level regulations differ.",
    moneyTransmissionRisk: "medium",
    securitiesRisk: "medium",
    paymentsRisk: "medium",
    AMLRequirement: "UAE Federal AML/CFT Law and VARA AML requirements. CBUAE supervision for payment stablecoins.",
    sanctionsRequirement: "UAE National Committee for Combating Money Laundering and Terrorism Financing sanctions list. US/EU sanctions extraterritorial reach.",
    TravelRuleRequirement: "VARA Travel Rule requirements for VASPs. FATF alignment.",
    consumerDisclosureRequirement: "VARA disclosure requirements. No misleading representations.",
    dataPrivacyRequirement: "UAE Federal Personal Data Protection Law compliance required.",
    allowedWithoutLegalReview: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
    complianceNotes: "UAE has dual federal/emirate regulatory structure. Dubai VARA and Abu Dhabi ADGM are distinct licensing regimes. Crypto-friendly but requires specific licensing per emirate.",
  },
  {
    id: "CA",
    displayName: "Canada",
    region: "North America",
    stablecoinIssuerRequirement: "OSFI and provincial securities commission guidance on stablecoins. MSB registration with FINTRAC required. Provincial securities may apply to asset-backed tokens.",
    virtualAssetServiceRequirement: "FINTRAC MSB registration required for cryptocurrency dealing and exchange services. IIROC/CSA securities registration may apply.",
    moneyTransmissionRisk: "high",
    securitiesRisk: "high",
    paymentsRisk: "high",
    AMLRequirement: "PCMLTFA (Proceeds of Crime (Money Laundering) and Terrorist Financing Act) compliance. FINTRAC reporting and recordkeeping.",
    sanctionsRequirement: "OSFI sanctions screening required against US, EU, UN, and Canadian lists.",
    TravelRuleRequirement: "FINTRAC Travel Rule for large cryptocurrency transfers. Specific requirements for registered MSBs.",
    consumerDisclosureRequirement: "Provincial consumer protection laws. CSA disclosure requirements for securities.",
    dataPrivacyRequirement: "PIPEDA (Personal Information Protection and Electronic Documents Act) and provincial privacy laws.",
    allowedWithoutLegalReview: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
    complianceNotes: "Canada has federal FINTRAC registration plus provincial securities regulation creating complex multi-layered compliance. Requires Canadian counsel.",
  },
  {
    id: "LATAM",
    displayName: "Latin America (General)",
    region: "Latin America",
    stablecoinIssuerRequirement: "Varies significantly by country. Brazil has landmark crypto regulation. Mexico, Argentina, Colombia, Chile all have different approaches. No unified LATAM framework. Country-by-country analysis required.",
    virtualAssetServiceRequirement: "Varies by country. Brazil BACEN/CVM registration. Mexico Fintech Law. No unified LATAM VASP framework.",
    moneyTransmissionRisk: "high",
    securitiesRisk: "high",
    paymentsRisk: "high",
    AMLRequirement: "FATF recommendations implemented to varying degrees. GAFILAT (FATF-Style Regional Body for LATAM) guidance applies.",
    sanctionsRequirement: "US extraterritorial sanctions apply broadly. Country-specific sanctions lists. OFAC high-risk jurisdiction designations for some countries.",
    TravelRuleRequirement: "FATF Travel Rule implementation varies by country. Some countries have specific crypto Travel Rule rules.",
    consumerDisclosureRequirement: "Country-specific consumer protection laws apply.",
    dataPrivacyRequirement: "Brazil LGPD (Lei Geral de Proteção de Dados). Country-specific data privacy laws.",
    allowedWithoutLegalReview: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
    complianceNotes: "LATAM is highly heterogeneous. Country-by-country legal analysis required for each jurisdiction. Some LATAM countries have OFAC high-risk designations requiring enhanced screening.",
  },
  {
    id: "GLOBAL_FATF",
    displayName: "Global FATF Baseline",
    region: "Global",
    stablecoinIssuerRequirement: "FATF Guidance on Virtual Assets and VASPs: jurisdictions should apply FATF standards to covered stablecoin arrangements. Issuer authorization required in relevant jurisdiction.",
    virtualAssetServiceRequirement: "FATF Recommendation 15 and related guidance: VASPs must be registered or licensed in their jurisdiction. FATF standards applied in 200+ member jurisdictions.",
    moneyTransmissionRisk: "high",
    securitiesRisk: "medium",
    paymentsRisk: "high",
    AMLRequirement: "FATF 40 Recommendations apply. Customer due diligence (CDD), enhanced due diligence (EDD), suspicious transaction reporting, and recordkeeping required.",
    sanctionsRequirement: "UN Security Council sanctions list compliance required. FATF calls for robust sanctions screening for virtual assets.",
    TravelRuleRequirement: "FATF Recommendation 16 applies to VASPs: originator and beneficiary information for transfers at or above USD/EUR 1,000.",
    consumerDisclosureRequirement: "FATF guidance on consumer protection for virtual assets. Accurate risk disclosure required.",
    dataPrivacyRequirement: "Jurisdiction-specific data privacy requirements vary. Privacy vs. AML transparency balance required.",
    allowedWithoutLegalReview: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
    complianceNotes: "FATF baseline applies across all 200+ member jurisdictions. Weak regulation in one jurisdiction creates global risk. All operations must meet at minimum FATF baseline standards regardless of jurisdiction.",
  },
] as const;

// ─── Accessors ─────────────────────────────────────────────────────────────────

export function getAllJurisdictions(): readonly JurisdictionComplianceProfile[] {
  return XRPL_STELLAR_JURISDICTION_MATRIX;
}

export function getJurisdiction(id: string): JurisdictionComplianceProfile | undefined {
  return XRPL_STELLAR_JURISDICTION_MATRIX.find((j) => j.id === id);
}

export function getJurisdictionsByRegion(region: string): readonly JurisdictionComplianceProfile[] {
  return XRPL_STELLAR_JURISDICTION_MATRIX.filter((j) => j.region === region);
}

/** Safety assertion: every jurisdiction requires legal review and no production activation */
export function assertAllJurisdictionsGated(): void {
  for (const j of XRPL_STELLAR_JURISDICTION_MATRIX) {
    if ((j.allowedWithoutLegalReview as boolean) !== false) {
      throw new Error(`SAFETY VIOLATION: jurisdiction ${j.id} has allowedWithoutLegalReview !== false`);
    }
    if ((j.legalReviewRequired as boolean) !== true) {
      throw new Error(`SAFETY VIOLATION: jurisdiction ${j.id} has legalReviewRequired !== true`);
    }
    if (j.productionActivationStatus === "disabled" || j.productionActivationStatus === "pending_legal_review" || j.productionActivationStatus === "blocked") {
      // expected — all blocked
    } else {
      throw new Error(`SAFETY VIOLATION: jurisdiction ${j.id} has unexpected productionActivationStatus: ${j.productionActivationStatus}`);
    }
  }
}
