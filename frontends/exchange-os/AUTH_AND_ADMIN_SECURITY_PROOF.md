# Auth and Admin Security Proof

**Verification Date:** 2026-05-04  
**Environment:** Local production build — `http://localhost:3002`  

---

## Authentication Architecture

### Session Cookie Guard (Middleware)

`middleware.ts` runs at the Next.js Edge and intercepts requests to protected routes:

```typescript
// middleware.ts
export const config = {
  matcher: [
    "/troptions/gated/:path*",
    "/portal/:path*",
  ],
  runtime: "edge",  // Required for CF Workers
};
```

Requests without a valid `troptions_session` cookie are redirected to the login page with the original path preserved in `?redirect=`.

### Portal Layout Guard (Server Component)

`src/app/portal/troptions/layout.tsx` implements a secondary server-side guard:

```typescript
export const dynamic = "force-dynamic";
// ...
const user = await getCurrentUser();
if (!user) {
  redirect("/troptions/auth/login?redirect=/portal/troptions/dashboard");
}
```

This double-guard ensures protection even if middleware is bypassed.

### Admin Layout Guard (Server Component)

`src/app/admin/layout.tsx` uses `force-dynamic` to prevent build-time pre-rendering of DB-dependent admin pages.

### API Route Guards (Route Handlers)

Admin API endpoints individually call `getCurrentUser()` before serving data:

```typescript
// Pattern used in all admin GET endpoints
const user = await getCurrentUser();
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

## Verified Security Behaviors

### Protected Page Routes (No Cookie)

| Test | HTTP Result | Location Header |
|---|---|---|
| GET `/portal/troptions/dashboard` | **307 Temporary Redirect** | `/troptions/auth/login?redirect=/portal/troptions/dashboard` |
| GET `/admin/troptions/intake` | **307 Temporary Redirect** | `/login?next=/admin/troptions/intake` |

### Admin API Endpoints (No Cookie)

| Test | HTTP Result | Response Body |
|---|---|---|
| GET `/api/troptions/inquiries/export` | **401 Unauthorized** | `{"error":"Unauthorized"}` |
| GET `/api/troptions/cis-requests` | **401 Unauthorized** | `{"error":"Unauthorized"}` |
| GET `/api/troptions/inquiries` | **401 Unauthorized** | `{"error":"Unauthorized"}` |

### Public Form Endpoints (No Cookie Required)

| Test | HTTP Result | Notes |
|---|---|---|
| POST `/api/troptions/cis-requests` | **201 Created** | Consent + valid fields required |
| POST `/api/troptions/inquiries` | **201 Created** | Consent flag required |

Input validation is enforced at the route level — missing name, email, or consent returns 400.

---

## Security Notes

- **Password hashing:** SHA-256 via `crypto.createHash('sha256')` (no bcrypt dependency)
- **Session tokens:** Opaque cookie value `troptions_session`; checked for presence, not decoded in middleware
- **Consent enforcement:** All public intake forms validate `consentGiven === true` before writing to DB
- **Email validation:** Regex check `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` applied at route boundary

---

## Previous Issue: `src/proxy.ts`

A file `src/proxy.ts` was discovered that compiled as a `/_middleware` matching `/api/troptions/:path*`. This blocked all public form POSTs with a 401 response. The file has been **deleted** — per-route auth checks are sufficient and correctly scoped.
