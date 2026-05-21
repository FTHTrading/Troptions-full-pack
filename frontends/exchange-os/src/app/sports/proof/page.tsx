import type { Metadata } from "next";
import Link from "next/link";
import { ProofMetricCard } from "@/components/sports/ProofMetricCard";

export const metadata: Metadata = {
  title: "TROPTIONS Proof — Public Dashboard",
  description:
    "Verified engagement data for the TROPTIONS Sports Network. Merchants, offers, QR scans, Moments claimed, and community impact — publicly reported.",
};

const METRICS: Array<{
  label: string;
  value: string;
  sub: string;
  status: "live" | "demo" | "pending";
}> = [
  { label: "Merchants Onboarded", value: "49", sub: "Atlanta Matchday Network", status: "live" },
  { label: "Active Offers", value: "—", sub: "Merchant offers live today", status: "pending" },
  { label: "QR Scans", value: "—", sub: "Total verified scans", status: "pending" },
  { label: "Offer Redemptions", value: "—", sub: "Fan-redeemed matchday offers", status: "pending" },
  { label: "Moments Claimed", value: "0", sub: "Collectible badges distributed", status: "live" },
  { label: "Charity Impact", value: "$0", sub: "Sponsor-funded pledge total", status: "live" },
  { label: "Partner Venues", value: "49", sub: "Listed in fan guide", status: "live" },
  { label: "Sponsor Campaigns", value: "—", sub: "Active sponsor activations", status: "pending" },
];

const PROOF_SOURCES = [
  { name: "Merchant registry", status: "Live", note: "merchants.json — 49 records from call list" },
  { name: "Offer registry", status: "Pending", note: "offers.json — populated on merchant activation" },
  { name: "QR scan log", status: "Pending", note: "On-chain after Apostle Chain integration" },
  { name: "Moments claim log", status: "Live", note: "moment_claims.json — zero claims yet" },
  { name: "Charity pledge log", status: "Pending", note: "Populated on first sponsor campaign" },
  { name: "Mint receipts", status: "Live", note: "mint_receipts.json — Solana mints recorded" },
];

export default function ProofPage() {
  return (
    <div className="min-h-screen bg-[#071426]">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center bg-[#050f1e] border-b border-white/5">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c99a3c] to-transparent" />
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-5">
            TROPTIONS Proof
          </p>
          <h1 className="text-5xl font-bold text-white mb-5">Verified. Public. Reported.</h1>
          <p className="text-[#8a94a6] text-lg max-w-2xl mx-auto leading-relaxed">
            TROPTIONS publishes engagement data across the Sports Network — merchants, offers, QR scans, Moments claimed, charity impact. Sponsors see real numbers, not logo placements.
          </p>
        </div>
      </section>

      {/* Metrics grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
          Network Metrics
        </p>
        <h2 className="text-3xl font-bold text-white mb-10">Live + Pending Data</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICS.map((m) => (
            <ProofMetricCard key={m.label} {...m} />
          ))}
        </div>
        <p className="text-[#8a94a6] text-xs mt-6">
          Status labels: <span className="text-green-400">Live</span> = confirmed data. <span className="text-[#c99a3c]">Demo</span> = seed data. <span className="text-[#8a94a6]">Pending</span> = activates on campaign launch.
        </p>
      </section>

      {/* Data sources */}
      <section className="bg-[#050f1e] border-t border-white/5 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
            Proof Sources
          </p>
          <h2 className="text-3xl font-bold text-white mb-10">Where the data comes from.</h2>
          <div className="space-y-3">
            {PROOF_SOURCES.map((s) => (
              <div
                key={s.name}
                className="grid grid-cols-[200px_80px_1fr] gap-6 border border-white/5 bg-[#0b1f36] px-6 py-4 items-center"
              >
                <p className="text-white font-medium text-sm">{s.name}</p>
                <span
                  className={`text-xs font-semibold uppercase ${
                    s.status === "Live"
                      ? "text-green-400"
                      : s.status === "Demo"
                      ? "text-[#c99a3c]"
                      : "text-[#8a94a6]"
                  }`}
                >
                  {s.status}
                </span>
                <p className="text-[#8a94a6] text-xs">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor proof pitch */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="border border-[#c99a3c]/20 bg-[#0b1f36] p-10 text-center">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
            For Sponsors
          </p>
          <h2 className="text-3xl font-bold text-white mb-5">
            Your campaign in numbers, not stories.
          </h2>
          <p className="text-[#8a94a6] max-w-xl mx-auto mb-8 leading-relaxed">
            Every TROPTIONS sponsor campaign generates a proof report: QR scans, fan claims, offer redemptions, charity pledges, TROPTIONS TV mentions, and local reach estimates. Delivered post-campaign.
          </p>
          <Link
            href="/sports/partners"
            className="inline-block px-8 py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
          >
            Sponsor the Network
          </Link>
        </div>
      </section>
    </div>
  );
}
