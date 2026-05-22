import { PageShell } from "@/components/terminal/PageShell";
import { TruthChip } from "@/components/terminal/TruthChip";
import { TelegramDeepLink } from "@/components/TelegramDeepLink";
import { assetPath } from "@/lib/base-path";
import { COMMAND_CENTER_URL, OVERVIEW_URL, REPO_URL } from "@/lib/constants";
import {
  TELEGRAM_BOT_URL,
  TELEGRAM_BOT_USERNAME,
  TELEGRAM_COMMANDS,
  TELEGRAM_CONNECT_CHECKLIST,
  TELEGRAM_ENV_VARS,
  TELEGRAM_REPO_PATH,
} from "@/lib/telegram";

export const metadata = {
  title: "Telegram — NeedAI Ada Operator Bot",
  description:
    "Connect NeedAI Ada (@NeedAI_Ada_bot): BotFather, env vars, commands, honest PIPELINE labels.",
};

export default function TelegramPage() {
  return (
    <PageShell
      title="Telegram — NeedAI Ada"
      subtitle={`Primary bot @${TELEGRAM_BOT_USERNAME} — mobile command surface for baas-api, agent orchestrator, and USDC relay stubs. Revenue replies are PROJECTION — not realized bank revenue.`}
      actions={
        <>
          <TelegramDeepLink label="Open Telegram" />
          <a
            href={COMMAND_CENTER_URL}
            className="inline-flex items-center rounded border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text)] transition hover:border-[var(--color-accent-gold)]"
          >
            Command Center
          </a>
          <a
            href={OVERVIEW_URL}
            className="inline-flex items-center rounded border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text)] transition hover:border-[var(--color-accent-blue)]"
          >
            Overview
          </a>
        </>
      }
    >
      <div className="panel mb-8 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-accent-gold)]">
          Connect tonight — checklist
        </h2>
        <ul className="mt-4 space-y-3">
          {TELEGRAM_CONNECT_CHECKLIST.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm text-[var(--color-muted)]">
              <span className="checklist-marker mt-0.5" aria-hidden>
                ○
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          Status: <strong className="text-[var(--color-text)]">PIPELINE</strong> until{" "}
          <code className="code-inline">TELEGRAM_BOT_TOKEN</code>{" "}
          is on the host and pm2 shows telegram-bot online.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          BotFather setup
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--color-muted)]">
          <li>
            Open{" "}
            <a
              href="https://t.me/BotFather"
              className="text-[var(--color-accent-blue)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @BotFather
            </a>{" "}
            in Telegram.
          </li>
          <li>
            Use existing bot{" "}
            <a
              href={TELEGRAM_BOT_URL}
              className="text-[var(--color-accent-blue)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{TELEGRAM_BOT_USERNAME}
            </a>{" "}
            (NeedAI Ada) or <code className="code-inline">/newbot</code> for a new bot.
          </li>
          <li>
            Copy the token into host{" "}
            <code className="font-mono text-[var(--color-text)]">.env</code> as{" "}
            <code className="font-mono text-[var(--color-accent-gold)]">
              TELEGRAM_BOT_TOKEN
            </code>{" "}
            — never commit to git.
          </li>
          <li>
            Optional: set{" "}
            <code className="font-mono text-[var(--color-text)]">
              NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
            </code>{" "}
            when building this site for the Open Telegram button.
          </li>
          <li>
            Start stack: see{" "}
            <a href={COMMAND_CENTER_URL} className="text-[var(--color-accent-blue)] hover:underline">
              Command Center
            </a>{" "}
            activation steps.
          </li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Environment variables
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Templates:{" "}
          <a
            href={`${REPO_URL}/blob/main/config/multi-gateway.env.template`}
            className="text-[var(--color-accent-blue)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            config/multi-gateway.env.template
          </a>
          ,{" "}
          <a
            href={`${REPO_URL}/blob/main/services/telegram-bot/.env.template`}
            className="text-[var(--color-accent-blue)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            services/telegram-bot/.env.template
          </a>
        </p>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Required</th>
                <th>Where</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {TELEGRAM_ENV_VARS.map((v) => (
                <tr key={v.name}>
                  <td className="font-mono text-xs text-[var(--color-accent-gold)]">
                    {v.name}
                  </td>
                  <td>{v.required ? "Yes" : "No"}</td>
                  <td className="text-[var(--color-muted)]">{v.where}</td>
                  <td className="text-[var(--color-muted)]">{v.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          <code className="font-mono">TELEGRAM_BOT_TOKEN</code> is documented on this page
          only for operator setup. It must not appear in the repository or GitHub Pages
          build output.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="serif-heading text-xl font-semibold text-[var(--color-text)]">
          Commands
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Implementation:{" "}
          <a
            href={TELEGRAM_REPO_PATH}
            className="text-[var(--color-accent-blue)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            services/telegram-bot/bot.js
          </a>{" "}
          (port 8443)
        </p>
        <div className="panel mt-4 overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Command</th>
                <th>Action</th>
                <th>Label</th>
                <th>Upstream</th>
              </tr>
            </thead>
            <tbody>
              {TELEGRAM_COMMANDS.map((c) => (
                <tr key={c.command}>
                  <td className="font-mono text-sm text-[var(--color-text)]">{c.command}</td>
                  <td className="text-[var(--color-muted)]">{c.action}</td>
                  <td>
                    <TruthChip label={c.label} />
                  </td>
                  <td className="font-mono text-xs text-[var(--color-muted)]">
                    {c.upstream ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel border-l-2 border-l-[var(--color-accent-blue)] p-5 text-sm text-[var(--color-muted)]">
        <strong className="text-[var(--color-text)]">Capability overview:</strong>{" "}
        <a href={OVERVIEW_URL} className="text-[var(--color-accent-blue)] hover:underline">
          What you can do NOW
        </a>{" "}
        lists PROVEN crypto steps vs PIPELINE fiat (partner MSB + BIC + nostro).
      </section>

      <section className="panel border-l-2 border-l-[var(--color-accent-blue)] p-5 text-sm text-[var(--color-muted)]">
        <strong className="text-[var(--color-text)]">Site ↔ Telegram:</strong> Command
        Center links here and to{" "}
        <TelegramDeepLink className="!inline-flex !px-2 !py-1 !text-xs" label="t.me bot" />.
        Deep link HTML:{" "}
        <a
          href={assetPath("/telegram-deep-link.html")}
          className="text-[var(--color-accent-blue)] hover:underline"
        >
          telegram-deep-link.html
        </a>{" "}
        (redirect when username is configured at deploy).
      </section>
    </PageShell>
  );
}
