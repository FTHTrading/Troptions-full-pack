/** Set at build time via next.config env (empty for local dev). */
export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

/**
 * Absolute path for plain `<a>`, `fetch`, and static assets on GitHub Pages.
 * Do not use with `next/link` or `next/image` — those apply `basePath` themselves.
 */
export function assetPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
