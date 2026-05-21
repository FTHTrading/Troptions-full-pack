import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TROPTIONS LIVE — XRPL Trading System",
  description:
    "Non-custodial TROPTIONS trading on the XRP Ledger. Set trust lines, buy and sell TROPTIONS, verify your wallet, and participate in the XRPL DEX.",
  metadataBase: new URL("https://troptionslive.unykorn.org"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "TROPTIONS LIVE — XRPL Trading System",
    description: "Non-custodial TROPTIONS trading on the XRP Ledger.",
    type: "website",
    url: "https://troptionslive.unykorn.org",
  },
};

export default function TroptionsLiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
