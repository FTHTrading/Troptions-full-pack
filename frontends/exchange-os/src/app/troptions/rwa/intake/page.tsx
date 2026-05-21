"use client";

import { useState } from "react";
import Link from "next/link";

const G = {
  bg:     "#FFFFFF",
  bg2:    "#F8F7F4",
  border: "#D6D1C8",
  text:   "#1A1714",
  text2:  "#5C574F",
  text3:  "#8B857C",
  navy:   "#1B3259",
  gold:   "#7A5C14",
  green:  "#1A5233",
  red:    "#991B1B",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";
type Status = "idle" | "submitting" | "success" | "error";
type Step = 1 | 2 | 3 | 4;

export default function RwaIntakePage() {
  const [step, setStep]     = useState<Step>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError]   = useState("");
  const [rwaId, setRwaId]   = useState("");
  const [data, setData]     = useState<Record<string, string>>({
    entityType: "individual", custodyPreference: "troptions_custodian",
    settlementChain: "xrpl", hasExistingDocs: "no",
  });

  function update(k: string, v: string) {
    setData(prev => ({ ...prev, [k]: v }));
  }

  function next() { if (step < 4) setStep((step + 1) as Step); }
  function prev() { if (step > 1) setStep((step - 1) as Step); }

  async function submit() {
    if (!data.consent) { setError("You must consent to submit."); return; }
    setStatus("submitting");
    setError("");
    try {
      const body = {
        name:             data.name,
        email:            data.email,
        phone:            data.phone     || undefined,
        company:          data.company   || undefined,
        entityType:       data.entityType,
        assetClass:       data.assetClass,
        assetDescription: data.assetDescription,
        estimatedValue:   data.estimatedValue,
        jurisdiction:     data.jurisdiction,
        custodyPreference: data.custodyPreference,
        hasExistingDocs:  data.hasExistingDocs === "yes",
        docTypes:         data.docTypes        || undefined,
        settlementChain:  data.settlementChain,
        purpose:          data.purpose,
        timeline:         data.timeline        || undefined,
        notes:            data.notes           || undefined,
        consentGiven:     true,
      };
      const res  = await fetch("/api/troptions/rwa/intake", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Submission failed");
      setRwaId(json.rwaId);
      setStatus("success");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", border: `1px solid ${G.border}`, padding: "0.6rem 0.85rem",
    fontSize: "0.9rem", color: G.text, background: G.bg, outline: "none",
    borderRadius: 2, boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.75rem", textTransform: "uppercase",
    letterSpacing: "0.1em", color: G.text3, marginBottom: "0.35rem",
  };
  const F: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 0 };

  const STEPS = ["Entity Info", "Asset Details", "Settlement Preferences", "Review & Submit"];

  if (status === "success") {
    return (
      <div style={{ background: G.bg, minHeight: "100vh", padding: "5rem 2rem", fontFamily: "-apple-system,sans-serif" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", color: G.green, marginBottom: "1rem" }}>&#10003;</div>
          <h1 style={{ fontFamily: serif, fontSize: "1.6rem", color: G.navy, marginBottom: "0.75rem" }}>RWA Intake Recorded</h1>
          <p style={{ color: G.text2, marginBottom: "0.5rem" }}>Your RWA tokenization intake has been submitted to the TROPTIONS compliance and custody team.</p>
          <p style={{ fontFamily: "'Courier New',monospace", fontSize: "0.85rem", background: G.bg2, border: `1px solid ${G.border}`, padding: "0.6rem 1rem", display: "inline-block", marginBottom: "2rem", borderRadius: 2 }}>
            Reference: <strong>{rwaId}</strong>
          </p>
          <p style={{ color: G.text3, fontSize: "0.88rem", marginBottom: "2rem" }}>The TROPTIONS custody team will review your asset details, jurisdiction, and documentation. You will be contacted at the email provided to discuss next steps.</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/troptions/broker-dealer" style={{ background: G.navy, color: "#fff", padding: "0.7rem 1.75rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>Services Overview</Link>
            <Link href="/portal/troptions/dashboard" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.7rem 1.5rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>Client Portal</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: G.bg, minHeight: "100vh", color: G.text, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <nav style={{ borderBottom: `1px solid ${G.border}`, padding: "0 2rem", height: 58, display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link href="/troptions" style={{ fontFamily: serif, fontWeight: 700, color: G.navy, textDecoration: "none", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.9rem" }}>TROPTIONS</Link>
        <span style={{ color: G.border }}>›</span>
        <Link href="/troptions/broker-dealer" style={{ color: G.text2, fontSize: "0.85rem", textDecoration: "none" }}>Broker-Dealer</Link>
        <span style={{ color: G.border }}>›</span>
        <span style={{ color: G.text3, fontSize: "0.85rem" }}>RWA Intake</span>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 2rem" }}>
        <p style={{ fontFamily: serif, fontSize: "0.72rem", letterSpacing: "0.25em", color: G.gold, textTransform: "uppercase", marginBottom: "0.85rem" }}>
          Real-World Asset Tokenization
        </p>
        <h1 style={{ fontFamily: serif, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: G.navy, fontWeight: 400, marginBottom: "2.5rem", lineHeight: 1.25 }}>
          RWA Tokenization Intake
        </h1>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 0, marginBottom: "3rem", borderBottom: `1px solid ${G.border}` }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: "0.65rem 0.5rem", textAlign: "center", fontSize: "0.72rem",
              fontWeight: step === (i + 1) ? 700 : 400,
              color: step === (i + 1) ? G.navy : step > (i + 1) ? G.green : G.text3,
              borderBottom: step === (i + 1) ? `2px solid ${G.navy}` : step > (i + 1) ? `2px solid ${G.green}` : "2px solid transparent",
              textTransform: "uppercase", letterSpacing: "0.08em", transition: "all 0.2s",
            }}>
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {/* Step 1 — Entity Info */}
        {step === 1 && (
          <fieldset style={{ border: `1px solid ${G.border}`, padding: "1.5rem", margin: 0, borderRadius: 2 }}>
            <legend style={{ fontFamily: serif, fontSize: "0.82rem", padding: "0 0.5rem", color: G.navy }}>Entity Information</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={F}><label style={labelStyle}>Full Name *</label><input required style={inputStyle} value={data.name ?? ""} onChange={e => update("name", e.target.value)} placeholder="Legal name" /></div>
              <div style={F}><label style={labelStyle}>Email *</label><input type="email" required style={inputStyle} value={data.email ?? ""} onChange={e => update("email", e.target.value)} placeholder="you@company.com" /></div>
              <div style={F}><label style={labelStyle}>Phone</label><input style={inputStyle} value={data.phone ?? ""} onChange={e => update("phone", e.target.value)} placeholder="+1 (555) 000-0000" /></div>
              <div style={F}><label style={labelStyle}>Company / Entity</label><input style={inputStyle} value={data.company ?? ""} onChange={e => update("company", e.target.value)} placeholder="Legal entity name" /></div>
              <div style={F}>
                <label style={labelStyle}>Entity Type *</label>
                <select required style={inputStyle} value={data.entityType} onChange={e => update("entityType", e.target.value)}>
                  {["individual","corporation","llc","partnership","trust","fund","bank","other"].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
                </select>
              </div>
              <div style={F}><label style={labelStyle}>Jurisdiction *</label><input required style={inputStyle} value={data.jurisdiction ?? ""} onChange={e => update("jurisdiction", e.target.value)} placeholder="Country / State of incorporation" /></div>
            </div>
          </fieldset>
        )}

        {/* Step 2 — Asset Details */}
        {step === 2 && (
          <fieldset style={{ border: `1px solid ${G.border}`, padding: "1.5rem", margin: 0, borderRadius: 2 }}>
            <legend style={{ fontFamily: serif, fontSize: "0.82rem", padding: "0 0.5rem", color: G.navy }}>Asset Details</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={F}>
                <label style={labelStyle}>Asset Class *</label>
                <select required style={inputStyle} value={data.assetClass ?? ""} onChange={e => update("assetClass", e.target.value)}>
                  <option value="">Select…</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="gold">Gold / Precious Metals</option>
                  <option value="energy">Energy / Commodities</option>
                  <option value="carbon">Carbon Credits / RECs</option>
                  <option value="equities">Equities / Private Stock</option>
                  <option value="debt">Debt Instruments / Bonds</option>
                  <option value="sblc">SBLC / Banking Instrument</option>
                  <option value="intellectual_property">Intellectual Property</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={F}><label style={labelStyle}>Estimated Value *</label><input required style={inputStyle} value={data.estimatedValue ?? ""} onChange={e => update("estimatedValue", e.target.value)} placeholder="e.g. $25,000,000 USD" /></div>
              <div style={{ ...F, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Asset Description *</label>
                <textarea required rows={3} style={{ ...inputStyle, resize: "vertical" }} value={data.assetDescription ?? ""} onChange={e => update("assetDescription", e.target.value)} placeholder="Describe the asset in detail — type, location, ownership structure, encumbrances..." />
              </div>
              <div style={{ ...F, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Purpose of Tokenization *</label>
                <input required style={inputStyle} value={data.purpose ?? ""} onChange={e => update("purpose", e.target.value)} placeholder="e.g. Liquidity, fractionalization, on-chain settlement, collateral backing..." />
              </div>
              <div style={F}>
                <label style={labelStyle}>Existing Documentation?</label>
                <select style={inputStyle} value={data.hasExistingDocs} onChange={e => update("hasExistingDocs", e.target.value)}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {data.hasExistingDocs === "yes" && (
                <div style={F}><label style={labelStyle}>Document Types</label><input style={inputStyle} value={data.docTypes ?? ""} onChange={e => update("docTypes", e.target.value)} placeholder="e.g. Title deed, valuation report, SBLC, audited financials" /></div>
              )}
            </div>
          </fieldset>
        )}

        {/* Step 3 — Settlement Preferences */}
        {step === 3 && (
          <fieldset style={{ border: `1px solid ${G.border}`, padding: "1.5rem", margin: 0, borderRadius: 2 }}>
            <legend style={{ fontFamily: serif, fontSize: "0.82rem", padding: "0 0.5rem", color: G.navy }}>Settlement Preferences</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={F}>
                <label style={labelStyle}>Custody Preference *</label>
                <select style={inputStyle} value={data.custodyPreference} onChange={e => update("custodyPreference", e.target.value)}>
                  <option value="troptions_custodian">TROPTIONS Custodian</option>
                  <option value="self_custody">Self-Custody</option>
                  <option value="third_party">Third-Party Custodian</option>
                  <option value="undecided">Undecided</option>
                </select>
              </div>
              <div style={F}>
                <label style={labelStyle}>Settlement Chain *</label>
                <select style={inputStyle} value={data.settlementChain} onChange={e => update("settlementChain", e.target.value)}>
                  <option value="xrpl">XRPL (XRP Ledger)</option>
                  <option value="stellar">Stellar</option>
                  <option value="xrpl_stellar">XRPL + Stellar</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="undecided">Undecided</option>
                </select>
              </div>
              <div style={F}>
                <label style={labelStyle}>Timeline</label>
                <input style={inputStyle} value={data.timeline ?? ""} onChange={e => update("timeline", e.target.value)} placeholder="e.g. Immediate, Q3 2026, 90 days" />
              </div>
              <div style={{ ...F, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Additional Notes</label>
                <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={data.notes ?? ""} onChange={e => update("notes", e.target.value)} placeholder="Any additional context for the custody / settlement review..." />
              </div>
            </div>
          </fieldset>
        )}

        {/* Step 4 — Review & Submit */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ border: `1px solid ${G.border}`, padding: "1.5rem", borderRadius: 2 }}>
              <p style={{ fontFamily: serif, fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: G.text3, marginBottom: "1rem" }}>Review Summary</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <tbody>
                  {[
                    ["Name", data.name], ["Email", data.email], ["Entity Type", data.entityType],
                    ["Jurisdiction", data.jurisdiction], ["Asset Class", data.assetClass],
                    ["Estimated Value", data.estimatedValue], ["Settlement Chain", data.settlementChain],
                    ["Custody", data.custodyPreference],
                  ].map(([k, v]) => v ? (
                    <tr key={k} style={{ borderBottom: `1px solid ${G.border}` }}>
                      <td style={{ padding: "0.5rem 1rem 0.5rem 0", color: G.text3, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{k}</td>
                      <td style={{ padding: "0.5rem 0", color: G.text }}>{v}</td>
                    </tr>
                  ) : null)}
                </tbody>
              </table>
            </div>

            <div style={{ background: "rgba(122,92,20,0.06)", border: `1px solid rgba(122,92,20,0.25)`, borderRadius: 3, padding: "0.9rem 1.1rem" }}>
              <p style={{ fontSize: "0.8rem", color: G.gold, margin: 0, lineHeight: 1.65 }}>
                <strong>COMPLIANCE NOTICE:</strong> Submitting this form initiates a KYC/AML screening and custody review. Asset tokenization is subject to jurisdiction-specific legal, regulatory, and compliance review. TROPTIONS does not guarantee timeline or approval.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <input type="checkbox" id="consent" checked={data.consent === "yes"} onChange={e => update("consent", e.target.checked ? "yes" : "")} style={{ marginTop: "0.2rem", flexShrink: 0 }} />
              <label htmlFor="consent" style={{ fontSize: "0.85rem", color: G.text2, lineHeight: 1.6 }}>
                I confirm that the information provided is accurate. I consent to KYC/KYB and AML screening and understand this intake may be shared with compliance counterparties as required by law.
              </label>
            </div>

            {error && (
              <div style={{ background: "rgba(153,27,27,0.07)", border: `1px solid ${G.red}`, padding: "0.75rem 1rem", borderRadius: 2, color: G.red, fontSize: "0.87rem" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.5rem" }}>
          {step > 1 ? (
            <button onClick={prev} style={{ border: `1px solid ${G.border}`, background: G.bg, color: G.text2, padding: "0.7rem 1.75rem", fontSize: "0.88rem", cursor: "pointer", borderRadius: 3 }}>
              ← Back
            </button>
          ) : <div />}
          {step < 4 ? (
            <button onClick={next} style={{ background: G.navy, color: "#fff", border: "none", padding: "0.7rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", borderRadius: 3 }}>
              Continue →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={status === "submitting"}
              style={{ background: status === "submitting" ? "#9CA3AF" : G.navy, color: "#fff", border: "none", padding: "0.7rem 2rem", fontSize: "0.9rem", fontWeight: 600, cursor: status === "submitting" ? "not-allowed" : "pointer", borderRadius: 3 }}
            >
              {status === "submitting" ? "Submitting…" : "Submit RWA Intake"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
