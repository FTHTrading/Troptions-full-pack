import { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, title, subtitle, children, className = "" }: Props) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 border-t border-[var(--color-border)] py-16 md:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 md:mb-14">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 max-w-3xl text-base text-[var(--color-muted)] md:text-lg">
              {subtitle}
            </p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
