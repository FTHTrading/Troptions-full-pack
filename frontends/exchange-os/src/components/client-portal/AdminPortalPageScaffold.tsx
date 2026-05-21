import { ComplianceNotice } from "@/components/client-portal/ComplianceNotice";
import { ModuleAccessCard } from "@/components/client-portal/ModuleAccessCard";

type AdminPortalPageScaffoldProps = {
  title: string;
  intro: string;
};

export function AdminPortalPageScaffold({ title, intro }: AdminPortalPageScaffoldProps) {
  return (
    <main className="cp-theme">
      <div className="cp-wrap">
        <header className="cp-header">
          <h1>{title}</h1>
          <p>{intro}</p>
        </header>
        <section className="cp-grid">
          <ModuleAccessCard
            moduleName="Operator Control"
            allowed={false}
            blockedReasons={[
              "Simulation-first mode is active",
              "Provider and licensing checks required",
              "Board authorization required for execution",
            ]}
          />
          <ModuleAccessCard
            moduleName="Audit and Release Gates"
            allowed={true}
            blockedReasons={[]}
          />
        </section>
        <ComplianceNotice />
      </div>
    </main>
  );
}
