import { OPENCLAW_AGENT_REGISTRY } from "@/content/troptions/openClawAgentRegistry";
import { OPENCLAW_REGISTRY } from "@/content/troptions/openClawRegistry";
import { OPENCLAW_TASK_REGISTRY } from "@/content/troptions/openClawTaskRegistry";
import { OPENCLAW_TOOL_REGISTRY } from "@/content/troptions/openClawToolRegistry";
import { getOpenClawAuditEvents } from "@/lib/troptions/openClawAuditEngine";
import { getOpenClawBridgeStatus } from "@/lib/troptions/openClawBridge";
import { getOpenClawX402Readiness } from "@/lib/troptions/openClawX402Engine";
import { AgentPolicyBanner } from "@/components/openclaw/AgentPolicyBanner";
import { AgentStatusCard } from "@/components/openclaw/AgentStatusCard";
import { JefeAgentRouterPanel } from "@/components/openclaw/JefeAgentRouterPanel";
import { JefeBlockedActionsPanel } from "@/components/openclaw/JefeBlockedActionsPanel";
import { JefeCommandBar } from "@/components/openclaw/JefeCommandBar";
import { JefeQuickActions } from "@/components/openclaw/JefeQuickActions";
import { JefeStatusPanel } from "@/components/openclaw/JefeStatusPanel";
import { JefeTaskPlanCard } from "@/components/openclaw/JefeTaskPlanCard";
import { OpenClawAuditTable } from "@/components/openclaw/OpenClawAuditTable";
import { RagQueryPanel } from "@/components/openclaw/RagQueryPanel";
import { SiteOpsPanel } from "@/components/openclaw/SiteOpsPanel";
import { TaskQueueTable } from "@/components/openclaw/TaskQueueTable";
import { ToolRegistryTable } from "@/components/openclaw/ToolRegistryTable";
import { X402AgentPanel } from "@/components/openclaw/X402AgentPanel";

export function OpenClawDashboard() {
  const bridge = getOpenClawBridgeStatus();
  const x402 = getOpenClawX402Readiness();

  return (
    <div className="openclaw-grid">
      <section className="openclaw-grid-cards">
        <AgentStatusCard title="OpenClaw status" value={bridge.integrationStatus} />
        <AgentStatusCard title="Agents discovered" value={OPENCLAW_AGENT_REGISTRY.length} />
        <AgentStatusCard title="Agents online" value={OPENCLAW_AGENT_REGISTRY.filter((agent) => agent.status === "online").length} />
        <AgentStatusCard title="Tools registered" value={OPENCLAW_TOOL_REGISTRY.length} />
        <AgentStatusCard title="MCP tools available" value={OPENCLAW_TOOL_REGISTRY.filter((tool) => tool.category === "mcp").length} />
        <AgentStatusCard title="x402 simulations" value={x402.report.gatedCount + x402.report.readyCount} note={x402.report.overallStatus} />
        <AgentStatusCard title="Site checks today" value={12} />
        <AgentStatusCard title="Blocked actions" value={OPENCLAW_REGISTRY.blockedActions.length} />
        <AgentStatusCard title="Pending approvals" value={OPENCLAW_REGISTRY.dashboardMetrics.pendingApprovalRequests} />
        <AgentStatusCard title="Audit events" value={getOpenClawAuditEvents().length} />
        <AgentStatusCard title="RAG sources" value={5} />
        <AgentStatusCard title="Last heartbeat" value="active" />
      </section>

      <JefeStatusPanel />
      <JefeCommandBar />
      <JefeQuickActions />
      <JefeAgentRouterPanel />
      <JefeBlockedActionsPanel />
      <JefeTaskPlanCard />
      <AgentPolicyBanner />
      <TaskQueueTable rows={OPENCLAW_TASK_REGISTRY.map((task, index) => ({
        taskId: `${task.id}-${index}`,
        label: task.label,
        routedAgent: task.routedAgent,
        mode: task.type,
        approvalRequired: task.approvalRequired,
      }))} />
      <ToolRegistryTable tools={OPENCLAW_TOOL_REGISTRY} />
      <X402AgentPanel />
      <SiteOpsPanel />
      <RagQueryPanel />
      <OpenClawAuditTable events={getOpenClawAuditEvents()} />
    </div>
  );
}
