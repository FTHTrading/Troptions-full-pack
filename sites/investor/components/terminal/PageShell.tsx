import Link from "next/link";
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function PageShell({ title, subtitle, children, actions }: Props) {
  return (
    <>
      <Header />
      <main className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
          <Link
            href="/"
            className="text-xs uppercase tracking-wide text-[var(--color-accent-blue)] hover:underline"
          >
            ← Investor home
          </Link>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent-gold)]">
                TROPTIONS · Operator
              </p>
              <h1 className="serif-heading mt-2 text-3xl font-semibold text-[var(--color-text)] md:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-base text-[var(--color-muted)]">
                {subtitle}
              </p>
            </div>
            {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
