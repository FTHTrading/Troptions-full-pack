import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { X402AgentPanel } from "@/components/openclaw/X402AgentPanel";

export default function AdminOpenClawX402Page() {
  return (
    <OpenClawLayout title="OpenClaw x402 Layer" intro="x402 readiness and payment-intent simulation management.">
      <X402AgentPanel />
    </OpenClawLayout>
  );
}
