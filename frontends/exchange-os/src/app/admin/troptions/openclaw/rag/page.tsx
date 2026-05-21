import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { RagQueryPanel } from "@/components/openclaw/RagQueryPanel";

export default function AdminOpenClawRagPage() {
  return (
    <OpenClawLayout title="OpenClaw RAG" intro="Registry-first retrieval and source-grounded summarization.">
      <RagQueryPanel />
    </OpenClawLayout>
  );
}
