import type { Metadata } from "next";
import AppShell from "@/components/exchange-os/AppShell";

export const metadata: Metadata = {
  title: "TROPTIONS Exchange OS",
  description:
    "Launch. Trade. Earn. Prove. XRPL trading, token launches, creator rewards, and x402 AI commerce in one operating system.",
  icons: {
    icon: [
      { url: "/assets/troptions/logos/troptions-tt-gold.jpg", type: "image/jpeg" },
    ],
    apple: [
      { url: "/assets/troptions/logos/troptions-tt-gold.jpg", type: "image/jpeg" },
    ],
    shortcut: "/assets/troptions/logos/troptions-tt-gold.jpg",
  },
};

export default function ExchangeOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
