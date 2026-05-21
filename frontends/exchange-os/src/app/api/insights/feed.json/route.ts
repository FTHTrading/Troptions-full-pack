import { NextResponse } from "next/server";
import { INSIGHTS, EDITORIAL_DISCLAIMER } from "@/content/troptions/insightsRegistry";

export async function GET() {
  return NextResponse.json({
    version: "https://jsonfeed.org/version/1.1",
    title: "Troptions Insights",
    description: "Institutional infrastructure insights from Troptions.",
    home_page_url: "https://troptions.com/insights",
    feed_url: "https://troptions.com/api/insights/feed.json",
    language: "en-US",
    disclaimer: EDITORIAL_DISCLAIMER,
    items: INSIGHTS.map((insight) => ({
      id: `https://troptions.com/insights/${insight.slug}`,
      url: `https://troptions.com/insights/${insight.slug}`,
      title: insight.title,
      summary: insight.summary,
      date_published: insight.date,
      tags: insight.tags,
      _troptions: { category: insight.category, readingTime: insight.readingTime },
    })),
  });
}
