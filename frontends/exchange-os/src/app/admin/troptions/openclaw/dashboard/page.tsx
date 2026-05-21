import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { OpenClawDashboard } from "@/components/openclaw/OpenClawDashboard";

export default function AdminOpenClawDashboardPage() {
  return (
    <OpenClawLayout title="OpenClaw Dashboard" intro="Operational overview of agents, tools, blockers, and approvals.">
      <OpenClawDashboard />
    </OpenClawLayout>
  );
}
