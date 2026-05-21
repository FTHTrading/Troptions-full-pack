import { OPENCLAW_SITE_OPS_BLOCKED, OPENCLAW_SITE_OPS_CHECKS } from "@/content/troptions/openClawSiteOpsRegistry";

export function runOpenClawSiteCheck() {
  return {
    mode: "simulation",
    checks: OPENCLAW_SITE_OPS_CHECKS.map((check, index) => ({
      id: `check-${index + 1}`,
      label: check,
      status: "ok" as const,
    })),
    blockedActions: OPENCLAW_SITE_OPS_BLOCKED,
    didDeploy: false,
    auditHint: "Site check is read-only and simulation-safe.",
  };
}

export function draftOpenClawSiteFix(input: { issue: string }) {
  return {
    mode: "planning",
    issue: input.issue,
    draftPlan: [
      "Reproduce issue in local environment",
      "Prepare minimal patch and tests",
      "Run typecheck, tests, lint, and build",
      "Create operator review package",
    ],
    blockedActions: OPENCLAW_SITE_OPS_BLOCKED,
    auditHint: "Draft only. No file changes or deployment executed by this operation.",
  };
}
