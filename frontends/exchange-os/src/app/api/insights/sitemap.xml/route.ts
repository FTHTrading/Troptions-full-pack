import { NextResponse } from "next/server";
import { INSIGHTS } from "@/content/troptions/insightsRegistry";

export async function GET() {
  const urls = INSIGHTS.map(
    (insight) =>
      `  <url>
    <loc>https://troptions.com/insights/${insight.slug}</loc>
    <lastmod>${insight.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  ).join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://troptions.com/insights</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${urls}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
