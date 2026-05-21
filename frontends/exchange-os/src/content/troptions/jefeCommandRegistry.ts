export interface JefeQuickCommand {
  id: string;
  prompt: string;
  routedAgents: string[];
  sources: string[];
}

export const JEFE_COMMAND_REGISTRY: JefeQuickCommand[] = [
  {
    id: "jefe.fix-next",
    prompt: "What needs fixing next?",
    routedAgents: ["site-ops-agent"],
    sources: ["site-route-registry", "navigation-audit", "build-status"],
  },
  {
    id: "jefe.x402.readiness",
    prompt: "Check x402 readiness",
    routedAgents: ["x402-agent"],
    sources: ["x402-readiness-registry", "x402-blocker-registry"],
  },
  {
    id: "jefe.xrpl.readiness",
    prompt: "Check XRPL readiness",
    routedAgents: ["xrpl-agent"],
    sources: ["xrpl-platform-readiness", "amm-dex-registry"],
  },
  {
    id: "jefe.wallet.status",
    prompt: "Check wallet system",
    routedAgents: ["wallet-agent"],
    sources: ["wallet-route-status", "wallet-invite-qr-status", "wallet-funding-blockers"],
  },
  {
    id: "jefe.blockers",
    prompt: "Summarize open blockers",
    routedAgents: ["compliance-agent"],
    sources: ["release-gate-registry", "exception-registry"],
  },
  {
    id: "jefe.plan",
    prompt: "Draft next implementation plan",
    routedAgents: ["jefe"],
    sources: ["openclaw-task-registry", "approval-queue"],
  },
  {
    id: "jefe.site.audit",
    prompt: "Run safe site audit",
    routedAgents: ["site-ops-agent"],
    sources: ["route-registry", "broken-link-checker"],
  },
  {
    id: "jefe.board.package",
    prompt: "Prepare board package",
    routedAgents: ["clawd", "rag-agent"],
    sources: ["proof-registry", "claim-registry", "approvals-registry"],
  },
];
