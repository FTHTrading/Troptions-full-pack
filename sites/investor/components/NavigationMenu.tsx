"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  getSiteNavigation,
  type NavEntry,
  type NavLink,
} from "@/lib/navigation";

function NavAnchor({
  href,
  label,
  external,
  onNavigate,
  className,
}: NavLink & { onNavigate?: () => void; className?: string }) {
  const cls =
    className ??
    "block rounded-md px-3 py-2 text-sm transition hover:bg-white/5 hover:text-[var(--color-gold-light)]";

  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onNavigate}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }

  if (href.includes("#") || href.endsWith(".html") || href.includes("/nft")) {
    return (
      <a href={href} className={cls} onClick={onNavigate}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} onClick={onNavigate}>
      {label}
    </Link>
  );
}

function DesktopDropdown({
  label,
  items,
}: {
  label: string;
  items: NavLink[];
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 text-xs text-[var(--color-muted)] transition hover:text-[var(--color-gold-light)]"
        aria-haspopup="true"
      >
        {label}
        <span className="text-[10px] opacity-70" aria-hidden>
          ▾
        </span>
      </button>
      <div className="pointer-events-none absolute left-0 top-full z-50 min-w-[11rem] pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-1 shadow-xl">
          {items.map((item) => (
            <NavAnchor
              key={item.href + item.label}
              {...item}
              className="block px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-white/5 hover:text-[var(--color-gold-light)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileGroup({
  entry,
  onNavigate,
}: {
  entry: Extract<NavEntry, { kind: "group" }>;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-border)]/60 last:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {entry.label}
        <span className="text-xs text-[var(--color-muted)]">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="space-y-0.5 px-2 pb-3">
          {entry.items.map((item) => (
            <NavAnchor
              key={item.href + item.label}
              {...item}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function NavigationMenu() {
  const nav = getSiteNavigation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <nav
        className="hidden items-center gap-2.5 text-xs text-[var(--color-muted)] md:flex"
        aria-label="Primary"
      >
        {nav.map((entry) =>
          entry.kind === "link" ? (
            <NavAnchor
              key={entry.label}
              href={entry.href}
              label={entry.label}
              external={entry.external}
              className="whitespace-nowrap transition hover:text-[var(--color-gold-light)]"
            />
          ) : (
            <DesktopDropdown
              key={entry.label}
              label={entry.label}
              items={entry.items}
            />
          ),
        )}
      </nav>

      <button
        type="button"
        className="rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-white md:hidden"
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav"
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? "Close" : "Menu"}
      </button>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full z-50 max-h-[min(70vh,32rem)] overflow-y-auto border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg md:hidden"
        >
          {nav.map((entry) =>
            entry.kind === "link" ? (
              <div
                key={entry.label}
                className="border-b border-[var(--color-border)]/60 px-2 py-1"
              >
                <NavAnchor
                  href={entry.href}
                  label={entry.label}
                  onNavigate={closeMobile}
                  className="block rounded-md px-3 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                />
              </div>
            ) : (
              <MobileGroup
                key={entry.label}
                entry={entry}
                onNavigate={closeMobile}
              />
            ),
          )}
        </div>
      )}
    </>
  );
}

export function HeaderBrand() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3">
      <Image
        src="/logo.png"
        alt="TROPTIONS"
        width={32}
        height={32}
        className="rounded-full"
        priority
      />
      <span className="text-xs font-semibold tracking-wide text-white sm:text-sm">
        TROPTIONS
      </span>
    </Link>
  );
}
