import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { JefeTaskPlanCard } from "@/components/openclaw/JefeTaskPlanCard";

export default function AdminOpenClawJefeTasksPage() {
  return (
    <OpenClawLayout title="Jefe Task Plans" intro="Planning-only task cards for operator review.">
      <JefeTaskPlanCard />
    </OpenClawLayout>
  );
}
