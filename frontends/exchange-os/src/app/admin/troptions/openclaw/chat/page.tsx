import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { AgentChatPanel } from "@/components/openclaw/AgentChatPanel";
import { JefeBlockedActionsPanel } from "@/components/openclaw/JefeBlockedActionsPanel";
import { JefeCommandBar } from "@/components/openclaw/JefeCommandBar";
import { JefeQuickActions } from "@/components/openclaw/JefeQuickActions";
import { JefeStatusPanel } from "@/components/openclaw/JefeStatusPanel";

export default function AdminOpenClawChatPage() {
  return (
    <OpenClawLayout title="OpenClaw Chat" intro="Jefe fast-command chat surface with safe agent routing.">
      <JefeStatusPanel />
      <JefeCommandBar />
      <JefeQuickActions />
      <JefeBlockedActionsPanel />
      <AgentChatPanel />
    </OpenClawLayout>
  );
}
