/**
 * Troptions Ledger Adapter
 *
 * This adapter provides a SAFE, READ-ONLY and SIMULATION-ONLY interface
 * to the Troptions ecosystem ledger status, asset registry, transaction
 * capabilities, and liquidity path models.
 *
 * ═══════════════════════════════════════════════════════════════════
 * CRITICAL SAFETY NOTICE:
 *
 * No live transaction, token issuance, liquidity movement, wallet action,
 * or financial execution should occur from this adapter without:
 *   1. Explicit approval gate sign-off from approvalEngine.ts
 *   2. Legal review clearance
 *   3. Board authorization
 *   4. KYC/KYB completion
 *   5. Custody provider approval
 *   6. Jurisdiction compliance clearance
 *
 * Every method in this file returns data marked simulationOnly: true.
 * Any future live-execution path must be added to a SEPARATE gated adapter
 * with explicit approval chain integration and audit log writes.
 * ═══════════════════════════════════════════════════════════════════
 */

import {
  TROPTIONS_ECOSYSTEM_META,
  TROPTIONS_SUB_BRANDS,
  getTroptionsSubBrand,
  type TroptionsSubBrand,
} from "@/content/troptions/troptionsEcosystemRegistry";
import { TROPTIONS_ECOSYSTEM_PILLARS, TROPTIONS_SYSTEM_IDENTITY } from "@/content/troptions/troptionsRegistry";

// ─── Return types ─────────────────────────────────────────────────────────────

export interface TroptionsEcosystemStatus {
  simulationOnly: true;
  timestamp: string;
  systemIdentity: typeof TROPTIONS_SYSTEM_IDENTITY;
  primaryDomains: string[];
  totalSubBrands: number;
  activeSubBrands: number;
  draftSubBrands: number;
  needsReviewSubBrands: number;
  allApprovalGatesActive: true;
  liveExecutionEnabled: false;
  complianceModel: string;
  issuanceModel: string;
  settlementModel: string;
}

export interface TroptionsAssetListEntry {
  id: string;
  name: string;
  category: string;
  status: string;
  linkedCapabilities: string[];
  issuanceGated: true;
  requiresLegalReview: true;
  requiresBoardApproval: true;
}

export interface TroptionsDomainEntry {
  domain: string;
  subBrandId: string;
  subBrandName: string;
  category: string;
  status: string;
  integrationPriority: string;
}

export interface TroptionsTransactionCapability {
  id: string;
  name: string;
  description: string;
  state: "simulation" | "evaluation" | "planned" | "pending-approval";
  requiredApprovals: string[];
  isLiveEligible: false;
}

export interface TroptionsLiquidityPath {
  id: string;
  name: string;
  route: string;
  sourceAsset: string;
  destinationAsset: string;
  estimatedSlippage: string;
  railChain: string;
  state: "simulated" | "modelled" | "evaluation";
  simulationOnly: true;
  liveExecutionGated: true;
}

export interface TroptionsReadinessReport {
  simulationOnly: true;
  generatedAt: string;
  ecosystemStatus: "operational-simulation";
  totalCapabilities: number;
  liveCapabilities: 0;
  simulationCapabilities: number;
  pendingLegalReview: string[];
  pendingBoardApproval: string[];
  pendingCustodyApproval: string[];
  approvalGatesActive: string[];
  manualActionsRequired: string[];
  estimatedReadinessForLiveOps: "not-determined — legal and board review required";
}

// ─── Core adapter functions ────────────────────────────────────────────────────

/**
 * Returns the current operational status of the entire Troptions ecosystem.
 * Simulation-only — no live state is read or written.
 */
export function getTroptionsEcosystemStatus(): TroptionsEcosystemStatus {
  const active = TROPTIONS_SUB_BRANDS.filter((b) => b.status === "active").length;
  const draft = TROPTIONS_SUB_BRANDS.filter((b) => b.status === "draft").length;
  const review = TROPTIONS_SUB_BRANDS.filter((b) => b.status === "needs-review").length;

  return {
    simulationOnly: true,
    timestamp: new Date().toISOString(),
    systemIdentity: TROPTIONS_SYSTEM_IDENTITY,
    primaryDomains: [...TROPTIONS_ECOSYSTEM_META.primaryDomains],
    totalSubBrands: TROPTIONS_SUB_BRANDS.length,
    activeSubBrands: active,
    draftSubBrands: draft,
    needsReviewSubBrands: review,
    allApprovalGatesActive: true,
    liveExecutionEnabled: false,
    complianceModel: TROPTIONS_SYSTEM_IDENTITY.complianceModel,
    issuanceModel: TROPTIONS_SYSTEM_IDENTITY.issuanceModel,
    settlementModel: TROPTIONS_SYSTEM_IDENTITY.settlementModel,
  };
}

