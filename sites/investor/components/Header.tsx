import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/base-path";

const nav = [
  { href: "#story", label: "Timeline" },
  { href: "#proof-wall", label: "Proof" },
  { href: "#infrastructure", label: "Infrastructure" },
  { href: "#sovereign-dao", label: "Sovereign DAO" },
  { href: "#opportunities", label: "Opportunities" },
  { href: "#valuation", label: "Valuation" },
  { href: "#competitive", label: "Competitive" },
  { href: "#economics", label: "Economics" },
  { href: "#skyrocket", label: "Playbook" },
  { href: "#downloads", label: "Downloads" },
  { href: "#verification", label: "Verification" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={assetPath("/logo.png")}
            alt="TROPTIONS"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-white sm:text-base">
            TROPTIONS
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--color-muted)] lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-[var(--color-gold-light)]"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/anthem/"
            className="transition hover:text-[var(--color-gold-light)]"
          >
            Lyrics
          </Link>
        </nav>
      </div>
    </header>
  );
}
