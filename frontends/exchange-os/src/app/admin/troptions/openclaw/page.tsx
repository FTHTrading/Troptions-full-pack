import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { OpenClawDashboard } from "@/components/openclaw/OpenClawDashboard";

export default function AdminOpenClawPage() {
  return (
    <OpenClawLayout
      title="OpenClaw Command Center"
      intro="Safe agent orchestration for Troptions operations, x402 simulations, site checks, and operator task routing."
    >
      <OpenClawDashboard />
    </OpenClawLayout>
  );
}
