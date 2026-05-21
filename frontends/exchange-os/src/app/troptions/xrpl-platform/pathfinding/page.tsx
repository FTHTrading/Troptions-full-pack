import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XrplQuoteSimulator } from "@/components/xrpl-platform/XrplQuoteSimulator";

export default function TroptionsXrplPathfindingPage() {
  return (
    <XrplPlatformLayout title="XRPL Pathfinding Quote Simulator" intro="Simulation-first route planning for cross-currency XRPL payment paths and venue estimates.">
      <XrplQuoteSimulator />
    </XrplPlatformLayout>
  );
}