export interface OpenClawTaskTemplate {
  id: string;
  label: string;
  routedAgent: string;
  type: "simulation" | "planning" | "read-only";
  approvalRequired: boolean;
}

export const OPENCLAW_TASK_REGISTRY: OpenClawTaskTemplate[] = [
  { id: "task.fix-next", label: "What needs fixing next", routedAgent: "site-ops-agent", type: "read-only", approvalRequired: false },
  { id: "task.site.audit", label: "Run safe site audit", routedAgent: "site-ops-agent", type: "simulation", approvalRequired: false },
  { id: "task.x402.readiness", label: "Check x402 readiness", routedAgent: "x402-agent", type: "simulation", approvalRequired: false },
  { id: "task.xrpl.readiness", label: "Check XRPL readiness", routedAgent: "xrpl-agent", type: "simulation", approvalRequired: false },
  { id: "task.wallet.status", label: "Check wallet system", routedAgent: "wallet-agent", type: "read-only", approvalRequired: false },
  { id: "task.blockers.summary", label: "Summarize open blockers", routedAgent: "compliance-agent", type: "read-only", approvalRequired: false },
  { id: "task.board.package", label: "Prepare board package", routedAgent: "clawd", type: "planning", approvalRequired: true },
  { id: "task.impl.plan", label: "Draft next implementation plan", routedAgent: "jefe", type: "planning", approvalRequired: false },
];
