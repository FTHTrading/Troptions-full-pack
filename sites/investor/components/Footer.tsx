import Link from "next/link";
import {
  COMMAND_CENTER_URL,
  DAO_PAGE_URL,
  ECOSYSTEM_HUB_URL,
  OVERVIEW_URL,
  PAGES_URL,
  REPO_URL,
  REVENUE_PAGE_URL,
  SWIFT_PAGE_URL,
  TELEGRAM_PAGE_URL,
} from "@/lib/constants";
import {
  ANTHEM_PAGE,
  homeHash,
  MORE_NAV,
  TECHNICAL_FOOTER_LINKS,
} from "@/lib/navigation";

const onPages = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);
const technicalHub = onPages
  ? `${PAGES_URL}/technical/index.html`
  : `${REPO_URL}/tree/main/docs`;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-panel)] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="serif-heading text-lg font-semibold text-[var(--color-text)]">
              TROPTIONS
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              FTH Trading — operating company and sovereign stack. Investor
              showcase is not legal or securities advice.
            </p>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <Link href={COMMAND_CENTER_URL} className="text-[var(--color-accent-blue)] hover:underline">
                  Command Center
                </Link>
              </li>
              <li>
                <Link href={OVERVIEW_URL} className="text-[var(--color-accent-blue)] hover:underline">
                  Overview
                </Link>
              </li>
              <li>
                <Link href={SWIFT_PAGE_URL} className="text-[var(--color-accent-blue)] hover:underline">
                  Institutional rails
                </Link>
              </li>
              <li>
                <Link href={REVENUE_PAGE_URL} className="text-[var(--color-accent-blue)] hover:underline">
                  Revenue
                </Link>
              </li>
              <li>
                <Link href={TELEGRAM_PAGE_URL} className="text-[var(--color-accent-blue)] hover:underline">
                  Telegram
                </Link>
              </li>
              <li>
                <a
                  href={ECOSYSTEM_HUB_URL}
                  className="text-[var(--color-accent-blue)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ecosystem hub
                </a>
              </li>
              <li>
                <a
                  href={onPages ? DAO_PAGE_URL : "/dao/"}
                  className="text-[var(--color-accent-blue)] hover:underline"
                  {...(onPages ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  Sovereign DAO
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm text-[var(--color-muted)]">
            <p className="font-medium text-[var(--color-text)]">On this page</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              {MORE_NAV.map((item) => (
                <li key={item.href}>
                  {item.external || item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      className="hover:text-[var(--color-text)]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : item.href.includes("#") ? (
                    <a href={item.href} className="hover:text-[var(--color-text)]">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="hover:text-[var(--color-text)]">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link href={ANTHEM_PAGE.href} className="hover:text-[var(--color-text)]">
                  {ANTHEM_PAGE.label}
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-sm text-[var(--color-muted)] lg:col-span-2">
            <p className="font-medium text-[var(--color-text)]">Technical docs (GitHub Pages)</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
              <li>
                <a
                  href={REPO_URL}
                  className="text-[var(--color-accent-gold)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>
              </li>
              {TECHNICAL_FOOTER_LINKS.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <a
                    href={item.href}
                    className="hover:text-[var(--color-text)]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs">
              <a href={technicalHub} className="text-[var(--color-accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">
                Full technical index →
              </a>
            </p>
          </div>
        </div>
        <p className="mt-10 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted)]">
          © {year} FTH Trading. Proprietary anthem audio — internal brand use only.
        </p>
      </div>
    </footer>
  );
}
