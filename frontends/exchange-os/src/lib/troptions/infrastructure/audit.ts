/**
 * TROPTIONS Infrastructure — Audit Events
 */

import type { TroptionsAuditEvent, InfraAuditAction, InfraAuditSeverity } from "./types";
import { randomUUID } from "crypto";

export function createInfraAuditEvent(params: {
  actor: string;
  namespaceId: string | null;
  action: InfraAuditAction;
  entityType: string;
  entityId: string;
  severity?: InfraAuditSeverity;
  beforeSummary?: string | null;
  afterSummary?: string | null;
  notes?: string;
}): TroptionsAuditEvent {
  return {
    id: `ae-${randomUUID()}`,
    actor: params.actor,
    namespaceId: params.namespaceId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    severity: params.severity ?? "info",
    beforeSummary: params.beforeSummary ?? null,
    afterSummary: params.afterSummary ?? null,
    notes: params.notes ?? "",
    timestamp: new Date().toISOString(),
  };
}

export function auditNamespaceCreated(
  actor: string,
  namespaceId: string,
  slug: string
): TroptionsAuditEvent {
  return createInfraAuditEvent({
    actor,
    namespaceId,
    action: "namespace_created",
    entityType: "namespace",
    entityId: namespaceId,
    afterSummary: `Namespace created: ${slug}`,
    notes: "New namespace provisioned.",
  });
}

export function auditAdapterRegistered(
  actor: string,
  namespaceId: string,
  adapterId: string,
  adapterName: string,
  status: string
): TroptionsAuditEvent {
  return createInfraAuditEvent({
    actor,
    namespaceId,
    action: "adapter_registered",
    entityType: "adapter",
    entityId: adapterId,
    severity: status === "credentials_required" ? "warning" : "info",
    afterSummary: `Adapter registered: ${adapterName} — ${status}`,
    notes:
      status === "credentials_required"
        ? "Execution disabled until credentials configured."
        : "",
  });
}

export function auditDeploymentFailed(
  actor: string,
  namespaceId: string,
  deploymentId: string,
  errorMessage: string
): TroptionsAuditEvent {
  return createInfraAuditEvent({
    actor,
    namespaceId,
    action: "deployment_failed",
    entityType: "deployment",
    entityId: deploymentId,
    severity: "critical",
    afterSummary: `Deployment failed: ${errorMessage}`,
    notes: "Review deployment credentials and build configuration.",
  });
}
