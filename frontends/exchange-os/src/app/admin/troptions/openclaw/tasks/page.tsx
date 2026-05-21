import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { TaskQueueTable } from "@/components/openclaw/TaskQueueTable";
import { OPENCLAW_TASK_REGISTRY } from "@/content/troptions/openClawTaskRegistry";

export default function AdminOpenClawTasksPage() {
  return (
    <OpenClawLayout title="OpenClaw Tasks" intro="Task routing and dry-run workflow queue.">
      <TaskQueueTable
        rows={OPENCLAW_TASK_REGISTRY.map((task, index) => ({
          taskId: `${task.id}-${index}`,
          label: task.label,
          routedAgent: task.routedAgent,
          mode: task.type,
          approvalRequired: task.approvalRequired,
        }))}
      />
    </OpenClawLayout>
  );
}
