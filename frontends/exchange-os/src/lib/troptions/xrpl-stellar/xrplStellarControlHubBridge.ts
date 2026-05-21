/**
 * XRPL + Stellar Control Hub Bridge
 *
 * Every simulation is persisted as a Control Hub record set:
 *   - Task record (tracks the operation)
 *   - Simulation record (records inputs/outputs serialised as JSON string)
 *   - Blocked action records (one per blocked reason)
 *   - Audit entry (immutable governance log)
 *   - Recommendations (next-step guidance)
 *
 * SAFETY RULES:
 * - No live chain calls
 * - No private keys, seeds, or mnemonics
 * - simulationOnly: true on all records
 * - isLiveMainnetExecutionEnabled: false always
 * - isLivePublicNetworkEnabled: false always
 */

import crypto from "node:crypto";
import {
  createTaskRecord,
  createSimulationRecord,
  createBlockedActionRecord,
  createAuditRecord,
  createRecommendationRecord,
} from "@/lib/troptions/controlHubStateStore";
import {
  evaluateXrplTrustlineRequest,
  evaluateXrplNftMintRequest,
  evaluateXrplAmmPoolRequest,
  createXrplReadinessReport,
  type XrplTrustlineRequestInput,
  type XrplNftMintRequestInput,
  type XrplAmmPoolRequestInput,
} from "@/lib/troptions/xrpl-stellar/xrplPolicyEngine";
import {
  evaluateStellarTrustlineRequest,
  evaluateStellarLiquidityPoolRequest,
  evaluateStellarPathPaymentRequest,
  createStellarReadinessReport,
  type StellarTrustlineRequestInput,
  type StellarLiquidityPoolRequestInput,
  type StellarPathPaymentRequestInput,
} from "@/lib/troptions/xrpl-stellar/stellarPolicyEngine";
import { XRPL_ECOSYSTEM_REGISTRY } from "@/content/troptions/xrplEcosystemRegistry";
import { STELLAR_ECOSYSTEM_REGISTRY } from "@/content/troptions/stellarEcosystemRegistry";
import type {
  CrossRailGovernanceDecision,
  XrplStellarReadinessReport,
} from "@/lib/troptions/xrpl-stellar/xrplStellarTypes";

// ─── helpers ───────────────────────────────────────────────────────────────────

function makeAuditToken(): string {
  return crypto.randomUUID();
}

function buildGovernanceDecision(
  taskId: string | null,
  auditRecordId: string | null,
  blocked: readonly string[],
  required: readonly string[],
  auditHint: string,
): CrossRailGovernanceDecision {
  return {
    taskId,
    auditRecordId,
    persisted: taskId !== null,
    allowed: false,
    simulationOnly: true,
    blockedActions: blocked,
    requiredApprovals: required,
    complianceChecks: [],
    auditHint,
  };
}

// ─── Status ────────────────────────────────────────────────────────────────────

export function getXrplStellarControlHubStatus() {
  return {
    xrplEcosystemEnabled: true,
    stellarEcosystemEnabled: true,
    isLiveMainnetExecutionEnabled: false,
    isLivePublicNetworkEnabled: false,
    executionMode: "simulation_only",
    xrplAssetsCount: XRPL_ECOSYSTEM_REGISTRY.length,
    stellarAssetsCount: STELLAR_ECOSYSTEM_REGISTRY.length,
    auditHint:
      "All XRPL and Stellar ecosystem operations are simulation-only. " +
      "No mainnet or public network execution is enabled.",
  } as const;
}

// ─── Asset Listing ─────────────────────────────────────────────────────────────

export function listXrplEcosystemAssets() {
  return XRPL_ECOSYSTEM_REGISTRY.map((e) => ({
    id: e.id,
    displayName: e.displayName,
    category: e.category,
    xrplPrimitive: e.xrplPrimitive,
    executionMode: e.executionMode,
    liveMainnetAllowedNow: e.liveMainnetAllowedNow,
    nftMintingAllowedNow: e.nftMintingAllowedNow,
    issuerStatus: e.issuerStatus,
    recommendedNextAction: e.recommendedNextAction,
  }));
}

