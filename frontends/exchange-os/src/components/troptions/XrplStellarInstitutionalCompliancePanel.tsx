"use client";

import React from "react";

interface ComplianceControl {
  id: string;
  displayName: string;
  appliesTo: string;
  currentStatus: string;
  executionMode: string;
  liveExecutionAllowed: false;
  productionActivationStatus: string;
  legalReviewRequired: true;
}

interface ComplianceSnapshot {
  totalControls: number;
  blockedControls: number;
  jurisdictions: number;
  liveExecutionAllowed: false;
  snapshotAt: string;
}

interface ClaimReviewResult {
  isAllowed: boolean;
  prohibitedPhrases: string[];
  correctionSuggestion: string;
  taskId?: string;
  auditRecordId?: string;
}

export function XrplStellarInstitutionalCompliancePanel() {
  const [controls, setControls] = React.useState<ComplianceControl[]>([]);
  const [snapshot, setSnapshot] = React.useState<ComplianceSnapshot | null>(null);
  const [claimText, setClaimText] = React.useState("");
  const [claimResult, setClaimResult] = React.useState<ClaimReviewResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      const [controlsRes, snapshotRes] = await Promise.all([
        fetch("/api/troptions/xrpl-stellar-compliance/controls"),
        fetch("/api/troptions/xrpl-stellar-compliance/snapshot"),
      ]);

      if (controlsRes.ok) {
        const data = await controlsRes.json() as { controls: ComplianceControl[] };
        setControls(data.controls);
      }

      if (snapshotRes.ok) {
        const data = await snapshotRes.json() as { snapshot: ComplianceSnapshot };
        setSnapshot(data.snapshot);
      }
    } catch (err) {
      setError("Failed to load compliance data.");
      console.error(err);
    }
  }

  async function handleClaimReview(e: React.FormEvent) {
    e.preventDefault();
    if (!claimText.trim()) return;

    setLoading(true);
    setClaimResult(null);
    setError(null);

    try {
      const res = await fetch("/api/troptions/xrpl-stellar-compliance/claim-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimText }),
      });

      const data = await res.json() as ClaimReviewResult;
      setClaimResult(data);
    } catch (err) {
      setError("Claim review failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const statusColor = (status: string) => {
    if (status === "blocked") return "text-red-600";
    if (status === "pending_legal_review" || status === "pending_evidence") return "text-yellow-600";
    if (status === "in_progress") return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
        <p className="text-sm font-semibold text-yellow-800">Institutional Compliance — Simulation Only</p>
        <p className="text-xs text-yellow-700 mt-1">
          All controls are in simulation-only or read-only mode. Live execution is disabled.
          Legal review is required before production activation.
          This panel does not execute transactions or accept private keys.
        </p>
      </div>

      {/* Snapshot */}
      {snapshot && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border rounded p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{snapshot.totalControls}</p>
            <p className="text-xs text-gray-500 mt-1">Compliance Controls</p>
          </div>
          <div className="bg-white border rounded p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{snapshot.blockedControls}</p>
            <p className="text-xs text-gray-500 mt-1">Blocked Controls</p>
          </div>
          <div className="bg-white border rounded p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{snapshot.jurisdictions}</p>
            <p className="text-xs text-gray-500 mt-1">Jurisdiction Profiles</p>
          </div>
        </div>
      )}

      {/* Controls Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Compliance Control Domains</h2>
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Control</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Chain</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Execution Mode</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Production</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {controls.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{c.displayName}</td>
                  <td className="px-4 py-2 text-gray-600">{c.appliesTo}</td>
                  <td className={`px-4 py-2 font-medium ${statusColor(c.currentStatus)}`}>
                    {c.currentStatus}
                  </td>
                  <td className="px-4 py-2 text-gray-600 font-mono text-xs">{c.executionMode}</td>
                  <td className={`px-4 py-2 text-xs font-medium ${statusColor(c.productionActivationStatus)}`}>
                    {c.productionActivationStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Review */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Public Claim Review</h2>
        <p className="text-sm text-gray-600 mb-3">
          Review marketing or public claims for prohibited language.
          Detects: &ldquo;ISO 20022 certified&rdquo;, &ldquo;GENIUS Act approved&rdquo;,
          &ldquo;guaranteed yield&rdquo;, &ldquo;fully compliant globally&rdquo;, and more.
        </p>
        <form onSubmit={(e) => { void handleClaimReview(e); }} className="space-y-3">
          <textarea
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            placeholder="Enter a public claim or marketing statement to review..."
            className="w-full border rounded p-3 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-300"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={loading || !claimText.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Reviewing..." : "Review Claim"}
          </button>
        </form>

        {claimResult && (
          <div className={`mt-4 p-4 rounded border ${claimResult.isAllowed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <p className={`font-semibold text-sm ${claimResult.isAllowed ? "text-green-800" : "text-red-800"}`}>
              {claimResult.isAllowed ? "Claim Allowed" : "Claim Blocked — Prohibited Language Detected"}
            </p>
            {claimResult.prohibitedPhrases.length > 0 && (
              <ul className="mt-2 space-y-1">
                {claimResult.prohibitedPhrases.map((phrase, i) => (
                  <li key={i} className="text-xs text-red-700">• {phrase}</li>
                ))}
              </ul>
            )}
            {claimResult.correctionSuggestion && (
              <p className="mt-2 text-xs text-gray-700">{claimResult.correctionSuggestion}</p>
            )}
            {claimResult.taskId && (
              <p className="mt-2 text-xs text-gray-500">Audit Task ID: {claimResult.taskId}</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="border-t pt-4">
        <p className="text-xs text-gray-400">
          TROPTIONS XRPL/Stellar Institutional Compliance — Simulation Only.
          ISO 20022 message compatibility readiness only — not ISO 20022 certified.
          GENIUS Act readiness evaluation only — not GENIUS Act approved.
          Jurisdiction-aware compliance controls — legal review required before production.
          This panel does not submit transactions and has no access to private keys.
        </p>
      </div>
    </div>
  );
}
