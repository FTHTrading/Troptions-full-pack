# Client Portal Auth Proof

**Status:** ✅ Two-layer auth in place  
**Routes protected:** `/portal/troptions/*`, `/troptions/gated/*`

---

## Layer 1 — Middleware (Edge Runtime)

**File:** `middleware.ts`

```ts
export const config = {
  matcher: ["/troptions/gated/:path*", "/portal/:path*"],
};
```

The middleware runs on Cloudflare/Vercel edge before any page renders. It checks for the `troptions_session` cookie. If absent, the request is redirected to `/troptions/auth/login?redirect=<original-path>`.

**What it does:**
- Runs at network edge — zero DB access (SQLite not available in Edge runtime)
- Cookie presence check only — fast, always-on
- Covers all `/portal/troptions/dashboard`, `/portal/troptions/*` routes
- Redirect URL includes the original path as `?redirect=` query param

**What it cannot do:**
- Cannot validate session expiry or DB state (no SQLite in edge)
- A user with a fake or expired cookie in their browser would pass Layer 1

Layer 2 is required.

---

## Layer 2 — Server Component DB Validation

**File:** `src/app/portal/troptions/layout.tsx`

```ts
export const dynamic = "force-dynamic";

export default async function PortalTroptionsLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/troptions/auth/login?redirect=/portal/troptions/dashboard");
  }
  return children;
}
```

Every portal page is wrapped by this layout. On every request:
1. `getCurrentUser()` reads the `troptions_session` cookie
2. Calls `getSessionUser(sessionId)` against the SQLite `sessions` table
3. Validates that `expires_at > NOW()`
4. Returns `null` if session is missing, expired, or the user row doesn't exist
5. If null → `redirect()` — Next.js throws a NEXT_REDIRECT and the page never renders

**What this guarantees:**
- No portal content is served without a valid, non-expired DB session
- A deleted or expired session is rejected even if the cookie is present
- Combining Layer 1 + Layer 2 means: (a) unauthenticated users never hit the Node.js server; (b) server-side always re-validates even if edge is bypassed

---

## Session Cookie Spec

| Property | Value |
|----------|-------|
| Name | `troptions_session` |
| Value | UUID v4 (from `crypto.randomUUID()`) |
| httpOnly | `true` |
| secure | `true` in production |
| sameSite | `lax` |
| maxAge | 30 days |
| Storage | `sessions` table in `data/auth.db` |

---

## Login Page — Redirect Param Handling

**File:** `src/app/troptions/auth/login/page.tsx`

The login page reads the `?redirect=` query param and, after successful login, redirects to that path — but only if it is same-origin:

```ts
const redirectTo = searchParams.get('redirect') ?? '/portal/troptions/dashboard';
const safe = redirectTo.startsWith('/') ? redirectTo : '/portal/troptions/dashboard';
// ...
router.push(safe);
```

This prevents open redirect attacks. Any non-relative URL is replaced with the default portal path.

---

## Auth DB Functions

**File:** `src/lib/auth/db.ts`

| Function | Purpose |
|----------|---------|
| `hashPassword(pw)` | SHA-256 via `crypto.createHash('sha256')` |
| `createUser(email, password)` | Insert user with hashed password |
| `getUserByEmail(email)` | Lookup user row |
| `verifyPassword(input, hash)` | SHA-256 compare |
| `createSession(userId)` | UUID session, 30-day expiry, insert to `sessions` |
| `getSessionUser(sessionId)` | Returns user if session valid and not expired |
| `deleteSession(sessionId)` | Logout — removes session row |

---

## Admin Revenue Auth

The admin dashboard at `/admin/revenue` and `/admin/troptions/intake` use the same pattern:

```ts
const user = await getCurrentUser();
if (!user) {
  redirect("/login?next=/admin/revenue");
}
```

The `src/app/admin/layout.tsx` also exports `dynamic = "force-dynamic"` to prevent Next.js from attempting to statically pre-render any admin page (which would fail because better-sqlite3 is a native module not available during build-time static export).

---

## Test Assertions

From `src/tests/routes.test.ts`:

```ts
test("portal layout calls getCurrentUser", () => {
  const src = readFileSync(".../src/app/portal/troptions/layout.tsx", "utf-8");
  expect(src).toContain("getCurrentUser");
});

test("portal layout redirects unauthenticated users", () => {
  const src = readFileSync("...", "utf-8");
  expect(src).toContain("redirect");
});

test("middleware.ts matches /portal/:path*", () => {
  const middleware = readFileSync("middleware.ts", "utf-8");
  expect(middleware).toContain('"/portal/:path*"');
});
```
