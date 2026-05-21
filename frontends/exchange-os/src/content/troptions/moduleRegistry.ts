/**
 * Troptions Module Registry
 * Single source of truth for all operational modules.
 * Every module declares what it does AND what it will never do.
 *
 * Runtime enforcement: prohibitedActions are checked before execution.
 * Modules cannot operate outside their allowedModes.
 */

import type { TroptionsModule } from "./troptionsRegistry";

export const MODULE_REGISTRY: TroptionsModule[] = [
  // ─── L1 Legal & Entity Control ───────────────────────────────────────────
  {
    id: "TROP-LEGAL-001",
    name: "Entity & Legal Control",
    description: "Troptions entity map, SPVs, issuers, board approvals, legal opinions, offering exemptions, transfer restrictions, jurisdiction routing.",
    category: "Legal",
    allowedModes: ["TROPTIONS_INFRA", "TROPTIONS_ADMIN", "TROPTIONS_COMPLIANCE"],
    prohibitedActions: ["issue-assets", "move-funds", "approve-investors", "override-compliance"],
    allowedChains: [],
    allowedJurisdictions: ["US", "GLOBAL"],
    allowedAssets: [],
    requiredApprovals: ["board", "legal-counsel"],
    requiredEvidence: ["entity-formation-docs", "legal-opinion", "offering-exemption"],
    riskLevel: "CRITICAL",
    status: "dry-run",
    owner: "Troptions Legal",
    dependencies: [],
    nextAction: "Engage outside counsel to confirm entity structure and exemption strategy.",
  },

  // ─── L2 Compliance & Identity ────────────────────────────────────────────
  {
    id: "TROP-COMPLY-001",
    name: "KYC/KYB Engine",
    description: "Know Your Customer, Know Your Business, AML, OFAC/sanctions, accreditation verification, investor eligibility, wallet allowlist, prohibited jurisdiction checks, continuous monitoring.",
    category: "Compliance",
    allowedModes: ["TROPTIONS_COMPLIANCE", "TROPTIONS_MEMBER", "TROPTIONS_INVESTOR", "TROPTIONS_ISSUER", "TROPTIONS_ADMIN"],
    prohibitedActions: ["approve-without-kyc", "bypass-sanctions", "skip-accreditation-check", "issue-assets"],
    allowedChains: [],
    allowedJurisdictions: ["US", "GLOBAL"],
    allowedAssets: [],
    requiredApprovals: ["compliance-officer"],
    requiredEvidence: ["kyc-provider-agreement", "sanctions-list-source", "aml-policy"],
    riskLevel: "CRITICAL",
    status: "dry-run",
    owner: "Troptions Compliance",
    dependencies: ["TROP-LEGAL-001"],
    nextAction: "Select KYC/AML provider and configure screening pipeline.",
  },

  // ─── L3 Custody & Banking ────────────────────────────────────────────────
  {
    id: "TROP-CUSTODY-001",
    name: "Custody Control Plane",
    description: "Bank escrow, qualified custody, Fireblocks route, Anchorage route, BitGo route, Coinbase Prime route, Circle route, physical vault route, reserve vaults, collateral vaults, redemption vaults.",
    category: "Custody",
    allowedModes: ["TROPTIONS_CUSTODY", "TROPTIONS_ADMIN", "TROPTIONS_SETTLEMENT"],
    prohibitedActions: ["store-private-keys", "store-seed-phrases", "move-funds-without-approval", "self-custody-client-funds"],
    allowedChains: ["Ethereum", "XRPL", "Stellar", "Solana", "Polygon"],
    allowedJurisdictions: ["US"],
    allowedAssets: ["USDC", "EURC", "PYUSD", "RLUSD", "USDT", "DAI"],
    requiredApprovals: ["board", "legal-counsel", "custody-provider"],
    requiredEvidence: ["custody-agreement", "vault-receipt", "custody-attestation"],
    riskLevel: "CRITICAL",
    status: "planned",
    owner: "Troptions Custody",
    dependencies: ["TROP-LEGAL-001", "TROP-COMPLY-001"],
    nextAction: "Evaluate Fireblocks / Anchorage / BitGo custody agreements.",
  },

  // ─── L4 Asset Intake ─────────────────────────────────────────────────────
  {
    id: "TROP-ASSET-001",
    name: "Troptions Asset Intake",
    description: "RWA intake, asset registration, ownership proof, appraisal, lien search, custody assignment for Troptions Pay, Gold, Unity, Xtroptions, SALP assets, gold, silver, real estate, receivables, bonds, certificates.",
    category: "Asset",
    allowedModes: ["TROPTIONS_ISSUER", "TROPTIONS_ADMIN", "TROPTIONS_COMPLIANCE"],
    prohibitedActions: ["issue-without-custody-proof", "issue-without-legal-approval", "issue-without-reserve-proof", "guarantee-liquidity"],
    allowedChains: ["XRPL", "Stellar", "Solana", "Ethereum", "Polygon"],
    allowedJurisdictions: ["US", "GLOBAL"],
    allowedAssets: ["Troptions-Pay", "Troptions-Gold", "Troptions-Unity", "Xtroptions", "Xtroptions-Gold", "SALP"],
    requiredApprovals: ["board", "legal-counsel", "compliance-officer"],
    requiredEvidence: ["title-proof", "appraisal", "lien-search", "custody-receipt", "legal-memo"],
    riskLevel: "HIGH",
    status: "dry-run",
    owner: "Troptions Asset Team",
    dependencies: ["TROP-CUSTODY-001", "TROP-COMPLY-001"],
    nextAction: "Complete asset intake checklist for each Troptions token family.",
  },

  // ─── L5 Proof Layer ──────────────────────────────────────────────────────
  {
    id: "TROP-PROOF-001",
    name: "Troptions Proof Center",
    description: "Proof of Funds, Proof of Reserves, Proof of Control. Document hashing (SHA-256), Merkle roots, on-chain anchoring, audit packages, reserve ratio reporting, exception logs.",
    category: "Proof",
    allowedModes: ["TROPTIONS_PROOF", "TROPTIONS_ADMIN", "TROPTIONS_COMPLIANCE", "TROPTIONS_INFRA"],
    prohibitedActions: ["publish-unverified-proof", "modify-proof-chain", "backdate-documents"],
    allowedChains: ["Bitcoin", "XRPL", "Polygon", "Ethereum"],
    allowedJurisdictions: ["US", "GLOBAL"],
    allowedAssets: [],
    requiredApprovals: ["compliance-officer", "auditor"],
    requiredEvidence: ["document-hash", "merkle-root", "audit-receipt", "reserve-schedule"],
    riskLevel: "HIGH",
    status: "dry-run",
    owner: "Troptions Proof Team",
    dependencies: ["TROP-CUSTODY-001"],
    nextAction: "Build document hashing pipeline and on-chain anchoring schedule.",
  },

  // ─── L6 Issuance Layer ───────────────────────────────────────────────────
  {
    id: "TROP-ISSUE-001",
    name: "Troptions Issuance Engine",
    description: "Troptions certificates, RWA receipts, Gold certificates, bond units, treasury units, private accounting units, stable units, member units, non-transferable participation units, restricted transfer security tokens where legally approved.",
    category: "Issuance",
    allowedModes: ["TROPTIONS_ISSUER", "TROPTIONS_ADMIN"],
    prohibitedActions: ["issue-without-board-approval", "issue-without-legal-opinion", "issue-without-custody-proof", "issue-without-reserve-proof", "issue-public-stablecoin-without-license"],
    allowedChains: ["XRPL", "Stellar", "Solana", "Ethereum", "Polygon"],
    allowedJurisdictions: ["US"],
    allowedAssets: ["Troptions-Certificates", "Troptions-Bonds", "Troptions-Treasury-Units"],
    requiredApprovals: ["board", "legal-counsel", "compliance-officer", "custody-provider"],
    requiredEvidence: ["board-consent", "legal-opinion", "custody-proof", "reserve-proof"],
    riskLevel: "CRITICAL",
    status: "planned",
    owner: "Troptions Issuance",
    dependencies: ["TROP-PROOF-001", "TROP-ASSET-001"],
    nextAction: "Draft issuance policy. Engage securities counsel for exemption analysis.",
  },

  // ─── L7 Settlement Layer ─────────────────────────────────────────────────
  {
    id: "TROP-SETTLE-001",
    name: "Troptions Settlement Layer",
    description: "Delivery-versus-payment, escrow release, refund routing, stablecoin settlement, bank wire settlement, custody-to-custody movement, vault ledger recording, settlement receipts, failure handling.",
    category: "Settlement",
    allowedModes: ["TROPTIONS_SETTLEMENT", "TROPTIONS_ADMIN", "TROPTIONS_TREASURY"],
    prohibitedActions: ["settle-without-kyc", "settle-to-prohibited-jurisdiction", "settle-without-escrow-release", "bypass-compliance-gate"],
    allowedChains: ["Stellar", "Ethereum", "Solana", "XRPL"],
    allowedJurisdictions: ["US", "GLOBAL"],
    allowedAssets: ["USDC", "EURC", "PYUSD", "RLUSD", "USDT"],
    requiredApprovals: ["compliance-officer"],
    requiredEvidence: ["kyc-clearance", "sanctions-clearance", "escrow-confirmation"],
    riskLevel: "HIGH",
    status: "dry-run",
    owner: "Troptions Settlement",
    dependencies: ["TROP-CUSTODY-001", "TROP-COMPLY-001"],
    nextAction: "Define settlement rails and onramp partner agreements.",
  },

  // ─── L8 Funding Layer ────────────────────────────────────────────────────
  {
    id: "TROP-FUND-001",
    name: "Troptions Funding Routes",
    description: "Private placement route, Reg D evaluation, Reg S evaluation, Centrifuge evaluation, Maple evaluation, bank funding, stablecoin funding, treasury funding, bond funding, institutional credit.",
    category: "Funding",
    allowedModes: ["TROPTIONS_INVESTOR", "TROPTIONS_ISSUER", "TROPTIONS_ADMIN", "TROPTIONS_TREASURY"],
    prohibitedActions: ["guarantee-returns", "promise-liquidity", "accept-funds-without-kyc", "bypass-accreditation"],
    allowedChains: ["Stellar", "Ethereum", "Solana"],
    allowedJurisdictions: ["US"],
    allowedAssets: ["USDC", "EURC"],
    requiredApprovals: ["board", "legal-counsel", "compliance-officer"],
    requiredEvidence: ["investor-kyc", "accreditation-proof", "subscription-docs", "escrow-confirmation"],
    riskLevel: "CRITICAL",
    status: "evaluation",
    owner: "Troptions Funding",
    dependencies: ["TROP-COMPLY-001", "TROP-CUSTODY-001"],
    nextAction: "Engage securities counsel. Draft Reg D / Reg S evaluation memos.",
  },

  // ─── L9 Operations, Risk & Reporting ─────────────────────────────────────
  {
    id: "TROP-OPS-001",
    name: "Troptions Operations & Risk",
    description: "Dashboards, risk scoring, failure matrix, audit trail, exception management, investor reporting, issuer reporting, reserve reporting, revenue reporting, admin command center.",
    category: "Operations",
    allowedModes: ["TROPTIONS_ADMIN", "TROPTIONS_COMPLIANCE", "TROPTIONS_INFRA"],
    prohibitedActions: ["override-failure-matrix", "suppress-audit-trail", "delete-exception-logs"],
    allowedChains: [],
    allowedJurisdictions: ["US", "GLOBAL"],
    allowedAssets: [],
    requiredApprovals: ["compliance-officer"],
    requiredEvidence: ["audit-trail", "exception-log", "risk-score"],
    riskLevel: "HIGH",
    status: "dry-run",
    owner: "Troptions Operations",
    dependencies: ["TROP-PROOF-001"],
    nextAction: "Deploy admin command dashboard. Wire failure matrix to all modules.",
  },

  // ─── AI Concierge ────────────────────────────────────────────────────────
  {
    id: "TROP-AI-001",
    name: "Troptions AI Concierge",
    description: "Web chat, voice support, SMS support, onboarding guidance, Gold Desk routing, document checklist guidance, proof package assistance, status lookups, escalation to human operators.",
    category: "AI",
    allowedModes: ["TROPTIONS_AI", "TROPTIONS_MEMBER", "TROPTIONS_ADMIN"],
    prohibitedActions: [
      "approve-investors",
      "approve-issuance",
      "move-funds",
      "approve-custody",
      "override-compliance",
      "provide-legal-advice",
      "provide-investment-advice",
      "provide-tax-advice",
    ],
    allowedChains: [],
    allowedJurisdictions: ["US", "GLOBAL"],
    allowedAssets: [],
    requiredApprovals: [],
    requiredEvidence: [],
    riskLevel: "MEDIUM",
    status: "planned",
    owner: "Troptions AI Team",
    dependencies: ["TROP-COMPLY-001"],
    nextAction: "Define AI concierge scope, escalation paths, and prohibited response rules.",
  },
];

/** Look up a module by id */
export function getModule(id: string): TroptionsModule | undefined {
  return MODULE_REGISTRY.find((m) => m.id === id);
}

/** Get all modules in a given category */
export function getModulesByCategory(category: string): TroptionsModule[] {
  return MODULE_REGISTRY.filter((m) => m.category === category);
}

/** Get all modules allowed in a given system mode */
export function getModulesForMode(mode: string): TroptionsModule[] {
  return MODULE_REGISTRY.filter((m) => m.allowedModes.includes(mode as never));
}
