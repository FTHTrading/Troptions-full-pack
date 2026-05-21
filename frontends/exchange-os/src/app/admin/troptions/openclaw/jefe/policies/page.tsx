import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { JefeBlockedActionsPanel } from "@/components/openclaw/JefeBlockedActionsPanel";

export default function AdminOpenClawJefePoliciesPage() {
  return (
    <OpenClawLayout title="Jefe Policies" intro="Policy constraints for the fast command-layer agent.">
      <JefeBlockedActionsPanel />
    </OpenClawLayout>
  );
}
