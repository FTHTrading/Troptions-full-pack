import { PageShell } from "@/components/terminal/PageShell";
import { TruthChip } from "@/components/terminal/TruthChip";
import { TelegramDeepLink } from "@/components/TelegramDeepLink";
import {
  AWS_ACTIVATION_RUNBOOK_URL,
  COMMAND_CENTER_URL,
  MSB_FIAT_RAILS_URL,
  OVERVIEW_URL,
  SWIFT_PAGE_URL,
  PARTNER_BANK_MESH_URL,
  REVENUE_OPPORTUNITIES,
  SYSTEM_MANIFEST_URL,
  TELEGRAM_PAGE_URL,
  TROPTIONS_REVENUE_ENGINE_URL,
  VALUATION_PROJECTIONS,
  X402_GLOBAL_MESH_URL,
} from "@/lib/constants";

export const metadata = {
  title: "Revenue Engine — TROPTIONS",
  description:
    "TROPTIONS revenue streams with PROVEN, PIPELINE, and PROJECTION labels. Links to technical docs.",
};

const streamLabels: Record<string, "PROVEN" | "PIPELINE" | "PROJECTION"> = {
  live: "PROVEN",
  pipeline: "PIPELINE",
  gated: "PIPELINE",
  projection: "PROJECTION",
};

export default function RevenuePage() {
  return (
    <PageShell
      title="Revenue Engine"
      subtitle="Eighteen modeled streams across Academy, launcher, x402, SNP, sports, desk, and MSB rails. Live product URLs are PROVEN; fee tables and run-rate math are PROJECTION until booked in operator books."
      actions={
        <>
          <a
            href={TROPTIONS_REVENUE_ENGINE_URL}
            className="inline-flex items-center rounded border border-[var(--color-accent-gold)] px-4 py-2 text-sm font-medium text-[var(--color-gold-light)] transition hover:bg-[color-mix(in_srgb,var(--color-accent-gold)_12%,transparent)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Full engine doc
          </a>
          <TelegramDeepLink label="/revenue in Telegram" />
        </>
      }
    >
      <div className="panel mb-8 border-l-2 border-l-[var(--color-accent-gold)] p-5 text-sm text-[var(--color-muted)]">
        <strong className="text-[var(--color-text)]">PROJECTION disclaimer:</strong>{" "}
        Figures such as $825/hour or $874K/month in operator scripts are modeled API
        math — not verified bank deposits. Telegram{" "}
        <code className="font-mono text-xs">/revenue</code> returns JSON stubs labeled
        PROJECTION.
      </div>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Opportunity matrix
        </h2>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Status</th>
                <th>Revenue model</th>
                <th>TAM / note</th>
                <th>Client</th>
              </tr>
            </thead>
            <tbody>
              {REVENUE_OPPORTUNITIES.map((row) => (
                <tr key={row.opportunity}>
                  <td className="font-medium text-[var(--color-text)]">
                    {row.opportunity}
                  </td>
                  <td>
                    <TruthChip label={streamLabels[row.status]} />
                  </td>
                  <td className="text-[var(--color-muted)]">{row.revenueModel}</td>
                  <td className="text-[var(--color-muted)]">{row.tamNote}</td>
                  <td className="text-[var(--color-muted)]">{row.clientType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Valuation scenarios (PROJECTION)
        </h2>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Band</th>
                <th>Assumptions</th>
              </tr>
            </thead>
            <tbody>
              {VALUATION_PROJECTIONS.map((v) => (
                <tr key={v.scenario}>
                  <td className="font-medium text-[var(--color-text)]">{v.scenario}</td>
                  <td className="tabular-nums text-[var(--color-accent-gold)]">
                    {v.band}
                  </td>
                  <td className="text-[var(--color-muted)]">{v.assumptions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Partner-enabled streams
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Omnibus, SWIFT B2B, and BaaS white-label fees unlock after institutional partner rails
          are live — see investor SWIFT page and partner bank mesh doc.
        </p>
        <a
          href={SWIFT_PAGE_URL}
          className="panel mt-4 inline-block p-4 text-sm text-[var(--color-accent-gold)] hover:underline"
        >
          Institutional fiat rails (SWIFT · FedWire · :4022–:4024) →
        </a>
      </section>

      <section>
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Technical documentation
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: "TROPTIONS Revenue Engine (A–F streams)", href: TROPTIONS_REVENUE_ENGINE_URL },
            { title: "x402 Global Mesh", href: X402_GLOBAL_MESH_URL },
            { title: "AWS Activation Runbook", href: AWS_ACTIVATION_RUNBOOK_URL },
            { title: "System Manifest", href: SYSTEM_MANIFEST_URL },
            { title: "MSB Fiat Rails", href: MSB_FIAT_RAILS_URL },
            { title: "Partner bank mesh", href: PARTNER_BANK_MESH_URL },
            { title: "Institutional rails (investor)", href: SWIFT_PAGE_URL },
            { title: "Command Center", href: COMMAND_CENTER_URL },
            { title: "What you can do NOW", href: OVERVIEW_URL },
            { title: "Institutional rails (SWIFT)", href: SWIFT_PAGE_URL },
            { title: "Telegram /revenue command", href: TELEGRAM_PAGE_URL },
          ].map((doc) => (
            <li key={doc.href}>
              <a
                href={doc.href}
                className="panel block p-4 text-sm text-[var(--color-accent-blue)] hover:underline"
                {...(doc.href.startsWith("http") && doc.href.includes("/technical/")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {doc.title} →
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
