/**
 * Stellar Issuer Readiness Engine
 *
 * Evaluates Stellar issuer control configurations for compliance readiness.
 * Outputs unsigned operation templates only.
 *
 * SAFETY RULES:
 * - All Stellar public-network actions blocked by default
 * - Asset issuance is simulation-only
 * - Trustline templates are unsigned only
 * - liveExecutionAllowed: false on all outputs
 */

import {
  STELLAR_ISSUER_CONTROL_REGISTRY,
  getStellarIssuerControl,
  type StellarIssuerControlDefinition,
} from "@/content/troptions/stellarIssuerControlRegistry";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StellarIssuerReadinessInput {
  readonly issuerAddress: string;
  readonly requestedControls: readonly string[];
  readonly hasMultisig?: boolean;
  readonly hasHomeDomain?: boolean;
  readonly hasReserveAttestation?: boolean;
  readonly hasLegalReview?: boolean;
  readonly irreversibilityAcknowledged?: boolean;
}

export type StellarControlReadinessDecision = "template_ready" | "needs_prerequisite" | "blocked";

export interface StellarControlEvaluation {
  readonly controlId: string;
  readonly displayName: string;
  readonly decision: StellarControlReadinessDecision;
  readonly blockedReasons: readonly string[];
  readonly prerequisites: readonly string[];
  readonly warningIfEnabled: string;
  readonly publicNetworkBlocked: true;
}

// Unsigned operation templates — Stellar XDR types (simplified for documentation)
export interface StellarSetOptionsTemplate {
  readonly operationType: "SET_OPTIONS";
  readonly sourceAccount: string;
  readonly flags?: { authRequired?: boolean; authRevocable?: boolean; authImmutable?: boolean; authClawbackEnabled?: boolean };
  readonly homeDomain?: string;
  readonly _note: string;
  readonly _liveExecutionAllowed: false;
  readonly _mustSignBeforeSubmitting: true;
  readonly _publicNetworkBlocked: true;
}

export interface StellarPaymentTemplate {
  readonly operationType: "PAYMENT";
  readonly sourceAccount: string;
  readonly destination: string;
  readonly asset: { code: string; issuer: string };
  readonly amount: string;
  readonly _note: string;
  readonly _liveExecutionAllowed: false;
  readonly _mustSignBeforeSubmitting: true;
  readonly _publicNetworkBlocked: true;
  readonly _simulationOnly: true;
}

export interface StellarSetTrustlineFlagsTemplate {
  readonly operationType: "SET_TRUST_LINE_FLAGS";
  readonly sourceAccount: string;
  readonly trustor: string;
  readonly asset: { code: string; issuer: string };
  readonly setFlags?: number;
  readonly clearFlags?: number;
  readonly _note: string;
  readonly _liveExecutionAllowed: false;
  readonly _mustSignBeforeSubmitting: true;
  readonly _publicNetworkBlocked: true;
}

export type StellarOperationTemplate =
  | StellarSetOptionsTemplate
  | StellarPaymentTemplate
  | StellarSetTrustlineFlagsTemplate;

