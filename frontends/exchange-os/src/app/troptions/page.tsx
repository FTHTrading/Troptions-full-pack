import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "TROPTIONS — The Trade Currency of the Real Economy",
  description:
    "TROPTIONS: Founded 2003. Sovereign Rust Layer 1 with 27 crates. Live XRPL & Stellar issuances. $175M USDC documented. Mobile Medical Clinics. Real Estate. University. The institutional operating system for the real economy.",
  metadataBase: new URL("https://troptions.unykorn.org"),
};

// ── Berkshire-style institutional palette ────────────────────────────────────
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
const mono  = "'Courier New',Courier,monospace";

const STATS = [
  { n: "2003",  label: "Year Founded" },
  { n: "27",    label: "Rust L1 Crates" },
  { n: "7",     label: "Live XRPL Wallets" },
  { n: "$175M", label: "USDC Documented" },
  { n: "4",     label: "Stablecoins Issued" },
  { n: "33+",   label: "Ecosystem Verticals" },
];

const PIPELINE = [
  { code: "POPEYE",    role: "Network / P2P",     desc: "libp2p gossipsub fabric. Propagates transactions and blocks across the validator mesh. Never mutates state." },
  { code: "TEV",       role: "Cryptographic Gate", desc: "Ed25519 verification, nonce validation, anti-replay. Every payload is held here before the runtime sees it. Post-quantum lane included." },
  { code: "CONSENSUS", role: "BFT Finality",       desc: "Round-robin leader election with 2/3+ quorum. Finality is a signed certificate — not probabilistic." },
  { code: "MARS",      role: "Runtime Brain",      desc: "Pure state machine. Balances, nonces, RWA registry, NIL registry, AMM math, trustlines, namespaces. Same input → same output on every node." },
  { code: "TAR",       role: "Persistence",        desc: "Atomic crash-safe storage. Append-only log + snapshots. Kill mid-block — TAR comes back identical." },
];

const STABLECOINS = [
  { sym: "USDC", supply: "175,000,000", peg: "USD", issuer: "Circle",   tx: "4CCB18E8838C6B40D4E022B68817D45BAD3E235652C52F0337D82C4E4E5AAB6E" },
  { sym: "USDT", supply: "100,000,000", peg: "USD", issuer: "Tether",   tx: "42092147E2D2BB2E944C7156378A6CEE8B8D0E78FB350266FC1990439D7F1F6F" },
  { sym: "DAI",  supply: "50,000,000",  peg: "USD", issuer: "MakerDAO", tx: "C0D75DCCF46DCA6F1776D739A4EC0F521330E170B8BC2E09C7F4D42A2361F641" },
  { sym: "EURC", supply: "50,000,000",  peg: "EUR", issuer: "Circle",   tx: "FF11D7773C0EDF38833A9CEE5AE03DEB6167D87FF07180A275A1DDCABCC560D1" },
];

