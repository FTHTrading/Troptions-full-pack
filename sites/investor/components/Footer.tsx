import Link from "next/link";
import {
  DOCS_URL,
  PAGES_URL,
  REPO_URL,
} from "@/lib/constants";
import { ANTHEM_PAGE, homeHash, MORE_NAV } from "@/lib/navigation";

const onPages = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);
const archUrl = onPages
  ? `${PAGES_URL}/technical/ARCHITECTURE.html`
  : `${DOCS_URL}/ARCHITECTURE.md`;
const quickstartUrl = onPages
  ? `${PAGES_URL}/technical/QUICKSTART.html`
  : `${DOCS_URL}/QUICKSTART.md`;
const domainTruthUrl = onPages
  ? `${PAGES_URL}/technical/DOMAIN_TRUTH_TABLE.html`
  : `${DOCS_URL}/DOMAIN_TRUTH_TABLE.md`;
const technicalHubUrl = onPages
  ? `${PAGES_URL}/technical/index.html`
  : `${DOCS_URL}/`;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-white">TROPTIONS</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              FTH Trading — operating company and sovereign stack. Investor
              showcase is not legal or securities advice.
            </p>
          </div>
          <div className="text-sm text-[var(--color-muted)]">
            <p className="font-medium text-white">On this page</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-2">
              {MORE_NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-white"
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href={ANTHEM_PAGE.href} className="hover:text-white">
                  {ANTHEM_PAGE.label}
                </Link>
              </li>
              <li>
                <a href={homeHash("competitive")} className="hover:text-white">
                  Competitive
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm text-[var(--color-muted)]">
            <p className="font-medium text-white">Technical docs</p>
            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href={REPO_URL}
                  className="text-[var(--color-gold-light)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>
              </li>
              <li>
                <a
                  href={technicalHubUrl}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Technical index
                </a>
              </li>
              <li>
                <a
                  href={archUrl}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href={quickstartUrl}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quickstart
                </a>
              </li>
              <li>
                <a
                  href={domainTruthUrl}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Domain truth table
                </a>
              </li>
              <li>
                <Link href="/anthem/" className="hover:text-white">
                  Anthem lyrics
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted)]">
          © {year} FTH Trading. Proprietary anthem audio — internal brand use
          only.
        </p>
      </div>
    </footer>
  );
}
