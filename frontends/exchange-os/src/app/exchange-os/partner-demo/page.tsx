import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TROPTIONS Exchange OS — Partner Demo",
  description:
    "The institutional control tower for tokenized markets. Verify before launching. Prove before promoting. Truth before trust. TROPTIONS Exchange OS.",
  metadataBase: new URL("https://troptionsexchange.unykorn.org"),
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
  red:     "#7A1A1A",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";
const mono  = "'Courier New',Courier,monospace";

const PARTNER_HERO = {
  headline: "TROPTIONS Exchange OS",
  subheadline: "The control tower for tokenized markets",
  description:
    "Not another DEX. Not another launchpad. The institutional operating system that verifies, proves, monitors, and controls what claims are allowed before serious volume goes live.",
  truthBanner:
    "TROPTIONS provides Exchange OS infrastructure only. It does not operate an exchange, custody assets, make markets, promote tokens, underwrite offerings, provide investment advice, or guarantee volume, liquidity, listings, returns, or price performance.",
};

const WHAT_IS_DIFFERENT = [
  {
    title: "Verify before launching",
    description:
      "Entity review, wallet authority check, legal memo, KYC/AML, tokenomics review — before anything is published.",
  },
  {
    title: "Prove before promoting",
    description:
      "Every token needs a proof packet. Mint address, tx signature, metadata URI, collection verification.",
  },
  {
    title: "Truth before trust",
    description:
      "Every system is labeled: Live / Testnet / Preview / Blocked / Gated. No overclaiming.",
  },
  {
    title: "Control above the DEXs",
    description:
      "Jupiter, Raydium, Meteora, Orca, OpenBook are the rails. TROPTIONS is the operating system around them.",
  },
  {
    title: "Monitor after launch",
    description:
      "LP removal alerts, mint authority changes, whale concentration, abnormal volume, oracle deviation.",
  },
  {
    title: "Non-custodial always",
    description:
      "Users sign in their own wallet. TROPTIONS never holds, controls, or accesses user assets.",
  },
];

const DEX_TABLE = [
  { system: "Jupiter",  role: "Route intelligence and swap routing visibility" },
  { system: "Raydium",  role: "LP creation, pool proof, liquidity tracking" },
  { system: "Meteora",  role: "Launch and liquidity strategy" },
  { system: "Orca",     role: "Pool and liquidity monitoring" },
  { system: "Birdeye",  role: "Market visibility and analytics" },
  { system: "DexScreener", role: "Public chart visibility" },
  { system: "Solscan",  role: "Token/mint proof" },
  { system: "Metaplex", role: "Collection and metadata verification" },
  { system: "Helius",   role: "RPC and on-chain verification" },
];

const IS_NOT = [
  "An exchange operator",
  "A broker/dealer",
  "A market maker",
  "A liquidity provider",
  "A custodian",
  "An underwriter",
  "Legal counsel",
  "An investment adviser",
  "A token promoter",
  "A guaranteed listing provider",
  "A guaranteed volume provider",
];

