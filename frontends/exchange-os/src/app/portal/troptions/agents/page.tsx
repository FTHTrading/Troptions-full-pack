import { ClientPortalPageScaffold } from "@/components/client-portal/ClientPortalPageScaffold";

export default function PortalAgentsPage() {
  return (
    <ClientPortalPageScaffold
      title="Agent Support Center"
      intro="Simulation-safe agent support for status summaries, readiness checks, and operator task routing."
      moduleName="Agents"
    />
  );
}
