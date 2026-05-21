import { NextRequest, NextResponse } from "next/server";
import { createBookingRequest, listBookingRequests, getBookingSummary } from "@/lib/troptions/revenue-db";
import type { CallType } from "@/lib/troptions/revenue";
import { getCurrentUser } from "@/lib/auth/current-user";

// ─── POST /api/troptions/booking-requests ─────────────────────────────────────
// Public — accepts booking request submissions
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
  }

  try {
    const booking = createBookingRequest({
      name,
      email,
      company: typeof body.company === "string" ? body.company.trim() : undefined,
      preferredDate: typeof body.preferredDate === "string" ? body.preferredDate.trim() : undefined,
      preferredTime: typeof body.preferredTime === "string" ? body.preferredTime.trim() : undefined,
      timezone: typeof body.timezone === "string" ? body.timezone.trim() : undefined,
      callType: (body.callType as CallType) || "discovery",
      notes: typeof body.notes === "string" ? body.notes.trim() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        id: booking.id,
        message:
          "Your booking request has been received. The team will confirm your preferred time within 1 business day.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[booking-requests POST]", err);
    return NextResponse.json({ error: "Failed to save booking request. Please try again." }, { status: 500 });
  }
}

// ─── GET /api/troptions/booking-requests ──────────────────────────────────────
// Admin-only
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 500);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const bookings = listBookingRequests(limit, offset);
    const summary = getBookingSummary();
    return NextResponse.json({ bookings, summary });
  } catch (err) {
    console.error("[booking-requests GET]", err);
    return NextResponse.json({ error: "Failed to load booking requests" }, { status: 500 });
  }
}
