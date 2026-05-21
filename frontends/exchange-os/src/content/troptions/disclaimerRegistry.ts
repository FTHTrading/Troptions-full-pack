/**
 * Troptions Disclaimer Registry
 * All reusable disclaimer strings as typed constants.
 * Every public-facing page must include the appropriate disclaimer(s).
 */

export const DISCLAIMERS = {
  // ─── Master Disclaimer (required on all Troptions pages) ─────────────────
  MASTER: `Troptions is a digital asset ecosystem operating through TROPTIONS compliance-controlled technology infrastructure. Nothing on this platform constitutes financial advice, investment advice, securities offerings, stablecoin issuance, or legal advice. All capabilities, assets, tokens, funding routes, and integrations are subject to ongoing legal review, compliance analysis, and regulatory approval in applicable jurisdictions. Past performance is not indicative of future results. Participants should consult independent financial, legal, tax, and accounting advisors before engaging with any Troptions product or service.`,

  // ─── Asset / Token Disclaimer ─────────────────────────────────────────────
  ASSET: `Digital assets involve significant risk including loss of principal. Troptions tokens are not money, not FDIC-insured, and not backed by any government. Token value is subject to market conditions, counterparty risk, regulatory developments, and other factors. No guarantee of value, liquidity, or return is made or implied.`,

  // ─── Securities Disclaimer ────────────────────────────────────────────────
  SECURITIES: `Certain Troptions instruments may constitute securities under applicable law. Any securities offering is limited to accredited investors in compliance with applicable exemptions. Nothing herein constitutes a public offering of securities. Offer and sale of securities is subject to legal analysis, investor eligibility verification, and regulatory approval in each applicable jurisdiction.`,

  // ─── Stablecoin / Stable Unit Disclaimer ─────────────────────────────────
  STABLE_UNIT: `Troptions internal stable units are closed-loop accounting units, not stablecoins, currency, or money substitutes, unless explicitly licensed and legally structured as such. Third-party stablecoins (USDC, EURC, RLUSD, PYUSD, USDT, DAI) are products of their respective issuers. Troptions does not issue, back, or guarantee third-party stablecoin products.`,

  // ─── RWA / Real World Asset Disclaimer ───────────────────────────────────
  RWA: `Tokenized real-world assets are not automatically liquid or tradeable. Each asset is subject to legal classification, title verification, appraisal, custody proof, lien review, transfer restrictions, investor eligibility requirements, and market-access approval before any secondary market activity. RWA tokenization does not eliminate real-world risks associated with the underlying asset.`,

  // ─── Gold / Commodity Disclaimer ─────────────────────────────────────────
  GOLD: `Troptions.Gold and related gold-backed claims are subject to custody proof, reserve schedule, assay certificates, and legal opinion before institutional or public use. Gold is a commodity subject to CFTC oversight and applicable commodity regulations. No gold-backed product is live or available for purchase or redemption without independent verification of reserves and legal structure.`,

  // ─── Merchant Acceptance Disclaimer ──────────────────────────────────────
  MERCHANT: `Merchant acceptance is subject to third-party payment rail provider terms, counterparty acceptance, geographic restrictions, and category exclusions. Merchant count data must be sourced, dated, and independently verified. Troptions does not guarantee universal merchant acceptance.`,

  // ─── Audit Disclaimer ─────────────────────────────────────────────────────
  AUDIT: `Any audit referenced in Troptions materials covers specific assets, methodologies, and time periods as disclosed in the audit document. An audit is not a guarantee of reserves, compliance, solvency, or future performance. Audit scope, limitations, exceptions, and remediation status are disclosed separately.`,

  // ─── Exchange / Trading Disclaimer ────────────────────────────────────────
  EXCHANGE: `Troptions does not operate a licensed exchange or trading platform unless separately disclosed with applicable licensing information. Any reference to exchange infrastructure represents an announced initiative subject to licensing analysis and regulatory approval. No exchange services are being offered.`,

  // ─── Barter / Non-Cash Settlement Disclaimer ─────────────────────────────
  BARTER: `Barter transactions conducted through the Troptions ecosystem may constitute taxable events under applicable tax law. Troptions does not provide tax advice. Participants are responsible for determining and reporting their tax obligations. Consult independent tax counsel before engaging in barter or non-cash settlement activities.`,

  // ─── AI Concierge Disclaimer ──────────────────────────────────────────────
  AI_CONCIERGE: `The Troptions AI Concierge provides informational guidance only. It does not execute transactions, approve investments, override compliance controls, provide legal or financial advice, or move funds. All material decisions require human authorization through appropriate approval workflows.`,

  // ─── Humanitarian / Social Impact Disclaimer ──────────────────────────────
  HUMANITARIAN: `Social-impact and humanitarian programs associated with Troptions tokens are subject to governance controls, use-of-proceeds policy, and legal review. Troptions does not guarantee charitable impact outcomes. Program governance and financials are disclosed separately.`,

  // ─── Funding Route Disclaimer ─────────────────────────────────────────────
  FUNDING: `Funding routes are subject to legal analysis, board approval, investor eligibility requirements, and integration approval before activation. Evaluation-status routes are not operational and do not constitute an offer to invest or lend. No guarantee of credit terms, yield, returns, or liquidity is made.`,

  // ─── Compliance / Jurisdiction Disclaimer ─────────────────────────────────
  JURISDICTION: `Troptions operates on a compliance-by-jurisdiction model. Not all products, services, or capabilities are available in all jurisdictions. Certain jurisdictions are prohibited. Compliance status is specific to jurisdiction and activity type and does not constitute worldwide compliance. Participants are responsible for ensuring their own compliance with applicable local laws.`,

  // ─── Forward-Looking Statement Notice ─────────────────────────────────────
  FORWARD_LOOKING: `This content may contain forward-looking statements regarding anticipated capabilities, partnerships, funding, integrations, and market outcomes. These statements are based on current plans and assumptions and are subject to significant risks and uncertainties. Actual results may differ materially. Forward-looking statements are not guarantees.`,
} as const;

export type DisclaimerKey = keyof typeof DISCLAIMERS;

/** Returns the full required disclaimer set for a public-facing Troptions page */
export function getPublicPageDisclaimers(): string[] {
  return [
    DISCLAIMERS.MASTER,
    DISCLAIMERS.ASSET,
    DISCLAIMERS.JURISDICTION,
    DISCLAIMERS.FORWARD_LOOKING,
  ];
}

/** Returns disclaimers required for investor or institutional materials */
export function getInstitutionalDisclaimers(): string[] {
  return [
    DISCLAIMERS.MASTER,
    DISCLAIMERS.ASSET,
    DISCLAIMERS.SECURITIES,
    DISCLAIMERS.JURISDICTION,
    DISCLAIMERS.FORWARD_LOOKING,
    DISCLAIMERS.FUNDING,
  ];
}
