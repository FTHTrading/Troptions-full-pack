import type { ReactNode } from "react";

export default function TroptionsSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">{children}</main>
    </div>
  );
}