/**
 * Returns all Troptions-affiliated asset types and their readiness state.
 * All assets are issuance-gated and require legal + board approval.
 */
export function listTroptionsAssets(): TroptionsAssetListEntry[] {
  return TROPTIONS_SUB_BRANDS.map((brand) => ({
    id: brand.id,
    name: brand.displayName,
    category: brand.category,
    status: brand.status,
    linkedCapabilities: brand.linkedCapabilities,
    issuanceGated: true,
    requiresLegalReview: true,
    requiresBoardApproval: true,
  }));
}

/**
 * Returns all Troptions-associated domains with their sub-brand mapping.
 */
export function listTroptionsDomains(): TroptionsDomainEntry[] {
  const entries: TroptionsDomainEntry[] = [];

  for (const brand of TROPTIONS_SUB_BRANDS) {
    entries.push({
      domain: brand.domain,
      subBrandId: brand.id,
      subBrandName: brand.displayName,
      category: brand.category,
      status: brand.status,
      integrationPriority: brand.integrationPriority,
    });
    if (brand.altDomains) {
      for (const altDomain of brand.altDomains) {
        entries.push({
          domain: altDomain,
          subBrandId: brand.id,
          subBrandName: brand.displayName + " (alt domain)",
          category: brand.category,
          status: brand.status,
          integrationPriority: brand.integrationPriority,
        });
      }
    }
  }

  return entries;
}

/**
 * Lists all transaction types the Troptions infrastructure can support
 * along with their current live-eligibility state.
 * All are non-live until approval gates are explicitly satisfied.
 */
export function listTroptionsTransactionCapabilities(): TroptionsTransactionCapability[] {
  return [
    {
      id: "barter-exchange",
      name: "Barter Exchange Routing",
      description: "Structured barter value exchange between vetted participants via Troptions Xchange.",
      state: "simulation",
      requiredApprovals: ["legal-review", "aml-screening", "kyc-kyb", "board-authorization"],
      isLiveEligible: false,
    },
    {
      id: "rwa-intake",
      name: "RWA Intake & Documentation",
      description: "Real-world asset onboarding — documentation, proof, title verification.",
      state: "evaluation",
      requiredApprovals: ["legal-review", "custody-approval", "title-verification"],
      isLiveEligible: false,
    },
    {
      id: "token-transfer",
      name: "Unity Token Transfer",
      description: "Transfer of Troptions Unity Token (TUT) between wallets.",
      state: "planned",
      requiredApprovals: [
        "securities-counsel-opinion",
        "board-authorization",
        "custody-approval",
        "kyc-kyb",
      ],
      isLiveEligible: false,
    },
    {
      id: "stable-unit-settlement",
      name: "Stable Unit Settlement",
      description: "Settlement using Troptions stable units via XRPL, Stellar, or EVM rails.",
      state: "evaluation",
      requiredApprovals: [
        "legal-review",
        "licensing-review",
        "custody-approval",
        "board-authorization",
      ],
      isLiveEligible: false,
    },
    {
      id: "proof-of-funds",
      name: "Proof of Funds Workflow",
      description: "Structured POF documentation and verification for institutional participants.",
      state: "simulation",
      requiredApprovals: ["legal-review", "kyc-kyb", "counsel-sign-off"],
      isLiveEligible: false,
    },
    {
      id: "funding-route",
      name: "Institutional Funding Routes",
      description: "Capital formation routes for qualified institutional participants.",
      state: "evaluation",
      requiredApprovals: [
        "legal-review",
        "securities-review",
        "accredited-investor-verification",
        "board-authorization",
      ],
      isLiveEligible: false,
    },
  ];
}

