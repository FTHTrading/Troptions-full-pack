import Link from "next/link";
import { DOCS_URL, REPO_URL } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-white">TROPTIONS</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              FTH Trading — operating company and sovereign stack. Investor
              showcase is not legal or securities advice.
            </p>
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
                  href={`${DOCS_URL}/ARCHITECTURE.md`}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href={`${DOCS_URL}/QUICKSTART.md`}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quickstart
                </a>
              </li>
              <li>
                <a
                  href={`${DOCS_URL}/DOMAIN_TRUTH_TABLE.md`}
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
