import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { JefeStatusPanel } from "@/components/openclaw/JefeStatusPanel";
import { JefeCommandBar } from "@/components/openclaw/JefeCommandBar";
import { JefeQuickActions } from "@/components/openclaw/JefeQuickActions";
import { JefeBlockedActionsPanel } from "@/components/openclaw/JefeBlockedActionsPanel";

export default function AdminOpenClawJefePage() {
  return (
    <OpenClawLayout title="Jefe Fast Operator" intro="Fast command-layer co-pilot for safe routing and planning.">
      <JefeStatusPanel />
      <JefeCommandBar />
      <JefeQuickActions />
      <JefeBlockedActionsPanel />
    </OpenClawLayout>
  );
}
