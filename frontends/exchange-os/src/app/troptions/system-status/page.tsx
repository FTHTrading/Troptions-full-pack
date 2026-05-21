import Link from "next/link";

export const metadata = {
  title: "System Status | TROPTIONS",
  description:
    "Live status of all TROPTIONS platform modules: APIs, portals, settlement rails, proof infrastructure, and compliance services.",
};

const G = {
  bg: "#FFFFFF", bg2: "#F8F7F4", bg3: "#F2F0EB",
  border: "#D6D1C8", border2: "#E8E4DC",
  text: "#1A1714", text2: "#5C574F", text3: "#8B857C",
  navy: "#1B3259", navyD: "#122040",
  green: "#1A5233", greenL: "#2D7A4F",
  amber: "#7A4F0D",
  red: "#8B1A1A",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";

type StatusType = "Operational" | "Demo / Simulation" | "In Development" | "Documentation Only";

const STATUS_COLORS: Record<StatusType, { text: string; border: string }> = {
  "Operational":          { text: G.green,    border: G.green },
  "Demo / Simulation":    { text: G.amber,    border: G.amber },
  "In Development":       { text: "#1B3259",  border: "#1B3259" },
  "Documentation Only":   { text: G.text3,    border: G.border },
};

interface Module {
  name: string;
  route: string;
  status: StatusType;
  note: string;
}

const MODULES: { category: string; items: Module[] }[] = [
  {
    category: "Core Site",
    items: [
      { name: "TROPTIONS Homepage",        route: "/troptions",                  status: "Operational",        note: "Berkshire-style institutional page. Proof tables, XRPL issuances, contact CTA." },
      { name: "Contact / Inquiry Form",    route: "/troptions/contact",          status: "Operational",        note: "Form posts to /api/troptions/inquiries, writes to SQLite revenue.db." },
      { name: "Verification (XRPL Proof)", route: "/troptions/verification",     status: "Operational",        note: "XRPL issuance TX hashes for USDC/USDT/DAI/EURC. Links to xrpscan.com." },
      { name: "CIS Package Download",      route: "/troptions/cis",              status: "Operational",        note: "Redirects to KYC/CIS PDF in public/troptions/downloads/. File verified on disk." },
      { name: "System Status (this page)", route: "/troptions/system-status",    status: "Operational",        note: "Module status matrix. Updated manually as features ship." },
    ],
  },
  {
    category: "Institutional Sections",
    items: [
      { name: "Institutional Index",       route: "/troptions/institutional",    status: "Operational",        note: "Index page linking all 13 institutional sub-sections." },
      { name: "Platform Overview",         route: "/troptions/institutional/overview", status: "Operational", note: "Full module registry, asset registry, claims, proof status." },
      { name: "Diligence Room",            route: "/troptions/institutional/diligence-room", status: "Operational", note: "Entity docs, POF records, compliance status." },
      { name: "Token Roles",               route: "/troptions/institutional/token-roles", status: "Operational", note: "Governance rights, trustline mechanics, AMM structure." },
      { name: "Legal Disclosures",         route: "/troptions/institutional/disclosures", status: "Operational", note: "Regulatory status and disclaimer package." },
      { name: "Audit Room",                route: "/troptions/institutional/audit-room", status: "Operational", note: "Audit trail access for authorized counterparties." },
    ],
  },
  {
    category: "Compliance & Risk",
    items: [
      { name: "Compliance Framework",      route: "/troptions/compliance",       status: "Operational",        note: "Overview of KYC, KYB, Anti-IFT, wallet forensics, sanctions screening." },
      { name: "KYC Portal",                route: "/portal/troptions/kyc",       status: "Operational",        note: "Gated. Requires login. Identity verification workflow." },
      { name: "Wallet Forensics",          route: "/troptions/wallet-forensics", status: "Operational",        note: "On-chain forensics for XRPL/Stellar/EVM wallets." },
      { name: "Anti-IFT Framework",        route: "/troptions/anti-illicit-finance", status: "Operational",   note: "Transaction monitoring across XRPL, Stellar, EVM, Solana." },
    ],
  },
  {
    category: "Settlement & Assets",
    items: [
      { name: "Settlement Infrastructure", route: "/troptions/settlement",       status: "Operational",        note: "Six rails: XRPL, Stellar, Apostle Chain, EVM, Solana, x402." },
      { name: "XRPL Platform",             route: "/troptions/xrpl-platform",    status: "Operational",        note: "AMM, DEX, IOU issuances, trustline mechanics." },
      { name: "Stablecoins (XRPL IOUs)",   route: "/troptions/stablecoins",      status: "Operational",        note: "USDC, USDT, DAI, EURC — all TX hashes published." },
      { name: "Real-World Assets (RWA)",   route: "/troptions/rwa",              status: "Operational",        note: "Asset class index: real estate, solar, carbon, custody, SBLC." },
      { name: "Layer 1 (Apostle Chain)",   route: "/troptions/layer1",           status: "Operational",        note: "Rust/Axum sovereign L1 at chain_id 7332. Ed25519 settlement." },
      { name: "Proof of Funds (HTML)",     route: "/proofs/bryan-stone-usdc-175m.html", status: "Operational", note: "29KB HTML proof file. Served from public/proofs/." },
      { name: "Proof of Funds (PDF)",      route: "/proofs/troptions-pof-usdc-175m-desk.pdf", status: "Operational", note: "466KB PDF. Served from public/proofs/." },
    ],
  },
  {
    category: "Client Portal",
    items: [
      { name: "Portal Dashboard",          route: "/portal/troptions/dashboard", status: "Operational",        note: "Gated by middleware. Requires troptions_session cookie." },
      { name: "Portal Login",              route: "/troptions/auth/login",       status: "Operational",        note: "Bcrypt password check, SQLite session, cookie-based auth." },
      { name: "Portal KYC",                route: "/portal/troptions/kyc",       status: "Operational",        note: "Identity verification workflow inside gated portal." },
      { name: "Portal Booking",            route: "/portal/troptions/booking",   status: "Demo / Simulation",  note: "Booking form exists. Payment processing not yet connected." },
      { name: "Portal RWA",                route: "/portal/troptions/rwa",       status: "In Development",     note: "RWA intake workflow. Backend schema ready, UI in progress." },
      { name: "Portal SBLC",               route: "/portal/troptions/sblc",      status: "In Development",     note: "SBLC issuance workflow. Rails ready, intake form in progress." },
    ],
  },
  {
    category: "APIs",
    items: [
      { name: "Inquiries API",             route: "/api/troptions/inquiries",    status: "Operational",        note: "POST validates + writes to SQLite. GET is auth-gated." },
      { name: "Auth Login API",            route: "/api/auth/login",             status: "Operational",        note: "Bcrypt verify, session create, cookie set." },
      { name: "Auth Logout API",           route: "/api/auth/logout",            status: "Operational",        note: "Clears session cookie." },
      { name: "Booking API",               route: "/api/troptions/bookings",     status: "Demo / Simulation",  note: "Schema exists in revenue.db. Payment gateway not connected." },
      { name: "Chainlink Report API",      route: "/api/troptions/chainlink",    status: "Operational",        note: "Chainlink fund validator + weekly report scripts exist." },
    ],
  },
];

const LEGEND: { label: StatusType; count: number }[] = Object.keys(STATUS_COLORS).map(k => ({
  label: k as StatusType,
  count: MODULES.flatMap(m => m.items).filter(i => i.status === k).length,
}));

export default function SystemStatusPage() {
  return (
    <div style={{ background: G.bg, color: G.text, minHeight: "100vh", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: "3rem 2rem 2.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: G.text3, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <Link href="/troptions" style={{ color: G.text3, textDecoration: "none" }}>TROPTIONS</Link>
            {" / "}System Status
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.2 }}>
            Platform Module Status
          </h1>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: G.text2, maxWidth: 620, marginBottom: "1.5rem" }}>
            Every module listed below is categorized by its current state. Status is updated manually as features ship. This page does not claim anything operational unless the code proves it through a working page, API route, database write, or verified external link.
          </p>
          {/* Legend */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {LEGEND.map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[l.label].text, display: "inline-block" }} />
                <span style={{ fontSize: "0.8rem", color: G.text2 }}>
                  {l.label}
                  <span style={{ color: G.text3, marginLeft: "0.35rem" }}>({l.count})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modules */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
        {MODULES.map(cat => (
          <div key={cat.category} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: serif, fontSize: "1rem", color: G.navyD, marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${G.border}`, letterSpacing: "0.02em" }}>
              {cat.category}
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "19%" }} />
                <col style={{ width: "14%" }} />
                <col />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: `1px solid ${G.border}` }}>
                  {["Module", "Route", "Status", "Notes"].map(h => (
                    <th key={h} style={{ padding: "0.4rem 0.75rem 0.4rem 0", textAlign: "left", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: G.text3, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cat.items.map(item => {
                  const sc = STATUS_COLORS[item.status];
                  return (
                    <tr key={item.name} style={{ borderBottom: `1px solid ${G.border2}` }}>
                      <td style={{ padding: "0.6rem 0.75rem 0.6rem 0", color: G.text, fontWeight: 500 }}>{item.name}</td>
                      <td style={{ padding: "0.6rem 0.75rem 0.6rem 0" }}>
                        <Link href={item.route} style={{ color: G.navy, fontFamily: "'Courier New',Courier,monospace", fontSize: "0.78rem", textDecoration: "none", wordBreak: "break-all" }}>
                          {item.route}
                        </Link>
                      </td>
                      <td style={{ padding: "0.6rem 0.75rem 0.6rem 0" }}>
                        <span style={{ fontSize: "0.68rem", color: sc.text, border: `1px solid ${sc.border}`, padding: "0.15rem 0.45rem", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.6rem 0", color: G.text2, fontSize: "0.83rem", lineHeight: 1.5 }}>{item.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        <div style={{ marginTop: "2rem", borderTop: `1px solid ${G.border}`, paddingTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/troptions" style={{ color: G.navy, fontSize: "0.88rem", textDecoration: "underline" }}>← Back to TROPTIONS</Link>
          <Link href="/troptions/contact" style={{ color: G.navy, fontSize: "0.88rem", textDecoration: "underline" }}>Contact</Link>
          <Link href="/portal/troptions/dashboard" style={{ color: G.navy, fontSize: "0.88rem", textDecoration: "underline" }}>Client Portal</Link>
        </div>
      </div>
    </div>
  );
}
