import { ApprovalGateBanner } from "@/components/client-portal/ApprovalGateBanner";
import { ClientPortalLayout } from "@/components/client-portal/ClientPortalLayout";
import { ClientStatusCard } from "@/components/client-portal/ClientStatusCard";
import { EvidenceChecklist } from "@/components/client-portal/EvidenceChecklist";
import { ModuleAccessCard } from "@/components/client-portal/ModuleAccessCard";
import { RailStatusTable } from "@/components/client-portal/RailStatusTable";
import { TradingSimulationCard } from "@/components/client-portal/TradingSimulationCard";
import { XrplRouteCard } from "@/components/client-portal/XrplRouteCard";
import { getClientPortalSummary } from "@/lib/troptions/clientPortalEngine";
import { getGlobalRailDashboard } from "@/lib/troptions/globalRailEngine";
import Link from "next/link";

type ClientPortalPageScaffoldProps = {
  title: string;
  intro: string;
  moduleName: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function ClientPortalPageScaffold({ title, intro, moduleName, ctaLabel, ctaHref }: ClientPortalPageScaffoldProps) {
  const summary = getClientPortalSummary("CL-001");
  const rails = getGlobalRailDashboard();

  return (
    <ClientPortalLayout title={title} intro={intro}>
      {ctaLabel && ctaHref && (
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href={ctaHref}
            style={{
              display: "inline-block",
              background: "#1B3259",
              color: "#fff",
              padding: "0.7rem 1.75rem",
              borderRadius: 3,
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            {ctaLabel} →
          </Link>
        </div>
      )}
      <ClientStatusCard label="Identity Status" status={summary.identityStatus} detail="KYC/KYB and sanctions checks are mandatory." />
      <ClientStatusCard label="Settlement Readiness" status={summary.settlementReadiness} detail="Settlement is live on XRPL and Stellar mainnet. Custody and advanced workflows require jurisdiction-specific compliance review." />
      <ModuleAccessCard
        moduleName={moduleName}
        allowed={false}
        blockedReasons={[
          "Provider approval pending",
          "Compliance and legal review required",
          "Board authorization required",
        ]}
      />
      <EvidenceChecklist title="Required Evidence" items={summary.openExceptions.concat(summary.requiredApprovals)} />
      <RailStatusTable
        rows={rails.rails.slice(0, 4).map((item) => ({ category: item.railCategory, status: item.status, mode: item.mode }))}
      />
      <XrplRouteCard routeName="XRPL Conversion Planner" risk="medium" status="simulation-only" />
      <TradingSimulationCard
        strategy="Algorithmic Strategy Gate"
        simulationMode={true}
        blockedReasons={[
          "Legal approval missing",
          "Compliance approval missing",
          "Risk approval missing",
          "Board approval missing",
        ]}
      />
      <ApprovalGateBanner
        blockedReasons={[
          "No live banking transfers",
          "No live trading by default",
          "No XRPL signing",
          "No unlicensed provider workflows",
        ]}
      />
    </ClientPortalLayout>
  );
}
