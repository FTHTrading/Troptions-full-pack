"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TROPTIONS_SITE_LINKS = [
  { href: "/troptions", label: "Home" },
  { href: "/troptions#solutions", label: "Solutions" },
  { href: "/troptions/xrpl-platform", label: "Platform" },
  { href: "/troptions/xrpl-platform/links", label: "Resources" },
  { href: "/troptions/wallets", label: "Wallets" },
  { href: "/troptions/legacy", label: "Legacy" },
  { href: "/troptions/then-now", label: "Then vs Now" },
  { href: "/troptions/ecosystem", label: "Ecosystem" },
  { href: "/troptions/future", label: "Future" },
  { href: "/troptions/diligence/source-map", label: "Source Map" },
] as const;

export function TroptionsSiteNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-[var(--line)] bg-[var(--navy)]/95 backdrop-blur supports-[backdrop-filter]:sticky supports-[backdrop-filter]:top-0 supports-[backdrop-filter]:z-30">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/troptions" className="flex items-center gap-2">
          <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-[var(--line)] bg-black">
            <Image
              src="/assets/troptions/logos/troptions-tt-black.jpg"
              alt="TROPTIONS logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </span>
          <span className="text-sm font-semibold tracking-[0.25em] text-[var(--gold-light)]">TROPTIONS</span>
        </Link>

        <nav aria-label="Troptions site navigation" className="hidden items-center gap-7 text-sm text-slate-200 md:flex">
          {TROPTIONS_SITE_LINKS.map((link) => {
            const isActive = link.href === "/troptions"
              ? pathname === "/troptions"
              : link.href.startsWith(pathname) || pathname.startsWith(link.href.replace(/#.*$/, ""));

            return (
              <Link key={link.href} href={link.href} className={isActive ? "text-white" : "hover:text-white"}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/portal/troptions/onboarding"
          className="hidden rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--gold-light)] md:inline-flex"
        >
          Request Access
        </Link>

        <details className="relative md:hidden">
          <summary className="cursor-pointer rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold text-[var(--gold-light)] list-none">Menu</summary>
          <div className="absolute right-0 mt-2 grid min-w-48 gap-2 rounded-xl border border-[var(--line)] bg-[var(--navy-2)] p-3 text-sm text-slate-100 shadow-2xl">
            {TROPTIONS_SITE_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/portal/troptions/onboarding" className="mt-1 rounded-md bg-[var(--gold)] px-3 py-2 text-center font-semibold text-[var(--ink)]">
              Request Access
            </Link>
          </div>
        </details>
      </div>
    </div>
  );
}
