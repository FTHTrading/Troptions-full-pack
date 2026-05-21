/**
 * XRPL Account Readiness Engine
 *
 * Evaluates account flag configurations for compliance readiness.
 * Outputs unsigned transaction templates only.
 *
 * SAFETY RULES:
 * - All outputs are unsigned templates (no signing, no submission)
 * - NoFreeze is IRREVERSIBLE — gated with irreversibility_acknowledged check
 * - liveExecutionAllowed: false on all outputs
 * - Clawback requires trustline-clear check before recommendation
 */

import {
  XRPL_ACCOUNT_FLAG_REGISTRY,
  getXrplAccountFlag,
  type XrplAccountFlagDefinition,
} from "@/content/troptions/xrplAccountFlagRegistry";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface XrplAccountFlagReadinessInput {
  readonly accountAddress: string;
  readonly requestedFlags: readonly string[];
  readonly existingTrustlines?: number;
  readonly hasRegularKeyOrMultisig?: boolean;
  readonly irreversibilityAcknowledged?: boolean;
}

export type XrplFlagReadinessDecision = "template_ready" | "needs_prerequisite" | "blocked";

export interface XrplFlagEvaluation {
  readonly flagName: string;
  readonly decision: XrplFlagReadinessDecision;
  readonly blockedReasons: readonly string[];
  readonly prerequisites: readonly string[];
  readonly warningIfSet: string;
}

export interface XrplAccountSetTemplate {
  readonly TransactionType: "AccountSet";
  readonly Account: string;
  readonly SetFlag?: number;
  readonly ClearFlag?: number;
  readonly _note: string;
  readonly _liveExecutionAllowed: false;
  readonly _mustSignBeforeSubmitting: true;
}

export interface XrplAccountReadinessReport {
  readonly accountAddress: string;
  readonly requestedFlags: readonly string[];
  readonly evaluations: readonly XrplFlagEvaluation[];
  readonly unsignedTemplates: readonly XrplAccountSetTemplate[];
  readonly liveExecutionAllowed: false;
  readonly templateOnly: true;
  readonly disclaimer: string;
  readonly evaluatedAt: string;
}

// ─── ASF numeric values ────────────────────────────────────────────────────────
// Reference: https://xrpl.org/accountset.html

const ASF_VALUES: Record<string, number> = {
  asfRequireAuth: 2,
  asfRequireDestTag: 1,
  asfDisableMaster: 4,
  asfAccountTxnID: 5,
  asfNoFreeze: 6,
  asfGlobalFreeze: 7,
  asfDefaultRipple: 8,
  asfDepositAuth: 9,
  asfAllowTrustLineClawback: 16,
};

// ─── Engine ───────────────────────────────────────────────────────────────────

