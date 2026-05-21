/**
 * ComplianceNotice
 * Plain-language disclaimer for pages discussing RWA, stablecoins,
 * trade desk, escrow, funding, private markets, tokens, L1, XRPL, Stellar.
 *
 * Use compact=true for inline or card contexts.
 */

interface ComplianceNoticeProps {
  compact?: boolean;
  className?: string;
}

const FULL_TEXT = [
  "TROPTIONS is not offering investment advice through this website.",
  "Nothing on this website is a guarantee of funding, profit, liquidity, or asset approval.",
  "Tokenization, stablecoin, RWA, escrow, and trade desk workflows require legal, compliance, custody, and jurisdiction-specific review before live use.",
  "Demo, planning, and infrastructure pages may describe proposed capabilities that are not live unless specifically marked active.",
  "Client onboarding may require KYC/KYB, business verification, accredited investor checks, custody review, or third-party approvals depending on the use case.",
].join(" ");

const COMPACT_TEXT =
  "This section describes planned or proposed infrastructure. Not live. Not an investment product. Requires legal, compliance, and custody review before any live financial use.";

export function ComplianceNotice({ compact = false, className = "" }: ComplianceNoticeProps) {
  return (
    <div
      className={`rounded border border-orange-700/40 bg-orange-950/20 px-4 py-3 ${className}`}
      role="note"
      aria-label="Compliance Notice"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">
        Compliance Notice
      </p>
      <p className="text-xs text-orange-200/70 leading-relaxed">
        {compact ? COMPACT_TEXT : FULL_TEXT}
      </p>
    </div>
  );
}
