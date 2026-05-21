import { getMockRiskReviews } from "@/lib/troptions/proof-room/riskReview";

export const metadata = { title: "Risk Review — TROPTIONS Proof Room" };

export default function RiskReviewPage() {
  const reviews = getMockRiskReviews();

  const riskColors: Record<string, string> = {
    low: "text-green-400 border-green-800/50",
    medium: "text-yellow-400 border-yellow-800/50",
    high: "text-orange-400 border-orange-800/50",
    critical: "text-red-400 border-red-800/50",
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        INTERNAL — Risk review data is not for public distribution.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PROOF ROOM
        </div>
        <h1 className="text-2xl font-bold text-white">Risk Review</h1>
        <p className="mt-1 text-gray-400 text-sm">Unsafe phrases and safer replacements for TROPTIONS communications.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className={`rounded-lg bg-[#0F1923] border p-5 ${
            review.riskLevel === "critical" ? "border-red-800/60" : "border-gray-800"
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="font-semibold text-white text-sm italic">"{review.unsafePhrase}"</div>
              <span className={`rounded px-2 py-0.5 text-xs border ${riskColors[review.riskLevel]}`}>
                {review.riskLevel.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-3">{review.whyRisky}</div>
            <div className="rounded bg-[#080C14] border border-green-900/40 p-3">
              <div className="text-xs text-green-400 uppercase tracking-wide mb-1">Safer Replacement</div>
              <div className="text-xs text-green-200">{review.saferReplacement}</div>
            </div>
            <div className="mt-2 text-xs text-gray-600">Context: {review.exampleContext}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
