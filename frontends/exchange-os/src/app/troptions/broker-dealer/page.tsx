import Link from "next/link";

export const metadata = {
  title: "Broker-Dealer Services | TROPTIONS",
  description:
    "TROPTIONS institutional broker-dealer services: Proof of Funds (POF), Real-World Asset (RWA) tokenization, trade desk access, SBLC workflows, and settlement rails on XRPL and Stellar mainnet.",
  metadataBase: new URL("https://troptions.unykorn.org"),
};

const G = {
  bg:      "#FFFFFF",
  bg2:     "#F8F7F4",
  bg3:     "#F2F0EB",
  border:  "#D6D1C8",
  border2: "#E8E4DC",
  text:    "#1A1714",
  text2:   "#5C574F",
  text3:   "#8B857C",
  navy:    "#1B3259",
  navyD:   "#122040",
  gold:    "#7A5C14",
  green:   "#1A5233",
  greenL:  "#2D7A4F",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";

const SERVICES = [
  {
    code: "POF",
    name: "Proof of Funds",
    tagline: "Bank-grade POF for institutional deal flow",
    desc: "Submit and verify Proof of Funds packages for deal funding, escrow release, and counterparty diligence. TROPTIONS anchors POF evidence on-chain via XRPL transaction hashes and Chainlink-validated receipts. KYC/AML-clean evidence ledger included.",
    features: ["On-chain TX hash attestation", "Chainlink price validation", "KYC/AML screening", "Custodial receipt generation", "$175M USDC documented"],
    href: "/troptions/pof/submit",
    cta: "Submit POF Request",
    status: "Live",
    statusColor: G.green,
  },
  {
    code: "RWA",
    name: "Real-World Asset Tokenization",
    tagline: "Tokenize physical and financial assets on XRPL",
    desc: "Bring real estate, gold, energy, carbon credits, and financial instruments onto the XRP Ledger and Stellar Network. TROPTIONS provides the custody framework, compliance gating, and settlement rail from intake to on-chain issuance.",
    features: ["Real estate & property", "Precious metals & commodities", "Carbon & REC credits", "SBLC / banking instruments", "Multi-chain settlement (XRPL + Stellar)"],
    href: "/troptions/rwa/intake",
    cta: "Start RWA Intake",
    status: "Live",
    statusColor: G.green,
  },
  {
    code: "SBLC",
    name: "SBLC & Banking Instruments",
    tagline: "Standby Letter of Credit and correspondent banking",
    desc: "TROPTIONS supports Standby Letter of Credit workflows for institutional deal funding. Integration with correspondent banking rails and stablecoin settlement. Documents prepared to ISO 20022 standards.",
    features: ["SBLC preparation & coordination", "Correspondent banking integration", "ISO 20022 formatted messaging", "XRPL escrow backing", "Legal and compliance review"],
    href: "/portal/troptions/sblc",
    cta: "SBLC Inquiry",
    status: "Approval-gated",
    statusColor: G.gold,
  },
  {
    code: "TRADE",
    name: "Trade Desk",
    tagline: "$175M USDC documented position — verified on-chain",
    desc: "The TROPTIONS trade desk provides institutional-grade OTC settlement. The Bryan Stone USDC 175M position is fully documented with Chainlink validation, XRPL real-issuer proof, and wallet control signatures. Counterparties can independently verify every layer.",
    features: ["$175M USDC documented", "OTC desk access", "XRPL native settlement", "Proof package generation", "Counterparty diligence"],
    href: "/proofs/bryan-stone-usdc-175m.html",
    cta: "View Proof Package",
    status: "Live",
    statusColor: G.green,
  },
  {
    code: "CUSTOD",
    name: "Custody & Escrow",
    tagline: "Multi-sig vault and XRPL escrow for institutional assets",
    desc: "Institutional custody framework with multi-signature vaults, XRPL EscrowCreate/EscrowFinish workflows, and time-lock release conditions. Escrow balances are publicly verifiable on-chain before and after release — no reliance on TROPTIONS representations.",
    features: ["XRPL native EscrowCreate", "Multi-sig vault controls", "Stellar claimable balances", "Time-lock & condition-based release", "On-chain verifiable at all times"],
    href: "/troptions/custody",
    cta: "Custody Overview",
    status: "Live",
    statusColor: G.green,
  },
  {
    code: "COMPLY",
    name: "Compliance & KYC",
    tagline: "AML, KYB, sanctions screening — ISO 20022 ready",
    desc: "Full compliance layer covering KYC/KYB onboarding, anti-money laundering screening, wallet forensics, sanctions checks, and Travel Rule readiness. All workflows feed into the institutional compliance stack and evidence ledger.",
    features: ["KYC / KYB onboarding", "AML screening", "Wallet forensics", "Sanctions check (OFAC + global)", "ISO 20022 Travel Rule ready"],
    href: "/troptions/kyc",
    cta: "Start KYC",
    status: "Live",
    statusColor: G.green,
  },
] as const;

const HOW_IT_WORKS = [
  { step: "01", title: "Submit Request", desc: "Complete the relevant intake form — POF, RWA, SBLC, or general inquiry. Required fields include entity type, jurisdiction, and purpose of funds." },
  { step: "02", title: "KYC / AML Review", desc: "Your submission triggers the TROPTIONS compliance layer: KYC/KYB verification, AML screening, and sanctions check against OFAC and global lists." },
  { step: "03", title: "Evidence Package", desc: "TROPTIONS generates the relevant proof package: XRPL transaction hash attestation, Chainlink-validated receipt, custodial statement, or CIS package." },
  { step: "04", title: "On-Chain Settlement", desc: "Deal funding, escrow, and settlement execute on XRPL or Stellar mainnet. All balances are publicly verifiable. Escrow releases only on condition met." },
];

const XRPL_STATS = [
  { n: "175M", label: "USDC on XRPL" },
  { n: "100M", label: "USDT Issued" },
  { n: "50M",  label: "DAI Issued" },
  { n: "50M",  label: "EURC Issued" },
  { n: "100M", label: "TROPTIONS Issued" },
  { n: "3–5s", label: "Settlement Time" },
];

export default function BrokerDealerPage() {
  return (
    <div style={{ background: G.bg, color: G.text, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ borderBottom: `1px solid ${G.border}`, background: G.bg, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/troptions" style={{ fontFamily: serif, fontSize: "1rem", letterSpacing: "0.1em", color: G.navyD, fontWeight: 700, textTransform: "uppercase", textDecoration: "none" }}>
            TROPTIONS
          </Link>
          <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
            {[
              { label: "POF",        href: "/troptions/pof/submit" },
              { label: "RWA",        href: "/troptions/rwa/intake" },
              { label: "Trade Desk", href: "/troptions/institutional" },
              { label: "Compliance", href: "/troptions/kyc" },
              { label: "Verify",     href: "/troptions/verification" },
            ].map(n => (
              <Link key={n.label} href={n.href} style={{ color: G.text2, fontSize: "0.85rem", textDecoration: "none" }}>{n.label}</Link>
            ))}
            <Link href="/portal/troptions/dashboard" style={{ background: G.navy, color: "#fff", padding: "0.4rem 1.1rem", borderRadius: 3, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
              Client Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "5rem 2rem 4rem", background: G.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: serif, fontSize: "0.75rem", letterSpacing: "0.3em", color: G.gold, textTransform: "uppercase", marginBottom: "1.25rem" }}>
            Est. 2003 &nbsp;&middot;&nbsp; Live on XRPL &amp; Stellar Mainnet
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, lineHeight: 1.18, color: G.navyD, marginBottom: "1.5rem", maxWidth: 780 }}>
            Institutional Broker-Dealer Services<br />on the XRP Ledger
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.82, color: G.text2, maxWidth: 640, marginBottom: "2.5rem" }}>
            TROPTIONS provides Proof of Funds verification, Real-World Asset tokenization, SBLC coordination, and trade desk settlement — all anchored to live XRPL and Stellar mainnet infrastructure. Every claim is verifiable on-chain.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/troptions/pof/submit" style={{ background: G.navy, color: "#fff", padding: "0.8rem 2rem", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
              Submit POF Request
            </Link>
            <Link href="/troptions/rwa/intake" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.8rem 2rem", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
              RWA Intake
            </Link>
            <Link href="/proofs/bryan-stone-usdc-175m.html" style={{ color: G.text2, padding: "0.8rem 1.5rem", fontSize: "0.9rem", textDecoration: "underline" }}>
              View $175M USDC Proof
            </Link>
          </div>
        </div>
      </section>

      {/* XRPL STATS */}
      <section style={{ borderBottom: `1px solid ${G.border}`, background: G.bg2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", display: "flex", flexWrap: "wrap" }}>
          {XRPL_STATS.map((s, i) => (
            <div key={s.label} style={{ flex: "1 1 130px", padding: "1.75rem 1.5rem", borderRight: i < XRPL_STATS.length - 1 ? `1px solid ${G.border}` : undefined, textAlign: "center" }}>
              <div style={{ fontFamily: serif, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: G.navyD, fontWeight: 400 }}>{s.n}</div>
              <div style={{ fontSize: "0.7rem", color: G.text3, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.3rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES GRID */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 400, color: G.navyD, marginBottom: "0.5rem" }}>
              Services
            </h2>
            <p style={{ color: G.text2, fontSize: "0.92rem" }}>
              All services operate on live XRPL and Stellar mainnet. Advanced workflows require KYC/AML and jurisdiction compliance review.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.5rem" }}>
            {SERVICES.map(svc => (
              <div key={svc.code} style={{ border: `1px solid ${G.border}`, padding: "1.75rem", background: G.bg, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                  <span style={{ fontFamily: serif, fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: G.text3 }}>{svc.code}</span>
                  <span style={{ fontSize: "0.68rem", color: svc.statusColor, border: `1px solid ${svc.statusColor}`, padding: "0.15rem 0.5rem", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase" }}>{svc.status}</span>
                </div>
                <h3 style={{ fontFamily: serif, fontSize: "1.1rem", color: G.navyD, marginBottom: "0.4rem" }}>{svc.name}</h3>
                <p style={{ fontSize: "0.8rem", color: G.gold, fontStyle: "italic", marginBottom: "0.85rem" }}>{svc.tagline}</p>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: G.text2, marginBottom: "1.25rem", flex: 1 }}>{svc.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {svc.features.map(f => (
                    <li key={f} style={{ fontSize: "0.82rem", color: G.text2, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <span style={{ color: G.green, flexShrink: 0, marginTop: "0.05rem" }}>&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={svc.href} style={{ background: G.navy, color: "#fff", padding: "0.65rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", borderRadius: 3, textAlign: "center" }}>
                  {svc.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "5rem 2rem", background: G.bg2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(1.3rem,2vw,1.8rem)", fontWeight: 400, color: G.navyD, marginBottom: "3rem" }}>
            How It Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "2rem" }}>
            {HOW_IT_WORKS.map(s => (
              <div key={s.step}>
                <div style={{ fontFamily: serif, fontSize: "2rem", color: G.border, fontWeight: 400, marginBottom: "0.75rem" }}>{s.step}</div>
                <h3 style={{ fontFamily: serif, fontSize: "1rem", color: G.navyD, marginBottom: "0.5rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.87rem", lineHeight: 1.7, color: G.text2 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* XRPL PROOF RAIL */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.3rem,2vw,1.75rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.25 }}>
              Every Transaction Verifiable on XRPL Mainnet
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.85, color: G.text2, marginBottom: "1.5rem" }}>
              TROPTIONS Gateway IOUs settle on XRPL in 3–5 seconds. Counterparties can verify every issuance, balance, and escrow position on public blockchain explorers — no account required, no trust in TROPTIONS required.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "XRPL Issuer",      addr: "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ", href: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
                { label: "Distribution",     addr: "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt", href: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
                { label: "Stellar Issuer",   addr: "GB4FHGFUTLL…J34JGEG4",               href: "https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4" },
              ].map(w => (
                <div key={w.label} style={{ border: `1px solid ${G.border}`, padding: "0.85rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: G.text3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{w.label}</div>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: "0.8rem", color: G.text }}>{w.addr}</div>
                  </div>
                  <a href={w.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: G.navy, textDecoration: "underline", whiteSpace: "nowrap" }}>Verify ↗</a>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/troptions/verification" style={{ background: G.navy, color: "#fff", padding: "0.65rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>Full Proof of Issuance</Link>
              <Link href="/troptions/wallets"       style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.65rem 1.5rem", fontSize: "0.85rem", textDecoration: "none", borderRadius: 3 }}>Live Wallets</Link>
            </div>
          </div>
          <div>
            <div style={{ border: `1px solid ${G.border}`, padding: "1.75rem", background: G.bg2 }}>
              <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.15em", color: G.text3, marginBottom: "1.25rem" }}>Latest XRPL Mainnet Transactions</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                <tbody>
                  {[
                    { date: "2026-05-01", asset: "USDC",     amount: "75,000,000",  tx: "4CCB18E8" },
                    { date: "2026-04-29", asset: "EURC",     amount: "50,000,000",  tx: "FF11D777" },
                    { date: "2026-04-29", asset: "DAI",      amount: "50,000,000",  tx: "C0D75DCC" },
                    { date: "2026-04-29", asset: "USDT",     amount: "100,000,000", tx: "42092147" },
                    { date: "2026-04-29", asset: "USDC",     amount: "100,000,000", tx: "CD727127" },
                  ].map(t => (
                    <tr key={t.tx} style={{ borderBottom: `1px solid ${G.border2}` }}>
                      <td style={{ padding: "0.55rem 0.5rem 0.55rem 0", color: G.text3, fontSize: "0.72rem" }}>{t.date}</td>
                      <td style={{ padding: "0.55rem 0.5rem", fontFamily: serif, fontWeight: 600, color: G.navyD }}>{t.asset}</td>
                      <td style={{ padding: "0.55rem 0.5rem", fontFamily: "'Courier New',monospace", color: G.text }}>{t.amount}</td>
                      <td style={{ padding: "0.55rem 0 0.55rem 0.5rem" }}>
                        <a href={`https://xrpscan.com/tx/${t.tx}`} target="_blank" rel="noopener noreferrer"
                           style={{ fontFamily: "'Courier New',monospace", fontSize: "0.75rem", color: G.navy, textDecoration: "underline" }}>
                          {t.tx}… ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: "0.75rem", color: G.text3, marginTop: "1rem" }}>
                All transactions verifiable on{" "}
                <a href="https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" target="_blank" rel="noopener noreferrer" style={{ color: G.navy }}>XRPScan ↗</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* $175M POF CALLOUT */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "5rem 2rem", background: G.bg3 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: serif, fontSize: "0.75rem", letterSpacing: "0.25em", color: G.gold, textTransform: "uppercase", marginBottom: "1rem" }}>Proof of Funds — Documented</p>
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.4rem,2.5vw,2.2rem)", fontWeight: 400, color: G.navyD, marginBottom: "1.25rem", lineHeight: 1.25 }}>
              $175 Million USDC<br />Trade Desk Position
            </h2>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: G.text2, marginBottom: "1.75rem" }}>
              The Bryan Stone USDC 175M position is documented through Chainlink price validation, XRPL real-issuer proof, wallet control signatures, and a full CIS compliance package. 100M issued 2026-04-28 and 75M additional issued 2026-05-01 — both transactions publicly verifiable on XRPL mainnet.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/proofs/bryan-stone-usdc-175m.html" style={{ background: G.navy, color: "#fff", padding: "0.75rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
                Open Proof Package
              </Link>
              <Link href="/troptions/pof/submit" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.75rem 1.75rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>
                Submit Your POF Request
              </Link>
            </div>
          </div>
          <div style={{ border: `1px solid ${G.border}`, padding: "2rem", background: G.bg }}>
            <div style={{ fontFamily: serif, fontSize: "2.2rem", color: G.navyD, borderBottom: `1px solid ${G.border}`, paddingBottom: "1rem", marginBottom: "1rem" }}>
              $175,000,000
            </div>
            <div style={{ fontSize: "0.7rem", color: G.text3, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5rem" }}>USDC · XRPL Mainnet · Verified</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
              <tbody>
                {[
                  { k: "Initial issuance",  v: "100M USDC — Apr 28, 2026" },
                  { k: "Additional",        v: "75M USDC — May 1, 2026" },
                  { k: "TX (75M)",          v: "4CCB18E8…" },
                  { k: "TX (100M)",         v: "CD727127…" },
                  { k: "Chainlink",         v: "✓ Validated" },
                  { k: "CIS package",       v: "✓ Compiled" },
                ].map(r => (
                  <tr key={r.k} style={{ borderBottom: `1px solid ${G.border2}` }}>
                    <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", color: G.text3, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.k}</td>
                    <td style={{ padding: "0.5rem 0", color: G.text, fontFamily: "'Courier New',monospace", fontSize: "0.8rem" }}>{r.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 2rem", background: G.bg }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 400, color: G.navyD, marginBottom: "1.25rem", lineHeight: 1.3 }}>
            Ready to engage?
          </h2>
          <p style={{ color: G.text2, fontSize: "0.97rem", lineHeight: 1.85, marginBottom: "2.5rem" }}>
            Submit a POF request, start an RWA intake, or open a client portal account to access trade desk services, compliance workflows, and institutional settlement rails.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/troptions/pof/submit"     style={{ background: G.navy, color: "#fff", padding: "0.85rem 2.25rem", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>Submit POF</Link>
            <Link href="/troptions/rwa/intake"     style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.85rem 2.25rem", fontSize: "0.9rem", textDecoration: "none", borderRadius: 3 }}>RWA Intake</Link>
            <Link href="/portal/troptions/onboarding" style={{ color: G.text2, padding: "0.85rem 1.5rem", fontSize: "0.9rem", textDecoration: "underline" }}>Create Account</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${G.border}`, padding: "2rem", background: G.bg2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontFamily: serif, fontSize: "0.85rem", color: G.navyD, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>TROPTIONS</span>
          <p style={{ fontSize: "0.78rem", color: G.text3, maxWidth: 680 }}>
            TROPTIONS provides institutional infrastructure for trade currency, RWA tokenization, and settlement services. Advanced workflows (custody, banking, exchange) require jurisdiction-specific legal, compliance, and licensing review. All XRPL and Stellar issuances are live on mainnet and independently verifiable.
          </p>
          <p style={{ fontSize: "0.78rem", color: G.text3 }}>&copy; 2003&ndash;2026 TROPTIONS / FTH Trading</p>
        </div>
      </footer>

    </div>
  );
}
