import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { ToolRegistryTable } from "@/components/openclaw/ToolRegistryTable";
import { OPENCLAW_TOOL_REGISTRY } from "@/content/troptions/openClawToolRegistry";

export default function AdminOpenClawMcpPage() {
  return (
    <OpenClawLayout title="OpenClaw MCP" intro="MCP tool visibility with permission and policy constraints.">
      <ToolRegistryTable tools={OPENCLAW_TOOL_REGISTRY.filter((tool) => tool.category === "mcp")} />
    </OpenClawLayout>
  );
}
