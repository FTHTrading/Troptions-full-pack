import { PageTemplate } from "@/components/troptions-old-money/PageTemplate";
import { OLD_MONEY_PAGES } from "@/content/troptions-old-money/pages";
import { InstitutionalFuturePanel } from "@/components/troptions-evolution/InstitutionalFuturePanel";
import "@/styles/troptions-evolution.css";

export default function TroptionsOldMoneyOverviewPage() {
  return (
    <>
      <PageTemplate page={OLD_MONEY_PAGES.overview} />
      <div className="om-page" style={{ marginTop: "1.2rem", gap: "1.2rem", display: "flex", flexDirection: "column" }}>
        <InstitutionalFuturePanel />
      </div>
    </>
  );
}