export function listStellarEcosystemAssets() {
  return STELLAR_ECOSYSTEM_REGISTRY.map((e) => ({
    id: e.id,
    displayName: e.displayName,
    category: e.category,
    stellarPrimitive: e.stellarPrimitive,
    executionMode: e.executionMode,
    publicNetworkAllowedNow: e.publicNetworkAllowedNow,
    issuerStatus: e.issuerStatus,
    recommendedNextAction: e.recommendedNextAction,
  }));
}

// ─── XRPL Simulations ─────────────────────────────────────────────────────────

export function simulateXrplTrustline(
  input: XrplTrustlineRequestInput,
): CrossRailGovernanceDecision {
  const result = evaluateXrplTrustlineRequest(input);
  const entry = XRPL_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);
  const auditToken = makeAuditToken();
  const intent = `xrpl_trustline_simulation:${input.assetId}`;

  let taskId: string | null = null;
  let auditRecordId: string | null = null;

  try {
    const task = createTaskRecord({
      intent,
      status: "blocked",
      auditToken,
      routedTo: ["xrpl-policy-engine"],
      requiresApproval: false,
    });
    taskId = task.id;

    createSimulationRecord({
      taskId,
      simulationJson: JSON.stringify({
        type: "xrpl_trustline",
        assetId: input.assetId,
        displayName: entry?.displayName,
        simulationOnly: true,
        liveMainnetAllowedNow: false,
        blockedReasons: result.blockedReasons,
        requiredNextSteps: result.requiredNextSteps,
        auditHint: result.auditHint,
      }),
    });

    for (const reason of result.blockedReasons) {
      createBlockedActionRecord({
        taskId,
        capabilityId: `xrpl_trustline_create:${input.assetId}`,
        reason,
      });
    }

    const audit = createAuditRecord({
      taskId,
      auditToken,
      intent,
      actionType: "xrpl_trustline_simulation",
      outcome: "blocked",
      blockedCount: result.blockedReasons.length,
      requiresApproval: false,
    });
    auditRecordId = audit.id;

    for (const step of result.requiredNextSteps) {
      createRecommendationRecord({
        taskId,
        recommendation: step,
        priority: "high",
      });
    }
  } catch {
    // Persistence failure is non-fatal — governance decision is still valid
  }

  return buildGovernanceDecision(
    taskId,
    auditRecordId,
    result.blockedReasons,
    result.requiredNextSteps,
    result.auditHint,
  );
}

export function simulateXrplNftMint(
  input: XrplNftMintRequestInput,
): CrossRailGovernanceDecision {
  const result = evaluateXrplNftMintRequest(input);
  const entry = XRPL_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);
  const auditToken = makeAuditToken();
  const intent = `xrpl_nft_mint_simulation:${input.assetId}`;

  let taskId: string | null = null;
  let auditRecordId: string | null = null;

  try {
    const task = createTaskRecord({
      intent,
      status: "blocked",
      auditToken,
      routedTo: ["xrpl-policy-engine"],
      requiresApproval: false,
    });
    taskId = task.id;

    createSimulationRecord({
      taskId,
      simulationJson: JSON.stringify({
        type: "xrpl_nft_mint",
        assetId: input.assetId,
        displayName: entry?.displayName,
        simulationOnly: true,
        nftMintingAllowedNow: false,
        liveMainnetAllowedNow: false,
        blockedReasons: result.blockedReasons,
        auditHint: result.auditHint,
      }),
    });

    for (const reason of result.blockedReasons) {
      createBlockedActionRecord({
        taskId,
        capabilityId: `xrpl_nft_mint:${input.assetId}`,
        reason,
      });
    }

    const audit = createAuditRecord({
      taskId,
      auditToken,
      intent,
      actionType: "xrpl_nft_mint_simulation",
      outcome: "blocked",
      blockedCount: result.blockedReasons.length,
      requiresApproval: false,
    });
    auditRecordId = audit.id;

    for (const step of result.requiredNextSteps) {
      createRecommendationRecord({
        taskId,
        recommendation: step,
        priority: "high",
      });
    }
  } catch {
    // Non-fatal
  }

  return buildGovernanceDecision(
    taskId,
    auditRecordId,
    result.blockedReasons,
    result.requiredNextSteps,
    result.auditHint,
  );
}

