import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { JefeAgentRouterPanel } from "@/components/openclaw/JefeAgentRouterPanel";

export default function AdminOpenClawJefeRoutingPage() {
  return (
    <OpenClawLayout title="Jefe Routing" intro="Keyword-to-agent routing map used by the fast dispatcher.">
      <JefeAgentRouterPanel />
    </OpenClawLayout>
  );
}
