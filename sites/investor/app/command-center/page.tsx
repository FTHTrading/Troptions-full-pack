import { PageShell } from "@/components/terminal/PageShell";
import { TruthChip } from "@/components/terminal/TruthChip";
import { TelegramDeepLink } from "@/components/TelegramDeepLink";
import {
  COMMAND_ACTIVATION,
  COMMAND_DOC_LINKS,
  COMMAND_EXTERNAL,
  COMMAND_SERVICES,
} from "@/lib/command-center";
import {
  REVENUE_PAGE_URL,
  TELEGRAM_PAGE_URL,
} from "@/lib/constants";

export const metadata = {
  title: "Command Center — TROPTIONS",
  description:
    "Operator hub: services, ports, health URLs, activation scripts. PROVEN / PIPELINE / PROJECTION labels.",
};

export default function CommandCenterPage() {
  return (
    <PageShell
      title="Command Center"
      subtitle="Single hub for ports, health checks, activation scripts, and cross-links. Revenue and Telegram replies are labeled PIPELINE or PROJECTION until MSB and bank rails are live."
      actions={
        <>
          <TelegramDeepLink />
          <a
            href={TELEGRAM_PAGE_URL}
            className="inline-flex items-center rounded border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text)] transition hover:border-[var(--color-accent-gold)]"
          >
            Telegram setup
          </a>
        </>
      }
    >
      <div className="panel mb-8 border-l-2 border-l-[var(--color-accent-gold)] p-5 text-sm text-[var(--color-muted)]">
        <strong className="text-[var(--color-text)]">Honesty:</strong>{" "}
        PROVEN = code or ledger verified in repo/docs. PIPELINE = configured but
        stubs or operator-dependent. PROJECTION = modeled dollars, not bank
        deposits. Do not cite PROJECTION as realized revenue.
      </div>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Live surfaces
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {COMMAND_EXTERNAL.map((row) => (
            <li key={row.url} className="panel flex items-center justify-between gap-3 p-4">
              <a
                href={row.url}
                className="text-sm text-[var(--color-accent-blue)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {row.label}
              </a>
              <TruthChip label={row.status} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Service map (PM2 / AWS)
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Canonical ports from ecosystem.config.js and AWS runbook. BaaS API is{" "}
          <strong className="text-[var(--color-text)]">:8097</strong>, not dashboard{" "}
          <strong className="text-[var(--color-text)]">:4029</strong>.
        </p>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Port</th>
                <th>Path</th>
                <th>Status</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {COMMAND_SERVICES.map((s) => (
                <tr key={s.name}>
                  <td className="font-medium text-[var(--color-text)]">{s.name}</td>
                  <td className="tabular-nums text-[var(--color-accent-gold)]">{s.port}</td>
                  <td className="font-mono text-xs text-[var(--color-muted)]">{s.path}</td>
                  <td>
                    <TruthChip label={s.label} />
                  </td>
                  <td className="text-[var(--color-muted)]">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Activation (operator)
        </h2>
        <ol className="mt-4 space-y-4">
          {COMMAND_ACTIVATION.map((step, i) => (
            <li key={step.step} className="panel p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs tabular-nums text-[var(--color-muted)]">
                  {i + 1}.
                </span>
                <span className="font-medium text-[var(--color-text)]">{step.step}</span>
                <TruthChip label={step.label} />
              </div>
              <pre className="terminal-pre mt-3">{step.cmd}</pre>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Documentation
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {COMMAND_DOC_LINKS.map((doc) => (
            <li key={doc.href}>
              <a
                href={doc.href}
                className="panel block p-4 text-sm text-[var(--color-accent-blue)] hover:underline"
                {...(doc.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {doc.title} →
              </a>
            </li>
          ))}
          <li>
            <a
              href={REVENUE_PAGE_URL}
              className="panel block p-4 text-sm text-[var(--color-accent-gold)] hover:underline"
            >
              Revenue engine summary →
            </a>
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
