/** Set at build time via next.config env (empty for local dev). */
export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

/**
 * Absolute path for static assets, `fetch`, and plain `<a href>`.
 * Use with `next/image` `src` on GitHub Pages — static export does not prefix image URLs.
 * Do not use with `next/link` `href` — that already applies `basePath`.
 */
export function assetPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
