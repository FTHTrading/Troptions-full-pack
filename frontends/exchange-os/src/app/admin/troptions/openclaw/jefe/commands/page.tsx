import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { JefeCommandBar } from "@/components/openclaw/JefeCommandBar";

export default function AdminOpenClawJefeCommandsPage() {
  return (
    <OpenClawLayout title="Jefe Commands" intro="Quick command catalog for fast operator workflows.">
      <JefeCommandBar />
    </OpenClawLayout>
  );
}
