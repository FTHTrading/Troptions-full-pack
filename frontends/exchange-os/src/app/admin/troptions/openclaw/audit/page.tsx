import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { OpenClawAuditTable } from "@/components/openclaw/OpenClawAuditTable";
import { getOpenClawAuditEvents } from "@/lib/troptions/openClawAuditEngine";

export default function AdminOpenClawAuditPage() {
  return (
    <OpenClawLayout title="OpenClaw Audit" intro="Audit trail of simulation-safe OpenClaw and Jefe actions.">
      <OpenClawAuditTable events={getOpenClawAuditEvents()} />
    </OpenClawLayout>
  );
}
