"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TTN_NAV_LINKS: { href: string; label: string; exact?: boolean }[] = [
  { href: "/ttn", label: "Home", exact: true },
  { href: "/ttn/channels", label: "Watch" },
  { href: "/ttn/creators", label: "Creators" },
  { href: "/ttn/news", label: "News" },
  { href: "/ttn/podcasts", label: "Podcasts" },
  { href: "/ttn/films", label: "Films" },
  { href: "/ttn/proof", label: "Proof" },
  { href: "/ttn/studio", label: "Studio" },
];

export function TtnNav() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#C9A84C]/20 bg-[#080C14]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        {/* Logo */}
        <Link href="/ttn" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-base font-bold">
            TTN
          </div>
          <span className="hidden text-xs font-semibold tracking-[0.3em] text-[#C9A84C] uppercase sm:block">
            Television Network
          </span>
        </Link>

        {/* Nav links */}
        <nav aria-label="TTN navigation" className="hidden items-center gap-5 text-xs md:flex">
          {TTN_NAV_LINKS.map(({ href, label, exact }) => (
            <Link
              key={href}
              href={href}
              className={[
                "tracking-[0.15em] uppercase transition-colors duration-150",
                isActive(href, exact)
                  ? "text-[#C9A84C] font-semibold"
                  : "text-gray-400 hover:text-white",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/ttn/admin/content-review"
            className="hidden rounded border border-[#C9A84C]/30 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors sm:block"
          >
            Admin
          </Link>
          <Link
            href="/troptions"
            className="text-[10px] tracking-[0.15em] uppercase text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Troptions
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex gap-4 overflow-x-auto px-5 pb-2 pt-0 text-[10px] uppercase tracking-[0.15em] md:hidden">
        {TTN_NAV_LINKS.map(({ href, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={[
              "shrink-0 transition-colors",
              isActive(href, exact) ? "text-[#C9A84C]" : "text-gray-500",
            ].join(" ")}
          >
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
}