export function simulateXrplAmmPool(
  input: XrplAmmPoolRequestInput,
): CrossRailGovernanceDecision {
  const result = evaluateXrplAmmPoolRequest(input);
  const entry = XRPL_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);
  const auditToken = makeAuditToken();
  const intent = `xrpl_amm_pool_simulation:${input.assetId}`;

  let taskId: string | null = null;
  let auditRecordId: string | null = null;

  try {
    const task = createTaskRecord({
      intent,
      status: "blocked",
      auditToken,
      routedTo: ["xrpl-policy-engine"],
      requiresApproval: false,
    });
    taskId = task.id;

    createSimulationRecord({
      taskId,
      simulationJson: JSON.stringify({
        type: "xrpl_amm_pool",
        assetId: input.assetId,
        displayName: entry?.displayName,
        simulationOnly: true,
        liveMainnetAllowedNow: false,
        noGuaranteedLiquidity: true,
        noGuaranteedYield: true,
        noGuaranteedReturn: true,
        blockedReasons: result.blockedReasons,
        auditHint: result.auditHint,
      }),
    });

    for (const reason of result.blockedReasons) {
      createBlockedActionRecord({
        taskId,
        capabilityId: `xrpl_amm_deposit:${input.assetId}`,
        reason,
      });
    }

    const audit = createAuditRecord({
      taskId,
      auditToken,
      intent,
      actionType: "xrpl_amm_pool_simulation",
      outcome: "blocked",
      blockedCount: result.blockedReasons.length,
      requiresApproval: false,
    });
    auditRecordId = audit.id;

    for (const step of result.requiredNextSteps) {
      createRecommendationRecord({
        taskId,
        recommendation: step,
        priority: "high",
      });
    }
  } catch {
    // Non-fatal
  }

  return buildGovernanceDecision(
    taskId,
    auditRecordId,
    result.blockedReasons,
    result.requiredNextSteps,
    result.auditHint,
  );
}

// ─── Stellar Simulations ───────────────────────────────────────────────────────

export function simulateStellarTrustline(
  input: StellarTrustlineRequestInput,
): CrossRailGovernanceDecision {
  const result = evaluateStellarTrustlineRequest(input);
  const entry = STELLAR_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);
  const auditToken = makeAuditToken();
  const intent = `stellar_trustline_simulation:${input.assetId}`;

  let taskId: string | null = null;
  let auditRecordId: string | null = null;

  try {
    const task = createTaskRecord({
      intent,
      status: "blocked",
      auditToken,
      routedTo: ["stellar-policy-engine"],
      requiresApproval: false,
    });
    taskId = task.id;

    createSimulationRecord({
      taskId,
      simulationJson: JSON.stringify({
        type: "stellar_trustline",
        assetId: input.assetId,
        displayName: entry?.displayName,
        simulationOnly: true,
        publicNetworkAllowedNow: false,
        blockedReasons: result.blockedReasons,
        auditHint: result.auditHint,
      }),
    });

    for (const reason of result.blockedReasons) {
      createBlockedActionRecord({
        taskId,
        capabilityId: `stellar_trustline_create:${input.assetId}`,
        reason,
      });
    }

    const audit = createAuditRecord({
      taskId,
      auditToken,
      intent,
      actionType: "stellar_trustline_simulation",
      outcome: "blocked",
      blockedCount: result.blockedReasons.length,
      requiresApproval: false,
    });
    auditRecordId = audit.id;

    for (const step of result.requiredNextSteps) {
      createRecommendationRecord({
        taskId,
        recommendation: step,
        priority: "high",
      });
    }
  } catch {
    // Non-fatal
  }

  return buildGovernanceDecision(
    taskId,
    auditRecordId,
    result.blockedReasons,
    result.requiredNextSteps,
    result.auditHint,
  );
}

