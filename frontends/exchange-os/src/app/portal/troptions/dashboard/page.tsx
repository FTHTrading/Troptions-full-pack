import { ClientPortalLayout } from "@/components/client-portal/ClientPortalLayout";
import { ClientStatusCard } from "@/components/client-portal/ClientStatusCard";
import { getClientPortalSummary } from "@/lib/troptions/clientPortalEngine";
import { MediaStrip } from "@/components/troptions-media/MediaStrip";
import { MEDIA_STATS, getApprovedMedia } from "@/content/troptions/mediaRegistry";

export default function TroptionsClientDashboardPage() {
  const summary = getClientPortalSummary("CL-001");
  const imageAssets = getApprovedMedia().filter((m) => m.type === "image");

  return (
    <ClientPortalLayout
      title="Client Dashboard"
      intro="Institutional dashboard for gated workflows and readiness checkpoints."
    >
      <ClientStatusCard label="Identity status" status={summary.identityStatus} />
      <ClientStatusCard label="Entity status" status={summary.entityStatus} />
      <ClientStatusCard label="KYC/KYB status" status={summary.identityStatus} />
      <ClientStatusCard label="Sanctions status" status={summary.sanctionsStatus} />
      <ClientStatusCard label="Proof of Funds status" status={summary.proofOfFundsStatus} />
      <ClientStatusCard label="SBLC package status" status={summary.sblcStatus} />
      <ClientStatusCard label="RWA intake status" status={summary.rwaStatus} />
      <ClientStatusCard label="Custody status" status={summary.custodyStatus} />
      <ClientStatusCard label="Banking rail status" status={summary.bankingRailStatus} />
      <ClientStatusCard label="Stablecoin rail status" status={summary.stablecoinRailStatus} />
      <ClientStatusCard label="XRPL access status" status={summary.xrplAccessStatus} />
      <ClientStatusCard label="Exchange route status" status={summary.exchangeRouteStatus} />
      <ClientStatusCard label="Trading simulation status" status={summary.tradingSimulationStatus} />
      <ClientStatusCard label="Settlement readiness" status={summary.settlementReadiness} />
      <ClientStatusCard label="Open exceptions" status={String(summary.openExceptions.length)} detail={summary.openExceptions.join(" | ")} />
      <ClientStatusCard label="Required approvals" status={String(summary.requiredApprovals.length)} detail={summary.requiredApprovals.join(" | ")} />

      {/* Media Evidence Strip */}
      {imageAssets.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#C9A24A",
              fontWeight: 700,
              marginBottom: "0.6rem",
              fontFamily: "Trebuchet MS, Segoe UI, sans-serif",
            }}
          >
            Approved Asset Evidence — {MEDIA_STATS.approved} items
          </p>
          <MediaStrip assets={imageAssets} />
        </div>
      )}
    </ClientPortalLayout>
  );
}