export function evaluateXrplAccountFlagReadiness(
  input: XrplAccountFlagReadinessInput
): XrplAccountReadinessReport {
  const evaluations: XrplFlagEvaluation[] = [];
  const unsignedTemplates: XrplAccountSetTemplate[] = [];

  for (const flagName of input.requestedFlags) {
    const flagDef = getXrplAccountFlag(flagName);

    if (!flagDef) {
      evaluations.push({
        flagName,
        decision: "blocked",
        blockedReasons: [`Unknown flag: "${flagName}". Not in XRPL Account Flag Registry.`],
        prerequisites: [],
        warningIfSet: "Unknown flag — do not attempt to set.",
      });
      continue;
    }

    const blockedReasons: string[] = [];
    const prerequisites: string[] = [];

    // NoFreeze: irreversibility must be acknowledged
    if (flagDef.flagName === "asfNoFreeze") {
      if (!input.irreversibilityAcknowledged) {
        blockedReasons.push(
          "asfNoFreeze is IRREVERSIBLE. Set irreversibilityAcknowledged: true only after legal counsel confirms this aligns with your AML/regulatory obligations. This permanently waives freeze authority."
        );
        prerequisites.push("Legal counsel review of NoFreeze implications");
        prerequisites.push("Explicit irreversibilityAcknowledged: true confirmation");
      } else {
        prerequisites.push("Confirmed: irreversibilityAcknowledged = true");
      }
    }

    // Clawback: cannot set if trustlines already exist
    if (flagDef.flagName === "asfAllowTrustLineClawback") {
      if (input.existingTrustlines !== undefined && input.existingTrustlines > 0) {
        blockedReasons.push(
          `asfAllowTrustLineClawback cannot be set if trustlines already exist. Existing trustlines: ${input.existingTrustlines}. This flag must be set before any trustlines are created.`
        );
      }
      prerequisites.push("Confirm zero existing trustlines before setting");
      prerequisites.push("Legal authorization for clawback exercise");
    }

    // MasterKeyDisable: requires RegularKey or multisig first
    if (flagDef.flagName === "asfDisableMaster") {
      if (!input.hasRegularKeyOrMultisig) {
        blockedReasons.push(
          "asfDisableMaster requires a RegularKey or multisig to be configured FIRST. " +
          "Setting this flag without an alternative signing method will permanently lock the account."
        );
        prerequisites.push("Configure RegularKey or multisig (SignerList) before disabling master key");
      }
    }

    // Live execution is always blocked
    blockedReasons.push(
      "Live execution is disabled. This is a template only — it must be manually reviewed, signed, and submitted separately."
    );

    const asfValue = ASF_VALUES[flagDef.flagName];
    const decision: XrplFlagReadinessDecision =
      blockedReasons.length === 1 ? "template_ready" : "needs_prerequisite";

    evaluations.push({
      flagName: flagDef.flagName,
      decision: blockedReasons.length > 1 ? "needs_prerequisite" : "template_ready",
      blockedReasons: blockedReasons.filter((r) => !r.includes("Live execution")),
      prerequisites,
      warningIfSet: flagDef.warningIfSet,
    });

    if (decision === "template_ready" && asfValue !== undefined) {
      unsignedTemplates.push({
        TransactionType: "AccountSet",
        Account: input.accountAddress,
        SetFlag: asfValue,
        _note: `Unsigned template for ${flagDef.displayName}. Do not submit without legal review and manual signing.`,
        _liveExecutionAllowed: false,
        _mustSignBeforeSubmitting: true,
      });
    }
  }

  return {
    accountAddress: input.accountAddress,
    requestedFlags: input.requestedFlags,
    evaluations,
    unsignedTemplates,
    liveExecutionAllowed: false,
    templateOnly: true,
    disclaimer:
      "All AccountSet outputs are unsigned templates. They must be reviewed by legal counsel, " +
      "signed with an authorized key, and submitted only with explicit governance approval. " +
      "NoFreeze is irreversible. Clawback flags cannot be set once trustlines exist. " +
      "This engine does not submit transactions and has no access to private keys.",
    evaluatedAt: new Date().toISOString(),
  };
}

// ─── Quick reference ───────────────────────────────────────────────────────────

export function createXrplAccountFlagSummary(): {
  totalFlags: number;
  irreversibleFlags: readonly string[];
  criticalRiskFlags: readonly string[];
  requiresMultisigFlags: readonly string[];
  liveExecutionAllowed: false;
} {
  const irreversibleFlags = XRPL_ACCOUNT_FLAG_REGISTRY
    .filter((f) => !f.reversible)
    .map((f) => f.flagName);

  const criticalRiskFlags = XRPL_ACCOUNT_FLAG_REGISTRY
    .filter((f) => f.risk === "critical")
    .map((f) => f.flagName);

  const requiresMultisigFlags = XRPL_ACCOUNT_FLAG_REGISTRY
    .filter((f) => f.requiresMultisigOrRegularKey)
    .map((f) => f.flagName);

  return {
    totalFlags: XRPL_ACCOUNT_FLAG_REGISTRY.length,
    irreversibleFlags,
    criticalRiskFlags,
    requiresMultisigFlags,
    liveExecutionAllowed: false,
  };
}
