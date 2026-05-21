import { NextResponse } from "next/server";
import { INSIGHTS } from "@/content/troptions/insightsRegistry";

export async function GET() {
  const items = INSIGHTS.map(
    (insight) =>
      `  <item>
    <title><![CDATA[${insight.title}]]></title>
    <link>https://troptions.com/insights/${insight.slug}</link>
    <guid isPermaLink="true">https://troptions.com/insights/${insight.slug}</guid>
    <pubDate>${new Date(insight.date).toUTCString()}</pubDate>
    <description><![CDATA[${insight.summary}]]></description>
    <category><![CDATA[${insight.category}]]></category>
  </item>`
  ).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Troptions Insights</title>
    <link>https://troptions.com/insights</link>
    <description>Institutional infrastructure insights from Troptions.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
