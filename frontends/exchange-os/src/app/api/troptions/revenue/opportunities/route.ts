import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listInquiries, listBookingRequests, getInquirySummary, getBookingSummary } from "@/lib/troptions/revenue-db";
import {
  calculateEstimatedOpportunityValue,
  getNextRecommendedAction,
  type RevenueOpportunity,
} from "@/lib/troptions/revenue";

// ─── GET /api/troptions/revenue/opportunities ─────────────────────────────────
// Admin-only — returns qualified opportunities from inquiries and bookings
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const inquiries = listInquiries(500, 0);
    const bookings = listBookingRequests(500, 0);
    const inquirySummary = getInquirySummary();
    const bookingSummary = getBookingSummary();

    const opportunities: RevenueOpportunity[] = inquiries.map((inq) => ({
      id: `opp-${inq.id}`,
      sourceType: "inquiry" as const,
      sourceId: inq.id,
      name: inq.name,
      company: inq.company,
      email: inq.email,
      serviceInterest: inq.serviceInterest,
      budgetRange: inq.budgetRange,
      estimatedValue: calculateEstimatedOpportunityValue(
        inq.budgetRange,
        inq.serviceInterest
      ),
      leadScore: inq.leadScore ?? 0,
      status: inq.status,
      recommendedAction: getNextRecommendedAction(inq),
      createdAt: inq.createdAt,
    }));

    const totalEstimatedValue = opportunities.reduce(
      (sum, opp) => sum + opp.estimatedValue,
      0
    );

    const byStatus = opportunities.reduce<Record<string, number>>((acc, opp) => {
      acc[opp.status] = (acc[opp.status] ?? 0) + 1;
      return acc;
    }, {});

    const byService = opportunities.reduce<Record<string, number>>((acc, opp) => {
      const key = opp.serviceInterest ?? "not_sure";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const byBudget = opportunities.reduce<Record<string, number>>((acc, opp) => {
      const key = opp.budgetRange ?? "not_specified";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      opportunities,
      summary: {
        totalInquiries: inquirySummary.total,
        newLeads: inquirySummary.newLeads,
        qualifiedLeads: inquirySummary.qualified,
        totalBookingRequests: bookingSummary.total,
        pendingBookings: bookingSummary.pending,
        totalEstimatedValue,
        byStatus,
        byService,
        byBudget,
      },
      bookings,
    });
  } catch (err) {
    console.error("[revenue/opportunities GET]", err);
    return NextResponse.json({ error: "Failed to load revenue data" }, { status: 500 });
  }
}
