/**
 * TROPTIONS RWA Provider Adapter Registry — Provider Records
 *
 * These are provider-neutral adapter records representing readiness architecture,
 * not official partnerships, integrations, or live connections.
 *
 * IMPORTANT:
 * - These are NOT official TROPTIONS partners.
 * - These are NOT live integrations.
 * - No execution is enabled.
 * - Provider names and reference URLs are publicly known industry information.
 * - All currentTroptionsStatus values reflect honest build state.
 * - No fake contracts, credentials, or confirmations.
 *
 * No FTH / FTHX / FTHG / Future Tech Holdings references.
 */

import { RwaProviderAdapter } from "./types";

export const RWA_PROVIDER_ADAPTERS: RwaProviderAdapter[] = [
  // ─── 1. Ondo Finance ──────────────────────────────────────────────────────
  {
    providerId: "rwa-ondo",
    displayName: "Ondo Finance",
    category: "tokenized_treasury",
    description:
      "Institutional-grade onchain finance platform offering tokenized financial products including OUSG (tokenized U.S. Treasuries) and OMMF. Ondo builds infrastructure to bring financial markets onchain.",
    officialReferenceUrl: "https://ondo.finance",
    supportedAssetClasses: ["tokenized_us_treasuries", "tokenized_money_market", "yield_bearing_stablecoin"],
    supportedChains: ["Ethereum", "Polygon", "Mantle", "Solana"],
    currentTroptionsStatus: "reference_only",
    capabilityStatus: "display_reference",
    requiredCredentials: ["ondo_api_key", "kyb_completed", "accredited_investor_verification"],
    requiredLegalReview: [
      "securities_law_applicability",
      "transfer_restrictions_review",
      "accredited_investor_requirements",
      "custody_arrangement_review",
    ],
    requiredProviderContract: true,
    requiredEvidence: [
      "signed_provider_contract",
      "legal_opinion_on_securities_status",
      "kyb_documentation",
      "accredited_investor_compliance",
    ],
    allowedPublicLanguage:
      "TROPTIONS is designed with provider-neutral adapter readiness for institutional tokenized treasury infrastructure. Ondo Finance is an industry-reference provider in the tokenized treasury category.",
    blockedPublicLanguage: [
      "TROPTIONS is partnered with Ondo Finance",
      "TROPTIONS offers Ondo products",
      "TROPTIONS provides access to OUSG",
      "TROPTIONS custody of Ondo assets",
      "Guaranteed returns via Ondo",
    ],
    integrationNotes:
      "Ondo products are typically restricted to accredited/institutional investors. Integration would require Ondo partnership agreement, KYB, and securities law compliance review.",
    riskNotes:
      "Tokenized Treasuries may be classified as securities under U.S. law. Legal opinion required before any public claim. Do not imply TROPTIONS can provide access to Ondo products without approved provider agreement.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 2. Maple Finance ────────────────────────────────────────────────────
  {
    providerId: "rwa-maple",
    displayName: "Maple Finance",
    category: "institutional_credit",
    description:
      "Infrastructure for onchain lending businesses. Connects institutional lenders and borrowers with transparency, risk management, and smart-contract-based lending pools.",
    officialReferenceUrl: "https://maple.finance",
    supportedAssetClasses: ["institutional_loans", "private_credit_pools", "secured_lending"],
    supportedChains: ["Ethereum", "Solana"],
    currentTroptionsStatus: "reference_only",
    capabilityStatus: "display_reference",
    requiredCredentials: ["maple_pool_delegate_agreement", "kyb_completed", "institutional_accreditation"],
    requiredLegalReview: [
      "lending_license_review",
      "securities_law_applicability",
      "pool_delegate_agreement_review",
      "credit_risk_disclosure_requirements",
    ],
    requiredProviderContract: true,
    requiredEvidence: [
      "signed_provider_contract",
      "lending_license_or_exemption_opinion",
      "institutional_accreditation_documentation",
    ],
    allowedPublicLanguage:
      "TROPTIONS is designed with provider-neutral adapter readiness for institutional onchain credit infrastructure. Maple Finance is an industry-reference provider in the institutional credit category.",
    blockedPublicLanguage: [
      "TROPTIONS is partnered with Maple Finance",
      "TROPTIONS offers Maple lending pools",
      "TROPTIONS provides institutional loans via Maple",
      "TROPTIONS earns yield via Maple",
    ],
    integrationNotes:
      "Maple requires pool delegate agreements. Lender participation typically requires institutional accreditation. Legal review required for lending activity.",
    riskNotes:
      "Onchain lending may trigger money transmission, lending, or securities regulations depending on jurisdiction. Do not claim TROPTIONS facilitates lending via Maple without full legal clearance.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 3. Centrifuge ────────────────────────────────────────────────────────
  {
    providerId: "rwa-centrifuge",
    displayName: "Centrifuge",
    category: "rwa_tokenization_platform",
    description:
      "Infrastructure to tokenize, manage, and invest into real-world assets including funds, credit, treasuries, and institutional assets. Centrifuge connects asset originators to onchain liquidity.",
    officialReferenceUrl: "https://centrifuge.io",
    supportedAssetClasses: [
      "tokenized_credit",
      "tokenized_real_estate",
      "structured_credit",
      "trade_finance",
      "invoice_financing",
    ],
    supportedChains: ["Centrifuge Chain", "Ethereum"],
    currentTroptionsStatus: "reference_only",
    capabilityStatus: "display_reference",
    requiredCredentials: ["centrifuge_issuer_agreement", "kyb_completed"],
    requiredLegalReview: [
      "asset_originator_review",
      "securities_law_applicability",
      "cross_border_compliance",
      "investor_eligibility_review",
    ],
    requiredProviderContract: true,
    requiredEvidence: [
      "signed_provider_contract",
      "asset_originator_documentation",
      "legal_opinion_on_pool_structure",
    ],
    allowedPublicLanguage:
      "TROPTIONS is designed with provider-neutral adapter readiness for RWA tokenization infrastructure. Centrifuge is an industry-reference provider in the RWA tokenization category.",
    blockedPublicLanguage: [
      "TROPTIONS is partnered with Centrifuge",
      "TROPTIONS tokenizes assets via Centrifuge",
      "TROPTIONS offers Centrifuge pools",
      "TROPTIONS backed by Centrifuge assets",
    ],
    integrationNotes:
      "Centrifuge requires issuer agreements and asset documentation. Asset pools must be properly structured under applicable securities laws.",
    riskNotes:
      "RWA tokenization involves securities law, asset custody, and cross-border compliance. Do not claim TROPTIONS can tokenize or issue RWA pools without full legal and provider approval.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 4. Securitize ────────────────────────────────────────────────────────
  {
    providerId: "rwa-securitize",
    displayName: "Securitize",
    category: "compliance_transfer_agent",
    description:
      "Registered transfer agent and compliance platform for tokenized securities. Manages digital asset issuance, investor onboarding, compliance, and transfer restrictions for institutional issuers.",
    officialReferenceUrl: "https://securitize.io",
    supportedAssetClasses: ["tokenized_securities", "tokenized_funds", "digital_asset_issuance"],
    supportedChains: ["Ethereum", "Avalanche", "Polygon"],
    currentTroptionsStatus: "reference_only",
    capabilityStatus: "display_reference",
    requiredCredentials: ["securitize_issuer_agreement", "sec_registration_or_exemption"],
    requiredLegalReview: [
      "securities_registration_or_exemption_analysis",
      "transfer_agent_agreement_review",
      "investor_accreditation_requirements",
    ],
    requiredProviderContract: true,
    requiredEvidence: [
      "signed_issuer_agreement",
      "securities_registration_or_exemption_documentation",
      "legal_opinion",
    ],
    allowedPublicLanguage:
      "TROPTIONS is designed with provider-neutral adapter readiness for compliant digital asset issuance and transfer agent infrastructure. Securitize is an industry-reference provider in the compliance and transfer agent category.",
    blockedPublicLanguage: [
      "TROPTIONS is partnered with Securitize",
      "TROPTIONS issues securities via Securitize",
      "TROPTIONS is SEC-registered through Securitize",
      "TROPTIONS offers Securitize-compliant issuance",
    ],
    integrationNotes:
      "Securitize is a registered transfer agent. Any use for securities issuance requires SEC registration or a valid exemption. TROPTIONS is not an issuer or transfer agent.",
    riskNotes:
      "Securities issuance without proper registration or exemption is illegal. CRITICAL: Do not imply TROPTIONS can issue, transfer, or manage securities without full securities law compliance and Securitize partnership.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 5. BlackRock BUIDL via Securitize ────────────────────────────────────
  {
    providerId: "rwa-blackrock-buidl",
    displayName: "BlackRock BUIDL Fund (via Securitize)",
    category: "tokenized_money_market",
    description:
      "The BlackRock USD Institutional Digital Liquidity Fund (BUIDL) is a tokenized money market fund exclusively available through Securitize. Invests in cash, U.S. Treasury bills, and repurchase agreements.",
    officialReferenceUrl: "https://securitize.io/blackrock/buidl",
    supportedAssetClasses: ["tokenized_money_market_fund", "tokenized_us_treasuries"],
    supportedChains: ["Ethereum"],
    currentTroptionsStatus: "reference_only",
    capabilityStatus: "display_reference",
    requiredCredentials: [
      "securitize_institutional_account",
      "qualified_purchaser_or_institutional_verification",
      "buidl_fund_eligibility_confirmation",
    ],
    requiredLegalReview: [
      "qualified_purchaser_eligibility_analysis",
      "1940_act_exemption_review",
      "securities_law_analysis",
      "custody_arrangement_review",
    ],
    requiredProviderContract: true,
    requiredEvidence: [
      "securitize_institutional_agreement",
      "qualified_purchaser_documentation",
      "legal_opinion_on_fund_eligibility",
    ],
    allowedPublicLanguage:
      "TROPTIONS is designed with provider-neutral adapter readiness for institutional tokenized money market infrastructure. BlackRock BUIDL is an industry-reference product in the tokenized money market category.",
    blockedPublicLanguage: [
      "TROPTIONS is partnered with BlackRock",
      "TROPTIONS offers access to BUIDL",
      "TROPTIONS backed by BlackRock assets",
      "TROPTIONS provides BlackRock BUIDL yield",
      "TROPTIONS is affiliated with BlackRock",
    ],
    integrationNotes:
      "BUIDL is exclusively available through Securitize and requires Qualified Purchaser status. TROPTIONS has no relationship with BlackRock or Securitize at this time.",
    riskNotes:
      "CRITICAL: Do not imply any relationship with BlackRock. BlackRock is a major financial institution. Any unauthorized claims of partnership or affiliation are false and potentially harmful. This is a reference-only adapter.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 6. Franklin Templeton BENJI (FOBXX) ─────────────────────────────────
  {
    providerId: "rwa-franklin-benji",
    displayName: "Franklin Templeton BENJI (FOBXX)",
    category: "tokenized_money_market",
    description:
      "Franklin OnChain U.S. Government Money Fund (ticker FOBXX / BENJI). Invests at least 99.5% of assets in U.S. government securities, cash, and fully collateralized repurchase agreements. One of the first tokenized money market funds on a public blockchain.",
    officialReferenceUrl:
      "https://www.franklintempleton.com/investments/options/money-market-funds/products/29386/SINGLCLASS/franklin-on-chain-u-s-government-money-fund/FOBXX",
    supportedAssetClasses: ["tokenized_government_money_market_fund", "tokenized_us_government_securities"],
    supportedChains: ["Stellar", "Polygon"],
    currentTroptionsStatus: "reference_only",
    capabilityStatus: "display_reference",
    requiredCredentials: [
      "franklin_templeton_institutional_account",
      "fund_eligibility_confirmation",
      "kyb_and_aml_clearance",
    ],
    requiredLegalReview: [
      "1940_act_registered_fund_analysis",
      "fund_purchase_eligibility",
      "redemption_restriction_review",
    ],
    requiredProviderContract: true,
    requiredEvidence: [
      "institutional_account_agreement",
      "fund_eligibility_documentation",
      "legal_review_of_fund_access",
    ],
    allowedPublicLanguage:
      "TROPTIONS is designed with provider-neutral adapter readiness for tokenized government money market infrastructure. Franklin Templeton BENJI (FOBXX) is an industry-reference product in the tokenized money market category.",
    blockedPublicLanguage: [
      "TROPTIONS is partnered with Franklin Templeton",
      "TROPTIONS offers BENJI or FOBXX",
      "TROPTIONS provides access to Franklin Templeton funds",
      "TROPTIONS backed by Franklin Templeton assets",
    ],
    integrationNotes:
      "FOBXX is a registered 1940 Act money market fund. Access requires Franklin Templeton institutional account and fund eligibility. TROPTIONS has no relationship with Franklin Templeton.",
    riskNotes:
      "Registered investment funds have strict distribution and eligibility rules. Do not imply TROPTIONS can distribute or provide access to FOBXX without proper regulatory approval and provider agreement.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 7. Figure Markets ────────────────────────────────────────────────────
  {
    providerId: "rwa-figure",
    displayName: "Figure Markets",
    category: "rwa_tokenization_platform",
    description:
      "Figure Markets supports crypto and real-world assets. Assets include YLDS (tokenized yield), tokenized real estate, and credit pools. Built on Provenance Blockchain.",
    officialReferenceUrl: "https://www.figuremarkets.com",
    supportedAssetClasses: [
      "tokenized_yield_products",
      "tokenized_real_estate",
      "tokenized_credit_pools",
    ],
    supportedChains: ["Provenance Blockchain"],
    currentTroptionsStatus: "reference_only",
    capabilityStatus: "display_reference",
    requiredCredentials: ["figure_markets_account", "kyb_kyc_completed"],
    requiredLegalReview: [
      "securities_law_analysis_for_ylds",
      "real_estate_tokenization_review",
      "investor_eligibility_review",
    ],
    requiredProviderContract: true,
    requiredEvidence: [
      "signed_provider_agreement",
      "legal_opinion_on_asset_classification",
      "kyb_documentation",
    ],
    allowedPublicLanguage:
      "TROPTIONS is designed with provider-neutral adapter readiness for tokenized real-world asset and yield infrastructure. Figure Markets is an industry-reference provider in the RWA tokenization category.",
    blockedPublicLanguage: [
      "TROPTIONS is partnered with Figure Markets",
      "TROPTIONS offers Figure Markets products",
      "TROPTIONS provides YLDS yield",
      "TROPTIONS offers Figure real estate assets",
    ],
    integrationNotes:
      "Figure Markets operates on Provenance Blockchain. Integration would require Figure Markets partnership and compliance with applicable securities laws for YLDS and other products.",
    riskNotes:
      "YLDS and tokenized real estate may be classified as securities. Do not claim TROPTIONS can offer Figure Markets products without provider agreement and legal clearance.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 8. Provenance Blockchain ─────────────────────────────────────────────
  {
    providerId: "rwa-provenance",
    displayName: "Provenance Blockchain",
    category: "rwa_tokenization_platform",
    description:
      "Public blockchain purpose-built for financial services. Supports tokenization of financial assets, loans, mortgage-backed securities, and institutional products. Foundation for Figure and other financial applications.",
    officialReferenceUrl: "https://provenance.io",
    supportedAssetClasses: [
      "tokenized_loans",
      "tokenized_mortgage_assets",
      "financial_contracts",
      "institutional_digital_assets",
    ],
    supportedChains: ["Provenance Blockchain"],
    currentTroptionsStatus: "reference_only",
    capabilityStatus: "display_reference",
    requiredCredentials: ["provenance_validator_or_api_access", "kyb_completed"],
    requiredLegalReview: [
      "financial_asset_tokenization_review",
      "blockchain_network_legal_analysis",
    ],
    requiredProviderContract: true,
    requiredEvidence: ["validator_or_api_agreement", "legal_opinion_on_asset_use"],
    allowedPublicLanguage:
      "TROPTIONS is designed with provider-neutral adapter readiness for financial-grade blockchain infrastructure. Provenance Blockchain is an industry-reference network in the institutional asset tokenization category.",
    blockedPublicLanguage: [
      "TROPTIONS is built on Provenance Blockchain",
      "TROPTIONS tokenizes assets on Provenance",
      "TROPTIONS is partnered with Provenance",
    ],
    integrationNotes:
      "Provenance Blockchain is a Layer-1 purpose-built for financial services. Native token is HASH. Integration would require validator participation or API access.",
    riskNotes:
      "Financial asset tokenization on any blockchain requires careful legal analysis. Do not claim TROPTIONS uses Provenance Blockchain without provider agreement.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 9. RWA.xyz Data Reference ────────────────────────────────────────────
  {
    providerId: "rwa-rwa-xyz",
    displayName: "RWA.xyz Data Reference",
    category: "marketplace_reference",
    description:
      "RWA.xyz is an industry data and analytics reference for the tokenized real-world asset market. Tracks market data, issuance volumes, and provider activity across the RWA ecosystem. Reference-only for TROPTIONS.",
    officialReferenceUrl: "https://rwa.xyz",
    supportedAssetClasses: ["market_data_reference", "rwa_analytics", "issuance_tracking"],
    supportedChains: [],
    currentTroptionsStatus: "reference_only",
    capabilityStatus: "display_reference",
    requiredCredentials: [],
    requiredLegalReview: ["data_usage_terms_review"],
    requiredProviderContract: false,
    requiredEvidence: ["data_terms_of_service_acknowledgment"],
    allowedPublicLanguage:
      "TROPTIONS references publicly available RWA market data and analytics from industry sources as background context for its RWA adapter registry.",
    blockedPublicLanguage: [
      "TROPTIONS is partnered with RWA.xyz",
      "TROPTIONS provides RWA.xyz data",
      "TROPTIONS licensed RWA.xyz data",
    ],
    integrationNotes:
      "RWA.xyz provides market-level data and analytics. Reference use only — TROPTIONS does not redistribute RWA.xyz data.",
    riskNotes:
      "Data usage must comply with RWA.xyz terms of service. TROPTIONS does not scrape, redistribute, or claim ownership of third-party market data.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 10. Chainlink Oracle/Proof Reference ─────────────────────────────────
  {
    providerId: "rwa-chainlink",
    displayName: "Chainlink Oracle / Proof Reference",
    category: "oracle_proof_reference",
    description:
      "Chainlink provides decentralized oracle networks for onchain data feeds, proof of reserve verification, and cross-chain interoperability. Used as a proof and oracle reference adapter in the TROPTIONS architecture.",
    officialReferenceUrl: "https://chain.link",
    supportedAssetClasses: [
      "proof_of_reserve",
      "price_feeds",
      "cross_chain_messaging",
      "onchain_data_verification",
    ],
    supportedChains: ["Ethereum", "Avalanche", "Polygon", "BNB Chain", "Arbitrum", "Optimism"],
    currentTroptionsStatus: "design_ready",
    capabilityStatus: "provider_contract_required",
    requiredCredentials: ["chainlink_node_operator_or_data_feed_subscription"],
    requiredLegalReview: ["oracle_service_terms_review", "data_feed_usage_policy_review"],
    requiredProviderContract: false,
    requiredEvidence: ["chainlink_service_agreement_or_terms_acceptance"],
    allowedPublicLanguage:
      "TROPTIONS is designed with provider-neutral adapter readiness for onchain oracle and proof-of-reserve infrastructure. Chainlink is an industry-reference provider in the oracle and proof category.",
    blockedPublicLanguage: [
      "TROPTIONS is partnered with Chainlink",
      "TROPTIONS uses Chainlink for asset backing proof",
      "TROPTIONS asset reserves verified by Chainlink",
    ],
    integrationNotes:
      "Chainlink oracle feeds are available via public smart contract interfaces. Proof of Reserve integration would require configuring a custom oracle job.",
    riskNotes:
      "Oracle data must not be used to make false claims about asset backing. Do not imply Chainlink verifies TROPTIONS assets without a configured and audited oracle feed.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 11. Manual RWA Evidence Adapter ─────────────────────────────────────
  {
    providerId: "rwa-manual-evidence",
    displayName: "Manual RWA Evidence Adapter",
    category: "manual_evidence",
    description:
      "Internal adapter for recording, reviewing, and managing manually submitted RWA evidence documents. Supports custody documents, title records, appraisals, legal opinions, audit records, and provider contracts.",
    officialReferenceUrl: "",
    supportedAssetClasses: ["manual_document_records", "evidence_management"],
    supportedChains: [],
    currentTroptionsStatus: "design_ready",
    capabilityStatus: "evidence_tracking",
    requiredCredentials: ["troptions_admin_access"],
    requiredLegalReview: ["document_authenticity_review"],
    requiredProviderContract: false,
    requiredEvidence: ["document_upload", "reviewer_sign_off"],
    allowedPublicLanguage:
      "TROPTIONS maintains an internal evidence management system for reviewing and tracking RWA-related documentation as part of its build-verified infrastructure.",
    blockedPublicLanguage: [
      "TROPTIONS has verified RWA assets",
      "TROPTIONS holds RWA documents",
      "TROPTIONS certifies asset ownership",
    ],
    integrationNotes:
      "Internal adapter only. No external provider integration. Document management is internal to the TROPTIONS infrastructure control plane.",
    riskNotes:
      "Manual evidence records are for internal review only. TROPTIONS does not authenticate, certify, or guarantee the validity of third-party documents.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },

  // ─── 12. Internal Asset Reference Adapter ────────────────────────────────
  {
    providerId: "rwa-internal-reference",
    displayName: "Internal Asset Reference Adapter",
    category: "internal_reference",
    description:
      "Internal reference adapter for recording TROPTIONS-owned or controlled asset references, internal ledger notations, and asset readiness research. Not a live execution adapter.",
    officialReferenceUrl: "",
    supportedAssetClasses: ["internal_asset_references", "internal_ledger_notations"],
    supportedChains: [],
    currentTroptionsStatus: "design_ready",
    capabilityStatus: "evidence_tracking",
    requiredCredentials: ["troptions_admin_access"],
    requiredLegalReview: ["asset_classification_review"],
    requiredProviderContract: false,
    requiredEvidence: ["internal_asset_documentation", "legal_classification_review"],
    allowedPublicLanguage:
      "TROPTIONS maintains internal asset reference records for infrastructure planning purposes.",
    blockedPublicLanguage: [
      "TROPTIONS holds assets",
      "TROPTIONS is an asset custodian",
      "TROPTIONS manages client funds",
    ],
    integrationNotes:
      "Internal reference only. No live execution. Asset records are planning references, not live custody or ownership claims.",
    riskNotes:
      "Do not use internal asset reference records as evidence of actual asset holding or custody. Legal classification required before any external claims.",
    hasProviderContract: false,
    hasCredentials: false,
    hasLegalReview: false,
    hasComplianceApproval: false,
    executionEnabled: false,
  },
];

export function getRwaProviderById(providerId: string): RwaProviderAdapter | undefined {
  return RWA_PROVIDER_ADAPTERS.find((p) => p.providerId === providerId);
}

export function getRwaProvidersByCategory(
  category: RwaProviderAdapter["category"]
): RwaProviderAdapter[] {
  return RWA_PROVIDER_ADAPTERS.filter((p) => p.category === category);
}

export function getRwaProvidersByStatus(
  status: RwaProviderAdapter["currentTroptionsStatus"]
): RwaProviderAdapter[] {
  return RWA_PROVIDER_ADAPTERS.filter((p) => p.currentTroptionsStatus === status);
}

export function getReferenceOnlyProviders(): RwaProviderAdapter[] {
  return getRwaProvidersByStatus("reference_only");
}

export function getPublicClaimableProviders(): RwaProviderAdapter[] {
  // Only providers with safe public language are returned
  return RWA_PROVIDER_ADAPTERS.filter(
    (p) =>
      p.currentTroptionsStatus !== "blocked" &&
      p.allowedPublicLanguage.length > 0
  );
}