export function simulateStellarLiquidityPool(
  input: StellarLiquidityPoolRequestInput,
): CrossRailGovernanceDecision {
  const result = evaluateStellarLiquidityPoolRequest(input);
  const entry = STELLAR_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);
  const auditToken = makeAuditToken();
  const intent = `stellar_lp_simulation:${input.assetId}`;

  let taskId: string | null = null;
  let auditRecordId: string | null = null;

  try {
    const task = createTaskRecord({
      intent,
      status: "blocked",
      auditToken,
      routedTo: ["stellar-policy-engine"],
      requiresApproval: false,
    });
    taskId = task.id;

    createSimulationRecord({
      taskId,
      simulationJson: JSON.stringify({
        type: "stellar_liquidity_pool",
        assetId: input.assetId,
        displayName: entry?.displayName,
        simulationOnly: true,
        publicNetworkAllowedNow: false,
        noGuaranteedLiquidity: true,
        noGuaranteedYield: true,
        blockedReasons: result.blockedReasons,
        auditHint: result.auditHint,
      }),
    });

    for (const reason of result.blockedReasons) {
      createBlockedActionRecord({
        taskId,
        capabilityId: `stellar_lp_deposit:${input.assetId}`,
        reason,
      });
    }

    const audit = createAuditRecord({
      taskId,
      auditToken,
      intent,
      actionType: "stellar_liquidity_pool_simulation",
      outcome: "blocked",
      blockedCount: result.blockedReasons.length,
      requiresApproval: false,
    });
    auditRecordId = audit.id;

    for (const step of result.requiredNextSteps) {
      createRecommendationRecord({
        taskId,
        recommendation: step,
        priority: "high",
      });
    }
  } catch {
    // Non-fatal
  }

  return buildGovernanceDecision(
    taskId,
    auditRecordId,
    result.blockedReasons,
    result.requiredNextSteps,
    result.auditHint,
  );
}

export function simulateStellarPathPayment(
  input: StellarPathPaymentRequestInput,
): CrossRailGovernanceDecision {
  const result = evaluateStellarPathPaymentRequest(input);
  const entry = STELLAR_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);
  const auditToken = makeAuditToken();
  const intent = `stellar_path_payment_simulation:${input.assetId}`;

  let taskId: string | null = null;
  let auditRecordId: string | null = null;

  try {
    const task = createTaskRecord({
      intent,
      status: "blocked",
      auditToken,
      routedTo: ["stellar-policy-engine"],
      requiresApproval: false,
    });
    taskId = task.id;

    createSimulationRecord({
      taskId,
      simulationJson: JSON.stringify({
        type: "stellar_path_payment",
        assetId: input.assetId,
        displayName: entry?.displayName,
        simulationOnly: true,
        publicNetworkAllowedNow: false,
        noRealXlmMovement: true,
        anchorInvolved: input.anchorInvolved ?? false,
        blockedReasons: result.blockedReasons,
        auditHint: result.auditHint,
      }),
    });

    for (const reason of result.blockedReasons) {
      createBlockedActionRecord({
        taskId,
        capabilityId: `stellar_path_payment_execute:${input.assetId}`,
        reason,
      });
    }

    const audit = createAuditRecord({
      taskId,
      auditToken,
      intent,
      actionType: "stellar_path_payment_simulation",
      outcome: "blocked",
      blockedCount: result.blockedReasons.length,
      requiresApproval: false,
    });
    auditRecordId = audit.id;

    for (const step of result.requiredNextSteps) {
      createRecommendationRecord({
        taskId,
        recommendation: step,
        priority: "high",
      });
    }
  } catch {
    // Non-fatal
  }

  return buildGovernanceDecision(
    taskId,
    auditRecordId,
    result.blockedReasons,
    result.requiredNextSteps,
    result.auditHint,
  );
}

// ─── Cross-Rail Readiness Report ───────────────────────────────────────────────

