/**
 * TROPTIONS Infrastructure — Provisioning
 */

import type { TroptionsProvisioningPlan, SystemType } from "./types";
import { getTemplateBySystemType } from "./systemFactory";
import { randomUUID } from "crypto";

export function generateProvisioningPlan(params: {
  namespaceId: string;
  systemType: SystemType;
  actor: string;
}): TroptionsProvisioningPlan {
  const template = getTemplateBySystemType(params.systemType);
  const now = new Date().toISOString();
  return {
    id: `pp-${randomUUID()}`,
    namespaceId: params.namespaceId,
    systemType: params.systemType,
    planTitle: template
      ? `${template.templateName} — Provisioning Plan`
      : `Provisioning Plan`,
    requiredRoutes: template?.requiredRoutes ?? [],
    requiredModules: template?.requiredModules ?? [],
    requiredAdapters: template?.requiredAdapters ?? [],
    requiredEnvVars: template?.requiredEnvVars ?? [],
    complianceNotices: template?.requiredComplianceNotices ?? [],
    estimatedSetupFeeCategory: template?.estimatedSetupFeeCategory ?? "starter",
    estimatedMonthlyCategory: template?.estimatedMonthlyCategory ?? "starter",
    launchChecklistItems: template?.requiredLaunchChecklistItems ?? [],
    status: "draft",
    createdAt: now,
    approvedAt: null,
    notes: "Auto-generated from system factory template.",
  };
}
