export function getOpenClawAuditEvents() {
  const now = new Date().toISOString();
  return [
    {
      id: "oc-audit-1",
      action: "status-check",
      mode: "simulation",
      actor: "jefe",
      timestamp: now,
      note: "OpenClaw status fetched.",
    },
    {
      id: "oc-audit-2",
      action: "x402-readiness",
      mode: "simulation",
      actor: "x402-agent",
      timestamp: now,
      note: "x402 readiness summary generated.",
    },
    {
      id: "oc-audit-3",
      action: "site-check",
      mode: "read-only",
      actor: "site-ops-agent",
      timestamp: now,
      note: "Site checks completed without deployment.",
    },
  ];
}
