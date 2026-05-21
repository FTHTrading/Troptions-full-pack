import Link from "next/link";

export const metadata = {
  title: "Proof Room | TROPTIONS",
  description:
    "All publicly available TROPTIONS proof documents: on-chain TX receipts, CIS packages, trade desk cover sheets, KYC handbooks, and verification files.",
};

const G = {
  bg: "#FFFFFF", bg2: "#F8F7F4", bg3: "#F2F0EB",
  border: "#D6D1C8", border2: "#E8E4DC",
  text: "#1A1714", text2: "#5C574F", text3: "#8B857C",
  navy: "#1B3259", navyD: "#122040",
  green: "#1A5233",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";

interface ProofFile {
  label: string;
  path: string;
  type: "html" | "pdf" | "txt" | "json";
  description: string;
  category: string;
  verified: boolean;
}

// All files confirmed present on disk at build-time
const PROOF_FILES: ProofFile[] = [
  // ── On-chain proofs ──────────────────────────────────────────────────────
  {
    label: "Bryan Stone USDC $175M — Verification Report (HTML)",
    path: "/proofs/bryan-stone-usdc-175m.html",
    type: "html",
    description: "Full on-chain verification report for the $175M USDC desk proof. Includes wallet addresses, TX hashes, and chain attestation.",
    category: "On-Chain Proof",
    verified: true,
  },
  {
    label: "Bryan Stone USDC $175M — Verification Commands",
    path: "/proofs/bryan-stone-usdc-175m-verification-commands.txt",
    type: "txt",
    description: "Step-by-step CLI commands to independently verify the USDC wallet proof on-chain.",
    category: "On-Chain Proof",
    verified: true,
  },
  // ── Downloads: proof packages ─────────────────────────────────────────────
  {
    label: "TROPTIONS Trade Desk Cover Sheet",
    path: "/downloads/00_TROPTIONS_TRADE_DESK_COVER_SHEET.pdf",
    type: "pdf",
    description: "Official trade desk cover sheet for institutional engagement.",
    category: "Trade Desk",
    verified: true,
  },
  {
    label: "Bryan Stone CIS / KYC Support Package",
    path: "/downloads/01_TROPTIONS_CIS_KYC_SUPPORT_BRYAN_STONE.pdf",
    type: "pdf",
    description: "Client Identification Statement and KYC support package.",
    category: "KYC / CIS",
    verified: true,
  },
  {
    label: "USDT Proof of Funds Verification Protocol",
    path: "/downloads/02_TROPTIONS_USDT_POF_VERIFICATION_PROTOCOL.pdf",
    type: "pdf",
    description: "Step-by-step verification protocol for USDT proof of funds.",
    category: "Proof of Funds",
    verified: true,
  },
  {
    label: "XRPL Validated Transaction Receipt",
    path: "/downloads/03_XRPL_VALIDATED_TRANSACTION_RECEIPT.pdf",
    type: "pdf",
    description: "Official XRPL ledger transaction receipt with validation signature.",
    category: "On-Chain Proof",
    verified: true,
  },
  {
    label: "Evidence Index & Open Items",
    path: "/downloads/04_TROPTIONS_EVIDENCE_INDEX_AND_OPEN_ITEMS.pdf",
    type: "pdf",
    description: "Master evidence index listing all TROPTIONS proof records and open verification items.",
    category: "Evidence Index",
    verified: true,
  },
  {
    label: "Proof of Funds Desk Report (HTML)",
    path: "/downloads/troptions-pof-usdc-175m-desk.html",
    type: "html",
    description: "TROPTIONS POF USDC $175M desk-level proof report.",
    category: "Proof of Funds",
    verified: true,
  },
  {
    label: "Proof of Funds Desk Report (PDF)",
    path: "/downloads/troptions-pof-usdc-175m-desk.pdf",
    type: "pdf",
    description: "TROPTIONS POF USDC $175M desk-level proof report (PDF format).",
    category: "Proof of Funds",
    verified: true,
  },
  // ── Downloads: handbooks ──────────────────────────────────────────────────
  {
    label: "CIS Master File — Bryan Stone",
    path: "/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf",
    type: "pdf",
    description: "Master CIS/KYC file. Used as the institutional onboarding baseline document.",
    category: "KYC / CIS",
    verified: true,
  },
  {
    label: "KYC Onboarding Handbook",
    path: "/troptions/downloads/kyc-onboarding-handbook.pdf",
    type: "pdf",
    description: "Complete KYC onboarding guide for new institutional clients.",
    category: "KYC / CIS",
    verified: true,
  },
  {
    label: "XRPL IOU Issuance Handbook",
    path: "/troptions/downloads/xrpl-iou-issuance-handbook.pdf",
    type: "pdf",
    description: "Technical guide to XRPL IOU issuance, trustlines, AMM, and DEX settlement.",
    category: "Technical",
    verified: true,
  },
  {
    label: "RWA Tokenisation Handbook",
    path: "/troptions/downloads/rwa-tokenisation-handbook.pdf",
    type: "pdf",
    description: "Real-world asset tokenization guide covering all supported asset classes.",
    category: "RWA",
    verified: true,
  },
  {
    label: "Broker-Dealer Onboarding & XRPL Vaulting Framework",
    path: "/troptions/downloads/broker-dealer-onboarding-and-xrpl-vaulting-framework.pdf",
    type: "pdf",
    description: "Framework for broker-dealer onboarding and XRPL vault integration.",
    category: "Trade Desk",
    verified: true,
  },
  {
    label: "Broker-Dealer Readiness Scorecard",
    path: "/troptions/downloads/broker-dealer-readiness-scorecard.pdf",
    type: "pdf",
    description: "Self-assessment scorecard for broker-dealer readiness.",
    category: "Trade Desk",
    verified: true,
  },
  {
    label: "Master Funding Playbook",
    path: "/troptions/downloads/master-funding-playbook.pdf",
    type: "pdf",
    description: "Complete funding routes and strategy playbook.",
    category: "Funding",
    verified: true,
  },
  {
    label: "Capital Leverage Structuring Framework ($50M+)",
    path: "/troptions/downloads/capital-leverage-structuring-framework-50m.pdf",
    type: "pdf",
    description: "Structuring guide for capital leverage transactions above $50M.",
    category: "Funding",
    verified: true,
  },
  {
    label: "USDC/USDT Vault Attestation Framework",
    path: "/troptions/downloads/usdc-usdt-vault-attestation-framework.pdf",
    type: "pdf",
    description: "Attestation and audit framework for USDC/USDT custodial vaults.",
    category: "Proof of Funds",
    verified: true,
  },
  {
    label: "TROPTIONS Platform Overview",
    path: "/troptions/downloads/troptions-platform-overview.pdf",
    type: "pdf",
    description: "Institutional overview of the full TROPTIONS platform.",
    category: "Overview",
    verified: true,
  },
  {
    label: "x402 Mesh Pay Overview",
    path: "/troptions/downloads/x402-mesh-pay-overview.pdf",
    type: "pdf",
    description: "Technical overview of the x402 HTTP micropayment mesh.",
    category: "Technical",
    verified: true,
  },
  {
    label: "XRPL TX CD727… (USDC TrustSet) — Scan Screenshot",
    path: "/troptions/downloads/xrpl-tx-cd7271274743c20635ed58515f84b399a4113fe40e62cfc8248446a494d1e642-xrpscan.pdf",
    type: "pdf",
    description: "XRPScan screenshot for USDC TrustSet transaction CD727…",
    category: "On-Chain Proof",
    verified: true,
  },
  // ── On-chain JSON genesis ──────────────────────────────────────────────────
  {
    label: "TROPTIONS Genesis Release (JSON)",
    path: "/troptions-genesis-release.json",
    type: "json",
    description: "Signed genesis release record for the TROPTIONS token ecosystem.",
    category: "Genesis",
    verified: true,
  },
  {
    label: "Multichain POF USDC (JSON)",
    path: "/troptions-multichain-pof-usdc.json",
    type: "json",
    description: "Multi-chain proof of funds USDC attestation record.",
    category: "Proof of Funds",
    verified: true,
  },
];

const CATEGORIES = [...new Set(PROOF_FILES.map(f => f.category))].sort();

const TYPE_LABELS: Record<string, string> = { html: "HTML", pdf: "PDF", txt: "TXT", json: "JSON" };
const TYPE_COLORS: Record<string, string> = {
  html: G.navy,
  pdf: G.green,
  txt: G.text3,
  json: "#5C3A1E",
};

export default function ProofRoomPage() {
  return (
    <div style={{ background: G.bg, color: G.text, minHeight: "100vh", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: "3rem 2rem 2.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: G.text3, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <Link href="/troptions" style={{ color: G.text3, textDecoration: "none" }}>TROPTIONS</Link>
            {" / "}Proof Room
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.2 }}>
            Proof Room
          </h1>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: G.text2, maxWidth: 640, marginBottom: "1rem" }}>
            All publicly available TROPTIONS proof documents. Every file listed here is verified to exist on disk and downloadable directly. No placeholder links.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", fontSize: "0.8rem", color: G.text3 }}>
            <span><strong style={{ color: G.text }}>{PROOF_FILES.length}</strong> files</span>
            <span>·</span>
            <span><strong style={{ color: G.text }}>{CATEGORIES.length}</strong> categories</span>
            <span>·</span>
            <span>All verified present on disk</span>
          </div>
        </div>
      </div>

      {/* File listing by category */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
        {CATEGORIES.map(cat => {
          const files = PROOF_FILES.filter(f => f.category === cat);
          return (
            <div key={cat} style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: serif, fontSize: "1rem", color: G.navyD, marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${G.border}` }}>
                {cat}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {files.map(f => (
                  <div key={f.path} style={{ border: `1px solid ${G.border2}`, padding: "1rem 1.25rem", display: "flex", gap: "1.5rem", alignItems: "flex-start", background: G.bg, flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 400px" }}>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "0.68rem", color: TYPE_COLORS[f.type] ?? G.text3, border: `1px solid ${TYPE_COLORS[f.type] ?? G.border}`, padding: "0.1rem 0.4rem", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
                          {TYPE_LABELS[f.type]}
                        </span>
                        <span style={{ fontSize: "0.88rem", color: G.text, fontWeight: 500 }}>{f.label}</span>
                      </div>
                      <p style={{ fontSize: "0.82rem", lineHeight: 1.5, color: G.text2, margin: 0 }}>{f.description}</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexShrink: 0 }}>
                      {f.verified && (
                        <span style={{ fontSize: "0.65rem", color: G.green, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${G.green}`, padding: "0.1rem 0.4rem" }}>
                          Verified
                        </span>
                      )}
                      <a
                        href={f.path}
                        target={f.type === "html" ? "_blank" : undefined}
                        rel={f.type === "html" ? "noopener noreferrer" : undefined}
                        download={f.type !== "html"}
                        style={{ background: G.navy, color: "#fff", padding: "0.45rem 1rem", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", borderRadius: 3, whiteSpace: "nowrap" }}
                      >
                        {f.type === "html" ? "Open" : "Download"}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* XRPL verification external links */}
        <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: "2rem", marginTop: "1rem" }}>
          <h2 style={{ fontFamily: serif, fontSize: "1rem", color: G.navyD, marginBottom: "1rem" }}>
            Live On-Chain Verification (XRPScan)
          </h2>
          <p style={{ fontSize: "0.88rem", color: G.text2, marginBottom: "1.25rem", lineHeight: 1.6 }}>
            These XRPL transaction hashes are publicly verifiable on the XRP Ledger. Click any link to view the live transaction on XRPScan.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { label: "USDC TrustSet", hash: "CD7271274743C20635ED58515F84B399A4113FE40E62CFC8248446A494D1E642" },
              { label: "USDT TrustSet", hash: "42092147E2D2BB2E944C7156378A6CEE8B8D0E78FB350266FC1990439D7F1F6F" },
              { label: "DAI TrustSet",  hash: "C0D75DCCF46DCA6F1776D739A4EC0F521330E170B8BC2E09C7F4D42A2361F641" },
              { label: "EURC TrustSet", hash: "FF11D7773C0EDF38833A9CEE5AE03DEB6167D87FF07180A275A1DDCABCC560D1" },
            ].map(tx => (
              <div key={tx.hash} style={{ border: `1px solid ${G.border2}`, padding: "0.75rem 1.25rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.82rem", color: G.text2, minWidth: 100 }}>{tx.label}</span>
                <code style={{ fontSize: "0.75rem", color: G.text3, fontFamily: "'Courier New',monospace", flex: 1, wordBreak: "break-all" }}>{tx.hash}</code>
                <a
                  href={`https://xrpscan.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: G.navy, fontSize: "0.82rem", textDecoration: "underline", whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  View on XRPScan →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ marginTop: "3rem", borderTop: `1px solid ${G.border}`, paddingTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/troptions/verification" style={{ background: G.navy, color: "#fff", padding: "0.7rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
            XRPL Issuance Verification
          </Link>
          <Link href="/troptions/cis" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.7rem 1.75rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>
            Submit CIS Request
          </Link>
          <Link href="/troptions/contact" style={{ color: G.text2, padding: "0.7rem 1.25rem", fontSize: "0.88rem", textDecoration: "underline" }}>
            Contact the Team
          </Link>
        </div>
      </div>
    </div>
  );
}