/**
 * Simulates liquidity paths for Troptions assets.
 * SIMULATION ONLY — no actual trades, swaps, or liquidity movements are made.
 */
export function simulateTroptionsLiquidityPath(assetId: string): TroptionsLiquidityPath[] {
  const brand = getTroptionsSubBrand(assetId);
  if (!brand) {
    return [];
  }

  // Return modelled/simulated paths — these are infrastructure documentation only
  return [
    {
      id: `${assetId}-xrpl-amm`,
      name: `${brand.displayName} — XRPL AMM Route (Simulated)`,
      route: "Troptions Unit → XRPL AMM → XRP → Target Asset",
      sourceAsset: brand.displayName,
      destinationAsset: "XRP",
      estimatedSlippage: "modelled-only",
      railChain: "XRPL",
      state: "simulated",
      simulationOnly: true,
      liveExecutionGated: true,
    },
    {
      id: `${assetId}-stellar-path`,
      name: `${brand.displayName} — Stellar Path Payment (Modelled)`,
      route: "Troptions Unit → Stellar DEX → USDC → Target",
      sourceAsset: brand.displayName,
      destinationAsset: "USDC",
      estimatedSlippage: "modelled-only",
      railChain: "Stellar",
      state: "modelled",
      simulationOnly: true,
      liveExecutionGated: true,
    },
  ];
}

/**
 * Generates a full readiness report for the Troptions ecosystem.
 * Read-only — evaluates registry state and returns a structured summary.
 */
export function createTroptionsReadinessReport(): TroptionsReadinessReport {
  const capabilities = listTroptionsTransactionCapabilities();
  const allBrands = TROPTIONS_SUB_BRANDS;
  const pillars = [...TROPTIONS_ECOSYSTEM_PILLARS];

  const pendingLegal = allBrands
    .filter((b) => b.status === "draft" || b.status === "needs-review")
    .map((b) => `${b.displayName} — ${b.complianceNotes.slice(0, 80)}...`);

  const manualActions = allBrands
    .flatMap((b) => b.nextActions)
    .filter((a) => a.includes("review") || a.includes("Confirm") || a.includes("Legal"));

  return {
    simulationOnly: true,
    generatedAt: new Date().toISOString(),
    ecosystemStatus: "operational-simulation",
    totalCapabilities: capabilities.length + pillars.length,
    liveCapabilities: 0,
    simulationCapabilities: capabilities.length,
    pendingLegalReview: pendingLegal,
    pendingBoardApproval: [
      "Unity Token issuance",
      "Stable unit launch",
      "Funding route live activation",
      "Exchange venue live activation",
    ],
    pendingCustodyApproval: [
      "RWA custody arrangement",
      "Wallet custody for institutional members",
    ],
    approvalGatesActive: [
      "Control plane writes gate",
      "HMAC-JWT authentication",
      "IP allowlist enforcement",
      "Rate limit guards",
      "Idempotency key enforcement",
      "Approval engine multi-sig",
      "Audit log immutable write",
      "Deployment feature flags",
    ],
    manualActionsRequired: [...new Set(manualActions)].slice(0, 10),
    estimatedReadinessForLiveOps:
      "not-determined — legal and board review required",
  };
}

/**
 * Validates whether an approval gate is satisfied for a given capability.
 * This is a simulation-only check — it reads registry state only.
 * No live gate is opened by calling this function.
 */
export function validateTroptionsApprovalGate(
  capabilityId: string,
): {
  simulationOnly: true;
  capabilityId: string;
  gateOpen: false;
  reason: string;
  requiredApprovals: string[];
} {
  const capability = listTroptionsTransactionCapabilities().find((c) => c.id === capabilityId);

  if (!capability) {
    return {
      simulationOnly: true,
      capabilityId,
      gateOpen: false,
      reason: "Capability not found in Troptions transaction registry.",
      requiredApprovals: [],
    };
  }

  return {
    simulationOnly: true,
    capabilityId,
    gateOpen: false,
    reason:
      "All Troptions capabilities are currently in simulation or evaluation state. Live execution requires explicit approval gate sign-off from legal review, board authorization, KYC/KYB completion, and custody approval.",
    requiredApprovals: capability.requiredApprovals,
  };
}
