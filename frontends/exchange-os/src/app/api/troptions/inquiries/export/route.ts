import { NextResponse } from "next/server";
import { listInquiries } from "@/lib/troptions/revenue-db";
import { getCurrentUser } from "@/lib/auth/current-user";

// ─── GET /api/troptions/inquiries/export ──────────────────────────────────────
// Admin-only — returns all inquiries as a CSV file for CRM import
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const inquiries = listInquiries(2000, 0);

    const headers = [
      "id",
      "name",
      "email",
      "phone",
      "company",
      "website",
      "service_interest",
      "budget_range",
      "timeline",
      "message",
      "lead_score",
      "status",
      "source",
      "consent_given",
      "created_at",
    ];

    function escapeCsv(val: unknown): string {
      if (val == null) return "";
      const str = String(val);
      // Quote fields containing comma, newline, or double-quote
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    const rows = inquiries.map((inq) =>
      [
        inq.id,
        inq.name,
        inq.email,
        inq.phone ?? "",
        inq.company ?? "",
        inq.website ?? "",
        inq.serviceInterest ?? "",
        inq.budgetRange ?? "",
        inq.timeline ?? "",
        inq.message,
        inq.leadScore,
        inq.status,
        inq.source,
        inq.consentGiven ? "yes" : "no",
        inq.createdAt,
      ]
        .map(escapeCsv)
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\r\n");
    const filename = `troptions-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[inquiries/export GET]", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
