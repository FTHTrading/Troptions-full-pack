import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { OPENCLAW_AGENT_REGISTRY } from "@/content/troptions/openClawAgentRegistry";
import { AgentStatusCard } from "@/components/openclaw/AgentStatusCard";

export default function AdminOpenClawAgentsPage() {
  return (
    <OpenClawLayout title="OpenClaw Agents" intro="Registered agents and simulation-safe status.">
      <section className="openclaw-grid-cards">
        {OPENCLAW_AGENT_REGISTRY.map((agent) => (
          <AgentStatusCard
            key={agent.id}
            title={agent.label}
            value={agent.status}
            note={`${agent.role} (${agent.tier})`}
          />
        ))}
      </section>
    </OpenClawLayout>
  );
}
