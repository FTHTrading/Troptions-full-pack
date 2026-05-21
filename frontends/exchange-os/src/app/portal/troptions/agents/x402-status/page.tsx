import { ClientPortalPageScaffold } from "@/components/client-portal/ClientPortalPageScaffold";

export default function PortalAgentsX402StatusPage() {
  return (
    <ClientPortalPageScaffold
      title="x402 Agent Status"
      intro="x402 readiness and blocked reasons with simulation-only controls."
      moduleName="x402 Status"
    />
  );
}
