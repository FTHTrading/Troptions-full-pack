"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ── tiny helpers ─────────────────────────────────────────────────────────────
const G = {
  gold:  "#C8952A",
  goldL: "#E5B84A",
  navy:  "#07111F",
  navy2: "#0B1F36",
  muted: "#8A94A6",
  line:  "rgba(200,149,42,0.28)",
  green: "#22c55e",
};

const PACKAGES = [
  {
    name: "Starter",
    price: "$299",
    commission: "$60",
    tag: "Easy close",
    bullets: ["Verified listing", "Map pin", "Offer campaign", "30-day activation"],
  },
  {
    name: "Sponsor",
    price: "$599",
    commission: "$120",
    tag: "Most popular",
    bullets: ["Everything in Starter", "Promo video placement", "Vanity phone number", "90-day activation"],
    featured: true,
  },
  {
    name: "Full Partner",
    price: "$1,199",
    commission: "$240",
    tag: "Highest payout",
    bullets: ["Everything in Sponsor", "Square / POS link", "Multilingual AI advisor", "1-year activation"],
  },
];

export default function SalesRepPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", exp: "" });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    // placeholder — swap for a real CRM POST later
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setBusy(false);
  }

  const ready = form.name && form.email && form.phone && form.city;

  return (
    <main style={{ background: G.navy, color: "#F2EEE4", minHeight: "100vh" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav
        style={{
          borderBottom: `1px solid ${G.line}`,
          background: "rgba(7,17,31,0.97)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          padding: "0 1.5rem",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/troptions" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <Image
            src="/assets/troptions/logos/troptions-primary-official.jpg"
            alt="TROPTIONS"
            width={30}
            height={30}
            style={{ borderRadius: 4, objectFit: "cover" }}
            priority
          />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", letterSpacing: "0.2em", color: G.goldL, textTransform: "uppercase", fontWeight: 600 }}>
            TROPTIONS
          </span>
        </Link>
        <a
          href="#apply"
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: G.gold,
            color: "#07111F",
            padding: "0.4rem 1rem",
            borderRadius: 5,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Apply Now
        </a>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ textAlign: "center", padding: "4rem 1.5rem 3rem" }}>
        <div
          style={{
            display: "inline-block",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: G.gold,
            border: `1px solid ${G.line}`,
            padding: "0.3rem 0.9rem",
            borderRadius: 999,
            marginBottom: "1.5rem",
          }}
        >
          Sales Rep Program &nbsp;·&nbsp; Open Enrollment
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#F2EEE4",
            margin: "0 auto 1.25rem",
            maxWidth: 700,
          }}
        >
          Sell TROPTIONS.<br />
          <span style={{ color: G.goldL }}>Earn Real Commissions.</span>
        </h1>

        <p style={{ color: G.muted, fontSize: "1.05rem", maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.75 }}>
          TROPTIONS is a 20-year-old trade currency powering real events, businesses, and real estate.
          You sell activation packages to local businesses — we handle everything else.
        </p>

        {/* 3 quick stats */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { n: "$60–$240", label: "Per sale commission" },
            { n: "2003",     label: "Founded" },
            { n: "1,200+",   label: "Active partners" },
            { n: "5 min",    label: "To pitch a business" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: G.navy2,
                border: `1px solid ${G.line}`,
                borderRadius: 10,
                padding: "1rem 1.5rem",
                minWidth: 130,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: G.goldL, fontFamily: "var(--font-display)" }}>{s.n}</div>
              <div style={{ fontSize: "0.72rem", color: G.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <a
          href="#apply"
          style={{
            display: "inline-block",
            background: G.gold,
            color: "#07111F",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "0.85rem 2.5rem",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "0.85rem",
          }}
        >
          Join the Sales Team →
        </a>
      </section>

      {/* ── PACKAGES ────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            color: "#F2EEE4",
            marginBottom: "0.5rem",
          }}
        >
          What You Sell
        </h2>
        <p style={{ textAlign: "center", color: G.muted, fontSize: "0.9rem", marginBottom: "2rem" }}>
          Three packages. Simple pitch. You keep up to 20% of every sale.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              style={{
                background: pkg.featured ? "rgba(200,149,42,0.08)" : G.navy2,
                border: `1px solid ${pkg.featured ? G.gold : G.line}`,
                borderRadius: 12,
                padding: "1.5rem",
                position: "relative",
              }}
            >
              {pkg.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: G.gold,
                    color: "#07111F",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "0.25rem 0.85rem",
                    borderRadius: 999,
                  }}
                >
                  {pkg.tag}
                </div>
              )}
              {!pkg.featured && (
                <div style={{ fontSize: "0.65rem", color: G.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>{pkg.tag}</div>
              )}
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "#F2EEE4", marginBottom: 2 }}>{pkg.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: "1rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, color: G.goldL }}>{pkg.price}</span>
                <span style={{ fontSize: "0.8rem", color: G.muted }}>/ activation</span>
              </div>
              <div
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: 6,
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.8rem",
                  color: G.green,
                  marginBottom: "1.1rem",
                  fontWeight: 600,
                }}
              >
                You earn {pkg.commission}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {pkg.bullets.map((b) => (
                  <li key={b} style={{ fontSize: "0.82rem", color: G.muted, paddingLeft: "1.2rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: G.gold }}>✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section style={{ background: G.navy2, borderTop: `1px solid ${G.line}`, borderBottom: `1px solid ${G.line}`, padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "#F2EEE4", marginBottom: "0.5rem" }}>
            How It Works
          </h2>
          <p style={{ color: G.muted, fontSize: "0.9rem", marginBottom: "2.5rem" }}>Four steps. No inventory. No upfront cost.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1.5rem" }}>
            {[
              { n: "1", title: "Apply",  desc: "Fill out the form below. We'll review and onboard you same day." },
              { n: "2", title: "Pitch",  desc: "Walk into any local business with our one-page deck and 5-minute script." },
              { n: "3", title: "Close",  desc: "Submit the partner lead. We activate the listing on our end." },
              { n: "4", title: "Get Paid", desc: "Commission posted to your account once the client activates." },
            ].map((s) => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: G.gold,
                    color: "#07111F",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.75rem",
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontWeight: 600, color: "#F2EEE4", fontSize: "0.95rem", marginBottom: 6 }}>{s.title}</div>
                <div style={{ color: G.muted, fontSize: "0.8rem", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY FORM ─────────────────────────────────────────────────────── */}
      <section id="apply" style={{ maxWidth: 540, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "#F2EEE4", textAlign: "center", marginBottom: "0.5rem" }}>
          Apply to Join
        </h2>
        <p style={{ color: G.muted, fontSize: "0.9rem", textAlign: "center", marginBottom: "2rem" }}>
          Takes 2 minutes. We onboard same day.
        </p>

        {submitted ? (
          <div
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 12,
              padding: "2.5rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#F2EEE4", marginBottom: 8 }}>Application received!</div>
            <div style={{ color: G.muted, fontSize: "0.9rem", lineHeight: 1.7 }}>
              We&apos;ll contact you at <strong style={{ color: G.goldL }}>{form.email}</strong> within a few hours
              with your onboarding details and the sales deck.
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/sales-site/deck"
                style={{
                  fontSize: "0.8rem",
                  padding: "0.5rem 1.2rem",
                  borderRadius: 6,
                  border: `1px solid ${G.line}`,
                  color: G.goldL,
                  textDecoration: "none",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                View Sales Deck
              </Link>
              <Link
                href="/sales-site/faq"
                style={{
                  fontSize: "0.8rem",
                  padding: "0.5rem 1.2rem",
                  borderRadius: 6,
                  border: `1px solid ${G.line}`,
                  color: G.muted,
                  textDecoration: "none",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Sales FAQ
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={submit}
            style={{
              background: G.navy2,
              border: `1px solid ${G.line}`,
              borderRadius: 12,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {[
              { key: "name",  label: "Full Name",    type: "text",  placeholder: "Jane Smith" },
              { key: "email", label: "Email",         type: "email", placeholder: "jane@email.com" },
              { key: "phone", label: "Mobile Number", type: "tel",   placeholder: "+1 555 000 0000" },
              { key: "city",  label: "City / Region", type: "text",  placeholder: "Miami, FL" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: G.muted, marginBottom: 6 }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => set(f.key, e.target.value)}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${G.line}`,
                    borderRadius: 7,
                    padding: "0.65rem 0.9rem",
                    fontSize: "0.92rem",
                    color: "#F2EEE4",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: G.muted, marginBottom: 6 }}>
                Sales Experience
              </label>
              <select
                value={form.exp}
                onChange={(e) => set("exp", e.target.value)}
                style={{
                  width: "100%",
                  background: G.navy2,
                  border: `1px solid ${G.line}`,
                  borderRadius: 7,
                  padding: "0.65rem 0.9rem",
                  fontSize: "0.92rem",
                  color: form.exp ? "#F2EEE4" : G.muted,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select one</option>
                <option value="none">No experience — I&apos;ll learn</option>
                <option value="some">Some — I&apos;ve sold before</option>
                <option value="experienced">Experienced — I close deals regularly</option>
                <option value="team">I have a team</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!ready || busy}
              style={{
                marginTop: 8,
                padding: "0.85rem",
                background: ready ? G.gold : "rgba(200,149,42,0.3)",
                color: ready ? "#07111F" : G.muted,
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: ready ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              {busy ? "Sending…" : "Submit Application"}
            </button>
          </form>
        )}
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${G.line}`, padding: "1.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {[
            { label: "Sales Deck",  href: "/sales-site/deck" },
            { label: "FAQ",         href: "/sales-site/faq" },
            { label: "Packages",    href: "/sales-site/packages" },
            { label: "Full Portal", href: "/troptions" },
          ].map((l) => (
            <Link key={l.label} href={l.href} style={{ fontSize: "0.75rem", color: G.muted, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ fontSize: "0.72rem", color: "#3A3530" }}>© 2003–2026 TROPTIONS / UNYKORN</div>
      </footer>
    </main>
  );
}
