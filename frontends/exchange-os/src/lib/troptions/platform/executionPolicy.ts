/**
 * TROPTIONS Platform — Execution Policy Engine
 *
 * Hard rule: nothing may reach executed_confirmed unless:
 * 1. adapter is production_ready
 * 2. required credentials are configured
 * 3. compliance status is approved or not_required
 * 4. real provider confirmation exists
 * 5. audit event is created
 * 6. no safety guard blocks execution
 *
 * Mock and manual_proof adapters may NEVER return executed_confirmed.
 */

import type {
  ExecutionRequest,
  ExecutionResult,
  ExecutionStatus,
} from "./types";
import {
  ExecutionBlockedError,
  CredentialsRequiredError,
  ComplianceBlockError,
  MockAdapterExecutionError,
} from "./types";

const MOCK_ADAPTER_TYPES = ["mock", "mock_only", "manual_proof", "simulation"];

const EXECUTION_INCAPABLE_STATUSES: ExecutionStatus[] = [
  "design_only",
  "mock_only",
  "manual_review",
  "credentials_required",
  "execution_disabled",
  "blocked",
];

export function isMockOrManualAdapter(adapterCategory: string): boolean {
  return MOCK_ADAPTER_TYPES.includes(adapterCategory.toLowerCase());
}

export function complianceAllowsExecution(complianceStatus: string): boolean {
  return complianceStatus === "approved" || complianceStatus === "not_required";
}

/**
 * Evaluate whether an execution request may proceed.
 * Returns an ExecutionResult — never throws internally.
 * Throws typed errors for policy violations.
 */
export function evaluateExecutionPermission(
  request: ExecutionRequest
): ExecutionResult {
  // Guard 1: mock/manual_proof adapters CANNOT produce executed_confirmed
  if (request.isMock || request.isManualProof) {
    throw new MockAdapterExecutionError(request.adapterCategory);
  }

  // Guard 2: adapter must not be in an incapable status
  if (EXECUTION_INCAPABLE_STATUSES.includes(request.adapterStatus as ExecutionStatus)) {
    return {
      status: "execution_disabled",
      reason: `Adapter status '${request.adapterStatus}' does not permit execution.`,
    };
  }

  // Guard 3: credentials must be present
  if (!request.credentialsPresent) {
    throw new CredentialsRequiredError(["PROVIDER_API_KEY", "PROVIDER_SECRET"]);
  }

  // Guard 4: compliance must allow execution
  if (!complianceAllowsExecution(request.complianceStatus)) {
    throw new ComplianceBlockError(request.complianceStatus);
  }

  // Guard 5: cannot be sandbox
  if (request.isSandbox) {
    return {
      status: "execution_disabled",
      reason: "Adapter is in sandbox mode. Switch to production before executing.",
    };
  }

  // Guard 6: adapter must be production_ready
  if (request.adapterStatus !== "production_ready") {
    throw new ExecutionBlockedError(
      `Adapter status '${request.adapterStatus}' is not production_ready.`,
      request.adapterCategory
    );
  }

  // At this point execution could proceed — but we do NOT auto-confirm.
  // Real execution requires a provider API call that returns a confirmation.
  return {
    status: "execution_pending",
  } as unknown as ExecutionResult;
}

/**
 * Block unsafe execution — returns a blocked result with reason.
 */
export function blockUnsafeExecution(reason: string): ExecutionResult {
  return { status: "blocked", reason };
}

/**
 * Require production adapter — throws if not production_ready.
 */
export function requireProductionAdapter(adapterStatus: string, adapterCategory: string): void {
  if (adapterStatus !== "production_ready") {
    throw new ExecutionBlockedError(
      `Adapter is not production_ready (status: ${adapterStatus})`,
      adapterCategory
    );
  }
}

/**
 * Require compliance approval — throws if compliance is not approved.
 */
export function requireComplianceApproval(complianceStatus: string): void {
  if (!complianceAllowsExecution(complianceStatus)) {
    throw new ComplianceBlockError(complianceStatus);
  }
}

/**
 * Require provider confirmation — validates that a real provider has confirmed.
 */
export function requireProviderConfirmation(
  confirmation: string | null | undefined
): void {
  if (!confirmation || confirmation.trim() === "") {
    throw new ExecutionBlockedError(
      "No provider confirmation received. Execution cannot be marked as executed_confirmed without real provider response.",
      "unknown"
    );
  }
}
