"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        background: "#C9A84C",
        color: "#111",
        fontWeight: 700,
        fontSize: "0.82rem",
        padding: "0.6rem 1.4rem",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
        letterSpacing: "0.04em",
        textTransform: "uppercase" as const,
      }}
    >
      ↓ Download / Print PDF
    </button>
  );
}
