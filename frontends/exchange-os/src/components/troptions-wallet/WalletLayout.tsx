"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEMBER_WALLET_ROUTES } from "@/content/troptions/walletRouteRegistry";
import "@/styles/troptions-wallet.css";

interface WalletLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function WalletLayout({ children, title, subtitle }: WalletLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="wallet-layout">
      <div className="wallet-header">
        {title && (
          <>
            <h1 className="wallet-title">{title}</h1>
            {subtitle && <p className="wallet-subtitle">{subtitle}</p>}
          </>
        )}
        <nav className="wallet-nav" aria-label="Wallet navigation">
          {MEMBER_WALLET_ROUTES.filter((route) => route.path.startsWith("/portal/troptions/wallet/")).map((route) => {
            const isActive = pathname === route.path;

            return (
              <Link
                key={route.path}
                href={route.path}
                className={`wallet-nav-link${isActive ? " is-active" : ""}`}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="wallet-content">{children}</div>
    </div>
  );
}
