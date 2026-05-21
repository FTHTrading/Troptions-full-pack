export const OPENCLAW_SITE_OPS_CHECKS = [
  "link check",
  "route check",
  "build check",
  "metadata check",
  "sitemap check",
  "llms.txt check",
  "media asset check",
  "narration check",
  "domain readiness check",
  "cloudflare deployment readiness check",
  "broken CTA report",
  "draft fix plan",
] as const;

export const OPENCLAW_SITE_OPS_BLOCKED = [
  "deploy production automatically",
  "rewrite production secrets",
  "delete files without approval",
  "change dns directly",
] as const;
