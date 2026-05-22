import { PageShell } from "@/components/terminal/PageShell";
import { TruthChip } from "@/components/terminal/TruthChip";
import {
  LIVE_NOW_LINKS,
  OPERATOR_ROUTES,
  OVERVIEW_HONESTY,
  OVERVIEW_TECH_DOCS,
  WHAT_YOU_CAN_DO_NOW,
} from "@/lib/overview";
import { PAGES_URL, SWIFT_PAGE_URL } from "@/lib/constants";

export const metadata = {
  title: "What You Can Do NOW — Operator Overview",
  description:
    "Capability matrix: PROVEN crypto and live URLs vs PIPELINE fiat and partner rails. Honest labels throughout.",
};

export default function OverviewPage() {
  return (
    <PageShell
      title="What you can do NOW"
      subtitle="Operator matrix — what is live in repo and on unykorn.org today vs what needs MSB, BIC, and nostro at an institutional partner."
      actions={
        <a
          href={SWIFT_PAGE_URL}
          className="inline-flex items-center rounded border border-[var(--color-accent-gold)] px-4 py-2 text-sm font-medium text-[var(--color-gold-light)] transition hover:bg-[color-mix(in_srgb,var(--color-accent-gold)_12%,transparent)]"
        >
          Institutional rails →
        </a>
      }
    >
      <div className="panel mb-8 border-l-2 border-l-[var(--color-accent-gold)] p-5 text-sm text-[var(--color-muted)]">
        <strong className="text-[var(--color-text)]">Honesty:</strong>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {OVERVIEW_HONESTY.map((h) => (
            <li key={h.slice(0, 50)}>{h}</li>
          ))}
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Capability matrix
        </h2>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Label</th>
                <th>How</th>
              </tr>
            </thead>
            <tbody>
              {WHAT_YOU_CAN_DO_NOW.map((row) => (
                <tr key={row.capability}>
                  <td className="font-medium text-[var(--color-text)]">{row.capability}</td>
                  <td>
                    <TruthChip label={row.label} />
                  </td>
                  <td className="text-[var(--color-muted)]">
                    {row.how}
                    {row.doc ? (
                      <>
                        {" "}
                        <a
                          href={row.doc}
                          className="text-[var(--color-accent-blue)] hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          doc →
                        </a>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Live surfaces (PROVEN URLs)
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {LIVE_NOW_LINKS.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                className="panel flex items-center justify-between gap-3 p-4 text-sm text-[var(--color-accent-blue)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <TruthChip label="PROVEN" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Site map — operator routes (GitHub Pages)
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Base: {PAGES_URL}
        </p>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Title</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {OPERATOR_ROUTES.map((row) => (
                <tr key={row.route}>
                  <td className="font-mono text-xs text-[var(--color-accent-gold)]">
                    <a
                      href={
                        row.route === "/"
                          ? `${PAGES_URL}/`
                          : `${PAGES_URL}${row.route.replace(/^\//, "")}`
                      }
                      className="hover:underline"
                    >
                      {row.route}
                    </a>
                  </td>
                  <td className="text-[var(--color-text)]">{row.title}</td>
                  <td>
                    <TruthChip label={row.label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Key technical docs
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {OVERVIEW_TECH_DOCS.map((doc) => (
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
        </ul>
      </section>
    </PageShell>
  );
}
