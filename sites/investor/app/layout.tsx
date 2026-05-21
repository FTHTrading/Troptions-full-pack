import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TROPTIONS — 22 Years. Sovereign by Default.",
  description:
    "Investor-facing showcase: operating company, sovereign stack, honest domain truth, and proof labels. FTH Trading / Troptions-full-pack.",
  openGraph: {
    title: "TROPTIONS — 22 Years. 9.0/10 Maturity.",
    description: "Sovereign infrastructure with honest live, pipeline, and gated labels.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
