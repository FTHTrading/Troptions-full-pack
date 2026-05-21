// TROPTIONS Exchange OS — Sales Deck Page

import { SalesDeck } from "@/components/exchange-os/SalesDeck";
import Link from "next/link";

export const metadata = { title: "Sales Deck — TROPTIONS Exchange OS" };

export default function DeckPage() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", gap: "0.75rem" }}>
        <Link href="/exchange-os/signup" className="xos-btn xos-btn--primary">Get Started</Link>
        <Link href="/exchange-os" className="xos-btn xos-btn--ghost">← Back to Home</Link>
      </div>

      <SalesDeck />

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Link href="/exchange-os/signup" className="xos-btn xos-btn--primary xos-btn--lg">
          ◆ Launch. Trade. Earn. — Get Started Today
        </Link>
      </div>
    </div>
  );
}
