import { Section } from "./Section";
import {
  DAO_ARCHITECTURE_URL,
  DAO_PAGE_URL,
  ECOSYSTEM_MAP_URL,
  SNP_URL,
  X402_HEALTH,
} from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";

const WHY_POINTS = [
  {
    title: "Brand domains without capturable contracts",
    body: "Eight genesis issuers govern Exchange OS, Academy, TTN, and platform domains — policy is not held in an upgradeable EVM proxy alone.",
  },
  {
    title: "Soulbound voting weight",
    body: "Non-transferable credentials determine quorum — identity-backed governance, not wallet plutocracy by default.",
  },
  {
    title: "Treasury on L1",
    body: "Canonical balances and disbursement RPCs live in the Rust sequencer; SQLite in dao-service is an audit mirror only.",
  },
  {
    title: "Signed proposals & votes",
    body: "dao_submit_proposal, dao_cast_vote, dao_execute require Ed25519 — integration-tested audit trail.",
  },
];

export function SovereignDaoSection() {
  return (
    <Section
      id="sovereign-dao"
      title="Sovereign DAO"
      subtitle="L1-native governance for genesis brand domains — complements SNP (identity) and x402 (commerce) as the third pillar of the operator stack."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status="live" />
        <span className="text-sm text-[var(--color-muted)]">
          Stack LIVE on operator host (PM2) · public narrative on GitHub Pages
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {WHY_POINTS.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
          >
            <h3 className="font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{item.body}</p>
          </article>
        ))}
      </div>

      <article className="mt-4 rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-surface-elevated)] p-5">
        <h3 className="font-semibold text-[var(--color-gold-light)]">
          Full triad (this monorepo)
        </h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          <a
            href={SNP_URL}
            className="text-[var(--color-gold-light)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            SNP
          </a>{" "}
          post-quantum identity ·{" "}
          <a
            href={X402_HEALTH}
            className="text-[var(--color-gold-light)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            x402
          </a>{" "}
          agent commerce · Sovereign DAO governance on L1 :9944 with dao-service :8093.
          EVM Governor stubs are Phase 2 — L1 is source of truth.
        </p>
      </article>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <a
          href={DAO_PAGE_URL}
          className="font-medium text-[var(--color-gold-light)] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sovereign DAO public page →
        </a>
        <a
          href={DAO_ARCHITECTURE_URL}
          className="text-[var(--color-gold-light)] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Technical architecture →
        </a>
        <a
          href={ECOSYSTEM_MAP_URL}
          className="text-[var(--color-muted)] hover:text-white hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ecosystem map →
        </a>
      </div>

      <p className="mt-4 text-xs text-[var(--color-muted)]">
        Interactive dashboard: run locally at http://127.0.0.1:8093 after bootstrap-dao.ps1.
        dao.troptions.org DNS is pipeline — use Pages /dao/ until TLS cutover.
      </p>
    </Section>
  );
}
