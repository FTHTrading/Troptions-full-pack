import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.TROPTIONS_BASE_URL || "https://troptions.unykorn.org";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TROPTIONS / UNYKORN — Institutional Trade Currency Infrastructure",
    template: "%s | TROPTIONS",
  },
  description:
    "TROPTIONS is institutional trade currency infrastructure for real economy commerce, RWA tokenization, compliant token launch, and Exchange OS.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "TROPTIONS", "UNYKORN", "trade currency", "institutional exchange", "RWA",
    "Exchange OS", "token launch", "Solana DEX", "XRPL", "non-custodial",
  ],
  openGraph: {
    type: "website",
    siteName: "TROPTIONS / UNYKORN",
    title: "TROPTIONS — Institutional Trade Currency Infrastructure",
    description: "Institutional infrastructure for trade currency, RWA, and compliant token launch.",
    images: [{ url: "/assets/troptions/logos/troptions-tt-gold.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TROPTIONS / UNYKORN",
    description: "Institutional trade currency infrastructure.",
    images: ["/assets/troptions/logos/troptions-tt-gold.jpg"],
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
