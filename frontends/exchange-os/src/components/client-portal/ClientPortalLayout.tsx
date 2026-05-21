import Link from "next/link";
import type { ReactNode } from "react";
import { ComplianceNotice } from "@/components/client-portal/ComplianceNotice";
import { CLIENT_PORTAL_ROUTES } from "@/content/troptions/clientPortalRegistry";

type ClientPortalLayoutProps = {
  title: string;
  intro: string;
  children: ReactNode;
};

export function ClientPortalLayout({ title, intro, children }: ClientPortalLayoutProps) {
  return (
    <main className="cp-theme">
      <div className="cp-wrap">
        <header className="cp-header">
          <h1>{title}</h1>
          <p>{intro}</p>
          <nav className="cp-nav" aria-label="Client portal sections">
            {CLIENT_PORTAL_ROUTES.slice(0, 12).map((item) => (
              <Link key={item.route} href={item.route}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <section className="cp-grid">{children}</section>
        <ComplianceNotice />
      </div>
    </main>
  );
}