export default function PartnerDemoPage() {
  return (
    <div
      style={{
        background: G.bg,
        color: G.text,
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          borderBottom: `1px solid ${G.border}`,
          background: G.bg,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <Link
            href="/exchange-os"
            style={{
              fontFamily: serif,
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              color: G.navyD,
              fontWeight: 700,
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            ← Exchange OS
          </Link>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link
              href="/exchange-os/status"
              style={{ color: G.text2, fontSize: "0.82rem", textDecoration: "none" }}
            >
              Status
            </Link>
            <Link
              href="/exchange-os/control-center"
              style={{ color: G.text2, fontSize: "0.82rem", textDecoration: "none" }}
            >
              Control Center
            </Link>
            <Link
              href="https://troptions.unykorn.org/troptions"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: G.navy,
                color: "#fff",
                padding: "0.4rem 1.1rem",
                borderRadius: 3,
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              TROPTIONS Institutional
            </Link>
          </div>
        </div>
      </nav>

      {/* TRUTH BANNER */}
      <div
        style={{
          background: G.bg3,
          borderBottom: `1px solid ${G.border}`,
          padding: "0.85rem 2rem",
        }}
      >
        <p
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            fontSize: "0.75rem",
            color: G.text3,
            lineHeight: 1.65,
            fontStyle: "italic",
          }}
        >
          <strong style={{ color: G.red, fontStyle: "normal" }}>
            DISCLOSURE:{" "}
          </strong>
          {PARTNER_HERO.truthBanner}
        </p>
      </div>

      {/* HERO */}
      <section
        style={{
          borderBottom: `1px solid ${G.border}`,
          padding: "5rem 2rem 4rem",
          background: G.bg,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: "0.72rem",
              letterSpacing: "0.3em",
              color: G.gold,
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Partner Demo &nbsp;&middot;&nbsp; Institutional Briefing
          </p>
          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(2rem,4vw,3.2rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              color: G.navyD,
              marginBottom: "1rem",
              maxWidth: 740,
            }}
          >
            {PARTNER_HERO.headline}
          </h1>
          <p
            style={{
              fontFamily: serif,
              fontSize: "1.35rem",
              color: G.gold,
              marginBottom: "1.75rem",
              fontStyle: "italic",
            }}
          >
            {PARTNER_HERO.subheadline}
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.82,
              color: G.text2,
              maxWidth: 680,
              marginBottom: "2.5rem",
            }}
          >
            {PARTNER_HERO.description}
          </p>
          <div
            style={{
              padding: "1.25rem 1.5rem",
              background: G.navyD,
              color: "#fff",
              maxWidth: 680,
              marginBottom: "2.5rem",
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: "1.1rem",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              &ldquo;A normal DEX lets people swap tokens. A normal launchpad
              lets people create tokens.
              <br />
              <br />
              TROPTIONS Exchange OS verifies the token, proves the mint, reviews
              the wallets, checks the authorities, maps the liquidity, monitors
              the market, and controls what claims are allowed before serious
              volume goes live.&rdquo;
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/exchange-os"
              style={{
                background: G.navy,
                color: "#fff",
                padding: "0.75rem 1.75rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: 3,
              }}
            >
              Exchange OS Home
            </Link>
            <Link
              href="/exchange-os/control-center"
              style={{
                border: `1px solid ${G.navy}`,
                color: G.navy,
                padding: "0.75rem 1.75rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: 3,
              }}
            >
              Control Center
            </Link>
            <Link
              href="https://troptions.unykorn.org/troptions"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: G.text2,
                padding: "0.75rem 1.25rem",
                fontSize: "0.88rem",
                textDecoration: "underline",
              }}
            >
              TROPTIONS Institutional →
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT IS DIFFERENT */}
      <section
        style={{
          borderBottom: `1px solid ${G.border}`,
          padding: "5rem 2rem",
          background: G.bg2,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.3rem,2.5vw,1.9rem)",
              fontWeight: 400,
              color: G.navyD,
              marginBottom: "0.5rem",
            }}
          >
            What makes Exchange OS different
          </h2>
          <p
            style={{
              color: G.text2,
              fontSize: "0.92rem",
              marginBottom: "3rem",
            }}
          >
            Six operating principles that separate a control tower from a commodity launchpad.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "1.5px",
              background: G.border,
            }}
          >
            {WHAT_IS_DIFFERENT.map((item) => (
              <div
                key={item.title}
                style={{
                  background: G.bg,
                  padding: "2rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: "1.05rem",
                    color: G.navyD,
                    marginBottom: "0.65rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                    color: G.text2,
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEX INTEGRATION TABLE */}
      <section
        style={{
          borderBottom: `1px solid ${G.border}`,
          padding: "5rem 2rem",
          background: G.bg,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.3rem,2.5vw,1.9rem)",
              fontWeight: 400,
              color: G.navyD,
              marginBottom: "0.5rem",
            }}
          >
            How TROPTIONS works with Solana DEXs
          </h2>
          <p
            style={{
              color: G.text2,
              fontSize: "0.92rem",
              marginBottom: "2.5rem",
            }}
          >
            The DEXs are the rails. TROPTIONS is the operating system above them.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}
            >
              <thead>
                <tr style={{ borderBottom: `2px solid ${G.border}` }}>
                  <th
                    style={{
                      padding: "0.7rem 1rem 0.7rem 0",
                      textAlign: "left",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: G.text3,
                      fontWeight: 600,
                    }}
                  >
                    Solana System
                  </th>
                  <th
                    style={{
                      padding: "0.7rem 0",
                      textAlign: "left",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: G.text3,
                      fontWeight: 600,
                    }}
                  >
                    TROPTIONS Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEX_TABLE.map((row, i) => (
                  <tr
                    key={row.system}
                    style={{
                      borderBottom: `1px solid ${G.border2}`,
                      background: i % 2 === 0 ? "transparent" : G.bg2,
                    }}
                  >
                    <td
                      style={{
                        padding: "0.85rem 1rem 0.85rem 0",
                        fontFamily: mono,
                        fontSize: "0.85rem",
                        color: G.navyD,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.system}
                    </td>
                    <td
                      style={{
                        padding: "0.85rem 0",
                        color: G.text2,
                        lineHeight: 1.55,
                      }}
                    >
                      {row.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHAT TROPTIONS IS NOT */}
      <section
        style={{
          borderBottom: `1px solid ${G.border}`,
          padding: "5rem 2rem",
          background: G.bg3,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          <div>
            <h2
              style={{
                fontFamily: serif,
                fontSize: "clamp(1.3rem,2vw,1.75rem)",
                fontWeight: 400,
                color: G.navyD,
                marginBottom: "1.5rem",
              }}
            >
              What TROPTIONS is <em>not</em>
            </h2>
            <p style={{ fontSize: "0.92rem", color: G.text2, lineHeight: 1.75, marginBottom: "1.75rem" }}>
              Clarity is institutional credibility. These are not disclaimers — they are the architecture of trust.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {IS_NOT.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.9rem",
                    color: G.text2,
                    padding: "0.5rem 0",
                    borderBottom: `1px solid ${G.border2}`,
                  }}
                >
                  <span style={{ color: G.red, fontSize: "0.75rem", fontWeight: 700 }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2
              style={{
                fontFamily: serif,
                fontSize: "clamp(1.3rem,2vw,1.75rem)",
                fontWeight: 400,
                color: G.navyD,
                marginBottom: "1.5rem",
              }}
            >
              What TROPTIONS <em>is</em>
            </h2>
            <p style={{ fontSize: "0.92rem", color: G.text2, lineHeight: 1.75, marginBottom: "1.75rem" }}>
              A control layer, not a marketplace. Infrastructure, not an operator.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "Institutional Exchange OS and control layer",
                "Launch-control system",
                "Proof packet generator",
                "Issuer and wallet authority verifier",
                "Solana / XRPL intelligence layer",
                "Non-custodial route preparation layer",
                "Liquidity-readiness monitor",
                "Partner onboarding system",
                "Launch committee system",
                "Truth-labeling system",
                "Market monitoring and alerting layer",
                "Institutional proof room",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.9rem",
                    color: G.text2,
                    padding: "0.5rem 0",
                    borderBottom: `1px solid ${G.border2}`,
                  }}
                >
                  <span style={{ color: G.green, fontSize: "0.75rem", fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* THE HONEST TAGLINE */}
      <section
        style={{
          borderBottom: `1px solid ${G.border}`,
          padding: "5rem 2rem",
          background: G.navyD,
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: serif,
              fontSize: "0.72rem",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}
          >
            The Honest Tagline
          </p>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.5rem,3vw,2.2rem)",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#fff",
              marginBottom: "3rem",
            }}
          >
            TROPTIONS is becoming the control tower for tokenized markets.
            <br />
            It verifies before it launches.
            <br />
            It proves before it promotes.
            <br />
            It labels the truth before it asks for trust.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/exchange-os"
              style={{
                background: "#fff",
                color: G.navyD,
                padding: "0.85rem 2.25rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: 3,
              }}
            >
              View Exchange OS
            </Link>
            <Link
              href="https://troptions.unykorn.org/troptions"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                padding: "0.85rem 2.25rem",
                fontSize: "0.88rem",
                textDecoration: "none",
                borderRadius: 3,
              }}
            >
              TROPTIONS Institutional
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "2rem",
          borderTop: `1px solid ${G.border}`,
          background: G.bg,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: serif,
                fontSize: "0.88rem",
                letterSpacing: "0.1em",
                color: G.navyD,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              TROPTIONS Exchange OS
            </span>
            <span
              style={{ color: G.text3, fontSize: "0.8rem", marginLeft: "0.75rem" }}
            >
              Partner Demo &middot; Institutional Briefing
            </span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              { label: "Exchange OS", href: "/exchange-os" },
              { label: "Status", href: "/exchange-os/status" },
              { label: "Control Center", href: "/exchange-os/control-center" },
              { label: "TROPTIONS Institutional", href: "https://troptions.unykorn.org/troptions" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                style={{ fontSize: "0.82rem", color: G.text2, textDecoration: "none" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: G.text3 }}>
            &copy; 2003&ndash;2026 TROPTIONS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