export function generateCrossRailReadinessReport(): XrplStellarReadinessReport {
  const xrpl = createXrplReadinessReport();
  const stellar = createStellarReadinessReport();

  const allComplianceGaps = [
    ...XRPL_ECOSYSTEM_REGISTRY.flatMap((e) => e.complianceRequirements),
    ...STELLAR_ECOSYSTEM_REGISTRY.flatMap((e) => e.complianceRequirements),
  ];

  const allRecommendations = [
    ...new Set([
      ...XRPL_ECOSYSTEM_REGISTRY.map((e) => e.recommendedNextAction),
      ...STELLAR_ECOSYSTEM_REGISTRY.map((e) => e.recommendedNextAction),
    ]),
  ];

  const auditToken = makeAuditToken();
  const intent = "cross_rail_readiness_report";

  let taskId: string | null = null;
  let auditRecordId: string | null = null;

  try {
    const task = createTaskRecord({
      intent,
      status: "simulated",
      auditToken,
      routedTo: ["xrpl-policy-engine", "stellar-policy-engine"],
      requiresApproval: false,
    });
    taskId = task.id;

    createSimulationRecord({
      taskId,
      simulationJson: JSON.stringify({
        type: "cross_rail_readiness",
        xrpl,
        stellar,
        simulationOnly: true,
        isLiveMainnetExecutionEnabled: false,
        isLivePublicNetworkEnabled: false,
      }),
    });

    const audit = createAuditRecord({
      taskId,
      auditToken,
      intent,
      actionType: "cross_rail_readiness_report",
      outcome: "simulated",
      blockedCount: 0,
      requiresApproval: false,
    });
    auditRecordId = audit.id;
  } catch {
    // Non-fatal
  }

  const governanceDecision = buildGovernanceDecision(
    taskId,
    auditRecordId,
    ["XRPL mainnet execution is disabled", "Stellar public network execution is disabled"],
    allRecommendations.slice(0, 5),
    "Cross-rail readiness report is simulation-only. No live chain execution was performed.",
  );

  return {
    generatedAt: new Date().toISOString(),
    ...xrpl,
    ...stellar,
    complianceGapsCount: allComplianceGaps.length,
    blockedActionsCount: xrpl.xrplAssetsTotal + stellar.stellarAssetsTotal,
    recommendedNextActions: allRecommendations,
    governanceDecision,
  };
}

export function persistCrossRailSimulation(
  simulationType: string,
  assetId: string,
  inputs: Record<string, unknown>,
  outputs: Record<string, unknown>,
): { taskId: string | null; auditRecordId: string | null } {
  const auditToken = makeAuditToken();
  const intent = `cross_rail_${simulationType}:${assetId}`;

  let taskId: string | null = null;
  let auditRecordId: string | null = null;

  try {
    const task = createTaskRecord({
      intent,
      status: "simulated",
      auditToken,
      routedTo: ["cross-rail-bridge"],
      requiresApproval: false,
    });
    taskId = task.id;

    createSimulationRecord({
      taskId,
      simulationJson: JSON.stringify({
        simulationType,
        assetId,
        inputs,
        outputs: { ...outputs, simulationOnly: true },
      }),
    });

    const audit = createAuditRecord({
      taskId,
      auditToken,
      intent,
      actionType: `cross_rail_${simulationType}`,
      outcome: "simulated",
      blockedCount: 0,
      requiresApproval: false,
    });
    auditRecordId = audit.id;
  } catch {
    // Non-fatal
  }

  return { taskId, auditRecordId };
}

export function createCrossRailGovernanceAuditEntry(
  eventType: string,
  summary: string,
  metadata: Record<string, unknown>,
): { auditRecordId: string | null } {
  const auditToken = makeAuditToken();

  let auditRecordId: string | null = null;

  try {
    const task = createTaskRecord({
      intent: `${eventType}:${summary.slice(0, 80)}`,
      status: "audited",
      auditToken,
      routedTo: ["cross-rail-bridge"],
      requiresApproval: false,
    });

    createSimulationRecord({
      taskId: task.id,
      simulationJson: JSON.stringify({ eventType, summary, metadata, simulationOnly: true }),
    });

    const audit = createAuditRecord({
      taskId: task.id,
      auditToken,
      intent: eventType,
      actionType: eventType,
      outcome: "blocked",
      blockedCount: 0,
      requiresApproval: false,
    });
    auditRecordId = audit.id;
  } catch {
    // Non-fatal
  }

  return { auditRecordId };
}