export interface StellarIssuerReadinessReport {
  readonly issuerAddress: string;
  readonly requestedControls: readonly string[];
  readonly evaluations: readonly StellarControlEvaluation[];
  readonly unsignedTemplates: readonly StellarOperationTemplate[];
  readonly liveExecutionAllowed: false;
  readonly publicNetworkBlocked: true;
  readonly templateOnly: true;
  readonly disclaimer: string;
  readonly evaluatedAt: string;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export function evaluateStellarIssuerReadiness(
  input: StellarIssuerReadinessInput
): StellarIssuerReadinessReport {
  const evaluations: StellarControlEvaluation[] = [];
  const unsignedTemplates: StellarOperationTemplate[] = [];

  for (const controlId of input.requestedControls) {
    const controlDef = getStellarIssuerControl(controlId);

    if (!controlDef) {
      evaluations.push({
        controlId,
        displayName: controlId,
        decision: "blocked",
        blockedReasons: [`Unknown control: "${controlId}". Not in Stellar Issuer Control Registry.`],
        prerequisites: [],
        warningIfEnabled: "Unknown control — do not attempt to enable.",
        publicNetworkBlocked: true,
      });
      continue;
    }

    const blockedReasons: string[] = [];
    const prerequisites: string[] = [];

    // Irreversible controls require explicit acknowledgment
    if (!controlDef.reversible && !input.irreversibilityAcknowledged) {
      blockedReasons.push(
        `${controlDef.displayName} is IRREVERSIBLE. Set irreversibilityAcknowledged: true only after legal counsel review.`
      );
      prerequisites.push("Legal counsel review of irreversible flag implications");
      prerequisites.push("Explicit irreversibilityAcknowledged: true confirmation");
    }

    // Asset issuance requires reserve attestation
    if (controlId === "stellar_asset_issuance") {
      if (!input.hasReserveAttestation) {
        blockedReasons.push("Asset issuance requires reserve attestation documentation before any issuance.");
        prerequisites.push("Reserve attestation documentation");
        prerequisites.push("Legal approval for asset issuance");
      }
      prerequisites.push("KYC/KYB verification of receiving holder");
      prerequisites.push("Legal counsel issuance approval");
    }

    // AUTH_REVOCABLE and Clawback require legal review
    if (
      (controlId === "stellar_auth_revocable" || controlId === "stellar_clawback_enabled") &&
      !input.hasLegalReview
    ) {
      blockedReasons.push(
        `${controlDef.displayName} requires legal review before enabling. Freeze/clawback authority has regulatory implications.`
      );
      prerequisites.push("Legal counsel review of freeze/clawback authority");
    }

    // Multisig recommended for high-risk controls
    if (controlDef.risk === "high" || controlDef.risk === "critical") {
      if (!input.hasMultisig) {
        prerequisites.push("Multisig signing policy recommended for high-risk control operations");
      }
    }

    // Home domain should exist before issuing assets
    if (controlId === "stellar_asset_issuance" && !input.hasHomeDomain) {
      prerequisites.push("stellar.toml home domain should be configured before asset issuance for issuer transparency");
    }

    const decision: StellarControlReadinessDecision =
      blockedReasons.length > 0 ? "needs_prerequisite" : "template_ready";

    evaluations.push({
      controlId: controlDef.controlId,
      displayName: controlDef.displayName,
      decision,
      blockedReasons,
      prerequisites,
      warningIfEnabled: controlDef.warningIfEnabled,
      publicNetworkBlocked: true,
    });

    // Build unsigned template only for template_ready items
    if (decision === "template_ready") {
      const template = buildStellarTemplate(controlId, controlDef, input);
      if (template) {
        unsignedTemplates.push(template);
      }
    }
  }

  return {
    issuerAddress: input.issuerAddress,
    requestedControls: input.requestedControls,
    evaluations,
    unsignedTemplates,
    liveExecutionAllowed: false,
    publicNetworkBlocked: true,
    templateOnly: true,
    disclaimer:
      "All Stellar operation outputs are unsigned templates for documentation only. " +
      "Public-network operations are blocked. Asset issuance is simulation-only. " +
      "Templates must be reviewed by legal counsel, signed with an authorized key, " +
      "and submitted only with explicit governance approval. " +
      "This engine does not submit transactions and has no access to private keys or seeds.",
    evaluatedAt: new Date().toISOString(),
  };
}

function buildStellarTemplate(
  controlId: string,
  controlDef: StellarIssuerControlDefinition,
  input: StellarIssuerReadinessInput
): StellarOperationTemplate | null {
  switch (controlId) {
    case "stellar_auth_required":
      return {
        operationType: "SET_OPTIONS",
        sourceAccount: input.issuerAddress,
        flags: { authRequired: true },
        _note: `Unsigned template for ${controlDef.displayName}. Review and sign manually.`,
        _liveExecutionAllowed: false,
        _mustSignBeforeSubmitting: true,
        _publicNetworkBlocked: true,
      };
    case "stellar_auth_revocable":
      return {
        operationType: "SET_OPTIONS",
        sourceAccount: input.issuerAddress,
        flags: { authRevocable: true },
        _note: `Unsigned template for ${controlDef.displayName}. Review and sign manually.`,
        _liveExecutionAllowed: false,
        _mustSignBeforeSubmitting: true,
        _publicNetworkBlocked: true,
      };
    case "stellar_home_domain":
      return {
        operationType: "SET_OPTIONS",
        sourceAccount: input.issuerAddress,
        homeDomain: "example.com",
        _note: "Unsigned template — replace 'example.com' with actual home domain before signing.",
        _liveExecutionAllowed: false,
        _mustSignBeforeSubmitting: true,
        _publicNetworkBlocked: true,
      };
    default:
      return null;
  }
}

// ─── Summary ───────────────────────────────────────────────────────────────────

export function createStellarIssuerControlSummary(): {
  totalControls: number;
  irreversibleControls: readonly string[];
  criticalRiskControls: readonly string[];
  publicNetworkBlocked: true;
  liveExecutionAllowed: false;
} {
  const irreversibleControls = STELLAR_ISSUER_CONTROL_REGISTRY
    .filter((c) => !c.reversible)
    .map((c) => c.controlId);

  const criticalRiskControls = STELLAR_ISSUER_CONTROL_REGISTRY
    .filter((c) => c.risk === "critical")
    .map((c) => c.controlId);

  return {
    totalControls: STELLAR_ISSUER_CONTROL_REGISTRY.length,
    irreversibleControls,
    criticalRiskControls,
    publicNetworkBlocked: true,
    liveExecutionAllowed: false,
  };
}