const VERTICALS = [
  { name: "Real Estate",       href: "/troptions/real-estate",              cat: "Assets" },
  { name: "Solar Energy",      href: "/troptions/solar",                    cat: "Assets" },
  { name: "Mobile Medical",    href: "/troptions/mobile-medical",           cat: "Services" },
  { name: "University",        href: "/troptions/university",               cat: "Services" },
  { name: "Golf & Lifestyle",  href: "/troptions/ecosystem",                cat: "Services" },
  { name: "NIL Platform",      href: "/troptions/nil",                      cat: "Services" },
  { name: "Neobank",           href: "/troptions/neobank",                  cat: "Finance" },
  { name: "Carbon Credits",    href: "/troptions/carbon",                   cat: "Finance" },
  { name: "Treasury",          href: "/troptions/treasury",                 cat: "Finance" },
  { name: "Genius Yield",      href: "/troptions/genius-yield-opportunity", cat: "Finance" },
  { name: "Xchange",           href: "/exchange-os",                        cat: "Infrastructure" },
  { name: "XRPL Bridge",       href: "/troptions/xrpl-platform",            cat: "Infrastructure" },
  { name: "Stellar Bridge",    href: "/troptions/stellar",                  cat: "Infrastructure" },
  { name: "Wallet Hub",        href: "/troptions/wallet-hub",               cat: "Infrastructure" },
  { name: "Payment Rails",     href: "/troptions/payment-rails",            cat: "Infrastructure" },
  { name: "Settlement",        href: "/troptions/settlement",               cat: "Infrastructure" },
  { name: "Compliance",        href: "/troptions/compliance",               cat: "Compliance" },
  { name: "KYC",               href: "/troptions/kyc",                      cat: "Compliance" },
  { name: "Wallet Forensics",  href: "/troptions/wallet-forensics",         cat: "Compliance" },
  { name: "Anti-IFT",          href: "/troptions/anti-illicit-finance",     cat: "Compliance" },
  { name: "Proof of Funds",    href: "/troptions/verification",             cat: "Proof" },
  { name: "Proof Room",        href: "/troptions/proof",                    cat: "Proof" },
  { name: "CIS Package",       href: "/troptions/cis",                      cat: "Proof" },
  { name: "Stablecoins",       href: "/troptions/stablecoins",              cat: "Issuance" },
  { name: "RWA Platform",      href: "/troptions/rwa",                      cat: "Technology" },
  { name: "Sovereign AI",      href: "/troptions/sovereign-ai",             cat: "Technology" },
  { name: "Layer 1",           href: "/troptions/layer1",                   cat: "Technology" },
  { name: "Cross-Rail",        href: "/troptions/cross-rail",               cat: "Technology" },
  { name: "Public Benefit",    href: "/troptions/public-benefit",           cat: "Impact" },
  { name: "Media",             href: "/troptions/media",                    cat: "Media" },
  { name: "Momentum / Sports", href: "/troptions/momentum",                 cat: "Media" },
  { name: "Institutional",     href: "/troptions/institutional",            cat: "Access" },
  { name: "Broker Dealer",     href: "/troptions/broker-dealer",            cat: "Access" },
  { name: "POF Submit",        href: "/troptions/pof/submit",               cat: "Access" },
  { name: "RWA Intake",        href: "/troptions/rwa/intake",               cat: "Access" },
  { name: "PayOps",            href: "/troptions/payments",                 cat: "Access" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function TroptionsInstitutionalPage() {
  return (
    <div style={{ background: G.bg, color: G.text, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ borderBottom: `1px solid ${G.border}`, background: G.bg, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/troptions" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <Image src="/assets/troptions/logos/troptions-primary-official.jpg" alt="TROPTIONS" width={34} height={34} style={{ objectFit: "contain" }} priority />
            <span style={{ fontFamily: serif, fontSize: "1rem", letterSpacing: "0.1em", color: G.navyD, fontWeight: 700, textTransform: "uppercase" }}>TROPTIONS</span>
          </Link>
          <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
            {[
              { label: "About",       href: "#about" },
              { label: "Technology",  href: "/troptions/layer1" },
              { label: "Exchange",    href: "/exchange-os" },
              { label: "Proof",       href: "/troptions/verification" },
              { label: "Stablecoins", href: "/troptions/stablecoins" },
              { label: "History",     href: "/troptions/history" },
              { label: "Contact",     href: "/troptions/contact" },
            ].map(n => (
              <Link key={n.label} href={n.href} style={{ color: G.text2, fontSize: "0.85rem", textDecoration: "none" }}>
                {n.label}
              </Link>
            ))}
            <Link href="/portal/troptions/dashboard" style={{ background: G.navy, color: "#fff", padding: "0.4rem 1.1rem", borderRadius: 3, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
              Client Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* MASTHEAD */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "4rem 2rem 3rem", background: G.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: serif, fontSize: "0.75rem", letterSpacing: "0.3em", color: G.gold, textTransform: "uppercase", marginBottom: "1rem" }}>
              Est. 2003 &nbsp;&middot;&nbsp; Globally Recognized Trade Currency
            </p>
            <h1 style={{ fontFamily: serif, fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, lineHeight: 1.18, color: G.navyD, marginBottom: "1.5rem", maxWidth: 680 }}>
              The Institutional Operating System<br />for the Real Economy
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.82, color: G.text2, maxWidth: 600, marginBottom: "1.25rem" }}>
              TROPTIONS is a globally recognized trade currency founded in 2003 and deployed across real estate, healthcare, education, and finance. Institutional-grade technology. Documented proof. Operational today.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.82, color: G.text2, maxWidth: 600, marginBottom: "2rem", borderLeft: `3px solid ${G.gold}`, paddingLeft: "1rem" }}>
              TROPTIONS is the institutional operating system for tokenized markets. It verifies tokens, proves mints, reviews wallet authorities, maps liquidity readiness, monitors markets, and controls launch approvals across XRPL and Solana — giving every project a proof-first path from idea to institutional-grade operation.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <Link href="/portal/troptions/dashboard" style={{ background: G.navy, color: "#fff", padding: "0.7rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
                Access Client Portal
              </Link>
              <Link href="/troptions/institutional" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.7rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
                Institutional Inquiry
              </Link>
              <Link href="/troptions/cis" style={{ color: G.text2, padding: "0.7rem 1.25rem", fontSize: "0.88rem", textDecoration: "underline" }}>
                Download CIS Package
              </Link>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="https://troptionsexchange.unykorn.org/exchange-os" target="_blank" rel="noopener noreferrer" style={{ color: G.gold, fontSize: "0.85rem", textDecoration: "underline", fontWeight: 600 }}>
                View Exchange OS →
              </a>
              <a href="https://troptionsexchange.unykorn.org/exchange-os/partner-demo" target="_blank" rel="noopener noreferrer" style={{ color: G.text2, fontSize: "0.85rem", textDecoration: "underline" }}>
                Partner Demo →
              </a>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Image
              src="/assets/troptions/logos/troptions-primary-official.jpg"
              alt="TROPTIONS Official Mark"
              width={160}
              height={160}
              style={{ objectFit: "contain", border: `1px solid ${G.border}`, padding: "1rem", background: G.bg }}
              priority
            />
          </div>
        </div>
      </section>

      {/* KEY METRICS */}
      <section style={{ borderBottom: `1px solid ${G.border}`, background: G.bg2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", display: "flex", flexWrap: "wrap" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ flex: "1 1 130px", padding: "1.75rem 1.5rem", borderRight: i < STATS.length - 1 ? `1px solid ${G.border}` : undefined, textAlign: "center" }}>
              <div style={{ fontFamily: serif, fontSize: "clamp(1.5rem,2.5vw,2rem)", color: G.navyD, fontWeight: 400 }}>{s.n}</div>
              <div style={{ fontSize: "0.72rem", color: G.text3, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.3rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ borderBottom: `1px solid ${G.border}`, padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "5rem", alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 400, color: G.navyD, marginBottom: "1.75rem", lineHeight: 1.3 }}>
              A globally recognized trade currency with twenty-two years of real-economy deployment.
            </h2>
            <div style={{ fontSize: "0.97rem", lineHeight: 1.88, color: G.text2, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p>
                TROPTIONS was founded in 2003 on a singular premise: that trade itself — commerce, services, property, healthcare — can be denominated in a non-fiat currency that market participants control. That premise has been validated in production across real estate transactions, mobile medical clinic deployments, golf sponsorships, and education programs.
              </p>
              <p>
                Today, TROPTIONS operates an institutional-grade technology stack. The Sovereign Rust Layer 1 — 27 production crates across five execution tiers — provides the consensus, runtime, and persistence backbone. Bridge infrastructure connects to the XRP Ledger and Stellar Network, where TROPTIONS-branded IOUs and four major stablecoins have been issued and verified on mainnet.
              </p>
              <p>
                The proof infrastructure is built to institutional standards: Chainlink-validated custodial receipts, on-chain XRPL transaction hashes, wallet control proofs, and a $175M USDC trade desk position are all documented and cross-referenced. No simulated claims. No marketing assertions without a verifiable source.
              </p>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem", borderTop: `1px solid ${G.border}`, paddingTop: "1.5rem", flexWrap: "wrap" }}>
              <Link href="/troptions/history"      style={{ color: G.navy, fontSize: "0.88rem", textDecoration: "underline" }}>Full History (2003–Present)</Link>
              <Link href="/troptions/capabilities" style={{ color: G.navy, fontSize: "0.88rem", textDecoration: "underline" }}>Capabilities Overview</Link>
              <Link href="/troptions/institutional" style={{ color: G.navy, fontSize: "0.88rem", textDecoration: "underline" }}>Institutional Access</Link>
            </div>
          </div>
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <tbody>
                {[
                  { k: "Founded",     v: "2003 — Atlanta, GA" },
                  { k: "Ticker",      v: "TROPTIONS (XRPL · Stellar)" },
                  { k: "Issuer",      v: "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3" },
                  { k: "Supply",      v: "100,000,000 TROPTIONS" },
                  { k: "Stablecoins", v: "USDC · USDT · DAI · EURC" },
                  { k: "Layer 1",     v: "Sovereign Rust — 27 Crates" },
                  { k: "Verticals",   v: "33+ Deployed Sectors" },
                  { k: "Trade Desk",  v: "$175M USDC Documented" },
                ].map(r => (
                  <tr key={r.k} style={{ borderBottom: `1px solid ${G.border2}` }}>
                    <td style={{ padding: "0.65rem 1.5rem 0.65rem 0", color: G.text3, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", verticalAlign: "top" }}>{r.k}</td>
                    <td style={{ padding: "0.65rem 0", color: G.text, fontFamily: serif }}>{r.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "1.5rem", padding: "1rem", background: G.bg3, borderLeft: `3px solid ${G.navy}` }}>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.7, color: G.text2, margin: 0 }}>
                TROPTIONS is not publicly traded. Participation is through direct engagement with the institutional platform, trade desk, or ecosystem partnership program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REAL-WORLD DEPLOYMENTS */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "4.5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.3rem,2vw,1.7rem)", fontWeight: 400, color: G.navyD, marginBottom: "0.5rem" }}>
              Real-World Deployments
            </h2>
            <p style={{ color: G.text2, fontSize: "0.92rem" }}>
              TROPTIONS has been operated, branded, and deployed in production across the following verticals.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5rem" }}>
            {[
              { label: "Healthcare",        name: "Mobile Medical Clinic",  desc: "Full-scale mobile medical clinic with services accepted in TROPTIONS. Proven real-economy utility at point of care.",                                          href: "/troptions/mobile-medical", status: "Operational" },
              { label: "Sports & Lifestyle", name: "TROPTIONS Golf",         desc: "Golf events, tournaments, and sponsorships powered by the TROPTIONS mark. Premium lifestyle vertical with documented events.",                                   href: "/troptions/ecosystem",      status: "Operational" },
              { label: "Education",          name: "TROPTIONS University",   desc: "Education platform providing curriculum, certifications, and financial literacy infrastructure within the ecosystem.",                                           href: "/troptions/university",     status: "Operational" },
              { label: "Exchange",           name: "TROPTIONS Exchange OS",   desc: "Institutional launch-control, DEX integration, OTC desk, proof, compliance, and multi-chain settlement rails across XRPL, Solana, and x402.",          href: "/exchange-os",              status: "Operational" },
            ].map(d => (
              <div key={d.name} style={{ border: `1px solid ${G.border}`, padding: "1.5rem", background: G.bg }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.7rem", color: G.text3, textTransform: "uppercase", letterSpacing: "0.12em" }}>{d.label}</span>
                  <span style={{ fontSize: "0.68rem", color: G.green, border: `1px solid ${G.greenL}`, padding: "0.15rem 0.5rem", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>{d.status}</span>
                </div>
                <h3 style={{ fontFamily: serif, fontSize: "1.05rem", color: G.navyD, marginBottom: "0.65rem" }}>{d.name}</h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: G.text2, marginBottom: "1rem" }}>{d.desc}</p>
                <Link href={d.href} style={{ color: G.navy, fontSize: "0.82rem", textDecoration: "underline" }}>Learn more</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "4.5rem 2rem", background: G.bg2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.3rem,2vw,1.75rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.25 }}>
              Sovereign Rust Layer 1 — 27 Production Crates
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.85, color: G.text2, marginBottom: "1.5rem" }}>
              A purpose-built blockchain written in Rust from first principles. Five execution tiers cover the full lifecycle from peer-to-peer propagation through cryptographic verification, BFT consensus, deterministic state execution, and atomic persistence. Post-quantum cryptography, NIL registry, RWA custody, and an AMM protocol all settle on the same closed-loop system.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.75rem" }}>
              {["27 Crates","Ed25519","Post-Quantum","BFT Finality","AMM Built-in","NIL Registry","RWA Module","Agora Governance","XRPL Bridge","Stellar Bridge"].map(t => (
                <span key={t} style={{ background: G.bg3, border: `1px solid ${G.border}`, color: G.text2, padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}>{t}</span>
              ))}
            </div>
            <Link href="/troptions/layer1" style={{ color: G.navy, fontSize: "0.9rem", textDecoration: "underline" }}>View full architecture documentation</Link>
          </div>
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${G.border}` }}>
                  <th style={{ padding: "0.6rem 0.75rem 0.6rem 0", textAlign: "left", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: G.text3, fontWeight: 600 }}>Layer</th>
                  <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: G.text3, fontWeight: 600 }}>Role</th>
                  <th style={{ padding: "0.6rem 0 0.6rem 0.75rem", textAlign: "left", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: G.text3, fontWeight: 600 }}>Function</th>
                </tr>
              </thead>
              <tbody>
                {PIPELINE.map((p, i) => (
                  <tr key={p.code} style={{ borderBottom: `1px solid ${G.border2}`, background: i % 2 === 0 ? "transparent" : G.bg3 }}>
                    <td style={{ padding: "0.75rem 0.75rem 0.75rem 0", fontFamily: mono, fontSize: "0.82rem", color: G.navyD, whiteSpace: "nowrap" }}>{p.code}</td>
                    <td style={{ padding: "0.75rem", color: G.text3, fontSize: "0.8rem", whiteSpace: "nowrap" }}>{p.role}</td>
                    <td style={{ padding: "0.75rem 0 0.75rem 0.75rem", color: G.text2, lineHeight: 1.5, fontSize: "0.82rem" }}>{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* XRPL MAINNET ISSUANCES */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "4.5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: "clamp(1.3rem,2vw,1.75rem)", fontWeight: 400, color: G.navyD, marginBottom: "0.35rem" }}>
                XRPL Mainnet Issuances
              </h2>
              <p style={{ color: G.text2, fontSize: "0.88rem" }}>
                Four stablecoins issued and publicly verifiable on the XRP Ledger and Stellar Network. All transaction hashes are on-chain.
              </p>
            </div>
            <span style={{ fontSize: "0.72rem", color: G.text3, border: `1px solid ${G.border}`, padding: "0.3rem 0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>XRP Ledger &middot; Mainnet</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${G.border}` }}>
                  {["Asset","Supply Issued","Peg","Issuer","XRPL Transaction Hash","Status"].map(h => (
                    <th key={h} style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: G.text3, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STABLECOINS.map((s, i) => (
                  <tr key={s.sym} style={{ borderBottom: `1px solid ${G.border2}`, background: i % 2 === 0 ? "transparent" : G.bg2 }}>
                    <td style={{ padding: "0.85rem 0.75rem", fontFamily: serif, fontWeight: 600, color: G.navyD }}>{s.sym}</td>
                    <td style={{ padding: "0.85rem 0.75rem", fontFamily: mono, color: G.text }}>{s.supply}</td>
                    <td style={{ padding: "0.85rem 0.75rem", color: G.text2 }}>1 {s.peg}</td>
                    <td style={{ padding: "0.85rem 0.75rem", color: G.text2 }}>{s.issuer}</td>
                    <td style={{ padding: "0.85rem 0.75rem" }}>
                      <a href={`https://xrpscan.com/tx/${s.tx}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: "0.78rem", color: G.navy, textDecoration: "underline" }}>
                        {s.tx.slice(0, 12)}&hellip;{s.tx.slice(-10)}
                      </a>
                    </td>
                    <td style={{ padding: "0.85rem 0.75rem", color: G.green, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>&#10003; Live</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "1.25rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link href="/troptions/verification"  style={{ color: G.navy, fontSize: "0.85rem", textDecoration: "underline" }}>Full Proof of Issuance</Link>
            <Link href="/troptions/stablecoins"   style={{ color: G.navy, fontSize: "0.85rem", textDecoration: "underline" }}>Stablecoin Registry</Link>
            <Link href="/troptions/wallets"        style={{ color: G.navy, fontSize: "0.85rem", textDecoration: "underline" }}>Live Wallet Infrastructure</Link>
            <Link href="/troptions/xrpl-platform"  style={{ color: G.navy, fontSize: "0.85rem", textDecoration: "underline" }}>XRPL Market Data</Link>
          </div>
        </div>
      </section>

      {/* PROOF OF FUNDS */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "4.5rem 2rem", background: G.bg2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.3rem,2vw,1.75rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.25 }}>
              $175 Million USDC Trade Desk Position
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.85, color: G.text2, marginBottom: "1.75rem" }}>
              The Bryan Stone USDC 175M trade desk position is documented through Chainlink price validation, XRPL real-issuer proof, wallet control signatures, and a CIS compliance package. Every layer of the proof chain is cross-referenced and machine-verifiable.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem", marginBottom: "1.5rem" }}>
              <tbody>
                {[
                  { label: "Chainlink Validation",     status: "Verified" },
                  { label: "XRPL Real-Issuer Proof",   status: "Verified" },
                  { label: "Wallet Control Signature", status: "Verified" },
                  { label: "CIS Package",              status: "Compiled" },
                  { label: "Custodial Receipt",        status: "Generated" },
                ].map(r => (
                  <tr key={r.label} style={{ borderBottom: `1px solid ${G.border2}` }}>
                    <td style={{ padding: "0.6rem 0", color: G.text2 }}>{r.label}</td>
                    <td style={{ padding: "0.6rem 0", textAlign: "right", color: G.green, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>&#10003; {r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/proofs/bryan-stone-usdc-175m.html" style={{ background: G.navy, color: "#fff", padding: "0.65rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>Open Proof Package</Link>
              <Link href="/troptions/pof" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.65rem 1.5rem", fontSize: "0.85rem", textDecoration: "none", borderRadius: 3 }}>POF Downloads</Link>
            </div>
          </div>
          <div style={{ border: `1px solid ${G.border}`, background: G.bg, padding: "1.75rem" }}>
            <div style={{ borderBottom: `1px solid ${G.border}`, paddingBottom: "1.25rem", marginBottom: "1.25rem" }}>
              <div style={{ fontFamily: serif, fontSize: "1.8rem", color: G.navyD }}>$175,000,000</div>
              <div style={{ fontSize: "0.72rem", color: G.text3, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.25rem" }}>USDC &middot; Trade Desk Position</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <tbody>
                {[
                  { k: "Account",   v: "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
                  { k: "Asset",     v: "USDC (Circle — Official Issuer)" },
                  { k: "Validated", v: "Chainlink + XRPL + CIS" },
                  { k: "Ref",       v: "Bryan Stone — USDC 175M" },
                  { k: "TX Hash",   v: "CD7271\u20261E642" },
                ].map(r => (
                  <tr key={r.k} style={{ borderBottom: `1px solid ${G.border2}` }}>
                    <td style={{ padding: "0.55rem 1rem 0.55rem 0", color: G.text3, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", verticalAlign: "top" }}>{r.k}</td>
                    <td style={{ padding: "0.55rem 0", color: G.text, fontFamily: mono, fontSize: "0.82rem", wordBreak: "break-all" }}>{r.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "4.5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(1.3rem,2vw,1.75rem)", fontWeight: 400, color: G.navyD, marginBottom: "0.5rem" }}>
            Ecosystem — 33+ Operational Verticals
          </h2>
          <p style={{ color: G.text2, fontSize: "0.9rem", marginBottom: "2.5rem" }}>
            Every platform below is a live, deployable route within the TROPTIONS institutional operating system.
          </p>
          {(["Assets","Services","Finance","Infrastructure","Compliance","Proof","Issuance","Technology","Impact","Media","Access"] as const).map(cat => {
            const items = VERTICALS.filter(v => v.cat === cat);
            if (!items.length) return null;
            return (
              <div key={cat} style={{ marginBottom: "1.75rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "baseline" }}>
                <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", color: G.text3, minWidth: 100 }}>{cat}</span>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {items.map(v => (
                    <Link key={v.name} href={v.href} style={{ fontSize: "0.88rem", color: G.navy, textDecoration: "underline", whiteSpace: "nowrap" }}>
                      {v.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderBottom: `1px solid ${G.border}`, padding: "5rem 2rem", background: G.bg3 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 400, color: G.navyD, marginBottom: "1.25rem", lineHeight: 1.3 }}>
            Built for institutional participants.<br />Proof-backed. Always.
          </h2>
          <p style={{ color: G.text2, fontSize: "0.98rem", lineHeight: 1.85, marginBottom: "2.5rem" }}>
            Whether you are conducting diligence, seeking trade desk access, or deploying the TROPTIONS mark in your sector — the platform, proof room, and institutional stack are operational now.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/portal/troptions/dashboard" style={{ background: G.navy, color: "#fff", padding: "0.85rem 2.25rem", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>Open Client Portal</Link>
            <Link href="/troptions/institutional"    style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.85rem 2.25rem", fontSize: "0.9rem", textDecoration: "none", borderRadius: 3 }}>Institutional Inquiry</Link>
            <Link href="/troptions/cis"              style={{ color: G.text2, padding: "0.85rem 1.5rem", fontSize: "0.9rem", textDecoration: "underline" }}>CIS Package</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "2rem", borderTop: `1px solid ${G.border}`, background: G.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Ecosystem cross-links */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", paddingBottom: "1.5rem", marginBottom: "1.5rem", borderBottom: `1px solid ${G.border2}` }}>
            {[
              { section: "Exchange OS", links: [
                { label: "Exchange OS Home",  href: "https://troptionsexchange.unykorn.org/exchange-os" },
                { label: "Control Center",    href: "https://troptionsexchange.unykorn.org/exchange-os/control-center" },
                { label: "Readiness",         href: "https://troptionsexchange.unykorn.org/exchange-os/readiness" },
                { label: "Status",            href: "https://troptionsexchange.unykorn.org/exchange-os/status" },
              ]},
              { section: "Launch & Mint", links: [
                { label: "DONK AI Launcher",   href: "https://launch.unykorn.org" },
                { label: "Mint Registry",      href: "https://launch.unykorn.org/mints" },
                { label: "System Truth",       href: "https://launch.unykorn.org/system/truth" },
              ]},
              { section: "TROPTIONS Network", links: [
                { label: "TROPTIONS Live",     href: "https://troptionslive.unykorn.org/sports" },
                { label: "GoatX",             href: "https://goat.unykorn.org" },
                { label: "WhichWay.live",     href: "https://fifa.unykorn.org" },
                { label: "UNYKORN Portfolio", href: "https://portfolio.unykorn.org" },
              ]},
            ].map(col => (
              <div key={col.section}>
                <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: G.text3, marginBottom: "0.65rem", fontWeight: 600 }}>{col.section}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {col.links.map(l => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: G.text2, textDecoration: "none" }}>{l.label} →</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1.25rem" }}>
            <div>
              <span style={{ fontFamily: serif, fontSize: "0.88rem", letterSpacing: "0.1em", color: G.navyD, fontWeight: 600, textTransform: "uppercase" }}>TROPTIONS</span>
              <span style={{ color: G.text3, fontSize: "0.8rem", marginLeft: "0.75rem" }}>Established 2003 &middot; Atlanta, GA</span>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {[
                { label: "Layer 1",  href: "/troptions/layer1" },
                { label: "Proof",    href: "/troptions/verification" },
                { label: "Wallets",  href: "/troptions/wallets" },
                { label: "History",  href: "/troptions/history" },
                { label: "Legal",    href: "/troptions/legal" },
                { label: "Contact",  href: "/troptions/contact" },
              ].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: "0.82rem", color: G.text2, textDecoration: "none" }}>{l.label}</Link>
              ))}
            </div>
            <p style={{ fontSize: "0.78rem", color: G.text3 }}>
              &copy; 2003&ndash;2026 TROPTIONS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}