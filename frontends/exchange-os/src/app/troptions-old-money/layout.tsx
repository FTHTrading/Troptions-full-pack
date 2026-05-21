import type { ReactNode } from "react";
import { OLD_MONEY_NAV } from "@/content/troptions-old-money/pages";
import { OldMoneyNav } from "@/components/troptions-old-money/OldMoneyNav";
import "@/styles/troptions-old-money.css";
import "@/styles/troptions-media.css";

export default function TroptionsOldMoneyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="om-theme">
      <div className="om-backdrop" />
      <div className="om-wrap">
        <OldMoneyNav links={OLD_MONEY_NAV} />
        {children}
      </div>
    </div>
  );
}
