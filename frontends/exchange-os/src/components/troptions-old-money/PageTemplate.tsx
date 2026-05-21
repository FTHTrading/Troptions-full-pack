import type { OldMoneyPageSpec } from "@/content/troptions-old-money/pages";
import { OLD_MONEY_EVIDENCE_ROWS } from "@/content/troptions-old-money/pages";
import { AssetFigure } from "@/components/troptions-old-money/AssetFigure";
import { ComplianceStrip } from "@/components/troptions-old-money/ComplianceStrip";
import { DataRoomCTA } from "@/components/troptions-old-money/DataRoomCTA";
import { EvidenceLedgerTable } from "@/components/troptions-old-money/EvidenceLedgerTable";
import { InstitutionalHeader } from "@/components/troptions-old-money/InstitutionalHeader";
import { LegalDisclaimer } from "@/components/troptions-old-money/LegalDisclaimer";
import { QuotePanel } from "@/components/troptions-old-money/QuotePanel";
import { SectionCard } from "@/components/troptions-old-money/SectionCard";

type PageTemplateProps = {
  page: OldMoneyPageSpec;
};

export function PageTemplate({ page }: PageTemplateProps) {
  return (
    <main className="om-page">
      <InstitutionalHeader title={page.title} subtitle={page.subtitle} intro={page.intro} />

      <ComplianceStrip />

      <section className="om-grid" aria-label="Institutional pillars">
        {page.cards.map((card) => (
          <SectionCard key={card.heading} heading={card.heading} body={card.body} />
        ))}
      </section>

      <div className="om-columns">
        <QuotePanel quote={page.quote} attribution={page.quoteAttribution} />
        <AssetFigure src={page.media?.src} alt={page.media?.alt} caption={page.media?.caption} />
      </div>

      <EvidenceLedgerTable rows={OLD_MONEY_EVIDENCE_ROWS} />
      <DataRoomCTA label={page.ctaLabel} href={page.ctaHref} />
      <LegalDisclaimer />
    </main>
  );
}
