import type { ReactNode } from "react";

export function OpenClawLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className="openclaw-theme">
      <div className="openclaw-wrap">
        <header className="openclaw-header">
          <p className="openclaw-eyebrow">OpenClaw Agent Command Center</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
