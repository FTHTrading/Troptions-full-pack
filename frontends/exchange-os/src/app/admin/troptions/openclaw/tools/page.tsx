import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { ToolRegistryTable } from "@/components/openclaw/ToolRegistryTable";
import { OPENCLAW_TOOL_REGISTRY } from "@/content/troptions/openClawToolRegistry";

export default function AdminOpenClawToolsPage() {
  return (
    <OpenClawLayout title="OpenClaw Tools" intro="Tool registry with mode and approval constraints.">
      <ToolRegistryTable tools={OPENCLAW_TOOL_REGISTRY} />
    </OpenClawLayout>
  );
}
