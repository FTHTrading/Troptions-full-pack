import { PageShell } from "@/components/terminal/PageShell";
import { TruthChip } from "@/components/terminal/TruthChip";
import {
  BIC_CONNECTION_TYPES,
  CONTRACT_LOCKIN_CHECKLIST,
  FIAT_RAIL_PORTS,
  MSB_PARTNER_VALUE,
  PARTNER_MEETING_SCRIPT,
  PARTNER_VERIFICATION_TABLE,
  SWIFT_DISCLAIMERS,
  SWIFT_DILIGENCE_NOTE,
  SWIFT_IDENTIFIER_TABLE,
  SWIFT_TECH_DOCS,
} from "@/lib/swift";
import { OVERVIEW_URL, SWIFT_PAGE_URL } from "@/lib/constants";

export const metadata = {
  title: "Institutional Fiat Rails — SWIFT · FedWire",
  description:
    "BIC vs IBAN vs LEI vs MIC, connected BIC, MSB partner value, port map :4022–:4024. PIPELINE until bank wired.",
};

export default function SwiftPage() {
  return (
    <PageShell
      title="Institutional fiat rails"
      subtitle="SWIFT, FedWire, and payment-orchestrator topology for diligence. Bloomberg-style facts — no partner logos or legal names on this page."
      actions={
        <a
          href={OVERVIEW_URL}
          className="inline-flex items-center rounded border border-[var(--color-accent-blue)] px-4 py-2 text-sm text-[var(--color-accent-blue)] transition hover:bg-[color-mix(in_srgb,var(--color-accent-blue)_12%,transparent)]"
        >
          What you can do NOW →
        </a>
      }
    >
      {SWIFT_DISCLAIMERS.map((line) => (
        <div
          key={line.slice(0, 40)}
          className="panel mb-4 border-l-2 border-l-[var(--color-accent-gold)] p-4 text-sm text-[var(--color-muted)]"
        >
          {line}
        </div>
      ))}

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Partner verification (diligence)
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Answer these with the bank&apos;s treasury and compliance teams — not from
          marketing materials alone.
        </p>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>TROPTIONS today</th>
                <th>Partner must confirm</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {PARTNER_VERIFICATION_TABLE.map((row) => (
                <tr key={row.question}>
                  <td className="font-medium text-[var(--color-text)]">{row.question}</td>
                  <td className="text-[var(--color-muted)]">{row.troptionsToday}</td>
                  <td className="text-[var(--color-muted)]">{row.partnerMustConfirm}</td>
                  <td>
                    <TruthChip label={row.label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Contract lock-in checklist
        </h2>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Owner</th>
                <th>Note</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACT_LOCKIN_CHECKLIST.map((row) => (
                <tr key={row.item}>
                  <td className="font-medium text-[var(--color-text)]">{row.item}</td>
                  <td className="text-[var(--color-muted)]">{row.owner}</td>
                  <td className="text-[var(--color-muted)]">{row.note}</td>
                  <td>
                    <TruthChip label={row.label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Identifier reference
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Standard institutional codes used when wrapping ledger IOUs into bank messages.
        </p>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Role</th>
                <th>Example</th>
                <th>TROPTIONS use</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {SWIFT_IDENTIFIER_TABLE.map((row) => (
                <tr key={row.code}>
                  <td className="font-mono text-[var(--color-accent-gold)]">{row.code}</td>
                  <td className="font-medium text-[var(--color-text)]">{row.fullName}</td>
                  <td className="text-[var(--color-muted)]">{row.role}</td>
                  <td className="font-mono text-xs text-[var(--color-muted)]">{row.example}</td>
                  <td className="text-[var(--color-muted)]">{row.troptionsUse}</td>
                  <td>
                    <TruthChip label={row.label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Connected vs non-connected BIC
        </h2>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Definition</th>
                <th>Settlement path</th>
                <th>Note</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {BIC_CONNECTION_TYPES.map((row) => (
                <tr key={row.type}>
                  <td className="font-medium text-[var(--color-text)]">{row.type}</td>
                  <td className="text-[var(--color-muted)]">{row.definition}</td>
                  <td className="text-[var(--color-muted)]">{row.settlement}</td>
                  <td className="text-[var(--color-muted)]">{row.note}</td>
                  <td>
                    <TruthChip label={row.label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          MSB + institutional partner value
        </h2>
        <div className="panel mt-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-[var(--color-text)]">
              {MSB_PARTNER_VALUE.headline}
            </span>
            <TruthChip label={MSB_PARTNER_VALUE.label} />
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--color-muted)]">
            {MSB_PARTNER_VALUE.bullets.map((b) => (
              <li key={b.slice(0, 48)}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Rail ports — PIPELINE until bank wired
        </h2>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Rail</th>
                <th>Port</th>
                <th>Service</th>
                <th>Path</th>
                <th>Live when</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {FIAT_RAIL_PORTS.map((row) => (
                <tr key={row.port + row.service}>
                  <td className="font-medium text-[var(--color-text)]">{row.rail}</td>
                  <td className="tabular-nums text-[var(--color-accent-gold)]">{row.port}</td>
                  <td className="font-mono text-xs">{row.service}</td>
                  <td className="font-mono text-xs text-[var(--color-muted)]">{row.path}</td>
                  <td className="text-[var(--color-muted)]">{row.untilLive}</td>
                  <td>
                    <TruthChip label={row.label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Canonical sequence: FedWire :4023 and SWIFT :4024 are adapters into payment-orchestrator{" "}
          <strong className="text-[var(--color-text)]">:4022</strong>.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Partner meeting script (condensed)
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-[var(--color-muted)]">
          {PARTNER_MEETING_SCRIPT.map((step) => (
            <li key={step.slice(0, 40)}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mb-12 panel border-l-2 border-l-[var(--color-accent-blue)] p-5 text-sm text-[var(--color-muted)]">
        <strong className="text-[var(--color-text)]">Diligence:</strong> {SWIFT_DILIGENCE_NOTE}
      </section>

      <section>
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Technical documentation
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {SWIFT_TECH_DOCS.map((doc) => (
            <li key={doc.href}>
              <a
                href={doc.href}
                className="panel block p-4 text-sm text-[var(--color-accent-blue)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.title} →
              </a>
            </li>
          ))}
          <li>
            <a
              href={SWIFT_PAGE_URL}
              className="panel block p-4 text-sm text-[var(--color-muted)]"
            >
              This page URL (share in diligence)
            </a>
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
