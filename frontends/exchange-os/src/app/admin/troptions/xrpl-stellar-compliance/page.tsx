import type { Metadata } from "next";
import { XrplStellarInstitutionalCompliancePanel } from "@/components/troptions/XrplStellarInstitutionalCompliancePanel";

export const metadata: Metadata = {
  title: "XRPL/Stellar Institutional Compliance | TROPTIONS Admin",
  description:
    "Institutional compliance readiness dashboard for XRPL and Stellar operations. " +
    "Simulation-only. Legal review required before production activation.",
  robots: { index: false, follow: false },
};

export default function XrplStellarComplianceAdminPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          XRPL/Stellar Institutional Compliance Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Compliance readiness monitoring for XRPL and Stellar institutional operations.
          ISO 20022 message compatibility readiness only. GENIUS Act readiness evaluation only.
          Jurisdiction-aware controls with legal review gates.
        </p>
      </div>

      <XrplStellarInstitutionalCompliancePanel />
    </main>
  );
}
